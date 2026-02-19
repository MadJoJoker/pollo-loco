// div-visibility-manager-part2.js
// This file contains the second half of the functions from div-visibility-manager.js.
// All functions are documented and exported for use in the main app.

/**
 * Load HTML content for a page and inject it into the div.
 * @param {string} pageName - The name of the page
 * @param {HTMLElement} div - The div to inject content into
 */
async function loadPageDivContent(pageName, div) {
  const url = `pages/${pageName.replace(/_/g, "-")}.html`;
  const resp = await fetch(url);
  const html = await resp.text();
  injectPageHtml(div, html);
  div.setAttribute("data-loaded", "1");
}

/**
 * Inject HTML into a div and add any CSS/JS links found in the HTML.
 * @param {HTMLElement} div - The div to inject into
 * @param {string} html - The HTML string
 */
function injectPageHtml(div, html) {
  div.innerHTML = getHtmlBody(html);
  addCssLinks(extractCssLinks(html));
  addJsLinks(extractJsLinks(html));
}

/**
 * Show the page div for the given page name, loading content if needed.
 * @param {string} pageName - The name of the page
 */
async function showPageDiv(pageName) {
  setPageDivsSectionVisible();
  hideAllPageDivs();
  hideCanvasAndBars();
  const divId = getDivId(pageName);
  const div = getPageDiv(divId);
  if (!div) return;
  if (!div.hasAttribute("data-loaded")) await loadPageDivContent(pageName, div);
  setPageDivVisible(div);
  if (window.updatePageAudios) window.updatePageAudios(divId);
}

/**
 * Remove overlay event listeners from the main menu overlay.
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
  if (l.btnHandlers) removeBtnHandlers(overlay, l.btnHandlers);
}

/**
 * Remove click event listeners from all menu buttons in the overlay.
 * @param {HTMLElement} overlay - The overlay element
 * @param {Object} btnHandlers - Map of button ids to handler functions
 */
function removeBtnHandlers(overlay, btnHandlers) {
  Object.entries(btnHandlers).forEach(([id, handler]) => {
    const btn = overlay.querySelector(`#${id}`);
    if (btn) btn.removeEventListener("click", handler);
  });
}

/**
 * Create and attach button click handlers for the overlay menu.
 * @param {HTMLElement} drawer - The menu drawer element
 * @param {Object} btnMap - Map of button ids to handler functions
 * @returns {Object} Map of button ids to handler functions
 */
function createBtnHandlers(drawer, btnMap) {
  const btnHandlers = {};
  Object.entries(btnMap).forEach(([id, fn]) => {
    btnHandlers[id] = (e) => handleMenuBtnClick(e, fn);
    const btn = drawer.querySelector(`#${id}`);
    if (btn) btn.addEventListener("click", btnHandlers[id]);
  });
  return btnHandlers;
}

/**
 * Handle a menu button click event and close the overlay.
 * @param {Event} e - The event object
 * @param {Function} fn - The button handler function
 */
function handleMenuBtnClick(e, fn) {
  e.preventDefault();
  e.stopPropagation();
  fn();
  window.hideMainMenuOverlay();
}

/**
 * Add all event listeners to the overlay menu.
 * @param {HTMLElement} overlay - The overlay element
 */
function addOverlayEventListeners(overlay) {
  const drawer = overlay.querySelector(".menu-drawer");
  if (!drawer) return;
  const outerClick = (e) => {
    if (e.target === overlay) window.hideMainMenuOverlay();
  };
  overlay.addEventListener("mousedown", outerClick);
  const stopPropDrawer = (e) => {
    e.stopPropagation();
  };
  drawer.addEventListener("mousedown", stopPropDrawer);
  const closeBtn = drawer.querySelector(".close-menu, #close-menu");
  const closeBtnHandler = (e) => {
    e.stopPropagation();
    window.hideMainMenuOverlay();
  };
  if (closeBtn) closeBtn.addEventListener("click", closeBtnHandler);
  const btnMap = {
    "home-btn": () => window.showPageDiv("start-screen"),
    "start-game-btn": () => (window.location.href = "index.html"),
    "how-to-play-btn": () => window.showPageDiv("how-to-play"),
    "settings-btn": () => window.showPageDiv("settings"),
    "highscore-btn": () => window.showPageDiv("highscore"),
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
 * Set the overlay visible (removes hidden class, adds visible class).
 * @param {HTMLElement} overlay - The overlay element
 */
function setOverlayVisible(overlay) {
  overlay.classList.remove("overlay-hidden");
  overlay.classList.add("overlay-visible");
}

/**
 * Set the overlay hidden (removes visible class, adds hidden class).
 * @param {HTMLElement} overlay - The overlay element
 */
function setOverlayHidden(overlay) {
  overlay.classList.remove("overlay-visible");
  overlay.classList.add("overlay-hidden");
}

/**
 * Set the main menu div visible (display: block).
 */
function setMainMenuDivVisible() {
  const div = document.getElementById("div-main-menu");
  if (div) div.style.display = "block";
}

/**
 * Set the global gamePaused flag.
 * @param {boolean} paused - Whether the game is paused
 */
function setGamePaused(paused) {
  window.gamePaused = paused ? 1 : 0;
}

/**
 * Set the main menu HTML content in the given div.
 * @param {HTMLElement} div - The div to inject HTML into
 * @param {string} html - The HTML string
 */
function setMainMenuHtml(div, html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const overlayBlock = temp.querySelector(".menu-overlay");
  div.innerHTML = overlayBlock ? overlayBlock.outerHTML : html;
}

/**
 * Fetch the main menu HTML as a string.
 * @returns {Promise<string>} The HTML string
 */
function fetchMainMenuHtml() {
  return fetch("pages/main-menu.html").then((resp) => resp.text());
}

/**
 * Show the main menu overlay, load content and attach listeners.
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
 * Hide the main menu overlay and unpause the game.
 */
function hideMainMenuOverlay() {
  const overlay = document.getElementById("main-menu-overlay");
  if (overlay) {
    setOverlayHidden(overlay);
    setGamePaused(false);
  }
}

// Ensure global access for all moved functions
window.showPageDiv = showPageDiv;
window.showMainMenuOverlay = showMainMenuOverlay;
window.hideMainMenuOverlay = hideMainMenuOverlay;
