export function savePlacedItems(placedItems) {
  localStorage.setItem("placedItems", JSON.stringify(placedItems));
}

export function loadPlacedItems() {
  const data = localStorage.getItem("placedItems");
  return data ? JSON.parse(data) : [];
}

export function setTutorialShown(value = true) {
  localStorage.setItem("tutorialShown", value ? "1" : "0");
}

export function isTutorialShown() {
  return localStorage.getItem("tutorialShown") === "1";
}
