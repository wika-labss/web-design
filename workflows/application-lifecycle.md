# Application Lifecycle — web-design

## Objetivo

Definir el ciclo de vida oficial de un **sitio web** dentro de WIKA.

Este workflow es el de `web-design`. No usar `wika-fundaments/workflows/application-lifecycle.md` (ese flujo es móvil: Expo / React Native / `proyectos/app/`).

La fuente de gates YAML es `.cursorrules`. Las plantillas oficiales viven en `templates/`. Las auditorías oficiales viven en `docs/`.

---

# Filosofía

- La documentación define el producto.
- Los quality gates (YAML) impiden generar HTML sin aprobación.
- Fase 1 construye HTML semántico; Fase 2 aplica dirección visual (taste-skill).
- El arquitecto garantiza la calidad.
- Todo el flujo debe poder repetirse.

Ningún sitio debe desarrollarse fuera de este flujo.

---

# Ciclo de Vida

```text
Idea
↓
Preparación (01–02)
↓
Auditoría de Documentación          → audit_1_passed
↓
Descubrimiento de Módulos (03) + MOD-DIR
↓
Auditoría de Módulos                → audit_2_passed
↓
HTML estructural / wireframes (04)
↓
Aprobación Visual                   → visual_approval_passed
↓
Plan de Construcción (05)           → ruta, deps
↓
Auditoría de Ensamblado             → audit_3_passed
↓
Listo para construir                → ready_for_construction (05)
↓
Fase 1 — Construcción (HTML semántico)
↓
Fase 1 completa                     → construction_phase_complete
↓
Fase 2 — Diseño (taste-skill / direction_skill)
↓
Auditoría de Release
↓
final/
↓
Publicación
```

---

# Consultoría de negocio (fuera de este ciclo)

El pack [`docs/plan-de-negocio-web/`](../docs/plan-de-negocio-web/README.md) y [`standards/sku-contract.yaml`](../standards/sku-contract.yaml) son **verificador/consultor**. Corren en paralelo, solo generan `proyectos/web/{proyecto}/negocio/informe-estado-negocio.md`, y **no** son quality gate.

Prohibido usarlos para rellenar 01–05, elegir stack/CMS, invocar taste-skill o bloquear Fase 1/2. La ausencia del informe no impide construir.

---

# Etapa 1: Idea

Identificar el sitio a construir (landing, pyme, portfolio) y crear la estructura:

```text
proyectos/web/{proyecto}/
├── idea/
├── audits/
├── iterations/
└── final/
```

> **Ruta canónica:** `proyectos/web/{proyecto}/`. No usar `applications/` ni `proyectos/app/` (móvil).

---

# Etapa 2: Preparación (01–02)

Copiar plantillas de `templates/` a `proyectos/web/{proyecto}/idea/`:

```text
01-problem.md
02-features.md
03-module-discovery.md
04-html-design.md
05-build-plan.md
```

Completar **01 y 02** primero.

Al finalizar 01 y 02, el proyecto entra a Auditoría de Documentación.

---

# Etapa 3: Auditoría de Documentación (Gate 1)

Checklist: `docs/auditoria-documentacion.md`.

Al aprobar, el arquitecto:

1. Registra el resultado en `audits/auditoria-documentacion.md` del proyecto.
2. Cambia `audit_1_passed: true` en `01-problem.md` y `02-features.md`.

Sin este gate: prohibido descubrir módulos.

---

# Etapa 4: Descubrimiento de Módulos (03) + MOD-DIR

Cada sección/capacidad del sitio es un módulo (`MOD-XX`) trazable a `FEAT-XX` / `ERR-XX`.

El bloque **MOD-DIR** resuelve `direction_skill` con `standards/direction-matrix.yaml` y deja `direction_locked: true`.

---

# Etapa 5: Auditoría de Módulos (Gate 2)

Checklist: `docs/auditoria-modulos.md`.

Al aprobar, el arquitecto:

1. Registra el resultado en `audits/auditoria-modulos.md`.
2. Cambia `audit_2_passed: true` en `03-module-discovery.md`.

Sin este gate: prohibido diseñar HTML estructural.

---

# Etapa 6: HTML estructural y aprobación visual (04)

`04-html-design.md` describe wireframes, secciones, CTAs y el HTML semántico previsto. `direction_skill` debe coincidir con MOD-DIR.

**Gate 3A:** el arquitecto/stakeholder pone `visual_approval_passed: true`.

---

# Etapa 7: Plan de Construcción (05)

`05-build-plan.md` fija hoja de ruta y dependencias del sitio. Es entrada del ensamblado. No clasifica SKU comercial.

---

# Etapa 8: Auditoría de Ensamblado (Gate 3B)

Checklist: `docs/auditoria-ensamblado.md`.

Entradas: `03-module-discovery.md`, `04-html-design.md`, `05-build-plan.md`.

Al aprobar, el arquitecto:

1. Confirma `visual_approval_passed: true`.
2. Registra ensamblado en `audits/auditoria-ensamblado.md`.
3. Cambia `audit_3_passed: true` en `04-html-design.md`.
4. Cambia `ready_for_construction: true` en `05-build-plan.md` cuando todos los flags previos sean `true`.

Sin este gate: prohibido generar HTML de producción (Fase 1).

---

# Etapa 9: Fase 1 — Construcción

HTML semántico en `proyectos/web/{proyecto}/iterations/vN/`. Sin look final. Skills de dirección taste-skill **prohibidas**.

Cuando el HTML estructural cumple 04, el arquitecto marca `construction_phase_complete: true` en `04-html-design.md`.

---

# Etapa 10: Fase 2 — Diseño

Pre-requisitos: `construction_phase_complete: true`, `direction_locked: true`, `direction_skill` no vacío.

Invocación:

```bash
npx skills add ./external/taste-skill --skill "${direction_skill}"
npx skills add ./external/taste-skill --skill "design-taste-frontend"
```

Con HTML de Fase 1 existente, preferir `redesign-existing-projects`. No invocar skills en `forbidden_phase2_skills` (p. ej. `image-to-code`).

---

# Etapa 11: Auditoría de Release

Checklist: `docs/auditoria-release-v1.md`.

Sin **APROBADO** en `audits/auditoria-release-v1.md`: prohibido copiar a `final/` o publicar.

---

# Relación con wika-fundaments

`wika-fundaments` es el SCOS global (principios, gobierno, estándares móviles). Este archivo **especializa** el ciclo para sitios web.

| Concepto | Móvil (`wika-fundaments`) | Web (este repo) |
|----------|---------------------------|-----------------|
| Ruta | `proyectos/app/{proyecto}/` | `proyectos/web/{proyecto}/` |
| Plantillas | 01–05 | 01–05 |
| Construcción | Expo SDK 52 + RN | HTML semántico (Fase 1) + taste-skill (Fase 2) |
| Dirección visual V1 | tokens en `04` / `theme.ts` | MOD-DIR + `direction-matrix.yaml` |

---

# Regla

No se permite generar HTML de producción ni aplicar skills de diseño sin los gates de este workflow.
