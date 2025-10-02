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
    let idleStartTime = window.getGameTime();
    let canThrowBottle = true;
    if (this.lastActionTick === undefined)
      this.lastActionTick = window.getGameTime();
    if (this.lastIdleTick === undefined)
      this.lastIdleTick = window.getGameTime();
    if (this.lastWalkTick === undefined)
      this.lastWalkTick = window.getGameTime();
    if (this.lastJumpTick === undefined)
      this.lastJumpTick = window.getGameTime();
    if (this.lastIdleAnimTick === undefined)
      this.lastIdleAnimTick = window.getGameTime();
    if (this.walkAnimFrame === undefined) this.walkAnimFrame = 0;
    if (this.jumpAnimFrame === undefined) this.jumpAnimFrame = 0;
    if (this.idleAnimFrame === undefined) this.idleAnimFrame = 0;
    if (this.idleLongAnimFrame === undefined) this.idleLongAnimFrame = 0;
    const actionInterval = 1000 / 45;
    const idleInterval = 300;
    const walkInterval = this.animationSpeed;
    const jumpInterval = 80;
    const idleAnimInterval = 120;
    let isWalking = false;
    let isJumping = false;
    this._unregisterGameLoop = window.registerGameLoop((gameTime) => {
      if (gameTime - this.lastActionTick >= actionInterval) {
        const actionHappened = this.handleActions(canThrowBottle);
        if (!this.world?.keyboard?.D) canThrowBottle = true;
        if (actionHappened) idleStartTime = gameTime;
        this.lastActionTick = gameTime;
      }
      if (
        (this.shouldMoveLeft() || this.shouldMoveRight()) &&
        !this.isAboveGround()
      ) {
        isWalking = true;
        isJumping = false;
        if (gameTime - this.lastWalkTick >= walkInterval) {
          this.walkAnimFrame =
            (this.walkAnimFrame + 1) % this.IMAGES_WALKING.length;
          this.img = this.imageCache[this.IMAGES_WALKING[this.walkAnimFrame]];
          this.lastWalkTick = gameTime;
        }
      } else if (this.isAboveGround()) {
        isJumping = true;
        isWalking = false;
        if (gameTime - this.lastJumpTick >= jumpInterval) {
          this.jumpAnimFrame =
            (this.jumpAnimFrame + 1) % this.IMAGES_JUMPING.length;
          this.img = this.imageCache[this.IMAGES_JUMPING[this.jumpAnimFrame]];
          this.lastJumpTick = gameTime;
        }
      } else {
        isWalking = false;
        isJumping = false;
      }
      if (!isWalking && !isJumping && !this.isDead() && !this.isHurt()) {
        if (gameTime - this.lastIdleTick >= idleInterval) {
          this.handleIdle(idleStartTime, gameTime, {
            idleAnimFrameRef: () => this.idleAnimFrame,
            setIdleAnimFrame: (v) => {
              this.idleAnimFrame = v;
            },
            idleLongAnimFrameRef: () => this.idleLongAnimFrame,
            setIdleLongAnimFrame: (v) => {
              this.idleLongAnimFrame = v;
            },
            lastIdleAnimTickRef: () => this.lastIdleAnimTick,
            setLastIdleAnimTick: (v) => {
              this.lastIdleAnimTick = v;
            },
          });
          this.lastIdleTick = gameTime;
        }
      }
    });
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
        const target = window.getGameTime() + 1000;
        const unregister = window.registerGameLoop((gameTime) => {
          if (gameTime >= target) {
            window.location.href = "/pages/game-over.html";
            unregister();
          }
        });
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
        const target = window.getGameTime() + 1000;
        const unregister = window.registerGameLoop((gameTime) => {
          if (gameTime >= target) {
            if (this.deathAudio) this.deathAudio.pause();
            unregister();
          }
        });
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
    const target = window.getGameTime() + 700;
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= target) {
        this.throwCooldown = false;
        unregister();
      }
    });
  }

  /**
   * Handles the jump animation if the character is above ground.
   * @returns {boolean} True if jump animation is played, otherwise false.
   */
  handleJumpAnimation() {
    return false;
  }

  /**
   * Handles the idle animation logic based on idle time.
   * @param {number} idleStartTime - The timestamp when idle started.
   */
  handleIdle(idleStartTime, gameTime, animState) {
    if (this.shouldIdle()) {
      this.playIdleAnimation(idleStartTime, gameTime, animState);
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
  playIdleAnimation(idleStartTime, gameTime, animState) {
    const idleDuration = gameTime - idleStartTime;
    const idleLong = idleDuration > 5000;
    const animInterval = 120;
    if (idleLong) {
      if (gameTime - animState.lastIdleAnimTickRef() >= animInterval) {
        let frame =
          (animState.idleLongAnimFrameRef() + 1) % this.IMAGES_IDLE_LONG.length;
        this.img = this.imageCache[this.IMAGES_IDLE_LONG[frame]];
        animState.setIdleLongAnimFrame(frame);
        animState.setLastIdleAnimTick(gameTime);
      }
      if (this.longIdleAudio) {
        this.longIdleAudio.loop = true;
        this.longIdleAudio.muted = localStorage.getItem("polloMute") === "1";
        if (this.longIdleAudio.paused) {
          this.longIdleAudio.play();
        }
      }
    } else {
      if (gameTime - animState.lastIdleAnimTickRef() >= animInterval) {
        let frame =
          (animState.idleAnimFrameRef() + 1) % this.IMAGES_IDLE.length;
        this.img = this.imageCache[this.IMAGES_IDLE[frame]];
        animState.setIdleAnimFrame(frame);
        animState.setLastIdleAnimTick(gameTime);
      }
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
