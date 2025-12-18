/** Game world managing character, level, canvas, status bars, effects, and game logic. */
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
  maxBottles = 0;
  maxCoins = 0;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = typeof level1 !== "undefined" ? level1 : null;
    this.setWorld();
    this.initStatusBars();
    this.startGameLoops();
  }

  /** Initializes status bars. */
  initStatusBars() {
    this.maxBottles = this.level?.bottles?.length || 0;
    this.maxCoins = this.level?.coins?.length || 0;
    this.healthBar.setPercentage(100);
    this.bottleBar.setPercentage(0);
    this.coinBar.setPercentage(0);
    this.endbossBar.setPercentage(100);
  }

  /** Starts main game loops. */
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

  /** (Re)starts interval-based loops after pause. */
  startIntervals() {
    this.startGameLoops();
    try {
      this.run();
    } catch (e) {}
  }

  /** Adds visual effect. */
  addEffect(effect) {
    this.effects.push(effect);
  }

  /** Updates effects and removes finished ones. */
  updateEffects() {
    this.effects = this.effects.filter((e) => {
      e.update();
      return !e.done;
    });
  }
  /** Checks collisions between thrown bottles and enemies. */
  checkBottleEnemyCollision() {
    if (!this.character?.throwBottles || !this.level?.enemies) return;
    this.character.throwBottles.forEach((bottle) => {
      if (!this.isValidObject(bottle)) return;
      this.level.enemies.forEach((enemy) => {
        if (!this.isValidObject(enemy)) return;
        if (this.isEnemyType(enemy) && this.isOffsetColliding(bottle, enemy)) {
          this.handleBottleEnemyCollision(bottle, enemy);
        }
      });
    });
  }

  /** Validates if object has required numeric properties. */
  isValidObject(obj) {
    return (
      obj &&
      typeof obj.x === "number" &&
      typeof obj.y === "number" &&
      typeof obj.width === "number" &&
      typeof obj.height === "number"
    );
  }

  /** Handles collection of bottles, coins, and golden eggs. */
  handleCollectibles() {
    this.collectBottles();
    this.collectCoins();
    this.collectGoldenEggs();
  }

  /** Collects golden eggs. */
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

  /** Collects bottles and updates bottle bar. */
  collectBottles() {
    if (!this.level?.bottles) return;
    for (let i = this.level.bottles.length - 1; i >= 0; i--) {
      const bottle = this.level.bottles[i];
      if (this.isCollection(this.character, bottle)) {
        this.character.bottles += 1;
        this.level.bottles.splice(i, 1);
        let percent = this.getBottlePercent();
        this.bottleBar.setPercentage(percent, this.character.bottles);
      }
    }
  }

  /** Calculates percentage of collected bottles. */
  getBottlePercent() {
    let collectedBottles = this.character.bottles;
    return this.maxBottles > 0
      ? Math.round((collectedBottles / this.maxBottles) * 100)
      : 0;
  }

  /** Collects coins and updates coin bar. */
  collectCoins() {
    if (!this.level?.coins) return;
    for (let i = this.level.coins.length - 1; i >= 0; i--) {
      const coin = this.level.coins[i];
      if (this.isCollection(this.character, coin)) {
        this.character.coins += 1;
        this.level.coins.splice(i, 1);
        let percent = this.getCoinPercent();
        this.coinBar.setPercentage(percent, this.character.coins);
      }
    }
  }

  /** Calculates percentage of collected coins. */
  getCoinPercent() {
    let collectedCoins = this.character.coins;
    return this.maxCoins > 0
      ? Math.round((collectedCoins / this.maxCoins) * 100)
      : 0;
  }

  /** Checks if character is colliding with collectible. */
  isCollection(character, collectible) {
    return this.isOffsetColliding(character, collectible);
  }

  /** Checks collisions between character and chicken enemies. */
  checkCharacterChickenCollision() {
    if (!this.level?.enemies || !this.character) return;
    for (let enemy of this.level.enemies) {
      if (
        this.isEnemyType(enemy) &&
        this.isOffsetColliding(this.character, enemy)
      ) {
        if (this.isJumpHit(enemy)) {
          enemy.hitByJump();
          this.character.lastJumpHitTime = window.getGameTime();
        } else {
          this.handleEnemyCollision(enemy);
        }
      }
    }
  }

  /** Checks if enemy is recognized type (Chicken, ChickenSmall, Endboss). */
  isEnemyType(enemy) {
    return (
      enemy instanceof Chicken ||
      enemy instanceof ChickenSmall ||
      enemy instanceof Endboss
    );
  }

  /** Checks if character hits enemy by jumping from above. */
  isJumpHit(enemy) {
    const isFalling = this.character.speedY < 0;
    const characterBottom = this.character.y + this.character.height;
    const enemyTop = enemy.y;
    const isComingFromAbove = characterBottom < enemyTop + enemy.height * 0.6;

    return (
      typeof this.character.isAboveGround === "function" &&
      this.character.isAboveGround() &&
      isFalling &&
      isComingFromAbove &&
      typeof enemy.hitByJump === "function" &&
      !enemy.isDeadNow
    );
  }

  /** Handles bottle-enemy collision. */
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

  /** Handles character-enemy collision. */
  handleEnemyCollision(enemy) {
    if (enemy.isDeadNow) return;

    const currentTime = window.getGameTime();
    const enemyHitCooldown = 1000;
    const canTakeDamage =
      currentTime - this.character.lastEnemyHitTime > enemyHitCooldown;

    if (!canTakeDamage) return;

    this.character.isHurt();
    this.character.hit();
    this.character.lastEnemyHitTime = currentTime;
    this.healthBar.setPercentage(this.character.energy);
  }

  /** Checks collision between two objects with offset. */
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

  /** Calculates object bounding box with offset. */
  getObjectBounds(obj) {
    return {
      left: obj.x + (obj.offset?.left || 0),
      right: obj.x + obj.width - (obj.offset?.right || 0),
      top: obj.y + (obj.offset?.top || 0),
      bottom: obj.y + obj.height - (obj.offset?.bottom || 0),
    };
  }

  /** Updates camera position based on character. */
  updateCamera() {
    const minCameraX = 0;
    const maxCameraX = 719 * 5;
    if (this.character && typeof this.character.x === "number") {
      let targetX = this.character.x - 120;
      this.camera_x = Math.max(minCameraX, Math.min(targetX, maxCameraX));
    }
  }

  /** Sets world reference for character and enemies. */
  setWorld() {
    this.character.world = this;
    if (this.level?.enemies) {
      this.level.enemies.forEach((enemy) => {
        enemy.world = this;
      });
    }
  }

  /** Starts collision check loop. */
  run() {
    window.setStoppableInterval(() => {
      this.checkCollisions();
    }, 200);
  }

  /** Checks collisions with non-chicken enemies. */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) return;
      if (this.character.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /** Draws entire game world. */
  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.drawLevelObjects();
    this.drawEffects();
    this.ctx.restore();
    this.drawStatusBars();
  }

  /** Draws visual effects. */
  drawEffects() {
    this.effects.forEach((e) => e.draw(this.ctx));
  }

  /** Clears canvas. */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /** Draws all level objects. */
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

  /** Draws status bars. */
  drawStatusBars() {
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);

    // Show endboss healthbar when activated or character in range
    const endboss = this.level?.enemies?.find((e) => e instanceof Endboss);
    const shouldShowEndbossBar =
      (this.level?.level_end_x &&
        this.character.x > this.level.level_end_x - 1400) ||
      (endboss && endboss.isActivated);

    if (shouldShowEndbossBar) {
      this.addToMap(this.endbossBar);
    }
  }

  /** Adds multiple objects to map. */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /** Adds single object to map. */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    if (typeof mo.draw === "function") mo.draw(this.ctx);
    if (typeof mo.drawFrame === "function") mo.drawFrame(this.ctx);
    if (typeof mo.drawFrameOffset === "function") mo.drawFrameOffset(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Flips image horizontally. */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /** Restores image orientation. */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /** Restarts character intervals. */
  restartCharacterIntervals() {
    if (this.character) {
      this.character.applyGravity();
      this.character.animate();
    }
  }
}
