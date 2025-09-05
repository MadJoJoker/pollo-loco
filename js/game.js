let canvas;
let world;
window.keyboard = new Keyboard();

document.addEventListener("contextmenu", function (e) {
  //Kontextmenü
  e.preventDefault();
});

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) keyboard.RIGHT = true; // Pfeil rechts
  if (e.keyCode === 37) keyboard.LEFT = true; // Pfeil links
  if (e.keyCode === 38) keyboard.UP = true; // Pfeil oben
  if (e.keyCode === 40) keyboard.DOWN = true; // Pfeil unten
  if (e.keyCode === 32) keyboard.SPACE = true; // Leertaste
  if (e.keyCode === 68) keyboard.D = true; // D
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
window.setStoppableInterval = function (fn, time) {
  let id = setInterval(fn, time);
  window.intervalIds.push(id);
  return id;
};

function stopAllIntervals() {
  intervalIds.forEach(clearInterval);
  intervalIds = [];
}

function pauseGame() {
  stopAllIntervals();
  // Optional: Overlay oder Pause-Logik
}

function playGame() {
  // Intervalle neu starten, z.B. world.startIntervals() falls vorhanden
  if (world && typeof world.startIntervals === "function") {
    world.startIntervals();
  }
}

function stopGame() {
  stopAllIntervals();
  // Optional: Game Over/Charakter Tod Logik
}

const pauseButton = document.getElementById("pauseButton");
const playButton = document.getElementById("playButton");
if (pauseButton) pauseButton.addEventListener("click", pauseGame);
if (playButton) playButton.addEventListener("click", playGame);
