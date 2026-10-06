import * as THREE from 'three';

const steel = new THREE.MeshStandardMaterial({ color: 0x303735, metalness: 0.28, roughness: 0.65 });
const paleSteel = new THREE.MeshStandardMaterial({ color: 0x9ea8a5, metalness: 0.40, roughness: 0.52 });
const oldWood = new THREE.MeshStandardMaterial({ color: 0x745039, roughness: 0.87 });
const yellowWood = new THREE.MeshStandardMaterial({ color: 0xb69b56, roughness: 0.78 });
const wicker = new THREE.MeshStandardMaterial({ color: 0x9a7b50, roughness: 0.95 });
const cardboard = new THREE.MeshStandardMaterial({ color: 0x9c8461, roughness: 0.95 });
const redBag = new THREE.MeshStandardMaterial({ color: 0xa93336, roughness: 0.92 });
const whiteBag = new THREE.MeshStandardMaterial({ color: 0xc8ccc6, roughness: 0.92 });
const frost = new THREE.MeshStandardMaterial({ color: 0xaabdb9, transparent: true, opacity: 0.34, roughness: 0.35, depthWrite: false });
const white = new THREE.MeshStandardMaterial({ color: 0xe8e9e5, roughness: 0.83 });
const darkGlass = new THREE.MeshStandardMaterial({ color: 0x435854, transparent: true, opacity: 0.48, roughness: 0.22, depthWrite: false });

function box(parent, name, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function roundBag(parent, name, position, size, material) {
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...size);
  mesh.rotation.set(0.13, 0.26, -0.09);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function metalStorageRack(placement, name) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(placement.x, 0, placement.z);
  for (const x of [-placement.width / 2 + 0.018, placement.width / 2 - 0.018]) {
    for (const z of [-placement.depth / 2 + 0.015, placement.depth / 2 - 0.015]) {
      box(group, 'black-rack-upright', [0.018, 1.70, 0.018], [x, 0.85, z], steel);
    }
  }
  for (const y of [0.22, 0.74, 1.25, 1.66]) {
    box(group, 'black-rack-shelf', [placement.width, 0.025, placement.depth], [0, y, 0], steel);
    for (const z of [-placement.depth / 2 + 0.01, placement.depth / 2 - 0.01]) {
      box(group, 'rack-shelf-edge', [placement.width, 0.028, 0.012], [0, y, z], paleSteel);
    }
  }
  for (const [x, y, z, w, h, d] of [
    [-0.27, 1.385, 0, 0.27, 0.24, 0.29],
    [0.24, 1.37, -0.025, 0.31, 0.21, 0.25],
    [-0.21, 0.865, 0, 0.32, 0.22, 0.28]
  ]) {
    box(group, 'stored-cardboard-box', [w, h, d], [x, y, z], cardboard);
  }
  roundBag(group, 'stored-cloth-bundle', [0.22, 0.83, 0], [0.18, 0.11, 0.13], whiteBag);
  box(group, 'box-on-top-shelf', [0.30, 0.23, 0.29], [-0.27, 1.79, 0], cardboard);
  const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.018, 32), wicker);
  basket.name = 'round-woven-basket-on-rack';
  basket.rotation.x = Math.PI / 2;
  basket.position.set(0.23, 1.84, 0.13);
  group.add(basket);
  const blueStorage = new THREE.MeshStandardMaterial({ color: 0x385c68, roughness: 0.72 });
  box(group, 'blue-stored-appliance', [0.24, 0.30, 0.26], [0.24, 0.91, 0], blueStorage);
  for (let i = 0; i < 6; i++) {
    const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.027, 0.030, 0.19, 12),
      new THREE.MeshStandardMaterial({ color: 0x536d61, transparent: true, opacity: 0.75, roughness: 0.3 }));
    bottle.name = 'stored-green-glass-bottle';
    bottle.position.set(-0.31 + (i % 3) * 0.12, 0.33, -0.09 + Math.floor(i / 3) * 0.16);
    group.add(bottle);
  }
  return group;
}

function largeNorthTable(placement) {
  const group = new THREE.Group();
  group.name = 'large-storage-north-bag-table';
  group.position.set(placement.x, 0, placement.z);
  box(group, 'rough-wood-top', [placement.width, 0.035, placement.depth], [0, 0.69, 0], oldWood);
  for (const x of [-placement.width / 2 + 0.035, placement.width / 2 - 0.035]) {
    for (const z of [-placement.depth / 2 + 0.055, placement.depth / 2 - 0.055]) {
      box(group, 'table-leg', [0.038, 0.67, 0.038], [x, 0.335, z], oldWood);
    }
  }
  for (const [z, y, scale] of [[-0.35, 0.85, 1], [0.20, 0.89, 1.15], [-0.02, 1.13, 0.85]]) {
    roundBag(group, 'red-storage-sack', [0, y, z], [0.26 * scale, 0.17 * scale, 0.24 * scale], redBag);
  }
  roundBag(group, 'folded-white-bundle', [0.03, 0.80, 0.51], [0.22, 0.10, 0.15], whiteBag);
  return group;
}

function largeSouthFreezer(placement) {
  const group = new THREE.Group();
  group.name = 'large-storage-south-chest-freezer';
  group.position.set(placement.x, 0, placement.z);
  box(group, 'white-freezer-body', [placement.width, 0.82, placement.depth], [0, 0.43, 0], white);
  box(group, 'freezer-top-lid', [placement.width + 0.025, 0.055, placement.depth + 0.025], [0, 0.865, 0], white);
  box(group, 'lid-seam', [placement.width + 0.027, 0.008, placement.depth + 0.027], [0, 0.832, 0], paleSteel);
  box(group, 'freezer-front-handle', [0.022, 0.045, 0.16],
    [-placement.width / 2 - 0.014, 0.78, 0], paleSteel);
  for (let i = 0; i < 8; i++) {
    box(group, 'freezer-vent-slot', [0.004, 0.06, 0.008],
      [-placement.width / 2 - 0.003, 0.10, -0.21 + i * 0.06], paleSteel);
  }
  return group;
}

function largeSouthSideboard(placement) {
  const group = new THREE.Group();
  group.name = 'large-storage-south-wood-sideboard';
  group.position.set(placement.x, 0, placement.z);
  box(group, 'sideboard-case', [placement.width, 0.76, placement.depth], [0, 0.38, 0], oldWood);
  box(group, 'sideboard-top', [placement.width + 0.045, 0.035, placement.depth + 0.04], [0, 0.785, 0], oldWood);
  const frontX = -placement.width / 2 - 0.006;
  for (const z of [-placement.depth / 4, placement.depth / 4]) {
    box(group, 'paneled-sideboard-door', [0.015, 0.55, placement.depth / 2 - 0.025],
      [frontX, 0.32, z], oldWood);
    box(group, 'sideboard-door-inset', [0.006, 0.39, placement.depth / 2 - 0.10],
      [frontX - 0.011, 0.33, z], yellowWood);
    box(group, 'small-sideboard-knob', [0.025, 0.025, 0.025],
      [frontX - 0.025, 0.42, z < 0 ? -0.02 : 0.02], paleSteel);
  }
  for (const z of [-0.30, 0.10, 0.34]) {
    roundBag(group, 'sideboard-top-bundle', [0, 0.88, z], [0.18, 0.10, 0.15], z > 0.2 ? redBag : whiteBag);
  }
  return group;
}

function largeSouthWallShelves(layout) {
  const group = new THREE.Group();
  group.name = 'large-storage-south-wall-floating-shelves';
  group.position.set(layout.southFaceX - 0.12, 0, layout.shelfZ);
  for (const y of [1.34, 1.68, 2.02]) {
    box(group, 'thin-wall-shelf', [0.22, 0.02, 0.58], [0, y, 0], paleSteel);
    roundBag(group, 'stored-small-plastic-bag', [-0.01, y + 0.09, 0], [0.10, 0.075, 0.15], y > 1.9 ? redBag : whiteBag);
  }
  return group;
}

export function createLargeStorageRoomFurniture(layout) {
  const group = new THREE.Group();
  group.name = 'large-storage-room-furniture';
  for (let i = 0; i < layout.eastRacks.length; i++) {
    group.add(metalStorageRack(layout.eastRacks[i], `large-storage-east-rack-${i + 1}`));
  }
  group.add(largeNorthTable(layout.northTable));
  group.add(largeSouthFreezer(layout.freezer));
  group.add(largeSouthSideboard(layout.sideboard));
  group.add(largeSouthWallShelves(layout));
  return group;
}

function smallYellowCabinet(placement) {
  const group = new THREE.Group();
  group.name = 'small-storage-west-yellow-glass-cabinet';
  group.position.set(placement.x, 0, placement.z);
  box(group, 'yellow-cabinet-back', [placement.width, 1.48, 0.018],
    [0, 0.74, placement.depth / 2 - 0.009], yellowWood);
  for (const x of [-placement.width / 2 + 0.014, placement.width / 2 - 0.014]) {
    box(group, 'yellow-cabinet-side', [0.028, 1.48, placement.depth], [x, 0.74, 0], yellowWood);
  }
  for (const y of [0.015, 0.76, 1.465]) {
    box(group, 'yellow-cabinet-horizontal-panel', [placement.width, 0.03, placement.depth],
      [0, y, 0], yellowWood);
  }
  for (const y of [0.92, 1.16, 1.39]) {
    box(group, 'glass-cabinet-inner-shelf', [placement.width - 0.07, 0.018, placement.depth - 0.045],
      [0, y, 0], yellowWood);
  }
  const frontZ = -placement.depth / 2 - 0.006;
  for (const side of [-1, 1]) {
    const centerX = side * placement.width / 4;
    box(group, 'lower-wood-door', [placement.width / 2 - 0.02, 0.49, 0.016],
      [centerX, 0.31, frontZ], yellowWood);
    box(group, 'upper-glass-door', [placement.width / 2 - 0.045, 0.57, 0.008],
      [centerX, 1.105, frontZ - 0.006], darkGlass);
    for (const x of [centerX - placement.width / 4 + 0.02, centerX + placement.width / 4 - 0.02]) {
      box(group, 'glass-door-frame-side', [0.018, 0.60, 0.02],
        [x, 1.105, frontZ - 0.006], yellowWood);
    }
    box(group, 'cabinet-drawer', [placement.width / 2 - 0.02, 0.13, 0.016],
      [centerX, 0.655, frontZ], yellowWood);
    box(group, 'drawer-pull', [0.08, 0.014, 0.018], [centerX, 0.655, frontZ - 0.018], paleSteel);
  }
  for (const [x, y] of [[-0.26, 0.98], [0.16, 0.98], [-0.12, 1.22], [0.26, 1.22]]) {
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.035, 20), white);
    bowl.name = 'dishes-behind-glass';
    bowl.position.set(x, y, 0);
    group.add(bowl);
  }
  return group;
}

function coveredStorage(placement) {
  const group = new THREE.Group();
  group.name = 'small-storage-north-covered-stack';
  group.position.set(placement.x, 0, placement.z);
  box(group, 'stacked-storage-under-cover', [placement.width, 1.32, placement.depth], [0, 0.66, 0], white);
  box(group, 'loose-translucent-cover',
    [placement.width + 0.09, 1.39, placement.depth + 0.10], [0, 0.70, 0], frost);
  roundBag(group, 'plastic-wrapped-top-bundle', [0, 1.48, 0], [0.21, 0.13, 0.25], whiteBag);
  return group;
}

function stackedChairs(placement) {
  const group = new THREE.Group();
  group.name = 'small-storage-stacked-wooden-chairs';
  group.position.set(placement.x, 0, placement.z);
  for (let level = 0; level < 2; level++) {
    const y0 = level * 0.27;
    box(group, 'chair-seat', [0.37, 0.035, 0.39], [0, y0 + 0.40, 0], oldWood);
    for (const x of [-0.16, 0.16]) {
      for (const z of [-0.16, 0.16]) {
        box(group, 'chair-leg', [0.026, 0.39, 0.026], [x, y0 + 0.195, z], oldWood);
      }
      box(group, 'chair-back-post', [0.026, 0.47, 0.027], [x, y0 + 0.65, 0.17], oldWood);
    }
    box(group, 'chair-back-rail', [0.34, 0.055, 0.025], [0, y0 + 0.84, 0.17], oldWood);
  }
  return group;
}

function overheadLadder(layout) {
  const group = new THREE.Group();
  group.name = 'small-storage-overhead-ladder';
  group.position.set(layout.ladderX, 2.64, layout.ladderZ);
  for (const x of [-0.24, 0.24]) {
    box(group, 'ladder-side-rail', [0.035, 0.035, 1.44], [x, 0, 0], paleSteel);
  }
  for (let i = 0; i < 7; i++) {
    box(group, 'ladder-rung', [0.48, 0.025, 0.028],
      [0, 0, -0.60 + i * 0.20], paleSteel);
  }
  return group;
}

function wovenMats(layout) {
  const group = new THREE.Group();
  group.name = 'small-storage-south-wall-woven-mats';
  group.position.set(layout.southFaceX - 0.055, 0, layout.matZ);
  for (let i = 0; i < 2; i++) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.48 - i * 0.06, 0.48 - i * 0.06, 0.022, 32), wicker);
    mesh.name = 'leaning-round-woven-tray';
    mesh.rotation.z = Math.PI / 2;
    mesh.position.set(-i * 0.03, 0.87 - i * 0.10, i * 0.08);
    group.add(mesh);
  }
  return group;
}

export function createSmallStorageRoomFurniture(layout) {
  const group = new THREE.Group();
  group.name = 'small-storage-room-furniture';
  group.add(smallYellowCabinet(layout.yellowCabinet));
  group.add(coveredStorage(layout.coveredStack));
  group.add(stackedChairs(layout.chairs));
  group.add(overheadLadder(layout));
  group.add(wovenMats(layout));
  return group;
}
