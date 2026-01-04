let canvas;
let world;
window.keyboard = new Keyboard();
let isPaused = false;

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

/**
 * Initializes the game by setting up the canvas and creating the world instance.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  _startGameTimeIfAvailable();
}

function _startGameTimeIfAvailable() {
  if (window.startGameTime) window.startGameTime();
}

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

window.intervalIds = [];
/**
 * Sets an interval that can be stopped later using stopAllIntervals.
 * @param {Function} fn - The function to execute at each interval.
 * @param {number} time - The interval time in milliseconds.
 * @returns {number} The interval ID.
 */
window.setStoppableInterval = function (fn, time) {
  let id = setInterval(fn, time);
  window.intervalIds.push(id);
  return id;
};

/**
 * Stops and clears all intervals set by setStoppableInterval.
 */
function stopAllIntervals() {
  _clearAllIntervals();
}

function _clearAllIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Pauses or resumes the game by stopping or restarting intervals and updating the pause state.
 */
function pauseGame() {
  if (window.gamePaused) _resumeGame();
  else _pauseGame();
}

function _resumeGame() {
  if (window.resumeGameTime) window.resumeGameTime();
  if (window.stopAllIntervals) window.stopAllIntervals();
  if (world && typeof world.startIntervals === "function")
    world.startIntervals();
  else if (world && typeof world.startGameLoops === "function") {
    world.startGameLoops();
    if (typeof world.run === "function") world.run();
  }
}

function _pauseGame() {
  if (window.pauseGameTime) window.pauseGameTime();
  if (window.stopAllIntervals) window.stopAllIntervals();
  resetKeyboardInputs();
}

/**
 * Resets all keyboard inputs to false to prevent stuck movement during pause.
 */
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

/**
 * Starts the game intervals if the world is initialized.
 */
function playGame() {
  if (world && typeof world.startIntervals === "function")
    world.startIntervals();
}

/**
 * Stops the game by clearing all intervals.
 */
function stopGame() {
  stopAllIntervals();
}

/**
 * Restarts the game by stopping all intervals and reinitializing the world.
 */
function restartGame() {
  stopAllIntervals();
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  _startGameTimeIfAvailable();
}

const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");
if (pauseButton) pauseButton.addEventListener("click", pauseGame);
if (playButton) playButton.addEventListener("click", playGame);
