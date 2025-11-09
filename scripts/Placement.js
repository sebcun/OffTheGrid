import { selectedItem, setSelectedItem } from "./UI.js";
import { parsePrice, canAfford, deductPrice } from "./Balances.js";
import { savePlacedItems } from "./SaveManager.js";
import { modelCreators } from "./Models.js";
import * as THREE from "three";

let previewMesh = null;
export const placedItems = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let mouseDown = false;
let dragStarted = false;
const dragThreshold = 5;
let mouseStartX = 0;
let mouseStartY = 0;

export function getMeshCreator(selectedItem) {
  return modelCreators[selectedItem] || null;
}

function isPositionFree(x, z) {
  return !placedItems.some((item) => item.x === x && item.z === z);
}

export function initPlacement(scene, camera, ground) {
  const canvas = document.getElementById("gameCanvas");

  canvas.addEventListener("mousedown", (event) => {
    if (selectedItem) {
      mouseDown = true;
      dragStarted = false;
      mouseStartX = event.clientX;
      mouseStartY = event.clientY;
    }
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", (event) => {
    if (mouseDown && selectedItem && !dragStarted) {
      const dx = event.clientX - mouseStartX;
      const dy = event.clientY - mouseStartY;
      if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
        dragStarted = true;
      }
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(ground);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const x = Math.round(point.x) + 0.5;
      const z = Math.round(point.z) + 0.5;

      if (selectedItem) {
        const meshCreator = getMeshCreator(selectedItem);
        if (meshCreator) {
          if (!previewMesh) {
            previewMesh = meshCreator(0xff0000);
            scene.add(previewMesh);
          }

          const isOutOfBounds = z < -10.5 || z > 10.5 || x < -10.5 || x > 10.5;
          previewMesh.children.forEach((child) => {
            if (child.material) {
              child.material.color.set(isOutOfBounds ? 0xff0000 : 0xffffff);
            }
          });

          let yPos = 0;
          if (selectedItem === "dirtpath") yPos = 0.02;
          previewMesh.position.set(x, yPos, z);
        } else {
          if (previewMesh) {
            scene.remove(previewMesh);
            previewMesh = null;
          }
        }
      }
    } else {
      if (previewMesh) {
        scene.remove(previewMesh);
        previewMesh = null;
      }
    }
  });

  canvas.addEventListener("click", (event) => {
    if (selectedItem && !dragStarted) {
      const meshCreator = getMeshCreator(selectedItem);
      if (!meshCreator) {
        console.log("Invalid item selected");
        return;
      }

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(ground);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const x = Math.round(point.x) + 0.5;
        const z = Math.round(point.z) + 0.5;
        const itemEl = document.querySelector(`[data-id="${selectedItem}"]`);
        const price = parsePrice(itemEl.dataset.price);
        if (canAfford(price)) {
          if (!isPositionFree(x, z)) {
            console.log("Position already occupied");
            return;
          }
          deductPrice(price);
          const farmMesh = meshCreator(0x00ff00);
          let yPos = 0;
          if (selectedItem === "dirtpath") yPos = 0.02;
          farmMesh.position.set(x, yPos, z);
          scene.add(farmMesh);
          placedItems.push({ type: selectedItem, x, z });
          savePlacedItems(placedItems);

          setSelectedItem(null);
          if (previewMesh) {
            scene.remove(previewMesh);
            previewMesh = null;
          }
          document
            .querySelectorAll(".item")
            .forEach((i) => i.classList.remove("selected"));
        } else {
          console.log("Not enough resources");
        }
      }
    }
    dragStarted = false;
  });
}
