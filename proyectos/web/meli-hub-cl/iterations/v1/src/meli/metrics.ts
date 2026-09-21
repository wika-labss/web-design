import type { Env } from "../env";
import { getMeliTokens, getMetricsSummary, listItems, listOrders, upsertDailyMetrics } from "../db";
import { meliJson } from "./client";

export async function refreshMetrics(env: Env, tenantId: string) {
  const tokens = await getMeliTokens(env.DB, tenantId);
  if (!tokens) return getMetricsSummary(env.DB, tenantId);

  const today = new Date().toISOString().slice(0, 10);
  let totalVisits = 0;

  try {
    const visitsData = await meliJson<{ visits?: number }>(
      env,
      tenantId,
      `/users/${tokens.user_id}/items_visits?date_from=${today}&date_to=${today}`
    );
    totalVisits = Number(visitsData.visits ?? 0);
  } catch {
    const items = await listItems(env.DB, tenantId);
    for (const item of items.slice(0, 10)) {
      try {
        const row = item as { item_id: string };
        const v = await meliJson<{ total_visits?: number }>(
          env,
          tenantId,
          `/items/${row.item_id}/visits?date_from=${today}&date_to=${today}`
        );
        totalVisits += Number(v.total_visits ?? 0);
      } catch {
        /* skip item */
      }
    }
  }

  const orders = await listOrders(env.DB, tenantId);
  const ordersToday = orders.filter((o) => {
    const row = o as { updated_at: number };
    return row.updated_at > Date.now() - 86400_000;
  }).length;

  const items = await listItems(env.DB, tenantId);
  const activeItems = items.filter((i) => (i as { status: string }).status === "active").length;

  await upsertDailyMetrics(env.DB, tenantId, today, totalVisits, ordersToday, activeItems);
  return getMetricsSummary(env.DB, tenantId);
}

export async function getDashboardMetrics(env: Env, tenantId: string) {
  return getMetricsSummary(env.DB, tenantId);
}
