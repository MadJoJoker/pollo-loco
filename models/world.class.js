class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard = new Keyboard();
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    console.log("[DEBUG] World erstellt:", this);
    this.setWorld();
    this.checkCollisions();
    setInterval(() => {
      this.updateCamera();
      this.draw();
    }, 1600); // 60 FPS
  }
  updateCamera() {
    if (this.character && typeof this.character.x === "number") {
      this.camera_x = Math.max(0, this.character.x - 120);
    }
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    console.log("draw() called");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
    console.log("backgroundObjects:", this.level.backgroundObjects);
    this.addObjectsToMap(this.level.backgroundObjects);
    console.log("statusBar:", this.statusBar);
    this.addToMap(this.statusBar);
    this.ctx.translate(this.camera_x, 0);

    console.log("character:", this.character);
    this.addToMap(this.character);
    console.log("clouds:", this.level.clouds);
    this.addObjectsToMap(this.level.clouds);
    console.log("enemies:", this.level.enemies);
    this.addObjectsToMap(this.level.enemies);
    this.ctx.translate(-this.camera_x, 0);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack();
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
