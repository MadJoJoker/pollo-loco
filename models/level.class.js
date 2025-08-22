class Level {
  level_end_x = 719 * 3;
  constructor(enemies = [], clouds = [], backgroundObjects = []) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    console.log("[DEBUG] Level erstellt:", this);
  }
}
