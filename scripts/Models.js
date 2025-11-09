import * as THREE from "three";

function box(color, w = 0.8, h = 0.8, d = 0.8) {
  const mat = new THREE.MeshBasicMaterial({ color });
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  const g = new THREE.Group();
  mesh.position.y = -0.1 + h / 2 - 0.2;
  g.add(mesh);
  return g;
}

export function createWoodFarmMesh(color = 0x8b5a2b) {
  const g = new THREE.Group();
  const base = box(color, 0.9, 0.5, 0.9);
  g.add(base);

  // simple stacked logs to indicate wood
  const logMat = new THREE.MeshBasicMaterial({ color: 0x6b4226 });
  for (let i = 0; i < 3; i++) {
    const log = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.2), logMat);
    log.position.set(-0.15 + i * 0.15, -0.1 + 0.15, 0.25);
    g.add(log);
  }

  return g;
}

export function createStoneFarmMesh(color = 0x999999) {
  const g = new THREE.Group();
  const base = box(color, 0.9, 0.6, 0.9);
  g.add(base);

  // a simple pile of stones (three small cubes)
  const stoneMat = new THREE.MeshBasicMaterial({ color: 0x7f7f7f });
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), stoneMat);
    s.position.set(-0.15 + i * 0.15, -0.1 + 0.25 / 2, -0.15);
    s.rotation.y = i * 0.4;
    g.add(s);
  }

  return g;
}

export function createDirtPathMesh(color = 0x8b4513) {
  const mat = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
  const geo = new THREE.PlaneGeometry(1, 1);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0;
  const g = new THREE.Group();
  g.add(mesh);
  return g;
}

export function createCampfireMesh(color = 0xff4500) {
  const g = new THREE.Group();

  const logMat = new THREE.MeshBasicMaterial({ color: 0x6b4226 });
  for (let i = 0; i < 3; i++) {
    const log = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.12, 0.12), logMat);
    log.position.set((i - 1) * 0.22, -0.05, 0);
    log.rotation.z = Math.PI / 2;
    g.add(log);
  }

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff8c00 });
  const flame = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.36, 6), flameMat);
  flame.position.set(0, 0.15, 0);
  g.add(flame);

  return g;
}

export function createSawmillMesh(color = 0x9b6b3a) {
  const g = box(color, 0.9, 0.7, 0.9);

  // blade as thin box on side
  const bladeMat = new THREE.MeshBasicMaterial({ color: 0x666666 });
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.5), bladeMat);
  blade.position.set(0.45, 0, 0);
  g.add(blade);

  return g;
}

export function createQuarryMesh(color = 0x7f7f7f) {
  const g = box(color, 0.9, 0.6, 0.9);

  // pick/rock indicator - simple vertical slab
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.4, 0.25),
    new THREE.MeshBasicMaterial({ color: 0x555555 })
  );
  slab.position.set(0.2, 0.05, 0);
  slab.rotation.z = 0.6;
  g.add(slab);

  return g;
}

export function createWindTurbineMesh(color = 0xffffff) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.9, 0.08),
    new THREE.MeshBasicMaterial({ color: 0xdddddd })
  );
  pole.position.y = -0.1 + 0.9 / 2 - 0.2;
  g.add(pole);

  // three simple blades as thin boxes
  const bladeMat = new THREE.MeshBasicMaterial({ color: 0xccccff });
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.45, 0.08), bladeMat);
    b.position.y = pole.position.y + 0.38;
    b.rotation.z = (i * (Math.PI * 2)) / 3;
    b.rotation.y = Math.PI / 2;
    g.add(b);
  }

  return g;
}

export function createSolarPanelMesh(color = 0x222255) {
  const g = new THREE.Group();

  const panelMat = new THREE.MeshBasicMaterial({
    color,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.02, 0.45),
    panelMat
  );
  panel.rotation.x = -0.5;
  panel.position.y = -0.02;
  panel.position.z = 0;
  g.add(panel);

  // simple stand
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.3, 0.02),
    new THREE.MeshBasicMaterial({ color: 0x444444 })
  );
  stand.position.y = -0.2;
  stand.position.x = -0.25;
  g.add(stand);

  return g;
}

export function createTentMesh(color = 0xe0a96d) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.22, 0.8),
    new THREE.MeshBasicMaterial({ color })
  );
  base.position.y = -0.1 + 0.22 / 2 - 0.2;
  g.add(base);

  // triangular roof approximated with a rotated thin box
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 0.22, 0.1),
    new THREE.MeshBasicMaterial({ color: 0xbd7f3b })
  );
  roof.position.y = base.position.y + 0.18;
  roof.rotation.x = 0.5;
  g.add(roof);

  return g;
}

export function createCabinMesh(color = 0x8b5a2b) {
  const g = new THREE.Group();
  const main = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.7, 0.8),
    new THREE.MeshBasicMaterial({ color })
  );
  main.position.y = -0.1 + 0.7 / 2 - 0.2;
  g.add(main);

  // roof
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.18, 0.9),
    new THREE.MeshBasicMaterial({ color: 0x5b3216 })
  );
  roof.position.y = main.position.y + 0.5;
  roof.rotation.x = 0.05;
  g.add(roof);

  return g;
}

export function createGardenMesh(color = 0x2e8b57) {
  const g = new THREE.Group();
  const bed = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.18, 0.9),
    new THREE.MeshBasicMaterial({ color: 0x8b5a2b })
  );
  bed.position.y = -0.1 + 0.18 / 2 - 0.2;
  g.add(bed);

  // three tiny crop cubes
  const cropMat = new THREE.MeshBasicMaterial({ color: 0x2ecc71 });
  for (let i = 0; i < 3; i++) {
    const crop = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 0.18),
      cropMat
    );
    crop.position.set(-0.25 + i * 0.25, -0.1 + 0.18, 0);
    g.add(crop);
  }

  return g;
}

export function createGreenhouseMesh(color = 0x88ccee) {
  const g = new THREE.Group();
  const frameMat = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.25,
  });
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.6, 0.88), frameMat);
  box.position.y = -0.1 + 0.6 / 2 - 0.2;
  g.add(box);

  // inner green patch
  const inner = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.02, 0.6),
    new THREE.MeshBasicMaterial({ color: 0x2ecc71 })
  );
  inner.position.y = box.position.y + 0.25;
  g.add(inner);

  return g;
}

export function createGeneratorMesh(color = 0x333333) {
  const g = box(color, 0.75, 0.5, 0.5);

  const vent = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.25, 0.3),
    new THREE.MeshBasicMaterial({ color: 0x111111 })
  );
  vent.position.set(0.28, g.children[0].position.y + 0.05, 0);
  g.add(vent);

  return g;
}

export function createAnimalMesh(color = 0xffc66b) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.28, 0.28),
    new THREE.MeshBasicMaterial({ color })
  );
  body.position.y = -0.1 + 0.28 / 2 - 0.2;
  g.add(body);

  // head
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.16, 0.16),
    new THREE.MeshBasicMaterial({ color })
  );
  head.position.set(0.28, body.position.y + 0.04, 0);
  g.add(head);

  // ears as tiny boxes
  const earMat = new THREE.MeshBasicMaterial({ color: 0x663300 });
  const earL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.02), earMat);
  earL.position.set(0.32, head.position.y + 0.06, 0.06);
  g.add(earL);
  const earR = earL.clone();
  earR.position.z = -0.06;
  g.add(earR);

  return g;
}

export const modelCreators = {
  woodfarm: createWoodFarmMesh,
  stonefarm: createStoneFarmMesh,
  dirtpath: createDirtPathMesh,
  campfire: createCampfireMesh,
  sawmill: createSawmillMesh,
  quarry: createQuarryMesh,
  windturbine: createWindTurbineMesh,
  solarpanel: createSolarPanelMesh,
  tent: createTentMesh,
  cabin: createCabinMesh,
  garden: createGardenMesh,
  greenhouse: createGreenhouseMesh,
  generator: createGeneratorMesh,
  animal: createAnimalMesh,
};
