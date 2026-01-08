/**
 * Overlay menu logic for all pages.
 * Handles open/close, focus, inert, and carousel loading.
 * @author Copilot
 */

(function () {
  /**
   * Set or unset inert/focusable state for #page-main.
   * @param {boolean} state - true disables, false enables focus.
   */
  /**
   * Set or unset inert/focusable state for #page-main.
   * @param {boolean} state - true disables, false enables focus.
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
   * Set or remove tabindex for all focusable elements.
   * @param {HTMLElement} container - The container to search in.
   * @param {boolean} disable - If true, disable focus.
   */
  function setTabIndexes(container, disable) {
    const focusables = container.querySelectorAll(
      "a[href], button, textarea, input, select, [tabindex]"
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
   * Opens the overlay menu and sets focus.
   * @param {Event} e - Click event.
   */
  /**
   * Open the overlay menu and set focus.
   * @param {Event} e - Click event.
   */
  function openMenu(e) {
    if (e) e.preventDefault();
    showOverlay();
    setInert(true);
    if (typeof closeBtn !== "undefined" && closeBtn) closeBtn.focus();
  }

  /**
   * Show overlay and update ARIA attributes.
   */
  function showOverlay() {
    if (!overlay || !revolver) return;
    overlay.classList.remove("overlay-hidden");
    overlay.classList.add("overlay-visible");
    overlay.setAttribute("aria-hidden", "false");
    revolver.setAttribute("aria-expanded", "true");
    if (pageMain) pageMain.setAttribute("aria-hidden", "true");
  }

  /**
   * Closes the overlay menu and restores focus.
   */
  /**
   * Close the overlay menu and restore focus.
   */
  function closeMenu() {
    hideOverlay();
    setInert(false);
    if (typeof revolver !== "undefined" && revolver) revolver.focus();
  }

  /**
   * Hide overlay and update ARIA attributes.
   */
  function hideOverlay() {
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
  /**
   * Load the main menu carousel into the overlay.
   */
  let carouselLoaded = false;
  function loadCarousel() {
    const container = document.getElementById("overlay-carousel-container");
    if (container) container.innerHTML = "";
    carouselLoaded = false;
    fetch("main-menu.html")
      .then((response) => response.text())
      .then((html) => {
        carouselLoaded = true;
        insertCarousel(html);
      })
      .catch(logCarouselError);
  }

  /**
   * Insert carousel HTML into overlay container.
   * @param {string} html - The HTML to insert.
   */
  function insertCarousel(html) {
    const container = document.getElementById("overlay-carousel-container");
    if (container) container.innerHTML = html;
    // Robust: Warte bis Buttons im DOM sind, dann initialisiere Carousel
    function tryInitCarousel(retries = 10) {
      if (window.initCarousel) {
        const btns = container.querySelectorAll(
          ".carousel button, .carousel a"
        );
        if (btns.length > 0) {
          window.initCarousel();
          return;
        }
      }
      if (retries > 0) {
        setTimeout(() => tryInitCarousel(retries - 1), 50);
      } else {
        console.warn(
          "Carousel konnte nicht initialisiert werden: keine Buttons gefunden."
        );
      }
    }
    tryInitCarousel();
  }

  /**
   * Log carousel loading errors.
   * @param {Error} err - The error object.
   */
  function logCarouselError(err) {
    console.error("Failed to load main-menu.html", err);
  }

  /**
   * Add all event listeners for overlay menu after DOM is ready.
   */
  function addOverlayListeners() {
    function setup() {
      // Remove previous listeners by cloning nodes (safe for single-page apps)
      const revolver = document.getElementById("revolver-btn");
      const overlay = document.getElementById("menu-overlay");
      const backdrop = document.getElementById("menu-backdrop");
      const closeBtn = document.getElementById("close-menu");
      const pageMain = document.getElementById("page-main");

      // Remove all previous click listeners by replacing elements
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

      // Get fresh references
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
   * Show overlay and update ARIA attributes.
   * @param {HTMLElement} overlay
   * @param {HTMLElement} revolver
   * @param {HTMLElement} pageMain
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
   * Hide overlay and update ARIA attributes.
   * @param {HTMLElement} overlay
   * @param {HTMLElement} revolver
   * @param {HTMLElement} pageMain
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
})();
