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
    this.img.onload = () => {
      this.imageLoaded = true;
    };
    this.img.onerror = () => {
      this.imageLoaded = false;
    };
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
    if (
      this instanceof Character
    ) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x + 10 , this.y + 80, this.width - 25, this.height - 90);
      ctx.stroke();
    }
    if (this instanceof Chicken) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x , this.y + 5, this.width, this.height - 15);
      ctx.stroke();
    }
    if (this instanceof ChickenSmall) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "green";
      ctx.rect(this.x + 7 , this.y + 5 , this.width - 15, this.height - 10);
      ctx.stroke();
    }
     if (this instanceof Endboss) {
      ctx.beginPath();
      ctx.lineWidth = "2";
      ctx.strokeStyle = "black";
      ctx.rect(this.x + 7 , this.y + 60 , this.width - 10, this.height - 70);
      ctx.stroke();
    }
  }
}
