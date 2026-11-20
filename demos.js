/* ==========================================================================
   Demos interactivas de la landing.
   Todo corre en el navegador con DATOS FICTICIOS: no hay backend ni
   información de clientes. Cada demo ilustra el mecanismo de la solución.
   Cada entrada de DEMOS recibe el contenedor donde dibujarse.
   ========================================================================== */
const DEMOS = (function () {
  // ---------- utilidades ----------
  const $ = (s, el) => el.querySelector(s);
  const $$ = (s, el) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const nf = (n, d = 0) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const money = (n) => "$ " + nf(Math.round(n));
  const mill = (n) => "$ " + nf(n, 1) + " M";
  const pct = (n, d = 1) => nf(n * 100, d) + " %";
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function rng(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const pl = (n, sing, plur) => n + " " + (n === 1 ? sing : plur || sing + "s");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Pestañas internas de una demo
  function subtabs(root, tabs) {
    root.innerHTML = `<div class="subtabs" role="tablist">${tabs.map((t, i) => `<button class="subtab" role="tab" aria-selected="${i === 0}" data-i="${i}">${esc(t.label)}</button>`).join("")}</div><div class="subbody"></div>`;
    const body = $(".subbody", root);
    const show = (i) => {
      $$(".subtab", root).forEach((b) => b.setAttribute("aria-selected", +b.dataset.i === i));
      body.innerHTML = "";
      tabs[i].render(body);
    };
    $$(".subtab", root).forEach((b) => b.addEventListener("click", () => show(+b.dataset.i)));
    show(0);
    return show;
  }

  // Chat genérico con panel de trazabilidad
  function chatUI(root, cfg) {
    root.innerHTML = `
      <div class="demo-grid cols-2">
        <div class="panel">
          <h5>${esc(cfg.titulo)}</h5>
          <div class="sugs">${cfg.sugs.map((s) => `<button class="sug">${esc(s)}</button>`).join("")}</div>
          <div class="chat">
            <div class="chat-log" aria-live="polite"></div>
            <form class="chat-form">
              <input type="text" aria-label="Pregunta" placeholder="${esc(cfg.placeholder)}" autocomplete="off" />
              <button class="btn btn-primary btn-sm" type="submit">Enviar</button>
            </form>
          </div>
        </div>
        <div class="panel">
          <h5>Qué hizo el sistema</h5>
          <div class="trace-box"><p class="muted">Hacé una pregunta para ver cómo se interpreta y qué consulta se ejecuta.</p></div>
          <p class="muted" style="margin-top:12px">${cfg.nota}</p>
        </div>
      </div>`;
    const log = $(".chat-log", root), input = $("input", root), traceBox = $(".trace-box", root);
    const ctx = {};
    function add(cls, text, opts) {
      const m = document.createElement("div");
      m.className = "msg " + cls;
      m.textContent = text;
      if (opts && opts.length) {
        const o = document.createElement("div");
        o.className = "opts";
        opts.forEach((op) => {
          const b = document.createElement("button");
          b.className = "btn btn-ghost btn-sm"; b.type = "button"; b.textContent = op;
          b.addEventListener("click", () => send(op));
          o.appendChild(b);
        });
        m.appendChild(o);
      }
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }
    function send(text) {
      text = text.trim();
      if (!text) return;
      add("user", text);
      const wait = add("bot", "…");
      setTimeout(() => {
        if (!root.isConnected) return;
        const r = cfg.handle(text, ctx);
        wait.remove();
        add("bot", r.reply, r.opts);
        traceBox.innerHTML = r.trace;
      }, 450);
    }
    add("bot", cfg.saludo);
    $("form", root).addEventListener("submit", (e) => { e.preventDefault(); send(input.value); input.value = ""; });
    $$(".sug", root).forEach((b) => b.addEventListener("click", () => send(b.textContent)));
  }
  const json = (o) => esc(JSON.stringify(o, null, 2)).replace(/&quot;([^&]+)&quot;:/g, '<span class="k">"$1"</span>:');

  /* ======================================================================
     1. INDUSTRIA — Rentabilidad (CVU) y Flujo de fondos a 13 semanas
     ====================================================================== */
  function costeo(root) {
    subtabs(root, [
      { label: "Vista de Rentabilidad", render: rentabilidad },
      { label: "Vista de Finanzas · 13 semanas", render: flujo },
    ]);
  }

  function rentabilidad(el) {
    const s = { q: 40, p: 1.8, cv: 58, cf: 25, intereses: 3 }; // precio y montos en millones
    el.innerHTML = `
      <div class="demo-grid side">
        <div class="panel">
          <h5>Supuestos del mes</h5>
          <div class="field"><label>Unidades vendidas <output data-o="q"></output></label><input type="range" data-k="q" min="10" max="80" step="1"></div>
          <div class="field"><label>Precio promedio por equipo <output data-o="p"></output></label><input type="range" data-k="p" min="1" max="3" step="0.05"></div>
          <div class="field"><label>Costo variable sobre ventas <output data-o="cv"></output></label><input type="range" data-k="cv" min="35" max="80" step="1"></div>
          <div class="field"><label>Costos fijos mensuales <output data-o="cf"></output></label><input type="range" data-k="cf" min="10" max="45" step="0.5"></div>
          <div class="field"><label>Carga financiera <output data-o="intereses"></output></label><input type="range" data-k="intereses" min="0" max="10" step="0.5"></div>
          <p class="muted">En el sistema real estos valores salen del ERP: cada cuenta se clasifica como variable, fija o mixta con una regla configurable y con historial de vigencia.</p>
        </div>
        <div class="panel">
          <h5>Resultado económico de gestión</h5>
          <div class="kpis k3" data-kpis></div>
          <div style="margin-top:16px">
            <div class="row" style="justify-content:space-between"><span class="muted">Ventas del mes frente al punto de equilibrio</span><span class="muted" data-pe-label></span></div>
            <svg class="chart" viewBox="0 0 600 70" role="img" aria-label="Ventas frente al punto de equilibrio" data-bar></svg>
          </div>
          <div data-alert></div>
        </div>
      </div>`;
    const draw = () => {
      const ventas = s.q * s.p, mcPct = 1 - s.cv / 100, mc = ventas * mcPct;
      const uo = mc - s.cf, pe = s.cf / mcPct, peU = pe / s.p;
      const gao = uo > 0 ? mc / uo : null, cob = s.intereses > 0 ? uo / s.intereses : null;
      $('[data-o="q"]', el).textContent = s.q + " u.";
      $('[data-o="p"]', el).textContent = mill(s.p);
      $('[data-o="cv"]', el).textContent = s.cv + " %";
      $('[data-o="cf"]', el).textContent = mill(s.cf);
      $('[data-o="intereses"]', el).textContent = mill(s.intereses);
      $("[data-kpis]", el).innerHTML = [
        ["Ventas", mill(ventas), ""],
        ["Margen de contribución", mill(mc), pct(mcPct, 0) + " de las ventas"],
        ["Utilidad operativa", mill(uo), uo >= 0 ? "después de costos fijos" : "pérdida operativa"],
        ["Punto de equilibrio", mill(pe), nf(Math.ceil(peU)) + " unidades por mes"],
        ["Apalancamiento operativo", gao ? nf(gao, 1) + "×" : "—", gao ? "si las ventas caen 10 %, la utilidad cae " + nf(gao * 10, 0) + " %" : "sin utilidad operativa"],
        ["Cobertura de carga financiera", cob !== null ? nf(cob, 1) + "×" : "—", "utilidad operativa / intereses"],
      ].map((k) => `<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join("");
      const max = Math.max(ventas, pe) * 1.15, W = 600, x = (v) => (v / max) * W;
      $("[data-bar]", el).innerHTML = `
        <rect x="0" y="22" width="${W}" height="22" rx="6" style="fill:var(--surface-2)"/>
        <rect x="0" y="22" width="${x(ventas)}" height="22" rx="6" style="fill:${ventas >= pe ? "var(--ok)" : "var(--bad)"}"/>
        <line x1="${x(pe)}" x2="${x(pe)}" y1="12" y2="54" style="stroke:var(--ink);stroke-width:2;stroke-dasharray:4 3"/>
        <text x="${Math.min(x(pe) + 6, W - 130)}" y="10">Punto de equilibrio</text>
        <text x="0" y="64">0</text><text x="${W}" y="64" text-anchor="end">${mill(max)}</text>`;
      const margen = (ventas - pe) / ventas;
      $("[data-pe-label]", el).textContent = ventas >= pe ? "Margen de seguridad: " + pct(margen, 0) : "Faltan " + mill(pe - ventas) + " de ventas";
      $("[data-alert]", el).innerHTML = uo < 0
        ? `<div class="alert alert-bad">Alerta: con este volumen no se cubren los costos fijos. Hacen falta ${nf(Math.ceil(peU - s.q))} unidades más por mes.</div>`
        : cob !== null && cob < 1.5
          ? `<div class="alert alert-warn">Atención: la utilidad operativa cubre apenas ${nf(cob, 1)} veces la carga financiera.</div>`
          : margen < 0.1
            ? `<div class="alert alert-warn">Atención: el margen de seguridad es menor al 10 %. Una caída chica de ventas lleva a pérdida.</div>`
            : `<div class="alert alert-ok">Las ventas superan el punto de equilibrio con un margen de seguridad de ${pct(margen, 0)}.</div>`;
    };
    $$("input[type=range]", el).forEach((i) => { i.value = s[i.dataset.k]; i.addEventListener("input", () => { s[i.dataset.k] = +i.value; draw(); }); });
    draw();
  }

  function flujo(el) {
    const s = { saldo: 10, linea: 10, demora: false, concentra: false };
    const COBROS = [18, 12, 22, 9, 14, 25, 10, 13, 20, 11, 16, 24, 12];
    const PAGOS = [15, 16, 14, 18, 17, 15, 21, 14, 16, 15, 17, 15, 14];
    el.innerHTML = `
      <div class="demo-grid side">
        <div class="panel">
          <h5>Escenario</h5>
          <div class="field"><label>Saldo inicial en bancos <output data-o="saldo"></output></label><input type="range" data-k="saldo" min="0" max="30" step="1"></div>
          <div class="field"><label>Financiación disponible <output data-o="linea"></output></label><input type="range" data-k="linea" min="0" max="25" step="1"></div>
          <label class="check"><input type="checkbox" data-c="demora"><span>El cliente principal paga tres semanas tarde</span></label>
          <label class="check"><input type="checkbox" data-c="concentra"><span>Se concentran vencimientos de cheques en la semana 7</span></label>
          <p class="muted">En el sistema real la proyección se arma sola con órdenes de compra y venta, cartera de cheques y cronograma de deuda del ERP.</p>
        </div>
        <div class="panel">
          <h5>Saldo de caja proyectado · próximas 13 semanas</h5>
          <svg class="chart" viewBox="0 0 640 250" role="img" aria-label="Saldo proyectado por semana" data-chart></svg>
          <div class="kpis k3" style="margin-top:12px" data-kpis></div>
          <div data-alerts></div>
        </div>
      </div>`;
    const draw = () => {
      const cob = [...COBROS], pag = [...PAGOS];
      if (s.demora) { cob[2] -= 12; cob[5] += 12; }
      if (s.concentra) pag[6] += 8;
      let acc = s.saldo; const saldos = cob.map((c, i) => (acc += c - pag[i]));
      const min = Math.min(...saldos), minW = saldos.indexOf(min) + 1;
      $('[data-o="saldo"]', el).textContent = mill(s.saldo);
      $('[data-o="linea"]', el).textContent = mill(s.linea);
      // gráfico
      const W = 640, H = 250, padL = 36, padB = 26, padT = 12;
      const lo = Math.min(-s.linea, min, 0) - 2, hi = Math.max(...saldos, 5) + 2;
      const y = (v) => padT + ((hi - v) / (hi - lo)) * (H - padT - padB);
      const bw = (W - padL) / 13;
      let g = "";
      for (let t = Math.ceil(lo / 10) * 10; t <= hi; t += 10) g += `<line x1="${padL}" x2="${W}" y1="${y(t)}" y2="${y(t)}" style="stroke:var(--line)"/><text x="${padL - 6}" y="${y(t) + 4}" text-anchor="end">${t}</text>`;
      saldos.forEach((v, i) => {
        const x = padL + i * bw + 5, y0 = y(0), yv = y(v);
        const color = v < -s.linea ? "var(--bad)" : v < 0 ? "var(--accent)" : "var(--brand)";
        g += `<rect x="${x}" y="${Math.min(y0, yv)}" width="${bw - 10}" height="${Math.max(Math.abs(yv - y0), 1)}" rx="3" style="fill:${color}"><title>Semana ${i + 1}: ${mill(v)}</title></rect>`;
        g += `<text x="${x + (bw - 10) / 2}" y="${H - 8}" text-anchor="middle">S${i + 1}</text>`;
      });
      g += `<line x1="${padL}" x2="${W}" y1="${y(0)}" y2="${y(0)}" style="stroke:var(--ink-3);stroke-width:1.5"/>`;
      if (s.linea > 0) g += `<line x1="${padL}" x2="${W}" y1="${y(-s.linea)}" y2="${y(-s.linea)}" style="stroke:var(--bad);stroke-dasharray:5 4"/><text x="${W - 4}" y="${y(-s.linea) - 5}" text-anchor="end">Límite de financiación</text>`;
      $("[data-chart]", el).innerHTML = g;
      const need = min < 0 ? -min : 0;
      $("[data-kpis]", el).innerHTML = [
        ["Pozo de caja más profundo", mill(min), "semana " + minW],
        ["Necesidad de financiación", need ? mill(need) : "No requiere", need ? pct(s.linea ? need / s.linea : 9.99, 0) + " de lo disponible" : ""],
        ["Saldo al cierre", mill(saldos[12]), "semana 13"],
      ].map((k) => `<div class="kpi"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join("");
      const al = [];
      if (need > s.linea) al.push(["bad", `Alerta de financiamiento: en la semana ${minW} faltan ${mill(need)} y la financiación disponible es de ${mill(s.linea)}.`]);
      else if (need > 0) al.push(["warn", `Alerta de liquidez: la caja queda en negativo en la semana ${minW}. Se cubre con la financiación disponible (${mill(need)} de ${mill(s.linea)}).`]);
      else if (min < 5) al.push(["info", `Colchón bajo: en la semana ${minW} el saldo baja a ${mill(min)}.`]);
      else al.push(["ok", `Caja cubierta en las 13 semanas. Excedente mínimo de ${mill(min)}: se puede evaluar su colocación a corto plazo.`]);
      if (s.concentra) al.push(["warn", "Concentración de vencimientos: la semana 7 acumula pagos por encima del promedio."]);
      $("[data-alerts]", el).innerHTML = al.map((a) => `<div class="alert alert-${a[0]}">${a[1]}</div>`).join("");
    };
    $$("input[type=range]", el).forEach((i) => { i.value = s[i.dataset.k]; i.addEventListener("input", () => { s[i.dataset.k] = +i.value; draw(); }); });
    $$("input[type=checkbox]", el).forEach((i) => i.addEventListener("change", () => { s[i.dataset.c] = i.checked; draw(); }));
    draw();
  }

  /* ======================================================================
     2. EXPORTACIÓN — Cruce de calidades (optimización) y lectura de informes
     ====================================================================== */
  function cruce(root) {
    subtabs(root, [
      { label: "Cruce de calidades", render: cruceCalidades },
      { label: "Lectura de informes de laboratorio", render: laboratorio },
    ]);
  }

  function cruceCalidades(el) {
    // color en mm Pfund: menor = más clara = mayor valor
    const LOTES = [
      { id: "L-101", color: 12 }, { id: "L-106", color: 15 }, { id: "L-102", color: 18 }, { id: "L-103", color: 25 },
      { id: "L-104", color: 34 }, { id: "L-105", color: 48 }, { id: "L-107", color: 62 },
    ];
    const CONTRATOS = [
      { id: "C-EU1", destino: "Europa · premium", max: 17 },
      { id: "C-EU2", destino: "Europa", max: 20 },
      { id: "C-AS1", destino: "Asia", max: 35 },
      { id: "C-NA1", destino: "Norteamérica", max: 50 },
      { id: "C-NA2", destino: "Norteamérica · industria", max: 85 },
    ];
    const lote = (id) => LOTES.find((l) => l.id === id);
    let asign = { "C-EU1": null, "C-EU2": "L-102", "C-AS1": "L-103", "C-NA1": "L-101", "C-NA2": "L-106" };
    let propuesta = null;

    function optimizar() {
      let best = null; const used = new Set(), cur = {};
      (function rec(i, ful, waste) {
        if (i === CONTRATOS.length) {
          if (!best || ful > best.ful || (ful === best.ful && waste < best.waste)) best = { ful, waste, asign: { ...cur } };
          return;
        }
        const c = CONTRATOS[i];
        for (const l of LOTES) {
          if (used.has(l.id) || l.color > c.max) continue;
          used.add(l.id); cur[c.id] = l.id;
          rec(i + 1, ful + 1, waste + (c.max - l.color));
          used.delete(l.id);
        }
        cur[c.id] = null; rec(i + 1, ful, waste);
      })(0, 0, 0);
      return best.asign;
    }
    const resumen = (a) => {
      let ful = 0, waste = 0;
      CONTRATOS.forEach((c) => { if (a[c.id]) { ful++; waste += c.max - lote(a[c.id]).color; } });
      const libres = LOTES.filter((l) => !Object.values(a).includes(l.id)).map((l) => l.id);
      return { ful, waste, libres };
    };
    const kpis = (r) => `
      <div class="kpis k3">
        <div class="kpi"><span>Contratos cubiertos</span><b>${r.ful} / ${CONTRATOS.length}</b></div>
        <div class="kpi"><span>Calidad regalada</span><b>${r.waste} mm</b><small>Pfund por encima de lo exigido</small></div>
        <div class="kpi"><span>Lotes sin asignar</span><b>${r.libres.length}</b><small>${r.libres.join(", ") || "—"}</small></div>
      </div>`;
    const regalo = (c, id) => {
      if (!id) return `<span class="pill p-bad">Sin lote</span>`;
      const d = c.max - lote(id).color;
      return `<span class="pill ${d > 15 ? "p-bad" : d > 5 ? "p-warn" : "p-ok"}">+${d} mm</span>`;
    };

    function draw() {
      const r = resumen(asign);
      el.innerHTML = `
        <div class="demo-grid cols-2">
          <div class="panel">
            <h5>Asignación actual (manual)</h5>
            <div class="scroll-x"><table class="t">
              <thead><tr><th>Contrato</th><th class="num">Color máx.</th><th>Lote</th><th>Regalo</th></tr></thead>
              <tbody>${CONTRATOS.map((c) => `
                <tr><td><b>${c.id}</b><br><span class="muted">${c.destino}</span></td><td class="num">≤ ${c.max} mm</td>
                <td><select data-c="${c.id}" aria-label="Lote para ${c.id}"><option value="">— sin lote —</option>${LOTES.filter((l) => l.color <= c.max).map((l) => `<option value="${l.id}" ${asign[c.id] === l.id ? "selected" : ""}>${l.id} · ${l.color} mm</option>`).join("")}</select></td>
                <td>${regalo(c, asign[c.id])}</td></tr>`).join("")}
              </tbody></table></div>
            <div style="margin-top:12px">${kpis(r)}</div>
            ${r.ful < CONTRATOS.length ? `<div class="alert alert-bad">Hay contratos sin lote disponible mientras lotes claros están asignados a destinos que no pagan esa calidad.</div>` : ""}
            <div class="row" style="margin-top:12px"><button class="btn btn-primary btn-sm" data-opt>Proponer asignación óptima</button><span class="muted">Podés cambiar los lotes a mano y volver a optimizar.</span></div>
          </div>
          <div class="panel">
            <h5>Propuesta del motor</h5>
            ${propuesta ? propuestaHTML() : `<p class="muted">El motor plantea la asignación como un problema de programación lineal entera: cada lote va a un solo contrato, solo si cumple su calidad mínima, y se minimiza la calidad entregada por encima de lo comprometido.</p><p class="muted">Corre en segundo plano y devuelve una propuesta comparada con la asignación actual. <b>El sistema propone y la persona decide.</b></p>`}
          </div>
        </div>`;
      $$("select[data-c]", el).forEach((sel) => sel.addEventListener("change", () => {
        const v = sel.value || null;
        if (v) Object.keys(asign).forEach((k) => { if (asign[k] === v) asign[k] = null; });
        asign[sel.dataset.c] = v; propuesta = null; draw();
      }));
      $("[data-opt]", el).addEventListener("click", () => { propuesta = optimizar(); draw(); });
      const ap = $("[data-aprobar]", el), de = $("[data-descartar]", el);
      if (ap) ap.addEventListener("click", () => { asign = { ...propuesta }; propuesta = null; draw(); });
      if (de) de.addEventListener("click", () => { propuesta = null; draw(); });
    }
    function propuestaHTML() {
      const a = resumen(asign), p = resumen(propuesta);
      const igual = CONTRATOS.every((c) => asign[c.id] === propuesta[c.id]);
      return `
        <div class="scroll-x"><table class="t">
          <thead><tr><th>Contrato</th><th>Actual</th><th>Propuesto</th><th>Regalo</th></tr></thead>
          <tbody>${CONTRATOS.map((c) => `
            <tr class="${asign[c.id] !== propuesta[c.id] ? "hl" : ""}"><td><b>${c.id}</b></td><td>${asign[c.id] || "—"}</td><td><b>${propuesta[c.id] || "—"}</b></td><td>${regalo(c, propuesta[c.id])}</td></tr>`).join("")}
          </tbody></table></div>
        <div style="margin-top:12px">${kpis(p)}</div>
        ${igual ? `<div class="alert alert-ok">La asignación actual ya es óptima.</div>` : `
        <div class="alert alert-ok">Cubre ${p.ful - a.ful > 0 ? (p.ful - a.ful) + " contrato(s) más y " : ""}reduce la calidad regalada de ${a.waste} a ${p.waste} mm. Los lotes claros que quedan libres pueden ofrecerse a destinos de mayor precio.</div>
        <div class="row" style="margin-top:12px"><button class="btn btn-primary btn-sm" data-aprobar>Aprobar propuesta</button><button class="btn btn-ghost btn-sm" data-descartar>Descartar</button></div>`}
        <p class="muted" style="margin-top:10px">El impacto económico se calcula con el diferencial de precio de cada contrato.</p>`;
    }
    draw();
  }

  function laboratorio(el) {
    const LIMITES = {
      "Europa": { Humedad: ["≤", 18, "%"], HMF: ["≤", 40, "mg/kg"], Diastasa: ["≥", 8, "°Schade"], "Residuo A": ["≤", 0.05, "mg/kg"], "Antibióticos": ["nd"] },
      "Norteamérica": { Humedad: ["≤", 18.6, "%"], HMF: ["≤", 40, "mg/kg"], Diastasa: ["≥", 8, "°Schade"], "Residuo A": ["≤", 0.1, "mg/kg"], "Antibióticos": ["nd"] },
    };
    const VALORES = { Humedad: 17.2, HMF: 12, Diastasa: 14, "Residuo A": 0.06, "Antibióticos": "No detectado" };
    const PASOS = ["Correo detectado en la casilla", "PDF adjunto archivado", "Extracción de datos con modelo de lenguaje", "Alta o actualización de la muestra", "Validación contra límites del destino"];
    let destino = "Europa", paso = -1;
    function draw() {
      const lim = LIMITES[destino];
      el.innerHTML = `
        <div class="demo-grid side">
          <div class="panel">
            <h5>Flujo automático</h5>
            <div class="pipe">${PASOS.map((p, i) => `<div class="pipe-step ${i <= paso ? "on" : ""}"><i>${i <= paso ? "✓" : i + 1}</i>${p}</div>`).join("")}</div>
            <button class="btn btn-primary btn-sm" data-run ${paso >= 0 && paso < PASOS.length - 1 ? "disabled" : ""}>Simular llegada de un informe</button>
            <p class="muted" style="margin-top:12px">El agente cubre 25 formatos de informe de 3 laboratorios, incluidos análisis repartidos en varios PDF que se consolidan en un registro.</p>
          </div>
          <div class="panel">
            <div class="row" style="justify-content:space-between;margin-bottom:10px">
              <h5 style="margin:0">Lote L-104 · resultado extraído</h5>
              <div class="field" style="margin:0"><select data-dest aria-label="Destino">${Object.keys(LIMITES).map((d) => `<option ${d === destino ? "selected" : ""}>${d}</option>`).join("")}</select></div>
            </div>
            ${paso < 2 ? `<p class="muted">Todavía no hay datos: simulá la llegada de un informe.</p>` : `
            <div class="scroll-x"><table class="t">
              <thead><tr><th>Parámetro</th><th class="num">Valor</th><th>Límite ${destino}</th><th>Estado</th></tr></thead>
              <tbody>${Object.keys(VALORES).map((k) => {
                const v = VALORES[k], l = lim[k];
                let ok, ltxt;
                if (l[0] === "nd") { ok = v === "No detectado"; ltxt = "No detectable"; }
                else { ok = l[0] === "≤" ? v <= l[1] : v >= l[1]; ltxt = `${l[0]} ${nf(l[1], l[1] < 1 ? 2 : 1)} ${l[2]}`; }
                const val = typeof v === "number" ? nf(v, v < 1 ? 2 : 1) : v;
                return `<tr><td>${k}</td><td class="num">${val}</td><td>${ltxt}</td><td>${paso >= 4 ? `<span class="pill ${ok ? "p-ok" : "p-bad"}">${ok ? "Cumple" : "Fuera de límite"}</span>` : `<span class="pill p-mute">Pendiente</span>`}</td></tr>`;
              }).join("")}</tbody></table></div>
            ${paso >= 4 ? (destino === "Europa"
              ? `<div class="alert alert-bad">El lote no cumple un límite para Europa. El sistema lo marca antes de que se asigne a un contrato de ese destino.</div>`
              : `<div class="alert alert-ok">El lote cumple todos los límites para Norteamérica.</div>`) : ""}
            <p class="muted" style="margin-top:10px">Parámetros y límites ilustrativos. Los límites reales se configuran por destino desde la interfaz.</p>`}
          </div>
        </div>`;
      $("[data-dest]", el).addEventListener("change", (e) => { destino = e.target.value; draw(); });
      $("[data-run]", el).addEventListener("click", () => {
        paso = 0; draw();
        const tick = () => { if (!el.isConnected || paso >= PASOS.length - 1) return; paso++; draw(); setTimeout(tick, 650); };
        setTimeout(tick, 650);
      });
    }
    draw();
  }

  /* ======================================================================
     3. FINANZAS — Comparador de renta fija contra caución
     ====================================================================== */
  function renta(root) {
    const INST = [
      { n: "Letra A", tipo: "Capitalizable · tasa fija", d: 30, p: 97.6, vf: 100 },
      { n: "Letra B", tipo: "Capitalizable · tasa fija", d: 45, p: 96.5, vf: 100 },
      { n: "Letra C", tipo: "Cupón cero", d: 58, p: 95.0, vf: 100 },
      { n: "Letra D", tipo: "Capitalizable · tasa fija", d: 91, p: 92.4, vf: 100 },
      { n: "Bono E", tipo: "Cupón cero", d: 120, p: 89.0, vf: 100 },
      { n: "Bono F", tipo: "Tasa variable (estimada)", d: 182, p: 100.5, vf: 117.2 },
    ];
    const s = { caucion: 31, plazo: 90, monto: 8 };
    root.innerHTML = `
      <div class="demo-grid side">
        <div class="panel">
          <h5>Excedente a colocar</h5>
          <div class="field"><label>Monto disponible <output data-o="monto"></output></label><input type="range" data-k="monto" min="1" max="30" step="1"></div>
          <div class="field"><label>Plazo que la caja deja libre <output data-o="plazo"></output></label><input type="range" data-k="plazo" min="14" max="182" step="7"></div>
          <div class="field"><label>Tasa de caución (TNA) <output data-o="caucion"></output></label><input type="range" data-k="caucion" min="20" max="45" step="0.5"></div>
          <p class="muted">El monto y el plazo salen de la proyección de caja a 13 semanas. En el producto, fichas técnicas y precios se descargan del mercado y la tasa de caución se toma del día.</p>
        </div>
        <div class="panel">
          <h5>Alternativas ordenadas por rendimiento</h5>
          <div class="scroll-x"><table class="t">
            <thead><tr><th>Instrumento</th><th class="num">Días</th><th class="num">Precio</th><th class="num">TNA</th><th class="num">TEA</th><th class="num">vs. caución</th><th class="num">Resultado</th></tr></thead>
            <tbody data-rows></tbody>
          </table></div>
          <div data-msg></div>
          <p class="muted" style="margin-top:10px">Instrumentos y precios ficticios. Herramienta de información y comparación: no constituye asesoramiento ni garantiza resultados.</p>
        </div>
      </div>`;
    const draw = () => {
      $('[data-o="monto"]', root).textContent = mill(s.monto);
      $('[data-o="plazo"]', root).textContent = s.plazo + " días";
      $('[data-o="caucion"]', root).textContent = nf(s.caucion, 1) + " %";
      const teaC = Math.pow(1 + s.caucion / 100 / 365, 365) - 1;
      const rows = INST.map((i) => {
        const r = i.vf / i.p;
        return { ...i, tna: (r - 1) * 365 / i.d, tea: Math.pow(r, 365 / i.d) - 1, cabe: i.d <= s.plazo, gan: s.monto * (r - 1) };
      }).sort((a, b) => (b.cabe - a.cabe) || (b.tea - a.tea));
      const mejor = rows.find((r) => r.cabe);
      $("[data-rows]", root).innerHTML = rows.map((r) => {
        const dif = (r.tea - teaC) * 100;
        return `<tr class="${r === mejor && dif > 0 ? "hl" : r.cabe ? "" : "dim"}"><td><b>${r.n}</b><br><span class="muted">${r.tipo}</span></td><td class="num">${r.d}</td><td class="num">${nf(r.p, 1)}</td><td class="num">${pct(r.tna)}</td><td class="num">${pct(r.tea)}</td><td class="num"><span class="pill ${dif > 0 ? "p-ok" : "p-bad"}">${dif > 0 ? "+" : ""}${nf(dif, 1)} pp</span></td><td class="num">${r.cabe ? mill(r.gan) : "excede el plazo"}</td></tr>`;
      }).join("") + `<tr><td><b>Caución</b><br><span class="muted">Renovación diaria</span></td><td class="num">1</td><td class="num">—</td><td class="num">${pct(s.caucion / 100)}</td><td class="num">${pct(teaC)}</td><td class="num">—</td><td class="num">${mill(s.monto * (Math.pow(1 + s.caucion / 100 / 365, s.plazo) - 1))}</td></tr>`;
      $("[data-msg]", root).innerHTML = !mejor
        ? `<div class="alert alert-info">Ningún instrumento vence dentro del plazo disponible: la caución es la referencia.</div>`
        : mejor.tea > teaC
          ? `<div class="alert alert-ok">Dentro de ${s.plazo} días, ${mejor.n} rinde ${nf((mejor.tea - teaC) * 100, 1)} puntos más de tasa efectiva que la caución.</div>`
          : `<div class="alert alert-info">Con esta tasa de caución, ningún instrumento dentro del plazo la supera.</div>`;
    };
    $$("input[type=range]", root).forEach((i) => { i.value = s[i.dataset.k]; i.addEventListener("input", () => { s[i.dataset.k] = +i.value; draw(); }); });
    draw();
  }

  /* ======================================================================
     Datos ficticios de gobierno provincial (compartidos)
     ====================================================================== */
  const LOCS = [
    { n: "Villa del Lago", d: "Sierras", x: 10, y: 12, pob: 18400 },
    { n: "San Roque Norte", d: "Sierras", x: 22, y: 18, pob: 9200 },
    { n: "San Roque Sur", d: "Llanura", x: 26, y: 40, pob: 6100 },
    { n: "Los Algarrobos", d: "Llanura", x: 48, y: 52, pob: 31500 },
    { n: "Cerro Azul", d: "Sierras", x: 5, y: 30, pob: 4300 },
    { n: "Santa Elena", d: "Norte", x: 40, y: 5, pob: 12700 },
    { n: "La Cañada", d: "Norte", x: 60, y: 10, pob: 7800 },
    { n: "Paso Viejo", d: "Norte", x: 75, y: 22, pob: 2900 },
  ];

  /* ======================================================================
     4. GOBIERNO — Plataforma institucional: resumen territorial por rol
     ====================================================================== */
  function plataforma(root) {
    const r = rng(7);
    const PROGS = [
      { area: "Vivienda", prog: "Pavimento urbano", fuente: "Módulo propio" },
      { area: "Vivienda", prog: "Programa de vivienda", fuente: "Módulo propio" },
      { area: "Vivienda", prog: "Tierras y loteos", fuente: "Módulo propio" },
      { area: "Infraestructura", prog: "Red de gas", fuente: "Planilla sincronizada" },
      { area: "Secretaría General", prog: "Aportes comprometidos", fuente: "Planilla sincronizada" },
    ];
    const EST = ["En trámite", "En ejecución", "Demorado", "Finalizado"];
    const DIM = ["Completo", "En curso", "Observado", "Pendiente"];
    const data = {};
    LOCS.forEach((l) => {
      data[l.n] = {
        progs: PROGS.filter(() => r() > 0.3).map((p) => ({ ...p, estado: pick(r, EST), jur: pick(r, DIM), tec: pick(r, DIM), fin: pick(r, DIM) })),
        gestiones: Math.floor(r() * 40) + 4, abiertas: Math.floor(r() * 12),
      };
    });
    const ROLES = {
      autoridad: { label: "Autoridad · lectura transversal", areas: null, gestiones: true },
      vivienda: { label: "Operador · Vivienda", areas: ["Vivienda"], gestiones: false },
      privada: { label: "Operador · Secretaría Privada", areas: [], gestiones: true },
    };
    const s = { loc: LOCS[0].n, rol: "autoridad" };
    const pill = (v) => `<span class="pill ${{ "Finalizado": "p-ok", "Completo": "p-ok", "En ejecución": "p-info", "En curso": "p-info", "Demorado": "p-bad", "Observado": "p-bad" }[v] || "p-mute"}">${v}</span>`;
    function draw() {
      const rol = ROLES[s.rol], d = data[s.loc], loc = LOCS.find((l) => l.n === s.loc);
      const progs = d.progs.filter((p) => !rol.areas || rol.areas.includes(p.area));
      const ocultos = d.progs.length - progs.length;
      root.innerHTML = `
        <div class="demo-grid side">
          <div class="panel">
            <h5>Ingresar como</h5>
            <div class="field"><select data-rol aria-label="Rol">${Object.keys(ROLES).map((k) => `<option value="${k}" ${k === s.rol ? "selected" : ""}>${ROLES[k].label}</option>`).join("")}</select></div>
            <h5 style="margin-top:16px">Localidad</h5>
            <div style="display:grid;gap:6px">${LOCS.map((l) => `<button class="sug" style="border-radius:8px;${l.n === s.loc ? "border-color:var(--brand);color:var(--ink);background:var(--brand-soft)" : ""}" data-loc="${esc(l.n)}">${l.n} <span class="muted">· ${l.d}</span></button>`).join("")}</div>
            <p class="muted" style="margin-top:12px">Los permisos se definen en la base, no en el token: un cambio de rol tiene efecto inmediato.</p>
          </div>
          <div class="panel">
            <div class="row" style="justify-content:space-between"><h5 style="margin:0">Ficha territorial · ${esc(loc.n)}</h5><span class="muted">Departamento ${loc.d} · ${nf(loc.pob)} hab.</span></div>
            <div class="kpis k3" style="margin:12px 0">
              <div class="kpi"><span>Programas visibles</span><b>${progs.length}</b><small>${ocultos ? ocultos + " ocultos por rol" : "todas las áreas"}</small></div>
              <div class="kpi"><span>Gestiones registradas</span><b>${rol.gestiones ? d.gestiones : "—"}</b><small>${rol.gestiones ? d.abiertas + " abiertas" : "sin permiso"}</small></div>
              <div class="kpi"><span>Con alerta</span><b>${progs.filter((p) => p.estado === "Demorado" || [p.jur, p.tec, p.fin].includes("Observado")).length}</b><small>demorados u observados</small></div>
            </div>
            ${progs.length ? `<div class="scroll-x"><table class="t">
              <thead><tr><th>Programa</th><th>Estado</th><th>Jurídico</th><th>Técnico</th><th>Financiero</th></tr></thead>
              <tbody>${progs.map((p) => `<tr><td><b>${p.prog}</b><br><span class="muted">${p.area} · ${p.fuente}</span></td><td>${pill(p.estado)}</td><td>${pill(p.jur)}</td><td>${pill(p.tec)}</td><td>${pill(p.fin)}</td></tr>`).join("")}</tbody>
            </table></div>` : `<div class="alert alert-info">${rol.areas && rol.areas.length === 0 ? "Este rol solo ve la gestión de demandas de su área." : "Esta localidad no tiene programas del área en este momento."}</div>`}
            <h5 style="margin-top:18px">Registro de auditoría</h5>
            <ul class="audit">
              <li>Estado técnico actualizado a “En curso”<small>Operador de Vivienda · hace 2 días</small></li>
              <li>Sincronización de planilla de aportes: 14 filas leídas, 1 omitida por formato<small>Proceso automático · cada hora</small></li>
              <li>Gestión vinculada desde un caso de Vivienda<small>Operador de Secretaría Privada · hace 6 días</small></li>
            </ul>
          </div>
        </div>`;
      $("[data-rol]", root).addEventListener("change", (e) => { s.rol = e.target.value; draw(); });
      $$("[data-loc]", root).forEach((b) => b.addEventListener("click", () => { s.loc = b.dataset.loc; draw(); }));
    }
    draw();
  }

  /* ======================================================================
     5. GOBIERNO — Agente conversacional de gestiones (versión híbrida)
     ====================================================================== */
  function agenteGestiones(root) {
    const r = rng(42);
    const MIN = ["Obras Públicas", "Salud", "Educación", "Desarrollo Social", "Servicios Públicos"];
    const CATS = { agua: ["agua", "potable", "acueducto"], caminos: ["camino", "ruta", "pavimento"], energia: ["energia", "luz", "electric"], vivienda: ["vivienda", "casa"], salud: ["salud", "hospital", "dispensario"], educacion: ["educacion", "escuela"] };
    const G = [];
    for (let i = 0; i < 280; i++) {
      const l = pick(r, LOCS), abierta = r() < 0.35, m = pick(r, MIN);
      G.push({ id: 1000 + i, loc: l.n, depto: l.d, min: m, cat: pick(r, Object.keys(CATS)), estado: abierta ? "abierta" : "cerrada", urgente: r() < 0.2, dias: Math.floor(r() * 60) + 5 + MIN.indexOf(m) * 6 });
    }
    function entidades(t) {
      const exact = LOCS.filter((l) => t.includes(norm(l.n)));
      if (exact.length) return { loc: exact[0].n };
      const cand = LOCS.filter((l) => { const w = norm(l.n).split(" "); return t.includes(w.slice(0, 2).join(" ")) || (w[0].length > 4 && t.includes(w[0])); });
      if (cand.length === 1) return { loc: cand[0].n };
      if (cand.length > 1) return { ambiguo: cand.map((c) => c.n) };
      const dm = t.match(/(?:departamento|depto\.?|en)\s+(sierras|llanura|norte)\b/);
      if (dm) return { depto: dm[1][0].toUpperCase() + dm[1].slice(1) };
      return {};
    }
    const enTerr = (terr) => G.filter((g) => (terr.loc ? g.loc === terr.loc : g.depto === terr.depto));
    const nombre = (terr) => terr.loc || "el departamento " + terr.depto;
    const linea = (g) => `#${g.id} · ${g.cat} · ${g.min} · ${g.estado}${g.urgente ? " · urgente" : ""}`;
    const traza = (interp, consulta, filas, extra) => `
      <div class="pipe">
        <div class="pipe-step on"><i>1</i>El modelo interpreta: devuelve intención y entidades, nunca SQL</div>
        <div class="pipe-step on"><i>2</i>El sistema resuelve entidades contra catálogos reales</div>
        <div class="pipe-step ${consulta ? "on" : ""}"><i>3</i>${consulta ? "Ejecuta una consulta predefinida" : "No ejecuta nada: pide aclaración"}</div>
      </div>
      <div class="trace">${json(interp)}${consulta ? `\n\n<span class="s">consulta</span>: ${esc(consulta)}\n<span class="s">filas</span>: ${filas}` : ""}${extra ? "\n" + esc(extra) : ""}</div>`;

    function handle(text, ctx) {
      const t = norm(text);
      let ent = entidades(t);
      let intent = /tard|demor|ranking|mas lent/.test(t) ? "ranking_ministerio"
        : /cerca|radio|\bkm\b/.test(t) ? "proximidad"
        : /abiert|pendient|cuant/.test(t) ? "abiertas_y_demora"
        : /toda|manda|lista|dame|mostra/.test(t) ? "listado" : null;
      const cat = Object.keys(CATS).find((c) => CATS[c].some((w) => t.includes(w)));
      // continuación de una aclaración pendiente
      if (ctx.pend && (ent.loc || ent.depto)) { intent = intent || ctx.pend.intent; ctx.pend = null; }
      if (ent.ambiguo) {
        ctx.pend = { intent: intent || "listado" };
        return { reply: "Encontré más de una localidad que coincide. ¿A cuál se refiere?", opts: ent.ambiguo, trace: traza({ intencion: intent || "listado", entidades: { localidad: "ambigua" }, confianza: 0.41 }, null) };
      }
      if (!ent.loc && !ent.depto) {
        if (ctx.terr && (intent || cat)) ent = ctx.terr; // memoria de conversación
        else return { reply: "Puedo responder sobre gestiones por localidad o departamento: abiertas y demora, ranking por ministerio, listados por tema y búsquedas por cercanía. ¿Sobre qué territorio quiere consultar?", trace: traza({ intencion: "desconocida", entidades: {}, confianza: 0.2 }, null) };
      }
      ctx.terr = ent;
      if (!intent) intent = "listado";
      const base = enTerr(ent);
      const interp = { intencion: intent, entidades: { ...(ent.loc ? { localidad: ent.loc } : { departamento: ent.depto }), ...(cat ? { categoria: cat } : {}) }, confianza: 0.93 };

      if (intent === "ranking_ministerio") {
        const rk = MIN.map((m) => { const xs = base.filter((g) => g.min === m && g.estado === "cerrada"); return { m, n: xs.length, d: xs.length ? xs.reduce((a, g) => a + g.dias, 0) / xs.length : 0 }; }).filter((x) => x.n).sort((a, b) => b.d - a.d);
        return { reply: `Demora promedio de cierre en ${nombre(ent)}:\n` + rk.map((x, i) => `${i + 1}. ${x.m}: ${nf(x.d, 0)} días (${x.n} cerradas)`).join("\n"), trace: traza(interp, `Q_RANKING_MINISTERIO(${ent.loc ? "localidad" : "departamento"}="${ent.loc || ent.depto}")`, rk.length) };
      }
      if (intent === "proximidad") {
        const km = +(t.match(/(\d+)\s*km/) || [0, 20])[1];
        const o = LOCS.find((l) => l.n === ent.loc) || LOCS.find((l) => l.d === ent.depto);
        const cerca = LOCS.filter((l) => l.n !== o.n && Math.hypot(l.x - o.x, l.y - o.y) <= km);
        const xs = G.filter((g) => cerca.some((l) => l.n === g.loc) && g.estado === "abierta" && (!cat || g.cat === cat));
        interp.entidades.radio_km = km;
        return { reply: cerca.length ? `En un radio de ${km} km de ${o.n} hay ${pl(xs.length, "gestión abierta", "gestiones abiertas")}${cat ? " de " + cat : ""}, en ${cerca.map((l) => l.n).join(", ")}.` : `No hay otras localidades a menos de ${km} km de ${o.n}. Probá con un radio mayor.`, trace: traza(interp, `Q_PROXIMIDAD(origen="${o.n}", radio_km=${km})`, xs.length) };
      }
      if (intent === "abiertas_y_demora") {
        const xs = base.filter((g) => g.estado === "abierta" && (!cat || g.cat === cat));
        const d = xs.length ? xs.reduce((a, g) => a + g.dias, 0) / xs.length : 0;
        ctx.ultimo = xs;
        return { reply: `En ${nombre(ent)} hay ${pl(xs.length, "gestión abierta", "gestiones abiertas")}${cat ? " de " + cat : ""}${xs.length ? `, con ${nf(d, 0)} días de antigüedad promedio. Urgentes: ${xs.filter((g) => g.urgente).length}.` : "."}`, trace: traza(interp, `Q_ABIERTAS_TERRITORIO(${ent.loc ? "localidad" : "departamento"}="${ent.loc || ent.depto}"${cat ? `, categoria="${cat}"` : ""})`, xs.length) };
      }
      const xs = /toda|manda/.test(t) && ctx.ultimo && !cat ? ctx.ultimo : base.filter((g) => !cat || g.cat === cat);
      ctx.ultimo = xs;
      const n = /toda|manda/.test(t) ? 10 : 4;
      return { reply: xs.length ? `${pl(xs.length, "gestión", "gestiones")}${cat ? " de " + cat : ""} en ${nombre(ent)}. ${xs.length > n ? "Las primeras " + n + ":" : ""}\n` + xs.slice(0, n).map(linea).join("\n") + (xs.length > n ? "\n(Escribí “mandalas todas” para ver más.)" : "") : `No encontré gestiones${cat ? " de " + cat : ""} en ${nombre(ent)}.`, trace: traza(interp, `Q_LISTADO_TERRITORIO(${ent.loc ? "localidad" : "departamento"}="${ent.loc || ent.depto}"${cat ? `, categoria="${cat}"` : ""})`, xs.length) };
    }

    chatUI(root, {
      titulo: "Canal del funcionario",
      placeholder: "Escribí tu consulta…",
      saludo: "Hola. Consulto la base de gestiones territoriales. Preguntame por una localidad o un departamento.",
      sugs: ["¿Cuántas abiertas hay en Villa del Lago?", "¿Qué ministerio tarda más en el departamento Sierras?", "Dame las gestiones de agua en Los Algarrobos", "Gestiones en San Roque", "Gestiones cerca de Santa Elena, en un radio de 40 km", "¿Y cuántas abiertas hay?"],
      nota: "Si la consulta es ambigua, el agente pregunta en lugar de inventar. Cada interacción queda registrada: mensaje, interpretación, consulta y respuesta.",
      handle,
    });
  }

  /* ======================================================================
     6. MUNICIPIOS — Reportes Vecinales: mapa ciudadano
     ====================================================================== */
  function reportes(root) {
    const CATS = {
      pozos: ["Pozos", "#c2453b"], basura: ["Basura", "#8a6a3f"], alumbrado: ["Alumbrado", "#e8962e"], baches: ["Baches", "#7b4fb0"],
      desague: ["Desagüe", "#3b6fb6"], semaforos: ["Semáforos", "#2f8a5b"], otros: ["Otros", "#6b7f87"],
    };
    const CALLES_H = ["Belgrano", "Mitre", "Sarmiento", "Rivadavia", "Moreno"], CALLES_V = ["San Martín", "Colón", "Urquiza", "Alberdi", "Güemes", "Roca", "Italia", "España"];
    const dir = (x, y) => `${CALLES_H[Math.min(4, Math.floor(y / 80))]} ${100 + Math.round(x / 80) * 100 + Math.round((x % 80) / 2)}, esq. ${CALLES_V[Math.min(7, Math.floor(x / 80))]}`;
    const r = rng(11); let seq = 1;
    const DESC = { pozos: "Pozo profundo sobre la calzada", basura: "Basural en la esquina", alumbrado: "Luminaria apagada hace días", baches: "Bache que obliga a esquivar", desague: "Desagüe tapado, se inunda", semaforos: "Semáforo intermitente", otros: "Vereda rota" };
    const items = Array.from({ length: 16 }, () => {
      const cat = pick(r, Object.keys(CATS)), x = 30 + r() * 580, y = 30 + r() * 340;
      return { id: seq++, cat, x, y, desc: DESC[cat], estado: r() < 0.25 ? "en curso" : "pendiente", fecha: `hace ${Math.floor(r() * 12) + 1} días` };
    });
    const s = { filtros: new Set(Object.keys(CATS)), sel: null, draft: null, admin: false, enviados: 0 };

    function draw() {
      const visibles = items.filter((i) => s.filtros.has(i.cat) && !["resuelto", "desestimado"].includes(i.estado));
      const sel = items.find((i) => i.id === s.sel);
      let streets = "";
      for (let x = 80; x < 640; x += 80) streets += `<line x1="${x}" y1="0" x2="${x}" y2="400"/>`;
      for (let y = 80; y < 400; y += 80) streets += `<line x1="0" y1="${y}" x2="640" y2="${y}"/>`;
      root.innerHTML = `
        <div class="legend">${Object.keys(CATS).map((k) => `<button data-f="${k}" aria-pressed="${s.filtros.has(k)}"><i style="background:${CATS[k][1]}"></i>${CATS[k][0]}</button>`).join("")}</div>
        <div class="demo-grid cols-2" style="align-items:start">
          <div>
            <div class="map-wrap map">
              <svg viewBox="0 0 640 400" role="img" aria-label="Mapa de reportes" data-map>
                <rect x="240" y="160" width="80" height="80" style="fill:var(--ok-soft)"/>
                <text x="280" y="204" text-anchor="middle" style="fill:var(--ok);font-size:11px;font-family:var(--font)">Plaza</text>
                <g style="stroke:var(--surface);stroke-width:9">${streets}</g>
                <path d="M0 330 C 160 300, 300 380, 640 300" style="fill:none;stroke:var(--info-soft);stroke-width:16"/>
                <g data-pins>${visibles.map((i) => `<circle data-pin="${i.id}" cx="${i.x}" cy="${i.y}" r="${i.id === s.sel ? 12 : 9}" style="fill:${CATS[i.cat][1]};stroke:#fff;stroke-width:2.5;cursor:pointer;opacity:${i.estado === "en curso" ? .6 : 1}"><title>${CATS[i.cat][0]} · ${i.estado}</title></circle>`).join("")}</g>
                ${s.draft ? `<g><circle cx="${s.draft.x}" cy="${s.draft.y}" r="13" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:4 3"/><circle cx="${s.draft.x}" cy="${s.draft.y}" r="3" style="fill:var(--ink)"/></g>` : ""}
              </svg>
            </div>
            <p class="muted" style="margin-top:8px"><b>${visibles.length}</b> reportes activos a la vista. Tocá un punto para ver el detalle, o tocá el mapa para marcar un problema nuevo.</p>
          </div>
          <div class="panel">
            <div class="row" style="justify-content:space-between;margin-bottom:10px">
              <h5 style="margin:0">${s.draft ? "Nuevo reporte" : sel ? "Detalle del reporte" : "Cómo funciona"}</h5>
              <label class="check" style="margin:0"><input type="checkbox" data-admin ${s.admin ? "checked" : ""}><span>Vista municipio</span></label>
            </div>
            ${s.draft ? `
              <p class="muted">Ubicación detectada: <b>${dir(s.draft.x, s.draft.y)}</b></p>
              <div class="field"><label>Tipo de problema</label><select data-cat>${Object.keys(CATS).map((k) => `<option value="${k}">${CATS[k][0]}</option>`).join("")}</select></div>
              <div class="field"><label>Descripción (opcional)</label><input type="text" data-desc placeholder="Ej.: frente a la escuela"></div>
              <div class="row"><button class="btn btn-primary btn-sm" data-pub>Publicar reporte</button><button class="btn btn-ghost btn-sm" data-cancel>Cancelar</button></div>
              ${s.enviados >= 5 ? `<div class="alert alert-warn">Límite de 5 reportes por minuto por conexión, para frenar abusos.</div>` : ""}`
            : sel ? `
              <p><span class="pill" style="background:${CATS[sel.cat][1]};color:#fff">${CATS[sel.cat][0]}</span> <span class="pill ${sel.estado === "pendiente" ? "p-warn" : sel.estado === "en curso" ? "p-info" : "p-ok"}">${sel.estado}</span></p>
              <p><b>${dir(sel.x, sel.y)}</b><br>${esc(sel.desc)}<br><span class="muted">Reportado ${sel.fecha}</span></p>
              ${s.admin ? `<div class="row">${["pendiente", "en curso", "resuelto", "desestimado"].map((e) => `<button class="btn btn-ghost btn-sm" data-est="${e}" ${sel.estado === e ? "disabled" : ""}>${e[0].toUpperCase() + e.slice(1)}</button>`).join("")}</div><p class="muted" style="margin-top:8px">Los resueltos y desestimados salen del mapa público.</p>` : `<p class="muted">Activá “Vista municipio” para cambiar el estado.</p>`}`
            : `<p class="muted">Sin registro ni instalación: el vecino toca el mapa, elige el tipo de problema y publica. Lo reportado queda a la vista de todos, lo que da transparencia y evita duplicados.</p><p class="muted">El municipio administra los estados desde un panel simple. Los datos sirven después como base del sistema integral de reclamos.</p>`}
            ${s.admin ? `<h5 style="margin-top:16px">Resumen por estado</h5><div class="kpis">${["pendiente", "en curso", "resuelto", "desestimado"].map((e) => `<div class="kpi"><span>${e[0].toUpperCase() + e.slice(1)}</span><b>${items.filter((i) => i.estado === e).length}</b></div>`).join("")}</div>` : ""}
          </div>
        </div>`;
      $$("[data-f]", root).forEach((b) => b.addEventListener("click", () => { s.filtros.has(b.dataset.f) ? s.filtros.delete(b.dataset.f) : s.filtros.add(b.dataset.f); draw(); }));
      const svg = $("[data-map]", root);
      svg.addEventListener("click", (e) => {
        const pin = e.target.closest("[data-pin]");
        if (pin) { s.sel = +pin.dataset.pin; s.draft = null; return draw(); }
        const b = svg.getBoundingClientRect();
        s.draft = { x: clamp(((e.clientX - b.left) / b.width) * 640, 0, 639), y: clamp(((e.clientY - b.top) / b.height) * 400, 0, 399) }; s.sel = null; draw();
      });
      $("[data-admin]", root).addEventListener("change", (e) => { s.admin = e.target.checked; draw(); });
      const pub = $("[data-pub]", root);
      if (pub) {
        pub.addEventListener("click", () => {
          if (s.enviados >= 5) return;
          const cat = $("[data-cat]", root).value, desc = $("[data-desc]", root).value.trim();
          const it = { id: seq++, cat, x: s.draft.x, y: s.draft.y, desc: desc || DESC[cat], estado: "pendiente", fecha: "recién" };
          items.push(it); s.enviados++; s.filtros.add(cat); s.draft = null; s.sel = it.id; draw();
        });
        $("[data-cancel]", root).addEventListener("click", () => { s.draft = null; draw(); });
      }
      $$("[data-est]", root).forEach((b) => b.addEventListener("click", () => { sel.estado = b.dataset.est; draw(); }));
    }
    draw();
  }

  /* ======================================================================
     7. MUNICIPIOS — Sistema Integral de Reclamos: un reclamo de punta a punta
     ====================================================================== */
  function reclamos(root) {
    const TIPOS = [
      { t: "Alumbrado público", re: /luz|luminaria|farol|foco|apagad|alumbrad/, h: 72 },
      { t: "Residuos", re: /basura|residuo|basural|contenedor/, h: 48 },
      { t: "Baches y calzada", re: /bache|pozo|asfalto|calle rota|calzada/, h: 120 },
      { t: "Desagües y agua", re: /agua|desag|inund|caner|perdida/, h: 24 },
      { t: "Arbolado", re: /arbol|rama|poda/, h: 96 },
    ];
    const ORDEN = ["ingresado", "en revisión", "asignado", "en camino", "en proceso", "resuelto", "cerrado"];
    let s;
    const reset = () => (s = { rol: "vecino", estado: null, rec: null, audit: [], min: 9 * 60 + 12 });
    reset();
    const hora = () => { const h = Math.floor(s.min / 60) % 24, m = s.min % 60; return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0"); };
    function pasar(estado, actor, nota, rol, salto) {
      s.min += salto || 0; s.estado = estado;
      s.audit.push({ estado, actor, nota, hora: hora() });
      if (rol) s.rol = rol;
      draw();
    }
    function qr(seed) {
      const r = rng(seed), n = 21, c = 6; let out = "";
      const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
      const fOn = (x, y) => { const fx = x >= n - 7 ? x - (n - 7) : x, fy = y >= n - 7 ? y - (n - 7) : y; return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); };
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (finder(x, y) ? fOn(x, y) : r() < 0.48) out += `<rect x="${x * c}" y="${y * c}" width="${c}" height="${c}"/>`;
      return `<svg width="96" height="96" viewBox="-6 -6 ${n * c + 12} ${n * c + 12}" role="img" aria-label="Código QR de seguimiento" style="background:#fff;border-radius:6px"><g fill="#111">${out}</g></svg>`;
    }

    function vecino() {
      if (!s.estado) return `
        <p class="muted">Reclamo en pocos pasos, sin registro ni instalación.</p>
        <div class="field"><label>¿Qué está pasando?</label><textarea data-txt>Hace tres noches que la luminaria de la esquina está apagada y la cuadra queda a oscuras.</textarea></div>
        <div class="field"><label>Barrio</label><select data-barrio><option>Centro</option><option>Norte</option><option>Las Rosas</option><option>La Estación</option></select></div>
        <div class="field"><label>Dirección</label><input type="text" data-dir value="Mitre 450"></div>
        <button class="btn btn-primary btn-sm" data-enviar>Enviar reclamo</button>`;
      const rec = s.rec;
      return `
        <div class="row" style="align-items:flex-start;gap:14px">
          ${qr(rec.n)}
          <div><b>Expediente R-2026-${String(rec.n).padStart(5, "0")}</b><br><span class="muted">${esc(rec.dir)}, ${rec.barrio}</span><br><span class="pill p-info">${rec.tipo}</span> <span class="pill p-mute">Plazo: ${rec.h} h</span></div>
        </div>
        ${rec.dup ? `<div class="alert alert-info">Ya existe un reclamo similar a 80 m. El supervisor puede unificarlos.</div>` : ""}
        ${s.estado === "resuelto" || s.estado === "cerrado" ? `
          <h5 style="margin-top:16px">Aviso enviado al vecino</h5>
          <div class="email"><b>Su reclamo fue resuelto</b><br><span class="muted">Para: vecino · Expediente R-2026-${String(rec.n).padStart(5, "0")}</span><p style="margin:8px 0 0">Trabajo realizado: ${esc(rec.solucion || "")}. Si el problema persiste, puede reabrir el reclamo con su código.</p></div>
          <div class="row" style="margin-top:12px"><button class="btn btn-ghost btn-sm" data-nuevo>Cargar otro reclamo</button></div>`
        : `<div class="alert alert-ok">Reclamo registrado. Con el QR o el número puede seguir el estado en cualquier momento: hoy está <b>${s.estado}</b>.</div>`}`;
    }
    function supervisor() {
      const rec = s.rec;
      if (!rec) return `<p class="muted">Todavía no hay reclamos nuevos. Cargá uno desde el portal del vecino.</p>`;
      const cab = `<p><b>R-2026-${String(rec.n).padStart(5, "0")}</b> · ${rec.tipo}<br><span class="muted">${esc(rec.texto)}</span></p><p><span class="pill p-ok">En plazo</span> <span class="muted">Clasificado automáticamente · vence en ${rec.h} h</span></p>`;
      if (s.estado === "ingresado") return cab + `<button class="btn btn-primary btn-sm" data-revisar>Tomar en revisión</button>`;
      if (s.estado === "en revisión") return cab + `
        <div class="field"><label>Asignar a</label><select data-cuad><option>Cuadrilla 2 · Zona ${rec.barrio} (3 reclamos activos)</option><option>Cuadrilla 5 · Refuerzo (1 reclamo activo)</option><option>Contratista externo</option></select></div>
        <div class="row"><button class="btn btn-primary btn-sm" data-asignar>Asignar</button>${rec.dup ? `<button class="btn btn-ghost btn-sm" data-dup>Marcar como duplicado</button>` : ""}</div>`;
      if (s.estado === "resuelto") return cab + `<div class="alert alert-ok">Resuelto por ${esc(rec.cuadrilla)}. Insumos: ${esc(rec.insumos)}.</div><div class="row" style="margin-top:10px"><button class="btn btn-primary btn-sm" data-cerrar>Cerrar expediente</button></div>`;
      if (s.estado === "cerrado" || s.estado === "duplicado") return cab + `<div class="alert alert-info">Expediente ${s.estado}. Queda en las métricas por barrio, por tipo y por contratista.</div>`;
      return cab + `<div class="alert alert-info">Asignado a ${esc(rec.cuadrilla)}. Estado: <b>${s.estado}</b>. El control de plazos corre cada 30 minutos.</div>`;
    }
    function tecnico() {
      const rec = s.rec;
      if (!rec || !["asignado", "en camino", "en proceso", "bloqueado"].includes(s.estado)) return `<p class="muted">${s.estado === "resuelto" || s.estado === "cerrado" ? "Sin reclamos pendientes: el trabajo quedó registrado." : "No hay reclamos asignados a la cuadrilla todavía."}</p>`;
      const cab = `<p><b>${rec.tipo}</b> · ${esc(rec.dir)}, ${rec.barrio}<br><span class="muted">Prioridad normal · quedan ${rec.h - 3} h de plazo</span></p>`;
      if (s.estado === "asignado") return cab + `<button class="btn btn-primary btn-sm" data-camino>Salgo hacia el lugar</button>`;
      if (s.estado === "en camino") return cab + `<button class="btn btn-primary btn-sm" data-iniciar>Iniciar trabajo</button>`;
      if (s.estado === "bloqueado") return cab + `<div class="alert alert-warn">Bloqueado por falta de materiales. El supervisor lo ve en su tablero.</div><div class="row" style="margin-top:10px"><button class="btn btn-primary btn-sm" data-desbloq>Llegaron los materiales</button></div>`;
      return cab + `
        <div class="field"><label>Solución aplicada</label><input type="text" data-sol value="Reemplazo de la lámpara y del fotocontrol"></div>
        <div class="field"><label>Insumos usados</label><input type="text" data-ins value="1 lámpara LED 100 W, 1 fotocontrol"></div>
        <div class="row"><button class="btn btn-primary btn-sm" data-resolver>Marcar resuelto</button><button class="btn btn-ghost btn-sm" data-bloq>Bloquear por falta de materiales</button></div>`;
    }

    function draw() {
      const idx = ORDEN.indexOf(s.estado);
      root.innerHTML = `
        <div class="demo-grid cols-2" style="align-items:start">
          <div class="panel">
            <div class="subtabs" role="tablist">${[["vecino", "Portal del vecino"], ["supervisor", "Supervisor"], ["tecnico", "Técnico"]].map((t) => `<button class="subtab" role="tab" data-rol="${t[0]}" aria-selected="${s.rol === t[0]}">${t[1]}</button>`).join("")}</div>
            ${{ vecino, supervisor, tecnico }[s.rol]()}
          </div>
          <div class="panel">
            <h5>Ciclo de vida del reclamo</h5>
            <div class="states">${ORDEN.map((e, i) => `<span class="${s.estado === e ? "now" : idx > i ? "done" : ""}">${e}</span>`).join("")}${["bloqueado", "duplicado"].includes(s.estado) ? `<span class="now">${s.estado}</span>` : ""}</div>
            <h5>Auditoría inmutable</h5>
            ${s.audit.length ? `<ul class="audit">${s.audit.map((a) => `<li><b>${a.estado}</b>${a.nota ? " — " + esc(a.nota) : ""}<small>${a.actor} · ${a.hora}</small></li>`).join("")}</ul>` : `<p class="muted">Cada cambio de estado queda registrado con su responsable y su hora. Empezá cargando un reclamo como vecino.</p>`}
          </div>
        </div>`;
      $$("[data-rol]", root).forEach((b) => b.addEventListener("click", () => { s.rol = b.dataset.rol; draw(); }));
      const on = (sel, fn) => { const b = $(sel, root); if (b) b.addEventListener("click", fn); };
      on("[data-enviar]", () => {
        const texto = $("[data-txt]", root).value.trim() || "Sin descripción", t = norm(texto);
        const tipo = TIPOS.find((x) => x.re.test(t)) || { t: "Otros (revisión manual)", h: 120 };
        const barrio = $("[data-barrio]", root).value;
        s.rec = { n: 418, texto, tipo: tipo.t, h: tipo.h, barrio, dir: $("[data-dir]", root).value || "Sin dirección", dup: barrio === "Centro" && tipo.t === "Alumbrado público" };
        pasar("ingresado", "Vecino · portal web", `Clasificado como “${tipo.t}”`, "vecino");
      });
      on("[data-revisar]", () => pasar("en revisión", "Supervisor", "", "supervisor", 14));
      on("[data-asignar]", () => { s.rec.cuadrilla = $("[data-cuad]", root).value.split(" (")[0]; pasar("asignado", "Supervisor", s.rec.cuadrilla, "tecnico", 6); });
      on("[data-dup]", () => pasar("duplicado", "Supervisor", "Unificado con un reclamo cercano", "supervisor", 3));
      on("[data-camino]", () => pasar("en camino", "Técnico · " + s.rec.cuadrilla, "", "tecnico", 95));
      on("[data-iniciar]", () => pasar("en proceso", "Técnico · " + s.rec.cuadrilla, "", "tecnico", 22));
      on("[data-bloq]", () => pasar("bloqueado", "Técnico · " + s.rec.cuadrilla, "Falta de materiales", "tecnico", 10));
      on("[data-desbloq]", () => pasar("en proceso", "Técnico · " + s.rec.cuadrilla, "Materiales recibidos", "tecnico", 180));
      on("[data-resolver]", () => { s.rec.solucion = $("[data-sol]", root).value; s.rec.insumos = $("[data-ins]", root).value; pasar("resuelto", "Técnico · " + s.rec.cuadrilla, s.rec.solucion + " · aviso por email al vecino", "vecino", 40); });
      on("[data-cerrar]", () => pasar("cerrado", "Supervisor", "", "supervisor", 30));
      on("[data-nuevo]", () => { reset(); draw(); });
    }
    draw();
  }

  /* ======================================================================
     8. MUNICIPIOS — Agente de Reclamos: herramientas, reescritura y caché
     ====================================================================== */
  function agenteReclamos(root) {
    const r = rng(64);
    const BARRIOS = [{ n: "Centro", x: 0, y: 0 }, { n: "Norte", x: 200, y: 900 }, { n: "Las Rosas", x: 800, y: 300 }, { n: "La Estación", x: -700, y: -200 }, { n: "El Mirador", x: 400, y: -900 }];
    const TIPOS = {
      alumbrado: { syn: ["luz", "luminaria", "farol", "alumbrado", "oscur"], txt: ["La luminaria de la cuadra está apagada hace una semana", "Farola que parpadea toda la noche", "Toda la cuadra a oscuras desde la tormenta"] },
      baches: { syn: ["bache", "pozo", "calle rota", "asfalto"], txt: ["Bache enorme frente a la parada del colectivo", "Pozo que se llena de agua cuando llueve", "El asfalto se hundió en la esquina"] },
      residuos: { syn: ["basura", "residuo", "basural", "contenedor"], txt: ["No pasó el camión recolector en tres días", "Se formó un basural en el terreno baldío", "Contenedor roto y desbordado"] },
      desague: { syn: ["desague", "inund", "agua", "cloaca"], txt: ["El desagüe está tapado y se inunda la calle", "Pérdida de agua en la vereda", "Desborde cloacal frente a mi casa"] },
      arbolado: { syn: ["arbol", "rama", "poda"], txt: ["Rama caída sobre los cables", "Árbol con riesgo de caerse", "Hace falta poda, tapa el semáforo"] },
    };
    const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio"];
    const R = [];
    for (let i = 0; i < 64; i++) {
      const tipo = pick(r, Object.keys(TIPOS)), b = pick(r, BARRIOS), e = r();
      R.push({ id: 100 + i, tipo, barrio: b.n, x: b.x + (r() - .5) * 700, y: b.y + (r() - .5) * 700, estado: e < .4 ? "pendiente" : e < .6 ? "en proceso" : "resuelto", mes: Math.floor(r() * 6), texto: pick(r, TIPOS[tipo].txt) });
    }
    const cache = new Set();

    function handle(text) {
      const t = norm(text);
      const tipo = Object.keys(TIPOS).find((k) => TIPOS[k].syn.some((w) => t.includes(w)));
      const barrio = (BARRIOS.find((b) => t.includes(norm(b.n))) || {}).n;
      const abiertos = /pendient|sin resolver|abiert|problema|falta/.test(t);
      const meses = MESES.map((m, i) => (t.includes(m) ? i : -1)).filter((i) => i >= 0);
      const prox = /cerca|metros|alrededor|a la vuelta/.test(t);
      const stats = /cuant|ranking|que barrio|porcentaje|mas reclamos/.test(t);
      const tool = prox ? "proximidad" : meses.length ? "por_fecha" : stats ? "estadisticas" : "busqueda_semantica";
      const reesc = ["reclamos", tipo ? "de " + tipo : "", abiertos ? "sin resolver" : "", barrio ? "en " + barrio : "", meses.length ? "entre " + MESES[Math.min(...meses)] + " y " + MESES[Math.max(...meses)] : "", prox ? "cerca del punto indicado" : ""].filter(Boolean).join(" ");
      const key = [tool, tipo, barrio, abiertos, meses.join("-"), /que barrio/.test(t)].join("|");
      const hit = cache.has(key); cache.add(key);

      let xs = R.filter((x) => (!tipo || x.tipo === tipo) && (!barrio || x.barrio === barrio) && (!abiertos || x.estado !== "resuelto"));
      let reply, detalle;
      if (tool === "proximidad") {
        const m = +(t.match(/(\d+)\s*m/) || [0, 500])[1], o = BARRIOS.find((b) => b.n === barrio) || BARRIOS[0];
        xs = R.filter((x) => (!tipo || x.tipo === tipo) && x.estado !== "resuelto" && Math.hypot(x.x - o.x, x.y - o.y) <= m);
        reply = `A menos de ${m} metros de ${barrio ? "el centro de " + barrio : "la plaza central"} hay ${pl(xs.length, "reclamo pendiente", "reclamos pendientes")}${tipo ? " de " + tipo : ""}.` + (xs.length ? "\n" + xs.slice(0, 3).map((x) => `#${x.id} · ${x.tipo}: ${x.texto}`).join("\n") : "");
        detalle = `distancia entre coordenadas ≤ ${m} m · estado ≠ resuelto`;
      } else if (tool === "por_fecha") {
        const a = Math.min(...meses), b = Math.max(...meses);
        xs = xs.filter((x) => x.mes >= a && x.mes <= b);
        const por = Object.keys(TIPOS).map((k) => [k, xs.filter((x) => x.tipo === k).length]).filter((p) => p[1]).sort((p, q) => q[1] - p[1]);
        reply = `Entre ${MESES[a]} y ${MESES[b]} ingresaron ${pl(xs.length, "reclamo")}${barrio ? " en " + barrio : ""}.\n` + por.map((p) => `· ${p[0]}: ${p[1]}`).join("\n") + `\nResueltos: ${xs.filter((x) => x.estado === "resuelto").length}.`;
        detalle = `filtro por rango de fechas: ${MESES[a]}–${MESES[b]}`;
      } else if (tool === "estadisticas") {
        if (/que barrio|ranking/.test(t)) {
          const rk = BARRIOS.map((b) => [b.n, xs.filter((x) => x.barrio === b.n).length]).sort((p, q) => q[1] - p[1]);
          reply = `Ranking de barrios${tipo ? " · " + tipo : ""}${abiertos ? " · sin resolver" : ""}:\n` + rk.map((p, i) => `${i + 1}. ${p[0]}: ${p[1]}`).join("\n");
          detalle = `SELECT barrio, COUNT(*) FROM reclamos${tipo || abiertos ? " WHERE " + [tipo ? `tipo='${tipo}'` : "", abiertos ? "estado<>'resuelto'" : ""].filter(Boolean).join(" AND ") : ""} GROUP BY barrio ORDER BY 2 DESC LIMIT 100`;
        } else {
          reply = `Hay ${pl(xs.length, "reclamo")}${tipo ? " de " + tipo : ""}${abiertos ? " sin resolver" : ""}${barrio ? " en " + barrio : ""}.`;
          const w = [tipo ? `tipo='${tipo}'` : "", abiertos ? "estado<>'resuelto'" : "", barrio ? `barrio='${barrio}'` : ""].filter(Boolean).join(" AND ");
          detalle = `SELECT COUNT(*) FROM reclamos${w ? " WHERE " + w : ""} LIMIT 100`;
        }
        detalle += "\nvalidación: solo SELECT ✓ · sin escritura ✓ · límite de filas ✓";
      } else {
        if (!tipo && !barrio) {
          reply = "Puedo buscar reclamos por tema, barrio, fechas o cercanía. Por ejemplo: “¿hay problemas con la luz en Centro?”";
          detalle = "sin resultados relevantes: se pide más contexto";
        } else {
          reply = xs.length ? `Sí: encontré ${pl(xs.length, "reclamo")}${tipo ? " de " + tipo : ""}${abiertos ? " sin resolver" : ""}${barrio ? " en " + barrio : ""}. Los más parecidos a tu consulta:\n` + xs.slice(0, 3).map((x) => `#${x.id} · ${x.barrio} · ${x.estado}: “${x.texto}”`).join("\n") : `No encontré reclamos${tipo ? " de " + tipo : ""}${barrio ? " en " + barrio : ""}.`;
          detalle = `base vectorial · filtros: ${[tipo && "tipo=" + tipo, barrio && "barrio=" + barrio, abiertos && "estado≠resuelto"].filter(Boolean).join(", ") || "ninguno"}`;
        }
      }
      const trace = `
        <div class="pipe">
          <div class="pipe-step ${hit ? "on" : ""}"><i>${hit ? "✓" : "–"}</i>Caché por significado: ${hit ? "acierto · respuesta en menos de 10 ms, sin llamar al modelo" : "sin acierto"}</div>
          <div class="pipe-step ${hit ? "" : "on"}"><i>1</i>Reescritura al vocabulario municipal</div>
          <div class="pipe-step ${hit ? "" : "on"}"><i>2</i>Elección de herramienta: <b>&nbsp;${tool}</b></div>
          <div class="pipe-step ${hit ? "" : "on"}"><i>3</i>Ejecución con filtros validados</div>
        </div>
        <div class="trace"><span class="k">pregunta</span>: ${esc(text)}\n<span class="k">reescrita</span>: ${esc(reesc)}\n<span class="k">herramienta</span>: ${tool}\n<span class="k">detalle</span>: ${esc(detalle)}\n<span class="k">resultados</span>: ${xs.length}</div>`;
      return { reply, trace };
    }

    chatUI(root, {
      titulo: "Canal del funcionario municipal",
      placeholder: "Pregunte sobre los reclamos…",
      saludo: "Hola. Tengo cargados 64 reclamos de prueba de cinco barrios. ¿Qué necesita saber?",
      sugs: ["¿Hay problemas con la luz en Centro?", "¿Cuántos reclamos de alumbrado hay sin resolver en Centro?", "¿Cuántos pendientes de luminarias hay en Centro?", "¿Qué barrio tiene más reclamos de baches?", "¿Qué pasó entre febrero y marzo?", "¿Qué hay pendiente a 500 metros de la plaza?"],
      nota: "Probá dos preguntas que digan lo mismo con otras palabras: la segunda se responde desde la caché. El agente funciona con modelos abiertos y se adapta a otro municipio cargando sus barrios y tipos.",
      handle,
    });
  }

  return { costeo, cruce, renta, plataforma, agenteGestiones, reportes, reclamos, agenteReclamos };
})();
