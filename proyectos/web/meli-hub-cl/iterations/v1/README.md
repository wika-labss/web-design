# Meli Hub CL — Iteración v1

Panel ejecutivo + integración Mercado Libre Chile (MLC).

## Requisitos

- Node.js 20+
- Cuenta Cloudflare (Workers + D1 + R2)
- App en [developers.mercadolibre.cl/devcenter](https://developers.mercadolibre.cl/devcenter)

## Setup local

```bash
cd proyectos/web/meli-hub-cl/iterations/v1
npm install
npm run db:migrate
```

## Secretos

```bash
wrangler secret put MELI_CLIENT_ID
wrangler secret put MELI_CLIENT_SECRET
wrangler secret put MELI_REDIRECT_URI
wrangler secret put SESSION_SECRET
```

## Desarrollo

```bash
npm run dev
```

- Landing: `http://localhost:8787/`
- Panel: `http://localhost:8787/admin`
- Webhook: `POST http://localhost:8787/webhooks/meli`
- OAuth start: `GET /oauth/meli/start`

## Configurar app ML

1. Redirect URI: `https://{tu-host}/oauth/meli/callback`
2. Webhook URL: `https://{tu-host}/webhooks/meli`
3. Topics: `orders_v2`, `items`, `questions`, `claims`

## Documentación WIKA

Ver `../../idea/01-problem.md` … `06-ml-api-contract.md`.

**Nota:** Flags `audit_*_passed` y `ready_for_construction` requieren aprobación del Arquitecto WIKA.
