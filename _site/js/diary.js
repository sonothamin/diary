// "Show N more +" / "Show less −" on the home page columns.
document.querySelectorAll(".col").forEach(function (col) {
  var btn = col.querySelector("[data-toggle]");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var open = col.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? btn.dataset.less : btn.dataset.more;
  });
});
