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
window.registerSimpleAnimation = function (opts) {
  return _registerSimpleAnimation(opts);
};

function _registerSimpleAnimation({
  context,
  images,
  interval,
  isActive = () => true,
  onFrame = null,
}) {
  let lastTick = window.getGameTime();
  let frame = 0;
  return window.registerGameLoop((gameTime) => {
    _simpleAnimationFrame({
      gameTime,
      isActive,
      interval,
      images,
      context,
      onFrame,
      lastTickRef: () => lastTick,
      setLastTick: (v) => (lastTick = v),
      frameRef: () => frame,
      setFrame: (v) => (frame = v),
    });
  });
}

function _simpleAnimationFrame({
  gameTime,
  isActive,
  interval,
  images,
  context,
  onFrame,
  lastTickRef,
  setLastTick,
  frameRef,
  setFrame,
}) {
  if (!isActive()) return;
  if (gameTime - lastTickRef() >= interval) {
    const nextFrame = (frameRef() + 1) % images.length;
    setFrame(nextFrame);
    context.img = context.imageCache[images[nextFrame]];
    if (onFrame) onFrame(nextFrame);
    setLastTick(gameTime);
  }
}

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
window.registerSimpleInterval = function (opts) {
  return _registerSimpleInterval(opts);
};

function _registerSimpleInterval({ interval, action, isActive = () => true }) {
  let lastTick = window.getGameTime();
  return window.registerGameLoop((gameTime) => {
    _simpleIntervalFrame({
      gameTime,
      isActive,
      interval,
      action,
      lastTickRef: () => lastTick,
      setLastTick: (v) => (lastTick = v),
    });
  });
}

function _simpleIntervalFrame({
  gameTime,
  isActive,
  interval,
  action,
  lastTickRef,
  setLastTick,
}) {
  if (!isActive()) return;
  if (gameTime - lastTickRef() >= interval) {
    action();
    setLastTick(gameTime);
  }
}
