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
    this.deathAudio = new Audio("/assets/audio/short-chick-sound-171389.mp3");
    this.animate();
  }
  offset = {
    top: 0,
    bottom: 25,
    left: 60,
    right: 60,
  };
  animate() {
    window.setStoppableInterval(() => {
      if (!this.isDeadNow) {
        this.moveLeft();
      }
    }, this.animationSpeed);
  }

  handleDeath() {

    if (this.deathAudio) {
      this.deathAudio.currentTime = 0;
      this.deathAudio.muted = localStorage.getItem("polloMute") === "1";
      this.deathAudio.play();
    }
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.deadAnimationTimeout) {
      this.deadAnimationTimeout = setTimeout(() => {
        if (!this.isRemoved) {
          this.isRemoved = true;
          this.removeFromEnemies();
        }
      }, 2000);
    }
  }
  hitByBottle(bottle) {

    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
  hitByJump() {

    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
}
