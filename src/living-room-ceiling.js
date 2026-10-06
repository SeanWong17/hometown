import * as THREE from 'three';

function ceilingPattern() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f0f1ee';
  ctx.fillRect(0, 0, 128, 128);
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(145,153,149,0.05)';
      ctx.fillRect(col * 16, row * 16, 16, 16);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function roundedSquareGeometry(size, radius, depth) {
  const edge = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-edge + radius, -edge);
  shape.lineTo(edge - radius, -edge);
  shape.quadraticCurveTo(edge, -edge, edge, -edge + radius);
  shape.lineTo(edge, edge - radius);
  shape.quadraticCurveTo(edge, edge, edge - radius, edge);
  shape.lineTo(-edge + radius, edge);
  shape.quadraticCurveTo(-edge, edge, -edge, edge - radius);
  shape.lineTo(-edge, -edge + radius);
  shape.quadraticCurveTo(-edge, -edge, -edge + radius, -edge);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

function addSquareLight(parent, x, z, finish, name) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(x, finish, z);
  const rim = new THREE.MeshStandardMaterial({ color: 0xd7dbd9, metalness: 0.12, roughness: 0.66 });
  const diffuser = new THREE.MeshStandardMaterial({ color: 0xf5f5f1, emissive: 0xffffff, emissiveIntensity: 0.22, roughness: 0.78 });
  const base = new THREE.Mesh(roundedSquareGeometry(0.52, 0.10, 0.025), rim);
  base.name = 'square-light-rim';
  base.position.y = -0.015;
  group.add(base);
  const face = new THREE.Mesh(roundedSquareGeometry(0.47, 0.09, 0.035), diffuser);
  face.name = 'square-light-diffuser';
  face.position.y = -0.033;
  group.add(face);
  const bulb = new THREE.PointLight(0xfff4e9, 0.45, 4.5, 2);
  bulb.position.y = -0.12;
  group.add(bulb);
  parent.add(group);
}

function addCeilingFan(parent, x, z, finish) {
  const group = new THREE.Group();
  group.name = 'living-room-five-blade-fan';
  group.position.set(x, finish, z);
  const metal = new THREE.MeshStandardMaterial({ color: 0x777a74, metalness: 0.55, roughness: 0.4 });
  const pale = new THREE.MeshStandardMaterial({ color: 0xd7d6ca, roughness: 0.67 });
  const wood = new THREE.MeshStandardMaterial({ color: 0xb98559, roughness: 0.68, side: THREE.DoubleSide });
  const addCylinder = (name, radiusTop, radiusBottom, height, y, material) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 24), material);
    mesh.name = name;
    mesh.position.y = y;
    mesh.castShadow = true;
    group.add(mesh);
  };
  addCylinder('fan-ceiling-canopy', 0.09, 0.075, 0.045, -0.035, metal);
  addCylinder('fan-downrod', 0.018, 0.018, 0.31, -0.21, pale);
  for (const y of [-0.12, -0.19, -0.26]) addCylinder('fan-downrod-ring', 0.026, 0.026, 0.018, y, metal);
  addCylinder('fan-motor', 0.105, 0.09, 0.14, -0.42, metal);
  addCylinder('fan-lower-cap', 0.075, 0.055, 0.055, -0.51, metal);
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0.10, -0.045);
  bladeShape.lineTo(0.34, -0.09);
  bladeShape.quadraticCurveTo(0.59, -0.115, 0.75, -0.07);
  bladeShape.quadraticCurveTo(0.80, 0.015, 0.73, 0.092);
  bladeShape.quadraticCurveTo(0.54, 0.13, 0.30, 0.085);
  bladeShape.lineTo(0.10, 0.045);
  bladeShape.closePath();
  const bladeGeometry = new THREE.ExtrudeGeometry(bladeShape, { depth: 0.012, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.005, bevelSegments: 2 });
  for (let index = 0; index < 5; index++) {
    const pivot = new THREE.Group();
    pivot.name = 'fan-blade-pivot';
    pivot.position.y = -0.405;
    pivot.rotation.y = index * Math.PI * 2 / 5;
    const blade = new THREE.Mesh(bladeGeometry, wood);
    blade.name = 'wood-fan-blade';
    blade.rotation.x = Math.PI / 2;
    blade.castShadow = true;
    pivot.add(blade);
    group.add(pivot);
  }
  parent.add(group);
}

export function createLivingRoomCeilingDetails(room, finish) {
  const group = new THREE.Group();
  group.name = 'living-room-ceiling-details';
  const [minX, minZ, maxX, maxZ] = room.zone;
  const inset = 0.05;
  const width = maxX - minX - inset * 2;
  const depth = maxZ - minZ - inset * 2;
  const pattern = ceilingPattern();
  pattern.repeat.set(width / 0.6, depth / 0.6);
  const tile = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: pattern, emissive: 0xffffff, emissiveIntensity: 0.22, roughness: 0.98, side: THREE.DoubleSide }));
  tile.name = 'patterned-ceiling-tiles';
  tile.rotation.x = Math.PI / 2;
  tile.position.set((minX + maxX) / 2, finish - 0.003, (minZ + maxZ) / 2);
  group.add(tile);
  const gridMaterial = new THREE.MeshStandardMaterial({ color: 0x8c9291, metalness: 0.25, roughness: 0.65 });
  for (let x = minX + inset; x <= maxX - inset + 0.001; x += 0.60) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.006, depth), gridMaterial);
    rail.name = 'ceiling-grid-rail';
    rail.position.set(x, finish - 0.008, (minZ + maxZ) / 2);
    group.add(rail);
  }
  for (let z = minZ + inset; z <= maxZ - inset + 0.001; z += 0.60) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(width, 0.006, 0.009), gridMaterial);
    rail.name = 'ceiling-grid-rail';
    rail.position.set((minX + maxX) / 2, finish - 0.008, z);
    group.add(rail);
  }
  const lightWallOffset = 2.5 * 0.60;
  addSquareLight(group, minX + 2.35, maxZ - lightWallOffset, finish, 'living-room-west-square-light');
  addSquareLight(group, minX + 2.35, minZ + lightWallOffset, finish, 'living-room-east-square-light');
  addCeilingFan(group, minX + 4.12, minZ + 1.38, finish);
  return group;
}
