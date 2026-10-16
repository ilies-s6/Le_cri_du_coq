/* =========================================================
   PERSONNAGES — Épisode 1
   ---------------------------------------------------------
   id        : identifiant utilisé partout (dialogues, indices...)
   name      : prénom affiché · role : affiché à côté du prénom dans les dialogues
   species   : dessin utilisé (voir js/sprites.js : coq, agneau, renard, cochon,
               cheval, chien, chouette, chat, lapin, canard, blaireau)
   colors    : couleurs de l'animal (et du portrait : bg, bg2 ; tag = étiquette du nom)
   outfit    : vêtements { top: 'hoodie'|'tshirt'|'jacket'|'cardigan'|'tracksuit'|'sweater',
               main, trim, inner, bag, acc: ['glasses', 'cap', 'beanie', 'headphones',
               'headband', 'clip', 'lanyard', 'whistle'] }
   moods     : humeur de fond (la première dont la condition est vraie)
   homes     : où se trouve le personnage. La première ligne dont la condition « if »
               est vraie est utilisée (moment de la journée, choix du joueur...).
               at = [x, y] en cases, face = direction, wander = rayon de promenade,
               route = trajet en boucle, hidden = absent.
   trustVar  : variable de confiance affichée (« Avec toi ») dans le carnet
   sheet     : fiche du carnet. Chaque « fact » apparaît quand sa condition est remplie.
   ========================================================= */
(function () {
  var AFTER = { phase: ['reintegration', 'evenement', 'fin'] };
  function slot(s, more) { var c = { phase: 'enquete', slot: s }; for (var k in more || {}) c[k] = more[k]; return c; }
  function after(more) { var c = { phase: AFTER.phase }; for (var k in more || {}) c[k] = more[k]; return c; }
  var COUR_ROUTE = [[12.5, 20.6], [32.6, 20.6], [32.6, 34.3], [12.5, 34.3]];

  CDC.ep('ep1').characters = [
    {
      id: 'coq', player: true, name: 'Noé', short: 'Noé', role: 'toi', emoji: '🐓', species: 'coq', speciesName: 'coq',
      colors: { body: '#fff6e6', comb: '#e53935', tail: '#2e8b6f', tail2: '#f57c00', bg: '#fff1d6', bg2: '#f6c27a', tag: '#e8590c' },
      outfit: { top: 'hoodie', main: '#3d5a98', trim: '#f4f1ea', bag: '#e2574c' },
      sheet: {
        subtitle: 'Toi · délégué de la 5e B · curieux, observateur, empathique',
        facts: [
          { text: 'Tu es délégué de classe : les autres te font confiance… et t\'observent aussi.' },
          { text: 'Depuis quelques semaines, l\'ambiance de la 5e B a changé. Tu veux comprendre pourquoi.' },
          { if: { minClues: 5 }, text: 'Plusieurs indices semblent former un même schéma…' },
          { if: { flag: 'a_ri' }, text: 'Lundi, tu as ri avec le groupe de Maxence. Tu y repenses encore.' },
          { if: { flag: 'stop_ligne' }, text: 'Tu as osé écrire « supprime ça » dans le groupe de la classe.' },
          { if: { flag: 'adult_informed' }, text: 'Tu as osé en parler à Mme Chouette, la CPE.' },
          { if: AFTER, text: 'Tu as compris la situation. Maintenant, tu agis.' }
        ]
      }
    },

    /* ---------------- Milo, l'agneau ---------------- */
    {
      id: 'agneau', name: 'Milo', short: 'Milo', role: '5e B', emoji: '🐑', species: 'agneau', speciesName: 'agneau', trustVar: 'trust_agneau',
      colors: { body: '#fbfbf7', face: '#5d5560', bg: '#eef3ff', bg2: '#b9c8f0', tag: '#5b6fb5' },
      outfit: { top: 'cardigan', main: '#8aa6c8', inner: '#f4f1ea', trim: '#f2c94c', bag: '#6d8f5a', acc: ['glasses'] },
      moods: [
        { if: after({ min: { trust_agneau: 4 } }), mood: 'happy' },
        { if: { min: { trust_agneau: 3 } }, mood: 'neutral' },
        { if: { min: { moquerie: 3 } }, mood: 'sad' },
        { mood: 'worried' }
      ],
      homes: [
        { if: after({ min: { trust_agneau: 4 } }), at: [26.5, 24.2], face: 'down', wander: 0.4 },
        { if: AFTER, at: [7.9, 27], face: 'down', wander: 0 },
        { if: slot('l_matin', { notFlag: 'scene_casier_done' }), at: [27.5, 10.4], face: 'up', wander: 0 },
        { if: slot('l_matin'), at: [10.9, 5.2], face: 'up', wander: 0 },
        { if: slot('l_recre', { variant: { agneau_lieu: 'preau' } }), at: [7.9, 27], face: 'down', wander: 0 },
        { if: slot('l_recre'), at: [43.4, 7.2], face: 'left', wander: 0 },
        { if: slot('l_midi', { flag: 'scene_cantine_done' }), at: [58.6, 21.7], face: 'up', wander: 0 },
        { if: slot('l_midi'), at: [50.5, 21.6], face: 'left', wander: 0 },
        { if: slot('m_matin', { flag: 'adult_informed' }), at: [58, 6.3], face: 'down', wander: 0 },
        { if: slot('m_matin'), at: [43.4, 7.2], face: 'left', wander: 0 },
        { if: slot('m_recre', { notFlag: 'scene_agneau_evite_done' }), at: [24.5, 18.6], face: 'down', wander: 0 },
        { if: slot('m_recre'), at: [43.4, 7.2], face: 'left', wander: 0 },
        { if: slot('m_midi', { min: { trust_agneau: 3 } }), at: [14.6, 23.1], face: 'right', wander: 0 },
        { if: slot('m_midi'), at: [48.9, 44], face: 'down', wander: 0 },
        { if: slot('m_fin', { min: { trust_agneau: 3 } }), at: [16.4, 23.5], face: 'right', wander: 0.3 },
        { if: slot('m_fin'), at: [60.2, 29.6], face: 'left', wander: 0 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Discret, rêveur, très doué en dessin',
        facts: [
          { text: 'Dans ta classe depuis la 6e. Il dessine des cartes et des BD incroyables.' },
          { if: { anyClue: ['c_photo', 'c_banc'] }, text: 'En 6e, il faisait pleinement partie du groupe.' },
          { if: { anyClue: ['c_scene_casier', 'c_casier'] }, text: 'On l\'appelle « Bêêêlo » devant les casiers.' },
          { if: { anyClue: ['c_scene_cantine', 'c_table'] }, text: 'À la cantine, on lui dit que les places sont « prises ».' },
          { if: { anyClue: ['c_coin', 'c_carnet'] }, text: 'Il va souvent seul au jardin, dans l\'espace calme.' },
          { if: { anyClue: ['c_agneau_evite', 'c_agneau_mots'] }, text: 'Il évite la cour, surtout quand Maxence y est.' },
          { if: { clue: 'c_agneau_talent' }, text: 'Il dessine des plans du collège avec chaque recoin et chaque cachette.' },
          { if: { flag: 'agneau_dessin_dit' }, text: '« La dernière fois que j\'ai montré un dessin, il a fini déchiré. »' },
          { if: { anyClue: ['c_invitation', 'c_photo_volee', 'c_agneau_aveu'] }, text: 'Samedi, il est allé à un anniversaire… qui n\'existait pas. Quelqu\'un l\'a pris en photo.' },
          { if: { flag: 'ecrit_milo' }, text: 'Tu lui as écrit lundi soir. Il t\'a répondu « merci ».' },
          { if: { flag: 'info_agneau' }, text: 'Il n\'aime pas la compétition. Il aime les énigmes et se sent rassuré avec Nina.' }
        ]
      }
    },

    /* ---------------- Maxence, le renard ---------------- */
    {
      id: 'renard', name: 'Maxence', short: 'Maxence', role: '5e B', emoji: '🦊', species: 'renard', speciesName: 'renard', trustVar: 'trust_renard',
      colors: { body: '#f07a2a', chest: '#fff4e8', dark: '#4a2c1a', bg: '#fff0e0', bg2: '#f5b37a', tag: '#d9480f' },
      outfit: { top: 'jacket', main: '#22252f', inner: '#e9ecef', trim: '#ffffff', acc: ['cap'], cap: '#e2574c', cap2: '#ffffff' },
      moods: [
        { if: { flag: 'renard_humilie' }, mood: 'angry' },
        { if: { flag: 'renard_limites' }, mood: 'neutral' },
        { mood: 'smug' }
      ],
      homes: [
        { if: after({ flag: 'renard_humilie' }), at: [33, 22.6], face: 'left', wander: 0.3 },
        { if: AFTER, at: [32.4, 21.5], face: 'left', wander: 0.5 },
        { if: slot('l_matin', { notFlag: 'scene_casier_done' }), at: [25.6, 10.7], face: 'right', wander: 0 },
        { if: slot('l_matin'), at: [30.2, 15.6], face: 'left', wander: 0 },
        { if: slot('l_recre'), at: [26.2, 23.4], face: 'right', wander: 0 },
        { if: slot('l_midi'), at: [44.2, 19.1], face: 'down', wander: 0 },
        { if: slot('m_matin'), at: [30.2, 15.6], face: 'left', wander: 0 },
        { if: slot('m_recre'), at: [26.2, 23.4], face: 'right', wander: 0 },
        { if: slot('m_midi', { variant: { conv_lieu: 'gradins' } }), at: [14.3, 37.5], face: 'right', wander: 0 },
        { if: slot('m_midi'), at: [3.8, 22], face: 'right', wander: 0 },
        { if: slot('m_fin', { notFlag: 'scene_surprise_done' }), at: [51.4, 29.8], face: 'right', wander: 0 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Charismatique, drôle, très populaire',
        facts: [
          { text: 'Il fait rire toute la classe. Tout le monde veut être dans son groupe.' },
          { if: { anyClue: ['c_scene_cour', 'c_renard_discours'] }, text: 'Ses « blagues » ne font pas rire tout le monde. Il dit souvent « on rigole ».' },
          { if: { flag: 'renard_peur' }, text: '« Si je rigole pas des autres, c\'est de moi qu\'on rigolera. » Ça n\'excuse rien.' },
          { if: { anyClue: ['c_stylo', 'c_porte_cles', 'c_boite'] }, text: 'Plusieurs traces mènent à lui, au local du matériel.' },
          { if: { flag: 'renard_feutre' }, text: 'Il a perdu son sourire quand tu as parlé du marqueur rouge.' },
          { if: { anyClue: ['c_photo_volee', 'c_retire'] }, text: 'C\'est lui qui a posté la photo de Milo et l\'a retiré du groupe.' },
          { if: { anyClue: ['c_conv', 'c_surprise'] }, text: 'Il met la pression sur Hugo pour qu\'il reste « avec eux ».' },
          { if: { flag: 'renard_limites' }, text: 'Tu lui as posé des limites calmement. Il a semblé entendre.' }
        ]
      }
    },

    /* ---------------- Hugo, le cochon ---------------- */
    {
      id: 'cochon', name: 'Hugo', short: 'Hugo', role: '5e B', emoji: '🐷', species: 'cochon', speciesName: 'cochon', trustVar: 'trust_cochon',
      colors: { body: '#f7b0c0', snout: '#f48aa0', dark: '#e07a92', bg: '#ffeef3', bg2: '#f5b6c8', tag: '#d6336c' },
      outfit: { top: 'sweater', main: '#7cb85a', trim: '#f4f1ea', bag: '#3d5a98', acc: ['beanie'], beanie: '#f2b84b', beanie2: '#ffffff' },
      moods: [
        { if: { flag: 'cochon_excuses' }, mood: 'neutral' },
        { if: { anyClue: ['c_surprise', 'c_cochon_aveu'] }, mood: 'worried' },
        { mood: 'happy' }
      ],
      homes: [
        { if: AFTER, at: [20.5, 26.2], face: 'right', wander: 0.4 },
        { if: slot('l_matin', { notFlag: 'scene_casier_done' }), at: [24.5, 10.9], face: 'right', wander: 0 },
        { if: slot('l_matin'), at: [28.9, 15.9], face: 'right', wander: 0 },
        { if: slot('l_recre'), at: [25.1, 24.5], face: 'up', wander: 0 },
        { if: slot('l_midi'), at: [45, 21.4], face: 'up', wander: 0 },
        { if: slot('m_matin'), at: [28.9, 15.9], face: 'right', wander: 0 },
        { if: slot('m_recre'), at: [25.1, 24.5], face: 'up', wander: 0 },
        { if: slot('m_midi', { variant: { conv_lieu: 'gradins' } }), at: [15.9, 37.5], face: 'left', wander: 0 },
        { if: slot('m_midi'), at: [5.4, 22], face: 'left', wander: 0 },
        { if: slot('m_fin'), at: [53, 29.8], face: 'left', wander: 0 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Drôle, sociable, toujours partant pour une blague',
        facts: [
          { text: 'Le clown de la classe. En 6e, il était inséparable de Milo.' },
          { if: { flag: 'cochon_nerveux' }, text: 'Il devient nerveux quand on parle de Milo.' },
          { if: { clue: 'c_blagues' }, text: 'Il se demande si certaines de ses blagues sont « trop méchantes ».' },
          { if: { anyClue: ['c_conv', 'c_surprise', 'c_scene_casier'] }, text: 'Il suit Maxence, même quand ça le gêne.' },
          { if: { clue: 'c_cochon_aveu' }, text: '« Je voulais juste rigoler avec eux. Je pensais pas que ça lui ferait autant de mal. »' },
          { if: { flag: 'cochon_excuses' }, text: 'Il aimerait s\'excuser auprès de Milo.' }
        ]
      }
    },

    /* ---------------- Inès, le cheval ---------------- */
    {
      id: 'cheval', name: 'Inès', short: 'Inès', role: '5e B · matériel d\'EPS', emoji: '🐴', species: 'cheval', speciesName: 'jument', trustVar: 'trust_cheval', scale: 1.12, markY: 58,
      colors: { body: '#a8693c', mane: '#4a2c1a', muzzle: '#d8b08a', dark: '#5a3a22', bg: '#f6ead8', bg2: '#d6b48a', tag: '#8a5a2b' },
      outfit: { top: 'tracksuit', main: '#2a7fba', trim: '#ffffff', acc: ['lanyard'], lanyard: '#f2c94c' },
      moods: [
        { if: { flag: 'cheval_engage' }, mood: 'neutral' },
        { mood: 'worried' }
      ],
      homes: [
        { if: AFTER, at: [29.2, 27.2], face: 'left', wander: 0.4 },
        { if: slot('l_matin'), at: [6.5, 29.3], face: 'down', wander: 0.3 },
        { if: slot('l_recre'), at: [4.3, 23.8], face: 'right', wander: 0 },
        { if: slot('l_midi'), at: [52.2, 18.8], face: 'down', wander: 0 },
        { if: slot('m_matin'), at: [26, 10.8], face: 'up', wander: 0 },
        { if: slot('m_recre'), at: [5.5, 32.6], face: 'down', wander: 0.5 },
        { if: slot('m_midi'), at: [10, 42.5], face: 'right', wander: 0 },
        { if: slot('m_fin'), at: [5.5, 32.6], face: 'down', wander: 0.5 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Calme, sportive, responsable du matériel d\'EPS',
        facts: [
          { text: 'Elle garde les clés du local du matériel. Elle voit passer beaucoup de monde.' },
          { if: { flag: 'cheval_vu_teaser' }, text: '« J\'ai vu quelque chose… » Elle n\'ose pas en dire plus.' },
          { if: { clue: 'c_vus' }, text: 'Elle a vu la photo dans le groupe. Elle n\'a rien écrit.' },
          { if: { clue: 'c_cheval_vu' }, text: 'Elle a vu Maxence cacher quelque chose dans le local.' },
          { if: { clue: 'c_cheval_hesite' }, text: 'Elle n\'est jamais intervenue : elle avait peur d\'être la suivante.' },
          { if: { flag: 'cheval_engage' }, text: 'Elle est prête à agir, cette fois.' }
        ]
      }
    },

    /* ---------------- Nina, le chien ---------------- */
    {
      id: 'chien', name: 'Nina', short: 'Nina', role: '5e B', emoji: '🐕', species: 'chien', speciesName: 'chienne', trustVar: 'trust_chien',
      colors: { body: '#d9a066', chest: '#fff2dc', ears: '#8a5a2b', bg: '#fff3dd', bg2: '#e8c08a', tag: '#c2410c' },
      outfit: { top: 'tshirt', main: '#ef476f', trim: '#ffffff', bag: '#2b2d42', acc: ['headband'], band: '#ffd166' },
      moods: [
        { if: slot('m_matin'), mood: 'angry' },
        { mood: 'neutral' }
      ],
      homes: [
        { if: AFTER, at: [25, 25.2], face: 'right', wander: 0.3 },
        { if: slot('l_matin'), at: [16.2, 24.2], face: 'right', wander: 0 },
        { if: slot('l_recre', { notFlag: 'scene_cour_done' }), at: [28.2, 23.4], face: 'left', wander: 0 },
        { if: slot('l_recre'), at: [36.2, 28.6], face: 'right', wander: 0 },
        { if: slot('l_midi'), at: [38.4, 17.4], face: 'down', wander: 0 },
        { if: slot('m_matin', { flag: 'nina_cpe' }), at: [54.5, 10.7], face: 'up', wander: 0 },
        { if: slot('m_matin'), at: [28.6, 10.8], face: 'up', wander: 0 },
        { if: slot('m_recre'), at: [36.2, 28.6], face: 'right', wander: 0 },
        { if: slot('m_midi', { min: { trust_agneau: 3 } }), at: [15.9, 23.1], face: 'left', wander: 0 },
        { if: slot('m_midi'), at: [36.2, 28.6], face: 'right', wander: 0 },
        { if: slot('m_fin', { min: { trust_agneau: 3 } }), at: [17.6, 23.5], face: 'left', wander: 0 },
        { if: slot('m_fin'), at: [22.5, 19.8], face: 'down', wander: 0.3 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Franche, courageuse, protectrice',
        facts: [
          { text: 'Elle dit ce qu\'elle pense, même quand ça ne plaît pas. Elle était proche de Milo en 6e.' },
          { if: { clue: 'c_scene_cour' }, text: 'Elle a dit à Maxence que sa blague n\'était pas drôle.' },
          { if: { clue: 'c_chien_observe' }, text: 'Elle a remarqué que Milo mange seul depuis des semaines.' },
          { if: { clue: 'c_chien_tente' }, text: 'Elle a déjà essayé de parler à Maxence. Elle s\'est retrouvée un peu seule.' },
          { if: { clue: 'c_soutien' }, text: 'Lundi soir, elle t\'a écrit pour agir ensemble.' },
          { if: { flag: 'allie_chien' }, text: 'Elle est prête à agir avec toi.' }
        ]
      }
    },

    /* ---------------- Jade, le chat ---------------- */
    {
      id: 'jade', name: 'Jade', short: 'Jade', role: '5e B', emoji: '🐱', species: 'chat', speciesName: 'chatte',
      colors: { body: '#f3e1c8', stripes: '#c9a27a', ear: '#f4b6c2', muzzle: '#ffffff', eyes: '#3a9d5d', bg: '#fdf0f5', bg2: '#e9b7cf', tag: '#a61e4d' },
      outfit: { top: 'jacket', main: '#f7f1e3', inner: '#ef476f', bag: '#c8b6ff', acc: ['clip'], clip: '#ffd166' },
      moods: [
        { if: { flag: 'groupe_reagit' }, mood: 'worried' },
        { mood: 'happy' }
      ],
      homes: [
        { if: after({ flag: 'groupe_reagit' }), at: [19.8, 24.4], face: 'right', wander: 0.3 },
        { if: AFTER, at: [33.4, 22.6], face: 'left', wander: 0.2 },
        { if: slot('l_matin', { notFlag: 'scene_casier_done' }), at: [25.9, 11.6], face: 'up', wander: 0 },
        { if: slot('l_matin'), at: [31.4, 15.6], face: 'left', wander: 0 },
        { if: slot('l_recre'), at: [27.3, 24.6], face: 'up', wander: 0 },
        { if: slot('l_midi'), at: [45.8, 19.1], face: 'down', wander: 0 },
        { if: slot('m_matin', { flag: 'groupe_reagit' }), at: [44.4, 10.8], face: 'right', wander: 0 },
        { if: slot('m_matin'), at: [31.4, 15.6], face: 'left', wander: 0 },
        { if: slot('m_recre', { flag: 'groupe_reagit' }), at: [2.6, 22.6], face: 'right', wander: 0 },
        { if: slot('m_recre'), at: [27.3, 24.6], face: 'up', wander: 0 },
        { if: slot('m_midi'), at: [22, 33.2], face: 'right', wander: 0 },
        { if: slot('m_fin'), at: [27.5, 19.8], face: 'down', wander: 0.3 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Populaire, très suivie, toujours avec Maxence',
        facts: [
          { text: 'Tout le monde connaît Jade. Elle rit beaucoup… souvent avec Maxence.' },
          { if: { anyClue: ['c_scene_casier', 'c_scene_cantine'] }, text: 'Elle rit des remarques de Maxence sur Milo.' },
          { if: { flag: 'jade_rien' }, text: '« Moi j\'ai rien fait, j\'ai juste rigolé. »' },
          { if: { flag: 'groupe_reagit' }, text: 'Après lundi soir, elle a dit que la photo, « c\'était abusé ».' },
          { if: { flag: 'jade_change' }, text: 'Elle s\'est rendu compte que rire, c\'est aussi participer.' }
        ]
      }
    },

    /* ---------------- Sami, le lapin ---------------- */
    {
      id: 'sami', name: 'Sami', short: 'Sami', role: '5e B', emoji: '🐰', species: 'lapin', speciesName: 'lapin',
      colors: { body: '#c9b8a6', ear: '#f4b6c2', muzzle: '#ffffff', bg: '#eef6f2', bg2: '#b6d7c8', tag: '#2b8a6e' },
      outfit: { top: 'hoodie', main: '#5a6b7d', trim: '#9fd0ea', bag: '#f08a2c', acc: ['headphones'], phones: '#2b2d42', phones2: '#7fd1c7' },
      moods: [{ if: { flag: 'sami_soutien' }, mood: 'neutral' }, { mood: 'shy' }],
      homes: [
        { if: AFTER, at: [21.8, 21.2], face: 'down', wander: 0.3 },
        { if: slot('l_matin'), at: [31.4, 6.3], face: 'up', wander: 0 },
        { if: slot('l_recre'), at: [15, 23.1], face: 'down', wander: 0 },
        { if: slot('l_midi'), at: [31.4, 6.3], face: 'up', wander: 0 },
        { if: slot('m_matin'), at: [31.4, 6.3], face: 'up', wander: 0 },
        { if: slot('m_recre'), at: [15, 23.1], face: 'down', wander: 0 },
        { if: slot('m_midi'), at: [31.4, 6.3], face: 'up', wander: 0 },
        { if: slot('m_fin'), at: [56.4, 30.2], face: 'left', wander: 0 },
        { hidden: true, at: [1, 1] }
      ],
      sheet: {
        subtitle: 'Discret, passionné de mangas, toujours au CDI',
        facts: [
          { text: 'Il parle peu, il écoute beaucoup. Il passe ses pauses au CDI, avec son casque.' },
          { if: { clue: 'c_vus' }, text: 'Lundi soir, il a écrit un message dans le groupe… puis l\'a effacé.' },
          { if: { clue: 'c_sami_vu' }, text: 'Samedi, il a vu Maxence et Hugo cachés au skatepark.' },
          { if: { flag: 'sami_soutien' }, text: 'Il a décidé d\'écrire à Milo pour le soutenir.' }
        ]
      }
    },

    /* ---------------- Adultes ---------------- */
    {
      id: 'chouette', name: 'Mme Chouette', short: 'Mme Chouette', role: 'CPE', emoji: '🦉', species: 'chouette', notInNotebook: true,
      colors: { body: '#9a8470', bg: '#f1ece4', bg2: '#c9b8a0', tag: '#6d597a' },
      outfit: { top: 'cardigan', main: '#6d597a', inner: '#f4f1ea', trim: '#f2c94c', acc: ['glasses', 'lanyard'], lanyard: '#3d7cc9' },
      homes: [
        { if: slot('l_recre', { flag: 'conseil_adulte' }), at: [21.2, 20.3], face: 'down', wander: 0.4 },
        { if: slot('l_midi'), at: [48.5, 22.5], face: 'left', wander: 0.4 },
        { if: slot('l_soir'), hidden: true, at: [1, 1] },
        { if: slot('m_recre', { anyFlag: ['adult_informed', 'chouette_vigilante'] }), at: [20.5, 20.4], face: 'down', wander: 0.5 },
        { at: [52.8, 4.6], face: 'down', wander: 0.4 }
      ]
    },
    {
      id: 'blaireau', name: 'M. Blaireau', short: 'M. Blaireau', role: 'prof d\'EPS', emoji: '🦡', species: 'blaireau', notInNotebook: true,
      colors: { body: '#8d8f96', bg: '#eceff3', bg2: '#b9c0cc', tag: '#1d3557' },
      outfit: { top: 'tracksuit', main: '#1d3557', trim: '#e63946', acc: ['whistle'] },
      homes: [
        { if: { phase: 'evenement' }, at: [34.6, 25], face: 'left', wander: 0 },
        { if: { slot: ['l_matin', 'l_recre', 'm_recre', 'j_recre'] }, at: [12.5, 20.6], route: COUR_ROUTE, speed: 30, pause: 2 },
        { if: { slot: 'm_matin' }, at: [3, 10.6], route: [[3, 10.6], [60, 10.6]], speed: 30, pause: 3 },
        { if: { slot: 'm_midi' }, at: [25, 37.4], face: 'down', wander: 1 },
        { if: { slot: 'm_fin' }, at: [59.5, 33.3], face: 'left', wander: 0.5 },
        { hidden: true, at: [1, 1] }
      ]
    },

    /* ---------------- Les autres élèves ---------------- */
    {
      id: 'yanis', name: 'Yanis', short: 'Yanis', role: '5e B', emoji: '🐶', species: 'chien', notInNotebook: true,
      colors: { body: '#6b4a35', chest: '#d8b08a', ears: '#3a2a1e', spots: '#4a3020', bg: '#f3ece6', bg2: '#cbb39a' },
      outfit: { top: 'tshirt', main: '#ffd166', trim: '#264653', bag: '#264653' },
      homes: [
        { if: { slot: 'l_matin' }, at: [17.4, 24.2], face: 'left', wander: 0 },
        { if: { slot: ['l_recre', 'j_recre'] }, at: [38.6, 28.6], face: 'left', wander: 0 },
        { if: { slot: 'm_recre' }, at: [20.4, 27], face: 'right', wander: 0 },
        { if: { slot: 'l_midi' }, at: [39.8, 17.4], face: 'down', wander: 0 },
        { if: { slot: 'm_matin' }, at: [12, 10.8], face: 'up', wander: 0.4 },
        { if: { slot: 'm_midi' }, at: [20, 42.5], face: 'left', wander: 0 },
        { if: { slot: 'm_fin' }, at: [57.7, 30.3], face: 'left', wander: 0 },
        { hidden: true, at: [1, 1] }
      ]
    },
    {
      id: 'theo', name: 'Théo', short: 'Théo', role: '5e A', emoji: '🦆', species: 'canard', notInNotebook: true,
      colors: { body: '#fffdf5', beak: '#f2a33a', bg: '#fffbe6', bg2: '#f2d98a' },
      outfit: { top: 'hoodie', main: '#2a9d8f', trim: '#ffffff', acc: ['cap'], cap: '#264653', cap2: '#ffffff' },
      homes: [
        { if: { slot: 'l_matin' }, at: [50, 29.7], face: 'left', wander: 0.5 },
        { if: { slot: ['l_recre', 'j_recre'] }, at: [37.5, 31], face: 'up', wander: 0 },
        { if: { slot: 'l_midi' }, at: [44.5, 17.4], face: 'down', wander: 0 },
        { if: { slot: 'm_matin' }, at: [20.5, 16.2], face: 'right', wander: 0.4 },
        { if: { slot: 'm_recre' }, at: [21.6, 27], face: 'left', wander: 0 },
        { if: { slot: 'm_midi' }, at: [25, 44], face: 'up', wander: 0 },
        { hidden: true, at: [1, 1] }
      ]
    },
    {
      id: 'lena', name: 'Léna', short: 'Léna', role: '5e B', emoji: '🐈', species: 'chat', notInNotebook: true,
      colors: { body: '#e9a15a', stripes: '#c06d2a', ear: '#f4b6c2', muzzle: '#fff3e0', eyes: '#3d7cc9', bg: '#fff1e6', bg2: '#f2c094' },
      outfit: { top: 'sweater', main: '#b5838d', trim: '#ffffff', bag: '#6d597a' },
      homes: [
        { if: { slot: 'l_matin' }, at: [45.6, 10.8], face: 'left', wander: 0.3 },
        { if: { slot: 'l_recre' }, at: [8.6, 23.8], face: 'left', wander: 0 },
        { if: { slot: 'l_midi' }, at: [53.6, 18.8], face: 'down', wander: 0 },
        { if: { slot: 'm_matin' }, at: [45.6, 10.8], face: 'left', wander: 0 },
        { if: { slot: 'm_recre' }, at: [3.8, 22.6], face: 'left', wander: 0 },
        { if: { slot: 'm_midi' }, at: [23.3, 33.2], face: 'left', wander: 0 },
        { if: { slot: 'j_recre' }, at: [8.6, 23.8], face: 'left', wander: 0.3 },
        { hidden: true, at: [1, 1] }
      ]
    }
  ];
})();
