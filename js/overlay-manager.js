// Overlay-Komponente für SPA
// Fügt ein zentrales Overlay-Element zum DOM hinzu
// Kann per JS geöffnet/geschlossen und mit Inhalten befüllt werden

class OverlayManager {
  constructor() {
    this.overlay = document.createElement("div");
    this.overlay.id = "spa-overlay";
    this.overlay.style.position = "fixed";
    this.overlay.style.top = "0";
    this.overlay.style.left = "0";
    this.overlay.style.width = "100vw";
    this.overlay.style.height = "100vh";
    this.overlay.style.background = "var(--bg-desert)";
    this.overlay.style.backgroundImage = "var(--bg-desert)";
    this.overlay.style.backgroundRepeat = "no-repeat";
    this.overlay.style.backgroundSize = "cover";
    this.overlay.style.display = "none";
    this.overlay.style.zIndex = "9999";
    this.overlay.innerHTML = '<div id="spa-overlay-content"></div>';
    // body könnte noch nicht existieren, daher verzögert einfügen
    if (document.body) {
      document.body.appendChild(this.overlay);
    } else {
      window.addEventListener("DOMContentLoaded", () => {
        document.body.appendChild(this.overlay);
      });
    }
  }

  async open(url) {
    this.pauseGameLoop();
    this.overlay.style.display = "flex";
    this.overlay.style.justifyContent = "center";
    this.overlay.style.alignItems = "center";
    const content = await fetch(url).then((r) => r.text());

    // CSS & JS aus geladenem HTML extrahieren und einfügen
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    this._injectOverlayStylesAndScripts(doc);

    // Nur Body-Inhalt anzeigen
    const bodyHtml = doc.body ? doc.body.innerHTML : content;
    document.getElementById("spa-overlay-content").innerHTML = bodyHtml;

    // Header-, Carousel- und MainMenu-Initialisierung
    this._initOverlayHeaderAndMenu();
    if (typeof window.initMainMenu === "function") {
      window.initMainMenu();
    }
  }

  _injectOverlayStylesAndScripts(doc) {
    // CSS einfügen
    const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      if (
        !Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
          (l) => l.getAttribute("href") === href
        )
      ) {
        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = href;
        document.head.appendChild(newLink);
      }
    });
    // Inline-Styles einfügen
    const styles = Array.from(doc.querySelectorAll("style"));
    styles.forEach((style) => {
      const newStyle = document.createElement("style");
      newStyle.textContent = style.textContent;
      document.head.appendChild(newStyle);
    });
    // JS einfügen (nur externe Skripte)
    const scripts = Array.from(doc.querySelectorAll("script[src]"));
    scripts.forEach((script) => {
      const src = script.getAttribute("src");
      if (!src) return;
      if (
        !Array.from(document.querySelectorAll("script[src]")).some(
          (s) => s.getAttribute("src") === src
        )
      ) {
        const newScript = document.createElement("script");
        newScript.src = src;
        document.body.appendChild(newScript);
      }
    });
  }

  _initOverlayHeaderAndMenu() {
    const overlayContent = document.getElementById("spa-overlay-content");
    if (!overlayContent) return;
    // Impressum/Datenschutz-Links zu Buttons machen
    const header = overlayContent.querySelector("#start-header");
    if (header) {
      const impressum = header.querySelector('a[href*="impressum"]');
      if (impressum) {
        const btn = document.createElement("button");
        btn.textContent = impressum.textContent;
        btn.className = impressum.className;
        btn.onclick = () => window.SPA.navigate("pages/impressum.html");
        impressum.replaceWith(btn);
      }
      const datenschutz = header.querySelector('a[href*="datenschutz"]');
      if (datenschutz) {
        const btn = document.createElement("button");
        btn.textContent = datenschutz.textContent;
        btn.className = datenschutz.className;
        btn.onclick = () => window.SPA.navigate("pages/datenschutz.html");
        datenschutz.replaceWith(btn);
      }
    }
    // Revolver-Button für Menü-Overlay immer initialisieren
    const revolverBtn = overlayContent.querySelector("#revolver-btn");
    if (revolverBtn) {
      const newBtn = revolverBtn.cloneNode(true);
      revolverBtn.parentNode.replaceChild(newBtn, revolverBtn);
      newBtn.onclick = (e) => {
        e.preventDefault();
        if (typeof window.showMainMenuOverlay === "function") {
          window.showMainMenuOverlay();
        } else {
          // Fallback: Menü-Overlay anzeigen, falls Funktion nicht vorhanden
          const menuOverlay = document.getElementById("menu-overlay");
          if (menuOverlay) menuOverlay.classList.add("overlay-visible");
        }
      };
    }
    // Carousel initialisieren, falls vorhanden
    const carousel = overlayContent.querySelector(".carousel");
    if (carousel) {
      // Falls keine Buttons/A-Elemente vorhanden sind, Beispiel-Buttons einfügen
      if (!carousel.querySelector("button, a")) {
        for (let i = 1; i <= 5; i++) {
          const btn = document.createElement("button");
          btn.textContent = `Item ${i}`;
          btn.onclick = () => alert(`Klick auf Item ${i}`);
          carousel.appendChild(btn);
        }
      }
      if (typeof window.initCarousel === "function") window.initCarousel();
    }
  }

  close() {
    this.overlay.style.display = "none";
    document.getElementById("spa-overlay-content").innerHTML = "";
    this.resumeGameLoop();
  }

  pauseGameLoop() {
    if (window.world && typeof window.world.pause === "function") {
      window.world.pause();
    }
  }

  resumeGameLoop() {
    if (window.world && typeof window.world.resume === "function") {
      window.world.resume();
    }
  }
}

// Initialisiere OverlayManager und SPA.navigate nach DOMContentLoaded, falls nötig
function setupOverlayManagerAndSPA() {
  window.overlayManager = new OverlayManager();
  if (!window.SPA) window.SPA = {};
  window.SPA.navigate = function (path) {
    // Overlay immer neu befüllen, keine Navigation/History
    if (
      window.overlayManager &&
      typeof window.overlayManager.open === "function"
    ) {
      return window.overlayManager.open(path);
    }
  };
}
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", setupOverlayManagerAndSPA);
} else {
  setupOverlayManagerAndSPA();
}
