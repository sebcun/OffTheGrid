import * as THREE from "three";

export function createWoodFarmMesh(color) {
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

export function createStoneFarmMesh(color) {
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

export function createDirtPathMesh(color) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.5,
  });
  const solidMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const geometry = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.Mesh(geometry, solidMaterial);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 10;
  return mesh;
}

export const modelCreators = {
  woodfarm: createWoodFarmMesh,
  stonefarm: createStoneFarmMesh,
  dirtpath: createDirtPathMesh,
};
