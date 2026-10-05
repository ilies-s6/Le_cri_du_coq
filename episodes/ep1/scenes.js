/* =========================================================
   SCÈNES D'OBSERVATION — Épisode 1
   ---------------------------------------------------------
   Des moments que le joueur peut surprendre en s'approchant (sans trop s'approcher).
     if        : condition pour que la scène se prépare
     actors    : personnages et leur position [x, y, direction] (en cases)
     center    : centre de la scène ; radius : distance d'écoute (en cases)
     interrupt : si le coq s'approche plus près que ça, ils se taisent
     steps     : { say, text } bulle · { move, to / path, speed } déplacement
                 { wait } pause · { clue } indice (si le coq écoute encore) · { hide }
   Une seule scène se prépare à la fois, dans l'ordre de la liste.
   ========================================================= */
(function () {
  var conv = [
    { say: 'renard', text: 'Alors, il est vraiment venu samedi ?' },
    { say: 'cochon', text: 'Ouais... Il a attendu près du grand chêne. Longtemps.' },
    { say: 'renard', text: 'Une fête qui n\'existe pas, et il y croit ! Trop fort.' },
    { say: 'cochon', text: 'Hé hé... ouais. Trop fort.' },
    { say: 'cochon', text: '...Il avait l\'air vraiment content de venir, quand même.', style: 'thought' },
    { say: 'renard', text: 'Et alors ? Tu vas pas pleurer pour lui ? C\'était pour rire.' },
    { clue: 'c_conv' }
  ];
  var surprise = [
    { say: 'renard', text: 'Je t\'ai vu parler à l\'agneau, hier.' },
    { say: 'cochon', text: 'Il m\'a juste demandé un crayon...' },
    { say: 'renard', text: 'Si tu traînes avec lui, tu traînes plus avec nous. C\'est simple.' },
    { say: 'cochon', text: '...D\'accord. D\'accord.' },
    { say: 'renard', text: 'Tout le monde pense pareil, de toute façon.' },
    { clue: 'c_surprise' }
  ];
  var interrupted = [
    { say: 'renard', text: ['Oh, salut le Coq ! On parlait de... rien.', 'Tiens, le Coq ! Tu nous espionnes ? Hé hé.'] },
    { say: 'cochon', text: ['Ouais, de rien ! Hé hé.', 'On parlait de... carottes !'] }
  ];
  var hint = '👂 Tu surprends une conversation... Reste à distance pour écouter.';

  CDC.ep('ep1').scenes = [
    { id: 'scene_cour', if: { phase: 'enquete', time: 4 },
      actors: { renard: [34.9, 24.6, 'right'], chien: [36.7, 24.6, 'left'] },
      center: [35.8, 24.6], radius: 6.5, hint: hint,
      steps: [
        { say: 'renard', text: 'Vous avez vu qui a encore mangé tout seul, au fond ? Hahaha !' },
        { say: 'chien', text: 'Arrête. C\'est pas drôle.' },
        { say: 'renard', text: 'Oh ça va, on rigole ! Faut pas être susceptible.' },
        { say: 'chien', text: 'Tu dis toujours ça.' },
        { clue: 'c_scene_cour' }
      ] },

    { id: 'scene_agneau_evite', if: { phase: 'enquete', minClues: 2, variant: { agneau_lieu: 'coin' } },
      actors: { agneau: [46.5, 22.7, 'left'], renard: [34.9, 24.6, 'right'] },
      center: [41, 23], radius: 9, armTime: 120,
      steps: [
        { move: 'agneau', to: [41.6, 22.7], speed: 38 },
        { wait: 0.6 },
        { say: 'agneau', text: '...', t: 1.4, style: 'thought' },
        { say: 'renard', text: 'Oh ! Regardez qui ose venir !' },
        { say: 'agneau', text: '(Non... pas aujourd\'hui.)', t: 2, style: 'thought' },
        { clue: 'c_agneau_evite' },
        { move: 'agneau', path: [[46.5, 22.7], [51.5, 22.7], [51.5, 19]], speed: 80 },
        { hide: 'agneau' }
      ] },

    { id: 'scene_conv_potager', if: { phase: 'enquete', minClues: 3, variant: { conv_lieu: 'potager' } },
      actors: { renard: [12.2, 35.6, 'right'], cochon: [13.9, 35.6, 'left'] },
      center: [13, 35.6], radius: 6.5, interrupt: 1.7, hint: hint, onInterrupt: interrupted, steps: conv },
    { id: 'scene_conv_ecurie', if: { phase: 'enquete', minClues: 3, variant: { conv_lieu: 'ecurie' } },
      actors: { renard: [45.2, 13.5, 'right'], cochon: [46.9, 13.5, 'left'] },
      center: [46, 13.5], radius: 6.5, interrupt: 1.7, hint: hint, onInterrupt: interrupted, steps: conv },

    { id: 'scene_surprise_pre', if: { phase: 'enquete', minClues: 6, variant: { conv_lieu: 'potager' } },
      actors: { renard: [17, 17.6, 'right'], cochon: [18.7, 17.6, 'left'] },
      center: [17.8, 17.6], radius: 6.5, interrupt: 1.7, hint: hint, onInterrupt: interrupted, steps: surprise },
    { id: 'scene_surprise_place', if: { phase: 'enquete', minClues: 6, variant: { conv_lieu: 'ecurie' } },
      actors: { renard: [41.5, 44.4, 'right'], cochon: [43.2, 44.4, 'left'] },
      center: [42.3, 44.4], radius: 6.5, interrupt: 1.7, hint: hint, onInterrupt: interrupted, steps: surprise }
  ];
})();
