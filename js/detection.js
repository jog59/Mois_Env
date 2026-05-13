console.log("detection.js chargé !!");

/* ========================= */
/* VARIABLES */
/* ========================= */

let hotspotsPano1 = [];
let hotspotsPano2 = [];
let hotspotsPano3 = [];

let checkmarksPano1 = [];
let checkmarksPano2 = [];
let checkmarksPano3 = [];

let totalZones = 0;
let foundZones = 0;

/* DRAG vs CLICK */
let pointerDownX = 0;
let pointerDownY = 0;
let pointerMoved = false;

/* DEBUG */
let debugMode = false;

/* ========================= */
/* DEBUG VISIBILITY */
/* ========================= */

function updateDebugVisibility() {

  [...hotspotsPano1, ...hotspotsPano2, ...hotspotsPano3].forEach(z => {
    if (z.material) z.material.visible = false;
  });

  if (!debugMode) return;

  if (currentPano === pano1) hotspotsPano1.forEach(z => z.material.visible = true);
  if (currentPano === pano2) hotspotsPano2.forEach(z => z.material.visible = true);
  if (currentPano === pano3) hotspotsPano3.forEach(z => z.material.visible = true);
}

/* ========================= */
/* CHECKMARKS */
/* ========================= */

function addCheckMark(position, panoIndex) {

  const texture = new THREE.TextureLoader().load("assets/picto-coche-verte.png");
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(500, 500, 1);

  const direction = position.clone().normalize();
  sprite.position.copy(position.clone().sub(direction.multiplyScalar(150)));

  // ✅ FIX PANOLENS
  if (panoIndex === 1) pano1.add(sprite);
  else if (panoIndex === 2) pano2.add(sprite);
  else pano3.add(sprite);

  if (panoIndex === 1) checkmarksPano1.push(sprite);
  else if (panoIndex === 2) checkmarksPano2.push(sprite);
  else checkmarksPano3.push(sprite);
}

function hideCheckmarks(list) {
  list.forEach(s => s.visible = false);
}

function showCheckmarks(list) {
  list.forEach(s => s.visible = true);
}

/* ========================= */
/* ACTIVATION HOTSPOTS */
/* ========================= */

function activateHotspots(list) {
  list.forEach(h => h.userData.active = true);
}

function deactivateHotspots(list) {
  list.forEach(h => h.userData.active = false);
}

/* ========================= */
/* HOTSPOTS PANO 1 */
/* ========================= */

setTimeout(() => {

  const rect1 = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 1930),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
      visible: debugMode
    })
  );

  rect1.position.set(3600, -1080, 2500);
  rect1.lookAt(new THREE.Vector3(0, 0, 0));

  rect1.userData = {
    isClickable: true,
    active: true,
    panelId: "fontaine",
    found: false
  };

  hotspotsPano1.push(rect1);
  pano1.add(rect1); // ✅ FIX
  totalZones++;

}, 500);

setTimeout(() => {

  const rect5 = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 1930),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
      visible: debugMode
    })
  );

  rect5.position.set(4501, -1600, -1200);
  rect5.lookAt(new THREE.Vector3(0, 0, 0));

  rect5.userData = {
    isClickable: true,
    active: true,
    panelId: "air_comprimee",
    found: false
  };

  hotspotsPano1.push(rect5);
  pano1.add(rect5); // ✅ FIX
  totalZones++;

}, 500);

/* ========================= */
/* HOTSPOTS PANO 2 */
/* ========================= */

setTimeout(() => {

  const rect2 = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 1200),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide
    })
  );

  rect2.position.set(3400, -1360, -3000);
  rect2.lookAt(new THREE.Vector3(0, 0, 0));

  rect2.userData = {
    isClickable: true,
    active: false,
    panelId: "dechets",
    found: false
  };

  hotspotsPano2.push(rect2);
  pano2.add(rect2); // ✅ FIX
  totalZones++;

}, 500);

setTimeout(() => {

  const rect4 = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 1800),
    new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide
    })
  );

  rect4.position.set(-2100, -1800, -1600);
  rect4.lookAt(new THREE.Vector3(0, 0, 0));

  rect4.userData = {
    isClickable: true,
    active: false,
    panelId: "dechets",
    found: false
  };

  hotspotsPano2.push(rect4);
  pano2.add(rect4); // ✅ FIX
  totalZones++;

}, 500);

setTimeout(() => {

  const rect3 = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      opacity: 0.5,
      transparent: true,
      side: THREE.DoubleSide
    })
  );

  rect3.position.set(-4150, 650, 1292);
  rect3.lookAt(new THREE.Vector3(0, 0, 0));

  rect3.userData = {
    isClickable: true,
    active: false,
    panelId: "ventilateur",
    found: false
  };

  hotspotsPano2.push(rect3);
  pano2.add(rect3); // ✅ FIX
  totalZones++;

}, 500);

/* ========================= */
/* SON */
/* ========================= */

const listener = new THREE.AudioListener();

viewer.addUpdateCallback(function () {
  if (viewer.camera && !listener.parent) {
    viewer.camera.add(listener);
  }
});

const sound = new THREE.PositionalAudio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('assets/fuite_air_comprimee.m4a', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.6);
});

const soundSource = new THREE.Mesh(
  new THREE.SphereGeometry(50, 8, 8),
  new THREE.MeshBasicMaterial({ visible: false })
);

soundSource.position.set(4579, -1496, -1038);
soundSource.add(sound);

// ✅ FIX PANOLENS
pano1.add(soundSource);

/* ========================= */
/* PANEL SOUND */
/* ========================= */

function handlePanelSound(panelId) {
  if (panelId === "air_comprimee" && sound.isPlaying) {
    sound.pause();
  }
}

/* ========================= */
/* CLICK */
/* ========================= */

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function handleSceneClick(event) {

  const rect = viewer.container.getBoundingClientRect();

  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, viewer.camera);

  const intersects = raycaster.intersectObjects(viewer.scene.children, true);

  if (intersects.length === 0) return;

  const obj = intersects[0].object;

  if (obj.userData.isClickable && obj.userData.active) {

    const panel = PANELS[obj.userData.panelId];
    if (!panel) return;

    handlePanelSound(obj.userData.panelId);

    if (obj.userData.found) {
      showInfoPanel(panel.title, panel.text, panel.image, panel.logos || [], panel.video || null);
      return;
    }

    obj.userData.found = true;
    foundZones++;

    document.getElementById("counter").innerText =
      `Zones trouvées : ${foundZones} / ${totalZones}`;

    showInfoPanel(panel.title, panel.text, panel.image, panel.logos || [], panel.video || null);
  }
}

/* ========================= */
/* EVENTS */
/* ========================= */

viewer.container.addEventListener("pointerdown", (e) => {
  pointerMoved = false;
  pointerDownX = e.clientX;
  pointerDownY = e.clientY;
});

viewer.container.addEventListener("pointermove", (e) => {
  if (Math.abs(e.clientX - pointerDownX) > 5 || Math.abs(e.clientY - pointerDownY) > 5) {
    pointerMoved = true;
  }
});

viewer.container.addEventListener("pointerup", (e) => {
  if (!pointerMoved) handleSceneClick(e);
});
