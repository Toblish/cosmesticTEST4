const carouselWrappers = document.querySelectorAll(".carousel-wrapper");

carouselWrappers.forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const leftBtn = wrapper.querySelector(".nav-left");
  const rightBtn = wrapper.querySelector(".nav-right");

  const boxWidth = 500;
  const swipeSpeed = 1.2; // 🔥 Control swipe sensitivity (1 = normal, >1 faster)

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // Buttons (PC only)
  if (!isMobile) {
    function scrollCarousel(direction) {
      const maxScroll = carousel.scrollWidth - carousel.clientWidth;
      let target = carousel.scrollLeft + direction * boxWidth;
      target = Math.max(0, Math.min(target, maxScroll));

      carousel.scrollTo({ left: target, behavior: "smooth" });
    }
    leftBtn.addEventListener("click", () => scrollCarousel(-1));
    rightBtn.addEventListener("click", () => scrollCarousel(1));
  } else {
    leftBtn.style.display = "none";
    rightBtn.style.display = "none";
  }

  // Drag/Swipe (momentum works smoothly)
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

    const dx = (e.clientX - startX) * swipeSpeed; // 🔥 control swipe speed here
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
    let v = initialVelocity * 40; // 🔥 Adjust inertia feel
    const friction = 0.95;       // 🔥 Higher = longer glide
    const minVelocity = 0.1;

    function step() {
      if (Math.abs(v) < minVelocity) {
        carousel.style.scrollBehavior = "smooth";
        return;
      }

      let nextScroll = carousel.scrollLeft - v;

      // Boundaries
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