import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createOpenCurtains } from './open-curtains.js';

export function createWestBedroomDetails({ cabinet, cart, radiator, stool, window }) {
  const group = new THREE.Group();
  group.name = 'west-bedroom-details';
  const matte = color => new THREE.MeshStandardMaterial({ color, roughness: 0.82 });
  const walnut = matte(0x513a32);
  const cream = matte(0xece9de);
  const mirrorGlass = new THREE.MeshStandardMaterial({ color: 0x788583, metalness: 0.28, roughness: 0.16, side: THREE.DoubleSide });
  const mirrorFrame = matte(0x404242);
  const steel = new THREE.MeshStandardMaterial({ color: 0x737a77, metalness: 0.62, roughness: 0.36 });
  const add = (parent, name, geometry, position, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (parent, name, size, position, material) => add(parent, name, new THREE.BoxGeometry(...size), position, material);

  const surface = new THREE.Group();
  surface.name = 'vanity-surface-items';
  const deskWest = cabinet.westEdge;
  const deskEast = deskWest - cabinet.deskLength;
  const centerX = cabinet.southEdge - cabinet.depth / 2;

  // The mirror follows the irregular outline in the photo and faces into the room.
  const mirror = new THREE.Group();
  mirror.name = 'vanity-mirror';
  mirror.position.set(centerX, 0.76, deskEast + 0.23);
  mirror.rotation.y = -Math.PI / 2;
  const outline = new THREE.Shape();
  outline.moveTo(-0.12, 0.025);
  outline.bezierCurveTo(-0.18, 0.10, -0.22, 0.19, -0.165, 0.26);
  outline.bezierCurveTo(-0.19, 0.34, -0.14, 0.42, -0.065, 0.435);
  outline.bezierCurveTo(-0.02, 0.505, 0.035, 0.515, 0.09, 0.467);
  outline.bezierCurveTo(0.17, 0.46, 0.195, 0.37, 0.16, 0.305);
  outline.bezierCurveTo(0.22, 0.235, 0.17, 0.15, 0.15, 0.08);
  outline.lineTo(0.12, 0.025);
  outline.lineTo(-0.12, 0.025);
  add(mirror, 'mirror-frame', new THREE.ExtrudeGeometry(outline, { depth: 0.018, bevelEnabled: true, bevelSize: 0.009, bevelThickness: 0.006, bevelSegments: 2 }), [0, 0, 0], mirrorFrame);
  const mirrorFace = new THREE.Mesh(new THREE.ShapeGeometry(outline), mirrorGlass);
  mirrorFace.name = 'mirror-glass';
  mirrorFace.scale.set(0.91, 0.91, 1);
  mirrorFace.position.set(0, 0.021, 0.025);
  mirror.add(mirrorFace);
  box(mirror, 'mirror-lower-band', [0.275, 0.025, 0.008], [0, 0.038, 0.032], mirrorFrame);
  box(mirror, 'mirror-foot', [0.32, 0.018, 0.10], [0, -0.005, 0.02], cream);
  surface.add(mirror);

  const lampZ = deskEast + 0.60;
  const lamp = new THREE.Group();
  lamp.name = 'desk-lamp';
  lamp.position.set(centerX, 0.76, lampZ);
  const lampDark = matte(0x414746);
  const lampFabric = matte(0xb9b8ae);
  const base = add(lamp, 'desk-lamp-ring-base', new THREE.TorusGeometry(0.075, 0.014, 8, 30), [0, 0.025, 0], lampDark);
  base.rotation.x = Math.PI / 2;
  const arm = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.05, 0.015, 0),
    new THREE.Vector3(0.04, 0.15, 0),
    new THREE.Vector3(-0.045, 0.30, 0),
    new THREE.Vector3(-0.085, 0.34, 0)
  ]);
  add(lamp, 'desk-lamp-curved-arm', new THREE.TubeGeometry(arm, 24, 0.012, 8, false), [0, 0, 0], lampDark);
  const shade = new THREE.Group();
  shade.name = 'desk-lamp-shade';
  shade.position.set(-0.10, 0.34, 0);
  shade.rotation.z = -0.56;
  add(shade, 'ribbed-lampshade', new THREE.CylinderGeometry(0.055, 0.095, 0.16, 28, 1, true), [0, 0, 0], lampFabric);
  for (let rib = 0; rib < 20; rib++) {
    const angle = rib / 20 * Math.PI * 2;
    const ridge = add(shade, 'lampshade-rib', new THREE.CylinderGeometry(0.0015, 0.0015, 0.158, 4), [Math.sin(angle) * 0.075, 0, Math.cos(angle) * 0.075], cream);
    ridge.rotation.z = Math.sin(angle) * 0.18;
    ridge.rotation.x = -Math.cos(angle) * 0.18;
  }
  add(shade, 'lamp-diffuser', new THREE.SphereGeometry(0.032, 12, 8), [0, -0.082, 0], cream);
  lamp.add(shade);
  surface.add(lamp);
  const shelf = new THREE.Group();
  shelf.name = 'desktop-bookshelf';
  shelf.position.set(centerX, 0.76, deskWest - 0.24);
  const shelfWidth = 0.42;
  box(shelf, 'desktop-shelf-drawer-body', [0.18, 0.08, shelfWidth], [0.025, 0.04, 0], walnut);
  box(shelf, 'desktop-shelf-drawer', [0.012, 0.064, 0.40], [-0.072, 0.042, 0], matte(0x76533e));
  add(shelf, 'desktop-shelf-pull', new THREE.SphereGeometry(0.013, 12, 8), [-0.081, 0.045, 0], steel);
  for (const side of [-1, 1]) box(shelf, 'desktop-shelf-side', [0.18, 0.31, 0.014], [0.025, 0.235, side * (shelfWidth / 2 - 0.007)], walnut);
  box(shelf, 'desktop-shelf-top', [0.18, 0.018, shelfWidth], [0.025, 0.39, 0], walnut);
  box(shelf, 'desktop-shelf-back', [0.012, 0.30, shelfWidth], [0.119, 0.235, 0], walnut);
  box(shelf, 'desktop-shelf-divider', [0.18, 0.30, 0.012], [0.025, 0.235, -0.028], walnut);
  for (const level of [0.185, 0.285]) box(shelf, 'desktop-shelf-small-board', [0.18, 0.012, 0.17], [0.025, level, -0.115], walnut);
  box(shelf, 'desktop-shelf-stapler', [0.075, 0.022, 0.07], [0.005, 0.30, -0.12], matte(0x438e91));
  box(shelf, 'desktop-shelf-small-box', [0.09, 0.045, 0.10], [0.02, 0.215, -0.115], cream);
  add(shelf, 'desktop-shelf-pouch', new RoundedBoxGeometry(0.09, 0.065, 0.10, 3, 0.018), [0.02, 0.12, -0.115], matte(0x364b51));
  const bookColors = [0x5d4e47, 0x8a7962, 0x3e5965, 0xb9ad8f, 0x514e5c].map(matte);
  for (let index = 0; index < 7; index++) {
    const height = 0.23 + index % 3 * 0.022;
    box(shelf, 'desktop-book', [0.13, height, 0.019], [0.018, 0.08 + height / 2, 0.005 + index * 0.025], bookColors[index % bookColors.length]);
  }
  surface.add(shelf);
  group.add(surface);

  const vanityStool = new THREE.Group();
  vanityStool.name = 'west-bedroom-vanity-stool';
  vanityStool.position.set(stool.centerX, 0, stool.centerZ);
  const stoolWood = matte(0x9f805e);
  const stoolSeat = matte(0xaaa096);
  add(vanityStool, 'stool-seat', new THREE.CylinderGeometry(stool.radius, stool.radius, 0.09, 24), [0, stool.height - 0.045, 0], stoolSeat);
  add(vanityStool, 'stool-under-seat', new THREE.CylinderGeometry(0.145, 0.145, 0.025, 20), [0, 0.318, 0], stoolWood);
  for (const sideX of [-1, 1]) {
    for (const sideZ of [-1, 1]) {
      const foot = new THREE.Vector3(sideX * 0.13, 0.007, sideZ * 0.13);
      const top = new THREE.Vector3(sideX * 0.09, 0.315, sideZ * 0.09);
      const direction = top.clone().sub(foot);
      const leg = add(vanityStool, 'stool-leg', new THREE.CylinderGeometry(0.021, 0.030, direction.length(), 10), foot.clone().add(top).multiplyScalar(0.5).toArray(), stoolWood);
      leg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    }
  }
  box(vanityStool, 'stool-crossbar', [0.023, 0.023, 0.25], [0, 0.13, 0], stoolWood);
  group.add(vanityStool);

  const coatRack = new THREE.Group();
  coatRack.name = 'west-bedroom-coat-rack';
  const cartSouth = cart.centerX + cart.length / 2;
  coatRack.position.set((cartSouth + radiator.northEdge) / 2, 0, radiator.eastEdge + 0.16);
  const coatWood = matte(0x805a43);
  add(coatRack, 'coat-rack-base', new THREE.CylinderGeometry(0.16, 0.16, 0.035, 24), [0, 0.018, 0], coatWood);
  add(coatRack, 'coat-rack-pole', new THREE.CylinderGeometry(0.024, 0.031, 1.83, 12), [0, 0.95, 0], coatWood);
  for (let index = 0; index < 7; index++) {
    const angle = index * 2.4;
    const start = new THREE.Vector3(Math.cos(angle) * 0.015, 1.12 + index * 0.105, Math.sin(angle) * 0.015);
    const tip = new THREE.Vector3(Math.cos(angle) * 0.16, start.y + 0.13, Math.sin(angle) * 0.16);
    const direction = tip.clone().sub(start);
    const branch = add(coatRack, 'coat-hook', new THREE.CylinderGeometry(0.012, 0.017, direction.length(), 10), start.clone().add(tip).multiplyScalar(0.5).toArray(), coatWood);
    branch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  }
  const hangerMaterial = matte(0xc5c8ac);
  const hanger = new THREE.Group();
  hanger.name = 'coat-hanger';
  hanger.position.set(0.04, 1.43, -0.015);
  const hangerPoints = [[-0.12, -0.08], [0, 0], [0.12, -0.08], [-0.12, -0.08]];
  const hangerShape = new THREE.BufferGeometry().setFromPoints(hangerPoints.map(([px, py]) => new THREE.Vector3(px, py, 0)));
  hanger.add(new THREE.Line(hangerShape, new THREE.LineBasicMaterial({ color: 0xc5c8ac })));
  add(hanger, 'hanger-hook', new THREE.TorusGeometry(0.016, 0.003, 6, 12, Math.PI), [0, 0.016, 0], hangerMaterial);
  coatRack.add(hanger);
  group.add(coatRack);

  group.add(createOpenCurtains({ name: 'west-bedroom-open-curtains', ...window }));
  return group;
}
