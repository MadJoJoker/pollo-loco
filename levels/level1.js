const backgroundObjects = [
  new BackgroundObject(
    "/assets/img/5_background/layers/4_clouds/full.png",
    -719,
    150,
    720,
    720
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/2.png",
    -719,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/2.png",
    -719,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/2.png",
    -719,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/4_clouds/full.png",
    719 * 1,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/1.png",
    719 * 1,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/1.png",
    719 * 1,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/1.png",
    719 * 1,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/4_clouds/full.png",
    719 * 2,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/3_third_layer/1.png",
    719 * 2,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/2_second_layer/1.png",
    719 * 2,
    150,
    450,
    480
  ),
  new BackgroundObject(
    "/assets/img/5_background/layers/1_first_layer/1.png",
    719 * 2,
    150,
    450,
    480
  ),
];

const level1 = new Level(
  [new Chicken(), new Chicken(), new Chicken(), new Endboss()],
  [new Cloud()],
  backgroundObjects
);

level1.level_end_x = Math.max(
  ...backgroundObjects.map((obj) => obj.x + obj.width)
);
