/* =========================================================
   CARTE — Épisode 1 : La Ferme des Plumes
   ---------------------------------------------------------
   La carte est une grille de caractères (1 caractère = 1 case de 32 px).
   Pour la modifier : remplace des caractères ci-dessous (garde la même
   longueur pour toutes les lignes). La légende dit ce que chaque
   caractère représente et s'il bloque le passage (solid).
   Les objets (arbres, bancs, indices...) sont dans « props », placés en
   coordonnées de cases (x = colonne, y = ligne, en partant de 0).
   ========================================================= */
CDC.ep('ep1').map = {
  legend: {
    '.': { ground: 'grass' },
    ',': { ground: 'flowers' },
    'h': { ground: 'field' },          // champ
    '=': { ground: 'path' },           // chemin
    's': { ground: 'stone' },          // pavés de la cour
    'a': { ground: 'sand' },           // sable de la place des activités
    'p': { ground: 'soil' },           // terre du potager
    'c': { ground: 'crops', solid: true },   // rangs de légumes
    '_': { ground: 'floor' },          // plancher de l'écurie
    'w': { ground: 'wall', solid: true },    // murs de l'écurie
    'f': { ground: 'fence', solid: true },   // clôture
    '#': { ground: 'hedge', solid: true },   // haie
    '~': { ground: 'water', solid: true }    // mare
  },

  ascii: [
    '################################################################',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f...................#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..wwwwwwwwwwwwwww..#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..w___w___w_____w..#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..w___w___w_____w..#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..w___w___w_____w..#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..w___w___w_____w..#',
    '#hhhhhhhhhhhhhhhhhhhhf.....................f..w_____________w..#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f..w_____________w..#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f..w_____________w..#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f..w_____________w..#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f..wwwww__wwwwwwww..#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f.......==..........#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f.......==..........#',
    '#hhhhhhhhhhhhh==hhhhhf.....................f.......==..........#',
    '#fffffffffffff==ffffff.....................f.......==..........#',
    '#.............==...........................ffffffff==ffffffffff#',
    '#.............==......ssssssssssssssssssss.........==..........#',
    '#.............==......ssssssssssssssssssss.........==..........#',
    '#.............==......ssssssssssssssssssss.........==..........#',
    '#.............==......ssssssssssssssssssss.........==..........#',
    '#.............==......ssssssssssssssssssss.........==..........#',
    '#.............========ssssssssssssssssssss===========..........#',
    '#.............========ssssssssssssssssssss==========...........#',
    '#.....................ssssssssssssssssssss.....................#',
    '#.....................ssssssssssssssssssss.....................#',
    '#..............=======ssssssssssssssssssss.....................#',
    '#..............=======ssssssssssssssssssss.....................#',
    '#..............==.....ssssssssssssssssssss.....................#',
    '#..............==.....ssssssssssssssssssss.....................#',
    '#..............==.....ssssssssssssssssssss.....................#',
    '#ffffffffffffff==fffff.........==..............................#',
    '#.pppppppppppppppppppf.........==..............................#',
    '#.pppppppppppppppppppf.........==..............#################',
    '#.ppccccccppcccccccppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,,,,,,,,#',
    '#.ppccccccppcccccccppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa=========,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa==#======,,,,,,,,,#',
    '#.ppccccccppcccccccppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,==,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,,,,,,,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,~~~~~,,#',
    '#.ppccccccppcccccccppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,~~~~~,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,~~~~~,,#',
    '#.pppppppppppppppppppf..aaaaaaaaaaaaaaaaaaaaa..#,,,,,,,,~~~~~,,#',
    '#....................f.........................#,,,,,,,,,,,,,,,#',
    '################################################################'

  ],

  /* Zones nommées (rectangles en cases : [x0, y0, x1, y1]). La première qui contient le joueur gagne. */
  zones: [
    { id: 'cour',    name: '🏡 La cour centrale',       rect: [22, 17, 41, 30] },
    { id: 'champ',   name: '🌾 Le champ',               rect: [1, 1, 20, 14] },
    { id: 'ecurie',  name: '🐴 L\'écurie',              rect: [43, 1, 62, 15] },
    { id: 'potager', name: '🥕 Le potager',             rect: [1, 31, 20, 46] },
    { id: 'coin',    name: '🌳 Le coin tranquille',     rect: [48, 34, 62, 46] },
    { id: 'place',   name: '🎪 La place des activités', rect: [22, 32, 46, 46] },
    { id: 'verger',  name: '🍎 Le verger',              rect: [22, 1, 42, 16] },
    { id: 'pre',     name: '🌼 Le pré',                 rect: [1, 15, 21, 30] },
    { id: 'prairie', name: '🌿 La prairie',             rect: [42, 16, 62, 33] }
  ],

  /* Objets. examine = identifiant du texte dans objects.js (rend l'objet interactif).
     if = condition d'apparition (ex. selon la variante tirée pour la partie). */
  props: [
    // ---------- La cour centrale ----------
    { type: 'fountain', x: 30, y: 21, examine: 'fontaine', label: 'Observer' },
    { type: 'bench', x: 24, y: 19, examine: 'banc', scratched: true },
    { type: 'bench', x: 37, y: 19 },
    { type: 'bench', x: 24, y: 27 },
    { type: 'bench', x: 37, y: 27 },
    { type: 'table', x: 29, y: 27, w: 4, h: 2, examine: 'table', bowls: true },
    { type: 'board', x: 25, y: 17, examine: 'panneau', torn: true, label: 'Lire' },
    { type: 'board', x: 33, y: 17, examine: 'photos', papers: ['#fff', '#ffe0b2', '#fff'], label: 'Regarder' },
    { type: 'bin', x: 40, y: 25, examine: 'poubelle', label: 'Fouiller' },
    { type: 'tree', x: 22, y: 17 }, { type: 'tree', x: 41, y: 17 },
    { type: 'tree', x: 22, y: 29 }, { type: 'tree', x: 41, y: 29 },
    { type: 'flowerpot', x: 29, y: 17 }, { type: 'flowerpot', x: 37, y: 17 },
    { type: 'lantern', x: 28, y: 20 }, { type: 'lantern', x: 35, y: 20 },

    // ---------- Le pré ----------
    { type: 'tree', x: 3, y: 18 }, { type: 'tree', x: 9, y: 19 }, { type: 'tree', x: 4, y: 25 },
    { type: 'tree', x: 11, y: 27 }, { type: 'tree', x: 2, y: 29 }, { type: 'tree', x: 19, y: 18 },
    { type: 'well', x: 6, y: 21, examine: 'puits' },
    { type: 'bush', x: 8, y: 25, flowers: true }, { type: 'bush', x: 18, y: 29 },

    // ---------- Le champ ----------
    { type: 'haybale', x: 4, y: 3, examine: 'foin', label: 'Fouiller' },
    { type: 'haybale', x: 8, y: 5 }, { type: 'haybale', x: 17, y: 4 }, { type: 'haybale', x: 5, y: 10 },
    { type: 'haybale', x: 19, y: 12 }, { type: 'haybale', x: 10, y: 12 },
    { type: 'cart', x: 8, y: 8, examine: 'charrette', label: 'Fouiller' },
    { type: 'tree', x: 17, y: 10, color: '#3f8f3c' },                   // le grand chêne
    { type: 'hoofprints', x: 15, y: 11, examine: 'attente' },
    { type: 'scarecrow', x: 6, y: 6, examine: 'epouvantail' },
    { type: 'post', x: 11, y: 14, paper: true, examine: 'invitation', label: 'Lire' },
    { type: 'tree', x: 2, y: 1 }, { type: 'tree', x: 19, y: 1 },
    { type: 'item', x: 3, y: 7, kindFrom: 'objet', examine: 'objet', label: 'Ramasser', if: { variant: { objet_lieu: 'champ' } } },

    // ---------- Le verger ----------
    { type: 'tree', x: 25, y: 3, fruit: true }, { type: 'tree', x: 30, y: 6, fruit: true },
    { type: 'tree', x: 35, y: 3, fruit: true }, { type: 'tree', x: 39, y: 8, fruit: true },
    { type: 'tree', x: 26, y: 11, fruit: true }, { type: 'tree', x: 33, y: 12, fruit: true },
    { type: 'tree', x: 40, y: 13, fruit: true }, { type: 'tree', x: 29, y: 9 },
    { type: 'bush', x: 37, y: 5, flowers: true }, { type: 'bush', x: 23, y: 7 },

    // ---------- L'écurie ----------
    { type: 'haypile', x: 48, y: 4 }, { type: 'haypile', x: 52, y: 4 },
    { type: 'rack', x: 47, y: 7, examine: 'materiel' },
    { type: 'box', x: 58, y: 3, examine: 'boite', label: 'Ouvrir' },
    { type: 'tracks', x: 55, y: 8, examine: 'empreintes', color: 'rgba(160,80,30,0.5)' },
    { type: 'item', x: 48, y: 10, kind: 'pen', examine: 'stylo', label: 'Ramasser' },
    { type: 'trough', x: 56, y: 13, examine: 'abreuvoir' },
    { type: 'haybale', x: 45, y: 4 }, { type: 'haybale', x: 61, y: 13 },
    { type: 'tree', x: 44, y: 1 }, { type: 'tree', x: 61, y: 2 },

    // ---------- La prairie ----------
    { type: 'tree', x: 45, y: 19 }, { type: 'tree', x: 58, y: 20 }, { type: 'tree', x: 60, y: 27 },
    { type: 'tree', x: 48, y: 28 }, { type: 'tree', x: 55, y: 30 }, { type: 'tree', x: 43, y: 31 },
    { type: 'bush', x: 54, y: 25, flowers: true }, { type: 'bush', x: 46, y: 25 },
    { type: 'rock', x: 57, y: 24 },

    // ---------- Le potager ----------
    { type: 'crate', x: 19, y: 33, examine: 'cagette', label: 'Fouiller' },
    { type: 'compost', x: 2, y: 44, examine: 'compost', label: 'Fouiller' },
    { type: 'wateringcan', x: 11, y: 39, examine: 'arrosoir' },
    { type: 'scarecrow', x: 10, y: 44 },

    // ---------- La place des activités ----------
    { type: 'panel', x: 33, y: 34, examine: 'panneau_activites', label: 'Panneau des activités' },
    { type: 'picnic', x: 25, y: 37 }, { type: 'picnic', x: 25, y: 41, paint: true },
    { type: 'hopscotch', x: 30, y: 39 },
    { type: 'ball', x: 38, y: 40 },
    { type: 'cones', x: 36, y: 43 },
    { type: 'goal', x: 43, y: 38 },
    { type: 'bunting', x: 24, y: 34 },
    { type: 'tree', x: 22, y: 33 }, { type: 'tree', x: 45, y: 34 }, { type: 'tree', x: 22, y: 45 },

    // ---------- Le coin tranquille ----------
    { type: 'bigtree', x: 54, y: 40 },
    { type: 'rock', x: 60, y: 36, moss: true, examine: 'rocher', label: 'Regarder derrière' },
    { type: 'item', x: 52, y: 43, kind: 'notebook', examine: 'carnet_agneau', label: 'Ramasser' },
    { type: 'bush', x: 49, y: 35, flowers: true }, { type: 'bush', x: 61, y: 40, flowers: true },
    { type: 'bush', x: 49, y: 45, flowers: true }, { type: 'bush', x: 57, y: 35 }
  ]
};
