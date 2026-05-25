// Base de données des panneaux
// Chaque panneau a un tableau `media` : liste d'images et/ou vidéos affichées dans le carousel.
// Format d'un item :
//   { type: "image", src: "assets/mon_image.png", alt: "description optionnelle" }
//   { type: "video", src: "assets/ma_video.mp4", autoplay: false, muted: false }

window.PANELS = {

    // PANNEAU FONTAINE
    fontaine: {
        title: "Fontaine à eau",
        media: [
            { type: "image", src: "assets/panneau_fontaine.png", alt: "Fuite fontaine" }
            //{ type: "video", src: "assets/fuite_air.mp4" }
        ],
        found: false
    },

    // PANNEAU TRI DECHETS
    dechets: {
        title: "Déchets",
        media: [
            { type: "image", src: "assets/panneau_tri_dechets.png", alt: "Tri des déchets" }
           // { type: "image", src: "assets/Challenge5.png", alt: "Challenge 5" }
            // Exemple vidéo : { type: "video", src: "assets/video_dechets.mp4" }
        ],
        found: false
    },

    // PANNEAU VENTILATEUR
    ventilateur: {
        title: "Ventilateur",
        media: [
            { type: "image", src: "assets/panneau_ventilateur.png", alt: "Ventilateur inutile" }
           // { type: "image", src: "assets/Challenge4.png", alt: "Challenge 4" }
            // Exemple vidéo : { type: "video", src: "assets/video_ventilateur.mp4" }
        ],
        found: false
    },

    // PANNEAU AIR COMPRIMEE
    air_comprimee: {
        title: "Air Comprimée",
        media: [
            { type: "image", src: "assets/panneau_air_comprimee1.png", alt: "Air comprimée" },
            { type: "image", src: "assets/panneau_air_comprimee2.png", alt: "Air comprimée" },
            { type: "video", src: "assets/video_air_comprimee.mp4", autoplay: false }
        ],
        found: false
    },

    // PANNEAU RADIANT
    radiant: {
        title: "Radiant",
        media: [
            { type: "image", src: "assets/Image_Ventilateur.png", alt: "Radiant" }
        ],
        found: false
    },

    // PANNEAU FUITE
    fuite: {
        title: "Fuite réseau incendie",
        media: [
            { type: "image", src: "assets/Image_Fontaine_Fuite.png", alt: "Fuite réseau" }
        ],
        found: false
    },

    //ECLAIRAGE
    eclairage: {
        title: "eclairage",
        media: [
            { type: "image", src: "assets/panneau_eclairage.png", alt: "eclairage" }
        ],
        found: false
    },


    //CLIMATISATION
        climatisation: {
        title: "Climatisation",
        media: [
            { type: "image", src: "assets/Image_Fontaine_Fuite.png", alt: "Fuite réseau" }
        ],
        found: false
    }
};
