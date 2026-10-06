import * as THREE from 'three';

const steel = new THREE.MeshStandardMaterial({ color: 0x252a27, metalness: 0.48, roughness: 0.54 });
const wood = new THREE.MeshStandardMaterial({ color: 0xd5bb83, roughness: 0.85 });

function addPart(parent, name, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

function createShelf() {
  const group = new THREE.Group();
  group.name = 'balcony-three-tier-flower-shelf';
  const length = 1.20;
  const tube = 0.025;
  const ends = [-length / 2 + tube / 2, length / 2 - tube / 2];
  const tiers = [
    { front: 0.20, height: 0.09 },
    { front: 0.05, height: 0.55 },
    { front: -0.05, height: 0.87 }
  ];

  for (const sideZ of ends) {
    addPart(group, 'rear-upright', [tube, 1.0, tube], [-0.20, 0.50, sideZ], steel);
    addPart(group, 'upper-step-upright', [tube, 0.48, tube], [-0.05, 0.76, sideZ], steel);
    addPart(group, 'middle-upright', [tube, 0.64, tube], [0.05, 0.32, sideZ], steel);
    addPart(group, 'front-upright', [tube, 0.31, tube], [0.20, 0.155, sideZ], steel);
    for (const [fromX, toX, height] of [[-0.20, -0.05, 1.0], [-0.05, 0.05, 0.64], [0.05, 0.20, 0.31]]) {
      addPart(group, 'connected-step-return', [toX - fromX + tube, tube, tube],
        [(fromX + toX) / 2, height - tube / 2, sideZ], steel);
    }
    for (const tier of tiers) {
      addPart(group, 'stepped-side-rail', [tier.front + 0.20, tube, tube],
        [(tier.front - 0.20) / 2, tier.height - 0.03, sideZ], steel);
    }
  }

  for (const tier of tiers) {
    const shelfDepth = tier.front + 0.20;
    for (const edgeX of [-0.20, tier.front]) {
      addPart(group, 'long-steel-rail', [tube, tube, length], [edgeX, tier.height - 0.03, 0], steel);
    }
    for (let index = 0; index < 14; index++) {
      const plankZ = -length / 2 + 0.055 + index * (length - 0.11) / 13;
      addPart(group, 'pale-wood-slat', [shelfDepth - 0.015, 0.018, 0.052],
        [(tier.front - 0.20) / 2, tier.height, plankZ], wood);
    }
  }
  return group;
}

export function createBalconyFlowerShelves(placement) {
  const group = new THREE.Group();
  group.name = 'balcony-north-flower-shelves';
  for (let index = 0; index < 2; index++) {
    const shelf = createShelf();
    shelf.position.set(placement.x, 0, placement.eastEdge + 0.60 + index * 1.20);
    group.add(shelf);
  }
  return group;
}
