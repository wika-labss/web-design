# Changelog — Meli Hub CL v1

**Fecha release:** 2026-09-21  
**Estado:** Aprobado (`audits/auditoria-release-v1.md`)  
**Artefacto:** `final/` + `iterations/v1/`

---

## v1.0.0 — Panel ejecutivo + integración MLC

### Documentación WIKA

- Idea 01–06 con excepción SKU `meli_ops_hub`
- Gates 1–3B y release v1 aprobados
- Contrato API interno Mercado Libre Chile

### Backend (Cloudflare Worker + D1)

- OAuth 2.0 PKCE (`auth.mercadolibre.cl`)
- Webhooks `orders_v2`, `items`, `questions`, `claims`
- CRUD publicaciones (User Products / `family_name`)
- Subida de menú en lote (`POST /api/menu/upload`)
- Sync órdenes, preguntas, claims, métricas
- Upload imágenes vía ML `POST /pictures`

### Frontend

- Panel `/admin` estilo minimalist-ui ejecutivo
- Vistas: resumen, catálogo, ventas, inbox, reclamos, conexión
- Formulario menú JSON + menú ejemplo

### DevOps agente

- `scripts/bootstrap.sh` — deps + D1 + credenciales
- `scripts/dev-env.sh` — wrangler + túnel cloudflared (tmux)
- `.dev.vars.example` + `setup/credentials.env.template`

### Credenciales de referencia (no secretas)

| Campo | Valor |
|-------|--------|
| App ID | `202815009388102` |
| Seller conectado (dev) | `3687363797` |
| Site | `MLC` |

### Known limitations v1

- Un operador por tenant (magic link / sesión dev)
- Solo Chile (MLC), no multi-país
- Túnel trycloudflare cambia URL al reiniciar
- Ítems de test deben pausarse manualmente en ML
