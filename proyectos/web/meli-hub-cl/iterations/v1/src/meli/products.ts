import type { Env } from "../env";
import { getMeliTokens, listItems, upsertItem } from "../db";
import { meliFetch, meliJson } from "./client";

export interface ItemInput {
  title: string;
  category_id: string;
  price: number;
  available_quantity: number;
  condition: "new" | "used";
  listing_type_id?: string;
  pictures?: Array<{ source: string }>;
  attributes?: Array<{ id: string; value_name: string }>;
}

function buildItemPayload(env: Env, input: ItemInput) {
  return {
    title: input.title,
    category_id: input.category_id,
    price: input.price,
    currency_id: env.MELI_CURRENCY_ID,
    available_quantity: input.available_quantity,
    buying_mode: "buy_it_now",
    listing_type_id: input.listing_type_id ?? "gold_special",
    condition: input.condition,
    pictures: input.pictures ?? [],
    attributes: input.attributes ?? [],
  };
}

export async function validateItem(env: Env, tenantId: string, input: ItemInput) {
  const payload = buildItemPayload(env, input);
  const response = await meliFetch(env, tenantId, "/items/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (response.status === 204) return { valid: true, errors: [] };
  const body = await response.json().catch(() => ({}));
  return { valid: false, errors: body };
}

export async function createItem(env: Env, tenantId: string, input: ItemInput) {
  const validation = await validateItem(env, tenantId, input);
  if (!validation.valid) {
    return { ok: false as const, errors: validation.errors };
  }

  const payload = buildItemPayload(env, input);
  const item = await meliJson<Record<string, unknown>>(env, tenantId, "/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await upsertItem(env.DB, tenantId, item);
  return { ok: true as const, item };
}

export async function updateItem(
  env: Env,
  tenantId: string,
  itemId: string,
  patch: Partial<ItemInput> & { status?: string }
) {
  const body: Record<string, unknown> = {};
  if (patch.title) body.title = patch.title;
  if (patch.price != null) body.price = patch.price;
  if (patch.available_quantity != null) body.available_quantity = patch.available_quantity;
  if (patch.status) body.status = patch.status;

  const item = await meliJson<Record<string, unknown>>(env, tenantId, `/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  await upsertItem(env.DB, tenantId, item);
  return item;
}

export async function syncItemsFromMeli(env: Env, tenantId: string) {
  const tokens = await getMeliTokens(env.DB, tenantId);
  if (!tokens) return [];

  const data = await meliJson<{ results?: string[] }>(
    env,
    tenantId,
    `/users/${tokens.user_id}/items/search?status=active&limit=50`
  );

  const itemIds = data.results ?? [];
  for (const itemId of itemIds) {
    const item = await meliJson<Record<string, unknown>>(env, tenantId, `/items/${itemId}`);
    await upsertItem(env.DB, tenantId, item);
  }
  return listItems(env.DB, tenantId);
}

export async function getCachedItems(env: Env, tenantId: string) {
  return listItems(env.DB, tenantId);
}

export async function uploadPictureToR2(
  env: Env,
  file: File
): Promise<{ source: string } | null> {
  if (!env.ASSETS) return null;
  const key = `pictures/${crypto.randomUUID()}-${file.name}`;
  await env.ASSETS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });
  return { source: `r2://${key}` };
}
