
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
  "fullscreenButton",
];
// Kontextmenü = Aus
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
const buttonListeners = {
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
  fullscreenButton: {
    touchstart: function () {
      if (typeof fullscreen === "function") fullscreen();
    },
  },
};

//Eventlistener
window.addEventListener("resize", updateCanvasFullscreenBtn);
updateCanvasFullscreenBtn();

document
  .getElementById("canvasFullscreenButton")
  .addEventListener("click", function () {
    if (typeof fullscreen === "function") fullscreen();
  });

checkMobileButtonsBar();

window.addEventListener("resize", checkMobileButtonsBar);


function addMobileButtonListeners() {
  Object.keys(buttonListeners).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (id === "fullscreenButton" && buttonListeners[id].touchstart) {
      btn.addEventListener("touchstart", buttonListeners[id].touchstart);
      btn.addEventListener("click", buttonListeners[id].touchstart);
    } else {
      btn.addEventListener("touchstart", buttonListeners[id].touchstart, {
        passive: true,
      });
      btn.addEventListener("touchend", buttonListeners[id].touchend, {
        passive: true,
      });
    }
  });
}

function removeMobileButtonListeners() {
  Object.keys(buttonListeners).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.removeEventListener("touchstart", buttonListeners[id].touchstart);
    btn.removeEventListener("touchend", buttonListeners[id].touchend);
    if (id === "fullscreenButton" && buttonListeners[id].touchstart) {
      btn.removeEventListener("click", buttonListeners[id].touchstart);
    }
  });
}

function showScreen(screenId) {
  const screens = ["startscreen", "highscore", "mobileButtonsBar"];
  screens.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  document.getElementById("extrascreens").classList.remove("hidden");
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.remove("hidden");

  if (screenId === "mobileButtonsBar") {
    addMobileButtonListeners();
  } else {
    removeMobileButtonListeners();
  }
}

function checkMobileButtonsBar() {
  if (window.innerWidth <= 720) {
    showScreen("mobileButtonsBar");
  } else {
    const screens = [
      "startscreen",
      "highscore",
      "mobileButtonsBar",
      "extrascreens",
    ];
    screens.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
  }
}
function updateCanvasFullscreenBtn() {
  const mobileBar = document.getElementById("mobileButtonsBar");
  const canvasBtn = document.getElementById("canvasFullscreenBtn");
  if (mobileBar && canvasBtn) {
    if (mobileBar.classList.contains("hidden")) {
      canvasBtn.classList.remove("hidden");
    } else {
      canvasBtn.classList.add("hidden");
    }
  }
}
function showRotateScreen() {
  document.getElementById("extrascreens").classList.remove("hidden");
  document.getElementById("rotateScreen").classList.remove("hidden");
}

function hideRotateScreen() {
  document.getElementById("rotateScreen").classList.add("hidden");
}
