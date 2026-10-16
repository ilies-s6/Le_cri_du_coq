/* =========================================================
   ACTIVITÉ DE RÉINTÉGRATION — Épisode 1
   ---------------------------------------------------------
   activities : activités proposées (teams = avec équipes, competitive = compétition)
   roles      : rôles attribuables
   advice     : ce que le joueur a appris (affiché dans l'écran d'organisation)
   rules      : conséquences. Toutes les règles dont la condition est vraie s'appliquent,
                dans l'ordre (stop: true arrête la lecture).
                integ = points de réintégration (total ramené entre 0 et 20)
                cohesion = cohésion du groupe · bubble = réplique jouée pendant l'activité
     Conditions possibles : activity, invited, notInvited, role:{id:[rôles]},
     notRole, sameTeam:[a,b], notSameTeam, together:[a,b] (même équipe ou activité
     sans équipe), competitive, teams, minInvited, maxInvited, state:{condition du jeu}
   ========================================================= */
(function () {
  var LIMITS = { any: [{ flag: 'renard_limites' }, { flag: 'adult_informed' }] };

  CDC.ep('ep1').event = {
    participants: ['agneau', 'renard', 'cochon', 'cheval', 'chien'],
    teamNames: { A: '🔵 Équipe Bleue', B: '🟠 Équipe Orange' },

    activities: {
      tournoi: { label: 'Tournoi de basket', icon: '🏀', teams: true, competitive: true,
        desc: 'Des matchs dans la cour, un classement, un vainqueur. Amusant… mais chaque raté se voit.' },
      chasse: { label: 'Rallye-énigmes', icon: '🧩', teams: true,
        desc: 'Des énigmes cachées dans tout le collège, à résoudre en équipe. Il faut s\'écouter pour avancer.' },
      atelier: { label: 'Fresque du hall', icon: '🎨', teams: false,
        desc: 'Peindre ensemble une grande fresque pour le hall. Chacun y met sa touche, sans gagnant ni perdant.' }
    },

    roles: [
      { id: 'participant', label: 'Participant', desc: '' },
      { id: 'organisateur', label: 'Organisateur', desc: 'prépare et explique les règles, très exposé' },
      { id: 'capitaine', label: 'Capitaine', desc: 'mène son équipe, sous le regard de tous' },
      { id: 'chercheur', label: 'Chercheur', desc: 'résout les énigmes, trouve les indices' },
      { id: 'constructeur', label: 'Constructeur', desc: 'dessine, fabrique, construit' },
      { id: 'observateur', label: 'Observateur', desc: 'veille au bon déroulement, sans jouer' }
    ],

    advice: [
      { if: { flag: 'info_agneau' }, who: 'agneau', text: '« Pas un truc où on compte les points. J\'aime les énigmes, chercher, dessiner. Je préfère que Nina soit là. »' },
      { if: { flag: 'info_chien' }, who: 'chien', text: '« Avec Maxence, dans un truc où il faut gagner, ça va mal finir. L\'exclure ne règle rien : il faut lui poser des limites. »' },
      { if: { flag: 'info_cheval' }, who: 'cheval', text: '« Les tournois finissent toujours en moqueries. Donne-moi un rôle pour garder un œil sur tout le monde. »' },
      { if: { flag: 'info_cochon' }, who: 'cochon', text: '« Avec Maxence, je fais n\'importe quoi. Mets-moi loin de lui. »' },
      { if: { flag: 'cochon_excuses' }, who: 'cochon', text: 'Il voudrait s\'excuser auprès de Milo.' },
      { if: { flag: 'adult_informed' }, who: 'chouette', text: 'Elle est au courant et passera pendant l\'activité.' },
      { if: { flag: 'renard_limites' }, who: 'renard', text: 'Tu lui as posé des limites. Il a semblé entendre.' },
      { if: { flag: 'renard_humilie' }, who: 'renard', text: 'Tu l\'as menacé. Il est sur la défensive.' }
    ],

    // Positions pendant la mise en scène, dans la cour (en cases)
    stage: {
      camera: [27, 27.5],
      coq: [27, 30.5, 'up'],
      teamA: [[23.2, 26, 'right'], [23.2, 28.6, 'right'], [22.2, 27.3, 'right']],
      teamB: [[31, 26, 'left'], [31, 28.6, 'left'], [32, 27.3, 'left']],
      together: [[23.4, 26.4, 'right'], [25.5, 25.6, 'down'], [28.5, 25.6, 'down'], [30.6, 26.4, 'left'], [27, 28, 'up']],
      adult: [27, 24.2, 'down']
    },

    endBubbles: {
      good: 'Merci, Noé. C\'était… vraiment bien.',
      mid: '(C\'était mieux que d\'habitude… un peu.)',
      bad: '(J\'aurais préféré rester au CDI, tranquille.)'
    },

    rules: [
      // --- L'agneau doit être là ! ---
      { if: { notInvited: ['agneau'] }, integ: -50, cohesion: -3, stop: true,
        text: 'Milo n\'était pas invité. Depuis la fenêtre du CDI, il entend les rires dans la cour. L\'activité s\'est faite… sans lui.' },

      // --- Base selon l'activité ---
      { if: { activity: 'tournoi' }, integ: 3,
        text: 'Le tournoi démarre dans les cris et les encouragements. C\'est fun… mais chaque panier raté se voit, et la pression monte vite.' },
      { if: { activity: 'chasse' }, integ: 8, cohesion: 2,
        text: 'Les équipes déplient leur feuille de route et filent du CDI au jardin. Pour avancer, il faut s\'écouter.' },
      { if: { activity: 'atelier' }, integ: 7, cohesion: 3,
        text: 'Tout le monde s\'installe autour des grands panneaux pour peindre la fresque du hall. Pas de gagnant, pas de perdant.' },

      // --- Le rôle de l'agneau ---
      { if: { activity: 'chasse', role: { agneau: 'chercheur' } }, integ: 6,
        text: 'Chercheur, Milo connaît chaque recoin du collège : il a même dessiné son plan. C\'est lui qui trouve l\'énigme décisive ! Son équipe l\'acclame.',
        bubble: { who: 'agneau', text: 'Par ici ! Je sais où c\'est !' } },
      { if: { activity: 'atelier', role: { agneau: 'constructeur' } }, integ: 6,
        text: 'Milo dessine l\'esquisse de la fresque. Les autres découvrent à quel point il dessine bien.',
        bubble: { who: 'cochon', text: 'Wouah, c\'est toi qui as dessiné ça ?' } },
      { if: { activity: ['chasse', 'atelier'], role: { agneau: 'organisateur' }, state: { min: { trust_agneau: 3 } } }, integ: 5,
        text: 'Organisateur, Milo explique les règles d\'une petite voix… puis de plus en plus fort. Il prend confiance.',
        bubble: { who: 'agneau', text: 'Alors… chaque équipe a une feuille de route. Allez-y !' } },
      { if: { activity: ['chasse', 'atelier'], role: { agneau: ['chercheur', 'constructeur'] }, not: { any: [{ activity: 'chasse', role: { agneau: 'chercheur' } }, { activity: 'atelier', role: { agneau: 'constructeur' } }] } }, integ: 2,
        text: 'Milo participe à sa façon, discrètement, mais il participe.' },
      { if: { activity: 'tournoi', role: { agneau: 'capitaine' } }, integ: -3,
        text: 'Capitaine en plein tournoi, Milo sent tous les regards sur lui à chaque point perdu.' },
      { if: { role: { agneau: 'observateur' } }, integ: -3,
        text: 'Observateur, Milo regarde les autres jouer… sur le côté, comme avant.' },
      { if: { role: { agneau: ['organisateur', 'capitaine'] }, state: { max: { trust_agneau: 2 } } }, integ: -3,
        text: 'Ce rôle était trop exposé pour Milo : il n\'avait pas encore assez confiance. Ce n\'est pas sa faute, il aurait fallu d\'abord gagner sa confiance.' },

      // --- Le renard ---
      { if: { notInvited: ['renard'] }, integ: -3, cohesion: -4, flag: 'non_resolu',
        text: 'Sans Maxence, Milo respire. Mais Maxence, vexé, raconte partout que l\'activité était « nulle ». Le problème n\'est pas réglé : il est juste mis de côté.' },
      { if: { activity: 'tournoi', sameTeam: ['agneau', 'renard'] }, integ: -7, cohesion: -2,
        text: 'Dès le premier match, Maxence soupire à chaque raté de Milo. Les rires moqueurs reviennent. La tension est énorme.',
        bubble: { who: 'renard', text: 'Sérieux ? Même ça, tu le rates ?' } },
      { if: { activity: 'chasse', sameTeam: ['agneau', 'renard'], not: { state: LIMITS } }, integ: -4,
        text: 'Dans la même équipe, Maxence prend toutes les décisions et ignore les idées de Milo.',
        bubble: { who: 'renard', text: 'Laisse, je m\'en occupe. Toi, suis-nous.' } },
      { if: { activity: 'chasse', sameTeam: ['agneau', 'renard'], state: LIMITS }, integ: 1,
        text: 'Dans la même équipe, Maxence se tient correctement. Il écoute même une idée de Milo… du bout des oreilles.' },
      { if: { invited: ['renard'], notSameTeam: ['agneau', 'renard'], state: LIMITS }, integ: 1, cohesion: 3,
        text: 'Maxence joue le jeu. Des limites ont été posées : il sait que tout le monde veille.' },
      { if: { invited: ['renard'], competitive: true, not: { state: LIMITS } }, integ: -2, cohesion: -1,
        text: 'Personne ne lui a posé de limites : Maxence lance des piques d\'une équipe à l\'autre.',
        bubble: { who: 'renard', text: 'Hé, Bêêêlo, tu veux un mouchoir ?' } },
      { if: { invited: ['renard'], competitive: false, not: { state: LIMITS } }, integ: -1,
        text: 'Maxence lâche une ou deux remarques. Rien de « grave »… mais Milo se crispe.' },
      { if: { role: { renard: ['capitaine', 'organisateur'] }, not: { state: { flag: 'renard_limites' } } }, integ: -2, cohesion: -2,
        text: 'Avec un rôle de chef et aucune limite posée, Maxence décide de tout… et de qui compte.' },
      { if: { role: { renard: ['capitaine', 'organisateur'] }, state: { flag: 'renard_limites' } }, cohesion: 1,
        text: 'Responsabilisé, Maxence prend son rôle au sérieux. Il sait qu\'on compte sur lui pour être juste.' },
      { if: { invited: ['renard'], state: { flag: 'renard_humilie' } }, cohesion: -2,
        text: 'Encore vexé d\'avoir été menacé, Maxence boude et fait des commentaires à voix basse.' },

      // --- Le chien ---
      { if: { together: ['agneau', 'chien'] }, integ: 3,
        text: 'Nina reste près de Milo. Avec une alliée à côté, c\'est plus facile d\'oser.',
        bubble: { who: 'chien', text: 'T\'inquiète, je suis là.' } },
      { if: { notInvited: ['chien'] }, integ: -2,
        text: 'Nina n\'était pas là. Milo cherche du regard un visage rassurant.' },

      // --- Le cheval ---
      { if: { role: { cheval: 'observateur' }, state: { flag: 'cheval_engage' } }, integ: 1, cohesion: 3,
        text: 'Observatrice, Inès veille. À la première remarque déplacée, elle dit calmement « Stop. » Et ça marche.',
        bubble: { who: 'cheval', text: 'Stop. Ça, c\'est pas drôle.' } },
      { if: { invited: ['cheval'], notRole: { cheval: 'observateur' } }, cohesion: 1,
        text: 'Inès participe et encourage tout le monde.' },
      { if: { notInvited: ['cheval'] }, cohesion: -1,
        text: 'Inès n\'était pas là. Dommage : elle voulait se rattraper.' },

      // --- Le cochon ---
      { if: { competitive: true, sameTeam: ['cochon', 'renard'] }, integ: -2,
        text: 'Dans l\'équipe de Maxence, Hugo retombe dans ses vieilles habitudes et rit à ses « blagues ».' },
      { if: { invited: ['cochon'], notSameTeam: ['cochon', 'renard'], state: { flag: 'cochon_excuses' } }, integ: 3, cohesion: 1,
        text: 'Loin de Maxence, Hugo s\'excuse auprès de Milo, maladroitement mais sincèrement. Milo lui sourit.',
        bubble: { who: 'cochon', text: 'Pardon pour samedi… C\'était nul de ma part.' } },
      { if: { notInvited: ['cochon'] }, cohesion: -1,
        text: 'Hugo n\'était pas invité. Il se sent mis de côté à son tour…' },

      // --- Les adultes et le groupe ---
      { if: { state: { flag: 'adult_informed' } }, integ: 1, cohesion: 2,
        text: 'Mme Chouette passe régulièrement. Tout le monde sait qu\'un adulte est au courant et veille.',
        bubble: { who: 'chouette', text: 'Tout se passe bien, ici ?' } },
      { if: { maxInvited: 2 }, cohesion: -2,
        text: 'Avec si peu de monde, l\'activité manque d\'ambiance.' },
      { if: { minInvited: 5, state: LIMITS }, cohesion: 1,
        text: 'Tout le groupe est réuni, avec des règles claires : c\'est une vraie activité commune.' }
    ]
  };
})();
