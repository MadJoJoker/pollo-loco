const PAGE_DIV_IDS = [
  "div-datenschutz",
  "div-game-over",
  "div-highscore",
  "div-start-screen",
  "div-settings",
  "div-overlay-highscore",
  "div-impressum",
  "div-how-to-play",
  "div-win",
];

/**
 * Hides all page divs listed in PAGE_DIV_IDS.
 */
function hideAllPageDivs() {
  PAGE_DIV_IDS.forEach((id) => {
    const div = document.getElementById(id);
    if (div) div.style.display = "none";
  });
}

/**
 * Hides the canvas and both button bars.
 */
function hideCanvasAndBars() {
  const canvas = document.getElementById("canvas");
  if (canvas) canvas.style.display = "none";
  const canvasFullscreenBtn = document.getElementById("canvasFullscreenBtn");
  if (canvasFullscreenBtn) canvasFullscreenBtn.style.display = "none";
  const mobileButtonsBar = document.getElementById("mobileButtonsBar");
  if (mobileButtonsBar) mobileButtonsBar.style.display = "none";
}

/**
 * Returns the div id for a given page name.
 * @param {string} pageName - The name of the page
 * @returns {string} The div id
 */
function getDivId(pageName) {
  return `div-${pageName}`;
}

/**
 * Returns the div element for a given div id.
 * @param {string} divId - The id of the div
 * @returns {HTMLElement|null} The div element or null
 */
function getPageDiv(divId) {
  return document.getElementById(divId);
}

/**
 * Sets the given div visible (display block).
 * @param {HTMLElement} div - The div to show
 */
function setPageDivVisible(div) {
  div.style.display = "block";
}

/**
 * Sets the page-divs section visible if it exists.
 */
function setPageDivsSectionVisible() {
  const pageDivsSection = document.getElementById("page-divs");
  if (pageDivsSection) pageDivsSection.style.display = "block";
}

/**
 * Extracts the body content from HTML string.
 * @param {string} html - The HTML string
 * @returns {string} The body content or the full HTML
 */
function getHtmlBody(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

/**
 * Extracts all CSS link hrefs from HTML string.
 * @param {string} html - The HTML string
 * @returns {string[]} Array of CSS hrefs
 */
function extractCssLinks(html) {
  return [...html.matchAll(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/gi)].map(
    (m) => m[1],
  );
}

/**
 * Extracts all JS script srcs from HTML string.
 * @param {string} html - The HTML string
 * @returns {string[]} Array of JS srcs
 */
function extractJsLinks(html) {
  return [
    ...html.matchAll(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/gi),
  ].map((m) => m[1]);
}

/**
 * Adds CSS link elements to the document head if not already present.
 * @param {string[]} cssLinks - Array of CSS hrefs
 */
function addCssLinks(cssLinks) {
  cssLinks.forEach((href) => {
    if (!document.querySelector(`link[href='${href}']`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  });
}

/**
 * Adds JS script elements to the document body if not already present.
 * @param {string[]} jsLinks - Array of JS srcs
 */
function addJsLinks(jsLinks) {
  jsLinks.forEach((src) => {
    if (!document.querySelector(`script[src='${src}']`)) {
      const script = document.createElement("script");
      script.src = src;
      document.body.appendChild(script);
    }
  });
}

/**
 * Loads HTML content for a page and injects it into the div.
 * @param {string} pageName - The name of the page
 * @param {HTMLElement} div - The div to inject content into
 */
async function loadPageDivContent(pageName, div) {
  const url = `pages/${pageName.replace(/_/g, "-")}.html`;
  const resp = await fetch(url);
  const html = await resp.text();
  div.innerHTML = getHtmlBody(html);
  addCssLinks(extractCssLinks(html));
  addJsLinks(extractJsLinks(html));
  div.setAttribute("data-loaded", "1");
}

/**
 * Shows the page div for the given page name, loading content if needed.
 * @param {string} pageName - The name of the page
 */
async function showPageDiv(pageName) {
  setPageDivsSectionVisible();
  hideAllPageDivs();
  hideCanvasAndBars();
  const divId = getDivId(pageName);
  const div = getPageDiv(divId);
  if (!div) return;
  if (!div.hasAttribute("data-loaded")) {
    await loadPageDivContent(pageName, div);
  }
  setPageDivVisible(div);
  if (window.updatePageAudios) window.updatePageAudios(divId);
}

/**
 * Removes overlay event listeners from the main menu overlay.
 * @param {HTMLElement} overlay - The overlay element
 */
function removeOverlayListeners(overlay) {
  const l = overlay._mainMenuListeners;
  if (!l) return;
  overlay.removeEventListener("mousedown", l.outerClick);
  const drawer = overlay.querySelector(".menu-drawer");
  if (drawer && l.stopPropDrawer)
    drawer.removeEventListener("mousedown", l.stopPropDrawer);
  const closeBtn = overlay.querySelector(".close-menu, #close-menu");
  if (closeBtn && l.closeBtnHandler)
    closeBtn.removeEventListener("click", l.closeBtnHandler);
  if (l.btnHandlers) {
    Object.entries(l.btnHandlers).forEach(([id, handler]) => {
      const btn = overlay.querySelector(`#${id}`);
      if (btn) btn.removeEventListener("click", handler);
    });
  }
}

/**
 * Creates and attaches button click handlers for the overlay menu.
 * @param {HTMLElement} drawer - The menu drawer element
 * @param {Object} btnMap - Map of button ids to handler functions
 * @returns {Object} Map of button ids to handler functions
 */
function createBtnHandlers(drawer, btnMap) {
  const btnHandlers = {};
  Object.entries(btnMap).forEach(([id, fn]) => {
    btnHandlers[id] = function (e) {
      e.preventDefault();
      e.stopPropagation();
      fn();
      window.hideMainMenuOverlay();
    };
    const btn = drawer.querySelector(`#${id}`);
    if (btn) btn.addEventListener("click", btnHandlers[id]);
  });
  return btnHandlers;
}

/**
 * Adds all event listeners to the overlay menu.
 * @param {HTMLElement} overlay - The overlay element
 */
function addOverlayEventListeners(overlay) {
  const drawer = overlay.querySelector(".menu-drawer");
  if (!drawer) return;
  const outerClick = function (e) {
    if (e.target === overlay) window.hideMainMenuOverlay();
  };
  overlay.addEventListener("mousedown", outerClick);
  const stopPropDrawer = function (e) {
    e.stopPropagation();
  };
  drawer.addEventListener("mousedown", stopPropDrawer);
  const closeBtn = drawer.querySelector(".close-menu, #close-menu");
  const closeBtnHandler = function (e) {
    e.stopPropagation();
    window.hideMainMenuOverlay();
  };
  if (closeBtn) closeBtn.addEventListener("click", closeBtnHandler);
  const btnMap = {
    "home-btn": () => {
      window.showPageDiv("start-screen");
    },
    "start-game-btn": () => {
      window.showPageDiv("start-screen");
    },
    "how-to-play-btn": () => {
      window.showPageDiv("how-to-play");
    },
    "settings-btn": () => {
      window.showPageDiv("settings");
    },
    "highscore-btn": () => {
      window.showPageDiv("highscore");
    },
  };
  const btnHandlers = createBtnHandlers(drawer, btnMap);
  overlay._mainMenuListeners = {
    outerClick,
    stopPropDrawer,
    closeBtnHandler,
    btnHandlers,
  };
}

/**
 * Sets the overlay visible (removes hidden class, adds visible class).
 * @param {HTMLElement} overlay - The overlay element
 */
function setOverlayVisible(overlay) {
  overlay.classList.remove("overlay-hidden");
  overlay.classList.add("overlay-visible");
}

/**
 * Sets the overlay hidden (removes visible class, adds hidden class).
 * @param {HTMLElement} overlay - The overlay element
 */
function setOverlayHidden(overlay) {
  overlay.classList.remove("overlay-visible");
  overlay.classList.add("overlay-hidden");
}

/**
 * Sets the main menu div visible (display block).
 */
function setMainMenuDivVisible() {
  const div = document.getElementById("div-main-menu");
  if (div) div.style.display = "block";
}

/**
 * Sets the global gamePaused flag.
 * @param {boolean} paused - Whether the game is paused
 */
function setGamePaused(paused) {
  window.gamePaused = paused ? 1 : 0;
}

/**
 * Sets the main menu HTML content in the given div.
 * @param {HTMLElement} div - The div to inject HTML into
 * @param {string} html - The HTML string
 */
function setMainMenuHtml(div, html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const overlayBlock = temp.querySelector(".menu-overlay");
  if (overlayBlock) div.innerHTML = overlayBlock.outerHTML;
  else div.innerHTML = html;
}

/**
 * Fetches the main menu HTML as a string.
 * @returns {Promise<string>} The HTML string
 */
function fetchMainMenuHtml() {
  return fetch("pages/main-menu.html").then((resp) => resp.text());
}

/**
 * Shows the main menu overlay, loads content and attaches listeners.
 */
function showMainMenuOverlay() {
  const overlay = document.getElementById("main-menu-overlay");
  if (!overlay) return;
  setOverlayVisible(overlay);
  setGamePaused(true);
  setMainMenuDivVisible();
  removeOverlayListeners(overlay);
  const div = document.getElementById("div-main-menu");
  if (div) {
    fetchMainMenuHtml().then((html) => {
      setMainMenuHtml(div, html);
      addOverlayEventListeners(overlay);
    });
  }
}

/**
 * Hides the main menu overlay and unpauses the game.
 */
function hideMainMenuOverlay() {
  const overlay = document.getElementById("main-menu-overlay");
  if (overlay) {
    setOverlayHidden(overlay);
    setGamePaused(false);
  }
}

window.showPageDiv = showPageDiv;
window.showMainMenuOverlay = showMainMenuOverlay;
window.hideMainMenuOverlay = hideMainMenuOverlay;
