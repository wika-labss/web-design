import type { Env } from "../env";
import { getMeliTokens, listItems, upsertItem } from "../db";
import { meliFetch, meliJson, MeliApiError } from "./client";

export interface ItemInput {
  title?: string;
  family_name?: string;
  category_id: string;
  price: number;
  available_quantity: number;
  condition: "new" | "used";
  listing_type_id?: string;
  pictures?: Array<{ source: string }>;
  attributes?: Array<{ id: string; value_name: string }>;
}

export interface MenuUploadItem extends ItemInput {
  sku?: string;
}

export interface MenuUploadResult {
  index: number;
  sku?: string;
  family_name?: string;
  ok: boolean;
  item_id?: string;
  errors?: unknown;
}

function buildItemPayload(env: Env, input: ItemInput) {
  const useUserProducts = Boolean(input.family_name);
  const payload: Record<string, unknown> = {
    site_id: env.MELI_SITE_ID,
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

  if (useUserProducts) {
    payload.family_name = input.family_name;
  } else if (input.title) {
    payload.title = input.title;
  }

  return payload;
}

function defaultFoodAttributes(name: string) {
  return [
    { id: "MANUFACTURER", value_name: "Meli Hub" },
    { id: "BRAND", value_name: "Genérica" },
    { id: "PRODUCT_NAME", value_name: name },
  ];
}

export function normalizeMenuItem(raw: MenuUploadItem, env: Env): ItemInput {
  const name = raw.family_name ?? raw.title ?? "Producto menú";
  return {
    family_name: raw.family_name ?? name,
    category_id: raw.category_id || "MLC1417",
    price: Number(raw.price),
    available_quantity: Number(raw.available_quantity ?? 1),
    condition: raw.condition ?? "new",
    listing_type_id: raw.listing_type_id,
    pictures: raw.pictures?.length
      ? raw.pictures
      : [
          {
            source:
              "https://http2.mlstatic.com/D_NQ_NP_2X_845183-MLA74385273994_012024-F.webp",
          },
        ],
    attributes: raw.attributes?.length ? raw.attributes : defaultFoodAttributes(name),
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
  try {
    const item = await meliJson<Record<string, unknown>>(env, tenantId, "/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await upsertItem(env.DB, tenantId, item);
    return { ok: true as const, item };
  } catch (err) {
    if (err instanceof MeliApiError) {
      return { ok: false as const, errors: err.body ?? err.message };
    }
    throw err;
  }
}

export async function uploadMenu(
  env: Env,
  tenantId: string,
  items: MenuUploadItem[]
): Promise<{ results: MenuUploadResult[]; published: number; failed: number }> {
  const results: MenuUploadResult[] = [];

  for (let index = 0; index < items.length; index++) {
    const raw = items[index];
    const normalized = normalizeMenuItem(raw, env);
    try {
      const result = await createItem(env, tenantId, normalized);
      if (result.ok) {
        results.push({
          index,
          sku: raw.sku,
          family_name: normalized.family_name,
          ok: true,
          item_id: String(result.item.id),
        });
      } else {
        results.push({
          index,
          sku: raw.sku,
          family_name: normalized.family_name,
          ok: false,
          errors: result.errors,
        });
      }
    } catch (err) {
      results.push({
        index,
        sku: raw.sku,
        family_name: normalized.family_name,
        ok: false,
        errors: err instanceof Error ? err.message : err,
      });
    }
  }

  return {
    results,
    published: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
  };
}

export async function updateItem(
  env: Env,
  tenantId: string,
  itemId: string,
  patch: Partial<ItemInput> & { status?: string }
) {
  const body: Record<string, unknown> = {};
  if (patch.title) body.title = patch.title;
  if (patch.family_name) body.family_name = patch.family_name;
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
