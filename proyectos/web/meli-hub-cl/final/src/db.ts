import type { Env } from "./env";

export interface MeliTokenRow {
  tenant_id: string;
  user_id: number;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  updated_at: number;
}

export interface NotificationRow {
  notification_id: string;
  tenant_id: string;
  topic: string;
  resource: string;
  user_id: number | null;
  payload: string;
  status: string;
  error: string | null;
  created_at: number;
  processed_at: number | null;
}

export async function getMeliTokens(db: D1Database, tenantId: string): Promise<MeliTokenRow | null> {
  return db
    .prepare("SELECT * FROM meli_tokens WHERE tenant_id = ?")
    .bind(tenantId)
    .first<MeliTokenRow>();
}

export async function saveMeliTokens(
  db: D1Database,
  tenantId: string,
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number
): Promise<void> {
  const now = Date.now();
  const expiresAt = now + expiresInSeconds * 1000;
  await db
    .prepare(
      `INSERT INTO meli_tokens (tenant_id, user_id, access_token, refresh_token, expires_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(tenant_id) DO UPDATE SET
         user_id = excluded.user_id,
         access_token = excluded.access_token,
         refresh_token = excluded.refresh_token,
         expires_at = excluded.expires_at,
         updated_at = excluded.updated_at`
    )
    .bind(tenantId, userId, accessToken, refreshToken, expiresAt, now)
    .run();
}

export async function savePkceState(
  db: D1Database,
  state: string,
  codeVerifier: string,
  tenantId: string,
  ttlMs = 600_000
): Promise<void> {
  const expiresAt = Date.now() + ttlMs;
  await db
    .prepare(
      "INSERT INTO oauth_pkce (state, code_verifier, tenant_id, expires_at) VALUES (?, ?, ?, ?)"
    )
    .bind(state, codeVerifier, tenantId, expiresAt)
    .run();
}

export async function consumePkceState(
  db: D1Database,
  state: string
): Promise<{ code_verifier: string; tenant_id: string } | null> {
  const row = await db
    .prepare("SELECT code_verifier, tenant_id, expires_at FROM oauth_pkce WHERE state = ?")
    .bind(state)
    .first<{ code_verifier: string; tenant_id: string; expires_at: number }>();
  if (!row || row.expires_at < Date.now()) return null;
  await db.prepare("DELETE FROM oauth_pkce WHERE state = ?").bind(state).run();
  return { code_verifier: row.code_verifier, tenant_id: row.tenant_id };
}

export async function enqueueNotification(
  db: D1Database,
  tenantId: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  const notificationId = String(payload._id ?? crypto.randomUUID());
  const topic = String(payload.topic ?? "unknown");
  const resource = String(payload.resource ?? "");
  const userId = payload.user_id != null ? Number(payload.user_id) : null;
  const now = Date.now();

  const result = await db
    .prepare(
      `INSERT OR IGNORE INTO meli_notifications
       (notification_id, tenant_id, topic, resource, user_id, payload, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
    )
    .bind(notificationId, tenantId, topic, resource, userId, JSON.stringify(payload), now)
    .run();

  return (result.meta.changes ?? 0) > 0;
}

export async function getPendingNotifications(
  db: D1Database,
  tenantId: string,
  limit = 20
): Promise<NotificationRow[]> {
  const { results } = await db
    .prepare(
      `SELECT * FROM meli_notifications
       WHERE tenant_id = ? AND status = 'pending'
       ORDER BY created_at ASC LIMIT ?`
    )
    .bind(tenantId, limit)
    .all<NotificationRow>();
  return results ?? [];
}

export async function markNotificationProcessed(
  db: D1Database,
  notificationId: string,
  status: "processed" | "failed",
  error?: string
): Promise<void> {
  await db
    .prepare(
      "UPDATE meli_notifications SET status = ?, error = ?, processed_at = ? WHERE notification_id = ?"
    )
    .bind(status, error ?? null, Date.now(), notificationId)
    .run();
}

export async function upsertItem(
  db: D1Database,
  tenantId: string,
  item: Record<string, unknown>
): Promise<void> {
  const itemId = String(item.id);
  await db
    .prepare(
      `INSERT INTO items_sync (item_id, tenant_id, title, price, currency_id, available_quantity, status, permalink, payload, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(item_id) DO UPDATE SET
         title = excluded.title,
         price = excluded.price,
         available_quantity = excluded.available_quantity,
         status = excluded.status,
         permalink = excluded.permalink,
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
    .bind(
      itemId,
      tenantId,
      String(item.title ?? ""),
      Number(item.price ?? 0),
      String(item.currency_id ?? "CLP"),
      Number(item.available_quantity ?? 0),
      String(item.status ?? ""),
      String(item.permalink ?? ""),
      JSON.stringify(item),
      Date.now()
    )
    .run();
}

export async function upsertOrder(
  db: D1Database,
  tenantId: string,
  order: Record<string, unknown>
): Promise<void> {
  const orderId = String(order.id);
  const buyer = order.buyer as Record<string, unknown> | undefined;
  const payments = order.payments as Array<Record<string, unknown>> | undefined;
  const total = payments?.[0]?.total_paid_amount ?? order.total_amount ?? 0;

  await db
    .prepare(
      `INSERT INTO orders_cache (order_id, tenant_id, status, total_amount, currency_id, buyer_nickname, payload, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(order_id) DO UPDATE SET
         status = excluded.status,
         total_amount = excluded.total_amount,
         buyer_nickname = excluded.buyer_nickname,
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
    .bind(
      orderId,
      tenantId,
      String(order.status ?? ""),
      Number(total),
      String(order.currency_id ?? "CLP"),
      String(buyer?.nickname ?? ""),
      JSON.stringify(order),
      Date.now(),
      Date.now()
    )
    .run();
}

export async function upsertClaim(
  db: D1Database,
  tenantId: string,
  claim: Record<string, unknown>
): Promise<void> {
  const claimId = String(claim.id);
  await db
    .prepare(
      `INSERT INTO claims_cache (claim_id, tenant_id, status, type, resource_id, payload, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(claim_id) DO UPDATE SET
         status = excluded.status,
         type = excluded.type,
         resource_id = excluded.resource_id,
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
    .bind(
      claimId,
      tenantId,
      String(claim.status ?? ""),
      String(claim.type ?? ""),
      String(claim.resource_id ?? ""),
      JSON.stringify(claim),
      Date.now()
    )
    .run();
}

export async function upsertQuestion(
  db: D1Database,
  tenantId: string,
  question: Record<string, unknown>
): Promise<void> {
  const questionId = Number(question.id);
  const answer = question.answer as Record<string, unknown> | undefined;
  await db
    .prepare(
      `INSERT INTO questions_cache (question_id, tenant_id, item_id, status, text, answer_text, payload, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(question_id) DO UPDATE SET
         status = excluded.status,
         text = excluded.text,
         answer_text = excluded.answer_text,
         payload = excluded.payload,
         updated_at = excluded.updated_at`
    )
    .bind(
      questionId,
      tenantId,
      String(question.item_id ?? ""),
      String(question.status ?? ""),
      String(question.text ?? ""),
      String(answer?.text ?? ""),
      JSON.stringify(question),
      Date.now()
    )
    .run();
}

export async function listItems(db: D1Database, tenantId: string) {
  const { results } = await db
    .prepare("SELECT * FROM items_sync WHERE tenant_id = ? ORDER BY updated_at DESC LIMIT 100")
    .bind(tenantId)
    .all();
  return results ?? [];
}

export async function listOrders(db: D1Database, tenantId: string) {
  const { results } = await db
    .prepare("SELECT * FROM orders_cache WHERE tenant_id = ? ORDER BY updated_at DESC LIMIT 50")
    .bind(tenantId)
    .all();
  return results ?? [];
}

export async function listClaims(db: D1Database, tenantId: string) {
  const { results } = await db
    .prepare("SELECT * FROM claims_cache WHERE tenant_id = ? ORDER BY updated_at DESC LIMIT 50")
    .bind(tenantId)
    .all();
  return results ?? [];
}

export async function listQuestions(db: D1Database, tenantId: string) {
  const { results } = await db
    .prepare("SELECT * FROM questions_cache WHERE tenant_id = ? ORDER BY updated_at DESC LIMIT 50")
    .bind(tenantId)
    .all();
  return results ?? [];
}

export async function upsertDailyMetrics(
  db: D1Database,
  tenantId: string,
  date: string,
  visits: number,
  orders: number,
  activeItems: number
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO metrics_daily (tenant_id, metric_date, visits, orders, active_items)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(tenant_id, metric_date) DO UPDATE SET
         visits = excluded.visits,
         orders = excluded.orders,
         active_items = excluded.active_items`
    )
    .bind(tenantId, date, visits, orders, activeItems)
    .run();
}

export async function getMetricsSummary(db: D1Database, tenantId: string) {
  const items = await db
    .prepare("SELECT COUNT(*) as count FROM items_sync WHERE tenant_id = ? AND status = 'active'")
    .bind(tenantId)
    .first<{ count: number }>();

  const orders7d = await db
    .prepare(
      `SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total
       FROM orders_cache WHERE tenant_id = ? AND updated_at > ?`
    )
    .bind(tenantId, Date.now() - 7 * 86400_000)
    .first<{ count: number; total: number }>();

  const metrics = await db
    .prepare(
      `SELECT COALESCE(SUM(visits), 0) as visits, COALESCE(SUM(orders), 0) as orders
       FROM metrics_daily WHERE tenant_id = ? AND metric_date >= date('now', '-7 days')`
    )
    .bind(tenantId)
    .first<{ visits: number; orders: number }>();

  const pendingQuestions = await db
    .prepare(
      "SELECT COUNT(*) as count FROM questions_cache WHERE tenant_id = ? AND status = 'UNANSWERED'"
    )
    .bind(tenantId)
    .first<{ count: number }>();

  const openClaims = await db
    .prepare(
      "SELECT COUNT(*) as count FROM claims_cache WHERE tenant_id = ? AND status NOT IN ('closed', 'cancelled')"
    )
    .bind(tenantId)
    .first<{ count: number }>();

  const visits = metrics?.visits ?? 0;
  const orderCount = orders7d?.count ?? 0;
  const conversion = visits > 0 ? ((orderCount / visits) * 100).toFixed(2) : "0.00";

  return {
    active_items: items?.count ?? 0,
    orders_7d: orderCount,
    revenue_7d: orders7d?.total ?? 0,
    visits_7d: visits,
    conversion_pct: conversion,
    pending_questions: pendingQuestions?.count ?? 0,
    open_claims: openClaims?.count ?? 0,
  };
}

export async function createAdminSession(
  db: D1Database,
  tenantId: string,
  email: string,
  ttlMs = 86400_000
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const now = Date.now();
  await db
    .prepare(
      "INSERT INTO admin_sessions (session_id, tenant_id, email, expires_at, created_at) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(sessionId, tenantId, email, now + ttlMs, now)
    .run();
  return sessionId;
}

export async function getAdminSession(
  db: D1Database,
  sessionId: string
): Promise<{ email: string; tenant_id: string } | null> {
  const row = await db
    .prepare("SELECT email, tenant_id, expires_at FROM admin_sessions WHERE session_id = ?")
    .bind(sessionId)
    .first<{ email: string; tenant_id: string; expires_at: number }>();
  if (!row || row.expires_at < Date.now()) return null;
  return { email: row.email, tenant_id: row.tenant_id };
}
