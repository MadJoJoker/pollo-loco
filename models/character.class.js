class Character extends MovableObject {
  height = 250;
  width = 180;
  y = 180;
  x = 10;
  speed = 10;
  animationSpeed = 50;

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

  world;
  // walking_sound = new Audio("/assets/audio/running.mp3");

  constructor(world) {
    super().loadImage("/assets/img/2_character_pepe/2_walk/W-21.png");
    this.world = world;
    console.log("[DEBUG] Character erstellt:", { world });
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
  }
  moveRight() {
    super.moveRight();
    const stopX = this.world.level.level_end_x - 180;
    if (this.x > stopX) {
      this.x = stopX;
    }
  }
  animate() {
    setInterval(() => {
      if (
        this.world?.keyboard?.RIGHT &&
        this.x < this.world.level.level_end_x
      ) {
        this.moveRight();
        this.otherDirection = false;
      }
      if (this.world?.keyboard?.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }
      if (this.world?.keyboard?.SPACE && !this.isAboveGround()) {
        this.jump();
      }
      if (this.isAboveGround() && this.IMAGES_JUMPING) {
        this.playAnimation(this.IMAGES_JUMPING);
      }
    }, 1000 / 60);
  }

  // damage = 20;
  // height = 250;
  // x = 0;
  // y = 80;
  // speedX = 5;
  // groundPos = 171;

  // lastIdle = new Date().getTime();
  // lastAttack = 0;

  // bottles = 0;
  // coins = 0;
  // throwBottles = [];

  // offset = {
  //   top: 120,
  //   bottom: 30,
  //   left: 40,
  //   right: 30,
  // };

  // AUDIOS = CHARACTER_ASSETS["AUDIOS"];
  // IMAGES = CHARACTER_ASSETS["IMAGES"];
  // PROPERTIES = CHARACTER_ASSETS["PROPERTIES"];

  // keyboard;
  // lastIdle = 0;
  // launching = false;
  // attacking = false;
  // landed = false;

  // moveRight() {
  //   this.lastIdle = 0;
  //   super.moveRight();
  //   super.otherDirection = false;
  // }

  // canMoveLeft() {
  //   return (
  //     this.isMovingLeft() &&
  //     this.x > 0 &&
  //     !(this.launching || this.attacking || this.landed)
  //   );
  // }

  // isMovingRight() {
  //   return this.keyboard.RIGHT; // Poor Control should be fixed, this does not...
  // }

  // moveLeft() {
  //   this.lastIdle = 0;
  //   super.moveLeft();
  //   super.otherDirection = true;
  // }

  // isMovingLeft() {
  //   return this.keyboard.LEFT; // Poor Control should be fixed, this does not...
  // }

  // canLaunch() {
  //   return this.keyboard.SPACE && (super.isAboveGround() || this.launching);
  // }

  // /**
  //  * @param {number} groundPos - new groundPos
  //  */
  // launch(groundPos) {
  //   this.lastIdle = 0;
  //   super.launch(groundPos);
  // }

  // land() {
  //   this.lastIdle = 0;
  //   super.land();
  // }

  // canAttack() {
  //   return (
  //     this.keyboard.D &&
  //     this.keyboard.THROW_REQUEST_START > this.keyboard.THROW_REQUEST_STOP
  //   );
  // }

  // stopAnimate() {
  //   super.stopGravity();
  //   super.stopAnimate();
  // }

  // move(timeStamp) {
  //   if (this.moveCharTime === undefined) {
  //     this.moveCharTime = timeStamp;
  //   }
  //   const elapse = timeStamp - this.moveCharTime;
  //   if (elapse > FRAMES_TIME) {
  //     this.moveCharTime = timeStamp;
  //     super.move(timeStamp);
  //   }
  // }

  // moveCharacter(timeStamp) {
  //   if (!super.isKilled()) {
  //     if (this.canMoveRight()) {
  //       this.moveRight();
  //     }
  //     if (this.canMoveLeft()) {
  //       this.moveLeft();
  //     }
  //     if (this.canLaunch()) {
  //       this.launch();
  //     }
  //     if (this.canAttack()) {
  //       this.attack();
  //     }
  //   } else {
  //     // ...
  //   }
  // }
}
