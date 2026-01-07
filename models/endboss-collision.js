/**
 * Handles collision logic for the Endboss class.
 * @param {Endboss} endboss - The endboss instance.
 */
class EndbossCollision {
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Checks collision with player or objects.
   */
  checkCollisions(player, objects) {
    // Example: check collision with player and bottles
    objects.forEach((obj) => {
      if (this.isColliding(obj)) {
        this.handleCollision(obj);
      }
    });
    if (this.isColliding(player)) {
      this.handlePlayerCollision(player);
    }
  }

  /**
   * Checks if colliding with object.
   * @param {Object} obj
   * @returns {boolean}
   */
  isColliding(obj) {
    // Simple bounding box collision
    return (
      this.endboss.x < obj.x + obj.width &&
      this.endboss.x + this.endboss.width > obj.x &&
      this.endboss.y < obj.y + obj.height &&
      this.endboss.y + this.endboss.height > obj.y
    );
  }

  /**
   * Handles collision with object.
   * @param {Object} obj
   */
  handleCollision(obj) {
    // Example: take damage from bottle
    if (obj.type === "bottle") {
      this.endboss.energy -= obj.damage;
    }
  }

  /**
   * Handles collision with player.
   * @param {Object} player
   */
  handlePlayerCollision(player) {
    // Example: damage player
    player.energy -= this.endboss.damage;
  }
}

window.EndbossCollision = EndbossCollision;
