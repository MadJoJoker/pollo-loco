const backgroundObjects = [
  //AIR
  new BackgroundObject("assets/img/5_background/layers/air.png", 0, 0, 0, 0),
  new BackgroundObject(
    "assets/img/5_background/layers/air.png",
    719 * 1,
    0,
    0,
    0
  ),
  new BackgroundObject(
    "assets/img/5_background/layers/air.png",
    719 * 2,
    0,
    0,
    0
  ),
  //SChicht 3
  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/1.png",
    0,
    0,
    0,
    0
  ),

  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/2.png",
    719 * 1,
    0,
    0,
    0
  ),

  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/1.png",
    719 * 2,
    0,
    0,
    0
  ),
  //SChicht 2
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/1.png",
    0,
    30,
    0,
    0
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/2.png",
    719 * 1,
    30,
    0,
    0
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/1.png",
    719 * 2,
    30,
    0,
    0
  ),

  //SChicht 1
  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/1.png",
    0,
    80,
    0,
    0
  ),

  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/2.png",
    719 * 1,
    80,
    0,
    0
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/1.png",
    719 * 2,
    80,
    0,
    0
  ),
];
const enemies = [
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new ChickenSmall(),
  new ChickenSmall(),
  new ChickenSmall(),
  new Chicken(),
  new Chicken(),
  new Chicken(),
  new ChickenSmall(),
  new ChickenSmall(),
  new ChickenSmall(),
];
const clouds = [new Cloud(), new Cloud(), new Cloud()];
const bottles = [
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
  new Bottle(),
];
const coins = Coin.randomArcCoins(3);

const level1 = new Level(enemies, clouds, backgroundObjects, bottles, coins);

level1.level_end_x = Math.max(
  ...backgroundObjects.map((obj) => obj.x + obj.width)
);
const endboss = new Endboss(level1.level_end_x, level1);
enemies.push(endboss);
