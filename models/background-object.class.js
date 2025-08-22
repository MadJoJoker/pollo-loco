class BackgroundObject extends MovableObject {
  x;
  y;
  width = 720;
  height = 400;

  constructor(imagePath, x = 619, y = 220 , width , height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
    console.log("[DEBUG] BackgroundObject erstellt:", { imagePath, x, y });
  }
}
