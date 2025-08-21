document.addEventListener("DOMContentLoaded", () => {
  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "/") currentPage = "index.html";

  const navLinks = document.querySelectorAll("header a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    const normalizedHref = href.replace("./", "");

    if (normalizedHref === currentPage) {
      link.querySelector(".nav-button").classList.add("active");
    }
  });
});
