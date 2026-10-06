import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const enamel = new THREE.MeshStandardMaterial({ color: 0xd7d9d0, roughness: 0.66 });
const warmWhite = new THREE.MeshStandardMaterial({ color: 0xe7e8df, roughness: 0.58 });
const trim = new THREE.MeshStandardMaterial({ color: 0xa3aaa7, roughness: 0.62 });
const darkTrim = new THREE.MeshStandardMaterial({ color: 0x525f62, roughness: 0.58 });
const lid = new THREE.MeshStandardMaterial({ color: 0x788e93, roughness: 0.34, metalness: 0.08 });

function part(parent, name, size, position, material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...size, 3, radius) : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createBalconyWasher(placement) {
  const group = new THREE.Group();
  group.name = 'balcony-twin-tub-washer';
  group.position.set(placement.x, 0, placement.z);

  part(group, 'enamel-cabinet', [0.70, 0.72, 0.40], [0, 0.395, 0], enamel, 0.022);
  part(group, 'lower-plinth', [0.68, 0.07, 0.38], [0, 0.075, 0], trim, 0.012);
  for (const x of [-0.29, 0.29]) for (const z of [-0.15, 0.15]) {
    part(group, 'short-foot', [0.045, 0.04, 0.045], [x, 0.02, z], darkTrim, 0.008);
  }
  part(group, 'top-deck', [0.69, 0.025, 0.39], [0, 0.7675, 0], warmWhite, 0.008);

  for (const [name, centerX, width] of [['wash', -0.17, 0.30], ['spin', 0.17, 0.30]]) {
    part(group, `${name}-tub-rim`, [width + 0.012, 0.008, 0.28], [centerX, 0.782, -0.052], darkTrim, 0.008);
    part(group, `${name}-closed-lid`, [width, 0.009, 0.265], [centerX, 0.7905, -0.052], lid, 0.009);
    part(group, `${name}-lid-grip`, [Math.min(width - 0.05, 0.11), 0.006, 0.014],
      [centerX, 0.798, -0.164], warmWhite, 0.004);
  }

  part(group, 'rear-control-panel', [0.68, 0.03, 0.105], [0, 0.77, 0.14], warmWhite, 0.008);
  for (const x of [-0.24, -0.10, 0.18]) {
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.014, 24), trim);
    dial.name = 'mechanical-control-dial';
    dial.position.set(x, 0.792, 0.14);
    dial.castShadow = true;
    group.add(dial);
    part(group, 'dial-pointer', [0.006, 0.002, 0.015], [x, 0.800, 0.13], darkTrim);
  }
  part(group, 'control-label', [0.09, 0.002, 0.025], [0.025, 0.786, 0.14], trim);

  part(group, 'front-center-seam', [0.006, 0.56, 0.004], [0, 0.43, -0.202], trim);
  part(group, 'front-brand-mark', [0.11, 0.025, 0.004], [-0.17, 0.65, -0.202], darkTrim, 0.004);
  part(group, 'front-accent-stripe', [0.54, 0.008, 0.004], [0, 0.61, -0.203], trim);
  return group;
}
