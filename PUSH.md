# Publicar en github.com/wika-labss/web-design

El bot **no puede escribir** en `web-design` (403). El esqueleto está en GitHub en esta rama:

**https://github.com/wika-labss/wika-fundaments/tree/cursor/web-design-mirror-94c1**

## Desde tu PC (PowerShell) — una sola vez

Necesitas permiso **write** en `wika-labss/web-design`.

```powershell
git clone -b cursor/web-design-mirror-94c1 --recurse-submodules https://github.com/wika-labss/wika-fundaments.git web-design
cd web-design
git remote set-url origin https://github.com/wika-labss/web-design.git
git push -u origin HEAD:main
```

Tras el push, el repo oficial queda en:

https://github.com/wika-labss/web-design

Clonar en el futuro:

```powershell
git clone --recurse-submodules https://github.com/wika-labss/web-design.git
```

## Contenido

- `templates/` 01–04 con MOD-DIR
- `standards/direction-matrix.yaml`
- `skills/README.md`
- `external/taste-skill` (submodule)
