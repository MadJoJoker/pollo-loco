/**
 * Loads the requested page and injects its content into the target div.
 * @param {string} pageName - The HTML page to load
 * @returns {Promise<string>} The id of the target div
 */
window.openPage = async function (pageName) {
  const targetDivId = getDivIdForPage(pageName);
  let container = getOrCreateDiv(targetDivId);
  clearDiv(container);
  removeDynamicAssets();
  const html = await fetchHtml(pageName);
  injectHtml(container, html);
  loadDynamicCss(html);
  loadDynamicJs(html);
  setTimeout(() => {
    restoreOverlayFunctions();
    window.showOnlyDiv(targetDivId);
    hideAllOverlaysAndExtrascreens();
    if (window.updatePageAudios) window.updatePageAudios(targetDivId);
    if (["impressum.html", "datenschutz.html"].includes(pageName)) {
      if (typeof window.pauseGameTime === "function") window.pauseGameTime();
      window.gamePaused = true;
    }
  }, 300);
  /**
   * Blendet alle Overlays und Extrascreens im DOM aus.
   */
  function hideAllOverlaysAndExtrascreens() {
    const extras = document.getElementById("extrascreens");
    if (extras) extras.classList.add("hidden");
    const overlay = document.getElementById("menu-overlay");
    if (overlay) {
      overlay.classList.remove("overlay-visible");
      overlay.classList.add("overlay-hidden");
      overlay.setAttribute("aria-hidden", "true");
    }
    const rotateScreen = document.getElementById("rotateScreen");
    if (rotateScreen) rotateScreen.classList.add("hidden");
    const startscreen = document.getElementById("startscreen");
    if (startscreen) startscreen.classList.add("hidden");
    const highscore = document.getElementById("highscore");
    if (highscore) highscore.classList.add("hidden");
  }
  return targetDivId;
};

/**
 * Restores the original overlay functions if they exist.
 */
function restoreOverlayFunctions() {
  if (window.showMainMenuOverlayOrig) {
    window.showMainMenuOverlay = window.showMainMenuOverlayOrig;
    window.hideMainMenuOverlay = window.hideMainMenuOverlayOrig;
  }
}

/**
 * Returns the div id for a given page name.
 * @param {string} pageName - The HTML page name
 * @returns {string} The corresponding div id
 */
function getDivIdForPage(pageName) {
  const divMap = {
    "start-screen.html": "div-start-screen",
    "game-over.html": "div-game-over",
    "win.html": "div-win",
    "impressum.html": "div-impressum",
    "datenschutz.html": "div-datenschutz",
    "settings.html": "div-settings",
    "highscore.html": "div-highscore",
    "how-to-play.html": "div-how-to-play",
    "overlay-highscore.html": "div-overlay-highscore",
  };
  return divMap[pageName] || "div-start-screen";
}

/**
 * Returns the div element for a given div id, creates it if not present.
 * @param {string} divId - The div id
 * @returns {HTMLElement} The div element
 */
function getOrCreateDiv(divId) {
  let div = document.getElementById(divId);
  if (!div) {
    div = document.createElement("div");
    div.id = divId;
    document.body.appendChild(div);
  }
  return div;
}

/**
 * Clears the inner HTML of the div.
 * @param {HTMLElement} div - The div to clear
 */
function clearDiv(div) {
  div.innerHTML = "";
}

/**
 * Removes all dynamically loaded CSS and JS assets.
 */
function removeDynamicAssets() {
  document.querySelectorAll(".dynamic-css").forEach((e) => e.remove());
  document.querySelectorAll(".dynamic-js").forEach((e) => e.remove());
}

/**
 * Fetches the HTML content for a page.
 * @param {string} pageName - The HTML page to fetch
 * @returns {Promise<string>} The HTML content
 */
async function fetchHtml(pageName) {
  const resp = await fetch(`pages/${pageName}`);
  return await resp.text();
}

/**
 * Injects the body content from HTML into the target div.
 * @param {HTMLElement} container - The target div
 * @param {string} html - The HTML content
 */
function injectHtml(container, html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  container.innerHTML = bodyHtml;
}

/**
 * Loads all CSS files found in the HTML.
 * @param {string} html - The HTML content
 */
/**
 * Loads all CSS files from HTML in the exact order as in the HTML.
 * Removes previously loaded dynamic CSS files.
 * @param {string} html - The HTML content
 */
/**
 * Loads all CSS files from HTML in the exact order as in the HTML.
 * Removes all existing <link rel="stylesheet"> except font-face/reset.
 * @param {string} html - The HTML content
 */
function loadDynamicCss(html) {
  // Entferne alle dynamisch geladenen CSS-Dateien
  document
    .querySelectorAll("link.dynamic-css")
    .forEach((link) => link.remove());
  // Entferne alle <link rel="stylesheet"> außer font/reset, style.css, root.css, layout.css
  document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (
      !/font|reset|style\.css|root\.css|layout\.css/i.test(href) &&
      !link.classList.contains("dynamic-css")
    )
      link.remove();
  });
  // Füge alle CSS-Links in der richtigen Reihenfolge hinzu
  const matches = [
    ...html.matchAll(
      /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css)["'][^>]*>/gi,
    ),
  ];
  matches.forEach((m) => {
    const href = m[1];
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.classList.add("dynamic-css");
    link.href = href + "?t=" + Date.now();
    document.head.appendChild(link);
  });
}

/**
 * Loads all JS files found in the HTML.
 * @param {string} html - The HTML content
 */
function loadDynamicJs(html) {
  const jsLinks = [
    ...html.matchAll(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi),
  ].map((m) => m[1]);
  jsLinks.forEach((src) => {
    const script = document.createElement("script");
    script.src = src + "?t=" + Date.now();
    script.classList.add("dynamic-js");
    document.body.appendChild(script);
  });
}

/**
 * Hides all page divs, canvas, button bars, and fullscreen h1; shows only the requested div, stops game loop.
 * @param {string} divId - The div id to show
 */
window.showOnlyDiv = function (divId) {
  document.querySelectorAll('div[id^="div-"]').forEach((div) => {
    div.style.display = "none";
  });
  hideCanvasAndBars();
  const target = document.getElementById(divId);
  if (target) target.style.display = "block";
  if (typeof window.stopGameLoop === "function") window.stopGameLoop();
};

/**
 * Hides the canvas, button bars, and fullscreen h1 if present.
 */
function hideCanvasAndBars() {
  const canvas = document.getElementById("canvas");
  if (canvas) canvas.style.display = "none";
  const canvasBtnBar = document.getElementById("canvasFullscreenBtn");
  if (canvasBtnBar) canvasBtnBar.style.display = "none";
  const mobileBtnBar = document.getElementById("mobileButtonsBar");
  if (mobileBtnBar) mobileBtnBar.style.display = "none";
  const fullscreenH1 = document.querySelector("#fullscreen h1");
  if (fullscreenH1) fullscreenH1.style.display = "none";
  // Extrascreens und rotateScreen immer ausblenden
  const extras = document.getElementById("extrascreens");
  if (extras) {
    extras.classList.add("hidden");
    extras.style.setProperty("display", "none", "important");
  }
  const rotateScreen = document.getElementById("rotateScreen");
  if (rotateScreen) {
    rotateScreen.classList.add("hidden");
    rotateScreen.style.setProperty("display", "none", "important");
  }
  // Spielstatus-Flag deaktivieren
  window.isGameActive = false;
  // Alle Game-Intervalle stoppen
  if (window.stopAllIntervals) window.stopAllIntervals();
}

/**
 * Maps short name to HTML file and calls openPage.
 * @param {string} pageKey - The page key (short name)
 * @returns {Promise<void>} Resolves when the page is loaded
 */
window.showPageDiv = function (pageKey) {
  const pageMap = {
    "start-screen": "start-screen.html",
    "game-over": "game-over.html",
    win: "win.html",
    impressum: "impressum.html",
    datenschutz: "datenschutz.html",
    settings: "settings.html",
    highscore: "highscore.html",
    "how-to-play": "how-to-play.html",
    "overlay-highscore": "overlay-highscore.html",
  };
  const pageName = pageMap[pageKey] || "start-screen.html";
  return window.openPage(pageName).then(() => restoreOverlayFunctions());
};

// Save original overlay functions for re-initialization
if (!window.showMainMenuOverlayOrig && window.showMainMenuOverlay) {
  window.showMainMenuOverlayOrig = window.showMainMenuOverlay;
  window.hideMainMenuOverlayOrig = window.hideMainMenuOverlay;
}
