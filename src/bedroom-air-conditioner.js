import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const shell = new THREE.MeshStandardMaterial({ color: 0xe9eae5, roughness: 0.54 });
const trim = new THREE.MeshStandardMaterial({ color: 0xc2c8c5, roughness: 0.64 });
const vent = new THREE.MeshStandardMaterial({ color: 0x515e61, roughness: 0.82 });
const display = new THREE.MeshStandardMaterial({ color: 0x718d91, roughness: 0.37 });

function box(parent, name, size, position, material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...size, 4, radius) : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
}

export function createBedroomAirConditioner(placement) {
  const group = new THREE.Group();
  group.name = placement.name;
  group.position.set(placement.x, 2.59, placement.z);
  group.rotation.y = placement.facing > 0 ? 0 : Math.PI;
  box(group, 'wall-mounted-ac-shell', [0.85, 0.28, 0.23], [0, 0, 0], shell, 0.045);
  box(group, 'lower-outlet-recess', [0.75, 0.044, 0.008], [0, -0.097, 0.117], vent, 0.003);
  for (let index = 0; index < 12; index++) {
    box(group, 'outlet-fin', [0.006, 0.031, 0.006], [-0.345 + index * 0.063, -0.097, 0.123], trim);
  }
  box(group, 'adjustable-vent-lip', [0.77, 0.015, 0.025], [0, -0.128, 0.115], trim, 0.005);
  box(group, 'small-control-display', [0.055, 0.018, 0.004], [0.30, 0.052, 0.118], display);
  return group;
}
