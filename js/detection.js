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

/* GROUPES : { groupId -> { found: bool, checkmarkAdded: bool } } */
const groups = {};

/* Variables pour différencier clic / glissé */
let pointerDownX = 0;
let pointerDownY = 0;
let pointerMoved = false;

/* MODE DEBUG */
let debugMode = false;
function updateDebugVisibility() {
    [...hotspotsPano1, ...hotspotsPano2, ...hotspotsPano3, ...hotspotsPano4].forEach(z => {
        if (z.material) z.material.visible = false;
    });
    if (!debugMode) return;
    if (currentPano === pano1) hotspotsPano1.forEach(z => { if (z.material) z.material.visible = true; });
    if (currentPano === pano2) hotspotsPano2.forEach(z => { if (z.material) z.material.visible = true; });
    if (currentPano === pano3) hotspotsPano3.forEach(z => { if (z.material) z.material.visible = true; });
    if (currentPano === pano4) hotspotsPano4.forEach(z => { if (z.material) z.material.visible = true; });
}

/* AUDIO LISTENER GLOBAL */
const listener = new THREE.AudioListener();
viewer.camera.add(listener);

// Déblocage audio au premier geste utilisateur
document.addEventListener("pointerdown", () => {
    if (listener.context.state === "suspended") {
        listener.context.resume();
    }
}, { once: true });

/* ANIMATION DES ICÔNES (pulse) */
const animatedIcons = [];

(function animLoop() {
    requestAnimationFrame(animLoop);
    const t = performance.now() / 1000;
    animatedIcons.forEach(s => {
        if (!s.visible) return;
        const pulse = 1 + 0.12 * Math.sin(t * 3);
        s.scale.set(
            s.userData.baseScaleX * pulse,
            s.userData.baseScaleY * pulse,
            1
        );
    });
})();


/* ============================================================
   ANIMATIONS SHADER
   ============================================================ */

function buildAnimation(options, pano) {
    if (options.type === "wind") return buildWindAnimation(options, pano);
    if (options.type === "drip") return buildDripAnimation(options, pano);
    console.warn("Type d'animation inconnu :", options.type);
    return null;


}

/* --- WIND : flux de particules/texture animée --- */
function buildWindAnimation(options, pano) {

    const texture = new THREE.TextureLoader().load(options.src);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { value: texture },
            time: { value: 0 },
            speedX: { value: options.speedX ?? 0.5 },
            speedY: { value: options.speedY ?? 0.0 },
            turbAmp: { value: options.turbAmp ?? 0.05 },
            turbFreq: { value: options.turbFreq ?? 10.0 },
            turbSpeed: { value: options.turbSpeed ?? 3.0 },
            opacity: { value: options.opacity ?? 1.0 }
        },
        transparent: true,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D map;
            uniform float time;
            uniform float speedX;
            uniform float speedY;
            uniform float turbAmp;
            uniform float turbFreq;
            uniform float turbSpeed;
            uniform float opacity;
            varying vec2 vUv;
            void main() {
                vec2 uv = vUv;
                uv.x -= time * speedX;
                uv.y -= time * speedY;
                uv.y += sin(uv.x * turbFreq + time * turbSpeed) * turbAmp;
                vec4 color = texture2D(map, uv);
                if (color.a < 0.05) discard;
                gl_FragColor = vec4(color.rgb, color.a * opacity);
            }
        `
    });

    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(options.w ?? 2000, options.h ?? 1000),
        material
    );

    const px = options.x ?? 0;
    const py = options.y ?? 0;
    const pz = options.z ?? 0;
    const dir = new THREE.Vector3(px, py, pz).normalize();
    mesh.position.copy(dir.multiplyScalar(4800));
    mesh.lookAt(new THREE.Vector3(0, 0, 0));
    mesh.scale.set(options.scale ?? 1, options.scale ?? 1, 1);

    pano.add(mesh);

    // Masquer si pas le pano actif au chargement
    if (pano !== currentPano) mesh.visible = false;

    (function loop() {
        requestAnimationFrame(loop);
        if (!mesh.visible) return;
        material.uniforms.time.value += 0.02;
    })();

    return mesh;
}

/* --- DRIP : goutte à goutte (à implémenter) --- */
function buildDripAnimation(options, pano) {

    const group = new THREE.Group();

    const dropCount = options.dropCount ?? 6;
    const dropColor = options.color ?? 0x4499ff;
    const spreadX = options.spreadX ?? 100;  // dispersion horizontale des gouttes
    const height = options.height ?? 400;  // hauteur de chute
    const dropSpeed = options.speed ?? 0.8;  // vitesse de chute (0-1, relatif)
    const dropSize = options.size ?? 18;   // rayon des gouttes

    // Créer les gouttes
    const drops = [];
    for (let i = 0; i < dropCount; i++) {

        const geo = new THREE.SphereGeometry(dropSize, 6, 6);
        const mat = new THREE.MeshBasicMaterial({
            color: dropColor,
            transparent: true,
            opacity: 0.85
        });
        const drop = new THREE.Mesh(geo, mat);

        // Position initiale aléatoire dans la colonne
        drop.userData.offsetX = (Math.random() - 0.5) * spreadX;
        drop.userData.phase = Math.random();        // décalage de phase (0-1)
        drop.userData.speed = dropSpeed * (0.7 + Math.random() * 0.6);
        drop.userData.delay = Math.random();        // délai avant apparition

        drop.position.set(drop.userData.offsetX, 0, 0);
        drop.visible = false;
        group.add(drop);
        drops.push(drop);
    }

    // Positionner le groupe
    const px = options.x ?? 0;
    const py = options.y ?? 0;
    const pz = options.z ?? 0;
    group.position.set(px, py, pz);
    group.lookAt(new THREE.Vector3(0, 0, 0));

    pano.add(group);

    // Masquer si pas le pano actif
    if (pano !== currentPano) group.visible = false;

    // Boucle d'animation
    let lastTime = performance.now();

    (function loop() {
        requestAnimationFrame(loop);
        if (!group.visible) return;

        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        drops.forEach(drop => {

            // Avancer la phase
            drop.userData.phase += dt * drop.userData.speed;

            // Délai d'apparition : la goutte n'existe pas encore
            if (drop.userData.phase < drop.userData.delay) {
                drop.visible = false;
                return;
            }

            // Phase normalisée entre 0 et 1 sur le cycle de chute
            const t = (drop.userData.phase - drop.userData.delay) % 1;

            // Apparition progressive en haut, disparition en bas
            drop.visible = true;
            drop.material.opacity = t < 0.1
                ? t / 0.1 * 0.85           // fade in
                : t > 0.85
                    ? (1 - t) / 0.15 * 0.85  // fade out
                    : 0.85;

            // Chute sur Y (de 0 vers -height) avec légère accélération
            drop.position.y = -(t * t) * height;
            drop.position.x = drop.userData.offsetX;

            // Légère ondulation horizontale
            drop.position.x += Math.sin(t * Math.PI * 3) * (options.wobble ?? 8);
        });
    })();

    // Retourner le group comme "icon" pour le masquage au clic
    return group;
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

function hideCheckmarks(list) { list.forEach(s => s.visible = false); }
function showCheckmarks(list) { list.forEach(s => s.visible = true); }

/* ACTIVER / DÉSACTIVER HOTSPOTS */
function activateHotspots(list) {
    list.forEach(h => {
        h.userData.active = true;
        h.raycast = THREE.Mesh.prototype.raycast;
        if (h.userData.icon && !h.userData.found) h.userData.icon.visible = true;
    });
}

function deactivateHotspots(list) { list.forEach(h => { h.userData.active = false; h.raycast = () => { }; }); }


/* ============================================================
   CRÉATION DES HOTSPOTS
   ============================================================ */

/* PANORAMA 1 */

// Fontaine
/*
createHotspot(pano1, hotspotsPano1, {
    w: 600, h: 1930,
    x: 3600, y: -1080, z: 2500,
    panelId: "EcoBaBoy",

    sound: {
        src: "assets/drip7.mp3",
        loop: true,
        volume: 1,
        refDistance: 1000,
        maxDistance: 2000,
        rolloffFactor: 3,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },

    animation: {
        type: "drip",
        x: 3500, y: -1050, z: 2500,  // position du point de fuite (haut)


        // Paramètres ajustables :
        dropCount: 3,       // nombre de gouttes simultanées
        height: 690,        // hauteur de chute en unités 3D
        speed: 0.5,         // vitesse (cycles par seconde)
        size: 18,           // rayon des gouttes
        spreadX: 80,       // dispersion horizontale
        wobble: 8,          // ondulation latérale pendant la chute
        color: 0x4499ff     // couleur des gouttes
    }
});
*/

// Fuite
createHotspot(pano1, hotspotsPano1, {
    w: 600, h: 100,
    x: 2405, y: 640, z: 250,
    panelId: "EcoBaBoy",

    sound: {
        src: "assets/drip7.mp3",
        loop: true,
        volume: 1,
        refDistance: 1000,
        maxDistance: 2000,
        rolloffFactor: 3,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },

    animation: {
        type: "drip",
        //   x: 3500, y: -1050, z: 2500,  // position du point de fuite (haut)
        x: 4810, y: 1272, z: 500,  // position du point de fuite (haut)

        // Paramètres ajustables :
        dropCount: 3,       // nombre de gouttes simultanées
        height: 690,        // hauteur de chute en unités 3D
        speed: 0.5,         // vitesse (cycles par seconde)
        size: 18,           // rayon des gouttes
        spreadX: 80,       // dispersion horizontale
        wobble: 8,          // ondulation latérale pendant la chute
        color: 0x4499ff     // couleur des gouttes
    }
});

// Air comprimée — avec son et animation shader wind
createHotspot(pano1, hotspotsPano1, {
    w: 600, h: 1930,
    x: 4501, y: -1600, z: -1200,
    panelId: "EcoBaBoy",
    sound: {
        src: "assets/fuite_air_comprimee.m4a",
        loop: true,
        volume: 0.6,
        refDistance: 200,
        maxDistance: 1000,
        rolloffFactor: 1.5,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },
    animation: {
        type: "wind",
        src: "assets/vent2.png",
        w: 2000, h: 1500,
        scale: 0.15,
        x: 5400, y: -1600, z: -1200,
        // Paramètres ajustables :
        speedX: 0.8,      // vitesse flux horizontal
        speedY: 0.0,      // vitesse flux vertical
        turbAmp: 0.05,    // amplitude des ondulations
        turbFreq: 10.0,   // fréquence des ondulations
        turbSpeed: 3.0,   // vitesse des ondulations
        opacity: 1.0
    }
});

// eclairage1
createHotspot(pano1, hotspotsPano1, {
    w: 1050, h: 60,
    x: -250, y: 430, z: 5,
    panelId: "EcoBaBoy",
    groupId: "groupe_eclairage_pano1",
    rotationX: 0, rotationY: 0, rotationZ: 6,
}
);

// eclairage2
createHotspot(pano1, hotspotsPano1, {
    w: 620, h: 25,
    x: -350, y: 255, z: -70,
    panelId: "EcoBaBoy",
    groupId: "groupe_eclairage_pano1",
    rotationX: 0, rotationY: 0, rotationZ: -6,
}
);

// eclairage3
createHotspot(pano1, hotspotsPano1, {
    w: 500, h: 25,
    x: -460, y: 170, z: -100,
    panelId: "EcoBaBoy",
    groupId: "groupe_eclairage_pano1",
    rotationX: 0, rotationY: 0, rotationZ: -3,
}
);

// climatisation1
createHotspot(pano1, hotspotsPano1, {
    w: 50, h: 50,
    x: 480, y: 95, z: -110,
    panelId: "EcoBaBoy",
    groupId: "climatisation_pano1"
}
);

// climatisation2
createHotspot(pano1, hotspotsPano1, {
    w: 50, h: 50,
    x: 460, y: 110, z: 190,
    panelId: "EcoBaBoy",
    groupId: "climatisation_pano1"
}
);

// Ventilateur
createHotspot(pano1, hotspotsPano1, {
    w: 65, h: 85,
    x: 431, y: 125, z: -215,
    panelId: "EcoBaBoy"
});

// déchets_sol
createHotspot(pano1, hotspotsPano1, {
    w: 45, h: 40,
    x: -235, y: -155, z: -410,
    panelId: "EcoBaBoy"
});

/* PANORAMA 2 */

// Déchets 1
createHotspot(pano2, hotspotsPano2, {
    w: 600, h: 1200,
    x: 3400, y: -1360, z: -3000,
    panelId: "pano2_dechets"
});

// Déchets 2
createHotspot(pano2, hotspotsPano2, {
    w: 1000, h: 1800,
    x: -2100, y: -1800, z: -1600,
    panelId: "pano2_dechets"
});

// Déchets 3
createHotspot(pano2, hotspotsPano2, {
    w: 1040, h: 500,
    x: -4190, y: -2580, z: 400,
    panelId: "pano2_dechets"
});


// Ventilateur
createHotspot(pano2, hotspotsPano2, {
    w: 600, h: 600,
    x: -4150, y: 660, z: 1292,
    panelId: "pano2_ventilateur"
});

// Ventilateur2
createHotspot(pano2, hotspotsPano2, {
    w: 730, h: 620,
    x: -1375, y: 691, z: -4543,
    panelId: "pano2_ventilateur"
});

// Air comprimée
createHotspot(pano2, hotspotsPano2, {
    w: 800, h: 1200,
    x: -1350, y: 1900, z: 3000,
    panelId: "pano2_air_comprimee1",


    sound: {
        src: "assets/fuite_air_comprimee.m4a",
        loop: true,
        volume: 0.6,
        refDistance: 200,
        maxDistance: 500,
        rolloffFactor: 1.6,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },
    animation: {
        type: "wind",
        src: "assets/vent2.png",
        w: 2000, h: 1500,
        scale: 0.15,
        x: -2320, y: 2772, z: 3586,
        // Paramètres ajustables :
        speedX: 0.8,      // vitesse flux horizontal
        speedY: 0.0,      // vitesse flux vertical
        turbAmp: 0.05,    // amplitude des ondulations
        turbFreq: 10.0,   // fréquence des ondulations
        turbSpeed: 3.0,   // vitesse des ondulations
        opacity: 1.0
    }
});

// climatisation
createHotspot(pano2, hotspotsPano2, {
    w: 500, h: 500,
    x: 4291, y: 1815, z: -508,
    panelId: "EcoBaBoy"
});

// outil
createHotspot(pano2, hotspotsPano2, {
    w: 1900, h: 800,
    x: -3705, y: 219, z: 3014,
    panelId: "pano2_air_comprimee2"
});

// éclairage1
createHotspot(pano2, hotspotsPano2, {
    w: 190, h: 30,
    x: -464, y: 176, z: 57,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2"
});

// éclairage2
createHotspot(pano2, hotspotsPano2, {
    w: 900, h: 40,
    x: -156, y: 413, z: -235,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 30, rotationY: 0, rotationZ: -60
});

// éclairage3
createHotspot(pano2, hotspotsPano2, {
    w: 28, h: 130,
    x: -384, y: 276, z: -162,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 0, rotationY: 0, rotationZ: -35
});

// éclairage4
createHotspot(pano2, hotspotsPano2, {
    w: 130, h: 20,
    x: -296, y: 172, z: -365,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 0, rotationY: 0, rotationZ: -20
});

// éclairage5
createHotspot(pano2, hotspotsPano2, {
    w: 100, h: 20,
    x: -183, y: 201, z: -419,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 0, rotationY: 0, rotationZ: -35
});

// éclairage6
createHotspot(pano2, hotspotsPano2, {
    w: 160, h: 20,
    x: -311, y: 235, z: 316,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 0, rotationY: 0, rotationZ: +25
});

// éclairage7
createHotspot(pano2, hotspotsPano2, {
    w: 170, h: 20,
    x: 486, y: 94, z: 73,
    panelId: "pano2_eclairage",
    groupId :"groupe_eclairage_pano2",
    rotationX: 0, rotationY: 0, rotationZ: 0
});

/* PANORAMA 3 */

// Ventilateur1
createHotspot(pano3, hotspotsPano3, {
    w: 640, h: 600,
    x: -4850, y: 890, z: -566,
    panelId: "EcoBaBoy"
});

// Ventilateur2
createHotspot(pano3, hotspotsPano3, {
    w: 640, h: 1200,
    x: 900, y: 1650, z: -4000,
    panelId: "EcoBaBoy",
    rotationX: 0, rotationY: 0, rotationZ: -9,
});

//Eclairage machine
createHotspot(pano3, hotspotsPano3, {
    w: 1200, h: 200,
    x: -2500, y: 1150, z: 1090,
    panelId: "EcoBaBoy",
    // groupId: "ecl",
    rotationX: -25, rotationY: 0, rotationZ: -10
});

// Air comprimée
createHotspot(pano3, hotspotsPano3, {
    w: 800, h: 800,
    x: -800, y: 3700, z: 1200,
    panelId: "EcoBaBoy",
    rotationX: -30, rotationY: 0, rotationZ: -9,


    sound: {
        src: "assets/fuite_air_comprimee.m4a",
        loop: true,
        volume: 0.6,
        refDistance: 200,
        maxDistance: 500,
        rolloffFactor: 1.6,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },
    animation: {
        type: "wind",
        src: "assets/vent2.png",
        w: 2000, h: 1500,
        scale: 0.15,
        x: -1096, y: 4077, z: 1200,
        // Paramètres ajustables :
        speedX: 0.8,      // vitesse flux horizontal
        speedY: 0.0,      // vitesse flux vertical
        turbAmp: 0.05,    // amplitude des ondulations
        turbFreq: 10.0,   // fréquence des ondulations
        turbSpeed: 3.0,   // vitesse des ondulations
        opacity: 1.0
    }

});

//fuite réseau incendie
createHotspot(pano3, hotspotsPano3, {
    w: 200, h: 30,
    x: 280, y: 310, z: 270,
    //x: -30, y: 410, z: 300,
    panelId: "pano3_fuite",
    // rotationX: 0, rotationY: 0, rotationZ: 2,
    rotationX: 10, rotationY: 10, rotationZ: 45,

    sound: {
        src: "assets/drip3.mp3",
        loop: true,
        volume: 0.15,
        refDistance: 20,
        maxDistance: 50,
        rolloffFactor: 1.5,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },

    animation: {
        type: "drip",
        x: 2833, y: 3125, z: 2684,  // position du point de fuite (haut)

        // Paramètres ajustables :
        dropCount: 1,       // nombre de gouttes simultanées
        height: 1000,        // hauteur de chute en unités 3D
        speed: 0.75,         // vitesse (cycles par seconde)
        size: 18,           // rayon des gouttes
        spreadX: 75,       // dispersion horizontale
        wobble: 8,          // ondulation latérale pendant la chute
        color: 0x4499ff     // couleur des gouttes
    }
});

// Déchets 
createHotspot(pano3, hotspotsPano3, {
    w: 1400, h: 2200,
    x: -1100, y: -2700, z: 2500,
    panelId: "pano3_dechets",
    rotationX: 0, rotationY: 0, rotationZ: 9,
});

//climatisation
createHotspot(pano3, hotspotsPano3, {
    w: 2000, h: 175,
    x: 0, y: 500, z: 0,
    panelId: "EcoBaBoy",
    rotationX: 0, rotationY: -0, rotationZ: 6.2
});

// Éclairage
createHotspot(pano3, hotspotsPano3, {
    w: 360, h: 90,
    x: 420, y: 147, z: 33,
    panelId: "EcoBaBoy",
    rotationX: 0, rotationY: 0, rotationZ: 0
});

// réglage pression
createHotspot(pano3, hotspotsPano3, {
    w: 160, h: 220,
    x: 60, y: -290, z: 400,
    panelId: "pano3_air_comprimee",
    rotationX: 0, rotationY: 0, rotationZ: 0
});



/* PANORAMA 4 */

// Radiant
createHotspot(pano4, hotspotsPano4, {
    w: 1330, h: 800,
    x: 1350, y: -900, z: -3000,
    panelId: "pano2_ventilateur"
});

// Éclairage
createHotspot(pano4, hotspotsPano4, {
    w: 3900, h: 2950,
    x: 500, y: -1950, z: 3000,
    panelId: "EcoBaBoy",
    groupId: "ecl",
    rotationX: -33, rotationY: 0, rotationZ: -6
});

// Fuite
createHotspot(pano4, hotspotsPano4, {
    w: 830, h: 600,
    x: 2750, y: -850, z: 2000,
    panelId: "pano4_fuite",

    sound: {
        src: "assets/drip4.mp3",
        loop: true,
        volume: 1.4,
        refDistance: 500,
        maxDistance: 3000,
        rolloffFactor: 1.5,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },

    animation: {
        type: "drip",
        x: 3912, y: -1000, z: 2950,  // position du point de fuite (haut)

        // Paramètres ajustables :
        dropCount: 1,       // nombre de gouttes simultanées
        height: 50,        // hauteur de chute en unités 3D
        speed: 0.3,         // vitesse (cycles par seconde)
        size: 18,           // rayon des gouttes
        spreadX: 40,       // dispersion horizontale
        wobble: 1,          // ondulation latérale pendant la chute
        color: 0x4499ff     // couleur des gouttes
    }
});

// Déchets pano4
createHotspot(pano4, hotspotsPano4, {
    w: 1200, h: 3100,
    x: -3800, y: -2420, z: 1300,
    panelId: "pano4_dechets",
    groupId: "dechets",
    rotationX: -5
});

// Réseau incendie
createHotspot(pano4, hotspotsPano4, {
    w: 7000, h: 200,
    x: 760, y: 2700, z: -3500,
    panelId: "pano4_fuite",
    groupId: "incendie",
    rotationX: 50,
    sound: {
        src: "assets/drip5.mp3",
        loop: true,
        volume: 1.2,
        refDistance: 500,
        maxDistance: 3000,
        rolloffFactor: 1.5,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },

    animation: {
        type: "drip",
        x: -158, y: 3082, z: -3926,  // position du point de fuite (haut)

        // Paramètres ajustables :
        dropCount: 2,       // nombre de gouttes simultanées
        height: 1200,        // hauteur de chute en unités 3D
        speed: 0.6,         // vitesse (cycles par seconde)
        size: 18,           // rayon des gouttes
        spreadX: 60,       // dispersion horizontale
        wobble: 3,          // ondulation latérale pendant la chute
        color: 0x4499ff     // couleur des gouttes
    }
});

// Éclairage hauteur 1
createHotspot(pano4, hotspotsPano4, {
    w: 3500, h: 400,
    x: 400, y: 1450, z: 1200,
    panelId: "EcoBaBoy",
    groupId: "eclairage_unique_peinture",
    rotationX: 31, rotationY: 0, rotationZ: 17
});

// Éclairage hauteur 2
createHotspot(pano4, hotspotsPano4, {
    w: 1300, h: 150,
    x: 1029, y: 529, z: -280,
    panelId: "EcoBaBoy",
    groupId: "eclairage_unique_peinture",
    rotationX: -5, rotationY: 0, rotationZ: 0,

});

// Éclairage hauteur 3
createHotspot(pano4, hotspotsPano4, {
    w: 600, h: 50,
    x: 60, y: 215, z: -447,
    panelId: "EcoBaBoy",
    groupId: "eclairage_unique_peinture",
    rotationX: 0, rotationY: 0, rotationZ: -6,

});

// Air comprimée
createHotspot(pano4, hotspotsPano4, {
    w: 80, h: 65,
    x: 85, y: 167, z: 459,
    panelId: "EcoBaBoy",
    rotationX: 0, rotationY: 0, rotationZ: 0,


    sound: {
        src: "assets/fuite_air_comprimee.m4a",
        loop: true,
        volume: 0.3,
        refDistance: 200,
        maxDistance: 500,
        rolloffFactor: 1.6,
        distanceModel: "inverse",
        cone: [120, 240, 0.4]
    },
    animation: {
        type: "wind",
        src: "assets/vent2.png",
        w: 2000, h: 1500,
        scale: 0.15,
        x: 1080, y: 1715, z: 4536,
        // Paramètres ajustables :
        speedX: 0.8,      // vitesse flux horizontal
        speedY: 0.0,      // vitesse flux vertical
        turbAmp: 0.05,    // amplitude des ondulations
        turbFreq: 10.0,   // fréquence des ondulations
        turbSpeed: 3.0,   // vitesse des ondulations
        opacity: 1.0
    }

});



/* ============================================================
   FONCTION createHotspot
   =========
   =================================================== */
function createHotspot(pano, list, options) {

    /* --- Mesh zone de détection --- */
    const geo = new THREE.PlaneGeometry(options.w, options.h);
    const mat = new THREE.MeshBasicMaterial({
        color: options.color || 0xff0000,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide,
        visible: debugMode
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(options.x, options.y, options.z);
    mesh.lookAt(new THREE.Vector3(0, 0, 0));

    if (options.rotationX) mesh.rotation.x += options.rotationX * Math.PI / 180;
    if (options.rotationY) mesh.rotation.y += options.rotationY * Math.PI / 180;
    if (options.rotationZ) mesh.rotation.z += options.rotationZ * Math.PI / 180;

    mesh.userData = {
        isClickable: true,
        active: true,
        panelId: options.panelId,
        groupId: options.groupId || null,
        pano: pano,
        found: false,
        sound: null,
        icon: null
    };

    // Enregistrer le groupe (compte pour 1 dans le compteur)
    if (options.groupId) {
        if (!groups[options.groupId]) {
            groups[options.groupId] = { found: false, checkmarkAdded: false, pano: pano };
            totalZones++;
        }
    } else {
        totalZones++;
    }

    /* --- Son lié à la zone (optionnel) --- */
    if (options.sound) {
        const zoneSound = new THREE.PositionalAudio(listener);
        const audioLoader = new THREE.AudioLoader();

        audioLoader.load(options.sound.src, (buffer) => {
            zoneSound.setBuffer(buffer);
            zoneSound.setLoop(options.sound.loop ?? true);
            zoneSound.setVolume(options.sound.volume ?? 0.5);
            zoneSound.setRefDistance(options.sound.refDistance ?? 800);
            zoneSound.setMaxDistance(options.sound.maxDistance ?? 8000);
            zoneSound.setRolloffFactor(options.sound.rolloffFactor ?? 1);
            if (options.sound.distanceModel) zoneSound.setDistanceModel(options.sound.distanceModel);
            if (options.sound.cone) zoneSound.setDirectionalCone(...options.sound.cone);

            // Buffer prêt : jouer immédiatement si on est déjà sur ce panorama
            if (currentPano === pano && !zoneSound.isPlaying && !mesh.userData.found) {
                zoneSound.play();
            }
        });

        const soundCarrier = new THREE.Mesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        soundCarrier.position.set(options.x, options.y, options.z);
        soundCarrier.add(zoneSound);
        pano.add(soundCarrier);

        pano.addEventListener('enter', () => { if (!zoneSound.isPlaying && !mesh.userData.found) zoneSound.play(); });
        pano.addEventListener('leave', () => { if (zoneSound.isPlaying) zoneSound.stop(); });

        mesh.userData.sound = zoneSound;
    }

    /* --- Icône animée avec pulse (optionnelle) --- */
    if (options.icon) {
        const iconTex = new THREE.TextureLoader().load(options.icon.src);
        const iconMat = new THREE.SpriteMaterial({ map: iconTex, transparent: true });
        const sprite = new THREE.Sprite(iconMat);

        const bx = options.icon.x ?? options.x;
        const by = options.icon.y ?? options.y;
        const bz = options.icon.z ?? options.z;
        sprite.position.set(bx, by, bz);

        const sw = options.icon.w ?? 400;
        const sh = options.icon.h ?? 400;
        sprite.scale.set(sw, sh, 1);
        sprite.userData.baseScaleX = sw;
        sprite.userData.baseScaleY = sh;

        pano.add(sprite);
        mesh.userData.icon = sprite;
        animatedIcons.push(sprite);
    }

    /* --- Animation shader (optionnelle) --- */
    if (options.animation) {
        const animMesh = buildAnimation(options.animation, pano);
        mesh.userData.icon = animMesh; // réutilise icon pour le masquage au clic
    }

    list.push(mesh);
    if (pano !== currentPano) {
        mesh.raycast = () => { };
        mesh.userData.active = false;
    }
    pano.add(mesh);
    return mesh;
}


/* ============================================================
   COMPTEUR PAR PANORAMA
   ============================================================ */

function updateCounter() {
    const allHotspots = [...hotspotsPano1, ...hotspotsPano2, ...hotspotsPano3, ...hotspotsPano4];

    // Zones individuelles (sans groupe) du pano courant
    const individualTotal = allHotspots.filter(h => !h.userData.groupId && h.userData.pano === currentPano).length;
    const individualFound = allHotspots.filter(h => !h.userData.groupId && h.userData.pano === currentPano && h.userData.found).length;

    // Groupes du pano courant
    const currentGroups = Object.values(groups).filter(g => g.pano === currentPano);
    const groupTotal = currentGroups.length;
    const groupFound = currentGroups.filter(g => g.found).length;

    const total = individualTotal + groupTotal;
    const found = individualFound + groupFound;

    document.getElementById("counter").innerText = `Zones trouvées : ${found} / ${total}`;
}


/* ============================================================
   RAYCASTER & GESTION DES CLICS
   ============================================================ */

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function handleSceneClick(event) {

    // Ignorer le clic si le panneau vient d'être fermé
    if (panelJustClosed) return;


    const rect = viewer.container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, viewer.camera);

    const intersects = raycaster.intersectObjects(viewer.scene.children, true);
    if (intersects.length === 0) return;

    const obj = intersects
        .map(i => i.object)
        .find(o => o.userData && o.userData.isClickable);

    if (!obj) return;

    if (obj.userData.isClickable && obj.userData.active) {

        const panel = PANELS[obj.userData.panelId];
        if (!panel) {
            console.warn("Panel introuvable :", obj.userData.panelId);
            return;
        }

        if (obj.userData.found) {
            showInfoPanel(panel.title, panel.text, panel.image, panel.logos || [], panel.media || null);
            return;
        }

        obj.userData.found = true;

        const gId = obj.userData.groupId;

        if (gId) {
            // Zone appartenant à un groupe
            const group = groups[gId];
            const isFirstOfGroup = !group.found;
            group.found = true;

            if (isFirstOfGroup) {
                // Première zone du groupe trouvée : on compte + on pose la coche
                foundZones++;
                updateCounter();

                const hit = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000));
                if (hit) {
                    addCheckMark(hit,
                        currentPano === pano1 ? 1 :
                            currentPano === pano2 ? 2 :
                                currentPano === pano3 ? 3 : 4
                    );
                    group.checkmarkAdded = true;
                }
            }
            // Si pas la première : pas de compteur, pas de coche

        } else {
            // Zone individuelle (pas de groupe)
            foundZones++;
            updateCounter();

            const hit = raycaster.ray.intersectSphere(new THREE.Sphere(new THREE.Vector3(0, 0, 0), 5000));
            if (hit) {
                addCheckMark(hit,
                    currentPano === pano1 ? 1 :
                        currentPano === pano2 ? 2 :
                            currentPano === pano3 ? 3 : 4
                );
            }
        }

        // Couper le son lié à la zone
        if (obj.userData.sound && obj.userData.sound.isPlaying) {
            obj.userData.sound.stop();
        }

        // Masquer l'icône/animation
        if (obj.userData.icon) {
            obj.userData.icon.visible = false;
        }

        showInfoPanel(panel.title, panel.text, panel.image, panel.logos || [], panel.media || null);
    }
}

/* DRAG VS CLIC */
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

    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(x, y), viewer.camera);

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

/* BOUTON IMAGE PRÉCÉDENTE (dupliqué ici pour compatibilité) */
document.getElementById("switchImagePrev").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (currentPano === pano4) {
        currentPano = pano3;
        viewer.setPanorama(pano3);
        deactivateHotspots(hotspotsPano4);
        activateHotspots(hotspotsPano3);
        hideCheckmarks(checkmarksPano4);
        showCheckmarks(checkmarksPano3);
        switchImage.style.display = "block";
        switchImage.innerText = "➡️ Image suivante";
        switchImagePrev.innerText = "⬅️ Image précédente";
        return;
    }

    if (currentPano === pano3) {
        currentPano = pano2;
        viewer.setPanorama(pano2);
        deactivateHotspots(hotspotsPano3);
        activateHotspots(hotspotsPano2);
        hideCheckmarks(checkmarksPano3);
        showCheckmarks(checkmarksPano2);
        switchImage.style.display = "block";
        return;
    }

    if (currentPano === pano2) {
        currentPano = pano1;
        viewer.setPanorama(pano1);
        deactivateHotspots(hotspotsPano2);
        activateHotspots(hotspotsPano1);
        hideCheckmarks(checkmarksPano2);
        showCheckmarks(checkmarksPano1);
        switchImage.style.display = "block";
        switchImage.innerText = "➡️ Image suivante";
        switchImagePrev.style.display = "none";
        return;
    }
});

/* DEBUG */
//const axes = new THREE.AxesHelper(1000);
//viewer.scene.add(axes);
