class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  x;
  energy = 100;
  isRemoved = false;
  isHurtNow = false;
  deadAnimationTimeout = null;
  animationSpeed = 110;
  isWalking = false;
  isAttacking = false;
  isDeadNow = false;
  shouldMoveRight = false;
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
  }

  setRandomAction() {
    window.setStoppableInterval(() => {
      const action = Math.floor(Math.random() * 3);
      this.isWalking = action === 1;
      this.isAttacking = action === 2;
    }, 1000);
  }

  startAnimation() {
    window.setStoppableInterval(() => {
      if (this.isRemoved) return;
      if (this.isDeadNow) return this.handleDeath();
      if (this.isHurtNow) return this.handleHurt();
      this.handleMovement();
    }, this.animationSpeed);
  }

  handleDeath() {
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.deadAnimationTimeout) {
      this.deadAnimationTimeout = setTimeout(() => {
        if (!this.isRemoved) {
          this.isRemoved = true;
          if (
            this.world &&
            typeof this.world.addEffect === "function" &&
            window.EndbossEffect
          ) {
            this.world.addEffect(
              new window.EndbossEffect(this.x, this.y, this.width, this.height)
            );
          }
          if (
            this.world &&
            this.world.level &&
            Array.isArray(this.world.level.enemies)
          ) {
            const idx = this.world.level.enemies.indexOf(this);
            if (idx !== -1) this.world.level.enemies.splice(idx, 1);
          }
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
      }, 1000);
    }
  }

  handleHurt() {
    this.playAnimation(this.IMAGES_HURT);
  }

  handleMovement() {
    const inRange =
      this.world &&
      this.world.character &&
      this.world.character.x >= this.level_end_x - 710;
    if (inRange && this.isAttacking) {
      this.handleAttack();
    } else if (inRange && this.isWalking) {
      this.handleWalk();
    } else if (this.shouldMoveRight) {
      this.handleMoveRight();
    } else if (inRange) {
      this.handleAlert();
    }
  }

  handleAttack() {
    this.animationSpeed = 170;
    this.jump();
    this.playAnimation(this.IMAGES_ATTACK);
    this.animationSpeed = 110;
  }

  handleWalk() {
    this.otherDirection = false;
    this.moveLeft();
    this.playAnimation(this.IMAGES_WALKING);
    this.x -= 10;
    this.shouldMoveRight = true;
  }

  handleMoveRight() {
    if (this.x + 10 < 1900) {
      this.otherDirection = true;
      this.moveRight();
      this.x += 10;
    } else {
      this.shouldMoveRight = false;
    }
  }

  handleAlert() {
    this.animationSpeed = 170;
    this.playAnimation(this.IMAGES_ALERT);
    this.animationSpeed = 110;
  }

  hitByBottle(bottle) {
    this.energy -= 25;
    this.isHurtNow = true;
    this.playAnimation(this.IMAGES_HURT);
    setTimeout(() => {
      this.isHurtNow = false;
    }, 400);
    if (this.world && this.world.endbossBar) {
      this.world.endbossBar.setPercentage(this.energy);
    }
    if (this.energy <= 0) {
      this.isDeadNow = true;
      this.playAnimation(this.IMAGES_DEAD);
    }
  }
}
