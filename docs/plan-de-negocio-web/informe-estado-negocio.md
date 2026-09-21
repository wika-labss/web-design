---
id: "WEB-NEG-001"
title: "[Informe de estado de negocio]"
status: "BORRADOR"
version: "0.1.0"
owner: "[Consultor]"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
proyecto: "[nombre]"
veredicto: ""
# veredicto: sano | revisar | no_es_producto
# Este archivo NO es un quality gate. No bloquea Fase 1 ni Fase 2.
---

# Informe de estado de negocio

> Copia este archivo a `proyectos/web/{proyecto}/negocio/informe-estado-negocio.md`.  
> No edites HTML, CSS, `idea/` ni flags YAML. Solo este informe.

## 1. Contexto

- **Proyecto:** `[proyectos/web/…]`
- **Documentos leídos:** `[01, 02, audits, iteration vN — lo que exista]`
- **Fecha de consulta:** `YYYY-MM-DD`

## 2. Clasificación consultiva (SKU WIKA)

No confundir con `site_type` técnico en `02-features.md` (`landing | multipage | cms`).

| Campo | Valor |
|-------|--------|
| SKU | `[B / A / hibrido / fuera]` |
| Por qué | `[Una frase]` |
| El visitante necesita | `[URL + WhatsApp / editar carta / otra cosa]` |

## 3. Riesgos comerciales

- **Alcance:** `[¿Piden panel, pagos, reservas, “vamos agregando”?]`
- **Atención:** `[¿Techo de cambios o buffet WhatsApp?]`
- **Horas estimadas (humano):** onboarding `[h]` / mes `[min]`
- **Vs piso interno:** `[bajo / al piso / no aplica — ver plan-de-negocio.md]`

## 4. Portafolio (si aplica)

- ¿Este caso empuja a A a medida y frena B? `[sí/no]`
- Cupo: 1 A ≈ 3 B en horas de founder. `[impacto]`

## 5. Veredicto

| Código | Significado |
|--------|-------------|
| `sano` | Encaja en A o B con alcance cerrado |
| `revisar` | Precio, mix o alcance desalineados; construir sigue siendo decisión del arquitecto |
| `no_es_producto` | No es SKU WIKA; recomendar no tomarlo o contrato aparte |

**Veredicto:** `[sano | revisar | no_es_producto]`

**Recomendación (comercial, no técnica):**  
`[Ej. Cerrar como B sin panel. Si piden editor, otro contrato A. No híbrido.]`

## 6. Fuera de este informe

Cualquier cambio de módulos, dirección visual o HTML se hace en el flujo 01–04 / Fase 1 / Fase 2, no aquí.
