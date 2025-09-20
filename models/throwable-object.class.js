class ThrowableObject extends MovableObject {
  offset = { top: 30, bottom: 20, left: 40, right: 40 };

  constructor(x, y, toLeft = false) {
    super();
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 100;
    this.animationSpeed = 5;
    this.toLeft = toLeft;
    this.loadImages(Bottle.IMAGES_BOTTLES_THROW);
    this.loadImage(Bottle.IMAGES_BOTTLES_THROW[0]);
    this.throw();
    this.animateThrow();
    this.bottleCrackAudio = new Audio("/assets/audio/bottle-crack.mp3");
  }

  animateThrow() {
    this.animationSpeed = 60;

    this.throwAnimationInterval = window.setStoppableInterval(() => {
      this.currentImage =
        (this.currentImage + 1) % Bottle.IMAGES_BOTTLES_THROW.length;
      let path = Bottle.IMAGES_BOTTLES_THROW[this.currentImage];
      this.img = this.imageCache[path];
    }, this.animationSpeed);
  }

  throw(x, y) {
    if (x !== undefined && y !== undefined) {
      this.x = x;
      this.y = y;
    }
    this.speedY = 15;
    const GAME_HEIGHT = 480;
    this.splashing = false;
    this.throwMoveInterval = window.setStoppableInterval(() => {
      this.x += this.toLeft ? -20 : 20;
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
      if (this.y >= GAME_HEIGHT - this.height && !this.splashing) {
        this.y = GAME_HEIGHT - this.height - 75;
        this.showSplash();
      }
      this.checkEnemyCollision();
    }, 180);
  }

  checkEnemyCollision() {
    if (this.world && this.world.level && this.world.level.enemies) {
      for (let enemy of this.world.level.enemies) {
        if (this.isOffsetColliding(this, enemy) && !this.splashing) {
          if (typeof enemy.hitByBottle === "function") {
            enemy.hitByBottle(this);
          }
          this.showSplash();
        }
      }
    }
  }

  showSplash() {
    this.splashing = true;
    clearInterval(this.throwMoveInterval);
    clearInterval(this.throwAnimationInterval);
    this.currentImage = 0;
    const splashImages = Bottle.IMAGES_BOTTLES_SPLASH;
    this.loadImages(splashImages);
    if (this.bottleCrackAudio) {
      this.bottleCrackAudio.currentTime = 0;
      this.bottleCrackAudio.muted = localStorage.getItem("polloMute") === "1";
      this.bottleCrackAudio.play();
    }
    this.splashInterval = window.setStoppableInterval(() => {
      this.currentImage = (this.currentImage + 1) % splashImages.length;
      let path = splashImages[this.currentImage];
      this.img = this.imageCache[path];
    }, 1500 / splashImages.length);
    setTimeout(() => {
      clearInterval(this.splashInterval);
      this.remove();
    }, 1500);
  }

  remove() {
    clearInterval(this.throwMoveInterval);
    clearInterval(this.throwAnimationInterval);
    clearInterval(this.splashInterval);
    if (
      this.world &&
      this.world.character &&
      Array.isArray(this.world.character.throwBottles)
    ) {
      const idx = this.world.character.throwBottles.indexOf(this);
      if (idx > -1) {
        this.world.character.throwBottles.splice(idx, 1);
      }
    }
  }

  isOffsetColliding(objA, objB) {
    if (!objA || !objB) {
      console.error(
        "[BottleCollision] isOffsetColliding: objA oder objB ist undefined",
        { objA, objB }
      );
      return false;
    }
    const required = ["x", "y", "width", "height"];
    for (const key of required) {
      if (typeof objA[key] !== "number" || typeof objB[key] !== "number") {
        console.error(
          `[BottleCollision] isOffsetColliding: Eigenschaft fehlt oder ist kein number: ${key}`,
          { objA, objB }
        );
        return false;
      }
    }
    const a = {
      left: objA.x + (objA.offset?.left || 0),
      right: objA.x + objA.width - (objA.offset?.right || 0),
      top: objA.y + (objA.offset?.top || 0),
      bottom: objA.y + objA.height - (objA.offset?.bottom || 0),
    };
    const b = {
      left: objB.x + (objB.offset?.left || 0),
      right: objB.x + objB.width - (objB.offset?.right || 0),
      top: objB.y + (objB.offset?.top || 0),
      bottom: objB.y + objB.height - (objB.offset?.bottom || 0),
    };
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }
}
