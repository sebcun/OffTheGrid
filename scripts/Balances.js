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
