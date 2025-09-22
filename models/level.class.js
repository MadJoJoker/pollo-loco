/**
 * Represents a game level, containing all objects and enemies.
 */
class Level {
  /**
   * The x position where the level ends.
   * @type {number}
   */
  level_end_x = 719 * 3;

  /**
   * Creates a new Level instance.
   * @param {MovableObject[]} [enemies=[]] - Array of enemy objects.
   * @param {Cloud[]} [clouds=[]] - Array of cloud objects.
   * @param {BackgroundObject[]} [backgroundObjects=[]] - Array of background objects.
   * @param {Bottle[]} [bottles=[]] - Array of bottle objects.
   * @param {Coin[]} [coins=[]] - Array of coin objects.
   */
  constructor(
    enemies = [],
    clouds = [],
    backgroundObjects = [],
    bottles = [],
    coins = []
  ) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }
}
