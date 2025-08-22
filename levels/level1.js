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
//ACHTUNG nach LAyer sorrtieren//
const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
  [new Cloud()],
  backgroundObjects
);

level1.level_end_x = Math.max(
  ...backgroundObjects.map((obj) => obj.x + obj.width)
);
