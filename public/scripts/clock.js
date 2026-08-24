function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = `${h}:${m}:${s}`;
}

function chooseClock(style) {
  document.body.dataset.clock = style;
  localStorage.setItem("oclok-clock-style", style);
  document.querySelectorAll(".clock-choice").forEach(choice => {
    const selected = choice.dataset.style === style;
    choice.classList.toggle("selected", selected);
    choice.setAttribute("aria-pressed", String(selected));
  });
}

document.querySelectorAll(".clock-choice").forEach(choice => {
  choice.addEventListener("click", () => chooseClock(choice.dataset.style));
});

chooseClock(localStorage.getItem("oclok-clock-style") || "neon");
setInterval(updateClock, 1000);
updateClock();
