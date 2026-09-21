# Auditoría de Documentación (web)

## Objetivo

Validar que la documentación del sitio contiene toda la información necesaria para iniciar el descubrimiento de módulos.

Ningún proyecto web podrá avanzar a módulos sin aprobar esta auditoría.

El plan de negocio / SKU A/B **no** es entrada de este gate.

---

# Entradas

## Obligatorias

- 01-problem.md
- 02-features.md

---

# Validaciones

## Problema

- El problema está claramente definido.
- Existe una necesidad real identificada.
- El alcance está documentado.
- `industry_type` y `target_audience` presentes en frontmatter de `01-problem.md` (insumos de MOD-DIR).

---

## Usuarios

- Los usuarios están identificados.
- Existe una descripción de uso esperada.

---

## Objetivo

- Existe un objetivo claro.
- Existe un resultado esperado.

---

## Funcionalidades

- Las funcionalidades obligatorias están definidas (secciones, CTAs).
- Las funcionalidades opcionales están diferenciadas.
- El alcance está delimitado.
- `site_type` presente en `02-features.md` (`landing | multipage | cms`).

---

## Restricciones

- Restricciones técnicas identificadas (estático vs editable **del sitio**, hosting). No exigir SKU A/B del plan de negocio.
- Restricciones operativas identificadas.
- Restricciones de seguridad identificadas (formularios, PII, auth si aplica).

---

## Metadatos y trazabilidad

- Frontmatter YAML en `01-problem.md` y `02-features.md` (`id`, `status`, `owner`, fechas).
- RTM inicial en `01-problem.md` con IDs `ERR-XX` mapeados a `FEAT-XX`.
- RTM en `02-features.md` con cobertura 1:1 hacia módulos destino.
- Criterios de éxito en formato BDD (Dado / Cuando / Entonces).
- Out-of-scope explícito documentado.

---

## Activación de gate

Al aprobar, el arquitecto debe:

1. Registrar resultado en `audits/auditoria-documentacion.md` del proyecto.
2. Cambiar `audit_1_passed: true` en frontmatter de `01-problem.md` y `02-features.md`.

---

# Resultado

## APROBADO

La documentación permite continuar.

## REQUIERE CORRECCIONES

La documentación debe completarse antes de continuar.

---

# Regla

No se permite ejecutar el descubrimiento de módulos sin aprobar esta auditoría.
