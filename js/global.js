const scrollButton = document.getElementById("scroll-down-button");

scrollButton.addEventListener("click", function (event) {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
});
