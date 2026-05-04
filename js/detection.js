console.log("detection.js chargé");

/* LISTES DE HOTSPOTS */
let hotspotsPano1 = [];
let hotspotsPano2 = [];

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
    rect1.position.set(3600, -1080, 2500);
    rect1.lookAt(new THREE.Vector3(0, 0, 0));
    rect1.userData.isClickable = true;
    rect1.userData.active = true; // actif par défaut

    hotspotsPano1.push(rect1);
    viewer.scene.add(rect1);

}, 500);

/* AJOUT HOTSPOT PANORAMA 2 */
setTimeout(() => {

    const geo = new THREE.PlaneGeometry(800, 800);
    const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rect2 = new THREE.Mesh(geo, mat);
    rect2.position.set(-2000, 500, -1500);
    rect2.lookAt(new THREE.Vector3(0, 0, 0));
    rect2.userData.isClickable = true;
    rect2.userData.active = false; // inactif au début

    hotspotsPano2.push(rect2);
    viewer.scene.add(rect2);

}, 500);

/* RAYCASTER */
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function handleSceneClick(event) {

    const rect = viewer.container.getBoundingClientRect();
    const clientX = event.clientX;
    const clientY = event.clientY;

    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, viewer.camera);

    const intersects = raycaster.intersectObjects(viewer.scene.children, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        if (obj.userData.isClickable && obj.userData.active) {
            showInfoPanel(
                "Zone détectée",
                "L’eau potable est une ressource industrielle à préserver. Une simple fuite peut représenter des centaines de litres gaspillés par jour.",
                "assets/Image_Fontaine_Fuite.png"
            );
            return;
        }
    }
}

viewer.container.addEventListener("pointerdown", handleSceneClick);
