# Agents

Roles para construcción web (Fase 1), diseño (Fase 2) y **consulta de negocio** (informe, sin código). Las fichas nominativas (`web-scribe`, `web-builder`, …) **aún no existen**; no inventar IDs. Hasta entonces, el contrato operativo es `.cursorrules` + `skills/README.md`. El pack de negocio es aparte.

**Ruta canónica de producto:** `proyectos/web/{proyecto}/`.

## Quién corre cuándo

| Fase | Quién | Puede generar HTML/CSS de producción | Skills taste-skill |
|------|--------|--------------------------------------|--------------------|
| Docs 01–05 | Contribuidor / agente | No | No |
| Auditorías (borrador) | Contribuidor / agente | No | No |
| Gates / **APROBADO** | **Arquitecto (humano)** | No (aprueba) | No |
| Fase 1 | Contribuidor / agente | Sí, si `ready_for_construction: true` | Ninguna de dirección |
| Fase 2 | Contribuidor / agente | Sí (look), si `construction_phase_complete` + `direction_locked` | `{direction_skill}` + `design-taste-frontend` o `redesign-existing-projects` |
| Consulta de negocio | Consultor | **No** | **No** |

**Consultor de negocio:** lee `idea/` / `audits/` / iteración y escribe `negocio/informe-estado-negocio.md` según [`docs/plan-de-negocio-web/consulta-negocio.md`](../docs/plan-de-negocio-web/consulta-negocio.md). No rellena 01–04, no toca `iterations/`, no firma **APROBADO**, no activa flags.

Ningún agente IA activa flags YAML. Fase 1 exige `ready_for_construction` en **05**.

Handoff: ver [`workflows/application-lifecycle.md`](../workflows/application-lifecycle.md).
