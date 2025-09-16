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

  offset = { top: 130, bottom: 20, left: 45, right: 45 };

  constructor(world) {
    super().loadImage("/assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadAllImages();
    this.applyGravity();
    this.animate();
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
  }

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

  handleDeath() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      if (!this._gameOverRedirected) {
        this._gameOverRedirected = true;
        setTimeout(function () {
          window.location.href = "/pages/game-over.html";
        }, 600);
      }
      return true;
    }
    return false;
  }

  handleHurt() {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      return true;
    }
    return false;
  }

  handleMovement() {
    if (this.shouldMoveRight()) {
      this.moveRight();
      this.otherDirection = false;
      this.playAnimation(this.IMAGES_WALKING);
      return true;
    }
    if (this.shouldMoveLeft()) {
      this.moveLeft();
      this.otherDirection = true;
      this.playAnimation(this.IMAGES_WALKING);
      return true;
    }
    return false;
  }

  shouldMoveRight() {
    return this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x;
  }

  shouldMoveLeft() {
    return this.world?.keyboard?.LEFT && this.x > 0;
  }

  handleJump() {
    if (this.world?.keyboard?.SPACE && !this.isAboveGround()) {
      this.jump();
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

  throwCooldown = false;
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

  updateBottleBar() {
    if (this.world?.bottleBar) {
      this.world.bottleBar.setPercentage(this.bottles);
    }
  }

  setThrowCooldown() {
    this.throwCooldown = true;
    setTimeout(() => {
      this.throwCooldown = false;
    }, 700);
  }

  handleJumpAnimation() {
    if (this.isAboveGround() && this.IMAGES_JUMPING) {
      this.playAnimation(this.IMAGES_JUMPING);
      return true;
    }
    return false;
  }

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

  playIdleAnimation(idleStartTime) {
    if (Date.now() - idleStartTime > 5000) {
      this.playAnimation(this.IMAGES_IDLE_LONG);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  moveRight() {
    super.moveRight();
    const stopX = this.world.level.level_end_x - 180;
    if (this.x > stopX) this.x = stopX;
  }

  hit() {
    const result = super.hit();
    console.log("[DEBUG] hit(): Character.hit ausgelöst", {
      energy: this.energy,
      lastHit: this.lastHit,
      function: "Character.hit",
    });
    return result;
  }

  isHurt() {
    const result = super.isHurt();
    if (result) {
      console.log("[DEBUG] isHurt(): Character.isHurt ausgelöst", {
        energy: this.energy,
        lastHit: this.lastHit,
        function: "Character.isHurt",
      });
    }
    return result;
  }
}
