const img = document.querySelector(".LS-box img");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // play animation when entering
        img.style.transform = "translateZ(0) rotate(60deg) scale(1.6)";
      } else {
        // reverse when leaving (scroll back up)
        img.style.transform = "translateZ(0) rotate(0deg) scale(0)";
      }
    });
  },
  {
    threshold: 0.3, // triggers when 30% of element is in view
  }
);

observer.observe(img);