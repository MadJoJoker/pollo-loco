/**
 * Handles collision logic for the World class.
 * @param {World} world - The world instance.
 */
class WorldCollision {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks collisions between thrown bottles and enemies.
   */
  checkBottleEnemyCollision() {
    if (!this.world.character?.throwBottles || !this.world.level?.enemies)
      return;
    this.world.character.throwBottles.forEach((bottle) => {
      if (!this.isValidObject(bottle)) return;
      this.world.level.enemies.forEach((enemy) => {
        if (!this.isValidObject(enemy)) return;
        if (this.isEnemyType(enemy) && this.isOffsetColliding(bottle, enemy)) {
          this.handleBottleEnemyCollision(bottle, enemy);
        }
      });
    });
  }

  /**
   * Validates if object has required numeric properties.
   * @param {Object} obj - Object to validate.
   * @returns {boolean}
   */
  isValidObject(obj) {
    return (
      obj &&
      typeof obj.x === "number" &&
      typeof obj.y === "number" &&
      typeof obj.width === "number" &&
      typeof obj.height === "number"
    );
  }

  /**
   * Checks collisions between character and chicken enemies.
   */
  checkCharacterChickenCollision() {
    if (!this.world.level?.enemies || !this.world.character) return;
    for (let enemy of this.world.level.enemies) {
      if (
        this.isEnemyType(enemy) &&
        this.isOffsetColliding(this.world.character, enemy)
      ) {
        if (this.isJumpHit(enemy)) {
          enemy.hitByJump();
          this.world.character.lastJumpHitTime = window.getGameTime();
        } else {
          this.handleEnemyCollision(enemy);
        }
      }
    }
  }

  /**
   * Checks if enemy is recognized type.
   * @param {Object} enemy - Enemy object.
   * @returns {boolean}
   */
  isEnemyType(enemy) {
    return (
      enemy instanceof Chicken ||
      enemy instanceof ChickenSmall ||
      enemy instanceof Endboss
    );
  }

  /**
   * Checks if character hits enemy by jumping from above.
   * @param {Object} enemy - Enemy object.
   * @returns {boolean}
   */
  isJumpHit(enemy) {
    const isFalling = this.world.character.speedY < 0;
    const characterBottom =
      this.world.character.y + this.world.character.height;
    const enemyTop = enemy.y;
    const isComingFromAbove = characterBottom < enemyTop + enemy.height * 0.6;
    const basicHitConditions =
      typeof this.world.character.isAboveGround === "function" &&
      this.world.character.isAboveGround() &&
      isFalling &&
      isComingFromAbove &&
      typeof enemy.hitByJump === "function" &&
      !enemy.isDeadNow;
    if (enemy instanceof Endboss) {
      const cooldownActive =
        enemy.lastJumpHitTime &&
        window.getGameTime() - enemy.lastJumpHitTime < 1000;
      return basicHitConditions && !cooldownActive;
    }
    return basicHitConditions;
  }

  /**
   * Handles bottle-enemy collision.
   * @param {Object} bottle - Bottle object.
   * @param {Object} enemy - Enemy object.
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
   * Handles character-enemy collision.
   * @param {Object} enemy - Enemy object.
   */
  handleEnemyCollision(enemy) {
    if (enemy.isDeadNow) return;
    const currentTime = window.getGameTime();
    const enemyHitCooldown = 1000;
    const canTakeDamage =
      currentTime - this.world.character.lastEnemyHitTime > enemyHitCooldown;
    if (!canTakeDamage) return;
    this.world.character.isHurt();
    this.world.character.hit();
    this.world.character.lastEnemyHitTime = currentTime;
    this.world.healthBar.setPercentage(this.world.character.energy);
  }

  /**
   * Checks collision between two objects with offset.
   * @param {Object} objA - First object.
   * @param {Object} objB - Second object.
   * @returns {boolean}
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
   * Calculates object bounding box with offset.
   * @param {Object} obj - Object to get bounds for.
   * @returns {Object}
   */
  getObjectBounds(obj) {
    return {
      left: obj.x + (obj.offset?.left || 0),
      right: obj.x + obj.width - (obj.offset?.right || 0),
      top: obj.y + (obj.offset?.top || 0),
      bottom: obj.y + obj.height - (obj.offset?.bottom || 0),
    };
  }
}

window.WorldCollision = WorldCollision;
