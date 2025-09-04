class EndbossEffect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.img.src = "/assets/img/added-img/pow.png";
    this.opacity = 1;
    this.fadeSpeed = 0.03;
    this.done = false;
  }

  update() {
    if (this.opacity > 0) {
      this.opacity -= this.fadeSpeed;
    } else {
      this.done = true;
    }
  }

  draw(ctx) {
    if (this.done) return;
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}

window.EndbossEffect = EndbossEffect;
