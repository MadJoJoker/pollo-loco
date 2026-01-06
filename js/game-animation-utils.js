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

/**
 * Registers a simple animation loop for a sprite.
 * @param {Object} opts - Options for the animation.
 * @param {Object} opts.context - The object whose .img and .imageCache will be set.
 * @param {string[]} opts.images - Array of image keys.
 * @param {number} opts.interval - Time between frames in ms.
 * @param {Function} [opts.isActive] - Function returning true if animation should run.
 * @param {Function} [opts.onFrame] - Callback after frame change.
 * @returns {Function} Unregister function.
 */
window.registerSimpleAnimation = function (opts) {
  return _registerSimpleAnimation(opts);
};

/**
 * Interne Hilfsfunktion zum Registrieren einer Animation.
 * @param {Object} opts - Siehe registerSimpleAnimation.
 * @returns {Function} Unregister-Funktion.
 */
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

/**
 * Führt einen Animations-Frame aus.
 * @param {Object} opts - Frame-Optionen.
 */
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

/**
 * Registers a simple interval loop for repeated actions.
 * @param {Object} opts - Options for the interval.
 * @param {number} opts.interval - Time between actions in ms.
 * @param {Function} opts.action - Action to execute.
 * @param {Function} [opts.isActive] - Function returning true if interval should run.
 * @returns {Function} Unregister function.
 */
window.registerSimpleInterval = function (opts) {
  return _registerSimpleInterval(opts);
};

/**
 * Interne Hilfsfunktion zum Registrieren eines Intervalls.
 * @param {Object} opts - Siehe registerSimpleInterval.
 * @returns {Function} Unregister-Funktion.
 */
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

/**
 * Führt einen Intervall-Frame aus.
 * @param {Object} opts - Frame-Optionen.
 */
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
