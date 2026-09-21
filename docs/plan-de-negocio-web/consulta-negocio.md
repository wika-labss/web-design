# Consulta de negocio (verificador)

Correr **en paralelo** al flujo web-design. En cualquier momento: con 01–02 a medio llenar, con HTML en `iterations/`, o post-release.

No es Gate 1–3B ni Auditoría de Release.

---

## Entradas (solo lectura)

- `proyectos/web/{proyecto}/idea/` (01–04 si existen)
- `proyectos/web/{proyecto}/audits/` (si existen)
- Iteración nominada en `iterations/vN/` (si existe)
- Criterio: [`plan-de-negocio.md`](plan-de-negocio.md) y [`standards/sku-contract.yaml`](../../standards/sku-contract.yaml)

Prohibido usar este procedimiento para rellenar plantillas 01–04, elegir `direction_skill` o abrir PRs de código.

---

## Qué verifica

1. **SKU consultivo** (no `site_type` técnico): ¿es B (presencia, sin panel), A (editable con campos fijos), híbrido tóxico, o fuera de producto?
2. **Alcance:** ¿el cliente pide reservas, pagos, login, “después lo vamos armando”?
3. **Atención:** ¿el soporte sería WhatsApp infinito vs techo de cambios?
4. **Horas vs piso interno:** onboarding y mensual según `plan-de-negocio.md` (números internos, no lista pública).
5. **Cupo:** si hay mix A+B en el mismo operador, ¿1 A está comiendo 3 B?

---

## Qué no verifica

- Semántica HTML, MOD-DIR, taste-skill, Core Web Vitals de diseño.
- Si `audit_*_passed` está en `true`.
- Si el look “se ve caro”.

Eso es arquitecto + gates. Aquí solo estado **comercial**.

---

## Salida

Copiar [`informe-estado-negocio.md`](informe-estado-negocio.md) a:

```text
proyectos/web/{proyecto}/negocio/informe-estado-negocio.md
```

Un informe por consulta (fecha en el cuerpo). No firmar **APROBADO** de release. Veredictos válidos: `sano` | `revisar` | `no_es_producto`.

---

## Agente

Quien corre esto actúa como **Consultor de negocio** ([`agents/README.md`](../../agents/README.md)).

Si el informe dice `revisar` o `no_es_producto`, el arquitecto **humano** decide si igual construye. El consultor no para el pipeline.
