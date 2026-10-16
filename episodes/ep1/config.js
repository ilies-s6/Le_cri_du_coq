/* =========================================================
   CONFIGURATION — Épisode 1 : « Le secret de l'agneau »
   Réglages généraux, chronologie (jours et moments), solution de l'enquête,
   variantes de rejouabilité, objectifs affichés, textes de la révélation et du bilan.
   ========================================================= */
CDC.ep('ep1').config = {
  number: 1,
  title: 'Le secret de l\'agneau',
  player: 'coq',
  start: [24.5, 21],            // position de départ (remplacée par celle du moment de la journée)
  openingLine: 'Lundi matin. Allez, Noé, c\'est parti.',

  /* Variables cachées : elles changent selon tes choix. */
  vars: {
    trust_agneau: 0, trust_chien: 0, trust_cheval: 0, trust_cochon: 0, trust_renard: 0,
    suspicion_renard: 0,
    clues_found: 0,
    victim_identified: false,
    integration_score: 0,
    group_cohesion: 0,
    reaction: 0,                // qualité de tes réactions (empathie, demander de l'aide...)
    moquerie: 1,                // intensité des moqueries : monte si personne ne réagit
    rumeur: 0                   // la rumeur sur Milo : monte quand la photo circule
  },

  /* Les élèves de la classe et les adultes : déjà connus au début */
  knownAtStart: ['agneau', 'renard', 'cochon', 'cheval', 'chien', 'jade', 'sami', 'yanis', 'theo', 'lena', 'chouette', 'blaireau'],

  /* ⏰ Chronologie : chaque moment change les lieux, les scènes, les messages.
     start = position du joueur en arrivant · keyIf = ce qu'il ne faut pas rater
     phoneOnly = moment vécu uniquement sur le téléphone (le soir)
     phase = moment réservé à une autre phase (il bloque le passage du temps pendant l'enquête) */
  timeline: [
    { id: 'l_matin', day: 1, dayName: 'Lundi', moment: 'matin', time: '8 h 05', title: 'Avant la sonnerie',
      start: [24.5, 21], startDir: 'up', keyIf: { flag: 'scene_casier_done' },
      missingText: 'Il se passe peut-être quelque chose du côté des casiers, avant la sonnerie…',
      cardText: 'Les élèves arrivent. Il reste quelques minutes avant le début des cours.' },
    { id: 'l_recre', day: 1, dayName: 'Lundi', moment: 'recre', time: '10 h 00', title: 'Récréation',
      start: [24.5, 19.7], startDir: 'down', keyIf: { flag: 'recre_choix' },
      missingText: 'Le groupe de Maxence t\'a fait signe dans la cour. Tu n\'es pas allé les voir.',
      cardText: 'Quinze minutes de pause. Tout le monde sort dans la cour.' },
    { id: 'l_midi', day: 1, dayName: 'Lundi', moment: 'midi', time: '12 h 30', title: 'Pause déjeuner',
      start: [40.5, 22.6], startDir: 'up', keyIf: { flag: 'scene_cantine_done' },
      missingText: 'Regarde qui mange avec qui, à la cantine.',
      cardText: 'La cantine est pleine. Chacun cherche sa place.' },
    { id: 'l_soir', day: 1, dayName: 'Lundi soir', moment: 'soir', time: '21 h 14', title: 'Chez toi',
      phoneOnly: true, phoneThread: 'classe', phoneClock: '21:14',
      cardText: 'Tu as fini tes devoirs. Ton téléphone vibre : le groupe de la classe s\'agite.' },
    { id: 'm_matin', day: 2, dayName: 'Mardi', moment: 'matin', time: '8 h 05', title: 'Avant la sonnerie',
      start: [24.5, 21], startDir: 'up', keyIf: { clue: 'c_casier' },
      missingText: 'Quelque chose a changé dans le couloir des casiers depuis hier.',
      cardText: 'Un nouveau jour. Mais tout le monde a vu les messages d\'hier soir.' },
    { id: 'm_recre', day: 2, dayName: 'Mardi', moment: 'recre', time: '10 h 00', title: 'Récréation',
      start: [17, 21.6], startDir: 'right', keyIf: { flag: 'scene_agneau_evite_done' },
      missingText: 'Garde un œil sur la porte du hall : quelqu\'un hésite à sortir.',
      cardText: 'Dans la cour, une rumeur circule déjà.' },
    { id: 'm_midi', day: 2, dayName: 'Mardi', moment: 'midi', time: '12 h 30', title: 'Pause déjeuner',
      start: [24.5, 19.7], startDir: 'down', keyIf: { anyFlag: ['scene_conv_gradins_done', 'scene_conv_preau_done'] },
      missingText: 'Maxence et Hugo se sont éclipsés juste après la cantine. Où sont-ils allés ?',
      cardText: 'Après le repas, certains vont au terrain, d\'autres au CDI… ou se cachent.' },
    { id: 'm_fin', day: 2, dayName: 'Mardi', moment: 'fin', time: '16 h 30', title: 'Fin des cours',
      start: [24.5, 19.7], startDir: 'down', keyIf: { flag: 'scene_surprise_done' },
      missingText: 'Au parking à vélos, Maxence a coincé Hugo…',
      cardText: 'La sonnerie libère tout le monde. Dernière occasion d\'observer avant demain.' },
    { id: 'j_recre', day: 4, dayName: 'Jeudi', moment: 'recre', time: '10 h 00', title: 'Récréation', phase: 'reintegration',
      start: [24.5, 19.7], startDir: 'down',
      cardText: 'Deux jours plus tard. Cette fois, tu sais. Et tu vas agir.' }
  ],

  /* Le monde évolue : ces règles s'appliquent quand on quitte un moment (from).
     Elles se basent sur ce que tu as fait… ou pas fait. */
  onAdvance: [
    { from: 'l_recre', if: { flag: 'a_ri' }, do: { add: { moquerie: 1, trust_agneau: -1 } } },
    { from: 'l_recre', if: { notFlags: ['va_voir_milo', 'conseil_adulte', 'change_sujet'] }, do: { add: { moquerie: 1 } } },
    { from: 'l_soir', do: { add: { rumeur: 1 } } },
    { from: 'l_soir', if: { any: [{ flag: 'relaye' }, { flag: 'rire_ligne' }] }, do: { add: { rumeur: 2, moquerie: 1 } } },
    { from: 'l_soir', if: { notFlags: ['stop_ligne', 'signale', 'alerte_ent'] }, do: { add: { rumeur: 1, moquerie: 1 } } },
    { from: 'l_soir', if: { any: [{ flag: 'stop_ligne' }, { flag: 'signale' }] }, do: { flag: 'groupe_reagit', rel: { 'jade|renard': -1 } } },
    { from: 'l_soir', if: { flag: 'ecrit_milo' }, do: { rel: { 'agneau|coq': 1 } } },
    { from: 'm_matin', if: { notFlag: 'adult_informed' }, do: { add: { moquerie: 1 } } },
    { from: 'm_recre', if: { flag: 'adult_informed' }, do: { add: { moquerie: -1, rumeur: -1 } } },
    { from: 'm_midi', if: { notFlag: 'adult_informed' }, do: { add: { moquerie: 1 } } }
  ],

  /* Relations de départ entre les élèves (-3 = tension forte, +3 = très proches) */
  relations: [
    { a: 'agneau', b: 'renard', v: -2 },
    { a: 'agneau', b: 'cochon', v: -1 },
    { a: 'agneau', b: 'chien', v: 1 },
    { a: 'agneau', b: 'cheval', v: 0 },
    { a: 'agneau', b: 'sami', v: 0 },
    { a: 'cochon', b: 'renard', v: 2 },
    { a: 'jade', b: 'renard', v: 2 },
    { a: 'chien', b: 'renard', v: -2 },
    { a: 'cheval', b: 'chien', v: 1 }
  ],
  /* Élèves affichés dans l'onglet « Relations » du carnet */
  relationNodes: ['agneau', 'renard', 'cochon', 'jade', 'cheval', 'chien', 'sami'],
  /* Liens visibles (quand tu les as remarqués) et notes qui changent avec le temps */
  relationsView: [
    { a: 'agneau', b: 'renard', if: { anyClue: ['c_scene_casier', 'c_scene_cour', 'c_scene_cantine', 'c_agneau_evite'] }, notes: [
      { if: { flag: 'renard_limites' }, text: 'Tu as posé des limites à Maxence. Il fait plus attention.' },
      { if: { clue: 'c_agneau_evite' }, text: 'Milo fait demi-tour dès qu\'il voit Maxence.' },
      { text: 'Maxence se moque de Milo devant les autres.' }] },
    { a: 'cochon', b: 'renard', if: { anyClue: ['c_scene_casier', 'c_conv', 'c_surprise', 'c_scene_cour'] }, notes: [
      { if: { clue: 'c_surprise' }, text: 'Maxence menace Hugo de l\'exclure du groupe s\'il parle à Milo.' },
      { text: 'Hugo rit à toutes les blagues de Maxence.' }] },
    { a: 'agneau', b: 'cochon', if: { anyClue: ['c_invitation', 'c_cochon_aveu', 'c_photo', 'c_scene_casier'] }, notes: [
      { if: { flag: 'cochon_excuses' }, text: 'Hugo voudrait s\'excuser auprès de Milo.' },
      { if: { clue: 'c_photo' }, text: 'En 6e, Milo et Hugo étaient sur toutes les photos ensemble.' },
      { text: 'Hugo suit le mouvement, mais semble mal à l\'aise.' }] },
    { a: 'jade', b: 'renard', if: { met: 'jade', anyClue: ['c_scene_casier', 'c_scene_cantine', 'c_photo_volee'] }, notes: [
      { if: { flag: 'groupe_reagit' }, text: 'Depuis lundi soir, Jade prend ses distances avec Maxence.' },
      { text: 'Jade est toujours avec Maxence et rit avec lui.' }] },
    { a: 'agneau', b: 'chien', if: { anyClue: ['c_scene_cour', 'c_chien_observe', 'c_soutien'] }, notes: [
      { if: { min: { trust_agneau: 3 } }, text: 'Milo et Nina se reparlent. Il a retrouvé une amie.' },
      { text: 'Nina défend Milo, même quand elle est seule à le faire.' }] },
    { a: 'chien', b: 'renard', if: { clue: 'c_scene_cour' }, notes: [
      { text: 'Nina a dit « stop » à Maxence. Depuis, il l\'évite.' }] },
    { a: 'agneau', b: 'cheval', if: { anyClue: ['c_cheval_vu', 'c_cheval_samedi', 'c_vus'] }, notes: [
      { if: { flag: 'cheval_engage' }, text: 'Inès est prête à dire « stop » si elle revoit quelque chose.' },
      { text: 'Inès a tout vu, mais n\'a encore rien dit.' }] },
    { a: 'agneau', b: 'sami', if: { anyClue: ['c_sami_vu', 'c_vus'] }, notes: [
      { if: { flag: 'sami_soutien' }, text: 'Sami a écrit à Milo pour le soutenir.' },
      { text: 'Sami a vu, il a voulu réagir… puis il a effacé son message.' }] }
  ],

  /* Nombre d'indices minimum pour pouvoir tirer ses conclusions */
  minCluesToSolve: 8,
  /* … et il faut avoir observé au moins jusqu'à mardi matin */
  solveIf: { minSlot: 'm_matin' },
  solveWait: 'observe encore : attends au moins mardi pour voir si les choses se répètent',

  /* Rôles à deviner. need = nombre d'indices nécessaires pour « prouver » le rôle. */
  roles: [
    { key: 'victime', label: 'Élève isolé', question: 'Qui est mis à l\'écart, petit à petit ?', need: 2,
      hint: 'Repense à celui que l\'on voit de moins en moins avec le groupe, en classe comme en ligne.' },
    { key: 'harceleur', label: 'Harceleur', question: 'Qui lance les moqueries et pousse le groupe ?', need: 2,
      hint: 'Le marqueur rouge, la photo, « c\'est pris »… qui revient le plus souvent ?' },
    { key: 'suiveur', label: 'Suiveur', question: 'Qui suit le groupe, sans en être à l\'origine ?', need: 1,
      hint: 'Qui rit aux blagues… puis semble gêné ?' },
    { key: 'temoin', label: 'Témoin', question: 'Qui a vu des choses, sans oser intervenir ?', need: 1,
      hint: 'Qui voit tout passer, au local du matériel ou dans le groupe en ligne, sans rien dire ?' },
    { key: 'allie', label: 'Allié', question: 'Qui pourrait t\'aider à agir ?', need: 1,
      hint: 'Qui a déjà dit « stop », même toute seule ?' }
  ],
  suspects: ['agneau', 'renard', 'cochon', 'cheval', 'chien'],
  solution: { victime: 'agneau', harceleur: 'renard', suiveur: 'cochon', temoin: 'cheval', allie: 'chien' },

  why: {
    question: 'Pourquoi Milo est-il de plus en plus seul ?',
    hint: 'Un seul événement ne suffit pas à expliquer tout ce que tu as vu. Qu\'est-ce qui se répète, au collège et en ligne ?',
    options: [
      { id: 'timide', text: 'Il est timide et préfère simplement être seul.' },
      { id: 'repete', text: 'Des moqueries et des mises à l\'écart répétées, au collège et en ligne, lancées par Maxence et suivies par d\'autres.', correct: true },
      { id: 'dispute', text: 'Il s\'est disputé une fois avec Nina.' },
      { id: 'faute', text: 'Il a fait quelque chose de mal et le groupe le punit.' }
    ]
  },

  /* Variantes tirées au hasard à chaque partie (rejouabilité). weight = probabilité relative. */
  variants: {
    objet:       [{ value: 'echarpe' }, { value: 'carnet' }, { value: 'trousse' }],
    objet_lieu:  [{ value: 'boite' }, { value: 'gradins' }, { value: 'buisson' }],
    dessin_lieu: [{ value: 'cour' }, { value: 'cdi' }, { value: 'arts' }],
    conv_lieu:   [{ value: 'gradins' }, { value: 'preau' }],
    agneau_lieu: [{ value: 'preau', weight: 2 }, { value: 'cdi', weight: 1 }],
    cheval_vu:   [{ value: 'cache' }, { value: 'arrache' }]
  },

  /* Mots qui changent selon la variante : {objet} dans un texte devient « l'écharpe bleue de Milo »… */
  words: {
    objet: { echarpe: 'l\'écharpe bleue de Milo', carnet: 'le carnet de croquis de Milo', trousse: 'la trousse violette de Milo' },
    objetCourt: { from: 'objet', echarpe: 'son écharpe bleue', carnet: 'son carnet de croquis', trousse: 'sa trousse violette' }
  },

  /* Objectif affiché en haut de l'écran : le premier dont la condition est vraie. */
  objectives: [
    { if: { phase: 'enquete', slot: 'l_matin', notFlag: 'scene_casier_done' }, text: 'Avant la sonnerie : passe par le couloir des casiers.' },
    { if: { phase: 'enquete', slot: 'l_matin' }, text: 'Explore le collège, parle aux élèves. Passe à la suite avec ⏰ quand tu veux.' },
    { if: { phase: 'enquete', slot: 'l_recre', notFlag: 'recre_choix' }, text: 'Récré : observe ce qui se passe dans la cour.' },
    { if: { phase: 'enquete', slot: 'l_recre' }, text: 'Explore, écoute, parle. Les indices ✦ ne sont pas tous au même endroit.' },
    { if: { phase: 'enquete', slot: 'l_midi' }, text: 'Pause déjeuner : regarde qui mange avec qui.' },
    { if: { phase: 'enquete', slot: 'l_soir' }, text: 'Ton téléphone vibre. Lis les messages… et décide quoi faire.' },
    { if: { phase: 'enquete', slot: 'm_matin' }, text: 'Nouveau jour. Qu\'est-ce qui a changé depuis hier ?' },
    { if: { phase: 'enquete', max: { clues_found: 7 } }, text: 'Rassemble des indices et compare les témoignages dans ton carnet [C].' },
    { if: { phase: 'enquete' }, text: 'Tu peux tirer tes conclusions depuis ton carnet [C]… ou observer encore.' },
    { if: { phase: 'reintegration', flags: ['info_agneau', 'info_chien', 'info_cheval', 'info_cochon'] },
      text: 'Va au panneau des activités, dans le hall, pour organiser une activité.' },
    { if: { phase: 'reintegration' }, text: function (S) {
      var todo = [['info_agneau', 'Milo'], ['info_chien', 'Nina'], ['info_cheval', 'Inès'], ['info_cochon', 'Hugo']]
        .filter(function (x) { return !S.flags[x[0]]; }).map(function (x) { return x[1]; });
      return 'Prépare la suite : parle à ' + todo.join(', ') + '.';
    } },
    { if: { phase: 'evenement' }, text: 'L\'activité est en cours…' },
    { if: { phase: 'fin' }, text: 'Partie terminée. Merci d\'avoir joué !' }
  ],

  intro: [
    { icon: '🏫', title: 'Collège des Plumes',
      html: '<p>Tu t\'appelles <b>Noé</b>, tu es délégué de la <b>5e B</b>.</p>' +
        '<p>Depuis quelques semaines, l\'ambiance de la classe a changé. Des rires qui s\'arrêtent quand certains arrivent. Une place vide à la cantine. Des messages bizarres, le soir…</p>' +
        '<p><b>Qu\'est-ce qui se passe vraiment ?</b></p>' },
    { icon: '🔎', title: 'Ta mission',
      html: '<p><b>Observe</b> les élèves, <b>écoute</b> ce qui se dit (d\'un peu loin, sinon on se tait), examine ce qui brille <span class="spark">✦</span> et regarde ton <b>téléphone</b>.</p>' +
        '<p>Le temps passe : lundi, puis mardi. Ce que tu fais, ou ne fais pas, change la suite.</p>' +
        '<p>Tout est noté dans ton <b>carnet d\'enquête</b>. Quand tu auras compris, il faudra <b>agir</b>.</p>' },
    { icon: '🎮', title: 'Commandes',
      html: '<div class="keys"><div><kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd><span>Se déplacer</span></div>' +
        '<div><kbd>E</kbd><span>Parler, examiner, continuer</span></div>' +
        '<div><kbd>1</kbd> … <kbd>5</kbd> / clic<span>Choisir une réponse</span></div>' +
        '<div><kbd>C</kbd><span>Carnet d\'enquête</span></div>' +
        '<div><kbd>P</kbd><span>Téléphone</span></div>' +
        '<div><kbd>T</kbd><span>Passer au moment suivant</span></div>' +
        '<div><kbd>Échap</kbd><span>Fermer / pause</span></div></div>',
      touchHtml: '<div class="keys"><div>🕹️ <b>Joystick</b> (en bas à gauche)<span>Se déplacer</span></div>' +
        '<div><kbd>E</kbd> (en bas à droite)<span>Parler, examiner, continuer</span></div>' +
        '<div>👆 Touche une réponse<span>pour la choisir</span></div>' +
        '<div>📖 📱 ⏰ en haut<span>Carnet, téléphone, moment suivant</span></div>' +
        '<div>📱 Conseil<span>tourne l\'écran à l\'horizontale</span></div></div>' }
  ],

  about: '<p><b>Le Cri du Coq</b> est un jeu d\'enquête éducatif sur le harcèlement scolaire, pour les 11-15 ans.</p>' +
    '<p>Tous les personnages, les lieux et les messages sont <b>inventés</b>. La messagerie « Piaf » n\'existe pas : elle a été créée pour le jeu.</p>' +
    '<p>Si tu vis ou si tu vois une situation de harcèlement, parles-en à un adulte de confiance (parent, CPE, professeur, infirmière scolaire).</p>' +
    '<p>En France, le <b>3018</b> est le numéro national, gratuit et anonyme, contre le harcèlement et le cyberharcèlement (téléphone, tchat, appli).</p>',

  /* Les élèves dessinés en bas du menu principal */
  titleCast: [
    { id: 'chien', x: 0.1, dir: 'right' },
    { id: 'cheval', x: 0.24, s: 2.9 },
    { id: 'agneau', x: 0.38, mood: 'shy' },
    { id: 'coq', x: 0.52, mood: 'happy' },
    { id: 'jade', x: 0.66, dir: 'left' },
    { id: 'renard', x: 0.78, mood: 'smug', dir: 'left' },
    { id: 'cochon', x: 0.91, dir: 'left' }
  ],

  reveal: {
    thoughts: [
      'Attends…',
      '« Bêêêlo » devant les casiers. « C\'est pris » à la cantine. La photo du skatepark dans le groupe. Le casier tagué…',
      'Pris un par un, ça paraît petit. Mais ça arrive encore, et encore. Au collège, et le soir sur les téléphones.',
      'Ce n\'est pas une simple blague…'
    ],
    roleText: {
      victime: 'Il est mis à l\'écart, petit à petit. Ce n\'est pas de sa faute.',
      harceleur: 'Il lance les moqueries et pousse le groupe. Il cherche peut-être à rester populaire… mais rien ne l\'excuse.',
      suiveur: 'Il participe pour rester dans le groupe… et s\'en veut.',
      temoin: 'Elle a tout vu, mais n\'a pas osé intervenir. Elle avait peur d\'être la suivante.',
      allie: 'Elle a déjà essayé de dire stop. Elle est prête à aider.'
    },
    lesson: 'Le harcèlement, ce n\'est pas forcément des coups. Ce sont souvent de petits gestes et des messages, répétés, qui finissent par isoler quelqu\'un.',
    actionButton: 'Passer à l\'action →',
    jumpTo: 'j_recre',
    nextTitle: 'Jeudi : à toi d\'agir',
    next: '<p>Tu as compris la situation. Maintenant, il faut aider Milo à retrouver <b>progressivement</b> sa place.</p>' +
      '<p>Commence par parler à <b>Milo</b>, <b>Nina</b>, <b>Inès</b> et <b>Hugo</b>. Chacun a quelque chose d\'important à te dire.</p>' +
      '<p class="hint-soft">Tu peux aussi aller voir Maxence… ou Mme Chouette, la CPE, à la vie scolaire.</p>'
  },

  scoring: {
    cluesForFull: 26,           // nombre d'indices pour avoir le maximum de la partie « indices »
    reactionBase: 8,            // points de départ pour « Choix des réactions »
    categories: [
      { min: 80, icon: '🌟', label: 'Enquêteur et allié exemplaire' },
      { min: 60, icon: '👍', label: 'Bon allié' },
      { min: 40, icon: '🔎', label: 'Enquête à approfondir' },
      { min: 0, icon: '🌱', label: 'Il faut encore observer' }
    ]
  },

  end: {
    message: '« Parfois, le harcèlement commence par de petites actions qui se répètent, au collège comme en ligne. Observer, écouter et agir peut faire une vraie différence. »',
    impact: [
      { min: 6, label: 'Très positif', cls: 'good' },
      { min: 3, label: 'Positif', cls: 'good' },
      { min: 0, label: 'Mitigé', cls: 'mid' },
      { min: -99, label: 'Fragile', cls: 'bad' }
    ],
    notes: [
      { if: { flag: 'non_resolu' }, text: 'Écarter Maxence de l\'activité a soulagé Milo, mais n\'a rien réglé : il faut aussi poser des limites claires, et prévenir un adulte.' },
      { if: { notFlag: 'adult_informed' }, text: 'Tu n\'as prévenu aucun adulte. Quand une situation se répète ou passe en ligne, en parler à un adulte de confiance, ce n\'est pas « balancer » : c\'est protéger.' },
      { if: { flag: 'adult_informed' }, text: 'Tu as prévenu Mme Chouette : demander de l\'aide à un adulte est une vraie force.' },
      { if: { flag: 'renard_limites' }, text: 'Tu as posé des limites à Maxence sans l\'humilier : il a pu entendre que ses « blagues » faisaient mal.' },
      { if: { flag: 'cheval_engage' }, text: 'Inès a compris qu\'un témoin peut agir, même simplement en disant « stop ».' }
    ],
    /* Ce que tes choix ont changé (affiché dans le bilan) */
    consequences: [
      { if: { flag: 'a_ri' }, tone: 'bad', text: 'Lundi à la récré, tu as ri avec le groupe. Milo l\'a entendu : il lui a fallu plus de temps pour te faire confiance.' },
      { if: { flag: 'va_voir_milo' }, tone: 'good', text: 'Lundi à la récré, tu as quitté le groupe pour aller voir Milo. Un petit geste qu\'il n\'a pas oublié.' },
      { if: { flag: 'conseil_adulte' }, tone: 'good', text: 'Dès lundi, tu as demandé conseil à Mme Chouette au lieu de rester seul avec ce que tu avais vu.' },
      { if: { flag: 'assis_milo' }, tone: 'good', text: 'À la cantine, tu t\'es assis avec Milo : ce jour-là, il n\'a pas mangé seul.' },
      { if: { flag: 'rire_ligne' }, tone: 'bad', text: 'Ton « 😂 » sous la photo a encouragé d\'autres élèves à rire aussi.' },
      { if: { flag: 'relaye' }, tone: 'bad', text: 'Tu as transféré la photo de Milo. Elle a circulé encore plus loin… et elle a été vue par des élèves d\'autres classes.' },
      { if: { flag: 'pas_relaye', notFlag: 'relaye' }, tone: 'good', text: 'Tu n\'as pas fait circuler la photo. Ne pas relayer, c\'est déjà protéger.' },
      { if: { flag: 'stop_ligne' }, tone: 'good', text: 'Tu as écrit « supprime ça » dans le groupe. Après toi, Jade a osé dire que c\'était abusé, et la photo a été retirée.' },
      { if: { flag: 'silence_ligne', notFlag: 'stop_ligne' }, tone: 'mid', text: 'Dans le groupe, tu n\'as rien écrit, comme 23 autres élèves. Le silence de beaucoup laisse la place à quelques-uns.' },
      { if: { flag: 'capture_photo' }, tone: 'good', text: 'Tu as gardé une capture sans la partager : Mme Chouette a pu agir sur des faits précis.' },
      { if: { flag: 'signale', notFlag: 'adult_informed' }, tone: 'mid', text: 'Tu as signalé la photo. C\'est utile, mais la rumeur a continué : signaler ne suffit pas toujours, un adulte peut agir plus loin.' },
      { if: { flag: 'alerte_ent' }, tone: 'good', text: 'Tu as écrit à la vie scolaire dès que tu as vu la photo. Mme Chouette a pu intervenir dès le mardi.' },
      { if: { flag: 'nina_cpe' }, tone: 'good', text: 'Avec Nina, vous êtes allés voir la CPE ensemble : à deux, c\'est plus facile d\'oser.' },
      { if: { flag: 'ecrit_milo' }, tone: 'good', text: 'Ton message de lundi soir, Milo l\'a relu plusieurs fois. Il s\'est senti moins seul.' },
      { if: { min: { rumeur: 3 } }, tone: 'bad', text: 'La rumeur sur Milo a beaucoup tourné, parce que personne ne l\'a arrêtée assez tôt.' },
      { if: { max: { rumeur: 1 } }, tone: 'good', text: 'La rumeur s\'est vite essoufflée : quelques réactions au bon moment ont suffi à la freiner.' },
      { if: { min: { moquerie: 4 } }, tone: 'bad', text: 'Les moqueries ont augmenté jour après jour : sans soutien ni adulte prévenu, elles ont pris de plus en plus de place.' },
      { if: { min: { trust_agneau: 4 } }, tone: 'good', text: 'Milo a repris confiance. Jeudi, il est revenu dans la cour.' }
    ],
    lessons: [
      'Un témoin peut agir : ne pas rire, ne pas relayer, rester à côté de la victime, prévenir quelqu\'un.',
      'En ligne aussi : on peut garder une trace, signaler, et en parler à un adulte. Le 3018 est gratuit et anonyme.',
      'Demander de l\'aide, pour soi ou pour quelqu\'un d\'autre, est une bonne chose.',
      'Ce n\'est jamais la faute de la victime.',
      'Réintégrer quelqu\'un, ce n\'est pas « tout pardonner » : c\'est recréer un groupe où chacun est en sécurité.'
    ],
    replayNote: 'En rejouant, certains indices, lieux et réactions changeront, et tes choix mèneront à d\'autres conséquences.'
  }
};
