/**
 * Handles animation and status logic for the Endboss class.
 * @param {Endboss} endboss - The endboss instance.
 */
class EndbossAnimation {
  constructor(endboss) {
    this.endboss = endboss;
  }

  /**
   * Updates animation state.
   */
  updateAnimation() {
    // Animation logic for endboss (idle, hurt, dead, attack)
    // Example: switch images based on state
    if (this.endboss.isDeadNow) {
      this.endboss.img = this.endboss.IMAGES_DEAD[0];
    } else if (this.endboss.isHurt) {
      this.endboss.img = this.endboss.IMAGES_HURT[0];
    } else if (this.endboss.isAttacking) {
      this.endboss.img = this.endboss.IMAGES_ATTACK[0];
    } else {
      this.endboss.img = this.endboss.IMAGES_IDLE[0];
    }
  }
}

window.EndbossAnimation = EndbossAnimation;
