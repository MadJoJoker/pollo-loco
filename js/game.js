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
  if (e.keyCode === 37) keyboard.LEFT = true;  // Pfeil links
  if (e.keyCode === 38) keyboard.UP = true;    // Pfeil oben
  if (e.keyCode === 40) keyboard.DOWN = true;  // Pfeil unten
  if (e.keyCode === 32) keyboard.SPACE = true; // Leertaste
  if (e.keyCode === 68) keyboard.D = true;     // D
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

// let intervalIds = [];

// function setStoppableInterval(fn, time) {
//   let id = setInterval(fn, time);
//   intervalIds.push(id);
//   return id;
// }

// let i = 1;
// function sayHello() {
//   console.log('Hallo', i);
//   i++;
// }
// function sayGoodbye() {
//   console.log('Tschüss', i);
//   i++;
// }

// let interval = setStoppableInterval(sayHello, 11500);
// let interval2 = setStoppableInterval(sayGoodbye, 11500);

// console.log('ID vom Interval ist', interval);

// function stopGame() {
//   intervalIds.forEach(clearInterval);
// }
// document.getElementById('pauseButton').addEventListener('click', stopGame);
