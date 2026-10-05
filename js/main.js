/* Démarrage du jeu et boucle principale. */
(function (C) {
  var canvas, ctx, last = 0, started = false, zoneId = null, t = 0;

  function prepareEpisode(ep) {
    ep.charactersById = {};
    ep.characters.forEach(function (c) { ep.charactersById[c.id] = c; });
    ep.cluesById = {};
    ep.clues.forEach(function (c) {
      ep.cluesById[c.id] = c;
      // « about » = personnages concernés (sans révéler leur rôle)
      if (!c.about) c.about = (c.points || []).map(function (p) { return p.split(':')[1]; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; });
    });
    ep.dialogues = Object.assign({}, ep.dialogues || {}, ep.objects || {});
    // Format court : steps: ['texte (pensée du coq)', ['agneau', 'réplique'], ...]
    Object.keys(ep.dialogues).forEach(function (k) {
      ep.dialogues[k].forEach(function (conv) {
        if (!conv.steps || conv.nodes) return;
        conv.nodes = {};
        conv.steps.forEach(function (st, i) {
          var who = Array.isArray(st) ? st[0] : 'narr', text = Array.isArray(st) ? st[1] : st;
          conv.nodes['s' + i] = { who: who, text: text, next: i < conv.steps.length - 1 ? 's' + (i + 1) : null };
        });
        conv.start = 's0';
      });
    });
  }

  C.setPhase = function (p) {
    C.S.phase = p;
    C.World.refreshProps();
    C.NPC.refreshHomes();
    C.UI.updateHUD();
  };

  C.onStateChange = function () {
    if (!C.S) return;
    C.World.refreshProps();
    C.NPC.refreshHomes();
    C.UI.updateHUD();
  };

  C.onClueFound = function () {
    var S = C.S, cfg = C.EP.config;
    if (S.phase === 'enquete' && S.vars.clues_found === cfg.minCluesToSolve) {
      setTimeout(function () {
        C.UI.toast('<div class="t-kicker">📖 Carnet</div><div class="t-title">Tu peux tenter de résoudre l\'enquête</div><div class="t-sub">Ouvre ton carnet [C]… ou continue à chercher.</div>', 'clue');
      }, 1200);
    }
  };

  C.restart = function () {
    try { location.hash = 'rejouer'; } catch (e) {}
    location.reload();
  };

  function startGame(epId) {
    var ep = C.ep(epId);
    C.EP = ep;
    prepareEpisode(ep);
    var seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
    C.S = C.newState(ep, seed);
    C.World.build(ep.map);
    var pch = ep.charactersById[ep.config.player];
    C.Player.init(pch, ep.config.start[0], ep.config.start[1]);
    C.NPC.init(ep.characters);
    C.Scenes.reset();
    C.Render.follow(C.Player.x, C.Player.y, 0, true);
    C.UI.updateHUD();
    var plays = C.store.get('plays_' + epId, 0) + 1;
    C.store.set('plays_' + epId, plays);
    started = true;
    document.body.classList.add('playing');
    setTimeout(function () {
      C.Audio.play('rooster');
      C.Player.say(ep.config.openingLine, 3.5);
    }, 600);
  }
  C.startGame = startGame;

  function intro(epId) {
    var ep = C.ep(epId), cfg = ep.config;
    var replay = (location.hash || '').indexOf('rejouer') >= 0;
    var pages = cfg.intro.slice();
    var i = 0;
    function show() {
      var p = pages[i];
      var body = (C.isTouch && C.isTouch() && p.touchHtml) ? p.touchHtml : p.html;
      C.UI.modal({
        icon: p.icon, title: p.title, html: body + (replay && i === 0 ? '<p class="hint-soft">🔁 Nouvelle partie : certains indices, dialogues et objets ont changé de place.</p>' : ''),
        cls: 'intro',
        buttons: [{ text: i < pages.length - 1 ? 'Suivant →' : 'Commencer l\'enquête', action: function () {
          i++;
          if (i < pages.length) show(); else C.UI.updateHUD();
        } }]
      });
    }
    show();
  }

  function title() {
    var scr = C.UI.$('title');
    var cv = C.UI.$('title-coq');
    var best = C.store.get('best_ep1', 0);
    if (best) C.UI.$('title-best').textContent = 'Meilleur score : ' + best + ' / 100';
    C.UI.$('btn-play').addEventListener('click', function () {
      C.Audio.unlock();
      scr.classList.add('hidden');
      startGame('ep1');
      intro('ep1');
    });
    function anim() {
      if (scr.classList.contains('hidden')) return;
      var ctx2 = cv.getContext('2d');
      ctx2.clearRect(0, 0, cv.width, cv.height);
      var ch = C.ep('ep1').characters.filter(function (c) { return c.player; })[0];
      ctx2.save(); ctx2.translate(cv.width / 2, cv.height * 0.86); ctx2.scale(4.2, 4.2);
      C.Sprites.species[ch.species](ctx2, 'down', { colors: ch.colors, t: performance.now() / 1000, step: 0 });
      ctx2.restore();
      requestAnimationFrame(anim);
    }
    anim();
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now; t += dt;
    if (started) {
      var S = C.S, I = C.Input;
      S.time += dt;
      // Raccourcis globaux
      if (I.consume('mute')) { C.Audio.toggle(); C.UI.updateHUD(); }
      if (I.consume('notebook') && !C.Dialogue.isOpen() && !C.Cutscene.active) {
        var top = C.UI.top();
        if (!top || top === 'notebook') C.Notebook.toggle();
      }
      if (I.consume('back')) {
        var tp = C.UI.top();
        if (tp === 'notebook') C.Notebook.close();
        else if (tp === 'deduction') C.Deduction.close();
        else if (tp === 'event' && C.S.phase !== 'evenement') C.Event.close();
      }
      C.Dialogue.update(dt);
      C.Player.update(dt);
      C.NPC.update(dt);
      C.Scenes.update(dt);
      C.Cutscene.update(dt);
      if (!C.UI.busy() && !C.Cutscene.active) C.Interact.update(); else C.Interact.target = null;
      if (C.pendingOpen && !C.UI.busy() && !C.Cutscene.active) { var p = C.pendingOpen; C.pendingOpen = null; C.UI.openPanel(p); }

      if (C.Cutscene.active && C.Cutscene.camTarget) C.Render.follow(C.Cutscene.camTarget[0], C.Cutscene.camTarget[1], dt);
      else C.Render.follow(C.Player.x, C.Player.y - 10, dt);

      var z = C.World.zoneAt(C.Player.x, C.Player.y);
      if (z && z.id !== zoneId) { zoneId = z.id; C.UI.zoneBanner(z); }
      document.body.classList.toggle('ui-busy', C.UI.busy() || C.Cutscene.active);
      C.Render.draw(ctx, t);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('load', function () {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    C.Render.resize(canvas);
    window.addEventListener('resize', function () { C.Render.resize(canvas); });
    C.Dialogue.init();
    C.Notebook.init();
    C.UI.$('btn-notebook').addEventListener('click', function () { if (!C.Dialogue.isOpen() && !C.Cutscene.active) C.Notebook.toggle(); });
    C.UI.$('btn-mute').addEventListener('click', function () { C.Audio.toggle(); C.UI.updateHUD(); });
    title();
    if ((location.hash || '').indexOf('rejouer') >= 0) C.UI.$('btn-play').click();
    requestAnimationFrame(frame);
  });
})(window.CDC);
