export let selectedItem = null;

export function setSelectedItem(value) {
  selectedItem = value;
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
}
