/**
 * Initializes the main menu carousel, sets up event listeners, and starts autoplay.
 */
window.initCarousel = function () {
  const buttons = document.querySelectorAll(".carousel button");
  const count = buttons.length;
  let activeIndex = 0;
  let autoplayActive = true;
  let autoplayInterval = 2000;
  let unregisterAutoplay = null;
  _setupCarouselWheel(
    buttons,
    count,
    () => activeIndex,
    (v) => (activeIndex = v)
  );
  if (_canUseGameLoop())
    unregisterAutoplay = _setupGameLoopCarousel(
      count,
      () => activeIndex,
      (v) => (activeIndex = v),
      () => autoplayActive,
      (v) => (autoplayActive = v),
      autoplayInterval
    );
  else
    unregisterAutoplay = _setupIntervalCarousel(
      count,
      () => activeIndex,
      (v) => (activeIndex = v),
      () => autoplayActive,
      (v) => (autoplayActive = v),
      autoplayInterval
    );
  _updateCarousel(buttons, () => activeIndex);
  return unregisterAutoplay;
};

function _setupCarouselWheel(buttons, count, getIdx, setIdx) {
  document.querySelector(".carousel").addEventListener("wheel", function (e) {
    if (e.deltaY > 0) _scrollCarousel(count, getIdx, setIdx, 1, buttons);
    else _scrollCarousel(count, getIdx, setIdx, -1, buttons);
    e.preventDefault();
  });
}

function _scrollCarousel(count, getIdx, setIdx, delta, buttons) {
  setIdx((getIdx() + delta + count) % count);
  _updateCarousel(buttons, getIdx);
}

function _updateCarousel(buttons, getIdx) {
  buttons.forEach((btn, i) => {
    btn.classList.toggle("active", i === getIdx());
    btn.style.display = "inline-flex";
  });
  const activeBtn = buttons[getIdx()];
  if (activeBtn && typeof activeBtn.scrollIntoView === "function") {
    activeBtn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }
}

function _canUseGameLoop() {
  return (
    typeof window.getGameTime === "function" &&
    typeof window.registerGameLoop === "function"
  );
}

function _setupGameLoopCarousel(
  count,
  getIdx,
  setIdx,
  getActive,
  setActive,
  interval
) {
  let lastAutoplayTick = window.getGameTime();
  const unregister = window.registerGameLoop((gameTime) => {
    if (!getActive()) return;
    if (gameTime - lastAutoplayTick >= interval) {
      _scrollCarousel(
        count,
        getIdx,
        setIdx,
        1,
        document.querySelectorAll(".carousel button")
      );
      lastAutoplayTick = gameTime;
    }
  });
  const carouselElem = document.querySelector(".carousel");
  carouselElem.addEventListener("mouseenter", () => setActive(false));
  carouselElem.addEventListener("mouseleave", () => {
    setActive(true);
    lastAutoplayTick = window.getGameTime();
  });
  return unregister;
}

function _setupIntervalCarousel(
  count,
  getIdx,
  setIdx,
  getActive,
  setActive,
  interval
) {
  let intervalId = setInterval(() => {
    if (getActive())
      _scrollCarousel(
        count,
        getIdx,
        setIdx,
        1,
        document.querySelectorAll(".carousel button")
      );
  }, interval);
  const carouselElem = document.querySelector(".carousel");
  carouselElem.addEventListener("mouseenter", () => setActive(false));
  carouselElem.addEventListener("mouseleave", () => setActive(true));
  return () => clearInterval(intervalId);
}
/**
 * Sets up the no-restart button alert on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const noRestartBtn = document.getElementById("no-restart-btn");
  const overlay = document.getElementById("no-restart-overlay");
  if (noRestartBtn && overlay) {
    overlay.style.display = "none";
    overlay.style.top = "-200px";
    overlay.style.opacity = "0";
    overlay.style.animation = "none";
    noRestartBtn.addEventListener("click", function () {
      overlay.style.display = "block";
      overlay.style.animation =
        "overlaySlideIn 0.7s cubic-bezier(.77,0,.18,1) forwards";
      setTimeout(() => {
        overlay.style.animation =
          "overlaySlideOut 0.7s cubic-bezier(.77,0,.18,1) forwards";
        setTimeout(() => {
          overlay.style.display = "none";
          overlay.style.top = "-200px";
          overlay.style.opacity = "0";
          overlay.style.animation = "none";
        }, 700);
      }, 3000);
    });
  }
});
