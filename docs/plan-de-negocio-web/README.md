# Plan de negocio web — consultor / verificador

Este pack **no forma parte** del ciclo de creación de un sitio.

```text
01–05 → gates → Fase 1 HTML → Fase 2 taste-skill → release
```

Ese flujo no lee este directorio ni `standards/sku-contract.yaml` para generar HTML o diseño. No hay flag YAML. No hay skill de diseño.

## Rol

| Puede | No puede |
|-------|----------|
| Leer `idea/`, `audits/`, `iterations/` | Generar o editar HTML/CSS |
| Clasificar el caso como A / B / híbrido / fuera de SKU | Invocar taste-skill ni cambiar `direction_skill` |
| Emitir un informe de estado comercial | Activar gates (`audit_*_passed`, `ready_for_construction`, …) |
| Recomendar precio, alcance o “esto no es producto WIKA” | Meter CMS, panel o “un campo más” en 01–05 |

El único artefacto es:

`proyectos/web/{proyecto}/negocio/informe-estado-negocio.md`

Si esa carpeta no existe, el sitio **igual** se construye. El informe es consultoría, no gate.

## Cómo se usa

| Capa | Archivo |
|------|---------|
| Rol | este README |
| Procedimiento | [`consulta-negocio.md`](consulta-negocio.md) |
| Plantilla de salida | [`informe-estado-negocio.md`](informe-estado-negocio.md) |
| Criterio comercial | [`plan-de-negocio.md`](plan-de-negocio.md) |
| Criterio machine-readable | [`standards/sku-contract.yaml`](../../standards/sku-contract.yaml) (solo el consultor) |
