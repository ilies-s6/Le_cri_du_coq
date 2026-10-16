/* =========================================================
   VIE DU COLLÈGE — Épisode 1
   ---------------------------------------------------------
   Petites scènes qui se jouent toutes seules quand Noé passe à côté :
   discussions entre élèves, parties de ping-pong ou de basket...
     if      : condition (moment de la journée, état du monde...)
     members : élèves concernés (ils doivent être présents et libres)
     radius  : distance (en cases) à laquelle Noé les entend
     lines   : répliques possibles [[qui, texte, style, humeur], ...]
               ou { if, say: [...], do: { effets } } (ex. donner un indice entendu)
     type    : 'pass' = ils se passent une balle (ball : 'pingpong', 'basket', 'foot')
   ========================================================= */
CDC.ep('ep1').ambient = [
  /* ---------- Lundi matin ---------- */
  { id: 'a_matin_nina', if: { slot: 'l_matin' }, members: ['chien', 'yanis'], radius: 5, gap: [6, 10], lines: [
    [['yanis', 'T\'as fait l\'exo de maths ?'], ['chien', 'Évidemment. Toi, non, je parie.']],
    [['chien', 'T\'as vu Milo, ce matin ? Il avait l\'air crevé.'], ['yanis', 'Bof, il a toujours l\'air comme ça, non ?'], ['chien', '…Justement.', null, 'worried']],
    [['yanis', 'Jeudi, tournoi de basket !'], ['chien', 'Je vais tous vous éclater.', null, 'happy']]
  ] },
  { id: 'a_matin_hall', if: { slot: 'l_matin', flag: 'scene_casier_done' }, members: ['renard', 'cochon', 'jade'], radius: 5, gap: [6, 11], lines: [
    [['renard', 'Samedi au skatepark, c\'était légendaire.'], ['cochon', 'Hé hé… ouais.'], ['jade', 'Vous me direz ce que vous avez fait, un jour ?']],
    [['jade', 'Ce soir, je poste ma nouvelle vidéo.'], ['renard', 'Moi aussi j\'ai un truc à poster. Tu vas adorer.', null, 'smug']],
    [['cochon', 'Vous avez révisé la SVT ?'], ['renard', 'Réviser, c\'est pour les moutons.'], ['jade', 'Hahaha !']]
  ] },

  /* ---------- Lundi, récréation ---------- */
  { id: 'a_pingpong', type: 'pass', if: { slot: 'l_recre' }, members: ['cheval', 'lena'], ball: 'pingpong', speed: 0.75, arc: 8 },
  { id: 'a_pingpong_talk', if: { slot: 'l_recre' }, members: ['cheval', 'lena'], radius: 4, gap: [8, 12], lines: [
    [['lena', 'Point !'], ['cheval', 'Il était dehors, celui-là.']],
    [['lena', 'T\'es trop forte, Inès.'], ['cheval', 'C\'est le hand, ça aide.', null, 'happy']]
  ] },
  { id: 'a_basket', type: 'pass', if: { slot: 'l_recre', flag: 'scene_cour_done' }, members: ['chien', 'yanis', 'theo'], ball: 'basket', speed: 1, arc: 18 },
  { id: 'a_basket_jeudi', type: 'pass', if: { slot: 'j_recre' }, members: ['yanis', 'theo'], ball: 'basket', speed: 1, arc: 18 },
  { id: 'a_recre_groupe', if: { slot: 'l_recre', flag: 'scene_cour_done' }, members: ['renard', 'cochon', 'jade'], radius: 5, gap: [6, 10], lines: [
    { if: { notFlag: 'recre_choix' }, say: [['renard', 'Noé ! Viens, on t\'attend !']] },
    [['renard', 'Nina, elle se prend pour la police.'], ['jade', 'Laisse-la.'], ['cochon', 'Hé hé…']],
    [['renard', 'Bêêê ! Hahaha !'], ['cochon', 'Bêêê !'], ['jade', 'Arrêtez 😂']],
    { if: { flag: 'change_sujet' }, say: [['cochon', 'Du coup, l\'exo 4, c\'était quoi la réponse ?'], ['renard', 'Pff, demande au délégué.']] }
  ] },

  /* ---------- Lundi midi ---------- */
  { id: 'a_cantine_nina', if: { slot: 'l_midi' }, members: ['chien', 'yanis'], radius: 4.5, gap: [7, 11], lines: [
    [['yanis', 'Les frites sont froides.'], ['chien', 'Tu les manges quand même.']],
    { if: { flag: 'scene_cantine_done' }, say: [['chien', 'T\'as vu ? « C\'est pris »… Ils sont sérieux ?', null, 'angry'], ['yanis', 'On aurait pu lui dire de venir, nous.'], ['chien', 'Ouais. On aurait pu.', null, 'sad']] }
  ] },
  { id: 'a_cantine_ines', if: { slot: 'l_midi' }, members: ['cheval', 'lena'], radius: 4.5, gap: [8, 12], lines: [
    [['lena', 'Tu viens au hand mercredi ?'], ['cheval', 'Comme toujours.']],
    { if: { flag: 'scene_cantine_done' }, say: [['lena', 'C\'était chaud, ce qu\'a dit Jade.'], ['cheval', '…Ouais.', null, 'worried'], ['lena', 'Toi aussi tu dis jamais rien, hein.']] }
  ] },
  { id: 'a_cantine_groupe', if: { slot: 'l_midi', flag: 'scene_cantine_done' }, members: ['renard', 'cochon', 'jade'], radius: 4.5, gap: [7, 11], lines: [
    [['renard', 'Ce soir, regardez le groupe. Surprise.', null, 'smug'], ['jade', 'Quoi ?'], ['renard', 'Vous verrez.']],
    [['cochon', 'T\'as vu la tête qu\'il a faite ?'], ['renard', 'Il avait qu\'à pas demander.']]
  ] },

  /* ---------- Mardi matin ---------- */
  { id: 'a_mardi_hall', if: { slot: 'm_matin', notFlag: 'groupe_reagit' }, members: ['renard', 'cochon', 'jade'], radius: 5, gap: [6, 10], lines: [
    [['renard', 'Vous avez vu le casier ? Trop drôle.'], ['jade', 'C\'est toi qui l\'as fait ?'], ['renard', 'Moi ? Je suis innocent.', null, 'smug']],
    [['cochon', 'Elle a fait combien de vues, la photo ?'], ['renard', 'Tout le collège l\'a vue.']]
  ] },
  { id: 'a_mardi_hall2', if: { slot: 'm_matin', flag: 'groupe_reagit' }, members: ['renard', 'cochon'], radius: 5, gap: [7, 11], lines: [
    [['renard', 'Jade fait la tête. Elle a pas d\'humour, en fait.'], ['cochon', 'Ouais… ouais.']],
    [['renard', 'Le casier, c\'est un chef-d\'œuvre.', null, 'smug'], ['cochon', 'Hé hé… Le surveillant va le voir, non ?', null, 'worried']]
  ] },
  { id: 'a_mardi_jade', if: { slot: 'm_matin', flag: 'groupe_reagit' }, members: ['jade', 'lena'], radius: 4.5, gap: [7, 11], lines: [
    [['jade', 'J\'ai pas dormi. Je repensais à la photo.'], ['lena', 'Moi non plus. On a toutes rigolé, au début.']],
    [['lena', 'Tu traînes plus avec Maxence ?'], ['jade', 'Pas aujourd\'hui. Pas après ça.', null, 'worried']]
  ] },

  /* ---------- Mardi, récréation : la rumeur ---------- */
  { id: 'a_rumeur', if: { slot: 'm_recre', min: { rumeur: 1 } }, members: ['theo', 'yanis'], radius: 5, gap: [6, 9], lines: [
    { say: [['theo', 'Il paraît que Milo a pleuré en SVT, ce matin.'], ['yanis', 'Qui a dit ça ?'], ['theo', 'Maxence. Tout le monde le répète.']], do: { clue: 'c_rumeur' } },
    { if: { min: { rumeur: 2 } }, say: [['theo', 'La photo du skatepark, même les 4e l\'ont vue.'], ['yanis', 'Sérieux ? Ça tourne encore ?']], do: { clue: 'c_rumeur' } },
    { if: { flag: 'adult_informed' }, say: [['yanis', 'La CPE a convoqué Maxence, ce matin.'], ['theo', 'Ah ouais ? Pour la photo ?'], ['yanis', 'Je crois. Mais la rumeur, elle, elle tourne encore.']] }
  ] },
  { id: 'a_rumeur_stop', if: { slot: 'm_recre', max: { rumeur: 0 } }, members: ['theo', 'yanis'], radius: 5, gap: [7, 10], lines: [
    [['theo', 'Y avait pas une histoire sur Milo, hier soir ?'], ['yanis', 'Si. Mais des gens ont dit stop, et la photo a été supprimée.']]
  ] },
  { id: 'a_mardi_recre_groupe', if: { slot: 'm_recre', flag: 'scene_agneau_evite_done', notFlag: 'groupe_reagit' }, members: ['renard', 'cochon', 'jade'], radius: 5, gap: [7, 11], lines: [
    [['renard', 'T\'as vu, il ose même plus sortir.', null, 'smug'], ['jade', 'Hahaha…'], ['cochon', '…']]
  ] },
  { id: 'a_mardi_recre_max', if: { slot: 'm_recre', flag: ['scene_agneau_evite_done', 'groupe_reagit'] }, members: ['renard', 'cochon'], radius: 5, gap: [7, 11], lines: [
    [['renard', 'Jade nous lâche. Qu\'elle aille avec les moutons.', null, 'angry'], ['cochon', '…']],
    { if: { anyFlag: ['adult_informed', 'chouette_vigilante'] }, say: [['cochon', 'Mme Chouette nous regarde…', null, 'worried'], ['renard', 'Et alors ? On fait rien de mal.']] }
  ] },
  { id: 'a_mardi_jade_preau', if: { slot: 'm_recre', flag: 'groupe_reagit' }, members: ['jade', 'lena'], radius: 4.5, gap: [7, 11], lines: [
    [['lena', 'On devrait dire à Milo de venir avec nous ?'], ['jade', 'Tu crois qu\'il voudra, après ce que j\'ai fait ?', null, 'worried']]
  ] },

  /* ---------- Mardi midi ---------- */
  { id: 'a_foot', type: 'pass', if: { slot: 'm_midi' }, members: ['cheval', 'yanis', 'theo'], ball: 'foot', speed: 1.1, arc: 6 },
  { id: 'a_midi_jade', if: { slot: 'm_midi' }, members: ['jade', 'lena'], radius: 4.5, gap: [7, 11], lines: [
    { if: { flag: 'groupe_reagit' }, say: [['jade', 'Je vais écrire à Milo. Pour m\'excuser.'], ['lena', 'Je viens avec toi, si tu veux.']], do: { flag: 'jade_excuses' } },
    [['lena', 'Tu manges plus avec Maxence ?'], ['jade', 'Il est bizarre en ce moment. Enfin, plus que d\'habitude.']]
  ] },
  { id: 'a_midi_milo_nina', if: { slot: ['m_midi', 'm_fin'], min: { trust_agneau: 3 } }, members: ['agneau', 'chien'], radius: 4.5, gap: [7, 11], lines: [
    [['chien', 'Montre-moi ton plan du collège !'], ['agneau', 'Il est pas fini…', null, 'shy'], ['chien', 'Il est déjà génial.', null, 'happy']],
    [['agneau', 'Merci d\'être restée avec moi.'], ['chien', 'C\'est normal. On aurait dû le faire avant.']]
  ] },

  /* ---------- Mardi, fin des cours ---------- */
  { id: 'a_fin_velos', if: { slot: 'm_fin' }, members: ['sami', 'yanis'], radius: 5, gap: [8, 12], lines: [
    [['yanis', 'À demain, Sami !'], ['sami', '…À demain.']],
    { if: { flag: 'sami_soutien' }, say: [['sami', 'J\'ai écrit à Milo, tout à l\'heure.'], ['yanis', 'Ah ouais ? Il a répondu ?'], ['sami', 'Un pouce. C\'est déjà ça.', null, 'happy']] }
  ] },

  /* ---------- Jeudi ---------- */
  { id: 'a_jeudi', if: { slot: 'j_recre', phase: 'reintegration' }, members: ['jade', 'sami'], radius: 5, gap: [8, 12], lines: [
    [['jade', 'Il paraît que Noé organise un truc pour toute la classe.'], ['sami', 'Si c\'est pas un tournoi, je viens.']]
  ] }
];
