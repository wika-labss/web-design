# Entorno de desarrollo — Agente

Generado automáticamente. El túnel trycloudflare cambia al reiniciar.

## URLs activas

| Servicio | URL |
|----------|-----|
| Local | http://127.0.0.1:8787 |
| Panel | http://127.0.0.1:8787/admin |
| Público (túnel) | https://prospect-names-its-auction.trycloudflare.com |
| OAuth callback | https://prospect-names-its-auction.trycloudflare.com/oauth/meli/callback |
| Webhook ML | https://prospect-names-its-auction.trycloudflare.com/webhooks/meli |
| Health | https://prospect-names-its-auction.trycloudflare.com/health |

## Tmux

- `meli-dev-server` — `wrangler dev --ip 0.0.0.0 --port 8787`
- `meli-tunnel` — `cloudflared tunnel --url http://127.0.0.1:8787`

## Arrancar / reiniciar

```bash
cd proyectos/web/meli-hub-cl/final
./scripts/dev-env.sh
```

## Mercado Libre devcenter

Configurar en la app ML (Chile):

1. **Redirect URI:** URL OAuth callback de arriba
2. **Webhook:** URL webhook de arriba
3. **Topics:** `orders_v2`, `items`, `questions`, `claims`

Luego actualizar en `.dev.vars`:

- `MELI_CLIENT_ID`
- `MELI_CLIENT_SECRET`

Reiniciar `meli-dev-server` tras cambiar `.dev.vars`.
