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

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 1900;
    this.animate();
    this.animationSpeed = 750;
  }
  offset = {
    top: 90,
    bottom: 80,
    left: 50,
    right: 35,
  }; // this.x + this.offset.left,
  //     this.y + this.offset.top,
  //     this.width - this.offset.left - this.offset.right,
  //     this.height - this.offset.top - this.offset.bottom
  animate() {
    setInterval(() => {
      if (
        this.world &&
        this.world.character &&
        this.world.character.x >= this.world.level.level_end_x - 710
      ) {
        this.playAnimation(this.IMAGES_ALERT);
      }

      if (this.isWalking) {
        this.moveLeft();
        this.playAnimation(this.IMAGES_WALKING);
      }
      if (this.isAttacking) {
        this.jump();
        this.playAnimation(this.IMAGES_ATTACK);
      }
    }, this.animationSpeed);
  }
}
