if (!window.GoldenEgg) {
  if (typeof CollectibleObject === "undefined")
    throw new Error("CollectibleObject fehlt");
  class GoldenEgg extends CollectibleObject {
    constructor(x, y) {
      super();
      this.x = x;
      this.y = y;
      this.width = 40;
      this.height = 60;
      this.img = new Image();
      this.img.src = "/assets/img/added-img/golden-egg.png";
      this.collected = false;
    }
    draw(ctx) {
      if (this.collected) return;
      const cx = this.x + this.width / 2,
        cy = this.y + this.height / 2,
        r = this.width * 0.7;
      ctx.save();
      ctx.globalAlpha = 0.6;
      let g = ctx.createRadialGradient(cx, cy, 5, cx, cy, r);
      g.addColorStop(0, "rgba(255,215,0,0.8)");
      g.addColorStop(1, "rgba(255,215,0,0.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.fillStyle = g;
      ctx.filter = "blur(8px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.globalAlpha = 1;
      ctx.restore();
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    collect() {
      this.collected = true;
      window.levelWon = true;
      console.log("Level gewonnen!");
    }
  }
  window.GoldenEgg = GoldenEgg;
}
