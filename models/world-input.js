/**
 * Handles input and control logic for the World class.
 * @param {World} world - The world instance.
 */
class WorldInput {
  constructor(world) {
    this.world = world;
    this.initKeyboardListeners();
    this.initTouchListeners();
  }

  /**
   * Initializes keyboard event listeners.
   */
  initKeyboardListeners() {
    window.addEventListener("keydown", (e) => this.handleKeyDown(e));
    window.addEventListener("keyup", (e) => this.handleKeyUp(e));
  }

  /**
   * Handles key down events.
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    if (!this.world.keyboard) return;
    switch (e.code) {
      case "ArrowLeft":
        this.world.keyboard.LEFT = true;
        break;
      case "ArrowRight":
        this.world.keyboard.RIGHT = true;
        break;
      case "Space":
        this.world.keyboard.SPACE = true;
        break;
      case "KeyD":
        this.world.keyboard.D = true;
        break;
    }
  }

  /**
   * Handles key up events.
   * @param {KeyboardEvent} e
   */
  handleKeyUp(e) {
    if (!this.world.keyboard) return;
    switch (e.code) {
      case "ArrowLeft":
        this.world.keyboard.LEFT = false;
        break;
      case "ArrowRight":
        this.world.keyboard.RIGHT = false;
        break;
      case "Space":
        this.world.keyboard.SPACE = false;
        break;
      case "KeyD":
        this.world.keyboard.D = false;
        break;
    }
  }

  /**
   * Initializes touch event listeners (for mobile controls).
   */
  initTouchListeners() {
    // Example: Add your touch event logic here
    // document.getElementById('leftButton').addEventListener('touchstart', ...)
  }
}

window.WorldInput = WorldInput;
