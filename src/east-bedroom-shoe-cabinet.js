import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const bodyWood = new THREE.MeshStandardMaterial({ color: 0x866b3c, roughness: 0.83 });
const doorWood = new THREE.MeshStandardMaterial({ color: 0xa1864f, roughness: 0.82 });
const raisedWood = new THREE.MeshStandardMaterial({ color: 0xba9a5e, roughness: 0.82 });
const darkGroove = new THREE.MeshStandardMaterial({ color: 0x634d2b, roughness: 0.92 });

function part(parent, name, size, position, material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...size, 4, radius) : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createEastBedroomShoeCabinet(placement) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-shoe-cabinet';
  group.position.set(placement.x, 0, placement.z);
  part(group, 'oak-shoe-cabinet-body', [1.18, 0.95, 0.30], [0, 0.475, 0], bodyWood);
  part(group, 'open-top-surface', [1.18, 0.025, 0.30], [0, 0.9375, 0], raisedWood);
  part(group, 'rear-ten-centimeter-guard', [1.18, 0.10, 0.025], [0, 1.0, 0.1375], bodyWood);
  for (const side of [-1, 1]) {
    part(group, 'side-ten-centimeter-guard', [0.025, 0.10, 0.30], [side * 0.5775, 1.0, 0], bodyWood);
  }
  for (let index = 0; index < 4; index++) {
    const x = -0.435 + index * 0.29;
    part(group, 'tall-shoe-cabinet-door', [0.284, 0.85, 0.016], [x, 0.48, -0.157], doorWood, 0.003);
    part(group, 'raised-door-center', [0.225, 0.74, 0.006], [x, 0.48, -0.168], raisedWood, 0.003);
    for (const edge of [-1, 1]) {
      part(group, 'vertical-door-frame', [0.012, 0.77, 0.007], [x + edge * 0.119, 0.48, -0.173], darkGroove);
      part(group, 'horizontal-door-frame', [0.23, 0.011, 0.007], [x, 0.48 + edge * 0.38, -0.173], darkGroove);
    }
    const handleX = x + (index % 2 === 0 ? 0.111 : -0.111);
    const handle = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), raisedWood);
    handle.name = 'round-wooden-door-knob';
    handle.position.set(handleX, 0.45, -0.177);
    handle.castShadow = true;
    group.add(handle);
  }
  return group;
}
