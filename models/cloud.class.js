/**
 * Represents a moving cloud in the game background.
 * Handles cloud animation and movement.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 50;
  width = 450;
  height = 250;

  /**
   * Creates a new Cloud instance and initializes its position and animation.
   */
  constructor() {
    super().loadImage("/assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 1900;
    this.animate();
  }

  /**
   * Animates the cloud by moving it left and resetting its position when off-screen.
   */
  animate() {
    window.setStoppableInterval(() => {
      this.x -= 0.18;
      if (this.x < -this.width) {
        this.x = 600 + Math.random() * 200;
      }
    }, 1000 / 60);
  }
}
