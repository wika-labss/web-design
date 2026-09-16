# Templates

Plantillas oficiales de documentación web. Copiar a `proyectos/web/{proyecto}/idea/`.

## Ciclo (v0.1)

```text
Preparación (01–02)
↓
Auditoría de Documentación     → audit_1_passed
↓
Descubrimiento de Módulos (03) + MOD-DIR
↓
Auditoría de Módulos           → audit_2_passed
↓
HTML estructural (04)
↓
Aprobación Visual              → visual_approval_passed
↓
Auditoría de Ensamblado        → audit_3_passed
↓
Listo para construir           → ready_for_construction
↓
Fase 1 HTML semántico          → construction_phase_complete
↓
Fase 2 diseño (taste-skill)
↓
Auditoría de Release           → audits/auditoria-release-v1.md
```

No hay `05-build-plan.md` en v0.1: el ensamblado usa 03 + 04. `ready_for_construction` vive en `04-html-design.md`.

## Plantillas

| Archivo | ID | Gate principal |
|---------|-----|----------------|
| `01-problem.md` | WEB-PROB-001 | RTM origen (`ERR-XX`) + `industry_type` |
| `02-features.md` | WEB-FEAT-001 | BDD + secciones/CTAs (Gate 1 junto con 01) |
| `03-module-discovery.md` | WEB-MOD-001 | Contratos modulares + MOD-DIR |
| `04-html-design.md` | WEB-HTML-001 | Wireframe, `direction_skill`, Fase 1/2 |

## Trazabilidad RTM

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04)
```

## Auditorías

| Flag YAML | Auditoría WIKA |
|-----------|----------------|
| `audit_1_passed` | `docs/auditoria-documentacion.md` |
| `audit_2_passed` | `docs/auditoria-modulos.md` (solo en 03) |
| `visual_approval_passed` | Visto bueno arquitecto (04) |
| `audit_3_passed` | `docs/auditoria-ensamblado.md` |
| `ready_for_construction` | Pre-requisito Fase 1 |
| `construction_phase_complete` | Pre-requisito Fase 2 |
| (registro en `audits/`) | `docs/auditoria-release-v1.md` |
