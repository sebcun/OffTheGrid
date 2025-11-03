console.log("loading: ForestGenerator.js");

import * as THREE from "three";

export function generateForest(scene) {
  const trunkMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x4b2e05 }),
    new THREE.MeshBasicMaterial({ color: 0x5a3810 }),
    new THREE.MeshBasicMaterial({ color: 0x6b4423 }),
    new THREE.MeshBasicMaterial({ color: 0x7c552a }),
    new THREE.MeshBasicMaterial({ color: 0x8b5a2b }),
    new THREE.MeshBasicMaterial({ color: 0x9c6b3b }),
    new THREE.MeshBasicMaterial({ color: 0x3e260a }),
  ];

  const leafMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x1e4d2b }),
    new THREE.MeshBasicMaterial({ color: 0x266d34 }),
    new THREE.MeshBasicMaterial({ color: 0x2f8f3d }),
    new THREE.MeshBasicMaterial({ color: 0x3ea84a }),
    new THREE.MeshBasicMaterial({ color: 0x46c356 }),
    new THREE.MeshBasicMaterial({ color: 0x337a35 }),
    new THREE.MeshBasicMaterial({ color: 0x1b5e20 }),
  ];

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
        scene.add(trunk);

        const leafSize = 0.5 + Math.random() * 1;
        const leafMaterial =
          leafMaterials[Math.floor(Math.random() * leafMaterials.length)];
        const leaves = new THREE.Mesh(
          new THREE.BoxGeometry(leafSize, leafSize, leafSize),
          leafMaterial
        );
        leaves.position.set(randX, trunkHeight + leafSize / 2, randZ);
        scene.add(leaves);
      }
    }
  }
}
