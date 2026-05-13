console.log("detection.js chargé");

/* LISTES DE HOTSPOTS */
let hotspotsPano1 = [];
let hotspotsPano2 = [];
let hotspotsPano3 = [];
let hotspotsPano4 = [];

let checkmarksPano1 = [];
let checkmarksPano2 = [];
let checkmarksPano3 = [];
let checkmarksPano4 = [];

let totalZones = 0;
let foundZones = 0;

/* Variables pour différencier clic / glissé */
let pointerDownX = 0;
let pointerDownY = 0;
let pointerMoved = false;


//MODE DEBUG
let debugMode = false;
function updateDebugVisibility() {

    // Masquer toutes les zones
    [...hotspotsPano1, ...hotspotsPano2, ...hotspotsPano3, ...hotspotsPano4].forEach(z => {
        if (z.material) z.material.visible = false;
    });

    if (!debugMode) return;

    // Afficher uniquement les zones du panorama actif
    if (currentPano === pano1) {
        hotspotsPano1.forEach(z => { if (z.material) z.material.visible = true; });
    }

    if (currentPano === pano2) {
        hotspotsPano2.forEach(z => { if (z.material) z.material.visible = true; });
    }

    if (currentPano === pano3) {
        hotspotsPano3.forEach(z => { if (z.material) z.material.visible = true; });
    }
        if (currentPano === pano4) {
        hotspotsPano4.forEach(z => { if (z.material) z.material.visible = true; });
    }
}

/* AJOUT COCHES */
function addCheckMark(position, panoIndex) {
    const texture = new THREE.TextureLoader().load("assets/picto-coche-verte.png");
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    sprite.scale.set(500, 500, 1);

    const direction = position.clone().normalize();
    sprite.position.copy(position.clone().sub(direction.multiplyScalar(150)));

    viewer.scene.add(sprite);

    if (panoIndex === 1) checkmarksPano1.push(sprite);
    else if (panoIndex === 2) checkmarksPano2.push(sprite);
    else if (panoIndex === 3) checkmarksPano3.push(sprite);
    else checkmarksPano4.push(sprite);
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

/* HOTSPOTS PANORAMA 1 */
setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 1930);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.5,
        transparent: false,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone1_1 = new THREE.Mesh(geo, mat);
    Zone1_1.name = "Fontaine";
    Zone1_1.position.set(3600, -1080, 2500);
    Zone1_1.lookAt(new THREE.Vector3(0, 0, 0));

    Zone1_1.userData = {
        isClickable: true,
        active: true,
        panelId: "fontaine",
        found: false
    };

    hotspotsPano1.push(Zone1_1);
    viewer.scene.add(Zone1_1);

    totalZones++;

}, 500);


     setTimeout(() => {  

    const geo = new THREE.PlaneGeometry(600, 1930);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.5,
        transparent: false,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone1_2 = new THREE.Mesh(geo, mat);
    Zone1_2.name = "Air Comprimee";
    Zone1_2.position.set(4501, -1600, -1200);
    Zone1_2.lookAt(new THREE.Vector3(0, 0, 0));

    Zone1_2.userData = {
        isClickable: true,
        active: true,
        panelId: "air_comprimee",
        found: false
    };

    hotspotsPano1.push(Zone1_2);
    viewer.scene.add(Zone1_2);

    totalZones++;

}, 500);   

/* HOTSPOTS PANORAMA 2 */
setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 1200);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone2_1 = new THREE.Mesh(geo, mat);
    Zone2_1.name = "Déchets";
    Zone2_1.position.set(3400, -1360, -3000);
    Zone2_1.lookAt(new THREE.Vector3(0, 0, 0));

    Zone2_1.userData = {
        isClickable: true,
        active: false,
        panelId: "dechets",
        found: false
    };

    hotspotsPano2.push(Zone2_1);
    viewer.scene.add(Zone2_1);

    totalZones++;

}, 500);

setTimeout(() => {

    const geo = new THREE.PlaneGeometry(1000, 1800);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone2_2 = new THREE.Mesh(geo, mat);
    Zone2_2.name = "Déchets2";
    Zone2_2.position.set(-2100, -1800, -1600);
    Zone2_2.lookAt(new THREE.Vector3(0, 0, 0));

    Zone2_2.userData = {
        isClickable: true,
        active: false,
        panelId: "dechets",
        found: false
    };

    hotspotsPano2.push(Zone2_2);
    viewer.scene.add(Zone2_2);

    totalZones++;

}, 500);

setTimeout(() => {

    const geo = new THREE.PlaneGeometry(600, 600);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone2_3 = new THREE.Mesh(geo, mat);
    Zone2_3.name = "Ventilateur";
    Zone2_3.position.set(-4150, 650, 1292);
    Zone2_3.lookAt(new THREE.Vector3(0, 0, 0));

    Zone2_3.userData = {
        isClickable: true,
        active: false,
        panelId: "ventilateur",
        found: false
    };

    hotspotsPano2.push(Zone2_3);
    viewer.scene.add(Zone2_3);

    totalZones++;

}, 500);

setTimeout(() => {

    const geo = new THREE.PlaneGeometry(800, 1200);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone2_4 = new THREE.Mesh(geo, mat);
    Zone2_4.name = "Air comprimée";
    Zone2_4.position.set(-1350, 1900, 3000);
    Zone2_4.lookAt(new THREE.Vector3(0, 0, 0));

    Zone2_4.userData = {
        isClickable: true,
        active: false,
        panelId: "air_comprimee",
        found: false
    };

    hotspotsPano2.push(Zone2_4);
    viewer.scene.add(Zone2_4);

    totalZones++;

}, 500);

/* HOTSPOTS PANORAMA 3 */
/* HOTSPOTS PANORAMA 4 */

setTimeout(() => {
    const geo = new THREE.PlaneGeometry(600, 1930);
    const mat = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0.5,
        transparent: false,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const Zone4_1 = new THREE.Mesh(geo, mat);
    Zone4_1.name = "Fontaine";
    Zone4_1.position.set(2053, -1592, -3000);
    Zone4_1.lookAt(new THREE.Vector3(0, 0, 0));

    Zone4_1.userData = {
        isClickable: true,
        active: true,
        panelId: "fontaine",
        found: false
    };

    hotspotsPano4.push(Zone4_1);
    viewer.scene.add(Zone4_1);

    totalZones++;

}, 500);

/* SON*/
// Création du son spatial
const listener = new THREE.AudioListener();
viewer.camera.add(listener);

const sound = new THREE.PositionalAudio(listener);

const audioLoader = new THREE.AudioLoader();


audioLoader.load('assets/fuite_air_comprimee.m4a', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.6);

    sound.setRefDistance(800);
    sound.setMaxDistance(8000);
    sound.setRolloffFactor(1.2);
    sound.setDistanceModel('inverse');

    sound.setDirectionalCone(120, 240, 0.4);
});

// Objet 3D invisible qui porte le son
const soundSource = new THREE.Mesh(
    new THREE.SphereGeometry(50, 8, 8),
    new THREE.MeshBasicMaterial({ visible: false })
);

soundSource.position.set(4579, -1496, -1038);
soundSource.lookAt(viewer.camera.position);
soundSource.add(sound);
viewer.scene.add(soundSource);

document.addEventListener("pointerdown", () => {
    if (sound && !sound.isPlaying) {
        sound.play();
    }
}, { once: true });

// Lier le son à l'image 1
pano1.addEventListener('enter', () => {
    if (!sound.isPlaying) sound.play();
});

pano1.addEventListener('leave', () => {
    if (sound.isPlaying) sound.stop();
});




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

        if (obj.userData.found) {
            showInfoPanel(panel.title, panel.text, panel.image, panel.logos || []);
            return;
        }

        obj.userData.found = true;
        foundZones++;
        document.getElementById("counter").innerText =
            `Zones trouvées : ${foundZones} / ${totalZones}`;

        const hit = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000));
        if (hit) addCheckMark(hit,
            currentPano === pano1 ? 1 :
                currentPano === pano2 ? 2 : 3
        );

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

    handleSceneClick(event);
});

document.getElementById("switchImagePrev").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

 /* --- IMAGE 4 → IMAGE 3 --- */
    if (currentPano === pano4) {

        currentPano = pano3;
        viewer.setPanorama(pano3);

        deactivateHotspots(hotspotsPano4);
        activateHotspots(hotspotsPano3);

        hideCheckmarks(checkmarksPano4);
        showCheckmarks(checkmarksPano3);

        // Sur l'image 3 : bouton suivant + précédent
        switchImage.style.display = "block";
        switchImage.innerText = "➡️ Image suivante";

        switchImagePrev.innerText = "⬅️ Image précédente";

        return;
    }

    
    /* --- IMAGE 3 → IMAGE 2 --- */
    if (currentPano === pano3) {

        currentPano = pano2;
        viewer.setPanorama(pano2);

        deactivateHotspots(hotspotsPano3);
        activateHotspots(hotspotsPano2);

        hideCheckmarks(checkmarksPano3);
        showCheckmarks(checkmarksPano2);

        // Sur l'image 2 : bouton suivant + précédent
        switchImage.style.display = "block";
/*        switchImage.innerText = "➡️ Image suivante";

        switchImagePrev.innerText = "⬅️ Image précédente";
*/
        return;
    }

    /* --- IMAGE 2 → IMAGE 1 --- */
    if (currentPano === pano2) {

        currentPano = pano1;
        viewer.setPanorama(pano1);

        deactivateHotspots(hotspotsPano2);
        activateHotspots(hotspotsPano1);

        hideCheckmarks(checkmarksPano2);
        showCheckmarks(checkmarksPano1);

        // Sur l'image 1 : seulement bouton suivant
        switchImage.style.display = "block";
        switchImage.innerText = "➡️ Image suivante";

        switchImagePrev.style.display = "none";

        return;
    }
});


function handlePanelSound(panelId) {
    if (panelId === "air_comprimee" && sound.isPlaying) {
        sound.pause();
    }
}







