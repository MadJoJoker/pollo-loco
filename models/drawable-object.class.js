class DrawableObject {
  constructor() {
    console.log("[DEBUG] DrawableObject erstellt:", this);
  }
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 300;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }
  loadImages(paths) {
    paths.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
  draw(ctx) {
    if (this.img && this.img instanceof HTMLImageElement && this.img.complete) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
      console.warn('[DEBUG] draw() übersprungen, img nicht geladen:', this);
    }
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }
}
