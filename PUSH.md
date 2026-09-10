# Publicar este repo en GitHub

El esqueleto está listo. Desde esta carpeta (`web-design`):

## Windows (PowerShell)

```powershell
cd ruta\donde\clonaste\web-design
git push -u origin main
```

Si clonaste solo `wika-fundaments`, entra a la subcarpeta `web-design` si la copiaste ahí, o clona este directorio por separado.

## Primera vez (repo remoto vacío)

```powershell
git remote -v
# debe apuntar a https://github.com/wika-labss/web-design.git

git push -u origin main
```

## Clonar en otra máquina (después del push)

```powershell
git clone --recurse-submodules https://github.com/wika-labss/web-design.git
cd web-design
```

## Contenido

- `templates/` 01–04 con MOD-DIR
- `standards/direction-matrix.yaml`
- `skills/README.md` (contrato fase 1 / fase 2)
- `external/taste-skill` (submodule)
