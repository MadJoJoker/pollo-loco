window.initCarousel = function () {
  const buttons = document.querySelectorAll(".carousel button");
  const count = buttons.length;
  const radius = 60;
  let offset = 0;

  function setButtonPosition(btn, angle) {
    const y = Math.sin(angle) * radius;
    btn.style.transform = `translate(-50%, ${y}px)`;
    btn.style.left = "50%";
    btn.style.top = "50%";
    btn.style.transition = "transform 0.2s";
  }

  function setButtonClass(btn, i, activeIndex) {
    btn.classList.remove("active", "prev", "next");
    if (i === activeIndex) {
      btn.classList.add("active");
    } else if (i === (activeIndex - 1 + count) % count) {
      btn.classList.add("prev");
    } else if (i === (activeIndex + 1) % count) {
      btn.classList.add("next");
    }
  }

  function getActiveIndex(offset) {
    return Math.round((offset / (Math.PI * 2)) * count) % count;
  }

  function updateCarousel() {
    const activeIndex = getActiveIndex(offset);
    buttons.forEach((btn, i) => {
      const angle = (i / count) * Math.PI * 2 + offset;
      setButtonPosition(btn, angle);
      setButtonClass(btn, i, activeIndex);
    });
  }

  function animate() {
    offset += 0.002;
    updateCarousel();
    requestAnimationFrame(animate);
  }

  updateCarousel();
  animate();
};
