(() => {
  const PROFILES = {
    andre: {
      slug: "andre",
      name: "Andre R. Guttfreund",
      subtitle: "Director · Productor · El Salvador",
      profileUrl: "https://www.cinegrafo.com/profile/andre-r-guttfreund",
      profilePath: "andre-r-guttfreund",
      slides: [
        { file: "01-cover.png", label: "01 · Cover" },
        { file: "02-intro.png", label: "02 · Intro" },
        { file: "03-cover-still.png", label: "03 · Cover still" },
        { file: "04-work.png", label: "04 · Work" },
        { file: "05-cta.png", label: "05 · CTA" },
      ],
      caption: `Les presentamos el trabajo de Andre R. Guttfreund, cineasta salvadoreño-estadounidense, egresado del AFI y ganador del Óscar® al cortometraje de ficción por En la Región del Hielo. Mentor clave del cine centroamericano y presidente de ASCINE.

Director y productor detrás de proyectos como Femme Fatale, Relentless, Malacrianza y Cachada.

Perfil en Cinegrafo → https://www.cinegrafo.com/profile/andre-r-guttfreund

#Cinegrafo #PerfilDestacado #AndreGuttfreund #CineSalvadoreño #CineCentroamericano #Director #Producer #AFI #Oscar #EnLaRegionDelHielo #ASCINE #ElSalvador #FilmCommunity`,
    },
    eve: {
      slug: "eve",
      name: "Eve Alas Morán",
      subtitle: "Actriz · Productora · El Salvador",
      profileUrl: "https://www.cinegrafo.com/profile/eve-alas-moran",
      profilePath: "eve-alas-moran",
      slides: [
        { file: "01-cover.png", label: "01 · Cover" },
        { file: "02-intro.png", label: "02 · Intro" },
        { file: "03-cover-still.png", label: "03 · Cover still" },
        { file: "04-work.png", label: "04 · Work" },
        { file: "05-cta.png", label: "05 · CTA" },
      ],
      caption: `Les presentamos el trabajo de Eve Alas Morán, actriz, bailarina, cantautora y productora salvadoreña.

Con BFA en Danza (Hofstra) y MFA en Acting for Film (NYFA Los Ángeles), Eve está representada por Avant Artists en LA. Campeona panamericana de gimnasia rítmica, ha protagonizado el corto Not By Choice (premio del público) y el video de Yacker. COO de BGM en Italia y Los Ángeles; actualmente escribe una serie de TV.

Perfil en Cinegrafo → https://www.cinegrafo.com/profile/eve-alas-moran

#Cinegrafo #PerfilDestacado #EveAlasMoran #CineSalvadoreño #Actriz #Productora #NotByChoice #ElSalvador #FilmCommunity`,
    },
    rysh: {
      slug: "rysh",
      name: "Rysh",
      subtitle: "Director · Editor · El Salvador",
      profileUrl: "https://www.cinegrafo.com/profile/angel-ricardo-rysh",
      profilePath: "angel-ricardo-rysh",
      slides: [
        { file: "01-cover.png", label: "01 · Cover" },
        { file: "02-intro.png", label: "02 · Intro" },
        { file: "03-cover-still.png", label: "03 · Cover still" },
        { file: "04-work.png", label: "04 · Work" },
        { file: "05-cta.png", label: "05 · CTA" },
      ],
      caption: `Les presentamos el trabajo de Rysh (Angel Ricardo Rysh), cineasta, director, productor y editor salvadoreño.

Con más de una década de experiencia desde sus primeros cortometrajes con el Colectivo Apolo 5 (fundador, 2014), ha participado en festivales en Chicago, Brasilia, San José, Panamá y París. Destacan Café Salvador (2017), Bilocación (2018) y Por eso odio a los monos (2023). Su estilo combina humor y reflexión sobre la vida cotidiana salvadoreña.

Perfil en Cinegrafo → https://www.cinegrafo.com/profile/angel-ricardo-rysh

#Cinegrafo #PerfilDestacado #Rysh #CineSalvadoreño #Director #Editor #Apolo5 #Bilocacion #ElSalvador #FilmCommunity`,
    },
  };

  const DRAG_THRESHOLD = 8;

  const track = document.getElementById("track");
  const dotsEl = document.getElementById("dots");
  const carousel = document.getElementById("carousel");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const slideLabel = document.getElementById("slideLabel");
  const captionText = document.getElementById("captionText");
  const copyBtn = document.getElementById("copyCaption");
  const downloadList = document.getElementById("downloadList");
  const profileName = document.getElementById("profileName");
  const profileSubtitle = document.getElementById("profileSubtitle");
  const profileLink = document.getElementById("profileLink");
  const profileSwitcher = document.getElementById("profileSwitcher");
  const emptyState = document.getElementById("emptyState");

  let currentSlug = "andre";
  let slides = PROFILES.andre.slides;
  let index = 0;
  let pointerId = null;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;
  let dragArmed = false;
  let dragActive = false;

  function slideUrl(slug, file) {
    return `./public/slides/${slug}/${file}`;
  }

  function wrapIndex(i, len) {
    if (len <= 0) return 0;
    return ((i % len) + len) % len;
  }

  function renderSlides() {
    if (!slides.length) {
      track.innerHTML = "";
      dotsEl.innerHTML = "";
      downloadList.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      carousel.classList.add("is-empty");
      slideLabel.textContent = "Sin slides";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    carousel.classList.remove("is-empty");

    const profile = PROFILES[currentSlug];
    track.innerHTML = slides
      .map(
        (s, i) => `
      <figure class="slide" aria-hidden="${i === 0 ? "false" : "true"}">
        <img src="${slideUrl(currentSlug, s.file)}" alt="${s.label} — ${profile.name}" draggable="false" />
      </figure>`
      )
      .join("");

    dotsEl.innerHTML = slides
      .map(
        (s, i) =>
          `<button type="button" class="dot" role="tab" aria-label="${s.label}" aria-selected="${i === 0}" data-index="${i}"></button>`
      )
      .join("");

    downloadList.innerHTML = slides
      .map(
        (s) => `
      <li>
        <div class="dl-meta">
          <span class="dl-name">${s.label}</span>
          <span class="dl-file">${currentSlug}/${s.file}</span>
        </div>
        <a class="btn slim" href="${slideUrl(currentSlug, s.file)}" download="${s.file}">PNG</a>
      </li>`
      )
      .join("");
  }

  function slideWidth() {
    return carousel.clientWidth || 1;
  }

  function setTrackOffset(px, { animate = true } = {}) {
    if (animate) {
      track.style.transition = "";
      track.style.transform = "translateX(" + px + "px)";
      return;
    }
    track.style.transition = "none";
    track.style.transform = "translateX(" + px + "px)";
    void track.offsetWidth;
    track.style.transition = "";
  }

  function goTo(i, { animate = true } = {}) {
    if (!slides.length) return;
    index = wrapIndex(i, slides.length);
    setTrackOffset(-index * slideWidth(), { animate });

    [...track.children].forEach((el, n) => {
      el.setAttribute("aria-hidden", n === index ? "false" : "true");
    });
    [...dotsEl.children].forEach((dot, n) => {
      dot.setAttribute("aria-selected", n === index ? "true" : "false");
    });

    const label = slides[index].label.replace(/^\d+\s·\s/, "");
    slideLabel.textContent = (index + 1) + " / " + slides.length + " · " + label;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function isInteractiveTarget(el) {
    return Boolean(el && el.closest && el.closest("button, a, .nav, .dots, .dot, .slide-label"));
  }

  function onPointerDown(e) {
    if (e.button != null && e.button !== 0) return;
    if (isInteractiveTarget(e.target)) return;
    if (!slides.length) return;

    pointerId = e.pointerId;
    dragArmed = true;
    dragActive = false;
    dragging = false;
    startX = e.clientX;
    deltaX = 0;
  }

  function onPointerMove(e) {
    if ((!dragArmed && !dragging) || e.pointerId !== pointerId) return;
    deltaX = e.clientX - startX;

    if (!dragActive) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      dragActive = true;
      dragging = true;
      try {
        carousel.setPointerCapture(pointerId);
      } catch (_) {}
      track.style.transition = "none";
    }

    if (!dragging) return;
    const width = slideWidth();
    track.style.transform = "translateX(" + (-index * width + deltaX) + "px)";
  }

  function onPointerUp(e) {
    if (e.pointerId !== pointerId) return;
    const wasDragging = dragging;
    const moved = Math.abs(deltaX);
    dragArmed = false;
    dragging = false;
    dragActive = false;
    try {
      carousel.releasePointerCapture(pointerId);
    } catch (_) {}
    pointerId = null;
    track.style.transition = "";

    if (!slides.length) {
      deltaX = 0;
      return;
    }

    // Tiny movement: treat as tap, not swipe
    if (!wasDragging || moved < DRAG_THRESHOLD) {
      goTo(index);
      deltaX = 0;
      return;
    }

    const threshold = Math.min(80, (carousel.clientWidth || 320) * 0.18);
    if (deltaX < -threshold) goTo(index + 1);
    else if (deltaX > threshold) goTo(index - 1);
    else goTo(index);
    deltaX = 0;
  }

  function copyCaption() {
    const text = PROFILES[currentSlug].caption;
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

  function setProfile(slug) {
    const profile = PROFILES[slug] || PROFILES.andre;
    currentSlug = profile.slug;
    slides = profile.slides;
    index = 0;

    if (profileName) profileName.textContent = profile.name;
    if (profileSubtitle) profileSubtitle.textContent = profile.subtitle;
    document.title = `Cinegrafo · Perfil destacado · ${profile.name}`;
    carousel.setAttribute("aria-label", `Slides del carrusel de ${profile.name}`);

    if (profileLink) {
      if (profile.profileUrl && profile.profileUrl !== "#") {
        profileLink.href = profile.profileUrl;
        profileLink.textContent = `cinegrafo.com/profile/${profile.profilePath}`;
        profileLink.hidden = false;
      } else {
        profileLink.hidden = true;
      }
    }

    if (profileSwitcher) {
      [...profileSwitcher.querySelectorAll("[data-profile]")].forEach((btn) => {
        const active = btn.dataset.profile === currentSlug;
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.classList.toggle("is-active", active);
      });
    }

    captionText.textContent = profile.caption;
    renderSlides();
    goTo(0, { animate: false });
  }

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(index - 1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    goTo(index + 1);
  });
  dotsEl.addEventListener("click", (e) => {
    e.stopPropagation();
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    goTo(Number(btn.dataset.index));
  });

  // Attach drag to track so nav/dots outside track are cleaner;
  // still guard interactive targets if events bubble from overlays.
  track.addEventListener("pointerdown", onPointerDown);
  track.addEventListener("pointermove", onPointerMove);
  track.addEventListener("pointerup", onPointerUp);
  track.addEventListener("pointercancel", onPointerUp);
  // Also listen on carousel for moves/ups after capture moves off track
  carousel.addEventListener("pointermove", onPointerMove);
  carousel.addEventListener("pointerup", onPointerUp);
  carousel.addEventListener("pointercancel", onPointerUp);

  carousel.addEventListener("keydown", (e) => {
    if (!slides.length) return;
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
      goTo(slides.length - 1);
    }
  });

  // Focus carousel on click, but never steal button/link clicks
  carousel.addEventListener("click", (e) => {
    if (isInteractiveTarget(e.target)) return;
    carousel.focus({ preventScroll: true });
  });

  copyBtn.addEventListener("click", copyCaption);

  if (profileSwitcher) {
    profileSwitcher.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-profile]");
      if (!btn) return;
      setProfile(btn.dataset.profile);
    });
  }

  window.addEventListener("resize", () => {
    goTo(index, { animate: false });
  });

  setProfile("andre");
})();
