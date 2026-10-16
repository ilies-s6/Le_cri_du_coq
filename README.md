# 🐓 Le Cri du Coq

Jeu d'enquête et de sensibilisation au harcèlement scolaire, pour les 11-15 ans.
Navigateur, vue du dessus, aucun outil à installer.

**Épisode 1 : « Le secret de l'agneau »**. Tu incarnes Noé, le coq, délégué de la 5e B
au **Collège des Plumes**. Depuis quelques semaines, l'ambiance de la classe a changé :
Milo, l'agneau, est peu à peu mis à l'écart, au collège comme dans le groupe de
discussion de la classe. Observe, écoute, fais des choix, récolte des indices sur
plusieurs moments et plusieurs jours, déduis qui fait quoi… puis organise une activité
pour aider Milo à retrouver sa place.

Tout est fictif : le collège, les élèves, les messages et le téléphone du jeu. Aucune
vraie application n'est reproduite, aucune donnée personnelle n'est utilisée.
Le seul vrai repère est le **3018**, le numéro national gratuit contre le
cyberharcèlement, cité dans l'application « Aide » du téléphone du jeu.

---

## ▶️ Lancer le jeu

**Le plus simple :** double-clique sur `index.html`. Le jeu s'ouvre dans ton navigateur.

**Avec un petit serveur local** (si ton navigateur bloque quelque chose) :

```bash
cd Le_cri_du_coq
python3 -m http.server 8000
```
puis ouvre <http://localhost:8000>.

### Commandes

| Touche | Action |
|---|---|
| Z Q S D ou flèches | Se déplacer |
| E (ou Entrée / Espace) | Parler, examiner, passer le texte |
| 1 à 5 ou clic | Choisir une réponse |
| C ou Tab | Carnet d'enquête |
| P | Téléphone |
| T | Passer au moment suivant |
| Échap | Pause / fermer une fenêtre |
| M | Couper le son |

Sur téléphone ou tablette : joystick tactile et boutons à l'écran.

La partie est **sauvegardée automatiquement** dans le navigateur (`localStorage`,
clé `cdc_save_ep1`). Le bouton « Reprendre la partie » de l'écran titre la recharge.

---

## 🕒 Déroulement

L'enquête se joue sur plusieurs moments. On passe au suivant avec ⏰ ou [T] :

| Moment | Ce qui s'y passe (selon tes choix) |
|---|---|
| Lundi 8 h 05 | Devant les casiers : premières moqueries |
| Lundi 10 h 00 | Récré : la « blague » de Maxence, et ton choix face au groupe |
| Lundi 12 h 30 | Cantine : « C'est pris » |
| Lundi soir | Seulement le téléphone : la photo dans le groupe de classe |
| Mardi 8 h 05 | Le casier tagué, les réactions à ce que tu as fait la veille |
| Mardi 10 h 00 | La rumeur circule (ou s'arrête), Milo évite la cour |
| Mardi 12 h 30 | Une conversation à surprendre de loin |
| Mardi 16 h 30 | Aux vélos : la pression sur Hugo |
| Jeudi 10 h 00 | Après tes conclusions : organiser l'activité |

Le monde évolue : variables `moquerie` et `rumeur`, relations entre élèves, lieux et
humeurs des personnages changent selon ce que tu fais (ou ne fais pas). Un premier geste
positif ne suffit pas à tout arranger : la rumeur continue un moment.

---

## 📁 Fichiers

```
index.html              page du jeu (charge tous les scripts dans l'ordre)
css/style.css           tout le style de l'interface
js/                     MOTEUR (commun à tous les épisodes, aucun texte d'histoire)
  core.js               état du jeu, variables, relations, conditions, effets, indices
  audio.js              petits sons synthétisés
  input.js              clavier
  touch.js              commandes tactiles
  world.js              lecture de la carte, collisions, zones
  sprites.js            dessin des élèves (vectoriel, tenues, accessoires, humeurs)
  render.js             sols, décors du collège, bulles, éclairage
  entities.js           le joueur, les personnages, la détection « [E] »
  scenes.js             scènes à surprendre + petites cinématiques
  ambient.js            vie du collège : discussions, ping-pong, basket, foot
  time.js               moments et jours, conséquences entre deux moments
  save.js               sauvegarde automatique
  ui.js                 HUD, notifications, fenêtres
  dialogue.js           boîte de dialogue et choix
  phone.js              📱 téléphone fictif : messages, réponses, actions, captures
  tutorial.js           petit tutoriel au début
  notebook.js           📖 carnet : élèves, indices, témoignages, relations, hypothèses
  deduction.js          🔎 conclusions + révélation
  event.js              🎪 organiser l'activité, conséquences, bilan, score
  main.js               démarrage et boucle de jeu
episodes/ep1/           DONNÉES de l'épisode 1 (à modifier librement)
  config.js             moments, variables, relations, solution, variantes, fin, score
  map.js                carte du collège (grille de caractères), zones, objets
  characters.js         élèves et adultes, tenues, lieux selon le moment, fiches
  clues.js              les indices (au collège et en ligne)
  dialogues.js          conversations et choix
  objects.js            textes des objets à examiner
  scenes.js             scènes d'observation
  ambient.js            discussions de fond entre élèves
  phone.js              conversations du téléphone, réponses, actions, appli Aide
  event.js              activités, rôles, règles des conséquences
```

Règle d'or : **le moteur (`js/`) ne contient aucun texte de l'histoire.** Tout ce qui se
lit ou se joue est dans `episodes/ep1/`.

---

## ✏️ Modifier les personnages

Dans `episodes/ep1/characters.js` :

- `name`, `role` : nom et classe affichés.
- `species` : `coq`, `agneau`, `renard`, `cochon`, `cheval`, `chien`, `chat`, `lapin`,
  `canard`, `chouette`, `blaireau`.
- `colors` : couleurs du pelage. `outfit` : tenue (`top: 'hoodie'`, `'tshirt'`,
  `'jacket'`, `'cardigan'`, `'tracksuit'`, `'sweater'`), couleurs `main`, `trim`, sac
  et accessoires (`acc: ['glasses', 'cap', 'headphones', ...]`).
- `homes` : où il se trouve. La première ligne dont la condition `if` est vraie gagne.
  ```js
  homes: [
    { if: { slot: 'l_recre' }, at: [15, 23.1], face: 'down', wander: 0 },   // lundi, récré
    { if: { phase: 'reintegration' }, at: [26.5, 24.2] },                    // jeudi
    { hidden: true, at: [1, 1] }                                             // sinon : absent
  ]
  ```
  `at` = [colonne, ligne] en cases, `wander` = rayon de promenade, `route` = trajet en boucle.
- `moods` : humeur de fond selon l'état du jeu. `sheet.facts` : lignes de sa fiche dans
  le carnet, qui apparaissent quand leur condition est remplie.

## 💬 Modifier les dialogues

Dans `episodes/ep1/dialogues.js`. Chaque personnage a une liste de conversations,
jouées dans l'ordre dès que leur condition est vraie :

```js
{ id: 'agneau_1', if: { phase: 'enquete' }, start: 'a', nodes: {
  a: { who: 'coq', text: 'Ça va ? T\'as l\'air un peu seul.', next: 'b' },
  b: { who: 'agneau', text: 'Oui… ça va.', choices: [
    { text: 'T\'es sûr ? Tu peux me le dire.', next: 'c', do: { add: { trust_agneau: 1 }, rel: { 'agneau|coq': 1 } } },
    { act: 'Partir', text: 'le laisser tranquille', next: 'bye' }       // act = action, pas une phrase
  ] },
  c: { who: 'agneau', text: 'Je préfère rester ici.', do: { clue: 'c_agneau_mots' } }
} }
```

- `who` : `'coq'`, `'narr'` (pensée), ou l'id d'un personnage.
- `do` : effets (`add`, `flag`, `clue`, `testi` = témoignage dans le carnet,
  `rel` = relation entre deux élèves de -3 à 3, `mood`, `say`, `toast`...).
- Conditions utiles : `phase`, `slot`, `minSlot`, `maxSlot`, `day`, `clues`, `anyClue`,
  `minClues`, `flag`, `notFlag`, `anyFlag`, `min: { trust_agneau: 2 }`, `minRel`,
  `seen: 'agneau_1'`, `variant`, `reply` (réponse donnée sur le téléphone), `act`.
- `idle: true` + `lines` : phrases quand il n'a plus rien de nouveau à dire.

## 📱 Le téléphone

Dans `episodes/ep1/phone.js` :

- `threads` : conversations (groupe de classe, messages privés, messagerie du collège).
- Messages : `from`, `text`, `time`, `if`, `photo` (dessinée par le jeu), `deletedIf`.
- `actions` sur un message : `Capturer`, `Signaler`, `Transférer`… chacune avec ses effets.
- Réponses : `{ reply: 'r_photo', options: [{ text, do }] }`. Les messages qui suivent
  une réponse n'apparaissent qu'une fois qu'on a répondu.
- L'appli **Aide** donne des conseils et le 3018.

## 🔍 Ajouter un indice

1. Dans `episodes/ep1/clues.js` :
   ```js
   { id: 'c_badge', title: 'Un badge oublié', place: 'Le CDI',
     text: 'Un badge du club BD, oublié sous une table.', points: ['victime:agneau'] }
   ```
   `points` indique ce que l'indice prouve (sert à vérifier les déductions, jamais affiché).
2. Place un objet sur la carte (`map.js`, dans `props`) :
   ```js
   { type: 'item', x: 30, y: 4, kind: 'paper', examine: 'badge', label: 'Ramasser' }
   ```
3. Écris son texte dans `objects.js` :
   ```js
   badge: [
     { id: 'o_badge', steps: ['Un badge du club BD…'], after: { clue: 'c_badge' } },
     { idle: true, lines: ['Tu as déjà noté le badge.'] }
   ]
   ```
Un indice peut aussi être donné dans un dialogue, une scène, une discussion de fond ou
une réponse sur le téléphone. Le compteur « x / N » s'adapte tout seul.

## 🗺️ Modifier la carte

Dans `episodes/ep1/map.js` :

- `ascii` : la carte, une ligne de texte par rangée de cases (64 × 50). Chaque caractère
  est un type de sol décrit dans `legend` (`'#'` mur, `'d'` porte, `'l'` lino,
  `'b'` bitume, `'.'` pelouse…). `solid: true` = on ne peut pas passer. Garde toutes
  les lignes de la même longueur.
- `zones` : rectangles nommés (salle 12, CDI, hall, cantine, cour, préau, jardin…).
- `props` : décors du collège (`lockers`, `desk`, `whiteboard`, `ctable`, `hoop`,
  `bleachers`, `bikerack`, `pingpong`…, liste dans `C.PropTypes` de `js/render.js`).
  `if` sur un objet : il n'apparaît que si la condition est vraie.

## 🎲 Rejouabilité et variables

- À chaque partie, `config.js > variants` tire au hasard : quel objet de Milo a disparu
  et où il est, où est son dessin déchiré, où a lieu la conversation surprise, où Milo
  se cache à la récré, ce qu'Inès a vu.
- Variables (`config.js > vars`) : confiance de chaque élève, `moquerie`, `rumeur`,
  `group_cohesion`, `reaction`, `integration_score`…
- `config.js > onAdvance` : ce qui change entre deux moments selon tes choix.

## 🧮 Score (sur 100)

| Partie | Points | Calcul |
|---|---|---|
| Enquête | /40 | indices trouvés + chaque rôle prouvé |
| Compréhension | /20 | déductions justes du premier coup, « pourquoi » compris |
| Choix des réactions | /20 | empathie, ne pas culpabiliser, demander de l'aide… |
| Réintégration | /20 | résultat de l'activité organisée |

## ➕ Ajouter un épisode

1. Copie `episodes/ep1` en `episodes/ep2` et remplace `CDC.ep('ep1')` par `CDC.ep('ep2')`.
2. Change le joueur, la solution, la carte, les dialogues…
3. Ajoute les balises `<script>` dans `index.html` et un bouton qui appelle
   `CDC.startGame('ep2')`.
