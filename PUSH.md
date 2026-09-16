# Publicar en github.com/wika-labss/web-design

El repositorio oficial existe:

**https://github.com/wika-labss/web-design**

El bot de Cloud Agent **sigue sin write** en `web-design` (403). El árbol auditado (gates, lifecycle, validador) está en esta rama de `wika-fundaments`:

**https://github.com/wika-labss/wika-fundaments/tree/cursor/web-design-docs-audit-032d**

## Desde tu PC — publicar el audit en `web-design`

Necesitas permiso **write** en `wika-labss/web-design`.

```bash
git clone -b cursor/web-design-docs-audit-032d --recurse-submodules https://github.com/wika-labss/wika-fundaments.git web-design-audit
cd web-design-audit
git remote set-url origin https://github.com/wika-labss/web-design.git
git fetch origin
git push -u origin HEAD:cursor/web-design-docs-audit-032d
```

Luego abrir PR en `web-design` hacia `main`.

No uses la rama antigua `cursor/web-design-mirror-94c1` (esqueleto pre-auditoría).

## Clonar el repo oficial (día a día)

```bash
git clone --recurse-submodules https://github.com/wika-labss/web-design.git
```

## Validar

```bash
python3 scripts/validate_docs.py
python3 -m unittest tests.test_validate_docs
```

Ver [CONTRIBUTING.md](CONTRIBUTING.md).
