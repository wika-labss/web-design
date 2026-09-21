# Meli Hub CL — Setup v1 (runbook)

Guía para levantar el tenant en **otro momento** (agente local, túnel dev o producción Cloudflare).

**Release:** v1 · **Site:** MLC (Chile) · **Seller de prueba:** `3687363797`

---

## 1. Requisitos

| Requisito | Versión / nota |
|-----------|----------------|
| Node.js | 20+ |
| npm | 9+ |
| Cuenta Cloudflare | Workers + D1 (R2 opcional v1) |
| App Mercado Libre | [devcenter Chile](https://developers.mercadolibre.cl/devcenter) |
| Cuenta seller ML | Admin (no colaborador) con dirección completa |

---

## 2. Ruta del código

```text
proyectos/web/meli-hub-cl/
├── docs/           ← este runbook
├── idea/           ← documentación WIKA 01–06
├── audits/         ← gates aprobados
├── final/          ← **artefacto v1 listo para deploy**
├── iterations/v1/  ← misma base que final
└── setup/          ← plantillas de credenciales
```

**Usar `final/`** como directorio de trabajo para levantar el servicio.

---

## 3. Credenciales (Mercado Libre)

### App registrada (Chile)

| Variable | Valor | Dónde obtenerlo |
|----------|--------|-----------------|
| `MELI_CLIENT_ID` | `202815009388102` | [devcenter](https://developers.mercadolibre.cl/devcenter) → tu app |
| `MELI_CLIENT_SECRET` | *(secreto)* | devcenter → Secret Key (**no commitear**) |
| Seller ID conectado | `3687363797` | Panel → Conexión, tras OAuth |

### Crear archivo local de secretos

```bash
cd proyectos/web/meli-hub-cl/final
cp ../setup/credentials.env.template .dev.vars
# Editar .dev.vars y pegar MELI_CLIENT_SECRET real
```

Contenido mínimo de `.dev.vars` (gitignored):

```env
SESSION_SECRET=dev-meli-hub-cl-agent-session-secret-2026
MELI_CLIENT_ID=202815009388102
MELI_CLIENT_SECRET=<PEGAR_SECRET_DEVCENTER>
MELI_REDIRECT_URI=https://<TU-HOST-PUBLICO>/oauth/meli/callback
ADMIN_EMAIL=admin@meli-hub.local
```

> **Seguridad:** `.dev.vars` nunca va al repositorio. Si el secret se filtró, regenerarlo en devcenter.

---

## 4. Configuración en Mercado Libre devcenter

App **202815009388102** — campos que deben coincidir **exactamente** con tu host público:

| Campo ML | Path en la app |
|----------|----------------|
| **Redirect URI** | `https://{HOST}/oauth/meli/callback` |
| **Notificaciones callbacks URL** | `https://{HOST}/webhooks/meli` |

**Topics:** `orders_v2`, `items`, `questions`, `claims`

### Desarrollo con túnel (trycloudflare)

La URL cambia cada vez que reinicias cloudflared. Tras `./scripts/dev-env.sh`:

1. Copiar URL pública del output (o `DEV-ENV.md`)
2. Actualizar Redirect URI + Webhook en devcenter
3. Actualizar `MELI_REDIRECT_URI` en `.dev.vars`
4. Reiniciar sesión tmux `meli-dev-server`

### Producción (Workers)

Tras `npm run deploy`, usar el host `*.workers.dev` o dominio custom:

```env
MELI_REDIRECT_URI=https://meli-hub-cl.<cuenta>.workers.dev/oauth/meli/callback
```

---

## 5. Levantar entorno (desarrollo / agente)

### Opción A — Script automático (recomendado)

```bash
cd proyectos/web/meli-hub-cl/final
./scripts/bootstrap.sh      # npm install + D1 local + .dev.vars si falta
./scripts/dev-env.sh        # wrangler + túnel cloudflared en tmux
```

Sesiones tmux:

| Sesión | Proceso |
|--------|---------|
| `meli-dev-server` | `wrangler dev --ip 0.0.0.0 --port 8787` |
| `meli-tunnel` | `cloudflared tunnel --url http://127.0.0.1:8787` |

### Opción B — Manual

```bash
cd proyectos/web/meli-hub-cl/final
npm install
npm run db:migrate
npx wrangler dev --ip 0.0.0.0 --port 8787
# otra terminal:
cloudflared tunnel --url http://127.0.0.1:8787
```

### Verificar

```bash
curl http://127.0.0.1:8787/health
# → {"ok":true,"tenant":"meli-hub-cl","site":"MLC"}
```

Panel: `http://127.0.0.1:8787/admin` → **Sesión dev** → **Conectar Mercado Libre**

---

## 6. Deploy producción (Cloudflare)

```bash
cd proyectos/web/meli-hub-cl/final

# 1. Crear D1 remota (solo primera vez)
npx wrangler d1 create meli_hub_db
# Copiar database_id a wrangler.toml

# 2. Migrar schema remoto
npx wrangler d1 execute meli_hub_db --remote --file=./schema.sql

# 3. Secretos remotos
npx wrangler secret put MELI_CLIENT_ID      # 202815009388102
npx wrangler secret put MELI_CLIENT_SECRET
npx wrangler secret put MELI_REDIRECT_URI
npx wrangler secret put SESSION_SECRET

# 4. Deploy
npm run deploy
```

Actualizar devcenter ML con URLs del host desplegado.

---

## 7. Funcionalidades v1

| Módulo | Ruta / API |
|--------|------------|
| Panel ejecutivo | `/admin` |
| OAuth ML | `GET /oauth/meli/start` |
| Webhooks | `POST /webhooks/meli` |
| Catálogo sync | `GET /api/items?sync=1` |
| Publicar ítem | `POST /api/items` |
| **Subir menú (lote)** | `POST /api/menu/upload` |
| Métricas | `GET /api/metrics?refresh=1` |
| Órdenes / inbox / claims | `/api/orders`, `/api/questions`, `/api/claims` |

### Menú de ejemplo

```bash
curl -X POST http://127.0.0.1:8787/api/dev/session
# usar cookie meli_hub_session

curl -X POST http://127.0.0.1:8787/api/menu/upload \
  -H "Content-Type: application/json" \
  -b "meli_hub_session=..." \
  -d @public/fixtures/sample-menu.json
```

Categoría alimentos MLC por defecto: `MLC1417`. Precio mínimo ~650 CLP.

---

## 8. Tokens OAuth en D1 local

Los tokens ML se guardan en D1 local (`.wrangler/state/`). Si cambias de máquina o borras state:

1. Volver a **Conectar Mercado Libre** en `/admin`
2. O restaurar backup de `.wrangler/state/v3/d1/`

---

## 9. Troubleshooting

| Síntoma | Causa | Acción |
|---------|--------|--------|
| HTTP 422 menú | Imagen inválida / validate estricto | Ya corregido en v1: sube fotos vía `/pictures` |
| `seller.unable_to_list` + `address_pending` | Dirección seller incompleta | Completar en Mercado Libre |
| `invalid_operator_user_id` | OAuth con colaborador | Usar cuenta admin seller |
| OAuth redirect error | Redirect URI distinta a devcenter | Deben ser idénticas |
| Webhook no llega | URL túnel cambió | Actualizar devcenter + reiniciar |
| Catálogo vacío | Sin ítems `active` en ML | Publicar menú o sync tras publicar |

---

## 10. Documentación WIKA relacionada

- [01-problem.md](../idea/01-problem.md) — excepción SKU `meli_ops_hub`
- [06-ml-api-contract.md](../idea/06-ml-api-contract.md) — contrato API ML
- [auditoria-release-v1.md](../audits/auditoria-release-v1.md) — release aprobado

---

## 11. Checklist rápido “levantar en otro momento”

- [ ] `git pull` + `cd final`
- [ ] `cp ../setup/credentials.env.template .dev.vars` + pegar `MELI_CLIENT_SECRET`
- [ ] `./scripts/bootstrap.sh`
- [ ] `./scripts/dev-env.sh`
- [ ] Actualizar Redirect URI + Webhook en devcenter con URL del túnel
- [ ] Actualizar `MELI_REDIRECT_URI` en `.dev.vars` y reiniciar `meli-dev-server`
- [ ] `/admin` → Sesión dev → Conectar ML
- [ ] Catálogo → Cargar menú ejemplo → Publicar (opcional)
