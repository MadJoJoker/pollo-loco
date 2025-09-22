/**
 * Represents a background object in the game.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  x;
  y;
  width = 720;
  height = 400;

  /**
   * Creates a new BackgroundObject.
   * @param {string} imagePath - The path to the background object's image.
   * @param {number} [x=619] - The X position of the object.
   * @param {number} [y=220] - The Y position of the object.
   * @param {number} [width] - The width of the object.
   * @param {number} [height] - The height of the object.
   */
  constructor(imagePath, x = 619, y = 220, width, height) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = y;
  }
}
