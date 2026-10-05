/* Dessin des animaux en vectoriel (aucune image nécessaire).
   Chaque espèce a une fonction de dessin. Pour ajouter une espèce,
   ajoute une entrée dans SPECIES puis utilise son nom dans characters.js. */
(function (C) {
  var OUT = '#3a2a22';

  function ell(ctx, x, y, rx, ry, fill, stroke, rot) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot || 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke !== false) { ctx.strokeStyle = stroke || OUT; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function tri(ctx, pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke !== false) { ctx.strokeStyle = stroke || OUT; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  function eyes(ctx, x, y, gap, r, dir, col) {
    if (dir === 'up') return;
    var off = dir === 'left' ? -2 : dir === 'right' ? 2 : 0;
    var pts = dir === 'left' ? [x - gap * 0.6] : dir === 'right' ? [x + gap * 0.6] : [x - gap / 2, x + gap / 2];
    pts.forEach(function (ex) {
      ell(ctx, ex + off * 0.3, y, r, r * 1.15, col || '#2a1d18', false);
      ell(ctx, ex + off * 0.3 + r * 0.35, y - r * 0.4, r * 0.38, r * 0.38, '#fff', false);
    });
  }
  function legs(ctx, x, y, spread, col, step, h) {
    var a = Math.sin(step) * 2.5;
    ell(ctx, x - spread, y - 1 + a * 0.4, 3, h || 3, col, OUT);
    ell(ctx, x + spread, y - 1 - a * 0.4, 3, h || 3, col, OUT);
  }

  var SPECIES = {
    coq: function (ctx, d, s) {
      var c = s.colors;
      var back = d === 'up';
      // queue
      var tx = d === 'left' ? 9 : d === 'right' ? -9 : 0;
      var ty = back ? -10 : -20;
      if (!back) {
        ell(ctx, tx - 4, ty, 4, 9, c.tail2, OUT, -0.4);
        ell(ctx, tx + 4, ty, 4, 9, c.tail, OUT, 0.4);
      }
      legs(ctx, 0, 0, 4, '#f2a33a', s.step, 2);
      ell(ctx, 0, -11, 10, 9, c.body);
      ell(ctx, d === 'left' ? 3 : d === 'right' ? -3 : 0, -10, 5, 4.5, c.wing, OUT);
      if (back) {
        ell(ctx, -4, -14, 4, 9, c.tail2, OUT, -0.3);
        ell(ctx, 4, -14, 4, 9, c.tail, OUT, 0.3);
      }
      var hx = d === 'left' ? -5 : d === 'right' ? 5 : 0;
      ell(ctx, hx, -23, 7, 7, c.body);
      // crête
      for (var i = -1; i <= 1; i++) ell(ctx, hx + i * 3.2, -30.5 + Math.abs(i) * 0.8, 2.6, 3, c.comb, OUT);
      if (!back) {
        var bx = d === 'left' ? hx - 7 : d === 'right' ? hx + 7 : hx;
        tri(ctx, d === 'left' ? [bx - 3, -22, bx + 2, -24, bx + 2, -20] :
          d === 'right' ? [bx + 3, -22, bx - 2, -24, bx - 2, -20] : [bx - 3, -21, bx + 3, -21, bx, -17], '#f6b02c');
        ell(ctx, bx + (d === 'left' ? 2 : d === 'right' ? -2 : 0), -16.5, 2, 3, c.comb, OUT);
        eyes(ctx, hx, -25, 6, 1.5, d);
      }
    },

    agneau: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      legs(ctx, 0, 0, 5, '#4a4048', s.step, 3);
      // laine
      var blobs = [[-7, -10], [7, -10], [0, -6], [-5, -15], [5, -15], [0, -13]];
      blobs.forEach(function (b) { ell(ctx, b[0], b[1], 7, 6, c.body); });
      ell(ctx, 0, -11, 9, 6.5, c.body, false);
      var hx = d === 'left' ? -6 : d === 'right' ? 6 : 0;
      if (back) {
        ell(ctx, hx, -21, 6, 5, c.body);
        return;
      }
      // oreilles
      ell(ctx, hx - 7, -21, 4, 2, c.face, OUT, 0.3);
      ell(ctx, hx + 7, -21, 4, 2, c.face, OUT, -0.3);
      ell(ctx, hx, -20, 5.5, 6.5, c.face);
      ell(ctx, hx, -26, 5, 3, c.body); // houppette
      eyes(ctx, hx, -20, 5, 1.4, d, '#fff');
      ell(ctx, hx + (d === 'left' ? -1 : d === 'right' ? 1 : 0), -15.5, 1.5, 1, '#2a1d18', false);
      if (s.accessory === 'echarpe') {
        ctx.fillStyle = '#4f8fd8'; ctx.fillRect(hx - 6, -15, 12, 3);
      }
    },

    renard: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      // queue
      var tx = d === 'left' ? 11 : d === 'right' ? -11 : 9;
      var tilt = Math.sin(s.t * 3) * 0.15;
      ell(ctx, tx, -9, 5, 10, c.body, OUT, (d === 'left' ? 0.9 : d === 'right' ? -0.9 : 0.6) + tilt);
      ell(ctx, tx + (d === 'right' ? -4 : 4) * (d === 'left' || d === 'down' || back ? 1 : 1), -2, 3, 3, '#fff', OUT);
      legs(ctx, 0, 0, 4, c.dark, s.step, 3);
      ell(ctx, 0, -11, 8.5, 9, c.body);
      if (!back) ell(ctx, d === 'left' ? -2 : d === 'right' ? 2 : 0, -10, 4.5, 6, c.chest, OUT);
      var hx = d === 'left' ? -5 : d === 'right' ? 5 : 0;
      // oreilles
      tri(ctx, [hx - 8, -24, hx - 2, -26, hx - 7, -34], c.body);
      tri(ctx, [hx + 8, -24, hx + 2, -26, hx + 7, -34], c.body);
      tri(ctx, [hx - 7.5, -30, hx - 5.5, -29, hx - 7, -34], c.dark, false);
      tri(ctx, [hx + 7.5, -30, hx + 5.5, -29, hx + 7, -34], c.dark, false);
      ell(ctx, hx, -23, 8, 7, c.body);
      if (back) return;
      var mx = d === 'left' ? hx - 4 : d === 'right' ? hx + 4 : hx;
      tri(ctx, [mx - 5, -22, mx + 5, -22, mx, -15], c.chest);
      ell(ctx, mx, -16, 1.6, 1.3, '#2a1d18', false);
      eyes(ctx, hx, -24, 7, 1.4, d);
      // sourcils sûrs d'eux
      if (d === 'down') {
        ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(hx - 6, -28); ctx.lineTo(hx - 2, -27); ctx.moveTo(hx + 6, -28); ctx.lineTo(hx + 2, -27); ctx.stroke();
      }
    },

    cochon: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      legs(ctx, 0, 0, 5, c.dark, s.step, 3);
      ell(ctx, 0, -11, 11, 9.5, c.body);
      // queue en tire-bouchon
      ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      var qx = d === 'left' ? 11 : d === 'right' ? -11 : 0, qy = back ? -10 : -14;
      if (back || d !== 'down') { ctx.beginPath(); ctx.arc(qx, qy, 2.5, 0, Math.PI * 1.6); ctx.stroke(); }
      var hx = d === 'left' ? -6 : d === 'right' ? 6 : 0;
      tri(ctx, [hx - 8, -25, hx - 3, -28, hx - 9, -32], c.dark);
      tri(ctx, [hx + 8, -25, hx + 3, -28, hx + 9, -32], c.dark);
      ell(ctx, hx, -23, 8.5, 7.5, c.body);
      if (back) return;
      var sx = d === 'left' ? hx - 5 : d === 'right' ? hx + 5 : hx;
      ell(ctx, sx, -20, 4.5, 3.2, c.snout);
      ell(ctx, sx - 1.5, -20, 0.9, 1.3, '#7a3346', false);
      ell(ctx, sx + 1.5, -20, 0.9, 1.3, '#7a3346', false);
      eyes(ctx, hx, -26, 7, 1.4, d);
      ell(ctx, hx - 6, -22, 1.8, 1.1, 'rgba(255,90,120,0.35)', false);
      ell(ctx, hx + 6, -22, 1.8, 1.1, 'rgba(255,90,120,0.35)', false);
    },

    cheval: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      var side = d === 'left' || d === 'right';
      var dirx = d === 'left' ? -1 : 1;
      // queue
      ell(ctx, side ? -dirx * 14 : 0, back ? -12 : -18, 3, 9, c.mane, OUT, side ? dirx * 0.5 : 0);
      ctx.save();
      legs(ctx, -5, 0, 3, c.dark, s.step, 4);
      legs(ctx, 5, 0, 3, c.dark, s.step + 1.5, 4);
      ctx.restore();
      ell(ctx, 0, -14, side ? 15 : 11, 11, c.body);
      var hx = side ? dirx * 9 : 0;
      // cou + tête
      ell(ctx, hx, -28, 6.5, 10, c.body);
      // crinière
      ell(ctx, hx - (side ? dirx * 4 : 0), -31, side ? 3 : 5, 8, c.mane, OUT);
      tri(ctx, [hx - 6, -36, hx - 2, -37, hx - 5, -43], c.body);
      tri(ctx, [hx + 6, -36, hx + 2, -37, hx + 5, -43], c.body);
      if (back) return;
      var mx = side ? hx + dirx * 4 : hx;
      ell(ctx, mx, -21, 5, 4, c.muzzle);
      ell(ctx, mx - 1.8, -20.5, 0.8, 1, '#2a1d18', false);
      ell(ctx, mx + 1.8, -20.5, 0.8, 1, '#2a1d18', false);
      eyes(ctx, hx, -30, 7, 1.5, d);
      if (d === 'down') ell(ctx, hx, -35, 2, 1.4, '#fff', false); // liste blanche
    },

    chien: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      var tx = d === 'left' ? 10 : d === 'right' ? -10 : 0;
      var wag = Math.sin(s.t * (s.happy ? 18 : 6)) * 0.5;
      if (d !== 'down') ell(ctx, tx, back ? -6 : -14, 2.5, 6, c.body, OUT, wag + (d === 'left' ? 0.8 : d === 'right' ? -0.8 : 0));
      legs(ctx, 0, 0, 4.5, c.body, s.step, 3);
      ell(ctx, 0, -11, 9.5, 9, c.body);
      if (!back) ell(ctx, d === 'left' ? -2 : d === 'right' ? 2 : 0, -9, 4.5, 5.5, c.chest, OUT);
      var hx = d === 'left' ? -5 : d === 'right' ? 5 : 0;
      ell(ctx, hx, -23, 8, 7.5, c.body);
      // oreilles tombantes
      ell(ctx, hx - 8, -21, 3, 6, c.ears, OUT, 0.25);
      ell(ctx, hx + 8, -21, 3, 6, c.ears, OUT, -0.25);
      // collier
      ctx.fillStyle = '#d93a3a'; ctx.fillRect(hx - 6, -17.5, 12, 2.5);
      ell(ctx, hx, -14.5, 1.6, 1.6, '#f2c94c', OUT);
      if (back) return;
      var mx = d === 'left' ? hx - 4 : d === 'right' ? hx + 4 : hx;
      ell(ctx, mx, -20, 4, 3, c.chest);
      ell(ctx, mx, -21.5, 1.8, 1.3, '#2a1d18', false);
      eyes(ctx, hx, -25, 7, 1.5, d);
    },

    chouette: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      legs(ctx, 0, 0, 3, '#e3a43a', s.step, 2);
      ell(ctx, 0, -14, 10, 13, c.body);
      ell(ctx, 0, -10, 6, 8, c.belly, OUT);
      tri(ctx, [-9, -24, -4, -26, -9, -31], c.body);
      tri(ctx, [9, -24, 4, -26, 9, -31], c.body);
      if (back) return;
      ell(ctx, -4, -21, 4, 4, '#fffaf0');
      ell(ctx, 4, -21, 4, 4, '#fffaf0');
      ell(ctx, -4, -21, 1.6, 1.8, '#2a1d18', false);
      ell(ctx, 4, -21, 1.6, 1.8, '#2a1d18', false);
      ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(-4, -21, 4.8, 0, Math.PI * 2); ctx.arc(4, -21, 4.8, 0, Math.PI * 2); ctx.stroke();
      tri(ctx, [-1.8, -18, 1.8, -18, 0, -14.5], '#e3a43a');
    }
  };

  C.Sprites = {
    species: SPECIES,
    /* Dessine un animal : (x, y) = position des pattes */
    draw: function (ctx, ch, x, y, o) {
      o = o || {};
      var t = o.t || 0;
      var bob = o.moving ? Math.abs(Math.sin(t * 12)) * 2 : Math.sin(t * 2.2) * 0.6;
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      // ombre
      ctx.fillStyle = 'rgba(30,40,20,0.22)';
      ctx.beginPath(); ctx.ellipse(0, 0, ch.species === 'cheval' ? 17 : 12, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      var sc = (ch.scale || 1) * (o.scale || 1);
      ctx.scale(sc, sc);
      ctx.translate(0, -bob);
      var fn = SPECIES[ch.species] || SPECIES.coq;
      fn(ctx, o.dir || 'down', {
        colors: ch.colors || {}, t: t, step: o.moving ? t * 12 : 0,
        accessory: o.accessory, happy: o.happy
      });
      ctx.restore();
    },
    /* Portrait pour la boîte de dialogue et le carnet */
    portrait: function (canvas, ch, opt) {
      var ctx = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!opt || opt.bg !== false) {
        var g = ctx.createRadialGradient(w / 2, h * 0.45, 4, w / 2, h / 2, w * 0.7);
        g.addColorStop(0, (ch.colors && ch.colors.bg) || '#fbe7c6');
        g.addColorStop(1, (ch.colors && ch.colors.bg2) || '#e9b97a');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      var big = ch.species === 'cheval' ? 1.7 : 2.4;
      var s = (w / 64) * big;
      ctx.save();
      ctx.translate(w / 2, h * (ch.species === 'cheval' ? 0.95 : 0.9));
      ctx.scale(s, s);
      var fn = SPECIES[ch.species] || SPECIES.coq;
      fn(ctx, 'down', { colors: ch.colors || {}, t: 0, step: 0 });
      ctx.restore();
      if (opt && opt.unknown) {
        ctx.fillStyle = 'rgba(40,30,50,0.55)'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.round(w * 0.4) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2);
      }
    }
  };
})(window.CDC);
