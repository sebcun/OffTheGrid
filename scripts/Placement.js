import { selectedItem, setSelectedItem } from "./UI.js";
import { parsePrice, canAfford, deductPrice } from "./Balances.js";
import { savePlacedItems } from "./SaveManager.js";
import * as THREE from "three";

let previewMesh = null;
export const placedItems = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function createWoodFarmMesh(color) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
  });
  const solidMaterial = new THREE.MeshBasicMaterial({ color });
  const group = new THREE.Group();

  const baseGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.9);
  const base = new THREE.Mesh(baseGeometry, solidMaterial);
  base.position.set(0, -0.4, 0);
  group.add(base);

  const millGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
  const mill = new THREE.Mesh(millGeometry, solidMaterial);
  mill.position.set(0, -0.05, 0);
  group.add(mill);

  const sawGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 8);
  const saw = new THREE.Mesh(
    sawGeometry,
    new THREE.MeshBasicMaterial({ color: 0x888888 })
  );
  saw.position.set(0, 0.25, 0);
  saw.rotation.x = Math.PI / 2;
  group.add(saw);

  return group;
}

function createStoneFarmMesh(color) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
  });
  const solidMaterial = new THREE.MeshBasicMaterial({ color });
  const group = new THREE.Group();

  const baseGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.9);
  const base = new THREE.Mesh(baseGeometry, solidMaterial);
  base.position.set(0, -0.4, 0);
  group.add(base);

  const millGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
  const mill = new THREE.Mesh(millGeometry, solidMaterial);
  mill.position.set(0, -0.05, 0);
  group.add(mill);

  return group;
}

export function getMeshCreator(selectedItem) {
  switch (selectedItem) {
    case "woodfarm":
      return createWoodFarmMesh;
    case "stonefarm":
      return createStoneFarmMesh;
    default:
      return null;
  }
}

function isPositionFree(x, z) {
  return !placedItems.some((item) => item.x === x && item.z === z);
}

export function initPlacement(scene, camera, ground) {
  const canvas = document.getElementById("gameCanvas");

  canvas.addEventListener("mousemove", (event) => {
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

          previewMesh.position.set(x, 0, z);
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
    if (selectedItem) {
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
          farmMesh.position.set(x, 0, z);
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
  });
}
