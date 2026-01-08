/**
 * Initializes the main menu carousel, sets up event listeners, and starts autoplay.
 * @returns {Function|null} Function to unregister autoplay or null.
 */
window.initCarousel = function () {
  const state = createCarouselState();
  setupCarouselWheelShort(
    state.buttons,
    state.count,
    state.getActiveIndex,
    state.setActiveIndex
  );
  const unregisterAutoplay = setupCarouselAutoplayWithState(state);
  _updateCarousel(state.buttons, state.getActiveIndex);
  return unregisterAutoplay;
};

/**
 * Sets up autoplay for the carousel using the state object.
 * @param {Object} state The carousel state object.
 * @returns {Function|null} Unregister function or null.
 */
function setupCarouselAutoplayWithState(state) {
  return setupAutoplay(
    state.count,
    state.getActiveIndex,
    state.setActiveIndex,
    state.getAutoplayActive,
    state.setAutoplayActive,
    state.autoplayInterval
  );
}

/**
 * Creates and returns the state and helpers for the carousel.
 * @returns {Object} State and helper functions for the carousel.
 */
function createCarouselState() {
  const buttons = document.querySelectorAll(".carousel button, .carousel a");
  const count = buttons.length;
  let activeIndex = 0;
  let autoplayActive = true;
  const autoplayInterval = 2000;
  return {
    buttons,
    count,
    getActiveIndex: () => activeIndex,
    setActiveIndex: (v) => (activeIndex = v),
    getAutoplayActive: () => autoplayActive,
    setAutoplayActive: (v) => (autoplayActive = v),
    autoplayInterval,
  };
}

/**
 * Sets up the carousel wheel event.
 * @param {NodeList} buttons Carousel buttons.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 */
function setupCarouselWheelShort(buttons, count, getIdx, setIdx) {
  const carousel = document.querySelector(".carousel");
  if (!carousel) return;
  carousel.addEventListener("wheel", (e) =>
    handleWheelEvent(e, count, getIdx, setIdx, buttons)
  );
}

/**
 * Handles the wheel event for carousel.
 * @param {WheelEvent} e Wheel event.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 * @param {NodeList} buttons Carousel buttons.
 */
function handleWheelEvent(e, count, getIdx, setIdx, buttons) {
  const delta = e.deltaY > 0 ? 1 : -1;
  _scrollCarousel(count, getIdx, setIdx, delta, buttons);
  e.preventDefault();
}

/**
 * Sets up autoplay for the carousel.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 * @param {Function} getActive Getter for autoplay active.
 * @param {Function} setActive Setter for autoplay active.
 * @param {number} interval Autoplay interval in ms.
 * @returns {Function|null} Unregister function or null.
 */
function setupAutoplay(count, getIdx, setIdx, getActive, setActive, interval) {
  if (_canUseGameLoop()) {
    return _setupGameLoopCarousel(
      count,
      getIdx,
      setIdx,
      getActive,
      setActive,
      interval
    );
  }
  return _setupIntervalCarousel(
    count,
    getIdx,
    setIdx,
    getActive,
    setActive,
    interval
  );
}

/**
 * Scrolls the carousel by delta.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 * @param {number} delta Scroll direction (+1 or -1).
 * @param {NodeList} buttons Carousel buttons.
 */
function _scrollCarousel(count, getIdx, setIdx, delta, buttons) {
  setIdx((getIdx() + delta + count) % count);
  _updateCarousel(buttons, getIdx);
}

/**
 * Updates the carousel button states and scrolls active into view.
 * @param {NodeList} buttons Carousel buttons.
 * @param {Function} getIdx Getter for active index.
 */
function _updateCarousel(buttons, getIdx) {
  buttons.forEach((btn, i) => updateButtonState(btn, i, getIdx));
  scrollActiveButton(buttons, getIdx);
}

/**
 * Updates a single button's state.
 * @param {HTMLElement} btn Button element.
 * @param {number} i Button index.
 * @param {Function} getIdx Getter for active index.
 */
function updateButtonState(btn, i, getIdx) {
  btn.classList.toggle("active", i === getIdx());
  btn.style.display = "inline-flex";
}

/**
 * Scrolls the active button into view.
 * @param {NodeList} buttons Carousel buttons.
 * @param {Function} getIdx Getter for active index.
 */
function scrollActiveButton(buttons, getIdx) {
  const activeBtn = buttons[getIdx()];
  if (activeBtn && typeof activeBtn.scrollIntoView === "function") {
    activeBtn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

/**
 * Checks if the game loop functions are available.
 * @returns {boolean} True if game loop can be used.
 */
function _canUseGameLoop() {
  return (
    typeof window.getGameTime === "function" &&
    typeof window.registerGameLoop === "function"
  );
}

/**
 * Sets up carousel autoplay using the game loop.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 * @param {Function} getActive Getter for autoplay active.
 * @param {Function} setActive Setter for autoplay active.
 * @param {number} interval Autoplay interval in ms.
 * @returns {Function} Unregister function.
 */
function _setupGameLoopCarousel(
  count,
  getIdx,
  setIdx,
  getActive,
  setActive,
  interval
) {
  let lastAutoplayTick = window.getGameTime();
  const unregister = window.registerGameLoop((gameTime) => {
    handleGameLoopAutoplay(
      gameTime,
      getActive,
      lastAutoplayTick,
      interval,
      count,
      getIdx,
      setIdx
    );
    if (gameTime - lastAutoplayTick >= interval) lastAutoplayTick = gameTime;
  });
  setupCarouselHoverEvents(setActive, () => {
    lastAutoplayTick = window.getGameTime();
  });
  return unregister;
}

/**
 * Handles the autoplay logic inside the game loop.
 */
function handleGameLoopAutoplay(
  gameTime,
  getActive,
  lastAutoplayTick,
  interval,
  count,
  getIdx,
  setIdx
) {
  if (!getActive()) return;
  if (gameTime - lastAutoplayTick >= interval) {
    _scrollCarousel(
      count,
      getIdx,
      setIdx,
      1,
      document.querySelectorAll(".carousel button")
    );
  }
}

/**
 * Sets up mouseenter/mouseleave events for carousel.
 * @param {Function} setActive Setter for autoplay active.
 * @param {Function} onLeave Callback for mouseleave.
 */
function setupCarouselHoverEvents(setActive, onLeave) {
  const carouselElem = document.querySelector(".carousel");
  if (!carouselElem) return;
  carouselElem.addEventListener("mouseenter", () => setActive(false));
  carouselElem.addEventListener("mouseleave", () => {
    setActive(true);
    if (onLeave) onLeave();
  });
}

/**
 * Sets up carousel autoplay using setInterval.
 * @param {number} count Number of buttons.
 * @param {Function} getIdx Getter for active index.
 * @param {Function} setIdx Setter for active index.
 * @param {Function} getActive Getter for autoplay active.
 * @param {Function} setActive Setter for autoplay active.
 * @param {number} interval Autoplay interval in ms.
 * @returns {Function} Unregister function.
 */
function _setupIntervalCarousel(
  count,
  getIdx,
  setIdx,
  getActive,
  setActive,
  interval
) {
  let intervalId = setInterval(() => {
    if (getActive())
      _scrollCarousel(
        count,
        getIdx,
        setIdx,
        1,
        document.querySelectorAll(".carousel button")
      );
  }, interval);
  setupCarouselHoverEvents(setActive);
  return () => clearInterval(intervalId);
}
/**
 * Sets up the no-restart button alert on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  setupNoRestartButton();
});

/**
 * Sets up the no-restart button alert overlay.
 */
function setupNoRestartButton() {
  const noRestartBtn = document.getElementById("no-restart-btn");
  const overlay = document.getElementById("no-restart-overlay");
  if (!noRestartBtn || !overlay) return;
  resetOverlayStyle(overlay);
  noRestartBtn.addEventListener("click", function () {
    showOverlayWithTimeout(overlay);
  });
}

/**
 * Resets the overlay style.
 * @param {HTMLElement} overlay The overlay element.
 */
function resetOverlayStyle(overlay) {
  overlay.style.display = "none";
  overlay.style.top = "-200px";
  overlay.style.opacity = "0";
  overlay.style.animation = "none";
}

/**
 * Shows the overlay and hides it after a timeout.
 * @param {HTMLElement} overlay The overlay element.
 */
function showOverlayWithTimeout(overlay) {
  overlay.style.display = "block";
  overlay.style.animation =
    "overlaySlideIn 0.7s cubic-bezier(.77,0,.18,1) forwards";
  setTimeout(() => {
    hideOverlayWithAnimation(overlay);
  }, 3000);
}

/**
 * Hides the overlay with animation and resets style.
 * @param {HTMLElement} overlay The overlay element.
 */
function hideOverlayWithAnimation(overlay) {
  overlay.style.animation =
    "overlaySlideOut 0.7s cubic-bezier(.77,0,.18,1) forwards";
  setTimeout(() => {
    resetOverlayStyle(overlay);
  }, 700);
}
