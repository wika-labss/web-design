import type { Env } from "./env";
import { handleOAuthCallback, startOAuth } from "./meli/auth";
import { handleApi } from "./routes/api";
import { createDevSession, json } from "./session";
import { handleWebhook } from "./webhooks/handler";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const tenantId = env.TENANT_ID ?? "meli-hub-cl";

    if (url.pathname === "/webhooks/meli" && request.method === "POST") {
      return handleWebhook(request, env, tenantId, ctx);
    }

    if (url.pathname === "/oauth/meli/start" && request.method === "GET") {
      return startOAuth(env, tenantId, url.origin);
    }

    if (url.pathname === "/oauth/meli/callback" && request.method === "GET") {
      return handleOAuthCallback(env, url);
    }

    if (url.pathname === "/api/dev/session" && request.method === "POST") {
      return createDevSession(env, tenantId);
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, tenantId, url.pathname);
    }

    if (url.pathname === "/health") {
      return json({ ok: true, tenant: tenantId, site: env.MELI_SITE_ID });
    }

    return env.ASSETS_STATIC.fetch(request);
  },
};
