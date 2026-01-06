/**
 * Represents a throwable object (e.g., bottle) in the game.
 * Handles throwing, animation, collision, splash effect, and removal from the world.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  offset = { top: 30, bottom: 20, left: 40, right: 40 };

  /**
   * Creates a new ThrowableObject instance and initializes its properties, images, and audio.
   * @param {number} x - The x position to spawn the object.
   * @param {number} y - The y position to spawn the object.
   * @param {boolean} [toLeft=false] - Whether the object is thrown to the left.
   */
  constructor(x, y, toLeft = false) {
    super();
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 100;
    this.animationSpeed = 5;
    this.toLeft = toLeft;
    this.loadImages(Bottle.IMAGES_BOTTLES_THROW);
    this.loadImage(Bottle.IMAGES_BOTTLES_THROW[0]);
    this.throw();
    this.animateThrow();
    this.bottleCrackAudio = new Audio("/assets/audio/bottle-crack.mp3");
  }

  /**
   * Starts the throw animation interval for the bottle.
   */
  animateThrow() {
    this.animationSpeed = 60;
    this._unregisterThrowAnim = window.registerSimpleAnimation({
      context: this,
      images: Bottle.IMAGES_BOTTLES_THROW,
      interval: this.animationSpeed,
      isActive: () => !this.splashing,
    });
  }

  /**
   * Initiates the throw movement and sets up the interval for updating position and collision.
   * @param {number} [x] - Optional new x position to start the throw from.
   * @param {number} [y] - Optional new y position to start the throw from.
   */
  throw(x, y) {
    if (x !== undefined && y !== undefined) {
      this.x = x;
      this.y = y;
    }
    this.speedY = 15;
    const GAME_HEIGHT = 480;
    this.splashing = false;
    this._unregisterThrowMove = window.registerSimpleInterval({
      interval: 180,
      action: () => {
        if (this.splashing) return;
        this.x += this.toLeft ? -20 : 20;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        if (this.y >= GAME_HEIGHT - this.height && !this.splashing) {
          this.y = GAME_HEIGHT - this.height - 75;
          this.showSplash();
        }
        this.checkEnemyCollision();
      },
      isActive: () => !this.splashing,
    });
  }

  /**
   * Checks for collision with enemies and triggers splash if a collision occurs.
   */
  checkEnemyCollision() {
    if (this.world && this.world.level && this.world.level.enemies) {
      for (let enemy of this.world.level.enemies) {
        if (this.isOffsetColliding(this, enemy) && !this.splashing) {
          if (typeof enemy.hitByBottle === "function") {
            enemy.hitByBottle(this);
          }
          this.showSplash();
        }
      }
    }
  }

  /**
   * Handles the splash animation, sound, and removal after the bottle hits the ground or an enemy.
   */
  showSplash() {
    this.splashing = true;
    if (this._unregisterThrowMove) this._unregisterThrowMove();
    if (this._unregisterThrowAnim) this._unregisterThrowAnim();
    this.currentImage = 0;
    const splashImages = Bottle.IMAGES_BOTTLES_SPLASH;
    this.loadImages(splashImages);
    if (this.bottleCrackAudio) {
      this.bottleCrackAudio.currentTime = 0;
      this.bottleCrackAudio.muted = localStorage.getItem("polloMute") === "1";
      this.bottleCrackAudio.play().catch((err) => {
        if (window.DEBUG_AUDIO) {
          console.warn(
            "Audio playback failed: bottleCrackAudio could not be played. " +
              (err && err.message ? err.message : "")
          );
        }
      });
    }
    this._unregisterSplashAnim = window.registerSimpleAnimation({
      context: this,
      images: splashImages,
      interval: 80,
      isActive: () => true,
    });
    const splashEndTarget = window.getGameTime() + 400;
    const unregisterSplashEnd = window.registerGameLoop((gameTime) => {
      if (gameTime >= splashEndTarget) {
        if (this._unregisterSplashAnim) this._unregisterSplashAnim();
        this.remove();
        unregisterSplashEnd();
      }
    });
  }

  /**
   * Removes the throwable object from the world and clears all related intervals.
   */
  remove() {
    if (this._unregisterThrowMove) this._unregisterThrowMove();
    if (this._unregisterThrowAnim) this._unregisterThrowAnim();
    if (this._unregisterSplashAnim) this._unregisterSplashAnim();
    if (
      this.world &&
      this.world.character &&
      Array.isArray(this.world.character.throwBottles)
    ) {
      const idx = this.world.character.throwBottles.indexOf(this);
      if (idx > -1) {
        this.world.character.throwBottles.splice(idx, 1);
      }
    }
  }

  /**
   * Checks for collision between two objects, considering their offset properties.
   * @param {Object} objA - The first object to check.
   * @param {Object} objB - The second object to check.
   * @returns {boolean} True if the objects are colliding, otherwise false.
   */
  isOffsetColliding(objA, objB) {
    if (!objA || !objB) {
      console.error(
        "[BottleCollision] isOffsetColliding: objA oder objB ist undefined",
        { objA, objB }
      );
      return false;
    }
    const required = ["x", "y", "width", "height"];
    for (const key of required) {
      if (typeof objA[key] !== "number" || typeof objB[key] !== "number") {
        console.error(
          `[BottleCollision] isOffsetColliding: Eigenschaft fehlt oder ist kein number: ${key}`,
          { objA, objB }
        );
        return false;
      }
    }
    const a = {
      left: objA.x + (objA.offset?.left || 0),
      right: objA.x + objA.width - (objA.offset?.right || 0),
      top: objA.y + (objA.offset?.top || 0),
      bottom: objA.y + objA.height - (objA.offset?.bottom || 0),
    };
    const b = {
      left: objB.x + (objB.offset?.left || 0),
      right: objB.x + objB.width - (objB.offset?.right || 0),
      top: objB.y + (objB.offset?.top || 0),
      bottom: objB.y + objB.height - (objB.offset?.bottom || 0),
    };
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }
}
