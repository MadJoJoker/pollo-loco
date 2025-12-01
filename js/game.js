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
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Pauses or resumes the game by stopping or restarting intervals and updating the pause state.
 */
function pauseGame() {
  if (window.gamePaused) {
    // Resume game time and restart world intervals
    if (window.resumeGameTime) window.resumeGameTime();
    if (window.stopAllIntervals) {
      // ensure any previous intervals are cleared before restarting
      window.stopAllIntervals();
    }
    if (world && typeof world.startIntervals === "function") {
      world.startIntervals();
    } else if (world && typeof world.startGameLoops === "function") {
      // fallback: start the main loops again
      world.startGameLoops();
      if (typeof world.run === "function") world.run();
    }
  } else {
    // Pause game time and stop all interval-based loops (collision, drawing, etc.)
    if (window.pauseGameTime) window.pauseGameTime();
    if (window.stopAllIntervals) window.stopAllIntervals();
    // Reset all keyboard inputs to prevent character from staying in motion/air
    resetKeyboardInputs();
  }
}

/**
 * Resets all keyboard inputs to false to prevent stuck movement during pause.
 */
function resetKeyboardInputs() {
  if (window.keyboard) {
    window.keyboard.LEFT = false;
    window.keyboard.RIGHT = false;
    window.keyboard.UP = false;
    window.keyboard.DOWN = false;
    window.keyboard.SPACE = false;
    window.keyboard.D = false;
  }
}

/**
 * Starts the game intervals if the world is initialized.
 */
function playGame() {
  if (world && typeof world.startIntervals === "function") {
    world.startIntervals();
  }
}

/**
 * Stops the game by clearing all intervals.
 */
function stopGame() {
  stopAllIntervals();
}

const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");
if (pauseButton) pauseButton.addEventListener("click", pauseGame);
if (playButton) playButton.addEventListener("click", playGame);
