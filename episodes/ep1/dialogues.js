/* =========================================================
   DIALOGUES — Épisode 1
   ---------------------------------------------------------
   Pour chaque personnage : une liste de conversations, essayées dans l'ordre.
   La première disponible (condition « if » vraie, pas encore vue) est jouée.
   Quand il n'y a plus rien de nouveau, une conversation « idle » est utilisée.

   Une conversation :
     id    : identifiant unique
     if    : condition (phase, indices, confiance...) — voir js/core.js (C.check)
     start : premier nœud
     nodes : les répliques. Chaque nœud :
       who     : 'coq', 'narr' (pensée du coq) ou un personnage ('agneau'...)
       text    : texte, ou tableau de variantes (une est tirée au hasard)
       next    : nœud suivant (rien = fin)
       choices : [{ text, next, do }] réponses proposées au joueur
       do      : effets quand le nœud s'affiche ou que le choix est fait
                 ex. { add: { trust_agneau: 1, reaction: 1 }, clue: 'c_x', flag: 'y' }
       branch  : [{ if, next }] aiguillage automatique selon une condition
   « reaction » mesure la qualité de tes réactions (empathie, aide...) pour le score.
   ========================================================= */
CDC.ep('ep1').dialogues = {

  /* =================== 🐑 AGNEAU =================== */
  agneau: [
    { id: 'agneau_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'coq', text: ['Salut ! Ça va ? Tu sembles un peu seul aujourd\'hui.', 'Hé, salut ! Tu es tout seul ici ?'], next: 'b' },
      b: { who: 'agneau', text: ['Oui... ça va.', 'Oh. Salut. Oui, oui... ça va.'], choices: [
        { text: 'Tu es sûr ?', next: 'c', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: 'D\'accord, à plus.', next: 'bye', do: { add: { reaction: -1 } } },
        { text: 'Pourquoi tu restes toujours ici ?', next: 'd' }
      ] },
      c: { who: 'agneau', text: 'Oui. Je préfère rester ici. C\'est plus calme.', next: 'e' },
      d: { who: 'agneau', text: ['Je sais pas. C\'est calme, ici.', 'Ici, personne ne... Enfin, c\'est calme. C\'est tout.'], next: 'e' },
      e: { who: 'agneau', text: '...', choices: [
        { text: 'Tu ne viens plus manger avec nous dans la cour ?', next: 'f' },
        { text: 'Si un jour tu veux parler, je suis là.', next: 'g', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: 'C\'est un peu bizarre de rester tout seul, non ?', next: 'h', do: { add: { trust_agneau: -2, reaction: -2 } } }
      ] },
      f: { who: 'agneau', text: 'Ils ont sûrement autre chose à faire que de manger avec moi.', next: 'f2' },
      f2: { who: 'agneau', text: 'Et puis... je n\'ai pas vraiment envie d\'aller là-bas.', do: { clue: 'c_agneau_mots' }, next: 'f3' },
      f3: { who: 'narr', text: 'Il dit « ils ». Qui ça, « ils » ?' },
      g: { who: 'agneau', text: '...Merci. C\'est gentil, Coq.' },
      h: { who: 'agneau', text: '...', next: 'h2' },
      h2: { who: 'narr', text: 'L\'agneau baisse les yeux. Tu sens que ta phrase l\'a blessé.' },
      bye: { who: 'agneau', text: 'À plus.', next: 'bye2' },
      bye2: { who: 'narr', text: 'Il retourne fixer l\'eau en silence. Tu as l\'impression d\'avoir raté quelque chose.' }
    } },

    { id: 'agneau_2', if: { phase: 'enquete', seen: 'agneau_1', min: { trust_agneau: 0 }, minClues: 3 }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Je repasse te voir. Tu dessines ?', next: 'b' },
      b: { who: 'agneau', text: 'Un peu. Des cartes, surtout. De la ferme.', choices: [
        { text: 'Je peux voir ?', next: 'c', do: { add: { trust_agneau: 1 } } },
        { text: 'Tu devrais les montrer à tout le monde !', next: 'd' }
      ] },
      c: { who: 'agneau', text: '...Si tu veux.', next: 'c2' },
      c2: { who: 'narr', text: 'Ses cartes sont incroyables : chaque arbre, chaque chemin, même les cachettes que tu ne connaissais pas.', do: { clue: 'c_agneau_talent' }, next: 'q' },
      d: { who: 'agneau', text: 'Non ! Enfin... la dernière fois que j\'ai montré un dessin, il a fini déchiré.', do: { flag: 'agneau_dessin_dit' }, next: 'q' },
      q: { who: 'coq', text: 'Il s\'est passé quelque chose avec les autres ?', next: 'r' },
      r: { who: 'agneau', text: ['Non, ça va. Vraiment.', 'Non... Ça va, je t\'assure.'], choices: [
        { text: 'D\'accord. Je ne te force pas. Mais je suis là.', next: 's', do: { add: { trust_agneau: 1, reaction: 1 } } },
        { text: 'Tu peux tout me dire. C\'est le renard, c\'est ça ?', next: 't', do: { add: { trust_agneau: -1 } } }
      ] },
      s: { who: 'agneau', text: '...Merci, Coq.' },
      t: { who: 'agneau', text: 'J\'ai pas dit ça ! ...Laisse tomber.', next: 't2' },
      t2: { who: 'narr', text: 'Trop vite, trop fort. Il faut d\'abord gagner sa confiance.' }
    } },

    { id: 'agneau_3', if: { phase: 'enquete', min: { trust_agneau: 2 }, anyClue: ['c_invitation', 'c_conv', 'c_attente', 'c_charrette'] }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Samedi... tu étais au grand chêne, non ?', next: 'b' },
      b: { who: 'agneau', text: '...Comment tu sais ?', choices: [
        { text: 'J\'ai vu l\'invitation. Je suis désolé.', next: 'c', do: { add: { trust_agneau: 1 } } },
        { text: 'Tout le monde en parle.', next: 'x', do: { add: { trust_agneau: -1, reaction: -1 } } }
      ] },
      c: { who: 'agneau', text: 'J\'y ai cru, tu sais. J\'avais même apporté un petit cadeau. J\'ai attendu longtemps. C\'est bête.', do: { clue: 'c_agneau_aveu' }, choices: [
        { text: 'Ce n\'est pas bête. Ce sont eux qui ont eu tort.', next: 'd', do: { add: { trust_agneau: 1, reaction: 2 } } },
        { text: 'Tu aurais dû te méfier.', next: 'e', do: { add: { trust_agneau: -2, reaction: -2 } } }
      ] },
      d: { who: 'agneau', text: '...Peut-être. Merci de dire ça.' },
      e: { who: 'agneau', text: '...Oui. Sûrement.', next: 'e2' },
      e2: { who: 'narr', text: 'Il a l\'air encore plus triste. Ce n\'est pas à lui de se sentir coupable.' },
      x: { who: 'agneau', text: 'Tout le monde... Super.', next: 'x2' },
      x2: { who: 'narr', text: 'Il se recroqueville. Ce n\'était pas la chose à dire.' }
    } },

    /* ----- Phase 2 : réintégration ----- */
    { id: 'agneau_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'agneau', text: 'Coq... Tu as l\'air sérieux.', next: 'b' },
      b: { who: 'coq', text: 'J\'ai compris ce qui se passe avec le renard et les autres.', choices: [
        { text: 'Ce qui t\'arrive n\'est pas de ta faute. Personne ne mérite ça.', next: 'c', do: { add: { trust_agneau: 2, reaction: 2 } } },
        { text: 'Tu devrais te défendre, quand même !', next: 'd', do: { add: { trust_agneau: -1, reaction: -2 } } },
        { text: 'Si tu veux, on peut en parler à la Chouette ensemble.', next: 'e', do: { add: { trust_agneau: 1, reaction: 2 }, flag: 'agneau_ok_adulte' } }
      ] },
      c: { who: 'agneau', text: '...Je croyais que c\'était moi, le problème.', next: 'f' },
      d: { who: 'agneau', text: 'Facile à dire... Quand tout le monde rit, tu fais comment, toi ?', next: 'd2' },
      d2: { who: 'narr', text: 'Il a raison. Ce n\'est pas à lui de régler ça tout seul.', next: 'f' },
      e: { who: 'agneau', text: 'Ensemble ? ...D\'accord. Peut-être, oui.', next: 'f' },
      f: { who: 'coq', text: 'J\'aimerais organiser une activité pour tout le groupe. Qu\'est-ce qui te plairait ?', next: 'g' },
      g: { who: 'agneau', text: 'Pas un truc où on compte les points. Je déteste quand tout le monde me regarde perdre.', next: 'h' },
      h: { who: 'agneau', text: ['J\'aime bien les énigmes, les cartes... chercher des choses.', 'Moi, j\'aime chercher, réfléchir, dessiner des plans.'], next: 'i' },
      i: { who: 'agneau', text: 'Et... je préférerais que le chien soit là. Avec lui, je me sens plus tranquille.', do: { flag: 'info_agneau' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ['Je préfère rester ici.', 'Non, ça va.', 'Ils ont sûrement autre chose à faire.', 'C\'est calme, ici. J\'aime bien regarder les canards.'] },
    { idle: true, lines: ['Merci d\'être venu me parler, Coq.', 'Je vais peut-être essayer... un peu.'] }
  ],

  /* =================== 🦊 RENARD =================== */
  renard: [
    { id: 'renard_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'renard', text: ['Le Coq ! Toujours debout avant tout le monde, hein ? Respect.', 'Hé, le Coq ! Tu tombes bien, je m\'ennuyais.'], choices: [
        { text: 'Ça va ? Il y a une drôle d\'ambiance en ce moment.', next: 'b' },
        { text: 'Tu fais quoi aujourd\'hui ?', next: 'c' }
      ] },
      b: { who: 'renard', text: 'Une drôle d\'ambiance ? Non, on s\'amuse bien. Enfin... presque tout le monde, hé hé.', do: { add: { suspicion_renard: 1 } }, next: 'd' },
      c: { who: 'renard', text: 'On prépare un truc marrant avec le Cochon. Tu devrais traîner avec nous, t\'es cool, toi.', next: 'd' },
      d: { who: 'renard', text: 'D\'ailleurs, si t\'as besoin de quoi que ce soit, tu demandes. Entre nous, on s\'entraide.' }
    } },

    { id: 'renard_2', if: { phase: 'enquete', seen: 'renard_1', minClues: 3 }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Tu sais pourquoi l\'agneau ne vient plus dans la cour ?', next: 'b' },
      b: { who: 'renard', text: 'L\'agneau ? Aucune idée. Il est un peu... à part, non ? Tout le monde pense pareil.', do: { clue: 'c_renard_discours' }, choices: [
        { text: 'Moi, je ne pense pas pareil.', next: 'c', do: { add: { reaction: 1, suspicion_renard: 1 } } },
        { text: 'Ouais, c\'est vrai qu\'il est bizarre.', next: 'd', do: { add: { reaction: -2, trust_renard: 1 } } },
        { text: 'Tu lui as fait quelque chose ?', next: 'e', do: { add: { trust_renard: -1, suspicion_renard: 1 } } }
      ] },
      c: { who: 'renard', text: 'Ok, ok. Relax, le Coq. On rigolait juste, de toute façon.' },
      d: { who: 'renard', text: 'Ah, tu vois ! Toi, t\'as tout compris.', next: 'd2' },
      d2: { who: 'narr', text: 'Un malaise te serre la gorge. Est-ce que tu viens d\'entrer dans son jeu ?' },
      e: { who: 'renard', text: 'Moi ? Quelle idée ! Faut pas être susceptible, c\'était juste une blague.', next: 'e2' },
      e2: { who: 'narr', text: '« C\'était juste une blague »... Quelle blague ?' }
    } },

    { id: 'renard_3', if: { phase: 'enquete', clues: ['c_stylo'], anyClue: ['c_panneau', 'c_inscriptions', 'c_boite'] }, start: 'a', nodes: {
      a: { who: 'coq', text: 'C\'est à toi, ce feutre rouge ? Il traînait à l\'écurie.', next: 'b' },
      b: { who: 'renard', text: 'Ah, merci ! Je le cherchais partout.', choices: [
        { text: 'L\'affiche moqueuse de la cour était écrite en rouge, elle aussi.', next: 'c', do: { add: { suspicion_renard: 2 }, flag: 'renard_feutre' } },
        { text: 'Tiens, le voilà.', next: 'd' }
      ] },
      c: { who: 'renard', text: 'Et alors ? Plein de monde a un feutre rouge. ...T\'as rien de mieux à faire ?', next: 'c2' },
      c2: { who: 'narr', text: 'Pendant une seconde, son grand sourire a disparu.' },
      d: { who: 'renard', text: 'Merci, le Coq. T\'es réglo, toi.' }
    } },

    /* ----- Phase 2 ----- */
    { id: 'renard_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'renard', text: 'Tiens, le détective. Il paraît que tu poses des questions sur moi.', choices: [
        { text: 'Ce que tu fais à l\'agneau, ce n\'est pas une blague. Ça se répète, et ça doit s\'arrêter.', next: 'b', do: { flag: 'renard_limites', add: { reaction: 2, group_cohesion: 1 } } },
        { text: 'Tout le monde va savoir ce que tu as fait. Tu vas voir.', next: 'c', do: { flag: 'renard_humilie', add: { reaction: -1, group_cohesion: -2 } } },
        { text: 'On va en parler à la Chouette.', next: 'd', do: { flags: ['adult_informed', 'renard_prevenu'], add: { reaction: 1 } } }
      ] },
      b: { who: 'renard', text: 'Oh ça va, on rigolait juste...', next: 'b2' },
      b2: { who: 'coq', text: 'Pour toi, c\'est une blague. Pour lui, c\'est tous les jours.', next: 'b3' },
      b3: { who: 'renard', text: '...Ok. J\'avais pas vu ça comme ça.', next: 'b4' },
      b4: { who: 'narr', text: 'Il ne s\'excuse pas encore. Mais il a entendu. Et il sait que tu ne laisseras plus passer.' },
      c: { who: 'renard', text: 'Ah ouais ? Vas-y, raconte. On verra qui tout le monde croira.', next: 'c2' },
      c2: { who: 'narr', text: 'Le menacer l\'a mis sur la défensive. Ça risque de compliquer les choses.' },
      d: { who: 'renard', text: 'Pfff... Ok, ok. Pas besoin d\'en faire une montagne.', next: 'd2' },
      d2: { who: 'narr', text: 'Il fait le malin, mais il sait que les adultes vont s\'en mêler.' }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ['Tout roule, le Coq ?', 'Faut pas tout prendre au sérieux, hein.', 'Tu viens au tournoi, la semaine prochaine ? Ça va être drôle.'] },
    { idle: true, lines: ['...Quoi ?', 'Ouais, ouais. J\'ai compris.'] }
  ],

  /* =================== 🐷 COCHON =================== */
  cochon: [
    { id: 'cochon_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'cochon', text: ['Le Coq ! Tu connais la blague de la carotte qui... non attends, je la refais.', 'Salut ! T\'as faim ? Moi j\'ai toujours faim. Hé hé.'], choices: [
        { text: 'Vas-y, raconte ta blague !', next: 'b', do: { add: { trust_cochon: 1 } } },
        { text: 'Tu sais ce qui se passe avec l\'agneau ?', next: 'c' }
      ] },
      b: { who: 'cochon', text: 'Pourquoi les carottes sont orange ? Parce que si elles étaient vertes, ce seraient des salades ! HAHA !', next: 'b2' },
      b2: { who: 'cochon', text: '...Bon. Le Renard l\'a trouvée nulle. Lui, il aime les blagues sur les autres.', next: 'z' },
      c: { who: 'cochon', text: 'L\'agneau ? Euh... non. Rien. Pourquoi ? Il t\'a dit quelque chose ?', do: { flag: 'cochon_nerveux' }, next: 'c2' },
      c2: { who: 'narr', text: 'Il évite ton regard et arrose la même salade pour la troisième fois.', next: 'z' },
      z: { who: 'cochon', text: 'Bon, faut que j\'arrose, sinon la Chouette va encore me faire les gros yeux.' }
    } },

    { id: 'cochon_2', if: { phase: 'enquete', seen: 'cochon_1', anyClue: ['c_invitation', 'c_conv', 'c_surprise'] }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Cochon... l\'invitation pour la fête de samedi, c\'est toi qui l\'as écrite ?', next: 'b' },
      b: { who: 'cochon', text: 'Hein ? Q-quelle invitation ?', choices: [
        { text: 'Je ne suis pas là pour te gronder. Je veux juste comprendre.', next: 'c', do: { add: { trust_cochon: 1, reaction: 1 } } },
        { text: 'Avoue, c\'est toi ! Tout le monde va le savoir !', next: 'x', do: { add: { trust_cochon: -2, reaction: -1 } } }
      ] },
      c: { who: 'cochon', text: '...C\'est moi qui l\'ai écrite. Le Renard trouvait ça trop drôle. Moi, je voulais juste rigoler avec eux.', next: 'd' },
      d: { who: 'cochon', text: 'Je pensais pas que ça lui ferait autant de mal. Il a attendu tout l\'après-midi...', do: { clue: 'c_cochon_aveu' }, choices: [
        { text: 'Tu pourrais t\'excuser auprès de lui.', next: 'e', do: { add: { reaction: 1 }, flag: 'cochon_excuses_idee' } },
        { text: 'Merci de me l\'avoir dit. C\'est courageux.', next: 'f', do: { add: { trust_cochon: 1, reaction: 1 } } }
      ] },
      e: { who: 'cochon', text: 'Oui... peut-être. Mais si le Renard l\'apprend, je vais me retrouver tout seul, moi aussi.' },
      f: { who: 'cochon', text: 'Courageux ? Moi ? ...Merci, Coq.' },
      x: { who: 'cochon', text: 'Mais non ! Laisse-moi tranquille !', next: 'x2' },
      x2: { who: 'narr', text: 'Le cochon se ferme complètement. En lui parlant plus calmement, peut-être...' }
    } },

    { id: 'cochon_2b', if: { phase: 'enquete', seen: 'cochon_2', notClue: 'c_cochon_aveu' }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Désolé pour tout à l\'heure. Je ne veux pas t\'accuser. Je veux comprendre ce qui s\'est passé.', next: 'b' },
      b: { who: 'cochon', text: '...Bon. D\'accord. C\'est moi qui ai écrit l\'invitation. Le Renard m\'a dit que ce serait drôle.', do: { add: { trust_cochon: 1, reaction: 1 } }, next: 'c' },
      c: { who: 'cochon', text: 'Je voulais juste rigoler avec eux. Je pensais pas que ça lui ferait autant de mal.', do: { clue: 'c_cochon_aveu' } }
    } },

    /* ----- Phase 2 ----- */
    { id: 'cochon_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'cochon', text: 'Coq... Tu sais tout, hein ?', choices: [
        { text: 'Oui. Mais je crois que tu peux réparer une partie des choses.', next: 'b', do: { add: { trust_cochon: 1, reaction: 1 } } },
        { text: 'Tu as été vraiment nul avec lui.', next: 'c', do: { add: { trust_cochon: -1 } } }
      ] },
      b: { who: 'cochon', text: 'Je voudrais m\'excuser auprès de l\'agneau. Vraiment. Mais pas devant le Renard...', do: { flag: 'cochon_excuses' }, next: 'd' },
      c: { who: 'cochon', text: 'Je sais... Je m\'en veux.', next: 'c2' },
      c2: { who: 'narr', text: 'Il a compris. Lui faire honte ne l\'aidera pas à changer.', next: 'd' },
      d: { who: 'cochon', text: 'Le problème, c\'est qu\'avec le Renard, je fais n\'importe quoi pour qu\'il me trouve drôle. Mets-moi loin de lui, s\'il te plaît.', do: { flag: 'info_cochon' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ['Les tomates, c\'est la vie.', 'Hé hé... tu connais celle du poireau ? Non ? Moi non plus.', 'Je veux juste que tout le monde s\'entende bien...'] },
    { idle: true, lines: ['J\'espère que l\'agneau acceptera mes excuses...', 'Je vais essayer de faire des blagues qui font rire tout le monde. Même lui.'] }
  ],

  /* =================== 🐴 CHEVAL =================== */
  cheval: [
    { id: 'cheval_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { who: 'cheval', text: ['...Oh. Bonjour, Coq.', 'Bonjour. Tu viens rarement jusqu\'ici.'], choices: [
        { text: 'Tu as l\'air préoccupé.', next: 'b', do: { add: { trust_cheval: 1 } } },
        { text: 'Tu vois tout le monde passer, d\'ici ?', next: 'c' }
      ] },
      b: { who: 'cheval', text: 'Moi ? Non... enfin. J\'ai vu quelque chose hier...', do: { flag: 'cheval_vu_teaser' }, choices: [
        { text: 'Tu veux m\'en parler ?', next: 'b2' },
        { text: 'Dis-le-moi, c\'est important !', next: 'b3', do: { add: { trust_cheval: -1 } } }
      ] },
      b2: { who: 'cheval', text: 'Pas maintenant. Je ne suis pas sûr de ce que j\'ai vu. Je ne veux accuser personne.' },
      b3: { who: 'cheval', text: 'Doucement... Je... je ne sais pas. Laisse-moi réfléchir.' },
      c: { who: 'cheval', text: 'Oui. On voit beaucoup de choses, depuis l\'écurie. Trop, parfois.', do: { flag: 'cheval_vu_teaser' } }
    } },

    { id: 'cheval_2', if: { phase: 'enquete', seen: 'cheval_1', any: [{ min: { trust_cheval: 1 }, minClues: 3 }, { anyClue: ['c_empreintes', 'c_boite', 'c_stylo'] }, { minClues: 7 }] }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Tu m\'as dit que tu avais vu quelque chose...', next: 'b' },
      b: { branch: [{ if: { variant: { cheval_vu: 'cache' } }, next: 'b1' }, { next: 'b2' }] },
      b1: { who: 'cheval', text: 'Hier soir, le Renard est entré ici avec quelque chose sous le bras. Il l\'a caché dans la vieille boîte, au fond.', do: { clue: 'c_cheval_vu' }, next: 'c' },
      b2: { who: 'cheval', text: 'Hier matin, j\'ai vu le Renard arracher une affiche du panneau de la cour. Il riait. Puis il est venu la cacher dans la vieille boîte, au fond.', do: { clue: 'c_cheval_vu' }, next: 'c' },
      c: { who: 'cheval', text: '...', choices: [
        { text: 'Pourquoi tu n\'as rien dit ?', next: 'd' },
        { text: 'Merci de me le dire. Ça compte.', next: 'd', do: { add: { trust_cheval: 1, reaction: 1 } } }
      ] },
      d: { who: 'cheval', text: 'Je ne savais pas quoi faire. J\'avais peur d\'en faire trop... ou que ça retombe sur moi.', do: { clue: 'c_cheval_hesite' }, choices: [
        { text: 'Je comprends. Mais on peut encore agir.', next: 'e', do: { add: { trust_cheval: 1, reaction: 1 }, flag: 'cheval_engage' } },
        { text: 'Tu aurais dû l\'aider !', next: 'f', do: { add: { trust_cheval: -1 } } }
      ] },
      e: { who: 'cheval', text: 'Tu as raison. Si tu as besoin de moi, je serai là.' },
      f: { who: 'cheval', text: '...Je sais.', next: 'f2' },
      f2: { who: 'narr', text: 'Il baisse la tête. Le reproche ne l\'aide pas vraiment à agir.' }
    } },

    { id: 'cheval_3', if: { phase: 'enquete', seen: 'cheval_2', anyClue: ['c_invitation', 'c_attente', 'c_charrette'] }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Samedi après-midi, tu as vu quelqu\'un près du grand chêne ?', next: 'b' },
      b: { who: 'cheval', text: 'L\'agneau. Il est resté là tout l\'après-midi, avec un petit paquet. Personne n\'est venu.', do: { clue: 'c_cheval_samedi' }, next: 'c' },
      c: { who: 'cheval', text: 'J\'aurais pu aller le voir. Je ne l\'ai pas fait.' }
    } },

    /* ----- Phase 2 ----- */
    { id: 'cheval_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'cheval', text: 'Coq. Je n\'ai pas arrêté d\'y penser.', choices: [
        { text: 'Cette fois, tu peux agir. Même juste en disant « stop ».', next: 'b', do: { flag: 'cheval_engage', add: { trust_cheval: 1, reaction: 1 } } },
        { text: 'Tu aurais pu tout empêcher.', next: 'c', do: { add: { trust_cheval: -1 } } }
      ] },
      b: { who: 'cheval', text: 'Oui. Si je vois une moquerie, je dirai stop. Tout de suite.', next: 'd' },
      c: { who: 'cheval', text: 'Peut-être... Je ne sais pas si je saurai mieux faire.', next: 'd' },
      d: { who: 'cheval', text: 'Un conseil : ici, les tournois finissent toujours en moqueries. Le Renard adore gagner devant tout le monde.', next: 'e' },
      e: { who: 'cheval', text: 'Si tu veux, donne-moi un rôle où je peux garder un œil sur tout le monde.', do: { flag: 'info_cheval' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ['On voit beaucoup de choses d\'ici.', 'Le foin est frais aujourd\'hui.', 'Parfois, se taire, c\'est aussi choisir un camp... non ?'] },
    { idle: true, lines: ['Je suis prêt, Coq.', 'Cette fois, je ne resterai pas sans rien faire.'] }
  ],

  /* =================== 🐕 CHIEN =================== */
  chien: [
    { id: 'chien_1', if: { phase: 'enquete' }, start: 'a', nodes: {
      a: { branch: [{ if: { flag: 'scene_cour_done' }, next: 'a1' }, { next: 'a2' }] },
      a1: { who: 'chien', text: 'Salut, Coq. T\'as entendu le Renard, tout à l\'heure ?', choices: [
        { text: 'Oui. Il parlait de qui ?', next: 'b' },
        { text: 'Tu as l\'air énervé.', next: 'c' }
      ] },
      a2: { who: 'chien', text: 'Coq. Content de te voir.', choices: [
        { text: 'Ça va ? Tu as l\'air contrarié.', next: 'c' },
        { text: 'Il se passe quelque chose dans le groupe ?', next: 'b' }
      ] },
      b: { who: 'chien', text: 'À ton avis ? De celui qu\'on ne voit plus jamais dans la cour. Ouvre les yeux, tu vas comprendre.', next: 'd' },
      c: { who: 'chien', text: 'Il y a des trucs qui me plaisent pas, en ce moment, dans le groupe.', next: 'd' },
      d: { who: 'chien', text: 'Regarde à table, à midi. Ça fait des semaines que quelqu\'un mange tout seul au bout.', do: { clue: 'c_chien_observe' } }
    } },

    { id: 'chien_2', if: { phase: 'enquete', seen: 'chien_1', minClues: 4 }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Tu as déjà essayé de faire quelque chose ?', next: 'b' },
      b: { who: 'chien', text: 'J\'ai parlé au Renard. Je lui ai dit d\'arrêter. Il a rigolé et il a dit que j\'étais « trop sérieux ».', next: 'c' },
      c: { who: 'chien', text: 'Après ça, le groupe m\'a un peu mis de côté, moi aussi. C\'est dur de tenir tout seul.', do: { clue: 'c_chien_tente' }, choices: [
        { text: 'Tu n\'es plus tout seul. On peut agir à deux.', next: 'd', do: { add: { trust_chien: 2, reaction: 2 }, flag: 'allie_chien' } },
        { text: 'Laisse tomber, ça ne nous regarde pas.', next: 'e', do: { add: { trust_chien: -2, reaction: -2 } } }
      ] },
      d: { who: 'chien', text: 'Ça, c\'est ce que je voulais entendre.' },
      e: { who: 'chien', text: 'Si personne ne s\'en mêle, ça ne s\'arrêtera jamais. Réfléchis-y.' }
    } },

    { id: 'chien_3', if: { phase: 'enquete', seen: 'chien_2', minClues: 7 }, start: 'a', nodes: {
      a: { who: 'chien', text: 'Si ça va trop loin, il faudra en parler à la Chouette.', next: 'b' },
      b: { who: 'chien', text: 'C\'est pas « balancer ». C\'est protéger quelqu\'un.', do: { flag: 'chien_adulte' } }
    } },

    /* ----- Phase 2 ----- */
    { id: 'chien_r', if: { phase: 'reintegration' }, start: 'a', nodes: {
      a: { who: 'chien', text: 'Alors, chef, on fait quoi ?', next: 'b' },
      b: { who: 'coq', text: 'Je veux organiser une activité pour que l\'agneau retrouve sa place.', next: 'c' },
      c: { who: 'chien', text: 'Bonne idée. Mais si tu le mets avec le Renard dans un truc où il faut gagner, ça va mal finir.', choices: [
        { text: 'Et si on n\'invitait pas le Renard ?', next: 'd' },
        { text: 'Tu resteras avec l\'agneau ?', next: 'e', do: { add: { trust_chien: 1 } } }
      ] },
      d: { who: 'chien', text: 'Il irait raconter partout que c\'est nul. Ça ne règle rien. Il faut surtout que quelqu\'un lui pose des limites... ou en parle à un adulte.', next: 'e' },
      e: { who: 'chien', text: 'Moi, je reste avec l\'agneau. Promis.', do: { flag: 'info_chien' } }
    } },

    { idle: true, if: { phase: 'enquete' }, lines: ['Ouvre l\'œil, Coq.', 'Le Renard fait rire tout le monde. Mais pas tout le monde rit.'] },
    { idle: true, lines: ['On est une équipe, toi et moi.', 'Je garde un œil sur l\'agneau.'] }
  ],

  /* =================== 🦉 MADAME CHOUETTE (adulte) =================== */
  chouette: [
    { id: 'chouette_1', start: 'a', nodes: {
      a: { who: 'chouette', text: 'Bonjour, Coq. Toujours le premier levé, hein ?', next: 'b' },
      b: { who: 'chouette', text: 'Je prépare les activités de la semaine. Si quelque chose te tracasse, tu peux venir m\'en parler.', choices: [
        { text: 'Merci, Madame Chouette.', next: null },
        { text: 'Vous trouvez que l\'ambiance a changé ?', next: 'c' }
      ] },
      c: { who: 'chouette', text: 'J\'ai remarqué que certains ne s\'inscrivent plus du tout aux activités. L\'agneau, par exemple. Ça m\'inquiète un peu.', do: { clue: 'c_chouette' } }
    } },

    { id: 'chouette_2', if: { phase: 'enquete', minClues: 6, notFlag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Madame Chouette... je crois qu\'il se passe quelque chose avec l\'agneau.', next: 'b' },
      b: { who: 'chouette', text: 'Je t\'écoute. Qu\'as-tu remarqué ?', choices: [
        { text: 'Plusieurs petites choses : des moqueries, une fausse invitation, des affaires cachées...', next: 'c', do: { flag: 'adult_informed', add: { reaction: 2 } } },
        { text: 'Je préfère d\'abord en être sûr.', next: 'd' }
      ] },
      c: { who: 'chouette', text: 'Merci de m\'en parler. Ce n\'est pas « rapporter » : c\'est protéger quelqu\'un.', next: 'c2' },
      c2: { who: 'chouette', text: 'Continue d\'observer. De mon côté, je vais garder un œil sur la cour.' },
      d: { who: 'chouette', text: 'C\'est sage de vérifier. Mais n\'attends pas trop : si ça devient grave, viens me voir.' }
    } },

    { id: 'chouette_r', if: { phase: 'reintegration', notFlag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'coq', text: 'Madame Chouette, j\'ai compris ce qui arrive à l\'agneau. Le renard l\'isole depuis des semaines, et d\'autres suivent.', next: 'b' },
      b: { who: 'chouette', text: 'Merci d\'être venu. Tu as bien fait : le harcèlement, c\'est sérieux, même quand ça ressemble à des « blagues ».', do: { flags: ['adult_informed', 'chouette_presente'], add: { reaction: 2, group_cohesion: 1 } }, next: 'c' },
      c: { who: 'chouette', text: 'Je vais parler au renard, calmement. Et je serai présente pendant votre activité.' }
    } },
    { id: 'chouette_r2', if: { phase: 'reintegration', flag: 'adult_informed' }, start: 'a', nodes: {
      a: { who: 'chouette', text: 'Merci encore de m\'avoir prévenue, Coq. Je parlerai au renard, et je passerai pendant votre activité.', do: { flag: 'chouette_presente' } }
    } },

    { idle: true, lines: ['Les inscriptions aux activités sont sur le panneau.', 'N\'hésite jamais à demander de l\'aide, Coq.'] }
  ]
};
