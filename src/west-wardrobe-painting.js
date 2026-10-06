import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import artworkImage from './assets/west-wardrobe-east-painting.jpg';

export function createWestWardrobePainting() {
  const group = new THREE.Group();
  group.name = 'west-wardrobe-east-side-painting';
  group.position.set(0, 1.495, -1.135);
  group.rotation.y = Math.PI;
  const black = new THREE.MeshStandardMaterial({ color: 0x252523, roughness: 0.56 });
  const mat = new THREE.MeshStandardMaterial({ color: 0xe0dfd4, roughness: 0.92 });
  const frame = new THREE.Mesh(new RoundedBoxGeometry(0.45, 0.59, 0.02, 3, 0.004), black);
  frame.name = 'black-picture-frame';
  frame.castShadow = true;
  group.add(frame);
  const border = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.55), mat);
  border.name = 'light-picture-mat';
  border.position.z = 0.011;
  group.add(border);
  const texture = new THREE.TextureLoader().load(artworkImage);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const artwork = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.50),
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.94 }));
  artwork.name = 'framed-artwork';
  artwork.position.z = 0.013;
  group.add(artwork);
  return group;
}
