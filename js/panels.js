// Base de données des panneaux
window.PANELS = {

    fontaine: {
        title: "Fontaine à eau",
        text: `L’eau potable est une ressource industrielle à préserver.
Une simple fuite peut représenter des centaines de litres gaspillés par jour.
    Chacun est acteur de la maîtrise des consommations, de la durabilité du site et du respect de nos engagements environnementaux.
Une fuite peut provoquer un risque d’accident.

Signaler immédiatement toute fuite à la maintenance.
`,
        image: "assets/Image_Fontaine_Fuite.png",
        logos: [
            "assets/Challenge4.png",
            "assets/EcoBaboy.png"
        ],
        found: false
    },

    dechets: {   // ⚠️ sans accent pour correspondre à panelId
        title: "Déchets",
        text: `Le tri des déchets : un geste simple, un impact majeur
 Le tri des déchets permet :

	=> la valorisation des matières recyclables,
	=> La réduction des déchets ultimes,
	=> La maîtrise des couts de traitement,
	=> Le respect des exigences réglementaires et environnementales

Mal trier, c’est compromettre toute la chaine de recyclage et annuler les efforts collectifs.

     `,
        image: "assets/Image_Dechets.png",
        logos: [
            "assets/Challenge5.png",
            "assets/EcoBaboy.png"
        ],
        found: false
    },

    ventilateur: {
        title: "Ventilateur",
        text: `L’ utilisation d’un ventilateur sur ligne hors période de production génère une surconsommation électrique (Muda énergétique)
        Chaque ventilateur consomme jusqu’à 300W par heure de fonctionnement.
        Appliquons le pilier STOP de l’ESCO en arrêtant les équipements inutiles hors période de production ou si je n’en ai pas besoin

        Pas de production = pas de fonctionnement inutile
Avant de quitter votre poste ou lors d’un arrêt de production, pensez à vérifier :
✅ L’équipement est-il nécessaire ?
✅ Peut-il être arrêté en sécurité ?
Chaque arrêt utile contribue à la performance, à la sécurité et à la durabilité du site.

`,
        image: "assets/Image_Ventilateur.png",
        logos: [
            "assets/Challenge4.png",
            "assets/EcoBaboy.png"
        ],
        found: false
    }

};
