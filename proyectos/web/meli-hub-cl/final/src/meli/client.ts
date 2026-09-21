import type { Env } from "../env";
import { getMeliTokens, saveMeliTokens } from "../db";

export class MeliApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
  }
}

export async function meliFetch(
  env: Env,
  tenantId: string,
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = await getValidAccessToken(env, tenantId);
  const url = path.startsWith("http") ? path : `${env.MELI_API_BASE}${path}`;
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    await refreshAccessToken(env, tenantId);
    const newToken = await getValidAccessToken(env, tenantId);
    headers.set("Authorization", `Bearer ${newToken}`);
    response = await fetch(url, { ...init, headers });
  }

  return response;
}

export async function meliJson<T>(
  env: Env,
  tenantId: string,
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const response = await meliFetch(env, tenantId, path, init);
  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }
  if (!response.ok) {
    throw new MeliApiError(`ML API ${response.status}: ${path}`, response.status, body);
  }
  return body as T;
}

async function getValidAccessToken(env: Env, tenantId: string): Promise<string> {
  const row = await getMeliTokens(env.DB, tenantId);
  if (!row) throw new MeliApiError("Mercado Libre no conectado", 401);
  if (row.expires_at - 60_000 > Date.now()) return row.access_token;
  await refreshAccessToken(env, tenantId);
  const refreshed = await getMeliTokens(env.DB, tenantId);
  if (!refreshed) throw new MeliApiError("No se pudo refrescar token", 401);
  return refreshed.access_token;
}

export async function refreshAccessToken(env: Env, tenantId: string): Promise<void> {
  const row = await getMeliTokens(env.DB, tenantId);
  if (!row) throw new MeliApiError("Sin tokens para refresh", 401);

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env.MELI_CLIENT_ID,
    client_secret: env.MELI_CLIENT_SECRET,
    refresh_token: row.refresh_token,
  });

  const response = await fetch(`${env.MELI_API_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body,
  });

  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok) {
    throw new MeliApiError("Refresh token falló", response.status, data);
  }

  await saveMeliTokens(
    env.DB,
    tenantId,
    Number(data.user_id ?? row.user_id),
    String(data.access_token),
    String(data.refresh_token),
    Number(data.expires_in ?? 21600)
  );
}

export function generatePkce(): { verifier: string } {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  return { verifier };
}

async function base64UrlSha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64Url(new Uint8Array(hash));
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function buildPkceChallenge(verifier: string): Promise<string> {
  return base64UrlSha256(verifier);
}
