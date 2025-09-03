class ChickenSmall extends MovableObject {
  height = 75;
  width = 75;
  y = 360;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

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
    setInterval(() => {
      this.moveLeft();
    }, this.animationSpeed);
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        console.log('SMALL_CHICK_KILL');
        
        return;
      }
  }
}
