console.log("detection.js chargé");

/* Désactivation / Réactivation des contrôles utilisateur */
function disableViewerControls() {
    if (viewer.OrbitControls) {
        viewer.OrbitControls.enabled = false;
        viewer.OrbitControls.enableZoom = false;
        viewer.OrbitControls.enablePan = false;
        viewer.OrbitControls.enableRotate = false;
    }
}

function enableViewerControls() {
    if (viewer.OrbitControls) {
        viewer.OrbitControls.enabled = true;
        viewer.OrbitControls.enableZoom = true;
        viewer.OrbitControls.enablePan = true;
        viewer.OrbitControls.enableRotate = true;
    }
}

/* Ouverture du panneau */
function showInfoPanel(title, text, imageUrl) {

    document.getElementById("infoTitle").innerText = title;
    document.getElementById("infoText").innerText = text;
    document.getElementById("infoImage").src = imageUrl;

    document.getElementById("infoPanel").style.display = "block";

    savedRotationState = isAutoRotateOn;
    setAutoRotate(false);

    disableViewerControls();
}

/* Hotspot rectangle */
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

/* Raycaster */
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

        if (obj.userData.isClickable) {
            showInfoPanel(
                "Fontaine à eau",
                "Cette fontaine présente un risque de fuite détecté lors du contrôle.",
                "assets/Image_Fontaine_Fuite.png"
            );
            return;
        }
    }
}

/* Un seul event universel */
viewer.container.addEventListener("pointerdown", handleSceneClick);
