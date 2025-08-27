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
  world;
  // walking_sound = new Audio("/assets/audio/running.mp3");

  constructor(world) {
    super().loadImage("/assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_IDLE_LONG);
    this.applyGravity();
    this.animate();
  }
  offset = {
    top: 130,
    bottom: 30,
    left: 60,
    right: 60,
  };
  moveRight() {
    super.moveRight();
    const stopX = this.world.level.level_end_x - 180;
    if (this.x > stopX) {
      this.x = stopX;
    }
  }
  animate() {
    let idleStartTime = Date.now();
    let isIdleLongActive = false;

    let canThrowBottle = true;
    setInterval(() => {
      let actionHappened = false;
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        return;
      }
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        return;
      }
      if (
        this.world?.keyboard?.RIGHT &&
        this.x < this.world.level.level_end_x
      ) {
        this.moveRight();
        this.otherDirection = false;
        this.playAnimation(this.IMAGES_WALKING);
        actionHappened = true;
      }
      if (this.world?.keyboard?.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
        this.playAnimation(this.IMAGES_WALKING);
        actionHappened = true;
      }
      if (this.world?.keyboard?.SPACE && !this.isAboveGround()) {
        this.jump();
        this.playAnimation(this.IMAGES_JUMPING);
        actionHappened = true;
      }
      if (this.world?.keyboard?.D && canThrowBottle) {
        const bottleX = this.otherDirection
          ? this.x + this.offset.left // links
          : this.x + this.width - this.offset.right; // rechts
        const bottleY = this.y + this.height / 2;
        const bottle = new ThrowableObject(
          bottleX,
          bottleY,
          this.otherDirection
        );
        bottle.throw();
        if (this.throwBottles) {
          this.throwBottles.push(bottle);
        }
        canThrowBottle = false;
        actionHappened = true;
      }
      if (!this.world?.keyboard?.D) {
        canThrowBottle = true;
      }
      if (this.isAboveGround() && this.IMAGES_JUMPING) {
        this.playAnimation(this.IMAGES_JUMPING);
        actionHappened = true;
      }
      if (actionHappened) {
        idleStartTime = Date.now();
        isIdleLongActive = false;
      }
    }, 1000 / 45);

    setInterval(() => {
      if (
        !this.world?.keyboard?.RIGHT &&
        !this.world?.keyboard?.LEFT &&
        !this.world?.keyboard?.SPACE &&
        !this.isAboveGround()
      ) {
        if (Date.now() - idleStartTime > 3000) {
          this.playAnimation(this.IMAGES_IDLE_LONG);
          isIdleLongActive = true;
        } else {
          this.playAnimation(this.IMAGES_IDLE);
        }
      }
    }, 300);
  }
}
