# Standards

Estándares técnicos y visuales para sitios web bajo WIKA.

**Ruta canónica de sitios:** `proyectos/web/{proyecto}/`.

Tokens web (`design-system.md`) y coding standards — pendientes (ver ROADMAP). Hasta entonces: dirección visual = matriz + MOD-DIR.

## sku-contract.yaml

Criterio **machine-readable del consultor de negocio**, no de Fase 1/2. Tesis: [plan-de-negocio.md](../docs/plan-de-negocio-web/plan-de-negocio.md). Procedimiento: [consulta-negocio.md](../docs/plan-de-negocio-web/consulta-negocio.md).

No es quality gate. No se usa para elegir HTML, CMS ni `direction_skill`.

Índice: [docs/plan-de-negocio-web/README.md](../docs/plan-de-negocio-web/README.md).

## direction-matrix.yaml

Matriz stub **industria / tipo de negocio → `direction_skill`** (taste-skill). Consumida por el módulo `MOD-DIR` en `templates/03-module-discovery.md`.

| Install name | Perfil |
|--------------|--------|
| `minimalist-ui` | B2B SaaS, devtools, trust-first |
| `high-end-visual-design` | Luxury, wellness, premium DTC |
| `industrial-brutalist-ui` | Agencia experimental, editorial crudo |

Tokens web y coding standards — pendiente de redacción.
