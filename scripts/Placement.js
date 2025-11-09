import { modelCreators } from "./Models.js";
import { forestBlockedPositions } from "./ForestGenerator.js";
import { items } from "./config.js";

export const placedItems = [];

export function getMeshCreator(selectedItem) {
  return modelCreators[selectedItem] || null;
}

export function isPositionFree(x, z) {
  return !placedItems.some((item) => item.x === x && item.z === z);
}

export function isWalkable(x, z) {
  const blockedByForest = forestBlockedPositions.has(`${x},${z}`);
  if (blockedByForest) return false;
  const occupyingItem = placedItems.find(
    (item) => item.x === x && item.z === z
  );
  if (!occupyingItem) return true;
  const cfg = items[occupyingItem.type];
  return cfg && cfg.category === "Paths";
}

export function initPlacement(scene, camera, ground) {}
