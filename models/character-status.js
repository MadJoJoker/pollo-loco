/**
 * Handles status and health logic for the Character class.
 * @param {Character} character - The character instance to manage.
 */
class CharacterStatus {
  /**
   * Creates a CharacterStatus instance.
   * @param {Character} character - The character instance to manage.
   */
  constructor(character) {
    this.character = character;
  }

  /**
   * Plays the death animation for the character.
   * @param {Character} character - The character instance.
   */
  playDeathAnimation(character) {
    character.playAnimation(character.IMAGES_DEAD);
  }

  /**
   * Stops and resets the hurt audio if playing.
   * @param {Character} character - The character instance.
   */
  stopHurtAudio(character) {
    if (character.hurtAudio && !character.hurtAudio.paused) {
      character.hurtAudio.pause();
      character.hurtAudio.currentTime = 0;
    }
  }

  /**
   * Plays the death audio if not already played.
   * @param {Character} character - The character instance.
   */
  playDeathAudio(character) {
    if (!character._deathSoundPlayed && character.deathAudio?.paused) {
      character._deathSoundPlayed = true;
      character.deathAudio.currentTime = 0;
      character.deathAudio.muted = localStorage.getItem("polloMute") === "1";
      character.deathAudio.play().catch((err) => {
        if (window.DEBUG_AUDIO) {
          console.warn(
            "Audio playback failed: deathAudio could not be played. " +
              (err && err.message ? err.message : "")
          );
        }
      });
    }
  }

  /**
   * Redirects to the game over screen after a delay.
   * @param {Character} character - The character instance.
   */
  redirectGameOver(character) {
    if (!character._gameOverRedirected) {
      character._gameOverRedirected = true;
      const target = window.getGameTime() + 1000;
      const unregister = window.registerGameLoop((gameTime) => {
        if (gameTime >= target) {
          if (window.SPA && typeof window.SPA.navigate === "function") {
            window.SPA.navigate("/pages/game-over.html");
          } else {
            console.log("SPA navigation for game-over.html does not work");
          }
          unregister();
        }
      });
    }
  }

  /**
   * Handles the character death logic by delegating to single-responsibility methods.
   * @returns {boolean}
   */
  handleDeath() {
    if (this.character.isDead()) {
      this.playDeathAnimation(this.character);
      this.stopHurtAudio(this.character);
      this.playDeathAudio(this.character);
      this.redirectGameOver(this.character);
      return true;
    }
    return false;
  }

  /**
   * Plays the hurt animation for the character.
   * @param {Character} character - The character instance.
   */
  playHurtAnimation(character) {
    character.playAnimation(character.IMAGES_HURT);
  }

  /**
   * Plays the hurt audio if paused.
   * @param {Character} character - The character instance.
   */
  playHurtAudio(character) {
    if (character.hurtAudio?.paused) {
      character.hurtAudio.currentTime = 0;
      character.hurtAudio.muted = localStorage.getItem("polloMute") === "1";
      character.hurtAudio.play().catch((err) => {
        if (window.DEBUG_AUDIO) {
          console.warn(
            "Audio playback failed: hurtAudio could not be played. " +
              (err && err.message ? err.message : "")
          );
        }
      });
    }
  }

  /**
   * Pauses death audio after a delay.
   * @param {Character} character - The character instance.
   */
  pauseDeathAudioAfterDelay(character) {
    const unregister = window.registerGameLoop((gameTime) => {
      if (gameTime >= window.getGameTime() + 1000) {
        character.deathAudio?.pause();
        unregister();
      }
    });
  }

  /**
   * Handles the character hurt logic by delegating to single-responsibility methods.
   * @returns {boolean}
   */
  handleHurt() {
    if (this.character.isHurt()) {
      this.playHurtAnimation(this.character);
      this.playHurtAudio(this.character);
      this.pauseDeathAudioAfterDelay(this.character);
      return true;
    }
    return false;
  }
}

window.CharacterStatus = CharacterStatus;
