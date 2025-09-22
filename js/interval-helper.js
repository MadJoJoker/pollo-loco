window.intervalIds = [];
window.soundIntervalIds = [];

/**
 * Sets an interval that can be stopped later using stopAllIntervals.
 * @param {Function} fn - The function to execute at each interval.
 * @param {number} time - The interval time in milliseconds.
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
 * @param {boolean} mute - Whether to mute (true) or unmute (false) all audios.
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
  setMuteForAllAudios((muteValue || "0") === "1");
});

const muteRangeElem = document.getElementById("mute-range");
if (muteRangeElem) {
  muteRangeElem.addEventListener("input", window.muteAllAudiosHelper);
}
/**
 * Toggles the mute state in localStorage and updates all audio elements accordingly.
 */
window.toggleMuteInLocalStorage = function () {
  let muteValue = localStorage.getItem("polloMute") || "0";
  muteValue = muteValue === "1" ? "0" : "1";
  localStorage.setItem("polloMute", muteValue);
  setMuteForAllAudios(muteValue === "1");
};
