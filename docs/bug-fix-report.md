# Informe de corrección de bugs — web-design

**Fecha:** 2026-09-16  
**Analizador:** Cursor Grok 4.6 (Cloud Agent)  
**Rama:** `cursor/web-design-docs-audit-032d`  
**Repositorio:** `wika-labss/web-design` (rama base `main`)

## Overview

| Métrica | Valor |
|---------|-------|
| Total bugs encontrados | 12 verificables + 5 diferidos |
| Total bugs corregidos | 12 |
| Sin corregir / diferidos | 5 |
| Cobertura de tests | 0% (sin suite) → suite nueva de consistencia documental |
| Stack analizado | Markdown / YAML de proceso web. No hay código de aplicación. |

Este repositorio **no es un sitio**: es el contrato WIKA para páginas web (plantillas 01–04, MOD-DIR, taste-skill). No existen `src/` de producto ni superficie de SQL/XSS/CSRF. Los bugs verificables son **inconsistencias de contrato** que provocan que agentes IA y humanos construyan en la ruta incorrecta, sigan el lifecycle **móvil** de `wika-fundaments`, salten gates o clonen el repo equivocado.

La metodología es la misma que en `wika-fundaments` (informe 2026-09-15): inventario → bugs de contrato → validador + tests + CI → reportes md/json/yaml/csv.

## Hallazgos críticos

1. **BUG-001** — `README.md` ubicaba los sitios en `applications/proyectos/web/{proyecto}/` mientras `templates/README.md` usaba `proyectos/web/{proyecto}/idea/`. `applications/` es la raíz deprecada del SCOS.
2. **BUG-002** — No existía `workflows/application-lifecycle.md`. `workflows/README.md` reenviaba al lifecycle **Expo/RN** de fundaments.
3. **BUG-003 / BUG-004** — Las plantillas ya tenían flags (`audit_1_passed`, `audit_2_passed`, `visual_approval_passed`) pero no había auditorías oficiales ni `.cursorrules` operativo.
4. **BUG-005** — `PUSH.md` instruía clonar `wika-fundaments` rama `cursor/web-design-mirror-94c1` y hacer push a `web-design` (el repo oficial ya existe).
5. **BUG-006** — `04-html-design.md` copiaba `audit_2_passed` (Gate 2 de módulos).

## Resumen por categoría

| Categoría | Corregidos |
|-----------|------------|
| Seguridad | 0 (sin superficie de runtime en este repo) |
| Funcional (contrato de proceso) | 7 |
| Integración (enlaces / nombres de archivo) | 3 |
| Code Quality (docs) | 2 |
| Performance | 0 |

## Lista detallada

| BUG-ID | Severidad | Archivo | Descripción | Estado | Test |
|--------|-----------|---------|-------------|--------|------|
| BUG-001 | CRITICAL | `README.md`, `templates/README.md` | Ruta `applications/proyectos/web/` vs `proyectos/web/` | FIXED | `test_bug001_stale_applications_path` |
| BUG-002 | CRITICAL | `workflows/application-lifecycle.md` (ausente) | Sin ciclo web; README reenviaba a fundaments móvil | FIXED | `test_canonical_path_in_lifecycle` |
| BUG-003 | HIGH | `docs/auditoria-*.md` (ausentes) | Flags de gate sin checklists oficiales | FIXED | `test_release_audit_exists_and_is_linked` |
| BUG-004 | HIGH | `.cursorrules` | Solo “contenido pendiente”; agentes sin gates | FIXED | `test_cursorrules_has_gates` |
| BUG-005 | HIGH | `PUSH.md` | Clone desde `wika-fundaments` para publicar este repo | FIXED | `test_bug005_stale_push_clone` |
| BUG-006 | MEDIUM | `templates/04-html-design.md` | `audit_2_passed` en Gate 3 / plantilla 04 | FIXED | `test_bug006_audit_2_on_html_template` |
| BUG-007 | MEDIUM | `templates/01–04` | Stubs “contenido pendiente”; sin RTM/BDD/MOD-DIR usable | FIXED | `test_repo_passes_after_fix` |
| BUG-008 | MEDIUM | `CONTRIBUTING.md` | Vacío; sin comando de validación | FIXED | live repo |
| BUG-009 | MEDIUM | `README.md`, `docs/README.md` | Sin árbol real ni índice de auditorías | FIXED | `test_release_audit_exists_and_is_linked` |
| BUG-010 | LOW | `scripts/`, `.github/` | Sin validador ni CI (paridad con fundaments) | FIXED | `test_repo_passes_after_fix` |
| BUG-011 | MEDIUM | `templates/04-html-design.md` | Faltaba `audit_3_passed`; `ready_for_construction` sin Gate 3B | FIXED | `test_html_template_has_no_audit_2_frontmatter` |
| BUG-012 | LOW | `standards/direction-matrix.yaml` | Sin defaults de skills Fase 2 / `image-to-code` forbidden | FIXED | `test_live_matrix_ok` |

## Fichas (plantilla 3.1)

### BUG-001

- **Severity:** CRITICAL  
- **Category:** Functional  
- **Component:** Ruta de producto  
- **Current:** README: `applications/proyectos/web/{proyecto}/`. templates: `proyectos/web/{proyecto}/idea/`.  
- **Expected:** Una sola ruta: `proyectos/web/{proyecto}/`.  
- **Root cause:** Esqueleto inicial mezcló el nombre deprecado `applications/` con el portafolio `proyectos`.  
- **Impact:** Sitios creados en el lugar incorrecto; agentes no encuentran `idea/` ni `audits/`.  
- **Reproduction:** Contrastar README vs `templates/README.md` en `main` pre-fix.  
- **Verification:** `python3 -m unittest tests.test_validate_docs`

### BUG-002

- **Severity:** CRITICAL  
- **Category:** Functional  
- **Component:** Workflow oficial  
- **Current:** `workflows/README.md` decía “ver plan de ciclo de vida en `wika-fundaments/workflows/application-lifecycle.md`”. Ese archivo es Expo SDK 52 + `proyectos/app/`.  
- **Expected:** Ciclo web de 2 fases con gates YAML propios.  
- **Impact:** Agentes construirían landings como apps móviles.

### BUG-005

- **Severity:** HIGH  
- **Category:** Integration  
- **Current:** PowerShell: clonar `wika-fundaments` rama `cursor/web-design-mirror-94c1` (esqueleto) y `git push` a `main` de `web-design`.  
- **Expected:** Rama de audit `cursor/web-design-docs-audit-032d`; PR hacia `web-design` `main`. El bot sigue en 403.  
- **Impact:** Publicar el esqueleto viejo sobre el repo oficial, o mezclar SCOS móvil con web.

## Evaluación de riesgo

### Issues diferidos

| ID | Motivo |
|----|--------|
| DEF-001 | Plantilla `05-build-plan.md` — ROADMAP; en v0.1 `ready_for_construction` vive en 04. |
| DEF-002 | `standards/coding-standards.md` y `design-system.md` web — ROADMAP; inventarlos vacíos degradaría el contrato. |
| DEF-003 | Catálogo nominativo de agentes (`web-scribe`, etc.) — ROADMAP; `agents/README.md` describe roles sin IDs inventados. |
| DEF-004 | PR `#4` de `wika-fundaments` registra web-design pero aún dice que los sitios viven en `applications/`. Hay que actualizarlo a `proyectos/web/`. |
| DEF-005 | Skills de construcción Fase 1 propias — el contrato taste-skill cubre Fase 2; Fase 1 sigue siendo HTML semántico sin skill local. |

### Próximos pasos recomendados

1. Mergear este PR y ejecutar CI `docs-consistency` en `main`.
2. Actualizar `wika-fundaments` `docs/repositories.md` (PR #4) con ruta `proyectos/web/` (no `applications/`).
3. Redactar estándares web y, si el ensamblado lo exige, `05-build-plan.md`.
4. Definir fichas de agentes cuando exista el catálogo de negocio.

### Deuda técnica

- Duplicación residual entre instructivo, lifecycle y `.cursorrules` (mitigada: ahora coinciden; sigue siendo tres superficies).
- Submodule `external/taste-skill` pinneado; hay que `git submodule update --init`.
- Plantillas 01–04 son contratos parseables, no briefs de un sitio real.

## Resultados de testing

- **Comandos:**
  - `python3 scripts/validate_docs.py`
  - `python3 -m unittest tests.test_validate_docs`
- **Tests añadidos:** 16 (enlaces, fences, regresiones BUG-001/005/006, live repo, gates, PUSH, matriz).
- **Impacto de cobertura:** primera suite del repositorio.
- **Resultado:** 16/16 OK.

## Entregables machine-readable

- [bug-fix-report.json](bug-fix-report.json)
- [bug-fix-report.yaml](bug-fix-report.yaml)
- [bug-fix-report.csv](bug-fix-report.csv)
