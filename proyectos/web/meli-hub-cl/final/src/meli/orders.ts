import type { Env } from "../env";
import { listOrders, upsertOrder } from "../db";
import { meliJson } from "./client";

export async function fetchAndCacheOrder(
  env: Env,
  tenantId: string,
  resource: string
): Promise<void> {
  const order = await meliJson<Record<string, unknown>>(env, tenantId, resource);
  await upsertOrder(env.DB, tenantId, order);
}

export async function getCachedOrders(env: Env, tenantId: string) {
  return listOrders(env.DB, tenantId);
}

export async function syncMissedFeeds(env: Env, tenantId: string, topic: string) {
  const data = await meliJson<{ messages?: Array<Record<string, unknown>> }>(
    env,
    tenantId,
    `/missed_feeds?app_id=${env.MELI_CLIENT_ID}&topic=${encodeURIComponent(topic)}`
  );
  return data.messages ?? [];
}
