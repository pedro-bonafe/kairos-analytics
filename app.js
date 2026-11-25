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
    // Ejes cartesianos: la flecha horizontal marca el sentido "de disperso a ordenado"
    const W = COLS * C, H = ROWS * C, AX = -14, AY = H + 14;
    const ejes = `<g class="axis" aria-hidden="true">
        <path d="M${AX} ${AY}H${W + 6}M${AX} ${AY}V${-4}"/>
        <polygon points="${W + 16},${AY} ${W + 4},${AY - 6} ${W + 4},${AY + 6}"/>
        <polygon points="${AX},${-14} ${AX - 6},${-2} ${AX + 6},${-2}"/>
      </g>`;
    el.innerHTML = `<svg class="mosaic" viewBox="-24 -16 ${W + 44} ${H + 38}" role="img" aria-label="Celdas de colores sueltas a la izquierda que se agrupan en un bloque ordenado a la derecha, sobre un eje que avanza de izquierda a derecha">
      <defs><linearGradient id="gMosaic" gradientUnits="userSpaceOnUse" x1="80.5" y1="536.4" x2="495.5" y2="-56.4">${STOPS}</linearGradient></defs>
      ${ejes}${cells}</svg>`;
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
  /* ------------------------------------------------------------------------
     Gráficos por sector. Todos comparten las clases de animación de .gfx:
     grow (crece desde la base), pop (aparece desde el centro), drop (cae y
     se apila) y draw (el trazo se dibuja). Se disparan con .graphic-panel.in.
     ------------------------------------------------------------------------ */
  const gfx = (el, id, W, H, label, body, grad = `x1="0" y1="${H}" x2="${W}" y2="0"`) => {
    el.innerHTML = `<svg class="gfx" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">
      <defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" ${grad}>${STOPS}</linearGradient></defs>
      ${body}</svg>`;
  };

  // Industrias: margen por línea de producto, con barras en forma de fábrica
  // (techo de diente de sierra, ventanas y chimenea con humo).
  function factories(el) {
    const W = 408, H = 250, BASE = 236, FW = 52, GAP = 16, X0 = 8, MAX = 150;
    const pct = [58, 74, 34, 92, 66, 82];
    let body = `<path class="gfx-ground" d="M0 ${BASE + .5}H${W}"/>`;
    pct.forEach((p, i) => {
      const x = X0 + i * (FW + GAP), top = BASE - MAX * p / 100, half = FW / 2;
      const roof = `${x},${top} ${x + half},${top - 14} ${x + half},${top} ${x + FW},${top - 14} ${x + FW},${top}`;
      let win = "";
      for (let y = top + 14; y < BASE - 18; y += 22) for (let k = 0; k < 3; k++) win += `<rect class="gfx-win" x="${x + 8 + k * 14}" y="${y}" width="8" height="10"/>`;
      body += `<g class="grow${i === 2 ? " bar-alert" : ""}" style="--d:${i * 90}ms" fill="url(#gFab)">
          <rect x="${x + FW - 14}" y="${top - 40}" width="8" height="40"/>
          <polygon points="${roof}"/>
          <rect x="${x}" y="${top}" width="${FW}" height="${BASE - top}"/>
          ${win}
        </g>
        <circle class="smoke" style="--d:${1000 + i * 380}ms" cx="${x + FW - 10}" cy="${top - 48}" r="5"/>`;
    });
    gfx(el, "gFab", W, H, "Seis fábricas de distinta altura: el margen de cada línea de producto, con la tercera más baja en alerta", body,
      `x1="0" y1="0" x2="${W}" y2="0"`);
  }

  // Comercios: una vidriera con toldo y góndolas; los huecos son faltantes.
  function shop(el) {
    const W = 408, H = 262, SEG = 51;
    let body = "";
    for (let i = 0; i < 8; i++) {
      const x = i * SEG, f = i % 2 ? "var(--surface-2)" : "url(#gShop)";
      body += `<rect class="pop" style="--d:${i * 50}ms" x="${x}" y="4" width="${SEG}" height="22" fill="${f}"/>
        <path class="pop" style="--d:${i * 50}ms" d="M${x} 26a${SEG / 2} ${SEG / 2 - 8} 0 0 0 ${SEG} 0z" fill="${f}"/>`;
    }
    body += `<rect class="gfx-frame" x="14" y="58" width="${W - 28}" height="${H - 62}" rx="4"/>`;
    const falta = [[3, 4], [8], [1, 6, 7]];
    [110, 172, 234].forEach((y, r) => {
      body += `<path class="gfx-shelf" d="M26 ${y + .5}H${W - 26}"/>`;
      for (let k = 0; k < 11; k++) {
        const x = 31 + k * 32, h = 30 + ((k * 7 + r * 5) % 4) * 4;
        body += falta[r].includes(k)
          ? `<rect class="gfx-falta" x="${x}" y="${y - 34}" width="26" height="34" rx="2"/>`
          : `<rect class="grow" style="--d:${300 + r * 160 + k * 30}ms" x="${x}" y="${y - h}" width="26" height="${h}" rx="2" fill="url(#gShop)"/>`;
      }
    });
    gfx(el, "gShop", W, H, "Una vidriera con toldo y tres góndolas con productos; los huecos marcados son faltantes de stock", body);
  }

  // Logística: un mapa de celdas con rutas que salen del depósito y se trazan
  // hasta cada entrega.
  function routes(el) {
    const C = 32, COLS = 13, ROWS = 8, W = COLS * C, H = ROWS * C, P = (c) => c * C + C / 2;
    const rutas = [
      [[6, 4], [6, 1], [11, 1], [11, 3]],
      [[6, 4], [2, 4], [2, 1]],
      [[6, 4], [9, 4], [9, 6], [12, 6]],
      [[6, 4], [6, 7], [1, 7], [1, 5]],
    ];
    let body = "";
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++)
      body += `<rect class="cell-off" x="${c * C + 2}" y="${r * C + 2}" width="${C - 4}" height="${C - 4}"/>`;
    rutas.forEach((ru, i) => {
      const d = ru.map(([c, r], j) => `${j ? "L" : "M"}${P(c)} ${P(r)}`).join("");
      body += `<path class="gfx-route draw" style="--d:${300 + i * 260}ms" pathLength="1" d="${d}"/>`;
      ru.slice(1).forEach(([c, r], j) => {
        const fin = j === ru.length - 2, s = fin ? 18 : 10;
        body += `<rect class="pop" style="--d:${300 + i * 260 + (j + 1) * 260}ms" x="${P(c) - s / 2}" y="${P(r) - s / 2}" width="${s}" height="${s}" rx="${fin ? 3 : 2}" fill="url(#gRoute)"/>`;
      });
    });
    body += `<rect class="pop" style="--d:0ms" x="${P(6) - 15}" y="${P(4) - 15}" width="30" height="30" rx="4" fill="var(--ink)"/>`;
    gfx(el, "gRoute", W, H, "Mapa de celdas con cuatro rutas de reparto que salen de un depósito central hasta los puntos de entrega", body);
  }

  // Construcción: tres obras que se levantan con bloques apilados; la línea
  // punteada es la altura que marca el presupuesto a esta fecha.
  function blocks(el) {
    const W = 408, H = 260, BASE = 250, TW = 104, GAP = 44, BH = 17;
    const obras = [[11, 10], [9, 9], [11, 6]]; // [previsto, real] en hileras
    let body = `<path class="gfx-ground" d="M0 ${BASE + .5}H${W}"/>`;
    obras.forEach(([prev, real], t) => {
      const x0 = 4 + t * (TW + GAP);
      for (let r = 0; r < real; r++) {
        const y = BASE - (r + 1) * BH, piezas = r % 2 ? [13, 26, 26, 26, 13] : [26, 26, 26, 26];
        let x = x0;
        piezas.forEach((w) => {
          body += `<rect class="drop" style="--d:${t * 160 + r * 90}ms" x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${BH - 2}" rx="1.5" fill="url(#gBlk)"/>`;
          x += w;
        });
      }
      body += `<rect class="gfx-plan${real < prev * .7 ? " bar-alert" : ""}" x="${x0 - 3}" y="${BASE - prev * BH - 3}" width="${TW + 6}" height="${prev * BH + 3}" rx="3"/>`;
    });
    gfx(el, "gBlk", W, H, "Tres obras hechas de bloques apilados junto a la altura prevista por el presupuesto; la tercera va atrasada", body);
  }

  // Ministerios: la conducción en el centro, conectada con cada área y sus
  // expedientes en una base común.
  function network(el) {
    const W = 408, H = 260, CX = W / 2, CY = H / 2, N = 6, f = (n) => n.toFixed(1);
    let lines = "", nodes = "";
    for (let i = 0; i < N; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / N;
      const ax = CX + 128 * Math.cos(a), ay = CY + 86 * Math.sin(a);
      lines += `<path class="gfx-link draw" style="--d:${200 + i * 120}ms" pathLength="1" d="M${CX} ${CY}L${f(ax)} ${f(ay)}"/>`;
      nodes += `<rect class="pop" style="--d:${500 + i * 120}ms" x="${f(ax - 11)}" y="${f(ay - 11)}" width="22" height="22" rx="3" fill="url(#gNet)"/>`;
      [-.22, .22].forEach((da, k) => {
        const bx = CX + 184 * Math.cos(a + da), by = CY + 118 * Math.sin(a + da);
        lines += `<path class="gfx-sub draw" style="--d:${900 + i * 120 + k * 80}ms" pathLength="1" d="M${f(ax)} ${f(ay)}L${f(bx)} ${f(by)}"/>`;
        nodes += `<rect class="pop" style="--d:${1100 + i * 120 + k * 80}ms" x="${f(bx - 5)}" y="${f(by - 5)}" width="10" height="10" rx="2" fill="url(#gNet)"/>`;
      });
    }
    nodes += `<rect class="pop" style="--d:0ms" x="${CX - 18}" y="${CY - 18}" width="36" height="36" rx="4" fill="var(--ink)"/>`;
    gfx(el, "gNet", W, H, "Red con la conducción en el centro conectada a seis áreas, cada una con sus expedientes", lines + nodes);
  }
  const GRAFICOS = { bars, map, factories, shop, routes, blocks, network };
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
          ${paso("03", "la solución", s.mejora)}
        </div>
        <div class="label eje-incluye">qué incluye</div>
        <ul class="chips-list">${s.items.map((it) => `<li><b>${esc(it[0])}</b><span>${esc(it[1])}</span></li>`).join("")}</ul>
        <a class="btn btn-secondary btn-sm eje-demos" href="demo/">Ver demos <span class="arrow" aria-hidden="true">→</span></a>
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

  // Rótulos de cada eje, para las fichas de casos y el diagnóstico
  const nombreServicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.t]));
  const verboServicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.verbo]));

  /* ------------------------------------------------------------------------
     Sectores y casos: primer nivel por ámbito (privado / público) y segundo
     nivel por subsector, con el contexto del sector y sus casos.
     ------------------------------------------------------------------------ */
  const vtabs = $("#vtabs"), stabs = $("#stabs"), vpanel = $("#vpanel");
  const sector = Object.fromEntries(SECTORES.map((x) => [x.id, x]));
  const servicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s]));
  vtabs.innerHTML = AMBITOS.map((a, i) => `
    <button class="vtab" role="tab" id="atab-${a.id}" aria-controls="stabs" data-a="${a.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"><b>${esc(a.nombre)}</b><span>${esc(a.bajada)}</span></button>`).join("");
  const ultimoDe = {}; // último subsector elegido en cada ámbito
  function selectAmbito(id, focus, sub) {
    $$(".vtab", vtabs).forEach((b) => {
      const on = b.dataset.a === id;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    stabs.setAttribute("aria-labelledby", `atab-${id}`);
    const subs = VERTICALES.filter((v) => v.ambito === id);
    stabs.innerHTML = subs.map((v) => `
      <button class="stab" role="tab" id="vtab-${v.id}" aria-controls="vpanel" data-v="${v.id}" title="${esc(v.bajada)}">${esc(v.nombre)}</button>`).join("");
    selectVertical(sub || ultimoDe[id] || subs[0].id);
  }

  function card(p) {
    return `
      <article class="pcard">
        <div class="pcard-top">
          <div>
            <div class="label-sm">${p.servicios.map((id) => esc(nombreServicio[id])).join(" · ")}</div>
            <h4>${esc(p.titulo)}</h4>
            <div class="client">${esc(p.cliente)}</div>
          </div>
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
    const v = VERTICALES.find((x) => x.id === id), x = sector[v.sector];
    const g = v.grafico ? v : x; // una vertical puede tener su propio gráfico
    let html = `<div class="swap"><p class="sector-bajada label">${esc(v.bajada)}</p>`;
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
            <div class="graphic-${g.grafico}" data-grafico="${g.grafico}"></div>
            <div class="graphic-axis label-sm">${g.graficoEje.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
            <div class="label-sm">${esc(g.graficoNota)}</div>
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
    if (!v.grupos.length) html += `
      <div class="sin-caso">
        <p>Todavía no publicamos un caso de ${esc(v.nombre.toLowerCase())}. Los problemas se parecen a los de otros sectores, y los sistemas de las demos se adaptan a tu operación.</p>
        <div class="actions">
          <a class="btn btn-primary btn-sm" href="#contacto">Hacer el diagnóstico</a>
          <a class="btn btn-secondary btn-sm" href="demo/">Ver las demos <span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>`;
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
    const v = VERTICALES.find((x) => x.id === id);
    if (!$(`[data-a="${v.ambito}"][aria-selected="true"]`, vtabs)) return selectAmbito(v.ambito, false, id);
    ultimoDe[v.ambito] = id;
    $$(".stab", stabs).forEach((b) => {
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
  // Cómo trabajamos: una columna por eje, con sus pasos numerados
  $("#pasosGrid").innerHTML = PASOS.map((g, i) => {
    const s = SERVICIOS.find((x) => x.id === g.eje);
    return `
    <li class="method-col">
      <div class="method-head">
        <span class="label">0${i + 1}</span>
        <span class="method-verbo">${esc(cap(s.verbo))}.</span>
        <span class="method-nombre">${esc(s.t)}</span>
      </div>
      <ol class="method-pasos">${g.pasos.map((p, j) => `
        <li class="rule-item" style="--d:${(i * 3 + j) * 110}ms">
          <div class="label-sm">${i + 1}.${j + 1}</div>
          <b>${esc(p[0])}</b>
          <span>${esc(p[1])}</span>
        </li>`).join("")}
      </ol>
    </li>`;
  }).join("");
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

  tabKeys(vtabs, ".vtab", (b, focus) => selectAmbito(b.dataset.a, focus));
  tabKeys(stabs, ".stab", (b, focus) => selectVertical(b.dataset.v, focus));
  selectAmbito(AMBITOS[0].id);

  /* ------------------------------------------------------------------------
     Las demos viven en /demo. Los enlaces viejos (index.html#demo-costeo)
     se redirigen a la misma demo en la página nueva.
     ------------------------------------------------------------------------ */
  function demoFromHash() {
    const dm = location.hash.match(/^#demo-(\w+)$/);
    if (dm) location.replace(`demo/#demo-${dm[1]}`);
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

  /* ------------------------------------------------------------------------
     Diagnóstico inicial: 1 · datos de la empresa, 2 · cuestionario
     (Auditoría Express + datos y sistemas), 3 · resultado, calculadora de
     rentabilidad, envío por correo y agenda.
     ------------------------------------------------------------------------ */
  const form = $("#ctaForm");
  const steps = $$(".diag-step", form), stepDots = $$("#diagSteps li");
  let step = 0;
  const D = DIAGNOSTICO;
  const PREG = D.bloques.flatMap((b) => b.qs.map((q) => ({ ...q, b })));
  const VAL = Object.fromEntries(D.escala.map(([k, , v]) => [k, v]));
  const LBL = Object.fromEntries(D.escala.map(([k, l]) => [k, l]));
  const pesos = (n) => "$ " + Math.round(n).toLocaleString("es-AR");
  const pct = (x) => Math.round(x * 100) + "%";
  const num = (n, d = 1) => Number(n).toLocaleString("es-AR", { maximumFractionDigits: d });
  const opts = (arr) => arr.map((t) => `<option>${esc(t)}</option>`).join("");
  $("#ctaModelo").innerHTML = opts(D.modelos);
  $("#ctaTamano").innerHTML = opts(D.tamanos);

  // Paso 2: bloques y preguntas Sí / Más o menos / No
  let nq = 0;
  $("#diagPreguntas").innerHTML = D.bloques.map((b) => `
    <div class="diag-bloque">
      <div class="diag-bloque-head"><b>${esc(b.nom)}</b><span>${esc(b.desc)}</span></div>
      ${b.qs.map((q) => `
      <fieldset class="diag-q" id="q-${q.id}" data-n="${++nq}" aria-describedby="err-${q.id}">
        <legend><span class="label-sm">${String(nq).padStart(2, "0")}</span>${esc(q.t)}</legend>
        <div class="diag-opts">${D.escala.map(([k, l]) => `
          <label><input type="radio" name="${q.id}" value="${k}" required /><span>${esc(l)}</span></label>`).join("")}
        </div>
        ${q.extra ? `<div class="diag-extra" hidden>
          <label for="x-${q.extra.k}">${esc(q.extra.lbl)} <span class="opt">(opcional, alimenta la calculadora)</span></label>
          <input id="x-${q.extra.k}" data-extra="${q.extra.k}" type="number" inputmode="decimal" min="0" step="any" />
        </div>` : ""}
        <p class="field-error" id="err-${q.id}" hidden>Elegí una opción.</p>
      </fieldset>`).join("")}
    </div>`).join("");

  /* --- Campos obligatorios: aviso en cada campo y resumen de lo que falta --- */
  const MSG = {
    ctaNombre: { valueMissing: "Completá tu nombre." },
    ctaEmail: { valueMissing: "Completá tu correo.", typeMismatch: "Revisá el correo: tiene que ser del tipo nombre@empresa.com." },
    ctaOrg: { valueMissing: "Completá el nombre de la empresa u organismo." },
  };
  const ROTULO = { ctaNombre: "nombre", ctaEmail: "correo", ctaOrg: "empresa u organismo" };
  // Un aviso (oculto) por paso, junto a los botones
  steps.slice(0, 2).forEach((s) => ($(".diag-nav", s) || $("[type=submit]", s)).insertAdjacentHTML("beforebegin", `<div class="form-alert" role="alert" hidden></div>`));

  function errorCampo(el) {
    let p = $(`#err-${el.id}`);
    if (!p) {
      el.insertAdjacentHTML("afterend", `<p class="field-error" id="err-${el.id}" hidden></p>`);
      p = $(`#err-${el.id}`);
      el.setAttribute("aria-describedby", p.id);
    }
    return p;
  }
  // Lista lo que falta en el paso n. Con `marcar` muestra el aviso de cada
  // campo; sin él solo actualiza los que ya estaban marcados.
  function faltantes(n, marcar) {
    const out = [];
    if (n === 0) {
      $$("input[required]", steps[0]).forEach((el) => {
        const v = el.validity, m = MSG[el.id] || {};
        const msg = v.valueMissing ? m.valueMissing : v.typeMismatch ? m.typeMismatch : "";
        if (msg) out.push({ el, txt: v.typeMismatch ? `${ROTULO[el.id]} (no es válido)` : ROTULO[el.id] });
        if (marcar || el.hasAttribute("aria-invalid")) {
          const p = errorCampo(el);
          p.textContent = msg;
          p.hidden = !msg;
          el.toggleAttribute("aria-invalid", !!msg);
        }
      });
    } else if (n === 1) {
      PREG.forEach((q) => {
        const fs = $(`#q-${q.id}`), ok = !!resp(q.id);
        if (!ok) out.push({ el: fs, txt: fs.dataset.n });
        if (marcar || fs.classList.contains("is-invalid")) {
          fs.classList.toggle("is-invalid", !ok);
          $(`#err-${q.id}`).hidden = ok;
        }
      });
    }
    return out;
  }
  const lista = (a) => (a.length > 1 ? a.slice(0, -1).join(", ") + " y " + a[a.length - 1] : a[0] || "");
  function resumen(n, f) {
    const box = $(".form-alert", steps[n]);
    if (!box) return;
    if (!f.length) { box.hidden = true; box.innerHTML = ""; return; }
    const txt = n === 0
      ? `Para seguir, falta completar: ${lista(f.map((x) => x.txt))}.`
      : f.length === 1
        ? `Para ver tu diagnóstico, falta responder la pregunta ${f[0].txt}.`
        : `Para ver tu diagnóstico, faltan responder ${f.length} preguntas: ${lista(f.map((x) => x.txt))}.`;
    box.innerHTML = `<span>${esc(txt)}</span> <button class="link-btn" type="button" data-ir>Ir a ${n === 0 ? "lo que falta" : "la primera"} →</button>`;
    box.hidden = false;
  }
  function irA(el) {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    (el.matches("fieldset") ? $("input", el) : el).focus({ preventScroll: true });
  }
  function pasoValido(n) {
    const f = faltantes(n, true);
    resumen(n, f);
    if (f.length) irA(f[0].el);
    return !f.length;
  }
  // Al corregir, los avisos se actualizan solos
  const refrescarAvisos = () => {
    const box = $(".form-alert", steps[step]);
    if ((box && !box.hidden) || $("[aria-invalid], .is-invalid", steps[step])) resumen(step, faltantes(step, false));
  };
  form.addEventListener("input", (e) => {
    if (e.target.matches("[data-extra]")) { $(`#calc-${e.target.dataset.extra}`).value = e.target.value; calcular(); }
    refrescarAvisos();
  });
  form.addEventListener("change", (e) => {
    const r = e.target;
    if (r.type !== "radio") return;
    const ex = $(".diag-extra", r.closest("fieldset"));
    if (ex) ex.hidden = r.value !== "si";
    refrescarAvisos();
  });

  function goStep(n) {
    step = n;
    steps.forEach((s, i) => (s.hidden = i !== n));
    stepDots.forEach((d, i) => { d.classList.toggle("on", i <= n); d.toggleAttribute("aria-current", i === n); });
    if (n === 2) renderResultado();
    const h = $("h3", steps[n]);
    if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); }
    const top = form.getBoundingClientRect().top;
    if (top < 80) scrollTo({ top: scrollY + top - 96, behavior: reduced ? "auto" : "smooth" });
  }

  /* --- Puntaje (reglas de la Auditoría Express) --- */
  function resp(id) { const r = form.querySelector(`input[name="${id}"]:checked`); return r && r.value; }
  function bloque(b) {
    const r = b.qs.map((q) => resp(q.id)).filter(Boolean);
    const pts = r.reduce((a, k) => a + VAL[k], 0), max = r.length * 2;
    return { b, pts, max, pct: max ? pts / max : 0 };
  }
  function evaluar() {
    const bs = D.bloques.map(bloque);
    const pts = bs.reduce((a, x) => a + x.pts, 0), max = bs.reduce((a, x) => a + x.max, 0);
    const total = max ? pts / max : 0;
    return {
      bs, total,
      cierre: D.cierre.find(([hasta]) => total < hasta)[1],
      falta: PREG.filter((q) => resp(q.id) === "no").map((q) => q.c),
      parcial: PREG.filter((q) => resp(q.id) === "mm").map((q) => q.c),
      foco: bs.reduce((a, x) => (x.pct < a.pct ? x : a)),
    };
  }
  const nivel = (p, alto) => (p >= alto ? "ok" : p >= 0.4 ? "warn" : "bad");

  function renderResultado() {
    const ev = evaluar(), sv = servicio[ev.foco.b.eje];
    $("#diagResultado").innerHTML = `
      <div class="diag-total ${nivel(ev.total, 0.7)}">
        <div class="diag-eje-head"><b>Evaluación final</b><span class="diag-pct">${pct(ev.total)}</span></div>
        <div class="meter" role="img" aria-label="Evaluación final: ${Math.round(ev.total * 100)} por ciento"><i style="width:${Math.max(ev.total * 100, 3)}%"></i></div>
        <p>${esc(ev.cierre)}</p>
      </div>
      <div class="diag-ejes">${ev.bs.map((x) => `
        <div class="diag-eje ${nivel(x.pct, D.corteAlto)}">
          <div class="diag-eje-head"><b>${esc(x.b.nom)}</b><span class="label-sm">${pct(x.pct)}</span></div>
          <div class="meter" role="img" aria-label="${esc(x.b.nom)}: ${Math.round(x.pct * 100)} por ciento"><i style="width:${Math.max(x.pct * 100, 3)}%"></i></div>
          <span>${esc(x.pct >= D.corteAlto ? x.b.alto : x.b.bajo)}</span>
        </div>`).join("")}
      </div>
      ${ev.falta.length || ev.parcial.length ? `<div class="diag-brecha">
        <div class="label">dónde está la brecha</div>
        ${ev.falta.length ? `<p><b>Hoy no se dispone de:</b> ${esc(ev.falta.join("; "))}.</p>` : ""}
        ${ev.parcial.length ? `<p><b>Se maneja de manera parcial o informal:</b> ${esc(ev.parcial.join("; "))}.</p>` : ""}
      </div>` : ""}
      <div class="diag-foco">
        <div class="label">por dónde empezaríamos</div>
        <b>${esc(ev.foco.b.nom)} · ${esc(sv.t)}</b>
        <p>${esc(sv.frase)}</p>
      </div>`;
    // Los datos cargados en las preguntas pasan a la calculadora si está vacía
    $$("[data-extra]", form).forEach((x) => {
      const c = $(`#calc-${x.dataset.extra}`);
      if (x.value && !c.value) c.value = x.value;
    });
    calcular();
    const cal = $("#diagAgenda");
    cal.hidden = !CALENDAR_URL;
    if (CALENDAR_URL) cal.href = CALENDAR_URL;
    $("#diagAgendaNota").textContent = CALENDAR_URL
      ? "Enviá el diagnóstico y elegí un horario: llegamos a la reunión con tus respuestas leídas."
      : WEB3FORMS_KEY
        ? "Enviá el diagnóstico y te escribimos para coordinar la reunión."
        : "Enviá el diagnóstico y proponé en el correo dos o tres horarios que te queden bien.";
  }

  /* --- Calculadora de rentabilidad (misma cuenta que la Auditoría Express) --- */
  const campo = (k, lbl, ph) => `<div><label for="calc-${k}">${lbl}</label><input id="calc-${k}" data-calc="${k}" type="number" inputmode="decimal" min="0" step="any" placeholder="${ph}" /></div>`;
  $("#diagResultado").insertAdjacentHTML("afterend", `
    <details class="calc" id="diagCalc">
      <summary><b>Calculadora de rentabilidad</b><span class="label-sm">opcional · estimación rápida en pesos</span></summary>
      <p class="form-note">Cargá cuatro números y mirá cuánto deja tu empresa por mes, dónde está tu punto de equilibrio y cuánto vale mejorar el margen. Se calcula en tu navegador: solo nos llega si marcás la opción de abajo.</p>
      <div class="form-row">
        ${campo("facturacion", "Facturación mensual promedio ($)", "Ej.: 25000000")}
        ${campo("margen", "Margen de contribución (%)", "Ej.: 35")}
      </div>
      <div class="form-row">
        ${campo("cf", "Costos fijos mensuales ($)", "Ej.: 6000000")}
        ${campo("optim", "Mejora posible del margen (puntos)", "Ej.: 3")}
      </div>
      <div id="calcOut" aria-live="polite"></div>
      <label class="check-line"><input type="checkbox" id="calcEnviar" /> <span>Incluir estas cifras en el correo</span></label>
    </details>`);
  function cuentas() {
    const v = (k) => Number($(`#calc-${k}`).value) || 0;
    const f = v("facturacion"), mg = v("margen") / 100, cf = v("cf"), opt = v("optim") / 100;
    if (!f || !mg) return null;
    const cm = f * mg, rb = cm - cf;
    return { f, mg, cf, opt, cv: f - cm, cm, rb, util: rb / f, pe: cf / mg, mayor: f * opt };
  }
  function calcular() {
    const c = cuentas(), out = $("#calcOut");
    if (!c) { out.innerHTML = `<p class="form-note">Cargá la facturación y el margen de contribución para ver el cálculo.</p>`; return; }
    const fila = (l, v, cls = "") => `<tr><td>${l}</td><td class="num ${cls}">${v}</td></tr>`;
    const lectura = c.rb < 0
      ? `Estarías operando ${pesos(c.pe - c.f)} por debajo de tu punto de equilibrio: cada mes sin corregir precios o estructura de costos profundiza la pérdida.`
      : c.cf ? `Tu margen de seguridad es del ${num((c.f - c.pe) / c.f * 100)}%: es lo que puede caer la facturación antes de entrar en pérdida.` : "";
    out.innerHTML = `
      <table class="calc-t">
        ${fila("Facturación", pesos(c.f))}
        ${fila("Costos variables", pesos(c.cv))}
        ${fila("<b>Contribución marginal</b>", `<b>${pesos(c.cm)}</b>`)}
        ${fila("Costos fijos", pesos(c.cf))}
        ${fila("<b>Resultado del mes</b>", `<b>${pesos(c.rb)}</b>`, c.rb >= 0 ? "pos" : "neg")}
        ${fila("Rentabilidad sobre ventas", `${num(c.util * 100)}%`, c.util >= 0 ? "pos" : "neg")}
        ${fila("Punto de equilibrio mensual", `<b>${pesos(c.pe)}</b>`)}
      </table>
      ${lectura ? `<p class="calc-lectura">${esc(lectura)}</p>` : ""}
      ${c.opt ? `<p class="calc-mejora">Una mejora de <b>${num(c.opt * 100)} puntos</b> en el margen representa <b>${pesos(c.mayor)}</b> más por mes: <b>${pesos(c.mayor * 12)} en el año</b>.</p>`
        : `<p class="form-note">Cargá una mejora posible del margen para ver su impacto en el año.</p>`}`;
  }
  $("#diagCalc").addEventListener("input", (e) => { if (e.target.matches("[data-calc]")) calcular(); });

  /* --- Envío: correo con todo y, de respaldo, copiar el texto --- */
  function textoDiagnostico() {
    const v = (id) => $(id).value.trim();
    const si = (id, rotulo) => (v(id) ? `${rotulo}${v(id)}` : null); // null = campo vacío, se omite
    const ev = evaluar(), c = $("#calcEnviar").checked && cuentas();
    return [
      "DATOS DE LA EMPRESA",
      `Nombre: ${v("#ctaNombre")}`,
      `Correo: ${v("#ctaEmail")}`,
      `Empresa u organismo: ${v("#ctaOrg")}`,
      si("#ctaCargo", "Cargo: "),
      `Actividad: ${v("#ctaModelo")}`,
      `Tamaño: ${v("#ctaTamano")}`,
      si("#ctaSistemas", "Sistemas que usan: "),
      si("#ctaMsg", "\nQué quiere resolver:\n"),
      "",
      `DIAGNÓSTICO · evaluación final ${pct(ev.total)}`,
      ...ev.bs.map((x) => `${x.b.nom}: ${pct(x.pct)}`),
      ev.falta.length ? `\nNo dispone de: ${ev.falta.join("; ")}.` : null,
      ev.parcial.length ? `Parcial o informal: ${ev.parcial.join("; ")}.` : null,
      "",
      "Respuestas: " + PREG.map((q) => `${q.id} ${LBL[resp(q.id)] || "—"}`).join(" · "),
      c ? `\nCALCULADORA\nFacturación ${pesos(c.f)} · margen ${num(c.mg * 100)}% · costos fijos ${pesos(c.cf)}\nResultado del mes ${pesos(c.rb)} · punto de equilibrio ${pesos(c.pe)}${c.opt ? `\nMejora de ${num(c.opt * 100)} puntos: ${pesos(c.mayor)} por mes, ${pesos(c.mayor * 12)} por año` : ""}` : null,
      CALENDAR_URL || WEB3FORMS_KEY ? null : "\nHorarios que me quedan bien: ",
    ].filter((x) => x !== null).join("\n");
  }
  // Envío: por Web3Forms si hay clave (sin salir de la página); si no hay
  // clave o el servicio falla, queda el programa de correo como alternativa.
  const envioBox = document.createElement("div");
  envioBox.className = "form-status";
  envioBox.setAttribute("role", "status");
  envioBox.hidden = true;
  $(".diag-nav", steps[2]).after(envioBox);
  form.insertAdjacentHTML("beforeend", `<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />`);
  $(".label-sm.form-note", steps[2]).textContent = (WEB3FORMS_KEY
    ? "Nos llega sin que salgas de esta página. "
    : "Se abre tu programa de correo con las respuestas listas para enviar. ") + "Es una lectura orientativa, no un informe.";
  const asunto = () => `Diagnóstico inicial · ${$("#ctaOrg").value.trim()} · ${$("#ctaNombre").value.trim()}`;
  const abrirCorreo = () => {
    location.href = `mailto:${CONTACT_EMAILS.join(",")}?subject=${encodeURIComponent(asunto())}&body=${encodeURIComponent(textoDiagnostico())}`;
  };
  function estadoEnvio(tipo, html) {
    envioBox.className = `form-status form-status-${tipo}`;
    envioBox.innerHTML = html;
    envioBox.hidden = false;
  }
  let enviando = false, enviado = false;
  async function enviar() {
    if (!WEB3FORMS_KEY) return abrirCorreo();
    if (enviando || enviado) return;
    if (form.botcheck.checked) return; // relleno automático de un bot
    const btn = $("[type=submit]", steps[2]), txt = btn.innerHTML;
    enviando = true;
    btn.disabled = true;
    btn.textContent = "Enviando…";
    envioBox.hidden = true;
    try {
      const r = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: asunto(),
          from_name: `${BRAND} · diagnóstico web`,
          replyto: $("#ctaEmail").value.trim(),
          message: textoDiagnostico(),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.success === false) throw new Error(data.message || `HTTP ${r.status}`);
      enviado = true;
      btn.textContent = "Diagnóstico enviado ✓";
      estadoEnvio("ok", `<b>¡Listo! Recibimos tu diagnóstico.</b><span>Te respondemos a ${esc($("#ctaEmail").value.trim())} ${CALENDAR_URL ? "y, si querés, ya podés elegir un horario." : "para coordinar la reunión."}</span>`);
    } catch (err) {
      console.error(err);
      btn.disabled = false;
      btn.innerHTML = txt;
      estadoEnvio("bad", `<b>No pudimos enviarlo.</b><span>Probá de nuevo en un momento o <button class="link-btn" type="button" data-mail>envialo desde tu correo</button>.</span>`);
    } finally {
      enviando = false;
    }
  }
  envioBox.addEventListener("click", (e) => { if (e.target.closest("[data-mail]")) abrirCorreo(); });
  $("#diagAgenda").insertAdjacentHTML("afterend", `<button class="btn btn-ghost" id="diagCopiar" type="button">Copiar diagnóstico</button>`);
  $("#diagCopiar").addEventListener("click", () => copy(textoDiagnostico(), "Diagnóstico copiado: pegalo en un correo a " + CONTACT_EMAILS[0]));

  form.addEventListener("click", (e) => {
    if (e.target.closest("[data-ir]")) { const f = faltantes(step, false); if (f.length) irA(f[0].el); return; }
    const b = e.target.closest("[data-step]");
    if (!b) return;
    const n = +b.dataset.step;
    if (n > step && !pasoValido(step)) return;
    goStep(n);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (step < 2) { if (pasoValido(step)) goStep(step + 1); return; }
    enviar();
  });
  goStep(0);

  /* ------------------------------------------------------------------------
     Quiénes confían en nosotros: se muestra solo si hay testimonios cargados
     ------------------------------------------------------------------------ */
  if (TESTIMONIOS.length) {
    const sec = $("#confian");
    $("#confianGrid").innerHTML = TESTIMONIOS.map((t) => `
      <figure class="testimonio">
        ${t.logo ? `<img src="${esc(t.logo)}" alt="${esc(t.org)}" loading="lazy" />` : `<div class="testimonio-org">${esc(t.org)}</div>`}
        ${t.cita ? `<blockquote>${esc(t.cita)}</blockquote>` : ""}
        ${t.autor ? `<figcaption><b>${esc(t.autor)}</b>${t.cargo ? `<span>${esc(t.cargo)} · ${esc(t.org)}</span>` : ""}</figcaption>` : ""}
      </figure>`).join("");
    sec.hidden = false;
  }
})();
