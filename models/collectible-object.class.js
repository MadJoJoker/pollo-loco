/**
 * Base class for collectible objects like bottles and coins.
 * Handles image loading, drawing, animation, and collection logic.
 * @extends MovableObject
 */
class CollectibleObject extends MovableObject {
  x;
  y;
  img;
  imageLoaded = false;
  height = 50;
  width = 80;
  imageCache = {};
  currentImage = 0;
  otherDirection = false;
  animationSpeed = 120;
  collected = false;
  collectedItem = { bottles: 0, coins: 0 };

  /**
   * Creates a new CollectibleObject instance.
   */
  constructor() {
    super();
    this.loadImage;
  }

  /**
   * Loads a single image for the collectible object.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => (this.imageLoaded = true);
    this.img.onerror = () => {
      this.imageLoaded = false;
    };
  }

  /**
   * Loads multiple images for the collectible object.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the collectible object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img?.complete && this.imageLoaded) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Draws a special frame for bottles or coins if applicable.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (this instanceof Bottle) this.drawBottleFrame(ctx);
    if (this instanceof Coin) this.drawCoinFrame(ctx);
  }

  /**
   * Draws a visual effect frame for a bottle collectible.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawBottleFrame(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 30, this.y + 15, this.width - 50, this.height - 20);
    ctx.stroke();

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = Math.min(this.width, this.height) / 2;
    if ([centerX, centerY, radius].every(Number.isFinite) && radius > 0) {
      let t = Date.now() / 300;
      let gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.7)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = 0.2 + 0.2 * Math.sin(t);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  /**
   * Draws a visual effect frame for a coin collectible.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawCoinFrame(ctx) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radius = this.width / 2;
    if ([centerX, centerY, radius].every(Number.isFinite) && radius > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.rect(this.x + 50, this.y + 50, this.width - 100, this.height - 100);
      ctx.stroke();

      let t = Date.now() / 300;
      let gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, "rgba(255,215,0,0.8)");
      gradient.addColorStop(1, "rgba(230, 229, 223, 0)");
      ctx.globalAlpha = 0.2 + 0.2 * Math.sin(t);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  /**
   * Plays an animation by cycling through the given images.
   * @param {string[]} images - Array of image paths for animation.
   */
  playAnimation(images) {
    if (this.isAboveGround() && images === this.IMAGES_WALKING) return;
    if (!this.lastAnimationTime) this.lastAnimationTime = window.getGameTime();
    const now = window.getGameTime();
    if (now - this.lastAnimationTime > this.animationSpeed) {
      this.currentImage = (this.currentImage + 1) % images.length;
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.lastAnimationTime = now;
    }
  }

  /**
   * Animates the collectible object by scaling it up and then restoring.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   * @param {number} [scale=1.6] - The scale factor.
   * @param {number} [duration=2000] - Duration of the scale animation in ms.
   */
  animateScale(ctx, scale = 1.6, duration = 2000) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw(ctx);
    ctx.restore();

    const target = window.getGameTime() + duration;
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= target) {
        ctx.save();
        this.draw(ctx);
        ctx.restore();
        unregister();
      }
    });
  }

  /**
   * Checks if this collectible object is colliding with another object for collection.
   * @param {MovableObject} mo - The other movable object.
   * @returns {boolean} True if colliding, otherwise false.
   */
  isCollidingCollection(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Returns whether the object has been collected.
   * @returns {boolean} True if collected, otherwise false.
   */
  isCollected() {
    return this.collected;
  }

  /**
   * Returns whether the object is currently collectable (e.g., after being hit).
   * @returns {boolean} True if collectable, otherwise false.
   */
  isCollactable() {
    let timepassed = (window.getGameTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }
}
