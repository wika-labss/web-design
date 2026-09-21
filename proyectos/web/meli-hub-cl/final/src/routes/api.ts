import type { Env } from "../env";
import { getConnectionStatus } from "../meli/auth";
import { getCachedClaims, syncClaimsFromMeli } from "../meli/claims";
import { getDashboardMetrics, refreshMetrics } from "../meli/metrics";
import {
  createItem,
  getCachedItems,
  syncItemsFromMeli,
  updateItem,
  uploadMenu,
  validateItem,
  type ItemInput,
  type MenuUploadItem,
} from "../meli/products";
import { answerQuestion, getCachedQuestions, syncQuestionsFromMeli } from "../meli/questions";
import { getCachedOrders, syncMissedFeeds } from "../meli/orders";
import { processPendingQueue } from "../webhooks/handler";
import { json, requireAdminSession } from "../session";

export async function handleApi(
  request: Request,
  env: Env,
  tenantId: string,
  path: string
): Promise<Response> {
  const auth = await requireAdminSession(request, env);
  if (auth instanceof Response) return auth;

  if (path === "/api/status" && request.method === "GET") {
    const meli = await getConnectionStatus(env, tenantId);
    return json({ tenant_id: tenantId, meli, operator: auth.email });
  }

  if (path === "/api/metrics" && request.method === "GET") {
    const refresh = new URL(request.url).searchParams.get("refresh") === "1";
    const metrics = refresh
      ? await refreshMetrics(env, tenantId)
      : await getDashboardMetrics(env, tenantId);
    return json(metrics);
  }

  if (path === "/api/items" && request.method === "GET") {
    const sync = new URL(request.url).searchParams.get("sync") === "1";
    const items = sync ? await syncItemsFromMeli(env, tenantId) : await getCachedItems(env, tenantId);
    return json({ items });
  }

  if (path === "/api/items/validate" && request.method === "POST") {
    const body = (await request.json()) as ItemInput;
    const result = await validateItem(env, tenantId, body);
    return json(result, result.valid ? 200 : 422);
  }

  if (path === "/api/items" && request.method === "POST") {
    const body = (await request.json()) as ItemInput;
    const result = await createItem(env, tenantId, body);
    return json(result, result.ok ? 201 : 422);
  }

  if (path === "/api/menu/upload" && request.method === "POST") {
    const body = (await request.json()) as { items?: MenuUploadItem[] };
    const items = body.items ?? [];
    if (!items.length) {
      return json({ error: "items_required" }, 400);
    }
    const result = await uploadMenu(env, tenantId, items);
    return json(result, result.failed === items.length ? 422 : 200);
  }

  const itemMatch = path.match(/^\/api\/items\/([^/]+)$/);
  if (itemMatch && request.method === "PUT") {
    const body = (await request.json()) as Partial<ItemInput> & { status?: string };
    const item = await updateItem(env, tenantId, itemMatch[1], body);
    return json({ item });
  }

  if (path === "/api/orders" && request.method === "GET") {
    const orders = await getCachedOrders(env, tenantId);
    return json({ orders });
  }

  if (path === "/api/orders/sync-missed" && request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { topic?: string };
    const topic = body.topic ?? "orders_v2";
    const messages = await syncMissedFeeds(env, tenantId, topic);
    return json({ messages });
  }

  if (path === "/api/claims" && request.method === "GET") {
    const sync = new URL(request.url).searchParams.get("sync") === "1";
    const claims = sync ? await syncClaimsFromMeli(env, tenantId) : await getCachedClaims(env, tenantId);
    return json({ claims });
  }

  if (path === "/api/questions" && request.method === "GET") {
    const sync = new URL(request.url).searchParams.get("sync") === "1";
    const questions = sync
      ? await syncQuestionsFromMeli(env, tenantId)
      : await getCachedQuestions(env, tenantId);
    return json({ questions });
  }

  if (path === "/api/questions/answer" && request.method === "POST") {
    const body = (await request.json()) as { question_id: number; text: string };
    const question = await answerQuestion(env, tenantId, body.question_id, body.text);
    return json({ question });
  }

  if (path === "/api/webhooks/process" && request.method === "POST") {
    const processed = await processPendingQueue(env, tenantId);
    return json({ processed });
  }

  return json({ error: "not_found" }, 404);
}
