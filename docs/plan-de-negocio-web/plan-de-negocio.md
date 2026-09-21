# Plan de negocio — web pymes (modelos A y B)

> **Rol:** criterio del **consultor / verificador**, no del flujo de creación.  
> No uses este documento para elegir HTML, CMS, `direction_skill` ni para aprobar gates.  
> Procedimiento: [`consulta-negocio.md`](consulta-negocio.md) → único output [`informe-estado-negocio.md`](informe-estado-negocio.md).  
> Contrato de rol: [`README.md`](README.md).

**Región:** Chile (CLP)  
**Industria:** servicios digitales / hosting de sitios para pymes  
**Fecha:** 2026-09-16  
**Tipo de cambio usado:** $950 CLP / USD (proyecciones)

Dos negocios distintos, **una sola plataforma**. B es el sitio sin panel. A es el mismo sitio con `cms: true`. Si se construyen como proyectos separados, el ahorro de IA desaparece.

Los montos de setup/mensual son **pisos internos** para no subsidiar. No son lista comercial.

---

## 1. Tesis

Bajar costo unitario (IA + plantilla + multi-tenant) y **alojar**:

| SKU | Qué es | Cliente |
|---|---|---|
| **B** | Página chica, estática, WhatsApp + form | Oficio/profesional que necesita URL ya |
| **A** | Lo mismo + panel con campos fijos | Pyme que sí va a editar contenido |

La IA comprime el **primer HTML**, no el brief, el WhatsApp, el DNS ni las excepciones. El negocio no es “hacer páginas”: es **operar muchas instancias del mismo producto**.

---

## 2. Modelo B — landings / páginas chicas

### Concepto

Presencia de una página. Un objetivo (WhatsApp o formulario). Hosting incluido. Cambios acotados.

### Cliente

- **Sí:** vive de Instagram, necesita Maps/ads, no va a editar nunca.
- **No:** “después lo vamos armando” o “que se pueda cambiar todo”. Eso es A.

### Mercado (Chile 2026)

| Tramo | Setup |
|---|---|
| Plantilla / piso | $80k–$200k |
| Profesional | $150k–$500k |
| Agencia | $180k–$390k |

Competidores reales: Wix, WordPress.com, Instagram, el sobrino. No las agencias de $890k.

### Técnica

Viable y aburrida a propósito: plantilla responsive, form, OG, deploy repetible. **Sin CMS.** El operador (nosotros) cambia el texto.

Riesgo: 80 repos generados con IA. A los 8 meses el costo de poseer supera el de generar. Condición: **una base de código, muchas instancias**.

### Piso interno

| | Monto | Qué cubre |
|---|---|---|
| Setup | ≥ $80k | 2–4 h de onboarding con contenido listo |
| Mensual | ≥ $12k | Infra + soporte con techo (no buffet) |
| Contrato | 6 meses o anual | Si es mes a mes, churn ~10% |

Cambio extra: paquete o hora. “Cambio mínimo” no existe sin cláusula.

### Veredicto B

Viable **como producto industrializado** (plantilla + hosting + techo). No viable como “te armo algo en el chat y lo dejo en un hosting distinto”.

---

## 3. Modelo A — sitio un poco más grande (editable)

### Concepto

B + estado: textos, fotos, horarios, servicios en base de datos. Panel. Mismo renderer.

**No es** “B más grande, mismo costo”. Cambia la clase de riesgo: auth, backups, migraciones, “olvidé la clave”, fotos que rompen el layout.

### Cliente

- **Sí:** contenido que cambia, alguien que **entra al panel**, presupuesto de cientos de miles.
- **No:** pide admin “por si acaso” y después manda todo por WhatsApp. El panel fue teatro.

### Mercado

Se compara con sitio corporativo / WordPress, no con landing.

| Proveedor | Rango setup |
|---|---|
| Freelancer | $200k–$500k |
| Agencia chica | $400k–$1.5M |

El mercado ya incluye admin (WordPress). No se vende dominio + hosting + panel + BD a la carta: el pyme compra un resultado, no infraestructura.

### Técnica

- **Un CMS opinado**, schema fijo (p. ej. Inicio, Servicios ×5, Equipo, Contacto, galería).
- No admin custom “según cuántas weas quiera editar” (alcance infinito).
- No WordPress por cliente. Flag `plan=a` en el tenant.
- No-go: reservas, pagos, login de clientes finales, catálogo grande.

### Piso interno

| | Monto |
|---|---|
| Setup | ≥ $250k |
| Mensual | ≥ $35k |
| Onboarding | 6–10 h + video de 8 min (no Zoom eterno) |
| Capacidad | **1 A = 3 B** en horas de founder |

### Veredicto A

No viable como “B más grande con IA”. Viable como **segundo producto** del mismo código, con techo funcional rígido.

---

## 4. Crítica (si el palanca es costo, no precio)

1. **Costo de generar ≠ costo de poseer.** La IA mueve el gasto al after-sale (tickets, DNS, excepciones).
2. **Hosting de pymes no es foso.** Sin plataforma (mismo tipo de sitio × N), eres revendedor con autocomplete.
3. **Sin precio igual hay precio: cero filtro.** El cliente caro-en-atención define el costo real.
4. **A y B no son tamaños; son arquitecturas** (estático vs estado). Mezclarlos en la misma cola de WhatsApp pudre B.
5. **La IA commoditiza la oferta.** En 12–24 meses el cliente arma B solo. Queda operar (arriba, dominio, no pensar) o nicho (plantilla de un rubro).

Métrica desde el primer beta: **minutos humanos / sitio / mes**. Si no baja con el volumen, no hay fábrica.

---

## 5. Infra (una plataforma)

```text
cliente.com  ──┐
               ├── Cloudflare for SaaS (SSL + hostname)
taller.tu.app ─┘
                    │
                    ▼
              Worker / App (un solo código)
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
   Contenido (D1)        Fotos (R2)
   Auth solo plan A      Forms → email
```

| Capa | Servicio | Nota |
|---|---|---|
| Compute + SSL clientes | Workers Paid + Cloudflare for SaaS | 100 hostnames custom gratis; luego USD 0.10/hostname/mes |
| Datos | D1 | Tenants + JSON de contenido. Postgres (Supabase USD 25) solo si A lo exige |
| Fotos | R2 | Egress 0; resize a WebP |
| Auth A | Magic link | Un usuario por tenant |
| Mail de forms | Email Sending de CF (en los USD 5) o Resend free | 3.000 mails/mes |
| DNS marca | `*.tuapp.cl` | El sitio nace el día 1 sin pelear NIC |
| Dominio `.cl` | NIC Chile, **a nombre del cliente** | Pass-through $9.990/año. Tú operas |
| CI / errores / uptime | GitHub + wrangler, Sentry free, UptimeRobot | Un pipeline, un bug se ve en todos |

**No en v1:** correo `@dominio` hospedado, un repo por cliente, Vercel, VPS (Hetzner+Caddy es más barato en raw pero te hace sysadmin). Reevaluar VPS cuando Workers+R2 > ~USD 40 **y** ya hay runbook.

### Flujo de dominio

1. Nace en `cliente.tuapp.cl` (gratis).
2. Custom: CNAME `www` → `cname.tuapp.cl` + custom hostname por API.
3. Estados: `pending_dns` / `active` / `suspended`.

---

## 6. Costos

### Fijos (caja, sin sueldo)

| Ítem | Mes 1–6 | Mes 7–12 (~50 sitios, ~10 A) |
|---|---|---|
| Workers Paid | USD 5 | USD 5–15 |
| CF for SaaS | USD 0 (≤100 host) | USD 0–5 |
| R2 + D1 + mail | USD 0–5 | USD 5–20 |
| Cursor / Sentry / GitHub | USD 20–30 | USD 20–50 |
| **Total** | **~USD 30–40 (~$28–38k)** | **~USD 50–100 (~$48–95k)** |

Infra es ruido. El costo dominante es hora humana.

Founder a $1.5M/mes ≈ **$9.400/hora**:

- 20 min de soporte B ≈ $3.100/mes de costo interno  
- 1 h de soporte A ≈ $9.400/mes  

Eso fija el piso del mensual, cobre lo que cobre al público.

### Variable por cliente

| | B | A |
|---|---|---|
| Infra | < USD 0.20/mes | USD 0.50–2/mes |
| Onboarding (plantilla+IA, contenido listo) | 2–4 h | 6–10 h |
| Soporte / mes **con techo** | 10–20 min | 30–60 min |
| Soporte / mes **WhatsApp libre** | 1–3 h | 3–8 h |

---

## 7. Build necesaria (6 semanas)

Un repo, TypeScript, Workers + D1 + R2. IA para copy/variantes de plantilla, no para arquitectura.

| Semana | Entrega |
|---|---|
| 1 | Tenancy: host → tenant. Admin interno feo (alta/baja). `slug.tuapp.cl` sirve |
| 2 | Plantilla B: hero, 4 bloques, mapa, WhatsApp, form, 1 paleta. 3 sitios fake |
| 3 | R2 + resize, SEO mínimo (title, OG, sitemap), analytics |
| 4 | Cloudflare for SaaS por API. Checklist CNAME. Sin esto no escala B |
| 5 | Plan A: `/admin`, magic link, claves permitidas, snapshot JSON diario |
| 6 | Estados trial/active/suspended, runbook, contrato PDF, 3 betas reales |

**Listo para vender cuando:** alta B < 30 min de humano con contenido en mano; alta A < 2 h + video.

### Fuera de alcance v1

Reservas, pagos, login de visitantes, segundo stack, “un campo más solo para este cliente”.

---

## 8. Proyección 12 meses

Supuestos **base**: mix 80% B / 20% A; desde mes 5: 4 B y 1 A / mes; churn 6% B y 3% A (contrato 6 meses); setup interno B $100k / A $320k; mensual B $15k / A $42k; infra ~$35–60k/mes; números **netos**; founder sin sueldo en caja.

### Escenario base (caja)

| Mes | Sitios B | Sitios A | MRR | Caja del mes (setup+MRR−infra) |
|---|---|---|---|---|
| 1–2 | 0–3 beta | 0 | ~0 | −35k (construir) |
| 3 | 6 | 1 | 132k | ~500k |
| 6 | 16 | 2 | 324k | ~680k |
| 9 | 26 | 4 | 558k | ~1.0M |
| 12 | 34 | 6 | 762k | ~1.2M |

**Año 1 base:** ~$8–10M ingreso, ~$0.5M infra. El MRR mes 12 (~$760k) **no cubre un sueldo de ingeniero**. El negocio cierra de verdad en año 2, cuando el stock de mensuales manda.

### Tres escenarios a mes 12

| | Pesimista | Base | Empujado |
|---|---|---|---|
| Qué pasa | WhatsApp libre, churn alto, A a medida | Techo + plantilla + contrato 6 m | Un rubro + un canal de venta |
| Activos | ~18 B + 2 A | ~34 B + 6 A | ~55 B + 10 A |
| MRR | ~$350k | ~$760k | ~$1.25M |
| Ingreso año 1 | ~$4M | ~$9M | ~$14M |
| ¿Paga sueldo $1.5M? | No | No | El MRR sí; el founder aún vende |

**Umbral serio:** ~60 B equivalentes (p. ej. 45 B + 8 A), MRR ~$1.0–1.3M. Ahí: sueldo chico **o** media jornada ops, no las dos.

La proyección se rompe si el contenido no llega, si un A custom se come el mes, o si se cobra bajo el piso interno.

---

## 9. Equipo

Contratar **ops**, no un segundo developer. El segundo dev acelera features por cliente y mata el modelo.

| Fase | Trigger | Equipo |
|---|---|---|
| 0. Fábrica | 0–15 sitios | 1 founder (producto + primeros clientes + runbook) |
| 1. Filtro | 15–40 sitios **o** >8 h/semana de WhatsApp | + ops 20 h ($400–700k): DNS, cambios de texto, cobrar, renovar `.cl` |
| 2. Canal | >8 altas/mes | + venta 15–20 h. Cierra B/A sin inventar excepciones |
| 3. Congelar | 80+ sitios, A sigue siendo el mismo producto | Recién ahí un dev extra, **solo plataforma** |

Cupo founder: **4 B/mes o 1 A/mes**, no las dos a full. Mix 80/20 es cupo operativo, no solo comercial.

---

## 10. Operación A vs B

| | B | A |
|---|---|---|
| Deploy | El mismo | El mismo |
| Plantilla | Sí | Sí + editor de campos fijos |
| Cola | DNS, textos, form | Eso + admin + fotos |
| Kill switch | Pide panel → contrato A | Pide reservas/pagos → no |

Dos cotizaciones, cero híbridos. “Landing con un panel chico” es un solo modelo malo.

Regla de oro por escrito en B: *esto no incluye panel. Si lo necesitas, es el plan sitio (A).*

---

## 11. Orden de ataque

1. Semanas 1–6: plataforma mínima.  
2. 5 betas B de **un solo rubro** (no “pymes”).  
3. Medir minutos/sitio. Ajustar plantilla, no el stack.  
4. Prender A para 2 clientes que **ya** usan B y piden editar.  
5. Contrato 6 meses + techo de cambios **antes** de volumen.  
6. Hire ops cuando el WhatsApp robe el build, no “para crecer”.

---

## 12. Fuentes de mercado (2026)

- NIC Chile: dominio `.cl` $9.990/año (exento IVA).  
- Landings Chile: TechDojo ($80k–$2M; piso profesional $150k–$500k); Focus Web desde $180k; Interactivo desde $350k; Rankaglia landing $390k / corporativo $890k.  
- Cloudflare for SaaS: 100 hostnames incluidos, USD 0.10 extra. Workers Paid USD 5/mes.  
- Hosting compartido Chile: ~$2k–$5k/mes (referencia de mercado, no stack propio).
