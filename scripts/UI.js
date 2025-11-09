export let selectedItem = null;

export function setSelectedItem(value) {
  selectedItem = value;
  const instructionEl = document.getElementById("build-instruction");
  if (value) {
    instructionEl.style.display = "block";
  } else {
    instructionEl.style.display = "none";
  }
}

export function initUI() {
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", () => {
      setSelectedItem(item.dataset.id);
      document
        .querySelectorAll(".item")
        .forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && selectedItem) {
      setSelectedItem(null);
      document
        .querySelectorAll(".item")
        .forEach((i) => i.classList.remove("selected"));
    }
  });
}
