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
  acceleration = 2.5;
  animationSpeed = 120;

  constructor() {
    super();
    this.loadImage;
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
    } else if (this instanceof Character) {
      return this.y < 180;
    } else {
      return false;
    }
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => {
      this.imageLoaded = true;
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
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }

  // drawFrame(ctx) {
  //   if (
  //     this instanceof Character ||
  //     this instanceof Chicken ||
  //     this instanceof Endboss || ChickenSmall
  //   ) {
  //     ctx.beginPath();
  //     ctx.lineWidth = "2";
  //     ctx.strokeStyle = "blue";
  //     ctx.rect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }

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
    if (this.isAboveGround() && images === this.IMAGES_WALKING) return;
    if (!this.lastAnimationTime) this.lastAnimationTime = Date.now();
    const now = Date.now();
    if (now - this.lastAnimationTime > this.animationSpeed) {
      this.currentImage++;
      if (this.currentImage >= images.length) this.currentImage = 0;
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.lastAnimationTime = now;
    }
  }
  moveRight() {
    this.x += this.speed;
    if (this.IMAGES_WALKING) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.IMAGES_WALKING) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  jump() {
    this.speedY = 30;
    if (this.IMAGES_JUMPING) {
      this.playAnimation(this.IMAGES_JUMPING);
    }
  }

}
