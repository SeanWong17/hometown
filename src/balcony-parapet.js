import * as THREE from 'three';

const sill = new THREE.MeshStandardMaterial({ color: 0xe2e3df, roughness: 0.92 });
const railing = new THREE.MeshStandardMaterial({ color: 0xc88936, metalness: 0.25, roughness: 0.47 });

function add(parent, name, geometry, position, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createBalconyParapetDetail(planeX, startZ, endZ) {
  const group = new THREE.Group();
  group.name = 'balcony-window-parapet-detail';
  const centerZ = (startZ + endZ) / 2;
  add(group, 'projecting-painted-sill', new THREE.BoxGeometry(0.25, 0.055, endZ - startZ),
    [planeX - 0.065, 0.7175, centerZ], sill);

  const railStart = centerZ - 1.60;
  const railX = planeX - 0.14;
  for (let index = 0; index <= 4; index++) {
    const postZ = railStart + index * 0.80;
    add(group, 'round-rail-foot', new THREE.CylinderGeometry(0.033, 0.033, 0.009, 16),
      [railX, 0.749, postZ], railing);
    add(group, 'short-rail-upright', new THREE.CylinderGeometry(0.013, 0.013, 0.118, 12),
      [railX, 0.807, postZ], railing);
  }
  for (let index = 0; index < 4; index++) {
    const section = add(group, 'eighty-centimeter-handrail-section',
      new THREE.CylinderGeometry(0.018, 0.018, 0.80, 12),
      [railX, 0.877, railStart + 0.40 + index * 0.80], railing);
    section.rotation.x = Math.PI / 2;
  }
  return group;
}
