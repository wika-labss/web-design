import type { Env } from "../env";
import {
  enqueueNotification,
  getPendingNotifications,
  markNotificationProcessed,
} from "../db";
import { fetchAndCacheClaim } from "../meli/claims";
import { meliJson } from "../meli/client";
import { fetchAndCacheOrder } from "../meli/orders";
import { upsertItem, upsertQuestion } from "../db";

export async function handleWebhook(
  request: Request,
  env: Env,
  tenantId: string,
  ctx: ExecutionContext
): Promise<Response> {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const inserted = await enqueueNotification(env.DB, tenantId, payload);

  if (inserted && payload.resource) {
    ctx.waitUntil(processNotification(env, tenantId, payload).catch(() => undefined));
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function processNotification(
  env: Env,
  tenantId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const notificationId = String(payload._id ?? "");
  const topic = String(payload.topic ?? "");
  const resource = String(payload.resource ?? "");

  try {
    if (topic === "orders_v2" || topic === "orders") {
      await fetchAndCacheOrder(env, tenantId, resource);
    } else if (topic === "items") {
      const item = await meliJson<Record<string, unknown>>(env, tenantId, resource);
      await upsertItem(env.DB, tenantId, item);
    } else if (topic === "questions") {
      const question = await meliJson<Record<string, unknown>>(env, tenantId, resource);
      await upsertQuestion(env.DB, tenantId, question);
    } else if (topic === "claims") {
      await fetchAndCacheClaim(env, tenantId, resource);
    }

    if (notificationId) {
      await markNotificationProcessed(env.DB, notificationId, "processed");
    }
  } catch (err) {
    if (notificationId) {
      await markNotificationProcessed(
        env.DB,
        notificationId,
        "failed",
        err instanceof Error ? err.message : "unknown"
      );
    }
  }
}

export async function processPendingQueue(env: Env, tenantId: string): Promise<number> {
  const pending = await getPendingNotifications(env.DB, tenantId);
  for (const row of pending) {
    const payload = JSON.parse(row.payload) as Record<string, unknown>;
    await processNotification(env, tenantId, payload);
  }
  return pending.length;
}
