/**
 * Handles level and object management for the World class.
 * @param {World} world - The world instance.
 */
class WorldLevel {
  constructor(world) {
    this.world = world;
  }

  /**
   * Initializes the level and sets up objects.
   * @param {Object} level - The level data.
   */
  initLevel(level) {
    this.world.level = level;
    this.world.setWorld();
    this.world.initStatusBars();
  }

  /**
   * Resets the level to its initial state.
   */
  resetLevel() {
    if (typeof level1 !== "undefined") {
      this.initLevel(level1);
    }
  }

  /**
   * Checks if the level is finished.
   * @returns {boolean}
   */
  isLevelFinished() {
    return this.world.character.x >= this.world.level.level_end_x;
  }

  /**
   * Updates all objects in the level.
   */
  updateObjects() {
    if (!this.world.level) return;
    if (this.world.level.enemies) {
      this.world.level.enemies.forEach(
        (enemy) => enemy.update && enemy.update()
      );
    }
    if (this.world.level.coins) {
      this.world.level.coins.forEach((coin) => coin.update && coin.update());
    }
    if (this.world.level.bottles) {
      this.world.level.bottles.forEach(
        (bottle) => bottle.update && bottle.update()
      );
    }
    if (this.world.level.goldenEggs) {
      this.world.level.goldenEggs.forEach((egg) => egg.update && egg.update());
    }
  }
}

window.WorldLevel = WorldLevel;
