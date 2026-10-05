# 🐓 Le Cri du Coq

Jeu d'enquête et de sensibilisation au harcèlement scolaire, pour les 11-15 ans.
Navigateur, vue du dessus, aucun outil à installer.

**Épisode 1 : « Le secret de l'agneau »**. Tu incarnes le Coq. Quelque chose cloche à la
Ferme des Plumes : un animal est peu à peu mis à l'écart. Explore, observe, écoute,
récolte des indices, déduis qui fait quoi... puis organise une activité pour aider la
victime à retrouver sa place.

---

## ▶️ Lancer le jeu

**Le plus simple :** double-clique sur `index.html`. Le jeu s'ouvre dans ton navigateur.

**Avec un petit serveur local** (recommandé si ton navigateur bloque quelque chose) :

```bash
cd Le_cri_du_coq
python3 -m http.server 8000
```
puis ouvre <http://localhost:8000>.

### Commandes

| Touche | Action |
|---|---|
| Z Q S D ou flèches | Se déplacer |
| E (ou Entrée / Espace) | Interagir, parler, passer le texte |
| 1 2 3 ou clic | Choisir une réponse |
| C ou Tab | Ouvrir / fermer le carnet d'enquête |
| Échap | Fermer une fenêtre |
| M | Couper le son |

---

## 📁 Fichiers

```
index.html              page du jeu (charge tous les scripts dans l'ordre)
css/style.css           tout le style de l'interface
js/                     MOTEUR (commun à tous les épisodes)
  core.js               état du jeu, variables cachées, conditions, effets, indices
  audio.js              petits sons synthétisés
  input.js              clavier (ZQSD / flèches / E / C)
  world.js              lecture de la carte, collisions, zones
  sprites.js            dessin des animaux (vectoriel, sans image)
  render.js             dessin des sols, des décors, des bulles
  entities.js           le coq, les personnages, la détection « [E] Interagir »
  scenes.js             conversations à surprendre + petites cinématiques
  dialogue.js           boîte de dialogue et choix de réponses
  notebook.js           📖 carnet d'enquête (personnages, indices, hypothèses)
  deduction.js          🔎 résoudre l'enquête + scène de révélation
  event.js              🎪 organiser une activité, conséquences, bilan, score
  ui.js                 HUD, notifications, fenêtres
  main.js               démarrage et boucle de jeu
episodes/ep1/           DONNÉES de l'épisode 1 (à modifier librement)
  config.js             solution, variantes, objectifs, textes de révélation et de fin, score
  map.js                carte (grille de caractères), zones, objets
  characters.js         personnages, positions, fiches du carnet
  clues.js              les 31 indices
  dialogues.js          conversations avec les personnages
  objects.js            textes des objets à examiner
  scenes.js             scènes d'observation (conversations à surprendre)
  event.js              activités, rôles, règles des conséquences
```

Règle d'or : **le moteur (`js/`) ne contient aucun texte de l'histoire.** Tout ce qui se
lit ou se joue est dans `episodes/ep1/`.

---

## ✏️ Modifier les personnages

Dans `episodes/ep1/characters.js` :

- `name`, `emoji` : nom et emoji affichés.
- `colors` : couleurs du dessin (ex. `body: '#f07a2a'` pour le pelage du renard).
- `homes` : où il se trouve. La première ligne dont la condition `if` est vraie gagne.
  ```js
  homes: [
    { if: { phase: 'reintegration' }, at: [26.5, 25.2] },   // après l'enquête : dans la cour
    { at: [54.6, 44.3], wander: 0.4 }                         // sinon : au coin tranquille
  ]
  ```
  `at` = [colonne, ligne] en cases, `wander` = rayon de promenade.
- `sheet.facts` : lignes de sa fiche dans le carnet, qui apparaissent quand leur
  condition est remplie (`{ if: { clue: 'c_coin' }, text: '...' }`).

Pour une **nouvelle espèce** (une chèvre, par exemple), ajoute une fonction de dessin
dans `SPECIES` de `js/sprites.js` (en copiant celle d'un animal proche), puis utilise
`species: 'chevre'`.

## 💬 Modifier les dialogues

Dans `episodes/ep1/dialogues.js`. Chaque personnage a une liste de conversations,
jouées dans l'ordre dès que leur condition est vraie :

```js
{ id: 'agneau_1', if: { phase: 'enquete' }, start: 'a', nodes: {
  a: { who: 'coq', text: 'Ça va ? Tu sembles un peu seul.', next: 'b' },
  b: { who: 'agneau', text: ['Oui... ça va.', 'Oh. Oui, oui, ça va.'], choices: [   // tableau = variante au hasard
    { text: 'Tu es sûr ?', next: 'c', do: { add: { trust_agneau: 1, reaction: 1 } } },
    { text: 'D\'accord, à plus.', next: 'bye' }
  ] },
  c: { who: 'agneau', text: 'Je préfère rester ici.', do: { clue: 'c_agneau_mots' } }
} }
```

- `who` : `'coq'`, `'narr'` (pensée du coq) ou l'id d'un personnage.
- `do` : effets (`add` sur une variable, `flag`, `clue`...).
- Conditions utiles : `phase`, `clues`, `anyClue`, `minClues`, `flag`, `notFlag`,
  `min: { trust_agneau: 2 }`, `seen: 'agneau_1'`, `variant: { cheval_vu: 'cache' }`.
- `idle: true` + `lines` : phrases quand il n'a plus rien de nouveau à dire.

Les objets à examiner sont dans `objects.js`, avec un format plus court (`steps`).

## 🔍 Ajouter un indice

1. Dans `episodes/ep1/clues.js`, ajoute :
   ```js
   { id: 'c_plume', title: 'Une plume rousse', place: 'Le verger',
     text: 'Une plume rousse coincée dans la clôture.', points: ['harceleur:renard'] }
   ```
   `points` indique ce que l'indice prouve (sert à vérifier les déductions, jamais affiché).
2. Place un objet sur la carte (`map.js`, dans `props`) :
   ```js
   { type: 'item', x: 30, y: 8, kind: 'paper', examine: 'plume', label: 'Ramasser' }
   ```
3. Écris son texte dans `objects.js` :
   ```js
   plume: [
     { id: 'o_plume', steps: ['Une plume rousse...'], after: { clue: 'c_plume' } },
     { idle: true, lines: ['Tu as déjà noté la plume.'] }
   ]
   ```
Un indice peut aussi être donné dans un dialogue (`do: { clue: 'c_plume' }`) ou une
scène (`{ clue: 'c_plume' }`). Le compteur « x / N » s'adapte tout seul.

## 🗺️ Modifier la carte

Dans `episodes/ep1/map.js` :

- `ascii` : la carte, une ligne de texte par rangée de cases (64 × 48). Chaque caractère
  est un type de sol décrit dans `legend` (`'#'` haie, `'='` chemin, `'~'` eau, `'f'`
  clôture...). `solid: true` = on ne peut pas passer. Garde toutes les lignes de la même longueur.
- `zones` : rectangles nommés (le nom s'affiche quand on y entre).
- `props` : arbres, bancs, fontaine, indices... avec `x`, `y` en cases. Types disponibles
  dans `C.PropTypes` (`js/render.js`) : `tree`, `bigtree`, `bush`, `bench`, `fountain`,
  `table`, `board`, `bin`, `haybale`, `cart`, `scarecrow`, `post`, `box`, `crate`,
  `compost`, `trough`, `panel`, `picnic`, `ball`, `cones`, `goal`, `rock`, `well`, `item`...
- `if` sur un objet : il n'apparaît que si la condition est vraie (ex. selon la variante tirée).

Le point de départ du coq est `start` dans `config.js`.

## ➕ Ajouter une nouvelle partie (épisode 2)

1. Copie le dossier `episodes/ep1` en `episodes/ep2`.
2. Dans chaque fichier copié, remplace `CDC.ep('ep1')` par `CDC.ep('ep2')`.
3. Change le joueur (`player` dans `config.js`, et `player: true` dans `characters.js`),
   la solution, la carte, les dialogues...
4. Dans `index.html`, ajoute les balises `<script src="episodes/ep2/....js">` et un bouton
   dans la carte « Épisode 2 » de l'écran titre qui appelle `CDC.startGame('ep2')`.

## 🎲 Rejouabilité et variables cachées

- À chaque partie, `config.js > variants` tire au hasard : où est l'objet perdu de
  l'agneau (et lequel), où est le dessin déchiré, où ont lieu les conversations
  surprises, où se trouvent l'agneau et le chien, ce que le cheval a vu...
  Les textes en tableau varient aussi.
- Variables cachées (dans `config.js > vars`) : `trust_agneau`, `trust_chien`,
  `trust_cheval`, `trust_cochon`, `suspicion_renard`, `clues_found`,
  `victim_identified`, `integration_score`, `group_cohesion`, `reaction`.

## 🧮 Score (sur 100)

| Partie | Points | Calcul |
|---|---|---|
| Enquête | /40 | indices trouvés + chaque rôle prouvé |
| Compréhension | /20 | déductions justes du premier coup, « pourquoi » compris |
| Choix des réactions | /20 | empathie, ne pas culpabiliser, demander de l'aide... |
| Réintégration | /20 | résultat de l'activité organisée |

Catégories : 🌟 Excellent enquêteur (80+) · 👍 Bon allié (60+) · 🔎 Enquête à approfondir (40+) · 🌱 Il faut encore observer.
