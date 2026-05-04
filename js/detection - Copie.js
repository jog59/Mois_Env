console.log("detection.js chargé");

let forceFreeze = false;
let savedAutoRotate = false;
let savedAutoRotateSpeed = 0;
let frozenCameraQuaternion = null;

// Désactive TOUT : mouvements + auto-rotate
function disableViewerControls() {

    forceFreeze = true;

    // Sauvegarde l'état actuel d'auto-rotate (si défini)
    savedAutoRotate = viewer.autoRotate !== undefined ? viewer.autoRotate : false;
    savedAutoRotateSpeed = viewer.autoRotateSpeed !== undefined ? viewer.autoRotateSpeed : 0;

    // Coupe l'auto-rotate si ces propriétés existent
    if (viewer.autoRotate !== undefined) viewer.autoRotate = false;
    if (viewer.autoRotateSpeed !== undefined) viewer.autoRotateSpeed = 0;

    // Désactive les contrôles utilisateur
    if (viewer.OrbitControls) {
        viewer.OrbitControls.enabled = false;
        viewer.OrbitControls.enableZoom = false;
        viewer.OrbitControls.enablePan = false;
        viewer.OrbitControls.enableRotate = false;
        if (viewer.OrbitControls.autoRotate !== undefined) {
            viewer.OrbitControls.autoRotate = false;
        }
    }

    // Fige la caméra à son orientation actuelle
    frozenCameraQuaternion = viewer.camera.quaternion.clone();
}

// Réactive TOUT
function enableViewerControls() {

    forceFreeze = false;

    // Restaure l'auto-rotate si ces propriétés existent
    if (viewer.autoRotate !== undefined) viewer.autoRotate = savedAutoRotate;
    if (viewer.autoRotateSpeed !== undefined) viewer.autoRotateSpeed = savedAutoRotateSpeed;

    // Réactive les contrôles utilisateur
    if (viewer.OrbitControls) {
        viewer.OrbitControls.enabled = true;
        viewer.OrbitControls.enableZoom = true;
        viewer.OrbitControls.enablePan = true;
        viewer.OrbitControls.enableRotate = true;
        if (viewer.OrbitControls.autoRotate !== undefined) {
            viewer.OrbitControls.autoRotate = savedAutoRotate;
        }
    }

    frozenCameraQuaternion = null;
}

// Affichage du panneau
function showInfoPanel(title, text, imageUrl) {
    document.getElementById("infoTitle").innerText = title;
    document.getElementById("infoText").innerText = text;
    document.getElementById("infoImage").src = imageUrl;
    document.getElementById("infoPanel").style.display = "block";

    disableViewerControls();
}

// Empêche Panolens de bouger la caméra quand forceFreeze = true
viewer.addUpdateCallback(function () {
    if (forceFreeze && frozenCameraQuaternion) {
        // On réapplique à chaque frame l'orientation figée
        viewer.camera.quaternion.copy(frozenCameraQuaternion);
    }
});

// --- RECTANGLE ALIGNÉ SUR LA FONTAINE ---
setTimeout(() => {

    console.log("Ajout du rectangle dans la scène Panolens");

    const geometry = new THREE.PlaneGeometry(600, 1930);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        opacity: 0,
        transparent: true,
        side: THREE.DoubleSide
    });

    const rectangle = new THREE.Mesh(geometry, material);

    rectangle.position.set(3600, -1080, 2500);
    rectangle.lookAt(new THREE.Vector3(0, 0, 0));

    rectangle.userData.isClickable = true;

    viewer.scene.add(rectangle);

}, 500);


// --- RAYCASTER ---
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

viewer.container.addEventListener('click', function (event) {

    const rect = viewer.container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, viewer.camera);

    const intersects = raycaster.intersectObjects(viewer.scene.children, true);

    if (intersects.length > 0) {
        const obj = intersects[0].object;

        if (obj.userData.isClickable) {
            showInfoPanel(
                "Fontaine à eau",
                "Cette fontaine présente un risque de fuite détecté lors du contrôle.",
                "images/fontaine.jpg"
            );
            return;
        }
    }

    const panoHit = raycaster.intersectObject(panorama, true);

    if (panoHit.length === 0) {
        console.log("Aucune intersection détectée");
        return;
    }

    const point = panoHit[0].point;

    console.log(
        "Position 3D :",
        point.x.toFixed(0),
        point.y.toFixed(0),
        point.z.toFixed(0)
    );
});
