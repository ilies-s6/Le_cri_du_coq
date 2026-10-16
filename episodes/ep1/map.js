/* =========================================================
   CARTE — Épisode 1 : le Collège des Plumes
   ---------------------------------------------------------
   La carte est une grille de caractères (1 caractère = 1 case de 32 px).
   Pour la modifier : remplace des caractères ci-dessous (garde la même
   longueur pour toutes les lignes). La légende dit ce que chaque
   caractère représente et s'il bloque le passage (solid).
   Les objets (casiers, tables, indices...) sont dans « props », placés en
   coordonnées de cases (x = colonne, y = ligne, en partant de 0).
     examine : identifiant du texte dans objects.js (rend l'objet interactif)
     if      : condition d'apparition (moment de la journée, variante...)
     action  : 'time' = l'objet sert à passer au moment suivant (horloge)
   ========================================================= */
CDC.ep('ep1').map = {
  legend: {
    '#': { ground: 'wall', solid: true },     // murs du bâtiment
    'd': { ground: 'door' },                  // portes
    '_': { ground: 'floor' },                 // parquet des salles de classe
    'm': { ground: 'carpet' },                // moquette du CDI
    'v': { ground: 'office' },                // vie scolaire
    'l': { ground: 'lino' },                  // couloir et hall
    'k': { ground: 'tiles' },                 // carrelage de la cantine
    'b': { ground: 'asphalt' },               // cour et parking à vélos
    'p': { ground: 'concrete' },              // préau
    'g': { ground: 'synth' },                 // pelouse synthétique
    'o': { ground: 'track' },                 // piste d'athlétisme
    '=': { ground: 'path' },                  // allée
    '.': { ground: 'grass' },
    ',': { ground: 'flowers' },
    'h': { ground: 'hedge', solid: true },    // haies
    'f': { ground: 'fence', solid: true },    // grille du collège
    '~': { ground: 'water', solid: true }     // mare du jardin
  },

  ascii: [
    '################################################################',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#_____________#_____________#mmmmmmmmmmmmmmmmm#vvvvvvvvvvvvvvvv#',
    '#######dd############dd##############dd###############dd########',
    '#llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll#',
    '#llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll#',
    '#llllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll#',
    '#######dd###############llllllll################dd##############',
    '#_____________#lllllllllllllllllll#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    '#_____________#lllllllllllllllllll#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    '#_____________#lllllllllllllllllll#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    '#_____________#lllllllllllllllllll#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    '#_____________#lllllllllllllllllll#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    '######################ddddd########kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb#kkkkkkkkkkkkkkkkkkkkkkkkkkkk#',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbb######dd######################',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    'fpppppppppppbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '#####dd####.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '#_________#.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '#_________#.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '#_________#.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '#_________#.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf',
    '##########hhhhhhhhbbbbhhhhhhhhhhh.....==.....hhhhhhhhhhhhhhhhhhf',
    'foooooooooooooooooooooooooooooooo.....==.....h,,,,,,,,,,,,,,,,,f',
    'foooooooooooooooooooooooooooooooo.....==.....h,,..,..,..,..,..,f',
    'fooggggggggggggggggggggggggggggoo.....==.....h,..,..,..,..,..,,f',
    'fooggggggggggggggggggggggggggggoo.....==.....h,.,..,..,..,..,.,f',
    'fooggggggggggggggggggggggggggggoo.....==.....h,,..,..,..,..,..,f',
    'fooggggggggggggggggggggggggggggoo.....========,..,..,..,..,..,,f',
    'fooggggggggggggggggggggggggggggoo.....========,.,..,..,..,..,.,f',
    'fooggggggggggggggggggggggggggggoo............h,,..,..,..,..,..,f',
    'fooggggggggggggggggggggggggggggoo............h,..,..,..,~~~~.,,f',
    'fooggggggggggggggggggggggggggggoo............h,.,..,..,.~~~~,.,f',
    'fooggggggggggggggggggggggggggggoo............h,,..,..,..~~~~..,f',
    'foooooooooooooooooooooooooooooooo............h,..,..,..,..,..,,f',
    'foooooooooooooooooooooooooooooooo............h,,,,,,,,,,,,,,,,,f',
    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  ],
  /* Zones nommées (rectangles en cases : [x0, y0, x1, y1]). La première qui contient le joueur gagne. */
  zones: [
    { id: 'salle12', name: '🏫 Salle 12 · la classe de 5e B', rect: [1, 1, 13, 7] },
    { id: 'arts',    name: '🎨 Salle 14 · arts plastiques',   rect: [15, 1, 27, 7] },
    { id: 'cdi',     name: '📚 Le CDI',                       rect: [29, 1, 45, 7] },
    { id: 'vs',      name: '🗂️ La vie scolaire',              rect: [47, 1, 62, 7] },
    { id: 'couloir', name: '🚪 Le couloir des casiers',       rect: [1, 8, 62, 11] },
    { id: 'salle16', name: '🔢 Salle 16 · maths',             rect: [1, 12, 13, 17] },
    { id: 'hall',    name: '🏛️ Le hall',                      rect: [15, 12, 33, 18] },
    { id: 'cantine', name: '🍽️ La cantine',                   rect: [35, 12, 62, 24] },
    { id: 'local',   name: '📦 Le local du matériel',         rect: [1, 30, 10, 34] },
    { id: 'preau',   name: '⛱️ Le préau',                     rect: [0, 19, 11, 29] },
    { id: 'velos',   name: '🚲 Le parking à vélos',           rect: [45, 25, 62, 34] },
    { id: 'cour',    name: '🏀 La cour',                      rect: [11, 19, 44, 34] },
    { id: 'terrain', name: '⚽ Le terrain de sport',          rect: [0, 35, 32, 48] },
    { id: 'jardin',  name: '🌿 Le jardin · espace calme',     rect: [45, 35, 62, 48] },
    { id: 'allee',   name: '🌳 L\'allée',                     rect: [33, 35, 44, 48] }
  ],

  props: [
    // ---------- Salle 12 (la classe de 5e B) ----------
    { type: 'whiteboard', x: 5, y: 0, examine: 'tableau_12', label: 'Lire le tableau' },
    { type: 'poster', x: 1, y: 0, text: ['RÈGLES', 'DE VIE'], bg: '#c8f0d8' },
    { type: 'teacherdesk', x: 6, y: 2 },
    { type: 'desk', x: 2, y: 4 }, { type: 'desk', x: 5, y: 4 }, { type: 'desk', x: 10, y: 4, examine: 'bureau_milo', label: 'Regarder' },
    { type: 'desk', x: 2, y: 6, item: 'jokebook', examine: 'blagues', label: 'Regarder' },
    { type: 'desk', x: 5, y: 6 }, { type: 'desk', x: 10, y: 6 },
    { type: 'item', x: 12, y: 5, kind: 'paper', examine: 'invitation', label: 'Ramasser' },
    { type: 'plant', x: 13, y: 1 },

    // ---------- Salle 14 (arts plastiques) ----------
    { type: 'poster', x: 16, y: 0, text: ['EXPO', 'DES 5e'], bg: '#ffd6e0' },
    { type: 'easel', x: 16, y: 2 }, { type: 'easel', x: 18, y: 2, c1: '#ef476f', c2: '#06d6a0' },
    { type: 'shelf', x: 24, y: 1 },
    { type: 'arttable', x: 16, y: 5 }, { type: 'arttable', x: 24, y: 5 },
    { type: 'bin', x: 27, y: 3, examine: 'bac_arts', label: 'Fouiller' },

    // ---------- CDI ----------
    { type: 'shelf', x: 29, y: 1 }, { type: 'shelf', x: 32, y: 1 }, { type: 'shelf', x: 40, y: 1 }, { type: 'shelf', x: 43, y: 1 },
    { type: 'poster', x: 35, y: 0, text: ['CHUT !', 'ON LIT'], bg: '#bde0fe' },
    { type: 'cditable', x: 30, y: 4 },
    { type: 'cditable', x: 34, y: 4, item: 'gift', examine: 'cadeau', label: 'Regarder' },
    { type: 'computer', x: 41, y: 4 },
    { type: 'beanbag', x: 44, y: 6, color: '#8ecae6' }, { type: 'beanbag', x: 30, y: 6, color: '#f4a261' },
    { type: 'bin', x: 45, y: 3, examine: 'recyclage', label: 'Fouiller' },

    // ---------- Vie scolaire ----------
    { type: 'cabinet', x: 47, y: 1 }, { type: 'cabinet', x: 48, y: 1 },
    { type: 'teacherdesk', x: 50, y: 3 },
    { type: 'poster', x: 58, y: 0, text: ['3018', 'HARCÈLEMENT ?', 'APPEL GRATUIT'], bg: '#ffd6e0', examine: 'affiche_3018', label: 'Lire' },
    { type: 'poster', x: 52, y: 0, text: ['VIE', 'SCOLAIRE'], bg: '#e9ecef' },
    { type: 'bench', x: 57, y: 5 },
    { type: 'watercooler', x: 61, y: 4 }, { type: 'plant', x: 62, y: 1 },

    // ---------- Couloir des casiers ----------
    { type: 'lockers', x: 1, y: 9 }, { type: 'lockers', x: 10, y: 9 }, { type: 'lockers', x: 14, y: 9 },
    { type: 'lockers', x: 24, y: 9, w: 3 },
    { type: 'locker', x: 27, y: 9, examine: 'casier', label: 'Casier de Milo', if: { maxSlot: 'l_soir' } },
    { type: 'locker', x: 27, y: 9, tag: true, examine: 'casier', label: 'Casier de Milo', if: { minSlot: 'm_matin' } },
    { type: 'lockers', x: 28, y: 9 }, { type: 'lockers', x: 32, y: 9 },
    { type: 'lockers', x: 40, y: 9 }, { type: 'lockers', x: 49, y: 9 }, { type: 'lockers', x: 57, y: 9 },
    { type: 'poster', x: 18, y: 8, text: ['NON AU', 'HARCÈLEMENT'], bg: '#c8f0d8', examine: 'affiche_couloir', label: 'Lire' },
    { type: 'poster', x: 44, y: 8, text: ['SORTIE', 'CINÉ 5e'], bg: '#ffe8a3' },
    { type: 'clock', x: 47, y: 8, examine: 'horloge', action: 'time', label: 'Regarder l\'heure', reach: 40 },
    { type: 'bin', x: 62, y: 11 },

    // ---------- Salle 16 (maths) ----------
    { type: 'whiteboard', x: 2, y: 12, ink: '#2a9d8f' },
    { type: 'desk', x: 2, y: 14 }, { type: 'desk', x: 5, y: 14 }, { type: 'desk', x: 10, y: 14 },
    { type: 'desk', x: 2, y: 16 }, { type: 'desk', x: 5, y: 16 }, { type: 'desk', x: 10, y: 16 },

    // ---------- Hall ----------
    { type: 'board', x: 16, y: 13, torn: true, title: 'CLUBS', examine: 'panneau', label: 'Lire' },
    { type: 'board', x: 19, y: 13, papers: ['#fff', '#ffe0b2', '#fff'], title: 'PHOTOS 5e', frame: '#2a7fba', examine: 'photos', label: 'Regarder' },
    { type: 'panel', x: 22, y: 13, title: 'INSCRIPTIONS', examine: 'panneau_activites', label: 'Panneau des activités' },
    { type: 'vitrine', x: 32, y: 13, examine: 'vitrine', label: 'Regarder' },
    { type: 'bench', x: 16, y: 16, scratched: true, examine: 'banc', label: 'Regarder' },
    { type: 'plant', x: 33, y: 17 }, { type: 'watercooler', x: 15, y: 14 },

    // ---------- Cantine ----------
    { type: 'counter', x: 51, y: 13, w: 10 },
    { type: 'poster', x: 36, y: 12, text: ['MENU', 'lundi : frites !'], bg: '#ffe8a3' },
    { type: 'ctable', x: 37, y: 15, trays: 3 }, { type: 'ctable', x: 43, y: 15, trays: 2 },
    { type: 'ctable', x: 37, y: 19, trays: 2 },
    { type: 'ctable', x: 43, y: 19, trays: 5, bag: true, examine: 'table', label: 'Observer' },
    { type: 'ctable', x: 51, y: 19, trays: 3 },
    { type: 'ctable', x: 57, y: 19, far: true },
    { type: 'bin', x: 35, y: 23 }, { type: 'plant', x: 62, y: 23 },

    // ---------- Préau ----------
    { type: 'pillar', x: 3, y: 20 }, { type: 'pillar', x: 9, y: 20 }, { type: 'pillar', x: 3, y: 28 }, { type: 'pillar', x: 9, y: 28 },
    { type: 'pingpong', x: 5, y: 23 },
    { type: 'bench', x: 7, y: 26 }, { type: 'bench', x: 1, y: 25 },
    { type: 'bin', x: 10, y: 22 },

    // ---------- Local du matériel (géré par Inès) ----------
    { type: 'sportshelf', x: 1, y: 31 }, { type: 'sportshelf', x: 3, y: 31 },
    { type: 'ballbin', x: 8, y: 31 },
    { type: 'box', x: 8, y: 33, examine: 'boite', label: 'Ouvrir' },
    { type: 'item', x: 3, y: 33, kind: 'keyring', examine: 'porte_cles', label: 'Ramasser' },
    { type: 'item', x: 6, y: 34, kind: 'pen', examine: 'stylo', label: 'Ramasser' },

    // ---------- Cour ----------
    { type: 'courtlines', x: 30, y: 26, w: 11, h: 7 },
    { type: 'hoop', x: 40, y: 29 },
    { type: 'bigtree', x: 18, y: 29 },
    { type: 'bench', x: 14, y: 22 }, { type: 'bench', x: 15, y: 31 }, { type: 'bench', x: 21, y: 32 },
    { type: 'bin', x: 13, y: 25, examine: 'poubelle', label: 'Fouiller' },
    { type: 'flowerpot', x: 12, y: 19 }, { type: 'flowerpot', x: 33, y: 19 },
    { type: 'tree', x: 43, y: 21 }, { type: 'tree', x: 12, y: 33 },

    // ---------- Parking à vélos ----------
    { type: 'bikerack', x: 47, y: 27 }, { type: 'bikerack', x: 54, y: 27 },
    { type: 'bikerack', x: 47, y: 32 }, { type: 'bikerack', x: 54, y: 32 },
    { type: 'tree', x: 61, y: 26 }, { type: 'tree', x: 61, y: 32 },

    // ---------- Terrain de sport ----------
    { type: 'pitchlines', x: 3, y: 38 },
    { type: 'goal', x: 3, y: 40 }, { type: 'goal', x: 30, y: 40, flip: true },
    { type: 'bleachers', x: 12, y: 36, examine: 'gradins', label: 'Regarder dessous' },
    { type: 'cones', x: 22, y: 47 },

    // ---------- Allée ----------
    { type: 'tree', x: 34, y: 37 }, { type: 'tree', x: 43, y: 37 }, { type: 'tree', x: 35, y: 46 }, { type: 'tree', x: 42, y: 46 },
    { type: 'bench', x: 40, y: 44 },

    // ---------- Jardin pédagogique (espace calme) ----------
    { type: 'panel', x: 47, y: 36, title: 'ESPACE CALME', examine: 'espace_calme', label: 'Lire' },
    { type: 'bigtree', x: 52, y: 37 },
    { type: 'greenhouse', x: 58, y: 37 },
    { type: 'bench', x: 48, y: 43 },
    { type: 'rock', x: 60, y: 41, moss: true, examine: 'rocher', label: 'Regarder derrière' },
    { type: 'item', x: 50, y: 46, kind: 'notebook', examine: 'carnet_milo', label: 'Ramasser' },
    { type: 'planter', x: 50, y: 40 }, { type: 'planter', x: 54, y: 47 },
    { type: 'bush', x: 61, y: 44, flowers: true, examine: 'buisson', label: 'Regarder' },
    { type: 'bush', x: 47, y: 47 }, { type: 'bush', x: 61, y: 47, flowers: true }
  ]
};
