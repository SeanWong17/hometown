import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createWalls, createFloor, createFurniture, createCeilings, createDimensions, createWalkColliders, rooms, roomNavigation, WIDTH, DEPTH } from './model.js';
import './style.css';
import './mobile.css';
import './export.css';

const host = document.querySelector('#canvas-host');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeff2f0);
const overviewCamera = new THREE.OrthographicCamera(-9, 9, 9, -9, 0.1, 100);
overviewCamera.position.set(15, 18, 20);
overviewCamera.lookAt(0, 0, 0);
const walkCamera = new THREE.PerspectiveCamera(76, 1, 0.05, 100);
walkCamera.rotation.order = 'YXZ';
let camera = overviewCamera;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
const mobileViewport = window.matchMedia('(max-width: 760px)');
renderer.setPixelRatio(Math.min(window.devicePixelRatio * (mobileViewport.matches ? 1.2 : 1.5), mobileViewport.matches ? 2.5 : 3));
renderer.setSize(host.clientWidth, host.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
host.append(renderer.domElement);
renderer.domElement.tabIndex = 0;

const controls = new OrbitControls(overviewCamera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minZoom = 0.45;
controls.maxZoom = 7.5;
controls.maxPolarAngle = Math.PI / 2 - 0.035;
controls.target.set(0, 0.7, 0);
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0xa5bbb0, 1.45));
const sun = new THREE.DirectionalLight(0xffffff, 1.7);
sun.position.set(-9, 16, 11);
sun.castShadow = true;
sun.shadow.mapSize.set(3072, 3072);
sun.shadow.camera.left = -15;
sun.shadow.camera.right = 15;
sun.shadow.camera.top = 18;
sun.shadow.camera.bottom = -18;
sun.shadow.bias = -0.0002;
sun.shadow.normalBias = 0.02;
scene.add(sun);

const stage = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: 0x617770, opacity: 0.16 }));
stage.rotation.x = -Math.PI / 2;
stage.position.y = -0.14;
stage.receiveShadow = true;
scene.add(stage);

let wallGroup = createWalls(4.14);
const floorGroup = createFloor();
const furnitureGroup = createFurniture();
const ceilingGroup = createCeilings();
const dimensions = createDimensions();
const house = new THREE.Group();
house.rotation.y = -Math.PI / 2;
house.add(floorGroup, wallGroup, furnitureGroup, ceilingGroup, dimensions);
scene.add(house);
dimensions.visible = false;
ceilingGroup.visible = false;
const walkColliders = createWalkColliders();
const walkKeys = new Set();
let walkYaw = 0;
let walkPitch = 0;
let draggingPointer = null;
let lastFrame = performance.now();
const walkRoom = document.querySelector('#walk-room');
const roomSelect = document.querySelector('#room-select');
roomNavigation.forEach((room, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = `${room.name} · ${room.area}`;
  roomSelect.append(option);
});
roomSelect.value = '0';

const labelsContainer = document.querySelector('#room-labels');
const labelElements = rooms.map((room) => {
  const label = document.createElement('div');
  label.className = 'room-label';
  label.innerHTML = `<strong>${room.name}</strong><span>${room.area}</span>`;
  labelsContainer.append(label);
  return label;
});
const dimensionElements = [
  { text: '8.58 m', position: new THREE.Vector3(0, 0.03, -DEPTH / 2 - 0.66) },
  { text: '13.16 m', position: new THREE.Vector3(-WIDTH / 2 - 0.7, 0.03, 0) }
].map(({ text, position }) => {
  const element = document.createElement('div');
  element.className = 'dimension-label';
  element.textContent = text;
  labelsContainer.append(element);
  return { element, position: position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2) };
});
const compassDirections = [
  { selector: '.compass-e', vector: new THREE.Vector3(1, 0, 0) },
  { selector: '.compass-s', vector: new THREE.Vector3(0, 0, 1) },
  { selector: '.compass-w', vector: new THREE.Vector3(-1, 0, 0) },
  { selector: '.compass-n', vector: new THREE.Vector3(0, 0, -1) }
].map(({ selector, vector }) => ({ element: document.querySelector(selector), vector }));

function placeElement(element, position) {
  const projected = position.clone().project(camera);
  const visible = projected.z >= -1 && projected.z <= 1;
  element.style.display = visible ? '' : 'none';
  if (!visible) return;
  element.style.left = `${(projected.x * 0.5 + 0.5) * host.clientWidth}px`;
  element.style.top = `${(-projected.y * 0.5 + 0.5) * host.clientHeight}px`;
}

function render() {
  requestAnimationFrame(render);
  const now = performance.now();
  const delta = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  if (camera === walkCamera) moveWalker(delta);
  else controls.update();
  renderer.render(scene, camera);
  if (camera === overviewCamera) document.querySelector('.scale-line span').style.width = `${2 * host.clientHeight * camera.zoom / (camera.top - camera.bottom)}px`;
  rooms.forEach((room, index) => placeElement(labelElements[index], house.localToWorld(room.position.clone())));
  dimensionElements.forEach(({ element, position }) => placeElement(element, position));
  const center = new THREE.Vector3(0, 0, 0).project(camera);
  for (const { element, vector } of compassDirections) {
    const point = vector.clone().project(camera);
    const dx = point.x - center.x;
    const dy = center.y - point.y;
    const length = Math.hypot(dx, dy) || 1;
    element.style.left = `${50 + dx / length * 31}%`;
    element.style.top = `${50 + dy / length * 31}%`;
    element.style.right = 'auto';
    element.style.bottom = 'auto';
    element.style.transform = 'translate(-50%, -50%)';
  }
}

function resize() {
  const width = host.clientWidth;
  const height = host.clientHeight;
  const aspect = width / height;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio * (mobileViewport.matches ? 1.2 : 1.5), mobileViewport.matches ? 2.5 : 3));
  const visibleHeight = window.matchMedia('(max-width: 760px)').matches ? 20 : 18.5;
  overviewCamera.left = -visibleHeight * aspect / 2;
  overviewCamera.right = visibleHeight * aspect / 2;
  overviewCamera.top = visibleHeight / 2;
  overviewCamera.bottom = -visibleHeight / 2;
  overviewCamera.updateProjectionMatrix();
  walkCamera.aspect = aspect;
  walkCamera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
new ResizeObserver(resize).observe(host);
resize();
render();

function setWalkLook() {
  walkCamera.rotation.set(walkPitch, walkYaw, 0);
}

function blocked(worldX, worldZ) {
  const local = house.worldToLocal(new THREE.Vector3(worldX, 1.62, worldZ));
  const radius = 0.20;
  if (Math.abs(local.x) > WIDTH / 2 - radius || Math.abs(local.z) > DEPTH / 2 - radius) return true;
  return walkColliders.some(box => {
    const closestX = THREE.MathUtils.clamp(local.x, box.minX, box.maxX);
    const closestZ = THREE.MathUtils.clamp(local.z, box.minZ, box.maxZ);
    return (local.x - closestX) ** 2 + (local.z - closestZ) ** 2 < radius ** 2;
  });
}

function moveWalker(delta) {
  const forward = Number(walkKeys.has('KeyW') || walkKeys.has('ArrowUp') || walkKeys.has('forward')) - Number(walkKeys.has('KeyS') || walkKeys.has('ArrowDown') || walkKeys.has('backward'));
  const strafe = Number(walkKeys.has('KeyD') || walkKeys.has('ArrowRight') || walkKeys.has('right')) - Number(walkKeys.has('KeyA') || walkKeys.has('ArrowLeft') || walkKeys.has('left'));
  if (!forward && !strafe) return;
  const distance = Math.min(2.4 * delta, 0.12) / Math.hypot(forward, strafe);
  const dx = (-Math.sin(walkYaw) * forward + Math.cos(walkYaw) * strafe) * distance;
  const dz = (-Math.cos(walkYaw) * forward - Math.sin(walkYaw) * strafe) * distance;
  if (!blocked(walkCamera.position.x + dx, walkCamera.position.z)) walkCamera.position.x += dx;
  if (!blocked(walkCamera.position.x, walkCamera.position.z + dz)) walkCamera.position.z += dz;
  const local = house.worldToLocal(walkCamera.position.clone());
  const current = rooms.findIndex(room => local.x >= room.zone[0] && local.x <= room.zone[2] && local.z >= room.zone[1] && local.z <= room.zone[3]);
  const navigationIndex = roomNavigation.findIndex(group => group.roomIndices.includes(current));
  if (current >= 0 && navigationIndex >= 0) {
    if (roomSelect.value !== String(navigationIndex)) roomSelect.value = String(navigationIndex);
    if (walkRoom.textContent !== rooms[current].name) walkRoom.textContent = rooms[current].name;
  }
}

function enterRoom(index) {
  const room = rooms[roomNavigation[index]?.roomIndices[0]];
  if (!room) return;
  camera = walkCamera;
  controls.enabled = false;
  document.querySelector('.viewer').classList.add('walk-active');
  document.querySelector('#walk-pad').hidden = false;
  walkRoom.hidden = false;
  walkRoom.textContent = room.name;
  roomSelect.value = String(index);
  walkKeys.clear();
  renderer.domElement.focus({ preventScroll: true });
  house.updateMatrixWorld(true);
  walkCamera.position.copy(house.localToWorld(room.walkPosition.clone()));
  const target = house.localToWorld(room.entryPosition.clone());
  const direction = target.sub(walkCamera.position);
  walkYaw = Math.atan2(-direction.x, -direction.z);
  walkPitch = 0;
  setWalkLook();
  wallGroup.visible = true;
  ceilingGroup.visible = true;
  document.querySelector('#walls-toggle').checked = true;
  wallGroup.traverse(object => {
    if (object.userData.openingHeader) object.visible = true;
    if (object.userData.doorLeaf) object.visible = !object.userData.walkOpen && !!(object.userData.defaultClosed || object.userData.roomDoorLeaf);
    if (object.userData.roomDoorPivot) object.rotation.y = object.userData.openAngle;
  });
  document.querySelectorAll('.view-button').forEach(button => button.classList.toggle('active', button.dataset.view === 'walk'));
}

function setView(view) {
  if (view === 'walk') {
    enterRoom(Number(roomSelect.value));
    return;
  }
  camera = overviewCamera;
  controls.enabled = true;
  ceilingGroup.visible = false;
  walkKeys.clear();
  document.querySelector('.viewer').classList.remove('walk-active');
  document.querySelector('#walk-pad').hidden = true;
  walkRoom.hidden = true;
  if (view === 'top') {
    camera.position.set(0, 25, 0.001);
    camera.up.set(0, 0, -1);
    controls.enableRotate = false;
    sun.castShadow = false;
  } else {
    camera.position.set(15, 18, 20);
    camera.up.set(0, 1, 0);
    controls.enableRotate = true;
    sun.castShadow = true;
  }
  wallGroup.traverse(object => {
    if (object.userData.roomDoorPivot) object.rotation.y = 0;
    if (object.userData.openingHeader || object.userData.doorLeaf) object.visible = view !== 'top';
  });
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  controls.target.set(0, 0.7, 0);
  controls.update();
  document.querySelectorAll('.view-button').forEach(button => button.classList.toggle('active', button.dataset.view === view));
}

document.querySelectorAll('.view-button').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
document.querySelector('#reset-button').addEventListener('click', () => setView(document.querySelector('.view-button.active').dataset.view));
document.querySelector('#zoom-in-button').addEventListener('click', () => {
  overviewCamera.zoom = Math.min(controls.maxZoom, overviewCamera.zoom * 1.3);
  overviewCamera.updateProjectionMatrix();
});
document.querySelector('#zoom-out-button').addEventListener('click', () => {
  overviewCamera.zoom = Math.max(controls.minZoom, overviewCamera.zoom / 1.3);
  overviewCamera.updateProjectionMatrix();
});
document.querySelector('#enter-room').addEventListener('click', () => enterRoom(Number(roomSelect.value)));
roomSelect.addEventListener('change', () => { if (camera === walkCamera) enterRoom(Number(roomSelect.value)); });
window.addEventListener('keydown', event => {
  if (camera !== walkCamera || event.target instanceof HTMLElement && event.target.closest('input, select, button, dialog')) return;
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
    walkKeys.add(event.code);
    event.preventDefault();
  }
});
window.addEventListener('keyup', event => walkKeys.delete(event.code));
window.addEventListener('blur', () => walkKeys.clear());
renderer.domElement.addEventListener('pointerdown', event => {
  if (camera !== walkCamera || event.button !== 0) return;
  draggingPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  renderer.domElement.setPointerCapture(event.pointerId);
});
renderer.domElement.addEventListener('pointermove', event => {
  if (!draggingPointer || draggingPointer.id !== event.pointerId) return;
  walkYaw -= (event.clientX - draggingPointer.x) * 0.0035;
  walkPitch = THREE.MathUtils.clamp(walkPitch - (event.clientY - draggingPointer.y) * 0.0035, -1.2, 1.2);
  draggingPointer.x = event.clientX;
  draggingPointer.y = event.clientY;
  setWalkLook();
});
for (const type of ['pointerup', 'pointercancel']) renderer.domElement.addEventListener(type, event => {
  if (draggingPointer?.id === event.pointerId) draggingPointer = null;
});
document.querySelectorAll('#walk-pad button').forEach(button => {
  button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); walkKeys.add(button.dataset.move); });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, () => walkKeys.delete(button.dataset.move));
});
document.querySelector('#walls-toggle').addEventListener('change', event => { wallGroup.visible = event.target.checked; });
document.querySelector('#floor-toggle').addEventListener('change', event => { floorGroup.visible = event.target.checked; });
document.querySelector('#labels-toggle').addEventListener('change', event => { labelsContainer.classList.toggle('hide-rooms', !event.target.checked); });
document.querySelector('#dimensions-toggle').addEventListener('change', event => {
  dimensions.visible = event.target.checked;
  labelsContainer.classList.toggle('show-dimensions', event.target.checked);
});

const dialog = document.querySelector('#reference-dialog');
document.querySelector('#reference-button').addEventListener('click', () => dialog.showModal());
document.querySelector('#close-reference').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
document.querySelector('#fullscreen-button').addEventListener('click', async () => {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await document.querySelector('#app').requestFullscreen();
});
document.querySelector('#download-button').addEventListener('click', () => {
  renderer.render(scene, camera);
  const link = document.createElement('a');
  link.download = 'hometown-view.png';
  link.href = renderer.domElement.toDataURL('image/png');
  link.click();
});

const exportModelButton = document.querySelector('#export-model-button');
const exportStatus = document.querySelector('#export-status');
exportModelButton.addEventListener('click', async () => {
  exportModelButton.disabled = true;
  exportStatus.textContent = '正在生成 GLB 文件…';
  try {
    const exportHouse = new THREE.Group();
    exportHouse.name = 'hometown';
    exportHouse.rotation.copy(house.rotation);
    for (const part of [floorGroup, wallGroup, furnitureGroup, ceilingGroup]) {
      exportHouse.add(part.clone(true));
    }
    const data = await new GLTFExporter().parseAsync(exportHouse, {
      binary: true,
      onlyVisible: false
    });
    const url = URL.createObjectURL(new Blob([data], { type: 'model/gltf-binary' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hometown.glb';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    exportStatus.textContent = 'GLB 文件已开始下载';
  } catch (error) {
    console.error('导出模型失败', error);
    exportStatus.textContent = '导出失败，请重试';
  } finally {
    exportModelButton.disabled = false;
  }
});
