console.log("loading: ForestGenerator.js");

import * as THREE from "three";

export const summerMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x1e4d2b }),
  new THREE.MeshBasicMaterial({ color: 0x266d34 }),
  new THREE.MeshBasicMaterial({ color: 0x2f8f3d }),
  new THREE.MeshBasicMaterial({ color: 0x3ea84a }),
  new THREE.MeshBasicMaterial({ color: 0x46c356 }),
  new THREE.MeshBasicMaterial({ color: 0x337a35 }),
  new THREE.MeshBasicMaterial({ color: 0x1b5e20 }),
];

export const autumnMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xa63c06 }),
  new THREE.MeshBasicMaterial({ color: 0xd95f02 }),
  new THREE.MeshBasicMaterial({ color: 0xe69500 }),
  new THREE.MeshBasicMaterial({ color: 0xf2c14e }),
  new THREE.MeshBasicMaterial({ color: 0xc0392b }),
  new THREE.MeshBasicMaterial({ color: 0x8b0000 }),
  new THREE.MeshBasicMaterial({ color: 0x9a7b4f }),
];

export const winterMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x4a5568 }),
  new THREE.MeshBasicMaterial({ color: 0x2c3e50 }),
  new THREE.MeshBasicMaterial({ color: 0x6c757d }),
  new THREE.MeshBasicMaterial({ color: 0x7f8c8d }),
  new THREE.MeshBasicMaterial({ color: 0x95a5a6 }),
  new THREE.MeshBasicMaterial({ color: 0x34495e }),
  new THREE.MeshBasicMaterial({ color: 0x1c2833 }),
];

export const springMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x76c893 }),
  new THREE.MeshBasicMaterial({ color: 0xa8e6cf }),
  new THREE.MeshBasicMaterial({ color: 0x55a630 }),
  new THREE.MeshBasicMaterial({ color: 0x9ae6b4 }),
  new THREE.MeshBasicMaterial({ color: 0x4caf50 }),
  new THREE.MeshBasicMaterial({ color: 0x81c784 }),
  new THREE.MeshBasicMaterial({ color: 0x2e7d32 }),
];

export const seasons = [
  summerMaterials,
  autumnMaterials,
  winterMaterials,
  springMaterials,
];

export const forestBlockedPositions = new Set();

export function generateForest(scene, seasonIndex) {
  const trunkMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x4b2e05 }),
    new THREE.MeshBasicMaterial({ color: 0x5a3810 }),
    new THREE.MeshBasicMaterial({ color: 0x6b4423 }),
    new THREE.MeshBasicMaterial({ color: 0x7c552a }),
    new THREE.MeshBasicMaterial({ color: 0x8b5a2b }),
    new THREE.MeshBasicMaterial({ color: 0x9c6b3b }),
    new THREE.MeshBasicMaterial({ color: 0x3e260a }),
  ];

  const leafMeshes = [];

  for (let x = -50; x <= 50; x += 1.5) {
    for (let z = -50; z <= 50; z += 1.5) {
      if (Math.abs(x) > 10 || Math.abs(z) > 10) {
        const randX = x + (Math.random() - 0.5) * 0.5;
        const randZ = z + (Math.random() - 0.5) * 0.5;

        const trunkHeight = 0.5 + Math.random() * 1.5;
        const trunkMaterial =
          trunkMaterials[Math.floor(Math.random() * trunkMaterials.length)];
        const trunk = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, trunkHeight, 0.2),
          trunkMaterial
        );
        trunk.position.set(randX, trunkHeight / 2, randZ);
        trunk.userData.isForest = true;
        scene.add(trunk);

        const blockedX = Math.round(randX - 0.5) + 0.5;
        const blockedZ = Math.round(randZ - 0.5) + 0.5;
        forestBlockedPositions.add(`${blockedX},${blockedZ}`);

        const leafSize = 0.5 + Math.random() * 1;
        const leafIndex = Math.floor(Math.random() * 7);
        const leafMaterial = seasons[seasonIndex][leafIndex].clone();
        const leaves = new THREE.Mesh(
          new THREE.BoxGeometry(leafSize, leafSize, leafSize),
          leafMaterial
        );
        leaves.position.set(randX, trunkHeight + leafSize / 2, randZ);
        leaves.userData.leafIndex = leafIndex;
        leaves.userData.isForest = true;
        scene.add(leaves);
        leafMeshes.push(leaves);
      }
    }
  }

  return leafMeshes;
}
