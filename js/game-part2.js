// --- Events, Pause/Resume, Overlay, Game-Flow, erweiterte Logik ---

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = true;
  if (e.keyCode === 37) keyboard.LEFT = true;
  if (e.keyCode === 38) keyboard.UP = true;
  if (e.keyCode === 40) keyboard.DOWN = true;
  if (e.keyCode === 32) keyboard.SPACE = true;
  if (e.keyCode === 68) keyboard.D = true;
});
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = false;
  if (e.keyCode === 37) keyboard.LEFT = false;
  if (e.keyCode === 38) keyboard.UP = false;
  if (e.keyCode === 40) keyboard.DOWN = false;
  if (e.keyCode === 32) keyboard.SPACE = false;
  if (e.keyCode === 68) keyboard.D = false;
});

document.addEventListener("keydown", function (e) {
  if (
    (document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement) &&
    (e.code === "Space" || e.keyCode === 32)
  ) {
    e.preventDefault();
  }
});

window.intervalIds = window.intervalIds || [];

window.setStoppableInterval =
  window.setStoppableInterval ||
  function (fn, time) {
    let id = setInterval(fn, time);
    window.intervalIds.push(id);
    return id;
  };

window.stopAllIntervals =
  window.stopAllIntervals ||
  function () {
    window.intervalIds.forEach(clearInterval);
    window.intervalIds = [];
  };

window.pauseGame = function () {
  const paused = window.gamePaused ? 0 : 1;
  window.gamePaused = paused;
  paused ? _pauseGame() : _resumeGame();
};

function _resumeGame() {
  window.gamePaused = 0;
  if (window.resumeGameTime) window.resumeGameTime();
  if (window.stopAllIntervals) window.stopAllIntervals();
  if (world && typeof world.startIntervals === "function") {
    world.startIntervals();
  } else if (world && typeof world.startGameLoops === "function") {
    world.startGameLoops();
    if (typeof world.run === "function") world.run();
  }
  hideTacoTimeOverlay();
}

function _pauseGame() {
  window.gamePaused = 1;
  if (window.pauseGameTime) window.pauseGameTime();
  if (window.stopAllIntervals) window.stopAllIntervals();
  resetKeyboardInputs();
  showTacoTimeOverlay();
}

function showTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  overlay.classList.remove("hide");
}

function hideTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}

function resetKeyboardInputs() {
  if (window.keyboard) _resetAllKeys(window.keyboard);
}

function _resetAllKeys(kb) {
  kb.LEFT = false;
  kb.RIGHT = false;
  kb.UP = false;
  kb.DOWN = false;
  kb.SPACE = false;
  kb.D = false;
}

function playGame() {
  window.isGameActive = true;
  if (world && typeof world.startIntervals === "function")
    world.startIntervals();
}

function stopGame() {
  window.stopAllIntervals();
}

function restartGame() {
  window.stopAllIntervals();
  window.isGameActive = true;
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  _startGameTimeIfAvailable();
}

// Exportiere Overlay-Funktionen global
window.showTacoTimeOverlay = showTacoTimeOverlay;
window.hideTacoTimeOverlay = hideTacoTimeOverlay;

function updatePageAudios(visibleDivId) {
  const mute = localStorage.getItem("polloMute") === "1";
  document.querySelectorAll("audio").forEach((audio) => {
    const parentDiv = audio.closest("div[id]");
    if (visibleDivId && parentDiv && parentDiv.id === visibleDivId && !mute) {
      audio.currentTime = 0;
      audio.play();
      audio.muted = false;
    } else if (!visibleDivId && audio.id === "index-sound" && !mute) {
      audio.currentTime = 0;
      audio.play();
      audio.muted = false;
    } else {
      audio.pause();
      audio.muted = true;
    }
  });
}
window.updatePageAudios = updatePageAudios;
