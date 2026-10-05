/* Joueur (le coq), personnages non joueurs, et détection des interactions. */
(function (C) {
  var T = C.TILE;

  /* ---------------- Joueur ---------------- */
  C.Player = {
    x: 0, y: 0, dir: 'down', moving: false, speed: 128, bubble: null,
    init: function (ch, tx, ty) {
      this.def = ch;
      this.x = tx * T; this.y = ty * T;
      this.dir = 'down';
    },
    update: function (dt) {
      var P = this;
      P.moving = false;
      if (P.bubble && C.S.time > P.bubble.until) P.bubble = null;
      if (C.UI.busy() || C.Cutscene.active) return;
      var a = C.Input.axis();
      if (!a.x && !a.y) return;
      P.moving = true;
      if (Math.abs(a.x) > Math.abs(a.y)) P.dir = a.x > 0 ? 'right' : 'left';
      else P.dir = a.y > 0 ? 'down' : 'up';
      var dx = a.x * P.speed * dt, dy = a.y * P.speed * dt;
      // Collisions séparées en X puis en Y : on glisse le long des murs
      if (!C.World.blocked(P.x + dx - 9, P.y - 8, 18, 10)) P.x += dx;
      if (!C.World.blocked(P.x - 9, P.y + dy - 8, 18, 10)) P.y += dy;
    },
    draw: function (ctx, t) {
      C.Sprites.draw(ctx, this.def, this.x, this.y, { dir: this.dir, moving: this.moving, t: t });
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
          home: null, wanderT: 1 + Math.random() * 2, target: null, inScene: false, path: null };
        N.list.push(n); N.byId[ch.id] = n;
      });
      N.refreshHomes(true);
    },

    /* Choisit le « lieu de vie » de chaque personnage selon la phase, les variantes, les indices... */
    refreshHomes: function (instant) {
      this.list.forEach(function (n) {
        var homes = n.def.homes || [];
        var h = null;
        for (var i = 0; i < homes.length; i++) if (C.check(homes[i].if)) { h = homes[i]; break; }
        if (!h) { n.hiddenHome = true; h = n.home || { at: [1, 1] }; } else n.hiddenHome = false;
        if (n.reserved || n.inScene) return;
        var changed = !n.home || n.home.at[0] !== h.at[0] || n.home.at[1] !== h.at[1];
        n.home = h;
        if (changed) n.pendingMove = true;
        if (instant && n.pendingMove) C.NPC.teleportHome(n);
      });
    },
    teleportHome: function (n) {
      n.x = n.home.at[0] * T; n.y = n.home.at[1] * T;
      n.dir = n.home.face || 'down';
      n.target = null; n.path = null; n.pendingMove = false;
      n.hidden = !!n.hiddenHome;
    },

    update: function (dt) {
      var S = C.S, R = C.Render;
      this.list.forEach(function (n) {
        if (n.bubble && S.time > n.bubble.until) n.bubble = null;
        n.moving = false;
        // Déplacement scripté (scènes)
        if (n.path && n.path.length) {
          var tgt = n.path[0];
          var dx = tgt[0] - n.x, dy = tgt[1] - n.y, d = Math.hypot(dx, dy);
          var sp = (n.pathSpeed || 70) * dt;
          if (d <= sp) { n.x = tgt[0]; n.y = tgt[1]; n.path.shift(); }
          else { n.x += dx / d * sp; n.y += dy / d * sp; n.moving = true; n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
          return;
        }
        if (n.inScene) return;
        if (n.talking) {
          var P = C.Player;
          var ddx = P.x - n.x, ddy = P.y - n.y;
          n.dir = Math.abs(ddx) > Math.abs(ddy) ? (ddx > 0 ? 'right' : 'left') : (ddy > 0 ? 'down' : 'up');
          return;
        }
        if (n.reserved) return;
        // Changement de lieu : on « téléporte » seulement hors de la vue du joueur
        if (n.pendingMove) {
          var hx = n.home.at[0] * T, hy = n.home.at[1] * T;
          if (!R.onScreen(n.x, n.y, 40) && !R.onScreen(hx, hy, 40)) C.NPC.teleportHome(n);
        }
        // Petite errance autour de son lieu
        var wander = n.home.wander != null ? n.home.wander : 1;
        if (!wander || n.pendingMove) return;
        if (n.target) {
          var tx = n.target[0] - n.x, ty = n.target[1] - n.y, dd = Math.hypot(tx, ty);
          var s = 34 * dt;
          if (dd < 2) { n.target = null; n.wanderT = 1.5 + Math.random() * 3; n.dir = n.home.face || n.dir; return; }
          var mx = tx / dd * s, my = ty / dd * s;
          var moved = false;
          if (!C.World.blocked(n.x + mx - 9, n.y - 6, 18, 10, n) && !C.NPC.hitsPlayer(n.x + mx, n.y)) { n.x += mx; moved = true; }
          if (!C.World.blocked(n.x - 9, n.y + my - 6, 18, 10, n) && !C.NPC.hitsPlayer(n.x, n.y + my)) { n.y += my; moved = true; }
          if (!moved) { n.target = null; n.wanderT = 1 + Math.random() * 2; return; }
          n.moving = true;
          n.dir = Math.abs(tx) > Math.abs(ty) ? (tx > 0 ? 'right' : 'left') : (ty > 0 ? 'down' : 'up');
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
      C.Sprites.draw(ctx, n.def, n.x, n.y, { dir: n.dir, moving: n.moving, t: t + n.x * 0.01, accessory: n.def.accessory, happy: n.happy });
      // Nom au-dessus si le joueur est proche et le connaît
      var P = C.Player;
      if (Math.hypot(P.x - n.x, P.y - n.y) < T * 3 && !n.bubble) {
        var name = C.S.met[n.id] ? n.def.name : '???';
        ctx.save();
        ctx.font = '700 9px Fredoka, "Trebuchet MS", sans-serif';
        ctx.textAlign = 'center';
        var w = ctx.measureText(name).width + 10;
        C.Draw.rr(ctx, n.x - w / 2, n.y + 4, w, 13, 6, 'rgba(255,255,255,0.85)');
        ctx.fillStyle = '#2a1d18'; ctx.fillText(name, n.x, n.y + 14);
        ctx.restore();
      }
    },
    say: function (id, text, dur, style) {
      var n = this.byId[id]; if (!n) return;
      n.bubble = { text: text, until: C.S.time + (dur || 3), style: style };
      C.Audio.play('talk');
    }
  };

  /* ---------------- Interactions ---------------- */
  C.Interact = {
    target: null,
    update: function () {
      var P = C.Player, best = null, bestD = 1e9;
      C.NPC.list.forEach(function (n) {
        if (n.hidden || n.inScene) return;
        var d = Math.hypot(n.x - P.x, n.y - P.y);
        if (d < 42 && d < bestD) {
          bestD = d;
          best = { kind: 'npc', npc: n, x: n.x, y: n.y + 8, label: C.S.met[n.id] ? 'Parler à ' + n.def.name : 'Parler' };
        }
      });
      C.World.props.forEach(function (p) {
        if (!p.examine) return;
        // distance entre le coq et la boîte de l'objet
        var cx = C.clamp(P.x, p.hx, p.hx + p.hw), cy = C.clamp(P.y - 4, p.hy, p.hy + p.hh);
        var d = Math.hypot(cx - P.x, cy - (P.y - 4)) + 6;
        if (d < 30 && d < bestD) {
          bestD = d;
          best = { kind: 'prop', prop: p, x: p.px + p.pw / 2, y: p.py + p.ph + 2, label: p.label || 'Examiner' };
        }
      });
      this.target = best;
      if (best && C.Input.consume('interact') && !C.UI.busy()) {
        if (best.kind === 'npc') {
          C.S.met[best.npc.id] = true;
          C.Dialogue.start(best.npc.id, { npc: best.npc });
        } else {
          C.Dialogue.start(best.prop.examine, { prop: best.prop });
        }
      }
    }
  };
})(window.CDC);
