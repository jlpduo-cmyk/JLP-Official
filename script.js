document.addEventListener("DOMContentLoaded", initAll);

function initAll() {
  initMenu();
  initCookies();
  setupEmbedClicks();
  initLyricsAccordion();
  highlightActiveNav();
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".navbar a").forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}


/* =========================
   COOKIE CONSENT
========================= */

function initCookies() {
  const saved = localStorage.getItem("cookieConsent");

  if (!saved) {
    showBanner();
    return;
  }

  hideBanner();

  const consent = JSON.parse(saved);

  if (consent.marketing) {
    loadEmbeds();
    loadMetaPixel();
  }
}

function showBanner() {
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.classList.add("show");
}

function hideBanner() {
  const banner = document.getElementById("cookie-banner");
  if (banner) banner.classList.remove("show");
}

function acceptNecessary() {
  const saved = localStorage.getItem("cookieConsent");
  const previousConsent = saved ? JSON.parse(saved) : null;

  const consent = {
    analytics: false,
    marketing: false
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));
  hideBanner();
  closeModal();

  // If marketing was previously allowed, reload the page
  // so Meta Pixel and external embeds are no longer loaded.
  if (previousConsent?.marketing) {
    location.reload();
  }
}

function acceptAllCookies() {
  const consent = {
    analytics: true,
    marketing: true
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));
  hideBanner();

  loadEmbeds();
  loadMetaPixel();
}

function savePreferences() {
  const analytics = document.getElementById("analytics")?.checked || false;
  const marketing = document.getElementById("marketing")?.checked || false;

  const saved = localStorage.getItem("cookieConsent");
  const previousConsent = saved ? JSON.parse(saved) : null;

  const consent = {
    analytics: analytics,
    marketing: marketing
  };

  localStorage.setItem("cookieConsent", JSON.stringify(consent));

  hideBanner();
  closeModal();

  // Marketing was previously allowed but has now been withdrawn.
  // Reload the page so Meta Pixel and external embeds are no longer loaded.
  if (previousConsent?.marketing && !marketing) {
    location.reload();
    return;
  }

  if (marketing) {
    loadEmbeds();
    loadMetaPixel();
  }
}

function openCookieSettings() {
  const modal = document.getElementById("cookie-modal");
  if (!modal) return;

  const saved = localStorage.getItem("cookieConsent");

  if (saved) {
    const consent = JSON.parse(saved);

    const analytics = document.getElementById("analytics");
    const marketing = document.getElementById("marketing");

    if (analytics) analytics.checked = consent.analytics;
    if (marketing) marketing.checked = consent.marketing;
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("cookie-modal");
  if (modal) modal.classList.add("hidden");
}


/* =========================
   META PIXEL
========================= */

function loadMetaPixel() {

  // Verhindert, dass der Pixel mehrfach geladen wird
  if (window.fbq) return;

  !(function(f, b, e, v, n, t, s) {

    if (f.fbq) return;

    n = f.fbq = function() {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };

    if (!f._fbq) f._fbq = n;

    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    t = b.createElement(e);
    t.async = true;
    t.src = v;

    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);

  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );

  fbq("init", "7706630119393023");
  fbq("track", "PageView");
}


/* =========================
   YOUTUBE / SPOTIFY EMBEDS
========================= */

function loadEmbeds() {
  document.querySelectorAll(".embed-placeholder").forEach(el => {
    loadSingleEmbed(el);
  });
}

function loadSingleEmbed(el) {
  const src = el.getAttribute("data-src");

  if (!src) return;

  const iframe = document.createElement("iframe");

  iframe.src = src;
  iframe.style.width = "100%";
  iframe.style.height = "380px";
  iframe.style.border = "none";

  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  el.replaceWith(iframe);
}

function setupEmbedClicks() {
  document.querySelectorAll(".embed-placeholder").forEach(el => {

    el.addEventListener("click", () => {

      const saved = localStorage.getItem("cookieConsent");
      const consent = saved ? JSON.parse(saved) : null;

      if (!consent || !consent.marketing) {
        openCookieSettings();
        return;
      }

      loadSingleEmbed(el);
    });

  });
}


/* =========================
   COOKIE FUNCTIONS GLOBAL
========================= */

window.acceptNecessary = acceptNecessary;
window.acceptAllCookies = acceptAllCookies;
window.openCookieSettings = openCookieSettings;
window.closeModal = closeModal;
window.savePreferences = savePreferences;


/* =========================
   LYRICS ACCORDION
========================= */

function initLyricsAccordion() {
  const songs = document.querySelectorAll(".song");

  songs.forEach(song => {

    const button = song.querySelector(".song-title");
    const lyrics = song.querySelector(".song-lyrics");

    if (!button || !lyrics) return;

    button.addEventListener("click", () => {

      songs.forEach(s => {

        if (s !== song) {

          s.classList.remove("active");

          const l = s.querySelector(".song-lyrics");

          if (l) {
            l.style.maxHeight = null;
          }
        }

      });

      song.classList.toggle("active");

      if (song.classList.contains("active")) {
        lyrics.style.maxHeight = lyrics.scrollHeight + "px";
      } else {
        lyrics.style.maxHeight = null;
      }

    });

  });
}


/* =========================
   MOBILE MENU
========================= */

function initMenu() {
  const menu = document.querySelector("#menu-icon");
  const navbar = document.querySelector(".navbar");
  const overlay = document.getElementById("overlay");

  if (!menu || !navbar || !overlay) return;

  const closeMenu = () => {
    menu.classList.remove("active");
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  };

  const toggleMenu = () => {
    menu.classList.toggle("active");
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  };

  menu.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}