/**
 * Base class for all drawable objects in the game.
 * Handles image loading, drawing, and frame drawing for different object types.
 */
class DrawableObject {
  img;
  imageCache = [];
  currentImage = 0;
  x = 120;
  y = 300;
  height = 150;
  width = 100;

  /**
   * Creates a new DrawableObject instance.
   */
  constructor() {}

  /**
   * Loads a single image for the drawable object.
   * @param {string} path - The path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
    this.img.onload = () => (this.imageLoaded = true);
    this.img.onerror = () => (this.imageLoaded = false);
  }

  /**
   * Loads multiple images for the drawable object.
   * @param {string[]} paths - Array of image paths.
   */
  loadImages(paths) {
    paths.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the object on the canvas if the image is loaded.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  draw(ctx) {
    if (this.img && this.img.complete && this.imageLoaded) {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  }


}
