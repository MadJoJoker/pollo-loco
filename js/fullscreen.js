function fullscreen(){
  let fullscreen = document.getElementById('fullscreen')
  enterFullscreen(fullscreen);
}


function enterFullscreen(fullscreen){
  if (fullscreen.requestFullscreen) {
    fullscreen.requestFullscreen();
  }else if (fullscreen.msRequestFullscreen){
    fullscreen.msRequestFullscreen();
  }else if (fullscreen.webkitRequestFullscreen){
    fullscreen.webkitRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen){
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen){
    document.webkitExitFullscreen();
  }
}
