import * as THREE from 'three';

export function createOpenCurtains({ name, wallX, startZ, endZ }) {
  const curtains = new THREE.Group();
  curtains.name = name;
  const curtainX = wallX - 0.14;
  const rodY = 3.20;
  const matte = color => new THREE.MeshStandardMaterial({ color, roughness: 0.82 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x737a77, metalness: 0.62, roughness: 0.36 });
  const add = (parent, partName, geometry, position, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = partName;
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const rod = add(curtains, 'curtain-rod', new THREE.CylinderGeometry(0.012, 0.012, endZ - startZ + 0.20, 12), [curtainX, rodY, (startZ + endZ) / 2], steel);
  rod.rotation.x = Math.PI / 2;
  for (const end of [startZ - 0.1, endZ + 0.1]) add(curtains, 'rod-end', new THREE.SphereGeometry(0.024, 10, 8), [curtainX, rodY, end], steel);
  const fabric = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.86, roughness: 1, side: THREE.DoubleSide, depthWrite: false });
  const stemMaterial = new THREE.LineBasicMaterial({ color: 0x7c8071, transparent: true, opacity: 0.76 });
  const flowerMaterials = [matte(0xbe6e86), matte(0xd0b875), matte(0xa8b18b)];
  for (const [side, centerZ] of [[-1, startZ + 0.18], [1, endZ - 0.18]]) {
    const panel = new THREE.Group();
    panel.name = side < 0 ? 'east-curtain-open' : 'west-curtain-open';
    const panelWidth = 0.36;
    const segments = 24;
    const rows = 12;
    const vertices = [];
    const colors = [];
    const indices = [];
    const bottom = 0.92;
    for (let row = 0; row <= rows; row++) {
      const t = row / rows;
      const y = bottom + t * (rodY - bottom);
      const color = new THREE.Color(t > 0.82 ? 0x9ba4b5 : t < 0.1 ? 0x858194 : 0xe4e2d3);
      for (let col = 0; col <= segments; col++) {
        const u = col / segments;
        vertices.push(curtainX - 0.025 + Math.sin(u * Math.PI * 8) * 0.025, y, centerZ + (u - 0.5) * panelWidth);
        colors.push(color.r, color.g, color.b);
        if (row < rows && col < segments) {
          const a = row * (segments + 1) + col;
          indices.push(a, a + segments + 1, a + 1, a + 1, a + segments + 1, a + segments + 2);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    add(panel, 'pleated-curtain', geometry, [0, 0, 0], fabric).castShadow = false;
    const band = add(panel, 'curtain-tieback', new THREE.CylinderGeometry(0.014, 0.014, panelWidth, 8), [curtainX - 0.045, 1.58, centerZ], matte(0xaaa394));
    band.rotation.x = Math.PI / 2;
    for (let index = 0; index < 11; index++) {
      const flowerZ = centerZ + ((index * 7) % 11 / 10 - 0.5) * 0.29;
      const flowerY = 1.08 + (index % 5) * 0.24;
      const flowerX = curtainX - 0.06;
      const stem = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(flowerX, flowerY - 0.20, flowerZ - 0.015),
        new THREE.Vector3(flowerX, flowerY, flowerZ)
      ]);
      panel.add(new THREE.Line(stem, stemMaterial));
      const bloom = add(panel, 'curtain-flower', new THREE.SphereGeometry(0.017, 8, 6), [flowerX, flowerY, flowerZ], flowerMaterials[index % flowerMaterials.length]);
      bloom.scale.x = 0.18;
      bloom.castShadow = false;
    }
    for (let index = 0; index < 7; index++) {
      add(panel, 'curtain-ring', new THREE.TorusGeometry(0.016, 0.003, 6, 12), [curtainX, rodY - 0.018, centerZ + (index / 6 - 0.5) * panelWidth], steel);
    }
    curtains.add(panel);
  }
  return curtains;
}
