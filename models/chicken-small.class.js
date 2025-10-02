/**
 * Represents a small chicken enemy in the game.
 * Handles movement, animation, and death logic.
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
  height = 75;
  width = 75;
  y = 360;
  energy = 100;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["/assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Creates a new ChickenSmall instance and initializes its properties and animation.
   */
  constructor() {
    super();
    this.loadImage(
      "/assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png"
    );
    this.x = 150 + Math.random() * 1900;
    this.speed = 1.25 + Math.random() * 4.55;
    this.animationSpeed = 100;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.deathAudio = new Audio("/assets/audio/short-chick-sound-171389.mp3");
    this.animate();
  }
  offset = { top: -10, bottom: 10, left: 10, right: 10 };
  /**
   * Animates the chicken by moving it left at a set interval if not dead.
   */
  animate() {
    this._unregisterGameLoop = window.registerSimpleInterval({
      interval: this.animationSpeed,
      action: () => this.moveLeft(),
      isActive: () => !this.isDeadNow,
    });
  }

  /**
   * Handles the chicken's death animation, sound, and removal from the game.
   */
  handleDeath() {
    if (this.deathAudio) {
      this.deathAudio.currentTime = 0;
      this.deathAudio.muted = localStorage.getItem("polloMute") === "1";
      this.deathAudio.play();
    }
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
    if (!this.deadAnimationTimeout) {
      this.deadAnimationTimeout = window.registerSimpleAnimation({
        context: this,
        images: this.IMAGES_DEAD,
        interval: 1000 / this.IMAGES_DEAD.length,
        isActive: () => !this.isRemoved,
        onFrame: null,
      });
      const target = window.getGameTime() + 1000;
      const unregister = window.registerGameLoop((gameTime) => {
        if (gameTime >= target) {
          if (!this.isRemoved) {
            this.isRemoved = true;
            this.removeFromEnemies();
          }
          unregister();
          if (this.deadAnimationTimeout) this.deadAnimationTimeout();
        }
      });
    }
  }
  /**
   * Handles logic when the chicken is hit by a bottle.
   * @param {ThrowableObject} bottle - The bottle object that hit the chicken.
   */
  hitByBottle(bottle) {
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
  /**
   * Handles logic when the chicken is hit by a jump.
   */
  hitByJump() {
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
}
