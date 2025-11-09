export const balances = {
  wood: parseInt(localStorage.getItem("wood") || "50"),
  stone: parseInt(localStorage.getItem("stone") || "50"),
  food: parseInt(localStorage.getItem("food") || "20"),
};

export function saveBalances() {
  localStorage.setItem("wood", balances.wood.toString());
  localStorage.setItem("stone", balances.stone.toString());
  localStorage.setItem("food", balances.food.toString());
}

export function updateBalancesDisplay() {
  const woodEl = document.getElementById("wood-balance");
  const stoneEl = document.getElementById("stone-balance");
  const foodEl = document.getElementById("food-balance");

  if (woodEl) woodEl.textContent = balances.wood;
  if (stoneEl) stoneEl.textContent = balances.stone;
  if (foodEl) foodEl.textContent = balances.food;
}

export function parsePrice(priceStr) {
  const price = {};
  if (!priceStr) return price;
  const parts = priceStr.split("|");
  parts.forEach((part) => {
    const match = part.match(/(\d+)(wood|stone|food)/);
    if (match) {
      price[match[2]] = parseInt(match[1]);
    }
  });
  return price;
}

export function canAfford(price) {
  for (const k in price) {
    const need = price[k] || 0;
    const have = balances[k] || 0;
    if (need > have) return false;
  }
  return true;
}

export function deductPrice(price) {
  for (const k in price) {
    balances[k] = (balances[k] || 0) - (price[k] || 0);
  }
  saveBalances();
  updateBalancesDisplay();
}

export function addResources(resources) {
  for (const k in resources) {
    balances[k] = (balances[k] || 0) + (resources[k] || 0);
  }
  saveBalances();
  updateBalancesDisplay();
}
