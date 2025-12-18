// --- Central GameTime and Pause Management ---
window.gamePaused = false;
window._gameStartTime = null;
window._gameElapsed = 0;

/**
 * Starts or resets the GameTime.
 */
window.startGameTime = function () {
  window._gameStartTime = Date.now();
  window._gameElapsed = 0;
  window.gamePaused = false;
};

/**
 * Pauses the GameTime.
 */
window.pauseGameTime = function () {
  if (!window.gamePaused && window._gameStartTime) {
    window._gameElapsed += Date.now() - window._gameStartTime;
    window.gamePaused = true;
  }
};

/**
 * Resumes the GameTime after a pause.
 */
window.resumeGameTime = function () {
  if (window.gamePaused) {
    window._gameStartTime = Date.now();
    window.gamePaused = false;
  }
};

/**
 * Returns the elapsed game time in ms (pause-robust).
 */
window.getGameTime = function () {
  if (!window._gameStartTime) return 0;
  if (window.gamePaused) return window._gameElapsed;
  return window._gameElapsed + (Date.now() - window._gameStartTime);
};

// --- Central Game Loop ---
window._gameLoopCallbacks = [];
window.registerGameLoop = function (fn) {
  window._gameLoopCallbacks.push(fn);
  return () => {
    const idx = window._gameLoopCallbacks.indexOf(fn);
    if (idx > -1) window._gameLoopCallbacks.splice(idx, 1);
  };
};

function _mainGameLoop() {
  if (!window.gamePaused) {
    const t = window.getGameTime();
    for (const cb of window._gameLoopCallbacks) {
      try {
        cb(t);
      } catch (e) {
        console.error(e);
      }
    }
  }
  window.requestAnimationFrame(_mainGameLoop);
}
window.requestAnimationFrame(_mainGameLoop);
window.intervalIds = [];
window.soundIntervalIds = [];

/**
 * Sets an interval that can be stopped later using stopAllIntervals.
 * @param {Function} fn - Function to execute on each interval tick.
 * @param {number} time - Interval duration in milliseconds.
 * @returns {number} The interval ID.
 */
window.setStoppableInterval = function (fn, time) {
  let id = setInterval(fn, time);
  window.intervalIds.push(id);
  return id;
};
/**
 * Stops and clears all intervals set by setStoppableInterval.
 */
window.stopAllIntervals = function () {
  window.intervalIds.forEach(clearInterval);
  window.intervalIds = [];
};
/**
 * Retrieves all audio elements in the document and tracks their IDs.
 * @returns {HTMLAudioElement[]} Array of audio elements.
 */
function getAllAudios() {
  const audios = document.getElementsByTagName("audio");
  for (let i = 0; i < audios.length; i++) {
    if (audios[i].id && !window.soundIntervalIds.includes(audios[i].id)) {
      window.soundIntervalIds.push(audios[i].id);
    }
  }
  return audios;
}

/**
 * Sets the muted property for all audio elements in the document.
 * @param {boolean} mute - If true, mute all audios; if false, unmute all audios.
 */
function setMuteForAllAudios(mute) {
  const audios = getAllAudios();
  Array.from(audios).forEach((audio) => {
    audio.muted = mute;
  });
}

/**
 * Helper function to mute or unmute all audios based on the mute-range input or localStorage.
 */
window.muteAllAudiosHelper = function () {
  const muteRange = document.getElementById("mute-range");
  let muteValue = "0";
  if (muteRange) {
    muteValue = muteRange.value;
    localStorage.setItem("polloMute", muteValue);
  } else {
    muteValue = localStorage.getItem("polloMute") || "0";
  }
  setMuteForAllAudios(muteValue === "1");
};

window.addEventListener("DOMContentLoaded", function () {
  const muteValue = localStorage.getItem("polloMute");
  const muteRange = document.getElementById("mute-range");
  if (muteValue !== null && muteRange) {
    muteRange.value = muteValue;
  }

  // Setze Mute-Status für alle Audios
  setMuteForAllAudios((muteValue || "0") === "1");

  // Starte index-sound Audio wenn nicht gemutet
  const indexSound = document.getElementById("index-sound");
  if (indexSound) {
    indexSound.muted = (muteValue || "0") === "1";
    indexSound.play().catch((err) => {
      console.log("Audio autoplay prevented by browser:", err);
    });
  }

  window.updateMuteButtonVisuals();
});

// Use event delegation so elements added dynamically (via SPA) are handled.
document.addEventListener("input", function (e) {
  var t = e.target || e.srcElement;
  if (t && t.id === "mute-range") {
    window.muteAllAudiosHelper();
  }
});

// Also respond to SPA renders to initialize state for newly injected pages
document.addEventListener("spa:render", function (e) {
  // Re-apply mute state to any new audio elements and sync the range control
  var muteValue = localStorage.getItem("polloMute");
  var muteRange = document.getElementById("mute-range");
  if (muteValue !== null && muteRange) {
    muteRange.value = muteValue;
  }
  setMuteForAllAudios((muteValue || "0") === "1");
  window.updateMuteButtonVisuals();
});
/**
 * Updates the visual appearance of the mute button based on the current mute state.
 */
window.updateMuteButtonVisuals = function () {
  const muteButton = document.getElementById("muteButton");
  if (!muteButton) return;

  const muteValue = localStorage.getItem("polloMute") || "0";
  const isMuted = muteValue === "1";
  const img = muteButton.querySelector("img");
  const textNode = muteButton.childNodes[muteButton.childNodes.length - 1];

  if (img) {
    img.src = isMuted
      ? "/assets/img/10_external_img/mute.png"
      : "/assets/img/10_external_img/sound-on.png";
    img.alt = isMuted ? "muted" : "sound on";
  }

  if (textNode && textNode.nodeType === Node.TEXT_NODE) {
    textNode.textContent = isMuted ? " Unmute" : " Mute";
  }
};

/**
 * Toggles the mute state in localStorage and updates all audio elements accordingly.
 */
window.toggleMuteInLocalStorage = function () {
  let muteValue = localStorage.getItem("polloMute") || "0";
  muteValue = muteValue === "1" ? "0" : "1";
  localStorage.setItem("polloMute", muteValue);
  setMuteForAllAudios(muteValue === "1");
  window.updateMuteButtonVisuals();
};
