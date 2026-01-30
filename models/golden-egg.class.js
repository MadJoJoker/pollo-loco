if (!window.GoldenEgg) {
  if (typeof CollectibleObject === "undefined")
    throw new Error("CollectibleObject missing");
  /**
   * Represents the golden egg collectible in the game.
   * Triggers level win when collected.
   * @extends CollectibleObject
   */
  class GoldenEgg extends CollectibleObject {
    /**
     * Creates a new GoldenEgg instance.
     * @param {number} x - The x position of the golden egg.
     * @param {number} y - The y position of the golden egg.
     */
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
    /**
     * Draws the golden egg and its glow effect on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
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
    /**
     * Collects the golden egg, triggers level win, and redirects to win screen.
     */
    collect() {
      this.collected = true;
      window.levelWon = true;
      const target = window.getGameTime() + 400;
      const unregister = window.registerGameLoop((gameTime) => {
        if (gameTime >= target) {
          if (typeof window.openPage === "function") {
            window.openPage("win.html");
          } else {
            console.log("window.openPage('win.html') nicht verfügbar");
          }
          unregister();
        }
      });
    }
  }
  window.GoldenEgg = GoldenEgg;
}
