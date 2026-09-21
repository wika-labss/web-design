# Changelog

Registro de cambios relevantes de `web-design`.

## Unreleased

### Added

- Plantilla `templates/05-build-plan.md` (`ready_for_construction` vive ahí).
- Pack consultor de negocio: `consulta-negocio.md`, `informe-estado-negocio.md`; `sku-contract.yaml` queda como criterio del consultor, no del builder.

### Changed

- `ready_for_construction` se mueve de 04 a 05 (paridad fundaments).
- Plan de negocio A/B **sale del flujo de creación**: no es gate de 01–05, Fase 1, Fase 2 ni release. Único output: `negocio/informe-estado-negocio.md`. `site_type` técnico: `landing | multipage | cms`.

### Added (auditoría de consistencia)

- Quality gates en `.cursorrules` (Fase 1 HTML / Fase 2 taste-skill).
- `workflows/application-lifecycle.md` — ciclo web (no el flujo móvil de fundaments).
- Auditorías oficiales: `docs/auditoria-documentacion.md`, `auditoria-modulos.md`, `auditoria-ensamblado.md`, `auditoria-release-v1.md`.
- `docs/instructivo-nuevos-usuarios.md` y `docs/documentation.md`.
- `scripts/validate_docs.py` + `tests/test_validate_docs.py` + CI `docs-consistency`.

### Fixed

- Ruta canónica unificada a `proyectos/web/{proyecto}/` (deja de usarse `applications/`).
- `PUSH.md` documenta el 403 del bot y el mirror `cursor/web-design-docs-audit-032d` (deja de usar `cursor/web-design-mirror-94c1`).
- Flag `audit_2_passed` retirado de `04-html-design.md` (pertenece a Gate 2 / plantilla 03).
- `workflows/README.md` deja de reenviar agentes al lifecycle Expo/RN.

### Changed (auditoría)

- Plantillas 01–04 de stubs vacíos a contratos parseables (RTM, BDD, MOD-DIR, gates 3A/3B).

## [0.1.1] - 2026-09-16

### Added

- Plan de negocio web (modelos A/B, infra, costos, proyección, equipo) en `docs/plan-de-negocio-web/`.

## [0.1.0] - 2026-09-10

### Added

- Esqueleto inicial del repositorio.
- Plantillas 01–04 (placeholder).
- `standards/direction-matrix.yaml` (stub).
- Submodule `external/taste-skill`.
- `skills/README.md` con contrato fase 1 / fase 2.
