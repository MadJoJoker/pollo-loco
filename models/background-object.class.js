class BackgroundObject extends MovableObject {
  x = 0;
  y = 0;
  width = 100;
  height = 170;

  constructor(imagePath, x = 0, y = 220) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    console.log("[DEBUG] BackgroundObject erstellt:", { imagePath, x, y });
  }
}
