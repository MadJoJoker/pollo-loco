/**
 * Visual effect for the endboss (e.g., a POW effect).
 * Handles fading and drawing the effect on the canvas.
 */
class EndbossEffect {
  /**
   * Creates a new EndbossEffect instance.
   * @param {number} x - The x position of the effect.
   * @param {number} y - The y position of the effect.
   * @param {number} width - The width of the effect.
   * @param {number} height - The height of the effect.
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = "/assets/img/added-img/pow.png";
    this.opacity = 1;
    this.fadeSpeed = 0.03;
    this.done = false;
  }

  /**
   * Updates the effect's opacity and marks it as done when fully faded.
   */
  update() {
    if (this.opacity > 0) {
      this.opacity -= this.fadeSpeed;
    } else {
      this.done = true;
    }
  }

  /**
   * Draws the effect on the canvas with current opacity.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.done) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

window.EndbossEffect = EndbossEffect;
