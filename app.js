(() => {
  const SLIDES = [
    { file: "01-cover.jpg", label: "01 · Cover" },
    { file: "02-intro.jpg", label: "02 · Intro" },
    { file: "03-cover-still.jpg", label: "03 · Cover still" },
    { file: "04-work.jpg", label: "04 · Work" },
    { file: "05-cta.jpg", label: "05 · CTA" },
  ];

  const CAPTION = `Les presentamos el trabajo de Andre R. Guttfreund, cineasta salvadoreño-estadounidense, egresado del AFI y ganador del Óscar® al cortometraje de ficción por En la Región del Hielo. Mentor clave del cine centroamericano y presidente de ASCINE.

Director y productor detrás de proyectos como Femme Fatale, Relentless, Malacrianza y Cachada.

Perfil en Cinegrafo → https://www.cinegrafo.com/profile/andre-r-guttfreund

#Cinegrafo #FeaturedCrew #AndreGuttfreund #CineSalvadoreño #CineCentroamericano #Director #Producer #AFI #Oscar #EnLaRegionDelHielo #ASCINE #ElSalvador #FilmCommunity`;

  const track = document.getElementById("track");
  const dotsEl = document.getElementById("dots");
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const slideLabel = document.getElementById("slideLabel");
  const captionText = document.getElementById("captionText");
  const copyBtn = document.getElementById("copyCaption");
  const downloadList = document.getElementById("downloadList");

  let index = 0;
  let pointerId = null;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  function slideUrl(file) {
    return `./slides/${file}`;
  }

  function renderSlides() {
    track.innerHTML = SLIDES.map(
      (s, i) => `
      <figure class="slide" aria-hidden="${i === 0 ? "false" : "true"}">
        <img src="${slideUrl(s.file)}" alt="${s.label} — Andre R. Guttfreund" draggable="false" />
      </figure>`
    ).join("");

    dotsEl.innerHTML = SLIDES.map(
      (s, i) =>
        `<button type="button" class="dot" role="tab" aria-label="${s.label}" aria-selected="${i === 0}" data-index="${i}"></button>`
    ).join("");

    downloadList.innerHTML = SLIDES.map(
      (s) => `
      <li>
        <div class="dl-meta">
          <span class="dl-name">${s.label}</span>
          <span class="dl-file">${s.file}</span>
        </div>
        <a class="btn slim" href="${slideUrl(s.file)}" download="${s.file}">JPG</a>
      </li>`
    ).join("");
  }

  function goTo(i, { animate = true } = {}) {
    index = Math.max(0, Math.min(SLIDES.length - 1, i));
    if (!animate) track.style.transition = "none";
    track.style.transform = `translateX(-${index * 100}%)`;
    if (!animate) {
      void track.offsetWidth;
      track.style.transition = "";
    }

    [...track.children].forEach((el, n) => {
      el.setAttribute("aria-hidden", n === index ? "false" : "true");
    });
    [...dotsEl.children].forEach((dot, n) => {
      dot.setAttribute("aria-selected", n === index ? "true" : "false");
    });

    slideLabel.textContent = `${index + 1} / ${SLIDES.length} · ${SLIDES[index].label.replace(/^\d+\s·\s/, "")}`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === SLIDES.length - 1;
  }

  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    pointerId = e.pointerId;
    carousel.setPointerCapture(pointerId);
    dragging = true;
    startX = e.clientX;
    deltaX = 0;
    track.style.transition = "none";
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    deltaX = e.clientX - startX;
    const width = carousel.clientWidth || 1;
    const pct = (deltaX / width) * 100;
    track.style.transform = `translateX(calc(-${index * 100}% + ${pct}%))`;
  }

  function onPointerUp(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    try {
      carousel.releasePointerCapture(pointerId);
    } catch (_) {}
    pointerId = null;
    track.style.transition = "";
    const threshold = Math.min(80, (carousel.clientWidth || 320) * 0.18);
    if (deltaX < -threshold) goTo(index + 1);
    else if (deltaX > threshold) goTo(index - 1);
    else goTo(index);
    deltaX = 0;
  }

  function copyCaption() {
    const text = CAPTION;
    const done = () => {
      copyBtn.classList.add("copied");
      copyBtn.textContent = "Copiado";
      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.textContent = "Copiar";
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } finally {
      document.body.removeChild(ta);
    }
  }

  captionText.textContent = CAPTION;
  renderSlides();
  goTo(0);

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));
  dotsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    goTo(Number(btn.dataset.index));
  });

  carousel.addEventListener("pointerdown", onPointerDown);
  carousel.addEventListener("pointermove", onPointerMove);
  carousel.addEventListener("pointerup", onPointerUp);
  carousel.addEventListener("pointercancel", onPointerUp);

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(SLIDES.length - 1);
    }
  });

  copyBtn.addEventListener("click", copyCaption);
  carousel.addEventListener("click", () => carousel.focus({ preventScroll: true }));
})();
