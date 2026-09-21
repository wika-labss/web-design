---
id: "WEB-ML-CONTRACT-001"
title: "Meli Hub CL — Contrato API Mercado Libre"
status: "BORRADOR"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
site_id: "MLC"
currency_id: "CLP"
auth_domain: "auth.mercadolibre.cl"
api_base: "https://api.mercadolibre.com"
---

# [06] Contrato interno — Integración Mercado Libre Chile

> Documentación oficial: [developers.mercadolibre.cl](https://developers.mercadolibre.cl/)  
> Este documento mapea features WIKA → endpoints ML para el tenant `meli-hub-cl`.

## 1. Identidad regional

| Campo | Valor |
|-------|--------|
| `site_id` | `MLC` |
| `currency_id` | `CLP` |
| Auth URL | `https://auth.mercadolibre.cl/authorization` |
| Token URL | `https://api.mercadolibre.com/oauth/token` |
| API base | `https://api.mercadolibre.com` |

## 2. OAuth 2.0 (Authorization Code + PKCE)

### Scopes requeridos

`offline_access read write`

### Flujo

1. `GET /oauth/meli/start` — genera `code_verifier`, `code_challenge` (S256), guarda en cookie/D1, redirect a ML.
2. `GET /oauth/meli/callback?code=...&state=...` — intercambia code por tokens.
3. `POST /oauth/token` body: `grant_type=authorization_code`, `client_id`, `client_secret`, `code`, `redirect_uri`, `code_verifier`.
4. Refresh: `grant_type=refresh_token` antes de expiración (6 h).

### Errores a manejar

| Código | Acción |
|--------|--------|
| `invalid_grant` | Forzar re-OAuth en panel |
| `invalid_operator_user_id` | Mostrar error: usar cuenta admin seller |
| `429 local_rate_limited` | Backoff exponencial |
| `403 forbidden` | Verificar scopes / IP |

## 3. Tabla endpoint → feature

| Feature | Método | Endpoint ML | Notas |
|---------|--------|-------------|-------|
| FEAT-01 validate | POST | `/items/validate` | Body con `site_id: MLC` |
| FEAT-01 create | POST | `/items` | Tras validate OK |
| FEAT-01 update | PUT | `/items/{item_id}` | Precio, stock, status |
| FEAT-01 list | GET | `/users/{user_id}/items/search` | Paginado |
| FEAT-02 webhook | POST | *(callback propio)* | ML → `/webhooks/meli` |
| FEAT-02 order detail | GET | `{resource}` de notificación | ej. `/orders/{id}` |
| FEAT-02 missed | GET | `/missed_feeds?app_id=&topic=` | Recuperación |
| FEAT-03 claims list | GET | `/post-purchase/v1/claims/search` | Seller claims |
| FEAT-03 claim detail | GET | `/post-purchase/v1/claims/{id}` | |
| FEAT-03 claim messages | GET/POST | `/post-purchase/v1/claims/{id}/...` | Según acción |
| FEAT-04 questions | GET | `/questions/search?seller_id=` | `api_version=4` |
| FEAT-04 answer | POST | `/answers` | `question_id`, `text` |
| FEAT-05 visits | GET | `/items/{id}/visits` | Métricas por ítem |
| FEAT-05 user items visits | GET | `/users/{user_id}/items_visits` | Agregado |
| FEAT-06 me | GET | `/users/me` | Verificar conexión |

## 4. Webhooks

### URL callback tenant

`https://{tenant_host}/webhooks/meli`

### Topics suscritos (app ML)

| Topic | Uso |
|-------|-----|
| `orders_v2` | Ventas confirmadas |
| `items` | Cambios publicaciones |
| `questions` | Preguntas compradores |
| `claims` | Reclamos post-compra |

### Payload ejemplo

```json
{
  "_id": "abc123",
  "resource": "/orders/2195160686",
  "user_id": 123456789,
  "topic": "orders_v2",
  "application_id": 123456,
  "attempts": 1,
  "sent": "2026-09-21T12:00:00.000Z",
  "received": "2026-09-21T12:00:00.001Z"
}
```

### Contrato receptor

1. Responder **HTTP 200** en ≤500 ms (cuerpo vacío o `{"ok":true}`).
2. Insertar en `meli_notifications` con `status=pending`, unique `_id`.
3. Procesador async: GET `{api_base}{resource}` con token seller.
4. Actualizar entidad cache (`orders_cache`, `items_sync`, etc.).
5. Marcar notificación `status=processed` o `failed`.

### Idempotencia

Clave: columna `notification_id` (= `_id` ML). Duplicados ignorados.

## 5. Esquema D1

```sql
-- meli_tokens: un registro activo por tenant
CREATE TABLE meli_tokens (
  tenant_id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE meli_notifications (
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
CREATE INDEX idx_notifications_status ON meli_notifications(status, created_at);

CREATE TABLE items_sync (
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

CREATE TABLE orders_cache (
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

CREATE TABLE claims_cache (
  claim_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  status TEXT,
  type TEXT,
  resource_id TEXT,
  payload TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE questions_cache (
  question_id INTEGER PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  item_id TEXT,
  status TEXT,
  text TEXT,
  answer_text TEXT,
  payload TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE metrics_daily (
  tenant_id TEXT NOT NULL,
  metric_date TEXT NOT NULL,
  visits INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  active_items INTEGER DEFAULT 0,
  PRIMARY KEY (tenant_id, metric_date)
);

CREATE TABLE admin_sessions (
  session_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE oauth_pkce (
  state TEXT PRIMARY KEY,
  code_verifier TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
```

**Retención:** notificaciones processed > 90 días → purge job. Cache órdenes/claims: 1 año.

## 6. Secretos (Workers)

| Secret | Uso |
|--------|-----|
| `MELI_CLIENT_ID` | App ID ML |
| `MELI_CLIENT_SECRET` | Secret ML |
| `SESSION_SECRET` | Firmar cookies sesión admin |
| `TENANT_ID` | Default `meli-hub-cl` (multi-tenant futuro) |
| `MELI_REDIRECT_URI` | URI estática registrada en app ML |

**Nunca** commitear secretos. Usar `wrangler secret put`.

## 7. Rate limits y backoff

- Ante `429` o `local_rate_limited`: esperar `Retry-After` o backoff 2^n seg (max 60 s).
- Batch sync: máx 10 req/s por tenant.
- Webhook processor: procesar cola en lotes de 20.

## 8. User Products (nota 2026)

Mercado Libre migra hacia User Products; el campo `title` puede dejar de enviarse en algunas categorías/fechas. Siempre validar con `POST /items/validate` antes de publicar. Monitorear changelog en developers.mercadolibre.cl.

## 9. Referencias oficiales

- [Autenticación y Autorización](https://developers.mercadolibre.cl/es_ar/autenticacion-y-autorizacion)
- [Publicar productos](https://developers.mercadolibre.cl/es_ar/publica-productos)
- [Notificaciones](https://developers.mercadolibre.cl/es_ar/productos-recibe-notificaciones)
- [Claims post-purchase](https://developers.mercadolibre.com.ar/en_us/en_us/working-with-claims)
- [Questions](https://developers.mercadolibre.com.ni/en_us/visits-resource/questions)
