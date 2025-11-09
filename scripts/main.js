console.log("loading: main.js");

import * as THREE from "three";
import { generateForest, seasons } from "./ForestGenerator";
import {
  updateBalancesDisplay,
  addResources,
  parsePrice,
  canAfford,
  deductPrice,
} from "./Balances";
import { initUI, selectedItem, setSelectedItem } from "./UI";
import {
  initPlacement,
  placedItems,
  getMeshCreator,
  isPositionFree,
} from "./Placement";
import { loadPlacedItems, savePlacedItems } from "./SaveManager";
import { items } from "./config.js";
import { populateShop } from "./Shop.js";
updateBalancesDisplay();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("gameCanvas"),
  antialias: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const player = new THREE.Group();

const head = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.2, 0.2),
  new THREE.MeshBasicMaterial({ color: 0xd4a574 })
);
head.position.set(0, 0.6, 0);
player.add(head);

const hairBack = new THREE.Mesh(
  new THREE.BoxGeometry(0.22, 0.08, 0.22),
  new THREE.MeshBasicMaterial({ color: 0x3d2817 })
);
hairBack.position.set(0, 0.74, 0);
player.add(hairBack);

const hairFront = new THREE.Mesh(
  new THREE.BoxGeometry(0.22, 0.06, 0.08),
  new THREE.MeshBasicMaterial({ color: 0x3d2817 })
);
hairFront.position.set(0, 0.68, 0.12);
player.add(hairFront);

const beard = new THREE.Mesh(
  new THREE.BoxGeometry(0.14, 0.08, 0.08),
  new THREE.MeshBasicMaterial({ color: 0x3d2817 })
);
beard.position.set(0, 0.54, 0.11);
player.add(beard);

const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.24, 0.3, 0.14),
  new THREE.MeshBasicMaterial({ color: 0x8b4513 })
);
body.position.set(0, 0.35, 0);
player.add(body);

const leftArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 0.28, 0.08),
  new THREE.MeshBasicMaterial({ color: 0xc89858 })
);
leftArm.position.set(-0.16, 0.35, 0);
player.add(leftArm);

const rightArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.08, 0.28, 0.08),
  new THREE.MeshBasicMaterial({ color: 0xc89858 })
);
rightArm.position.set(0.16, 0.35, 0);
player.add(rightArm);

const leftLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.3, 0.1),
  new THREE.MeshBasicMaterial({ color: 0x4a4a3a })
);
leftLeg.position.set(-0.06, 0.05, 0);
player.add(leftLeg);

const rightLeg = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.3, 0.1),
  new THREE.MeshBasicMaterial({ color: 0x4a4a3a })
);
rightLeg.position.set(0.06, 0.05, 0);
player.add(rightLeg);

scene.add(player);
player.position.set(0.5, 0, 0.5);

let playerRotation = 0;
let cameraDistance = 5;
let cameraHeight = 3;
let eyeHeight = 0.6;

const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });

const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const gridHelper = new THREE.GridHelper(100, 100, 0x1d691d, 0x1d691d);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

const leafMeshes = generateForest(scene, 0);

let currentSeasonIndex = 0;
let nextSeasonIndex = 1;
let transitionStart = Date.now();
const transitionDuration = 60000;

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  b: false,
  r: false,
  escape: false,
};

let moving = false;
let moveDuration = 0.2;
let moveStartTime = 0;
let startPosition = new THREE.Vector3();
let targetPosition = new THREE.Vector3();

let rotating = false;
let rotateDuration = 0.2;
let rotateStartTime = 0;
let startRotation = 0;
let targetRotation = 0;

let previewMesh = null;

let playerGrid = new THREE.Vector2(
  Math.round(player.position.x - 0.5),
  Math.round(player.position.z - 0.5)
);

function setPreviewAppearance(mesh) {
  const applyMat = (mat) => {
    if (!mat) return;
    if (Array.isArray(mat)) {
      mat.forEach((m) => {
        if (m) {
          m.transparent = true;
          m.opacity = 0.5;
        }
      });
    } else {
      mat.transparent = true;
      mat.opacity = 0.5;
    }
  };
  if (mesh.material) applyMat(mesh.material);
  mesh.children.forEach((c) => {
    if (c.material) applyMat(c.material);
  });
}

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) {
    keys[key] = true;
    e.preventDefault();
    if (!moving && !rotating) {
      if (key === "w") {
        const dx = Math.round(-Math.sin(playerRotation));
        const dz = Math.round(-Math.cos(playerRotation));
        playerGrid.x += dx;
        playerGrid.y += dz;
        targetPosition.set(playerGrid.x + 0.5, 0, playerGrid.y + 0.5);
        moving = true;
        moveStartTime = Date.now();
        startPosition.copy(player.position);
      } else if (key === "s") {
        const dx = Math.round(Math.sin(playerRotation));
        const dz = Math.round(Math.cos(playerRotation));
        playerGrid.x += dx;
        playerGrid.y += dz;
        targetPosition.set(playerGrid.x + 0.5, 0, playerGrid.y + 0.5);
        moving = true;
        moveStartTime = Date.now();
        startPosition.copy(player.position);
      } else if (key === "a") {
        targetRotation = playerRotation - Math.PI / 2;
        rotating = true;
        rotateStartTime = Date.now();
        startRotation = playerRotation;
      } else if (key === "d") {
        targetRotation = playerRotation + Math.PI / 2;
        rotating = true;
        rotateStartTime = Date.now();
        startRotation = playerRotation;
      } else if (key === "b" && selectedItem) {
        if (previewMesh) {
          const meshCreator = getMeshCreator(selectedItem);
          if (!meshCreator) {
            console.log("Invalid item selected");
            return;
          }
          const itemEl = document.querySelector(`[data-id="${selectedItem}"]`);
          const price = parsePrice(itemEl ? itemEl.dataset.price || "" : "");
          if (!canAfford(price)) {
            console.log("Not enough resources");
            return;
          }
          const x = playerGrid.x + 0.5;
          const z = playerGrid.y + 0.5;
          const isOutOfBounds = z < -10.5 || z > 10.5 || x < -10.5 || x > 10.5;
          if (isOutOfBounds) {
            console.log("Out of bounds");
            return;
          }
          if (!isPositionFree(x, z)) {
            console.log("Position already occupied");
            return;
          }
          deductPrice(price);
          const mesh = meshCreator(0x00ff00);
          let yPos = 0;
          if (selectedItem === "dirtpath") yPos = 0.02;
          mesh.position.set(x, yPos, z);
          mesh.userData = { type: selectedItem, x, z };
          scene.add(mesh);
          const item = { type: selectedItem, x, z };
          placedItems.push(item);
          savePlacedItems(placedItems);
        }
      } else if (key === "r") {
        const x = playerGrid.x + 0.5;
        const z = playerGrid.y + 0.5;
        const idx = placedItems.findIndex((it) => it.x === x && it.z === z);
        if (idx === -1) {
          console.log("No placed item here to sell");
          return;
        }
        const item = placedItems[idx];
        const cfg = items[item.type];
        if (!cfg || !cfg.price) {
          console.log("Cannot determine price for item");
          return;
        }
        const refund = {
          wood: Math.round((cfg.price.wood || 0) * 0.7),
          stone: Math.round((cfg.price.stone || 0) * 0.7),
        };
        addResources(refund);
        const meshIndex = scene.children.findIndex((child) => {
          return (
            child.userData &&
            child.userData.type === item.type &&
            child.position &&
            child.position.x === x &&
            child.position.z === z
          );
        });
        if (meshIndex !== -1) {
          scene.remove(scene.children[meshIndex]);
        } else {
          for (let i = scene.children.length - 1; i >= 0; i--) {
            const c = scene.children[i];
            if (
              c.position &&
              c.position.x === x &&
              c.position.z === z &&
              c.userData &&
              c.userData.type === item.type
            ) {
              scene.remove(c);
              break;
            }
          }
        }
        placedItems.splice(idx, 1);
        savePlacedItems(placedItems);
      } else if (key === "escape") {
        setSelectedItem(null);
      }
    }
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) {
    keys[key] = false;
  }
});

window.addEventListener("wheel", (e) => {
  cameraDistance += e.deltaY * 0.01;
  cameraDistance = Math.max(5, Math.min(20, cameraDistance));
});

const loadedItems = loadPlacedItems();
loadedItems.forEach((item) => {
  const meshCreator = getMeshCreator(item.type);
  if (meshCreator) {
    const mesh = meshCreator(0x00ff00);
    let yPos = 0;
    if (item.type === "dirtpath") yPos = 0.02;
    mesh.position.set(item.x, yPos, item.z);
    mesh.userData = { type: item.type, x: item.x, z: item.z };
    scene.add(mesh);
    placedItems.push(item);
  }
});

const icons = new Map();
function createNoPowerIconMesh() {
  const s = 0.9;
  const shape = new THREE.Shape();
  shape.moveTo(-0.12 * s, 0.28 * s);
  shape.lineTo(0.0 * s, 0.28 * s);
  shape.lineTo(-0.06 * s, 0.02 * s);
  shape.lineTo(0.12 * s, 0.02 * s);
  shape.lineTo(-0.02 * s, -0.38 * s);
  shape.lineTo(0.06 * s, -0.02 * s);
  shape.lineTo(-0.08 * s, -0.02 * s);
  shape.lineTo(0.12 * s, 0.28 * s);
  const extrudeSettings = { depth: 0.06 * s, bevelEnabled: false };
  const boltGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  boltGeom.computeBoundingBox();
  const box = boltGeom.boundingBox;
  const yCenter = (box.max.y + box.min.y) / 2;
  boltGeom.translate(0, -yCenter, 0);
  const boltMat = new THREE.MeshBasicMaterial({
    color: 0xffcc00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98,
  });
  const boltMesh = new THREE.Mesh(boltGeom, boltMat);
  const barGeom = new THREE.BoxGeometry(0.6 * s, 0.06 * s, 0.06 * s);
  const barMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  const bar = new THREE.Mesh(barGeom, barMat);
  bar.position.set(0, 0.05 * s, extrudeSettings.depth / 2 + 0.01);
  bar.rotation.z = -Math.PI / 8;
  const group = new THREE.Group();
  group.add(boltMesh);
  group.add(bar);
  group.scale.set(1.0, 1.0, 1.0);
  return group;
}

function getPoweredPositions() {
  const powered = new Set();
  placedItems.forEach((item) => {
    const itemConfig = items[item.type];
    if (itemConfig.category === "Energy") {
      const radius = itemConfig.radius || 0;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          const px = item.x + dx;
          const pz = item.z + dz;
          powered.add(`${px},${pz}`);
        }
      }
    }
  });
  return powered;
}

let lastResourceUpdate = Date.now();

function animate() {
  requestAnimationFrame(animate);

  const now = Date.now();
  const powered = getPoweredPositions();

  placedItems.forEach((item) => {
    const itemConfig = items[item.type];
    if (itemConfig.category === "Farms") {
      const posKey = `${item.x},${item.z}`;
      if (!powered.has(posKey)) {
        if (!icons.has(posKey)) {
          const icon = createNoPowerIconMesh();
          icon.position.set(item.x, 2, item.z);
          icon.userData = { posKey };
          scene.add(icon);
          icons.set(posKey, icon);
        }
      } else {
        if (icons.has(posKey)) {
          scene.remove(icons.get(posKey));
          icons.delete(posKey);
        }
      }
    }
  });

  if (now - lastResourceUpdate >= 1000) {
    const resourcesToAdd = { wood: 0, stone: 0 };
    placedItems.forEach((item) => {
      const itemConfig = items[item.type];
      if (itemConfig && itemConfig.rate) {
        const posKey = `${item.x},${item.z}`;
        if (powered.has(posKey)) {
          resourcesToAdd.wood += itemConfig.rate.wood || 0;
          resourcesToAdd.stone += itemConfig.rate.stone || 0;
        }
      }
    });
    addResources(resourcesToAdd);
    lastResourceUpdate = now;
  }

  if (moving) {
    const elapsed = (Date.now() - moveStartTime) / 1000;
    const t = Math.min(elapsed / moveDuration, 1);
    player.position.lerpVectors(startPosition, targetPosition, t);
    if (t >= 1) {
      player.position.copy(targetPosition);
      moving = false;
    }
  }

  if (rotating) {
    const elapsed = (Date.now() - rotateStartTime) / 1000;
    const t = Math.min(elapsed / rotateDuration, 1);
    playerRotation = startRotation + (targetRotation - startRotation) * t;
    if (t >= 1) {
      playerRotation = targetRotation;
      rotating = false;
    }
  }

  player.rotation.y = playerRotation + Math.PI;

  if (selectedItem) {
    if (!previewMesh) {
      const meshCreator = getMeshCreator(selectedItem);
      if (meshCreator) {
        previewMesh = meshCreator(0x00ff00);
        setPreviewAppearance(previewMesh);
        scene.add(previewMesh);
      }
    }
    if (previewMesh) {
      const posX = playerGrid.x + 0.5;
      const posZ = playerGrid.y + 0.5;
      const yPos = selectedItem === "dirtpath" ? 0.02 : 0;
      previewMesh.position.set(posX, yPos, posZ);

      const x = posX;
      const z = posZ;
      const isOutOfBounds = z < -10.5 || z > 10.5 || x < -10.5 || x > 10.5;
      const occupied = !isPositionFree(x, z);
      const bad = isOutOfBounds || occupied;
      const color = bad ? 0xff0000 : 0xffffff;
      if (previewMesh.material && previewMesh.material.color) {
        previewMesh.material.color.set(color);
      }
      previewMesh.children.forEach((child) => {
        if (child.material && child.material.color) {
          child.material.color.set(color);
        }
      });
    }
  } else {
    if (previewMesh) {
      scene.remove(previewMesh);
      previewMesh = null;
    }
  }

  const cameraRotation = playerRotation;

  camera.position.set(
    player.position.x + Math.sin(cameraRotation) * cameraDistance,
    player.position.y + cameraHeight,
    player.position.z + Math.cos(cameraRotation) * cameraDistance
  );
  camera.lookAt(
    player.position.x,
    player.position.y + eyeHeight,
    player.position.z
  );

  const nowSeason = Date.now();
  let blend = (nowSeason - transitionStart) / transitionDuration;
  if (blend >= 1) {
    currentSeasonIndex = nextSeasonIndex;
    nextSeasonIndex = (nextSeasonIndex + 1) % 4;
    transitionStart = nowSeason;
    blend = 0;
  }
  leafMeshes.forEach((leaf) => {
    const idx = leaf.userData.leafIndex;
    const currentColor = seasons[currentSeasonIndex][idx].color;
    const nextColor = seasons[nextSeasonIndex][idx].color;
    leaf.material.color.copy(currentColor).lerp(nextColor, blend);
  });

  updateBalancesDisplay();

  renderer.render(scene, camera);
}
animate();
populateShop();
initUI();
initPlacement(scene, camera, ground);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
