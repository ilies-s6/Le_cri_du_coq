/* =========================================================
   OBJETS À EXAMINER — Épisode 1
   ---------------------------------------------------------
   Chaque clé correspond au champ « examine » d'un objet de map.js.
   Une entrée = une liste de « conversations » essayées dans l'ordre :
     id     : identifiant unique (une conversation n'est vue qu'une fois)
     if     : condition pour qu'elle soit disponible
     steps  : textes affichés à la suite. Une chaîne seule = pensée du coq,
              ['agneau', '...'] = réplique d'un personnage.
     after  : effets à la fin (ex. { clue: 'c_banc' } donne un indice)
     idle   : texte par défaut quand il n'y a plus rien de nouveau (lines: [...])
   Un objet scintille ✦ tant qu'il a une conversation non vue.
   ========================================================= */
CDC.ep('ep1').objects = {
  fontaine: [
    { id: 'o_fontaine', steps: ['La fontaine glougloute. Des pièces brillent au fond : des vœux.', 'Tout le monde vient ici le matin... presque tout le monde.'] },
    { idle: true, lines: ['L\'eau est fraîche. Tu entends des rires dans la cour.', 'Ton reflet a l\'air songeur.'] }
  ],
  banc: [
    { id: 'o_banc', steps: [
      'Un banc gravé de six initiales : C, R, Co, Ch, Chi... et un « A ».',
      'Le « A » a été rayé à grands traits, plusieurs fois.',
      'Avant, tout le groupe mangeait ici. Toi compris.'
    ], after: { clue: 'c_banc' } },
    { idle: true, lines: ['Le « A » rayé est toujours là.'] }
  ],
  table: [
    { id: 'o_table', steps: [
      'La grande table. Cinq bols sont alignés au milieu...',
      '...et un sixième, posé tout au bout, loin des autres. Comme si quelqu\'un ne devait pas s\'asseoir avec le groupe.'
    ], after: { clue: 'c_table' } },
    { idle: true, lines: ['Le bol à l\'écart n\'a pas bougé.'] }
  ],
  panneau: [
    { id: 'o_panneau', steps: [
      'Le panneau d\'affichage de la cour. Une affiche a été arrachée en vitesse.',
      'Il reste un coin de papier. À l\'encre rouge, on lit : « ...qui veut être en équipe avec la Laine M... »',
      'La Laine M... ? Ce n\'est pas très difficile à deviner. Et ce n\'est pas gentil.'
    ], after: { clue: 'c_panneau' } },
    { idle: true, lines: ['Le coin d\'affiche à l\'encre rouge est toujours punaisé.'] }
  ],
  photos: [
    { id: 'o_photos', steps: [
      'Deux photos du groupe. Sur celle du printemps, l\'agneau rit au centre, entouré de tout le monde.',
      'Sur la nouvelle photo, prise la semaine dernière... il n\'y est pas.'
    ], after: { clue: 'c_photo' } },
    { idle: true, lines: ['Le printemps semble loin.'] }
  ],
  poubelle: [
    { id: 'o_poubelle_dessin', if: { variant: { dessin_lieu: 'poubelle' } }, steps: [
      'Sous des épluchures, des morceaux de papier épais...',
      'Tu les rassembles : c\'est un magnifique dessin de la ferme, signé « A. ». Quelqu\'un l\'a déchiré en quatre.'
    ], after: { clue: 'c_dessin' } },
    { idle: true, lines: ['Des épluchures, un trognon de pomme. Rien d\'intéressant.'] }
  ],
  puits: [
    { idle: true, lines: ['Tu te penches : ton reflet te regarde. « Qu\'est-ce qui m\'échappe ? »', 'Un écho te répond : « ...chappe ? »'] }
  ],

  // ---- Champ ----
  foin: [
    { id: 'o_foin_dessin', if: { variant: { dessin_lieu: 'foin' } }, steps: [
      'Coincés entre deux bottes de foin, des morceaux de papier...',
      'Un dessin de la ferme, très réussi, signé « A. ». Déchiré en quatre et caché là.'
    ], after: { clue: 'c_dessin' } },
    { idle: true, lines: ['Ça sent bon le foin. Rien de caché ici.'] }
  ],
  charrette: [
    { id: 'o_charrette', steps: [
      'Une vieille charrette abandonnée. Au fond, un petit paquet emballé avec soin.',
      'L\'étiquette dit : « Pour la fête — A. »',
      'Quelqu\'un avait préparé un cadeau... pour une fête qui n\'a jamais eu lieu ?'
    ], after: { clue: 'c_charrette' } },
    { idle: true, lines: ['Le petit paquet attend toujours son destinataire.'] }
  ],
  attente: [
    { id: 'o_attente', steps: [
      'Au pied du grand chêne, de petites traces de sabots tournent en rond, encore et encore.',
      'Quelqu\'un a attendu ici. Longtemps.'
    ], after: { clue: 'c_attente' } },
    { idle: true, lines: ['Les traces tournent en rond au pied du chêne.'] }
  ],
  invitation: [
    { id: 'o_invitation', steps: [
      'Une invitation punaisée sur le poteau : « GRANDE FÊTE au grand chêne, samedi 15 h ! Viens, A. ! »',
      'Grosses lettres rondes, petits cochons dessinés dans les coins...',
      'Sauf qu\'il n\'y a eu aucune fête samedi. Tu en es sûr : tu étais là.'
    ], after: { clue: 'c_invitation' } },
    { idle: true, lines: ['« Viens, A. ! » Une invitation pour rien.'] }
  ],
  epouvantail: [
    { idle: true, lines: ['L\'épouvantail a l\'air de juger tout le monde.', 'Il ne dira rien. Les épouvantails ne disent jamais rien.'] }
  ],
  objet: [
    { id: 'o_objet_champ', steps: ['Tiens... {objet}, posé(e) dans l\'herbe, à l\'autre bout du champ.', 'Qu\'est-ce que ça fait ici, si loin de ses affaires ? Quelqu\'un l\'a jeté là... ou caché.'], after: { clue: 'c_objet' } },
    { idle: true, lines: ['Tu le gardes de côté pour le lui rendre.'] }
  ],

  // ---- Écurie ----
  materiel: [
    { idle: true, lines: ['Brosses, licols, une selle... Le cheval prend soin de son matériel.', 'Tout est rangé. Presque trop.'] }
  ],
  boite: [
    { id: 'o_boite_objet', if: { variant: { objet_lieu: 'boite' } }, steps: [
      'Tu soulèves le couvercle de la vieille boîte...',
      'Dedans : {objet} ! Et des morceaux d\'affiche froissés, écrits en rouge.',
      'Quelqu\'un a caché ici des affaires qui ne lui appartiennent pas.'
    ], after: { clues: ['c_objet', 'c_boite'] } },
    { id: 'o_boite', if: { not: { variant: { objet_lieu: 'boite' } } }, steps: [
      'Tu soulèves le couvercle de la vieille boîte...',
      'Des morceaux d\'affiche froissés. Tu reconnais l\'encre rouge et les mots « Laine Molle ».',
      'Quelqu\'un a voulu faire disparaître les preuves.'
    ], after: { clue: 'c_boite' } },
    { idle: true, lines: ['La vieille boîte. Tu as vu ce qu\'elle contient.'] }
  ],
  empreintes: [
    { id: 'o_empreintes', steps: [
      'Des empreintes fines, avec des marques de griffes, dans la poussière du plancher.',
      'Elles mènent droit à la vieille boîte du fond. Ce ne sont pas des sabots de cheval.'
    ], after: { clue: 'c_empreintes' } },
    { idle: true, lines: ['Des traces de pattes griffues.'] }
  ],
  stylo: [
    { id: 'o_stylo', steps: [
      'Un feutre rouge, mâchouillé au bout. Quelques poils orange sont collés dessus.',
      'Rouge... comme l\'encre de l\'affiche ?'
    ], after: { clue: 'c_stylo' } },
    { idle: true, lines: ['Tu as noté le feutre rouge dans ton carnet.'] }
  ],
  abreuvoir: [
    { id: 'o_abreuvoir_dessin', if: { variant: { dessin_lieu: 'abreuvoir' } }, steps: [
      'Au fond de l\'abreuvoir, des papiers détrempés...',
      'Tu les repêches : un dessin de la ferme signé « A. », déchiré puis jeté à l\'eau.'
    ], after: { clue: 'c_dessin' } },
    { idle: true, lines: ['De l\'eau claire. Le cheval a soif, toi non.'] }
  ],

  // ---- Potager ----
  cagette: [
    { id: 'o_cagette', steps: [
      'La cagette du cochon. Sous les légumes, un petit carnet : « MES MEILLEURES BLAGUES ».',
      'Certaines blagues sont barrées. À côté, d\'une petite écriture : « trop méchant ? »'
    ], after: { clue: 'c_cagette' } },
    { idle: true, lines: ['Des carottes, des tomates, et un carnet de blagues.'] }
  ],
  compost: [
    { id: 'o_compost_objet', if: { variant: { objet_lieu: 'compost' } }, steps: [
      'Dans le bac à compost, quelque chose dépasse...',
      'C\'est {objet} ! Jeté(e) avec les épluchures. Ce n\'est pas un oubli.'
    ], after: { clue: 'c_objet' } },
    { idle: true, lines: ['Ça sent... le compost. Rien d\'autre.'] }
  ],
  arrosoir: [
    { idle: true, lines: ['Un arrosoir à moitié plein. Le cochon arrose avec beaucoup d\'énergie... quand il y pense.'] }
  ],

  // ---- Place des activités ----
  panneau_activites: [
    { id: 'o_inscriptions', if: { phase: 'enquete' }, steps: [
      'Le panneau des activités, avec la feuille d\'inscription de la semaine.',
      'Le nom « Agneau » a été écrit, d\'une écriture soignée... puis rayé, d\'une autre écriture, en rouge.',
      'Encore cette encre rouge.'
    ], after: { clue: 'c_inscriptions' } },
    { id: 'o_activite_go', repeat: true, quiet: true, if: { phase: 'reintegration', flags: ['info_agneau', 'info_chien', 'info_cheval', 'info_cochon'] },
      steps: ['C\'est ici que tu peux organiser une activité pour tout le groupe.'], after: { open: 'event' } },
    { idle: true, if: { phase: 'reintegration' }, lines: [function (S) {
      var todo = [['info_agneau', 'l\'agneau'], ['info_chien', 'le chien'], ['info_cheval', 'le cheval'], ['info_cochon', 'le cochon']]
        .filter(function (x) { return !S.flags[x[0]]; }).map(function (x) { return x[1]; });
      return 'Avant d\'organiser quoi que ce soit, tu dois d\'abord parler à : ' + todo.join(', ') + '.';
    }] },
    { idle: true, lines: ['Le panneau des activités. Il servira sûrement plus tard.'] }
  ],

  // ---- Coin tranquille ----
  rocher: [
    { id: 'o_rocher', steps: [
      'Derrière le rocher moussu, l\'herbe est tassée, comme un petit nid.',
      'Il y a des miettes, et une boîte de crayons de couleur.',
      'Quelqu\'un vient souvent ici. Seul.'
    ], after: { clue: 'c_coin' } },
    { idle: true, lines: ['Un petit refuge, à l\'abri des regards.'] }
  ],
  carnet_agneau: [
    { id: 'o_carnet', steps: [
      'Un petit carnet tombé dans l\'herbe. Tu hésites... puis tu lis une seule page.',
      '« Lundi : ils ont ri quand j\'ai parlé. Mardi : personne à côté de moi à table. Mercredi : je mange ici. »',
      'Pris un par un, ce sont de petits moments. Ensemble, ils forment autre chose.'
    ], after: { clue: 'c_carnet' } },
    { idle: true, lines: ['Tu reposes le carnet là où tu l\'as trouvé. Ce n\'est pas à toi.'] }
  ]
};
