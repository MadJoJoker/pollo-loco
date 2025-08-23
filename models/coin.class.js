class Coin extends CollectibleObject {

  static randomArcCoins(arcs = 3) {
    const coins = [];
    function randomArcParams() {
      const startX = 50 + Math.random() * 1000;
      const endX = startX + 400 + Math.random() * 400;
      const peakY = 50 + Math.random() * 40;
      const baseY = 140 + Math.random() * 40;
      const count = 1 + Math.floor(Math.random() * 5);
      return { startX, endX, peakY, baseY, count };
    }
    for (let arc = 0; arc < arcs; arc++) {
      const params = randomArcParams();
      for (let i = 0; i < params.count; i++) {
        coins.push(new Coin(undefined, undefined, { ...params, index: i }));
      }
    }
    return coins;
  }
  height = 145;
  width = 145;
  y = 210;

  IMAGES_WALKING = [
    "/assets/img/8_coin/coin_1.png",
    "/assets/img/8_coin/coin_2.png",
  ];

  constructor(x = 200 + Math.random() * 1500, y = 210, arc = null) {
    super();
    if (arc) {
      const { startX, endX, peakY, baseY, count, index } = arc;
      const a = (baseY - peakY) / Math.pow((endX - startX) / 2, 2);
      const h = (startX + endX) / 2;
      x = startX + ((endX - startX) / (count - 1)) * index;
      y = a * Math.pow(x - h, 2) + peakY;
    }
    this.x = x;
    this.y = y;
    this.animationSpeed = 250;
    this.loadImage("/assets/img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_WALKING.length;
      let path = this.IMAGES_WALKING[this.currentImage];
      this.img = this.imageCache[path];
    }, this.animationSpeed);
  }
}
