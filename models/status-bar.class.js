class StatusBar extends DrawableObject {
  x = 20;
  y = 20;
  width = 150;
  height = 50;
  percentage = 40;
  imageCache_BOTTLES = [];
  imageCache_COINS = [];

  IMAGES_HEALTH = [
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png", // 0
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png", // 1
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png", // 2
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png", // 3
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png", // 4
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png", // 5
  ];
  IMAGES_BOTTLES = [
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png", // 0
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png", // 1
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png", // 2
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png", // 3
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png", // 4
    "/assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png", // 5
  ];
  IMAGES_COINS = [
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png", // 0
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png", // 1
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png", // 2
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png", // 3
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png", // 4
    "/assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png", // 5
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
    this.loadImage(this.IMAGES_USED[5]); // ensures imageLoaded is set
  }
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_USED[this.resolveImageIndex()];
    this.loadImage(path); // ensures imageLoaded is set
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
