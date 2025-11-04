import { selectedItem } from "./UI.js";
import { parsePrice, canAfford, deductPrice } from "./Balances.js";
import * as THREE from "three";

let previewMesh = null;
const placedItems = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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
      console.log(x, z);

      if (!previewMesh) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.5,
        });
        previewMesh = new THREE.Mesh(geometry, material);
        scene.add(previewMesh);
      }

      if (z < -10.5 || z > 10.5 || x < -10.5 || x > 10.5) {
        previewMesh.material.color.set(0xff0000);
      } else {
        previewMesh.material.color.set(0xffffff);
      }
      previewMesh.position.set(x, 0.5, z);
    }
  });
}
