class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 300;
  height = 150;
  width = 100;

  constructor() {}

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => this.imageLoaded = true;
    this.img.onerror = () => this.imageLoaded = false;
  }

  loadImages(paths) {
    paths.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    if (this.img && this.img.complete && this.imageLoaded) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  drawFrame(ctx) {
    if (this instanceof Character) {
      this.drawCharacterFrame(ctx);
    }
    if (this instanceof Chicken) {
      this.drawChickenFrame(ctx);
    }
    if (this instanceof ChickenSmall) {
      this.drawChickenSmallFrame(ctx);
    }
    if (this instanceof Endboss) {
      this.drawEndbossFrame(ctx);
    }
  }

  drawCharacterFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 10, this.y + 80, this.width - 25, this.height - 90);
    ctx.stroke();
  }

  drawChickenFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x, this.y + 5, this.width, this.height - 15);
    ctx.stroke();
  }

  drawChickenSmallFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 7, this.y + 5, this.width - 15, this.height - 10);
    ctx.stroke();
  }

  drawEndbossFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 7, this.y + 60, this.width - 10, this.height - 70);
    ctx.stroke();
  }
}
