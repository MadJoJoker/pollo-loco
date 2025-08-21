class Level {
  enemies = [];
  clouds = [];
  backgroundObjects = [];

  constructor(...args) {
    this.enemies = [];
    this.clouds = [];
    this.backgroundObjects = [];
    args.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((obj) => {
        if (obj instanceof Chicken || obj instanceof Endboss) {
          this.enemies.push(obj);
        } else if (obj instanceof Cloud) {
          this.clouds.push(obj);
        } else if (obj instanceof BackgroundObject) {
          this.backgroundObjects.push(obj);
        }
      });
    });
    console.log("[DEBUG] Level erstellt:", this);
  }
}
