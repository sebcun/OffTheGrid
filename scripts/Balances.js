export const balances = {
  wood: parseInt(localStorage.getItem("wood") || "50"),
  stone: parseInt(localStorage.getItem("stone") || "50"),
};

export function saveBalances() {
  localStorage.setItem("wood", balances.wood.toString());
  localStorage.setItem("stone", balances.stone.toString());
}

export function updateBalancesDisplay() {
  const woodEl = document.getElementById("wood-balance");
  const stoneEl = document.getElementById("stone-balance");

  if (woodEl) woodEl.textContent = balances.wood;
  if (stoneEl) stoneEl.textContent = balances.stone;
}

export function parsePrice(priceStr) {
  const price = {};
  const parts = priceStr.split("|");
  parts.forEach((part) => {
    const match = part.match(/(\d+)(wood|stone)/);
    if (match) {
      price[match[2]] = parseInt(match[1]);
    }
  });
  return price;
}

export function canAfford(price) {
  return (
    (price.wood || 0) <= balances.wood && (price.stone || 0) <= balances.stone
  );
}

export function deductPrice(price) {
  balances.wood -= price.wood || 0;
  balances.stone -= price.stone || 0;
  saveBalances();
  updateBalancesDisplay();
}
