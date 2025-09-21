class World {
  character = new Character();
  level;
  canvas;
  ctx;
  keyboard = new Keyboard();
  camera_x = 0;
  healthBar = new StatusBar(120, 0, 100, 40, "health");
  bottleBar = new StatusBar(10, 0, 100, 40, "bottle");
  coinBar = new StatusBar(10, 30, 100, 40, "coin");
  endbossBar = new StatusBar(600, 0, 100, 40, "endboss");

  effects = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = typeof level1 !== "undefined" ? level1 : null;
    this.setWorld();
    this.initStatusBars();
    this.startGameLoops();
  }

  initStatusBars() {
    this.healthBar.setPercentage(100);
    this.bottleBar.setPercentage(0);
    this.coinBar.setPercentage(0);
    this.endbossBar.setPercentage(100);
  }

  startGameLoops() {
    window.setStoppableInterval(() => {
      this.updateCamera();
      this.updateEffects();
      this.draw();
    }, 1000 / 60);

    window.setStoppableInterval(() => {
      this.handleCollectibles();
      this.checkCharacterChickenCollision();
      this.checkBottleEnemyCollision();
    }, 100);
  }

  addEffect(effect) {
    this.effects.push(effect);
  }

  updateEffects() {
    this.effects = this.effects.filter((e) => {
      e.update();
      return !e.done;
    });
  }
  checkBottleEnemyCollision() {
    if (!this.character?.throwBottles || !this.level?.enemies) return;
    this.character.throwBottles.forEach((bottle) => {
      if (
        !bottle ||
        typeof bottle.x !== "number" ||
        typeof bottle.y !== "number" ||
        typeof bottle.width !== "number" ||
        typeof bottle.height !== "number"
      ) {
        return;
      }
      this.level.enemies.forEach((enemy) => {
        if (
          !enemy ||
          typeof enemy.x !== "number" ||
          typeof enemy.y !== "number" ||
          typeof enemy.width !== "number" ||
          typeof enemy.height !== "number"
        ) {
          return;
        }
        if (this.isEnemyType(enemy) && this.isOffsetColliding(bottle, enemy)) {
          this.handleBottleEnemyCollision(bottle, enemy);
        }
      });
    });
  }

  handleCollectibles() {
    this.collectBottles();
    this.collectCoins();
    this.collectGoldenEggs();
  }

  collectGoldenEggs() {
    if (!this.level?.goldenEggs) return;
    for (let i = this.level.goldenEggs.length - 1; i >= 0; i--) {
      const egg = this.level.goldenEggs[i];
      if (this.isCollection(this.character, egg) && !egg.collected) {
        egg.collect(this.character);
        this.level.goldenEggs.splice(i, 1);
      }
    }
  }

  collectBottles() {
    if (!this.level?.bottles) return;
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.level.bottles[i];
      if (this.isCollection(this.character, bottle)) {
        this.character.bottles += 1;
        this.level.bottles.splice(i, 1);
        let percent = Math.min(
          100,
          Math.round((this.character.bottles / 10) * 100)
        );
        this.bottleBar.setPercentage(percent);
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
    let collectedCoins = this.character.coins;
    let totalCoins = collectedCoins + (this.level?.coins?.length || 0);
    return totalCoins > 0 ? Math.round((collectedCoins / totalCoins) * 100) : 0;
  }

  isCollection(character, collectible) {
    return this.isOffsetColliding(character, collectible);
  }

  checkCharacterChickenCollision() {
    if (!this.level?.enemies || !this.character) return;
    for (let enemy of this.level.enemies) {
      if (
        this.isEnemyType(enemy) &&
        this.isOffsetColliding(this.character, enemy)
      ) {
        if (
          typeof this.character.isAboveGround === "function" &&
          this.character.isAboveGround() &&
          enemy instanceof Chicken &&
          typeof enemy.hitByJump === "function" &&
          !enemy.isDeadNow
        ) {
          enemy.hitByJump();
          break;
        } else if (
          typeof this.character.isAboveGround === "function" &&
          this.character.isAboveGround() &&
          enemy instanceof ChickenSmall &&
          typeof enemy.hitByJump === "function" &&
          !enemy.isDeadNow
        ) {
          enemy.hitByJump();
          break;
        }
        this.handleEnemyCollision(enemy);
        break;
      }
    }
  }

  isEnemyType(enemy) {
    return (
      enemy instanceof Chicken ||
      enemy instanceof ChickenSmall ||
      enemy instanceof Endboss
    );
  }
  handleBottleEnemyCollision(bottle, enemy) {
    if (!enemy.isHurt && !enemy.isDeadNow) {
      if (typeof enemy.hitByBottle === "function") {
        enemy.hitByBottle(bottle);
      }
      if (typeof bottle.showSplash === "function") {
        bottle.showSplash();
      }
    }
  }

  handleEnemyCollision(enemy) {
    if (enemy.isDeadNow) {
      return;
    }
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
      this.level.enemies.forEach((enemy) => {
        enemy.world = this;
      });
    }
  }

  run() {
    window.setStoppableInterval(() => {
      this.checkCollisions();
    }, 200);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) return;
      if (this.character.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.drawLevelObjects();
    this.drawEffects();
    this.ctx.restore();
    this.drawStatusBars();
  }

  drawEffects() {
    this.effects.forEach((e) => e.draw(this.ctx));
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
    if (this.level.goldenEggs) this.addObjectsToMap(this.level.goldenEggs);
    this.addToMap(this.character);
    this.addObjectsToMap(this.character.throwBottles);
  }

  drawStatusBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    if (
      this.level &&
      this.level.level_end_x &&
      this.character.x > this.level.level_end_x - 900
    ) {
      this.addToMap(this.endbossBar);
    }
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    if (typeof mo.draw === "function") mo.draw(this.ctx);
    if (typeof mo.drawFrame === "function") mo.drawFrame(this.ctx);
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

  restartCharacterIntervals() {
    if (this.character) {
      this.character.applyGravity();
      this.character.animate();
    }
  }
}
