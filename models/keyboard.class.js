/**
 * Represents the keyboard input state for the game.
 * Tracks which keys are currently pressed.
 */
class Keyboard {
  /**
   * Creates a new Keyboard instance with all keys set to false.
   */
  constructor() {}
  /** @type {boolean} */ LEFT = false;
  /** @type {boolean} */ RIGHT = false;
  /** @type {boolean} */ UP = false;
  /** @type {boolean} */ DOWN = false;
  /** @type {boolean} */ SPACE = false;
  /** @type {boolean} */ D = false;
}
