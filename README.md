# web-design

Repositorio oficial WIKA para **páginas web y su diseño**: plantillas documentales (01–05), quality gates, resolución de dirección visual vía `MOD-DIR`, y skills de [taste-skill](https://github.com/Leonxlnx/taste-skill) como submodule.

Complementa [`wika-fundaments`](https://github.com/wika-labss/wika-fundaments) (SCOS global). Los sitios concretos viven en `proyectos/web/{proyecto}/`.

**Flujo:**

```text
docs 01–05 → gates → Fase 1 HTML semántico → Fase 2 taste-skill → release
```

Fase 1: construcción (HTML semántico, sin diseño final).  
Fase 2: diseño (skills taste-skill según `direction_skill` en `03-module-discovery.md`).

Ciclo oficial: [`workflows/application-lifecycle.md`](workflows/application-lifecycle.md)  
Instructivo: [`docs/instructivo-nuevos-usuarios.md`](docs/instructivo-nuevos-usuarios.md)  
Consultor de negocio (informe, **no** es paso de creación): [`docs/plan-de-negocio-web/README.md`](docs/plan-de-negocio-web/README.md)

---

# Estructura del repositorio

```text
web-design/
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── .cursorrules                 # Quality gates para agentes IA
├── agents/                      # Roles Fase 1 / Fase 2 / consultor
├── docs/                        # Guías y auditorías oficiales
│   ├── instructivo-nuevos-usuarios.md
│   ├── documentation.md
│   ├── auditoria-documentacion.md
│   ├── auditoria-modulos.md
│   ├── auditoria-ensamblado.md
│   ├── auditoria-release-v1.md
│   └── plan-de-negocio-web/     # consultor; no es paso de creación
├── standards/                   # direction-matrix.yaml; sku-contract.yaml (solo consultor)
├── templates/                   # 01–05
│   ├── 01-problem.md
│   ├── 02-features.md
│   ├── 03-module-discovery.md
│   ├── 04-html-design.md
│   └── 05-build-plan.md
├── workflows/
│   └── application-lifecycle.md
├── skills/                      # Contrato taste-skill
├── external/taste-skill         # git submodule
├── scripts/                     # Validación de consistencia documental
└── tests/
```

## Responsabilidad de este repositorio

`web-design` contiene las definiciones que permiten construir **sitios web** de manera consistente.

No debe contener sitios finales ni código de negocio de un cliente. Esos viven en `proyectos/web/{proyecto}/`.

No reemplaza `wika-fundaments` ni `design-system` (apps móviles V3+).
