# Auditoría de Documentación — Meli Hub CL

**Proyecto:** `proyectos/web/meli-hub-cl/`  
**Fecha solicitud:** 2026-09-21  
**Solicitante:** Vissiuss  
**Estado:** `PENDIENTE_REVISION_ARQUITECTO`

---

## Solicitud de excepción SKU

| Campo | Valor |
|-------|--------|
| `sku` declarado | `A` |
| `sku_exception` | `meli_ops_hub` |
| Documentos | `idea/01-problem.md`, `idea/02-features.md` |

### Motivo

El tenant requiere integración con Mercado Libre Chile para:

- Publicar y editar productos vía API ML (no catálogo público WIKA)
- Recibir webhooks de ventas, items, preguntas y claims
- Panel ejecutivo `/admin` para operador seller

Esto entra en conflicto con `catalogo_grande` prohibido en SKU A de `standards/sku-contract.yaml`.

### Alcance acotado propuesto

| Incluido | Excluido |
|----------|----------|
| Panel interno `/admin` + magic link | Checkout / pagos propios |
| Sync catálogo hacia ML (API) | E-commerce público en sitio WIKA |
| Webhooks y métricas | Login compradores finales |
| Solo site_id MLC | Multi-país v1 |

### Decisión requerida del Arquitecto

- [ ] **APROBADO** — Excepción `meli_ops_hub` sobre SKU A; activar `audit_1_passed: true` en 01 y 02
- [ ] **REQUIERE CORRECCIONES** — Ajustar alcance
- [ ] **RECHAZADO** — No-go; no proceder con módulo ML

**Firma arquitecto:** ___________________  
**Fecha:** ___________________

---

## Checklist pre-revisión (completado por contribuidor)

- [x] `sku: A` en 01 y 02 (coincidente)
- [x] `sku_rationale` no vacío
- [x] `industry_type: b2b_saas` en 01
- [x] Excepción documentada en §2.1 de 01-problem.md
- [x] Features trazadas a módulos en 02
- [x] Fuera de alcance: pagos propios, login visitantes, forbidden_v1
- [x] Contrato ML interno en `idea/06-ml-api-contract.md`

**Nota:** Flags YAML (`audit_1_passed`, etc.) permanecen `false` hasta firma del arquitecto.
