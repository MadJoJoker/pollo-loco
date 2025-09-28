/**
 * Represents the main player character in the game.
 * Handles movement, animation, actions, and interactions with the world.
 * @extends MovableObject
 */
class Character extends MovableObject {
  height = 250;
  width = 180;
  y = 180;
  x = 10;
  speed = 10;
  animationSpeed = 50;
  damage = 10;
  lastAttack = 0;
  bottles = 0;
  coins = 0;
  throwBottles = [];
  lastHit;
  energy = 100;
  /**
   * Reference to the game world the character belongs to.
   * @type {World}
   */
  world;

  IMAGES_WALKING = [
    "/assets/img/2_character_pepe/2_walk/W-21.png",
    "/assets/img/2_character_pepe/2_walk/W-22.png",
    "/assets/img/2_character_pepe/2_walk/W-23.png",
    "/assets/img/2_character_pepe/2_walk/W-24.png",
    "/assets/img/2_character_pepe/2_walk/W-25.png",
    "/assets/img/2_character_pepe/2_walk/W-26.png",
  ];
  IMAGES_JUMPING = [
    "/assets/img/2_character_pepe/3_jump/J-31.png",
    "/assets/img/2_character_pepe/3_jump/J-32.png",
    "/assets/img/2_character_pepe/3_jump/J-33.png",
    "/assets/img/2_character_pepe/3_jump/J-34.png",
    "/assets/img/2_character_pepe/3_jump/J-35.png",
    "/assets/img/2_character_pepe/3_jump/J-36.png",
    "/assets/img/2_character_pepe/3_jump/J-37.png",
    "/assets/img/2_character_pepe/3_jump/J-38.png",
    "/assets/img/2_character_pepe/3_jump/J-39.png",
  ];
  IMAGES_DEAD = [
    "/assets/img/2_character_pepe/5_dead/D-51.png",
    "/assets/img/2_character_pepe/5_dead/D-52.png",
    "/assets/img/2_character_pepe/5_dead/D-53.png",
    "/assets/img/2_character_pepe/5_dead/D-54.png",
    "/assets/img/2_character_pepe/5_dead/D-54.png",
    "/assets/img/2_character_pepe/5_dead/D-56.png",
    "/assets/img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "/assets/img/2_character_pepe/4_hurt/H-41.png",
    "/assets/img/2_character_pepe/4_hurt/H-42.png",
    "/assets/img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_IDLE = [
    "/assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-8.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-9.png",
    "/assets/img/2_character_pepe/1_idle/idle/I-10.png",
  ];
  IMAGES_IDLE_LONG = [
    "/assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "/assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  offset = { top: 130, bottom: 10, left: 35, right: 55 };

  /**
   * Creates a new Character instance and initializes its properties and audio.
   * @param {World} world - The game world the character belongs to.
   */
  constructor(world) {
    super().loadImage("/assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadAllImages();
    this.applyGravity();
    this.animate();
    this.deathAudio = new Audio(
      "/assets/audio/grandpa-dying-on-floor-272435.mp3"
    );
    this.hurtAudio = new Audio("/assets/audio/male-extreme-scream-123078.mp3");
    this.walkingAudio = new Audio("/assets/audio/sand-walk-106366.mp3");
    this.longIdleAudio = new Audio("/assets/audio/snoring-42710.mp3");
  }

  /**
   * Loads all animation images for the character.
   */
  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

  /**
   * Starts the animation intervals for the character's actions and idle state.
   */
  animate() {
    let idleStartTime = Date.now();
    let canThrowBottle = true;
    window.setStoppableInterval(() => {
      const actionHappened = this.handleActions(canThrowBottle);
      if (!this.world?.keyboard?.D) canThrowBottle = true;
      if (actionHappened) idleStartTime = Date.now();
    }, 1000 / 45);
    window.setStoppableInterval(() => {
      this.handleIdle(idleStartTime);
    }, 300);
  }

  /**
   * Handles all possible actions for the character in the current frame.
   * @param {boolean} canThrowBottle - Whether the character can throw a bottle.
   * @returns {boolean} True if any action occurred, otherwise false.
   */
  handleActions(canThrowBottle) {
    let actionHappened = false;
    if (this.handleDeath()) actionHappened = true;
    if (this.handleHurt()) actionHappened = true;
    if (this.handleMovement()) actionHappened = true;
    if (this.handleJump()) actionHappened = true;
    if (this.handleThrow(canThrowBottle)) actionHappened = true;
    if (this.handleJumpAnimation()) actionHappened = true;
    return actionHappened;
  }

  /**
   * Handles the character's death animation, sound, and game over logic.
   * @returns {boolean} True if the character is dead, otherwise false.
   */
  handleDeath() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      if (this.hurtAudio && !this.hurtAudio.paused) {
        this.hurtAudio.pause();
        this.hurtAudio.currentTime = 0;
      }
      if (
        !this._deathSoundPlayed &&
        this.deathAudio &&
        this.deathAudio.paused
      ) {
        this._deathSoundPlayed = true;
        this.deathAudio.currentTime = 0;
        this.deathAudio.muted = localStorage.getItem("polloMute") === "1";
        this.deathAudio.play();
      }
      if (!this._gameOverRedirected) {
        this._gameOverRedirected = true;
        setTimeout(function () {
          window.location.href = "/pages/game-over.html";
        }, 1000);
      }
      return true;
    }
    return false;
  }

  /**
   * Handles the character's hurt animation and sound.
   * @returns {boolean} True if the character is hurt, otherwise false.
   */
  handleHurt() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      if (this.hurtAudio && this.hurtAudio.paused) {
        this.hurtAudio.currentTime = 0;
        this.hurtAudio.muted = localStorage.getItem("polloMute") === "1";
        this.hurtAudio.play();
        setTimeout(() => {
          if (this.deathAudio) this.deathAudio.pause();
        }, 1000);
      }
      return true;
    }
    return false;
  }

  /**
   * Handles the character's left/right movement and walking sound.
   * @returns {boolean} True if the character is moving, otherwise false.
   */
  handleMovement() {
    let isMoving = false;
    if (this.shouldMoveRight()) {
      this.moveRight();
      this.otherDirection = false;
      this.playAnimation(this.IMAGES_WALKING);
      isMoving = true;
    }
    if (this.shouldMoveLeft()) {
      this.moveLeft();
      this.otherDirection = true;
      this.playAnimation(this.IMAGES_WALKING);
      isMoving = true;
    }

    if (this.walkingAudio) {
      this.walkingAudio.loop = true;
      if (isMoving && !this.isAboveGround() && this.walkingAudio.paused) {
        this.walkingAudio.muted = localStorage.getItem("polloMute") === "1";
        this.walkingAudio.play();
      }
      if ((!isMoving || this.isAboveGround()) && !this.walkingAudio.paused) {
        this.walkingAudio.pause();
        this.walkingAudio.currentTime = 0;
      }
    }
    return isMoving;
  }

  shouldMoveRight() {
    return this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x;
  }

  shouldMoveLeft() {
    return this.world?.keyboard?.LEFT && this.x > 0;
  }

  /**
   * Handles the character's jump action and animation.
   * @returns {boolean} True if the character jumps, otherwise false.
   */
  handleJump() {
    if (this.world?.keyboard?.SPACE && !this.isAboveGround()) {
      this.jump();
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  throwCooldown = false;
  /**
   * Handles the logic for throwing a bottle if possible.
   * @param {boolean} canThrowBottle - Whether the character can throw a bottle.
   * @returns {boolean} True if a bottle was thrown, otherwise false.
   */
  handleThrow(canThrowBottle) {
    if (this.canThrowBottle(canThrowBottle)) {
      this.throwBottle();
      this.updateBottleBar();
      this.setThrowCooldown();
      canThrowBottle = false;
      return true;
    }
    return false;
  }

  canThrowBottle(canThrowBottle) {
    return (
      this.world?.keyboard?.D &&
      canThrowBottle &&
      this.bottles > 0 &&
      !this.throwCooldown
    );
  }

  /**
   * Creates and throws a new bottle object from the character's position.
   */
  throwBottle() {
    const bottleX = this.otherDirection
      ? this.x + this.offset.left
      : this.x + this.width - this.offset.right;
    const bottleY = this.y + this.height / 2;
    const bottle = new ThrowableObject(bottleX, bottleY, this.otherDirection);
    bottle.world = this.world;
    bottle.throw();
    if (this.throwBottles) this.throwBottles.push(bottle);
    this.bottles -= 1;
  }

  /**
   * Updates the bottle bar UI to reflect the current number of bottles.
   */
  updateBottleBar() {
    if (this.world?.bottleBar) {
      this.world.bottleBar.setPercentage(this.bottles, this.bottles);
    }
  }

  /**
   * Sets a cooldown period after throwing a bottle.
   */
  setThrowCooldown() {
    this.throwCooldown = true;
    setTimeout(() => {
      this.throwCooldown = false;
    }, 700);
  }

  /**
   * Handles the jump animation if the character is above ground.
   * @returns {boolean} True if jump animation is played, otherwise false.
   */
  handleJumpAnimation() {
    if (this.isAboveGround() && this.IMAGES_JUMPING) {
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  /**
   * Handles the idle animation logic based on idle time.
   * @param {number} idleStartTime - The timestamp when idle started.
   */
  handleIdle(idleStartTime) {
    if (this.shouldIdle()) {
      this.playIdleAnimation(idleStartTime);
    }
  }

  shouldIdle() {
    return (
      !this.isDead() &&
      !this.isHurt() &&
      !this.world?.keyboard?.RIGHT &&
      !this.world?.keyboard?.LEFT &&
      !this.world?.keyboard?.SPACE &&
      !this.isAboveGround()
    );
  }

  /**
   * Plays the idle or long idle animation depending on idle duration.
   * @param {number} idleStartTime - The timestamp when idle started.
   */
  playIdleAnimation(idleStartTime) {
    if (Date.now() - idleStartTime > 5000) {
      this.playAnimation(this.IMAGES_IDLE_LONG);
      if (this.longIdleAudio) {
        this.longIdleAudio.loop = true;
        this.longIdleAudio.muted = localStorage.getItem("polloMute") === "1";
        if (this.longIdleAudio.paused) {
          this.longIdleAudio.play();
        }
      }
    } else {
      this.playAnimation(this.IMAGES_IDLE);
      if (this.longIdleAudio && !this.longIdleAudio.paused) {
        this.longIdleAudio.pause();
        this.longIdleAudio.currentTime = 0;
      }
    }
  }

  moveRight() {
    super.moveRight();
    const stopX = this.world.level.level_end_x - 180;
    if (this.x > stopX) this.x = stopX;
  }

  hit() {
    const result = super.hit();

    return result;
  }

  isHurt() {
    const result = super.isHurt();
    if (result) {
    }
    return result;
  }
}
