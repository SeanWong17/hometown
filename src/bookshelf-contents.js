import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function createBookshelfContents() {
  const group = new THREE.Group();
  group.name = 'bookshelf-contents';
  const matte = color => new THREE.MeshStandardMaterial({ color, roughness: 0.88 });
  const darkWood = matte(0x493326);
  const ivory = matte(0xe8e4d9);
  const stone = matte(0x858989);
  const blue = matte(0x317da3);
  const navy = matte(0x263d60);
  const red = matte(0x9b3532);
  const green = matte(0x567b5e);
  const brass = new THREE.MeshStandardMaterial({ color: 0xb09662, metalness: 0.5, roughness: 0.5 });
  const glass = new THREE.MeshStandardMaterial({ color: 0xdce9e8, transparent: true, opacity: 0.14, roughness: 0.08, side: THREE.DoubleSide, depthWrite: false });
  const bookColors = [0x454a4b, 0x9c775a, 0x335563, 0xa8a193, 0x9c4d48, 0x555e69, 0x7d765f].map(matte);
  const add = (name, geometry, px, py, pz, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(px, py, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };
  const box = (name, width, height, depth, px, py, pz, material) =>
    add(name, new THREE.BoxGeometry(width, height, depth), px, py, pz, material);
  const dome = (name, px, baseY, pz, radius, height) => {
    add(`${name}-base`, new THREE.CylinderGeometry(radius, radius, 0.014, 16), px, baseY + 0.007, pz, darkWood);
    const cover = add(name, new THREE.SphereGeometry(radius, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), px, baseY + 0.014, pz, glass);
    cover.scale.y = height / radius;
    cover.castShadow = false;
  };

  for (const [startX, shelfY, count] of [[-0.065, 1.42, 7], [0.105, 1.10, 9], [-0.36, 0.78, 6]]) {
    let bookX = startX;
    for (let index = 0; index < count; index++) {
      const width = 0.020 + (index % 3) * 0.004;
      const height = 0.18 + (index % 4) * 0.018;
      box('book', width, height, 0.16, bookX + width / 2, shelfY + 0.015 + height / 2, -0.045, bookColors[index % bookColors.length]);
      bookX += width + 0.003;
    }
  }

  box('butterfly-frame', 0.16, 0.22, 0.026, 0.275, 1.565, -0.025, darkWood);
  box('butterfly-frame-inset', 0.13, 0.185, 0.003, 0.275, 1.565, -0.040, matte(0xbeb09a));
  for (const side of [-1, 1]) {
    const upperWing = add('framed-butterfly-wing', new THREE.SphereGeometry(1, 10, 8), 0.275 + side * 0.028, 1.585, -0.046, blue);
    upperWing.scale.set(0.025, 0.038, 0.003);
    const lowerWing = add('framed-butterfly-wing', new THREE.SphereGeometry(1, 10, 8), 0.275 + side * 0.022, 1.54, -0.046, navy);
    lowerWing.scale.set(0.018, 0.027, 0.003);
  }
  box('framed-butterfly-body', 0.005, 0.073, 0.005, 0.275, 1.565, -0.05, darkWood);

  dome('butterfly-dome', -0.245, 1.255, 0.015, 0.10, 0.23);
  for (const side of [-1, 1]) {
    const wing = add('display-butterfly-wing', new THREE.SphereGeometry(1, 10, 8), -0.245 + side * 0.033, 1.365, -0.025, side < 0 ? navy : blue);
    wing.scale.set(0.029, 0.045, 0.004);
  }
  box('display-butterfly-body', 0.005, 0.08, 0.005, -0.245, 1.365, -0.03, darkWood);

  box('ship-plinth', 0.155, 0.025, 0.11, -0.016, 1.13, -0.035, stone);
  box('ship-hull', 0.10, 0.018, 0.04, -0.016, 1.157, -0.065, ivory);
  for (const mastX of [-0.04, 0.02]) {
    box('ship-mast', 0.004, 0.125, 0.004, mastX, 1.225, -0.065, ivory);
    add('ship-sail', new THREE.ConeGeometry(0.025, 0.095, 3), mastX + 0.016, 1.225, -0.065, ivory);
  }
  for (const towerX of [-0.065, 0.055]) box('ship-backdrop', 0.018, 0.09, 0.02, towerX, 1.185, 0.015, stone);

  for (const [name, px, height] of [['flower-dome-large', -0.31, 0.19], ['flower-dome-small', -0.18, 0.15]]) {
    dome(name, px, 0.80, 0.015, 0.055, height);
    box('dried-flower-stem', 0.004, height * 0.56, 0.004, px, 0.815 + height * 0.28, 0.015, green);
    for (const side of [-1, 1]) {
      const bloom = add('dried-flower', new THREE.SphereGeometry(1, 8, 6), px + side * 0.018, 0.825 + height * 0.55, 0.013, matte(side < 0 ? 0xc6a693 : 0xb0a876));
      bloom.scale.set(0.014, 0.022, 0.012);
    }
  }

  box('ornamental-lamp-base', 0.075, 0.01, 0.075, 0.31, 0.80, -0.035, green);
  box('ornamental-lamp-stem', 0.008, 0.13, 0.008, 0.31, 0.87, -0.035, stone);
  add('ornamental-lamp-shade', new THREE.SphereGeometry(0.032, 12, 8), 0.31, 0.955, -0.035, ivory);
  const coneColors = [0xb84343, 0xe29d44, 0xc7bd42, 0x51a976, 0xc74853, 0xd6a942].map(matte);
  for (let index = 0; index < 6; index++) {
    const bottomRadius = 0.033 * (1 - index / 6);
    const topRadius = 0.033 * (1 - (index + 1) / 6);
    add('striped-cone', new THREE.CylinderGeometry(topRadius, bottomRadius, 0.038, 4), 0.15, 0.814 + index * 0.038, -0.04, coneColors[index]);
  }
  box('mini-drawer-chest', 0.15, 0.15, 0.085, -0.012, 0.87, -0.065, ivory);
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 3; column++) {
      box('mini-drawer', 0.041, 0.039, 0.003, -0.062 + column * 0.05, 0.827 + row * 0.045, -0.109, row === column ? blue : stone);
    }
  }
  for (const [px, material] of [[-0.06, ivory], [0.026, darkWood]]) {
    add('small-figurine', new THREE.SphereGeometry(0.025, 10, 8), px, 0.976, -0.065, material);
    add('small-figurine-head', new THREE.SphereGeometry(0.013, 8, 6), px, 1.006, -0.065, material);
  }

  box('storage-tray', 0.19, 0.055, 0.17, 0.275, 0.493, -0.025, ivory);
  box('storage-box', 0.10, 0.11, 0.095, 0.30, 0.575, 0.025, matte(0xc3c0b7));
  add('soft-bag', new RoundedBoxGeometry(0.08, 0.18, 0.12, 3, 0.025), 0.198, 0.57, -0.015, navy);
  box('red-keepsake-box', 0.14, 0.075, 0.12, 0.015, 0.503, -0.025, red);
  add('small-globe', new THREE.SphereGeometry(0.035, 12, 8), -0.06, 0.545, -0.075, glass);
  add('folded-bag', new RoundedBoxGeometry(0.09, 0.15, 0.10, 3, 0.025), 0.015, 0.655, 0.025, matte(0xb4b9b5));

  add('bottom-storage-bag', new RoundedBoxGeometry(0.11, 0.20, 0.13, 3, 0.025), -0.31, 0.215, 0.02, ivory);
  add('metal-canister', new THREE.CylinderGeometry(0.038, 0.038, 0.15, 12), -0.20, 0.19, -0.01, stone);
  add('canister-lid', new THREE.CylinderGeometry(0.042, 0.042, 0.014, 12), -0.20, 0.272, -0.01, brass);
  box('stored-print', 0.015, 0.22, 0.15, -0.14, 0.21, 0.075, ivory);

  const castleWood = matte(0xb99a69);
  box('castle-base', 0.32, 0.018, 0.14, 0.15, 1.759, 0.005, castleWood);
  box('castle-main', 0.20, 0.15, 0.105, 0.15, 1.843, 0.005, castleWood);
  for (const towerX of [0.045, 0.15, 0.255]) {
    const towerHeight = towerX === 0.15 ? 0.28 : 0.20;
    add('castle-tower', new THREE.CylinderGeometry(0.025, 0.027, towerHeight, 6), towerX, 1.77 + towerHeight / 2, -0.045, castleWood);
    add('castle-roof', new THREE.ConeGeometry(0.034, 0.055, 6), towerX, 1.77 + towerHeight + 0.025, -0.045, castleWood);
    box('castle-window', 0.012, 0.032, 0.003, towerX, 1.83, -0.074, darkWood);
  }
  box('display-case', 0.23, 0.035, 0.16, -0.245, 1.7675, 0.005, matte(0xbec5c2));
  add('top-display-base', new THREE.CylinderGeometry(0.06, 0.06, 0.013, 16), -0.245, 1.793, 0.005, darkWood);
  const topGlobe = add('top-display-globe', new THREE.SphereGeometry(0.06, 16, 10), -0.245, 1.856, 0.005, glass);
  topGlobe.castShadow = false;
  for (const side of [-1, 1]) {
    const wing = add('top-display-butterfly', new THREE.SphereGeometry(1, 10, 8), -0.245 + side * 0.018, 1.852, -0.015, blue);
    wing.scale.set(0.016, 0.024, 0.003);
  }
  return group;
}
