class CollectibleObject extends MovableObject {
  x;
  y;
  img;
  imageLoaded = false;
  height = 50;
  width = 80;
  imageCache = {};
  currentImage = 0;
  otherDirection = false;
  animationSpeed = 120;
  collected = false;
  collectedItem = { bottles: 0, coins: 0 };
  

  constructor() {
    super();
    this.loadImage;
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

  // drawFrame(ctx){
  // if (
  //   this instanceof Bottle ||
  //   this instanceof Coin){
  //   ctx.save();
  //   ctx.beginPath();
  //   ctx.lineWidth = "2";
  //   ctx.strokeStyle = "red";
  //   ctx.rect(this.x, this.y, this.width, this.height);
  //   ctx.stroke();
  //   ctx.restore();
  // }

  animateScale(ctx, scale = 1.6, duration = 2000) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(scale, scale);
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
    this.draw(ctx);
    ctx.restore();

    setTimeout(() => {
      ctx.save();
      this.draw(ctx);
      ctx.restore();
    }, duration);
  }

  isCollidingCollection(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  isCollected() {
    return this.collected;
  }

  collect(type) {
    // if (!this.collected) {
    //   this.collected = true;
    //   if (type === "bottle") {
    //     this.collectedItem.bottles++;
    //   } else if (type === "coin") {
    //     this.collectedItem.coins++;
    //   }
    // Sound
  }

  isCollactable() {
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
}
