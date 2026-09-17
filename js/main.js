const startButton = document.querySelector(".welcome__button");

const transition = document.querySelector(".page-transition");

const welcomeSection = document.querySelector(".welcome");

/* ================================
   PAGE ENTRANCE
================================ */

window.addEventListener("load", () => {
  welcomeSection.classList.add("page-loaded");
});

/* ================================
   PAGE EXIT
================================ */

startButton.addEventListener("click", () => {
  welcomeSection.classList.add("exit");

  transition.classList.add("active");

  setTimeout(() => {
    window.location.href = "pages/celebration.html";
  }, 900);
});
