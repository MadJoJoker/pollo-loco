class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 250;

  constructor() {
    super().loadImage("/assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 1900;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= 0.18;
        if (this.x < -this.width) {
      this.x = 600 + Math.random() * 200; // wiederholung der Wolken nur für den grund background//
        }
    }, 1000/60);
  }
}
