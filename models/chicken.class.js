class Chicken extends MovableObject {
  height = 125;
  width = 105;
  y = 310;
  energy = 100;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super();
    this.loadImage(
      "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.x = 150 + Math.random() * 1900;
    this.speed = 1.25 + Math.random() * 3.55;
    this.animationSpeed = 90;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }
  offset = {
    top: 40,
    bottom: 30,
    left: 30,
    right: 30,
  };
  animate() {
    window.setStoppableInterval(() => {
      this.moveLeft();
    }, this.animationSpeed);
  }

  hitByBottle(bottle) {
    this.energy -= 50;
    this.isHurt();
    if (this.energy <= 0) {
      console.log("Chicken energy is 0 or less:", this.energy);
      this.isHurt();
    }
  }
}
