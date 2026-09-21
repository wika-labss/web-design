import type { Env } from "../env";
import { consumePkceState, saveMeliTokens, savePkceState } from "../db";
import { buildPkceChallenge, generatePkce } from "./client";

function adminRedirect(url: URL, query: string): Response {
  return Response.redirect(`${url.origin}/admin?${query}`, 302);
}

export async function startOAuth(env: Env, tenantId: string, origin: string): Promise<Response> {
  const state = crypto.randomUUID();
  const { verifier } = generatePkce();
  const challenge = await buildPkceChallenge(verifier);

  await savePkceState(env.DB, state, verifier, tenantId);

  const redirectUri = env.MELI_REDIRECT_URI || `${origin}/oauth/meli/callback`;
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.MELI_CLIENT_ID,
    redirect_uri: redirectUri,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });

  const authUrl = `${env.MELI_AUTH_URL}?${params.toString()}`;
  return Response.redirect(authUrl, 302);
}

export async function handleOAuthCallback(
  env: Env,
  url: URL
): Promise<Response> {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return adminRedirect(url, `oauth_error=${encodeURIComponent(error)}`);
  }
  if (!code || !state) {
    return adminRedirect(url, "oauth_error=missing_code");
  }

  const pkce = await consumePkceState(env.DB, state);
  if (!pkce) {
    return adminRedirect(url, "oauth_error=invalid_state");
  }

  const redirectUri = env.MELI_REDIRECT_URI || `${url.origin}/oauth/meli/callback`;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: env.MELI_CLIENT_ID,
    client_secret: env.MELI_CLIENT_SECRET,
    code,
    redirect_uri: redirectUri,
    code_verifier: pkce.code_verifier,
  });

  const tokenResponse = await fetch(`${env.MELI_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });

  const data = (await tokenResponse.json()) as Record<string, unknown>;
  if (!tokenResponse.ok) {
    const msg = String(data.error ?? "token_exchange_failed");
    return adminRedirect(url, `oauth_error=${encodeURIComponent(msg)}`);
  }

  await saveMeliTokens(
    env.DB,
    pkce.tenant_id,
    Number(data.user_id),
    String(data.access_token),
    String(data.refresh_token),
    Number(data.expires_in ?? 21600)
  );

  return adminRedirect(url, "oauth=connected");
}

export async function getConnectionStatus(env: Env, tenantId: string) {
  const row = await env.DB.prepare(
    "SELECT user_id, expires_at, updated_at FROM meli_tokens WHERE tenant_id = ?"
  )
    .bind(tenantId)
    .first<{ user_id: number; expires_at: number; updated_at: number }>();

  if (!row) {
    return { connected: false, user_id: null, expires_at: null };
  }

  return {
    connected: row.expires_at > Date.now(),
    user_id: row.user_id,
    expires_at: row.expires_at,
    updated_at: row.updated_at,
  };
}
