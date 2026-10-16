/* =========================================================
   OBJETS À EXAMINER — Épisode 1
   ---------------------------------------------------------
   Chaque clé correspond au champ « examine » d'un objet de map.js.
   Une entrée = une liste de « conversations » essayées dans l'ordre :
     id     : identifiant unique (une conversation n'est vue qu'une fois)
     if     : condition pour qu'elle soit disponible
     steps  : textes affichés à la suite. Une chaîne seule = pensée de Noé,
              ['agneau', '...'] = réplique d'un personnage.
     after  : effets à la fin (ex. { clue: 'c_banc' } donne un indice)
     idle   : texte par défaut quand il n'y a plus rien de nouveau (lines: [...])
   Un objet scintille ✦ tant qu'il a une conversation non vue.
   ========================================================= */
(function () {
  function todo(S) {
    var t = [['info_agneau', 'Milo'], ['info_chien', 'Nina'], ['info_cheval', 'Inès'], ['info_cochon', 'Hugo']]
      .filter(function (x) { return !S.flags[x[0]]; }).map(function (x) { return x[1]; });
    return 'Avant d\'organiser quoi que ce soit, parle d\'abord à : ' + t.join(', ') + '.';
  }

  CDC.ep('ep1').objects = {
    // ---- Salle 12 ----
    tableau_12: [
      { idle: true, lines: ['Au tableau : « Pour jeudi : exposé sur la solidarité. » Quelqu\'un a dessiné un petit mouton dans le coin.', 'Le mot « solidarité » est souligné deux fois.'] }
    ],
    bureau_milo: [
      { idle: true, lines: ['La table de Milo, près de la fenêtre. Dans la marge de son cahier : des plans, des couloirs, des flèches.', 'Sa trousse est rangée au millimètre. Le reste de la table est vide.'] }
    ],
    blagues: [
      { id: 'o_blagues', steps: [
        'Sur la table d\'Hugo, un petit carnet : « MES MEILLEURES BLAGUES ».',
        'Certaines blagues sont barrées. À côté, d\'une petite écriture : « trop méchant ? »',
        'Hugo se pose des questions. Alors pourquoi il continue ?'
      ], after: { clue: 'c_blagues' } },
      { idle: true, lines: ['Le carnet de blagues d\'Hugo. Tu le laisses où il est.'] }
    ],
    invitation: [
      { id: 'o_invitation', steps: [
        'Un papier chiffonné, au pied de la table de Milo. Tu le déplies.',
        '« 🎉 Anniv de JADE samedi 15 h au skatepark ! Viens Milo, ce sera trop bien ! »',
        'Grosses lettres rondes, petits cochons dessinés dans les coins… Ce n\'est pas l\'écriture de Jade.',
        'Et Jade n\'a jamais fêté son anniversaire au skatepark. Tu le sais : son anniversaire, c\'est en juin.'
      ], after: { clue: 'c_invitation' } },
      { idle: true, lines: ['« Viens Milo ! » Une invitation pour rien.'] }
    ],

    // ---- Salle 14 (arts) ----
    bac_arts: [
      { id: 'o_dessin_arts', if: { variant: { dessin_lieu: 'arts' } }, steps: [
        'Dans le bac à papier de la salle d\'arts, sous des chutes de carton…',
        'Un plan du collège dessiné à la main, signé « Milo ». Déchiré en quatre et jeté là.'
      ], after: { clue: 'c_dessin' } },
      { idle: true, lines: ['Des chutes de papier, des pinceaux secs. Rien d\'autre.'] }
    ],

    // ---- CDI ----
    cadeau: [
      { id: 'o_cadeau', steps: [
        'Sous une table du CDI, un petit paquet emballé avec soin, un peu écrasé.',
        'L\'étiquette dit : « Joyeux anniversaire Jade ! — Milo »',
        'Quelqu\'un avait préparé un cadeau… pour une fête qui n\'a jamais eu lieu ?'
      ], after: { clue: 'c_cadeau' } },
      { idle: true, lines: ['Le petit paquet attend toujours, sous la table.'] }
    ],
    recyclage: [
      { id: 'o_dessin_cdi', if: { variant: { dessin_lieu: 'cdi' } }, steps: [
        'Dans le bac de recyclage du CDI, des morceaux de papier épais…',
        'Tu les rassembles : un magnifique plan du collège, signé « Milo ». Quelqu\'un l\'a déchiré en quatre.'
      ], after: { clue: 'c_dessin' } },
      { idle: true, lines: ['Des brouillons, des photocopies ratées. Rien d\'intéressant.'] }
    ],

    // ---- Vie scolaire ----
    affiche_3018: [
      { idle: true, lines: [
        '« Harcèlement ? Cyberharcèlement ? Appelle le 3018. C\'est gratuit, anonyme et confidentiel. »',
        '« Tu peux aussi en parler à un adulte du collège : CPE, professeur, infirmière. On est là pour t\'aider. »',
        'En bas de l\'affiche : « Témoin ? Ne reste pas spectateur. »'
      ] }
    ],

    // ---- Couloir ----
    casier: [
      { id: 'o_casier', if: { minSlot: 'm_matin', phase: 'enquete' }, steps: [
        '« BÊÊÊ », en grosses lettres rouges, sur le casier de Milo.',
        'Le marqueur a bavé. Tout le couloir passe devant. Certains prennent même une photo.',
        'Hier soir la photo, ce matin le casier. Ça ne s\'arrête pas : ça grandit.'
      ], after: { clue: 'c_casier' } },
      { idle: true, if: { phase: ['reintegration', 'evenement', 'fin'], flag: 'adult_informed' }, lines: ['Le tag a été nettoyé. Mme Chouette s\'en est occupée.'] },
      { idle: true, if: { minSlot: 'm_matin' }, lines: ['Le tag rouge est toujours là.'] },
      { idle: true, lines: ['Le casier de Milo. Un autocollant de BD sur la porte, à moitié arraché.', 'Quelqu\'un a gratté des petits « bêê » au compas, près de la serrure.'] }
    ],
    affiche_couloir: [
      { idle: true, lines: ['« Non au harcèlement. Ne restons pas spectateurs : parlons-en à un adulte. »', 'Tout le monde passe devant cette affiche tous les jours. Qui la lit vraiment ?'] }
    ],
    horloge: [
      { idle: true, lines: ['L\'horloge du couloir.'] }
    ],

    // ---- Hall ----
    banc: [
      { id: 'o_banc', steps: [
        'Le banc du hall. En 6e, la bande y a gravé ses initiales : N, H, I, J, Ni… et un « M ».',
        'Le « M » a été rayé à grands traits, plusieurs fois.',
        'Avant, vous étiez tous ensemble ici, à chaque récré. Milo compris.'
      ], after: { clue: 'c_banc' } },
      { idle: true, lines: ['Le « M » rayé est toujours là.'] }
    ],
    photos: [
      { id: 'o_photos', steps: [
        'Le panneau des photos de classe. Sortie de 6e : Milo rit au milieu du groupe, Hugo lui fait des oreilles de lapin.',
        'Voyage de 5e, le mois dernier : Milo est tout au bord, à moitié coupé. Personne ne le regarde.'
      ], after: { clue: 'c_photo' } },
      { idle: true, lines: ['La sortie de 6e semble loin.'] }
    ],
    panneau: [
      { id: 'o_panneau', steps: [
        'Le panneau des clubs. Une affiche a été arrachée en vitesse.',
        'Il reste un morceau : « Club BD — le jeudi au CDI — par Milo ». Le dessin est superbe.',
        'Quelqu\'un a corrigé au marqueur rouge : « Club BÊÊÊDÉ ». Ce n\'est pas une blague innocente.'
      ], after: { clue: 'c_panneau' } },
      { idle: true, lines: ['Le morceau d\'affiche griffonné en rouge est toujours là.'] }
    ],
    vitrine: [
      { idle: true, lines: ['Coupes du cross, une médaille de hand gagnée par Inès…', 'Tout en bas : « Concours BD des 6e — 1er prix : Milo ». Personne ne s\'en souvient ?'] }
    ],
    panneau_activites: [
      { id: 'o_inscriptions', if: { phase: 'enquete' }, steps: [
        'Le panneau des activités. Feuille d\'inscription : « TOURNOI DE BASKET — jeudi, à la récré ».',
        '« Milo » a été écrit d\'une écriture soignée… puis rayé, d\'une autre écriture, au marqueur rouge.',
        'Encore cette encre rouge.'
      ], after: { clue: 'c_inscriptions' } },
      { id: 'o_activite_go', repeat: true, quiet: true, if: { phase: 'reintegration', flags: ['info_agneau', 'info_chien', 'info_cheval', 'info_cochon'] },
        steps: ['C\'est ici que tu peux proposer une activité pour toute la classe.'], after: { open: 'event' } },
      { idle: true, if: { phase: 'reintegration' }, lines: [todo] },
      { idle: true, lines: ['Le panneau des activités. Il servira sûrement plus tard.'] }
    ],

    // ---- Cantine ----
    table: [
      { id: 'o_table', steps: [
        'La table où mange la classe. Cinq plateaux, et un sac posé sur la sixième chaise.',
        'La chaise est « gardée ». Mais personne ne vient jamais s\'y asseoir.',
        'Une place réservée… pour que quelqu\'un ne puisse pas la prendre.'
      ], after: { clue: 'c_table' } },
      { idle: true, lines: ['Le sac est toujours sur la chaise.'] }
    ],

    // ---- Local du matériel ----
    boite: [
      { id: 'o_boite_objet', if: { variant: { objet_lieu: 'boite' } }, steps: [
        'Tu soulèves le couvercle de la vieille caisse, au fond du local…',
        'Dedans : {objet} ! Et des morceaux d\'affiche froissés, griffonnés en rouge.',
        'Quelqu\'un a caché ici des affaires qui ne lui appartiennent pas.'
      ], after: { clues: ['c_objet', 'c_boite'] } },
      { id: 'o_boite', if: { not: { variant: { objet_lieu: 'boite' } } }, steps: [
        'Tu soulèves le couvercle de la vieille caisse, au fond du local…',
        'Des morceaux d\'affiche froissés. Tu reconnais le dessin du club BD, et les mots « BÊÊÊDÉ » en rouge.',
        'Quelqu\'un a voulu faire disparaître la preuve.'
      ], after: { clue: 'c_boite' } },
      { idle: true, lines: ['La vieille caisse. Tu as vu ce qu\'elle contient.'] }
    ],
    porte_cles: [
      { id: 'o_porte_cles', steps: [
        'Par terre, un porte-clés : un petit renard orange en caoutchouc.',
        'Tu l\'as déjà vu : d\'habitude, il pend au sac de Maxence.'
      ], after: { clue: 'c_porte_cles' } },
      { idle: true, lines: ['Le petit renard orange. Qu\'est-ce que Maxence faisait au local ?'] }
    ],
    stylo: [
      { id: 'o_stylo', steps: [
        'Un marqueur rouge indélébile, le capuchon mâchouillé.',
        'Rouge… comme l\'affiche du club BD ? Comme le nom rayé sur la feuille d\'inscription ?'
      ], after: { clue: 'c_stylo' } },
      { idle: true, lines: ['Tu as noté le marqueur rouge dans ton carnet.'] }
    ],

    // ---- Cour ----
    poubelle: [
      { id: 'o_dessin_cour', if: { variant: { dessin_lieu: 'cour' } }, steps: [
        'Sous des emballages de goûter, des morceaux de papier épais…',
        'Tu les rassembles : un magnifique plan du collège, signé « Milo ». Quelqu\'un l\'a déchiré en quatre.'
      ], after: { clue: 'c_dessin' } },
      { idle: true, lines: ['Des emballages, une bouteille vide. Rien d\'intéressant.'] }
    ],

    // ---- Terrain ----
    gradins: [
      { id: 'o_objet_gradins', if: { variant: { objet_lieu: 'gradins' } }, steps: [
        'Sous les gradins, dans la poussière… {objet} !',
        'Qu\'est-ce que ça fait ici, si loin de son sac ? Quelqu\'un l\'a jeté là… ou caché.'
      ], after: { clue: 'c_objet' } },
      { idle: true, lines: ['Sous les gradins : un vieux ballon dégonflé, des papiers de bonbons.'] }
    ],

    // ---- Jardin ----
    espace_calme: [
      { idle: true, lines: ['« Espace calme : ici, on vient pour se poser, lire, respirer. On respecte le silence et les autres. »', 'Un endroit pour souffler. Pas pour se cacher… normalement.'] }
    ],
    rocher: [
      { id: 'o_rocher', steps: [
        'Derrière le rocher moussu, l\'herbe est tassée.',
        'Il y a une boîte de crayons de couleur, et des miettes de sandwich.',
        'Quelqu\'un vient souvent ici. Seul.'
      ], after: { clue: 'c_coin' } },
      { idle: true, lines: ['Un petit refuge, à l\'abri des regards.'] }
    ],
    carnet_milo: [
      { id: 'o_carnet', steps: [
        'Un petit carnet tombé dans l\'herbe. Tu hésites… puis tu lis une seule page.',
        '« Lundi : ils ont ri quand j\'ai parlé. Mardi : personne à côté de moi à la cantine. Mercredi : je mange au jardin. »',
        'Pris un par un, ce sont de petits moments. Ensemble, ils forment autre chose.'
      ], after: { clue: 'c_carnet' } },
      { idle: true, lines: ['Tu reposes le carnet là où tu l\'as trouvé. Il n\'est pas à toi. Tu le diras à Milo.'] }
    ],
    buisson: [
      { id: 'o_objet_buisson', if: { variant: { objet_lieu: 'buisson' } }, steps: [
        'Coincé dans le buisson, près de la mare… {objet} !',
        'Jeté par-dessus la haie, sûrement. Ce n\'est pas un oubli.'
      ], after: { clue: 'c_objet' } },
      { idle: true, lines: ['Des fleurs, quelques abeilles. Rien de caché ici.'] }
    ]
  };
})();
