/**
 * Represents the endboss enemy in the game.
 * Handles movement, attack, animation, and death logic.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  height = 350;
  width = 200;
  y = 100;
  x;
  energy = 100;
  jumpHits = 0;
  maxJumpHits = 5;
  isRemoved = false;
  isHurtNow = false;
  deadAnimationTimeout = null;
  animationSpeed = 110;
  isWalking = false;
  isAttacking = false;
  isDeadNow = false;
  shouldMoveRight = false;
  _appearSoundPlayed = false;
  _deathSoundPlayed = false;

  IMAGES_WALKING = [
    "/assets/img/4_enemie_boss_chicken/1_walk/G1.png",
    "/assets/img/4_enemie_boss_chicken/1_walk/G2.png",
    "/assets/img/4_enemie_boss_chicken/1_walk/G3.png",
    "/assets/img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
  IMAGES_ALERT = [
    "/assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "/assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
  IMAGES_ATTACK = [
    "/assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "/assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];
  IMAGES_HURT = [
    "/assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "/assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "/assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];
  IMAGES_DEAD = [
    "/assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "/assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "/assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  offset = { top: 90, bottom: 80, left: 50, right: 35 };

  /**
   * Creates a new Endboss instance and initializes its properties and animation.
   * @param {number} level_end_x - The x position where the level ends.
   * @param {Object} level - The level object the endboss belongs to.
   */
  constructor(level_end_x, level) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 1900;
    this.level = level;
    this.level_end_x = level_end_x;
    this.setRandomAction();
    this.startAnimation();
    this.deathAudio = new Audio(
      "/assets/audio/chicken-cluking-type-3-293320.mp3"
    );
    this.hurtAudio = new Audio(
      "/assets/audio/chicken-laying-an-egg-330874.mp3"
    );
    this.attackAudio = new Audio("/assets/audio/dona-screem.mp3");
    this.appearAudio = new Audio(
      "/assets/audio/chicken-single-alarm-call-6056.mp3"
    );
  }

  /**
   * Sets a random action (walking, attacking, or idle) for the endboss at intervals.
   */
  setRandomAction() {
    let lastActionTick = window.getGameTime();
    const actionInterval = 1000;
    this._unregisterRandomAction = window.registerGameLoop((gameTime) => {
      if (gameTime - lastActionTick >= actionInterval) {
        const action = Math.floor(Math.random() * 2);
        this.isWalking = true;
        this.isAttacking = action === 1;
        lastActionTick = gameTime;
      }
    });
  }

  /**
   * Starts the main animation loop for the endboss, handling state and actions.
   */
  startAnimation() {
    let lastAnimTick = window.getGameTime();
    let animInterval = this.animationSpeed;
    this._unregisterAnimation = window.registerGameLoop((gameTime) => {
      if (this.isRemoved) return;
      if (this.isDeadNow) return this.handleDeath();
      if (this.isHurtNow) return this.handleHurt();
      if (gameTime - lastAnimTick >= animInterval) {
        this.handleMovement();
        lastAnimTick = gameTime;
        animInterval = this.animationSpeed;
      }
    });
  }

  /**
   * Handles the endboss's death animation, sound, and removal from the game.
   */
  handleDeath() {
    if (this.deathAudio) {
      this.deathAudio.currentTime = 0;
      this.deathAudio.muted = localStorage.getItem("polloMute") === "1";
      this.deathAudio.play();
    }
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.deadAnimationTimeout) {
      const target = window.getGameTime() + 1000;
      const unregister = window.registerGameLoop((gameTime) => {
        if (gameTime >= target) {
          if (!this.isRemoved) {
            this.isRemoved = true;
            this.addEndbossEffect();
            this.removeFromEnemies();
            if (this.world && this.world.endbossBar) {
              this.world.endbossBar = null;
            }
            this.spawnGoldenEgg();
          }
          unregister();
        }
      });
      this.deadAnimationTimeout = unregister;
    }
  }

  /**
   * Adds a visual effect (e.g., POW) when the endboss dies.
   */
  addEndbossEffect() {
    if (
      this.world &&
      typeof this.world.addEffect === "function" &&
      window.EndbossEffect
    ) {
      this.world.addEffect(
        new window.EndbossEffect(this.x, this.y, this.width, this.height)
      );
    }
  }

  /**
   * Spawns a golden egg at the endboss's position upon death.
   */
  spawnGoldenEgg() {
    if (
      this.world &&
      this.world.level &&
      typeof window.GoldenEgg === "function"
    ) {
      const eggY = this.y + this.height / 2 - 20;
      const egg = new window.GoldenEgg(this.x, eggY);
      if (!this.world.level.goldenEggs) this.world.level.goldenEggs = [];
      this.world.level.goldenEggs.push(egg);
    }
  }

  /**
   * Handles the endboss's hurt animation and sound.
   */
  handleHurt() {
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
  }

  /**
   * Handles the endboss's movement and action logic based on player position.
   */
  handleMovement() {
    const inRange =
      this.world &&
      this.world.character &&
      this.world.character.x >= this.level_end_x - 710;
    if (inRange && this.isAttacking) {
      this.handleAttack();
    }
    if (inRange && this.isWalking) {
      this.handleWalk();
    } else if (this.shouldMoveRight) {
      this.handleMoveRight();
    } else if (inRange) {
      this.handleAlert();
    }
  }

  /**
   * Handles the endboss's attack animation, sound, and jump.
   */
  handleAttack() {
    this.animationSpeed = 170;
    this.jump();
    this.playAnimation(this.IMAGES_ATTACK);
    this.attackAudio.muted = localStorage.getItem("polloMute") === "1";

    this.attackAudio.play();

    this.animationSpeed = 110;
  }

  /**
   * Handles the endboss's walking animation and movement.
   */
  handleWalk() {
    this.otherDirection = false;
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
    this.x -= 10;
    this.shouldMoveRight = true;
  }

  /**
   * Handles the endboss's movement to the right.
   */
  handleMoveRight() {
    if (this.x + 10 < 1900) {
      this.otherDirection = true;
      this.moveRight();
      this.x += 10;
    } else {
      this.shouldMoveRight = false;
    }
  }

  /**
   * Handles the endboss's alert animation and sound.
   */
  handleAlert() {
    if (!this._appearSoundPlayed && this.appearAudio) {
      this._appearSoundPlayed = true;
      this.appearAudio.currentTime = 0;
      this.appearAudio.muted = localStorage.getItem("polloMute") === "1";
      this.appearAudio.play();
    }
    this.animationSpeed = 170;
    this.playAnimation(this.IMAGES_ALERT);
    this.animationSpeed = 110;
  }

  /**
   * Handles logic when the endboss is hit by a bottle.
   * @param {ThrowableObject} bottle - The bottle object that hit the endboss.
   */
  hitByBottle(bottle) {
    this.energy -= 5;
    this.isHurtNow = true;
    this.playAnimation(this.IMAGES_HURT);
    const target = window.getGameTime() + 400;
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= target) {
        this.isHurtNow = false;
        if (typeof this.setRandomAction === "function") {
          this.setRandomAction();
        }
        unregister();
      }
    });
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.energy);
    }
    if (this.energy <= 0) {
      this.isDeadNow = true;
      this.playAnimation(this.IMAGES_DEAD);
    }
  }

  /**
   * Handles logic when the endboss is hit by jumping from above.
   * Requires 5 hits to kill the endboss.
   */
  hitByJump() {
    this.jumpHits++;
    const damagePerHit = 100 / this.maxJumpHits;
    this.energy -= damagePerHit;

    this.isHurtNow = true;
    this.playAnimation(this.IMAGES_HURT);

    if (this.hurtAudio) {
      this.hurtAudio.currentTime = 0;
      this.hurtAudio.muted = localStorage.getItem("polloMute") === "1";
      this.hurtAudio.play();
    }

    const target = window.getGameTime() + 400;
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= target) {
        this.isHurtNow = false;
        if (typeof this.setRandomAction === "function") {
          this.setRandomAction();
        }
        unregister();
      }
    });

    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.energy);
    }

    if (this.jumpHits >= this.maxJumpHits || this.energy <= 0) {
      this.isDeadNow = true;
      this.playAnimation(this.IMAGES_DEAD);
      if (this.deathAudio) {
        this.deathAudio.currentTime = 0;
        this.deathAudio.muted = localStorage.getItem("polloMute") === "1";
        this.deathAudio.play();
      }
    }
  }
}
