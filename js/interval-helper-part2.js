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
  window.setMuteForAllAudios(muteValue === "1");
};

window.addEventListener("DOMContentLoaded", function () {
  handleMuteRangeOnLoad();
  setMuteStatusOnLoad();
  playIndexSoundOnLoad();
  window.updateMuteButtonVisuals();
});

function handleMuteRangeOnLoad() {
  const muteValue = localStorage.getItem("polloMute");
  const muteRange = document.getElementById("mute-range");
  if (muteValue !== null && muteRange) {
    muteRange.value = muteValue;
  }
}

function setMuteStatusOnLoad() {
  const muteValue = localStorage.getItem("polloMute") || "0";
  window.setMuteForAllAudios(muteValue === "1");
}

function playIndexSoundOnLoad() {
  const muteValue = localStorage.getItem("polloMute") || "0";
  const indexSound = document.getElementById("index-sound");
  if (indexSound) {
    indexSound.muted = muteValue === "1";
    indexSound.play().catch(() => {});
  }
}

// Zentraler Event-Listener für mute-range
document.addEventListener("input", function (e) {
  var t = e.target || e.srcElement;
  if (t && t.id === "mute-range") {
    localStorage.setItem("polloMute", t.value);
    window.setMuteForAllAudios(t.value === "1");
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
    window.setMuteForAllAudios(e.newValue === "1");
    window.updateMuteButtonVisuals();
  }
});

// SPA render events
document.addEventListener("spa:render", function (e) {
  handleMuteRangeOnLoad();
  setMuteStatusOnLoad();
  window.updateMuteButtonVisuals();
});

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

// Toggle mute state
window.toggleMuteInLocalStorage = function () {
  let muteValue = localStorage.getItem("polloMute") || "0";
  muteValue = muteValue === "1" ? "0" : "1";
  localStorage.setItem("polloMute", muteValue);
  window.setMuteForAllAudios(muteValue === "1");
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
