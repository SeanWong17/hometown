import * as THREE from 'three';

const blackMetal = new THREE.MeshStandardMaterial({ color: 0x30363a, metalness: 0.38, roughness: 0.65 });
const darkGlass = new THREE.MeshStandardMaterial({ color: 0x64777b, metalness: 0.08, roughness: 0.12, transparent: true, opacity: 0.48, depthWrite: false, side: THREE.DoubleSide });
const brushedSteel = new THREE.MeshStandardMaterial({ color: 0xb9c0bd, metalness: 0.36, roughness: 0.43 });
const cabinetSteel = new THREE.MeshStandardMaterial({ color: 0x929c99, metalness: 0.27, roughness: 0.59 });
const charcoal = new THREE.MeshStandardMaterial({ color: 0x35383b, metalness: 0.12, roughness: 0.6 });
const hoodBlack = new THREE.MeshStandardMaterial({ color: 0x252a2d, metalness: 0.12, roughness: 0.40 });
const stoveIron = new THREE.MeshStandardMaterial({ color: 0x554f48, metalness: 0.43, roughness: 0.74 });
const kettleMetal = new THREE.MeshStandardMaterial({ color: 0xaeb6b4, metalness: 0.49, roughness: 0.38 });

function box(parent, name, size, position, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(parent, name, radiusTop, radiusBottom, height, position, material, sides = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, sides), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}

function capsuleShelf(parent, name, length, width, height, material) {
  const radius = width / 2;
  const straightHalf = (length - width) / 2;
  const outline = new THREE.Shape();
  outline.moveTo(-straightHalf, -radius);
  outline.lineTo(straightHalf, -radius);
  outline.absarc(straightHalf, 0, radius, -Math.PI / 2, Math.PI / 2, false);
  outline.lineTo(-straightHalf, radius);
  outline.absarc(-straightHalf, 0, radius, Math.PI / 2, Math.PI * 1.5, false);
  const top = new THREE.Mesh(new THREE.ExtrudeGeometry(outline, { depth: 0.018, bevelEnabled: false, curveSegments: 20 }), material);
  top.name = name;
  top.rotation.x = -Math.PI / 2;
  top.position.y = height;
  top.castShadow = true;
  top.receiveShadow = true;
  parent.add(top);
  const points = outline.getPoints(64).map(point => new THREE.Vector3(point.x, height + 0.012, -point.y));
  const trim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, true), 96, 0.009, 5, true), blackMetal);
  trim.name = `${name}-rounded-edge`;
  parent.add(trim);
}

function westDiningTable(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-west-two-tier-table';
  group.position.set(position.x, 0, position.z);
  capsuleShelf(group, 'upper-glass-top', 1.30, 0.80, 0.74, darkGlass);
  capsuleShelf(group, 'inset-lower-shelf', 1.18, 0.68, 0.63, darkGlass);
  for (const x of [-0.43, 0.43]) {
    for (const z of [-0.27, 0.27]) {
      box(group, 'table-leg', [0.032, 0.72, 0.032], [x, 0.36, z], blackMetal);
    }
  }
  for (const x of [-0.43, 0.43]) {
    box(group, 'lower-crossbar', [0.025, 0.025, 0.54], [x, 0.13, 0], blackMetal);
  }

  const microwave = new THREE.Group();
  microwave.name = 'kitchen-table-microwave';
  microwave.position.set(0.25, 0.75, -0.045);
  box(microwave, 'microwave-body', [0.44, 0.255, 0.33], [0, 0.128, 0], brushedSteel);
  box(microwave, 'microwave-front', [0.405, 0.215, 0.008], [0, 0.128, -0.17], charcoal);
  box(microwave, 'microwave-window', [0.32, 0.16, 0.008], [-0.03, 0.135, -0.176], darkGlass);
  box(microwave, 'microwave-controls', [0.055, 0.18, 0.01], [0.17, 0.13, -0.178], blackMetal);
  group.add(microwave);

  const cooker = new THREE.Group();
  cooker.name = 'kitchen-table-pressure-cooker';
  cooker.position.set(-0.34, 0.75, -0.055);
  cylinder(cooker, 'pressure-cooker-pot', 0.13, 0.12, 0.18, [0, 0.09, 0], kettleMetal);
  cylinder(cooker, 'pressure-cooker-lid', 0.145, 0.14, 0.018, [0, 0.19, 0], brushedSteel);
  cylinder(cooker, 'pressure-valve', 0.017, 0.017, 0.035, [0, 0.218, 0], blackMetal, 12);
  for (const side of [-1, 1]) {
    box(cooker, 'pressure-cooker-handle', [0.06, 0.025, 0.045], [side * 0.16, 0.145, 0], blackMetal);
  }
  group.add(cooker);
  return group;
}

function gasHob(position, hoodPosition) {
  const group = new THREE.Group();
  group.name = 'kitchen-north-gas-hob-and-hood';
  group.position.set(position.x, 0, position.z);
  const halfDepth = position.width / 2;
  const halfLength = position.depth / 2;
  for (const x of [-halfDepth + 0.02, halfDepth - 0.02]) {
    for (const z of [-halfLength + 0.025, halfLength - 0.025]) {
      box(group, 'hob-stand-leg', [0.025, 0.67, 0.025], [x, 0.335, z], brushedSteel);
    }
  }
  box(group, 'hob-stand-shelf', [0.38, 0.018, 0.68], [0, 0.25, 0], brushedSteel);
  box(group, 'gas-hob', [0.40, 0.045, 0.70], [0, 0.695, 0], brushedSteel);
  for (const z of [-0.19, 0.19]) {
    cylinder(group, 'burner-ring', 0.105, 0.105, 0.015, [-0.015, 0.727, z], blackMetal);
    cylinder(group, 'burner-center', 0.055, 0.055, 0.018, [-0.015, 0.741, z], charcoal);
    for (const angle of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
      box(group, 'pot-support', [0.075, 0.014, 0.014], [-0.015 + Math.cos(angle) * 0.074, 0.752, z + Math.sin(angle) * 0.074], blackMetal);
    }
    cylinder(group, 'front-control-knob', 0.018, 0.018, 0.025, [0.162, 0.708, z], blackMetal, 12).rotation.z = Math.PI / 2;
  }

  const hood = new THREE.Group();
  hood.name = 'kitchen-range-hood';
  hood.position.set(hoodPosition.x - position.x, 0, hoodPosition.z - position.z);
  const profile = new THREE.Shape();
  // North wall is at -X. The intake slopes inward toward the wall at its base.
  profile.moveTo(-0.20, 1.10);
  profile.lineTo(0.015, 1.10);
  profile.lineTo(0.20, 1.62);
  profile.lineTo(-0.20, 1.62);
  profile.closePath();
  const shell = new THREE.Mesh(new THREE.ExtrudeGeometry(profile, { depth: 0.90, bevelEnabled: false }), hoodBlack);
  shell.name = 'angled-hood-body';
  shell.position.z = -0.45;
  shell.castShadow = true;
  hood.add(shell);
  const intakeFace = new THREE.Mesh(new THREE.BufferGeometry(), darkGlass);
  intakeFace.name = 'sloped-side-suction-glass';
  intakeFace.geometry.setAttribute('position', new THREE.Float32BufferAttribute([
    0.018, 1.115, -0.415, 0.018, 1.115, 0.415, 0.194, 1.603, -0.415,
    0.018, 1.115, 0.415, 0.194, 1.603, 0.415, 0.194, 1.603, -0.415
  ], 3));
  intakeFace.geometry.computeVertexNormals();
  hood.add(intakeFace);
  box(hood, 'hood-lower-intake-lip', [0.045, 0.025, 0.90], [0.015, 1.115, 0], blackMetal);
  const ductX = -0.09;
  // The north-wall high window starts at 2.12 m. Keep the full duct below its sill.
  const ductY = 1.93;
  const westWallZ = position.westWallZ - hoodPosition.z;
  const ductPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(ductX, 1.61, 0),
    new THREE.Vector3(ductX, 1.80, 0),
    new THREE.Vector3(ductX, ductY, 0.12),
    new THREE.Vector3(ductX, ductY, westWallZ)
  ]);
  const duct = new THREE.Mesh(new THREE.TubeGeometry(ductPath, 32, 0.087, 12, false), brushedSteel);
  duct.name = 'range-hood-duct-to-west-wall';
  duct.castShadow = true;
  hood.add(duct);
  for (let step = 1; step < 23; step++) {
    const t = step / 23;
    const point = ductPath.getPointAt(t);
    const tangent = ductPath.getTangentAt(t);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.089, 0.004, 5, 16), cabinetSteel);
    band.name = 'flex-duct-rib';
    band.position.copy(point);
    band.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    hood.add(band);
  }
  group.add(hood);
  return group;
}

function eastCabinet(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-north-stainless-cabinet';
  group.position.set(position.x, 0, position.z);
  box(group, 'cabinet-body', [0.45, 0.75, 0.80], [0, 0.375, 0], cabinetSteel);
  box(group, 'cabinet-counter', [0.45, 0.025, 0.80], [0, 0.7575, 0], brushedSteel);
  const frontX = 0.225 + 0.01;
  for (const side of [-1, 1]) {
    box(group, 'cabinet-door', [0.015, 0.65, 0.388], [frontX, 0.39, side * 0.198], brushedSteel);
    box(group, 'cabinet-door-panel', [0.005, 0.56, 0.32], [frontX + 0.012, 0.39, side * 0.198], cabinetSteel);
    box(group, 'cabinet-handle', [0.035, 0.016, 0.065], [frontX + 0.041, 0.65, side * 0.045], blackMetal);
  }
  return group;
}

function cornerFurnace(position) {
  const group = new THREE.Group();
  group.name = 'kitchen-northeast-solid-fuel-stove';
  group.position.set(position.x, 0, position.z);
  box(group, 'iron-firebox', [0.40, 0.80, 0.46], [0, 0.42, 0], stoveIron);
  box(group, 'stove-top', [0.43, 0.035, 0.49], [0, 0.835, 0], blackMetal);
  // West is +Z in the unrotated house coordinates.
  box(group, 'west-facing-firebox-door', [0.31, 0.39, 0.009], [0, 0.43, 0.235], blackMetal);
  box(group, 'west-facing-firebox-handle', [0.065, 0.025, 0.025], [0.095, 0.45, 0.258], brushedSteel);
  box(group, 'west-facing-ash-drawer', [0.31, 0.12, 0.01], [0, 0.14, 0.235], charcoal);
  for (const z of [-0.165, 0.165]) {
    box(group, 'stove-foot', [0.07, 0.04, 0.07], [0, 0.02, z], stoveIron);
  }
  cylinder(group, 'stove-flue', 0.075, 0.075, 3.10, [-0.09, 2.405, 0.08], brushedSteel, 18);
  for (let y = 0.96; y < 3.94; y += 0.27) {
    cylinder(group, 'flue-joint', 0.078, 0.078, 0.018, [-0.09, y, 0.08], cabinetSteel, 18);
  }
  cylinder(group, 'stove-top-kettle', 0.105, 0.08, 0.14, [0.06, 0.93, -0.035], kettleMetal);
  cylinder(group, 'kettle-lid', 0.105, 0.105, 0.012, [0.06, 1.01, -0.035], brushedSteel);
  return group;
}

export function createKitchenNorthWestFurniture(placements) {
  const group = new THREE.Group();
  group.name = 'kitchen-north-and-west-furniture';
  group.add(westDiningTable(placements.table));
  group.add(gasHob(placements.hob, placements.hood));
  group.add(eastCabinet(placements.cabinet));
  group.add(cornerFurnace(placements.furnace));
  return group;
}
