# Instructivo para nuevos usuarios — web-design

Cómo **empieza** y **termina** un sitio web en WIKA.

**Audiencia:** diseñadores, desarrolladores, agentes IA, arquitecto. El consultor de negocio usa el pack aparte (`docs/plan-de-negocio-web/`), no este instructivo para construir.  
**Fuente de verdad:** [workflows/application-lifecycle.md](../workflows/application-lifecycle.md) y [.cursorrules](../.cursorrules).

---

## 1. Qué es web-design en una frase

El repositorio de **plantillas, gates y dirección visual** para páginas web. Complementa `wika-fundaments` (SCOS global). El HTML vive en `proyectos/web/{proyecto}/`, no aquí.

```text
docs 01–05 → gates → Fase 1 HTML semántico → Fase 2 taste-skill → release
```

**No es:** construir apps móviles (`proyectos/app/` + Expo).  
**No es:** el pipeline `design-system/` (eso es V3+ de apps ya funcionales).  
**No es:** el plan comercial A/B (eso es consultor + informe).

---

## 2. Dónde encaja

| Repositorio | Rol |
|-------------|-----|
| **wika-labss/wika-fundaments** | SCOS: principios, gobierno, flujo móvil |
| **wika-labss/web-design** (este) | Plantillas 01–05, MOD-DIR, auditorías web, taste-skill |
| **wika-labss/proyectos** | Sitios: `web/{proyecto}/idea/`, `iterations/`, `final/` |
| **wika-labss/design-system** | Fidelidad visual de **apps** V3+ (no landings web) |

---

## 3. Ruta canónica

```text
proyectos/web/{proyecto}/
├── idea/          ← copiar templates/ 01–05
├── audits/        ← veredictos (no las checklists oficiales)
├── iterations/
├── final/
└── negocio/       ← opcional; informe consultor, no es gate
```

No usar `applications/` ni `proyectos/app/`.

---

## 4. Roles

| Rol | Hace |
|-----|------|
| **Negocio (consultor)** | Informe de estado en `negocio/`; no construye ni diseña |
| **Arquitecto** | Único que pone flags en `true` y escribe **APROBADO** |
| **Agente / contribuidor Fase 1** | Rellena 01–05, genera HTML semántico si `ready_for_construction` en **05** |
| **Agente Fase 2** | Aplica taste-skill según `direction_skill` bloqueado |

Ningún agente IA activa flags YAML.

---

## 5. Cómo COMIENZA

1. Crear `proyectos/web/{proyecto}/` con `idea/`, `audits/`, `iterations/`, `final/`.
2. Copiar `templates/01-problem.md` … `05-build-plan.md` a `idea/`.
3. Completar 01 y 02 → Auditoría de Documentación (`docs/auditoria-documentacion.md`).
4. Completar 03 + MOD-DIR (`standards/direction-matrix.yaml`) → Auditoría de Módulos.
5. Completar 04 (wireframe) y 05 (ruta y deps) → Aprobación visual + Ensamblado.
6. Con `ready_for_construction: true` **en 05**, generar HTML de Fase 1.

La consulta de negocio **no** está en esta lista. Si hace falta, corre aparte ([`plan-de-negocio-web/consulta-negocio.md`](plan-de-negocio-web/consulta-negocio.md)) y deja el informe en `negocio/`.

---

## 6. Cómo FINALIZA

1. `construction_phase_complete: true` (Fase 1).
2. Si hay look final: Fase 2 con `direction_locked: true`.
3. Arquitecto registra **APROBADO** en `audits/auditoria-release-v1.md`.
4. Copiar a `final/`.

Eso **no** publica DNS ni Cloudflare; es el gate interno de WIKA.

---

## 7. Errores comunes

| Error | Qué hacer |
|-------|-----------|
| Seguir el lifecycle móvil de fundaments | Usar `workflows/application-lifecycle.md` de **este** repo |
| Crear el sitio en `applications/` o `proyectos/app/` | Usar `proyectos/web/{proyecto}/` |
| Invocar taste-skill en Fase 1 | Solo HTML semántico |
| Cambiar de `direction_skill` con `direction_locked: true` | Reabrir Gate 2 con el arquitecto |
| Agente que pone `audit_*_passed: true` | Solo el arquitecto |
| Usar el plan de negocio para elegir CMS o HTML | El consultor solo escribe `negocio/informe-estado-negocio.md` |

---

## 8. Referencias

| Necesitas | Lee |
|-----------|-----|
| Ciclo | [application-lifecycle.md](../workflows/application-lifecycle.md) |
| Gates | [.cursorrules](../.cursorrules) |
| Plantillas | [templates/README.md](../templates/README.md) |
| Skills Fase 2 | [skills/README.md](../skills/README.md) |
| Plan de negocio (consultor, no es paso del sitio) | [plan-de-negocio-web/README.md](plan-de-negocio-web/README.md) |
