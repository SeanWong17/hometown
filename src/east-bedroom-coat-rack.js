import * as THREE from 'three';

const metal = new THREE.MeshStandardMaterial({ color: 0xd6dcda, metalness: 0.42, roughness: 0.45 });
const caps = new THREE.MeshStandardMaterial({ color: 0xf0f1ed, metalness: 0.22, roughness: 0.4 });

function mesh(parent, name, geometry, position, material) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function hook(parent, angle, lower = false) {
  const radius = lower ? 0.15 : 0.22;
  const startY = lower ? 1.30 : 1.49;
  const endY = lower ? 1.38 : 1.66;
  const points = [
    new THREE.Vector3(Math.cos(angle) * 0.02, startY, Math.sin(angle) * 0.02),
    new THREE.Vector3(Math.cos(angle) * radius * 0.45, startY + 0.045, Math.sin(angle) * radius * 0.45),
    new THREE.Vector3(Math.cos(angle) * radius, endY - 0.055, Math.sin(angle) * radius),
    new THREE.Vector3(Math.cos(angle) * radius, endY, Math.sin(angle) * radius)
  ];
  mesh(parent, 'curved-coat-hook', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 16, 0.007, 8, false), [0, 0, 0], metal);
  mesh(parent, 'rounded-hook-tip', new THREE.SphereGeometry(0.018, 12, 8), points[3].toArray(), caps);
}

export function createEastBedroomCoatRack(placement) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-coat-rack';
  group.position.set(placement.x, 0, placement.z);
  mesh(group, 'round-weighted-base', new THREE.CylinderGeometry(0.15, 0.15, 0.025, 32), [0, 0.0125, 0], caps);
  mesh(group, 'base-metal-collar', new THREE.CylinderGeometry(0.048, 0.055, 0.028, 24), [0, 0.039, 0], metal);
  mesh(group, 'tall-metal-pole', new THREE.CylinderGeometry(0.025, 0.025, 1.51, 20), [0, 0.80, 0], metal);
  mesh(group, 'upper-pole-cap', new THREE.SphereGeometry(0.03, 14, 10), [0, 1.56, 0], caps);
  for (let index = 0; index < 6; index++) hook(group, index * Math.PI * 2 / 6 + 0.2);
  for (let index = 0; index < 4; index++) hook(group, index * Math.PI / 2 + 0.55, true);
  return group;
}
