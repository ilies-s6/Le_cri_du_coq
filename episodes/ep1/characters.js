/* =========================================================
   PERSONNAGES — Épisode 1
   ---------------------------------------------------------
   id        : identifiant utilisé partout (dialogues, indices...)
   species   : dessin utilisé (voir js/sprites.js : coq, agneau, renard, cochon, cheval, chien, chouette)
   colors    : couleurs du dessin (et du fond du portrait : bg, bg2)
   homes     : où se trouve le personnage. La première ligne dont la condition « if »
               est vraie est utilisée. at = [x, y] en cases, wander = rayon de promenade.
   trustVar  : variable de confiance affichée (« Attitude envers toi ») dans le carnet
   sheet     : fiche du carnet. Chaque « fact » apparaît quand sa condition est remplie.
   ========================================================= */
CDC.ep('ep1').characters = [
  {
    id: 'coq', player: true, name: 'Coq', emoji: '🐓', species: 'coq',
    colors: { body: '#fff6e6', wing: '#f0d2a8', comb: '#e53935', tail: '#2e8b6f', tail2: '#f57c00', bg: '#fff1d6', bg2: '#f6c27a' },
    sheet: {
      subtitle: 'Toi · curieux, courageux, empathique, observateur',
      facts: [
        { text: 'Tu te lèves avant tout le monde et tu remarques les petits détails.' },
        { text: 'Depuis quelques jours, l\'ambiance du groupe a changé. Tu veux comprendre pourquoi.' },
        { if: { minClues: 5 }, text: 'Plusieurs indices semblent former un même schéma...' },
        { if: { flag: 'adult_informed' }, text: 'Tu as osé en parler à la Chouette.' },
        { if: { phase: ['reintegration', 'evenement', 'fin'] }, text: 'Tu as compris la situation. Maintenant, tu agis.' }
      ]
    }
  },
  {
    id: 'agneau', name: 'Agneau', emoji: '🐑', species: 'agneau', trustVar: 'trust_agneau',
    colors: { body: '#fbfbf7', face: '#5d5560', bg: '#eef3ff', bg2: '#b9c8f0' },
    homes: [
      { if: { phase: ['reintegration', 'evenement', 'fin'], min: { trust_agneau: 4 } }, at: [26.5, 25.2], wander: 0.6 },
      { if: { phase: 'enquete', variant: { agneau_lieu: 'champ' }, max: { clues_found: 5 } }, at: [3.5, 12.6], wander: 0.6 },
      { at: [54.6, 44.3], face: 'right', wander: 0.4 }
    ],
    sheet: {
      facts: [
        { if: { met: 'agneau' }, text: 'Gentil, discret et réservé. Il hésite souvent avant de parler.' },
        { if: { anyClue: ['c_coin', 'c_carnet'] }, text: 'Il vient souvent seul au coin tranquille.' },
        { if: { anyClue: ['c_agneau_evite', 'c_agneau_mots'] }, text: 'Il évite la cour, surtout quand le renard y est.' },
        { if: { clue: 'c_agneau_talent' }, text: 'Il dessine des cartes incroyables de la ferme. Il connaît chaque recoin.' },
        { if: { flag: 'agneau_dessin_dit' }, text: '« La dernière fois que j\'ai montré un dessin, il a fini déchiré. »' },
        { if: { anyClue: ['c_invitation', 'c_attente'] }, text: 'Samedi, il est allé à une fête... qui n\'existait pas.' },
        { if: { anyClue: ['c_banc', 'c_table', 'c_photo'] }, text: 'Avant, il faisait pleinement partie du groupe.' },
        { if: { flag: 'info_agneau' }, text: 'Il n\'aime pas la compétition. Il aime les énigmes et se sent rassuré avec le chien.' }
      ]
    }
  },
  {
    id: 'renard', name: 'Renard', emoji: '🦊', species: 'renard', trustVar: 'trust_renard',
    colors: { body: '#f07a2a', chest: '#fff4e8', dark: '#4a2c1a', bg: '#fff0e0', bg2: '#f5b37a' },
    homes: [
      { at: [34.9, 24.6], face: 'left', wander: 0.8 }
    ],
    sheet: {
      facts: [
        { if: { met: 'renard' }, text: 'Charismatique, sûr de lui et populaire. Il sait se rendre sympathique.' },
        { if: { anyClue: ['c_scene_cour', 'c_renard_discours'] }, text: 'Ses « blagues » ne font pas rire tout le monde. Il dit souvent « on rigolait juste ».' },
        { if: { anyClue: ['c_stylo', 'c_empreintes', 'c_boite'] }, text: 'Plusieurs traces mènent à lui à l\'écurie.' },
        { if: { flag: 'renard_feutre' }, text: 'Il a perdu son sourire quand tu as parlé de l\'affiche écrite en rouge.' },
        { if: { anyClue: ['c_conv', 'c_surprise'] }, text: 'Il met la pression sur le cochon pour qu\'il reste « avec eux ».' },
        { if: { flag: 'renard_limites' }, text: 'Tu lui as posé des limites calmement. Il a semblé entendre.' }
      ]
    }
  },
  {
    id: 'cochon', name: 'Cochon', emoji: '🐷', species: 'cochon', trustVar: 'trust_cochon',
    colors: { body: '#f7b0c0', snout: '#f48aa0', dark: '#e07a92', bg: '#ffeef3', bg2: '#f5b6c8' },
    homes: [
      { at: [14, 35.6], wander: 1.5 }
    ],
    sheet: {
      facts: [
        { if: { met: 'cochon' }, text: 'Drôle et sociable. Il raconte des blagues à tout le monde.' },
        { if: { flag: 'cochon_nerveux' }, text: 'Il devient nerveux quand on parle de l\'agneau.' },
        { if: { clue: 'c_cagette' }, text: 'Il se demande si certaines de ses blagues sont « trop méchantes ».' },
        { if: { anyClue: ['c_conv', 'c_surprise'] }, text: 'Il suit le renard, même quand ça le gêne.' },
        { if: { clue: 'c_cochon_aveu' }, text: '« Je voulais juste rigoler avec eux. Je pensais pas que ça lui ferait autant de mal. »' },
        { if: { flag: 'cochon_excuses' }, text: 'Il aimerait s\'excuser auprès de l\'agneau.' }
      ]
    }
  },
  {
    id: 'cheval', name: 'Cheval', emoji: '🐴', species: 'cheval', trustVar: 'trust_cheval', scale: 1.15, markY: 58,
    colors: { body: '#a8693c', mane: '#4a2c1a', muzzle: '#d8b08a', dark: '#5a3a22', bg: '#f6ead8', bg2: '#d6b48a' },
    homes: [
      { at: [57, 7.6], wander: 1 }
    ],
    sheet: {
      facts: [
        { if: { met: 'cheval' }, text: 'Calme et observateur. Il passe ses journées à l\'écurie.' },
        { if: { flag: 'cheval_vu_teaser' }, text: '« J\'ai vu quelque chose hier... » Il n\'ose pas en dire plus.' },
        { if: { clue: 'c_cheval_vu' }, text: 'Il a vu le renard faire quelque chose de louche à l\'écurie.' },
        { if: { clue: 'c_cheval_hesite' }, text: 'Il n\'est jamais intervenu : il ne savait pas quoi faire.' },
        { if: { flag: 'cheval_engage' }, text: 'Il est prêt à agir, cette fois.' }
      ]
    }
  },
  {
    id: 'chien', name: 'Chien', emoji: '🐕', species: 'chien', trustVar: 'trust_chien',
    colors: { body: '#d9a066', chest: '#fff2dc', ears: '#8a5a2b', bg: '#fff3dd', bg2: '#e8c08a' },
    homes: [
      { if: { phase: 'enquete', notFlag: 'scene_cour_done' }, at: [36.7, 24.6], face: 'left', wander: 0 },
      { if: { variant: { chien_lieu: 'place' } }, at: [38.5, 38.6], wander: 1 },
      { at: [27.4, 21.6], wander: 0.8 }
    ],
    sheet: {
      facts: [
        { if: { met: 'chien' }, text: 'Courageux, protecteur et direct. Il dit ce qu\'il pense.' },
        { if: { clue: 'c_scene_cour' }, text: 'Il a dit au renard que sa blague n\'était pas drôle.' },
        { if: { clue: 'c_chien_observe' }, text: 'Il a remarqué que quelqu\'un mange seul depuis des semaines.' },
        { if: { clue: 'c_chien_tente' }, text: 'Il a déjà essayé de parler au renard. Il s\'est retrouvé un peu seul.' },
        { if: { flag: 'allie_chien' }, text: 'Il est prêt à agir avec toi.' }
      ]
    }
  },
  {
    id: 'chouette', name: 'Madame Chouette', emoji: '🦉', species: 'chouette', notInNotebook: true,
    colors: { body: '#9a8470', belly: '#e9dcc4', bg: '#f1ece4', bg2: '#c9b8a0' },
    homes: [
      { at: [35.5, 36.2], wander: 0.5 }
    ]
  }
];
