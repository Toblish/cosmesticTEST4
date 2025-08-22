const carouselWrappers = document.querySelectorAll(".carousel-wrapper");

carouselWrappers.forEach(wrapper => {
  const carousel = wrapper.querySelector(".carousel");
  const leftBtn = wrapper.querySelector(".nav-left");
  const rightBtn = wrapper.querySelector(".nav-right");

  const boxWidth = 500;
  const swipeSpeed = 1.2; // sensitivity
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

  carousel.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    isDragging = true;
    startX = e.clientX;
    startScroll = carousel.scrollLeft;
    carousel.style.scrollBehavior = "auto";
    carousel.setPointerCapture(e.pointerId);
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = (e.clientX - startX) * swipeSpeed;
    carousel.scrollLeft = startScroll - dx;
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    carousel.releasePointerCapture(e.pointerId);
    // no momentum, stops exactly where released ✅
  }

  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointerleave", endDrag);
});