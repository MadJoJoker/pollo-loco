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

  /**
   * Draws a special frame for different object types (character, chicken, etc.).
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawFrame(ctx) {
    if (this instanceof Character) {
      this.drawCharacterFrame(ctx);
    }
    if (this instanceof Chicken) {
      this.drawChickenFrame(ctx);
    }
    if (this instanceof ChickenSmall) {
      this.drawChickenSmallFrame(ctx);
    }
    if (this instanceof Endboss) {
      this.drawEndbossFrame(ctx);
    }
  }

  /**
   * Draws a visual frame for the character object.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawCharacterFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 10, this.y + 80, this.width - 25, this.height - 90);
    ctx.stroke();
  }

  /**
   * Draws a visual frame for the chicken object.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawChickenFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x, this.y + 5, this.width, this.height - 15);
    ctx.stroke();
  }

  /**
   * Draws a visual frame for the small chicken object.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawChickenSmallFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 7, this.y + 5, this.width - 15, this.height - 10);
    ctx.stroke();
  }

  /**
   * Draws a visual frame for the endboss object.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
   */
  drawEndbossFrame(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.rect(this.x + 7, this.y + 60, this.width - 10, this.height - 70);
    ctx.stroke();
  }
}
