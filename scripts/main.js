console.log("loading: main.js");

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { generateForest, seasons } from "./ForestGenerator";
import { balances, saveBalances, updateBalancesDisplay } from "./Balances";

updateBalancesDisplay();

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);
const target = new THREE.Vector3(0, 0, 0);
camera.lookAt(target);
const up = new THREE.Vector3(0, 1, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("gameCanvas"),
  antialias: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(target);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableRotate = true;
controls.maxDistance = 20;

controls.addEventListener("change", () => {
  const distance = camera.position.distanceTo(controls.target);
  if (distance > 20) {
    camera.position.sub(controls.target).setLength(20).add(controls.target);
  }
  if (controls.target.length() > 20) {
    controls.target.setLength(20);
  }
});

// Grid/Floor
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 });

const ground = new THREE.Mesh(planeGeometry, planeMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const gridHelper = new THREE.GridHelper(100, 100, 0x1d691d, 0x1d691d);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

const leafMeshes = generateForest(scene, 0);

// Seasons
let currentSeasonIndex = 0;
let nextSeasonIndex = 1;
let transitionStart = Date.now();
const transitionDuration = 60000;

// WASD Movement
const keys = { w: false, a: false, s: false, d: false };
const moveSpeed = 0.1;
const zoomSpeed = 0.1;

window.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) {
    keys[key] = true;
    e.preventDefault();
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) {
    keys[key] = false;
  }
});

// Animate Loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  const forward = new THREE.Vector3()
    .subVectors(controls.target, camera.position)
    .normalize();
  const right = new THREE.Vector3().crossVectors(up, forward).normalize();

  const maxDistance = 20;

  if (keys.w) {
    const direction = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();
    const newCamPos = camera.position
      .clone()
      .addScaledVector(direction, -zoomSpeed);
    if (newCamPos.length() <= maxDistance) {
      camera.position.copy(newCamPos);
    }
  }

  if (keys.s) {
    const direction = new THREE.Vector3()
      .subVectors(camera.position, controls.target)
      .normalize();
    const newCamPos = camera.position
      .clone()
      .addScaledVector(direction, zoomSpeed);
    if (newCamPos.length() <= maxDistance) {
      camera.position.copy(newCamPos);
    }
  }

  if (keys.a) {
    const newCamX = camera.position.x + right.x * moveSpeed;
    const newTargetX = controls.target.x + right.x * moveSpeed;
    const newCamPos = new THREE.Vector3(
      newCamX,
      camera.position.y,
      camera.position.z
    );
    const newTargetPos = new THREE.Vector3(
      newTargetX,
      controls.target.y,
      controls.target.z
    );
    if (
      newCamPos.length() <= maxDistance &&
      newTargetPos.length() <= maxDistance
    ) {
      camera.position.x = newCamX;
      controls.target.x = newTargetX;
    }
  }
  if (keys.d) {
    const newCamX = camera.position.x + right.x * -moveSpeed;
    const newTargetX = controls.target.x + right.x * -moveSpeed;
    const newCamPos = new THREE.Vector3(
      newCamX,
      camera.position.y,
      camera.position.z
    );
    const newTargetPos = new THREE.Vector3(
      newTargetX,
      controls.target.y,
      controls.target.z
    );
    if (
      newCamPos.length() <= maxDistance &&
      newTargetPos.length() <= maxDistance
    ) {
      camera.position.x = newCamX;
      controls.target.x = newTargetX;
    }
  }

  // Seasons
  const now = Date.now();
  let blend = (now - transitionStart) / transitionDuration;
  if (blend >= 1) {
    currentSeasonIndex = nextSeasonIndex;
    nextSeasonIndex = (nextSeasonIndex + 1) % 4;
    transitionStart = now;
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

// Resizer
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
