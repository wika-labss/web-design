# Meli Hub CL

Panel ejecutivo WIKA + integración **Mercado Libre Chile (MLC)**.

| Recurso | Ruta |
|---------|------|
| **Levantar v1 (runbook)** | [docs/SETUP-v1.md](docs/SETUP-v1.md) |
| Changelog v1 | [docs/CHANGELOG-v1.md](docs/CHANGELOG-v1.md) |
| Código deployable | [final/](final/) |
| Plantilla credenciales | [setup/credentials.env.template](setup/credentials.env.template) |
| Documentación WIKA | [idea/](idea/) |
| Auditorías | [audits/](audits/) |

## Quick start

```bash
cd final
./scripts/bootstrap.sh
# Editar .dev.vars → MELI_CLIENT_SECRET + MELI_REDIRECT_URI
./scripts/dev-env.sh
```

App ML: `202815009388102` · Site: `MLC` · Ver [SETUP-v1.md](docs/SETUP-v1.md) para devcenter, túnel y producción.
