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

function enterFullscreen(fullscreen) {
  if (fullscreen.requestFullscreen) {
    fullscreen.requestFullscreen();
  } else if (fullscreen.msRequestFullscreen) {
    fullscreen.msRequestFullscreen();
  } else if (fullscreen.webkitRequestFullscreen) {
    fullscreen.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}
