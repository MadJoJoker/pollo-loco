/**
 * Utility for simple game time-based animations and movements.
 *
 * Usage:
 *   const unregister = registerSimpleAnimation({
 *     context: this, // the object whose .img and .imageCache will be set
 *     images: this.IMAGES_WALKING,
 *     interval: 100, // ms
 *     isActive: () => !this.isDeadNow,
 *     onFrame: null // optional, called after frame change
 *   });
 *
 *   // To stop: unregister();
 */
window.registerSimpleAnimation = function ({
  context,
  images,
  interval,
  isActive = () => true,
  onFrame = null,
}) {
  let lastTick = window.getGameTime();
  let frame = 0;
  return window.registerGameLoop((gameTime) => {
    if (!isActive()) return;
    if (gameTime - lastTick >= interval) {
      frame = (frame + 1) % images.length;
      context.img = context.imageCache[images[frame]];
      if (onFrame) onFrame(frame);
      lastTick = gameTime;
    }
  });
};

/**
 * Utility for simple movement or repeated actions.
 *
 * Usage:
 *   const unregister = registerSimpleInterval({
 *     interval: 100, // ms
 *     action: () => { ... },
 *     isActive: () => true // optional
 *   });
 */
window.registerSimpleInterval = function ({
  interval,
  action,
  isActive = () => true,
}) {
  let lastTick = window.getGameTime();
  return window.registerGameLoop((gameTime) => {
    if (!isActive()) return;
    if (gameTime - lastTick >= interval) {
      action();
      lastTick = gameTime;
    }
  });
};
