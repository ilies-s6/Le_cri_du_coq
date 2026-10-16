/* =========================================================
   DIALOGUES — Épisode 1
   ---------------------------------------------------------
   Pour chaque personnage : une liste de conversations, essayées dans l'ordre.
   La première disponible (condition « if » vraie, pas encore vue) est jouée.
   Quand il n'y a plus rien de nouveau, une conversation « idle » est utilisée.

   Une conversation :
     id    : identifiant unique
     if    : condition (phase, moment de la journée, indices, confiance...) — voir js/core.js (C.check)
     start : premier nœud
     nodes : les répliques. Chaque nœud :
       who     : 'coq' (toi), 'narr' (tes pensées) ou un personnage ('agneau'...)
       text    : texte, ou tableau de variantes (une est tirée au hasard)
       mood    : expression du personnage (happy, sad, angry, worried, smug, surprised, shy)
       label   : titre de la bulle de pensée (par défaut « Dans ta tête »)
       next    : nœud suivant (rien = fin)
       choices : [{ text, next, do, act }] réponses proposées au joueur
                 act = action (affichée en violet) : « Rire avec eux », « Aller voir Milo »...
       do      : effets quand le nœud s'affiche ou que le choix est fait
                 ex. { add: { trust_agneau: 1, reaction: 1 }, clue: 'c_x', flag: 'y',
                       rel: { 'agneau|chien': 1 }, testi: { id, who, text }, mood: { agneau: 'happy' } }
       branch  : [{ if, next }] aiguillage automatique selon une condition
   « reaction » mesure la qualité de tes réactions (empathie, aide...) pour le bilan.
   « testi » note un témoignage dans le carnet (onglet Témoignages).
   ========================================================= */
CDC.ep('ep1').dialogues = {

  /* =================== 🐑 MILO =================== */
  agneau: [
    { id: 'agneau_recre', if: { phase: 'enquete', slot: 'l_recre', flag: 'va_voir_milo' }, start: 'a', nodes: {
      a: { who: 'agneau', mood: 'surprised', text: "Noé ? Qu'est-ce que tu fais là ? T'étais avec Maxence…", next: 'b' },
      b: { who: 'agneau', mood: 'worried', text: "Retourne avec eux. Sinon ils vont se moquer de toi aussi.", choices: [
        { text: "Je préfère être ici. Je peux m'asseoir ?", next: 'c', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: "Ce qu'ils disent sur toi, c'est pas normal.", next: 'd', do: { add: { trust_agneau: 1 } } },
        { text: "T'as raison, j'y retourne.", next: 'e', do: { add: { reaction: -1 } } }
      ] },
      c: { who: 'agneau', mood: 'shy', text: "…Si tu veux.", next: 'c2' },
      c2: { who: 'narr', text: "Vous restez là, sans beaucoup parler. Mais Milo a l'air un peu moins tendu.", do: { mood: { agneau: 'neutral' }, moodFor: 30 } },
      d: { who: 'agneau', text: "C'est pas grave. C'est des blagues. …Enfin, c'est ce qu'ils disent.",
        do: { testi: { id: 't_milo_blagues', who: 'agneau', text: "« C'est des blagues. …Enfin, c'est ce qu'ils disent. »" } }, next: 'd2' },
      d2: { who: 'narr', text: "« C'est pas grave. » Il le dit comme quelqu'un qui se le répète souvent." },
      e: { who: 'agneau', mood: 'sad', text: "Ouais. C'est mieux comme ça." }
    } },

    { id: 'agneau_cantine', if: { phase: 'enquete', slot: 'l_midi', flag: 'scene_cantine_done' }, start: 'a', nodes: {
      a: { who: 'narr', label: 'Ce que tu vois', text: "Milo mange seul, au bout de la dernière table. Il fixe son plateau sans vraiment manger.", next: 'b' },
      b: { who: 'agneau', mood: 'sad', text: "…", choices: [
        { act: "S'asseoir avec lui ·", text: "« Je peux ? J'ai pas trop envie de manger avec eux. »", next: 'c',
          do: { flag: 'assis_milo', add: { trust_agneau: 2, reaction: 2 }, mood: { agneau: 'shy' } } },
        { act: "Lui proposer de venir ·", text: "« Viens, il reste de la place à la table de Nina. »", next: 'd', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { act: "Minimiser ·", text: "« Fais pas attention, c'est que des blagues. »", next: 'e', do: { add: { trust_agneau: -1, reaction: -1 } } },
        { act: "Repartir", text: "(laisser Milo tranquille)", next: 'f' }
      ] },
      c: { who: 'agneau', mood: 'shy', text: "…Oui. Merci.", next: 'c2' },
      c2: { who: 'narr', label: 'Un peu plus tard', text: "Vous mangez sans beaucoup parler. Au bout d'un moment, Milo sort un petit carnet et te montre un dessin : le collège, vu d'en haut.", next: 'c3' },
      c3: { who: 'agneau', mood: 'happy', text: "Je dessine des plans. De tout le collège. Je connais toutes les cachettes.", do: { clue: 'c_agneau_talent' } },
      d: { who: 'agneau', mood: 'worried', text: "Non… ça va aller. Je veux pas d'histoires.", next: 'd2' },
      d2: { who: 'narr', text: "Il a peur que ça empire s'il se fait remarquer. Ce n'est pas à lui de régler ça tout seul." },
      e: { who: 'agneau', mood: 'sad', text: "Ouais. Des blagues.", next: 'e2' },
      e2: { who: 'narr', text: "Il a l'air encore plus seul qu'avant. Pour lui, ces « blagues » arrivent tous les jours." },
      f: { who: 'narr', text: "Tu repars vers les autres tables. En te retournant, tu vois Milo ranger son plateau, le repas à peine entamé." }
    } },

    { id: 'agneau_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { branch: [{ if: { slot: 'l_matin', flag: 'scene_casier_done' }, next: 'a1' }, { next: 'a2' }] },
      a1: { who: 'coq', text: "Hé, Milo. J'ai entendu Maxence, devant les casiers…", next: 'b' },
      a2: { who: 'coq', text: ["Salut Milo ! Ça va ? T'as l'air ailleurs.", "Hé, Milo. Tout va bien ?"], next: 'b' },
      b: { who: 'agneau', mood: 'worried', text: ["Oui… ça va.", "Oh. Salut. Oui, oui… ça va."], choices: [
        { text: "T'es sûr ? Tu peux me le dire, tu sais.", next: 'c', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: "Ok, à plus.", next: 'bye', do: { add: { reaction: -1 } } },
        { text: "Pourquoi tu restes toujours tout seul ?", next: 'd' }
      ] },
      c: { who: 'agneau', text: "Oui. C'est rien. J'ai l'habitude.",
        do: { testi: { id: 't_milo_habitude', who: 'agneau', text: "« C'est rien. J'ai l'habitude. »" } }, next: 'e' },
      d: { who: 'agneau', text: ["Je sais pas. C'est plus calme.", "Personne ne… Enfin, c'est plus calme. C'est tout."], next: 'e' },
      e: { who: 'agneau', text: "…", choices: [
        { text: "Tu viens plus avec nous dans la cour, à la récré ?", next: 'f' },
        { text: "Si un jour tu veux parler, je suis là.", next: 'g', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: "C'est un peu bizarre de rester tout seul, non ?", next: 'h', do: { add: { trust_agneau: -2, reaction: -2 } } }
      ] },
      f: { who: 'agneau', text: "Ils ont sûrement mieux à faire que de traîner avec moi.", next: 'f2' },
      f2: { who: 'agneau', mood: 'sad', text: "Et puis… j'ai pas trop envie d'aller là-bas.",
        do: { clue: 'c_agneau_mots', testi: { id: 't_milo_cour', who: 'agneau', text: "« Ils ont sûrement mieux à faire que de traîner avec moi. »" } }, next: 'f3' },
      f3: { who: 'narr', text: "Il dit « ils ». Qui ça, « ils » ?" },
      g: { who: 'agneau', mood: 'shy', text: "…Merci. C'est gentil, Noé." },
      h: { who: 'agneau', mood: 'sad', text: "…", next: 'h2' },
      h2: { who: 'narr', text: "Milo baisse les yeux. Ta phrase l'a blessé. Ce n'est pas lui, le problème." },
      bye: { who: 'agneau', text: "À plus.", next: 'bye2' },
      bye2: { who: 'narr', text: "Il retourne à son dessin. Tu as l'impression d'avoir raté quelque chose." }
    } },

    { id: 'agneau_2', if: { phase: 'enquete', minSlot: 'm_matin', seen: 'agneau_1', min: { trust_agneau: 0 } }, start: 'a', nodes: {
      a: { who: 'coq', text: "Je te dérange ? Tu dessines quoi ?", next: 'b' },
      b: { who: 'agneau', text: "Des plans. Du collège. J'ai même dessiné le jardin, avec toutes les plantes.", choices: [
        { text: "Je peux voir ?", next: 'c', do: { add: { trust_agneau: 1 } } },
        { text: "Tu devrais les afficher dans le hall !", next: 'd' }
      ] },
      c: { who: 'agneau', mood: 'shy', text: "…Si tu veux.", next: 'c2' },
      c2: { who: 'narr', text: "Ses plans sont incroyables : chaque couloir, chaque recoin, même des cachettes que tu ne connaissais pas.", do: { clue: 'c_agneau_talent' }, next: 'q' },
      d: { who: 'agneau', mood: 'worried', text: "Non ! J'avais fait une affiche pour un club BD. Quelqu'un l'a arrachée. La dernière fois que j'ai montré un dessin, il a fini déchiré.",
        do: { flag: 'agneau_dessin_dit', testi: { id: 't_milo_affiche', who: 'agneau', text: "« J'avais fait une affiche pour un club BD. Quelqu'un l'a arrachée. »" } }, next: 'q' },
      q: { who: 'coq', text: "Il s'est passé quelque chose avec les autres ?", next: 'r' },
      r: { who: 'agneau', text: ["Non, ça va. Vraiment.", "Non… Ça va, je t'assure."], choices: [
        { text: "D'accord. Je te force pas. Mais je suis là.", next: 's', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: "C'est Maxence, c'est ça ? Dis-le !", next: 't', do: { add: { trust_agneau: -1 } } }
      ] },
      s: { who: 'agneau', mood: 'shy', text: "…Merci, Noé." },
      t: { who: 'agneau', mood: 'worried', text: "J'ai pas dit ça ! …Laisse tomber.", next: 't2' },
      t2: { who: 'narr', text: "Trop vite, trop fort. Il faut d'abord gagner sa confiance." }
    } },

    { id: 'agneau_3', if: { phase: 'enquete', min: { trust_agneau: 2 }, anyClue: ['c_invitation', 'c_photo_volee', 'c_cadeau', 'c_conv'] }, start: 'a', nodes: {
      a: { who: 'coq', text: "Samedi… t'étais au skatepark, non ?", next: 'b' },
      b: { who: 'agneau', mood: 'sad', text: "…Tout le monde a vu la photo, hein ?", choices: [
        { text: "Je suis désolé. Ce qu'ils ont fait est vraiment nul.", next: 'c', do: { add: { trust_agneau: 1 } } },
        { text: "Tout le monde en parle, oui.", next: 'x', do: { add: { trust_agneau: -1, reaction: -1 } } }
      ] },
      c: { who: 'agneau', text: "J'y ai cru, tu sais. Une invitation dans mon sac, avec des petits dessins… J'avais même acheté un cadeau pour Jade. J'ai attendu deux heures. C'est bête.",
        do: { clue: 'c_agneau_aveu', testi: { id: 't_milo_samedi', who: 'agneau', text: "« J'y ai cru. J'ai attendu deux heures. C'est bête. »" } }, choices: [
          { text: "C'est pas bête. C'est eux qui ont eu tort.", next: 'd', do: { add: { trust_agneau: 1, reaction: 2 } } },
          { text: "T'aurais dû te méfier.", next: 'e', do: { add: { trust_agneau: -2, reaction: -2 } } },
          { text: "On pourrait en parler à Mme Chouette. Ensemble, si tu veux.", next: 'g', do: { add: { trust_agneau: 1, reaction: 2 }, flag: 'agneau_ok_adulte' } }
        ] },
      d: { who: 'agneau', mood: 'shy', text: "…Peut-être. Merci de dire ça." },
      e: { who: 'agneau', mood: 'sad', text: "…Ouais. Sûrement.", next: 'e2' },
      e2: { who: 'narr', text: "Il a l'air encore plus triste. Ce n'est jamais à la victime de se sentir coupable." },
      g: { who: 'agneau', mood: 'worried', text: "Ensemble ? …J'ai peur que ça empire. Mais… d'accord. Si tu viens avec moi." },
      x: { who: 'agneau', mood: 'sad', text: "Tout le monde… Super.", next: 'x2' },
      x2: { who: 'narr', text: "Il se recroqueville. Ce n'était pas la chose à dire." }
    } },

    /* ----- Phase 2 : réintégration ----- */
    { id: 'agneau_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'agneau', text: "Noé… T'as l'air sérieux.", next: 'b' },
      b: { who: 'coq', text: "J'ai compris ce qui se passe avec Maxence et les autres.", choices: [
        { text: "Ce qui t'arrive n'est pas de ta faute. Personne ne mérite ça.", next: 'c', do: { add: { trust_agneau: 2, reaction: 2 } } },
        { text: "Tu devrais te défendre, quand même !", next: 'd', do: { add: { trust_agneau: -1, reaction: -2 } } },
        { text: "Si tu veux, on peut en parler à Mme Chouette ensemble.", next: 'e', do: { add: { trust_agneau: 1, reaction: 2 }, flag: 'agneau_ok_adulte' } }
      ] },
      c: { who: 'agneau', mood: 'surprised', text: "…Je croyais que c'était moi, le problème.", next: 'f' },
      d: { who: 'agneau', mood: 'sad', text: "Facile à dire… Quand toute la classe rit, tu fais comment, toi ?", next: 'd2' },
      d2: { who: 'narr', text: "Il a raison. Ce n'est pas à lui de régler ça tout seul. Et l'affrontement n'est pas la seule solution.", next: 'f' },
      e: { who: 'agneau', mood: 'shy', text: "Ensemble ? …D'accord. Peut-être, oui.", next: 'f' },
      f: { who: 'coq', text: "J'aimerais organiser une activité pour toute la classe. Qu'est-ce qui te plairait ?", next: 'g' },
      g: { who: 'agneau', text: "Pas un truc où on compte les points. Je déteste quand tout le monde me regarde perdre.", next: 'h' },
      h: { who: 'agneau', text: ["J'aime bien les énigmes, les plans… chercher des choses.", "Moi, j'aime chercher, réfléchir, dessiner."], next: 'i' },
      i: { who: 'agneau', mood: 'shy', text: "Et… je préférerais que Nina soit là. Avec elle, je me sens plus tranquille.", do: { flag: 'info_agneau' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ["Je préfère rester ici.", "Non, ça va.", "C'est calme, ici. J'aime bien.", "Je dessine, c'est tout."] },
    { idle: true, lines: ["Merci d'être venu me parler, Noé.", "Je vais peut-être essayer… un peu."] }
  ],

  /* =================== 🦊 MAXENCE =================== */
  renard: [
    { id: 'renard_recre', if: { phase: 'enquete', slot: 'l_recre', flag: 'scene_cour_done' }, start: 'a', nodes: {
      a: { who: 'renard', mood: 'smug', text: "Noé ! Viens, viens. T'as vu la tête de Bêêêlo ce matin ? On aurait dit qu'il allait pleurer.", next: 'b' },
      b: { who: 'narr', label: 'Ce que tu ressens', text: "Hugo ricane. Jade te regarde, curieuse de voir ce que tu vas faire. Tout le groupe attend ta réaction.", choices: [
        { act: "Rire avec eux ·", text: "« Hahaha, grave ! »", next: 'r1',
          do: { flags: ['a_ri', 'recre_choix'], add: { reaction: -2, trust_renard: 1 }, rel: { 'cochon|renard': 1 } } },
        { act: "Rester silencieux", text: "(observer sans rien dire)", next: 'r2', do: { flags: ['observe_recre', 'recre_choix'] } },
        { act: "Changer de sujet ·", text: "« Au fait, vous avez fait l'exo de maths pour demain ? »", next: 'r3',
          do: { flags: ['change_sujet', 'recre_choix'], add: { reaction: 1 } } },
        { act: "Aller voir Milo ·", text: "« Je reviens. » (aller lui parler discrètement)", next: 'r4',
          do: { flags: ['va_voir_milo', 'recre_choix'], add: { reaction: 1, trust_renard: -1 } } },
        { act: "Demander conseil", text: "(aller voir Mme Chouette, la CPE, qui surveille la cour)", next: 'r5',
          do: { flags: ['conseil_adulte', 'recre_choix'], add: { reaction: 1 } } }
      ] },
      r1: { who: 'renard', mood: 'happy', text: "Ah, tu vois ! Toi, t'as de l'humour.", next: 'r1b' },
      r1b: { who: 'narr', pmood: 'worried', text: "Tu ris avec eux. Puis tu aperçois Milo, au loin, qui détourne le regard. Il a entendu." },
      r2: { who: 'renard', text: "Bref. Samedi, on lui a fait une blague, t'aurais vu ça. De toute façon, tout le monde pense pareil : il est bizarre.",
        do: { clue: 'c_renard_discours', testi: { id: 't_max_pense', who: 'renard', text: "« Tout le monde pense pareil : il est bizarre. »" } }, next: 'r2b' },
      r2b: { who: 'narr', text: "Tu n'as rien dit. Mais Maxence a pris ton silence pour un « oui »." },
      r3: { who: 'renard', text: "Pff, t'es trop sérieux, toi. …Ouais, je l'ai fait. Je te le montre si tu veux.", next: 'r3b' },
      r3b: { who: 'narr', text: "La conversation part sur les maths. Pour cette fois, Milo n'est plus le sujet. Un petit geste… qui compte." },
      r4: { who: 'renard', mood: 'angry', text: "Où tu vas ? Pff… Va rejoindre ton pote le mouton, alors.", next: 'r4b' },
      r4b: { who: 'narr', text: function (S) {
        return "Tu sens leurs regards dans ton dos. Ce n'est pas facile. Milo passe la récré seul… " + (S.variant.agneau_lieu === 'cdi' ? "sûrement au CDI." : "sûrement sous le préau.");
      } },
      r5: { who: 'renard', text: "Hein ? Où tu vas ? …N'importe quoi.", next: 'r5b' },
      r5b: { who: 'narr', text: "Tu t'éloignes. Pas pour « balancer » : pour savoir quoi faire. Mme Chouette est sortie dans la cour." }
    } },

    { id: 'renard_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'renard', mood: 'smug', text: ["Noé ! Le délégué préféré de la classe. Ça roule ?", "Hé, Noé ! Tu tombes bien, je m'ennuyais."], choices: [
        { text: "Ça va. Y a une drôle d'ambiance en ce moment, non ?", next: 'b' },
        { text: "Tu fais quoi ce week-end ?", next: 'c' }
      ] },
      b: { who: 'renard', text: "Une drôle d'ambiance ? Non, on s'amuse bien. Enfin… presque tout le monde, hé hé.", do: { add: { suspicion_renard: 1 } }, next: 'd' },
      c: { who: 'renard', text: "Samedi dernier, on s'est trop marrés au skatepark avec Hugo. Tu rates des trucs, toi.",
        do: { testi: { id: 't_max_skate', who: 'renard', text: "« Samedi, on s'est trop marrés au skatepark avec Hugo. »" } }, next: 'd' },
      d: { who: 'renard', text: "Viens traîner avec nous, t'es cool, toi. Entre nous, on se serre les coudes." }
    } },

    { id: 'renard_2', if: { phase: 'enquete', seen: 'renard_1', minSlot: 'l_midi' }, start: 'a', nodes: {
      a: { who: 'coq', text: "Pourquoi tu t'acharnes sur Milo ?", next: 'b' },
      b: { who: 'renard', text: "M'acharner ? On rigole ! Il est bizarre, il se met tout seul à l'écart. Tout le monde pense pareil.",
        do: { clue: 'c_renard_discours', testi: { id: 't_max_pense', who: 'renard', text: "« Il se met tout seul à l'écart. Tout le monde pense pareil. »" } }, choices: [
          { text: "Moi, je pense pas pareil.", next: 'c', do: { add: { reaction: 1, suspicion_renard: 1 } } },
          { text: "Ouais, c'est vrai qu'il est un peu bizarre.", next: 'd', do: { add: { reaction: -2, trust_renard: 1 } } },
          { text: "Et si c'était toi, à sa place ?", next: 'e' }
        ] },
      c: { who: 'renard', text: "Ok, ok. Relax. C'est pour rire, de toute façon." },
      d: { who: 'renard', mood: 'happy', text: "Ah, tu vois ! Toi, t'as tout compris.", next: 'd2' },
      d2: { who: 'narr', text: "Un malaise te serre la gorge. Est-ce que tu viens d'entrer dans son jeu ?" },
      e: { who: 'renard', mood: 'worried', text: "Moi ? Jamais. …Tu sais quoi ? Si je rigole pas des autres, c'est de moi qu'on rigolera. C'est comme ça, au collège.",
        do: { flag: 'renard_peur', testi: { id: 't_max_peur', who: 'renard', text: "« Si je rigole pas des autres, c'est de moi qu'on rigolera. »" } }, next: 'e2' },
      e2: { who: 'narr', text: "Pendant une seconde, il n'a plus l'air si sûr de lui. Ça n'excuse rien. Mais ça explique peut-être pourquoi il a besoin d'un public." }
    } },

    { id: 'renard_soir', if: { phase: 'enquete', minSlot: 'm_matin', anyFlag: ['stop_ligne', 'rire_ligne'] }, start: 'a', nodes: {
      a: { branch: [{ if: { flag: 'stop_ligne' }, next: 's' }, { next: 'r' }] },
      s: { who: 'renard', mood: 'angry', text: "Tiens, la police d'internet. « Supprime ça »… T'as cru que t'allais me faire la morale devant toute la classe ?", choices: [
        { text: "C'était pas drôle. Il a attendu deux heures, tout seul.", next: 's1', do: { add: { reaction: 1, suspicion_renard: 1 } } },
        { text: "Laisse tomber.", next: 's2' }
      ] },
      s1: { who: 'renard', text: "…Ouais, bon. J'ai supprimé, t'es content ?", next: 's1b' },
      s1b: { who: 'narr', text: "Il fait le fier. Mais la photo a disparu du groupe. Ta réaction a compté." },
      s2: { who: 'renard', text: "C'est ça. Laisse tomber." },
      r: { who: 'renard', mood: 'smug', text: "T'as vu ma photo hier soir ? Trop drôle, hein ? Même toi t'as rigolé.", choices: [
        { text: "En fait… c'était pas drôle. J'aurais pas dû rire.", next: 'r1', do: { add: { reaction: 2 } } },
        { text: "Ouais, trop.", next: 'r2', do: { add: { reaction: -1 } } }
      ] },
      r1: { who: 'renard', mood: 'surprised', text: "Hein ? T'es sérieux ? …Pff, vous êtes tous devenus relous.", next: 'r1b' },
      r1b: { who: 'narr', text: "Ce n'est jamais trop tard pour changer d'avis. Et pour le dire." },
      r2: { who: 'renard', text: "Hé hé. Je savais que t'étais des nôtres." }
    } },

    { id: 'renard_3', if: { phase: 'enquete', clue: 'c_stylo', anyClue: ['c_panneau', 'c_inscriptions', 'c_boite', 'c_casier'] }, start: 'a', nodes: {
      a: { who: 'coq', text: "C'est à toi, ce marqueur rouge ? Il traînait au local du matériel.", next: 'b' },
      b: { who: 'renard', text: "Ah, merci ! Je le cherchais partout.", choices: [
        { text: "L'affiche du club BD a été « corrigée » en rouge. Comme le casier de Milo.", next: 'c', do: { add: { suspicion_renard: 2 }, flag: 'renard_feutre' } },
        { text: "Tiens, le voilà.", next: 'd' }
      ] },
      c: { who: 'renard', mood: 'angry', text: "Et alors ? Tout le monde a un marqueur rouge. …T'as rien de mieux à faire ?", next: 'c2' },
      c2: { who: 'narr', text: "Pendant une seconde, son grand sourire a disparu." },
      d: { who: 'renard', text: "Merci, Noé. T'es réglo, toi." }
    } },

    /* ----- Phase 2 ----- */
    { id: 'renard_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'renard', text: "Tiens, le détective. Il paraît que tu poses des questions sur moi.", choices: [
        { text: "Ce que tu fais à Milo, c'est pas une blague. Ça se répète, et ça doit s'arrêter.", next: 'b', do: { flag: 'renard_limites', add: { reaction: 2, group_cohesion: 1 } } },
        { text: "Tout le monde va savoir ce que t'as fait. Tu vas voir.", next: 'c', do: { flag: 'renard_humilie', add: { reaction: -1, group_cohesion: -2 } } },
        { text: "On va en parler à Mme Chouette.", next: 'd', do: { flags: ['adult_informed', 'renard_prevenu'], add: { reaction: 1 } } }
      ] },
      b: { who: 'renard', text: "Oh ça va, on rigolait juste…", next: 'b2' },
      b2: { who: 'coq', text: "Pour toi, c'est une blague. Pour lui, c'est tous les jours. Au collège et le soir sur son téléphone.", next: 'b3' },
      b3: { who: 'renard', mood: 'worried', text: "…Ok. J'avais pas vu ça comme ça.", next: 'b4' },
      b4: { who: 'narr', text: "Il ne s'excuse pas encore. Mais il a entendu. Et il sait que tu ne laisseras plus passer." },
      c: { who: 'renard', mood: 'angry', text: "Ah ouais ? Vas-y, raconte. On verra qui on croira.", next: 'c2' },
      c2: { who: 'narr', text: "Le menacer l'a mis sur la défensive. Ça risque de compliquer les choses." },
      d: { who: 'renard', text: "Pfff… Ok, ok. Pas besoin d'en faire une montagne.", next: 'd2' },
      d2: { who: 'narr', text: "Il fait le malin, mais il sait que les adultes vont s'en mêler." }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ["Tout roule, Noé ?", "Faut pas tout prendre au sérieux, hein.", "Tu viens au tournoi de basket jeudi ? Ça va être drôle."] },
    { idle: true, lines: ["…Quoi ?", "Ouais, ouais. J'ai compris."] }
  ],

  /* =================== 🐷 HUGO =================== */
  cochon: [
    { id: 'cochon_fin', if: { phase: 'enquete', slot: 'm_fin', flag: 'scene_surprise_done' }, start: 'a', nodes: {
      a: { who: 'cochon', mood: 'sad', text: "T'as entendu, hein ? …Il dit que si je parle à Milo, je suis plus avec eux.", choices: [
        { text: "Un vrai ami te demanderait pas ça.", next: 'c', do: { add: { trust_cochon: 1, reaction: 1 }, rel: { 'cochon|renard': -1 } } },
        { text: "T'as qu'à faire ce qu'il dit.", next: 'd', do: { add: { reaction: -1 } } }
      ] },
      c: { who: 'cochon', text: "…Ouais. En 6e, Milo et moi, on faisait des BD ensemble. Je sais même plus pourquoi j'ai arrêté de lui parler.",
        do: { rel: { 'agneau|cochon': 1 }, testi: { id: 't_hugo_6e', who: 'cochon', text: "« En 6e, Milo et moi, on faisait des BD ensemble. »" } } },
      d: { who: 'cochon', mood: 'sad', text: "Ouais… Je sais.", next: 'd2' },
      d2: { who: 'narr', text: "Il a l'air piégé. Lui aussi aurait besoin que quelqu'un lui dise qu'il a le choix." }
    } },

    { id: 'cochon_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'cochon', mood: 'happy', text: ["Noé ! Tu connais la blague du prof de maths qui… non attends, je la refais.", "Salut ! T'as pas un gâteau ? J'ai trop faim. Hé hé."], choices: [
        { text: "Vas-y, raconte ta blague !", next: 'b', do: { add: { trust_cochon: 1 } } },
        { text: "Dis, tu sais ce qui se passe avec Milo ?", next: 'c' }
      ] },
      b: { who: 'cochon', mood: 'happy', text: "Pourquoi le livre de maths est triste ? Parce qu'il a trop de problèmes ! HAHA !", next: 'b2' },
      b2: { who: 'cochon', mood: 'worried', text: "…Bon. Maxence l'a trouvée nulle. Lui, il préfère les blagues sur les autres.", next: 'z' },
      c: { who: 'cochon', mood: 'worried', text: "Milo ? Euh… non. Rien. Pourquoi ? Il t'a dit quelque chose ?", do: { flag: 'cochon_nerveux' }, next: 'c2' },
      c2: { who: 'narr', text: "Il évite ton regard et refait son lacet pour la troisième fois.", next: 'z' },
      z: { who: 'cochon', text: "Bon, faut que j'y aille, Maxence m'attend." }
    } },

    { id: 'cochon_2', if: { phase: 'enquete', seen: 'cochon_1', anyClue: ['c_invitation', 'c_conv', 'c_surprise', 'c_blagues', 'c_sami_vu'] }, start: 'a', nodes: {
      a: { who: 'coq', text: "Hugo… l'invitation pour l'anniv de Jade au skatepark, c'est toi qui l'as écrite ?", next: 'b' },
      b: { who: 'cochon', mood: 'surprised', text: "Hein ? Q-quelle invitation ?", choices: [
        { text: "Je suis pas là pour te gronder. Je veux juste comprendre.", next: 'c', do: { add: { trust_cochon: 1, reaction: 1 } } },
        { text: "Avoue, c'est toi ! Tout le monde va le savoir !", next: 'x', do: { add: { trust_cochon: -2, reaction: -1 } } }
      ] },
      c: { who: 'cochon', mood: 'sad', text: "…C'est moi qui l'ai écrite. C'était l'idée de Maxence. Il trouvait ça trop drôle. Moi, je voulais juste rigoler avec eux.", next: 'd' },
      d: { who: 'cochon', mood: 'sad', text: "Je pensais pas qu'il viendrait vraiment. Il a attendu deux heures… et Maxence filmait.",
        do: { clue: 'c_cochon_aveu', testi: { id: 't_hugo_aveu', who: 'cochon', text: "« C'était l'idée de Maxence. Moi, je voulais juste rigoler avec eux. »" } }, choices: [
          { text: "Tu pourrais t'excuser auprès de lui.", next: 'e', do: { add: { reaction: 1 }, flag: 'cochon_excuses_idee' } },
          { text: "Merci de me l'avoir dit. C'est courageux.", next: 'f', do: { add: { trust_cochon: 1, reaction: 1 } } }
        ] },
      e: { who: 'cochon', mood: 'worried', text: "Oui… peut-être. Mais si Maxence l'apprend, je vais me retrouver tout seul, moi aussi." },
      f: { who: 'cochon', mood: 'shy', text: "Courageux ? Moi ? …Merci, Noé." },
      x: { who: 'cochon', mood: 'angry', text: "Mais non ! Laisse-moi tranquille !", next: 'x2' },
      x2: { who: 'narr', text: "Hugo se ferme complètement. En lui parlant plus calmement, peut-être…" }
    } },

    { id: 'cochon_2b', if: { phase: 'enquete', seen: 'cochon_2', notClue: 'c_cochon_aveu' }, start: 'a', nodes: {
      a: { who: 'coq', text: "Désolé pour tout à l'heure. Je veux pas t'accuser. Je veux comprendre ce qui s'est passé.", next: 'b' },
      b: { who: 'cochon', mood: 'sad', text: "…Bon. D'accord. C'est moi qui ai écrit l'invitation. Maxence m'a dit que ce serait drôle.", do: { add: { trust_cochon: 1, reaction: 1 } }, next: 'c' },
      c: { who: 'cochon', text: "Je voulais juste rigoler avec eux. Je pensais pas que ça lui ferait autant de mal.",
        do: { clue: 'c_cochon_aveu', testi: { id: 't_hugo_aveu', who: 'cochon', text: "« Maxence m'a dit que ce serait drôle. Je voulais juste rigoler avec eux. »" } } }
    } },

    /* ----- Phase 2 ----- */
    { id: 'cochon_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'cochon', mood: 'worried', text: "Noé… Tu sais tout, hein ?", choices: [
        { text: "Oui. Mais je crois que tu peux réparer une partie des choses.", next: 'b', do: { add: { trust_cochon: 1, reaction: 1 } } },
        { text: "T'as vraiment été nul avec lui.", next: 'c', do: { add: { trust_cochon: -1 } } }
      ] },
      b: { who: 'cochon', text: "Je voudrais m'excuser auprès de Milo. Vraiment. Mais pas devant Maxence…", do: { flag: 'cochon_excuses', rel: { 'agneau|cochon': 1 } }, next: 'd' },
      c: { who: 'cochon', mood: 'sad', text: "Je sais… Je m'en veux.", next: 'c2' },
      c2: { who: 'narr', text: "Il a compris. Lui faire honte ne l'aidera pas à changer.", next: 'd' },
      d: { who: 'cochon', text: "Le problème, c'est qu'avec Maxence, je fais n'importe quoi pour qu'il me trouve drôle. Mets-moi loin de lui, s'il te plaît.", do: { flag: 'info_cochon' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ["Les frites de la cantine, c'est la vie.", "Hé hé… tu connais celle du compas ? Non ? Moi non plus.", "Je veux juste que tout le monde s'entende bien…"] },
    { idle: true, lines: ["J'espère que Milo acceptera mes excuses…", "Je vais essayer de faire des blagues qui font rire tout le monde. Même lui."] }
  ],

  /* =================== 🐴 INÈS =================== */
  cheval: [
    { id: 'cheval_casier', if: { phase: 'enquete', slot: 'm_matin' }, start: 'a', nodes: {
      a: { who: 'narr', label: 'Ce que tu vois', text: "Inès fixe le casier de Milo, tagué au marqueur rouge. Elle n'a pas bougé depuis que tu es arrivé.", next: 'b' },
      b: { who: 'cheval', mood: 'worried', text: "C'est… n'importe quoi. Tout le monde passe devant et personne dit rien.", choices: [
        { text: "Toi non plus, tu dis rien.", next: 'c', do: { add: { trust_cheval: -1 } } },
        { text: "Tu sais qui a fait ça ?", next: 'd' },
        { act: "Proposer d'agir ensemble ·", text: "« On va le dire à la vie scolaire ? À deux, c'est plus facile. »", next: 'e',
          do: { add: { trust_cheval: 2, reaction: 1 }, flag: 'cheval_engage', rel: { 'agneau|cheval': 1 } } }
      ] },
      c: { who: 'cheval', mood: 'sad', text: "…Je sais. C'est pas si simple." },
      d: { who: 'cheval', text: "Peut-être. J'ai vu un marqueur rouge traîner au local du matériel… Mais je veux accuser personne sans être sûre.",
        do: { testi: { id: 't_ines_marqueur', who: 'cheval', text: "« J'ai vu un marqueur rouge traîner au local du matériel. »" } } },
      e: { who: 'cheval', text: "…D'accord. J'en ai marre de faire comme si je voyais rien. Je passerai voir Mme Chouette à la récré.", next: 'e2' },
      e2: { who: 'narr', text: "Parfois, il suffit qu'une personne fasse le premier pas pour que les autres osent." }
    } },

    { id: 'cheval_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'cheval', text: ["…Oh. Salut, Noé.", "Salut. Tu cherches un ballon ?"], choices: [
        { text: "T'as l'air préoccupée.", next: 'b', do: { add: { trust_cheval: 1 } } },
        { text: "Tu vois tout le monde passer, avec les clés du local ?", next: 'c' }
      ] },
      b: { who: 'cheval', mood: 'worried', text: "Moi ? Non… enfin. J'ai vu quelque chose, la semaine dernière…", do: { flag: 'cheval_vu_teaser' }, choices: [
        { text: "Tu veux m'en parler ?", next: 'b2' },
        { text: "Dis-le-moi, c'est important !", next: 'b3', do: { add: { trust_cheval: -1 } } }
      ] },
      b2: { who: 'cheval', text: "Pas maintenant. Je suis pas sûre de ce que j'ai vu. Je veux accuser personne." },
      b3: { who: 'cheval', mood: 'worried', text: "Doucement… Je… je sais pas. Laisse-moi réfléchir." },
      c: { who: 'cheval', text: "Oui. Avec les clés du local, on voit beaucoup de choses. Trop, parfois.", do: { flag: 'cheval_vu_teaser' } }
    } },

    { id: 'cheval_2', if: { phase: 'enquete', seen: 'cheval_1', any: [{ min: { trust_cheval: 1 }, minClues: 3 }, { anyClue: ['c_porte_cles', 'c_boite', 'c_stylo'] }, { minClues: 7 }, { flag: 'cheval_engage' }] }, start: 'a', nodes: {
      a: { who: 'coq', text: "Tu m'as dit que t'avais vu quelque chose…", next: 'b' },
      b: { branch: [{ if: { variant: { cheval_vu: 'cache' } }, next: 'b1' }, { next: 'b2' }] },
      b1: { who: 'cheval', text: "La semaine dernière, Maxence est entré au local pendant la récré. Il a caché un truc au fond de la vieille caisse. Il riait.", do: { clue: 'c_cheval_vu' }, next: 'c' },
      b2: { who: 'cheval', text: "Jeudi dernier, j'ai vu Maxence arracher l'affiche du club BD, dans le hall. Après, il est venu la cacher au local, dans la vieille caisse.", do: { clue: 'c_cheval_vu' }, next: 'c' },
      c: { who: 'cheval', text: "…", choices: [
        { text: "Pourquoi t'as rien dit ?", next: 'd' },
        { text: "Merci de me le dire. Ça compte.", next: 'd', do: { add: { trust_cheval: 1, reaction: 1 } } }
      ] },
      d: { who: 'cheval', mood: 'sad', text: "Je savais pas quoi faire. J'avais peur d'en faire trop… ou que ce soit moi, la prochaine.",
        do: { clue: 'c_cheval_hesite', testi: { id: 't_ines_peur', who: 'cheval', text: "« J'avais peur que ce soit moi, la prochaine. »" } }, choices: [
          { text: "Je comprends. Mais on peut encore agir.", next: 'e', do: { add: { trust_cheval: 1, reaction: 1 }, flag: 'cheval_engage' } },
          { text: "T'aurais dû l'aider !", next: 'f', do: { add: { trust_cheval: -1 } } }
        ] },
      e: { who: 'cheval', text: "T'as raison. Si t'as besoin de moi, je serai là." },
      f: { who: 'cheval', mood: 'sad', text: "…Je sais.", next: 'f2' },
      f2: { who: 'narr', text: "Elle baisse la tête. Le reproche ne l'aide pas vraiment à agir." }
    } },

    { id: 'cheval_3', if: { phase: 'enquete', seen: 'cheval_2', anyClue: ['c_invitation', 'c_photo_volee', 'c_cadeau', 'c_agneau_aveu'] }, start: 'a', nodes: {
      a: { who: 'coq', text: "Samedi après-midi, t'as vu Milo au skatepark ?", next: 'b' },
      b: { who: 'cheval', mood: 'sad', text: "En rentrant du hand, je suis passée devant. Il était assis là, avec un petit paquet. Il a attendu longtemps. Personne est venu.", do: { clue: 'c_cheval_samedi' }, next: 'c' },
      c: { who: 'cheval', text: "J'aurais pu aller le voir. Je l'ai pas fait. Et lundi soir, j'ai vu la photo… et j'ai rien écrit non plus.",
        do: { testi: { id: 't_ines_samedi', who: 'cheval', text: "« J'ai vu la photo… et j'ai rien écrit. »" } } }
    } },

    /* ----- Phase 2 ----- */
    { id: 'cheval_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'cheval', text: "Noé. J'ai pas arrêté d'y penser.", choices: [
        { text: "Cette fois, tu peux agir. Même juste en disant « stop ».", next: 'b', do: { flag: 'cheval_engage', add: { trust_cheval: 1, reaction: 1 } } },
        { text: "T'aurais pu tout empêcher.", next: 'c', do: { add: { trust_cheval: -1 } } }
      ] },
      b: { who: 'cheval', text: "Oui. Si je vois une moquerie, je dirai stop. Tout de suite.", next: 'd' },
      c: { who: 'cheval', mood: 'sad', text: "Peut-être… Je sais pas si je saurai mieux faire.", next: 'd' },
      d: { who: 'cheval', text: "Un conseil : ici, les tournois finissent toujours en moqueries. Maxence adore gagner devant tout le monde.", next: 'e' },
      e: { who: 'cheval', text: "Si tu veux, donne-moi un rôle où je peux garder un œil sur tout le monde.", do: { flag: 'info_cheval' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ["On voit beaucoup de choses, d'ici.", "Les ballons de basket sont encore tous dégonflés…", "Parfois, se taire, c'est aussi choisir un camp… non ?"] },
    { idle: true, lines: ["Je suis prête, Noé.", "Cette fois, je resterai pas sans rien faire."] }
  ],

  /* =================== 🐕 NINA =================== */
  chien: [
    { id: 'chien_cpe', if: { phase: 'enquete', slot: 'm_matin', flag: 'nina_cpe', notFlag: 'vs_ensemble' }, repeat: true, start: 'a', nodes: {
      a: { who: 'chien', mood: 'happy', text: "T'es venu ! Je savais que je pouvais compter sur toi.", next: 'b' },
      b: { who: 'chien', text: "On y va ? Mme Chouette est dans son bureau. Je parle en premier, si tu veux.", choices: [
        { act: "Y aller ensemble ·", text: "« Allons-y. »", next: 'c',
          do: { flags: ['adult_informed', 'vs_ensemble'], add: { reaction: 2, trust_chien: 1 }, rel: { 'agneau|chien': 1 } } },
        { text: "Attends… pas tout de suite.", next: 'd' }
      ] },
      c: { who: 'narr', label: 'Un peu plus tard', text: "Dans le bureau de la vie scolaire, Nina et toi racontez tout : les surnoms, la cantine, la photo du groupe.", next: 'c1' },
      c1: { branch: [{ if: { flag: 'capture_photo' }, next: 'cap' }, { next: 'c2' }] },
      cap: { who: 'coq', text: "J'ai gardé une capture de la photo. Je l'ai envoyée à personne.", next: 'cap2' },
      cap2: { who: 'chouette', text: "Tu as très bien fait. Avec ça, je peux agir sur des faits précis. Et tu as raison : on ne la fait jamais circuler.", do: { flag: 'preuve_montree' }, next: 'c2' },
      c2: { who: 'chouette', text: "Merci d'être venus tous les deux. Ce n'est pas « balancer » : c'est protéger. Je m'en occupe, discrètement, et je vais parler à Milo." },
      d: { who: 'chien', mood: 'worried', text: "Ok… mais si on attend, ça va continuer. Je t'attends ici." }
    } },

    { id: 'chien_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { branch: [{ if: { flag: 'scene_cour_done' }, next: 'a1' }, { next: 'a2' }] },
      a1: { who: 'chien', text: "Salut, Noé. T'as entendu Maxence, tout à l'heure ?", choices: [
        { text: "Oui. Il parlait de Milo ?", next: 'b' },
        { text: "T'as l'air énervée.", next: 'c' }
      ] },
      a2: { who: 'chien', text: "Noé. Salut.", choices: [
        { text: "Ça va ? T'as l'air contrariée.", next: 'c' },
        { text: "Il se passe quelque chose dans la classe ?", next: 'b' }
      ] },
      b: { who: 'chien', mood: 'angry', text: "À ton avis ? Ça fait des semaines que ça dure. Ouvre les yeux, tu vas comprendre.", next: 'd' },
      c: { who: 'chien', text: "Y a des trucs qui me plaisent pas, en ce moment, dans la classe.", next: 'd' },
      d: { who: 'chien', text: "Regarde à la cantine, à midi. Ça fait des semaines que Milo mange tout seul, au bout.",
        do: { clue: 'c_chien_observe', testi: { id: 't_nina_cantine', who: 'chien', text: "« Ça fait des semaines que Milo mange tout seul. »" } } }
    } },

    { id: 'chien_2', if: { phase: 'enquete', seen: 'chien_1', any: [{ minClues: 4 }, { minSlot: 'l_midi' }] }, start: 'a', nodes: {
      a: { who: 'coq', text: "T'as déjà essayé de faire quelque chose ?", next: 'b' },
      b: { who: 'chien', text: "J'ai parlé à Maxence. Je lui ai dit d'arrêter. Il a rigolé et il a dit que j'étais « trop sérieuse ».", next: 'c' },
      c: { who: 'chien', mood: 'sad', text: "Après ça, le groupe m'a un peu mise de côté, moi aussi. C'est dur de tenir toute seule.",
        do: { clue: 'c_chien_tente', testi: { id: 't_nina_seule', who: 'chien', text: "« J'ai dit stop à Maxence. Après, le groupe m'a mise de côté. »" } }, choices: [
          { text: "T'es plus toute seule. On peut agir à deux.", next: 'd', do: { add: { trust_chien: 2, reaction: 2 }, flag: 'allie_chien' } },
          { text: "Laisse tomber, ça nous regarde pas.", next: 'e', do: { add: { trust_chien: -2, reaction: -2 } } }
        ] },
      d: { who: 'chien', mood: 'happy', text: "Ça, c'est ce que je voulais entendre." },
      e: { who: 'chien', mood: 'angry', text: "Si personne s'en mêle, ça s'arrêtera jamais. Réfléchis-y." }
    } },

    { id: 'chien_3', if: { phase: 'enquete', seen: 'chien_2', minClues: 7, notFlag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'chien', text: "Si ça continue, il faudra en parler à Mme Chouette.", next: 'b' },
      b: { who: 'chien', text: "C'est pas « balancer ». C'est protéger quelqu'un.", do: { flag: 'chien_adulte' } }
    } },

    /* ----- Phase 2 ----- */
    { id: 'chien_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'chien', text: "Alors, délégué, on fait quoi ?", next: 'b' },
      b: { who: 'coq', text: "Je veux organiser une activité pour que Milo retrouve sa place.", next: 'c' },
      c: { who: 'chien', text: "Bonne idée. Mais si tu le mets avec Maxence dans un truc où il faut gagner, ça va mal finir.", choices: [
        { text: "Et si on n'invitait pas Maxence ?", next: 'd' },
        { text: "Tu resteras avec Milo ?", next: 'e', do: { add: { trust_chien: 1 } } }
      ] },
      d: { who: 'chien', text: "Il irait raconter partout que c'est nul. Ça règle rien. Il faut surtout que quelqu'un lui pose des limites… ou en parle à un adulte.", next: 'e' },
      e: { who: 'chien', mood: 'happy', text: "Moi, je reste avec Milo. Promis.", do: { flag: 'info_chien' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ["Ouvre l'œil, Noé.", "Maxence fait rire tout le monde. Mais tout le monde ne rit pas."] },
    { idle: true, lines: ["On est une équipe, toi et moi.", "Je garde un œil sur Milo."] }
  ],

  /* =================== 🐱 JADE =================== */
  jade: [
    { id: 'jade_2', if: { phase: 'enquete', flag: 'groupe_reagit', minSlot: 'm_matin' }, start: 'a', nodes: {
      a: { branch: [{ if: { flag: 'stop_ligne' }, next: 'a1' }, { next: 'a2' }] },
      a1: { who: 'jade', mood: 'worried', text: "Noé… Hier soir, dans le groupe. T'avais raison.", next: 'b' },
      a2: { who: 'jade', mood: 'worried', text: "Noé… Hier soir, dans le groupe. Nina avait raison.", next: 'b' },
      b: { who: 'jade', text: "La photo, c'était abusé. J'ai rigolé sans réfléchir… Il avait acheté un cadeau, en plus. Pour moi.",
        do: { flag: 'jade_change', rel: { 'jade|renard': -1 }, testi: { id: 't_jade_abuse', who: 'jade', text: "« La photo, c'était abusé. J'ai rigolé sans réfléchir. »" } }, choices: [
          { text: "Tu pourrais lui dire, à Milo.", next: 'c', do: { add: { reaction: 1 } } },
          { text: "Mieux vaut tard que jamais.", next: 'c' }
        ] },
      c: { who: 'jade', text: "Ouais. Je vais essayer. Et je traîne plus trop avec Maxence, en ce moment." }
    } },
    { id: 'jade_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'jade', mood: 'happy', text: ["Oh, salut Noé ! T'as vu le nouveau clip de… non, laisse.", "Noé ! Toujours à tout observer, toi."], choices: [
        { text: "Pourquoi tu ris quand Maxence embête Milo ?", next: 'b' },
        { text: "Rien, je passais.", next: 'z' }
      ] },
      b: { who: 'jade', text: "Quoi ? Moi j'ai rien fait. J'ai juste rigolé. C'est Maxence qui dit les trucs, pas moi.",
        do: { flag: 'jade_rien', testi: { id: 't_jade_rien', who: 'jade', text: "« Moi j'ai rien fait, j'ai juste rigolé. »" } }, choices: [
          { text: "Quand tu ris, il continue. T'y as déjà pensé ?", next: 'c', do: { add: { reaction: 1 } } },
          { text: "Ok, ok.", next: 'z' }
        ] },
      c: { who: 'jade', mood: 'surprised', text: "…", next: 'c2' },
      c2: { who: 'jade', mood: 'worried', text: "C'est pas si simple. Si je rigole pas, je suis plus dans le groupe. Et toi, t'es dans quel groupe ?" },
      z: { who: 'jade', text: "Bon, à plus !" }
    } },
    { idle: true, if: { phase: 'enquete', flag: 'groupe_reagit' }, lines: ["Je me suis jamais sentie aussi bête qu'hier soir.", "Je crois que je vais quitter le groupe de Maxence."] },
    { idle: true, lines: ["T'as vu mes nouvelles barrettes ?", "Je suis pas méchante, tu sais.", "Maxence, il est drôle… la plupart du temps."] }
  ],

  /* =================== 🐰 SAMI =================== */
  sami: [
    { id: 'sami_2', if: { phase: 'enquete', minSlot: 'm_matin', anyClue: ['c_vus', 'c_photo_volee'] }, start: 'a', nodes: {
      a: { who: 'coq', text: "Sami… lundi soir, t'avais commencé à écrire un message dans le groupe. Puis tu l'as supprimé.", next: 'b' },
      b: { who: 'sami', mood: 'worried', text: "…Ouais. J'avais écrit « c'est pas un peu abusé ? ». Puis j'ai eu peur d'être le prochain.", next: 'c' },
      c: { who: 'sami', text: "Et samedi… j'étais au skatepark. J'ai vu Maxence et Hugo cachés derrière la rampe. Ils filmaient Milo qui attendait.",
        do: { clue: 'c_sami_vu', testi: { id: 't_sami_skate', who: 'sami', text: "« J'ai vu Maxence et Hugo cachés derrière la rampe. Ils filmaient Milo. »" } }, choices: [
          { text: "Merci de me le dire. Tu pourrais lui écrire, à Milo ?", next: 'd', do: { flag: 'sami_soutien', rel: { 'agneau|sami': 1 }, add: { reaction: 1 } } },
          { text: "Pourquoi t'as rien fait ?", next: 'e' }
        ] },
      d: { who: 'sami', text: "…Ouais. Un message, je peux faire ça." },
      e: { who: 'sami', mood: 'sad', text: "Je sais pas. J'étais tout seul. Eux, ils étaient deux.", next: 'e2' },
      e2: { who: 'narr', text: "Il a eu peur, comme beaucoup de témoins. Ça ne fait pas de lui un complice… et il peut encore agir." }
    } },
    { id: 'sami_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'narr', label: 'Ce que tu vois', text: "Sami retire un côté de son casque.", next: 'b' },
      b: { who: 'sami', mood: 'shy', text: "…Salut.", choices: [
        { text: "Tu lis quoi ?", next: 'c' },
        { text: "T'es souvent au CDI, non ?", next: 'd' }
      ] },
      c: { who: 'sami', text: "Un manga. L'histoire d'un gars que personne ne remarque… Ça me parle.", next: 'z' },
      d: { who: 'sami', text: "Au CDI, personne t'embête. C'est pour ça que Milo vient aussi, je crois.",
        do: { testi: { id: 't_sami_cdi', who: 'sami', text: "« Au CDI, personne t'embête. C'est pour ça que Milo vient aussi. »" } }, next: 'z' },
      z: { who: 'narr', text: "Il remet son casque. Mais il te fait un petit signe de tête." }
    } },
    { idle: true, lines: ["…", "(Il hoche la tête sans enlever son casque.)", "Le CDI ferme à 17 h, si tu cherches."] }
  ],

  /* =================== 🦉 MME CHOUETTE (CPE) =================== */
  chouette: [
    { id: 'chouette_conseil', if: { phase: 'enquete', slot: 'l_recre', flag: 'conseil_adulte' }, start: 'a', nodes: {
      a: { who: 'coq', text: "Madame… Je sais pas trop quoi faire. Maxence se moque de Milo tout le temps, et tout le monde rit.", next: 'b' },
      b: { who: 'chouette', text: "Tu as bien fait de venir m'en parler. Ce n'est pas à toi de régler ça tout seul.", do: { add: { reaction: 1 } }, next: 'c' },
      c: { who: 'chouette', text: "Ce que tu peux faire : ne pas rire, rester à côté de Milo quand tu peux, et noter ce que tu vois. Si ça continue, ou si ça passe sur les téléphones, reviens me voir tout de suite.", next: 'd' },
      d: { who: 'chouette', text: "De mon côté, je vais garder un œil sur la cour.", do: { flag: 'chouette_vigilante' } }
    } },

    { id: 'chouette_ent', if: { phase: 'enquete', minSlot: 'm_matin', flag: 'alerte_ent', notFlag: 'vs_ensemble' }, start: 'a', nodes: {
      a: { who: 'chouette', text: "Noé ! J'ai bien lu ton message d'hier soir. Merci.", next: 'b' },
      b: { branch: [{ if: { flag: 'capture_photo' }, next: 'cap' }, { next: 'c' }] },
      cap: { who: 'coq', text: "J'ai gardé une capture de la photo. Je l'ai envoyée à personne.", next: 'cap2' },
      cap2: { who: 'chouette', text: "Tu as très bien fait. Avec ça, je peux agir sur des faits précis. Et tu as raison : on ne la fait jamais circuler.", do: { flag: 'preuve_montree' }, next: 'c' },
      c: { who: 'chouette', text: "J'ai déjà vu Maxence ce matin, et j'ai parlé à Milo. Ce que tu as fait, ce n'est pas « balancer » : c'est protéger." }
    } },

    { id: 'chouette_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'chouette', text: "Bonjour, Noé. Tout va bien ?", next: 'b' },
      b: { who: 'chouette', text: "Je prépare le tournoi de basket de jeudi. Si quelque chose te tracasse, ma porte est ouverte.", choices: [
        { text: "Merci, Madame.", next: null },
        { text: "Vous trouvez que l'ambiance a changé, en 5e B ?", next: 'c' }
      ] },
      c: { who: 'chouette', text: "J'ai remarqué que Milo ne s'inscrit plus à aucune activité, et qu'il demande souvent à rester au CDI. Ça m'inquiète un peu.", do: { clue: 'c_chouette' } }
    } },

    { id: 'chouette_2', if: { phase: 'enquete', minClues: 5, notFlag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'coq', text: "Madame Chouette… je crois qu'il se passe quelque chose avec Milo.", next: 'b' },
      b: { who: 'chouette', text: "Je t'écoute. Qu'est-ce que tu as remarqué ?", choices: [
        { text: "Plusieurs petites choses : des surnoms, la cantine, une photo dans le groupe de la classe…", next: 'c', do: { flag: 'adult_informed', add: { reaction: 2 } } },
        { text: "Je préfère d'abord en être sûr.", next: 'd' }
      ] },
      c: { who: 'chouette', text: "Merci de m'en parler. Ce n'est pas « rapporter » : c'est protéger quelqu'un.", next: 'c1' },
      c1: { branch: [{ if: { flag: 'capture_photo' }, next: 'cap' }, { next: 'c2' }] },
      cap: { who: 'coq', text: "J'ai gardé une capture de la photo. Je l'ai envoyée à personne.", next: 'cap2' },
      cap2: { who: 'chouette', text: "Tu as très bien fait. Avec ça, je peux agir sur des faits précis. Et on ne la fait jamais circuler.", do: { flag: 'preuve_montree' }, next: 'c2' },
      c2: { who: 'chouette', text: "Continue d'être attentif. De mon côté, je vais parler aux élèves concernés, et à Milo." },
      d: { who: 'chouette', text: "C'est sage de vérifier. Mais n'attends pas trop : si ça se répète, viens me voir." }
    } },

    { id: 'chouette_r', if: { phase: 'reintegration', notFlag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'coq', text: "Madame Chouette, j'ai compris ce qui arrive à Milo. Maxence l'isole depuis des semaines, au collège et en ligne, et d'autres suivent.", next: 'b' },
      b: { who: 'chouette', text: "Merci d'être venu. Tu as bien fait : le harcèlement, c'est sérieux, même quand ça ressemble à des « blagues ».",
        do: { flags: ['adult_informed', 'chouette_presente'], add: { reaction: 2, group_cohesion: 1 } }, next: 'c' },
      c: { who: 'chouette', text: "Je vais parler à Maxence, calmement. Et je passerai pendant votre activité." }
    } },
    { id: 'chouette_r2', if: { phase: 'reintegration', flag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'chouette', text: "Merci encore de m'avoir prévenue, Noé. J'ai parlé à Maxence, et je passerai pendant votre activité.", do: { flag: 'chouette_presente' } }
    } },

    { idle: true, lines: ["Les inscriptions au tournoi sont sur le panneau du hall.", "N'hésite jamais à demander de l'aide, Noé.", "La vie scolaire est ouverte de 7 h 45 à 17 h 30."] }
  ],

  /* =================== 🦡 M. BLAIREAU (EPS) =================== */
  blaireau: [
    { id: 'blaireau_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'blaireau', text: "Noé ! On ne court pas, hein. …Tu voulais me demander quelque chose ?", choices: [
        { text: "Milo ne vient plus au basket du midi ?", next: 'b' },
        { text: "Non, rien, monsieur.", next: 'z' }
      ] },
      b: { who: 'blaireau', text: "Il demande souvent à être dispensé, ces temps-ci. Il dit qu'il a mal au ventre. Hm. Si tu sais quelque chose, va voir Mme Chouette, d'accord ?",
        do: { testi: { id: 't_blaireau', who: 'blaireau', text: "« Milo demande souvent à être dispensé de sport, ces temps-ci. »" } } },
      z: { who: 'blaireau', text: "Allez, file." }
    } },
    { idle: true, lines: ["Pas de ballon dans les couloirs !", "On respire, on boit de l'eau !", "Le tournoi de jeudi, ça se prépare !"] }
  ],

  /* =================== Les autres élèves =================== */
  yanis: [
    { idle: true, if: { minSlot: 'm_matin', maxSlot: 'm_fin' }, lines: ["T'as vu le groupe hier soir ? J'ai pas su quoi répondre.", "Nina est vraiment énervée, ce matin."] },
    { idle: true, lines: ["T'as fait l'exo de maths ?", "Nina est trop forte au basket.", "Le contrôle de SVT, j'ai rien révisé…"] }
  ],
  theo: [
    { idle: true, if: { slot: 'm_recre', min: { rumeur: 1 } }, lines: ["Il paraît que Milo a pleuré en SVT. …Enfin, c'est ce qu'on m'a dit.", "Tout le monde parle de la photo du skatepark."] },
    { idle: true, lines: ["Salut ! Je suis en 5e A, mais je connais tout le monde.", "Il paraît qu'il y a des frites, ce midi.", "Tu viens au tournoi de jeudi ?"] }
  ],
  lena: [
    { idle: true, if: { minSlot: 'm_matin', maxSlot: 'm_fin' }, lines: ["Le groupe hier soir… c'était pas cool. Moi, j'ai rien osé écrire.", "Jade a l'air bizarre depuis hier."] },
    { idle: true, lines: ["Inès m'a mis une raclée au ping-pong.", "Tu veux jouer avec nous ?", "Vivement jeudi."] }
  ]
};
