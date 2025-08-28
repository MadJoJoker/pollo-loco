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
  if (e.keyCode === 39) {
    // Pfeil rechts
    keyboard.RIGHT = true;
  }
  if (e.keyCode === 37) {
    // Pfeil links
    keyboard.LEFT = true;
  }
  if (e.keyCode === 38) {
    // Pfeil oben
    keyboard.UP = true;
  }
  if (e.keyCode === 40) {
    // Pfeil unten
    keyboard.DOWN = true;
  }
  if (e.keyCode === 32) {
    // Leertaste
    keyboard.SPACE = true;
  }
  if (e.keyCode === 68) {
    // D
    keyboard.D = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (e.keyCode === 39) {
    // Pfeil rechts
    keyboard.RIGHT = false;
  }
  if (e.keyCode === 37) {
    // Pfeil links
    keyboard.LEFT = false;
  }
  if (e.keyCode === 38) {
    // Pfeil oben
    keyboard.UP = false;
  }
  if (e.keyCode === 40) {
    // Pfeil unten
    keyboard.DOWN = false;
  }
  if (e.keyCode === 32) {
    // Leertaste
    keyboard.SPACE = false;
  }
  if (e.keyCode === 68) {
    // D
    keyboard.D = false;
  }
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
