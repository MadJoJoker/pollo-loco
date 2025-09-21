window.intervalIds = [];
window.soundIntervalIds = [];

window.setStoppableInterval = function (fn, time) {
  let id = setInterval(fn, time);
  window.intervalIds.push(id);
  return id;
};
window.stopAllIntervals = function () {
  window.intervalIds.forEach(clearInterval);
  window.intervalIds = [];
};
function getAllAudios() {
  const audios = document.getElementsByTagName("audio");
  console.debug("[getAllAudios] Anzahl Audios gefunden:", audios.length);
  for (let i = 0; i < audios.length; i++) {
    if (audios[i].id && !window.soundIntervalIds.includes(audios[i].id)) {
      window.soundIntervalIds.push(audios[i].id);
      console.debug(`[getAllAudios] Audio-ID hinzugefügt: ${audios[i].id}`);
    }
  }
  return audios;
}

function setMuteForAllAudios(mute) {
  const audios = getAllAudios();
  Array.from(audios).forEach((audio) => {
    audio.muted = mute;
    console.debug(
      `[setMuteForAllAudios] Audio-ID: ${audio.id}, muted: ${audio.muted}`
    );
  });
}

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
  console.debug(
    "[muteAllAudiosHelper] setMuteForAllAudios wurde aufgerufen mit:",
    muteValue
  );
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
window.toggleMuteInLocalStorage = function () {
  let muteValue = localStorage.getItem("polloMute") || "0";
  muteValue = muteValue === "1" ? "0" : "1";
  localStorage.setItem("polloMute", muteValue);
  setMuteForAllAudios(muteValue === "1");
  console.debug("[toggleMuteInLocalStorage] polloMute ist jetzt:", muteValue);
};
