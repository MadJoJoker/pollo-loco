class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard = new Keyboard();
  camera_x = 0;
  healthBar = new StatusBar(120, 0, 100, 40, "health");
  bottleBar = new StatusBar(10, 0, 100, 40, "bottle");
  coinBar = new StatusBar(10, 30, 100, 40, "coin");
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.setWorld();
    this.initStatusBars();
    this.startGameLoops();
  }

  initStatusBars() {
    this.healthBar.setPercentage(100);
    this.bottleBar.setPercentage(0);
    this.coinBar.setPercentage(0);
  }

  startGameLoops() {
    setInterval(() => {
      this.updateCamera();
      this.draw();
    }, 1000 / 60);

    setInterval(() => {
      this.handleCollectibles();
      this.checkCharacterChickenCollision();
    }, 100);
  }

  handleCollectibles() {
    this.collectBottles();
    this.collectCoins();
  }

  collectBottles() {
    if (!this.level?.bottles) return;
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.level.bottles[i];
      if (this.isCollection(this.character, bottle)) {
        this.character.bottles += 1;
        this.level.bottles.splice(i, 1);
        this.bottleBar.setPercentage(this.character.bottles);
      }
    }
  }

  collectCoins() {
    if (!this.level?.coins) return;
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const coin = this.level.coins[i];
      if (this.isCollection(this.character, coin)) {
        this.character.coins += 1;
        this.level.coins.splice(i, 1);
        let percent = this.getCoinPercent();
        this.coinBar.setPercentage(percent);
      }
    }
  }

  getCoinPercent() {
    let totalCoins = Coin.getTotalCoins();
    let collectedCoins = this.character.coins;
    return totalCoins > 0
      ? Math.round((collectedCoins / totalCoins) * 100)
      : 0;
  }

  isCollection(character, collectible) {
    return this.isOffsetColliding(character, collectible);
  }

  checkCharacterChickenCollision() {
    if (!this.level?.enemies || !this.character) return;
    this.level.enemies.forEach((enemy) => {
      if (this.isEnemyType(enemy) && this.isOffsetColliding(this.character, enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  isEnemyType(enemy) {
    return (
      enemy instanceof Chicken ||
      enemy instanceof ChickenSmall ||
      enemy instanceof Endboss
    );
  }

  handleEnemyCollision(enemy) {
    this.character.isHurt();
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
  }

  isOffsetColliding(objA, objB) {
    const a = this.getObjectBounds(objA);
    const b = this.getObjectBounds(objB);
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  getObjectBounds(obj) {
    return {
      left: obj.x + (obj.offset?.left || 0),
      right: obj.x + obj.width - (obj.offset?.right || 0),
      top: obj.y + (obj.offset?.top || 0),
      bottom: obj.y + obj.height - (obj.offset?.bottom || 0),
    };
  }

  updateCamera() {
    const minCameraX = 0;
    const maxCameraX = 719 * 2;
    if (this.character && typeof this.character.x === "number") {
      let targetX = this.character.x - 120;
      this.camera_x = Math.max(minCameraX, Math.min(targetX, maxCameraX));
    }
  }

  setWorld() {
    this.character.world = this;
    if (this.level?.enemies) {
      this.level.enemies.forEach(enemy => {
        enemy.world = this;
      });
    }
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new Bottle(
        this.character.x + 100,
        this.character.y + 100,
        50,
        60,
        "throw"
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.drawLevelObjects();
    this.ctx.restore();
    this.drawStatusBars();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawLevelObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.character.throwBottles);
  }

  drawStatusBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (typeof mo.drawFrameOffset === "function") mo.drawFrameOffset(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
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
