/**
 * Handles all animation logic for the Character class.
 * @param {Object} params - Animation parameters and references.
 * @param {Character} params.character - The character instance.
 * @param {function} params.getGameTime - Function to get current game time.
 * @param {function} params.registerGameLoop - Function to register game loop callback.
 */
class CharacterAnimation {
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

  /** Starts the animation loop for the character. */
  start() {
    const actionInterval = 1000 / 45;
    const idleInterval = 300;
    const walkInterval = this.character.animationSpeed;
    const jumpInterval = 80;
    const idleAnimInterval = 120;
    this._unregisterGameLoop = this.registerGameLoop((gameTime) => {
      if (gameTime - this.lastActionTick >= actionInterval) {
        const actionHappened = this.character.handleActions(true);
        if (!this.character.world?.keyboard?.D) {
          // canThrowBottle = true; (handled in character)
        }
        if (actionHappened) this.idleStartTime = gameTime;
        this.lastActionTick = gameTime;
      }
      if (this.character.isDead() || this.character.isHurt()) {
        if (this.currentAnimState !== "dead-hurt") {
          this.currentAnimState = "dead-hurt";
        }
        return;
      }
      let isWalking = false;
      let isJumping = false;
      if (this.character.isAboveGround()) {
        isJumping = true;
        if (!this.wasJumping) {
          this.jumpAnimFrame = 0;
          this.lastJumpTick = gameTime;
          this.currentAnimState = "jumping";
        }
        this.updateJumpAnimation(gameTime, jumpInterval);
      } else if (
        (this.character.shouldMoveLeft() || this.character.shouldMoveRight()) &&
        !this.character.isAboveGround()
      ) {
        isWalking = true;
        if (!this.wasWalking || this.currentAnimState !== "walking") {
          this.walkAnimFrame = 0;
          this.lastWalkTick = gameTime;
          this.currentAnimState = "walking";
        }
        if (gameTime - this.lastWalkTick >= walkInterval) {
          this.walkAnimFrame =
            (this.walkAnimFrame + 1) % this.character.IMAGES_WALKING.length;
          this.character.img =
            this.character.imageCache[
              this.character.IMAGES_WALKING[this.walkAnimFrame]
            ];
          this.lastWalkTick = gameTime;
        }
      } else if (
        !isWalking &&
        !isJumping &&
        !this.character.isDead() &&
        !this.character.isHurt()
      ) {
        if (this.currentAnimState !== "idle") {
          this.idleAnimFrame = 0;
          this.idleLongAnimFrame = 0;
          this.currentAnimState = "idle";
        }
        if (gameTime - this.lastIdleTick >= idleInterval) {
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
          this.lastIdleTick = gameTime;
        }
      }
      this.wasWalking = isWalking;
      this.wasJumping = isJumping;
    });
  }

  /**
   * Updates jump animation based on jump phase (speedY).
   * @param {number} gameTime - Current game time.
   * @param {number} jumpInterval - Interval for jump animation.
   */
  updateJumpAnimation(gameTime, jumpInterval) {
    if (gameTime - this.lastJumpTick >= jumpInterval) {
      const maxSpeedY = 50;
      const totalFrames = this.character.IMAGES_JUMPING.length;
      if (this.character.speedY > 0) {
        const upFrames = 4;
        const progress = 1 - Math.min(this.character.speedY / maxSpeedY, 1);
        this.jumpAnimFrame = Math.floor(progress * upFrames);
        this.jumpAnimFrame = Math.min(this.jumpAnimFrame, 3);
      } else {
        const downFrames = 5;
        const downStartFrame = 4;
        const progress = Math.min(
          Math.abs(this.character.speedY) / maxSpeedY,
          1
        );
        this.jumpAnimFrame = downStartFrame + Math.floor(progress * downFrames);
        this.jumpAnimFrame = Math.min(this.jumpAnimFrame, 8);
      }
      this.jumpAnimFrame = Math.max(this.jumpAnimFrame, 0);
      this.character.img =
        this.character.imageCache[
          this.character.IMAGES_JUMPING[this.jumpAnimFrame]
        ];
      this.lastJumpTick = gameTime;
    }
  }
}

window.CharacterAnimation = CharacterAnimation;
