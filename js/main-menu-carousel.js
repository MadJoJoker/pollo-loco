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
      btn.classList.toggle("active", i === activeIndex);
      btn.style.display = "inline-flex";
    });

    const activeBtn = buttons[activeIndex];
    if (activeBtn && typeof activeBtn.scrollIntoView === "function") {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
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
  let autoplayInterval = 2000;
  let unregisterAutoplay = null;
  
  // Only use game loop if available (interval-helper.js loaded)
  if (typeof window.getGameTime === 'function' && typeof window.registerGameLoop === 'function') {
    let lastAutoplayTick = window.getGameTime();
    unregisterAutoplay = window.registerGameLoop((gameTime) => {
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
  } else {
    // Fallback to setInterval if game loop not available
    let intervalId = setInterval(() => {
      if (autoplayActive) {
        scrollCarousel(1);
      }
    }, autoplayInterval);
    
    const carouselElem = document.querySelector(".carousel");
    carouselElem.addEventListener("mouseenter", () => {
      autoplayActive = false;
    });
    carouselElem.addEventListener("mouseleave", () => {
      autoplayActive = true;
    });
    
    unregisterAutoplay = () => clearInterval(intervalId);
  }

  updateCarousel();
  return unregisterAutoplay;
};
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
