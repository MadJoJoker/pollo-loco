// div-visibility-manager.js
// Zentrale Steuerung für Sichtbarkeit der Seiten-Divs in index.html

const PAGE_DIV_IDS = [
  "div-datenschutz",
  "div-game-over",
  "div-highscore",
  "div-start-screen",
  "div-settings",
  "div-overlay-highscore",
  // "div-main-menu", // now handled as overlay, not a page
  "div-impressum",
  "div-how-to-play",
  "div-win",
];

/**
 * Zeigt nur das gewünschte Div an, lädt bei Bedarf den Inhalt aus der zugehörigen HTML-Datei.
 * @param {string} pageName z.B. "start-screen" (ohne .html)
 */
async function showPageDiv(pageName) {
  const pageDivsSection = document.getElementById("page-divs");
  if (pageDivsSection) pageDivsSection.style.display = "block";
  // Alle Divs verstecken
  PAGE_DIV_IDS.forEach((id) => {
    const div = document.getElementById(id);
    if (div) div.style.display = "none";
  });
  // Canvas selbst verstecken
  const canvas = document.getElementById("canvas");
  if (canvas) canvas.style.display = "none";
  // Auch die Button-Bars verstecken
  const canvasFullscreenBtn = document.getElementById("canvasFullscreenBtn");
  if (canvasFullscreenBtn) canvasFullscreenBtn.style.display = "none";
  const mobileButtonsBar = document.getElementById("mobileButtonsBar");
  if (mobileButtonsBar) mobileButtonsBar.style.display = "none";
  // Ziel-Div bestimmen
  const divId = `div-${pageName}`;
  const div = document.getElementById(divId);
  if (!div) return;
  // Falls leer, Inhalt laden
  if (!div.hasAttribute("data-loaded")) {
    const url = `pages/${pageName.replace(/_/g, "-")}.html`;
    const resp = await fetch(url);
    const html = await resp.text();
    // Body extrahieren
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : html;
    div.innerHTML = bodyHtml;
    // CSS/JS einbinden
    const cssLinks = [
      ...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi),
    ].map((m) => m[1]);
    cssLinks.forEach((href) => {
      if (!document.querySelector(`link[href='${href}']`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });
    const jsLinks = [
      ...html.matchAll(
        /<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi,
      ),
    ].map((m) => m[1]);
    jsLinks.forEach((src) => {
      if (!document.querySelector(`script[src='${src}']`)) {
        const script = document.createElement("script");
        script.src = src;
        document.body.appendChild(script);
      }
    });
    div.setAttribute("data-loaded", "1");
  }
  // Div anzeigen
  div.style.display = "block";
}

// Overlay Main Menu logic
function showMainMenuOverlay() {
  const overlay = document.getElementById("main-menu-overlay");
  if (!overlay) return;
  overlay.classList.remove("overlay-hidden");
  overlay.classList.add("overlay-visible");
  window.gamePaused = 1;
  const div = document.getElementById("div-main-menu");

  // Remove old event listeners if present
  if (overlay._mainMenuListeners) {
    const { outerClick, stopPropDrawer, closeBtnHandler, btnHandlers } =
      overlay._mainMenuListeners;
    overlay.removeEventListener("mousedown", outerClick);
    const drawer = overlay.querySelector(".menu-drawer");
    if (drawer && stopPropDrawer)
      drawer.removeEventListener("mousedown", stopPropDrawer);
    const closeBtn = overlay.querySelector(".close-menu, #close-menu");
    if (closeBtn && closeBtnHandler)
      closeBtn.removeEventListener("click", closeBtnHandler);
    if (btnHandlers) {
      Object.entries(btnHandlers).forEach(([id, handler]) => {
        const btn = overlay.querySelector(`#${id}`);
        if (btn) btn.removeEventListener("click", handler);
      });
    }
  }

  function addOverlayEventListeners() {
    // Named handlers for removal
    const outerClick = function (e) {
      if (e.target === overlay) {
        window.hideMainMenuOverlay();
      }
    };
    overlay.addEventListener("mousedown", outerClick);

    const drawer = overlay.querySelector(".menu-drawer");
    const stopPropDrawer = function (e) {
      e.stopPropagation();
    };
    if (drawer) drawer.addEventListener("mousedown", stopPropDrawer);

    const closeBtn = overlay.querySelector(".close-menu, #close-menu");
    const closeBtnHandler = function (e) {
      e.stopPropagation();
      window.hideMainMenuOverlay();
    };
    if (closeBtn) closeBtn.addEventListener("click", closeBtnHandler);

    // Carousel button handlers
    const btnMap = {
      "home-btn": () => {
        console.log("Home btn geklickt");
        window.showPageDiv("start-screen");
      },
      "start-game-btn": () => {
        console.log("Start btn geklickt");
        window.showPageDiv("start-screen");
      },
      "how-to-play-btn": () => {
        console.log("Howto btn geklickt");
        window.showPageDiv("how-to-play");
      },
      "settings-btn": () => {
        console.log("Settings btn geklickt");
        window.showPageDiv("settings");
      },
      "highscore-btn": () => {
        console.log("Highscore btn geklickt");
        window.showPageDiv("highscore");
      },
    };
    const btnHandlers = {};
    Object.entries(btnMap).forEach(([id, fn]) => {
      btnHandlers[id] = function (e) {
        e.preventDefault();
        e.stopPropagation();
        fn();
        window.hideMainMenuOverlay();
      };
      const btn = overlay.querySelector(`#${id}`);
      if (btn) btn.addEventListener("click", btnHandlers[id]);
    });
    // Store for later removal
    overlay._mainMenuListeners = {
      outerClick,
      stopPropDrawer,
      closeBtnHandler,
      btnHandlers,
    };
  }

  // If content not loaded, load and then add listeners
  if (div && !div.hasAttribute("data-loaded")) {
    fetch("pages/main-menu.html")
      .then((resp) => resp.text())
      .then((html) => {
        // Nur den Drawer extrahieren, nicht das ganze Overlay
        let drawerHtml = html;
        const temp = document.createElement("div");
        temp.innerHTML = html;
        const drawer = temp.querySelector(".menu-drawer");
        if (drawer) {
          drawerHtml = drawer.outerHTML;
        }
        div.innerHTML = drawerHtml;
        div.setAttribute("data-loaded", "1");
        addOverlayEventListeners();
      });
  } else {
    addOverlayEventListeners();
  }
}
function hideMainMenuOverlay() {
  const overlay = document.getElementById("main-menu-overlay");
  if (overlay) {
    overlay.classList.remove("overlay-visible");
    overlay.classList.add("overlay-hidden");
    window.gamePaused = 0;
  }
}

window.showPageDiv = showPageDiv;
window.showMainMenuOverlay = showMainMenuOverlay;
window.hideMainMenuOverlay = hideMainMenuOverlay;
