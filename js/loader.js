// js/loader.js

window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  loader.classList.add("hidden");
  setTimeout(() => {
    loader.style.display = "none";
  }, 500); // Match transition time in CSS
});
