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
 * Pauses the GameTime if not already paused.
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
 * @returns {number} Elapsed game time in milliseconds.
 */
window.getGameTime = function () {
  if (!window._gameStartTime) return 0;
  if (window.gamePaused) return window._gameElapsed;
  return window._gameElapsed + (Date.now() - window._gameStartTime);
};

window._gameLoopCallbacks = [];
/**
 * Registers a function to be called on each game loop tick.
 * @param {Function} fn - Callback to register.
 * @returns {Function} Unregister function.
 */
window.registerGameLoop = function (fn) {
  window._gameLoopCallbacks.push(fn);
  return function unregister() {
    const idx = window._gameLoopCallbacks.indexOf(fn);
    if (idx > -1) window._gameLoopCallbacks.splice(idx, 1);
  };
};

/**
 * Main game loop handler. Calls registered callbacks with current game time.
 */
function _mainGameLoop() {
  if (!window.gamePaused) {
    const t = window.getGameTime();
    for (const cb of window._gameLoopCallbacks) cb(t);
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
 * Retrieves all audio elements in the document.
 * @returns {HTMLAudioElement[]} Array of audio elements.
 */
function getAllAudios() {
  const audios = document.getElementsByTagName("audio");
  trackAudioIds(audios);
  return audios;
}

/**
 * Tracks audio element IDs in the global soundIntervalIds array.
 * @param {HTMLCollection} audios - Collection of audio elements.
 */
function trackAudioIds(audios) {
  for (let i = 0; i < audios.length; i++) {
    if (audios[i].id && !window.soundIntervalIds.includes(audios[i].id)) {
      window.soundIntervalIds.push(audios[i].id);
    }
  }
}

/**
 * Sets the muted property for all audio elements in the document.
 * @param {boolean} mute - If true, mute all audios; if false, unmute all audios.
 */
function setMuteForAllAudios(mute) {
  const audios = getAllAudios();
  muteAudios(audios, mute);
}

/**
 * Mutes or unmutes a collection of audio elements.
 * @param {HTMLCollection} audios - Collection of audio elements.
 * @param {boolean} mute - If true, mute all audios; if false, unmute all audios.
 */
function muteAudios(audios, mute) {
  Array.from(audios).forEach((audio) => {
    audio.muted = mute;
  });
}

/**
 * Helper to mute/unmute all audios based on mute-range input or localStorage.
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

/**
 * Handles mute and audio setup on DOMContentLoaded.
 */
window.addEventListener("DOMContentLoaded", function () {
  handleMuteRangeOnLoad();
  setMuteStatusOnLoad();
  playIndexSoundOnLoad();
  window.updateMuteButtonVisuals();
});

/**
 * Sets mute range value from localStorage on DOMContentLoaded.
 */
function handleMuteRangeOnLoad() {
  const muteValue = localStorage.getItem("polloMute");
  const muteRange = document.getElementById("mute-range");
  if (muteValue !== null && muteRange) {
    muteRange.value = muteValue;
  }
}

/**
 * Sets mute status for all audios on DOMContentLoaded.
 */
function setMuteStatusOnLoad() {
  const muteValue = localStorage.getItem("polloMute") || "0";
  setMuteForAllAudios(muteValue === "1");
}

/**
 * Plays index-sound audio on DOMContentLoaded if not muted.
 */
function playIndexSoundOnLoad() {
  const muteValue = localStorage.getItem("polloMute") || "0";
  const indexSound = document.getElementById("index-sound");
  if (indexSound) {
    indexSound.muted = muteValue === "1";
    indexSound.play().catch(() => {});
  }
}

/**
 * Handles mute-range input events for dynamically added elements.
 */

// Zentraler Event-Listener für mute-range
document.addEventListener("input", function (e) {
  var t = e.target || e.srcElement;
  if (t && t.id === "mute-range") {
    localStorage.setItem("polloMute", t.value);
    setMuteForAllAudios(t.value === "1");
    window.updateMuteButtonVisuals();
    if (window.updatePageAudios) {
      const visibleDiv = Array.from(
        document.querySelectorAll('div[id^="div-"]'),
      ).find((div) => div.style.display === "block");
      if (visibleDiv) window.updatePageAudios(visibleDiv.id);
    }
  }
});

// Storage-Event für Tab-Synchronisation
window.addEventListener("storage", function (e) {
  if (e.key === "polloMute") {
    setMuteForAllAudios(e.newValue === "1");
    window.updateMuteButtonVisuals();
  }
});

/**
 * Handles SPA render events to initialize mute state for injected pages.
 */
document.addEventListener("spa:render", function (e) {
  handleMuteRangeOnLoad();
  setMuteStatusOnLoad();
  window.updateMuteButtonVisuals();
});

/**
 * Updates the visual appearance of the mute button based on the current mute state.
 */

// Robuste zentrale Mute-UI-Logik
window.updateMuteButtonVisuals = function () {
  const muteValue = localStorage.getItem("polloMute") || "0";
  const isMuted = muteValue === "1";

  // Game-Bar-Button
  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    const img = muteButton.querySelector("img");
    if (img) {
      img.src = isMuted
        ? "/assets/img/10_external_img/mute.png"
        : "/assets/img/10_external_img/sound-on.png";
      img.alt = isMuted ? "muted" : "sound on";
    }
    const label = document.getElementById("muteBtnLabel");
    if (label) {
      label.textContent = isMuted ? "Unmute" : "Mute";
    }
  }

  // Settings-Range, Status, Icon
  const muteRange = document.getElementById("mute-range");
  const muteStatus = document.getElementById("mute-status");
  const muteIcon = document.getElementById("mute-icon");
  if (muteRange) {
    muteRange.value = muteValue;
    muteRange.setAttribute("data-mute", muteValue);
  }
  if (muteStatus) {
    let foundText = false;
    for (let i = 0; i < muteStatus.childNodes.length; i++) {
      if (muteStatus.childNodes[i].nodeType === Node.TEXT_NODE) {
        muteStatus.childNodes[i].textContent = isMuted
          ? "Sound off"
          : "Sound on";
        foundText = true;
        break;
      }
    }
    if (!foundText) {
      muteStatus.textContent = isMuted ? "Sound off" : "Sound on";
    }
  }
  if (muteIcon) {
    muteIcon.src = isMuted
      ? "/assets/button/mute.png"
      : "/assets/img/10_external_img/sound-on.png";
    muteIcon.alt = isMuted ? "muted" : "sound on";
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
  // Auch Range synchronisieren
  const muteRange = document.getElementById("mute-range");
  if (muteRange) {
    muteRange.value = muteValue;
    muteRange.setAttribute("data-mute", muteValue);
  }
  if (window.updatePageAudios) {
    const visibleDiv = Array.from(
      document.querySelectorAll('div[id^="div-"]'),
    ).find((div) => div.style.display === "block");
    if (visibleDiv) window.updatePageAudios(visibleDiv.id);
  }
};
