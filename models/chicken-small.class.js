class ChickenSmall extends MovableObject {

  height = 75;
  width = 75;
  y = 360;
  energy = 100;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["/assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super();
    this.loadImage(
      "/assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png"
    );
    this.x = 150 + Math.random() * 1900;
    this.speed = 1.25 + Math.random() * 4.55;
    this.animationSpeed = 100;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }
  offset = {
    top: 20,
    bottom: 25,
    left: 50,
    right: 50,
  };
  animate() {
    window.setStoppableInterval(() => {
      this.moveLeft();
    }, this.animationSpeed);
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      console.log("SMALL_CHICK_KILL");

      return;
    }
  }
    hitByBottle(bottle) {
    console.log("[DEBUG] ChickenSmall.hitByBottle() ausgelöst", {
      energy: this.energy,
    });
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
  hitByJump() {
    console.log("[DEBUG] ChickenSmall.hitByJump() ausgelöst", {
      energy: this.energy,
    });
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
}
