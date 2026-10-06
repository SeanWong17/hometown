import * as THREE from 'three';

const black = new THREE.MeshStandardMaterial({ color: 0x252a2a, metalness: 0.35, roughness: 0.58 });
const chrome = new THREE.MeshStandardMaterial({ color: 0xb7beb9, metalness: 0.60, roughness: 0.29 });
const white = new THREE.MeshStandardMaterial({ color: 0xf0eee7, roughness: 0.62 });
const orange = new THREE.MeshStandardMaterial({ color: 0xc95b32, roughness: 0.79 });
const cream = new THREE.MeshStandardMaterial({ color: 0xd6d1bd, roughness: 0.77 });
const bottleBlue = new THREE.MeshStandardMaterial({ color: 0x688f9c, roughness: 0.58 });
const bucketRed = new THREE.MeshStandardMaterial({ color: 0xa7392b, roughness: 0.84, side: THREE.DoubleSide });
const thermosRed = new THREE.MeshStandardMaterial({ color: 0x73212a, metalness: 0.43, roughness: 0.43 });
const bulb = new THREE.MeshStandardMaterial({ color: 0xfff6e8, emissive: 0xffefd2, emissiveIntensity: 0.54, roughness: 0.35 });

function box(parent, name, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, name, top, bottom, height, position, material, segments = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function wallShelf(parent, name, centerX, faceZ, length, depth, y, style = 'wire') {
  const centerZ = faceZ - depth / 2;
  if (style === 'tray') {
    box(parent, `${name}-solid-tray`, [length, 0.018, depth], [centerX, y, centerZ], black);
    box(parent, `${name}-front-lip`, [length, 0.046, 0.014],
      [centerX, y + 0.021, faceZ - depth + 0.007], black);
    for (const x of [centerX - length / 2 + 0.008, centerX + length / 2 - 0.008]) {
      box(parent, `${name}-side-lip`, [0.014, 0.046, depth],
        [x, y + 0.021, centerZ], black);
    }
    return;
  }
  for (const z of [faceZ - 0.008, faceZ - depth + 0.008]) {
    box(parent, `${name}-long-rail`, [length, 0.014, 0.012], [centerX, y, z], black);
  }
  for (let index = 0; index < 9; index++) {
    const x = centerX - length / 2 + 0.035 + index * (length - 0.07) / 8;
    box(parent, `${name}-wire`, [0.009, 0.009, depth - 0.015], [x, y, centerZ], black);
  }
  for (const x of [centerX - length / 2 + 0.025, centerX + length / 2 - 0.025]) {
    box(parent, `${name}-end`, [0.014, 0.014, depth], [x, y, centerZ], black);
  }
  box(parent, `${name}-raised-front-guard`, [length, 0.014, 0.012],
    [centerX, y + 0.11, faceZ - depth + 0.008], black);
  for (const x of [centerX - length / 2 + 0.025, centerX + length / 2 - 0.025]) {
    box(parent, `${name}-guard-end`, [0.012, 0.11, 0.012],
      [x, y + 0.055, faceZ - depth + 0.008], black);
  }
}

export function createWashroomWallDetails(layout) {
  const group = new THREE.Group();
  group.name = 'washroom-wall-details';
  const shelfCenterX = layout.shelfNorthX + 0.275;
  const faceZ = layout.westFaceZ;
  for (const x of [layout.shelfNorthX + 0.025, layout.shelfNorthX + 0.525]) {
    box(group, 'west-wall-rack-upright', [0.018, 0.47, 0.018], [x, 1.275, faceZ - 0.014], black);
  }
  wallShelf(group, 'lower-13cm-shelf', shelfCenterX, faceZ, 0.55, 0.13, 1.12, 'tray');
  wallShelf(group, 'upper-21cm-shelf', shelfCenterX, faceZ, 0.55, 0.21, 1.36);
  for (let i = 0; i < 4; i++) {
    const x = shelfCenterX - 0.20 + i * 0.13;
    box(group, 'rack-hanging-hook', [0.009, 0.055, 0.009], [x, 1.07, faceZ - 0.105], black);
  }
  for (const [offset, color, height] of [[-0.15, white, 0.105], [0.08, bottleBlue, 0.13]]) {
    box(group, 'washroom-shelf-bottle', [0.045, height, 0.05], [shelfCenterX + offset, 1.37 + height / 2, faceZ - 0.12], color);
  }

  // Looking north, the towel rail is to the west (left) of the mirror.
  const towelZ = layout.mirrorZ + 0.51;
  const towelMountZ = towelZ + 0.19;
  box(group, 'single-towel-rack-wall-plate', [0.018, 0.42, 0.060],
    [layout.northFaceX + 0.010, 1.50, towelMountZ], chrome);
  for (const y of [1.38, 1.61]) {
    const armX = layout.northFaceX + (y < 1.5 ? 0.14 : 0.08);
    box(group, 'towel-arm-hinge', [armX - layout.northFaceX, 0.025, 0.026],
      [(armX + layout.northFaceX) / 2, y, towelMountZ], chrome);
    const bar = cylinder(group, 'double-towel-rail', 0.009, 0.009, 0.38,
      [armX, y, towelZ], chrome, 12);
    bar.rotation.x = Math.PI / 2;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.013, 10, 8), chrome);
    cap.name = 'towel-arm-free-end-cap';
    cap.position.set(armX, y, towelZ - 0.19);
    group.add(cap);
  }
  box(group, 'towel-rack-bottom-hook', [0.025, 0.035, 0.012],
    [layout.northFaceX + 0.032, 1.27, towelMountZ], chrome);

  for (const [z, radius, material, name] of [
    [layout.basinWestZ, 0.19, orange, 'orange-hanging-basin'],
    [layout.basinEastZ, 0.16, cream, 'cream-hanging-basin']
  ]) {
    box(group, `${name}-wall-hook`, [0.05, 0.055, 0.012], [layout.northFaceX + 0.022, 1.12, z], chrome);
    const bowl = cylinder(group, name, radius, radius * 0.91, 0.055,
      [layout.northFaceX + 0.085, 0.88, z], material, 32);
    bowl.rotation.z = Math.PI / 2;
    const bottom = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), material);
    bottom.name = `${name}-closed-bottom-facing-outward`;
    bottom.position.set(layout.northFaceX + 0.114, 0.88, z);
    bottom.scale.set(0.008, radius * 0.67, radius * 0.67);
    group.add(bottom);
  }

  // The water supply runs vertically against the north wall before the tap branches out.
  const faucetZ = layout.faucetZ;
  cylinder(group, 'north-wall-vertical-water-pipe', 0.011, 0.011, 0.78,
    [layout.northFaceX + 0.011, 0.39, faucetZ], white, 12);
  for (const y of [0.28, 0.68]) {
    box(group, 'vertical-pipe-wall-clamp', [0.032, 0.018, 0.034],
      [layout.northFaceX + 0.016, y, faucetZ], chrome);
  }
  box(group, 'low-faucet-wall-plate', [0.018, 0.060, 0.060],
    [layout.northFaceX + 0.009, 0.80, faucetZ], chrome);
  const tapPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(layout.northFaceX + 0.020, 0.80, faucetZ),
    new THREE.Vector3(layout.northFaceX + 0.085, 0.80, faucetZ),
    new THREE.Vector3(layout.northFaceX + 0.13, 0.79, faucetZ),
    new THREE.Vector3(layout.northFaceX + 0.13, 0.755, faucetZ)
  ]);
  const tap = new THREE.Mesh(new THREE.TubeGeometry(tapPath, 16, 0.012, 10, false), chrome);
  tap.name = 'ordinary-faucet-from-vertical-pipe';
  group.add(tap);
  box(group, 'low-faucet-handle', [0.045, 0.012, 0.018],
    [layout.northFaceX + 0.07, 0.835, faucetZ], chrome);

  const bucket = new THREE.Group();
  bucket.name = 'red-water-bucket-below-faucet';
  bucket.position.set(layout.bucketX, 0, layout.bucketZ);
  const bucketWall = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.18, 0.39, 28, 1, true), bucketRed);
  bucketWall.name = 'open-red-water-bucket-body';
  bucketWall.position.y = 0.215;
  bucketWall.castShadow = true;
  bucket.add(bucketWall);
  cylinder(bucket, 'bucket-bottom', 0.18, 0.18, 0.014, [0, 0.027, 0], bucketRed, 28);
  const bucketRim = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.010, 8, 28), bucketRed);
  bucketRim.name = 'bucket-open-rim';
  bucketRim.rotation.x = Math.PI / 2;
  bucketRim.position.y = 0.41;
  bucket.add(bucketRim);
  const waterDipper = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.09, 0.085, 24, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xb7beb9, metalness: 0.60, roughness: 0.29, side: THREE.DoubleSide }));
  waterDipper.name = 'steel-water-dipper';
  waterDipper.position.set(0.01, 0.28, 0);
  bucket.add(waterDipper);
  cylinder(bucket, 'water-dipper-bottom', 0.09, 0.09, 0.006, [0.01, 0.24, 0], chrome, 24);
  const dipperHandle = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.10, 0.29, 0),
    new THREE.Vector3(0.16, 0.30, 0),
    new THREE.Vector3(0.21, 0.29, 0)
  ]), 10, 0.009, 6, false), chrome);
  dipperHandle.name = 'water-dipper-handle';
  bucket.add(dipperHandle);
  group.add(bucket);
  return group;
}

export function createWashroomKettleRack(placement) {
  const group = new THREE.Group();
  group.name = 'washroom-two-thermos-floor-rack';
  group.position.set(placement.x, 0, placement.z);
  for (const z of [-0.135, 0.135]) {
    box(group, 'stainless-rack-long-rail', [0.62, 0.015, 0.015], [0, 0.10, z], chrome);
  }
  for (let i = 0; i < 9; i++) {
    box(group, 'rack-floor-slat', [0.013, 0.012, 0.27],
      [-0.28 + i * 0.07, 0.10, 0], chrome);
  }
  for (const x of [-0.30, 0.30]) {
    const side = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, 0.02, -0.14),
      new THREE.Vector3(x, 0.30, -0.17),
      new THREE.Vector3(x, 0.46, -0.11),
      new THREE.Vector3(x, 0.46, 0.11),
      new THREE.Vector3(x, 0.30, 0.17),
      new THREE.Vector3(x, 0.02, 0.14)
    ]), 24, 0.011, 8, false), chrome);
    side.name = 'arched-stainless-side-frame';
    group.add(side);
    for (const z of [-0.14, 0.14]) {
      box(group, 'rack-foot', [0.025, 0.025, 0.025], [x, 0.0125, z], chrome);
    }
  }
  for (const x of [-0.15, 0.15]) {
    const thermos = new THREE.Group();
    thermos.name = 'burgundy-thermos';
    thermos.position.x = x;
    cylinder(thermos, 'metallic-red-flask-body', 0.102, 0.105, 0.29,
      [0, 0.255, 0], thermosRed, 24);
    cylinder(thermos, 'tapered-flask-shoulder', 0.060, 0.102, 0.075,
      [0, 0.438, 0], thermosRed, 24);
    cylinder(thermos, 'chrome-flask-neck', 0.058, 0.060, 0.026,
      [0, 0.485, 0], chrome, 24);
    cylinder(thermos, 'white-flask-stopper', 0.039, 0.040, 0.032,
      [0, 0.51, 0], white, 20);
    box(thermos, 'black-flask-side-handle', [0.025, 0.15, 0.027],
      [0.11, 0.285, 0.015], black);
    for (const y of [0.22, 0.35]) {
      box(thermos, 'flask-handle-joint', [0.045, 0.018, 0.018],
        [0.098, y, 0.015], black);
    }
    group.add(thermos);
  }
  return group;
}

function southWallWireRack(parent, layout) {
  const group = new THREE.Group();
  group.name = 'shower-south-wall-wire-rack';
  const wallX = layout.southFaceX;
  const centerZ = layout.southRackZ;
  for (const z of [centerZ - 0.23, centerZ + 0.23]) {
    box(group, 'wall-mounted-rack-upright', [0.015, 0.62, 0.015],
      [wallX - 0.015, 1.26, z], black);
  }
  for (const y of [1.045, 1.245]) {
    box(group, 'narrow-solid-tray', [0.125, 0.016, 0.46],
      [wallX - 0.0625, y, centerZ], black);
    box(group, 'narrow-tray-front-lip', [0.014, 0.045, 0.46],
      [wallX - 0.124, y + 0.02, centerZ], black);
    for (const z of [centerZ - 0.225, centerZ + 0.225]) {
      box(group, 'narrow-tray-side-lip', [0.125, 0.045, 0.012],
        [wallX - 0.0625, y + 0.02, z], black);
    }
  }
  const topY = 1.43;
  for (const x of [wallX - 0.008, wallX - 0.207]) {
    box(group, 'top-wire-tier-rail', [0.012, 0.012, 0.46], [x, topY, centerZ], black);
  }
  for (let i = 0; i < 8; i++) {
    box(group, 'top-wire-tier-crossbar', [0.215, 0.008, 0.008],
      [wallX - 0.1075, topY, centerZ - 0.21 + i * 0.06], black);
  }
  box(group, 'top-basket-front-guard', [0.012, 0.012, 0.46],
    [wallX - 0.207, 1.56, centerZ], black);
  for (const z of [centerZ - 0.23, centerZ + 0.23]) {
    box(group, 'top-basket-side-guard', [0.012, 0.13, 0.012],
      [wallX - 0.207, 1.495, z], black);
  }
  for (const z of [centerZ - 0.15, centerZ, centerZ + 0.15]) {
    box(group, 'rack-hanging-hook', [0.008, 0.055, 0.008],
      [wallX - 0.12, 0.99, z], black);
  }
  box(group, 'shower-rack-bottle', [0.055, 0.14, 0.05],
    [wallX - 0.07, 1.322, centerZ - 0.11], bottleBlue);
  box(group, 'shower-rack-bottle', [0.055, 0.10, 0.05],
    [wallX - 0.11, 1.488, centerZ + 0.12], white);
  parent.add(group);
}

function cornerShelf(parent, layout) {
  const group = new THREE.Group();
  group.name = 'shower-southeast-three-tier-corner-shelf';
  const radius = 0.42;
  const cornerX = layout.southFaceX - 0.01;
  const cornerZ = layout.eastFaceZ + 0.01;
  for (const y of [1.00, 1.39, 1.78]) {
    box(group, 'corner-tier-south-wall-rail', [radius, 0.012, 0.012],
      [cornerX - radius / 2, y, cornerZ], black);
    box(group, 'corner-tier-east-wall-rail', [0.012, 0.012, radius],
      [cornerX, y, cornerZ + radius / 2], black);
    const arc = [];
    for (let i = 0; i <= 12; i++) {
      const angle = Math.PI + i * Math.PI / 24;
      arc.push(new THREE.Vector3(cornerX + radius * Math.cos(angle), y,
        cornerZ - radius * Math.sin(angle)));
    }
    const guard = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(arc), 16, 0.006, 6, false), black);
    guard.name = 'rounded-wire-corner-tier';
    group.add(guard);
    for (let i = 1; i < 9; i++) {
      const angle = Math.PI + i * Math.PI / 18;
      const endpoint = new THREE.Vector3(cornerX + radius * Math.cos(angle), y,
        cornerZ - radius * Math.sin(angle));
      const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(
        new THREE.Vector3(cornerX - 0.025, y, cornerZ + 0.025), endpoint), 2, 0.004, 5, false), black);
      wire.name = 'corner-tier-radial-wire';
      group.add(wire);
    }
  }
  for (const [x, z] of [
    [cornerX - 0.012, cornerZ + 0.012],
    [cornerX - radius + 0.012, cornerZ + 0.012],
    [cornerX - 0.012, cornerZ + radius - 0.012]
  ]) {
    box(group, 'wall-mounted-corner-rack-upright', [0.014, 0.83, 0.014],
      [x, 1.415, z], black);
  }
  parent.add(group);
}

function showerWaterHeater(parent, layout) {
  const group = new THREE.Group();
  group.name = 'shower-east-wall-40l-water-heater';
  group.position.set(layout.heaterX, 1.75, layout.eastFaceZ + 0.185);
  const tank = cylinder(group, 'compact-40l-horizontal-tank', 0.17, 0.17, 0.62, [0, 0, 0], white, 32);
  tank.rotation.z = Math.PI / 2;
  for (const x of [-0.295, 0.295]) {
    const cap = cylinder(group, 'heater-end-cap', 0.165, 0.165, 0.025, [x, 0, 0], chrome, 32);
    cap.rotation.z = Math.PI / 2;
  }
  for (const x of [-0.19, 0.19]) {
    box(group, 'heater-wall-bracket', [0.06, 0.075, 0.10], [x, -0.03, -0.16], chrome);
    const pipe = cylinder(group, 'heater-water-pipe', 0.009, 0.009, 0.37,
      [x, -0.35, 0.025], chrome, 10);
    pipe.position.y = -0.35;
  }
  box(group, 'heater-temperature-panel', [0.09, 0.045, 0.012], [0, -0.025, 0.171], chrome);
  parent.add(group);
}

function handheldShower(parent, layout) {
  const group = new THREE.Group();
  group.name = 'shower-east-wall-handheld-shower';
  const wallZ = layout.eastFaceZ;
  const headX = layout.heaterX - 0.40;
  const mixerX = layout.heaterX - 0.11;
  box(group, 'shower-head-wall-bracket', [0.07, 0.055, 0.045],
    [headX, 1.47, wallZ + 0.022], chrome);
  const handle = cylinder(group, 'handheld-shower-grip', 0.019, 0.015, 0.20,
    [headX, 1.50, wallZ + 0.095], white, 14);
  handle.rotation.z = -0.20;
  const sprayHead = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), chrome);
  sprayHead.name = 'handheld-shower-head';
  sprayHead.scale.set(0.044, 0.053, 0.026);
  sprayHead.position.set(headX - 0.02, 1.615, wallZ + 0.12);
  group.add(sprayHead);
  const sprayFace = new THREE.Mesh(new THREE.CircleGeometry(0.031, 20), black);
  sprayFace.name = 'shower-spray-face';
  sprayFace.position.set(headX - 0.02, 1.615, wallZ + 0.147);
  group.add(sprayFace);
  box(group, 'wall-shower-mixer', [0.26, 0.07, 0.055],
    [mixerX, 1.18, wallZ + 0.035], chrome);
  for (const x of [mixerX - 0.095, mixerX + 0.095]) {
    const knob = cylinder(group, 'mixer-round-knob', 0.025, 0.025, 0.02,
      [x, 1.18, wallZ + 0.075], chrome, 16);
    knob.rotation.x = Math.PI / 2;
  }
  const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(headX + 0.025, 1.40, wallZ + 0.13),
    new THREE.Vector3(headX + 0.045, 1.13, wallZ + 0.18),
    new THREE.Vector3(headX + 0.15, 0.87, wallZ + 0.19),
    new THREE.Vector3(mixerX + 0.11, 1.03, wallZ + 0.14),
    new THREE.Vector3(mixerX + 0.11, 1.145, wallZ + 0.085)
  ]), 28, 0.008, 8, false), chrome);
  hose.name = 'flexible-shower-hose';
  group.add(hose);
  parent.add(group);
}

function connectHeaterToShower(parent, layout) {
  const group = new THREE.Group();
  group.name = 'heater-pipes-connected-to-shower-mixer';
  const wallZ = layout.eastFaceZ;
  const mixerX = layout.heaterX - 0.11;
  for (const [outletX, inletX, name] of [
    [layout.heaterX - 0.19, mixerX - 0.095, 'hot-water-to-shower'],
    [layout.heaterX + 0.19, mixerX + 0.095, 'cold-water-to-shower']
  ]) {
    const pipe = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(outletX, 1.215, wallZ + 0.21),
      new THREE.Vector3(outletX, 1.105, wallZ + 0.09),
      new THREE.Vector3(inletX, 1.105, wallZ + 0.09),
      new THREE.Vector3(inletX, 1.18, wallZ + 0.075)
    ]), 20, 0.010, 8, false), white);
    pipe.name = name;
    group.add(pipe);
  }
  parent.add(group);
}

function showerElectricRadiator(parent, layout) {
  const group = new THREE.Group();
  group.name = 'shower-east-wall-electric-radiator';
  group.position.set(layout.radiatorX, 0, layout.eastFaceZ + 0.055);
  const enamel = new THREE.MeshStandardMaterial({ color: 0xe9eae5, roughness: 0.78 });
  const rib = new THREE.MeshStandardMaterial({ color: 0xd4d8d4, roughness: 0.84 });
  const bodyWidth = 1.04;
  const bodyHeight = 0.54;
  const centerY = 0.77;
  box(group, 'electric-radiator-panel', [bodyWidth, bodyHeight, 0.065], [0, centerY, 0], enamel);
  for (let i = 0; i < 37; i++) {
    const x = -0.486 + i * 0.027;
    box(group, 'radiator-vertical-rib', [0.010, 0.47, 0.007],
      [x, centerY, 0.036], rib);
  }
  for (const edge of [-1, 1]) {
    box(group, 'radiator-side-cap', [0.018, bodyHeight, 0.072],
      [edge * (bodyWidth - 0.018) / 2, centerY, 0], enamel);
    box(group, 'radiator-wall-bracket', [0.035, 0.08, 0.035],
      [edge * 0.40, 0.79, -0.045], chrome);
  }
  box(group, 'radiator-top-edge', [bodyWidth, 0.014, 0.072], [0, 1.033, 0], enamel);
  box(group, 'radiator-bottom-edge', [bodyWidth, 0.014, 0.072], [0, 0.507, 0], enamel);
  box(group, 'radiator-control-label', [0.075, 0.065, 0.006], [0.405, 0.67, 0.041], black);
  parent.add(group);
}

export function createShowerRoomDetails(layout) {
  const group = new THREE.Group();
  group.name = 'shower-room-fittings';
  southWallWireRack(group, layout);
  cornerShelf(group, layout);
  showerWaterHeater(group, layout);
  handheldShower(group, layout);
  connectHeaterToShower(group, layout);
  showerElectricRadiator(group, layout);
  return group;
}

export function createShowerCeilingHeater(layout) {
  const group = new THREE.Group();
  group.name = 'shower-four-lamp-ceiling-heater';
  group.position.set(layout.ceilingX, 2.075, layout.ceilingZ);
  box(group, 'bath-heater-housing', [0.43, 0.065, 0.43], [0, 0.015, 0], chrome);
  box(group, 'bath-heater-faceplate', [0.40, 0.012, 0.40], [0, -0.022, 0], white);
  const fan = cylinder(group, 'bath-heater-central-vent', 0.075, 0.075, 0.012, [0, -0.032, 0], black, 24);
  for (const x of [-0.125, 0.125]) {
    for (const z of [-0.125, 0.125]) {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 12), bulb);
      lamp.name = 'bath-heater-bulb';
      lamp.position.set(x, -0.045, z);
      group.add(lamp);
    }
  }
  group.add(new THREE.PointLight(0xffefd8, 0.34, 2.5, 2));
  return group;
}
