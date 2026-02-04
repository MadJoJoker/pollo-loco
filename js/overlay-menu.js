/**
 * Overlay menu logic for all pages.
 * Handles open/close, focus, inert, and carousel loading.
 */

/**
 * Sets or unsets inert/focusable state for #page-main.
 * @param {boolean} state - If true disables, false enables focus.
 */
function setInert(state) {
  const pageMain = document.getElementById("page-main");
  if ("inert" in HTMLElement.prototype) {
    if (pageMain) pageMain.inert = state;
    return;
  }
  if (!pageMain) return;
  setTabIndexes(pageMain, state);
}

/**
 * Sets or removes tabindex for all focusable elements in a container.
 * @param {HTMLElement} container - The container to search in.
 * @param {boolean} disable - If true, disables focus.
 */
function setTabIndexes(container, disable) {
  const focusables = container.querySelectorAll(
    "a[href], button, textarea, input, select, [tabindex]",
  );
  focusables.forEach((el) => {
    if (disable) {
      if (el.hasAttribute("tabindex"))
        el.setAttribute("data-old-tabindex", el.getAttribute("tabindex"));
      el.setAttribute("tabindex", "-1");
    } else {
      if (el.hasAttribute("data-old-tabindex")) {
        el.setAttribute("tabindex", el.getAttribute("data-old-tabindex"));
        el.removeAttribute("data-old-tabindex");
      } else {
        el.removeAttribute("tabindex");
      }
    }
  });
}

/**
 * Shows the overlay and updates ARIA attributes.
 */
function showOverlaySimple() {
  if (!overlay || !revolver) return;
  overlay.classList.remove("overlay-hidden");
  overlay.classList.add("overlay-visible");
  overlay.setAttribute("aria-hidden", "false");
  revolver.setAttribute("aria-expanded", "true");
  if (pageMain) pageMain.setAttribute("aria-hidden", "true");
}

/**
 * Hides the overlay and updates ARIA attributes.
 */
function hideOverlaySimple() {
  if (!overlay || !revolver) return;
  overlay.classList.remove("overlay-visible");
  overlay.classList.add("overlay-hidden");
  overlay.setAttribute("aria-hidden", "true");
  revolver.setAttribute("aria-expanded", "false");
  if (pageMain) pageMain.removeAttribute("aria-hidden");
}

/**
 * Loads the main menu carousel into the overlay.
 */
function loadCarousel() {
  const container = document.getElementById("overlay-carousel-container");
  if (container) container.innerHTML = "";
  fetch("main-menu.html")
    .then((response) => response.text())
    .then((html) => insertCarousel(html))
    .catch(logCarouselError);
}

/**
 * Inserts carousel HTML into overlay container and initializes carousel.
 * @param {string} html - The HTML to insert.
 */
function insertCarousel(html) {
  const container = document.getElementById("overlay-carousel-container");
  if (container) container.innerHTML = html;
  tryInitCarousel(container);
}

/**
 * Tries to initialize the carousel, retries if buttons are not found.
 * @param {HTMLElement} container - The container element.
 * @param {number} [retries=10] - Number of retries left.
 */
function tryInitCarousel(container, retries = 10) {
  if (window.initCarousel) {
    const btns = container.querySelectorAll(".carousel button, .carousel a");
    if (btns.length > 0) {
      window.initCarousel();
      return;
    }
  }
  if (retries > 0)
    setTimeout(() => tryInitCarousel(container, retries - 1), 50);
}

/**
 * Logs carousel loading errors.
 * @param {Error} err - The error object.
 */
function logCarouselError(err) {
  console.error("Failed to load main-menu.html", err);
}

/**
 * Adds all event listeners for overlay menu after DOM is ready.
 */
function addOverlayListeners() {
  function setup() {
    const revolver = document.getElementById("revolver-btn");
    const overlay = document.getElementById("menu-overlay");
    const backdrop = document.getElementById("menu-backdrop");
    const closeBtn = document.getElementById("close-menu");
    const pageMain = document.getElementById("page-main");
    if (revolver) {
      const newRevolver = revolver.cloneNode(true);
      revolver.parentNode.replaceChild(newRevolver, revolver);
    }
    if (closeBtn) {
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    }
    if (backdrop) {
      const newBackdrop = backdrop.cloneNode(true);
      backdrop.parentNode.replaceChild(newBackdrop, backdrop);
    }
    const revolverBtn = document.getElementById("revolver-btn");
    const closeMenuBtn = document.getElementById("close-menu");
    const menuBackdrop = document.getElementById("menu-backdrop");
    function openMenu(e) {
      if (e) e.preventDefault();
      showOverlay(overlay, revolverBtn, pageMain);
      setInert(true);
      if (closeMenuBtn) closeMenuBtn.focus();
    }
    function closeMenu() {
      hideOverlay(overlay, revolverBtn, pageMain);
      setInert(false);
      if (revolverBtn) revolverBtn.focus();
    }
    if (revolverBtn) revolverBtn.addEventListener("click", openMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", function (e) {
        if (e.target === menuBackdrop) closeMenu();
      });
    }
    document.addEventListener("keydown", function (ev) {
      if (
        ev.key === "Escape" &&
        overlay &&
        overlay.classList.contains("overlay-visible")
      ) {
        closeMenu();
      }
    });
    loadCarousel();
  }
  document.addEventListener("DOMContentLoaded", setup);
  document.addEventListener("spa:render", setup);
  document.addEventListener("spa:render", loadCarousel);
}

/**
 * Shows the overlay and updates ARIA attributes.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} revolver - The revolver button element.
 * @param {HTMLElement} pageMain - The main page element.
 */
function showOverlay(overlay, revolver, pageMain) {
  if (!overlay || !revolver) return;
  overlay.classList.remove("overlay-hidden");
  overlay.classList.add("overlay-visible");
  overlay.setAttribute("aria-hidden", "false");
  revolver.setAttribute("aria-expanded", "true");
  if (pageMain) pageMain.setAttribute("aria-hidden", "true");
}

/**
 * Hides the overlay and updates ARIA attributes.
 * @param {HTMLElement} overlay - The overlay element.
 * @param {HTMLElement} revolver - The revolver button element.
 * @param {HTMLElement} pageMain - The main page element.
 */
function hideOverlay(overlay, revolver, pageMain) {
  if (!overlay || !revolver) return;
  overlay.classList.remove("overlay-visible");
  overlay.classList.add("overlay-hidden");
  overlay.setAttribute("aria-hidden", "true");
  revolver.setAttribute("aria-expanded", "false");
  if (pageMain) pageMain.removeAttribute("aria-hidden");
}

addOverlayListeners();

/**
 * Shows the main menu overlay, loads content and attaches listeners.
 */
window.showMainMenuOverlay = function () {
  const overlay = document.getElementById("menu-overlay");
  if (overlay) {
    overlay.classList.remove("overlay-hidden");
    overlay.classList.add("overlay-visible");
    overlay.setAttribute("aria-hidden", "false");
  }
  fetchMainMenuHtml().then((html) => {
    injectMainMenuHtml(html);
    injectMainMenuAssets(html);
  });
};

/**
 * Fetches the main menu HTML as a string.
 * @returns {Promise<string>} The HTML string.
 */
function fetchMainMenuHtml() {
  return fetch("pages/main-menu.html").then((r) => r.text());
}

/**
 * Injects the main menu HTML into the overlay container.
 * @param {string} html - The HTML string.
 */
function injectMainMenuHtml(html) {
  const container = document.getElementById("overlay-carousel-container");
  if (container) container.innerHTML = html;
}

/**
 * Injects CSS and JS assets from the main menu HTML into the document.
 * @param {string} html - The HTML string.
 */
function injectMainMenuAssets(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  temp.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
    if (!document.querySelector(`link[href="${link.href}"]`))
      document.head.appendChild(link.cloneNode());
  });
  temp.querySelectorAll("script[src]").forEach((script) => {
    if (!document.querySelector(`script[src="${script.src}"]`)) {
      const s = document.createElement("script");
      s.src = script.src;
      document.body.appendChild(s);
    }
  });
}
