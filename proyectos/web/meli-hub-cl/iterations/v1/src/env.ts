export interface Env {
  DB: D1Database;
  ASSETS?: R2Bucket;
  ASSETS_STATIC: Fetcher;
  TENANT_ID: string;
  MELI_SITE_ID: string;
  MELI_CURRENCY_ID: string;
  MELI_AUTH_URL: string;
  MELI_API_BASE: string;
  MELI_CLIENT_ID: string;
  MELI_CLIENT_SECRET: string;
  MELI_REDIRECT_URI: string;
  SESSION_SECRET: string;
  ADMIN_EMAIL?: string;
}

export const DEFAULT_TENANT = "meli-hub-cl";
