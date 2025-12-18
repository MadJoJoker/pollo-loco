/**
 * Represents a status bar (health, bottles, coins, endboss) in the game UI.
 * Handles image selection, drawing, and percentage updates.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  actualBottles = null;
  x = 20;
  y = 20;
  width = 150;
  height = 50;
  percentage = 40;
  imageCache_BOTTLES = [];
  imageCache_COINS = [];

  IMAGES_HEALTH = [
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];
  IMAGES_BOTTLES = [
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];
  IMAGES_COINS = [
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];
  IMAGES_ENDBOSS = [
    "/assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "/assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "/assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "/assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "/assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "/assets/img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];
  /**
   * Creates a new StatusBar instance.
   * @param {number} [x=20] - The x position of the status bar.
   * @param {number} [y=0] - The y position of the status bar.
   * @param {number} [width=150] - The width of the status bar.
   * @param {number} [height=50] - The height of the status bar.
   * @param {string} [type="health"] - The type of status bar (health, bottle, coin, endboss).
   */
  constructor(x = 20, y = 0, width = 150, height = 50, type = "health") {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.setTypeImages(type);
    this.loadImages(this.IMAGES_USED);
    this.loadImage(this.IMAGES_USED[5]);
  }

  /**
   * Sets the image set to use based on the status bar type.
   * @param {string} type - The type of status bar.
   */
  setTypeImages(type) {
    if (type === "health") this.IMAGES_USED = this.IMAGES_HEALTH;
    if (type === "bottle") this.IMAGES_USED = this.IMAGES_BOTTLES;
    if (type === "coin") this.IMAGES_USED = this.IMAGES_COINS;
    if (type === "endboss") this.IMAGES_USED = this.IMAGES_ENDBOSS;
  }

  /**
   * Sets the percentage value and updates the displayed image.
   * @param {number} percentage - The percentage to display.
   */
  setPercentage(percentage) {
    if (arguments.length > 1) {
      if (this.IMAGES_USED === this.IMAGES_BOTTLES) {
        this.actualBottles = arguments[1];
      }
      if (this.IMAGES_USED === this.IMAGES_COINS) {
        this.actualCoins = arguments[1];
      }
    }
    this.percentage = percentage;
    let path = this.IMAGES_USED[this.resolveImageIndex()];
    this.loadImage(path);
  }

  /**
   * Draws the status bar and its text on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.font = "24px 'GringoNights', Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    this.drawText(ctx);
  }

  /**
   * Draws the text (percentage or label) on the status bar.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawText(ctx) {
    const textX = this.x + this.width - 10;
    const textY = this.y + this.height / 2 + 8;

    if (this.IMAGES_USED === this.IMAGES_HEALTH) {
      ctx.fillText(`${this.percentage}%`, textX, textY);
    }
    if (this.IMAGES_USED === this.IMAGES_BOTTLES) {
      let bottleCount =
        typeof this.actualBottles === "number"
          ? this.actualBottles
          : this.percentage;
      ctx.fillText(`${bottleCount}`, textX, textY);
    }
    if (this.IMAGES_USED === this.IMAGES_COINS) {
      let coinCount =
        typeof this.actualCoins === "number"
          ? this.actualCoins
          : this.percentage;
      ctx.fillText(`${coinCount}`, textX, textY);
    }
    if (this.IMAGES_USED === this.IMAGES_ENDBOSS) {
      ctx.fillText(`${this.percentage}%`, textX, textY);
    }
  }

  /**
   * Resolves the image index to use based on the current percentage.
   * Maps to image states: 0%, 20%, 40%, 60%, 80%, 100%
   * @returns {number} The index of the image to display (0-5).
   */
  resolveImageIndex() {
    if (this.percentage === 100) return 5; // 100%
    if (this.percentage >= 80) return 4; // 80%
    if (this.percentage >= 60) return 3; // 60%
    if (this.percentage >= 40) return 2; // 40%
    if (this.percentage >= 20) return 1; // 20%
    if (this.percentage > 0) return 1; // 20%
    return 0; // 0%
  }
}
