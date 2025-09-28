/**
 * Represents the game world, managing the main character, level, canvas, status bars, effects, and game logic.
 */
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

  /**
   * Creates a new World instance and initializes the game canvas, context, keyboard, level, and game loops.
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering the game.
   * @param {Keyboard} keyboard - The keyboard input handler.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.level = typeof level1 !== "undefined" ? level1 : null;
    this.setWorld();
    this.initStatusBars();
    this.startGameLoops();
  }

  /**
   * Initializes the status bars for health, bottles, coins, and endboss.
   */
  initStatusBars() {
    this.healthBar.setPercentage(100);
    this.bottleBar.setPercentage(0);
    this.coinBar.setPercentage(0);
    this.endbossBar.setPercentage(100);
  }

  /**
   * Starts the main game loops for updating camera, effects, drawing, and handling collectibles and collisions.
   */
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

  /**
   * Adds a visual effect to the world.
   * @param {Object} effect - The effect object to add.
   */
  addEffect(effect) {
    this.effects.push(effect);
  }

  /**
   * Updates all effects and removes those that are done.
   */
  updateEffects() {
    this.effects = this.effects.filter((e) => {
      e.update();
      return !e.done;
    });
  }
  /**
   * Checks for collisions between thrown bottles and enemies.
   */
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

  /**
   * Handles collection of bottles, coins, and golden eggs by the character.
   */
  handleCollectibles() {
    this.collectBottles();
    this.collectCoins();
    this.collectGoldenEggs();
  }

  /**
   * Handles collection of golden eggs by the character.
   */
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

  /**
   * Handles collection of bottles by the character and updates the bottle bar.
   */
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
        this.bottleBar.setPercentage(percent, this.character.bottles);
      }
    }
  }

  /**
   * Handles collection of coins by the character and updates the coin bar.
   */
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

  /**
   * Calculates the percentage of collected coins.
   * @returns {number} The percentage of coins collected.
   */
  getCoinPercent() {
    let collectedCoins = this.character.coins;
    let totalCoins = collectedCoins + (this.level?.coins?.length || 0);
    return totalCoins > 0 ? Math.round((collectedCoins / totalCoins) * 100) : 0;
  }

  /**
   * Determines if the character is colliding with a collectible object.
   * @param {Character} character - The main character.
   * @param {Object} collectible - The collectible object.
   * @returns {boolean} True if colliding, otherwise false.
   */
  isCollection(character, collectible) {
    return this.isOffsetColliding(character, collectible);
  }

  /**
   * Checks for collisions between the character and chicken-type enemies.
   */
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
        } else if (
          typeof this.character.isAboveGround === "function" &&
          this.character.isAboveGround() &&
          enemy instanceof ChickenSmall &&
          typeof enemy.hitByJump === "function" &&
          !enemy.isDeadNow
        ) {
          enemy.hitByJump();
        } else {
          this.handleEnemyCollision(enemy);
        }
      }
    }
  }

  /**
   * Determines if an enemy is of a recognized type (Chicken, ChickenSmall, Endboss).
   * @param {Object} enemy - The enemy object.
   * @returns {boolean} True if enemy is a recognized type, otherwise false.
   */
  isEnemyType(enemy) {
    return (
      enemy instanceof Chicken ||
      enemy instanceof ChickenSmall ||
      enemy instanceof Endboss
    );
  }
  /**
   * Handles the logic when a bottle collides with an enemy.
   * @param {Object} bottle - The thrown bottle object.
   * @param {Object} enemy - The enemy object.
   */
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

  /**
   * Handles the logic when the character collides with an enemy.
   * @param {Object} enemy - The enemy object.
   */
  handleEnemyCollision(enemy) {
    if (enemy.isDeadNow) {
      return;
    }
    this.character.isHurt();
    this.character.hit();
    this.healthBar.setPercentage(this.character.energy);
  }

  /**
   * Checks for collision between two objects, considering their offset properties.
   * @param {Object} objA - The first object.
   * @param {Object} objB - The second object.
   * @returns {boolean} True if colliding, otherwise false.
   */
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

  /**
   * Calculates the bounding box of an object, considering its offset.
   * @param {Object} obj - The object to calculate bounds for.
   * @returns {Object} The bounding box with left, right, top, and bottom properties.
   */
  getObjectBounds(obj) {
    return {
      left: obj.x + (obj.offset?.left || 0),
      right: obj.x + obj.width - (obj.offset?.right || 0),
      top: obj.y + (obj.offset?.top || 0),
      bottom: obj.y + obj.height - (obj.offset?.bottom || 0),
    };
  }

  /**
   * Updates the camera position based on the character's position.
   */
  updateCamera() {
    const minCameraX = 0;
    const maxCameraX = 719 * 2;
    if (this.character && typeof this.character.x === "number") {
      let targetX = this.character.x - 120;
      this.camera_x = Math.max(minCameraX, Math.min(targetX, maxCameraX));
    }
  }

  /**
   * Sets the world reference for the character and all enemies in the level.
   */
  setWorld() {
    this.character.world = this;
    if (this.level?.enemies) {
      this.level.enemies.forEach((enemy) => {
        enemy.world = this;
      });
    }
  }

  /**
   * Starts a loop to check for collisions at regular intervals.
   */
  run() {
    window.setStoppableInterval(() => {
      this.checkCollisions();
    }, 200);
  }

  /**
   * Checks for collisions between the character and non-chicken enemies.
   */
  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken || enemy instanceof ChickenSmall) return;
      if (this.character.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /**
   * Draws the entire game world, including level objects, effects, and status bars.
   */
  draw() {
    this.clearCanvas();
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.drawLevelObjects();
    this.drawEffects();
    this.ctx.restore();
    this.drawStatusBars();
  }

  /**
   * Draws all visual effects on the canvas.
   */
  drawEffects() {
    this.effects.forEach((e) => e.draw(this.ctx));
  }

  /**
   * Clears the entire canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws all objects in the level, including background, clouds, enemies, collectibles, and the character.
   */
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

  /**
   * Draws all status bars (health, bottle, coin, endboss) on the canvas.
   */
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

  /**
   * Adds multiple objects to the map for rendering.
   * @param {Array} objects - The objects to add.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Adds a single object to the map for rendering, handling direction and drawing methods.
   * @param {Object} mo - The map object to add.
   */
  addToMap(mo) {
    if (!mo) return;
    if (mo.otherDirection) this.flipImage(mo);
    if (typeof mo.draw === "function") mo.draw(this.ctx);
    if (typeof mo.drawFrame === "function") mo.drawFrame(this.ctx);
    if (typeof mo.drawFrameOffset === "function") mo.drawFrameOffset(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Flips the image horizontally for objects facing the other direction.
   * @param {Object} mo - The map object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the image orientation after flipping.
   * @param {Object} mo - The map object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Restarts the character's gravity and animation intervals.
   */
  restartCharacterIntervals() {
    if (this.character) {
      this.character.applyGravity();
      this.character.animate();
    }
  }
}
