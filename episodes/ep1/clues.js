/* =========================================================
   INDICES — Épisode 1
   ---------------------------------------------------------
   id     : identifiant (utilisé dans objects.js, dialogues.js, scenes.js)
   title  : titre affiché dans le carnet
   text   : description ({objet} est remplacé selon la variante)
   place  : lieu où on le trouve
   points : ce que l'indice « prouve », sous la forme 'rôle:personnage'
            (sert à vérifier les déductions ; jamais affiché au joueur)
   action : (facultatif) petit geste répété, montré lors de la révélation
   Pour AJOUTER un indice : ajoute une entrée ici, puis donne-le quelque part
   avec { clue: 'mon_id' } dans objects.js, dialogues.js ou scenes.js.
   ========================================================= */
CDC.ep('ep1').clues = [
  // ---- La cour ----
  { id: 'c_banc', title: 'Les initiales rayées', place: 'La cour centrale',
    text: 'Sur le banc où tout le groupe mangeait, six initiales sont gravées. Le « A » a été rayé à grands traits.',
    points: ['victime:agneau'], action: 'Un nom rayé sur le banc' },
  { id: 'c_table', title: 'Le bol à l\'écart', place: 'La cour centrale',
    text: 'Sur la grande table, cinq bols sont alignés. Un sixième est posé tout au bout, loin des autres.',
    points: ['victime:agneau'], action: 'Une place mise à l\'écart à table' },
  { id: 'c_panneau', title: 'L\'affiche arrachée', place: 'La cour centrale',
    text: 'Un coin d\'affiche reste punaisé. À l\'encre rouge : « ...qui veut être en équipe avec la Laine M... ». Le reste a été arraché.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Une affiche moqueuse' },
  { id: 'c_photo', title: 'Les deux photos', place: 'La cour centrale',
    text: 'Sur la photo du printemps, l\'agneau rit au centre du groupe. Sur la nouvelle photo, il n\'y est plus.',
    points: ['victime:agneau'] },
  { id: 'c_dessin', title: 'Le dessin déchiré', place: 'Variable',
    text: 'Un magnifique dessin de la ferme, signé « A. », déchiré en quatre morceaux.',
    points: ['victime:agneau'], action: 'Un dessin déchiré' },
  { id: 'c_scene_cour', title: 'Une blague qui ne fait pas rire', place: 'La cour centrale',
    text: 'Le renard s\'est moqué de « celui qui mange tout seul au fond ». Le chien lui a dit d\'arrêter. Réponse : « Faut pas être susceptible ».',
    points: ['harceleur:renard', 'allie:chien'], action: 'Des moqueries « pour rire »' },
  { id: 'c_agneau_evite', title: 'Il fait demi-tour', place: 'La cour centrale',
    text: 'L\'agneau s\'approchait de la cour. En voyant le renard, il a fait demi-tour sans un mot.',
    points: ['victime:agneau', 'harceleur:renard'] },

  // ---- Le champ ----
  { id: 'c_invitation', title: 'La fausse invitation', place: 'Le champ',
    text: '« GRANDE FÊTE au grand chêne, samedi 15 h ! Viens, A. ! » En grosses lettres rondes, avec des petits cochons dessinés. Il n\'y a jamais eu de fête.',
    points: ['victime:agneau', 'suiveur:cochon'], action: 'Une invitation à une fausse fête' },
  { id: 'c_attente', title: 'Quelqu\'un a attendu', place: 'Le champ',
    text: 'Au pied du grand chêne, de petites traces de sabots tournent en rond. Quelqu\'un a attendu ici très longtemps.',
    points: ['victime:agneau'] },
  { id: 'c_charrette', title: 'Le paquet oublié', place: 'Le champ',
    text: 'Dans la vieille charrette, un petit paquet emballé avec soin. Étiquette : « Pour la fête — A. »',
    points: ['victime:agneau'] },
  { id: 'c_objet', title: 'Loin de ses affaires', place: 'Variable',
    text: 'On a retrouvé {objet}, abandonné(e) très loin de ses affaires.',
    points: ['victime:agneau'], action: 'Des affaires cachées' },

  // ---- L'écurie ----
  { id: 'c_empreintes', title: 'Des traces de pattes', place: 'L\'écurie',
    text: 'Des empreintes fines, avec des griffes, mènent droit à la vieille boîte du fond. Ce ne sont pas des sabots.',
    points: ['harceleur:renard'] },
  { id: 'c_stylo', title: 'Le feutre rouge', place: 'L\'écurie',
    text: 'Un feutre rouge mâchouillé, avec quelques poils orange collés dessus. La même encre rouge que l\'affiche ?',
    points: ['harceleur:renard'] },
  { id: 'c_boite', title: 'La boîte cachée', place: 'L\'écurie',
    text: 'Au fond de la vieille boîte : les morceaux froissés de l\'affiche moqueuse, écrite en rouge.',
    points: ['harceleur:renard'] },
  { id: 'c_cheval_vu', title: 'Ce que le cheval a vu', place: 'L\'écurie',
    text: 'Le cheval a vu le renard cacher quelque chose dans la vieille boîte de l\'écurie.',
    points: ['temoin:cheval', 'harceleur:renard'] },
  { id: 'c_cheval_hesite', title: 'Le témoin silencieux', place: 'L\'écurie',
    text: '« Je ne savais pas quoi faire. » Le cheval a vu plusieurs choses, mais n\'est jamais intervenu.',
    points: ['temoin:cheval'] },
  { id: 'c_cheval_samedi', title: 'Samedi au grand chêne', place: 'L\'écurie',
    text: 'Le cheval a vu l\'agneau attendre seul tout l\'après-midi au grand chêne. Personne n\'est venu.',
    points: ['temoin:cheval', 'victime:agneau'] },

  // ---- Le potager ----
  { id: 'c_cagette', title: 'Le carnet de blagues', place: 'Le potager',
    text: 'Dans la cagette du cochon, un carnet de blagues. Certaines sont barrées, avec écrit à côté : « trop méchant ? »',
    points: ['suiveur:cochon'] },
  { id: 'c_cochon_aveu', title: 'Les aveux du cochon', place: 'Le potager',
    text: '« C\'est moi qui ai écrit l\'invitation. Le renard trouvait ça drôle. Je voulais juste rigoler avec eux. »',
    points: ['suiveur:cochon', 'harceleur:renard'] },
  { id: 'c_conv', title: 'Conversation surprise', place: 'Variable',
    text: 'Le renard et le cochon riaient de l\'agneau, venu pour rien à la fausse fête. Le cochon avait l\'air gêné.',
    points: ['harceleur:renard', 'suiveur:cochon', 'victime:agneau'] },
  { id: 'c_surprise', title: 'Une menace à demi-mot', place: 'Variable',
    text: 'Le renard au cochon : « Si tu traînes avec lui, tu traînes plus avec nous. »',
    points: ['harceleur:renard', 'suiveur:cochon'], action: 'Interdire aux autres de lui parler' },

  // ---- Le coin tranquille ----
  { id: 'c_coin', title: 'Le refuge', place: 'Le coin tranquille',
    text: 'Derrière le rocher, l\'herbe est tassée comme un petit nid, avec des crayons de couleur. Quelqu\'un vient souvent ici, seul.',
    points: ['victime:agneau'] },
  { id: 'c_carnet', title: 'Le petit carnet', place: 'Le coin tranquille',
    text: '« Lundi : ils ont ri quand j\'ai parlé. Mardi : personne à côté de moi à table. Mercredi : je mange ici. »',
    points: ['victime:agneau'], action: 'Des rires quand il parle' },

  // ---- Dialogues ----
  { id: 'c_agneau_mots', title: '« Ils ont sûrement autre chose à faire »', place: 'Conversation',
    text: 'L\'agneau ne veut plus aller dans la cour. « Je n\'ai pas vraiment envie d\'aller là-bas. »',
    points: ['victime:agneau'] },
  { id: 'c_agneau_talent', title: 'Les cartes de l\'agneau', place: 'Conversation',
    text: 'L\'agneau dessine des cartes précises de toute la ferme, avec chaque recoin et chaque cachette.',
    points: [] },
  { id: 'c_agneau_aveu', title: 'Il y avait cru', place: 'Conversation',
    text: '« J\'y ai cru, tu sais. J\'ai attendu longtemps. » L\'agneau pense que c\'est « bête » de sa part.',
    points: ['victime:agneau'] },
  { id: 'c_chien_observe', title: 'Le chien a remarqué', place: 'Conversation',
    text: 'Le chien a remarqué que quelqu\'un mange seul au bout de la table depuis des semaines.',
    points: ['allie:chien', 'victime:agneau'] },
  { id: 'c_chien_tente', title: 'Le chien a essayé', place: 'Conversation',
    text: 'Le chien a demandé au renard d\'arrêter. Le renard a ri, et le groupe a ensuite mis le chien de côté.',
    points: ['allie:chien', 'harceleur:renard'] },
  { id: 'c_renard_discours', title: '« Tout le monde pense pareil »', place: 'Conversation',
    text: 'Le renard dit que l\'agneau est « à part » et que « tout le monde pense pareil ».',
    points: ['harceleur:renard'], action: 'Faire croire que « tout le monde pense pareil »' },
  { id: 'c_inscriptions', title: 'Le nom rayé en rouge', place: 'La place des activités',
    text: 'Sur la feuille d\'inscription aux activités, « Agneau » a été écrit... puis rayé, d\'une autre écriture, en rouge.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'L\'empêcher de participer' },
  { id: 'c_chouette', title: 'La Chouette s\'inquiète', place: 'La place des activités',
    text: 'Madame Chouette a remarqué que l\'agneau ne s\'inscrit plus à aucune activité.',
    points: ['victime:agneau'] }
];
