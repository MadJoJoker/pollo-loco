/**
 * Handles action logic for the Character class (jump, throw, cooldown, etc).
 * @param {Character} character - The character instance.
 */
class CharacterActions {
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles jump action.
   * @returns {boolean}
   */
  handleJump() {
    if (
      this.character.world?.keyboard?.SPACE &&
      !this.character.isAboveGround()
    ) {
      this.character.jump();
      return true;
    }
    return false;
  }

  /**
   * Handles bottle throwing.
   * @param {boolean} canThrowBottle
   * @returns {boolean}
   */
  handleThrow(canThrowBottle) {
    if (this.canThrowBottle(canThrowBottle)) {
      this.throwBottle();
      this.updateBottleBar();
      this.setThrowCooldown();
      canThrowBottle = false;
      return true;
    }
    return false;
  }

  /**
   * Checks if bottle can be thrown.
   * @param {boolean} canThrowBottle
   * @returns {boolean}
   */
  canThrowBottle(canThrowBottle) {
    return (
      this.character.world?.keyboard?.D &&
      canThrowBottle &&
      this.character.bottles > 0 &&
      !this.character.throwCooldown
    );
  }

  /**
   * Creates and throws bottle.
   */
  throwBottle() {
    const bottleX = this.character.otherDirection
      ? this.character.x + this.character.offset.left
      : this.character.x + this.character.width - this.character.offset.right;
    const bottleY = this.character.y + this.character.height / 2;
    const bottle = new ThrowableObject(
      bottleX,
      bottleY,
      this.character.otherDirection
    );
    bottle.world = this.character.world;
    bottle.throw();
    if (this.character.throwBottles) this.character.throwBottles.push(bottle);
    this.character.bottles -= 1;
  }

  /**
   * Updates bottle bar UI.
   */
  updateBottleBar() {
    if (this.character.world?.bottleBar) {
      let percent = this.character.world.getBottlePercent();
      this.character.world.bottleBar.setPercentage(
        percent,
        this.character.bottles
      );
    }
  }

  /**
   * Sets throw cooldown.
   */
  setThrowCooldown() {
    this.character.throwCooldown = true;
    const target = window.getGameTime() + 1200;
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= target) {
        this.character.throwCooldown = false;
        unregister();
      }
    });
  }
}

window.CharacterActions = CharacterActions;
