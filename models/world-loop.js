/**
 * Handles game loop and update logic for the World class.
 * @param {World} world - The world instance.
 */
class WorldLoop {
  constructor(world) {
    this.world = world;
  }

  /**
   * Starts main game loops.
   */
  startGameLoops() {
    window.setStoppableInterval(() => {
      this.world.updateCamera();
      this.world.updateEffects();
      this.world.draw();
    }, 1000 / 60);

    window.setStoppableInterval(() => {
      this.world.handleCollectibles();
      this.world.collision.checkCharacterChickenCollision();
      this.world.collision.checkBottleEnemyCollision();
    }, 50);
  }

  /**
   * (Re)starts interval-based loops after pause.
   */
  startIntervals() {
    this.startGameLoops();
    this.run();
  }

  /**
   * Starts collision check loop.
   */
  run() {
    window.setStoppableInterval(() => {
      this.world.checkCollisions();
    }, 200);
  }
}

window.WorldLoop = WorldLoop;
