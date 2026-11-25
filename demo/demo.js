/* ==========================================================================
   Página de demos (/demo): galería y modal. El contenido sale de data.js y
   las demos de demos.js, los mismos archivos que usa la landing.
   Enlace directo a una demo: /demo/#demo-costeo, #demo-reclamos, etc.
   ========================================================================== */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  $$("[data-brand]").forEach((el) => (el.textContent = BRAND));
  $("#year").textContent = new Date().getFullYear();

  // Aviso breve (copiar enlace)
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

  // Tema claro / oscuro (misma preferencia guardada que la landing)
  const themeBtn = $("#themeBtn");
  const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches);
  const syncThemeBtn = () => themeBtn.setAttribute("aria-label", isDark() ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  syncThemeBtn();
  themeBtn.addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    syncThemeBtn();
  });

  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  /* ------------------------------------------------------------------------
     Galería: una tarjeta por demo, agrupadas por sector
     ------------------------------------------------------------------------ */
  const PROYECTOS = VERTICALES.flatMap((v) => v.grupos.flatMap((g) => g.proyectos.map((p) => ({ ...p, vertical: v }))));
  const verboServicio = Object.fromEntries(SERVICIOS.map((s) => [s.id, s.verbo]));
  const conDemo = PROYECTOS.filter((p) => p.demo);
  $("#demoCount").textContent = conDemo.length;
  $("#demoTiles").innerHTML = conDemo.map((p, i) => `
    <article class="tile reveal" style="--d:${i * 60}ms">
      <div class="tile-top">
        <span class="label-sm">${esc(p.vertical.nombre.toLowerCase())} · ${p.servicios.map((id) => verboServicio[id]).join(" + ")}</span>
        <span class="tile-n label-sm">0${i + 1}</span>
      </div>
      <h3>${esc(p.demoTitulo)}</h3>
      <p>${esc(p.demoQue)}</p>
      <button class="tile-btn" data-demo="${p.demo}">Abrir demo <span class="arrow" aria-hidden="true">→</span></button>
    </article>`).join("");

  const io = "IntersectionObserver" in window && !reduced
    ? new IntersectionObserver((ents) => ents.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      }), { threshold: .12 })
    : null;
  $$(".reveal").forEach((el) => (io ? io.observe(el) : el.classList.add("in")));

  /* ------------------------------------------------------------------------
     Modal de demos
     ------------------------------------------------------------------------ */
  const modal = $("#demoModal");
  let lastFocus = null, currentKey = null;
  function openDemo(key) {
    const p = conDemo.find((x) => x.demo === key);
    if (!p || !DEMOS[key]) return;
    lastFocus = document.activeElement;
    currentKey = key;
    $("#demoTitle").textContent = p.demoTitulo;
    $("#demoSub").textContent = p.titulo;
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
    if (b) openDemo(b.dataset.demo);
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

  function demoFromHash() {
    const dm = location.hash.match(/^#demo-(\w+)$/);
    if (dm && currentKey !== dm[1]) openDemo(dm[1]);
  }
  addEventListener("hashchange", demoFromHash);
  demoFromHash();
})();
