/**
 * Represents a normal chicken enemy in the game.
 * Handles movement, animation, and death logic.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  height = 125;
  width = 105;
  y = 310;
  energy = 100;
  isDeadNow = false;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "/assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
  ];

  /**
   * Creates a new Chicken instance and initializes its properties and animation.
   */
  constructor() {
    super();
    this.loadImage(
      "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.x = 150 + Math.random() * 3800;
    this.speed = 1.25 + Math.random() * 3.55;
    this.animationSpeed = 90;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
    this.deathAudio = new Audio("/assets/audio/chicken-noise-196746.mp3");
  }
  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
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
}
