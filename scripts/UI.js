export let selectedItem = null;

export function initUI() {
  document.querySelectorAll(".item").forEach((item) => {
    item.addEventListener("click", () => {
      selectedItem = item.dataset.selectedItem;
      document
        .querySelectorAll(".item")
        .forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
    });
  });
}
