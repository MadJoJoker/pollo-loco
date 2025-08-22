class MovableObject extends DrawableObject {
  x = 120;
  y = 280;
  img;
  imageLoaded = false;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15;
  otherDirection = false;
  // acceleration = 2.5;

  constructor() {
    super();
    this.loadImage;
    console.log("[DEBUG] MovableObject erstellt:", this);
  }

  // energy = 100;
  // lastHit = 0;
  // hit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => {
      this.imageLoaded = true;
      console.log("[DEBUG] loadImage: Bild geladen", path);
    };
    this.img.onerror = () => {
      this.imageLoaded = false;
      console.error("[DEBUG] loadImage: Fehler beim Laden des Bildes", path);
    };
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    if (this.img?.complete && this.imageLoaded) {
      console.debug(
        "[DEBUG] draw() img:",
        this.img,
        "src:",
        this.img.src,
        "class:",
        this.constructor.name
      );
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } else {
      console.warn("[DEBUG] draw() übersprungen, img nicht geladen:", this);
    }
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Endboss
    ) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy === 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];

    if (this.img && this.img.complete) {
      this.imageLoaded = true;
    } else {
      this.imageLoaded = false;
    }
    this.currentImage++;
  }
  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
