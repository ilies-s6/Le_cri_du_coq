/* 📖 Carnet d'enquête : élèves, indices, témoignages, relations, hypothèses. */
(function (C) {
  var tab = 'persos', selChar = null, dayFilter = 0;
  function E(t, c, h) { return C.UI.el(t, c, h); }
  function slotLabel(i) { var s = C.EP.config.timeline[i]; return s ? s.dayName + ' · ' + s.title.toLowerCase() : ''; }

  function attitude(ch) {
    if (!ch.trustVar) return null;
    var v = C.S.vars[ch.trustVar] || 0;
    if (v <= -2) return { t: 'Méfiant·e', c: 'bad' };
    if (v <= 0) return { t: 'Réservé·e', c: 'mid' };
    if (v <= 2) return { t: 'Plutôt à l\'aise', c: 'ok' };
    return { t: 'En confiance', c: 'good' };
  }
  function relStyle(v) {
    if (v >= 2) return { cls: 'r-ami', label: 'Très proches', col: '#2bb39a', w: 4, dash: '' };
    if (v >= 1) return { cls: 'r-proche', label: 'Proches', col: '#59c49a', w: 2.5, dash: '' };
    if (v >= 0) return { cls: 'r-neutre', label: 'Pas vraiment liés', col: '#9aa3b5', w: 1.5, dash: '5 5' };
    if (v >= -1) return { cls: 'r-distance', label: 'S\'éloignent', col: '#f2a541', w: 2, dash: '7 4' };
    return { cls: 'r-tension', label: 'Tension', col: '#e5534b', w: 3, dash: '' };
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
      if (C.Tutorial) C.Tutorial.event('notebook');
    },
    close: function () { C.UI.close('notebook'); C.Audio.play('close'); },
    toggle: function () { if (C.UI.isOpen('notebook')) this.close(); else if (!C.UI.busy()) this.open(); },

    render: function () {
      var S = C.S, ep = C.EP, cfg = ep.config;
      document.querySelectorAll('#notebook .nb-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === tab); });
      C.UI.$('nb-objective').textContent = C.UI.$('hud-objective').textContent;
      var body = C.UI.$('nb-body');
      body.innerHTML = '';
      body.scrollTop = 0;
      if (tab === 'persos') this.renderChars(body);
      else if (tab === 'indices') this.renderClues(body);
      else if (tab === 'temoins') this.renderTesti(body);
      else if (tab === 'liens') this.renderRel(body);
      else this.renderHyp(body);
      var foot = C.UI.$('nb-foot');
      foot.innerHTML = '';
      if (S.phase === 'enquete') {
        var need = cfg.minCluesToSolve - S.vars.clues_found;
        var timeOk = C.check(cfg.solveIf);
        var b = E('button', 'btn btn-solve', '🔎 Tirer mes conclusions');
        if (need > 0 || !timeOk) {
          b.disabled = true;
          foot.appendChild(b);
          var why = [];
          if (need > 0) why.push('il te faut encore ' + need + ' indice' + (need > 1 ? 's' : ''));
          if (!timeOk) why.push(cfg.solveWait || 'observe encore un peu, sur plusieurs jours');
          foot.appendChild(E('span', 'nb-foot-note', 'Pas encore : ' + why.join(', et ') + '.'));
        } else {
          S.flags._solve_seen = true;
          b.addEventListener('click', function () { C.Notebook.close(); C.Deduction.open(); });
          foot.appendChild(b);
          foot.appendChild(E('span', 'nb-foot-note', 'Tu peux conclure… ou continuer à observer pour être plus sûr.'));
        }
      } else {
        foot.appendChild(E('span', 'nb-foot-note solved', '✔ Tu as compris la situation. Place à l\'action.'));
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
        C.Sprites.portrait(cv, ch, { unknown: !known, mood: ch.player ? null : C.NPC.moodOf(ch.id) });
        it.appendChild(cv);
        it.appendChild(E('span', '', known ? ch.name : '???'));
        it.addEventListener('click', function () { selChar = ch.id; C.Audio.play('select'); C.Notebook.render(); });
        list.appendChild(it);
      });
      wrap.appendChild(list);

      var ch = ep.charactersById[selChar];
      var sheet = E('div', 'nb-sheet');
      var known = ch.player || S.met[ch.id];
      var head = E('div', 'nb-sheet-head');
      var cv = document.createElement('canvas'); cv.width = 128; cv.height = 128;
      C.Sprites.portrait(cv, ch, { unknown: !known, mood: ch.player ? null : C.NPC.moodOf(ch.id) });
      head.appendChild(cv);
      var info = E('div', 'nb-sheet-info');
      info.appendChild(E('h3', '', known ? ch.name + ' <small>' + ch.emoji + ' ' + (ch.speciesName || '') + '</small>' : 'Élève inconnu'));
      if (ch.sheet && ch.sheet.subtitle && known) info.appendChild(E('div', 'nb-sub', ch.sheet.subtitle));
      var hypRole = null;
      ep.config.roles.forEach(function (r) { if (S.hyp[r.key] === ch.id) hypRole = (hypRole ? hypRole + ', ' : '') + r.label; });
      if (!ch.player && ep.config.suspects.indexOf(ch.id) >= 0) info.appendChild(E('div', 'nb-hyp', 'Ton hypothèse : <b>' + (hypRole || '—') + '</b>'));
      var att = known && attitude(ch);
      if (att) info.appendChild(E('div', 'nb-att ' + att.c, 'Avec toi : <b>' + att.t + '</b>'));
      head.appendChild(info);
      sheet.appendChild(head);

      var facts = ((ch.sheet && ch.sheet.facts) || []).filter(function (f) { return C.check(f.if); });
      var ul = E('ul', 'nb-facts');
      if (!known || !facts.length) ul.appendChild(E('li', 'empty', 'Pas encore d\'informations.'));
      else facts.forEach(function (f) { ul.appendChild(E('li', '', C.fmt(C.text(f.text)))); });
      sheet.appendChild(ul);

      if (!ch.player) {
        var linked = S.clueOrder.map(function (id) { return ep.cluesById[id]; }).filter(function (c) { return (c.about || []).indexOf(ch.id) >= 0; });
        if (linked.length) {
          sheet.appendChild(E('div', 'nb-linked-title', 'Indices qui le ou la concernent'));
          var lk = E('div', 'nb-linked');
          linked.forEach(function (c) { lk.appendChild(E('span', 'chip', c.title)); });
          sheet.appendChild(lk);
        }
      }
      wrap.appendChild(sheet);
      body.appendChild(wrap);
    },

    renderClues: function (body) {
      var S = C.S, ep = C.EP, self = this;
      var days = [];
      ep.config.timeline.forEach(function (s) { if (days.indexOf(s.dayName) < 0 && S.clueOrder.some(function (id) { var cs = ep.config.timeline[S.clueSlot[id] || 0]; return cs && cs.dayName === s.dayName; })) days.push(s.dayName); });
      if (days.length > 1) {
        var fl = E('div', 'nb-filter');
        ['Tous'].concat(days).forEach(function (d, i) {
          var b = E('button', 'chip-btn' + (dayFilter === i ? ' active' : ''), d);
          b.addEventListener('click', function () { dayFilter = i; self.render(); });
          fl.appendChild(b);
        });
        body.appendChild(fl);
      }
      var grid = E('div', 'nb-clues');
      if (!S.clueOrder.length) grid.appendChild(E('p', 'nb-empty', 'Aucun indice pour l\'instant. Explore le collège, examine ce qui brille ✦, écoute ce qui se dit… et regarde ton téléphone.'));
      var wanted = dayFilter ? days[dayFilter - 1] : null;
      S.clueOrder.slice().reverse().forEach(function (id) {
        var c = ep.cluesById[id];
        var sl = ep.config.timeline[S.clueSlot[id] || 0];
        if (wanted && sl.dayName !== wanted) return;
        var card = E('div', 'clue-card' + (c.online ? ' online' : ''));
        card.appendChild(E('div', 'clue-num', '#' + S.clues[id]));
        card.appendChild(E('div', 'clue-title', (c.online ? '📱 ' : '') + c.title));
        card.appendChild(E('div', 'clue-text', C.fmt(c.text)));
        card.appendChild(E('div', 'clue-place', '📍 ' + c.place + ' · 🕒 ' + slotLabel(S.clueSlot[id] || 0)));
        grid.appendChild(card);
      });
      var missing = ep.clues.length - S.clueOrder.length;
      if (missing > 0 && !wanted) {
        var m = E('div', 'clue-card missing');
        m.appendChild(E('div', 'clue-title', '? ? ?'));
        m.appendChild(E('div', 'clue-text', 'D\'autres indices existent sûrement, au collège ou en ligne. Tous ne sont pas indispensables.'));
        grid.appendChild(m);
      }
      body.appendChild(grid);
    },

    renderTesti: function (body) {
      var S = C.S, ep = C.EP;
      body.appendChild(E('p', 'nb-intro', 'Ce que chacun t\'a dit. Compare les versions : qui minimise ? qui hésite ? qui répète la même chose ?'));
      if (!S.testi.length) { body.appendChild(E('p', 'nb-empty', 'Personne ne t\'a encore rien confié d\'important.')); return; }
      var by = {};
      S.testi.forEach(function (t) { (by[t.who] = by[t.who] || []).push(t); });
      var grid = E('div', 'nb-testi');
      Object.keys(by).forEach(function (id) {
        var ch = ep.charactersById[id];
        var card = E('div', 'testi-card');
        var hd = E('div', 'testi-head');
        var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
        C.Sprites.portrait(cv, ch);
        hd.appendChild(cv);
        hd.appendChild(E('b', '', ch.name));
        card.appendChild(hd);
        by[id].forEach(function (t) {
          card.appendChild(E('div', 'testi-line', '<q>' + C.fmt(t.text) + '</q><span>' + slotLabel(t.slot) + '</span>'));
        });
        grid.appendChild(card);
      });
      body.appendChild(grid);
    },

    renderRel: function (body) {
      var S = C.S, ep = C.EP, cfg = ep.config;
      body.appendChild(E('p', 'nb-intro', 'Les liens que tu as remarqués entre les élèves. Ils changent avec le temps… et avec ce que tu fais.'));
      var ids = cfg.relationNodes || cfg.suspects;
      var W = 520, H = 360, cx = W / 2, cy = H / 2 + 6, R = 140;
      var pos = {};
      pos[cfg.player] = [cx, cy];
      ids.forEach(function (id, i) { var a = -Math.PI / 2 + i / ids.length * Math.PI * 2; pos[id] = [cx + Math.cos(a) * R * 1.35, cy + Math.sin(a) * R]; });
      var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="rel-svg">';
      var shown = [];
      (cfg.relationsView || []).forEach(function (r) {
        if (!C.check(r.if) || !pos[r.a] || !pos[r.b]) return;
        var v = C.rel(r.a, r.b), st = relStyle(v);
        shown.push({ r: r, v: v, st: st });
        var A = pos[r.a], B = pos[r.b];
        svg += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + st.col + '" stroke-width="' + st.w + '" stroke-dasharray="' + st.dash + '" stroke-linecap="round"/>';
      });
      // liens avec toi (confiance)
      ids.forEach(function (id) {
        var ch = ep.charactersById[id];
        if (!ch.trustVar || !S.met[id]) return;
        var v = S.vars[ch.trustVar] || 0, st = relStyle(v >= 3 ? 2 : v >= 1 ? 1 : v <= -2 ? -2 : v < 0 ? -1 : 0);
        svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + pos[id][0] + '" y2="' + pos[id][1] + '" stroke="' + st.col + '" stroke-width="1.5" stroke-dasharray="2 5" opacity=".75"/>';
      });
      svg += '</svg>';
      var graph = E('div', 'rel-graph', svg);
      [cfg.player].concat(ids).forEach(function (id) {
        var ch = ep.charactersById[id];
        var n = E('div', 'rel-node' + (id === cfg.player ? ' me' : ''));
        n.style.left = (pos[id][0] / W * 100) + '%'; n.style.top = (pos[id][1] / H * 100) + '%';
        var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
        C.Sprites.portrait(cv, ch, { mood: id === cfg.player ? null : C.NPC.moodOf(id) });
        n.appendChild(cv);
        n.appendChild(E('span', '', id === cfg.player ? 'Toi' : ch.short || ch.name));
        graph.appendChild(n);
      });
      body.appendChild(graph);
      var leg = E('div', 'rel-legend');
      [2, 1, 0, -1, -2].forEach(function (v) { var st = relStyle(v); leg.appendChild(E('span', '', '<i style="border-top:3px ' + (st.dash ? 'dashed' : 'solid') + ' ' + st.col + '"></i>' + st.label)); });
      leg.appendChild(E('span', '', '<i style="border-top:2px dotted #9aa3b5"></i>Avec toi'));
      body.appendChild(leg);
      var notes = E('ul', 'rel-notes');
      shown.forEach(function (x) {
        var note = (x.r.notes || []).filter(function (n) { return C.check(n.if); })[0];
        notes.appendChild(E('li', '', '<b>' + ep.charactersById[x.r.a].short + ' & ' + ep.charactersById[x.r.b].short + '</b> <em class="' + x.st.cls + '">' + x.st.label + '</em>' + (note ? ' — ' + C.fmt(note.text) : '')));
      });
      if (!shown.length) notes.appendChild(E('li', 'empty', 'Observe les élèves pour comprendre qui est proche de qui.'));
      body.appendChild(notes);
    },

    renderHyp: function (body) {
      var S = C.S, ep = C.EP;
      var box = E('div', 'nb-hyps');
      box.appendChild(E('p', 'nb-intro', 'Note ici ce que tu penses. Rien n\'est vérifié : c\'est ton espace de réflexion.'));
      ep.config.roles.forEach(function (r) {
        var row = E('div', 'hyp-row');
        row.appendChild(E('div', 'hyp-label', '<b>' + r.label + '</b><span>' + r.question + '</span>'));
        var opts = E('div', 'hyp-opts');
        ep.config.suspects.forEach(function (id) {
          var ch = ep.charactersById[id];
          var known = S.met[id];
          var b = E('button', 'hyp-opt' + (S.hyp[r.key] === id ? ' active' : ''));
          var cv = document.createElement('canvas'); cv.width = 48; cv.height = 48;
          C.Sprites.portrait(cv, ch, { unknown: !known });
          b.appendChild(cv);
          b.appendChild(E('span', '', known ? (ch.short || ch.name) : '?'));
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
      notes.appendChild(E('div', 'hyp-label', '<b>Mes notes</b><span>Qu\'est-ce qui se répète ? Qui a vu quoi ? Qui pourrait aider ?</span>'));
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
