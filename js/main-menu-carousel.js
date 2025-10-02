/**
 * Initializes the main menu carousel, sets up event listeners, and starts autoplay.
 */
window.initCarousel = function () {
  const buttons = document.querySelectorAll(".carousel button");
  const count = buttons.length;
  let activeIndex = 0;

  /**
   * Updates the carousel to show only the active button and set the active class.
   */
  function updateCarousel() {
    buttons.forEach((btn, i) => {
      btn.classList.remove("active");
      btn.style.display = i === activeIndex ? "block" : "none";
      if (i === activeIndex) {
        btn.classList.add("active");
      }
    });
  }

  /**
   * Scrolls the carousel by the given delta and updates the view.
   * @param {number} delta - The number of steps to scroll (positive or negative).
   */
  function scrollCarousel(delta) {
    activeIndex = (activeIndex + delta + count) % count;
    updateCarousel();
  }

  document.querySelector(".carousel").addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
      scrollCarousel(1);
    } else {
      scrollCarousel(-1);
    }
    e.preventDefault();
  });

  let autoplayActive = true;
  let lastAutoplayTick = window.getGameTime();
  const autoplayInterval = 2000;
  const unregisterAutoplay = window.registerGameLoop((gameTime) => {
    if (!autoplayActive) return;
    if (gameTime - lastAutoplayTick >= autoplayInterval) {
      scrollCarousel(1);
      lastAutoplayTick = gameTime;
    }
  });
  const carouselElem = document.querySelector(".carousel");
  carouselElem.addEventListener("mouseenter", () => {
    autoplayActive = false;
  });
  carouselElem.addEventListener("mouseleave", () => {
    autoplayActive = true;
    lastAutoplayTick = window.getGameTime();
  });

  updateCarousel();
  return unregisterAutoplay;
};
/**
 * Sets up the no-restart button alert on DOMContentLoaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  const noRestartBtn = document.getElementById("no-restart-btn");
  if (noRestartBtn) {
    noRestartBtn.addEventListener("click", function () {
      alert("Give up is no option. Try again.");
    });
  }
});
