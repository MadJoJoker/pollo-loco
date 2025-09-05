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
  energy = 100;
  lastHit = 0;

  constructor() {
    super();
    this.loadImage;
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => (this.imageLoaded = true);
    this.img.onerror = () => {
      this.imageLoaded = false;
      console.error("[DEBUG] loadImage: Fehler beim Laden des Bildes", path);
    };
  }

  loadImages(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
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

  drawFrameOffset(ctx) {
    if (!this.offset) return;
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "White";
    ctx.rect(
      this.x + this.offset.left,
      this.y + this.offset.top,
      this.width - this.offset.left - this.offset.right,
      this.height - this.offset.top - this.offset.bottom
    );
    ctx.stroke();
    ctx.restore();
  }

  playAnimation(images) {
    if (this.isAboveGround() && images === this.IMAGES_WALKING) return;
    if (!this.lastAnimationTime) this.lastAnimationTime = Date.now();
    const now = Date.now();
    if (now - this.lastAnimationTime > this.animationSpeed) {
      this.currentImage = (this.currentImage + 1) % images.length;
      let path = images[this.currentImage];
      this.img = this.imageCache[path];
      this.lastAnimationTime = now;
    }
  }

  applyGravity() {
    window.setStoppableInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    if (this instanceof Character) return this.y < 180;
    return false;
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
      this.lastHit = Date.now();
      console.log("[DEBUG] Character hit() ausgelöst", {
        energy: this.energy,
        lastHit: this.lastHit,
      });
    }
  }

  isDead() {
    return this.energy === 0;
  }
  removeFromEnemies() {
    if (
      this.world &&
      this.world.level &&
      Array.isArray(this.world.level.enemies)
    ) {
      const idx = this.world.level.enemies.indexOf(this);
      if (idx !== -1) this.world.level.enemies.splice(idx, 1);
    }
  }

  isHurt() {
    let timepassed = (Date.now() - this.lastHit) / 1000;
    if (timepassed < 0.2) {
      console.log("[DEBUG] Character isHurt() ausgelöst", {
        lastHit: this.lastHit,
        timepassed,
      });
    }
    return timepassed < 0.2;
  }

  moveRight() {
    this.x += this.speed;
    if (this.IMAGES_WALKING) this.playAnimation(this.IMAGES_WALKING);
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.IMAGES_WALKING) this.playAnimation(this.IMAGES_WALKING);
  }

  jump() {
    this.speedY = 30;
    if (this.IMAGES_JUMPING) this.playAnimation(this.IMAGES_JUMPING);
  }
}
