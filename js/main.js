/* Démarrage du jeu, menu principal et boucle de jeu. */
(function (C) {
  var canvas, ctx, last = 0, started = false, zoneId = null, t = 0;
  var EP_ID = 'ep1';

  function prepareEpisode(ep) {
    if (ep._prepared) return;
    ep._prepared = true;
    ep.charactersById = {};
    ep.characters.forEach(function (c) { ep.charactersById[c.id] = c; });
    ep.cluesById = {};
    ep.clues.forEach(function (c) {
      ep.cluesById[c.id] = c;
      if (!c.about) c.about = (c.points || []).map(function (p) { return p.split(':')[1]; })
        .filter(function (v, i, a) { return a.indexOf(v) === i; });
    });
    ep.dialogues = Object.assign({}, ep.dialogues || {}, ep.objects || {});
    // Format court : steps: ['texte (pensée)', ['agneau', 'réplique'], ...]
    Object.keys(ep.dialogues).forEach(function (k) {
      ep.dialogues[k].forEach(function (conv) {
        if (!conv.steps || conv.nodes) return;
        conv.nodes = {};
        conv.steps.forEach(function (st, i) {
          var who = Array.isArray(st) ? st[0] : 'narr', text = Array.isArray(st) ? st[1] : st;
          conv.nodes['s' + i] = { who: who, text: text, mood: Array.isArray(st) ? st[2] : null, next: i < conv.steps.length - 1 ? 's' + (i + 1) : null };
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
    if (C.Phone) C.Phone.checkNew();
  };

  C.onClueFound = function () {
    var S = C.S, cfg = C.EP.config;
    if (S.phase === 'enquete' && S.vars.clues_found === cfg.minCluesToSolve) {
      setTimeout(function () {
        if (C.check(cfg.solveIf)) C.UI.toast('<div class="t-kicker">📖 Carnet</div><div class="t-title">Tu peux tenter de conclure</div><div class="t-sub">Ouvre ton carnet [C]… ou continue d\'observer.</div>', 'clue');
      }, 1200);
    }
    if (C.Save) C.Save.soon();
  };

  C.restart = function () {
    if (C.Save) C.Save.clear(EP_ID);
    try { location.hash = 'rejouer'; } catch (e) {}
    location.reload();
  };

  function startGame(epId, resume) {
    var ep = C.ep(epId);
    C.EP = ep;
    prepareEpisode(ep);
    if (resume) {
      C.S = resume.S;
      C.rng = C.makeRng((resume.S.seed + Math.floor(resume.S.time * 1000)) >>> 0);
      if (C.S.phase === 'evenement') C.S.phase = 'reintegration';
    } else {
      var seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
      C.S = C.newState(ep, seed);
    }
    C.World.build(ep.map);
    var pch = ep.charactersById[ep.config.player];
    var st = C.Time.cur().start || ep.config.start;
    C.Player.init(pch, st[0], st[1]);
    if (resume && resume.player) { C.Player.x = resume.player.x; C.Player.y = resume.player.y; C.Player.dir = resume.player.dir || 'down'; }
    C.NPC.init(ep.characters);
    C.Scenes.reset();
    C.Ambient.reset();
    C.Render.follow(C.Player.x, C.Player.y, 0, true);
    C.UI.updateHUD();
    var z = C.World.zoneAt(C.Player.x, C.Player.y);
    if (z) { zoneId = z.id; C.UI.$('hud-zone').textContent = z.name; }
    if (!resume) C.store.set('plays_' + epId, C.store.get('plays_' + epId, 0) + 1);
    started = true;
    document.body.classList.add('playing');
    if (resume) {
      var s = C.Time.cur();
      if (C.S.phase === 'fin') { C.End.show(); return; }
      if (s.phoneOnly) C.Phone.openNight(s);
      else C.UI.toast('<div class="t-kicker">💾 Partie reprise</div><div class="t-title">' + s.dayName + ' · ' + s.time + '</div><div class="t-sub">' + s.title + '</div>');
    }
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
        icon: p.icon, title: p.title, html: body + (replay && i === 0 ? '<p class="hint-soft">🔁 Nouvelle partie : certains indices, objets et conversations ont changé de place.</p>' : ''),
        cls: 'intro',
        buttons: [{ text: i < pages.length - 1 ? 'Suivant →' : 'C\'est parti', action: function () {
          i++;
          if (i < pages.length) show();
          else {
            C.UI.updateHUD();
            C.Time.card(C.Time.cur(), function () {
              C.Audio.play('rooster');
              C.Player.say(C.text(cfg.openingLine), 3.5);
              if (!C.store.get('tuto_done', false)) C.Tutorial.start();
            });
          }
        } }]
      });
    }
    show();
  }

  /* ---------- Menu principal ---------- */
  function title() {
    var scr = C.UI.$('title');
    var ep = C.ep(EP_ID);
    prepareEpisode(ep);
    var best = C.store.get('best_' + EP_ID, 0);
    if (best) C.UI.$('title-best').textContent = 'Meilleur bilan : ' + best + ' / 100';
    var info = C.Save.info(EP_ID);
    if (info) {
      C.UI.$('btn-resume').classList.remove('hidden');
      C.UI.$('resume-info').textContent = info.when + ' · ' + info.clues + ' indice' + (info.clues > 1 ? 's' : '');
      C.UI.$('btn-play').classList.add('ghost2');
    } else C.UI.$('btn-play').classList.add('primary');

    function go(resume) {
      C.Audio.unlock();
      scr.classList.add('hidden');
      startGame(EP_ID, resume);
      if (!resume) intro(EP_ID);
    }
    C.UI.$('btn-play').addEventListener('click', function () {
      if (info) {
        C.UI.modal({ icon: '✦', title: 'Nouvelle partie ?', html: '<p>Ta partie en cours (' + info.when + ') sera remplacée.</p>',
          buttons: [{ text: 'Annuler', cls: 'btn-ghost' }, { text: 'Recommencer', action: function () { C.Save.clear(EP_ID); go(null); } }] });
      } else go(null);
    });
    C.UI.$('btn-resume').addEventListener('click', function () { go(C.Save.load(EP_ID)); });
    C.UI.$('btn-howto').addEventListener('click', function () { C.UI.modal({ icon: '🎮', title: 'Commandes', html: C.UI.controlsHtml(), buttons: [{ text: 'Compris' }] }); });
    C.UI.$('btn-about').addEventListener('click', function () { C.UI.modal({ icon: '🐓', title: 'À propos', html: ep.config.about, buttons: [{ text: 'Fermer' }] }); });

    // Les élèves du collège, en bas du menu
    var cv = C.UI.$('title-cast');
    var cast = ep.config.titleCast || [];
    function anim() {
      if (scr.classList.contains('hidden')) return;
      var c2 = cv.getContext('2d');
      c2.clearRect(0, 0, cv.width, cv.height);
      var tt = performance.now() / 1000;
      cast.forEach(function (k, i) {
        var ch = ep.charactersById[k.id];
        c2.save();
        c2.translate(cv.width * k.x, cv.height * 0.9);
        c2.scale(k.s || 3.2, k.s || 3.2);
        C.Sprites.draw(c2, ch, 0, 0, { dir: k.dir || 'down', t: tt + i, mood: k.mood });
        c2.restore();
      });
      requestAnimationFrame(anim);
    }
    anim();
    if ((location.hash || '').indexOf('rejouer') >= 0) go(null);
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now; t += dt;
    if (started) {
      var S = C.S, I = C.Input;
      S.time += dt;
      if (I.consume('mute')) { C.Audio.toggle(); }
      var free = !C.Dialogue.isOpen() && !C.Cutscene.active && !C.Time.isGoing();
      if (I.consume('notebook') && free) {
        var top = C.UI.top();
        if (!top || top === 'notebook') C.Notebook.toggle();
      }
      if (I.consume('phone') && free) {
        var tp0 = C.UI.top();
        if (!tp0 || tp0 === 'phone') C.Phone.toggle();
      }
      if (I.consume('time') && free && !C.UI.busy() && S.phase === 'enquete') C.Time.request();
      if (I.consume('back')) {
        var tp = C.UI.top();
        if (tp === 'notebook') C.Notebook.close();
        else if (tp === 'phone') C.Phone.close();
        else if (tp === 'deduction') C.Deduction.close();
        else if (tp === 'modal' && document.querySelector('#modal .pause')) C.UI.close('modal');
        else if (tp === 'event' && C.S.phase !== 'evenement' && C.S.phase !== 'fin') C.Event.close();
        else if (!tp && free) C.UI.pause();
      }
      C.Dialogue.update(dt);
      C.Player.update(dt);
      C.NPC.update(dt);
      C.Scenes.update(dt);
      C.Ambient.update(dt);
      C.Cutscene.update(dt);
      C.Time.update(dt);
      C.Tutorial.update(dt);
      C.Save.update(dt);
      if (!C.UI.busy() && !C.Cutscene.active && !C.Time.isGoing()) C.Interact.update(); else C.Interact.target = null;
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
    C.Phone.init();
    C.UI.$('btn-notebook').addEventListener('click', function () { if (!C.Dialogue.isOpen() && !C.Cutscene.active) C.Notebook.toggle(); });
    C.UI.$('btn-phone').addEventListener('click', function () { if (!C.Dialogue.isOpen() && !C.Cutscene.active && (!C.UI.top() || C.UI.top() === 'phone')) C.Phone.toggle(); });
    C.UI.$('btn-time').addEventListener('click', function () { if (!C.UI.busy() && !C.Cutscene.active) C.Time.request(); });
    C.UI.$('btn-menu').addEventListener('click', function () { if (!C.Cutscene.active) C.UI.pause(); });
    title();
    requestAnimationFrame(frame);
  });
})(window.CDC);
