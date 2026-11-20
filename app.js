/* ==========================================================================
   Landing — render de secciones, elementos gráficos animados, navegación,
   tema y modal de demos. Todo el contenido sale de data.js.
   ========================================================================== */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  // Marca y año
  $$("[data-brand]").forEach((el) => (el.textContent = BRAND));
  $("#year").textContent = new Date().getFullYear();

  // Aviso breve (copiar enlace o correo)
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg); } catch (e) { toast(text); }
  }

  /* ------------------------------------------------------------------------
     Tema claro / oscuro
     ------------------------------------------------------------------------ */
  const themeBtn = $("#themeBtn");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  const syncThemeBtn = () => themeBtn.setAttribute("aria-label", isDark() ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  syncThemeBtn();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    syncThemeBtn();
  });

  /* ------------------------------------------------------------------------
     Navegación: menú móvil, barra de progreso, sección activa
     ------------------------------------------------------------------------ */
  const menuBtn = $("#menuBtn"), mm = $("#mobileMenu"), nav = $("#nav"), bar = $("#progress");
  const closeMenu = () => { mm.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); };
  menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", mm.classList.toggle("open")));
  $$("a", mm).forEach((a) => a.addEventListener("click", closeMenu));

  let ticking = false;
  function onScroll() {
    const h = root.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle("scrolled", scrollY > 8);
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const navLinks = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.toggleAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach((s) => spy.observe(s));
  }

  /* ------------------------------------------------------------------------
     Elementos gráficos de la línea estética, en SVG. Los colores salen de
     los tokens (--g1 a --g5). Cada uno se anima al entrar en pantalla.
     ------------------------------------------------------------------------ */
  const STOPS = [[0, 1], [35, 2], [62, 3], [80, 4], [100, 5]]
    .map(([o, n]) => `<stop offset="${o}%" style="stop-color:var(--g${n})"/>`).join("");

  // Mosaico "de disperso a ordenado": las celdas sueltas aparecen primero y el
  // bloque se completa columna por columna. Después, algunas celdas "laten"
  // como datos que se actualizan.
  function mosaic(el) {
    const COLS = 12, ROWS = 10, C = 48, GAP = 3;
    const on = new Set(["0,1", "1,4", "0,7", "1,9", "2,2", "2,8", "3,5", "3,7", "4,0", "4,3", "4,8", "5,2", "5,4", "5,6", "5,9"]);
    for (let r = 2; r <= 7; r++) on.add(`6,${r}`);
    for (let c = 7; c <= 11; c++) for (let r = 1; r <= 8; r++) on.add(`${c},${r}`);
    let cells = "";
    for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
      const k = `${c},${r}`;
      cells += on.has(k)
        ? `<rect class="cell-on" style="--d:${(c * 70 + r * 18)}ms" x="${c * C + GAP}" y="${r * C + GAP}" width="${C - GAP}" height="${C - GAP}" fill="url(#gMosaic)"/>`
        : `<rect class="cell-off" x="${c * C + GAP}" y="${r * C + GAP}" width="${C - GAP}" height="${C - GAP}"/>`;
    }
    el.innerHTML = `<svg class="mosaic" viewBox="0 0 ${COLS * C} ${ROWS * C}" role="img" aria-label="Celdas de colores sueltas a la izquierda que se agrupan en un bloque ordenado a la derecha">
      <defs><linearGradient id="gMosaic" gradientUnits="userSpaceOnUse" x1="80.5" y1="536.4" x2="495.5" y2="-56.4">${STOPS}</linearGradient></defs>
      ${cells}</svg>`;
    requestAnimationFrame(() => el.classList.add("built"));
    if (reduced) return;
    const live = $$(".cell-on", el);
    setInterval(() => {
      if (document.hidden) return;
      const c = live[Math.floor(Math.random() * live.length)];
      c.classList.add("blink");
      setTimeout(() => c.classList.remove("blink"), 900);
    }, 420);
  }

  // Barras en gradiente: caja a 13 semanas, con la alerta en la semana 9.
  function bars(el) {
    const H = 240, W = 24, GAP = 8;
    const pct = [80, 88, 74, 66, 58, 46, 34, 22, 10, 28, 42, 55, 62];
    const total = pct.length * W + (pct.length - 1) * GAP;
    const rects = pct.map((p, i) => {
      const h = H * p / 100;
      return `<rect class="${i === 8 ? "bar-alert" : ""}" style="--d:${i * 60}ms" x="${i * (W + GAP)}" y="${H - h}" width="${W}" height="${h}"/>`;
    }).join("");
    el.innerHTML = `<svg class="bars" viewBox="0 0 ${total} ${H}" role="img" aria-label="Gráfico de barras de trece semanas con una caída en la semana nueve">
      <defs><linearGradient id="gBars" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${total}" y2="0">${STOPS}</linearGradient></defs>
      <g fill="url(#gBars)">${rects}</g></svg>`;
  }

  // Mapa de celdas: el tamaño de cada cuadrado es el volumen de gestiones de
  // esa zona (datos de ejemplo). Crecen desde los focos de actividad.
  function map(el) {
    const C = 32, GAP = 3;
    const shape = [
      "....####......", "...#######....", "..#########...", "..##########..", ".###########..",
      ".############.", "#############.", "##############", ".#############", ".############.",
      "..###########.", "..##########..", "...########...", "...######.....", "....####......",
    ];
    const COLS = shape[0].length, ROWS = shape.length;
    const focos = [[9, 4, 1, 2.6], [4, 9, .8, 2.2], [10, 10, .55, 1.6], [3, 4, .4, 1.4]];
    let cells = "";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (shape[r][c] !== "#") continue;
      let v = 0;
      for (const [fc, fr, w, s] of focos) v = Math.max(v, w * Math.exp(-((c - fc) ** 2 + (r - fr) ** 2) / (2 * s * s)));
      const side = Math.round((C - GAP) * (.2 + .8 * v));
      const off = (C - side) / 2;
      cells += `<rect class="cell-off" x="${c * C + GAP / 2}" y="${r * C + GAP / 2}" width="${C - GAP}" height="${C - GAP}"/>`
        + `<rect class="cell-on" style="--d:${Math.round((1 - v) * 900)}ms" fill="url(#gMap)" x="${c * C + off}" y="${r * C + off}" width="${side}" height="${side}"/>`;
    }
    const W = COLS * C, H = ROWS * C;
    el.innerHTML = `<svg class="map" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de un territorio dividido en celdas, con cuadrados más grandes en las zonas con más gestiones">
      <defs><linearGradient id="gMap" gradientUnits="userSpaceOnUse" x1="0" y1="${H}" x2="${W}" y2="0">${STOPS}</linearGradient></defs>
      ${cells}</svg>`;
  }
  const GRAFICOS = { bars, map };
  mosaic($("#mosaic"));

  /* ------------------------------------------------------------------------
     Franja de datos bajo el inicio, con contador animado
     ------------------------------------------------------------------------ */
  const nfmt = (n) => n.toLocaleString("es-AR");
  $("#proof").innerHTML = PRUEBAS.map(([n, pre, t]) => `
    <li class="reveal"><b><span>${pre}</span><span data-count="${n}">${reduced ? nfmt(n) : "0"}</span></b><span>${esc(t)}</span></li>`).join("");
  function countUp(el) {
    const to = +el.dataset.count, t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = nfmt(Math.round(to * e));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     Qué hacemos: los tres ejes como pestañas
     ------------------------------------------------------------------------ */
  const ejesTabs = $("#ejesTabs"), ejesPanel = $("#ejesPanel");
  ejesTabs.innerHTML = SERVICIOS.map((s, i) => `
    <button class="eje-tab" role="tab" id="tab-${s.verbo}" aria-controls="ejesPanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-i="${i}">
      <span class="label">0${i + 1}</span>
      <span class="eje-verbo">${esc(cap(s.verbo))}.</span>
      <span class="eje-nombre">${esc(s.t)}</span>
    </button>`).join("");
  const paso = (n, rotulo, texto) => `<div class="eje-paso"><div class="label">${n} · ${rotulo}</div><p>${esc(texto)}</p></div>`;
  function showEje(i, focus) {
    const s = SERVICIOS[i];
    $$(".eje-tab", ejesTabs).forEach((b, j) => {
      b.setAttribute("aria-selected", j === i);
      b.tabIndex = j === i ? 0 : -1;
      if (j === i && focus) b.focus();
    });
    ejesPanel.setAttribute("aria-labelledby", `tab-${s.verbo}`);
    ejesPanel.innerHTML = `
      <div class="swap">
        <p class="eje-frase">${esc(s.frase)}</p>
        <div class="eje-pasos">
          ${paso("01", "el problema", s.problema)}
          ${paso("02", "lo que hacemos", s.solucion)}
          ${paso("03", "lo que cambia", s.mejora)}
        </div>
        <div class="label eje-incluye">qué incluye</div>
        <ul class="chips-list">${s.items.map((it) => `<li><b>${esc(it[0])}</b><span>${esc(it[1])}</span></li>`).join("")}</ul>
      </div>`;
  }
  tabKeys(ejesTabs, ".eje-tab", (b, focus) => showEje(+b.dataset.i, focus));
  showEje(0);

  // Pestañas accesibles: clic y flechas izquierda/derecha
  function tabKeys(list, sel, select) {
    list.addEventListener("click", (e) => { const b = e.target.closest(sel); if (b) select(b, false); });
    list.addEventListener("keydown", (e) => {
      const tabs = $$(sel, list), i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (e.key === "Home" || e.key === "End" || d) {
        e.preventDefault();
        const n = e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : (i + d + tabs.length) % tabs.length;
        select(tabs[n], true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     Galería de demos
     ------------------------------------------------------------------------ */
  const PROYECTOS = VERTICALES.flatMap((v) => v.grupos.flatMap((g) => g.proyectos.map((p) => ({ ...p, vertical: v }))));
  const nombreServicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.t]));
  const verboServicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.verbo]));
  const demoBtn = (p, cls, txt) => `<button class="${cls}" data-demo="${p.demo}" data-title="${esc(p.demoTitulo)}" data-sub="${esc(p.titulo)}">${txt}</button>`;
  $("#demoTiles").innerHTML = PROYECTOS.filter((p) => p.demo).map((p, i) => `
    <article class="tile reveal" style="--d:${i * 60}ms">
      <div class="tile-top">
        <span class="label-sm">${esc(p.vertical.nombre.toLowerCase())} · ${p.servicios.map((id) => verboServicio[id]).join(" + ")}</span>
        <span class="tile-n label-sm">0${i + 1}</span>
      </div>
      <h3>${esc(p.demoTitulo)}</h3>
      <p>${esc(p.demoQue)}</p>
      ${demoBtn(p, "tile-btn", `Abrir demo <span class="arrow" aria-hidden="true">→</span>`)}
    </article>`).join("");

  /* ------------------------------------------------------------------------
     Sectores y casos: una pestaña por sector, con el contexto del sector y
     sus casos.
     ------------------------------------------------------------------------ */
  const vtabs = $("#vtabs"), vpanel = $("#vpanel");
  const sector = Object.fromEntries(SECTORES.map((x) => [x.casos, x]));
  const servicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s]));
  vtabs.innerHTML = VERTICALES.map((v, i) => `
    <button class="vtab" role="tab" id="vtab-${v.id}" aria-controls="vpanel" data-v="${v.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><b>${esc(v.nombre)}</b><span>${esc(v.bajada)}</span></button>`).join("");

  function card(p) {
    return `
      <article class="pcard">
        <div class="pcard-top">
          <div>
            <div class="label-sm">${p.servicios.map((id) => esc(nombreServicio[id])).join(" · ")}</div>
            <h4>${esc(p.titulo)}</h4>
            <div class="client">${esc(p.cliente)}</div>
          </div>
          ${demoBtn(p, "btn btn-primary btn-sm", "Ver demo")}
        </div>
        <p class="pcard-lead">${esc(p.lead)}</p>
        <div class="pcols">
          <div class="pcol"><b>el problema</b><ul>${p.problema.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
          <div class="pcol"><b>la solución</b><ul>${p.solucion.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
        <div class="stack">${p.stack.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
        <details class="more">
          <summary>${esc(cap(p.arqTitulo || "cómo está construido"))}</summary>
          <dl class="arq">${p.arq.map((x) => `<div><dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd></div>`).join("")}</dl>
          <p>${esc(p.mas)}</p>
        </details>
      </article>`;
  }

  function renderVertical(id) {
    const v = VERTICALES.find((x) => x.id === id), x = sector[id];
    let html = `<div class="swap">`;
    if (x) html += `
      <div class="sector split">
        <div class="stack-text">
          <p class="sector-frase">${esc(x.frase)}</p>
          <p class="lead">${esc(x.d)}</p>
          <div class="rasgos">
            <div class="label">cómo suele estar hoy</div>
            ${x.rasgos.map((r) => `<div class="benefit"><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join("")}
          </div>
        </div>
        <figure class="graphic">
          <div class="graphic-panel">
            <div class="graphic-${x.grafico}" data-grafico="${x.grafico}"></div>
            <div class="graphic-axis label-sm">${x.graficoEje.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            <div class="label-sm">${esc(x.graficoNota)}</div>
          </div>
        </figure>
      </div>
      <div class="label sector-sub">${esc(EJES)} en ${esc(x.nombre.toLowerCase())}</div>
      <div class="ruled cols-3 sector-ejes">${x.servicios.map(([sid, texto]) => `
        <div class="rule-item">
          <div class="svc-mini">${esc(cap(servicio[sid].verbo))}</div>
          <span>${esc(texto)}</span>
        </div>`).join("")}
      </div>`;
    html += `<div class="label sector-sub">casos</div>`;
    v.grupos.forEach((g) => {
      html += `<div class="subgroup">
        <div class="subgroup-head"><h3>${esc(g.nombre)}</h3><span>${esc(g.nota)}</span></div>
        ${g.escalones ? `<div class="steps-note">Se contratan en secuencia, sin perder datos: ${g.escalones.map((s) => `<span class="st">${esc(s)}</span>`).join("")}</div>` : ""}
        <div class="cards">${g.proyectos.map(card).join("")}</div>
      </div>`;
    });
    vpanel.innerHTML = html + `</div>`;
    vpanel.setAttribute("aria-labelledby", `vtab-${id}`);
    $$("[data-grafico]", vpanel).forEach((el) => GRAFICOS[el.dataset.grafico](el));
    $$(".graphic-panel", vpanel).forEach((el) => (io ? io.observe(el) : el.classList.add("in")));
  }
  function selectVertical(id, focus) {
    $$(".vtab", vtabs).forEach((b) => {
      const on = b.dataset.v === id;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    renderVertical(id);
  }

  /* ------------------------------------------------------------------------
     Pasos y diferenciales
     ------------------------------------------------------------------------ */
  const pares = (arr, numerado, tag) => arr.map((it, i) => `
    <${tag} class="rule-item" style="--d:${i * 140}ms">
      ${numerado ? `<div class="label">0${i + 1}</div>` : ""}
      <b>${esc(it[0])}</b>
      <span>${esc(it[1])}</span>
    </${tag}>`).join("");
  $("#pasosGrid").innerHTML = pares(PASOS, true, "li");
  $("#diferencialesGrid").innerHTML = pares(DIFERENCIALES, false, "div");

  /* ------------------------------------------------------------------------
     Animación de entrada
     ------------------------------------------------------------------------ */
  const io = "IntersectionObserver" in window && !reduced
    ? new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        $$("[data-count]", en.target).forEach(countUp);
        io.unobserve(en.target);
      }), { threshold: .12 })
    : null;
  $$(".reveal, .method").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  tabKeys(vtabs, ".vtab", (b, focus) => selectVertical(b.dataset.v, focus));
  selectVertical(VERTICALES[0].id);

  /* ------------------------------------------------------------------------
     Modal de demos
     ------------------------------------------------------------------------ */
  const modal = $("#demoModal");
  let lastFocus = null, currentKey = null;
  function openDemo(key, title, sub) {
    if (!DEMOS[key]) return;
    lastFocus = document.activeElement;
    currentKey = key;
    $("#demoTitle").textContent = title;
    $("#demoSub").textContent = sub;
    const body = $("#demoBody");
    body.innerHTML = `<span class="disclaimer">Demo ilustrativa con datos ficticios. No representa información de clientes.</span><div id="demoRoot"></div>`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    document.body.style.overflow = "hidden";
    try { DEMOS[key]($("#demoRoot")); } catch (err) { $("#demoRoot").innerHTML = `<div class="alert alert-bad">No se pudo cargar la demo.</div>`; console.error(err); }
    history.replaceState(null, "", `#demo-${key}`);
    $(".modal-head [data-close]", modal).focus();
  }
  function closeDemo() {
    modal.classList.remove("open");
    modal.hidden = true;
    document.body.style.overflow = "";
    $("#demoBody").innerHTML = "";
    currentKey = null;
    history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-demo]");
    if (b) openDemo(b.dataset.demo, b.dataset.title, b.dataset.sub);
  });
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeDemo));
  $("#demoShare").addEventListener("click", () => copy(`${location.origin}${location.pathname}#demo-${currentKey}`, "Enlace a la demo copiado"));
  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") return closeDemo();
    if (e.key !== "Tab") return;
    // Mantener el foco dentro del modal
    const f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal.querySelector(".modal-dialog"))
      .filter((el) => !el.disabled && el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Enlace directo a una demo: index.html#demo-costeo, #demo-reclamos, etc.
  function demoFromHash() {
    const dm = location.hash.match(/^#demo-(\w+)$/);
    const p = dm && PROYECTOS.find((x) => x.demo === dm[1]);
    if (!p || currentKey === p.demo) return;
    selectVertical(p.vertical.id);
    openDemo(p.demo, p.demoTitulo, p.titulo);
  }
  addEventListener("hashchange", demoFromHash);
  demoFromHash();

  /* ------------------------------------------------------------------------
     Contacto: arma el correo y lo abre en el cliente de correo
     ------------------------------------------------------------------------ */
  const mails = $("#ctaMails");
  mails.innerHTML = CONTACT_EMAILS.map((m) => `
    <li><a href="mailto:${esc(m)}">${esc(m)}</a> <button class="link-btn" type="button" data-copy="${esc(m)}">copiar</button></li>`).join("");
  mails.addEventListener("click", (e) => { const b = e.target.closest("[data-copy]"); if (b) copy(b.dataset.copy, "Correo copiado"); });
  $("#ctaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $(id).value.trim();
    const quien = [v("#ctaNombre"), v("#ctaOrg")].filter(Boolean).join(" · ");
    const subject = `Consulta · ${v("#ctaSector")}${quien ? " · " + quien : ""}`;
    location.href = `mailto:${CONTACT_EMAILS.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(v("#ctaMsg") + (quien ? `\n\n— ${quien}` : ""))}`;
  });
})();
