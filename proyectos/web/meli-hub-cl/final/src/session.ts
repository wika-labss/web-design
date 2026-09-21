import type { Env } from "./env";
import { createAdminSession, getAdminSession } from "./db";

const SESSION_COOKIE = "meli_hub_session";

export async function requireAdminSession(
  request: Request,
  env: Env
): Promise<{ email: string; tenant_id: string } | Response> {
  const sessionId = getCookie(request, SESSION_COOKIE);
  if (!sessionId) {
    return json({ error: "unauthorized" }, 401);
  }
  const session = await getAdminSession(env.DB, sessionId);
  if (!session) {
    return json({ error: "session_expired" }, 401);
  }
  return session;
}

export async function createDevSession(env: Env, tenantId: string): Promise<Response> {
  const email = env.ADMIN_EMAIL ?? "admin@meli-hub.local";
  const sessionId = await createAdminSession(env.DB, tenantId, email);
  return new Response(JSON.stringify({ ok: true, session_id: sessionId }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${SESSION_COOKIE}=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
    },
  });
}

export function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
