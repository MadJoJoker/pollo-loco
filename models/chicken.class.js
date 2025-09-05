class Chicken extends MovableObject {
  height = 125;
  width = 105;
  y = 310;
  energy = 100;
  isDeadNow = false;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = [
    "/assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
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
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }
  offset = {
    top: 20,
    bottom: 10,
    left: 10,
    right: 10,
  };
  animate() {
    window.setStoppableInterval(() => {
      if (!this.isDeadNow) {
        this.moveLeft();
      }
    }, this.animationSpeed);
  }

  hitByBottle(bottle) {
    console.log("[DEBUG] hitByBottle(): Chicken.hitByBottle ausgelöst", {
      energy: this.energy,
      isDeadNow: this.isDeadNow,
    });
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      this.handleDeath();
    }
  }
  hitByJump() {
    console.log("[DEBUG] hitByJump(): Chicken.hitByJump ausgelöst", {
      energy: this.energy,
      isDeadNow: this.isDeadNow,
    });
    this.energy -= 100;
    if (this.energy <= 0 && !this.isDeadNow) {
      this.isDeadNow = true;
      console.log("[DEBUG] Chicken stirbt durch Sprung");
      this.handleDeath();
    }
  }

  handleDeath() {
    console.log(
      "[DEBUG] handleDeath() aufgerufen, Dead-Animation wird abgespielt"
    );
    this.currentImage = 0;
    this.img = this.imageCache[this.IMAGES_DEAD[0]];
    this.playAnimation(this.IMAGES_DEAD);
    if (!this.deadAnimationTimeout) {
      this.deadAnimationTimeout = setTimeout(() => {
        if (!this.isRemoved) {
          console.log("[DEBUG] Chicken wird entfernt");
          this.isRemoved = true;
          this.removeFromEnemies();
        }
      }, 2000); // Animation länger anzeigen
    }
  }
}
