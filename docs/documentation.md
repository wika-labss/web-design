# Documentation — web-design

## Objetivo

Definir las reglas de documentación de sitios web WIKA. La documentación define el producto; el HTML es consecuencia.

---

## Fuente oficial de verdad

La carpeta `idea/` de cada sitio es la fuente de verdad.

**Ruta canónica:** `proyectos/web/{proyecto}/`.

```text
proyectos/web/{proyecto}/
├── idea/
│   ├── 01-problem.md
│   ├── 02-features.md
│   ├── 03-module-discovery.md
│   ├── 04-html-design.md
│   └── 05-build-plan.md
├── audits/
│   ├── auditoria-documentacion.md
│   ├── auditoria-modulos.md
│   ├── auditoria-ensamblado.md
│   └── auditoria-release-v1.md
├── iterations/
├── final/
└── negocio/       ← opcional; informe consultor, NO es gate
```

Las **checklists** oficiales viven en `web-design/docs/`. En `audits/` del proyecto solo se registra el veredicto de gates.

`negocio/informe-estado-negocio.md` es consultoría comercial ([`plan-de-negocio-web/`](plan-de-negocio-web/README.md)). No es fuente de verdad del producto y no bloquea construcción.

No usar `applications/` como raíz. `proyectos/app/` es el portafolio móvil.

---

## Plantillas

Usar siempre `templates/` de este repositorio. No copiar las plantillas móviles 01–05 de `wika-fundaments` a un sitio web (el 05 web no es el 05 Expo).

Trazabilidad:

```text
ERR-XX (01) → FEAT-XX (02) → MOD-XX (03) → VIEW-XX (04) → Paso N (05)
```

MOD-DIR (dentro de 03) no es un `MOD-XX` de sección: es el contrato de `direction_skill`.

---

## Gates

Ver `.cursorrules` y `workflows/application-lifecycle.md`. Ningún agente IA activa flags YAML.
