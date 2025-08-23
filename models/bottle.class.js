class Bottle extends CollectibleObject {
  height;
  width;
  y;
  x;

  IMAGES_BOTTLES_GROUND = [
    "/assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "/assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  IMAGES_BOTTLES_THROW = [
    "/assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_rotation.png",
  ];
  IMAGES_BOTTLES_SPLASH = [
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor() {
    super();
    this.x = 100 + Math.random() * 700;
    this.y = 350;
    this.width = 100;
    this.height = 100;
    this.IMAGES_USED = this.IMAGES_BOTTLES_GROUND;
    this.animationSpeed = 250;
    this.loadImages(this.IMAGES_USED);
    this.loadImage(this.IMAGES_USED[0]);
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.currentImage = (this.currentImage + 1) % this.IMAGES_USED.length;
      let path = this.IMAGES_USED[this.currentImage];
      this.img = this.imageCache[path];
    }, this.animationSpeed);
  }
}
