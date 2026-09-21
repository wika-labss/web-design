---
id: "WEB-FEAT-MELI-001"
title: "Meli Hub CL — Features y Panel Ejecutivo"
status: "APROBADO"
version: "0.1.0"
owner: "Vissiuss"
created_at: "2026-09-21"
updated_at: "2026-09-21"
audit_1_passed: true
sku: "A"
sku_rationale: "Panel /admin con magic link; operador edita catálogo ML y consulta métricas con frecuencia."
sku_exception: "meli_ops_hub"
---

# [02] Features, Secciones y CTAs — Meli Hub CL

> **Gate 1:** este documento se aprueba **junto con** `01-problem.md`.  
> **`sku` debe ser idéntico al de `01-problem.md` (`A`).**  
> **Excepción:** `sku_exception: meli_ops_hub` documentada en 01.

## 1. Identificación y Control de Cambios

- **Nombre del Proyecto:** Meli Hub CL
- **Documento base:** `idea/01-problem.md` (ID: `WEB-PROB-MELI-001`)
- **sku:** `A`
- **Estado de gatekeeping:** `AUDITORIA_DOCUMENTACION_APROBADA`

---

## 2. Alineación al SKU

- [x] `sku` = valor de `01-problem.md` (`A`)
- [x] Features caben en `allowed` de SKU A + excepción `meli_ops_hub` (catálogo vía API ML, no e-commerce WIKA)
- [x] Nada de `forbidden_v1` (reservas, pagos propios, login visitantes, WordPress, Vercel)
- [x] Panel `/admin` + magic link (un operador por tenant)
- [x] Schema de panel: dashboard ejecutivo con vistas fijas (no admin custom infinito)

---

## 3. Matriz de Trazabilidad de Requerimientos (RTM 1:1)

| ID Feature | ID Problema (`01`) | Nombre | Prioridad | Módulo Destino (`03`) | SKU |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FEAT-01` | `ERR-01` | Publicar y editar productos en ML | Crítica | `mod-meli-products` | A |
| `FEAT-02` | `ERR-02` | Webhooks y sync de órdenes | Crítica | `mod-meli-webhooks`, `mod-meli-orders` | A |
| `FEAT-03` | `ERR-03` | Gestión de devoluciones (claims) | Alta | `mod-meli-claims` | A |
| `FEAT-04` | `ERR-04` | Bandeja de preguntas y respuestas | Alta | `mod-meli-inbox` | A |
| `FEAT-05` | `ERR-05` | Dashboard de métricas | Alta | `mod-meli-metrics`, `mod-dashboard-ui` | A |
| `FEAT-06` | `ERR-06` | OAuth ML + auth panel | Crítica | `mod-meli-auth`, `mod-admin` | A |

---

## 4. Funcionalidades Obligatorias

### Feature `FEAT-01`: Publicar y editar productos en Mercado Libre

**Descripción:** El operador crea y modifica publicaciones MLC desde el panel; imágenes pasan por R2 antes de enviarse a ML.

#### Escenario 1.1: Publicación exitosa

- **Dado que** el operador tiene OAuth ML activo y datos válidos (título, categoría, precio CLP, stock)
- **Cuando** envía el formulario tras `POST /items/validate` exitoso
- **Entonces** se crea el ítem con `POST /items` y aparece en la vista catálogo

#### Escenario 1.2: Edición de producto

- **Dado que** existe un ítem sincronizado en cache D1
- **Cuando** el operador modifica precio o stock y guarda
- **Entonces** `PUT /items/{item_id}` actualiza ML y el cache local

#### Escenario 1.3: Validación rechazada

- **Dado que** faltan atributos obligatorios de categoría MLC
- **Cuando** se llama a `/items/validate`
- **Entonces** el panel muestra errores de ML sin publicar

---

### Feature `FEAT-02`: Webhooks y sincronización de órdenes

**Descripción:** Recibir notificaciones ML (`orders_v2`, `items`) y sincronizar órdenes confirmadas.

#### Escenario 2.1: Webhook de venta

- **Dado que** la app ML tiene callback URL configurada
- **Cuando** ML envía `{ topic: "orders_v2", resource: "/orders/..." }`
- **Entonces** el worker responde HTTP 200 en ≤500 ms, encola el evento y persiste la orden

#### Escenario 2.2: Recuperación de feeds perdidos

- **Dado que** hubo downtime del webhook
- **Cuando** el operador o un cron invoca sync de missed feeds
- **Entonces** se reprocesan notificaciones pendientes vía `GET /missed_feeds`

---

### Feature `FEAT-03`: Devoluciones y reclamos (claims)

**Descripción:** Listar y gestionar claims post-compra vía `/post-purchase/v1/claims/`.

#### Escenario 3.1: Nuevo reclamo

- **Dado que** ML notifica topic de claims
- **Cuando** el worker obtiene el detalle del claim
- **Entonces** aparece en la vista reclamos con estado y acciones disponibles

---

### Feature `FEAT-04`: Bandeja de preguntas

**Descripción:** Ver preguntas de compradores y responder vía API.

#### Escenario 4.1: Responder pregunta

- **Dado que** hay una pregunta sin responder en un ítem
- **Cuando** el operador escribe y envía la respuesta
- **Entonces** `POST /answers` registra la respuesta y actualiza el inbox

---

### Feature `FEAT-05`: Dashboard de métricas

**Descripción:** KPIs ejecutivos: visitas, órdenes, conversión, ítems activos.

#### Escenario 5.1: Resumen ejecutivo

- **Dado que** el operador abre el dashboard
- **Cuando** carga la vista resumen
- **Entonces** ve KPIs agregados de visitas (`/items/visits`) y órdenes cacheadas

---

### Feature `FEAT-06`: OAuth y acceso al panel

**Descripción:** Magic link para `/admin` + OAuth Mercado Libre Chile con PKCE.

#### Escenario 6.1: Primera conexión ML

- **Dado que** el operador accedió con magic link
- **Cuando** inicia "Conectar Mercado Libre"
- **Entonces** completa OAuth en `auth.mercadolibre.cl` y los tokens se guardan en D1

---

## 5. Funcionalidades Deseables (v1.1+)

| ID Feature | Nombre | Prioridad | Notas |
| :--- | :--- | :--- | :--- |
| `FEAT-07` | Respuestas sugeridas IA en inbox | Media | Fuera de v1 |
| `FEAT-08` | Multi-operador por tenant | Baja | v1 = un operador |

---

## 6. Fuera de Alcance

- Checkout propio, pagos fuera de ML, login de compradores
- Catálogo público masivo en sitio WIKA (solo panel interno)
- Multi-país (solo MLC v1)
- Reservas, WordPress, Vercel, repo por cliente
- Híbrido B + panel

---

## 7. NFRs

- **Performance:** Webhook responde 200 en ≤500 ms; LCP dashboard < 2.5 s en 4G
- **SEO mínimo:** Landing pública mínima con title/OG (valor en `/admin`)
- **Accesibilidad:** Landmarks, labels en forms, contraste AA en Fase 2
- **Plataforma:** Workers + D1 + R2; secretos en Workers secrets
- **Idempotencia:** Notificaciones ML deduplicadas por `_id`
