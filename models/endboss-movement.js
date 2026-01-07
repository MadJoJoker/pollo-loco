/**
 * Handles movement and AI logic for the Endboss class.
 * @param {Endboss} endboss - The endboss instance.
 */
class EndbossMovement {
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Updates movement and AI.
   */
  updateMovement() {
    // Example: move towards player, attack if close
    if (this.endboss.isActivated) {
      if (this.endboss.x > this.endboss.targetX) {
        this.endboss.x -= this.endboss.speed;
      } else if (this.endboss.x < this.endboss.targetX) {
        this.endboss.x += this.endboss.speed;
      }
    }
  }
}

window.EndbossMovement = EndbossMovement;
