/* 🎪 Organiser une activité, conséquences, bilan final et score. */
(function (C) {
  function E(t, c, h) { return C.UI.el(t, c, h); }
  var plan = null;

  function evDef() { return C.EP.event; }

  /* Condition sur l'activité choisie (voir episodes/ep1/event.js) */
  function evCheck(c, p) {
    if (!c) return true;
    var A = evDef().activities[p.activity];
    var inv = function (id) { return !!p.invited[id]; };
    for (var k in c) {
      var v = c[k];
      switch (k) {
        case 'activity': if (C.arr(v).indexOf(p.activity) < 0) return false; break;
        case 'invited': if (!C.arr(v).every(inv)) return false; break;
        case 'notInvited': if (!C.arr(v).every(function (id) { return !inv(id); })) return false; break;
        case 'role': for (var id in v) if (!inv(id) || C.arr(v[id]).indexOf(p.roles[id]) < 0) return false; break;
        case 'notRole': for (var id2 in v) if (inv(id2) && C.arr(v[id2]).indexOf(p.roles[id2]) >= 0) return false; break;
        case 'sameTeam': if (!(A.teams && inv(v[0]) && inv(v[1]) && p.teams[v[0]] === p.teams[v[1]])) return false; break;
        case 'notSameTeam': if (A.teams && inv(v[0]) && inv(v[1]) && p.teams[v[0]] === p.teams[v[1]]) return false; break;
        case 'together': // même équipe, ou activité sans équipe
          if (!(inv(v[0]) && inv(v[1]) && (!A.teams || p.teams[v[0]] === p.teams[v[1]]))) return false; break;
        case 'competitive': if (!!A.competitive !== v) return false; break;
        case 'teams': if (!!A.teams !== v) return false; break;
        case 'minInvited': if (Object.keys(p.invited).filter(inv).length < v) return false; break;
        case 'maxInvited': if (Object.keys(p.invited).filter(inv).length > v) return false; break;
        case 'state': if (!C.check(v)) return false; break;
        case 'any': if (!v.some(function (x) { return evCheck(x, p); })) return false; break;
        case 'not': if (evCheck(v, p)) return false; break;
      }
    }
    return true;
  }

  C.Event = {
    open: function () {
      var ev = evDef();
      if (!plan) {
        plan = { activity: null, invited: {}, roles: {}, teams: {} };
        ev.participants.forEach(function (id, i) { plan.invited[id] = true; plan.roles[id] = 'participant'; plan.teams[id] = i % 2 ? 'B' : 'A'; });
      }
      C.UI.open('event');
      C.Audio.play('open');
      this.render();
    },
    close: function () { C.UI.close('event'); },

    render: function () {
      var ev = evDef(), ep = C.EP, self = this;
      var box = C.UI.$('event-card');
      box.innerHTML = '';
      var head = E('div', 'ev-head');
      head.appendChild(E('h2', '', '🎪 Organiser une activité'));
      var x = E('button', 'icon-btn', '✕'); x.addEventListener('click', function () { self.close(); });
      head.appendChild(x);
      box.appendChild(head);

      var cols = E('div', 'ev-cols');
      var main = E('div', 'ev-main');
      var side = E('div', 'ev-side');

      // 1. Activité
      main.appendChild(E('h3', '', '1. Activité'));
      var acts = E('div', 'ev-acts');
      Object.keys(ev.activities).forEach(function (k) {
        var a = ev.activities[k];
        var b = E('button', 'ev-act' + (plan.activity === k ? ' active' : ''), '<div class="ev-act-icon">' + a.icon + '</div><b>' + a.label + '</b><span>' + a.desc + '</span>');
        b.addEventListener('click', function () { plan.activity = k; C.Audio.play('select'); self.render(); });
        acts.appendChild(b);
      });
      main.appendChild(acts);

      // 2. Participants
      main.appendChild(E('h3', '', '2. Participants'));
      var parts = E('div', 'ev-parts');
      ev.participants.forEach(function (id) {
        var ch = ep.charactersById[id];
        var b = E('button', 'ev-part' + (plan.invited[id] ? ' active' : ''));
        var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
        C.Sprites.portrait(cv, ch);
        b.appendChild(cv);
        b.appendChild(E('span', '', ch.emoji + ' ' + ch.name));
        b.appendChild(E('em', '', plan.invited[id] ? 'Invité' : 'Pas invité'));
        b.addEventListener('click', function () { plan.invited[id] = !plan.invited[id]; C.Audio.play('select'); self.render(); });
        parts.appendChild(b);
      });
      main.appendChild(parts);

      // 3. Rôles (et équipes)
      var A = plan.activity && ev.activities[plan.activity];
      main.appendChild(E('h3', '', '3. Rôles' + (A && A.teams ? ' et équipes' : '')));
      var roles = E('div', 'ev-roles');
      ev.participants.forEach(function (id) {
        if (!plan.invited[id]) return;
        var ch = ep.charactersById[id];
        var row = E('div', 'ev-role-row');
        row.appendChild(E('span', 'ev-role-name', ch.emoji + ' ' + ch.name));
        var sel = document.createElement('select');
        ev.roles.forEach(function (r) {
          var o = document.createElement('option'); o.value = r.id; o.textContent = r.label;
          if (plan.roles[id] === r.id) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('change', function () { plan.roles[id] = sel.value; self.renderRoleHelp(); });
        row.appendChild(sel);
        if (A && A.teams) {
          ['A', 'B'].forEach(function (t) {
            var tb = E('button', 'ev-team t' + t + (plan.teams[id] === t ? ' active' : ''), ev.teamNames[t]);
            tb.addEventListener('click', function () { plan.teams[id] = t; C.Audio.play('select'); self.render(); });
            row.appendChild(tb);
          });
        }
        roles.appendChild(row);
      });
      if (!roles.children.length) roles.appendChild(E('p', 'ev-note', 'Invite au moins un animal.'));
      main.appendChild(roles);
      main.appendChild(E('div', 'ev-role-help', ''));

      // Colonne : ce que tu as appris
      side.appendChild(E('h3', '', '📝 Ce que tu as appris'));
      var adv = (ev.advice || []).filter(function (a) { return C.check(a.if); });
      var ul = E('ul', 'ev-advice');
      adv.forEach(function (a) { ul.appendChild(E('li', '', '<b>' + ep.charactersById[a.who].emoji + '</b> ' + a.text)); });
      side.appendChild(ul);

      cols.appendChild(main); cols.appendChild(side);
      box.appendChild(cols);

      var foot = E('div', 'ev-foot');
      var go = E('button', 'btn btn-solve', '🚀 Lancer l\'activité');
      var nInv = ev.participants.filter(function (id) { return plan.invited[id]; }).length;
      go.disabled = !plan.activity || nInv === 0;
      go.addEventListener('click', function () {
        C.UI.modal({
          icon: '🎪', title: 'Lancer l\'activité ?',
          html: '<p>Une fois lancée, tu verras comment elle se passe. Tes choix auront des conséquences.</p>',
          buttons: [{ text: 'Encore réfléchir', cls: 'btn-ghost' }, { text: 'C\'est parti !', action: function () { self.run(); } }]
        });
      });
      foot.appendChild(go);
      box.appendChild(foot);
      this.renderRoleHelp();
    },

    renderRoleHelp: function () {
      var ev = evDef();
      var h = document.querySelector('#event-card .ev-role-help');
      if (!h) return;
      h.innerHTML = ev.roles.filter(function (r) { return r.desc; }).map(function (r) { return '<span><b>' + r.label + '</b> : ' + r.desc + '</span>'; }).join('');
    },

    /* Calcul des conséquences */
    evaluate: function (p) {
      var ev = evDef();
      var res = { integ: 0, cohesion: 0, lines: [], bubbles: [], flags: [] };
      for (var i = 0; i < ev.rules.length; i++) {
        var r = ev.rules[i];
        if (!evCheck(r.if, p)) continue;
        res.integ += r.integ || 0;
        res.cohesion += r.cohesion || 0;
        if (r.text) res.lines.push({ text: r.text, tone: (r.integ || 0) + (r.cohesion || 0) > 0 ? 'good' : ((r.integ || 0) + (r.cohesion || 0) < 0 ? 'bad' : 'mid') });
        if (r.bubble) res.bubbles.push(r.bubble);
        if (r.flag) res.flags.push(r.flag);
        if (r.stop) break;
      }
      res.integ = C.clamp(Math.round(res.integ), 0, 20);
      return res;
    },

    run: function () {
      var S = C.S, ev = evDef(), self = this;
      this.close();
      var res = this.evaluate(plan);
      S.event = { plan: JSON.parse(JSON.stringify(plan)), result: res };
      S.vars.integration_score = res.integ;
      S.vars.group_cohesion += res.cohesion;
      res.flags.forEach(function (f) { S.flags[f] = true; });
      C.setPhase('evenement');

      // Petite mise en scène sur la place des activités
      var steps = [{ fade: 'out' }];
      var place = { coq: ev.stage.coq };
      var A = ev.activities[plan.activity];
      var slots = { A: ev.stage.teamA.slice(), B: ev.stage.teamB.slice(), all: ev.stage.together.slice() };
      ev.participants.forEach(function (id) {
        if (!plan.invited[id]) return;
        var pos = A.teams ? slots[plan.teams[id]].shift() : slots.all.shift();
        if (pos) place[id] = pos;
      });
      if (S.flags.adult_informed) place.chouette = ev.stage.adult;
      var hide = ev.participants.filter(function (id) { return !plan.invited[id]; });
      if (!S.flags.adult_informed) hide.push('chouette');
      steps.push({ place: place, hide: hide, camera: ev.stage.camera, wait: 0.3 });
      steps.push({ fade: 'in', call: function () { C.UI.$('banner-activity').textContent = A.icon + ' ' + A.label; C.UI.$('banner-activity').classList.add('show'); } });
      steps.push({ wait: 1.2 });
      res.bubbles.filter(function (b) { return place[b.who]; }).slice(0, 7).forEach(function (b) {
        steps.push({ say: b.who, text: b.text, t: 2.8, style: b.style });
      });
      steps.push({ wait: 0.8 });
      if (res.integ >= 14) steps.push({ happy: ['agneau', 'chien'], say: 'agneau', text: ev.endBubbles.good, t: 2.6 });
      else if (res.integ >= 8) steps.push({ say: 'agneau', text: ev.endBubbles.mid, t: 2.6, style: 'thought' });
      else if (plan.invited.agneau) steps.push({ say: 'agneau', text: ev.endBubbles.bad, t: 2.6, style: 'thought' });
      steps.push({ wait: 0.6 });
      C.Cutscene.play(steps, function () {
        C.UI.$('banner-activity').classList.remove('show');
        self.showConsequences(res);
      });
    },

    showConsequences: function (res) {
      var box = C.UI.$('event-card');
      box.innerHTML = '';
      box.appendChild(E('h2', 'ev-cons-title', 'Comment s\'est passée l\'activité ?'));
      var ul = E('div', 'ev-cons');
      res.lines.forEach(function (l, i) {
        var d = E('div', 'ev-con ' + l.tone, l.text);
        d.style.animationDelay = (i * 0.35) + 's';
        ul.appendChild(d);
      });
      box.appendChild(ul);
      var b = E('button', 'btn btn-solve', 'Voir le bilan →');
      b.addEventListener('click', function () { C.UI.close('event'); C.End.show(); });
      box.appendChild(b);
      C.UI.open('event');
    }
  };

  /* ---------------- Score et bilan ---------------- */
  C.computeScore = function () {
    var S = C.S, ep = C.EP, cfg = ep.config;
    var total = ep.clues.length;
    var covered = cfg.roles.filter(function (r) { return C.evidence(r.key, cfg.solution[r.key]).length >= r.need; }).length;
    var enquete = Math.round(28 * Math.min(1, S.vars.clues_found / Math.min(total, cfg.scoring.cluesForFull)) + 12 * covered / cfg.roles.length);
    var d = S.deduction || { wrong: 0, whyWrong: 0 };
    var comp = Math.max(4, 14 - 4 * (d.wrong - d.whyWrong)) + (d.whyWrong === 0 ? 6 : 3);
    comp = C.clamp(comp, 0, 20);
    var react = C.clamp(Math.round(cfg.scoring.reactionBase + S.vars.reaction), 0, 20);
    var reint = C.clamp(S.vars.integration_score, 0, 20);
    var sc = { enquete: C.clamp(enquete, 0, 40), comprehension: comp, reactions: react, reintegration: reint };
    sc.total = sc.enquete + sc.comprehension + sc.reactions + sc.reintegration;
    sc.cat = cfg.scoring.categories.filter(function (c) { return sc.total >= c.min; })[0];
    return sc;
  };

  function stars(n) {
    n = C.clamp(Math.round(n), 1, 5);
    return '<span class="stars">' + '★★★★★'.slice(0, n) + '<i>' + '★★★★★'.slice(0, 5 - n) + '</i></span>';
  }

  C.End = {
    show: function () {
      var S = C.S, ep = C.EP, cfg = ep.config, end = cfg.end;
      C.setPhase('fin');
      var sc = C.computeScore();
      var coh = S.vars.group_cohesion;
      var impact = end.impact.filter(function (i) { return coh >= i.min; })[0];
      var victim = ep.charactersById[cfg.solution.victime];
      var box = C.UI.$('end-card');
      box.innerHTML = '';
      box.appendChild(E('div', 'end-kicker', '🐓 ENQUÊTE TERMINÉE'));
      box.appendChild(E('h1', '', cfg.title));
      var tbl = E('div', 'end-table');
      function row(k, v) { tbl.appendChild(E('div', 'end-k', k)); tbl.appendChild(E('div', 'end-v', v)); }
      row('Victime identifiée', victim.emoji + ' ' + victim.name);
      row('Indices trouvés', S.vars.clues_found + ' / ' + ep.clues.length);
      row('Enquête', stars((sc.enquete + sc.comprehension) / 60 * 5));
      row('Réintégration', stars(sc.reintegration / 20 * 5));
      row('Impact sur le groupe', '<b class="impact ' + impact.cls + '">' + impact.label + '</b>');
      box.appendChild(tbl);

      var badge = E('div', 'end-badge', '<div class="end-badge-icon">' + sc.cat.icon + '</div><div><div class="end-badge-label">' + sc.cat.label + '</div><div class="end-badge-score">' + sc.total + ' / 100</div></div>');
      box.appendChild(badge);

      var bars = E('div', 'end-bars');
      [['Enquête', sc.enquete, 40], ['Compréhension de la situation', sc.comprehension, 20], ['Choix des réactions', sc.reactions, 20], ['Réintégration', sc.reintegration, 20]].forEach(function (b) {
        var r = E('div', 'end-bar');
        r.appendChild(E('span', 'end-bar-label', b[0]));
        var tr = E('div', 'end-bar-track'); var fill = E('div', 'end-bar-fill'); tr.appendChild(fill);
        r.appendChild(tr);
        r.appendChild(E('span', 'end-bar-val', b[1] + '/' + b[2]));
        bars.appendChild(r);
        setTimeout(function () { fill.style.width = (b[1] / b[2] * 100) + '%'; }, 200);
      });
      box.appendChild(bars);

      box.appendChild(E('p', 'end-msg', end.message));
      var notes = (end.notes || []).filter(function (n) { return C.check(n.if); });
      if (notes.length) {
        var ul = E('ul', 'end-notes');
        notes.forEach(function (n) { ul.appendChild(E('li', '', n.text)); });
        box.appendChild(ul);
      }
      var lessons = E('div', 'end-lessons');
      lessons.appendChild(E('h3', '', 'À retenir'));
      var ll = E('ul', '');
      end.lessons.forEach(function (l) { ll.appendChild(E('li', '', l)); });
      lessons.appendChild(ll);
      box.appendChild(lessons);
      box.appendChild(E('p', 'end-replay-note', end.replayNote));

      var btns = E('div', 'end-buttons');
      var nb = E('button', 'btn btn-ghost', '📖 Revoir mon carnet');
      nb.addEventListener('click', function () { C.Notebook.open('indices'); });
      var rp = E('button', 'btn btn-solve', '🔁 Rejouer une nouvelle partie');
      rp.addEventListener('click', function () { C.restart(); });
      btns.appendChild(nb); btns.appendChild(rp);
      box.appendChild(btns);
      C.UI.open('end');
      C.Audio.play('reveal');
      var best = C.store.get('best_' + ep.id, 0);
      if (sc.total > best) C.store.set('best_' + ep.id, sc.total);
    }
  };
})(window.CDC);
