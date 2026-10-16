/* Vie du collège : petites conversations entre élèves, jeux de balle...
   Décrit dans episodes/<épisode>/ambient.js. Ces moments se jouent tout seuls
   quand le joueur passe à proximité ; ils changent selon le moment et l'état du monde. */
(function (C) {
  var T = C.TILE;
  var timers = {}, last = {}, queue = [], passes = {};

  function members(a) { return a.members.map(function (id) { return C.NPC.byId[id]; }); }
  function free(n) { return n && !n.hidden && !n.talking && !n.inScene && !n.reserved && !(n.path && n.path.length); }

  C.Ambient = {
    reset: function () { timers = {}; queue = []; passes = {}; },

    update: function (dt) {
      var S = C.S, P = C.Player;
      // bulles programmées
      for (var i = queue.length - 1; i >= 0; i--) {
        var q = queue[i];
        q.t -= dt;
        if (q.t <= 0) {
          queue.splice(i, 1);
          var n = C.NPC.byId[q.who];
          if (n && free(n)) { C.NPC.say(q.who, q.text, q.dur, q.style, true); if (q.mood) C.NPC.setMood(q.who, q.mood, q.dur + 1); }
        }
      }
      if (C.UI.busy() || C.Cutscene.active || C.Time.isGoing()) return;
      (C.EP.ambient || []).forEach(function (a) {
        var ms = members(a);
        var on = C.check(a.if) && ms.every(free);
        if (a.type === 'pass') {
          if (!on) { delete passes[a.id]; return; }
          var ps = passes[a.id] || (passes[a.id] = { t: Math.random(), k: 0 });
          ps.t += dt / (a.speed || 1.1);
          if (ps.t >= 1) { ps.t = 0; ps.k++; }
          var from = ms[ps.k % ms.length], to = ms[(ps.k + 1) % ms.length];
          ps.from = from; ps.to = to;
          // ils se regardent
          if (!from.target) { from.dir = Math.abs(to.x - from.x) > Math.abs(to.y - from.y) ? (to.x > from.x ? 'right' : 'left') : (to.y > from.y ? 'down' : 'up'); }
          if (!to.target) { to.dir = Math.abs(from.x - to.x) > Math.abs(from.y - to.y) ? (from.x > to.x ? 'right' : 'left') : (from.y > to.y ? 'down' : 'up'); }
          return;
        }
        if (!on) return;
        var cx = 0, cy = 0;
        ms.forEach(function (n) { cx += n.x; cy += n.y; }); cx /= ms.length; cy /= ms.length;
        // les membres d'un groupe se tournent vers le groupe
        ms.forEach(function (n) {
          if (n.target || n.talking) return;
          var dx = cx - n.x, dy = cy - n.y;
          if (Math.hypot(dx, dy) > 4) n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
        });
        if (Math.hypot(P.x - cx, P.y - cy) > (a.radius || 6) * T) return;
        if (timers[a.id] == null) timers[a.id] = 1 + Math.random() * 2;
        timers[a.id] -= dt;
        if (timers[a.id] > 0) return;
        var seqs = (a.lines || []).filter(function (l) { return !l.if || C.check(l.if); });
        if (!seqs.length) { timers[a.id] = 6; return; }
        var pick = seqs[Math.floor(Math.random() * seqs.length)];
        if (seqs.length > 1 && pick === last[a.id]) pick = seqs[(seqs.indexOf(pick) + 1) % seqs.length];
        last[a.id] = pick;
        var tt = 0, lines = pick.say || pick;
        lines.forEach(function (l) {
          var txt = C.text(l[1]);
          var dur = 1.4 + txt.length * 0.045;
          queue.push({ who: l[0], text: txt, t: tt, dur: dur, style: l[2], mood: l[3] });
          tt += dur + 0.25;
        });
        if (pick.do) C.apply(pick.do);
        var gap = a.gap || [5, 9];
        timers[a.id] = tt + gap[0] + Math.random() * (gap[1] - gap[0]);
      });
    },

    /* Balles en mouvement (ping-pong, passes de foot), triées avec le décor */
    drawables: function () {
      var out = [];
      (C.EP.ambient || []).forEach(function (a) {
        var ps = passes[a.id];
        if (!ps || !ps.from || !ps.to) return;
        var u = ps.t, x = ps.from.x + (ps.to.x - ps.from.x) * u, y = ps.from.y + (ps.to.y - ps.from.y) * u;
        var hgt = Math.sin(u * Math.PI) * (a.arc || 14) + 6;
        out.push({ y: y + 1, draw: function (ctx) {
          ctx.fillStyle = 'rgba(20,24,40,0.2)'; ctx.beginPath(); ctx.ellipse(x, y, 3.5, 1.5, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(x, y - hgt, a.ball === 'pingpong' ? 2 : 4, 0, Math.PI * 2);
          ctx.fillStyle = a.ball === 'pingpong' ? '#fff' : (a.ball === 'basket' ? '#f08a2c' : '#fff'); ctx.fill();
          ctx.strokeStyle = '#2b2230'; ctx.lineWidth = 1; ctx.stroke();
        } });
      });
      return out;
    }
  };
})(window.CDC);
