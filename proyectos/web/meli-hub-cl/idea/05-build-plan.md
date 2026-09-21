---
id: "WEB-BUILD-MELI-001"
title: "Meli Hub CL — Plan de Construcción"
status: "APROBADO"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
audit_1_passed: true
audit_2_passed: true
visual_approval_passed: true
audit_3_passed: true
ready_for_construction: true
sku: "A"
cms: true
sku_exception: "meli_ops_hub"
---

# [05] Plan de Construcción — Meli Hub CL

> **Bloqueo:** Si `ready_for_construction: false`, queda prohibido HTML de producción fuera de `iterations/v1/` de desarrollo documentado.  
> **Contrato ML:** `idea/06-ml-api-contract.md`

## 1. SKU

| Campo | Valor |
|-------|--------|
| `sku` | `A` |
| `cms` | `true` |
| `admin_path` | `/admin` |
| `sku_exception` | `meli_ops_hub` |
| `sku_rationale` | Panel /admin con magic link; operador gestiona integración ML con frecuencia |

---

## 2. Stack canónico

| Capa | Servicio | ¿Este tenant lo usa? |
|------|----------|----------------------|
| Compute + SSL | Workers Paid + Cloudflare for SaaS | Sí |
| Datos | D1 (tokens, cache, notificaciones, métricas) | Sí |
| Fotos | R2 (staging imágenes → ML pictures) | Sí |
| Auth | Magic link (`/admin`) + OAuth ML | Sí |
| Mail | Resend / CF Email (magic link) | Sí |
| Origen | `meli-hub-cl.tuapp.cl` → custom hostname | Sí |
| CI | GitHub + wrangler | Sí |

**Prohibido v1:** WordPress, Vercel, VPS, repo por cliente.

---

## 3. Dependencias

### Plataforma

- [x] Wrangler 3.x + TypeScript
- [x] Binding D1 (`meli_hub_db`)
- [x] Binding R2 (`meli_hub_assets`) — opcional v1 local URL
- [x] Workers secrets: `MELI_CLIENT_ID`, `MELI_CLIENT_SECRET`, `SESSION_SECRET`

### Integración Mercado Libre (MLC)

- [x] App en [developers.mercadolibre.cl/devcenter](https://developers.mercadolibre.cl/devcenter)
- [x] Redirect URI estática: `https://{tenant}/oauth/meli/callback`
- [x] Webhook URL: `https://{tenant}/webhooks/meli`
- [x] Topics: `orders_v2`, `items`, `questions`, `claims`

### SKU A

- [x] `/admin` + magic link
- [x] Schema panel fijo: resumen, catálogo, ventas, inbox, reclamos, conexión
- [x] Un operador por tenant

---

## 4. Hoja de ruta de la instancia

| Paso | Módulo | ID Feature | Qué hacer | Estado |
| :--- | :--- | :--- | :--- | :--- |
| `01` | `global` | N/A | Documentación 01–06 + excepción SKU | `COMPLETADO` |
| `02` | `mod-meli-auth` | `FEAT-06` | OAuth PKCE + refresh tokens D1 | `COMPLETADO` |
| `03` | `mod-meli-webhooks` | `FEAT-02` | Webhook 200 + cola async | `COMPLETADO` |
| `04` | `mod-meli-products` | `FEAT-01` | Validate + POST/PUT items | `COMPLETADO` |
| `05` | `mod-meli-orders` | `FEAT-02` | Sync orders_v2 | `COMPLETADO` |
| `06` | `mod-meli-claims` | `FEAT-03` | Claims post-purchase | `COMPLETADO` |
| `07` | `mod-meli-inbox` | `FEAT-04` | Questions + answers | `COMPLETADO` |
| `08` | `mod-meli-metrics` | `FEAT-05` | KPIs dashboard | `COMPLETADO` |
| `09` | `mod-dashboard-ui` | `FEAT-05` | HTML semántico + Fase 2 CSS | `COMPLETADO` |
| `10` | `global` | N/A | DNS custom si aplica | `PENDIENTE` |

---

## 5. Fuera de alcance (`forbidden_v1`)

- Checkout / pagos propios
- Login compradores finales
- Catálogo público masivo en sitio WIKA
- Multi-país (solo MLC)
- WordPress, Vercel, VPS, repo por cliente

---

## 6. Verificación de pre-requisitos

- [x] Auditoría Documentación: `audit_1_passed == true` (incluye excepción SKU)
- [x] Auditoría Módulos: `audit_2_passed == true`
- [x] Aprobación visual: `visual_approval_passed == true`
- [x] Auditoría Ensamblado: `audit_3_passed == true`
- [x] Stack = `sku-contract.yaml` + `06-ml-api-contract.md`

`ready_for_construction: true` — activado por arquitecto (2026-09-21).
