import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createBookshelfContents } from './bookshelf-contents.js';
import { createWestBedroomDetails } from './west-bedroom-details.js';
import { createLivingRoomDetails } from './living-room-details.js';
import { createLivingRoomCeilingDetails } from './living-room-ceiling.js';
import { createLivingRoomNorthWall } from './living-room-north-wall.js';
import { createOpenCurtains } from './open-curtains.js';
import { createBalconyFlowerShelves } from './balcony-flower-shelves.js';
import { createBalconyWasher } from './balcony-washer.js';
import { createEastBedroomBed } from './east-bedroom-bed.js';
import { createEastBedroomStorage } from './east-bedroom-storage.js';
import { createBedroomAirConditioner } from './bedroom-air-conditioner.js';
import { createEastBedroomCoatRack } from './east-bedroom-coat-rack.js';
import { createEastBedroomShoeCabinet } from './east-bedroom-shoe-cabinet.js';
import { createBalconyParapetDetail } from './balcony-parapet.js';
import { createKitchenSouthFurniture } from './kitchen-south-furniture.js';
import { createKitchenNorthWestFurniture } from './kitchen-north-west-furniture.js';
import { createWashroomBasin } from './washroom-basin.js';
import { createWashroomWallDetails, createWashroomKettleRack, createShowerRoomDetails, createShowerCeilingHeater } from './washroom-shower-details.js';
import { createLargeStorageRoomFurniture, createSmallStorageRoomFurniture } from './storage-room-furniture.js';

export const WIDTH = 8.58;
export const DEPTH = 13.16;
const PX_X = 98;
const PX_Y = 217;
const SCALE = 100;
const x = (pixel) => (pixel - PX_X) / SCALE - WIDTH / 2;
const z = (pixel) => (pixel - PX_Y) / SCALE - DEPTH / 2;

// Wall centerlines and openings are traced from floor-plan.png. Opening coordinates
// are positions along the same pixel axis as the wall endpoints.
const walls = [
  { axis: 'x', at: 222, from: 103, to: 949, kind: 'outer' },
  { axis: 'x', at: 1528, from: 103, to: 949, kind: 'outer' },
  { axis: 'z', at: 103, from: 222, to: 1528, kind: 'outer', openings: [
    { from: 283, to: 479, type: 'north-window', sill: 2.12, top: 3.07 },
    { from: 595, to: 791, type: 'north-window', sill: 2.12, top: 3.07 },
    { from: 923.5, to: 1119.5, type: 'north-window', sill: 2.12, top: 3.07 },
    { from: 1263.5, to: 1459.5, type: 'north-window', sill: 2.12, top: 3.07 }
  ] },
  { axis: 'z', at: 949, from: 222, to: 548, kind: 'outer', openings: [
    { from: 236.5, to: 456.5, type: 'bedroom-window', sill: 0.94, top: 3.07 }
  ] },
  { axis: 'z', at: 949, from: 548, to: 1201, kind: 'outer', openings: [
    { from: 548, to: 900, type: 'balcony-window', sill: 0.71, top: 3.79 },
    { from: 900, to: 1194, type: 'balcony-entry', top: 3.79 }
  ] },
  { axis: 'z', at: 949, from: 1201, to: 1528, kind: 'outer', openings: [
    { from: 1270.5, to: 1490.5, type: 'bedroom-window', sill: 0.94, top: 3.07 }
  ] },
  { axis: 'z', at: 423, from: 222, to: 548, kind: 'inner' },
  { axis: 'x', at: 548, from: 103, to: 949, kind: 'inner', openings: [
    { from: 178, to: 261, type: 'service-door' },
    { from: 300.5, to: 397.5, type: 'room-door' },
    { from: 438, to: 535, type: 'room-door' },
    { from: 834.5, to: 932.5, type: 'bedroom-balcony-door', top: 3.04 }
  ] },
  { axis: 'z', at: 265, from: 548, to: 1200, kind: 'inner' },
  { axis: 'x', at: 873, from: 103, to: 265, kind: 'inner' },
  { axis: 'x', at: 993, from: 103, to: 265, kind: 'inner', height: 2.12, openings: [
    { from: 119, to: 265, type: 'shower-slider', top: 2.05 }
  ] },
  { axis: 'x', at: 1201, from: 103, to: 949, kind: 'inner', openings: [
    { from: 178, to: 261, type: 'service-door' },
    { from: 300.5, to: 397.5, type: 'room-door' },
    { from: 438, to: 535, type: 'room-door' }
  ] },
  { axis: 'z', at: 423, from: 1201, to: 1528, kind: 'inner' },
  { axis: 'z', at: 813, from: 548, to: 1201, kind: 'inner', openings: [
    { from: 598, to: 815, type: 'window', sill: 0.87, top: 3.04 },
    { from: 883, to: 1181, type: 'sliding-door', top: 3.04 }
  ] }
];

export const rooms = [
  { name: '客厅', area: '36 m²', px: 538, py: 875, entry: [813, 1032], bounds: [265, 548, 813, 1201] },
  { name: '西侧卧室', area: '18 m²', px: 684, py: 1366, walk: [560, 1275], entry: [486, 1201], look: [667, 1475], bounds: [423, 1201, 949, 1528] },
  { name: '东侧卧室', area: '18 m²', px: 684, py: 384, entry: [486, 548], bounds: [423, 222, 949, 548] },
  { name: '厨房', area: '10 m²', px: 263, py: 1366, entry: [349, 1201], bounds: [103, 1201, 423, 1528] },
  { name: '洗漱间', area: '约 3.4 m²', px: 178, py: 1097, walk: [218, 1060], entry: [219.5, 1201], bounds: [103, 993, 265, 1201] },
  { name: '洗澡间', area: '约 1.9 m²', px: 178, py: 932, walk: [180, 952], entry: [225, 993], look: [245, 885], bounds: [103, 873, 265, 993] },
  { name: '阳台', area: '8.8 m²', px: 884, py: 870, entry: [813, 1032], bounds: [813, 548, 949, 1201] },
  { name: '大杂物间', area: '10 m²', px: 263, py: 385, entry: [349, 548], look: [155, 325], bounds: [103, 222, 423, 548] },
  { name: '小杂物间', area: '5.3 m²', px: 178, py: 712, walk: [205, 680], entry: [219.5, 548], look: [180, 840], bounds: [103, 548, 265, 873] }
].map(room => ({ ...room, position: new THREE.Vector3(x(room.px), 0.14, z(room.py)), walkPosition: new THREE.Vector3(x(room.walk?.[0] ?? room.px), 1.62, z(room.walk?.[1] ?? room.py)), entryPosition: new THREE.Vector3(x(room.look?.[0] ?? room.entry[0]), 1.62, z(room.look?.[1] ?? room.entry[1])), zone: [x(room.bounds[0]), z(room.bounds[1]), x(room.bounds[2]), z(room.bounds[3])] }));

export const roomNavigation = [
  { name: '客厅', area: '36 m²', rooms: ['客厅'] },
  { name: '西卧室', area: '18 m²', rooms: ['西侧卧室'] },
  { name: '东卧室', area: '18 m²', rooms: ['东侧卧室'] },
  { name: '厨房', area: '10 m²', rooms: ['厨房'] },
  { name: '洗漱间（含洗澡间）', area: '约 5.3 m²', rooms: ['洗漱间', '洗澡间'] },
  { name: '阳台', area: '8.8 m²', rooms: ['阳台'] },
  { name: '杂物间', area: '约 15.3 m²', rooms: ['大杂物间', '小杂物间'] }
].map(group => ({ ...group, roomIndices: group.rooms.map(name => rooms.findIndex(room => room.name === name)) }));

const westBed = {
  width: 1.8,
  length: 2.0,
  headboardDepth: 0.2,
  centerX: x(949) - 0.06 - 0.9 - 0.9,
  centerZ: z(1528) - 0.06 - 0.2 - 1.0
};

const westNightstand = {
  length: 0.48,
  depth: 0.4,
  height: 0.45,
  centerX: westBed.centerX - westBed.width / 2 - 0.02 - 0.24,
  centerZ: z(1528) - 0.06 - 0.2
};

const eastBed = {
  width: 1.8,
  length: 2.0,
  headboardDepth: 0.10,
  centerX: x(949) - 0.06 - 0.55 - 0.90,
  centerZ: z(222) + 0.06 + 0.10 + 1.0
};

const eastNightstand = {
  length: 0.48,
  depth: 0.40,
  centerX: eastBed.centerX + eastBed.width / 2 + 0.02 + 0.24,
  centerZ: z(222) + 0.06 + 0.20
};

const eastNorthWardrobeWestEdge = z(548) - 0.05 - 0.97;
const eastWallStorage = {
  dresser: {
    x: eastBed.centerX - eastBed.width / 2 - 0.02 - 0.39,
    z: z(222) + 0.06 + 0.22,
    width: 0.78,
    depth: 0.44
  },
  wardrobe: {
    x: eastBed.centerX - eastBed.width / 2 - 0.02 - 0.78 - 0.01 - 0.40,
    z: z(222) + 0.06 + 0.275,
    width: 0.80,
    depth: 0.55
  },
  northWardrobes: [0, 1].map(index => ({
    x: x(423) + 0.05 + 0.275,
    z: eastNorthWardrobeWestEdge - 0.40 - index * 0.80,
    width: 0.55,
    depth: 0.80
  })),
  wallZ: z(222) + 0.06
};

const eastBedroomCoatRack = {
  x: eastWallStorage.wardrobe.x - eastWallStorage.wardrobe.width / 2 - 0.02 - 0.15 - 0.10,
  z: z(222) + 0.06 + 0.25,
  radius: 0.15
};

const eastBedroomShoeCabinet = {
  x: x(535) + 0.20 + 0.59,
  z: z(548) - 0.05 - 0.07 - 0.15,
  width: 1.18,
  depth: 0.30
};

const kitchenSouthFurniture = {
  table: { x: x(423) - 0.05 - 0.325, z: z(1201) + 0.84 + 0.35, width: 0.65, depth: 0.70 },
  fridge: { x: x(423) - 0.06 - 0.345, z: z(1201) + 0.84 + 0.70 + 0.09 + 0.395, width: 0.69, depth: 0.79 },
  cabinet: { x: x(423) - 0.05 - 0.20, z: z(1528) - 0.06 - 0.35, width: 0.40, depth: 0.70 }
};

const kitchenNorthWestFurniture = {
  table: { x: x(103) + 0.62 + 0.65, z: z(1528) - 0.06 - 0.40, width: 1.30, depth: 0.80 },
  hob: { x: x(103) + 0.06 + 0.20, z: z(1528) - 0.06 - 0.30 - 0.35, width: 0.40, depth: 0.70,
    westWallZ: z(1528) - 0.06 },
  hood: { x: x(103) + 0.06 + 0.20, z: z(1528) - 0.06 - 0.30 - 0.35 },
  cabinet: { x: x(103) + 0.06 + 0.225, z: z(1528) - 0.06 - 0.30 - 0.70 - 0.40, width: 0.45, depth: 0.80 },
  furnace: { x: x(103) + 0.05 + 0.20 + 0.10, z: z(1201) + 0.05 + 0.23, width: 0.40, depth: 0.46 }
};

const washroomBasin = {
  x: x(103) + 0.06 + 0.35 / 2,
  z: z(1201) - 0.05 - 1.23 - 0.43 / 2,
  width: 0.35,
  depth: 0.43
};

const washroomWallDetails = {
  northFaceX: x(103) + 0.06,
  westFaceZ: z(1201) - 0.05,
  shelfNorthX: x(103) + 0.05 + 0.07,
  mirrorZ: washroomBasin.z,
  basinWestZ: z(1150),
  basinEastZ: z(1108),
  faucetZ: z(1201) - 0.05 - 1.08,
  bucketX: x(103) + 0.06 + 0.225,
  bucketZ: z(1201) - 0.05 - 1.08 + 0.08
};

const washroomKettleRack = {
  x: x(103) + 0.40,
  z: z(993) + 0.05 + 0.15,
  width: 0.62,
  depth: 0.30
};

const showerRoomDetails = {
  southFaceX: x(265) - 0.05,
  eastFaceZ: z(873) + 0.05,
  southRackZ: z(950),
  heaterX: x(178),
  radiatorX: x(162),
  ceilingX: x(180),
  ceilingZ: z(932)
};

const largeStorageFurniture = {
  eastRacks: [175, 290].map(px => ({
    x: x(px), z: z(222) + 0.05 + 0.20, width: 1.0, depth: 0.40
  })),
  northTable: { x: x(103) + 0.06 + 0.28, z: z(370), width: 0.56, depth: 1.20 },
  freezer: { x: x(423) - 0.05 - 0.30, z: z(285), width: 0.60, depth: 0.70 },
  sideboard: { x: x(423) - 0.05 - 0.23, z: z(390), width: 0.46, depth: 1.05 },
  southFaceX: x(423) - 0.05,
  shelfZ: z(285)
};

const smallStorageFurniture = {
  yellowCabinet: { x: x(180), z: z(873) - 0.05 - 0.21, width: 0.86, depth: 0.42 },
  coveredStack: { x: x(103) + 0.05 + 0.24, z: z(740), width: 0.48, depth: 0.65 },
  chairs: { x: x(103) + 0.05 + 0.22, z: z(620), width: 0.44, depth: 0.45 },
  ladderX: x(180),
  ladderZ: z(700),
  southFaceX: x(265) - 0.05,
  matZ: z(745)
};

const bedroomAirConditioners = [
  { name: 'east-bedroom-wall-ac', x: x(949) - 0.06 - 0.20 - 0.425, z: z(222) + 0.06 + 0.115, facing: 1 },
  { name: 'west-bedroom-wall-ac', x: x(949) - 0.06 - 0.20 - 0.425, z: z(1528) - 0.06 - 0.115, facing: -1 }
];

const westBookshelf = {
  length: 0.8,
  depth: 0.3,
  height: 1.75,
  centerX: westNightstand.centerX - westNightstand.length / 2 - 0.01 - 0.4,
  centerZ: z(1528) - 0.06 - 0.15
};

const westWardrobe = {
  length: 2.25,
  depth: 0.62,
  height: 2.15,
  northEdge: x(423) + 0.05,
  westEdge: z(1528) - 0.06
};

const westUtilityCart = {
  length: 0.5,
  depth: 0.4,
  height: 0.86,
  centerX: x(535) + 0.35,
  centerZ: z(1201) + 0.05 + 0.2
};

const westRadiator = {
  length: 1.7,
  height: 0.6,
  thickness: 0.05,
  bottom: 0.5,
  northEdge: x(535) + 0.9,
  eastEdge: z(1201) + 0.05
};

const radiatorPlacements = [
  { name: 'west-bedroom-radiator', faceZ: westRadiator.eastEdge, facing: 1, northEdge: westRadiator.northEdge },
  { name: 'living-west-radiator', faceZ: z(1201) - 0.05, facing: -1, northEdge: x(535) + 0.50 },
  { name: 'east-bedroom-radiator', faceZ: z(548) - 0.05, facing: -1, northEdge: westRadiator.northEdge },
  { name: 'living-east-radiator', faceZ: z(548) + 0.05, facing: 1, northEdge: x(535) + 0.50 }
];

const westCabinet = {
  depth: 0.4,
  dresserLength: 0.8,
  deskLength: 1.2,
  overlap: 0.25,
  southEdge: x(949) - 0.06,
  westEdge: z(1528) - 0.06
};

const westVanityStool = {
  centerX: westCabinet.southEdge - 0.34,
  centerZ: westCabinet.westEdge - 0.60,
  radius: 0.19,
  height: 0.42
};

const westShoeCabinet = {
  length: 0.9,
  depth: 0.32,
  height: 0.92,
  southEdge: x(949) - 0.06,
  eastEdge: z(1201) + 0.05
};

const westCoatRack = {
  centerX: (westUtilityCart.centerX + westUtilityCart.length / 2 + westRadiator.northEdge) / 2,
  centerZ: westRadiator.eastEdge + 0.16,
  radius: 0.16
};

const livingRoomFurniture = {
  eastSofa: { x: x(662), z: z(583), width: 1.5, depth: 0.6 },
  southSofa: { x: x(770.5), z: z(733), width: 0.75, depth: 2.1 },
  westSofa: { x: x(813) - 0.45 - 1.05, z: z(1201) - 0.05 - 0.375, width: 2.1, depth: 0.75 },
  flowerRack: { x: x(813) - 0.15, z: z(1201) - 0.25, width: 0.2, depth: 0.4 },
  doorwayPlant: { x: x((397.5 + 438) / 2), z: z(548) + 0.20, width: 0.30, depth: 0.30 },
  sideTable: { x: x(762), z: z(588), width: 0.4, depth: 0.68 },
  coffeeTable: { x: x(663), z: z(730), width: 0.70, depth: 1.6 },
  airConditioner: { x: x(798), z: z(580), width: 0.20, depth: 0.68 },
  teaBar: { x: x(789), z: z(858), width: 0.37, depth: 0.4 }
};

const northWallFace = x(265) + 0.05;
const northCabinetWestEdge = z(1201) - 0.45;
const northCabinetLength = 0.32 + 3 * 0.61;
const northRackWestEdge = northCabinetWestEdge - northCabinetLength - 0.08;
const northTvWestEdge = northRackWestEdge - 0.70 - 0.08;
const livingNorthFurniture = {
  cabinets: { x: northWallFace + 0.20, z: northCabinetWestEdge - northCabinetLength / 2, width: 0.40, depth: northCabinetLength },
  rack: { x: northWallFace + 0.125, z: northRackWestEdge - 0.35, width: 0.25, depth: 0.70 },
  tvCabinet: { x: northWallFace + 0.20, z: northTvWestEdge - 1.0, width: 0.40, depth: 2.0 }
};

const balconyFlowerShelves = {
  x: x(813) + 0.05 + 0.20,
  eastEdge: z(548) + 0.26,
  width: 0.40,
  depth: 2.40
};

const balconyWasher = {
  x: x(813) + 0.05 + 0.10 + 0.35,
  z: z(1201) - 0.05 - 0.20,
  width: 0.70,
  depth: 0.40
};

export function createWalkColliders() {
  const passable = new Set(['room-door', 'service-door', 'bedroom-balcony-door', 'shower-slider', 'sliding-door']);
  const colliders = [];
  for (const wall of walls) {
    const thickness = wall.kind === 'outer' ? 0.12 : 0.10;
    const addSegment = (from, to) => {
      if (to <= from) return;
      if (wall.axis === 'x') {
        colliders.push({ minX: x(from), maxX: x(to), minZ: z(wall.at) - thickness / 2, maxZ: z(wall.at) + thickness / 2 });
      } else {
        colliders.push({ minX: x(wall.at) - thickness / 2, maxX: x(wall.at) + thickness / 2, minZ: z(from), maxZ: z(to) });
      }
    };
    let cursor = wall.from;
    for (const opening of wall.openings || []) {
      const entry = passable.has(opening.type);
      const from = opening.type === 'sliding-door' ? opening.from + (opening.to - opening.from) / 4 : opening.from;
      const to = opening.type === 'sliding-door' ? opening.to - (opening.to - opening.from) / 4 : opening.to;
      if (entry) {
        addSegment(cursor, from);
        cursor = to;
      }
      if (opening.type === 'shower-slider') {
        // The northern sliding leaf stays closed during walkthrough; the southern half is the passage.
        colliders.push({
          minX: x(opening.from),
          maxX: x((opening.from + opening.to) / 2),
          minZ: z(wall.at) - 0.025,
          maxZ: z(wall.at) + 0.025
        });
      }
      if (opening.type === 'room-door') {
        const hingeAtHighEnd = opening.from < 400;
        const hingeX = x(hingeAtHighEnd ? opening.to - 7 : opening.from + 7);
        const roomSide = wall.at === 548 ? -1 : 1;
        const leafEndZ = z(wall.at) + roomSide * ((opening.to - opening.from) / SCALE - 0.155);
        colliders.push({
          minX: hingeX - 0.025,
          maxX: hingeX + 0.025,
          minZ: Math.min(z(wall.at), leafEndZ),
          maxZ: Math.max(z(wall.at), leafEndZ)
        });
      }
    }
    addSegment(cursor, wall.to);
  }
  colliders.push({
    minX: westBed.centerX - westBed.width / 2,
    maxX: westBed.centerX + westBed.width / 2,
    minZ: westBed.centerZ - westBed.length / 2,
    maxZ: westBed.centerZ + westBed.length / 2 + westBed.headboardDepth
  });
  colliders.push({
    minX: westNightstand.centerX - westNightstand.length / 2,
    maxX: westNightstand.centerX + westNightstand.length / 2,
    minZ: westNightstand.centerZ - westNightstand.depth / 2,
    maxZ: westNightstand.centerZ + westNightstand.depth / 2
  });
  colliders.push({
    minX: eastBed.centerX - eastBed.width / 2,
    maxX: eastBed.centerX + eastBed.width / 2,
    minZ: eastBed.centerZ - eastBed.length / 2 - eastBed.headboardDepth,
    maxZ: eastBed.centerZ + eastBed.length / 2
  });
  colliders.push({
    minX: eastNightstand.centerX - eastNightstand.length / 2,
    maxX: eastNightstand.centerX + eastNightstand.length / 2,
    minZ: eastNightstand.centerZ - eastNightstand.depth / 2,
    maxZ: eastNightstand.centerZ + eastNightstand.depth / 2
  });
  for (const item of [eastWallStorage.dresser, eastWallStorage.wardrobe, ...eastWallStorage.northWardrobes]) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  colliders.push({
    minX: eastBedroomCoatRack.x - eastBedroomCoatRack.radius,
    maxX: eastBedroomCoatRack.x + eastBedroomCoatRack.radius,
    minZ: eastBedroomCoatRack.z - eastBedroomCoatRack.radius,
    maxZ: eastBedroomCoatRack.z + eastBedroomCoatRack.radius
  });
  colliders.push({
    minX: eastBedroomShoeCabinet.x - eastBedroomShoeCabinet.width / 2,
    maxX: eastBedroomShoeCabinet.x + eastBedroomShoeCabinet.width / 2,
    minZ: eastBedroomShoeCabinet.z - eastBedroomShoeCabinet.depth / 2,
    maxZ: eastBedroomShoeCabinet.z + eastBedroomShoeCabinet.depth / 2
  });
  for (const item of Object.values(kitchenSouthFurniture)) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  for (const item of [kitchenNorthWestFurniture.table, kitchenNorthWestFurniture.hob,
    kitchenNorthWestFurniture.cabinet, kitchenNorthWestFurniture.furnace]) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  colliders.push({
    minX: washroomBasin.x - washroomBasin.width / 2,
    maxX: washroomBasin.x + washroomBasin.width / 2,
    minZ: washroomBasin.z - washroomBasin.depth / 2,
    maxZ: washroomBasin.z + washroomBasin.depth / 2
  });
  colliders.push({
    minX: washroomWallDetails.shelfNorthX,
    maxX: washroomWallDetails.shelfNorthX + 0.55,
    minZ: washroomWallDetails.westFaceZ - 0.21,
    maxZ: washroomWallDetails.westFaceZ
  });
  colliders.push({
    minX: washroomWallDetails.bucketX - 0.20,
    maxX: washroomWallDetails.bucketX + 0.20,
    minZ: washroomWallDetails.bucketZ - 0.20,
    maxZ: washroomWallDetails.bucketZ + 0.20
  });
  colliders.push({
    minX: washroomKettleRack.x - washroomKettleRack.width / 2,
    maxX: washroomKettleRack.x + washroomKettleRack.width / 2,
    minZ: washroomKettleRack.z - washroomKettleRack.depth / 2,
    maxZ: washroomKettleRack.z + washroomKettleRack.depth / 2
  });
  for (const item of [...largeStorageFurniture.eastRacks, largeStorageFurniture.northTable,
    largeStorageFurniture.freezer, largeStorageFurniture.sideboard,
    smallStorageFurniture.yellowCabinet, smallStorageFurniture.coveredStack, smallStorageFurniture.chairs]) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  colliders.push({
    minX: showerRoomDetails.southFaceX - 0.215,
    maxX: showerRoomDetails.southFaceX,
    minZ: showerRoomDetails.southRackZ - 0.23,
    maxZ: showerRoomDetails.southRackZ + 0.23
  });
  colliders.push({
    minX: showerRoomDetails.southFaceX - 0.43,
    maxX: showerRoomDetails.southFaceX,
    minZ: showerRoomDetails.eastFaceZ,
    maxZ: showerRoomDetails.eastFaceZ + 0.43
  });
  colliders.push({
    minX: westBookshelf.centerX - westBookshelf.length / 2,
    maxX: westBookshelf.centerX + westBookshelf.length / 2,
    minZ: westBookshelf.centerZ - westBookshelf.depth / 2,
    maxZ: westBookshelf.centerZ + westBookshelf.depth / 2
  });
  colliders.push({
    minX: westWardrobe.northEdge,
    maxX: westWardrobe.northEdge + westWardrobe.depth,
    minZ: westWardrobe.westEdge - westWardrobe.length,
    maxZ: westWardrobe.westEdge
  });
  colliders.push({
    minX: westUtilityCart.centerX - westUtilityCart.length / 2,
    maxX: westUtilityCart.centerX + westUtilityCart.length / 2,
    minZ: westUtilityCart.centerZ - westUtilityCart.depth / 2,
    maxZ: westUtilityCart.centerZ + westUtilityCart.depth / 2
  });
  for (const placement of radiatorPlacements) {
    const frontZ = placement.faceZ + placement.facing * westRadiator.thickness;
    colliders.push({
      minX: placement.northEdge,
      maxX: placement.northEdge + westRadiator.length,
      minZ: Math.min(placement.faceZ, frontZ),
      maxZ: Math.max(placement.faceZ, frontZ)
    });
  }
  colliders.push({
    minX: westCoatRack.centerX - westCoatRack.radius,
    maxX: westCoatRack.centerX + westCoatRack.radius,
    minZ: westCoatRack.centerZ - westCoatRack.radius,
    maxZ: westCoatRack.centerZ + westCoatRack.radius
  });
  colliders.push({
    minX: westCabinet.southEdge - westCabinet.depth,
    maxX: westCabinet.southEdge,
    minZ: westCabinet.westEdge - westCabinet.dresserLength - westCabinet.deskLength + westCabinet.overlap,
    maxZ: westCabinet.westEdge
  });
  colliders.push({
    minX: westVanityStool.centerX - westVanityStool.radius,
    maxX: westVanityStool.centerX + westVanityStool.radius,
    minZ: westVanityStool.centerZ - westVanityStool.radius,
    maxZ: westVanityStool.centerZ + westVanityStool.radius
  });
  colliders.push({
    minX: westShoeCabinet.southEdge - westShoeCabinet.depth,
    maxX: westShoeCabinet.southEdge,
    minZ: westShoeCabinet.eastEdge,
    maxZ: westShoeCabinet.eastEdge + westShoeCabinet.length
  });
  for (const item of Object.values(livingRoomFurniture)) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  for (const item of Object.values(livingNorthFurniture)) {
    colliders.push({
      minX: item.x - item.width / 2,
      maxX: item.x + item.width / 2,
      minZ: item.z - item.depth / 2,
      maxZ: item.z + item.depth / 2
    });
  }
  colliders.push({
    minX: balconyFlowerShelves.x - balconyFlowerShelves.width / 2,
    maxX: balconyFlowerShelves.x + balconyFlowerShelves.width / 2,
    minZ: balconyFlowerShelves.eastEdge,
    maxZ: balconyFlowerShelves.eastEdge + balconyFlowerShelves.depth
  });
  colliders.push({
    minX: balconyWasher.x - balconyWasher.width / 2,
    maxX: balconyWasher.x + balconyWasher.width / 2,
    minZ: balconyWasher.z - balconyWasher.depth / 2,
    maxZ: balconyWasher.z + balconyWasher.depth / 2
  });
  return colliders;
}

function createPillowFabric() {
  const size = 256;
  const pixels = new Uint8Array(size * size * 4);
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const u = px / size;
      const v = py / size;
      let color = [190, 186, 180];
      if (u > 0.20 && u < 0.31) color = [73, 70, 70];
      if (u > 0.44 && u < 0.54) color = [185, 149, 109];
      if (u > 0.71 && u < 0.82) color = [65, 73, 82];
      if ((v > 0.34 && v < 0.42) || (v > 0.62 && v < 0.69)) color = color.map(channel => channel * 0.55 + 220 * 0.45);
      const weave = ((px + py) % 2 ? 4 : -4) + ((px * 7 + py * 11) % 9 - 4);
      const offset = (py * size + px) * 4;
      for (let channel = 0; channel < 3; channel++) pixels[offset + channel] = Math.max(0, Math.min(255, color[channel] + weave));
      pixels[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.center.set(0.5, 0.5);
  texture.rotation = Math.PI / 2;
  texture.needsUpdate = true;
  return new THREE.MeshStandardMaterial({ map: texture, roughness: 1 });
}

export function createFurniture() {
  const group = new THREE.Group();
  group.name = 'furniture';
  const bed = new THREE.Group();
  bed.name = 'west-bedroom-bed';
  bed.position.set(westBed.centerX, 0, westBed.centerZ);
  const bedFrame = new THREE.MeshStandardMaterial({ color: 0x513a32, roughness: 0.88 });
  const headboardFabric = new THREE.MeshStandardMaterial({ color: 0xa9aaa1, roughness: 1 });
  const piping = new THREE.MeshStandardMaterial({ color: 0xe0dfd5, roughness: 0.95 });
  const mattress = new THREE.MeshStandardMaterial({ color: 0xf0f0ec, roughness: 0.96 });
  const bedding = new THREE.MeshStandardMaterial({ color: 0xc8d2d0, roughness: 0.98 });
  const pillow = createPillowFabric();
  const add = (width, height, length, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), material);
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bed.add(mesh);
    return mesh;
  };
  add(1.8, 0.22, 2.0, 0, 0.22, 0, bedFrame);
  add(1.8, 0.25, 0.26, 0, 0.245, 1.07, bedFrame).name = 'headboard-base';
  const headboardOutline = new THREE.Shape();
  headboardOutline.moveTo(-0.9, 0.21);
  headboardOutline.lineTo(-0.9, 1.03);
  headboardOutline.quadraticCurveTo(-0.9, 1.13, -0.79, 1.13);
  headboardOutline.lineTo(0.79, 1.13);
  headboardOutline.quadraticCurveTo(0.9, 1.13, 0.9, 1.03);
  headboardOutline.lineTo(0.9, 0.21);
  headboardOutline.closePath();
  const headboard = new THREE.Mesh(new THREE.ExtrudeGeometry(headboardOutline, { depth: 0.03, bevelEnabled: false }), bedFrame);
  headboard.name = 'upholstered-headboard';
  headboard.position.z = westBed.length / 2 + westBed.headboardDepth - 0.03;
  headboard.castShadow = true;
  headboard.receiveShadow = true;
  bed.add(headboard);
  add(1.62, 0.72, 0.12, 0, 0.69, 1.14, bedFrame).name = 'headboard-back';
  for (const side of [-1, 1]) {
    const cushion = new THREE.Mesh(new RoundedBoxGeometry(0.755, 0.70, 0.10, 4, 0.045), headboardFabric);
    cushion.name = 'headboard-cushion';
    cushion.position.set(side * 0.388, 0.695, 1.05);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    bed.add(cushion);
  }
  add(1.54, 0.055, 0.012, 0, 0.77, 0.994, bedFrame);
  add(1.55, 0.012, 0.008, 0, 1.055, 0.995, piping);
  for (const side of [-1, 1]) add(0.012, 0.70, 0.008, side * 0.78, 0.695, 0.995, piping);
  add(1.70, 0.19, 1.82, 0, 0.425, -0.05, mattress);
  const quiltGeometry = new RoundedBoxGeometry(1.69, 0.12, 1.88, 8, 0.055);
  const quiltVertices = quiltGeometry.getAttribute('position');
  for (let index = 0; index < quiltVertices.count; index++) {
    const px = quiltVertices.getX(index);
    const py = quiltVertices.getY(index);
    const pz = quiltVertices.getZ(index);
    const wave = 0.011 * Math.sin(px * 5 + pz * 2) + 0.007 * Math.cos(pz * 6);
    quiltVertices.setY(index, py + Math.max(0, py / 0.06) * wave);
  }
  quiltGeometry.computeVertexNormals();
  const quilt = new THREE.Mesh(quiltGeometry, bedding);
  quilt.name = 'bed-quilt';
  quilt.position.set(0, 0.56, -0.02);
  quilt.castShadow = true;
  quilt.receiveShadow = true;
  bed.add(quilt);
  const pillowGeometry = new RoundedBoxGeometry(0.70, 0.13, 0.45, 6, 0.06);
  const pillowVertices = pillowGeometry.getAttribute('position');
  for (let index = 0; index < pillowVertices.count; index++) {
    const px = pillowVertices.getX(index);
    const py = pillowVertices.getY(index);
    const pz = pillowVertices.getZ(index);
    const fullness = Math.max(0, 1 - (px / 0.35) ** 2) * Math.max(0, 1 - (pz / 0.225) ** 2);
    pillowVertices.setY(index, py + Math.sign(py) * 0.01 * fullness);
  }
  pillowGeometry.computeBoundingBox();
  pillowGeometry.scale(1, 0.15 / (pillowGeometry.boundingBox.max.y - pillowGeometry.boundingBox.min.y), 1);
  pillowGeometry.computeVertexNormals();
  for (const side of [-1, 1]) {
    const cushion = new THREE.Mesh(pillowGeometry, pillow);
    cushion.name = 'bed-pillow';
    cushion.position.set(side * 0.43, 0.69, 0.63);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    bed.add(cushion);
  }
  group.add(bed);

  const eastBedroomBed = createEastBedroomBed();
  eastBedroomBed.position.set(eastBed.centerX, 0, eastBed.centerZ);
  eastBedroomBed.rotation.y = Math.PI;
  group.add(eastBedroomBed);

  const nightstand = new THREE.Group();
  nightstand.name = 'west-bedroom-nightstand';
  nightstand.position.set(westNightstand.centerX, 0, westNightstand.centerZ);
  const nightstandBody = new THREE.MeshStandardMaterial({ color: 0x513a32, roughness: 0.84 });
  const nightstandFront = new THREE.MeshStandardMaterial({ color: 0xa9aaa3, roughness: 0.96 });
  const nightstandKnob = new THREE.MeshStandardMaterial({ color: 0xb8b7ad, metalness: 0.55, roughness: 0.38 });
  const addNightstandPart = (name, width, height, depth, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    nightstand.add(mesh);
  };
  addNightstandPart('body', 0.46, 0.42, 0.36, 0, 0.21, 0.01, nightstandBody);
  addNightstandPart('top', 0.48, 0.03, 0.4, 0, 0.435, 0, nightstandBody);
  for (const drawerY of [0.11, 0.31]) {
    addNightstandPart('drawer', 0.43, 0.17, 0.016, 0, drawerY, -0.178, nightstandFront);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), nightstandKnob);
    knob.name = 'drawer-knob';
    knob.position.set(0, drawerY, -0.187);
    nightstand.add(knob);
  }
  group.add(nightstand);

  const eastBedroomNightstand = nightstand.clone(true);
  eastBedroomNightstand.name = 'east-bedroom-nightstand';
  eastBedroomNightstand.position.set(eastNightstand.centerX, 0, eastNightstand.centerZ);
  eastBedroomNightstand.rotation.y = Math.PI;
  group.add(eastBedroomNightstand);
  group.add(createEastBedroomStorage(eastWallStorage));
  group.add(createEastBedroomCoatRack(eastBedroomCoatRack));
  group.add(createEastBedroomShoeCabinet(eastBedroomShoeCabinet));
  for (const placement of bedroomAirConditioners) group.add(createBedroomAirConditioner(placement));

  const bookshelf = new THREE.Group();
  bookshelf.name = 'west-bedroom-bookshelf';
  bookshelf.position.set(westBookshelf.centerX, 0, westBookshelf.centerZ);
  const shelfWood = new THREE.MeshStandardMaterial({ color: 0x624734, roughness: 0.86 });
  const shelfBack = new THREE.MeshStandardMaterial({ color: 0x403228, roughness: 0.93 });
  const shelfDrawer = new THREE.MeshStandardMaterial({ color: 0xe5e3dc, roughness: 0.9 });
  const smallDrawerColors = [0x367672, 0xc9a04e, 0x344f62, 0xb97051].map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));
  const pullMaterial = new THREE.MeshStandardMaterial({ color: 0xaf8553, roughness: 0.5, metalness: 0.2 });
  const addShelfPart = (name, width, height, depth, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bookshelf.add(mesh);
  };
  const frontZ = -westBookshelf.depth / 2;
  addShelfPart('back', 0.8, 1.67, 0.012, 0, 0.915, 0.144, shelfBack);
  for (const side of [-1, 1]) {
    addShelfPart('side', 0.025, 1.67, 0.3, side * 0.3875, 0.915, 0, shelfWood);
    for (const end of [-1, 1]) addShelfPart('leg', 0.035, 0.08, 0.035, side * 0.36, 0.04, end * 0.125, shelfWood);
  }
  for (const level of [0.095, 0.45, 0.78, 1.735]) addShelfPart('shelf', 0.8, 0.03, 0.3, 0, level, 0, shelfWood);
  addShelfPart('main-divider', 0.025, 1.625, 0.3, -0.105, 0.9175, 0, shelfWood);
  for (const level of [1.10, 1.42]) addShelfPart('wide-shelf', 0.49, 0.025, 0.3, 0.145, level, 0, shelfWood);
  addShelfPart('narrow-shelf', 0.27, 0.025, 0.3, -0.2475, 1.24, 0, shelfWood);
  addShelfPart('open-cubby-divider', 0.025, 0.30, 0.3, 0.15, 0.615, 0, shelfWood);
  bookshelf.add(createBookshelfContents());
  for (let index = 0; index < 3; index++) {
    const drawerY = 0.17 + index * 0.105;
    addShelfPart('bookcase-drawer', 0.46, 0.095, 0.018, 0.145, drawerY, frontZ + 0.019, shelfDrawer);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 8), pullMaterial);
    knob.position.set(0.145, drawerY, frontZ + 0.011);
    bookshelf.add(knob);
  }
  for (let index = 0; index < 4; index++) {
    addShelfPart('small-drawer', 0.235, 0.067, 0.018, -0.2475, 0.711 - index * 0.073, frontZ + 0.009, smallDrawerColors[index]);
  }
  group.add(bookshelf);

  const wardrobe = new THREE.Group();
  wardrobe.name = 'west-bedroom-wardrobe';
  wardrobe.position.set(westWardrobe.northEdge + westWardrobe.depth / 2, 0, westWardrobe.westEdge - westWardrobe.length / 2);
  const wardrobeFrame = new THREE.MeshStandardMaterial({ color: 0xe3e4df, roughness: 0.86 });
  const upperPanel = new THREE.MeshStandardMaterial({ color: 0xecece5, roughness: 0.92 });
  const lowerPanel = new THREE.MeshStandardMaterial({ color: 0xb9b8bc, roughness: 0.91 });
  const band = new THREE.MeshStandardMaterial({ color: 0x50494d, roughness: 0.86 });
  const seam = new THREE.MeshStandardMaterial({ color: 0x393a3c, roughness: 0.88 });
  const motifLine = new THREE.LineBasicMaterial({ color: 0x838791 });
  const motifPetal = new THREE.MeshStandardMaterial({ color: 0x969aa2, roughness: 1 });
  const addWardrobePart = (name, width, height, length, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    wardrobe.add(mesh);
  };
  const wardrobeFrontX = westWardrobe.depth / 2;
  addWardrobePart('back', 0.02, 2.15, 2.25, -wardrobeFrontX + 0.01, 1.075, 0, wardrobeFrame);
  for (const edgeZ of [-1.11, 1.11]) addWardrobePart('side', 0.62, 2.15, 0.03, 0, 1.075, edgeZ, wardrobeFrame);
  addWardrobePart('top', 0.62, 0.035, 2.25, 0, 2.1325, 0, wardrobeFrame);
  addWardrobePart('plinth', 0.62, 0.10, 2.25, 0, 0.05, 0, wardrobeFrame);
  const petalGeometry = new THREE.SphereGeometry(1, 8, 6);
  for (let index = 0; index < 3; index++) {
    const centerZ = (index - 1) * 0.75;
    const trackX = wardrobeFrontX - 0.025 + (index % 2) * 0.009;
    addWardrobePart('door-lower', 0.024, 0.84, 0.737, trackX, 0.52, centerZ, lowerPanel);
    addWardrobePart('door-band', 0.025, 0.095, 0.737, trackX, 0.9875, centerZ, band);
    addWardrobePart('door-upper', 0.024, 1.045, 0.737, trackX, 1.5575, centerZ, upperPanel);
    const faceX = trackX + 0.0125;
    for (const branch of [-1, 0, 1]) {
      const tipZ = centerZ + branch * 0.105;
      const tipY = 1.57 + (branch === 0 ? 0.14 : 0.07);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(faceX, 1.45, centerZ),
        new THREE.Vector3(faceX, tipY, tipZ)
      ]), motifLine);
      wardrobe.add(line);
      for (let petalIndex = 0; petalIndex < 4; petalIndex++) {
        const petal = new THREE.Mesh(petalGeometry, motifPetal);
        const angle = petalIndex * Math.PI / 2;
        petal.position.set(faceX + 0.001, tipY + Math.sin(angle) * 0.027, tipZ + Math.cos(angle) * 0.032);
        petal.scale.set(0.002, 0.024, 0.012);
        wardrobe.add(petal);
      }
    }
  }
  for (const edgeZ of [-0.375, 0.375]) addWardrobePart('door-seam', 0.005, 2.0, 0.012, wardrobeFrontX - 0.004, 1.10, edgeZ, seam);
  group.add(wardrobe);

  const utilityCart = new THREE.Group();
  utilityCart.name = 'west-bedroom-utility-cart';
  utilityCart.position.set(westUtilityCart.centerX, 0, westUtilityCart.centerZ);
  const cartFrame = new THREE.MeshStandardMaterial({ color: 0xe8ebe8, roughness: 0.62, metalness: 0.22 });
  const cartWood = new THREE.MeshStandardMaterial({ color: 0xc6a878, roughness: 0.83 });
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333638, roughness: 0.78 });
  const vacuumWhite = new THREE.MeshStandardMaterial({ color: 0xf0f1ed, roughness: 0.75 });
  const vacuumTrim = new THREE.MeshStandardMaterial({ color: 0x626968, roughness: 0.65 });
  const addCartPart = (name, geometry, px, py, pz, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    utilityCart.add(mesh);
    return mesh;
  };
  for (const sideX of [-1, 1]) {
    for (const sideZ of [-1, 1]) {
      const legX = sideX * 0.225;
      const legZ = sideZ * 0.175;
      addCartPart('leg', new THREE.BoxGeometry(0.025, 0.77, 0.025), legX, 0.46, legZ, cartFrame);
      addCartPart('wheel', new THREE.CylinderGeometry(0.027, 0.027, 0.022, 12), sideX * 0.22, 0.027, legZ, wheelMaterial).rotation.x = Math.PI / 2;
    }
  }
  addCartPart('top', new THREE.BoxGeometry(0.5, 0.025, 0.4), 0, 0.8475, 0, cartWood);
  addCartPart('middle-shelf', new THREE.BoxGeometry(0.46, 0.025, 0.36), 0, 0.55, 0, cartWood);
  addCartPart('lower-brace', new THREE.BoxGeometry(0.45, 0.025, 0.025), 0, 0.095, 0.175, cartFrame);
  addCartPart('vacuum-dock', new RoundedBoxGeometry(0.32, 0.43, 0.20, 3, 0.025), 0, 0.31, -0.075, vacuumWhite);
  addCartPart('vacuum', new THREE.CylinderGeometry(0.17, 0.17, 0.075, 32), 0, 0.0725, 0.025, vacuumWhite);
  addCartPart('vacuum-sensor', new THREE.CylinderGeometry(0.033, 0.033, 0.025, 20), 0, 0.1225, -0.015, vacuumTrim);
  addCartPart('vacuum-front', new THREE.BoxGeometry(0.10, 0.018, 0.007), 0, 0.065, 0.191, vacuumTrim);
  group.add(utilityCart);

  const radiator = new THREE.Group();
  radiator.name = radiatorPlacements[0].name;
  radiator.position.set(westRadiator.northEdge + westRadiator.length / 2, westRadiator.bottom, radiatorPlacements[0].faceZ);
  const radiatorPaint = new THREE.MeshStandardMaterial({ color: 0xe6e8e3, roughness: 0.65, metalness: 0.12 });
  const radiatorRecess = new THREE.MeshStandardMaterial({ color: 0x8a8c88, roughness: 0.88 });
  const radiatorFitting = new THREE.MeshStandardMaterial({ color: 0x969d9a, roughness: 0.43, metalness: 0.58 });
  const addRadiatorPart = (name, geometry, px, py, pz, material = radiatorPaint) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    radiator.add(mesh);
    return mesh;
  };
  const railGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.7, 16);
  for (const railY of [0.02, 0.58]) {
    addRadiatorPart('round-rail', railGeometry, 0, railY, 0.025).rotation.z = Math.PI / 2;
  }
  addRadiatorPart('dark-recesses', new THREE.BoxGeometry(1.64, 0.515, 0.005), 0, 0.3, 0.003, radiatorRecess);
  const finGeometry = new RoundedBoxGeometry(0.067, 0.53, 0.049, 4, 0.024);
  for (let index = 0; index < 20; index++) {
    const finX = -0.8 + index * (1.6 / 19);
    addRadiatorPart('rounded-fin', finGeometry, finX, 0.3, 0.025);
  }
  const fittingGeometry = new THREE.CylinderGeometry(0.014, 0.014, 0.008, 12);
  for (const endX of [-0.825, 0.825]) {
    addRadiatorPart('end-fitting', fittingGeometry, endX, 0.58, 0.044, radiatorFitting).rotation.x = Math.PI / 2;
  }
  group.add(radiator);
  for (const placement of radiatorPlacements.slice(1)) {
    const duplicate = radiator.clone(true);
    duplicate.name = placement.name;
    duplicate.position.x = placement.northEdge + westRadiator.length / 2;
    duplicate.position.z = placement.faceZ;
    duplicate.rotation.y = placement.facing === -1 ? Math.PI : 0;
    group.add(duplicate);
  }

  const cabinet = new THREE.Group();
  cabinet.name = 'west-bedroom-cabinet';
  const cream = new THREE.MeshStandardMaterial({ color: 0xe7e5dc, roughness: 0.78 });
  const drawer = new THREE.MeshStandardMaterial({ color: 0xf4f1e9, roughness: 0.83 });
  const tabletop = new THREE.MeshStandardMaterial({ color: 0x514038, roughness: 0.72 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x3e4240, roughness: 0.52, metalness: 0.48 });
  const addCabinetPart = (name, width, height, length, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    cabinet.add(mesh);
  };
  const addRoundedCabinetPart = (name, width, height, length, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, length, 3, Math.min(width / 2, 0.008)), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    cabinet.add(mesh);
  };
  const frontX = westCabinet.southEdge - westCabinet.depth;
  const deskWest = westCabinet.westEdge;
  const deskEast = deskWest - westCabinet.deskLength;
  const dresserWest = deskEast + westCabinet.overlap;
  const dresserEast = dresserWest - westCabinet.dresserLength;
  const depthCenter = westCabinet.southEdge - westCabinet.depth / 2;

  addCabinetPart('dresser-body', 0.38, 0.57, 0.78, depthCenter + 0.01, 0.295, (dresserWest + dresserEast) / 2, cream);
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 2; column++) {
      const drawerZ = dresserWest - 0.205 - column * 0.39;
      addRoundedCabinetPart('dresser-drawer', 0.012, 0.16, 0.37, frontX - 0.007, 0.485 - row * 0.18, drawerZ, drawer);
    }
  }
  addCabinetPart('dresser-top', 0.4, 0.025, 0.8, depthCenter, 0.6, (dresserWest + dresserEast) / 2, tabletop);
  for (const edgeZ of [dresserWest - 0.0125, dresserEast + 0.0125]) {
    addRoundedCabinetPart('dresser-end-cap', 0.025, 0.58, 0.025, frontX + 0.009, 0.30, edgeZ, cream);
  }

  addCabinetPart('desk-top', 0.4, 0.035, 1.2, depthCenter, 0.7425, (deskWest + deskEast) / 2, tabletop);
  addCabinetPart('desk-drawer-body', 0.35, 0.13, 1.18, depthCenter + 0.025, 0.66, (deskWest + deskEast) / 2, cream);
  const deskCenter = (deskWest + deskEast) / 2;
  for (const side of [-1, 1]) {
    addRoundedCabinetPart('desk-drawer-front', 0.014, 0.105, 0.545, frontX - 0.007, 0.66, deskCenter + side * 0.2825, drawer);
  }
  for (const edgeZ of [deskWest - 0.013, deskEast + 0.013]) {
    addRoundedCabinetPart('desk-end-cap', 0.035, 0.16, 0.026, frontX + 0.012, 0.68, edgeZ, cream);
  }
  for (const edgeX of [frontX + 0.025, westCabinet.southEdge - 0.025]) {
    addCabinetPart('desk-leg', 0.025, 0.73, 0.025, edgeX, 0.365, deskWest - 0.035, metal);
  }
  group.add(cabinet);

  const shoeCabinet = new THREE.Group();
  shoeCabinet.name = 'west-bedroom-shoe-cabinet';
  const shoeWood = new THREE.MeshStandardMaterial({ color: 0x4b352e, roughness: 0.8 });
  const shoeDoors = new THREE.MeshStandardMaterial({ color: 0xe9e8e2, roughness: 0.88 });
  const addShoePart = (name, width, height, length, px, py, pz, material) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    shoeCabinet.add(mesh);
  };
  const { length, depth, height, southEdge, eastEdge } = westShoeCabinet;
  const shoeX = southEdge - depth / 2;
  const shoeZ = eastEdge + length / 2;
  const sideWidth = 0.025;
  addShoePart('back', 0.018, height, length, southEdge - 0.009, height / 2, shoeZ, shoeWood);
  for (const edgeZ of [eastEdge + sideWidth / 2, eastEdge + length - sideWidth / 2]) {
    addShoePart('side', depth, height, sideWidth, shoeX, height / 2, edgeZ, shoeWood);
  }
  addShoePart('base', depth, 0.025, length, shoeX, 0.0125, shoeZ, shoeWood);
  addShoePart('cubby-shelf', depth, 0.025, length, shoeX, 0.1875, shoeZ, shoeWood);
  addShoePart('cubby-divider', depth - 0.02, 0.15, 0.025, shoeX, 0.10, shoeZ, shoeWood);
  addShoePart('top', depth, 0.03, length, shoeX, height - 0.015, shoeZ, shoeWood);
  const doorWidth = (length - 2 * sideWidth) / 3;
  for (let index = 0; index < 3; index++) {
    const doorZ = eastEdge + sideWidth + doorWidth * (index + 0.5);
    addShoePart('shoe-door', 0.018, 0.66, doorWidth - 0.012, southEdge - depth + 0.009, 0.545, doorZ, shoeDoors);
  }
  group.add(shoeCabinet);
  group.add(createWestBedroomDetails({
    cabinet: westCabinet,
    cart: westUtilityCart,
    radiator: westRadiator,
    stool: westVanityStool,
    window: { wallX: x(949), startZ: z(1270.5), endZ: z(1490.5) }
  }));
  group.add(createOpenCurtains({
    name: 'east-bedroom-open-curtains', wallX: x(949), startZ: z(236.5), endZ: z(456.5)
  }));
  group.add(createLivingRoomDetails(livingRoomFurniture, {
    wallX: x(813), startZ: z(598), endZ: z(815)
  }, z(548), radiatorPlacements[3].northEdge, {
    wallZ: z(1201), doorFrameX: x(535)
  }));
  group.add(createLivingRoomNorthWall(livingNorthFurniture));
  group.add(createBalconyFlowerShelves(balconyFlowerShelves));
  group.add(createBalconyWasher(balconyWasher));
  group.add(createKitchenSouthFurniture(kitchenSouthFurniture));
  group.add(createKitchenNorthWestFurniture(kitchenNorthWestFurniture));
  group.add(createWashroomBasin(washroomBasin));
  group.add(createWashroomWallDetails(washroomWallDetails));
  group.add(createWashroomKettleRack(washroomKettleRack));
  group.add(createShowerRoomDetails(showerRoomDetails));
  group.add(createLargeStorageRoomFurniture(largeStorageFurniture));
  group.add(createSmallStorageRoomFurniture(smallStorageFurniture));
  return group;
}

export function createCeilings() {
  const group = new THREE.Group();
  group.name = 'ceilings';
  group.add(createShowerCeilingHeater(showerRoomDetails));
  const painted = new THREE.MeshStandardMaterial({ color: 0xf3f3ef, emissive: 0xffffff, emissiveIntensity: 0.24, roughness: 0.98 });
  const structural = new THREE.MeshStandardMaterial({ color: 0xc5c7c2, roughness: 0.98 });
  const panelSeam = new THREE.MeshStandardMaterial({ color: 0xa9ada9, roughness: 1 });
  for (const room of rooms) {
    const [minX, minZ, maxX, maxZ] = room.zone;
    const bedroomCeiling = ['西侧卧室', '东侧卧室'].includes(room.name);
    const finish = bedroomCeiling ? 3.27 : room.name === '客厅' ? 3.44 : 4.14;
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(maxX - minX, 0.06, maxZ - minZ), finish === 4.14 ? structural : painted);
    ceiling.name = `${room.name}-ceiling`;
    ceiling.position.set((minX + maxX) / 2, finish + 0.03, (minZ + maxZ) / 2);
    ceiling.receiveShadow = true;
    group.add(ceiling);
    if (room.name === '客厅') group.add(createLivingRoomCeilingDetails(room, finish));
    if (bedroomCeiling) {
      for (let panelX = minX + 0.20; panelX < maxX - 0.05; panelX += 0.20) {
        const seam = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.002, maxZ - minZ), panelSeam);
        seam.name = room.name === '西侧卧室' ? 'west-bedroom-ceiling-panel-seam' : 'east-bedroom-ceiling-panel-seam';
        seam.position.set(panelX, finish - 0.001, (minZ + maxZ) / 2);
        group.add(seam);
      }
    }
  }

  const bedroom = rooms.find(room => room.name === '西侧卧室');
  const [minX, minZ, maxX, maxZ] = bedroom.zone;
  const lamp = new THREE.Group();
  lamp.name = 'west-bedroom-ceiling-lamp';
  lamp.position.set((minX + maxX) / 2, 3.27, (minZ + maxZ) / 2);
  const rim = new THREE.MeshStandardMaterial({ color: 0xe8e9e5, metalness: 0.08, roughness: 0.72 });
  const diffuser = new THREE.MeshStandardMaterial({ color: 0xf1f1ed, emissive: 0xffffff, emissiveIntensity: 0.14, roughness: 0.82 });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.025, 40), rim);
  plate.position.y = -0.022;
  lamp.add(plate);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.228, 0.228, 0.032, 40), diffuser);
  shade.name = 'round-lamp-diffuser';
  shade.position.y = -0.05;
  lamp.add(shade);
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.006, 8, 48), rim);
  trim.rotation.x = Math.PI / 2;
  trim.position.y = -0.055;
  lamp.add(trim);
  const bulb = new THREE.PointLight(0xfff2df, 0.55, 5, 2);
  bulb.position.y = -0.12;
  lamp.add(bulb);
  group.add(lamp);
  const eastBedroom = rooms.find(room => room.name === '东侧卧室');
  const [eastMinX, eastMinZ, eastMaxX, eastMaxZ] = eastBedroom.zone;
  const eastLamp = lamp.clone(true);
  eastLamp.name = 'east-bedroom-ceiling-lamp';
  eastLamp.position.set((eastMinX + eastMaxX) / 2, 3.27, (eastMinZ + eastMaxZ) / 2);
  group.add(eastLamp);
  return group;
}

const materials = {
  cement: new THREE.MeshStandardMaterial({ color: 0xb7b8b4, roughness: 0.96 }),
  white: new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.94 }),
  edge: new THREE.LineBasicMaterial({ color: 0x909a95, transparent: true, opacity: 0.33 })
};

function wallMaterials(wall) {
  if (wall.kind === 'inner') return materials.white;
  const faces = Array(6).fill(materials.cement);
  if (wall.axis === 'z') faces[wall.at === 103 ? 0 : 1] = materials.white;
  else faces[wall.at === 222 ? 4 : 5] = materials.white;
  return faces;
}

const glazingMaterials = {
  glass: new THREE.MeshStandardMaterial({ color: 0x7fa9aa, transparent: true, opacity: 0.38, roughness: 0.18, metalness: 0.08, side: THREE.DoubleSide, depthWrite: false }),
  frame: new THREE.MeshStandardMaterial({ color: 0x797f77, roughness: 0.5, metalness: 0.35 }),
  lowerPanel: new THREE.MeshStandardMaterial({ color: 0xa8aca1, roughness: 0.72, metalness: 0.1 }),
  showerGlass: new THREE.MeshStandardMaterial({ color: 0xb8c6c2, transparent: true, opacity: 0.82, roughness: 0.82, side: THREE.DoubleSide, depthWrite: false }),
  showerPanel: new THREE.MeshStandardMaterial({ color: 0x4e534f, roughness: 0.8 })
};

const doorMaterials = {
  frame: new THREE.MeshStandardMaterial({ color: 0x442a24, roughness: 0.7 }),
  leaf: new THREE.MeshStandardMaterial({ color: 0x533229, roughness: 0.74 }),
  inset: new THREE.MeshStandardMaterial({ color: 0x603a2e, roughness: 0.77 }),
  handle: new THREE.MeshStandardMaterial({ color: 0xc4c8c3, metalness: 0.75, roughness: 0.35 })
};

const serviceDoorMaterials = {
  frame: new THREE.MeshStandardMaterial({ color: 0xbab7aa, roughness: 0.82 }),
  leaf: new THREE.MeshStandardMaterial({ color: 0xd8d5c8, roughness: 0.88 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x6b8585, transparent: true, opacity: 0.56, roughness: 0.22, side: THREE.DoubleSide, depthWrite: false })
};

const bedroomBalconyMaterials = {
  frame: new THREE.MeshStandardMaterial({ color: 0x968c78, roughness: 0.58, metalness: 0.24 }),
  panel: new THREE.MeshStandardMaterial({ color: 0xaaa99e, roughness: 0.82 })
};

function createRoomDoor(wall, opening) {
  const group = new THREE.Group();
  group.name = 'room-door';
  group.position.set(x((opening.from + opening.to) / 2), 0, z(wall.at));
  const add = (parent, width, height, depth, px, py, pz, material, leaf = false) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.userData.doorLeaf = leaf;
    mesh.userData.roomDoorLeaf = leaf;
    parent.add(mesh);
    return mesh;
  };
  const width = (opening.to - opening.from) / SCALE;
  const jamb = 0.07;
  for (const side of [-1, 1]) add(group, jamb, 2.2, 0.16, side * (width - jamb) / 2, 1.1, 0, doorMaterials.frame);
  add(group, width, jamb, 0.16, 0, 2.2 - jamb / 2, 0, doorMaterials.frame);
  const hingeSide = opening.from < 400 ? 1 : -1;
  const hingeX = hingeSide * (width / 2 - jamb);
  const leafWidth = width - jamb * 2 - 0.015;
  const leafCenterX = hingeX - hingeSide * leafWidth / 2;
  const pivot = new THREE.Group();
  pivot.name = 'room-door-open-pivot';
  pivot.position.x = hingeX;
  pivot.userData.roomDoorPivot = true;
  pivot.userData.openAngle = (wall.at === 548 ? -1 : 1) * hingeSide * Math.PI / 2;
  group.add(pivot);
  const addLeaf = (w, h, d, px, py, pz, material) => add(pivot, w, h, d, px - hingeX, py, pz, material, true);
  addLeaf(leafWidth, 2.08, 0.045, leafCenterX, 1.07, 0, doorMaterials.leaf);
  for (const side of [-1, 1]) {
    for (const [panelY, panelHeight] of [[0.54, 0.77], [1.55, 0.78]]) {
      const panelWidth = width - 0.26;
      addLeaf(panelWidth, panelHeight, 0.007, leafCenterX, panelY, side * 0.026, doorMaterials.inset);
      for (const edgeX of [-1, 1]) {
        addLeaf(0.012, panelHeight, 0.008, leafCenterX + edgeX * panelWidth / 2, panelY, side * 0.032, doorMaterials.frame);
      }
      for (const edgeY of [-1, 1]) {
        addLeaf(panelWidth, 0.012, 0.008, leafCenterX, panelY + edgeY * panelHeight / 2, side * 0.032, doorMaterials.frame);
      }
      const flower = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.003, 5, 16), doorMaterials.frame);
      flower.name = 'carved-door-flower';
      flower.position.set(leafCenterX - hingeX, panelY, side * 0.033);
      flower.userData.doorLeaf = true;
      flower.userData.roomDoorLeaf = true;
      pivot.add(flower);
    }
    const handleX = leafCenterX - hingeSide * 0.29;
    addLeaf(0.035, 0.13, 0.015, handleX, 1.03, side * 0.036, doorMaterials.handle);
    addLeaf(0.14, 0.025, 0.025, handleX + hingeSide * 0.05, 1.03, side * 0.046, doorMaterials.handle);
  }
  return group;
}

function createServiceDoor(wall, opening) {
  const group = new THREE.Group();
  group.name = 'service-door';
  group.position.set(x((opening.from + opening.to) / 2), 0, z(wall.at));
  const add = (width, height, depth, px, py, pz, material, leaf = false) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
    mesh.position.set(px, py, pz);
    mesh.castShadow = material !== serviceDoorMaterials.glass;
    mesh.userData.doorLeaf = leaf;
    group.add(mesh);
  };
  const frameWidth = 0.055;
  for (const side of [-1, 1]) add(frameWidth, 2.33, 0.13, side * (0.83 - frameWidth) / 2, 1.165, 0, serviceDoorMaterials.frame);
  add(0.83, frameWidth, 0.13, 0, 2.33 - frameWidth / 2, 0, serviceDoorMaterials.frame);
  add(0.83, frameWidth, 0.13, 0, 1.96, 0, serviceDoorMaterials.frame);
  const leafWidth = 0.83 - frameWidth * 2;
  add(leafWidth, 1.435, 0.045, 0, (0.025 + 1.46) / 2, 0, serviceDoorMaterials.leaf, true);
  add(leafWidth, 0.075, 0.045, 0, (1.86 + 1.935) / 2, 0, serviceDoorMaterials.leaf, true);
  for (const side of [-1, 1]) add((leafWidth - 0.56) / 2, 0.40, 0.045, side * (leafWidth + 0.56) / 4, 1.66, 0, serviceDoorMaterials.leaf, true);
  add(0.56, 0.40, 0.06, 0, 1.66, 0, serviceDoorMaterials.glass, true);
  add(0.71, 0.315, 0.025, 0, 2.145, 0, serviceDoorMaterials.glass, true);
  for (const side of [-1, 1]) {
    add(0.025, 0.08, 0.02, wall.at === 548 ? -0.29 : 0.29, 0.99, side * 0.035, doorMaterials.handle, true);
  }
  return group;
}

function createBedroomBalconyDoor(wall, opening) {
  const group = new THREE.Group();
  group.name = 'bedroom-balcony-door';
  group.position.set(x((opening.from + opening.to) / 2), 0, z(wall.at));
  const add = (width, bottom, top, px, material, leaf = false) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, top - bottom, 0.06), material);
    mesh.position.set(px, (bottom + top) / 2, 0);
    mesh.castShadow = material !== glazingMaterials.showerGlass;
    mesh.userData.doorLeaf = leaf;
    mesh.userData.defaultClosed = leaf;
    mesh.userData.walkOpen = leaf;
    group.add(mesh);
  };
  const frame = bedroomBalconyMaterials.frame;
  for (const side of [-1, 1]) add(0.06, 0, 3.04, side * 0.46, frame);
  add(0.98, 2.98, 3.04, 0, frame);
  add(0.98, 2.17, 2.23, 0, frame);
  add(0.88, 0.04, 1.00, 0, bedroomBalconyMaterials.panel, true);
  add(0.88, 1.00, 2.20, 0, glazingMaterials.showerGlass, true);
  add(0.88, 2.20, 3.04, 0, glazingMaterials.showerGlass);
  group.children[group.children.length - 1].userData.openingHeader = true;
  add(0.88, 0.98, 1.025, 0, frame, true);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.1, 0.04), doorMaterials.handle);
  handle.position.set(-0.36, 1.05, 0.055);
  handle.userData.doorLeaf = true;
  handle.userData.defaultClosed = true;
  handle.userData.walkOpen = true;
  group.add(handle);
  return group;
}

function createShowerSlider(wall, opening) {
  const group = new THREE.Group();
  group.name = 'shower-slider';
  group.position.set(x((opening.from + opening.to) / 2), 0, z(wall.at));
  const add = (width, bottom, top, px, pz, material, leaf = true) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, top - bottom, 0.045), material);
    mesh.position.set(px, (bottom + top) / 2, pz);
    mesh.castShadow = material !== glazingMaterials.showerGlass;
    mesh.userData.doorLeaf = leaf;
    group.add(mesh);
    return mesh;
  };
  const leafWidth = 0.73;
  for (const edge of [-1, 1]) add(0.045, 0, 2.05, edge * (1.46 - 0.045) / 2, 0, glazingMaterials.frame, false);
  add(1.46, 2.005, 2.05, 0, 0, glazingMaterials.frame, false);
  for (let index = 0; index < 2; index++) {
    const side = index === 0 ? -1 : 1;
    const center = -leafWidth / 2;
    const track = side * 0.025;
    const addPanelPart = (width, bottom, top, px, material) => {
      const part = add(width, bottom, top, px, track, material);
      part.userData.defaultClosed = index === 0;
    };
    addPanelPart(leafWidth, 0.04, 0.90, center, glazingMaterials.showerPanel);
    addPanelPart(leafWidth, 0.90, 2.00, center, glazingMaterials.showerGlass);
    for (const edge of [-1, 1]) addPanelPart(0.035, 0.04, 2.05, center + edge * (leafWidth - 0.035) / 2, glazingMaterials.frame);
    addPanelPart(leafWidth, 0.04, 0.075, center, glazingMaterials.frame);
    addPanelPart(leafWidth, 0.88, 0.915, center, glazingMaterials.frame);
    addPanelPart(leafWidth, 2.00, 2.05, center, glazingMaterials.frame);
  }
  return group;
}

function createShowerCeiling() {
  const group = new THREE.Group();
  group.name = 'shower-ceiling';
  const geometry = new THREE.BoxGeometry((265 - 103) / SCALE, 0.07, (993 - 873) / SCALE);
  const material = new THREE.MeshStandardMaterial({ color: 0xe1e5e0, roughness: 0.95 });
  const ceiling = new THREE.Mesh(geometry, material);
  ceiling.position.set(x((103 + 265) / 2), 2.155, z((873 + 993) / 2));
  ceiling.castShadow = true;
  ceiling.receiveShadow = true;
  group.add(ceiling);
  ceiling.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.edge));
  return group;
}

function createBalconyGlazing() {
  const group = new THREE.Group();
  group.name = 'balcony-glazing';
  const planeX = x(813);
  const addPiece = (start, end, bottom, top, material, depth = 0.025) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(depth, top - bottom, (end - start) / SCALE), material);
    mesh.position.set(planeX, (bottom + top) / 2, z((start + end) / 2));
    mesh.castShadow = material !== glazingMaterials.glass;
    group.add(mesh);
  };
  const frame = (start, end, bottom, top) => {
    const bar = 0.035;
    addPiece(start, end, bottom, bottom + bar, glazingMaterials.frame, 0.055);
    addPiece(start, end, top - bar, top, glazingMaterials.frame, 0.055);
    for (const at of [start, end]) addPiece(at - 1.8, at + 1.8, bottom, top, glazingMaterials.frame, 0.055);
  };

  // The interior slider is shown open: the two center leaves are retracted.
  addPiece(598, 815, 0.87, 3.04, glazingMaterials.glass);
  frame(598, 815, 0.87, 3.04);
  addPiece(598, 815, 2.2, 2.235, glazingMaterials.frame, 0.055);
  addPiece(705, 708.5, 0.87, 3.04, glazingMaterials.frame, 0.055);

  const doorStart = 883;
  const panelWidth = 74.5;
  const transomBottom = 2.25;
  for (let index = 0; index < 4; index++) {
    if (index === 1 || index === 2) continue;
    const start = doorStart + index * panelWidth;
    const end = start + panelWidth;
    addPiece(start, end, 0.04, 0.86, glazingMaterials.lowerPanel);
    addPiece(start, end, 0.86, transomBottom, glazingMaterials.glass);
    frame(start, end, 0.04, transomBottom);
    addPiece(start, end, 0.84, 0.875, glazingMaterials.frame, 0.055);
  }
  const transomWidth = panelWidth * 4 / 3;
  for (let index = 0; index < 3; index++) {
    const start = doorStart + index * transomWidth;
    const end = start + transomWidth;
    addPiece(start, end, transomBottom, 3.04, glazingMaterials.glass);
    frame(start, end, transomBottom, 3.04);
  }
  return group;
}

function createExteriorFacade() {
  const group = new THREE.Group();
  group.name = 'balcony-exterior';
  const planeX = x(949);
  const addPiece = (start, end, bottom, top, material, depth = 0.04) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(depth, top - bottom, (end - start) / SCALE), material);
    mesh.position.set(planeX, (bottom + top) / 2, z((start + end) / 2));
    mesh.castShadow = material !== glazingMaterials.glass;
    group.add(mesh);
  };
  const frame = (start, end, bottom, top) => {
    const bar = 0.045;
    addPiece(start, end, bottom, bottom + bar, glazingMaterials.frame, 0.075);
    addPiece(start, end, top - bar, top, glazingMaterials.frame, 0.075);
    for (const at of [start, end]) addPiece(at - 2.25, at + 2.25, bottom, top, glazingMaterials.frame, 0.075);
  };
  group.add(createBalconyParapetDetail(planeX, z(548), z(900)));

  // Four lower sliding windows and four fixed panes above a 0.71 m parapet.
  for (let index = 0; index < 4; index++) {
    const start = 548 + index * 88;
    const end = start + 88;
    addPiece(start, end, 0.71, 2.19, glazingMaterials.glass);
    frame(start, end, 0.71, 2.19);
    addPiece(start, end, 2.19, 3.79, glazingMaterials.glass);
    frame(start, end, 2.19, 3.79);
  }

  // Fixed side leaves, two operable center leaves, then four equal transom panes.
  const widths = [65, 82, 82, 65];
  let cursor = 900;
  for (let index = 0; index < widths.length; index++) {
    const start = cursor;
    const end = start + widths[index];
    addPiece(start, end, 0.04, 0.81, glazingMaterials.lowerPanel);
    addPiece(start, end, 0.81, 2.40, glazingMaterials.glass);
    frame(start, end, 0.04, 2.40);
    addPiece(start, end, 0.79, 0.835, glazingMaterials.frame, 0.075);
    if (index === 1) {
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.18, 0.025), doorMaterials.handle);
      handle.position.set(planeX - 0.046, 1.1, z(index === 1 ? end - 7 : start + 7));
      group.add(handle);
    }
    cursor = end;
  }
  for (let index = 0; index < 4; index++) {
    const start = 900 + index * 73.5;
    const end = start + 73.5;
    addPiece(start, end, 2.40, 3.79, glazingMaterials.glass);
    frame(start, end, 2.40, 3.79);
  }
  return group;
}

function createTwoPanelWindow(opening, { name, wallX, sill, split, top }) {
  const group = new THREE.Group();
  group.name = name;
  const planeX = x(wallX);
  const addPiece = (start, end, bottom, top, material, depth = 0.03, offset = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(depth, top - bottom, (end - start) / SCALE), material);
    mesh.position.set(planeX + offset, (bottom + top) / 2, z((start + end) / 2));
    mesh.castShadow = material !== glazingMaterials.glass;
    group.add(mesh);
  };
  const frame = (start, end, bottom, top) => {
    const bar = 0.04;
    addPiece(start, end, bottom, bottom + bar, glazingMaterials.frame, 0.07);
    addPiece(start, end, top - bar, top, glazingMaterials.frame, 0.07);
    for (const at of [start, end]) addPiece(at - 2, at + 2, bottom, top, glazingMaterials.frame, 0.07);
  };

  const paneWidth = (opening.to - opening.from) / 2;
  for (let index = 0; index < 2; index++) {
    const start = opening.from + index * paneWidth;
    const end = start + paneWidth;
    addPiece(start, end, sill, split ?? top, glazingMaterials.glass, 0.03, index === 0 ? -0.012 : 0.012);
    frame(start, end, sill, split ?? top);
    if (split != null) {
      addPiece(start, end, split, top, glazingMaterials.glass);
      frame(start, end, split, top);
    }
  }
  return group;
}

export function createWalls(height) {
  const group = new THREE.Group();
  group.name = 'walls';
  const addBlock = (wall, start, end, low, high) => {
    if (end - start < 0.015 || high - low < 0.015) return;
    const length = (end - start) / SCALE;
    const thickness = wall.kind === 'outer' ? 0.12 : 0.10;
    const geometry = new THREE.BoxGeometry(wall.axis === 'x' ? length : thickness, high - low, wall.axis === 'z' ? length : thickness);
    const mesh = new THREE.Mesh(geometry, wallMaterials(wall));
    mesh.userData.openingHeader = low > 0;
    mesh.position.set(wall.axis === 'x' ? x((start + end) / 2) : x(wall.at), (low + high) / 2, wall.axis === 'z' ? z((start + end) / 2) : z(wall.at));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.edge));
  };

  for (const wall of walls) {
    const wallHeight = wall.height ?? height;
    let cursor = wall.from;
    for (const opening of wall.openings || []) {
      addBlock(wall, cursor, opening.from, 0, wallHeight);
      if (opening.type === 'window' || opening.type === 'balcony-window' || opening.type === 'bedroom-window' || opening.type === 'north-window') {
        addBlock(wall, opening.from, opening.to, 0, opening.sill ?? 0.85);
        addBlock(wall, opening.from, opening.to, Math.min(opening.top ?? 2.18, wallHeight), wallHeight);
        if (opening.type === 'bedroom-window') group.add(createTwoPanelWindow(opening, { name: 'bedroom-window', wallX: 949, sill: 0.94, split: 2.37, top: 3.07 }));
        if (opening.type === 'north-window') group.add(createTwoPanelWindow(opening, { name: 'north-window', wallX: 103, sill: 2.12, top: 3.07 }));
      } else {
        const doorTop = opening.type === 'service-door' ? 2.33 : opening.type === 'room-door' ? 2.20 : 2.10;
        addBlock(wall, opening.from, opening.to, Math.min(opening.top ?? doorTop, wallHeight), wallHeight);
        if (opening.type === 'room-door') group.add(createRoomDoor(wall, opening));
        if (opening.type === 'service-door') group.add(createServiceDoor(wall, opening));
        if (opening.type === 'shower-slider') group.add(createShowerSlider(wall, opening));
        if (opening.type === 'bedroom-balcony-door') group.add(createBedroomBalconyDoor(wall, opening));
      }
      cursor = opening.to;
    }
    addBlock(wall, cursor, wall.to, 0, wallHeight);
  }
  group.add(createBalconyGlazing());
  group.add(createExteriorFacade());
  group.add(createShowerCeiling());
  return group;
}

export function createFloor() {
  const group = new THREE.Group();
  const cement = new THREE.MeshStandardMaterial({ color: 0xb7b8b4, roughness: 1 });
  const tile80 = new THREE.MeshStandardMaterial({ color: 0xe9e9e5, roughness: 0.76 });
  const tile30 = new THREE.MeshStandardMaterial({ color: 0xcdd0cc, roughness: 0.88 });
  const grout = new THREE.MeshStandardMaterial({ color: 0xa7aca8, roughness: 1 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(WIDTH, 0.12, DEPTH), cement);
  slab.position.y = -0.06;
  slab.receiveShadow = true;
  group.add(slab);

  const addTiles = (name, left, right, top, bottom, size, tileMaterial) => {
    const tiledRoom = new THREE.Group();
    tiledRoom.name = name;
    const x0 = x(left);
    const x1 = x(right);
    const z0 = z(top);
    const z1 = z(bottom);
    const underlay = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), grout);
    underlay.rotation.x = -Math.PI / 2;
    underlay.position.set((x0 + x1) / 2, 0.002, (z0 + z1) / 2);
    tiledRoom.add(underlay);
    const gap = size === 0.3 ? 0.006 : 0.009;
    for (let startX = x0; startX < x1 - 0.001; startX += size) {
      for (let startZ = z0; startZ < z1 - 0.001; startZ += size) {
        const endX = Math.min(startX + size, x1);
        const endZ = Math.min(startZ + size, z1);
        const tile = new THREE.Mesh(new THREE.PlaneGeometry(endX - startX - gap, endZ - startZ - gap), tileMaterial);
        tile.rotation.x = -Math.PI / 2;
        tile.position.set((startX + endX) / 2, 0.005, (startZ + endZ) / 2);
        tile.receiveShadow = true;
        tiledRoom.add(tile);
      }
    }
    group.add(tiledRoom);
  };

  addTiles('living-room-tiles', 265, 813, 548, 1201, 0.8, tile80);
  addTiles('balcony-tiles', 813, 949, 548, 1201, 0.8, tile80);
  addTiles('west-bedroom-tiles', 423, 949, 1201, 1528, 0.8, tile80);
  addTiles('shower-tiles', 103, 265, 873, 993, 0.3, tile30);
  const drain = new THREE.Group();
  drain.name = 'washroom-northwest-floor-drain-10cm';
  drain.position.set(x(103) + 0.25, 0, z(1201) - 0.25);
  const drainDark = new THREE.MeshStandardMaterial({ color: 0x424b49, metalness: 0.38, roughness: 0.58 });
  const drainSteel = new THREE.MeshStandardMaterial({ color: 0x9a9f9d, metalness: 0.66, roughness: 0.39 });
  const grate = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.004, 32), drainDark);
  grate.name = 'circular-floor-drain-grate';
  grate.position.y = 0.004;
  drain.add(grate);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.003, 6, 32), drainSteel);
  rim.name = 'floor-drain-metal-rim';
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.009;
  drain.add(rim);
  for (const offset of [-0.027, -0.0135, 0, 0.0135, 0.027]) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.002, 0.075), drainSteel);
    bar.name = 'floor-drain-slit-bar';
    bar.position.set(offset, 0.008, 0);
    drain.add(bar);
  }
  group.add(drain);
  return group;
}

export function createDimensions() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({ color: 0xc6694d, transparent: true, opacity: 0.95 });
  const addLine = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([a, b, c]) => new THREE.Vector3(a, b, c)));
    group.add(new THREE.Line(geometry, material));
  };
  const west = -WIDTH / 2 - 0.62;
  const north = -DEPTH / 2 - 0.62;
  addLine([[west, 0.015, -DEPTH / 2], [west, 0.015, DEPTH / 2]]);
  addLine([[-WIDTH / 2, 0.015, north], [WIDTH / 2, 0.015, north]]);
  for (const side of [-1, 1]) {
    addLine([[west - 0.13, 0.015, side * DEPTH / 2], [west + 0.13, 0.015, side * DEPTH / 2]]);
    addLine([[side * WIDTH / 2, 0.015, north - 0.13], [side * WIDTH / 2, 0.015, north + 0.13]]);
  }
  return group;
}
