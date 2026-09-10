# Skills

## Submodule taste-skill

Las skills viven en `external/taste-skill/` (git submodule → [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)).

Clonar con submodules:

```bash
git clone --recurse-submodules https://github.com/wika-labss/web-design.git
# o tras clone:
git submodule update --init --recursive
```

## Contrato en dos fases

| Fase | Responsable | Skills taste-skill |
|------|-------------|-------------------|
| **1 — Construcción** | Plantillas web-design + agentes propios | Ninguna obligatoria. Opcional: `full-output-enforcement` |
| **2 — Diseño** | Submodule según `MOD-DIR` | `{direction_skill}` + `design-taste-frontend` o `redesign-existing-projects` |

Leer `direction_skill` de `03-module-discovery.md` / `04-html-design.md`. Si `direction_locked: true`, no invocar otra skill de dirección.

## Skills de dirección (una por proyecto vía MOD-DIR)

| Install name | Carpeta upstream |
|--------------|------------------|
| `minimalist-ui` | `minimalist-skill` |
| `high-end-visual-design` | `soft-skill` |
| `industrial-brutalist-ui` | `brutalist-skill` |

## Skills de fase 2 (según contrato MOD-DIR)

| Install name | Rol |
|--------------|-----|
| `design-taste-frontend` | Capa base implementación |
| `redesign-existing-projects` | Si ya existe HTML de fase 1 |
| `imagegen-frontend-web` | Comps por sección (opcional) |
| `brandkit` | Identidad (opcional) |
| `full-output-enforcement` | Anti-truncado (auxiliar) |

## Excluidas por defecto

- `image-to-code` — mezcla construcción y diseño
- `design-taste-frontend-v1`, `gpt-taste` — alternativas no default
- Skills de dirección no elegidas en `forbidden_phase2_skills`

## Invocación (fase 2)

```bash
npx skills add ./external/taste-skill --skill "${direction_skill}"
npx skills add ./external/taste-skill --skill "design-taste-frontend"
```

Con HTML existente, preferir `redesign-existing-projects` en lugar de greenfield styling.
