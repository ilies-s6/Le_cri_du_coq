/* =========================================================
   CONFIGURATION — Épisode 1 : « Le secret de l'agneau »
   Réglages généraux, solution de l'enquête, variantes de rejouabilité,
   objectifs affichés, textes de la révélation et du bilan.
   ========================================================= */
CDC.ep('ep1').config = {
  number: 1,
  title: 'Le secret de l\'agneau',
  player: 'coq',
  start: [27.5, 24.5],          // position de départ du coq (en cases)
  openingLine: 'Cocorico ! ...Hm. Quelque chose cloche, ce matin.',

  /* Variables cachées : elles changent selon tes choix. */
  vars: {
    trust_agneau: 0, trust_chien: 0, trust_cheval: 0, trust_cochon: 0, trust_renard: 0,
    suspicion_renard: 0,
    clues_found: 0,
    victim_identified: false,
    integration_score: 0,
    group_cohesion: 0,
    reaction: 0                 // qualité de tes réactions (empathie, demander de l'aide...)
  },

  /* Nombre d'indices minimum pour débloquer « Résoudre l'enquête » */
  minCluesToSolve: 8,

  /* Rôles à deviner. need = nombre d'indices trouvés nécessaires pour « prouver » le rôle. */
  roles: [
    { key: 'victime', label: 'Victime', question: 'Qui semble être la victime ?', need: 2,
      hint: 'Repense à celui que l\'on voit de moins en moins avec le groupe.' },
    { key: 'harceleur', label: 'Harceleur', question: 'Qui semble exercer la pression sur le groupe ?', need: 2,
      hint: 'Les traces, le feutre, les « blagues »... qui revient le plus souvent ?' },
    { key: 'suiveur', label: 'Suiveur', question: 'Qui suit le groupe, sans en être à l\'origine ?', need: 1,
      hint: 'Qui rit aux blagues... puis semble gêné ?' },
    { key: 'temoin', label: 'Témoin', question: 'Qui a vu des choses, sans intervenir ?', need: 1,
      hint: 'Qui voit tout passer, depuis son coin, sans oser parler ?' },
    { key: 'allie', label: 'Allié', question: 'Qui pourrait t\'aider à agir ?', need: 1,
      hint: 'Qui a déjà dit « stop », même tout seul ?' }
  ],
  suspects: ['agneau', 'renard', 'cochon', 'cheval', 'chien'],
  solution: { victime: 'agneau', harceleur: 'renard', suiveur: 'cochon', temoin: 'cheval', allie: 'chien' },

  why: {
    question: 'Pourquoi l\'agneau est-il isolé ?',
    hint: 'Un seul événement ne suffit pas à expliquer tout ce que tu as vu. Qu\'est-ce qui se répète ?',
    options: [
      { id: 'timide', text: 'Il est timide et préfère simplement être seul.' },
      { id: 'repete', text: 'Des moqueries et des mises à l\'écart répétées, lancées par le renard et suivies par d\'autres.', correct: true },
      { id: 'dispute', text: 'Il s\'est disputé une fois avec le chien.' },
      { id: 'faute', text: 'Il a fait quelque chose de mal et le groupe le punit.' }
    ]
  },

  /* Variantes tirées au hasard à chaque partie (rejouabilité).
     weight = probabilité relative. */
  variants: {
    objet:       [{ value: 'echarpe' }, { value: 'carnet' }, { value: 'trousse' }],
    objet_lieu:  [{ value: 'boite' }, { value: 'champ' }, { value: 'compost' }],
    dessin_lieu: [{ value: 'poubelle' }, { value: 'foin' }, { value: 'abreuvoir' }],
    conv_lieu:   [{ value: 'potager' }, { value: 'ecurie' }],
    agneau_lieu: [{ value: 'coin', weight: 3 }, { value: 'champ', weight: 1 }],
    chien_lieu:  [{ value: 'cour' }, { value: 'place' }],
    cheval_vu:   [{ value: 'cache' }, { value: 'arrache' }]
  },

  /* Mots qui changent selon la variante : {objet} dans un texte devient « l'écharpe bleue »... */
  words: {
    objet: { echarpe: 'l\'écharpe bleue de l\'agneau', carnet: 'le carnet de croquis de l\'agneau', trousse: 'la trousse violette de l\'agneau' },
    objetCourt: { from: 'objet', echarpe: 'son écharpe bleue', carnet: 'son carnet de croquis', trousse: 'sa trousse violette' }
  },

  /* Objectif affiché en haut de l'écran : le premier dont la condition est vraie. */
  objectives: [
    { if: { phase: 'enquete', max: { clues_found: 2 } }, text: 'Quelque chose cloche à la ferme. Explore, observe et parle aux animaux.' },
    { if: { phase: 'enquete', max: { clues_found: 7 } }, text: 'Récolte des indices et fais le point dans ton carnet [C].' },
    { if: { phase: 'enquete' }, text: 'Tu peux tenter de résoudre l\'enquête depuis ton carnet [C]... ou chercher encore.' },
    { if: { phase: 'reintegration', flags: ['info_agneau', 'info_chien', 'info_cheval', 'info_cochon'] },
      text: 'Va au panneau de la place des activités 🎪 pour organiser une activité.' },
    { if: { phase: 'reintegration' }, text: function (S) {
      var todo = [['info_agneau', 'l\'agneau'], ['info_chien', 'le chien'], ['info_cheval', 'le cheval'], ['info_cochon', 'le cochon']]
        .filter(function (x) { return !S.flags[x[0]]; }).map(function (x) { return x[1]; });
      return 'Prépare la suite : parle à ' + todo.join(', ') + '.';
    } },
    { if: { phase: 'evenement' }, text: 'L\'activité est en cours...' },
    { if: { phase: 'fin' }, text: 'Partie terminée. Merci d\'avoir joué !' }
  ],

  intro: [
    { icon: '🐓', title: 'La Ferme des Plumes',
      html: '<p>Comme chaque matin, tu es le premier debout. Mais depuis quelques jours, quelque chose a changé.</p>' +
        '<p>Des rires qui s\'arrêtent quand tu arrives. Une place vide à table. Un animal semble peu à peu mis à l\'écart...</p>' +
        '<p><b>Mais lequel ? Et pourquoi ?</b></p>' },
    { icon: '🔎', title: 'Ta mission',
      html: '<p>Explore la ferme, <b>observe</b> les comportements, <b>écoute</b> les conversations (de loin, sinon on se tait !), ' +
        'examine les objets qui scintillent <span class="spark">✦</span> et note tout dans ton carnet.</p>' +
        '<p>Quand tu auras compris, il faudra <b>agir</b>.</p>' },
    { icon: '🎮', title: 'Commandes',
      html: '<div class="keys"><div><kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> ou <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> Se déplacer</div>' +
        '<div><kbd>E</kbd> Interagir / parler / passer</div>' +
        '<div><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> ou clic : choisir une réponse</div>' +
        '<div><kbd>C</kbd> ou <kbd>Tab</kbd> Ouvrir le carnet d\'enquête</div>' +
        '<div><kbd>Échap</kbd> Fermer · <kbd>M</kbd> Couper le son</div></div>',
      /* Version affichée sur téléphone / tablette */
      touchHtml: '<div class="keys"><div>🕹️ <b>Joystick</b> (en bas à gauche) : se déplacer</div>' +
        '<div><kbd>E</kbd> (en bas à droite) : parler, examiner, continuer</div>' +
        '<div>👆 Touche une réponse pour la choisir, touche la bulle pour passer</div>' +
        '<div>📖 Ouvrir le carnet d\'enquête</div>' +
        '<div>📱 Conseil : tourne ton téléphone à l\'horizontale.</div></div>' }
  ],

  reveal: {
    thoughts: [
      'Attends...',
      'Le A rayé sur le banc. L\'invitation à une fête qui n\'existait pas. Les « blagues » du renard...',
      'Pris un par un, ça paraît petit. Mais ça arrive encore, et encore.',
      'Ce n\'est pas une simple blague...'
    ],
    roleText: {
      victime: 'Il est mis à l\'écart, petit à petit. Ce n\'est pas de sa faute.',
      harceleur: 'Il lance les moqueries et pousse le groupe, sans jamais frapper.',
      suiveur: 'Il participe pour rester dans le groupe... et s\'en veut.',
      temoin: 'Il a tout vu, mais n\'a pas osé intervenir.',
      allie: 'Il a déjà essayé de dire stop. Il est prêt à aider.'
    },
    lesson: 'Le harcèlement, ce n\'est pas forcément des coups. Ce sont souvent de nombreux petits gestes, répétés, qui finissent par isoler quelqu\'un.',
    next: '<p>Tu as compris la situation. Maintenant, il faut aider l\'agneau à retrouver <b>progressivement</b> sa place.</p>' +
      '<p>Commence par parler à <b>l\'agneau</b>, au <b>chien</b>, au <b>cheval</b> et au <b>cochon</b>. Chacun a quelque chose d\'important à te dire.</p>' +
      '<p class="hint-soft">Tu peux aussi aller voir le renard... ou un adulte. 🦉</p>'
  },

  scoring: {
    cluesForFull: 24,           // nombre d'indices pour avoir le maximum de la partie « indices »
    reactionBase: 8,            // points de départ pour « Choix des réactions »
    categories: [
      { min: 80, icon: '🌟', label: 'Excellent enquêteur' },
      { min: 60, icon: '👍', label: 'Bon allié' },
      { min: 40, icon: '🔎', label: 'Enquête à approfondir' },
      { min: 0, icon: '🌱', label: 'Il faut encore observer' }
    ]
  },

  end: {
    message: '« Parfois, le harcèlement commence par de petites actions qui se répètent. Observer, écouter et agir peut faire une vraie différence. »',
    impact: [
      { min: 6, label: 'Très positif', cls: 'good' },
      { min: 3, label: 'Positif', cls: 'good' },
      { min: 0, label: 'Mitigé', cls: 'mid' },
      { min: -99, label: 'Fragile', cls: 'bad' }
    ],
    notes: [
      { if: { flag: 'non_resolu' }, text: 'Écarter le renard a soulagé l\'agneau, mais n\'a rien réglé : il faut aussi poser des limites claires, et parfois prévenir un adulte.' },
      { if: { notFlag: 'adult_informed' }, text: 'Tu n\'as pas prévenu d\'adulte. Quand une situation dure ou devient grave, en parler à un adulte de confiance, ce n\'est pas « balancer » : c\'est protéger.' },
      { if: { flag: 'adult_informed' }, text: 'Tu as prévenu la Chouette : demander de l\'aide à un adulte est une vraie force.' },
      { if: { flag: 'renard_limites' }, text: 'Tu as posé des limites au renard sans l\'humilier : il a pu entendre que ses « blagues » faisaient mal.' },
      { if: { flag: 'cheval_engage' }, text: 'Le cheval a compris qu\'un témoin peut agir, même simplement en disant « stop ».' }
    ],
    lessons: [
      'Un témoin peut agir : dire stop, rester à côté de la victime, prévenir quelqu\'un.',
      'Demander de l\'aide, pour soi ou pour un autre, est une bonne chose.',
      'Ce n\'est jamais la faute de la victime.',
      'Réintégrer quelqu\'un, ce n\'est pas « tout pardonner » : c\'est recréer un groupe où chacun est en sécurité.'
    ],
    replayNote: 'En rejouant, certains indices, objets et dialogues changeront. Sauras-tu tout découvrir ?'
  }
};
