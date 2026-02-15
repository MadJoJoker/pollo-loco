/**
 * Handles orientation change event and shows/hides rotate screen overlay.
 */
function handleOrientationChange() {
  if (isPortraitOrientation()) {
    showRotateScreenFn();
  } else {
    hideRotateScreenFn();
  }
}

/**
 * Checks if the device is in portrait orientation.
 * @returns {boolean} True if portrait, false otherwise.
 */
function isPortraitOrientation() {
  return window.matchMedia("(orientation: portrait)").matches;
}

window.addEventListener("orientationchange", handleOrientationChange);
window.addEventListener("resize", handleOrientationChange);
handleOrientationChange();
const buttonIds = [
  "startGame",
  "highscoreButton",
  "backButton",
  "leftButton",
  "rightButton",
  "jumpButton",
  "throwButton",
  "pauseButton",
  "muteButton",
];

/**
 * Prevents the default context menu from appearing.
 * @param {Event} e - The contextmenu event.
 */
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

/**
 * Prevents default action for Tab, Space, and Enter keys.
 * @param {KeyboardEvent} e - The keydown event.
 */
document.addEventListener("keydown", function (e) {
  if (["Tab", " ", "Enter"].includes(e.key)) {
    e.preventDefault();
  }
});

const buttonEventListener = {
  leftButton: {
    touchstart: function () {
      if (window.keyboard) keyboard.LEFT = true;
    },
    touchend: function () {
      if (window.keyboard) keyboard.LEFT = false;
    },
  },
  rightButton: {
    touchstart: function () {
      if (window.keyboard) keyboard.RIGHT = true;
    },
    touchend: function () {
      if (window.keyboard) keyboard.RIGHT = false;
    },
  },
  jumpButton: {
    touchstart: function () {
      if (window.keyboard) keyboard.SPACE = true;
    },
    touchend: function () {
      if (window.keyboard) keyboard.SPACE = false;
    },
  },
  throwButton: {
    touchstart: function () {
      if (window.keyboard) keyboard.D = true;
    },
    touchend: function () {
      if (window.keyboard) keyboard.D = false;
    },
  },
};

window.addEventListener("resize", updateCanvasFullscreenBtnFn);
updateCanvasFullscreenBtnFn();

const canvasFullscreenBtn = document.getElementById("canvasFullscreenButton");
if (canvasFullscreenBtn) {
  canvasFullscreenBtn.addEventListener("click", function () {
    if (typeof fullscreen === "function") fullscreen();
  });
  canvasFullscreenBtn.addEventListener("touchstart", function () {
    canvasFullscreenBtn.classList.add("show-btn-text");
    setTimeout(() => {
      canvasFullscreenBtn.classList.remove("show-btn-text");
    }, 1500);
    if (typeof fullscreen === "function") fullscreen();
  });
  canvasFullscreenBtn.addEventListener("touchend", function () {
    canvasFullscreenBtn.classList.remove("show-btn-text");
  });
  canvasFullscreenBtn.addEventListener("mouseleave", function () {
    canvasFullscreenBtn.classList.remove("show-btn-text");
  });
}

checkMobileButtonsBarFn();
window.addEventListener("resize", checkMobileButtonsBarFn);

/**
 * Adds touch event listeners to mobile control buttons for game actions.
 */

/**
 * Adds touch event listeners to all mobile control buttons.
 */
function addMobileButtonEventListenerFn() {
  Object.keys(buttonEventListener).forEach((id) => {
    addTouchListenersToBtn(id);
  });
}

/**
 * Adds touchstart and touchend listeners to a button.
 * @param {string} id - The button element ID.
 */
function addTouchListenersToBtn(id) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("touchstart", buttonEventListener[id].touchstart, {
      passive: true,
    });
    btn.addEventListener("touchend", buttonEventListener[id].touchend, {
      passive: true,
    });
  }
}

/**
 * Removes touch event listeners from mobile control buttons.
 */

/**
 * Removes touch event listeners from all mobile control buttons.
 */
function removeMobileButtonEventListenerFn() {
  Object.keys(buttonEventListener).forEach((id) => {
    removeTouchListenersFromBtn(id);
  });
}

/**
 * Removes touchstart and touchend listeners from a button.
 * @param {string} id - The button element ID.
 */
function removeTouchListenersFromBtn(id) {
  const btn = document.getElementById(id);
  if (btn) {
    btn.removeEventListener("touchstart", buttonEventListener[id].touchstart);
    btn.removeEventListener("touchend", buttonEventListener[id].touchend);
  }
}

/**
 * Hides the screens with the given element IDs by adding the 'hidden' class.
 * @param {string[]} ids - Array of element IDs to hide.
 */
function hideScreensFn(ids) {
  ids.forEach(hideScreenById);
}

/**
 * Hides a single screen by ID.
 * @param {string} id - The element ID to hide.
 */
function hideScreenById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

/**
 * Shows the specified screen and hides others. Manages mobile button event listeners.
 * @param {string} screenId - The ID of the screen to show.
 */
function showScreenFn(screenId) {
  hideScreensFn(["startscreen", "highscore", "mobileButtonsBar"]);
  showExtrascreens();
  showScreenById(screenId);
  if (screenId === "mobileButtonsBar") addMobileButtonEventListenerFn();
  else removeMobileButtonEventListenerFn();
}

/**
 * Shows the extrascreens overlay.
 */
function showExtrascreens() {
  const canvas = document.getElementById("canvas");
  const gameContainer = document.getElementById("game-container");
  const divs = document.querySelectorAll('div[id^="div-"]');
  const allDivsHidden = Array.from(divs).every(
    (div) => getComputedStyle(div).display === "none",
  );
  if (
    canvas &&
    canvas.offsetParent !== null &&
    getComputedStyle(canvas).display !== "none" &&
    gameContainer &&
    gameContainer.offsetParent !== null &&
    getComputedStyle(gameContainer).display !== "none" &&
    allDivsHidden
  ) {
    document.getElementById("extrascreens").classList.remove("hidden");
  }
}

/**
 * Shows a single screen by ID.
 * @param {string} screenId - The element ID to show.
 */
function showScreenById(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

/**
 * Checks if the document is currently in fullscreen mode.
 * @returns {boolean} True if fullscreen, otherwise false.
 */
function isFullscreenFn() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}

/**
 * Shows or hides the mobile buttons bar based on window width or fullscreen state.
 */
function checkMobileButtonsBarFn() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isTabletOrMobile = window.innerWidth < 1440 && isTouchDevice;
  if (isTabletOrMobile || isFullscreenFn()) showScreenFn("mobileButtonsBar");
  else hideAllScreens();
}

/**
 * Hides all main overlay screens.
 */
function hideAllScreens() {
  hideScreensFn([
    "startscreen",
    "highscore",
    "mobileButtonsBar",
    "extrascreens",
  ]);
}
document.addEventListener("fullscreenchange", checkMobileButtonsBarFn);
document.addEventListener("webkitfullscreenchange", checkMobileButtonsBarFn);
document.addEventListener("msfullscreenchange", checkMobileButtonsBarFn);

/**
 * Shows the canvas fullscreen button if it exists.
 */
function updateCanvasFullscreenBtnFn() {
  const canvasBtn = document.getElementById("canvasFullscreenBtn");
  if (canvasBtn) canvasBtn.classList.remove("hidden");
}

/**
 * Shows the rotate screen overlay for mobile devices.
 */
function showRotateScreenFn() {
  if (!window.isGameActive) return;
  showExtrascreens();
  showScreenById("rotateScreen");
  if (typeof window.pauseGameTime === "function") window.pauseGameTime();
  window.gamePaused = true;
}

/**
 * Hides the rotate screen overlay for mobile devices.
 */
function hideRotateScreenFn() {
  hideScreenById("rotateScreen");
  if (window.isGameActive && typeof window.resumeGameTime === "function") {
    window.resumeGameTime();
  }
  window.gamePaused = false;
}
