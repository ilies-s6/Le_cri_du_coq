/* =========================================================
   TÉLÉPHONE — Épisode 1 (tout est fictif)
   ---------------------------------------------------------
   « Piaf » est une messagerie inventée pour le jeu.
   threads : conversations. Chacune :
     id, name (ou who = personnage), icon, group (conversation de groupe), sub (sous-titre)
     if : condition pour que la conversation apparaisse
     messages : liste de messages, affichés dans l'ordre :
       { id, from, text, time, if }                    message simple
       { photo: { bg, who, mood, sticker, x, scale } }  « photo » dessinée par le jeu
       { sys: true, text }                              information du système
       deletedIf / deletedText                          message supprimé
       seenBy / reacts                                  « vu par… », réactions
       actions : boutons sous le message { id, label, doneLabel, do, capture, excl, feedback }
       { id, reply: 'r_id', prompt, options: [{ text, say, icon, silent, note, do, if }] }
         → le joueur choisit sa réponse. Les messages suivants attendent ce choix.
         Dans les conditions : { reply: { r_id: index } } et { act: 'message:action' }.
   ========================================================= */
(function () {
  var T = {
    cap: { id: 'cap', label: '📸 Garder une trace', doneLabel: 'Capture gardée', capture: true, do: { flag: 'capture_photo', add: { reaction: 1 } },
      feedback: '<div class="t-kicker">📸 Capture</div><div class="t-sub">Gardée dans ton téléphone, pour pouvoir la montrer à un adulte. Ne la repartage jamais.</div>' },
    sig: { id: 'sig', label: '🚩 Signaler', doneLabel: 'Signalé', do: { flag: 'signale', add: { reaction: 1 } },
      feedback: '<div class="t-kicker">🚩 Signalé</div><div class="t-sub">La modération de Piaf va examiner le message. Signaler, c\'est utile. En parler à un adulte, c\'est encore mieux.</div>' },
    fwd: { id: 'fwd', label: '↪ Transférer', doneLabel: 'Transféré', excl: ['nofwd'], do: { flag: 'relaye', add: { reaction: -3 }, rel: { 'agneau|renard': -1 } },
      feedback: '<div class="t-kicker">↪ Transféré</div><div class="t-sub">La photo circule encore plus loin… Chaque partage blesse un peu plus.</div>' },
    nofwd: { id: 'nofwd', label: '🙅 Ne pas relayer', doneLabel: 'Tu ne la fais pas circuler', excl: ['fwd'], do: { flag: 'pas_relaye', add: { reaction: 1 } },
      feedback: '<div class="t-kicker">🙅 Pas de partage</div><div class="t-sub">Tu choisis de ne pas faire circuler la photo. Ne pas relayer, c\'est déjà protéger.</div>' }
  };
  var CLUES_SOIR = ['c_retire', 'c_vus'];

  CDC.ep('ep1').phone = {
    threads: [
      /* ---------------- Le groupe de la classe ---------------- */
      { id: 'classe', name: '5e B 🐓 la classe', icon: '👥', group: true, sub: '28 membres', if: { minSlot: 'l_soir' }, messages: [
        { id: 'k1', from: 'cochon', time: '20:58', text: 'trop calme ce groupe 😴' },
        { id: 'k2', from: 'renard', time: '21:02', text: 'attendez jvous ai gardé le meilleur pour la fin' },
        { id: 'k3', from: 'renard', time: '21:03', text: 'samedi au skatepark 😂😂 il a attendu 2h',
          photo: { bg: 'parc', who: 'agneau', mood: 'sad', sticker: 'LE SEUL INVITÉ 🎉', x: 0.36 },
          seenBy: 'Inès, Sami et 21 autres', reacts: '😂 4 · 💀 2',
          deletedIf: { reply: { r_photo: 2 } }, deletedText: 'Maxence a supprimé cette photo.',
          actions: [T.cap, T.sig, T.nofwd, T.fwd] },
        { id: 'k4', from: 'jade', time: '21:04', text: '💀💀 nooon il est vraiment venu ??' },
        { id: 'k5', from: 'cochon', time: '21:04', text: 'jte jure 😂' },
        { id: 'k6', from: 'sami', time: '21:05', text: 'c\'est pas un peu abusé ?', deletedIf: {}, deletedText: 'Sami a supprimé ce message.' },
        { id: 'r_photo', reply: 'r_photo', prompt: 'Tout le monde a vu la photo. Presque personne ne dit rien… Et toi ?', options: [
          { text: '😂', say: '😂', do: { flag: 'rire_ligne', add: { reaction: -2, trust_agneau: -1 }, clue: 'c_photo_volee' } },
          { text: 'Ne rien écrire', icon: '🤐', silent: true, note: 'Tu ne réponds rien. Comme 22 autres personnes.', do: { flag: 'silence_ligne', clue: 'c_photo_volee' } },
          { text: 'c\'est pas drôle. supprime ça.', icon: '✋', say: 'c\'est pas drôle. supprime ça.', do: { flag: 'stop_ligne', add: { reaction: 2, trust_renard: -1 }, rel: { 'chien|coq': 1 }, clue: 'c_photo_volee' } }
        ] },
        { id: 'k7', from: 'chien', time: '21:06', text: 'maxence supprime ça. c\'est vraiment pas drôle.' },
        { id: 'k8a', from: 'renard', time: '21:07', if: { reply: { r_photo: 2 } }, text: 'ohlala la police 🚨 c\'était pour RIRE' },
        { id: 'k8b', from: 'renard', time: '21:07', if: { not: { reply: { r_photo: 2 } } }, text: 'nina toujours là pour casser l\'ambiance 🙄' },
        { id: 'k9a', from: 'jade', time: '21:08', if: { any: [{ reply: { r_photo: 2 } }, { act: 'k3:sig' }] }, text: 'bon… c\'est vrai que c\'est abusé. supprime maxence' },
        { id: 'k9b', from: 'jade', time: '21:08', if: { not: { any: [{ reply: { r_photo: 2 } }, { act: 'k3:sig' }] } }, text: '😂😂' },
        { id: 'k10', sys: true, if: { reply: { r_photo: 2 } }, text: 'Maxence a supprimé une photo.' },
        { id: 'k11', sys: true, text: 'Maxence a retiré Milo du groupe.' },
        { id: 'r_retire', reply: 'r_retire', prompt: 'Milo n\'est plus dans le groupe. Que fais-tu maintenant ?', options: [
          { text: 'Écrire à Milo pour le soutenir', icon: '💬', silent: true, note: 'Tu ouvres une conversation privée avec Milo.', if: { notFlag: 'ecrit_milo' },
            do: { flag: 'ecrit_milo', add: { trust_agneau: 1, reaction: 1 }, clues: CLUES_SOIR } },
          { text: 'Prévenir Mme Chouette (messagerie du collège)', icon: '🏫', silent: true, note: 'Tu écris à Mme Chouette sur la messagerie du collège.', if: { notFlag: 'alerte_ent' },
            do: { flags: ['alerte_ent', 'adult_informed'], add: { reaction: 2 }, clues: CLUES_SOIR } },
          { text: 'Ne rien faire, ça ne me regarde pas', icon: '🙈', silent: true, note: 'Tu poses ton téléphone. Les messages continuent sans toi.',
            do: { flag: 'rien_soir', add: { reaction: -1 }, clues: CLUES_SOIR } }
        ] },
        { id: 'k12', sys: true, if: { not: { reply: { r_retire: 2 } } }, text: '💡 Tes autres conversations sont dans la liste (‹ en haut à gauche).' },
        /* Mardi, récréation : la rumeur */
        { id: 'k20', from: 'theo', time: '10:02', if: { minSlot: 'm_recre', min: { rumeur: 2 } }, text: 'il paraît que milo a pleuré en SVT 😭 c maxence qui l\'a dit', reacts: '😮 3',
          actions: [T.sig] },
        { id: 'k21', from: 'chien', time: '10:03', if: { minSlot: 'm_recre', min: { rumeur: 2 } }, text: 'ARRÊTEZ avec ça. c\'est faux et c\'est méchant.' },
        { id: 'r_rumeur', reply: 'r_rumeur', if: { minSlot: 'm_recre', min: { rumeur: 2 } }, prompt: 'La rumeur continue de tourner…', options: [
          { text: 'stop. personne a vu ça, arrêtez de le répéter.', icon: '✋', say: 'stop. personne a vu ça, arrêtez de le répéter.', do: { add: { reaction: 1, rumeur: -1 }, clue: 'c_rumeur' } },
          { text: 'Ne pas répondre, ne pas relayer', icon: '🤐', silent: true, note: 'Tu ne fais pas circuler la rumeur.', do: { clue: 'c_rumeur' } },
          { text: 'mdr', say: 'mdr', do: { add: { reaction: -2, rumeur: 1 }, clue: 'c_rumeur' } }
        ] }
      ] },

      /* ---------------- Milo ---------------- */
      { id: 'milo', who: 'agneau', sub: 'en ligne il y a 2 h', if: { minSlot: 'l_soir' }, messages: [
        { id: 'm0', from: 'agneau', time: 'ven. 17:40', text: 'tu sais si c\'est toujours samedi l\'anniv de jade ?' },
        { id: 'm0b', from: 'coq', time: 'ven. 17:52', text: 'aucune idée, jsuis pas invité 😅' },
        { id: 'm1', from: 'coq', if: { flag: 'ecrit_milo', not: { reply: { r_milo: [0, 1] } } }, time: '21:12', text: 'hé. j\'ai vu le groupe. c\'est nul ce qu\'ils ont fait. t\'es pas tout seul.' },
        { id: 'r_milo', reply: 'r_milo', if: { any: [{ notFlag: 'ecrit_milo' }, { reply: { r_milo: [0, 1] } }] }, prompt: 'Écrire à Milo ?', options: [
          { text: 'hé. j\'ai vu le groupe. c\'est nul ce qu\'ils ont fait. t\'es pas tout seul.', say: 'hé. j\'ai vu le groupe. c\'est nul ce qu\'ils ont fait. t\'es pas tout seul.',
            do: { flag: 'ecrit_milo', add: { trust_agneau: 1, reaction: 1 } } },
          { text: 'ça va ?', say: 'ça va ?', do: { flag: 'ecrit_milo' } }
        ] },
        { id: 'm2', from: 'agneau', if: { flag: 'ecrit_milo' }, time: '21:31', text: '…' },
        { id: 'm3', from: 'agneau', if: { flag: 'ecrit_milo' }, time: '21:33', text: 'merci. c\'est gentil.' },
        { id: 'm4', from: 'agneau', if: { flag: 'ecrit_milo', reply: { r_milo: 1 } }, time: '21:34', text: 'pas trop. mais ça ira.' },
        { id: 'm5', from: 'agneau', if: { flag: 'ecrit_milo', minSlot: 'm_matin' }, time: '7:31', text: 'je crois que je vais rester au CDI ce matin. j\'ai pas envie de passer devant les casiers.' },
        { id: 'r_milo2', reply: 'r_milo2', if: { flag: 'ecrit_milo', minSlot: 'm_matin' }, prompt: 'Répondre à Milo', options: [
          { text: 'ok. si tu veux, on ira voir Mme Chouette ensemble.', say: 'ok. si tu veux, on ira voir Mme Chouette ensemble.', do: { flag: 'agneau_ok_adulte', add: { trust_agneau: 1, reaction: 1 } } },
          { text: 'tu devrais pas te laisser faire !', say: 'tu devrais pas te laisser faire !', do: { add: { trust_agneau: -1 } } },
          { text: 'ok. prends soin de toi.', say: 'ok. prends soin de toi.', do: { add: { trust_agneau: 1 } } }
        ] },
        { id: 'm6', from: 'agneau', if: { reply: { r_milo2: 0 } }, text: 'd\'accord. peut-être. merci noé.' },
        { id: 'm7', from: 'agneau', if: { reply: { r_milo2: 1 } }, text: 'facile à dire.' },
        { id: 'm8', from: 'agneau', if: { reply: { r_milo2: 2 } }, text: '👍' },
        { id: 'm9', from: 'agneau', if: { minSlot: 'm_fin', anyFlag: ['sami_soutien', 'jade_excuses'] }, time: '16:20',
          text: 'au fait… sami et jade m\'ont écrit aujourd\'hui. je sais pas trop quoi en penser. mais ça fait du bien.' }
      ] },

      /* ---------------- Nina ---------------- */
      { id: 'nina', who: 'chien', sub: 'en ligne', if: { minSlot: 'l_soir' }, messages: [
        { id: 'n1', from: 'chien', time: '21:09', text: 't\'as vu ce que maxence a posté ?? 😡' },
        { id: 'n2', from: 'chien', time: '21:09', text: 'ça fait des semaines que ça dure. demain je vais voir la CPE. tu viens avec moi ?' },
        { id: 'r_nina', reply: 'r_nina', prompt: 'Répondre à Nina', options: [
          { text: 'oui. on y va ensemble demain matin.', say: 'oui. on y va ensemble demain matin.', do: { flag: 'nina_cpe', add: { trust_chien: 1, reaction: 1 }, clue: 'c_soutien' } },
          { text: 'je sais pas… j\'ai pas envie d\'avoir des problèmes.', say: 'je sais pas… j\'ai pas envie d\'avoir des problèmes.', do: { clue: 'c_soutien' } },
          { text: 'c\'est pas un peu exagéré ?', say: 'c\'est pas un peu exagéré ?', do: { add: { trust_chien: -1, reaction: -1 }, clue: 'c_soutien' } }
        ] },
        { id: 'n3a', from: 'chien', if: { reply: { r_nina: 0 } }, text: 'top. 8h devant la vie scolaire 💪' },
        { id: 'n3b', from: 'chien', if: { reply: { r_nina: 1 } }, text: 'je comprends. mais si personne bouge, ça s\'arrêtera pas.' },
        { id: 'n3c', from: 'chien', if: { reply: { r_nina: 2 } }, text: 'sérieux ?? t\'as vu la photo ? il a attendu 2h tout seul.' },
        { id: 'n4', from: 'chien', if: { minSlot: 'm_matin' }, time: '8:01', text: 't\'as vu son casier ?? je suis trop en colère' },
        { id: 'n5', from: 'chien', if: { minSlot: 'm_midi', min: { rumeur: 2 } }, time: '12:10', text: 'la rumeur tourne partout. même les 4e en parlent. faut que ça s\'arrête.' }
      ] },

      /* ---------------- Messagerie du collège ---------------- */
      { id: 'ent', name: 'Messagerie du collège', icon: '🏫', sub: 'Vie scolaire · Collège des Plumes', if: { minSlot: 'l_soir' }, messages: [
        { id: 'e0', from: 'chouette', time: 'lun. 8:00', text: 'Bonjour à tous. La vie scolaire est ouverte de 7 h 45 à 17 h 30. Pour toute difficulté, n\'hésitez pas à venir nous voir.' },
        { id: 'e1', from: 'coq', if: { flag: 'alerte_ent', not: { reply: { r_ent: 0 } } }, time: '21:13',
          text: 'Bonjour Madame. Une photo de Milo circule dans le groupe de la classe pour se moquer de lui. Je crois que ça dure depuis un moment. Noé (5e B)' },
        { id: 'r_ent', reply: 'r_ent', if: { any: [{ notFlag: 'alerte_ent' }, { reply: { r_ent: 0 } }] }, prompt: 'Écrire à Mme Chouette, la CPE ?', options: [
          { text: 'Bonjour Madame. Une photo de Milo circule dans le groupe de la classe pour se moquer de lui. Je crois que ça dure depuis un moment. Noé (5e B)',
            say: 'Bonjour Madame. Une photo de Milo circule dans le groupe de la classe pour se moquer de lui. Je crois que ça dure depuis un moment. Noé (5e B)',
            do: { flags: ['alerte_ent', 'adult_informed'], add: { reaction: 2 } } }
        ] },
        { id: 'e2', sys: true, if: { flag: 'alerte_ent', slot: 'l_soir' }, text: 'Message envoyé. Il sera lu demain matin.' },
        { id: 'e3', from: 'chouette', if: { flag: 'alerte_ent', minSlot: 'm_matin' }, time: 'mar. 7:52',
          text: 'Merci Noé de m\'avoir prévenue. Tu as bien fait. Je m\'en occupe dès ce matin. Si tu as gardé une capture, viens me la montrer, mais ne la fais pas circuler.' }
      ] }
    ],

    aide: {
      html: '<h3>Tu vois ou tu vis du harcèlement ?</h3>' +
        '<ul>' +
        '<li>🙅 <b>Ne relaie pas</b> : pas de partage, pas de « 😂 ». Chaque partage blesse un peu plus.</li>' +
        '<li>📸 <b>Garde une trace</b> (capture d\'écran) pour pouvoir la montrer à un adulte. Ne la repartage jamais.</li>' +
        '<li>🚩 <b>Signale</b> le message ou le compte sur l\'application.</li>' +
        '<li>💬 <b>Soutiens la personne</b> en privé : « t\'es pas tout seul ». Ça compte énormément.</li>' +
        '<li>🏫 <b>Parles-en à un adulte de confiance</b> : CPE, prof, infirmière, parent. Ce n\'est pas « balancer », c\'est protéger.</li>' +
        '</ul>' +
        '<div class="ph-aide-num"><b>3018</b><span>Numéro national, gratuit et anonyme, contre le harcèlement et le cyberharcèlement. Par téléphone, tchat ou appli.</span></div>' +
        '<p class="ph-note">Dans le jeu, tout est inventé : les personnes, les messages et l\'application Piaf.</p>'
    }
  };
})();
