const toastRegion = document.getElementById("toast-region");

function toast(message) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  toastRegion?.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    await ensureDevSession();
    return api(path, options);
  }
  if (!res.ok && res.status !== 422) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  if (!res.ok) {
    const err = new Error(data.error || data.message || `HTTP ${res.status}`);
    err.data = data;
    err.status = res.status;
    throw err;
  }
  return data;
}

async function ensureDevSession() {
  await fetch("/api/dev/session", { method: "POST" });
}

function showSection(id) {
  document.querySelectorAll(".panel-section").forEach((s) => s.classList.add("hidden"));
  document.getElementById(id)?.classList.remove("hidden");
  document.querySelectorAll(".nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.section === id);
  });
}

function formatCLP(n) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n || 0);
}

async function loadStatus() {
  try {
    const data = await api("/api/status");
    const badge = document.getElementById("connection-status");
    const dot = badge?.querySelector(".status-dot");
    const label = badge?.querySelector("span:last-child");
    if (data.meli?.connected) {
      dot?.classList.replace("status-disconnected", "status-connected");
      if (label) label.textContent = `Conectado · Seller ${data.meli.user_id}`;
    } else if (data.meli?.user_id) {
      if (label) label.textContent = "Token expirado — reconectar";
    } else {
      if (label) label.textContent = "Sin conectar";
    }

    const detail = document.getElementById("meli-status-detail");
    if (detail) {
      detail.innerHTML = `
        <div><dt>Operador</dt><dd>${data.operator}</dd></div>
        <div><dt>Tenant</dt><dd>${data.tenant_id}</dd></div>
        <div><dt>ML User ID</dt><dd>${data.meli?.user_id ?? "—"}</dd></div>
        <div><dt>Conectado</dt><dd>${data.meli?.connected ? "Sí" : "No"}</dd></div>
      `;
    }
  } catch (err) {
    toast(err.message);
  }
}

async function loadMetrics(refresh = false) {
  const data = await api(`/api/metrics${refresh ? "?refresh=1" : ""}`);
  document.getElementById("kpi-visits").textContent = data.visits_7d ?? "0";
  document.getElementById("kpi-orders").textContent = data.orders_7d ?? "0";
  document.getElementById("kpi-conversion").textContent = `${data.conversion_pct ?? "0"}%`;
  document.getElementById("kpi-items").textContent = data.active_items ?? "0";
  document.getElementById("kpi-revenue").textContent = formatCLP(data.revenue_7d);
  document.getElementById("kpi-questions").textContent = data.pending_questions ?? "0";
}

async function loadItems(sync = false) {
  const data = await api(`/api/items${sync ? "?sync=1" : ""}`);
  const tbody = document.getElementById("items-body");
  if (!tbody) return;
  const items = data.items || [];
  if (!items.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Sin publicaciones</td></tr>';
    return;
  }
  tbody.innerHTML = items
    .map(
      (item) => `
    <tr>
      <td><code>${item.item_id}</code></td>
      <td>${item.title ?? "—"}</td>
      <td>${formatCLP(item.price)}</td>
      <td>${item.available_quantity ?? "—"}</td>
      <td>${item.status ?? "—"}</td>
      <td>
        <button type="button" class="btn btn-secondary btn-sm" data-edit-item="${item.item_id}" data-price="${item.price}" data-qty="${item.available_quantity}">
          Editar stock/precio
        </button>
      </td>
    </tr>`
    )
    .join("");
}

async function loadOrders() {
  const data = await api("/api/orders");
  const tbody = document.getElementById("orders-body");
  const orders = data.orders || [];
  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Sin órdenes</td></tr>';
    return;
  }
  tbody.innerHTML = orders
    .map(
      (o) => `
    <tr>
      <td><code>${o.order_id}</code></td>
      <td>${o.buyer_nickname ?? "—"}</td>
      <td>${formatCLP(o.total_amount)}</td>
      <td>${o.status ?? "—"}</td>
    </tr>`
    )
    .join("");
}

async function loadQuestions(sync = false) {
  const data = await api(`/api/questions${sync ? "?sync=1" : ""}`);
  const list = document.getElementById("questions-list");
  const questions = data.questions || [];
  if (!questions.length) {
    list.innerHTML = '<p class="empty-row">Sin preguntas</p>';
    return;
  }
  list.innerHTML = questions
    .map(
      (q) => `
    <article class="question-card">
      <p class="question-meta">Item ${q.item_id} · ${q.status}</p>
      <p>${q.text ?? ""}</p>
      ${
        q.status === "UNANSWERED"
          ? `<form data-answer-form="${q.question_id}">
              <div class="field"><label for="answer-${q.question_id}">Respuesta</label>
              <textarea id="answer-${q.question_id}" rows="2" required></textarea></div>
              <button type="submit" class="btn btn-primary btn-sm">Enviar respuesta</button>
            </form>`
          : `<p><strong>R:</strong> ${q.answer_text || "—"}</p>`
      }
    </article>`
    )
    .join("");

  list.querySelectorAll("[data-answer-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const questionId = Number(form.dataset.answerForm);
      const text = form.querySelector("textarea").value.trim();
      await api("/api/questions/answer", {
        method: "POST",
        body: JSON.stringify({ question_id: questionId, text }),
      });
      toast("Respuesta enviada");
      loadQuestions();
    });
  });
}

async function loadClaims(sync = false) {
  const data = await api(`/api/claims${sync ? "?sync=1" : ""}`);
  const tbody = document.getElementById("claims-body");
  const claims = data.claims || [];
  if (!claims.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Sin reclamos</td></tr>';
    return;
  }
  tbody.innerHTML = claims
    .map(
      (c) => `
    <tr>
      <td><code>${c.claim_id}</code></td>
      <td>${c.type ?? "—"}</td>
      <td>${c.status ?? "—"}</td>
      <td>${c.resource_id ?? "—"}</td>
    </tr>`
    )
    .join("");
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = link.dataset.section;
    showSection(section);
    if (section === "ventas") loadOrders();
    if (section === "inbox") loadQuestions();
    if (section === "reclamos") loadClaims();
    if (section === "catalogo") loadItems();
  });
});

document.getElementById("refresh-metrics")?.addEventListener("click", async () => {
  await loadMetrics(true);
  toast("Métricas actualizadas");
});

document.getElementById("sync-items")?.addEventListener("click", async () => {
  await loadItems(true);
  toast("Catálogo sincronizado");
});

document.getElementById("sync-questions")?.addEventListener("click", async () => {
  await loadQuestions(true);
  toast("Preguntas sincronizadas");
});

document.getElementById("sync-claims")?.addEventListener("click", async () => {
  await loadClaims(true);
  toast("Reclamos sincronizados");
});

document.getElementById("dev-session")?.addEventListener("click", async () => {
  await ensureDevSession();
  toast("Sesión dev creada");
  loadStatus();
});

function parseMeliError(errors) {
  if (!errors) return "Error desconocido";
  if (typeof errors === "string") return errors;
  if (errors.message === "seller.unable_to_list") {
    return "Cuenta ML no puede publicar: completa tu dirección en Mercado Libre (address_pending).";
  }
  const causes = errors.cause;
  if (Array.isArray(causes)) {
    const hard = causes.filter((c) => c.type === "error");
    if (hard.length) {
      return hard.map((c) => c.message || c.code).join(" | ");
    }
  }
  if (errors.code === "item.pictures.picture_not_found") {
    return "Imagen no válida. Usa URL pública o deja vacío para subir imagen por defecto.";
  }
  return JSON.stringify(errors, null, 2);
}

document.getElementById("load-sample-menu")?.addEventListener("click", async () => {
  const res = await fetch("/fixtures/sample-menu.json");
  const data = await res.json();
  document.getElementById("menu-json").value = JSON.stringify(data, null, 2);
});

document.getElementById("menu-upload-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const out = document.getElementById("menu-upload-result");
  try {
    const payload = JSON.parse(document.getElementById("menu-json").value);
    const items = payload.items ?? payload;
    out.textContent = "Publicando menú...";
    const result = await api("/api/menu/upload", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
    const lines = (result.results ?? []).map((r) => {
      if (r.ok) return `✓ ${r.family_name} → ${r.item_id}`;
      return `✗ ${r.family_name}: ${parseMeliError(r.errors)}`;
    });
    out.textContent = `Publicados: ${result.published} | Fallidos: ${result.failed}\n\n${lines.join("\n")}`;
    if (result.published > 0) {
      toast(`Menú: ${result.published} ítem(s) publicados`);
      loadItems(true);
    } else {
      toast("Menú no publicado — revisa errores abajo");
    }
  } catch (err) {
    out.textContent = err.data ? JSON.stringify(err.data, null, 2) : err.message;
  }
});

document.getElementById("validate-item")?.addEventListener("click", async () => {
  const form = document.getElementById("item-form");
  const body = Object.fromEntries(new FormData(form));
  body.price = Number(body.price);
  body.available_quantity = Number(body.available_quantity);
  delete body.title;
  const result = await api("/api/items/validate", { method: "POST", body: JSON.stringify(body) });
  const msg = document.getElementById("item-form-message");
  msg.textContent = result.valid ? "Validación OK — listo para publicar" : parseMeliError(result.errors);
});

document.getElementById("item-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = Object.fromEntries(new FormData(form));
  body.price = Number(body.price);
  body.available_quantity = Number(body.available_quantity);
  delete body.title;
  const result = await api("/api/items", { method: "POST", body: JSON.stringify(body) });
  const msg = document.getElementById("item-form-message");
  if (result.ok) {
    msg.textContent = `Publicado: ${result.item?.id}`;
    form.reset();
    loadItems();
  } else {
    msg.textContent = parseMeliError(result.errors);
  }
});

document.getElementById("items-body")?.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-edit-item]");
  if (!btn) return;
  const itemId = btn.dataset.editItem;
  const price = prompt("Nuevo precio CLP:", btn.dataset.price);
  const qty = prompt("Nuevo stock:", btn.dataset.qty);
  if (price == null || qty == null) return;
  await api(`/api/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ price: Number(price), available_quantity: Number(qty) }),
  });
  toast("Ítem actualizado");
  loadItems();
});

(async function init() {
  await ensureDevSession();
  const hash = location.hash.replace("#", "") || "resumen";
  showSection(hash in { resumen: 1, catalogo: 1, ventas: 1, inbox: 1, reclamos: 1, conexion: 1 } ? hash : "resumen");
  await loadStatus();
  await loadMetrics();
  await loadItems();
  if (location.search.includes("oauth=connected")) toast("Mercado Libre conectado");
  if (location.search.includes("oauth_error")) toast("Error OAuth: " + new URLSearchParams(location.search).get("oauth_error"));
})();
