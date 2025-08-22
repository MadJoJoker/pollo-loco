class Coin extends CollectibleObject {
  height = 45;
  width = 45;
  y = 180;



  IMAGES_COINS= [
    "/assets/img/8_coin/coin_1.png",
    "/assets/img/8_coin/coin_2.png",
  ];

  constructor() {
  super();
  this.loadImage('/assets/img/8_coin/coin_1.png');
  this.x = 200 + Math.random() * 500;
  this.animationSpeed = 250;
  this.loadImages(this.IMAGES_COINS);
  this.animate();
  }

animate() {
  setInterval(() => {
    this.jump();
  }, this.animationSpeed);
}
}
// placeCoinsArc(startX, endX, peakY, baseY, count) {
//   let coins = [];
//   let a = (baseY - peakY) / Math.pow((endX - startX) / 2, 2);
//   let h = (startX + endX) / 2;
//   for (let i = 0; i < count; i++) {
//     let x = startX + ((endX - startX) / (count - 1)) * i;
//     let y = a * Math.pow(x - h, 2) + peakY;
//     coins.push(new Coin(x, y));
//   }
//   return coins;
// }
