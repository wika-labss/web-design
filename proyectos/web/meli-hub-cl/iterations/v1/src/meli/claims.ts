import type { Env } from "../env";
import { getMeliTokens, listClaims, upsertClaim } from "../db";
import { meliJson } from "./client";

export async function fetchAndCacheClaim(
  env: Env,
  tenantId: string,
  resource: string
): Promise<void> {
  const claim = await meliJson<Record<string, unknown>>(env, tenantId, resource);
  await upsertClaim(env.DB, tenantId, claim);
}

export async function syncClaimsFromMeli(env: Env, tenantId: string) {
  const tokens = await getMeliTokens(env.DB, tenantId);
  if (!tokens) return [];

  const data = await meliJson<{ data?: Array<Record<string, unknown>> }>(
    env,
    tenantId,
    `/post-purchase/v1/claims/search?seller_id=${tokens.user_id}&limit=50`
  );

  for (const claim of data.data ?? []) {
    await upsertClaim(env.DB, tenantId, claim);
  }
  return listClaims(env.DB, tenantId);
}

export async function getCachedClaims(env: Env, tenantId: string) {
  return listClaims(env.DB, tenantId);
}
