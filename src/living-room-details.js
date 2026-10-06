import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createOpenCurtains } from './open-curtains.js';
import embroideryImage from './assets/living-east-embroidery.jpg';
import jinanMapImage from './assets/jinan-map.jpg';
import westEmbroideryImage from './assets/living-west-embroidery.jpg';
import chinaMapImage from './assets/living-west-china-map.jpg';
import shandongMapImage from './assets/living-west-shandong-map.jpg';
import { createEastDoorwayPlant } from './living-room-east-plant.js';

const matte = (color, roughness = 0.85) => new THREE.MeshStandardMaterial({ color, roughness });
const green = matte(0x69765a);
const greenLight = matte(0x839176);
const greenDark = matte(0x4e5e4d);
const wood = matte(0x48312a);
const white = matte(0xe5e8e5, 0.65);
const dark = matte(0x333b3b);
const glass = new THREE.MeshStandardMaterial({ color: 0x749498, metalness: 0.12, roughness: 0.18, transparent: true, opacity: 0.48, depthWrite: false });
const embroideryWidth = 1.30;

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

function cylinder(parent, name, top, bottom, height, position, material, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function sofa(name, length, depth, seatHeight, armHeight, backHeight, bamboo = false) {
  const group = new THREE.Group();
  group.name = name;
  part(group, 'sofa-base', [depth - 0.05, seatHeight - 0.08, length - 0.06], [0, (seatHeight - 0.08) / 2 + 0.06, 0], green, 0.055);
  if (bamboo) part(group, 'seat-cushion', [depth - 0.17, 0.105, length - 0.22], [-0.035, seatHeight - 0.052, 0], matte(0xa77742), 0.04);
  part(group, 'sofa-back', [0.16, backHeight - 0.10, length - 0.08], [depth / 2 - 0.085, (backHeight + 0.10) / 2, 0], green, 0.055);
  for (const side of [-1, 1]) {
    part(group, 'sofa-arm', [depth - 0.02, armHeight - 0.07, 0.15], [0, (armHeight + 0.07) / 2, side * (length / 2 - 0.085)], green, 0.055);
    part(group, 'slipcover-fold', [0.025, 0.11, 0.11], [-depth / 2 + 0.02, 0.17, side * (length / 2 - 0.09)], greenDark);
  }
  if (bamboo) {
    const slat = matte(0xba894e);
    const stitch = matte(0x5a392c);
    for (let index = 0; index < 23; index++) {
      const z = -length / 2 + 0.16 + index * (length - 0.32) / 22;
      part(group, 'bamboo-seat-strip', [depth - 0.24, 0.006, 0.028], [-0.035, seatHeight + 0.002, z], slat);
      if (index % 3 === 0) part(group, 'bamboo-seat-stitch', [depth - 0.24, 0.007, 0.005], [-0.035, seatHeight + 0.006, z + 0.018], stitch);
    }
    for (let index = 0; index < 3; index++) {
      const z = (index - 1) * (length - 0.3) / 3;
      part(group, 'woven-back-cushion', [0.034, 0.29, (length - 0.32) / 3 - 0.018], [depth / 2 - 0.176, backHeight - 0.22, z], matte(0x8b6547), 0.012);
      for (let stripe = -2; stripe <= 2; stripe++) {
        part(group, 'woven-back-stripe', [0.004, 0.27, 0.012], [depth / 2 - 0.195, backHeight - 0.22, z + stripe * 0.075], matte(0x4f3b32));
      }
    }
    part(group, 'checkered-pillow', [0.10, 0.29, 0.32], [depth / 2 - 0.22, seatHeight + 0.17, length / 2 - 0.35], matte(0x627879), 0.035);
  } else {
    const sofaCloth = matte(0xd9d9ce, 1);
    part(group, 'thin-sofa-cloth', [depth - 0.10, 0.010, length - 0.25], [-0.015, seatHeight - 0.015, 0], sofaCloth, 0.004);
    part(group, 'sofa-cloth-front-drape', [0.010, 0.095, length - 0.25], [-depth / 2 + 0.035, seatHeight - 0.066, 0], sofaCloth);
    part(group, 'blue-pillow', [0.08, 0.29, 0.32], [depth / 2 - 0.19, seatHeight + 0.15, 0.20], matte(0x315777), 0.032);
  }
  return group;
}

function createCoffeeTable() {
  const group = new THREE.Group();
  group.name = 'living-coffee-table';
  const marble = matte(0xc4c8c1, 0.3);
  const edge = matte(0xb2b7b3, 0.4);
  const cabinet = matte(0xd7dcda);
  const pull = matte(0x9ba4a1, 0.3);
  const length = 1.6;
  part(group, 'marble-tabletop', [0.70, 0.035, length], [0, 0.5325, 0], marble, 0.012);
  for (let index = 0; index < 16; index++) {
    const line = part(group, 'marble-vein', [0.003, 0.001, 0.08 + (index % 4) * 0.035], [((index * 17) % 31) / 100 - 0.15, 0.551, -0.7 + index * 0.09], edge);
    line.rotation.y = (index % 3 - 1) * 0.45;
  }
  part(group, 'cabinet-body', [0.59, 0.34, 1.44], [0, 0.32, 0], cabinet);
  part(group, 'left-drawer-front', [0.012, 0.19, 0.66], [-0.302, 0.38, -0.36], white);
  part(group, 'left-drawer-handle', [0.018, 0.016, 0.16], [-0.312, 0.36, -0.36], pull, 0.005);
  part(group, 'right-glass-panel', [0.012, 0.30, 0.67], [-0.303, 0.315, 0.36], glass);
  part(group, 'right-glass-divider', [0.015, 0.3, 0.018], [-0.315, 0.315, 0.36], dark);
  for (const sideX of [-1, 1]) {
    for (const sideZ of [-1, 1]) {
      const leg = part(group, 'slim-leg', [0.022, 0.15, 0.022], [sideX * 0.27, 0.075, sideZ * 0.69], dark);
      leg.rotation.z = sideX * 0.11;
    }
  }
  return group;
}

function createSideTable() {
  const group = new THREE.Group();
  group.name = 'living-side-table';
  part(group, 'weathered-tabletop', [0.68, 0.035, 0.4], [0, 0.5525, 0], matte(0xa7a6a0), 0.008);
  part(group, 'table-apron', [0.62, 0.055, 0.35], [0, 0.51, 0], wood);
  for (const sideX of [-1, 1]) for (const sideZ of [-1, 1]) {
    part(group, 'table-leg', [0.045, 0.49, 0.045], [sideX * 0.29, 0.245, sideZ * 0.155], wood);
  }
  return group;
}

function createAirConditioner() {
  const group = new THREE.Group();
  group.name = 'living-low-air-conditioner';
  part(group, 'air-conditioner-housing', [0.20, 0.60, 0.68], [0, 0.55, 0], white, 0.035);
  part(group, 'air-conditioner-front', [0.008, 0.23, 0.52], [-0.105, 0.53, 0], matte(0xb4bab6), 0.008);
  for (let index = 0; index < 9; index++) {
    part(group, 'air-outlet-slat', [0.009, 0.012, 0.5], [-0.112, 0.435 + index * 0.023, 0], dark);
  }
  part(group, 'control-panel', [0.007, 0.08, 0.09], [-0.107, 0.75, 0.25], matte(0x9ea9a6));
  return group;
}

function createTeaBar() {
  const group = new THREE.Group();
  group.name = 'living-tea-bar';
  part(group, 'tea-bar-cabinet', [0.37, 0.81, 0.4], [0, 0.425, 0], white, 0.015);
  part(group, 'tea-bar-door', [0.014, 0.69, 0.33], [-0.193, 0.43, 0], matte(0xf0f1ee));
  part(group, 'door-handle', [0.012, 0.015, 0.09], [-0.205, 0.76, 0.09], matte(0xaeb6b4, 0.35));
  part(group, 'tea-bar-top', [0.39, 0.025, 0.41], [0, 0.8375, 0], matte(0xf3f4ef, 0.45), 0.008);
  part(group, 'tea-bar-upright', [0.035, 0.35, 0.38], [0.15, 1.025, 0], white, 0.015);
  part(group, 'tea-bar-heater', [0.14, 0.105, 0.36], [0.08, 1.145, 0], dark, 0.05);
  const kettle = cylinder(group, 'electric-kettle', 0.073, 0.083, 0.19, [-0.07, 0.945, 0.105], white);
  kettle.scale.x = 0.85;
  cylinder(group, 'glass-teapot', 0.065, 0.078, 0.16, [-0.07, 0.93, -0.105], glass);
  cylinder(group, 'teapot-lid', 0.04, 0.04, 0.012, [-0.07, 1.015, -0.105], dark);
  return group;
}

function createEastWallEmbroidery(centerX, wallZ) {
  const group = new THREE.Group();
  group.name = 'living-east-wall-embroidery';
  group.position.set(centerX, 2.25, wallZ + 0.06);
  const gold = new THREE.MeshStandardMaterial({ color: 0xb68a42, metalness: 0.38, roughness: 0.43 });
  const darkGold = matte(0x674a2b);
  part(group, 'frame-shadow', [embroideryWidth, 0.90, 0.024], [0, 0, 0.018], darkGold);
  part(group, 'gold-frame', [1.28, 0.88, 0.025], [0, 0, 0.037], gold);
  part(group, 'inner-frame', [1.22, 0.82, 0.026], [0, 0, 0.056], darkGold);

  const texture = new THREE.TextureLoader().load(embroideryImage);
  texture.colorSpace = THREE.SRGBColorSpace;
  const textile = new THREE.Mesh(new THREE.PlaneGeometry(1.17, 0.77), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.93, side: THREE.DoubleSide }));
  textile.name = 'red-gold-cross-stitch';
  textile.position.z = 0.071;
  group.add(textile);
  return group;
}

function createEastWallMap(centerX, wallZ) {
  const group = new THREE.Group();
  group.name = 'living-east-wall-jinan-map';
  group.position.set(centerX, 1.435, wallZ + 0.065);
  part(group, 'map-paper-backing', [0.86, 0.57, 0.005], [0, 0, 0], matte(0xe8e8e1));
  const texture = new THREE.TextureLoader().load(jinanMapImage);
  texture.colorSpace = THREE.SRGBColorSpace;
  const map = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.55), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.98, side: THREE.DoubleSide }));
  map.name = 'jinan-city-map';
  map.position.z = 0.003;
  group.add(map);
  return group;
}

function createWestWallDisplay(wallZ, doorFrameX) {
  const group = new THREE.Group();
  group.name = 'living-west-wall-display';
  group.position.set(0, 0, wallZ - 0.07);
  group.rotation.y = Math.PI;
  const texturedPanel = (parent, name, width, height, image, position) => {
    const texture = new THREE.TextureLoader().load(image);
    texture.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95, side: THREE.DoubleSide }));
    panel.name = name;
    panel.position.set(...position);
    parent.add(panel);
  };
  const mapCenter = doorFrameX + 0.05 + 1.025;
  for (const [name, image, centerX] of [
    ['china-map', chinaMapImage, mapCenter + 0.515],
    ['shandong-map', shandongMapImage, mapCenter - 0.515]
  ]) {
    const panel = new THREE.Group();
    panel.name = `living-west-${name}`;
    panel.position.set(-centerX, 1.49, 0);
    part(panel, 'map-paper', [1.025, 0.59, 0.006], [0, 0, 0], matte(0xebebe5));
    texturedPanel(panel, name, 1.0, 0.56, image, [0, 0, 0.006]);
    group.add(panel);
  }

  const embroidery = new THREE.Group();
  embroidery.name = 'living-west-wall-embroidery';
  const centerX = doorFrameX + 0.60 + 0.45;
  embroidery.position.set(-centerX, 2.135, 0);
  const gold = new THREE.MeshStandardMaterial({ color: 0xb68a42, metalness: 0.38, roughness: 0.43 });
  part(embroidery, 'embroidery-outer-frame', [0.90, 0.67, 0.025], [0, 0, 0], gold);
  part(embroidery, 'embroidery-mat', [0.84, 0.61, 0.027], [0, 0, 0.015], matte(0xe8e3d3));
  texturedPanel(embroidery, 'home-cross-stitch', 0.76, 0.54, westEmbroideryImage, [0, 0, 0.030]);
  group.add(embroidery);
  return group;
}

function createFlowerRack() {
  const group = new THREE.Group();
  group.name = 'living-west-flower-rack';
  const timber = matte(0x8f6244);
  const potColors = [0x718f78, 0xb65b4d, 0x8a9a68, 0xbca87d, 0x528699, 0xd2c8b4].map(color => matte(color));
  const leafColors = [0x5b7c4e, 0x78995c, 0x416948].map(color => matte(color));
  part(group, 'rack-full-base', [0.4, 0.025, 0.2], [0, 0.02, 0], timber);
  for (const postX of [-0.025, 0.025]) {
    for (const postZ of [-0.075, 0.075]) {
      part(group, 'rack-upright', [0.025, 1.21, 0.025], [postX, 0.615, postZ], timber);
    }
  }
  for (let level = 0; level < 6; level++) {
    const side = level % 2 === 0 ? -1 : 1;
    const shelfX = side * 0.10;
    const shelfY = 0.22 + level * 0.20;
    part(group, 'staggered-plant-platform', [0.2, 0.023, 0.2], [shelfX, shelfY, 0], timber);
    const plant = new THREE.Group();
    plant.name = `potted-plant-${level + 1}`;
    plant.position.set(shelfX, shelfY + 0.012, 0);
    const pot = cylinder(plant, 'ceramic-pot', 0.047, 0.035, 0.075, [0, 0.045, 0], potColors[level]);
    pot.receiveShadow = true;
    cylinder(plant, 'pot-soil', 0.039, 0.039, 0.004, [0, 0.084, 0], matte(0x51493a), 16);
    for (let leaf = 0; leaf < 7; leaf++) {
      const angle = leaf * Math.PI * 2 / 7 + level * 0.35;
      const reach = level === 5 ? 0.065 : 0.055;
      const stem = cylinder(plant, 'plant-stem', 0.002, 0.003, 0.085, [Math.cos(angle) * reach * 0.35, 0.127, Math.sin(angle) * reach * 0.35], leafColors[2], 6);
      stem.rotation.z = Math.cos(angle) * 0.38;
      stem.rotation.x = -Math.sin(angle) * 0.38;
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), leafColors[(leaf + level) % leafColors.length]);
      foliage.name = 'plant-leaf';
      foliage.position.set(Math.cos(angle) * reach, 0.17 + (leaf % 3) * 0.012, Math.sin(angle) * reach);
      foliage.scale.set(0.036, 0.012, 0.018);
      foliage.rotation.y = -angle;
      foliage.rotation.z = Math.cos(angle) * 0.28;
      foliage.castShadow = true;
      plant.add(foliage);
    }
    group.add(plant);
  }
  return group;
}

export function createLivingRoomDetails(placement, window, eastWallZ, radiatorNorthEdge, westWall) {
  const group = new THREE.Group();
  group.name = 'living-room-details';
  const eastSofa = sofa('living-east-sofa', 1.5, 0.6, 0.4, 0.52, 0.70);
  eastSofa.position.set(placement.eastSofa.x, 0, placement.eastSofa.z);
  eastSofa.rotation.y = Math.PI / 2;
  group.add(eastSofa);
  const southSofa = sofa('living-south-sofa', 2.1, 0.75, 0.45, 0.65, 0.80, true);
  southSofa.position.set(placement.southSofa.x, 0, placement.southSofa.z);
  group.add(southSofa);
  const westSofa = sofa('living-west-sofa', 2.1, 0.75, 0.45, 0.65, 0.80, true);
  westSofa.position.set(placement.westSofa.x, 0, placement.westSofa.z);
  westSofa.rotation.y = -Math.PI / 2;
  group.add(westSofa);
  const flowerRack = createFlowerRack();
  flowerRack.position.set(placement.flowerRack.x, 0, placement.flowerRack.z);
  flowerRack.rotation.y = Math.PI / 2;
  group.add(flowerRack);
  const doorwayPlant = createEastDoorwayPlant();
  doorwayPlant.position.set(placement.doorwayPlant.x, 0, placement.doorwayPlant.z);
  group.add(doorwayPlant);
  for (const [key, make] of [['sideTable', createSideTable], ['coffeeTable', createCoffeeTable], ['airConditioner', createAirConditioner], ['teaBar', createTeaBar]]) {
    const item = make();
    item.position.set(placement[key].x, 0, placement[key].z);
    if (key === 'sideTable') item.rotation.y = Math.PI / 2;
    group.add(item);
  }
  group.add(createOpenCurtains({ name: 'living-room-open-curtains', ...window }));
  const embroideryX = radiatorNorthEdge + embroideryWidth / 2;
  group.add(createEastWallEmbroidery(embroideryX, eastWallZ));
  group.add(createEastWallMap(embroideryX, eastWallZ));
  group.add(createWestWallDisplay(westWall.wallZ, westWall.doorFrameX));
  return group;
}
