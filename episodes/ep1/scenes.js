/* =========================================================
   SCÈNES D'OBSERVATION — Épisode 1
   ---------------------------------------------------------
   Des moments que le joueur peut surprendre en s'approchant.
     if        : condition pour que la scène se prépare (souvent : le moment de la journée)
     actors    : personnages et leur position [x, y, direction] (en cases)
     center    : centre de la scène ; radius : distance d'écoute (en cases)
     interrupt : si Noé s'approche plus près que ça, ils se taisent
     armTime   : temps d'attente maximum avant d'abandonner la scène (en secondes)
     steps     : { say, text, mood, style } bulle · { move, to / path, speed } déplacement
                 { wait } pause · { clue } indice (si Noé écoute encore) · { hide } · { do }
     after     : effets à la fin de la scène
   Une seule scène se prépare à la fois, dans l'ordre de la liste.
   ========================================================= */
(function () {
  var listen = '👂 Tu surprends une conversation… Reste à distance pour écouter.';
  var look = '👀 Il se passe quelque chose…';

  var conv = [
    { say: 'renard', text: 'Samedi, sa tête quand il a compris… J\'ai tout filmé, regarde.', mood: 'smug' },
    { say: 'cochon', text: 'Ouais… Il a attendu deux heures, quand même.' },
    { say: 'renard', text: 'Un anniv qui existe pas, et il y croit ! Avec un cadeau, en plus !' },
    { say: 'cochon', text: 'Hé hé… ouais. Trop fort.' },
    { say: 'cochon', text: '(…Il avait l\'air vraiment content de venir.)', style: 'thought', mood: 'sad' },
    { say: 'renard', text: 'Quoi, t\'as des remords ? C\'était pour rire. Personne l\'a forcé à venir.' },
    { clue: 'c_conv' }
  ];
  var interrupted = [
    { say: 'renard', text: ['Oh, salut Noé ! On parlait de… rien.', 'Tiens, Noé ! Tu nous espionnes ? Hé hé.'] },
    { say: 'cochon', text: ['Ouais, de rien ! Hé hé.', 'On parlait de… du contrôle de maths !'] }
  ];

  CDC.ep('ep1').scenes = [
    /* ---- Lundi, avant la sonnerie : devant les casiers ---- */
    { id: 'scene_casier', if: { phase: 'enquete', slot: 'l_matin' },
      actors: { renard: [25.6, 10.7, 'right'], cochon: [24.5, 10.9, 'right'], jade: [25.9, 11.6, 'up'], agneau: [27.5, 10.4, 'up'] },
      center: [26.4, 10.9], radius: 7, armTime: 900, hint: look,
      steps: [
        { wait: 0.6 },
        { say: 'renard', text: 'Oh, attention ! Voilà Bêêêlo !', mood: 'smug' },
        { say: 'cochon', text: 'Bêêêêê ! Hé hé.', mood: 'happy' },
        { say: 'jade', text: 'Arrêtez, vous êtes trop bêtes 😂', mood: 'happy' },
        { face: 'agneau', dir: 'up' },
        { say: 'agneau', text: '(Fais comme si t\'avais rien entendu.)', style: 'thought', mood: 'sad', t: 2.4 },
        { say: 'renard', text: 'Bah alors, on dit plus bonjour ?' },
        { clue: 'c_scene_casier' },
        { move: 'agneau', path: [[27.5, 11.4], [8, 11.4], [8, 8.6]], speed: 70 },
        { wait: 0.3 }
      ],
      after: { say: [['renard', 'Il est trop bizarre, sérieux.'], ['jade', 'Allez, ça va sonner.']] } },

    /* ---- Lundi, récréation : la « blague » de Maxence ---- */
    { id: 'scene_cour', if: { phase: 'enquete', slot: 'l_recre' },
      actors: { renard: [26.2, 23.4, 'right'], chien: [28.2, 23.4, 'left'], cochon: [25.1, 24.5, 'up'], jade: [27.3, 24.6, 'up'] },
      center: [26.8, 23.8], radius: 7, armTime: 900, hint: look,
      steps: [
        { wait: 0.8 },
        { say: 'renard', text: 'Vous avez vu qui a encore mangé tout seul, vendredi ? Comme un fantôme, au fond ! Hahaha !', mood: 'smug' },
        { say: 'cochon', text: 'Hahaha !' },
        { say: 'chien', text: 'Arrête. C\'est pas drôle.', mood: 'angry' },
        { say: 'renard', text: 'Oh ça va, on rigole ! Faut pas être susceptible.' },
        { say: 'chien', text: 'Tu dis toujours ça.', mood: 'angry' },
        { clue: 'c_scene_cour' },
        { move: 'chien', path: [[30, 25.6], [36.2, 28.6]], speed: 70 },
        { say: 'renard', text: 'Hé, Noé ! Viens par là !', t: 2 }
      ] },

    /* ---- Lundi midi : « C'est pris » ---- */
    { id: 'scene_cantine', if: { phase: 'enquete', slot: 'l_midi' },
      actors: { renard: [44.2, 19.1, 'down'], jade: [45.8, 19.1, 'down'], cochon: [45, 21.4, 'up'], agneau: [50.5, 21.6, 'left'] },
      center: [46.5, 20.6], radius: 7.5, armTime: 900, hint: look,
      steps: [
        { wait: 1 },
        { move: 'agneau', to: [47.7, 21.5], speed: 40 },
        { say: 'agneau', text: 'Je… je peux m\'asseoir là ?', mood: 'shy' },
        { say: 'renard', text: 'C\'est pris.', mood: 'smug' },
        { say: 'agneau', text: 'Mais… il y a personne.', mood: 'worried' },
        { say: 'jade', text: 'Si. Quelqu\'un d\'invisible. Ah non, c\'est toi 😂', mood: 'happy' },
        { say: 'cochon', text: '(…)', style: 'thought', mood: 'shy' },
        { clue: 'c_scene_cantine' },
        { move: 'agneau', path: [[50, 22.5], [57.5, 22.5], [58.6, 21.7]], speed: 45 },
        { face: 'agneau', dir: 'up' }
      ] },

    /* ---- Mardi, récréation : il fait demi-tour ---- */
    { id: 'scene_agneau_evite', if: { phase: 'enquete', slot: 'm_recre' },
      actors: { agneau: [24.5, 18.6, 'down'], renard: [26.2, 23.4, 'right'] },
      center: [25, 21], radius: 7, armTime: 120, hint: look,
      steps: [
        { move: 'agneau', to: [24.5, 20.3], speed: 35 },
        { wait: 0.6 },
        { say: 'agneau', text: '…', t: 1.4, style: 'thought' },
        { say: 'renard', text: 'Oh ! Regardez qui ose sortir ! Bêêêlo la star d\'internet !', mood: 'smug' },
        { say: 'agneau', text: '(Non… pas aujourd\'hui.)', t: 2, style: 'thought', mood: 'sad' },
        { clue: 'c_agneau_evite' },
        { move: 'agneau', path: [[24.5, 18.4], [24.5, 15.5]], speed: 80 },
        { hide: 'agneau' }
      ] },

    /* ---- Mardi midi : ce qu'ils disent quand ils se croient seuls ---- */
    { id: 'scene_conv_gradins', if: { phase: 'enquete', slot: 'm_midi', variant: { conv_lieu: 'gradins' } },
      actors: { renard: [14.3, 37.5, 'right'], cochon: [15.9, 37.5, 'left'] },
      center: [15.1, 37.5], radius: 6.5, interrupt: 1.8, armTime: 900, hint: listen, onInterrupt: interrupted, steps: conv },
    { id: 'scene_conv_preau', if: { phase: 'enquete', slot: 'm_midi', variant: { conv_lieu: 'preau' } },
      actors: { renard: [3.8, 22, 'right'], cochon: [5.4, 22, 'left'] },
      center: [4.6, 22], radius: 6.5, interrupt: 1.8, armTime: 900, hint: listen, onInterrupt: interrupted, steps: conv },

    /* ---- Mardi, fin des cours : la menace ---- */
    { id: 'scene_surprise', if: { phase: 'enquete', slot: 'm_fin' },
      actors: { renard: [51.4, 29.8, 'right'], cochon: [53, 29.8, 'left'] },
      center: [52.2, 29.8], radius: 6.5, interrupt: 1.8, armTime: 900, hint: listen, onInterrupt: interrupted,
      steps: [
        { say: 'renard', text: 'Je t\'ai vu parler à Milo, en techno.', mood: 'angry' },
        { say: 'cochon', text: 'Il m\'a juste demandé une règle…', mood: 'worried' },
        { say: 'renard', text: 'Si tu traînes avec lui, tu traînes plus avec nous. C\'est simple.' },
        { say: 'cochon', text: '…D\'accord. D\'accord.', mood: 'sad' },
        { say: 'renard', text: 'Tout le monde pense pareil, de toute façon. À demain.' },
        { clue: 'c_surprise' },
        { move: 'renard', path: [[51.4, 33.5], [44, 33.5]], speed: 70 },
        { hide: 'renard' }
      ] }
  ];
})();
