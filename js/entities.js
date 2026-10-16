/* Joueur, personnages non joueurs (déplacements, routines, humeurs) et interactions. */
(function (C) {
  var T = C.TILE;

  function faceTo(n, x, y) {
    var dx = x - n.x, dy = y - n.y;
    n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }

  /* ---------------- Joueur ---------------- */
  C.Player = {
    x: 0, y: 0, dir: 'down', moving: false, speed: 132, bubble: null, movedTime: 0,
    init: function (ch, tx, ty) {
      this.def = ch;
      this.x = tx * T; this.y = ty * T;
      this.dir = 'down';
    },
    update: function (dt) {
      var P = this;
      P.moving = false;
      if (P.bubble && C.S.time > P.bubble.until) P.bubble = null;
      if (C.UI.busy() || C.Cutscene.active || (C.Time && C.Time.isGoing())) return;
      var a = C.Input.axis();
      if (!a.x && !a.y) return;
      P.moving = true;
      P.movedTime += dt;
      if (Math.abs(a.x) > Math.abs(a.y)) P.dir = a.x > 0 ? 'right' : 'left';
      else P.dir = a.y > 0 ? 'down' : 'up';
      var dx = a.x * P.speed * dt, dy = a.y * P.speed * dt;
      if (!C.World.blocked(P.x + dx - 9, P.y - 8, 18, 10)) P.x += dx;
      if (!C.World.blocked(P.x - 9, P.y + dy - 8, 18, 10)) P.y += dy;
    },
    draw: function (ctx, t) {
      C.Sprites.draw(ctx, this.def, this.x, this.y, { dir: this.dir, moving: this.moving, t: t, mood: this.mood, talk: !!this.bubble });
    },
    say: function (text, dur, style) { this.bubble = { text: text, until: C.S.time + (dur || 3), style: style }; }
  };

  /* ---------------- Personnages non joueurs ---------------- */
  C.NPC = {
    list: [],
    byId: {},
    init: function (chars) {
      var N = this;
      N.list = []; N.byId = {};
      chars.forEach(function (ch) {
        if (ch.player) return;
        var n = { id: ch.id, def: ch, x: 0, y: 0, dir: 'down', moving: false, bubble: null, hidden: false,
          home: null, wanderT: 1 + Math.random() * 2, target: null, inScene: false, path: null, routeI: 0, mood: 'neutral' };
        N.list.push(n); N.byId[ch.id] = n;
      });
      N.refreshHomes(true, true);
    },

    /* Choisit le « lieu de vie » de chaque personnage selon le moment, la phase, les choix... */
    refreshHomes: function (instant, force) {
      var S = C.S;
      this.list.forEach(function (n) {
        var homes = n.def.homes || [];
        var h = null;
        for (var i = 0; i < homes.length; i++) if (C.check(homes[i].if)) { h = homes[i]; break; }
        if (!h || h.hidden) { n.hiddenHome = true; h = h || n.home || { at: [1, 1] }; } else n.hiddenHome = false;
        // humeur de fond
        var moods = n.def.moods || [];
        n.baseMood = 'neutral';
        for (var j = 0; j < moods.length; j++) if (C.check(moods[j].if)) { n.baseMood = moods[j].mood; break; }
        if (!force && (n.reserved || n.inScene)) return;
        if (force) { n.reserved = false; n.inScene = false; n.path = null; n.talking = false; }
        var changed = !n.home || n.home.at[0] !== h.at[0] || n.home.at[1] !== h.at[1] || n.home !== h;
        n.home = h;
        if (changed) { n.pendingMove = true; n.routeI = 0; }
        if ((instant && n.pendingMove) || force) C.NPC.teleportHome(n);
        n.hidden = !!n.hiddenHome && !n.inScene;
      });
    },
    teleportHome: function (n) {
      n.x = n.home.at[0] * T; n.y = n.home.at[1] * T;
      n.dir = n.home.face || 'down';
      n.target = null; n.path = null; n.pendingMove = false;
      n.hidden = !!n.hiddenHome;
    },

    setMood: function (id, mood, dur) {
      var n = this.byId[id]; if (!n) { if (id === 'coq') C.Player.mood = mood; return; }
      n.moodTemp = mood; n.moodUntil = C.S.time + (dur || 10);
    },
    moodOf: function (id) {
      var n = this.byId[id]; if (!n) return C.Player.mood || 'neutral';
      if (n.moodTemp && C.S.time < n.moodUntil) return n.moodTemp;
      return n.baseMood || 'neutral';
    },
    walkTo: function (id, pts, speed) {
      var n = this.byId[id]; if (!n) return;
      if (!Array.isArray(pts[0])) pts = [pts];
      n.path = pts.map(function (p) { return [p[0] * T, p[1] * T]; });
      n.pathSpeed = speed || 55; n.hidden = false;
      n.walkedAway = true;
    },

    update: function (dt) {
      var S = C.S, R = C.Render;
      this.list.forEach(function (n) {
        if (n.bubble && S.time > n.bubble.until) n.bubble = null;
        n.moving = false;
        n.mood = C.NPC.moodOf(n.id);
        if (n.path && n.path.length) {
          var tgt = n.path[0];
          var dx = tgt[0] - n.x, dy = tgt[1] - n.y, d = Math.hypot(dx, dy);
          var sp = (n.pathSpeed || 70) * dt;
          if (d <= sp) { n.x = tgt[0]; n.y = tgt[1]; n.path.shift(); if (!n.path.length && n.walkedAway && !n.inScene && !n.reserved) { n.walkedAway = false; n.pendingMove = true; } }
          else { n.x += dx / d * sp; n.y += dy / d * sp; n.moving = true; faceTo(n, tgt[0], tgt[1]); }
          return;
        }
        if (n.inScene) return;
        if (n.talking) { faceTo(n, C.Player.x, C.Player.y); return; }
        if (n.reserved) return;
        if (n.pendingMove) {
          var hx = n.home.at[0] * T, hy = n.home.at[1] * T;
          if (!R.onScreen(n.x, n.y, 40) && !R.onScreen(hx, hy, 40)) C.NPC.teleportHome(n);
          else if (Math.hypot(hx - n.x, hy - n.y) < 6 * T && !n.hiddenHome) { n.path = [[hx, hy]]; n.pathSpeed = 50; n.pendingMove = false; return; }
        }
        // Routine : un trajet en boucle (surveillant, élèves qui passent...)
        if (n.home.route && !n.pendingMove) {
          if (n.pauseT > 0) { n.pauseT -= dt; return; }
          var pts = n.home.route, p = pts[n.routeI % pts.length];
          var rx = p[0] * T - n.x, ry = p[1] * T - n.y, rd = Math.hypot(rx, ry), s2 = (n.home.speed || 40) * dt;
          if (rd < 2) { n.routeI++; n.pauseT = n.home.pause != null ? n.home.pause : 1.5; return; }
          var bx = rx / rd * s2, by = ry / rd * s2;
          if (C.NPC.hitsPlayer(n.x + bx, n.y + by)) { faceTo(n, C.Player.x, C.Player.y); return; }
          n.x += bx; n.y += by; n.moving = true; faceTo(n, p[0] * T, p[1] * T);
          return;
        }
        // Regarde quelqu'un (groupe, ami...)
        if (n.home.look && !n.target) {
          var o = C.NPC.byId[n.home.look];
          if (o && !o.hidden) faceTo(n, o.x, o.y);
          else if (Array.isArray(n.home.look)) faceTo(n, n.home.look[0] * T, n.home.look[1] * T);
        }
        var wander = n.home.wander != null ? n.home.wander : 0.6;
        if (!wander || n.pendingMove) return;
        if (n.target) {
          var tx = n.target[0] - n.x, ty = n.target[1] - n.y, dd = Math.hypot(tx, ty);
          var s = 30 * dt;
          if (dd < 2) { n.target = null; n.wanderT = 2 + Math.random() * 4; if (n.home.face) n.dir = n.home.face; return; }
          var mx = tx / dd * s, my = ty / dd * s;
          var moved = false;
          if (!C.World.blocked(n.x + mx - 9, n.y - 6, 18, 10, n) && !C.NPC.hitsPlayer(n.x + mx, n.y)) { n.x += mx; moved = true; }
          if (!C.World.blocked(n.x - 9, n.y + my - 6, 18, 10, n) && !C.NPC.hitsPlayer(n.x, n.y + my)) { n.y += my; moved = true; }
          if (!moved) { n.target = null; n.wanderT = 1 + Math.random() * 2; return; }
          n.moving = true;
          faceTo(n, n.target[0], n.target[1]);
        } else {
          n.wanderT -= dt;
          if (n.wanderT <= 0) {
            var a = Math.random() * Math.PI * 2, r = Math.random() * wander * T;
            n.target = [n.home.at[0] * T + Math.cos(a) * r, n.home.at[1] * T + Math.sin(a) * r];
          }
        }
      });
    },
    hitsPlayer: function (x, y) {
      var P = C.Player;
      return Math.abs(P.x - x) < 18 && Math.abs(P.y - y) < 10;
    },
    drawOne: function (ctx, n, t) {
      C.Sprites.draw(ctx, n.def, n.x, n.y, { dir: n.dir, moving: n.moving, t: t + n.x * 0.01, accessory: n.def.accessory, mood: n.mood, talk: !!n.bubble });
      var P = C.Player;
      if (Math.hypot(P.x - n.x, P.y - n.y) < T * 3.2 && !n.bubble) {
        var name = C.S.met[n.id] ? (n.def.short || n.def.name) : '???';
        ctx.save();
        ctx.font = '600 9px Outfit, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        var w = ctx.measureText(name).width + 10;
        C.Draw.rr(ctx, n.x - w / 2, n.y + 4, w, 13, 6, 'rgba(24,28,44,0.78)');
        ctx.fillStyle = '#fff'; ctx.fillText(name, n.x, n.y + 14);
        ctx.restore();
      }
    },
    say: function (id, text, dur, style, quiet) {
      var n = this.byId[id]; if (!n) return;
      n.bubble = { text: text, until: C.S.time + (dur || 3), style: style };
      if (!quiet) C.Audio.play('talk');
    }
  };

  /* ---------------- Interactions ---------------- */
  C.Interact = {
    target: null,
    update: function () {
      var P = C.Player, best = null, bestD = 1e9;
      C.NPC.list.forEach(function (n) {
        if (n.hidden || n.inScene || n.def.noTalk) return;
        var d = Math.hypot(n.x - P.x, n.y - P.y);
        // On privilégie les personnes aux objets tout proches (ex. Maxence assis à la table de la cantine)
        if (d < 42 && d - 14 < bestD) {
          bestD = d - 14;
          best = { kind: 'npc', npc: n, x: n.x, y: n.y + 8, label: C.S.met[n.id] ? 'Parler à ' + (n.def.short || n.def.name) : 'Parler' };
        }
      });
      C.World.props.forEach(function (p) {
        if (!p.examine) return;
        var cx = C.clamp(P.x, p.hx, p.hx + p.hw), cy = C.clamp(P.y - 4, p.hy, p.hy + p.hh);
        var d = Math.hypot(cx - P.x, cy - (P.y - 4)) + 6;
        if (d < (p.reach || 30) && d < bestD) {
          bestD = d;
          best = { kind: 'prop', prop: p, x: p.px + p.pw / 2, y: Math.max(p.py + p.ph + 2, P.y + 10), label: p.label || 'Examiner' };
        }
      });
      this.target = best;
      if (best && C.Input.consume('interact') && !C.UI.busy()) {
        if (best.kind === 'npc') {
          C.S.met[best.npc.id] = true;
          C.Dialogue.start(best.npc.id, { npc: best.npc });
        } else if (best.prop.action) {
          C.UI.action(best.prop.action);
        } else {
          C.Dialogue.start(best.prop.examine, { prop: best.prop });
        }
      }
    }
  };
})(window.CDC);
