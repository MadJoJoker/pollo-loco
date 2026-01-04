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
  showCountdownAndStartGame();
}

function showCountdownAndStartGame() {
  let countdown = 3;
  const ctx = canvas.getContext("2d");
  const charImg = new window.Image();
  charImg.src = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
  const chickenImg = new window.Image();
  chickenImg.src = "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png";
  function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCountdown(ctx, countdown, charImg, chickenImg);
  }
  drawAll();
  let countdownInterval = setInterval(() => {
    countdown--;
    drawAll();
    if (countdown < 0) {
      clearInterval(countdownInterval);
      world = new World(canvas, keyboard);
      _startGameTimeIfAvailable();
    }
  }, 1000);
}

function drawCountdown(ctx, number, charImg, chickenImg) {
  ctx.save();
  drawCountdownBg(ctx);
  drawCountdownImgs(ctx, charImg, chickenImg);
  ctx.font = "bold 120px GringoNights, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "#1b0b0b";
  ctx.fillStyle = "#f4ee96";
  let text = number > 0 ? number : "GO!";
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  ctx.shadowColor = "#b85f14";
  ctx.shadowBlur = 30;
  ctx.globalAlpha = 0.7;
  ctx.restore();
}

function drawCountdownBg(ctx) {
  let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#f4ee96");
  grad.addColorStop(0.5, "#cc7722");
  grad.addColorStop(1, "#611f1d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawCountdownImgs(ctx, charImg, chickenImg) {
  if (charImg.complete)
    ctx.drawImage(charImg, 40, canvas.height - 180, 120, 140);
  if (chickenImg.complete)
    ctx.drawImage(
      chickenImg,
      canvas.width - 160,
      canvas.height - 150,
      110,
      110
    );
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
  hideTacoTimeOverlay();
}

function _pauseGame() {
  if (window.pauseGameTime) window.pauseGameTime();
  if (window.stopAllIntervals) window.stopAllIntervals();
  resetKeyboardInputs();
  showTacoTimeOverlay();
}

// Taco Time Overlay anzeigen
function showTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  overlay.classList.remove("hide");
}

// Taco Time Overlay ausblenden (mit Animation)
function hideTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500); // Animationsdauer wie in CSS
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
