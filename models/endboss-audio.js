/**
 * Handles audio logic for the Endboss class.
 * @param {Endboss} endboss - The endboss instance.
 */
class EndbossAudio {
  constructor(endboss) {
    this.endboss = endboss;
    this.initAudio();
  }

  /**
   * Initializes audio elements.
   */
  initAudio() {
    this.endboss.attackAudio = new Audio("/assets/audio/endboss-attack.mp3");
    this.endboss.hurtAudio = new Audio("/assets/audio/endboss-hurt.mp3");
    this.endboss.deathAudio = new Audio("/assets/audio/endboss-dead.mp3");
  }

  /**
   * Plays attack sound.
   */
  playAttack() {
    this.endboss.attackAudio.play();
  }

  /**
   * Plays hurt sound.
   */
  playHurt() {
    this.endboss.hurtAudio.play();
  }

  /**
   * Plays death sound.
   */
  playDeath() {
    this.endboss.deathAudio.play();
  }
}

window.EndbossAudio = EndbossAudio;
