/**
 * Handles sound and audio logic for the World class.
 * @param {World} world - The world instance.
 */
class WorldAudio {
  constructor(world) {
    this.world = world;
    this.initAudio();
  }

  /**
   * Initializes audio elements.
   */
  initAudio() {
    this.world.backgroundMusic = new Audio(
      "/assets/audio/background-music.mp3"
    );
    this.world.backgroundMusic.loop = true;
    this.world.backgroundMusic.volume = 0.5;
    // Add more audio elements as needed
  }

  /**
   * Plays background music.
   */
  playBackgroundMusic() {
    if (this.world.backgroundMusic) {
      this.world.backgroundMusic.play();
    }
  }

  /**
   * Pauses background music.
   */
  pauseBackgroundMusic() {
    if (this.world.backgroundMusic) {
      this.world.backgroundMusic.pause();
    }
  }

  /**
   * Plays a sound effect.
   * @param {string} src - Path to the sound file.
   */
  playSoundEffect(src) {
    const audio = new Audio(src);
    audio.play();
  }
}

window.WorldAudio = WorldAudio;
