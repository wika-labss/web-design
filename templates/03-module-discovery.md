---
id: "WEB-MOD-001"
title: "[Descubrimiento de Módulos Web]"
status: "BORRADOR"
version: "0.1.0"
owner: "[Responsable]"
created_at: "YYYY-MM-DD"
updated_at: "YYYY-MM-DD"
audit_1_passed: false
audit_2_passed: false
---

# [03] Descubrimiento y Especificación de Módulos (Web)

Contenido pendiente.

---

## Resolución de dirección visual (taste-skill) — MOD-DIR

```yaml
mod_id: MOD-DIR
industry_type: ""              # enum — definido en 01-problem
business_model: ""             # opcional — de 02-features
direction_skill: ""            # minimalist-ui | high-end-visual-design | industrial-brutalist-ui
direction_rationale: ""
direction_locked: true
allowed_phase2_skills: []
forbidden_phase2_skills:
  - image-to-code
```

Resolver `direction_skill` usando `standards/direction-matrix.yaml`.
