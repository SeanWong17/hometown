import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const lightWood = new THREE.MeshStandardMaterial({ color: 0xb69660, roughness: 0.8 });
const drawerWood = new THREE.MeshStandardMaterial({ color: 0xc3a46d, roughness: 0.78 });
const woodGroove = new THREE.MeshStandardMaterial({ color: 0x786443, roughness: 0.88 });
const stoneTop = new THREE.MeshStandardMaterial({ color: 0xdcdacb, roughness: 0.65 });
const mahogany = new THREE.MeshStandardMaterial({ color: 0x87422e, roughness: 0.64 });
const doorWood = new THREE.MeshStandardMaterial({ color: 0x9b4d34, roughness: 0.59 });
const carvedTrim = new THREE.MeshStandardMaterial({ color: 0x4c281f, roughness: 0.46 });
const carvedHighlight = new THREE.MeshStandardMaterial({ color: 0xae6e48, roughness: 0.52 });
const brass = new THREE.MeshStandardMaterial({ color: 0x796b4e, metalness: 0.5, roughness: 0.46 });

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

function raisedOutline(parent, name, points, z, material, radius = 0.006) {
  const path = new THREE.CatmullRomCurve3(points.map(([x, y]) => new THREE.Vector3(x, y, z)), true);
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, 64, radius, 6, true), material);
  mesh.name = name;
  mesh.castShadow = true;
  parent.add(mesh);
}

function createDresser(placement) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-dresser';
  group.position.set(placement.x, 0, placement.z);
  part(group, 'light-oak-cabinet', [0.78, 0.76, 0.44], [0, 0.41, 0], lightWood, 0.007);
  part(group, 'pale-dresser-top', [0.78, 0.03, 0.44], [0, 0.805, 0], stoneTop, 0.006);
  part(group, 'dresser-plinth', [0.76, 0.045, 0.42], [0, 0.0225, 0], lightWood);
  for (const [row, y, height] of [[0, 0.685, 0.15], [1, 0.505, 0.17], [2, 0.315, 0.17], [3, 0.125, 0.17]]) {
    for (const side of [-1, 1]) {
      const x = side * 0.192;
      part(group, `drawer-row-${row + 1}`, [0.369, height, 0.014], [x, y, 0.228], drawerWood, 0.004);
      const pullZ = 0.237;
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(x - 0.045, y + 0.025, pullZ),
        new THREE.Vector3(x, y - 0.025, pullZ),
        new THREE.Vector3(x + 0.045, y + 0.025, pullZ)
      );
      const recess = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.006, 6, false), woodGroove);
      recess.name = 'curved-recessed-drawer-pull';
      group.add(recess);
    }
  }
  return group;
}

function wardrobePanel(parent, centerX, bottom, top, halfWidth, faceZ, name) {
  const shoulder = top - Math.min(0.12, (top - bottom) * 0.22);
  const points = [
    [-halfWidth * 0.84, bottom + 0.018], [-halfWidth, bottom + 0.055],
    [-halfWidth, shoulder - 0.05], [-halfWidth * 0.85, shoulder],
    [-halfWidth * 0.52, shoulder + 0.025], [-halfWidth * 0.34, top - 0.015],
    [0, top], [halfWidth * 0.34, top - 0.015],
    [halfWidth * 0.52, shoulder + 0.025], [halfWidth * 0.85, shoulder],
    [halfWidth, shoulder - 0.05], [halfWidth, bottom + 0.055],
    [halfWidth * 0.84, bottom + 0.018], [0.035, bottom + 0.018],
    [0, bottom + 0.035], [-0.035, bottom + 0.018]
  ].map(([x, y]) => [centerX + x, y]);
  raisedOutline(parent, `${name}-dark-carving`, points, faceZ, carvedTrim, 0.008);
  raisedOutline(parent, `${name}-inner-highlight`, points.map(([x, y]) => [centerX + (x - centerX) * 0.91, bottom + (y - bottom) * 0.94]),
    faceZ + 0.004, carvedHighlight, 0.0025);
}

function createWardrobe(placement) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-wardrobe';
  group.position.set(placement.x, 0, placement.z);
  part(group, 'mahogany-body', [0.80, 1.90, 0.55], [0, 0.95, 0], mahogany, 0.008);
  part(group, 'wardrobe-top-lip', [0.80, 0.04, 0.55], [0, 1.88, 0], carvedTrim, 0.005);
  part(group, 'wardrobe-bottom-plinth', [0.78, 0.09, 0.55], [0, 0.045, 0], carvedTrim);
  for (const side of [-1, 1]) {
    const x = side * 0.195;
    part(group, 'tall-wardrobe-door', [0.385, 1.77, 0.018], [x, 0.975, 0.282], doorWood, 0.006);
    wardrobePanel(group, x, 0.73, 1.76, 0.145, 0.296, 'upper');
    wardrobePanel(group, x, 0.18, 0.68, 0.145, 0.296, 'lower');
    const handleX = side * 0.028;
    part(group, 'antique-handle-backplate', [0.018, 0.065, 0.01], [handleX, 0.73, 0.302], brass, 0.005);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.011, 0.0025, 6, 16), brass);
    ring.name = 'wardrobe-hanging-pull';
    ring.position.set(handleX, 0.715, 0.313);
    group.add(ring);
  }
  return group;
}

function createDresserMirror(dresserX, wallZ) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-dresser-mirror';
  group.position.set(dresserX, 1.52, wallZ + 0.023);
  const frame = new THREE.MeshStandardMaterial({ color: 0x8e825d, metalness: 0.48, roughness: 0.44 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x849494, metalness: 0.36, roughness: 0.18 });
  const roundedMirrorShape = (width, height) => {
    const radius = width / 2;
    const straight = height / 2 - radius;
    const shape = new THREE.Shape();
    shape.moveTo(-radius, -straight);
    shape.lineTo(-radius, straight);
    shape.absarc(0, straight, radius, Math.PI, 0, true);
    shape.lineTo(radius, -straight);
    shape.absarc(0, -straight, radius, 0, -Math.PI, true);
    return shape;
  };
  const backing = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedMirrorShape(0.34, 0.64), {
    depth: 0.02, bevelEnabled: false, curveSegments: 24
  }), frame);
  backing.name = 'slim-oval-mirror-frame';
  backing.position.z = -0.01;
  backing.castShadow = true;
  group.add(backing);
  const surface = new THREE.Mesh(new THREE.ShapeGeometry(roundedMirrorShape(0.322, 0.622), 24), glass);
  surface.name = 'still-mirror-surface';
  surface.position.z = 0.011;
  group.add(surface);
  const cord = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.13, 0.30, 0),
    new THREE.Vector3(0, 0.49, 0),
    new THREE.Vector3(0.13, 0.30, 0)
  ]), new THREE.LineBasicMaterial({ color: 0x736f5a }));
  cord.name = 'mirror-hanging-cord';
  group.add(cord);
  return group;
}

export function createEastBedroomStorage(placement) {
  const group = new THREE.Group();
  group.name = 'east-bedroom-east-wall-storage';
  group.add(createDresser(placement.dresser));
  group.add(createWardrobe(placement.wardrobe));
  placement.northWardrobes.forEach((wardrobePlacement, index) => {
    const wardrobe = createWardrobe(wardrobePlacement);
    wardrobe.name = `east-bedroom-north-wardrobe-${index + 1}`;
    wardrobe.rotation.y = Math.PI / 2;
    group.add(wardrobe);
  });
  group.add(createDresserMirror(placement.dresser.x, placement.wallZ));
  return group;
}
