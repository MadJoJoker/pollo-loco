class Bottle extends CollectibleObject{
  height = 125;
  width = 105;
  y = 310;
  x = 90;



  IMAGES_BOTTLES_GROUND = [
    "/assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "/assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
  ];
  IMAGES_BOTTLES_THROW= [
    "/assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_rotation.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_rotation.png"
  ];
  IMAGES_BOTTLES_SPLASH = [
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "/assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
  ];

   constructor(x = 20, y = 0, width = 150, height = 50, type = "ground") {
  super();
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  if (type === "ground") this.IMAGES_USED = this.IMAGES_BOTTLES_GROUND;
  if (type === "throw") this.IMAGES_USED = this.IMAGES_BOTTLES_THROW;
  if (type === "splash") this.IMAGES_USED = this.IMAGES_BOTTLES_SPLASH;
  this.loadImages(this.IMAGES_USED);
  this.img = this.imageCache[this.IMAGES_USED[2]];
}
animate() {
  setInterval(() => {
 }, this.animationSpeed);
}
}
