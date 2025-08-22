const carouselWrappers = document.querySelectorAll(".carousel-wrapper");

carouselWrappers.forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const leftBtn = wrapper.querySelector(".nav-left");
  const rightBtn = wrapper.querySelector(".nav-right");

  const boxWidth = 500;
  const swipeSpeed = 1.2; // 🔥 sensitivity
  const maxVelocity = 40; // 🔥 limit top speed
  const minVelocity = 5;  // 🔥 minimum fling speed

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  // PC buttons
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

  // Drag/Swipe
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let velocitySamples = [];
  let momentumID;

  carousel.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    isDragging = true;
    startX = e.clientX;
    startScroll = carousel.scrollLeft;
    velocitySamples = [];
    carousel.style.scrollBehavior = "auto";
    cancelAnimationFrame(momentumID);
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - startX) * swipeSpeed;
    carousel.scrollLeft = startScroll - dx;

    // record movement with timestamp
    velocitySamples.push({ x: e.clientX, t: Date.now() });
    if (velocitySamples.length > 5) velocitySamples.shift(); // keep last few samples
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    carousel.releasePointerCapture(e.pointerId);

    // compute velocity based on last samples
    if (velocitySamples.length >= 2) {
      const first = velocitySamples[0];
      const last = velocitySamples[velocitySamples.length - 1];
      const dx = last.x - first.x;
      const dt = (last.t - first.t) || 1;
      let velocity = -(dx / dt) * 200; // pixels per second approx

      // clamp velocity for consistency
      if (Math.abs(velocity) < minVelocity) velocity = 0;
      if (velocity > maxVelocity) velocity = maxVelocity;
      if (velocity < -maxVelocity) velocity = -maxVelocity;

      momentumScroll(velocity);
    }
  }

  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointerleave", endDrag);

  // Momentum scroll
  function momentumScroll(velocity) {
    let v = velocity;
    const friction = 0.95;

    function step() {
      if (Math.abs(v) < 0.5) return;
      carousel.scrollLeft += v;
      v *= friction;

      if (carousel.scrollLeft <= 0 || carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
        v = 0; // stop at edges
      }
      momentumID = requestAnimationFrame(step);
    }
    step();
  }
});