/* 📖 Carnet d'enquête : personnages, indices, hypothèses. */
(function (C) {
  var tab = 'persos', selChar = null;
  function E(t, c, h) { return C.UI.el(t, c, h); }

  function attitude(ch) {
    if (!ch.trustVar) return null;
    var v = C.S.vars[ch.trustVar] || 0;
    if (v <= -2) return { t: 'Méfiant', c: 'bad' };
    if (v <= 0) return { t: 'Réservé', c: 'mid' };
    if (v <= 2) return { t: 'Plutôt à l\'aise', c: 'ok' };
    return { t: 'En confiance', c: 'good' };
  }

  C.Notebook = {
    init: function () {
      var nb = C.UI.$('notebook');
      nb.querySelectorAll('.nb-tab').forEach(function (b) {
        b.addEventListener('click', function () { tab = b.dataset.tab; C.Audio.play('select'); C.Notebook.render(); });
      });
      C.UI.$('nb-close').addEventListener('click', function () { C.Notebook.close(); });
      nb.addEventListener('click', function (e) { if (e.target === nb) C.Notebook.close(); });
    },
    open: function (t) {
      if (t) tab = t;
      C.UI.open('notebook');
      C.Audio.play('open');
      this.render();
    },
    close: function () { C.UI.close('notebook'); C.Audio.play('close'); },
    toggle: function () { if (C.UI.isOpen('notebook')) this.close(); else if (!C.UI.busy()) this.open(); },

    render: function () {
      var S = C.S, ep = C.EP;
      document.querySelectorAll('#notebook .nb-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
      C.UI.$('nb-objective').textContent = C.UI.$('hud-objective').textContent;
      var body = C.UI.$('nb-body');
      body.innerHTML = '';
      if (tab === 'persos') this.renderChars(body);
      else if (tab === 'indices') this.renderClues(body);
      else this.renderHyp(body);
      // Bouton « Résoudre l'enquête »
      var foot = C.UI.$('nb-foot');
      foot.innerHTML = '';
      if (S.phase === 'enquete') {
        var need = ep.config.minCluesToSolve - S.vars.clues_found;
        var b = E('button', 'btn btn-solve', '🔎 Résoudre l\'enquête');
        if (need > 0) {
          b.disabled = true;
          foot.appendChild(b);
          foot.appendChild(E('span', 'nb-foot-note', 'Il te faut encore ' + need + ' indice' + (need > 1 ? 's' : '') + ' avant de pouvoir conclure.'));
        } else {
          S.flags._solve_seen = true;
          b.addEventListener('click', function () { C.Notebook.close(); C.Deduction.open(); });
          foot.appendChild(b);
          foot.appendChild(E('span', 'nb-foot-note', 'Tu peux tenter de conclure… ou continuer à chercher pour être plus sûr.'));
        }
      } else {
        foot.appendChild(E('span', 'nb-foot-note solved', '✔ Enquête résolue. Place à l\'action !'));
      }
    },

    renderChars: function (body) {
      var S = C.S, ep = C.EP;
      var wrap = E('div', 'nb-chars');
      var list = E('div', 'nb-charlist');
      if (!selChar) selChar = ep.config.player;
      ep.characters.forEach(function (ch) {
        if (ch.notInNotebook) return;
        var known = ch.player || S.met[ch.id];
        var it = E('button', 'nb-charbtn' + (selChar === ch.id ? ' active' : ''));
        var cv = document.createElement('canvas'); cv.width = 72; cv.height = 72;
        C.Sprites.portrait(cv, ch, { unknown: !known });
        it.appendChild(cv);
        it.appendChild(E('span', '', known ? ch.emoji + ' ' + ch.name : '???'));
        it.addEventListener('click', function () { selChar = ch.id; C.Audio.play('select'); C.Notebook.render(); });
        list.appendChild(it);
      });
      wrap.appendChild(list);

      var ch = ep.charactersById[selChar];
      var sheet = E('div', 'nb-sheet');
      var known = ch.player || S.met[ch.id];
      var head = E('div', 'nb-sheet-head');
      var cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
      C.Sprites.portrait(cv, ch, { unknown: !known });
      head.appendChild(cv);
      var info = E('div', 'nb-sheet-info');
      info.appendChild(E('h3', '', known ? ch.emoji + ' ' + ch.name : 'Personnage inconnu'));
      if (ch.sheet && ch.sheet.subtitle && known) info.appendChild(E('div', 'nb-sub', ch.sheet.subtitle));
      var hypRole = null;
      ep.config.roles.forEach(function (r) { if (S.hyp[r.key] === ch.id) hypRole = (hypRole ? hypRole + ', ' : '') + r.label; });
      if (!ch.player) info.appendChild(E('div', 'nb-hyp', 'Ton hypothèse : <b>' + (hypRole || '—') + '</b>'));
      var att = known && attitude(ch);
      if (att) info.appendChild(E('div', 'nb-att ' + att.c, 'Attitude envers toi : <b>' + att.t + '</b>'));
      head.appendChild(info);
      sheet.appendChild(head);

      var facts = ((ch.sheet && ch.sheet.facts) || []).filter(function (f) { return C.check(f.if); });
      var ul = E('ul', 'nb-facts');
      if (!known || !facts.length) ul.appendChild(E('li', 'empty', 'Informations insuffisantes'));
      else facts.forEach(function (f) { ul.appendChild(E('li', '', C.fmt(C.text(f.text)))); });
      sheet.appendChild(ul);

      if (!ch.player) {
        var linked = S.clueOrder.map(function (id) { return ep.cluesById[id]; }).filter(function (c) {
          return (c.about || []).indexOf(ch.id) >= 0;
        });
        if (linked.length) {
          sheet.appendChild(E('div', 'nb-linked-title', 'Indices qui le concernent'));
          var lk = E('div', 'nb-linked');
          linked.forEach(function (c) { lk.appendChild(E('span', 'chip', c.title)); });
          sheet.appendChild(lk);
        }
      }
      wrap.appendChild(sheet);
      body.appendChild(wrap);
    },

    renderClues: function (body) {
      var S = C.S, ep = C.EP;
      var grid = E('div', 'nb-clues');
      if (!S.clueOrder.length) grid.appendChild(E('p', 'nb-empty', 'Aucun indice pour l\'instant. Explore la ferme, examine les objets qui scintillent ✦ et écoute ce qui se dit.'));
      S.clueOrder.slice().reverse().forEach(function (id) {
        var c = ep.cluesById[id];
        var card = E('div', 'clue-card');
        card.appendChild(E('div', 'clue-num', '#' + S.clues[id]));
        card.appendChild(E('div', 'clue-title', c.title));
        card.appendChild(E('div', 'clue-text', C.fmt(c.text)));
        card.appendChild(E('div', 'clue-place', '📍 ' + c.place));
        grid.appendChild(card);
      });
      var missing = ep.clues.length - S.clueOrder.length;
      if (missing > 0) {
        var m = E('div', 'clue-card missing');
        m.appendChild(E('div', 'clue-title', '? ? ?'));
        m.appendChild(E('div', 'clue-text', missing + ' indice' + (missing > 1 ? 's' : '') + ' encore caché' + (missing > 1 ? 's' : '') + ' dans la ferme. Tous ne sont pas indispensables.'));
        grid.appendChild(m);
      }
      body.appendChild(grid);
    },

    renderHyp: function (body) {
      var S = C.S, ep = C.EP;
      var box = E('div', 'nb-hyps');
      box.appendChild(E('p', 'nb-hyp-intro', 'Note ici ce que tu penses. Rien n\'est vérifié : c\'est ton espace de réflexion.'));
      ep.config.roles.forEach(function (r) {
        var row = E('div', 'hyp-row');
        row.appendChild(E('div', 'hyp-label', '<b>' + r.label + '</b><span>' + r.question + '</span>'));
        var opts = E('div', 'hyp-opts');
        ep.config.suspects.forEach(function (id) {
          var ch = ep.charactersById[id];
          var known = S.met[id];
          var b = E('button', 'hyp-opt' + (S.hyp[r.key] === id ? ' active' : ''), known ? ch.emoji : '?');
          b.title = known ? ch.name : 'Pas encore rencontré';
          if (!known) b.disabled = true;
          b.addEventListener('click', function () {
            S.hyp[r.key] = S.hyp[r.key] === id ? null : id;
            C.Audio.play('select');
            C.Notebook.render();
          });
          opts.appendChild(b);
        });
        row.appendChild(opts);
        box.appendChild(row);
      });
      var notes = E('div', 'hyp-notes');
      notes.appendChild(E('div', 'hyp-label', '<b>Mes notes</b><span>Pourquoi la victime est-elle isolée ? Qu\'est-ce qui se répète ?</span>'));
      var ta = document.createElement('textarea');
      ta.value = S.notes || '';
      ta.placeholder = 'Écris tes idées ici...';
      ta.addEventListener('input', function () { S.notes = ta.value; });
      notes.appendChild(ta);
      box.appendChild(notes);
      body.appendChild(box);
    }
  };
})(window.CDC);
