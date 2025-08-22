class Chicken extends MovableObject {
  height = 55;
  width = 70;
  y = 360;

  IMAGES_WALKING = [
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "/assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  constructor() {
    super();
    this.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    console.log("[DEBUG] Chicken erstellt:", { x: this.x });
    this.loadImages(this.IMAGES_WALKING, () => {
      this.animate();
    });
  }

  animate() {
    console.log("[DEBUG] Chicken.animate() gestartet");
    let frame = 0;
    const step = () => {
      if (typeof this.isDead === "function" && this.isDead()) return; // Stoppe Animation wenn tot
      this.moveLeft();
      if (frame % this.animationSpeed === 0) {
        this.playAnimation(this.IMAGES_WALKING);
      }
      frame++;
      requestAnimationFrame(step);
    };
    step();
  }
}
