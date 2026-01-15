/**
 * Handles UI and overlay logic for the World class.
 * @param {World} world - The world instance.
 */
class WorldUI {
  constructor(world) {
    this.world = world;
  }

  /**
   * Draws all status bars.
   */
  drawStatusBars() {
    this.world.addToMap(this.world.healthBar);
    this.world.addToMap(this.world.bottleBar);
    this.world.addToMap(this.world.coinBar);
    const endboss = this.world.level?.enemies?.find(
      (e) => e instanceof Endboss
    );
    const shouldShowEndbossBar =
      (this.world.level?.level_end_x &&
        this.world.character.x > this.world.level.level_end_x - 1400) ||
      (endboss && endboss.isActivated);
    if (shouldShowEndbossBar) {
      this.world.addToMap(this.world.endbossBar);
    }
  }


  /**
   * Shows pause overlay.
   */
  showPause() {
    if (typeof window.showPauseOverlay === "function") {
      window.showPauseOverlay();
    }
  }
}

window.WorldUI = WorldUI;
