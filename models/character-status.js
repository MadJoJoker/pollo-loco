/**
 * Handles status and health logic for the Character class.
 * @param {Character} character - The character instance.
 */
class CharacterStatus {
  constructor(character) {
    this.character = character;
  }

  /**
   * Handles death animation, sound, and game over.
   * @returns {boolean}
   */
  handleDeath() {
    if (this.character.isDead()) {
      this.character.playAnimation(this.character.IMAGES_DEAD);
      if (this.character.hurtAudio && !this.character.hurtAudio.paused) {
        this.character.hurtAudio.pause();
        this.character.hurtAudio.currentTime = 0;
      }
      if (
        !this.character._deathSoundPlayed &&
        this.character.deathAudio?.paused
      ) {
        this.character._deathSoundPlayed = true;
        this.character.deathAudio.currentTime = 0;
        this.character.deathAudio.muted =
          localStorage.getItem("polloMute") === "1";
        this.character.deathAudio.play().catch((err) => {
          if (window.DEBUG_AUDIO) {
            console.warn(
              "Audio playback failed: deathAudio could not be played. " +
                (err && err.message ? err.message : "")
            );
          }
        });
      }
      if (!this.character._gameOverRedirected) {
        this.character._gameOverRedirected = true;
        const target = window.getGameTime() + 1000;
        const unregister = window.registerGameLoop((gameTime) => {
          if (gameTime >= target) {
            if (window.SPA && typeof window.SPA.navigate === "function") {
              window.SPA.navigate("/pages/game-over.html");
            } else if (typeof window.showEndOverlay === "function") {
              window.showEndOverlay("pages/game-over.html");
            } else {
              console.log("Overlay für game-over.html funktioniert nicht");
            }
            unregister();
          }
        });
      }
      return true;
    }
    return false;
  }

  /**
   * Handles hurt animation and sound.
   * @returns {boolean}
   */
  handleHurt() {
    if (this.character.isHurt()) {
      this.character.playAnimation(this.character.IMAGES_HURT);
      if (this.character.hurtAudio?.paused) {
        this.character.hurtAudio.currentTime = 0;
        this.character.hurtAudio.muted =
          localStorage.getItem("polloMute") === "1";
        this.character.hurtAudio.play().catch((err) => {
          if (window.DEBUG_AUDIO) {
            console.warn(
              "Audio playback failed: hurtAudio could not be played. " +
                (err && err.message ? err.message : "")
            );
          }
        });
        const unregister = window.registerGameLoop((gameTime) => {
          if (gameTime >= window.getGameTime() + 1000) {
            this.character.deathAudio?.pause();
            unregister();
          }
        });
      }
      return true;
    }
    return false;
  }
}

window.CharacterStatus = CharacterStatus;
