class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  x;

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
    this.animate();
    this.animationSpeed = 110;
    this.isWalking = false;
    this.isAttacking = false;
    this.isDeadNow = false;
    this.setRandomAction();
  }
  offset = {
    top: 90,
    bottom: 80,
    left: 50,
    right: 35,
  };
  setRandomAction() {
    setInterval(() => {
      const action = Math.floor(Math.random() * 3);
      this.isWalking = action === 1;
      this.isAttacking = action === 2;
     
    }, 1000);
  }

  animate() {
    setInterval(() => {
      const inRange =
        this.world &&
        this.world.character &&
        this.world.character.x >= this.level_end_x - 710;

      const oldX = this.x;
      const oldY = this.y;

      if (inRange && this.isAttacking) {
        this.animationSpeed = 170;

        this.jump();
        this.playAnimation(this.IMAGES_ATTACK);
        // this.y -= 5;
        // this.y = oldY;
        this.animationSpeed = 110;
      } else if (inRange && this.isWalking) {
        this.otherDirection = false;
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
        this.x -= 10;
        this.shouldMoveRight = true;
      } else if (this.shouldMoveRight) {
        if (this.x + 10 < 1900) {
          this.otherDirection = true;
          this.moveRight();
          this.x += 10;
        } else {
          this.shouldMoveRight = false;
        }
      } else if (inRange && this.isDeadNow) {
        this.isDead();
        this.playAnimation(this.IMAGES_DEAD);
      } else if (inRange) {
        this.animationSpeed = 170;

        this.playAnimation(this.IMAGES_ALERT);
        this.animationSpeed = 110;
      }
    }, this.animationSpeed);
  }
}
