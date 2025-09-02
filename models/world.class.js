class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard = new Keyboard();
  camera_x = 0;
  healthBar = new StatusBar(120, 0, 100, 40, "health");
  bottleBar = new StatusBar(10, 0, 100, 40, "bottle");
  coinBar = new StatusBar(10, 30, 100, 40, "coin");
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;
    this.setWorld();
    this.checkCollisions();
    this.healthBar.setPercentage(100);
    this.bottleBar.setPercentage(0);
    this.coinBar.setPercentage(0);
    setInterval(() => {
      this.updateCamera();
      this.draw();
    }, 1000 / 60);

    setInterval(() => {
      this.checkCharacterChickenCollision();
      if (this.level?.bottles) {
        for (let i = this.level.bottles.length - 1; i >= 0; i--) {
          const bottle = this.level.bottles[i];
          if (this.isCollection(this.character, bottle)) {
            this.character.bottles += 1;
            this.level.bottles.splice(i, 1);
            console.log("Bottle wurde eingesammelt!");
            console.log(
              "Coins:",
              this.character.coins,
              "Bottles:",
              this.character.bottles
            );
            this.bottleBar.setPercentage(this.character.bottles);
          }
        }
      }
      if (this.level?.coins) {
        for (let i = this.level.coins.length - 1; i >= 0; i--) {
          const coin = this.level.coins[i];
          if (this.isCollection(this.character, coin)) {
            this.character.coins += 1;
            this.level.coins.splice(i, 1);
            console.log("character collected coin");
            console.log(
              "Coins:",
              this.character.coins,
              "Bottles:",
              this.character.bottles
            );
            console.log("Total Coins (created):", Coin.getTotalCoins());
            let totalCoins = Coin.getTotalCoins();
            let collectedCoins = this.character.coins;
            let percent =
              totalCoins > 0
                ? Math.round((collectedCoins / totalCoins) * 100)
                : 0;
            this.coinBar.setPercentage(percent);
          }
        }
      }
    }, 100);
  }

  isCollection(character, collectible) {
    const a = {
      left: character.x + (character.offset?.left || 0),
      right: character.x + character.width - (character.offset?.right || 0),
      top: character.y + (character.offset?.top || 0),
      bottom: character.y + character.height - (character.offset?.bottom || 0),
    };
    const b = {
      left: collectible.x + (collectible.offset?.left || 0),
      right:
        collectible.x + collectible.width - (collectible.offset?.right || 0),
      top: collectible.y + (collectible.offset?.top || 0),
      bottom:
        collectible.y + collectible.height - (collectible.offset?.bottom || 0),
    };
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  checkCharacterChickenCollision() {
    if (!this.level?.enemies || !this.character) return;
    this.level.enemies.forEach((enemy) => {
      if (
        enemy instanceof Chicken ||
        enemy instanceof ChickenSmall ||
        enemy instanceof Endboss
      ) {
        if (this.isOffsetColliding(this.character, enemy)) {
          if (enemy instanceof Chicken) {
            console.log("character hittet by chicken");
            this.character.isHurt();
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            console.log(this.character.energy + "Energie");
          } else if (enemy instanceof ChickenSmall) {
            console.log("character hittet by small chicken");
            this.character.isHurt();
            this.character.hit();
            this.healthBar.setPercentage(this.character.energy);
            console.log(this.character.energy + "Energie");
          } else if (enemy instanceof Endboss) {
            console.log("character hittet by endboss");
            this.character.isHurt();
            this.character.hit();
            console.log(this.character.energy + "Energie");
            this.healthBar.setPercentage(this.character.energy);
          }
        }
      }
    });
  }

  isOffsetColliding(objA, objB) {
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
  updateCamera() {
    const minCameraX = 0;
    const maxCameraX = 719 * 2; // umbauen auf max level //
    if (this.character && typeof this.character.x === "number") {
      let targetX = this.character.x - 120;
      this.camera_x = Math.max(minCameraX, Math.min(targetX, maxCameraX));
    }
  }
   setWorld() {
    this.character.world = this;
    if (this.level?.enemies) {
      this.level.enemies.forEach(enemy => {
        enemy.world = this;
      });
    }
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new Bottle(
        this.character.x + 100,
        this.character.y + 100,
        50, // Breite
        60, // Höhe
        "throw"
      );
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.healthBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(-this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.coins);
    this.addToMap(this.character);
    this.addObjectsToMap(this.character.throwBottles);
    this.ctx.restore();
    this.addToMap(this.healthBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (typeof mo.drawFrameOffset === "function") {
      mo.drawFrameOffset(this.ctx);
    }
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
