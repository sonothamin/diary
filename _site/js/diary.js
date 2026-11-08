(() => {
  const grid = document.querySelector(".design-grid");
  const siteCursor = document.querySelector("[data-site-cursor]");
  const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ---------- Cursor sizing ---------- */
  const getCursorMetrics = () => {
    const dpr = window.devicePixelRatio || 1;
    const density = (96 * dpr) / 160;

    let scale = 1;
    if (density >= 3.5) scale = 4;
    else if (density >= 2.5) scale = 3;
    else if (density >= 1.75) scale = 2;
    else if (density >= 1.25) scale = 1.5;

    const shortCss = Math.min(window.innerWidth, window.innerHeight);
    const baseMdpi = Math.round(Math.max(48, Math.min(64, shortCss * 0.045)));
    const sizeCss = Math.round(baseMdpi * scale);

    return {
      sizeCss,
      hotspotX: Math.round(sizeCss * (10.5 / 24)),
      hotspotY: Math.round(sizeCss * (9 / 24)),
    };
  };

  let metrics = getCursorMetrics();

  const applyCursorSize = (m) => {
    const root = document.documentElement;
    root.style.setProperty("--cursor-size", `${m.sizeCss}px`);
    root.style.setProperty("--cursor-hot-x", `${m.hotspotX}px`);
    root.style.setProperty("--cursor-hot-y", `${m.hotspotY}px`);
    root.style.setProperty("--cursor", `url("/assets/cursors/cursor.svg") ${m.hotspotX} ${m.hotspotY}, auto`);

    if (!siteCursor) return;
    // Hand pointer: ~0.58x the arrow box, fingertip (41.5% / 9%) lands on the hotspot.
    const hand = Math.round(m.sizeCss * 0.58);
    const hx = hand * 0.415;
    const hy = hand * 0.09;
    siteCursor.style.setProperty("--hand-size", `${hand}px`);
    siteCursor.style.setProperty("--hand-hx", `${hx}px`);
    siteCursor.style.setProperty("--hand-hy", `${hy}px`);
    siteCursor.style.setProperty("--hand-left", `${m.hotspotX - hx}px`);
    siteCursor.style.setProperty("--hand-top", `${m.hotspotY - hy}px`);
  };

  applyCursorSize(metrics);
  window.addEventListener(
    "resize",
    () => {
      metrics = getCursorMetrics();
      applyCursorSize(metrics);
    },
    { passive: true }
  );

  /* ---------- Site cursor + grid glow ---------- */
  const initSiteCursor = () => {
    if (!siteCursor || coarse) return;

    const move = (x, y) => {
      siteCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      siteCursor.classList.add("is-on");
      if (grid) {
        grid.style.setProperty("--mx", `${x}px`);
        grid.style.setProperty("--my", `${y}px`);
        grid.classList.add("has-glow");
      }
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        if (!document.body.classList.contains("cursor-ready")) {
          document.body.classList.add("cursor-ready");
        }
        move(e.clientX, e.clientY);
      },
      { passive: true }
    );

    document.documentElement.addEventListener("mouseleave", () => {
      siteCursor.classList.remove("is-on");
      grid?.classList.remove("has-glow");
    });

    document.addEventListener("pointerover", (e) => {
      siteCursor.classList.toggle(
        "is-link",
        !!e.target.closest("a, button, [role='button'], summary, label[for]")
      );
    });

    window.addEventListener("pointerdown", () => siteCursor.classList.add("is-press"));
    window.addEventListener("pointerup", () => siteCursor.classList.remove("is-press"));
  };

  initSiteCursor();
})();

/* ---------- Category column accordion toggle ---------- */
document.querySelectorAll(".col").forEach(function (col) {
  var btn = col.querySelector("[data-toggle]");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var open = col.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? btn.dataset.less : btn.dataset.more;
  });
});
