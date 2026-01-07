/**
 * Base class for all movable objects in the game.
 * Handles movement, gravity, collision, and animation logic.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  x = 120;
  y = 280;
  img;
  imageLoaded = false;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  acceleration = 2.5;
  animationSpeed = 120;
  energy = 100;
  lastHit = 0;

  /**
   * Creates a new MovableObject instance.
   */
  constructor() {
    super();
    this.loadImage;
  }

  /**
   * Loads a single image for the movable object.
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
   * Loads multiple images for the movable object.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas if the image is loaded.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img?.complete && this.imageLoaded) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  /**
   * Plays an animation by cycling through the given images.
   * @param {string[]} images - Array of image paths for animation.
   */
  playAnimation(images) {
    let now = this._getCurrentTime();
    if (this.isAboveGround() && images === this.IMAGES_WALKING) return;
    if (!this.lastAnimationTime) this.lastAnimationTime = now;
    if (now - this.lastAnimationTime > this.animationSpeed) {
      this._advanceAnimation(images, now);
    }
  }

  /**
   * Gets the current time for animation and game logic.
   * @returns {number} The current time in ms.
   * @private
   */
  _getCurrentTime() {
    return typeof window !== "undefined" && window.getGameTime
      ? window.getGameTime()
      : Date.now();
  }

  /**
   * Advances the animation frame.
   * @param {string[]} images - Array of image paths.
   * @param {number} now - The current time in ms.
   * @private
   */
  _advanceAnimation(images, now) {
    this.currentImage = (this.currentImage + 1) % images.length;
    let path = images[this.currentImage];
    this.img = this.imageCache[path];
    this.lastAnimationTime = now;
  }

  /**
   * Applies gravity to the object, updating its vertical position over time.
   */
  applyGravity() {
    let lastGravityTick = window.getGameTime();
    const gravityInterval = 1000 / 25;
    this._unregisterGravity = window.registerGameLoop((gameTime) => {
      if (gameTime - lastGravityTick >= gravityInterval) {
        if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
        lastGravityTick = gameTime;
      }
    });
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if above ground, otherwise false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    if (this instanceof Character) return this.y < 180;
    return false;
  }

  /**
   * Checks if this object is colliding with another movable object.
   * @param {MovableObject} mo - The other movable object.
   * @returns {boolean} True if colliding, otherwise false.
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Reduces the object's energy when hit and updates lastHit timestamp.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = Date.now();
    }
  }

  /**
   * Returns whether the object is dead (energy is 0).
   * @returns {boolean} True if dead, otherwise false.
   */
  isDead() {
    return this.energy === 0;
  }
  /**
   * Removes this object from the world's enemies array if present.
   */
  removeFromEnemies() {
    if (
      this.world &&
      this.world.level &&
      Array.isArray(this.world.level.enemies)
    ) {
      const idx = this.world.level.enemies.indexOf(this);
      if (idx !== -1) this.world.level.enemies.splice(idx, 1);
    }
  }

  /**
   * Returns whether the object was recently hit (within 0.2 seconds).
   * @returns {boolean} True if recently hurt, otherwise false.
   */
  isHurt() {
    let timepassed = (Date.now() - this.lastHit) / 1000;
    if (timepassed < 0.2) {
    }
    return timepassed < 0.2;
  }

  /**
   * Moves the object to the right and plays walking animation if available.
   */
  moveRight() {
    this.x += this.speed;
    // Animation wird in der jeweiligen Klasse verwaltet (Character, Chicken, etc.)
    // if (this.IMAGES_WALKING) this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Moves the object to the left and plays walking animation if available.
   */
  moveLeft() {
    this.x -= this.speed;
    // Animation wird in der jeweiligen Klasse verwaltet (Character, Chicken, etc.)
    // if (this.IMAGES_WALKING) this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Makes the object jump and plays jumping animation if available.
   */
  jump() {
    this.speedY = 30;
  }
}
