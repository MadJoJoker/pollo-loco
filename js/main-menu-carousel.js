window.initCarousel = function () {
  const buttons = document.querySelectorAll(".carousel button");
  const count = buttons.length;
  let activeIndex = 0;

  function updateCarousel() {
    buttons.forEach((btn, i) => {
      btn.classList.remove("active");
      btn.style.display = i === activeIndex ? "block" : "none";
      if (i === activeIndex) {
        btn.classList.add("active");
      }
    });
  }

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

  let autoplayInterval = null;
  function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(() => {
      scrollCarousel(1);
    }, 800);
  }
  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }
  const carouselElem = document.querySelector(".carousel");
  carouselElem.addEventListener("mouseenter", stopAutoplay);
  carouselElem.addEventListener("mouseleave", startAutoplay);
  startAutoplay();

  updateCarousel();
};
document.addEventListener('DOMContentLoaded', function () {
  const noRestartBtn = document.getElementById('no-restart-btn');
  if (noRestartBtn) {
    noRestartBtn.addEventListener('click', function () {
      alert('Give up is no option. Try again.');
    });
  }
});
