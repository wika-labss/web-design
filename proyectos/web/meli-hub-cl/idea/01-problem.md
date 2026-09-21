---
id: "WEB-PROB-MELI-001"
title: "Meli Hub CL — Definición del Problema"
status: "APROBADO"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
audit_1_passed: true
sku: "A"
sku_rationale: "Panel /admin con magic link para el operador del seller; contenido y catálogo ML cambian con frecuencia."
sku_exception: "meli_ops_hub"
industry_type: "b2b_saas"
target_audience: "Vendedores Chile (MLC) con operaciones en Mercado Libre"
brand_tone: "ejecutivo, confiable, eficiente"
---

# [01] Definición del Problema, Alcance y Metas — Meli Hub CL

> **Equivalencia de auditoría:** `audit_1_passed: true` requiere aprobación formal en `audits/auditoria-documentacion.md`.  
> **Ruta del sitio:** `proyectos/web/meli-hub-cl/`.  
> **Excepción SKU:** `sku_exception: meli_ops_hub` — ver §2.1.

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** Meli Hub CL — Panel ejecutivo Mercado Libre Chile
- **Repositorio de aplicación:** `proyectos/web/meli-hub-cl/`
- **Stakeholders clave:** Vissiuss (ingeniería), operador/vendedor MLC, Arquitecto WIKA
- **Estado de gatekeeping:** `AUDITORIA_DOCUMENTACION_APROBADA`
- **industry_type (MOD-DIR):** `b2b_saas`
- **sku:** `A` — instancia con panel `/admin` sobre plataforma Workers + D1 + R2

---

## 2. Clasificación A / B y excepción SKU

Contrato base: `standards/sku-contract.yaml`. Tesis: `docs/plan-de-negocio-web/plan-de-negocio.md`.

| Pregunta | B (landing) | A (sitio editable) | Este proyecto |
|----------|-------------|--------------------|---------------|
| ¿Alguien entra a un panel a editar? | No | Sí | **Sí** — operador seller |
| ¿El contenido cambia seguido? | No | Sí | **Sí** — catálogo ML, órdenes, inbox |
| ¿Pide reservas, pagos o login de visitantes? | — | — | **No** — pagos en ML |

- [x] SKU elegido: `A`
- [x] `sku_rationale` no vacío
- [x] No es híbrido B+panel

### 2.1 Solicitud de excepción SKU (`meli_ops_hub`)

El contrato SKU A prohíbe `catalogo_grande`. Este tenant es un **hub de operaciones de seller** que sincroniza con Mercado Libre; el catálogo **no** se expone como e-commerce propio en el sitio WIKA.

**Alcance acotado de la excepción:**

| Permitido bajo excepción | Fuera de excepción (no-go) |
|--------------------------|----------------------------|
| Panel interno `/admin` para operador | Checkout / pagos propios |
| Publicar/editar ítems vía API ML | Catálogo público masivo en sitio WIKA |
| Webhooks órdenes, items, questions, claims | Login de compradores finales |
| Métricas y dashboard ejecutivo | Reservas, WordPress, Vercel |

**Justificación de negocio:** El vendedor chileno opera en Mercado Libre pero carece de un panel unificado para publicar productos, ver ventas, responder preguntas y gestionar devoluciones sin alternar entre Seller Central y hojas de cálculo.

**Estado:** **APROBADO** — excepción `meli_ops_hub` sobre SKU A (2026-09-21). Ver `audits/auditoria-documentacion.md`.

---

## 3. Definición del Problema y Justificación

- **¿Qué problema se intenta resolver?**  
  Los vendedores MLC gestionan publicaciones, ventas, mensajes y reclamos de forma fragmentada en Mercado Libre, sin visibilidad consolidada ni flujos automatizados desde un panel propio.

- **Impacto actual / costo de oportunidad:**  
  Respuestas tardías a preguntas, errores al actualizar stock/precio, pérdida de visibilidad en devoluciones y métricas de conversión.

- **Análisis de brecha:**
  - **Estado actual:** Seller Central + planillas manuales
  - **Estado deseado:** Panel ejecutivo WIKA con integración OAuth + webhooks ML Chile (MLC)

---

## 4. Matriz de Trazabilidad de Requerimientos (RTM Inicial)

| ID Problema | Descripción del Dolor | Impacto | ID Feature (`02`) | Módulo Destino (`03`) |
| :--- | :--- | :--- | :--- | :--- |
| `ERR-01` | No hay flujo unificado para publicar productos en ML | Alto | `FEAT-01` | `mod-meli-products` |
| `ERR-02` | Ventas y cambios de órdenes no llegan en tiempo real | Alto | `FEAT-02` | `mod-meli-webhooks`, `mod-meli-orders` |
| `ERR-03` | Devoluciones/reclamos se detectan tarde | Alto | `FEAT-03` | `mod-meli-claims` |
| `ERR-04` | Preguntas de compradores sin bandeja central | Medio | `FEAT-04` | `mod-meli-inbox` |
| `ERR-05` | Sin KPIs de visitas y conversión | Medio | `FEAT-05` | `mod-meli-metrics` |
| `ERR-06` | Operador sin acceso seguro al panel | Alto | `FEAT-06` | `mod-meli-auth`, `mod-admin` |

---

## 5. Audiencia y Casos de Uso Core

- **Usuarios principales:**
  - **Rol 1:** Operador/vendedor MLC → **Necesidad:** Gestionar catálogo, ventas, inbox y reclamos desde un dashboard
  - **Rol 2:** Arquitecto WIKA → **Necesidad:** Tenant alineado a stack canónico con excepción documentada

- **Fuera de alcance (Out of Scope explícito):**
  - Checkout propio, pagos fuera de Mercado Libre
  - Login de compradores finales en el sitio WIKA
  - Catálogo público masivo en el sitio (el catálogo vive en ML)
  - Multi-país (solo MLC en v1)
  - Reservas, WordPress, Vercel, repo por cliente

---

## 6. Objetivo y Beneficios Esperados

- **Objetivo:** Entregar un panel ejecutivo con integración ML Chile que permita publicar/editar productos, recibir notificaciones de ventas/devoluciones/mensajes y visualizar métricas clave.
- **Beneficios esperados:**
  - Reducción de tiempo operativo del seller
  - Respuesta más rápida a preguntas y reclamos
  - Visibilidad de KPIs de visitas y ventas

---

## 7. Criterios de Éxito en Formato BDD (Gherkin)

### Escenario 1: Conexión OAuth Mercado Libre

- **Dado que** el operador inicia sesión en `/admin` con magic link
- **Cuando** completa el flujo OAuth con Mercado Libre Chile
- **Entonces** el tenant almacena tokens válidos y muestra estado "Conectado"

### Escenario 2: Publicación de producto

- **Dado que** el operador tiene ML conectado y completa el formulario de producto
- **Cuando** envía la publicación tras validación `POST /items/validate`
- **Entonces** el ítem aparece en ML y en la vista catálogo del panel

### Escenario 3: Notificación de venta

- **Dado que** webhooks `orders_v2` están configurados
- **Cuando** ML envía una notificación de orden confirmada
- **Entonces** el worker responde 200 en ≤500 ms y la orden aparece en el dashboard

---

## 8. Restricciones

- **Técnicas:** SKU A; stack Workers + D1 + R2; site_id `MLC`; moneda `CLP`
- **Operativas:** Un operador por tenant (magic link); secretos ML en Workers secrets
- **Seguridad:** OAuth PKCE; tokens cifrados en D1; webhook idempotente; sin secretos en repo
