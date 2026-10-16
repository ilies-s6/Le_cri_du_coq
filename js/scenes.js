/* Scènes d'observation (conversations surprises, comportements) et cinématiques.
   Les scènes sont décrites dans episodes/<épisode>/scenes.js */
(function (C) {
  var T = C.TILE;

  function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

  C.Scenes = {
    armed: null, playing: false, step: 0, timer: 0, armedAt: 0, cooldown: {}, done: {}, tick: 0,

    reset: function () {
      this.armed = null; this.playing = false; this.cooldown = {}; this.done = {}; this.tick = 0;
    },
    /* Changement de moment : toute scène en préparation est annulée */
    releaseAll: function () {
      if (this.armed) this.release(this.armed, 0);
      C.UI.setHint(null);
    },
    isDone: function (sc) { return this.done[sc.id] || C.S.flags[sc.id + '_done']; },

    actorsOf: function (sc) { return Object.keys(sc.actors || {}); },

    arm: function (sc) {
      this.armed = sc; this.playing = false; this.armedAt = C.S.time; this.heard = false;
      this.actorsOf(sc).forEach(function (id) {
        var n = C.NPC.byId[id];
        n.reserved = true; n.target = null;
      });
    },
    release: function (sc, cd) {
      var S = C.S;
      this.actorsOf(sc).forEach(function (id) {
        var n = C.NPC.byId[id];
        n.reserved = false; n.inScene = false; n.path = null;
        n.pendingMove = true; // rentre chez lui quand le joueur ne regarde pas
      });
      if (cd) this.cooldown[sc.id] = S.time + cd;
      this.armed = null; this.playing = false;
      C.NPC.refreshHomes();
      C.UI.setHint(null);
    },

    positioned: function (sc) {
      var ok = true, R = C.Render;
      for (var id in sc.actors) {
        var n = C.NPC.byId[id], a = sc.actors[id];
        var tx = a[0] * T, ty = a[1] * T;
        if (dist(n.x, n.y, tx, ty) < 4) { if (!n.path || !n.path.length) n.dir = a[2] || n.dir; n.hidden = false; continue; }
        ok = false;
        if (!n.hidden && dist(n.x, n.y, tx, ty) < 3 * T) {   // tout proche : il y marche
          if (!n.path || !n.path.length) { n.path = [[tx, ty]]; n.pathSpeed = 45; }
          continue;
        }
        var far = dist(C.Player.x, C.Player.y, sc.center[0] * T, sc.center[1] * T) > (sc.radius + 3) * T;
        if (!R.onScreen(n.x, n.y, 40) && (far || !R.onScreen(tx, ty, 40))) {
          n.x = tx; n.y = ty; n.dir = a[2] || 'down'; n.target = null; n.pendingMove = false; n.hidden = false;
        }
      }
      return ok;
    },

    update: function (dt) {
      var S = C.S, P = C.Player, self = this;
      if (C.UI.busy() || C.Cutscene.active || C.Time.isGoing()) return;
      var list = C.EP.scenes || [];

      if (!this.armed) {
        this.tick -= dt;
        if (this.tick > 0) return;
        this.tick = 0.5;
        for (var i = 0; i < list.length; i++) {
          var sc = list[i];
          if (this.isDone(sc) || (this.cooldown[sc.id] || 0) > S.time) continue;
          if (!C.check(sc.if)) continue;
          var busy = this.actorsOf(sc).some(function (id) { return C.NPC.byId[id].talking || C.NPC.byId[id].path; });
          if (busy) continue;
          this.arm(sc);
          break;
        }
        return;
      }

      var sc2 = this.armed;
      var cx = sc2.center[0] * T, cy = sc2.center[1] * T;
      var dP = dist(P.x, P.y, cx, cy);

      if (!this.playing) {
        if (!C.check(sc2.if)) { this.release(sc2, 5); return; }
        if (S.time - this.armedAt > (sc2.armTime || 90)) { this.release(sc2, 30); return; }
        if (!this.positioned(sc2)) return;
        if (dP < sc2.radius * T) {
          // Trop près dès le départ : ils ne commencent pas à parler
          if (sc2.interrupt && this.nearestActor(sc2) < sc2.interrupt * T) return;
          this.playing = true; this.step = -1; this.timer = 0;
          this.actorsOf(sc2).forEach(function (id) { C.NPC.byId[id].inScene = true; });
          if (sc2.hint) C.UI.setHint(sc2.hint);
          this.next();
        }
        return;
      }

      // Lecture en cours
      // (une fois l'essentiel entendu, s'approcher ne coupe plus la scène)
      if (sc2.interrupt && !this.heard && this.nearestActor(sc2) < sc2.interrupt * T) { this.interrupt(sc2); return; }
      if (dP > sc2.radius * T * 1.7) { this.release(sc2, 6); C.UI.toast('La conversation continue sans toi... Reviens plus tard.'); return; }
      this.timer -= dt;
      var st = sc2.steps[this.step];
      var waitingMove = st && st.move && C.NPC.byId[st.move].path && C.NPC.byId[st.move].path.length;
      if (this.timer <= 0 && !waitingMove) this.next();
    },

    nearestActor: function (sc) {
      var P = C.Player, best = 1e9;
      this.actorsOf(sc).forEach(function (id) { var n = C.NPC.byId[id]; best = Math.min(best, dist(n.x, n.y, P.x, P.y)); });
      return best;
    },

    interrupt: function (sc) {
      (sc.onInterrupt || []).forEach(function (l, i) {
        setTimeout(function () { C.NPC.say(l.say, C.text(l.text), 2.6); }, i * 900);
      });
      if (!C.S.flags._hint_discret) {
        C.S.flags._hint_discret = true;
        C.UI.toast('Ils se sont tus en te voyant. La prochaine fois, écoute d\'un peu plus loin.');
      }
      this.release(sc, sc.cooldown || 20);
    },

    next: function () {
      var sc = this.armed, S = C.S, P = C.Player;
      this.step++;
      if (this.step >= sc.steps.length) {
        this.done[sc.id] = true;
        S.flags[sc.id + '_done'] = true;
        C.apply(sc.after);
        this.release(sc, 0);
        C.NPC.refreshHomes();
        return;
      }
      var st = sc.steps[this.step];
      if (st.mood) C.NPC.setMood(st.say || st.who, st.mood, 6);
      if (st.say) {
        var txt = C.text(st.text);
        if (st.say === 'coq') P.say(txt, st.t || 2.5, st.style); else C.NPC.say(st.say, txt, st.t || (1.2 + txt.length * 0.042), st.style);
        this.timer = st.t || (1.2 + txt.length * 0.042);
      } else if (st.move) {
        var n = C.NPC.byId[st.move];
        n.path = (st.path || [st.to]).map(function (p) { return [p[0] * T, p[1] * T]; });
        n.pathSpeed = st.speed || 60;
        this.timer = st.t || 0;
      } else if (st.wait) {
        this.timer = st.wait;
      } else if (st.face) {
        C.NPC.byId[st.face].dir = st.dir; this.timer = 0;
      } else if (st.hide) {
        C.NPC.byId[st.hide].hidden = true; this.timer = 0;
      } else if (st.clue) {
        var cx = sc.center[0] * T, cy = sc.center[1] * T;
        if (dist(P.x, P.y, cx, cy) <= sc.radius * T * 1.2) {
          C.giveClue(st.clue);
          this.heard = true;
        }
        this.timer = 0.2;
      } else if (st.do) {
        C.apply(st.do); this.timer = 0;
      } else this.timer = 0;
    }
  };

  /* Cinématique : le joueur ne contrôle plus le coq pendant quelques secondes. */
  C.Cutscene = {
    active: false, steps: null, i: 0, timer: 0, done: null, camTarget: null,
    play: function (steps, done) {
      this.active = true; this.steps = steps; this.i = -1; this.timer = 0; this.done = done; this.camTarget = null;
      C.UI.setHint(null);
      this.next();
    },
    update: function (dt) {
      if (!this.active) return;
      this.timer -= dt;
      if (this.timer <= 0) this.next();
    },
    next: function () {
      this.i++;
      if (this.i >= this.steps.length) {
        this.active = false;
        var d = this.done; this.done = null;
        if (d) d();
        return;
      }
      var st = this.steps[this.i];
      this.timer = 0;
      if (st.fade) { C.UI.fade(st.fade); this.timer = 0.45; }
      if (st.place) {
        for (var id in st.place) {
          var a = st.place[id];
          if (id === 'coq') { C.Player.x = a[0] * T; C.Player.y = a[1] * T; C.Player.dir = a[2] || 'down'; continue; }
          var n = C.NPC.byId[id];
          n.x = a[0] * T; n.y = a[1] * T; n.dir = a[2] || 'down'; n.hidden = false; n.inScene = true; n.path = null; n.target = null;
        }
      }
      if (st.hide) C.arr(st.hide).forEach(function (id) { C.NPC.byId[id].hidden = true; });
      if (st.camera) { this.camTarget = [st.camera[0] * T, st.camera[1] * T]; C.Render.follow(this.camTarget[0], this.camTarget[1], 0, true); }
      if (st.say) {
        var txt = C.text(st.text);
        var dur = st.t || (1.6 + txt.length * 0.05);
        if (st.say === 'coq') C.Player.say(txt, dur, st.style); else C.NPC.say(st.say, txt, dur, st.style);
        this.timer = dur;
      }
      if (st.happy) C.arr(st.happy).forEach(function (id) { C.NPC.byId[id].happy = true; });
      if (st.wait) this.timer = st.wait;
      if (st.call) st.call();
    }
  };
})(window.CDC);
