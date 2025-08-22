class Chicken extends MovableObject {
  height = 125;
  width = 105;
  y = 310;



  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
  super();
  this.loadImage('/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
  this.x = 150 + Math.random() * 1900;
  this.speed = 1.25 + Math.random() * 3.55;
  this.animationSpeed = 90;
  this.loadImages(this.IMAGES_WALKING);
  this.animate();
  }

animate() {
  setInterval(() => {
    this.moveLeft();
  }, this.animationSpeed);
}
}
