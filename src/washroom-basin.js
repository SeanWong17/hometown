import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const porcelain = new THREE.MeshStandardMaterial({ color: 0xf1f0ea, roughness: 0.28 });
const basinInterior = new THREE.MeshStandardMaterial({ color: 0xd9dedb, roughness: 0.42 });
const steel = new THREE.MeshStandardMaterial({ color: 0x9ca5a2, metalness: 0.65, roughness: 0.31 });
const frame = new THREE.MeshStandardMaterial({ color: 0x292c2b, metalness: 0.32, roughness: 0.62 });
const mirror = new THREE.MeshStandardMaterial({ color: 0xb4c5c3, metalness: 0.46, roughness: 0.10 });

function box(parent, name, size, position, material, rounded = false) {
  const geometry = rounded ? new RoundedBoxGeometry(...size, 3, 0.012) : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createWashroomBasin(placement) {
  const group = new THREE.Group();
  group.name = 'washroom-north-wall-basin';
  group.position.set(placement.x, 0, placement.z);

  // 43 cm along the wall, 35 cm projecting into the room.
  for (const x of [-0.145, 0.145]) {
    for (const z of [-0.19, 0.19]) {
      box(group, 'black-rack-leg', [0.018, 0.42, 0.018], [x, 0.63, z], frame);
    }
  }
  for (const y of [0.44, 0.82]) {
    for (const z of [-0.19, 0.19]) {
      box(group, 'rack-crossbar', [0.31, 0.015, 0.015], [0, y, z], frame);
    }
    for (const x of [-0.145, 0.145]) {
      box(group, 'rack-sidebar', [0.015, 0.015, 0.39], [x, y, 0], frame);
    }
  }
  box(group, 'open-rack-lower-shelf', [0.30, 0.012, 0.39], [0, 0.48, 0], frame);
  box(group, 'white-ceramic-basin-body', [0.35, 0.11, 0.43], [0, 0.895, 0], porcelain, true);
  box(group, 'basin-recess', [0.27, 0.006, 0.35], [0.012, 0.951, 0], basinInterior, true);
  for (const z of [-0.195, 0.195]) {
    box(group, 'basin-long-rim', [0.31, 0.018, 0.04], [0, 0.957, z], porcelain, true);
  }
  for (const x of [-0.155, 0.155]) {
    box(group, 'basin-short-rim', [0.04, 0.018, 0.39], [x, 0.957, 0], porcelain, true);
  }
  const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.004, 20), steel);
  drain.name = 'basin-drain';
  drain.position.set(0.045, 0.956, 0);
  group.add(drain);

  const tapBase = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.045, 16), steel);
  tapBase.name = 'chrome-faucet-base';
  tapBase.position.set(-0.115, 0.982, 0);
  group.add(tapBase);
  const tapPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.115, 1.0, 0),
    new THREE.Vector3(-0.115, 1.09, 0),
    new THREE.Vector3(-0.06, 1.10, 0),
    new THREE.Vector3(0.0, 1.055, 0)
  ]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(tapPath, 20, 0.009, 8, false), steel);
  spout.name = 'curved-chrome-faucet';
  group.add(spout);
  box(group, 'faucet-lever', [0.045, 0.009, 0.012], [-0.13, 1.032, -0.025], steel);
  const wastePipe = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.34, 12), steel);
  wastePipe.name = 'exposed-basin-drain-pipe';
  wastePipe.position.set(0.04, 0.655, 0);
  group.add(wastePipe);

  // The photographed mirror hangs on the same wall, below the high window.
  const wallX = -placement.width / 2 - 0.006;
  box(group, 'basin-mirror-backing', [0.018, 0.806, 0.606], [wallX + 0.011, 1.55, 0], steel);
  box(group, 'basin-mirror', [0.004, 0.80, 0.60], [wallX + 0.025, 1.55, 0], mirror);
  return group;
}
