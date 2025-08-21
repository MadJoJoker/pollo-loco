class Cloud extends MovableObject {
  y = 14;
  width = 450;
  height = 250;

  constructor() {
    super().loadImage("/assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    console.log("[DEBUG] Cloud erstellt:", this);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.x -= 5;
    }, 1000);
  }
}
