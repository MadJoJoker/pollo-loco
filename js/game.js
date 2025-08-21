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
  }
  if (e.keyCode === 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode === 38) {
    keyboard.UP = true;
  }
  if (e.keyCode === 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode === 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode === 68) {
    keyboard.SPACE = true;
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
