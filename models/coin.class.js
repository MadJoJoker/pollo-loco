/**
 * Represents a collectible coin in the game.
 * Handles coin animation, placement, and arc generation.
 * @extends CollectibleObject
 */
class Coin extends CollectibleObject {
  static totalCoins = 0;

  height = 145;
  width = 145;
  y = 210;
  IMAGES_WALKING = [
    "/assets/img/8_coin/coin_1.png",
    "/assets/img/8_coin/coin_2.png",
  ];
  offset = { top: 60, bottom: 60, left: 65, right: 65 };

  /**
   * Creates a new Coin instance and initializes its position and animation.
   * If arc parameters are provided, places the coin along a parabolic arc.
   * @param {number} [x] - The x position of the coin.
   * @param {number} [y] - The y position of the coin.
   * @param {Object} [arc] - Arc parameters for parabolic placement.
   */
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
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    Coin.totalCoins++;
  }

  /**
   * Animates the coin by cycling through its images at a set interval.
   */
  animate() {
    this._unregisterGameLoop = window.registerSimpleAnimation({
      context: this,
      images: this.IMAGES_WALKING,
      interval: this.animationSpeed,
      isActive: () => true,
    });
  }

  /**
   * Generates coins placed along random parabolic arcs.
   * @param {number} [arcs=3] - Number of arcs to generate.
   * @returns {Coin[]} Array of Coin instances placed along arcs.
   */
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

  /**
   * Returns the total number of Coin instances created.
   * @returns {number} Total coins created.
   */
  static getTotalCoins() {
    return Coin.totalCoins;
  }
}
