class StatusBar extends DrawableObject {
  x = 20;
  y = 20;
  width = 150;
  height = 50;

  IMAGES = [
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png", // 0
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png", // 1
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png", // 2
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png", // 3
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png", // 4
    "/assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png", // 5
  ];

  percentage = 100;

  constructor() {
    super();
    console.log("[DEBUG] StatusBar erstellt:", this);
    this.loadImages(this.IMAGES);
    this.img = this.imageCache[this.IMAGES[5]];
  }

  setPercentage(percentage) {
    this.percentage = percentage; // => 0 ... 5
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
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
