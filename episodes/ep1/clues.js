/* =========================================================
   INDICES — Épisode 1
   ---------------------------------------------------------
   id     : identifiant (utilisé dans objects.js, dialogues.js, scenes.js, phone.js)
   title  : titre affiché dans le carnet
   text   : description ({objet} est remplacé selon la variante)
   place  : lieu où on le trouve
   online : true = trouvé sur le téléphone (affiché avec 📱)
   points : ce que l'indice « prouve », sous la forme 'rôle:personnage'
            (sert à vérifier les déductions ; jamais affiché au joueur)
   action : (facultatif) petit geste répété, montré lors de la révélation
   Pour AJOUTER un indice : ajoute une entrée ici, puis donne-le quelque part
   avec { clue: 'mon_id' } dans objects.js, dialogues.js, scenes.js ou phone.js.
   ========================================================= */
CDC.ep('ep1').clues = [
  // ---- Le couloir et le hall ----
  { id: 'c_scene_casier', title: '« Bêêêlo »', place: 'Le couloir des casiers',
    text: 'Devant son casier, Maxence a accueilli Milo avec un « Bêêêlo ! ». Hugo a bêlé, Jade a ri. Milo a fait semblant de ne rien entendre.',
    points: ['victime:agneau', 'harceleur:renard', 'suiveur:cochon'], action: 'Un surnom lancé devant tout le monde' },
  { id: 'c_casier', title: 'Le casier tagué', place: 'Le couloir des casiers',
    text: 'Mardi matin, « BÊÊÊ » est écrit au marqueur rouge sur le casier de Milo. Tout le monde passe devant.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Un casier tagué' },
  { id: 'c_banc', title: 'Les initiales rayées', place: 'Le hall',
    text: 'Sur le banc du hall, la bande de 6e a gravé ses initiales : N, H, I, J, Ni… et un « M ». Le « M » a été rayé à grands traits.',
    points: ['victime:agneau'], action: 'Un nom rayé sur le banc' },
  { id: 'c_photo', title: 'Les deux photos de classe', place: 'Le hall',
    text: 'Sur la photo de la sortie de 6e, Milo rit au milieu du groupe, à côté d\'Hugo. Sur la photo du voyage de 5e, il est tout au bord, à moitié coupé.',
    points: ['victime:agneau'] },
  { id: 'c_panneau', title: 'L\'affiche du club BD', place: 'Le hall',
    text: 'L\'affiche du « club BD » dessinée par Milo a été en partie arrachée. Sur ce qu\'il reste, quelqu\'un a corrigé au marqueur rouge : « club BÊÊÊDÉ ».',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Une affiche moquée' },
  { id: 'c_inscriptions', title: 'Le nom rayé en rouge', place: 'Le hall',
    text: 'Sur la feuille d\'inscription au tournoi, « Milo » a été écrit… puis rayé, d\'une autre écriture, au marqueur rouge.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'L\'empêcher de participer' },

  // ---- La cour ----
  { id: 'c_scene_cour', title: 'Une blague qui ne fait pas rire', place: 'La cour',
    text: 'Maxence s\'est moqué de « celui qui mange tout seul au fond ». Nina lui a dit d\'arrêter. Réponse : « Faut pas être susceptible ».',
    points: ['harceleur:renard', 'allie:chien'], action: 'Des moqueries « pour rire »' },
  { id: 'c_agneau_evite', title: 'Il fait demi-tour', place: 'La cour',
    text: 'Milo allait sortir dans la cour. En voyant Maxence, il a fait demi-tour sans un mot.',
    points: ['victime:agneau', 'harceleur:renard'] },
  { id: 'c_rumeur', title: 'La rumeur', place: 'La cour',
    text: '« Il paraît que Milo a pleuré en SVT. » Personne ne l\'a vu, mais tout le monde le répète. Ça viendrait de Maxence.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Une rumeur qui circule' },
  { id: 'c_dessin', title: 'Le dessin déchiré', place: 'Variable',
    text: 'Un magnifique plan du collège, dessiné à la main et signé « Milo », déchiré en quatre morceaux.',
    points: ['victime:agneau'], action: 'Un dessin déchiré' },
  { id: 'c_objet', title: 'Loin de ses affaires', place: 'Variable',
    text: 'On a retrouvé {objet}, jeté(e) très loin de son sac.',
    points: ['victime:agneau'], action: 'Des affaires cachées' },

  // ---- La cantine ----
  { id: 'c_scene_cantine', title: '« C\'est pris »', place: 'La cantine',
    text: 'Milo a voulu s\'asseoir à la table de la classe. Maxence : « C\'est pris. » Il n\'y avait personne. Jade a ri, Hugo a baissé les yeux.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Une place refusée à table' },
  { id: 'c_table', title: 'Le sac sur la chaise', place: 'La cantine',
    text: 'À la table de la classe, cinq plateaux… et un sac posé sur la sixième chaise, pour la « garder ». Personne ne vient jamais s\'y asseoir.',
    points: ['victime:agneau'] },

  // ---- Les salles et le CDI ----
  { id: 'c_invitation', title: 'La fausse invitation', place: 'Salle 12',
    text: '« 🎉 Anniv de JADE samedi 15 h au skatepark ! Viens Milo, ce sera trop bien ! » En grosses lettres rondes, avec des petits cochons dessinés. Jade n\'a jamais fait de fête au skatepark.',
    points: ['victime:agneau', 'suiveur:cochon'], action: 'Une invitation à une fausse fête' },
  { id: 'c_cadeau', title: 'Le cadeau oublié', place: 'Le CDI',
    text: 'Sous une table du CDI, un petit paquet emballé avec soin. Étiquette : « Joyeux anniversaire Jade ! — Milo ».',
    points: ['victime:agneau'] },
  { id: 'c_blagues', title: 'Le carnet de blagues', place: 'Salle 12',
    text: 'Sur la table d\'Hugo, un carnet « MES MEILLEURES BLAGUES ». Certaines sont barrées, avec écrit à côté : « trop méchant ? »',
    points: ['suiveur:cochon'] },

  // ---- Le local du matériel ----
  { id: 'c_porte_cles', title: 'Le porte-clés', place: 'Le local du matériel',
    text: 'Par terre, un porte-clés en forme de petit renard orange. Il était accroché au sac de Maxence lundi.',
    points: ['harceleur:renard'] },
  { id: 'c_stylo', title: 'Le marqueur rouge', place: 'Le local du matériel',
    text: 'Un marqueur rouge indélébile, le capuchon mâchouillé. La même encre rouge que l\'affiche et le casier ?',
    points: ['harceleur:renard'] },
  { id: 'c_boite', title: 'La boîte cachée', place: 'Le local du matériel',
    text: 'Au fond d\'une vieille caisse : les morceaux de l\'affiche du club BD, griffonnés en rouge.',
    points: ['harceleur:renard'] },
  { id: 'c_cheval_vu', title: 'Ce qu\'Inès a vu', place: 'Le local du matériel',
    text: 'Inès a vu Maxence cacher quelque chose au fond de la vieille caisse du local du matériel.',
    points: ['temoin:cheval', 'harceleur:renard'] },
  { id: 'c_cheval_hesite', title: 'La témoin silencieuse', place: 'Le local du matériel',
    text: '« Je ne savais pas quoi faire. » Inès a vu plusieurs choses, mais n\'est jamais intervenue.',
    points: ['temoin:cheval'] },
  { id: 'c_cheval_samedi', title: 'Samedi au skatepark', place: 'Conversation',
    text: 'En rentrant de l\'entraînement, Inès a vu Milo attendre seul au skatepark, avec un petit paquet. Personne n\'est venu.',
    points: ['temoin:cheval', 'victime:agneau'] },

  // ---- Le jardin ----
  { id: 'c_coin', title: 'Le refuge', place: 'Le jardin',
    text: 'Derrière le rocher du jardin, une boîte de crayons et des miettes. Quelqu\'un vient souvent ici, seul.',
    points: ['victime:agneau'] },
  { id: 'c_carnet', title: 'Le carnet de Milo', place: 'Le jardin',
    text: '« Lundi : ils ont ri quand j\'ai parlé. Mardi : personne à côté de moi à la cantine. Mercredi : je mange au jardin. »',
    points: ['victime:agneau'], action: 'Des rires quand il parle' },

  // ---- En ligne (téléphone) ----
  { id: 'c_photo_volee', title: 'La photo du skatepark', place: 'Groupe « 5e B »', online: true,
    text: 'Maxence a posté une photo de Milo seul au skatepark samedi, avec « LE SEUL INVITÉ 🎉 ». Des dizaines d\'élèves l\'ont vue.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Une photo moqueuse partagée' },
  { id: 'c_retire', title: 'Retiré du groupe', place: 'Groupe « 5e B »', online: true,
    text: '« Maxence a retiré Milo du groupe. » Juste après la photo, sans un mot.',
    points: ['victime:agneau', 'harceleur:renard'], action: 'Exclure du groupe en ligne' },
  { id: 'c_vus', title: 'Vu par 23 personnes', place: 'Groupe « 5e B »', online: true,
    text: 'La photo a été vue par Inès, Sami et 21 autres. Personne n\'a rien écrit, à part Nina. Sami avait commencé un message… puis l\'a supprimé.',
    points: ['temoin:cheval'] },
  { id: 'c_soutien', title: 'Le message de Nina', place: 'Message privé', online: true,
    text: 'Nina t\'a écrit : « ça fait des semaines que ça dure. demain je vais voir la CPE. tu viens avec moi ? »',
    points: ['allie:chien', 'victime:agneau'] },

  // ---- Conversations ----
  { id: 'c_agneau_mots', title: '« Ils ont sûrement mieux à faire »', place: 'Conversation',
    text: 'Milo ne veut plus aller dans la cour. « Ils ont sûrement mieux à faire que de traîner avec moi. »',
    points: ['victime:agneau'] },
  { id: 'c_agneau_talent', title: 'Les plans de Milo', place: 'Conversation',
    text: 'Milo dessine des plans précis de tout le collège, avec chaque recoin et chaque cachette.',
    points: [] },
  { id: 'c_agneau_aveu', title: 'Il y avait cru', place: 'Conversation',
    text: '« J\'y ai cru, tu sais. J\'avais même acheté un cadeau. J\'ai attendu deux heures. » Milo pense que c\'est « bête » de sa part.',
    points: ['victime:agneau'] },
  { id: 'c_chien_observe', title: 'Nina a remarqué', place: 'Conversation',
    text: 'Nina a remarqué que Milo mange seul, au bout de la cantine, depuis des semaines.',
    points: ['allie:chien', 'victime:agneau'] },
  { id: 'c_chien_tente', title: 'Nina a essayé', place: 'Conversation',
    text: 'Nina a demandé à Maxence d\'arrêter. Il a ri, et le groupe l\'a ensuite laissée de côté, elle aussi.',
    points: ['allie:chien', 'harceleur:renard'] },
  { id: 'c_renard_discours', title: '« Tout le monde pense pareil »', place: 'Conversation',
    text: 'Maxence dit que Milo est « bizarre », qu\'il « se met tout seul à l\'écart » et que « tout le monde pense pareil ».',
    points: ['harceleur:renard'], action: 'Faire croire que « tout le monde pense pareil »' },
  { id: 'c_cochon_aveu', title: 'Les aveux d\'Hugo', place: 'Conversation',
    text: '« C\'est moi qui ai écrit l\'invitation. C\'était l\'idée de Maxence. Je voulais juste rigoler avec eux. »',
    points: ['suiveur:cochon', 'harceleur:renard'] },
  { id: 'c_conv', title: 'Conversation surprise', place: 'Variable',
    text: 'Maxence et Hugo riaient de Milo, venu pour rien au skatepark. Hugo avait l\'air gêné quand Maxence a parlé de la photo.',
    points: ['harceleur:renard', 'suiveur:cochon', 'victime:agneau'] },
  { id: 'c_surprise', title: 'Une menace à demi-mot', place: 'Le parking à vélos',
    text: 'Maxence à Hugo : « Si tu traînes avec lui, tu traînes plus avec nous. »',
    points: ['harceleur:renard', 'suiveur:cochon'], action: 'Interdire aux autres de lui parler' },
  { id: 'c_sami_vu', title: 'Ce que Sami a vu', place: 'Conversation',
    text: 'Samedi, Sami a vu Maxence et Hugo cachés derrière la rampe du skatepark. Ils filmaient Milo qui attendait.',
    points: ['harceleur:renard', 'suiveur:cochon'] },
  { id: 'c_chouette', title: 'Mme Chouette s\'inquiète', place: 'La vie scolaire',
    text: 'Mme Chouette a remarqué que Milo ne s\'inscrit plus à aucune activité et demande souvent à rester au CDI.',
    points: ['victime:agneau'] }
];
