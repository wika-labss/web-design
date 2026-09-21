---
id: "WEB-MOD-MELI-001"
title: "Meli Hub CL — Descubrimiento de Módulos"
status: "BORRADOR"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
audit_1_passed: false
audit_2_passed: false
sku: "A"
sku_exception: "meli_ops_hub"
---

# [03] Descubrimiento y Especificación de Módulos — Meli Hub CL

> **Pre-requisito:** `audit_1_passed: true` en `01-problem.md` y `02-features.md`.  
> **SKU:** `A` + excepción `meli_ops_hub`.  
> `mod-admin` incluido (SKU A).

## 1. Identificación y Documentos Base

- **Nombre del Proyecto:** Meli Hub CL
- **Especificaciones base:** `01-problem.md` (`WEB-PROB-MELI-001`) | `02-features.md` (`WEB-FEAT-MELI-001`)
- **sku:** `A`
- **Estado de gatekeeping:** `PENDIENTE_AUDITORIA_MODULOS`

---

## 2. Matriz de Trazabilidad Modular (RTM 1:1)

| ID Módulo | ID Feature (`02`) | ID Problema (`01`) | Nombre | Tipo | Responsabilidad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `MOD-DIR` | N/A | N/A | Dirección visual | diseño | Estilo ejecutivo `minimalist-ui` |
| `MOD-01` | `FEAT-06` | `ERR-06` | `mod-meli-auth` | integración | OAuth PKCE, refresh, revocación |
| `MOD-02` | `FEAT-01` | `ERR-01` | `mod-meli-products` | integración | CRUD publicaciones ML + R2 |
| `MOD-03` | `FEAT-02` | `ERR-02` | `mod-meli-webhooks` | integración | Receptor webhook, cola, idempotencia |
| `MOD-04` | `FEAT-02` | `ERR-02` | `mod-meli-orders` | integración | Sync órdenes `orders_v2` |
| `MOD-05` | `FEAT-03` | `ERR-03` | `mod-meli-claims` | integración | Claims post-purchase |
| `MOD-06` | `FEAT-04` | `ERR-04` | `mod-meli-inbox` | integración | Preguntas y respuestas |
| `MOD-07` | `FEAT-05` | `ERR-05` | `mod-meli-metrics` | integración | Visitas, KPIs, agregados D1 |
| `MOD-08` | `FEAT-06` | `ERR-06` | `mod-admin` | cms | Magic link, sesión operador |
| `MOD-09` | `FEAT-05` | `ERR-05` | `mod-dashboard-ui` | sección | Vistas panel ejecutivo |

---

## 3. Desglose de Arquitectura Modular

### Módulo `MOD-01`: `mod-meli-auth`

**Ruta prevista:** `iterations/v1/src/meli/auth.ts`

#### Contrato

- **Entradas:** `code` OAuth, `code_verifier` PKCE, refresh token
- **Salidas:** Tokens en D1, redirect a dashboard
- **Dependencias:** D1 `meli_tokens`
- **Reutilizable:** No (específico tenant MLC)

---

### Módulo `MOD-02`: `mod-meli-products`

**Ruta prevista:** `iterations/v1/src/meli/products.ts`, `iterations/v1/src/routes/api.ts`

#### Contrato

- **Entradas:** Payload ítem (title, category_id, price CLP, pictures, attributes)
- **Salidas:** `item_id` ML, registro en `items_sync`
- **Dependencias:** `MOD-01`, R2, ML Items API
- **Reutilizable:** No

---

### Módulo `MOD-03`: `mod-meli-webhooks`

**Ruta prevista:** `iterations/v1/src/webhooks/handler.ts`

#### Contrato

- **Entradas:** POST ML `{ _id, topic, resource, user_id, ... }`
- **Salidas:** HTTP 200 inmediato; fila en `meli_notifications` status `pending`
- **Dependencias:** D1, queue processor
- **Reutilizable:** Parcial (patrón webhook genérico)

---

### Módulo `MOD-04`: `mod-meli-orders`

**Ruta prevista:** `iterations/v1/src/meli/orders.ts`

#### Contrato

- **Entradas:** `resource` de notificación orders_v2
- **Salidas:** Orden normalizada en `orders_cache`
- **Dependencias:** `MOD-01`, `MOD-03`
- **Reutilizable:** No

---

### Módulo `MOD-05`: `mod-meli-claims`

**Ruta prevista:** `iterations/v1/src/meli/claims.ts`

#### Contrato

- **Entradas:** Claim ID, acciones post-purchase
- **Salidas:** Lista/detalle claims en panel
- **Dependencias:** `MOD-01`, `MOD-03`
- **Reutilizable:** No

---

### Módulo `MOD-06`: `mod-meli-inbox`

**Ruta prevista:** `iterations/v1/src/meli/questions.ts`

#### Contrato

- **Entradas:** `item_id`, `question_id`, texto respuesta
- **Salidas:** Preguntas listadas, respuestas enviadas
- **Dependencias:** `MOD-01`
- **Reutilizable:** No

---

### Módulo `MOD-07`: `mod-meli-metrics`

**Ruta prevista:** `iterations/v1/src/meli/metrics.ts`

#### Contrato

- **Entradas:** `user_id`, rango fechas, item_ids
- **Salidas:** KPIs agregados (visitas, órdenes, conversión)
- **Dependencias:** `MOD-01`, `MOD-04`, ML Visits API
- **Reutilizable:** Parcial

---

### Módulo `MOD-08`: `mod-admin`

**Ruta prevista:** `iterations/v1/public/admin/index.html`, auth middleware

#### Contrato

- **Entradas:** Magic link token
- **Salidas:** Sesión operador en `/admin`
- **Dependencias:** D1 `admin_sessions`
- **Reutilizable:** Sí (patrón SKU A)

---

### Módulo `MOD-09`: `mod-dashboard-ui`

**Ruta prevista:** `iterations/v1/public/admin/index.html`, `assets/style.css`

#### Contrato

- **Entradas:** Datos API `/api/*`
- **Salidas:** Vistas resumen, catálogo, ventas, inbox, reclamos
- **Dependencias:** Todos los MOD-meli-*
- **Reutilizable:** No

---

## 4. Resolución de dirección visual (taste-skill) — MOD-DIR

```yaml
mod_id: MOD-DIR
industry_type: b2b_saas
business_model: b2b_saas_integracion
direction_skill: minimalist-ui
direction_rationale: "Panel ejecutivo tipo SaaS B2B: limpio, profesional, datos primero, sin ornamentación."
direction_locked: true
allowed_phase2_skills:
  - design-taste-frontend
  - redesign-existing-projects
forbidden_phase2_skills:
  - image-to-code
```

`direction_locked: true` al aprobar Gate 2. Cambiar de dirección exige reabrir auditoría de módulos.
