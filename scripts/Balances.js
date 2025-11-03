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
  const woodSlot = document.getElementById("wood-slot");
  const stoneSlot = document.getElementById("stone-slot");

  if (woodEl) woodEl.textContent = balances.wood;
  if (stoneEl) stoneEl.textContent = balances.stone;

  if (woodSlot) woodSlot.style.display = balances.wood > 0 ? "flex" : "none";
  if (stoneSlot) stoneSlot.style.display = balances.stone > 0 ? "flex" : "none";
}
