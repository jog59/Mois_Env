console.log("detection.js chargé");

/* LISTES DE HOTSPOTS */
let hotspotsPano1 = [];
let hotspotsPano2 = [];

let checkmarksPano1 = [];
let checkmarksPano2 = [];

let totalZones = 0;
let foundZones = 0;

/* Variables pour différencier clic / glissé */
let pointerDownX = 0;
let pointerDownY = 0;
let pointerMoved = false;

/* AJOUT COCHES */
function addCheckMark(position, panoIndex) {
    const texture = new THREE.TextureLoader().load("assets/picto-coche-verte.png");
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    sprite.scale.set(500, 500, 1);

    // Rapprocher la coche de la sphère
    const direction = position.clone().normalize();
    sprite.position.copy(position.clone().sub(direction.multiplyScalar(150)));

    viewer.scene.add(sprite);

    if (panoIndex === 1) checkmarksPano1.push(sprite);
    else checkmarksPano2.push(sprite);
}

function hideCheckmarks(list) {
    list.forEach(s => s.visible = false);
}

function showCheckmarks(list) {
    list.forEach(s => s.visible = true);
}

/* ACTIVER / DÉSACTIVER HOTSPOTS */
function activateHotspots(list) {
    list.forEach(h => h.userData.active = true);
}

function deactivateHotspots(list) {
    list.forEach(h => h.userData.active = false);
}

/* AJOUT HOTSPOT PANORAMA 1 */
setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 1930);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rect1 = new THREE.Mesh(geo, mat);
    rect1.name = "Fontaine";
    rect1.position.set(3600, -1080, 2500);
    rect1.lookAt(new THREE.Vector3(0, 0, 0));

    rect1.userData = {
        isClickable: true,
        active: true,
        panelId: "fontaine",
        found: false
    };

    hotspotsPano1.push(rect1);
    viewer.scene.add(rect1);

    totalZones++;

}, 500);

/* AJOUT HOTSPOT PANORAMA 2 */
setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 1200);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rect2 = new THREE.Mesh(geo, mat);
    rect2.name = "Déchets";
    rect2.position.set(3400, -1360, -3000);
    rect2.lookAt(new THREE.Vector3(0, 0, 0));

    rect2.userData = {
        isClickable: true,
        active: false,
        panelId: "dechets",
        found: false
    };

    hotspotsPano2.push(rect2);
    viewer.scene.add(rect2);

    totalZones++;

}, 500);

setTimeout(() => {

    const geo = new THREE.PlaneGeometry(1000, 1800);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.4,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rect4 = new THREE.Mesh(geo, mat);
    rect4.name = "Déchets2";
    rect4.position.set(-2100, -1800, -1600);
    rect4.lookAt(new THREE.Vector3(0, 0, 0));

    rect4.userData = {
        isClickable: true,
        active: false,
        panelId: "dechets",
        found: false
    };

    hotspotsPano2.push(rect4);
    viewer.scene.add(rect4);

    totalZones++;

}, 500);




setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 600);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rect3 = new THREE.Mesh(geo, mat);
    rect3.name = "Ventilateur";
    rect3.position.set(-4150, 650, 1292);  // 👉 À ajuster selon ton besoin
    rect3.lookAt(new THREE.Vector3(0, 0, 0));

    rect3.userData = {
        isClickable: true,
        active: false,
        panelId: "ventilateur",   // ⚠️ doit exister dans panels.js
        found: false
    };

    hotspotsPano2.push(rect3);
    viewer.scene.add(rect3);

    totalZones++;

}, 500);



/* RAYCASTER */
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

/* FONCTION PRINCIPALE DE CLIC */
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

        if (!panel) {
            console.warn("Panel introuvable :", obj.userData.panelId);
            return;
        }

        // Si déjà trouvé → ouvrir le panneau mais ne pas ajouter de coche
        if (obj.userData.found) {
            showInfoPanel(panel.title, panel.text, panel.image, panel.logos || []);
            return;
        }

        // Marquer comme trouvé
        obj.userData.found = true;
        foundZones++;
        document.getElementById("counter").innerText =
            `Zones trouvées : ${foundZones} / ${totalZones}`;

        // Ajouter la coche UNE SEULE FOIS
        const hit = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000));
        if (hit) addCheckMark(hit, currentPano === pano1 ? 1 : 2);

        // Ouvrir le panneau
        showInfoPanel(panel.title, panel.text, panel.image, panel.logos || []);
    }
}

/* GESTION DU DRAG VS CLIC */
viewer.container.addEventListener("pointerdown", (event) => {
    pointerMoved = false;
    pointerDownX = event.clientX;
    pointerDownY = event.clientY;
});

viewer.container.addEventListener("pointermove", (event) => {
    const dx = Math.abs(event.clientX - pointerDownX);
    const dy = Math.abs(event.clientY - pointerDownY);
    if (dx > 5 || dy > 5) pointerMoved = true;
});

viewer.container.addEventListener("pointerup", (event) => {

    if (pointerMoved) return;

    // Debug coordonnées
    const rect = viewer.container.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouseVec = new THREE.Vector2(x, y);
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouseVec, viewer.camera);

    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000);
    const hit = ray.ray.intersectSphere(sphere);

    if (hit) {
        console.log("%cCoordonnées 3D :", "color:#00c853;font-weight:bold;");
        console.log("X :", Math.round(hit.x));
        console.log("Y :", Math.round(hit.y));
        console.log("Z :", Math.round(hit.z));
    }

    // Clic hotspot
    handleSceneClick(event);
});
