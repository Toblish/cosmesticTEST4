const carouselWrappers = document.querySelectorAll(".carousel-wrapper");

carouselWrappers.forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const leftBtn = wrapper.querySelector(".nav-left");
  const rightBtn = wrapper.querySelector(".nav-right");
  const boxWidth = 500;

  // Detect if it's mobile
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Buttons only for PC
  if (!isMobile) {
    function scrollCarousel(direction) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      let target = carousel.scrollLeft + direction * boxWidth;

      // Clamp to boundaries
      target = Math.max(0, Math.min(target, maxScroll));

      carousel.scrollTo({
        left: target,
        behavior: "smooth"
      });
    }

    leftBtn.addEventListener("click", () => scrollCarousel(-1));
    rightBtn.addEventListener("click", () => scrollCarousel(1));
  } else {
    // Hide buttons on mobile
    leftBtn.style.display = "none";
    rightBtn.style.display = "none";
  }

  // Momentum Dragging (works for both PC + Mobile)
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let velocity = 0;
  let lastX = 0;
  let lastTime = 0;
  let momentumID;

  carousel.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;

    isDragging = true;
    startX = e.clientX;
    startScroll = carousel.scrollLeft;
    velocity = 0;
    lastX = e.clientX;
    lastTime = Date.now();
    carousel.style.scrollBehavior = "auto";
    cancelAnimationFrame(momentumID);
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    carousel.scrollLeft = startScroll - dx;

    const now = Date.now();
    const dt = now - lastTime;
    if (dt > 0) {
      velocity = (e.clientX - lastX) / dt;
      lastX = e.clientX;
      lastTime = now;
    }
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    carousel.releasePointerCapture(e.pointerId);
    momentumScroll(velocity);
  }

  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointerleave", endDrag);

  function momentumScroll(initialVelocity) {
    let v = initialVelocity * 30; // tuned multiplier for smoother mobile
    const friction = 0.92; // higher = smoother, longer swipe
    const minVelocity = 0.2;

    function step() {
      if (Math.abs(v) < minVelocity) {
        carousel.style.scrollBehavior = "smooth";
        return;
      }

      let nextScroll = carousel.scrollLeft - v;

      // Clamp to boundaries
      if (nextScroll < 0) {
        nextScroll = 0;
        v = 0;
      } else if (nextScroll > carousel.scrollWidth - carousel.clientWidth) {
        nextScroll = carousel.scrollWidth - carousel.clientWidth;
        v = 0;
      }

      carousel.scrollLeft = nextScroll;
      v *= friction;

      momentumID = requestAnimationFrame(step);
    }

    step();
  }
});