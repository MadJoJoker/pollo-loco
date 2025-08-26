class StatusBar extends DrawableObject {
  x = 20;
  y = 20;
  width = 150;
  height = 50;
  percentage = 40;
  imageCache_BOTTLES = [];
  imageCache_COINS = [];

  IMAGES_HEALTH = [
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];
  IMAGES_BOTTLES = [
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
  ];
  IMAGES_COINS = [
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
  ];

  constructor(x = 20, y = 0, width = 150, height = 50, type = "health") {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    if (type === "health") this.IMAGES_USED = this.IMAGES_HEALTH;
    if (type === "bottle") this.IMAGES_USED = this.IMAGES_BOTTLES;
    if (type === "coin") this.IMAGES_USED = this.IMAGES_COINS;
    this.loadImages(this.IMAGES_USED);
    this.loadImage(this.IMAGES_USED[5]);
  }
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_USED[this.resolveImageIndex()];
    this.loadImage(path);
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    ctx.font = "24px 'GringoNights', Arial, sans-serif";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    if (
      this.IMAGES_USED === this.IMAGES_BOTTLES ||
      this.IMAGES_USED === this.IMAGES_COINS
    ) {
      ctx.fillText(
        this.percentage === 0 ? "0" : String(this.percentage),
        this.x + this.width - 10,
        this.y + this.height / 2 + 8
      );
    }
    if (this.IMAGES_USED === this.IMAGES_HEALTH) {
      ctx.fillText(
        `${this.percentage}%`,
        this.x + this.width - 10,
        this.y + this.height / 2 + 8
      );
    }
  }

  resolveImageIndex() {
    if (this.percentage === 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
