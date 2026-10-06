import * as THREE from 'three';

const wood = new THREE.MeshStandardMaterial({ color: 0x80684a, roughness: 0.92 });
const woodEdge = new THREE.MeshStandardMaterial({ color: 0x665239, roughness: 0.95 });
const fridgeBody = new THREE.MeshStandardMaterial({ color: 0x5b5e62, metalness: 0.18, roughness: 0.68 });
const fridgeDoor = new THREE.MeshStandardMaterial({ color: 0x505357, metalness: 0.14, roughness: 0.72 });
const fridgeTrim = new THREE.MeshStandardMaterial({ color: 0x131518, metalness: 0.25, roughness: 0.6 });
const steel = new THREE.MeshStandardMaterial({ color: 0xc1c5c3, metalness: 0.35, roughness: 0.42 });
const steelDark = new THREE.MeshStandardMaterial({ color: 0x7f8785, metalness: 0.32, roughness: 0.50 });
const glass = new THREE.MeshStandardMaterial({ color: 0x72878a, metalness: 0.08, roughness: 0.12, transparent: true, opacity: 0.36, depthWrite: false });
const shelfContents = new THREE.MeshStandardMaterial({ color: 0xd6d4c7, roughness: 0.72 });

function box(parent, name, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function kitchenTable(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-wooden-table';
  group.position.set(position.x, 0, position.z);
  const depth = 0.65;
  const width = 0.70;
  box(group, 'tabletop', [depth, 0.035, width], [0, 0.4025, 0], wood);
  for (const x of [-0.275, 0.275]) {
    for (const z of [-0.30, 0.30]) box(group, 'table-leg', [0.045, 0.39, 0.045], [x, 0.195, z], woodEdge);
  }
  for (const z of [-0.30, 0.30]) {
    box(group, 'lower-side-rail', [0.55, 0.025, 0.025], [0, 0.13, z], woodEdge);
  }
  box(group, 'raised-shelf', [0.28, 0.025, width], [0.155, 0.7375, 0], wood);
  for (const z of [-0.30, 0.30]) {
    box(group, 'shelf-support', [0.025, 0.31, 0.025], [0.275, 0.575, z], woodEdge);
  }
  box(group, 'shelf-front-rail', [0.025, 0.035, width], [0.015, 0.715, 0], woodEdge);
  return group;
}

function refrigerator(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-four-door-refrigerator';
  group.position.set(position.x, 0, position.z);
  box(group, 'fridge-casing', [0.69, 1.86, 0.79], [0, 0.93, 0], fridgeBody);
  const frontX = -0.69 / 2 - 0.009;
  for (const side of [-1, 1]) {
    const centerZ = side * 0.1975;
    box(group, 'upper-door', [0.025, 1.335, 0.38], [frontX, 1.175, centerZ], fridgeDoor);
    box(group, 'lower-door', [0.025, 0.425, 0.38], [frontX, 0.225, centerZ], fridgeDoor);
    box(group, 'upper-recessed-handle', [0.007, 0.015, 0.115], [frontX - 0.015, 0.511, side * 0.085], fridgeTrim);
    box(group, 'lower-recessed-handle', [0.007, 0.015, 0.115], [frontX - 0.015, 0.435, side * 0.085], fridgeTrim);
  }
  box(group, 'door-center-seam', [0.006, 1.84, 0.008], [frontX - 0.013, 0.93, 0], fridgeTrim);
  box(group, 'freezer-seam', [0.006, 0.015, 0.77], [frontX - 0.013, 0.445, 0], fridgeTrim);
  box(group, 'control-panel', [0.007, 0.25, 0.065], [frontX - 0.015, 1.27, -0.19], fridgeTrim);
  return group;
}

function cabinetDoors(group, lower, upper, depth, name) {
  const height = upper - lower;
  const front = -depth / 2 - 0.004;
  for (const side of [-1, 1]) {
    const z = side * 0.175;
    box(group, `${name}-side-frame`, [0.018, height, 0.025], [front, (lower + upper) / 2, side * 0.3375], steel);
    box(group, `${name}-glass`, [0.008, height - 0.10, 0.28], [front - 0.003, (lower + upper) / 2, z], glass);
    for (const y of [lower + 0.035, upper - 0.035]) {
      box(group, `${name}-rail`, [0.018, 0.022, 0.335], [front, y, z], steel);
    }
    box(group, `${name}-glass-border`, [0.013, height - 0.07, 0.013], [front - 0.008, (lower + upper) / 2, side * 0.025], steelDark);
    const handleZ = side * 0.028;
    box(group, `${name}-handle`, [0.027, 0.045, 0.016], [front - 0.032, (lower + upper) / 2, handleZ], steelDark);
  }
}

function dishCabinet(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-stainless-dish-cabinet';
  group.position.set(position.x, 0, position.z);
  const width = 0.70;
  const lowerDepth = 0.40;
  const upperDepth = 0.25;
  const lowerBack = 0.005;
  const upperBack = (lowerDepth - upperDepth) / 2;
  box(group, 'lower-back', [0.018, 0.81, width], [lowerDepth / 2 - 0.01, 0.405, 0], steelDark);
  for (const side of [-1, 1]) {
    box(group, 'lower-side', [lowerDepth, 0.81, 0.018], [lowerBack, 0.405, side * 0.341], steel);
  }
  for (const y of [0.025, 0.37, 0.79]) {
    box(group, 'lower-shelf', [lowerDepth, 0.018, width], [lowerBack, y, 0], steel);
  }
  cabinetDoors(group, 0.035, 0.785, lowerDepth, 'lower-door');
  for (const y of [1.12, 1.37]) {
    box(group, 'open-middle-shelf', [lowerDepth, 0.02, width], [lowerBack, y, 0], steel);
  }
  for (const side of [-1, 1]) {
    box(group, 'upper-side', [upperDepth, 0.515, 0.018], [upperBack, 1.6275, side * 0.341], steel);
  }
  box(group, 'upper-back', [0.018, 0.515, width], [upperBack + upperDepth / 2 - 0.01, 1.6275, 0], steelDark);
  for (const y of [1.38, 1.63, 1.88]) {
    box(group, 'upper-shelf', [upperDepth, 0.015, width], [upperBack, y, 0], steel);
  }
  // The upper cabinet is shallower, so its doors face out from its own front edge.
  const upper = new THREE.Group();
  upper.position.x = upperBack;
  cabinetDoors(upper, 1.39, 1.87, upperDepth, 'upper-door');
  group.add(upper);
  for (const y of [0.40, 1.15]) {
    for (const z of [-0.20, 0.06, 0.23]) {
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.018, 20), shelfContents);
      dish.name = 'stacked-dishes';
      dish.position.set(0.04, y, z);
      group.add(dish);
    }
  }
  return group;
}

export function createKitchenSouthFurniture(placements) {
  const group = new THREE.Group();
  group.name = 'kitchen-south-wall-furniture';
  group.add(kitchenTable(placements.table));
  group.add(refrigerator(placements.fridge));
  group.add(dishCabinet(placements.cabinet));
  return group;
}
