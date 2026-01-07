/**
 * Handles movement logic for the Character class.
 * @param {Character} character - The character instance.
 */
class CharacterMovement {
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles left/right movement and walking sound.
   * @returns {boolean} True if character moved.
   */
  handleMovement() {
    let isMoving = false;
    if (this.character.shouldMoveRight()) {
      this.character.moveRight();
      this.character.otherDirection = false;
      isMoving = true;
    }
    if (this.character.shouldMoveLeft()) {
      this.character.moveLeft();
      this.character.otherDirection = true;
      isMoving = true;
    }
    if (this.character.walkingAudio) {
      this.character.walkingAudio.loop = true;
      if (
        isMoving &&
        !this.character.isAboveGround() &&
        this.character.walkingAudio.paused
      ) {
        this.character.walkingAudio.muted =
          localStorage.getItem("polloMute") === "1";
        this.character.walkingAudio.play().catch((err) => {
          if (window.DEBUG_AUDIO) {
            console.warn(
              "Audio playback failed: walkingAudio could not be played. " +
                (err && err.message ? err.message : "")
            );
          }
        });
      }
      if (
        (!isMoving || this.character.isAboveGround()) &&
        !this.character.walkingAudio.paused
      ) {
        this.character.walkingAudio.pause();
        this.character.walkingAudio.currentTime = 0;
      }
    }
    return isMoving;
  }

  /**
   * Checks if character should move right.
   * @returns {boolean}
   */
  shouldMoveRight() {
    return (
      this.character.world?.keyboard?.RIGHT &&
      this.character.x < this.character.world.level.level_end_x
    );
  }

  /**
   * Checks if character should move left.
   * @returns {boolean}
   */
  shouldMoveLeft() {
    return this.character.world?.keyboard?.LEFT && this.character.x > 0;
  }

  /**
   * Moves character right, respecting level bounds.
   */
  moveRight() {
    this.character.moveRight();
    const stopX = this.character.world.level.level_end_x - 180;
    if (this.character.x > stopX) this.character.x = stopX;
  }
}

window.CharacterMovement = CharacterMovement;
