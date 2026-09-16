# Auditoría de Ensamblado (web)

## Objetivo

Validar que el diseño HTML estructural permite integrar los módulos definidos **antes** de escribir HTML de producción (Fase 1).

---

# Entradas

- 03-module-discovery.md
- 04-html-design.md

---

# Validaciones

## Arquitectura

- Arquitectura definida (estático B vs editable A, si aplica el plan de negocio).
- Componentes/secciones identificados.
- Integraciones documentadas.

---

## Módulos

- Todos los módulos de 03 están incorporados en 04.
- No existen módulos sin uso.
- No existen dependencias circulares.

---

## Navegación

- Flujo principal definido.
- Estados definidos (vacío, error de form, éxito).
- Casos de uso cubiertos.

---

## Dirección visual

- `direction_skill` en `04-html-design.md` coincide con MOD-DIR en `03-module-discovery.md`.
- Pre-requisitos: `audit_1_passed`, `audit_2_passed` en `true`.
- `visual_approval_passed: true` (Gate 3A).

---

## Fase 1 vs Fase 2

- 04 describe HTML **semántico** (Fase 1), no el look final de taste-skill.
- Queda explícito que Fase 2 no arranca hasta `construction_phase_complete: true`.

---

## Activación de gates

Al aprobar ensamblado, el arquitecto debe:

1. Confirmar aprobación visual: `visual_approval_passed: true` en `04-html-design.md`.
2. Registrar ensamblado en `audits/auditoria-ensamblado.md`.
3. Cambiar `audit_3_passed: true` en `04-html-design.md`.
4. Cambiar `ready_for_construction: true` en `04-html-design.md` cuando todos los flags previos sean `true`.

---

# Resultado

## APROBADO

Puede comenzar la Fase 1 (HTML semántico).

## REQUIERE CORRECCIONES

Debe corregirse el diseño antes de construir.

---

# Regla

No se permite generar HTML de producción sin aprobar esta auditoría.
