import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import clockImage from './assets/living-north-clock.jpg';

const material = (color, roughness = 0.8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
const cabinetWood = material(0x884324, 0.58);
const cabinetFront = material(0xa7632d, 0.5);
const cabinetTrim = material(0x4f271d, 0.52);
const cabinetTop = material(0x793c27, 0.48);
const cabinetMolding = material(0x3b2119, 0.34);
const cabinetMoldingHighlight = material(0x80502e, 0.38);
const antiqueBrass = material(0x6d5a39, 0.44, 0.48);
const darkMetal = material(0x424746, 0.4, 0.5);
const silver = material(0xb5b9b4, 0.47, 0.28);
const glass = new THREE.MeshPhysicalMaterial({ color: 0x9eafb0, metalness: 0.12, roughness: 0.12, transmission: 0.35, transparent: true, opacity: 0.62, depthWrite: false });

function add(parent, name, geometry, position, mat) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function box(parent, name, size, position, mat, radius = 0) {
  return add(parent, name, radius ? new RoundedBoxGeometry(...size, 3, radius) : new THREE.BoxGeometry(...size), position, mat);
}

function cylinder(parent, name, radiusTop, radiusBottom, height, position, mat) {
  return add(parent, name, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 20), position, mat);
}

function outerCornerShelf(depth, length) {
  const outline = new THREE.Shape();
  outline.moveTo(0, 0);
  outline.lineTo(0, -length);
  outline.absellipse(0, 0, depth, length, -Math.PI / 2, 0, false, 0);
  outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, { depth: 0.025, bevelEnabled: false, curveSegments: 24 });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function createWoodCabinets(placement) {
  const group = new THREE.Group();
  group.name = 'living-north-wood-cabinets';
  group.position.set(placement.x, 0, placement.z);
  const westEdge = placement.depth / 2;
  const cornerLength = 0.32;
  const bodyWest = westEdge - cornerLength;
  const frontX = placement.width / 2;
  for (let index = 0; index < 3; index++) {
    const centerZ = bodyWest - 0.61 * (index + 0.5);
    box(group, `wood-cabinet-${index + 1}`, [0.40, 0.68, 0.61], [0, 0.34, centerZ], cabinetWood);
    box(group, 'cabinet-top', [0.41, 0.025, 0.61], [0, 0.6675, centerZ], cabinetTop, 0.008);
    box(group, 'cabinet-plinth', [0.405, 0.065, 0.61], [0, 0.0325, centerZ], cabinetTrim);
    for (const side of [-1, 1]) {
      const doorZ = centerZ + side * 0.151;
      box(group, 'paneled-wood-door', [0.012, 0.55, 0.29], [frontX + 0.007, 0.365, doorZ], cabinetFront, 0.004);
      for (const zOffset of [-0.13, 0.13]) {
        box(group, 'raised-door-side', [0.008, 0.53, 0.012], [frontX + 0.017, 0.365, doorZ + zOffset], cabinetWood, 0.003);
      }
      for (const y of [0.105, 0.625]) {
        box(group, 'raised-door-end', [0.008, 0.012, 0.27], [frontX + 0.017, y, doorZ], cabinetWood, 0.003);
      }
      const outline = [
        [-0.104, 0.16], [-0.12, 0.19], [-0.12, 0.40], [-0.113, 0.45],
        [-0.085, 0.475], [-0.065, 0.515], [-0.025, 0.535], [0.025, 0.535],
        [0.065, 0.515], [0.085, 0.475], [0.113, 0.45], [0.12, 0.40],
        [0.12, 0.19], [0.104, 0.16], [0.065, 0.16], [0.032, 0.176],
        [0, 0.164], [-0.032, 0.176], [-0.065, 0.16]
      ];
      for (const [offsetX, widthScale, heightScale, radius, finish] of [
        [0.024, 0.78, 1, 0.008, cabinetMolding],
        [0.030, 0.71, 0.91, 0.003, cabinetMoldingHighlight]
      ]) {
        const points = outline.map(([z, y]) => new THREE.Vector3(frontX + offsetX, 0.35 + (y - 0.35) * heightScale, doorZ + z * widthScale));
        const molding = new THREE.CatmullRomCurve3(points, true);
        add(group, 'scalloped-door-molding', new THREE.TubeGeometry(molding, 64, radius, 6, true), [0, 0, 0], finish);
      }
      const handleZ = doorZ - side * 0.138;
      box(group, 'antique-handle-plate', [0.01, 0.065, 0.012], [frontX + 0.023, 0.35, handleZ], antiqueBrass, 0.004);
      const ring = add(group, 'hanging-cabinet-pull', new THREE.TorusGeometry(0.007, 0.002, 6, 14), [frontX + 0.038, 0.34, handleZ], antiqueBrass);
      ring.rotation.y = Math.PI / 2;
    }
  }
  const cornerX = -placement.width / 2;
  const cornerShelfGeometry = outerCornerShelf(placement.width, cornerLength);
  for (const level of [0.07, 0.35, 0.665]) {
    add(group, 'quarter-round-corner-shelf', cornerShelfGeometry, [cornerX, level - 0.0125, bodyWest], cabinetTop);
  }
  box(group, 'corner-cabinet-upright', [0.025, 0.65, 0.025], [cornerX + 0.025, 0.335, westEdge - 0.025], cabinetWood);
  const glassVase = material(0x8e242e, 0.2, 0.15);
  const stemGreen = material(0x4d6d44, 0.9);
  const blooms = [material(0xc5828b), material(0xe6b09c), material(0x9c384c)];
  for (const [vaseIndex, vaseZ] of [bodyWest - 0.27, bodyWest - 0.85].entries()) {
    cylinder(group, 'red-flower-vase', 0.04, 0.055, 0.16, [-0.015, 0.76, vaseZ], glassVase);
    for (let flower = 0; flower < 10; flower++) {
      const angle = flower * 2.4;
      const distance = 0.045 + (flower % 3) * 0.025;
      const stem = cylinder(group, 'bouquet-stem', 0.002, 0.003, 0.17, [-0.015 + Math.cos(angle) * distance * 0.35, 0.92, vaseZ + Math.sin(angle) * distance * 0.35], stemGreen);
      stem.rotation.z = Math.cos(angle) * 0.38;
      stem.rotation.x = -Math.sin(angle) * 0.38;
      add(group, 'small-flower', new THREE.SphereGeometry(0.019, 8, 6), [-0.015 + Math.cos(angle) * distance, 1.01 + (flower % 3) * 0.018, vaseZ + Math.sin(angle) * distance], blooms[(flower + vaseIndex) % blooms.length]);
    }
  }
  cylinder(group, 'slim-cream-vase', 0.024, 0.033, 0.14, [0, 0.75, bodyWest - 1.23], material(0xe1d7c5));
  cylinder(group, 'single-flower-stem', 0.003, 0.003, 0.17, [0, 0.9, bodyWest - 1.23], stemGreen);
  add(group, 'single-flower', new THREE.SphereGeometry(0.022, 8, 6), [0, 0.99, bodyWest - 1.23], blooms[0]);
  return group;
}

function createTwoTierRack(placement) {
  const group = new THREE.Group();
  group.name = 'living-north-two-tier-rack';
  group.position.set(placement.x, 0, placement.z);
  const timber = material(0x9d6e48, 0.75);
  for (const sideX of [-1, 1]) for (const sideZ of [-1, 1]) {
    box(group, 'rack-leg', [0.033, 0.45, 0.033], [sideX * 0.107, 0.225, sideZ * 0.325], timber);
  }
  for (const height of [0.16, 0.43]) {
    for (let index = 0; index < 5; index++) {
      box(group, 'wooden-rack-slat', [0.028, 0.022, 0.68], [-0.10 + index * 0.05, height, 0], timber, 0.004);
    }
    for (const sideX of [-1, 1]) box(group, 'rack-crossbar', [0.022, 0.025, 0.70], [sideX * 0.11, height - 0.025, 0], timber);
  }
  return group;
}

function roundedCabinetPlan(height = 0.35) {
  const radius = 0.20;
  const shape = new THREE.Shape();
  shape.moveTo(-radius, -0.80);
  shape.lineTo(-radius, 0.80);
  shape.absarc(0, 0.80, radius, Math.PI, 0, true);
  shape.lineTo(radius, -0.80);
  shape.absarc(0, -0.80, radius, 0, -Math.PI, true);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false, curveSegments: 18 });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function createTelevisionCabinet(placement) {
  const group = new THREE.Group();
  group.name = 'living-north-tv-cabinet';
  group.position.set(placement.x, 0, placement.z);
  const frame = material(0x9d9f9b, 0.64, 0.16);
  const pale = material(0xc0c0bb, 0.72);
  const panel = material(0xa6a5a0, 0.82);
  const darkGlass = new THREE.MeshStandardMaterial({ color: 0x424d51, metalness: 0.22, roughness: 0.15, transparent: true, opacity: 0.78, depthWrite: false });
  for (const sideX of [-1, 1]) for (const sideZ of [-1, 1]) {
    box(group, 'tv-cabinet-leg', [0.015, 0.12, 0.015], [sideX * 0.16, 0.06, sideZ * 0.85], darkMetal);
  }
  const body = add(group, 'rounded-tv-cabinet-body', roundedCabinetPlan(), [0, 0.12, 0], frame);
  body.receiveShadow = true;
  add(group, 'rounded-top-finish', roundedCabinetPlan(0.03), [0, 0.47, 0], silver);
  for (const side of [-1, 1]) {
    box(group, 'tv-end-door', [0.012, 0.28, 0.50], [0.206, 0.305, side * 0.66], panel, 0.009);
    box(group, 'tv-door-inlay', [0.014, 0.20, 0.012], [0.215, 0.305, side * 0.44], darkMetal);
    cylinder(group, 'tv-door-round-pull', 0.024, 0.024, 0.012, [0.224, 0.305, side * 0.42], silver).rotation.z = Math.PI / 2;
  }
  box(group, 'tv-center-glass', [0.015, 0.28, 0.70], [0.209, 0.305, 0], darkGlass);
  box(group, 'tv-center-seam', [0.018, 0.28, 0.012], [0.222, 0.305, 0], darkMetal);

  const shelf = new THREE.Group();
  shelf.name = 'tv-top-storage-shelf';
  shelf.position.set(0, 0.50, 0.20);
  const shelfWhite = material(0xe7e8e4, 0.74);
  box(shelf, 'white-shelf-board', [0.30, 0.024, 1.38], [0, 0.138, 0], shelfWhite);
  for (const z of [-0.679, -0.23, 0.23, 0.679]) box(shelf, 'white-shelf-divider', [0.30, 0.126, 0.022], [0, 0.075, z], shelfWhite);
  group.add(shelf);

  const television = new THREE.Group();
  television.name = 'living-55-inch-television';
  television.position.set(0.05, 0.65, 0.20);
  const black = material(0x171c1e, 0.34);
  const screen = material(0x101719, 0.16, 0.18);
  box(television, 'tv-bezel', [0.038, 0.69, 1.22], [0, 0.385, 0], black, 0.01);
  box(television, 'tv-screen', [0.002, 0.66, 1.185], [0.02, 0.385, 0], screen);
  for (const side of [-1, 1]) box(television, 'tv-foot', [0.11, 0.022, 0.035], [0, 0.011, side * 0.49], black);
  group.add(television);

  const aquarium = new THREE.Group();
  aquarium.name = 'living-small-aquarium';
  aquarium.position.set(0, 0.50, -0.69);
  const tankBlack = material(0x303a3b, 0.54);
  box(aquarium, 'aquarium-bottom', [0.25, 0.02, 0.40], [0, 0.01, 0], tankBlack);
  box(aquarium, 'aquarium-lid', [0.25, 0.035, 0.40], [0, 0.3325, 0], tankBlack, 0.012);
  for (const x of [-0.121, 0.121]) box(aquarium, 'aquarium-glass-wall', [0.008, 0.29, 0.38], [x, 0.175, 0], glass);
  for (const z of [-0.196, 0.196]) box(aquarium, 'aquarium-glass-wall', [0.24, 0.29, 0.008], [0, 0.175, z], glass);
  const water = new THREE.MeshStandardMaterial({ color: 0x8cae9d, transparent: true, opacity: 0.23, roughness: 0.14, depthWrite: false });
  const waterHeight = 0.29 * 2 / 3;
  const waterBottom = 0.03;
  box(aquarium, 'aquarium-water', [0.23, waterHeight, 0.38], [0, waterBottom + waterHeight / 2, 0], water);
  box(aquarium, 'aquarium-water-surface', [0.23, 0.002, 0.38], [0, waterBottom + waterHeight, 0], water);
  for (let index = 0; index < 9; index++) {
    const stone = cylinder(aquarium, 'aquarium-pebble', 0.013 + index % 3 * 0.005, 0.017, 0.018, [((index * 7) % 5 - 2) * 0.045, 0.035, ((index * 11) % 7 - 3) * 0.047], material(0x6d7465));
    stone.rotation.y = index;
  }
  group.add(aquarium);
  return group;
}

function createNorthWallClock(wallFace, westEdge) {
  const group = new THREE.Group();
  group.name = 'living-north-framed-clock';
  group.position.set(wallFace + 0.025, 2.40, westEdge - 0.60);
  const frame = material(0xb39a62, 0.4, 0.48);
  const backing = material(0x363b3a, 0.8);
  box(group, 'clock-backing', [0.035, 0.40, 0.80], [0, 0, 0], backing);
  const texture = new THREE.TextureLoader().load(clockImage);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const artwork = add(group, 'clock-and-calendar-artwork', new THREE.PlaneGeometry(0.76, 0.36),
    [0.019, 0, 0], new THREE.MeshStandardMaterial({ map: texture, roughness: 0.82 }));
  artwork.rotation.y = Math.PI / 2;
  for (const y of [-0.19, 0.19]) box(group, 'gold-horizontal-frame', [0.045, 0.02, 0.80], [0.008, y, 0], frame);
  for (const z of [-0.39, 0.39]) box(group, 'gold-vertical-frame', [0.045, 0.38, 0.02], [0.008, 0, z], frame);
  return group;
}

export function createLivingRoomNorthWall(placement) {
  const group = new THREE.Group();
  group.name = 'living-room-north-wall-furniture';
  group.add(createWoodCabinets(placement.cabinets));
  group.add(createTwoTierRack(placement.rack));
  group.add(createTelevisionCabinet(placement.tvCabinet));
  const eastCabinetWestEdge = placement.cabinets.z + placement.cabinets.depth / 2 - 0.32 - 2 * 0.61;
  group.add(createNorthWallClock(placement.cabinets.x - placement.cabinets.width / 2, eastCabinetWestEdge));
  return group;
}
