import { modelCreators } from "./Models.js";

export const placedItems = [];

export function getMeshCreator(selectedItem) {
  return modelCreators[selectedItem] || null;
}

export function isPositionFree(x, z) {
  return !placedItems.some((item) => item.x === x && item.z === z);
}

// No mouse-based placement: placement handled from main.js (player-front placement).
export function initPlacement(scene, camera, ground) {
  // intentionally left blank
}
