import * as THREE from 'three';

const wood = new THREE.MeshStandardMaterial({ color: 0x4b3530, roughness: 0.82 });
const clay = new THREE.MeshStandardMaterial({ color: 0xc89b68, roughness: 0.89 });
const rim = new THREE.MeshStandardMaterial({ color: 0xa8624d, roughness: 0.88 });
const soil = new THREE.MeshStandardMaterial({ color: 0x514738, roughness: 1 });
const foliage = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide });
const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x517343, roughness: 0.92 });

function mesh(parent, name, geometry, position, material) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  object.position.set(...position);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function woodLink(parent, name, start, end, radius = 0.014) {
  const direction = end.clone().sub(start);
  const object = mesh(parent, name, new THREE.CylinderGeometry(radius, radius, direction.length(), 10), start.clone().add(end).multiplyScalar(0.5).toArray(), wood);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
}

function broadLeaf(parent, angle, height, spread, shade) {
  const segments = 12;
  const vertices = [];
  const colors = [];
  const indices = [];
  const color = new THREE.Color(shade);
  const axisX = Math.cos(angle);
  const axisZ = Math.sin(angle);
  for (let index = 0; index <= segments; index++) {
    const t = index / segments;
    const distance = spread * t * t;
    const y = 0.81 + height * t - 0.06 * t * t;
    const halfWidth = 0.11 * Math.pow(Math.sin(Math.PI * t), 0.85);
    for (const side of [-1, 1]) {
      vertices.push(axisX * distance - axisZ * side * halfWidth, y + Math.sin(Math.PI * t) * 0.018, axisZ * distance + axisX * side * halfWidth);
      const tone = color.clone().multiplyScalar(0.82 + 0.18 * t + (side > 0 ? 0.07 : 0));
      colors.push(tone.r, tone.g, tone.b);
    }
    if (index < segments) {
      const a = index * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  mesh(parent, 'broad-green-leaf', geometry, [0, 0, 0], foliage);
  const stemPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.81, 0),
    new THREE.Vector3(axisX * spread * 0.08, 0.94, axisZ * spread * 0.08),
    new THREE.Vector3(axisX * spread * 0.25, 0.81 + height * 0.5, axisZ * spread * 0.25)
  ]);
  mesh(parent, 'leaf-stem', new THREE.TubeGeometry(stemPath, 10, 0.004, 5, false), [0, 0, 0], stemMaterial);
}

export function createEastDoorwayPlant() {
  const group = new THREE.Group();
  group.name = 'living-east-doorway-plant';
  for (const sideX of [-1, 1]) for (const sideZ of [-1, 1]) {
    const x = sideX * 0.09;
    const z = sideZ * 0.09;
    woodLink(group, 'wooden-plant-stand-leg', new THREE.Vector3(x * 1.08, 0.02, z * 1.08), new THREE.Vector3(x, 0.35, z), 0.017);
  }
  for (const side of [-1, 1]) {
    woodLink(group, 'crossed-stand-brace', new THREE.Vector3(-0.09, 0.10, side * 0.09), new THREE.Vector3(0.09, 0.10, -side * 0.09), 0.012);
  }
  const ring = mesh(group, 'round-pot-support', new THREE.TorusGeometry(0.1375, 0.0125, 8, 32), [0, 0.10, 0], wood);
  ring.rotation.x = Math.PI / 2;
  mesh(group, 'cream-plant-pot', new THREE.CylinderGeometry(0.105, 0.09, 0.26, 28), [0, 0.23, 0], clay);
  mesh(group, 'terracotta-pot-rim', new THREE.TorusGeometry(0.106, 0.008, 8, 28), [0, 0.36, 0], rim).rotation.x = Math.PI / 2;
  mesh(group, 'pot-soil', new THREE.CylinderGeometry(0.098, 0.098, 0.008, 28), [0, 0.365, 0], soil);
  const leaves = new THREE.Group();
  leaves.name = 'broad-leaf-foliage';
  leaves.position.y = -0.43;
  const shades = [0x6d914a, 0x759b51, 0x5f8745, 0x85a655];
  for (let index = 0; index < 9; index++) {
    const angle = index * 2.4;
    const height = 0.46 + (index % 4) * 0.09;
    const spread = 0.14 + (index % 3) * 0.065;
    broadLeaf(leaves, angle, height, spread, shades[index % shades.length]);
  }
  group.add(leaves);
  return group;
}
