/* ⏰ Le temps qui passe : moments de la journée, plusieurs jours.
   La chronologie est décrite dans episodes/<épisode>/config.js (timeline).
   Chaque moment change la place des personnages, les scènes possibles,
   les messages du téléphone... Les règles « onAdvance » font évoluer le monde
   selon ce que le joueur a fait (ou pas fait) pendant le moment écoulé. */
(function (C) {
  var hinted = {};
  var going = false;

  function tl() { return C.EP.config.timeline; }

  C.Time = {
    cur: function () { return tl()[C.S ? C.S.slot : 0] || tl()[0]; },
    index: function (id) {
      var list = tl();
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return i;
      console.warn('Moment inconnu : ' + id);
      return 999;
    },
    label: function (s) { s = s || this.cur(); return s.dayName + ' · ' + s.time; },
    isGoing: function () { return going; },

    /* Angle des aiguilles de l'horloge du couloir */
    clockAngle: function () {
      var s = C.S ? this.cur() : null;
      var m = s ? /(\d+)\s*h\s*(\d*)/.exec(s.time) : null;
      var h = m ? +m[1] : 8, mi = m && m[2] ? +m[2] : 0;
      return { h: ((h % 12) + mi / 60) / 12 * Math.PI * 2 - Math.PI / 2, m: mi / 60 * Math.PI * 2 - Math.PI / 2 };
    },

    /* Moment suivant possible ? (renvoie un message si non) */
    blocker: function () {
      var S = C.S, s = this.cur();
      if (S.phase !== 'enquete') return 'Le temps avancera tout seul quand tu auras préparé l\'activité.';
      if (s.phoneOnly) return null;
      var next = tl()[S.slot + 1];
      if (!next || next.phase) return 'C\'est le dernier moment de l\'enquête. Fais le point dans ton carnet [C] : tu as assez observé pour tirer tes conclusions.';
      return null;
    },

    update: function (dt) {
      var S = C.S;
      if (!S || going) return;
      S.slotTime += dt;
      var s = this.cur();
      if (s.phoneOnly || S.phase !== 'enquete' || hinted[s.id]) return;
      if (S.slotTime > (s.hintAfter || 100) && C.check(s.keyIf) && !this.blocker() && !C.UI.busy()) {
        hinted[s.id] = true;
        C.UI.toast('<div class="t-kicker">🔔 Sonnerie</div><div class="t-title">Ça va bientôt sonner</div><div class="t-sub">Passe au moment suivant quand tu es prêt : ⏰ ou [T].</div>');
      }
    },

    /* Le joueur demande à passer au moment suivant */
    request: function () {
      if (going || C.Cutscene.active) return;
      var b = this.blocker(), s = this.cur(), self = this;
      if (b) { C.UI.modal({ icon: '⏰', title: s.dayName + ' · ' + s.time, html: '<p>' + b + '</p>', buttons: [{ text: 'D\'accord' }] }); return; }
      var next = tl()[C.S.slot + 1];
      var missing = s.keyIf && !C.check(s.keyIf);
      C.UI.modal({
        icon: '⏰', title: 'Passer à la suite ?',
        html: '<p>Prochain moment : <b>' + next.dayName + ' · ' + next.time + '</b> — ' + next.title + '.</p>' +
          (missing ? '<p class="hint-soft">' + (s.missingText || 'Il se passe peut-être encore quelque chose ici. Observe autour de toi avant de partir.') + '</p>' : '') +
          '<p class="muted">Ce qui ne s\'est pas passé maintenant ne se reproduira pas forcément de la même façon.</p>',
        buttons: [{ text: 'Rester encore', cls: 'btn-ghost' }, { text: 'Y aller →', action: function () { self.go(); } }]
      });
    },

    /* Applique les conséquences du moment écoulé puis passe au suivant */
    go: function (toIdx) {
      var S = C.S, ep = C.EP, self = this;
      if (going) return;
      var from = this.cur();
      (ep.config.onAdvance || []).forEach(function (r) {
        if (r.from && C.arr(r.from).indexOf(from.id) < 0) return;
        if (C.check(r.if)) C.apply(r.do);
      });
      var idx = toIdx != null ? toIdx : S.slot + 1;
      this.jump(idx);
    },

    jumpTo: function (id, done) { this.jump(this.index(id), done); },

    jump: function (idx, done) {
      var S = C.S, self = this;
      var s = tl()[idx];
      if (!s) return;
      going = true;
      C.UI.fade('out');
      setTimeout(function () {
        S.slot = idx; S.slotTime = 0;
        C.Scenes.releaseAll();
        if (C.Ambient) C.Ambient.reset();
        if (s.start && !s.phoneOnly) { C.Player.x = s.start[0] * C.TILE; C.Player.y = s.start[1] * C.TILE; C.Player.dir = s.startDir || 'down'; }
        C.World.refreshProps();
        C.NPC.refreshHomes(true, true);
        C.Render.follow(C.Player.x, C.Player.y - 10, 0, true);
        C.UI.updateHUD();
        self.card(s, function () {
          C.UI.fade('in');
          going = false;
          if (C.Phone) C.Phone.checkNew(true);
          if (s.phoneOnly) C.Phone.openNight(s);
          if (C.Save) C.Save.save();
          if (s.onArrive) C.apply(s.onArrive);
          if (done) done();
        });
      }, 450);
    },

    /* Carte de transition « Mardi · 10 h 00 · Récréation » */
    card: function (s, done) {
      var el = C.UI.$('time-card');
      el.innerHTML = '<div class="tc-day">' + s.dayName + '</div><div class="tc-time">' + s.time + '</div><div class="tc-title">' + s.title + '</div>' +
        (s.cardText ? '<div class="tc-sub">' + s.cardText + '</div>' : '');
      el.classList.remove('hidden'); el.classList.remove('out');
      void el.offsetWidth; el.classList.add('show');
      C.Audio.play(s.phoneOnly ? 'buzz' : 'bell');
      setTimeout(function () {
        el.classList.add('out');
        setTimeout(function () { el.classList.add('hidden'); el.classList.remove('show'); }, 450);
        done();
      }, s.phoneOnly ? 1500 : 1900);
    }
  };
})(window.CDC);
