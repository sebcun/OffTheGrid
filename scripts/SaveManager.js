export function savePlacedItems(placedItems) {
  localStorage.setItem("placedItems", JSON.stringify(placedItems));
}

export function loadPlacedItems() {
  const data = localStorage.getItem("placedItems");
  return data ? JSON.parse(data) : [];
}
