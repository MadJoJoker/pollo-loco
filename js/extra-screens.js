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

function removeMobileButtonEventListenerFn() {
  Object.keys(buttonEventListener).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.removeEventListener("touchstart", buttonEventListener[id].touchstart);
      btn.removeEventListener("touchend", buttonEventListener[id].touchend);
    }
  });
}

function hideScreensFn(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

function showScreenFn(screenId) {
  hideScreensFn(["startscreen", "highscore", "mobileButtonsBar"]);
  document.getElementById("extrascreens").classList.remove("hidden");
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.remove("hidden");
  screenId === "mobileButtonsBar"
    ? addMobileButtonEventListenerFn()
    : removeMobileButtonEventListenerFn();
}

function isFullscreenFn() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );
}

function checkMobileButtonsBarFn() {
  if (window.innerWidth < 721 || isFullscreenFn()) {
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

function updateCanvasFullscreenBtnFn() {
  const mobileBar = document.getElementById("mobileButtonsBar");
  const canvasBtn = document.getElementById("canvasFullscreenBtn");
  if (mobileBar && canvasBtn)
    canvasBtn.classList.toggle(
      "hidden",
      !mobileBar.classList.contains("hidden")
    );
}

function showRotateScreenFn() {
  document.getElementById("extrascreens").classList.remove("hidden");
  document.getElementById("rotateScreen").classList.remove("hidden");
}

function hideRotateScreenFn() {
  document.getElementById("rotateScreen").classList.add("hidden");
}
