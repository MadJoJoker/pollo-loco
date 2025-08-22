let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) {
    keyboard.RIGHT = true;
    console.log("Taste gedrückt: Rechts (39)");
  }
  if (e.keyCode === 37) {
    keyboard.LEFT = true;
    console.log("Taste gedrückt: Links (37)");
  }
  if (e.keyCode === 38) {
    keyboard.UP = true;
    console.log("Taste gedrückt: Hoch (38)");
  }
  if (e.keyCode === 40) {
    keyboard.DOWN = true;
    console.log("Taste gedrückt: Runter (40)");
  }
  if (e.keyCode === 32) {
    keyboard.SPACE = true;
    console.log("Taste gedrückt: Space (32)");
  }
  if (e.keyCode === 68) {
    keyboard.SPACE = true;
    console.log("Taste gedrückt: D (68)");
  }
});
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) {
    keyboard.RIGHT = false;
    console.log("Taste losgelassen: Rechts (39)");
  }
  if (e.keyCode === 37) {
    keyboard.LEFT = false;
    console.log("Taste losgelassen: Links (37)");
  }
  if (e.keyCode === 38) {
    keyboard.UP = false;
    console.log("Taste losgelassen: Hoch (38)");
  }
  if (e.keyCode === 40) {
    keyboard.DOWN = false;
    console.log("Taste losgelassen: Runter (40)");
  }
  if (e.keyCode === 32) {
    keyboard.SPACE = false;
    console.log("Taste losgelassen: Space (32)");
  }
  if (e.keyCode === 68) {
    keyboard.SPACE = false;
    console.log("Taste losgelassen: D (68)");
  }
});
// let intervalIds = [];

// function setStoppableInterval(fn, time) {
//   let id = setInterval(fn, time);
//   intervalIds.push(id);
// }

// let interval = setInterval(sayHello, 500);
// let interval2 = setInterval(sayGoodbye, 500);
// intervalIds.push(interval);
// intervalIds.push(interval2);

// console.log('ID vom Interval ist', interval);

// function stopGame() {
//   // // Intervalle beenden
//   // for (let i = 0; i < intervalIds.length; i++) {
//   //   const id = intervalIds[i];
//   //   clearInterval(id);
//   // }
//   intervalIds.forEach(clearInterval);
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
