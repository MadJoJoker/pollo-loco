/**
 * Toggles fullscreen mode for the element with ID 'fullscreen'.
 * If already in fullscreen, exits fullscreen; otherwise, enters fullscreen.
 */
function fullscreen() {
  const fullscreenEl = document.getElementById("fullscreen");
  if (!fullscreenEl) return;
  if (_isFullscreen(fullscreenEl)) {
    exitFullscreen();
  } else {
    enterFullscreen(fullscreenEl);
  }
}

/**
 * Checks if the given element is currently in fullscreen mode.
 * @param {HTMLElement} el - The element to check.
 * @returns {boolean} True if the element is in fullscreen, otherwise false.
 */
function _isFullscreen(el) {
  return (
    document.fullscreenElement === el ||
    document.webkitFullscreenElement === el ||
    document.msFullscreenElement === el
  );
}

/**
 * Removes focus from all buttons after click to prevent focus outline.
 */

/**
 * Removes focus from all buttons after click to prevent focus outline.
 * @param {MouseEvent} e - The click event.
 */
document.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
    const button =
      e.target.tagName === "BUTTON" ? e.target : e.target.closest("button");
    setTimeout(() => button.blur(), 0);
  }
});

/**
 * Requests fullscreen mode for the given element, handling browser compatibility.
 * @param {HTMLElement} fullscreen - The element to display in fullscreen.
 */
function enterFullscreen(fullscreen) {
  if (fullscreen.requestFullscreen) {
    fullscreen.requestFullscreen()
      .catch(err => {
        if (!err || !err.message || !err.message.toLowerCase().includes('permission')) {
          console.error('Fullscreen error:', err);
        }
      });
  } else if (fullscreen.msRequestFullscreen) {
    try {
      fullscreen.msRequestFullscreen();
    } catch (err) {
      if (!err || !err.message || !err.message.toLowerCase().includes('permission')) {
        console.error('Fullscreen error:', err);
      }
      // Permission errors are suppressed
    }
  } else if (fullscreen.webkitRequestFullscreen) {
    try {
      fullscreen.webkitRequestFullscreen();
    } catch (err) {
      if (!err || !err.message || !err.message.toLowerCase().includes('permission')) {
        console.error('Fullscreen error:', err);
      }
      // Permission errors are suppressed
    }
  }
}

/**
 * Exits fullscreen mode, handling browser compatibility.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
