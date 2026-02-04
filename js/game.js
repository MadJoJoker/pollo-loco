/**
 * Draws the countdown number and images on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} number - The countdown number.
 * @param {HTMLImageElement} charImg - Character image.
 * @param {HTMLImageElement} chickenImg - Chicken image.
 */
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
/**
 * Clears the canvas and draws the countdown frame.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} countdown - The countdown number.
 * @param {HTMLImageElement} charImg - Character image.
 * @param {HTMLImageElement} chickenImg - Chicken image.
 */
function drawCountdownFrame(ctx, countdown, charImg, chickenImg) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCountdown(ctx, countdown, charImg, chickenImg);
}
let canvas;
let world;
window.keyboard = new Keyboard();
let isPaused = false;

/**
 * Prevents the default context menu from appearing.
 * @param {Event} e - The contextmenu event.
 */
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

/**
 * Initializes the game by setting up the canvas and starting the countdown.
 */
function init() {
  canvas = document.getElementById("canvas");
  startCountdown();
}

/**
 * Shows a countdown before the game starts and initializes the world.
 */
function startCountdown() {
  let countdown = 3;
  const ctx = canvas.getContext("2d");
  const charImg = new window.Image();
  charImg.src = "assets/img/2_character_pepe/1_idle/idle/I-1.png";
  const chickenImg = new window.Image();
  chickenImg.src = "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png";
  const pauseBtn = document.getElementById("pauseButton");
  if (pauseBtn) makePauseButtonDisabled(pauseBtn);
  drawCountdownFrame(ctx, countdown, charImg, chickenImg);
  let countdownInterval = setInterval(() => {
    countdown--;
    drawCountdownFrame(ctx, countdown, charImg, chickenImg);
    if (countdown < 0) {
      clearInterval(countdownInterval);
      if (pauseBtn) enablePauseButton(pauseBtn);
      world = new World(canvas, keyboard);
      _startGameTimeIfAvailable();
    }
  }, 1000);
}

/**
 * Disables the pause button and shows overlay.
 * @param {HTMLElement} pauseBtn - The pause button element.
 */
function makePauseButtonDisabled(pauseBtn) {
  pauseBtn.classList.add("disabled");
  if (!pauseBtn.querySelector(".pause-disabled-overlay")) {
    const overlay = document.createElement("div");
    overlay.className = "pause-disabled-overlay";
    overlay.innerHTML =
      '<div class="pause-disabled-circle"></div><div class="pause-disabled-slash"></div>';
    pauseBtn.appendChild(overlay);
  } else {
    pauseBtn.querySelector(".pause-disabled-overlay").style.display = "flex";
  }
}

/**
 * Enables the pause button and hides overlay.
 * @param {HTMLElement} pauseBtn - The pause button element.
 */
function enablePauseButton(pauseBtn) {
  pauseBtn.classList.remove("disabled");
  const overlay = pauseBtn.querySelector(".pause-disabled-overlay");
  if (overlay) overlay.style.display = "none";
}

/**
 * Draws the countdown number and images on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {number} number - The countdown number.
 * @param {HTMLImageElement} charImg - Character image.
 * @param {HTMLImageElement} chickenImg - Chicken image.
 */

/**
 * Draws the background gradient for the countdown.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 */
function drawCountdownBg(ctx) {
  let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, "#f4ee96");
  grad.addColorStop(0.5, "#cc7722");
  grad.addColorStop(1, "#611f1d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws the character and chicken images for the countdown.
 * @param {CanvasRenderingContext2D} ctx - The canvas context.
 * @param {HTMLImageElement} charImg - Character image.
 * @param {HTMLImageElement} chickenImg - Chicken image.
 */
function drawCountdownImgs(ctx, charImg, chickenImg) {
  if (charImg.complete)
    ctx.drawImage(charImg, 40, canvas.height - 180, 120, 140);
  if (chickenImg.complete)
    ctx.drawImage(
      chickenImg,
      canvas.width - 160,
      canvas.height - 150,
      110,
      110,
    );
}

/**
 * Starts the game time if the function exists.
 */
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

/**
 * Clears all interval IDs in the global intervalIds array.
 */
function _clearAllIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

/**
 * Pauses or resumes the game depending on the current state.
 */
window.pauseGame = function () {
  const paused = window.gamePaused ? 0 : 1;
  window.gamePaused = paused;
  paused ? _pauseGame() : _resumeGame();
};

/**
 * Resumes the game by restarting intervals and hiding overlays.
 */
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

/**
 * Pauses the game, stops intervals, resets inputs, and shows overlay.
 */
function _pauseGame() {
  function _pauseGame() {
    window.gamePaused = 1;
    if (window.pauseGameTime) window.pauseGameTime();
    if (window.stopAllIntervals) window.stopAllIntervals();
    resetKeyboardInputs();
    showTacoTimeOverlay();
  }
}

/**
 * Shows the Taco Time overlay.
 */
function showTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  overlay.classList.remove("hide");
}

/**
 * Hides the Taco Time overlay with animation.
 */
function hideTacoTimeOverlay() {
  const overlay = document.getElementById("tacoTimeOverlay");
  if (!overlay) return;
  overlay.classList.add("hide");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 500);
}

/**
 * Resets all keyboard inputs to false.
 */
function resetKeyboardInputs() {
  if (window.keyboard) _resetAllKeys(window.keyboard);
}

/**
 * Sets all keyboard keys to false.
 * @param {Keyboard} kb - The keyboard object.
 */
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

/**
 * Controls all page audios, only plays visible, applies mute.
 * @param {string} visibleDivId - The id of the visible page div.
 */
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
