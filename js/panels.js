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
        },






        /*--------------------
        --------PANO1---------
        --------------------*/

        // FUITE EAU
        fuite_pano1: {
            title: "fuite",
            media: [
                { type: "image", src: "assets/fuite_pano1_1.png", alt: "Fuite fontaine" }
                //{ type: "video", src: "assets/fuite_air.mp4" }
            ],
            found: false
         },

         // PANNEAU TRI DECHETS
         dechets_pano1: {
            title: "Déchets",
            media: [
                { type: "image", src: "assets/dechets_pano1_1.png", alt: "Tri des déchets" }
             ],
            found: false
          },

         // PANNEAU VENTILATEUR
         ventilateur_pano1: {
            title: "Ventilateur",
            media: [
                { type: "image", src: "assets/ventilateur_pano1_1.png", alt: "Ventilateur inutile" }
             ],
             found: false
          },

        // PANNEAU AIR COMPRIMEE
        air_comprimee_pano1: {
            title: "Air Comprimée",
            media: [
                { type: "image", src: "assets/air_comprimee_pano1_1.png", alt: "Air comprimée" },
                { type: "image", src: "assets/air_comprimee_pano1_2.png", alt: "Air comprimée" },
                { type: "video", src: "assets/video_air_comprimee.mp4", autoplay: false }
            ],
            found: false
        },

        //ECLAIRAGE
        eclairage_pano1: {
            title: "eclairage",
            media: [
                { type: "image", src: "assets/eclairage_pano1_1.png", alt: "eclairage" }
            ],
            found: false
        },

        //CLIMATISATION
        climatisation_pano1: {
            title: "Climatisation",
            media: [
                { type: "image", src: "assets/climatisation_pano1_1.png", alt: "Fuite réseau" }
            ],
            found: false
        },


       /*--------------------
       --------PANO2---------
       --------------------*/

        // FUITE EAU
        fuite_pano2: {
        title: "fuite",
        media: [
            { type: "image", src: "assets/fuite_pano2_1.png", alt: "Fuite fontaine" }
            //{ type: "video", src: "assets/fuite_air.mp4" }
        ],
        found: false
    },

    // PANNEAU TRI DECHETS
    dechets_pano2: {
        title: "Déchets",
        media: [
            { type: "image", src: "assets/dechets_pano2_1.png", alt: "Tri des déchets" }
        ],
        found: false
    },

    // PANNEAU VENTILATEUR
    ventilateur_pano2: {
        title: "Ventilateur",
        media: [
            { type: "image", src: "assets/ventilateur_pano2_1.png", alt: "Ventilateur inutile" }
        ],
        found: false
    },

    // PANNEAU AIR COMPRIMEE
    air_comprimee_pano2: {
        title: "Air Comprimée",
        media: [
            { type: "image", src: "assets/air_comprimee_pano2_1.png", alt: "Air comprimée" },
            { type: "image", src: "assets/air_comprimee_pano2_2.png", alt: "Air comprimée" },
            { type: "video", src: "assets/video_air_comprimee.mp4", autoplay: false }
        ],
        found: false
    },

    //ECLAIRAGE
    eclairage_pano2: {
        title: "eclairage",
        media: [
            { type: "image", src: "assets/eclairage_pano2_1.png", alt: "eclairage" }
        ],
        found: false
    },

    //CLIMATISATION
    climatisation_pano2: {
        title: "Climatisation",
        media: [
            { type: "image", src: "assets/climatisation_pano2_1.png", alt: "Fuite réseau" }
        ],
        found: false
    },


        /*--------------------
        --------PANO3---------
        --------------------*/


        // FUITE EAU
        fuite_pano3: {
        title: "fuite",
        media: [
            { type: "image", src: "assets/fuite_pano3_1.png", alt: "Fuite fontaine" }
            //{ type: "video", src: "assets/fuite_air.mp4" }
        ],
        found: false
    },

    // PANNEAU TRI DECHETS
    dechets_pano3: {
        title: "Déchets",
        media: [
            { type: "image", src: "assets/dechets_pano3_1.png", alt: "Tri des déchets" }
        ],
        found: false
    },

    // PANNEAU VENTILATEUR
    ventilateur_pano3: {
        title: "Ventilateur",
        media: [
            { type: "image", src: "assets/ventilateur_pano3_1.png", alt: "Ventilateur inutile" }
        ],
        found: false
    },

    // PANNEAU AIR COMPRIMEE
    air_comprimee_pano3: {
        title: "Air Comprimée",
        media: [
            { type: "image", src: "assets/air_comprimee_pano3_1.png", alt: "Air comprimée" },
            { type: "image", src: "assets/air_comprimee_pano3_2.png", alt: "Air comprimée" },
            { type: "video", src: "assets/video_air_comprimee.mp4", autoplay: false }
        ],
        found: false
    },

    //ECLAIRAGE
    eclairage_pano3: {
        title: "eclairage",
        media: [
            { type: "image", src: "assets/eclairage_pano3_1.png", alt: "eclairage" }
        ],
        found: false
    },

    //CLIMATISATION
    climatisation_pano3: {
        title: "Climatisation",
        media: [
            { type: "image", src: "assets/climatisation_pano3_1.png", alt: "Fuite réseau" }
        ],
        found: false
    },


        /*--------------------
        --------PANO4---------
        --------------------*/





        // FUITE EAU
        fuite_pano4: {
        title: "fuite",
        media: [
            { type: "image", src: "assets/fuite_pano4_1.png", alt: "Fuite fontaine" }
            //{ type: "video", src: "assets/fuite_air.mp4" }
        ],
        found: false
    },

    // PANNEAU TRI DECHETS
    dechets_pano4: {
        title: "Déchets",
        media: [
            { type: "image", src: "assets/dechets_pano4_1.png", alt: "Tri des déchets" }
        ],
        found: false
    },

    // PANNEAU VENTILATEUR
    ventilateur_pano4: {
        title: "Ventilateur",
        media: [
            { type: "image", src: "assets/ventilateur_pano4_1.png", alt: "Ventilateur inutile" }
        ],
        found: false
    },

    // PANNEAU AIR COMPRIMEE
    air_comprimee_pano4: {
        title: "Air Comprimée",
        media: [
            { type: "image", src: "assets/air_comprimee_pano4_1.png", alt: "Air comprimée" },
            { type: "image", src: "assets/air_comprimee_pano4_2.png", alt: "Air comprimée" },
            { type: "video", src: "assets/video_air_comprimee.mp4", autoplay: false }
        ],
        found: false
    },

    //ECLAIRAGE
    eclairage_pano4: {
        title: "eclairage",
        media: [
            { type: "image", src: "assets/eclairage_pano4_1.png", alt: "eclairage" }
        ],
        found: false
    },

    //CLIMATISATION
    climatisation_pano4: {
        title: "Climatisation",
        media: [
            { type: "image", src: "assets/climatisation_pano4_1.png", alt: "Fuite réseau" }
        ],
        found: false
    }









};
