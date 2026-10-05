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
    teamNames: { A: '🪶 Plumes', B: '🐾 Sabots' },

    activities: {
      tournoi: { label: 'Tournoi', icon: '🏆', teams: true, competitive: true,
        desc: 'Des matchs, un classement, un vainqueur. Amusant... mais chaque erreur se voit.' },
      chasse: { label: 'Chasse au trésor', icon: '🗺️', teams: true,
        desc: 'Des énigmes à résoudre en équipe, partout dans la ferme. Il faut s\'écouter pour avancer.' },
      atelier: { label: 'Atelier créatif', icon: '🎨', teams: false,
        desc: 'Créer ensemble une grande fresque de la ferme. Chacun y met sa touche, sans gagnant ni perdant.' }
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
      { if: { flag: 'info_agneau' }, who: 'agneau', text: '« Pas un truc où on compte les points. J\'aime les énigmes, chercher, dessiner. Je préfère que le chien soit là. »' },
      { if: { flag: 'info_chien' }, who: 'chien', text: '« Avec le renard, dans un truc où il faut gagner, ça va mal finir. L\'exclure ne règle rien : il faut lui poser des limites. »' },
      { if: { flag: 'info_cheval' }, who: 'cheval', text: '« Les tournois finissent toujours en moqueries. Donne-moi un rôle pour garder un œil sur tout le monde. »' },
      { if: { flag: 'info_cochon' }, who: 'cochon', text: '« Avec le renard, je fais n\'importe quoi. Mets-moi loin de lui. »' },
      { if: { flag: 'cochon_excuses' }, who: 'cochon', text: 'Il voudrait s\'excuser auprès de l\'agneau.' },
      { if: { flag: 'adult_informed' }, who: 'chouette', text: 'La Chouette est au courant et passera pendant l\'activité.' },
      { if: { flag: 'renard_limites' }, who: 'renard', text: 'Tu lui as posé des limites. Il a semblé entendre.' },
      { if: { flag: 'renard_humilie' }, who: 'renard', text: 'Tu l\'as menacé. Il est sur la défensive.' }
    ],

    // Positions pendant la mise en scène (en cases)
    stage: {
      camera: [33, 40],
      coq: [33, 43.5, 'up'],
      teamA: [[29.6, 38.6, 'right'], [29.6, 42.6, 'right'], [28.6, 40.6, 'right']],
      teamB: [[38.5, 39.5, 'left'], [38.5, 41.8, 'left'], [36.7, 40.6, 'left']],
      together: [[29, 39.2, 'right'], [31.5, 38.6, 'down'], [34, 38.6, 'down'], [36.5, 39.2, 'left'], [33, 41.2, 'up']],
      adult: [35.5, 36.2, 'down']
    },

    endBubbles: {
      good: 'Merci, Coq. C\'était... vraiment bien.',
      mid: '(C\'était mieux que d\'habitude... un peu.)',
      bad: '(J\'aurais préféré rester au coin tranquille.)'
    },

    rules: [
      // --- L'agneau doit être là ! ---
      { if: { notInvited: ['agneau'] }, integ: -50, cohesion: -3, stop: true,
        text: 'L\'agneau n\'était pas invité. Depuis le coin tranquille, il entend les rires au loin. L\'activité s\'est faite... sans lui.' },

      // --- Base selon l'activité ---
      { if: { activity: 'tournoi' }, integ: 3,
        text: 'Le tournoi démarre dans les cris et les encouragements. C\'est fun... mais chaque erreur se voit, et la pression monte vite.' },
      { if: { activity: 'chasse' }, integ: 8, cohesion: 2,
        text: 'Les équipes se penchent sur les énigmes et se dispersent dans la ferme. Pour avancer, il faut s\'écouter.' },
      { if: { activity: 'atelier' }, integ: 7, cohesion: 3,
        text: 'Tout le monde s\'installe autour des tables pour peindre une grande fresque de la ferme. Pas de gagnant, pas de perdant.' },

      // --- Le rôle de l'agneau ---
      { if: { activity: 'chasse', role: { agneau: 'chercheur' } }, integ: 6,
        text: 'Chercheur, l\'agneau connaît chaque recoin de la ferme. C\'est lui qui trouve l\'indice décisif ! Son équipe l\'acclame.',
        bubble: { who: 'agneau', text: 'Par ici ! Je sais où c\'est !' } },
      { if: { activity: 'atelier', role: { agneau: 'constructeur' } }, integ: 6,
        text: 'L\'agneau dessine le plan de la fresque. Les autres découvrent à quel point il dessine bien.',
        bubble: { who: 'cochon', text: 'Wouah, c\'est toi qui as dessiné ça ?' } },
      { if: { activity: ['chasse', 'atelier'], role: { agneau: 'organisateur' }, state: { min: { trust_agneau: 3 } } }, integ: 5,
        text: 'Organisateur, l\'agneau explique les règles d\'une petite voix... puis de plus en plus fort. Il prend confiance.',
        bubble: { who: 'agneau', text: 'Alors... chaque équipe a une carte. Allez-y !' } },
      { if: { activity: ['chasse', 'atelier'], role: { agneau: ['chercheur', 'constructeur'] }, not: { any: [{ activity: 'chasse', role: { agneau: 'chercheur' } }, { activity: 'atelier', role: { agneau: 'constructeur' } }] } }, integ: 2,
        text: 'L\'agneau participe à sa façon, discrètement, mais il participe.' },
      { if: { activity: 'tournoi', role: { agneau: 'capitaine' } }, integ: -3,
        text: 'Capitaine en plein tournoi, l\'agneau sent tous les regards sur lui à chaque point perdu.' },
      { if: { role: { agneau: 'observateur' } }, integ: -3,
        text: 'Observateur, l\'agneau regarde les autres jouer... sur le côté, comme avant.' },
      { if: { role: { agneau: ['organisateur', 'capitaine'] }, state: { max: { trust_agneau: 2 } } }, integ: -3,
        text: 'Ce rôle était trop exposé pour lui. Il n\'avait pas encore assez confiance. Il aurait fallu d\'abord gagner sa confiance.' },

      // --- Le renard ---
      { if: { notInvited: ['renard'] }, integ: -3, cohesion: -4, flag: 'non_resolu',
        text: 'Sans le renard, l\'agneau respire. Mais le renard, vexé, raconte partout que l\'activité était « nulle ». Le problème n\'est pas réglé : il est juste mis de côté.' },
      { if: { activity: 'tournoi', sameTeam: ['agneau', 'renard'] }, integ: -7, cohesion: -2,
        text: 'Dès la première manche, le renard soupire à chaque erreur de l\'agneau. Les rires moqueurs reviennent. La tension est énorme.',
        bubble: { who: 'renard', text: 'Sérieux ? Même ça, tu le rates ?' } },
      { if: { activity: 'chasse', sameTeam: ['agneau', 'renard'], not: { state: LIMITS } }, integ: -4,
        text: 'Dans la même équipe, le renard prend toutes les décisions et ignore les idées de l\'agneau.',
        bubble: { who: 'renard', text: 'Laisse, je m\'en occupe. Toi, suis-nous.' } },
      { if: { activity: 'chasse', sameTeam: ['agneau', 'renard'], state: LIMITS }, integ: 1,
        text: 'Dans la même équipe, le renard se tient correctement. Il écoute même une idée de l\'agneau... du bout des oreilles.' },
      { if: { invited: ['renard'], notSameTeam: ['agneau', 'renard'], state: LIMITS }, integ: 1, cohesion: 3,
        text: 'Le renard joue le jeu. Des limites ont été posées : il sait que tout le monde veille.' },
      { if: { invited: ['renard'], competitive: true, not: { state: LIMITS } }, integ: -2, cohesion: -1,
        text: 'Personne ne lui a posé de limites : le renard lance des piques d\'une équipe à l\'autre.',
        bubble: { who: 'renard', text: 'Hé, la Laine Molle, tu veux un coussin pour pleurer ?' } },
      { if: { invited: ['renard'], competitive: false, not: { state: LIMITS } }, integ: -1,
        text: 'Le renard lâche une ou deux remarques. Rien de grave... mais l\'agneau se crispe.' },
      { if: { role: { renard: ['capitaine', 'organisateur'] }, not: { state: { flag: 'renard_limites' } } }, integ: -2, cohesion: -2,
        text: 'Avec un rôle de chef et aucune limite posée, le renard décide de tout... et de qui compte.' },
      { if: { role: { renard: ['capitaine', 'organisateur'] }, state: { flag: 'renard_limites' } }, cohesion: 1,
        text: 'Responsabilisé, le renard prend son rôle au sérieux. Il sait qu\'on compte sur lui pour être juste.' },
      { if: { invited: ['renard'], state: { flag: 'renard_humilie' } }, cohesion: -2,
        text: 'Encore vexé d\'avoir été menacé, le renard boude et fait des commentaires à voix basse.' },

      // --- Le chien ---
      { if: { together: ['agneau', 'chien'] }, integ: 3,
        text: 'Le chien reste près de l\'agneau. Avec un allié à côté, c\'est plus facile d\'oser.',
        bubble: { who: 'chien', text: 'T\'inquiète, je suis là.' } },
      { if: { notInvited: ['chien'] }, integ: -2,
        text: 'Le chien n\'était pas là. L\'agneau cherche du regard un visage rassurant.' },

      // --- Le cheval ---
      { if: { role: { cheval: 'observateur' }, state: { flag: 'cheval_engage' } }, integ: 1, cohesion: 3,
        text: 'Observateur, le cheval veille. À la première remarque déplacée, il dit calmement « Stop. » Et ça marche.',
        bubble: { who: 'cheval', text: 'Stop. Ça, ce n\'est pas drôle.' } },
      { if: { invited: ['cheval'], notRole: { cheval: 'observateur' } }, cohesion: 1,
        text: 'Le cheval participe et encourage tout le monde.' },
      { if: { notInvited: ['cheval'] }, cohesion: -1,
        text: 'Le cheval n\'était pas là. Dommage : il voulait se rattraper.' },

      // --- Le cochon ---
      { if: { competitive: true, sameTeam: ['cochon', 'renard'] }, integ: -2,
        text: 'Dans l\'équipe du renard, le cochon retombe dans ses vieilles habitudes et rit à ses blagues.' },
      { if: { invited: ['cochon'], notSameTeam: ['cochon', 'renard'], state: { flag: 'cochon_excuses' } }, integ: 3, cohesion: 1,
        text: 'Loin du renard, le cochon s\'excuse auprès de l\'agneau, maladroitement mais sincèrement. L\'agneau lui sourit.',
        bubble: { who: 'cochon', text: 'Pardon pour samedi... C\'était nul de ma part.' } },
      { if: { notInvited: ['cochon'] }, cohesion: -1,
        text: 'Le cochon n\'était pas invité. Il se sent mis de côté à son tour...' },

      // --- Les adultes et le groupe ---
      { if: { state: { flag: 'adult_informed' } }, integ: 1, cohesion: 2,
        text: 'La Chouette passe régulièrement. Tout le monde sait qu\'un adulte est au courant et veille.',
        bubble: { who: 'chouette', text: 'Tout se passe bien, ici ?' } },
      { if: { maxInvited: 2 }, cohesion: -2,
        text: 'Avec si peu de monde, l\'activité manque d\'ambiance.' },
      { if: { minInvited: 5, state: LIMITS }, cohesion: 1,
        text: 'Tout le groupe est réuni, avec des règles claires : c\'est une vraie activité commune.' }
    ]
  };
})();
