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
    this.loadImage(
      "/assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png"
    );
    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    console.log("[DEBUG] Chicken erstellt:", { x: this.x });
    this.loadImages(this.IMAGES_WALKING, () => {
      this.animate();
    });
  }

  animate() {
    console.log("[DEBUG] Chicken.animate() gestartet");
    let firstLoaded = false;
    setInterval(() => {
      let i = this.currentImage % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[i];
      let img = this.imageCache[path];
      if (img && img.complete) {
        this.img = img;
        if (!firstLoaded) {
          console.log(
            "[DEBUG] Chicken Animation: Erstes Bild geladen und gesetzt:",
            path
          );
          firstLoaded = true;
        }
      } else {
        console.warn("[DEBUG] Chicken Animation: Bild nicht geladen", path);
      }
      this.currentImage++;
    }, 1000);
  }
}
