---
id: "WEB-HTML-MELI-001"
title: "Meli Hub CL — Diseño HTML y Aprobación Visual"
status: "APROBADO"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
visual_approval_passed: true
audit_3_passed: true
construction_phase_complete: true
direction_skill: "minimalist-ui"
sku: "A"
---

# [04] HTML Estructural, Wireframes y Aprobación Visual — Meli Hub CL

> **Pre-requisito:** `audit_2_passed: true` en `03-module-discovery.md`.  
> **Implementación Fase 1:** `iterations/v1/public/`

## 1. Identificación y Antecedentes

- **Nombre del Proyecto:** Meli Hub CL
- **Documentos base:** `01-problem.md` | `02-features.md` | `03-module-discovery.md` | `05-build-plan.md`
- **sku:** `A`
- **Estado de gatekeeping:** `APROBACION_VISUAL_Y_ENSAMBLADO_APROBADOS`
- **direction_skill:** `minimalist-ui` (MOD-DIR)

---

## 2. Mapa de vistas (VIEW-XX)

| ID Vista | Ruta | Módulos | Feature | SKU |
| :--- | :--- | :--- | :--- | :--- |
| `VIEW-01` | `/` | `mod-dashboard-ui` | Landing mínima | A |
| `VIEW-02` | `/admin` | `mod-admin`, `mod-dashboard-ui` | `FEAT-06` | A |
| `VIEW-03` | `/admin#resumen` | `mod-meli-metrics`, `mod-dashboard-ui` | `FEAT-05` | A |
| `VIEW-04` | `/admin#catalogo` | `mod-meli-products` | `FEAT-01` | A |
| `VIEW-05` | `/admin#ventas` | `mod-meli-orders` | `FEAT-02` | A |
| `VIEW-06` | `/admin#inbox` | `mod-meli-inbox` | `FEAT-04` | A |
| `VIEW-07` | `/admin#reclamos` | `mod-meli-claims` | `FEAT-03` | A |
| `VIEW-08` | `/admin#conexion` | `mod-meli-auth` | `FEAT-06` | A |

---

## 3. Flujo principal

```text
[Landing /] → [Magic link /admin] → [Conectar ML OAuth] → [Dashboard resumen]
     → [Catálogo: crear/editar] | [Ventas] | [Inbox] | [Reclamos]
```

Estados por vista: loading, success, error, empty, disconnected (sin OAuth ML).

---

## 4. HTML semántico (Fase 1)

### Landing (`VIEW-01`) — `public/index.html`

- `<header>`: logo + enlace a `/admin`
- `<main>`: `<section aria-labelledby="hero-title">` con propuesta de valor
- `<footer>`: contacto operador WIKA

### Panel (`VIEW-02`–`VIEW-08`) — `public/admin/index.html`

- `<header role="banner">`: nombre tenant + estado conexión ML
- `<nav aria-label="Panel principal">`: enlaces ancla resumen, catálogo, ventas, inbox, reclamos, conexión
- `<main>`:
  - `<section id="resumen" aria-labelledby="resumen-heading">`: KPIs en `<dl>`
  - `<section id="catalogo">`: `<table>` productos + `<form>` crear/editar
  - `<section id="ventas">`: `<table>` órdenes
  - `<section id="inbox">`: lista preguntas + form respuesta
  - `<section id="reclamos">`: lista claims
  - `<section id="conexion">`: botón OAuth + estado tokens
- `<aside aria-live="polite" id="toast-region">`: mensajes sistema

Landmarks: `header`, `nav`, `main`, `footer`. Forms con `<label for="">`. Tablas con `<caption>`.

- [ ] `ready_for_construction` se activa en **05**, tras Gate 3A + 3B (arquitecto)
- [ ] `construction_phase_complete` cuando HTML en `iterations/v1/public/` cumple este documento
- [ ] Fase 2 aplica `minimalist-ui` vía `assets/style.css`

---

## 5. Wireframe textual — Dashboard resumen

```text
+------------------------------------------------------------------+
| Meli Hub CL          [Conectado ML]              [Operador ▼]   |
+------------------------------------------------------------------+
| Resumen | Catálogo | Ventas | Inbox | Reclamos | Conexión       |
+------------------------------------------------------------------+
| RESUMEN EJECUTIVO                                                |
| +-------------+ +-------------+ +-------------+ +-------------+ |
| | Visitas 7d  | | Órdenes 7d  | | Conversión  | | Ítems activos| |
| | 12.450      | | 38          | | 2.1%        | | 124          | |
| +-------------+ +-------------+ +-------------+ +-------------+ |
|                                                                  |
| ÚLTIMAS VENTAS                          PREGUNTAS PENDIENTES       |
| [tabla 5 filas]                         [lista 5 filas]          |
+------------------------------------------------------------------+
```

---

## 6. Aprobación

- **Gate 3A** `visual_approval_passed` — wireframe / estructura.
- **Gate 3B** `audit_3_passed` — ensamblado 03+04+05.
- **Fase 1** `ready_for_construction` — flag en `05-build-plan.md`.
