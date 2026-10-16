/* 🔎 Résoudre l'enquête, puis scène de révélation. */
(function (C) {
  function E(t, c, h) { return C.UI.el(t, c, h); }
  var step = 0, answers = {}, why = null;

  /* Combien d'indices trouvés soutiennent « rôle = personnage » ? */
  function evidence(role, charId) {
    var tag = role + ':' + charId;
    return C.S.clueOrder.filter(function (id) { return (C.EP.cluesById[id].points || []).indexOf(tag) >= 0; });
  }
  C.evidence = evidence;

  C.Deduction = {
    open: function () {
      var S = C.S;
      answers = {};
      C.EP.config.roles.forEach(function (r) { answers[r.key] = S.hyp[r.key] || null; });
      why = null; step = 0;
      C.UI.open('deduction');
      C.Audio.play('open');
      this.render();
    },
    close: function () { C.UI.close('deduction'); },

    render: function () {
      var ep = C.EP, cfg = ep.config, S = C.S;
      var box = C.UI.$('ded-card');
      box.innerHTML = '';
      var total = cfg.roles.length + 1;
      var dots = E('div', 'ded-dots');
      for (var i = 0; i < total; i++) dots.appendChild(E('span', i === step ? 'on' : (i < step ? 'done' : '')));
      box.appendChild(E('div', 'ded-kicker', '🔎 Tirer mes conclusions'));
      box.appendChild(dots);

      var self = this;
      if (step < cfg.roles.length) {
        var r = cfg.roles[step];
        box.appendChild(E('h2', '', r.question));
        var opts = E('div', 'ded-opts');
        cfg.suspects.forEach(function (id) {
          var ch = ep.charactersById[id];
          var b = E('button', 'ded-opt' + (answers[r.key] === id ? ' active' : ''));
          var cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
          C.Sprites.portrait(cv, ch, { unknown: !S.met[id] });
          b.appendChild(cv);
          b.appendChild(E('span', '', S.met[id] ? ch.name : '???'));
          if (!S.met[id]) b.disabled = true;
          b.addEventListener('click', function () { answers[r.key] = id; C.Audio.play('select'); self.render(); });
          opts.appendChild(b);
        });
        box.appendChild(opts);
      } else {
        box.appendChild(E('h2', '', cfg.why.question));
        var wl = E('div', 'ded-why');
        cfg.why.options.forEach(function (o) {
          var b = E('button', 'ded-why-opt' + (why === o.id ? ' active' : ''), o.text);
          b.addEventListener('click', function () { why = o.id; C.Audio.play('select'); self.render(); });
          wl.appendChild(b);
        });
        box.appendChild(wl);
      }

      var nav = E('div', 'ded-nav');
      var back = E('button', 'btn btn-ghost', step === 0 ? 'Annuler' : '← Retour');
      back.addEventListener('click', function () { if (step === 0) self.close(); else { step--; self.render(); } });
      nav.appendChild(back);
      var cur = step < cfg.roles.length ? answers[cfg.roles[step].key] : why;
      var last = step === cfg.roles.length;
      var nx = E('button', 'btn' + (last ? ' btn-solve' : ''), last ? 'Valider mes déductions' : 'Suivant →');
      nx.disabled = !cur;
      nx.addEventListener('click', function () { if (last) self.validate(); else { step++; self.render(); } });
      nav.appendChild(nx);
      box.appendChild(nav);
    },

    validate: function () {
      var cfg = C.EP.config, S = C.S;
      var d = S.deduction || (S.deduction = { wrong: 0, whyWrong: 0, solved: false });
      var wrongRoles = cfg.roles.filter(function (r) { return answers[r.key] !== cfg.solution[r.key]; });
      var whyOk = cfg.why.options.some(function (o) { return o.id === why && o.correct; });
      // Garder les réponses comme hypothèses dans le carnet
      cfg.roles.forEach(function (r) { S.hyp[r.key] = answers[r.key]; });
      this.close();

      if (wrongRoles.length || !whyOk) {
        d.wrong++;
        if (!whyOk) d.whyWrong++;
        C.Audio.play('wrong');
        var hint = '';
        if (d.wrong >= 2) {
          var r = wrongRoles[0];
          hint = r ? '<p class="hint-soft">💡 ' + r.hint + '</p>' : '<p class="hint-soft">💡 ' + cfg.why.hint + '</p>';
        }
        var right = cfg.roles.length - wrongRoles.length;
        C.UI.modal({
          icon: '🤔', title: 'Pas tout à fait…',
          html: '<p>Ton hypothèse ne correspond pas à tous les indices. Il te manque peut-être encore quelque chose.</p>' +
            (right >= 3 ? '<p>Une partie de ton raisonnement tient la route. Relis tes indices et observe encore.</p>' : '') + hint,
          buttons: [{ text: 'Reprendre l\'enquête' }]
        });
        C.onStateChange();
        return;
      }
      // Bonnes réponses : a-t-on assez de preuves ?
      var weak = cfg.roles.filter(function (r) { return evidence(r.key, cfg.solution[r.key]).length < r.need; });
      if (weak.length) {
        C.Audio.play('wrong');
        C.UI.modal({
          icon: '🧩', title: 'Intuition intéressante…',
          html: '<p>Ton raisonnement est peut-être juste, mais tu n\'as pas encore assez de preuves pour en être sûr.</p>' +
            '<p>Il te manque des indices sur : <b>' + weak.map(function (r) { return r.label.toLowerCase(); }).join(', ') + '</b>.</p>',
          buttons: [{ text: 'Continuer à enquêter' }]
        });
        return;
      }
      d.solved = true;
      S.vars.victim_identified = true;
      C.Reveal.play();
    }
  };

  /* ---------------- Révélation ---------------- */
  C.Reveal = {
    play: function () {
      var cfg = C.EP.config, S = C.S;
      var R = cfg.reveal;
      C.UI.open('reveal');
      C.Audio.play('reveal');
      var box = C.UI.$('reveal-card');
      var beat = 0;
      var self = this;

      function thoughts() {
        box.innerHTML = '';
        var cv = document.createElement('canvas'); cv.width = 140; cv.height = 140;
        C.Sprites.portrait(cv, C.EP.charactersById[cfg.player]);
        cv.className = 'rv-portrait';
        box.appendChild(cv);
        var lines = E('div', 'rv-lines');
        box.appendChild(lines);
        R.thoughts.forEach(function (t, i) {
          setTimeout(function () {
            var p = E('p', i === R.thoughts.length - 1 ? 'rv-big' : '', C.fmt(t));
            lines.appendChild(p);
            setTimeout(function () { p.classList.add('in'); }, 30);
            if (i === R.thoughts.length - 1) {
              var b = E('button', 'btn', 'Rassembler les pièces →');
              b.addEventListener('click', roles);
              setTimeout(function () { box.appendChild(b); }, 700);
            }
          }, 900 + i * 1500);
        });
      }

      function roles() {
        box.innerHTML = '';
        box.appendChild(E('h2', 'rv-title', 'Ce que tu as compris'));
        var grid = E('div', 'rv-roles');
        cfg.roles.forEach(function (r, i) {
          var id = cfg.solution[r.key], ch = C.EP.charactersById[id];
          var card = E('div', 'rv-role');
          var cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
          C.Sprites.portrait(cv, ch);
          card.appendChild(cv);
          card.appendChild(E('div', 'rv-role-name', ch.name));
          card.appendChild(E('div', 'rv-role-label', r.label));
          card.appendChild(E('div', 'rv-role-text', R.roleText[r.key]));
          var ev = evidence(r.key, id).slice(0, 2).map(function (cid) { return C.EP.cluesById[cid].title; });
          card.appendChild(E('div', 'rv-role-ev', ev.map(function (t) { return '🔍 ' + t; }).join('<br>')));
          card.style.animationDelay = (i * 0.25) + 's';
          grid.appendChild(card);
        });
        box.appendChild(grid);
        var b = E('button', 'btn', 'Et maintenant ? →');
        b.addEventListener('click', timeline);
        box.appendChild(b);
      }

      function timeline() {
        box.innerHTML = '';
        box.appendChild(E('h2', 'rv-title', 'De petits gestes… répétés'));
        var acts = S.clueOrder.map(function (id) { return C.EP.cluesById[id]; }).filter(function (c) { return c.action; });
        var tl = E('div', 'rv-timeline');
        acts.forEach(function (c, i) {
          var it = E('div', 'rv-act', c.action);
          it.style.animationDelay = (i * 0.18) + 's';
          tl.appendChild(it);
        });
        box.appendChild(tl);
        box.appendChild(E('p', 'rv-lesson', R.lesson));
        var b = E('button', 'btn btn-solve', R.actionButton || 'Passer à l\'action →');
        b.addEventListener('click', function () { C.UI.close('reveal'); self.finish(); });
        box.appendChild(b);
      }

      thoughts();
    },
    finish: function () {
      var R = C.EP.config.reveal;
      C.setPhase('reintegration');
      C.Time.jumpTo(R.jumpTo, function () {
        C.UI.modal({
          icon: '🤝', title: R.nextTitle || 'Deuxième objectif',
          html: R.next,
          buttons: [{ text: 'C\'est parti' }]
        });
      });
    }
  };
})(window.CDC);
