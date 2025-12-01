/**
 * Toggles fullscreen mode for the element with ID 'fullscreen'.
 * If already in fullscreen, exits fullscreen; otherwise, enters fullscreen.
 */
function fullscreen() {
  let fullscreenEl = document.getElementById("fullscreen");
  if (
    document.fullscreenElement === fullscreenEl ||
    document.webkitFullscreenElement === fullscreenEl ||
    document.msFullscreenElement === fullscreenEl
  ) {
    exitFullscreen();
  } else {
    enterFullscreen(fullscreenEl);
  }
}

/**
 * Removes focus from all buttons after click to prevent focus outline.
 */
document.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
    const button = e.target.tagName === "BUTTON" ? e.target : e.target.closest("button");
    setTimeout(() => button.blur(), 0);
  }
});

/**
 * Requests fullscreen mode for the given element, handling browser compatibility.
 * @param {HTMLElement} fullscreen - The element to display in fullscreen.
 */
function enterFullscreen(fullscreen) {
  if (fullscreen.requestFullscreen) {
    fullscreen.requestFullscreen();
  } else if (fullscreen.msRequestFullscreen) {
    fullscreen.msRequestFullscreen();
  } else if (fullscreen.webkitRequestFullscreen) {
    fullscreen.webkitRequestFullscreen();
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
