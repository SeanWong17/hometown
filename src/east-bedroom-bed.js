import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const oak = new THREE.MeshStandardMaterial({ color: 0xb48a55, roughness: 0.75 });
const oakLight = new THREE.MeshStandardMaterial({ color: 0xc4a16f, roughness: 0.78 });
const oakShadow = new THREE.MeshStandardMaterial({ color: 0x81623e, roughness: 0.87 });
const mattress = new THREE.MeshStandardMaterial({ color: 0xe8e4d9, roughness: 1 });

function part(parent, name, size, position, material, radius = 0) {
  const geometry = radius ? new RoundedBoxGeometry(...size, 5, radius) : new THREE.BoxGeometry(...size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function fabricMaterial(colorAt) {
  const size = 256;
  const pixels = new Uint8Array(size * size * 4);
  for (let py = 0; py < size; py++) for (let px = 0; px < size; px++) {
    const color = colorAt(px / size, py / size);
    const weave = ((px * 13 + py * 7) % 7 - 3) * 0.75;
    const offset = (py * size + px) * 4;
    for (let channel = 0; channel < 3; channel++) {
      pixels[offset + channel] = Math.max(0, Math.min(255, color[channel] + weave));
    }
    pixels[offset + 3] = 255;
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.98, side: THREE.DoubleSide });
}

const sheetColors = [
  [188, 205, 204], [221, 175, 159], [226, 197, 142], [184, 196, 183]
];
const sheet = fabricMaterial((u, v) => {
  const a = sheetColors[Math.floor(u * 7) % 4];
  const b = sheetColors[Math.floor(v * 8) % 4];
  const darkLine = u * 7 % 1 < 0.045 || v * 8 % 1 < 0.045;
  return darkLine ? [133, 143, 142] : a.map((channel, index) => (channel + b[index]) / 2);
});
const duvet = fabricMaterial((u, v) => {
  const grid = u * 8 % 1 < 0.055 || v * 6 % 1 < 0.07;
  return grid ? [221, 225, 216] : [104, 119, 115];
});
const pinkPillow = fabricMaterial((u, v) => {
  const dotX = u * 7 % 1 - 0.5;
  const dotY = v * 5 % 1 - 0.5;
  return dotX * dotX + dotY * dotY < 0.004 ? [232, 214, 210] : [192, 137, 147];
});
const lavenderPillow = fabricMaterial((u, v) => {
  const line = u * 8 % 1 < 0.025 || v * 6 % 1 < 0.025;
  return line ? [207, 198, 209] : [159, 148, 172];
});

function rumpledDuvet() {
  const across = 24;
  const along = 18;
  const positions = [];
  const uv = [];
  const indices = [];
  for (let row = 0; row <= along; row++) for (let column = 0; column <= across; column++) {
    const u = column / across;
    const v = row / along;
    const x = (u - 0.5) * 1.56;
    const z = -0.63 + v * 1.12;
    const edge = Math.sin(Math.PI * u) * Math.sin(Math.PI * v);
    const mound = Math.exp(-((x / 0.51) ** 2 + ((z + 0.10) / 0.36) ** 2));
    const fold = 0.045 * Math.sin(23 * u + 13 * v) * edge;
    positions.push(x, 0.614 + 0.21 * mound + fold, z);
    uv.push(u, v);
    if (row < along && column < across) {
      const a = row * (across + 1) + column;
      indices.push(a, a + 1, a + across + 1, a + 1, a + across + 2, a + across + 1);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export function createEastBedroomBed() {
  const group = new THREE.Group();
  group.name = 'east-bedroom-bed';
  part(group, 'oak-storage-base', [1.8, 0.32, 2.0], [0, 0.24, 0], oak, 0.02);
  for (const side of [-1, 1]) {
    for (const z of [-0.48, 0.48]) {
      part(group, 'storage-drawer-front', [0.012, 0.23, 0.90], [side * 0.901, 0.245, z], oakLight, 0.008);
      part(group, 'recessed-drawer-pull', [0.014, 0.025, 0.12], [side * 0.911, 0.24, z], oakShadow, 0.006);
    }
  }
  part(group, 'oak-footboard', [1.8, 0.82, 0.10], [0, 0.69, -0.95], oakLight, 0.032);
  part(group, 'footboard-inset', [1.62, 0.62, 0.008], [0, 0.71, -0.895], oak, 0.018);
  for (const y of [0.49, 0.70, 0.91]) {
    part(group, 'footboard-wood-grain', [1.46, 0.005, 0.003], [0, y, -0.890], oakShadow);
  }
  part(group, 'oak-headboard', [1.8, 0.88, 0.10], [0, 0.69, 1.05], oakLight, 0.032);
  part(group, 'headboard-inset', [1.62, 0.66, 0.008], [0, 0.71, 0.995], oak, 0.018);
  for (const y of [0.49, 0.70, 0.91]) {
    part(group, 'headboard-wood-grain', [1.46, 0.005, 0.003], [0, y, 0.990], oakShadow);
  }

  part(group, 'mattress', [1.70, 0.18, 1.86], [0, 0.49, 0], mattress, 0.035);
  part(group, 'pastel-plaid-sheet', [1.72, 0.14, 1.87], [0, 0.54, 0], sheet, 0.048);
  const quilt = new THREE.Mesh(rumpledDuvet(), duvet);
  quilt.name = 'sage-checkered-duvet';
  quilt.castShadow = true;
  quilt.receiveShadow = true;
  group.add(quilt);

  const pillowGeometry = new RoundedBoxGeometry(0.70, 0.15, 0.45, 6, 0.065);
  const pillowVertices = pillowGeometry.getAttribute('position');
  for (let index = 0; index < pillowVertices.count; index++) {
    const x = pillowVertices.getX(index);
    const y = pillowVertices.getY(index);
    const z = pillowVertices.getZ(index);
    const fullness = Math.max(0, 1 - (x / 0.35) ** 2) * Math.max(0, 1 - (z / 0.225) ** 2);
    pillowVertices.setY(index, y + Math.sign(y) * fullness * 0.012);
  }
  pillowGeometry.computeVertexNormals();
  for (const [x, name, fabric] of [
    [-0.43, 'pink-floral-pillow', pinkPillow],
    [0.43, 'lavender-pillow', lavenderPillow]
  ]) {
    const pillow = new THREE.Mesh(pillowGeometry, fabric);
    pillow.name = name;
    pillow.position.set(x, 0.69, 0.69);
    pillow.castShadow = true;
    pillow.receiveShadow = true;
    group.add(pillow);
  }
  return group;
}
