# Meli Hub CL — v1

Panel ejecutivo + integración **Mercado Libre Chile (MLC)**.

**Documentación completa:** [../docs/SETUP-v1.md](../docs/SETUP-v1.md)  
**Changelog v1:** [../docs/CHANGELOG-v1.md](../docs/CHANGELOG-v1.md)

---

## Levantar en 3 pasos

```bash
cd proyectos/web/meli-hub-cl/final
./scripts/bootstrap.sh          # deps + D1 + .dev.vars template
# Editar .dev.vars → pegar MELI_CLIENT_SECRET
./scripts/dev-env.sh            # wrangler + túnel (tmux)
```

| URL local | http://127.0.0.1:8787/admin |
|-----------|------------------------------|
| Health | http://127.0.0.1:8787/health |

Tras el túnel: actualizar **Redirect URI** y **Webhook** en [devcenter ML](https://developers.mercadolibre.cl/devcenter) y `MELI_REDIRECT_URI` en `.dev.vars`.

---

## Credenciales (referencia)

| Variable | Valor |
|----------|--------|
| `MELI_CLIENT_ID` | `202815009388102` |
| `MELI_CLIENT_SECRET` | devcenter → Secret Key (en `.dev.vars`) |
| Seller dev conectado | `3687363797` |

Plantilla: [../setup/credentials.env.template](../setup/credentials.env.template)

---

## Scripts npm

| Comando | Uso |
|---------|-----|
| `npm run dev` | Solo wrangler (sin túnel) |
| `npm run dev:agent` | `./scripts/dev-env.sh` |
| `npm run db:migrate` | Schema D1 local |
| `npm run deploy` | Producción Cloudflare |
| `npm test` | Tests vitest |

---

## API rápida

| Endpoint | Descripción |
|----------|-------------|
| `GET /oauth/meli/start` | Iniciar OAuth |
| `POST /webhooks/meli` | Webhooks ML |
| `POST /api/menu/upload` | Publicar menú JSON |
| `POST /api/dev/session` | Sesión panel dev |

Menú ejemplo: `public/fixtures/sample-menu.json`

---

## WIKA

Documentación del tenant: `../idea/` · Auditorías: `../audits/`
