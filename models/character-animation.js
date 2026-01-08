/**
 * Handles all animation logic for the Character class.
 * @param {Object} params - Animation parameters and references.
 * @param {Character} params.character - The character instance to animate.
 * @param {function} params.getGameTime - Function to get the current game time.
 * @param {function} params.registerGameLoop - Function to register a game loop callback.
 */
class CharacterAnimation {
  /**
   * Creates a CharacterAnimation instance.
   * @param {Object} params - Animation parameters and references.
   * @param {Character} params.character - The character instance to animate.
   * @param {function} params.getGameTime - Function to get the current game time.
   * @param {function} params.registerGameLoop - Function to register a game loop callback.
   */
  constructor({ character, getGameTime, registerGameLoop }) {
    this.character = character;
    this.getGameTime = getGameTime;
    this.registerGameLoop = registerGameLoop;
    this.initAnimationState();
  }

  /** Initializes animation state variables. */
  initAnimationState() {
    this.idleStartTime = this.getGameTime();
    this.lastActionTick = this.getGameTime();
    this.lastIdleTick = this.getGameTime();
    this.lastWalkTick = this.getGameTime();
    this.lastJumpTick = this.getGameTime();
    this.lastIdleAnimTick = this.getGameTime();
    this.walkAnimFrame = 0;
    this.jumpAnimFrame = 0;
    this.idleAnimFrame = 0;
    this.idleLongAnimFrame = 0;
    this.currentAnimState = "idle";
    this.wasWalking = false;
    this.wasJumping = false;
  }

  /**
   * Handles character actions and updates idle start time.
   * @param {number} gameTime - Current game time.
   * @param {number} actionInterval - Interval for actions.
   */
  handleActions(gameTime, actionInterval) {
    if (gameTime - this.lastActionTick >= actionInterval) {
      const actionHappened = this.character.handleActions(true);
      if (actionHappened) this.idleStartTime = gameTime;
      this.lastActionTick = gameTime;
    }
  }

  /**
   * Handles dead or hurt animation state.
   * @returns {boolean} True if character is dead or hurt.
   */
  handleDeadOrHurtState() {
    if (this.character.isDead() || this.character.isHurt()) {
      if (this.currentAnimState !== "dead-hurt") {
        this.currentAnimState = "dead-hurt";
      }
      return true;
    }
    return false;
  }

  /**
   * Handles jumping animation state.
   * @param {number} gameTime - Current game time.
   * @param {number} jumpInterval - Interval for jump animation.
   */
  handleJumping(gameTime, jumpInterval) {
    if (this.isJumping()) {
      this.initJumpingState(gameTime);
      this.updateJumpAnimation(gameTime, jumpInterval);
      this.setJumpingTrue();
      return true;
    }
    this.setJumpingFalse();
    return false;
  }

  isJumping() {
    return this.character.isAboveGround();
  }

  initJumpingState(gameTime) {
    if (!this.wasJumping) {
      this.jumpAnimFrame = 0;
      this.lastJumpTick = gameTime;
      this.currentAnimState = "jumping";
    }
  }

  setJumpingTrue() {
    this.wasJumping = true;
  }

  setJumpingFalse() {
    this.wasJumping = false;
  }

  /**
   * Handles walking animation state.
   * @param {number} gameTime - Current game time.
   * @param {number} walkInterval - Interval for walk animation.
   */
  handleWalking(gameTime, walkInterval) {
    if (this.shouldWalk()) {
      this.initWalkingState(gameTime);
      this.updateWalkingFrame(gameTime, walkInterval);
      this.setWalkingTrue();
      return true;
    }
    this.setWalkingFalse();
    return false;
  }

  shouldWalk() {
    return (
      (this.character.shouldMoveLeft() || this.character.shouldMoveRight()) &&
      this.character.isAboveGround() === false
    );
  }

  initWalkingState(gameTime) {
    if (!this.wasWalking || this.currentAnimState !== "walking") {
      this.walkAnimFrame = 0;
      this.lastWalkTick = gameTime;
      this.currentAnimState = "walking";
    }
  }

  updateWalkingFrame(gameTime, walkInterval) {
    if (gameTime - this.lastWalkTick >= walkInterval) {
      this.walkAnimFrame =
        (this.walkAnimFrame + 1) % this.character.IMAGES_WALKING.length;
      this.character.img =
        this.character.imageCache[
          this.character.IMAGES_WALKING[this.walkAnimFrame]
        ];
      this.lastWalkTick = gameTime;
    }
  }

  setWalkingTrue() {
    this.wasWalking = true;
  }

  setWalkingFalse() {
    this.wasWalking = false;
  }

  /**
   * Handles idle animation state.
   * @param {number} gameTime - Current game time.
   * @param {number} idleInterval - Interval for idle animation.
   */
  handleIdle(gameTime, idleInterval) {
    this.initIdleState();
    this.updateIdleFrame(gameTime, idleInterval);
  }

  initIdleState() {
    if (this.currentAnimState !== "idle") {
      this.idleAnimFrame = 0;
      this.idleLongAnimFrame = 0;
      this.currentAnimState = "idle";
    }
  }

  updateIdleFrame(gameTime, idleInterval) {
    if (gameTime - this.lastIdleTick >= idleInterval) {
      this.setIdleFrame(gameTime);
      this.lastIdleTick = gameTime;
    }
  }

  setIdleFrame(gameTime) {
    this.character.handleIdle(this.idleStartTime, gameTime, {
      idleAnimFrameRef: () => this.idleAnimFrame,
      setIdleAnimFrame: (v) => {
        this.idleAnimFrame = v;
      },
      idleLongAnimFrameRef: () => this.idleLongAnimFrame,
      setIdleLongAnimFrame: (v) => {
        this.idleLongAnimFrame = v;
      },
      lastIdleAnimTickRef: () => this.lastIdleAnimTick,
      setLastIdleAnimTick: (v) => {
        this.lastIdleAnimTick = v;
      },
    });
  }

  /**
   * Starts the animation loop for the character.
   */
  start() {
    const actionInterval = 1000 / 45;
    const idleInterval = 300;
    const walkInterval = this.character.animationSpeed;
    const jumpInterval = 80;
    this._unregisterGameLoop = this.registerGameLoop((gameTime) => {
      this.runAnimationLoop(
        gameTime,
        actionInterval,
        idleInterval,
        walkInterval,
        jumpInterval
      );
    });
  }

  runAnimationLoop(
    gameTime,
    actionInterval,
    idleInterval,
    walkInterval,
    jumpInterval
  ) {
    this.handleActions(gameTime, actionInterval);
    if (this.handleDeadOrHurtState()) return;
    if (this.handleJumping(gameTime, jumpInterval)) return;
    if (this.handleWalking(gameTime, walkInterval)) return;
    this.handleIdle(gameTime, idleInterval);
  }

  /**
   * Calculates the jump frame for upward movement.
   * @param {number} speedY - The current vertical speed.
   * @param {number} maxSpeedY - The maximum vertical speed.
   * @returns {number} The calculated frame index for jumping up.
   */
  calculateJumpUpFrame(speedY, maxSpeedY) {
    const upFrames = 4;
    const progress = 1 - Math.min(speedY / maxSpeedY, 1);
    let frame = Math.floor(progress * upFrames);
    return Math.min(frame, 3);
  }

  /**
   * Calculates the jump frame for downward movement.
   * @param {number} speedY - The current vertical speed.
   * @param {number} maxSpeedY - The maximum vertical speed.
   * @returns {number} The calculated frame index for falling down.
   */
  calculateJumpDownFrame(speedY, maxSpeedY) {
    const downFrames = 5;
    const downStartFrame = 4;
    const progress = Math.min(Math.abs(speedY) / maxSpeedY, 1);
    let frame = downStartFrame + Math.floor(progress * downFrames);
    return Math.min(frame, 8);
  }

  /**
   * Sets the character's jump image based on the current frame.
   * @param {number} frame - The frame index to display.
   */
  setJumpImage(frame) {
    this.character.img =
      this.character.imageCache[this.character.IMAGES_JUMPING[frame]];
  }

  /**
   * Updates jump animation based on jump phase (speedY).
   * @param {number} gameTime - Current game time.
   * @param {number} jumpInterval - Interval for jump animation.
   */
  updateJumpAnimation(gameTime, jumpInterval) {
    if (this.shouldUpdateJump(gameTime, jumpInterval)) {
      this.updateJumpFrame();
      this.setJumpImage(this.jumpAnimFrame);
      this.lastJumpTick = gameTime;
    }
  }

  shouldUpdateJump(gameTime, jumpInterval) {
    return gameTime - this.lastJumpTick >= jumpInterval;
  }

  updateJumpFrame() {
    const maxSpeedY = 50;
    if (this.character.speedY > 0) {
      this.jumpAnimFrame = this.calculateJumpUpFrame(
        this.character.speedY,
        maxSpeedY
      );
    } else {
      this.jumpAnimFrame = this.calculateJumpDownFrame(
        this.character.speedY,
        maxSpeedY
      );
    }
    this.jumpAnimFrame = Math.max(this.jumpAnimFrame, 0);
  }
}

window.CharacterAnimation = CharacterAnimation;
