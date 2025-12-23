function handleOrientationChange() {
  if (window.matchMedia("(orientation: portrait)").matches) {
    showRotateScreenFn();
  } else {
    hideRotateScreenFn();
  }
}

window.addEventListener("orientationchange", handleOrientationChange);
window.addEventListener("resize", handleOrientationChange);
// Initial prüfen
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

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

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
    if (typeof fullscreen === "function") fullscreen();
  });
}

checkMobileButtonsBarFn();
window.addEventListener("resize", checkMobileButtonsBarFn);

/**
 * Adds touch event listeners to mobile control buttons for game actions.
 */
function addMobileButtonEventListenerFn() {
  Object.keys(buttonEventListener).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("touchstart", buttonEventListener[id].touchstart, {
        passive: true,
      });
      btn.addEventListener("touchend", buttonEventListener[id].touchend, {
        passive: true,
      });
    }
  });
}

/**
 * Removes touch event listeners from mobile control buttons.
 */
function removeMobileButtonEventListenerFn() {
  Object.keys(buttonEventListener).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.removeEventListener("touchstart", buttonEventListener[id].touchstart);
      btn.removeEventListener("touchend", buttonEventListener[id].touchend);
    }
  });
}

/**
 * Hides the screens with the given element IDs by adding the 'hidden' class.
 * @param {string[]} ids - Array of element IDs to hide.
 */
function hideScreensFn(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

/**
 * Shows the specified screen and hides others. Manages mobile button event listeners.
 * @param {string} screenId - The ID of the screen to show.
 */
function showScreenFn(screenId) {
  hideScreensFn(["startscreen", "highscore", "mobileButtonsBar"]);
  document.getElementById("extrascreens").classList.remove("hidden");
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.remove("hidden");
  screenId === "mobileButtonsBar"
    ? addMobileButtonEventListenerFn()
    : removeMobileButtonEventListenerFn();
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
 * Supports tablets up to 1280px width (common for iPad Pro and Android tablets).
 */
function checkMobileButtonsBarFn() {
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isTabletOrMobile = window.innerWidth < 1280 && isTouchDevice;

  if (isTabletOrMobile || isFullscreenFn()) {
    showScreenFn("mobileButtonsBar");
  } else {
    hideScreensFn([
      "startscreen",
      "highscore",
      "mobileButtonsBar",
      "extrascreens",
    ]);
  }
}
document.addEventListener("fullscreenchange", checkMobileButtonsBarFn);
document.addEventListener("webkitfullscreenchange", checkMobileButtonsBarFn);
document.addEventListener("msfullscreenchange", checkMobileButtonsBarFn);

/**
 * Shows the canvas fullscreen button if it exists.
 */
function updateCanvasFullscreenBtnFn() {
  const canvasBtn = document.getElementById("canvasFullscreenBtn");
  if (canvasBtn) {
    canvasBtn.classList.remove("hidden");
  }
}

/**
 * Shows the rotate screen overlay for mobile devices.
 */

function showRotateScreenFn() {
  document.getElementById("extrascreens").classList.remove("hidden");
  document.getElementById("rotateScreen").classList.remove("hidden");
  if (typeof window.pauseGameTime === "function") window.pauseGameTime();
  window.gamePaused = true;
}

/**
 * Hides the rotate screen overlay for mobile devices.
 */

function hideRotateScreenFn() {
  document.getElementById("rotateScreen").classList.add("hidden");
  if (typeof window.resumeGameTime === "function") window.resumeGameTime();
  window.gamePaused = false;
}
