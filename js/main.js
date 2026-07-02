/* ===================================================================
   Barcelona Debating Society — interactions + i18n
   =================================================================== */
(function () {
  "use strict";

  /* ---- current year in footer ---- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---- sticky nav shadow ---- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 8) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- collage: graceful placeholder when a photo file is missing ---- */
  document.querySelectorAll(".collage__item img").forEach(function (img) {
    var fail = function () {
      var fig = img.parentElement;
      fig.classList.add("is-empty");
      fig.setAttribute("data-label", img.getAttribute("data-ph") || "BDS");
      img.remove();
    };
    img.addEventListener("error", fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* ---- lightbox: click a photo to see it big; click outside / × to close ---- */
  (function () {
    var items = document.querySelectorAll(".collage__item");
    if (!items.length) return;

    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.innerHTML =
      '<button class="lightbox__close" aria-label="Tanca">×</button>' +
      '<div class="lightbox__content"></div>';
    document.body.appendChild(lb);
    var content = lb.querySelector(".lightbox__content");

    function open(html) {
      content.innerHTML = html;
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      content.innerHTML = "";
    }

    // close when clicking anywhere that isn't the image/content
    lb.addEventListener("click", function (e) {
      if (!e.target.closest(".lightbox__content")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("is-open")) close();
    });

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        if (img && img.naturalWidth > 0) {
          open('<img class="lightbox__img" src="' + img.getAttribute("src") +
               '" alt="' + (img.getAttribute("alt") || "") + '">');
        } else {
          var label = item.getAttribute("data-label") || (img && img.getAttribute("data-ph")) || "BDS";
          open('<div class="lightbox__ph">' + label + "</div>");
        }
      });
    });
  })();

  /* ===================================================================
     LANGUAGE (CA / ES / EN)
     =================================================================== */
  var SUPPORTED = ["ca", "es", "en"];
  var lang = localStorage.getItem("bds_lang");
  if (SUPPORTED.indexOf(lang) === -1) {
    var nav0 = (navigator.language || "ca").slice(0, 2).toLowerCase();
    lang = SUPPORTED.indexOf(nav0) > -1 ? nav0 : "ca";
  }
  window.__lang = lang;

  function applyLang(l) {
    if (SUPPORTED.indexOf(l) === -1) l = "ca";
    window.__lang = l;
    localStorage.setItem("bds_lang", l);
    document.documentElement.lang = l;
    var dict = window.I18N[l] || window.I18N.ca;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.querySelectorAll(".lang__btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-lang") === l);
    });
    renderBP();
    renderMocions();
  }

  document.querySelectorAll(".lang__btn").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  /* ===================================================================
     INTERACTIVE BP SCHEME
     =================================================================== */
  var bpDetail = document.getElementById("bpDetail");
  var bpButtons = Array.prototype.slice.call(document.querySelectorAll(".bp__pos"));
  var bpActive = 0;

  function renderBP() {
    if (!bpDetail) return;
    var roles = (window.I18N_BP[window.__lang] || window.I18N_BP.ca);
    var dict = window.I18N[window.__lang] || window.I18N.ca;
    var r = roles[bpActive];
    if (!r) return;
    var sideLabel = r.side === "gov" ? dict["bp.sideGov"] : dict["bp.sideOpo"];
    var lis = r.points.map(function (p) { return "<li>" + p + "</li>"; }).join("");
    bpDetail.className = "bp__detail bp__detail-fade" + (r.side === "opo" ? " is-opo" : "");
    bpDetail.innerHTML =
      '<div class="bp__detail-head"><span class="bp__detail-n">' + r.n + "</span>" +
      "<h3>" + r.title + "</h3></div>" +
      '<span class="bp__detail-side">' + sideLabel + "</span>" +
      "<ul>" + lis + "</ul>";
    void bpDetail.offsetWidth;
    bpButtons.forEach(function (b) {
      b.classList.toggle("is-active", +b.getAttribute("data-role") === bpActive);
    });
  }
  bpButtons.forEach(function (b) {
    b.addEventListener("click", function () { bpActive = +b.getAttribute("data-role"); renderBP(); });
  });

  /* ===================================================================
     MOCIONS carousel (built once, text refreshed on language change)
     =================================================================== */
  var mocTrack = document.getElementById("mocTrack");
  var mocSlides = [];

  function buildMocions() {
    if (!mocTrack) return;
    var data = window.I18N_MOC.ca; // count is the same in every language
    data.forEach(function () {
      var fig = document.createElement("figure");
      fig.className = "slide motion";
      fig.innerHTML = '<span class="motion__tag"></span><blockquote class="motion__text"></blockquote>';
      mocTrack.appendChild(fig);
      mocSlides.push(fig);
    });
  }

  function renderMocions() {
    if (!mocTrack) return;
    var data = window.I18N_MOC[window.__lang] || window.I18N_MOC.ca;
    mocSlides.forEach(function (fig, i) {
      var m = data[i];
      if (!m) return;
      fig.className = "slide motion motion--" + (m.tag === "AC" ? "ac" : "accq");
      fig.querySelector(".motion__tag").textContent = m.tag;
      fig.querySelector(".motion__text").textContent = m.text;
    });
  }

  /* generic carousel controller */
  function initCarousel(opts) {
    var track = document.getElementById(opts.track);
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    if (!slides.length) return;
    var dotsWrap = document.getElementById(opts.dots);
    var prev = document.getElementById(opts.prev);
    var next = document.getElementById(opts.next);
    var root = document.getElementById(opts.root);
    var idx = 0, timer = null, resumeTimer = null, manualPaused = false;
    var DELAY = opts.delay || 5000;
    var RESUME = opts.resumeDelay || 0; // ms without interaction before auto-play resumes

    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.className = "carousel__dot" + (i === 0 ? " is-active" : "");
      d.setAttribute("aria-label", "" + (i + 1));
      d.addEventListener("click", function () { go(i, true); });
      dotsWrap.appendChild(d);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function show() {
      track.style.transform = "translateX(" + (-idx * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }
    function start() { if (timer || manualPaused) return; timer = setInterval(function () { go(idx + 1); }, DELAY); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function onManual() {
      if (RESUME) {
        // interacting with the arrows/dots pauses auto-play; resume only after RESUME ms idle
        manualPaused = true;
        stop();
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { manualPaused = false; start(); }, RESUME);
      } else {
        stop(); start();
      }
    }
    function go(i, manual) { idx = (i + slides.length) % slides.length; show(); if (manual) onManual(); }

    next.addEventListener("click", function () { go(idx + 1, true); });
    prev.addEventListener("click", function () { go(idx - 1, true); });
    if (root) { root.addEventListener("mouseenter", stop); root.addEventListener("mouseleave", start); }

    show(); start();
  }

  /* ===================================================================
     SCROLL REVEAL
     =================================================================== */
  function setupReveal() {
    var targets = [
      ".section__head", ".about__text", ".feat", ".bp__scheme", ".bp__detail",
      ".carousel", ".collage__item", ".project", ".flagship", ".social__item",
      ".curs__info", ".curs__form"
    ];
    var els = document.querySelectorAll(targets.join(","));
    els.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 6) * 60 + "ms";
    });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add("is-in"); });
    }
  }

  /* ---- boot ---- */
  buildMocions();
  initCarousel({ root: "mocCarousel", track: "mocTrack", prev: "mocPrev", next: "mocNext", dots: "mocDots", delay: 6000, resumeDelay: 30000 });
  applyLang(window.__lang); // fills static text + renders BP + mocions
  setupReveal();
})();
