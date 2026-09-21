CREATE TABLE IF NOT EXISTS meli_tokens (
  tenant_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS meli_notifications (
  notification_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  resource TEXT NOT NULL,
  user_id INTEGER,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at INTEGER NOT NULL,
  processed_at INTEGER
);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON meli_notifications(status, created_at);

CREATE TABLE IF NOT EXISTS items_sync (
  item_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  title TEXT,
  price REAL,
  currency_id TEXT DEFAULT 'CLP',
  available_quantity INTEGER,
  status TEXT,
  permalink TEXT,
  payload TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS orders_cache (
  order_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  status TEXT,
  total_amount REAL,
  currency_id TEXT DEFAULT 'CLP',
  buyer_nickname TEXT,
  payload TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS claims_cache (
  claim_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  status TEXT,
  type TEXT,
  resource_id TEXT,
  payload TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS questions_cache (
  question_id INTEGER PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT,
  status TEXT,
  text TEXT,
  answer_text TEXT,
  payload TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS metrics_daily (
  tenant_id TEXT NOT NULL,
  metric_date TEXT NOT NULL,
  visits INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  active_items INTEGER DEFAULT 0,
  PRIMARY KEY (tenant_id, metric_date)
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS oauth_pkce (
  state TEXT PRIMARY KEY,
  code_verifier TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
