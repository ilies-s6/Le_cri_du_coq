/* Dessin des personnages en vectoriel (aucune image nécessaire).
   Chaque espèce a une fonction de dessin. Les vêtements (outfit), les accessoires
   et les expressions (mood) sont communs à toutes les espèces.
   Pour ajouter une espèce : ajoute une entrée dans SPECIES puis utilise son nom
   dans characters.js (species: 'monespece'). */
(function (C) {
  var OUT = '#2b2230';

  function ell(ctx, x, y, rx, ry, fill, stroke, rot) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot || 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke !== false) { ctx.strokeStyle = stroke || OUT; ctx.lineWidth = 1.6; ctx.stroke(); }
  }
  function tri(ctx, pts, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke !== false) { ctx.strokeStyle = stroke || OUT; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke(); }
  }
  function rr(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke !== false) { ctx.strokeStyle = stroke || OUT; ctx.lineWidth = 1.4; ctx.stroke(); }
  }
  function line(ctx, pts, col, w) {
    ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
    ctx.strokeStyle = col || OUT; ctx.lineWidth = w || 1.4; ctx.lineCap = 'round'; ctx.stroke();
  }
  function side(d) { return d === 'left' ? -1 : d === 'right' ? 1 : 0; }
  function legs(ctx, x, y, spread, col, step, h, shoe) {
    var a = Math.sin(step) * 2.5;
    ell(ctx, x - spread, y - 1 + a * 0.4, 3.2, h || 3, shoe || col);
    ell(ctx, x + spread, y - 1 - a * 0.4, 3.2, h || 3, shoe || col);
  }

  /* ---------- Expressions ----------
     mood : neutral, happy, sad, angry, worried, smug, surprised, shy */
  function face(ctx, d, s, hx, ey, gap, er, my, o) {
    if (d === 'up') return;
    o = o || {};
    var mood = s.mood || 'neutral';
    var sd = side(d), off = sd * 2;
    var xs = sd ? [hx + sd * gap * 0.6] : [hx - gap / 2, hx + gap / 2];
    var eyeCol = o.eyeCol || '#2a1d18';
    var blink = s.blink;
    xs.forEach(function (ex, i) {
      ex += off * 0.3;
      var dirIn = sd ? -sd : (i === 0 ? 1 : -1);   // vers le centre du visage
      if (blink || mood === 'happy') {
        ctx.beginPath();
        if (mood === 'happy') ctx.arc(ex, ey + er * 0.4, er * 1.1, Math.PI * 1.1, Math.PI * 1.9);
        else { ctx.moveTo(ex - er, ey); ctx.lineTo(ex + er, ey); }
        ctx.strokeStyle = eyeCol; ctx.lineWidth = 1.4; ctx.stroke();
      } else {
        var dy = (mood === 'sad' || mood === 'shy') ? er * 0.35 : 0;
        var rr2 = mood === 'surprised' ? er * 1.25 : er;
        ell(ctx, ex, ey + dy, rr2, rr2 * 1.15, eyeCol, false);
        ell(ctx, ex + rr2 * 0.35, ey + dy - rr2 * 0.4, rr2 * 0.38, rr2 * 0.38, o.eyeCol === '#fff' ? '#2a1d18' : '#fff', false);
        if (mood === 'smug') { ctx.fillStyle = o.lid || s.colors.body || '#ccc'; ctx.fillRect(ex - rr2 - 0.5, ey - rr2 * 1.4, rr2 * 2 + 1, rr2 * 1.1); }
      }
      // sourcils
      var by = ey - er * 2.4, bl = er * 1.4;
      var tilt = 0;
      if (mood === 'angry') tilt = 1.3; else if (mood === 'sad' || mood === 'worried' || mood === 'shy') tilt = -1.2; else if (mood === 'smug') tilt = i === 0 ? 0.6 : -0.4; else if (mood === 'surprised') tilt = -0.2;
      if (tilt || o.brows) {
        var inX = ex + dirIn * bl * 0.6, outX = ex - dirIn * bl * 0.6;
        line(ctx, [outX, by - (mood === 'surprised' ? 1.2 : 0), inX, by + tilt], o.browCol || OUT, 1.3);
      }
    });
    if (my == null) return;
    var mx = hx + (o.mouthDx != null ? o.mouthDx : sd * 2.5);
    var w = o.mouthW || 2.6;
    ctx.strokeStyle = o.mouthCol || OUT; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
    ctx.beginPath();
    if (mood === 'happy') { ctx.arc(mx, my - 1, w, 0.15 * Math.PI, 0.85 * Math.PI); }
    else if (mood === 'smug') { ctx.moveTo(mx - w, my); ctx.quadraticCurveTo(mx + w * 0.3, my + 1.2, mx + w, my - 1.4); }
    else if (mood === 'sad') { ctx.arc(mx, my + 2, w * 0.8, 1.15 * Math.PI, 1.85 * Math.PI); }
    else if (mood === 'angry') { ctx.moveTo(mx - w, my + 0.6); ctx.lineTo(mx + w, my - 0.2); }
    else if (mood === 'worried' || mood === 'shy') { ctx.moveTo(mx - w, my); ctx.quadraticCurveTo(mx - w / 2, my - 1, mx, my); ctx.quadraticCurveTo(mx + w / 2, my + 1, mx + w, my); }
    else if (mood === 'surprised') { ctx.ellipse(mx, my, 1.3, 1.8, 0, 0, Math.PI * 2); }
    else { ctx.moveTo(mx - w * 0.7, my); ctx.quadraticCurveTo(mx, my + 0.8, mx + w * 0.7, my); }
    ctx.stroke();
    if (mood === 'shy' || mood === 'happy') {
      ell(ctx, hx - gap * 0.85, ey + er * 2, 1.8, 1.1, 'rgba(255,110,130,0.35)', false);
      if (!sd) ell(ctx, hx + gap * 0.85, ey + er * 2, 1.8, 1.1, 'rgba(255,110,130,0.35)', false);
    }
  }

  /* ---------- Vêtements ----------
     outfit : { top: 'hoodie'|'tshirt'|'jacket'|'cardigan'|'tracksuit'|'sweater',
                main, trim, bag (couleur du sac ou false), acc: ['glasses', 'cap', ...] } */
  function dress(ctx, d, s, cx, cy, rx, ry) {
    var o = s.outfit; if (!o) return;
    var back = d === 'up', sd = side(d);
    var main = o.main || '#5b7db1', trim = o.trim || '#ffffff';
    // sac à dos vu de côté : derrière le corps
    if (o.bag && sd) rr(ctx, cx - sd * rx - (sd > 0 ? 6 : -1), cy - ry * 0.7, 7, ry * 1.4, 2.5, o.bag);
    // haut
    ctx.save();
    ell(ctx, cx, cy + 0.5, rx * 0.98, ry * 0.92, main);
    ctx.restore();
    // manches
    if (!sd) {
      ell(ctx, cx - rx * 0.95, cy + 1, 2.6, ry * 0.55, main, OUT, 0.2);
      ell(ctx, cx + rx * 0.95, cy + 1, 2.6, ry * 0.55, main, OUT, -0.2);
    } else ell(ctx, cx + sd * 1.5, cy + 1.5, 2.6, ry * 0.55, main, OUT, sd * 0.25);
    var top = o.top || 'tshirt';
    if (!back) {
      if (top === 'hoodie') {
        ell(ctx, cx + sd * 2, cy - ry * 0.75, rx * 0.62, 2.6, o.trim || main);
        if (!sd) { line(ctx, [cx - 2, cy - ry * 0.6, cx - 2.3, cy - ry * 0.1], trim, 1); line(ctx, [cx + 2, cy - ry * 0.6, cx + 2.3, cy - ry * 0.1], trim, 1); }
        rr(ctx, cx - rx * 0.45 + sd * 2, cy + ry * 0.15, rx * 0.9, ry * 0.42, 2, 'rgba(0,0,0,0.12)', false);
      } else if (top === 'jacket' || top === 'cardigan' || top === 'tracksuit') {
        tri(ctx, [cx - 3 + sd * 2, cy - ry * 0.75, cx + 3 + sd * 2, cy - ry * 0.75, cx + sd * 2, cy + ry * 0.1], o.inner || '#f4f1ea', false);
        line(ctx, [cx + sd * 2, cy - ry * 0.1, cx + sd * 2, cy + ry * 0.85], 'rgba(0,0,0,0.35)', 1);
        if (top === 'tracksuit') { line(ctx, [cx - rx * 0.7, cy - ry * 0.3, cx - rx * 0.75, cy + ry * 0.7], trim, 1.4); line(ctx, [cx + rx * 0.7, cy - ry * 0.3, cx + rx * 0.75, cy + ry * 0.7], trim, 1.4); }
        if (top === 'cardigan') { ell(ctx, cx + 2.5 + sd, cy + ry * 0.2, 0.8, 0.8, trim, false); ell(ctx, cx + 2.5 + sd, cy + ry * 0.5, 0.8, 0.8, trim, false); }
      } else if (top === 'sweater') {
        line(ctx, [cx - rx * 0.8, cy + ry * 0.55, cx + rx * 0.8, cy + ry * 0.55], trim, 1.6);
        ell(ctx, cx + sd * 2, cy - ry * 0.75, rx * 0.45, 1.8, trim, false);
      } else {
        // t-shirt avec petit logo
        ell(ctx, cx + sd * 2, cy - ry * 0.78, rx * 0.4, 1.5, 'rgba(0,0,0,0.18)', false);
        if (o.logo !== false) ell(ctx, cx + sd * 2.5, cy - 0.5, 2.2, 1.6, trim, false);
      }
      // bretelles du sac à dos
      if (o.bag && !sd) { line(ctx, [cx - rx * 0.55, cy - ry * 0.8, cx - rx * 0.62, cy + ry * 0.35], o.bag, 1.8); line(ctx, [cx + rx * 0.55, cy - ry * 0.8, cx + rx * 0.62, cy + ry * 0.35], o.bag, 1.8); }
    } else {
      if (top === 'hoodie') ell(ctx, cx, cy - ry * 0.6, rx * 0.6, 3.4, o.trim || main);
      if (top === 'tracksuit') { line(ctx, [cx - rx * 0.7, cy - ry * 0.3, cx - rx * 0.75, cy + ry * 0.7], trim, 1.4); line(ctx, [cx + rx * 0.7, cy - ry * 0.3, cx + rx * 0.75, cy + ry * 0.7], trim, 1.4); }
      if (o.bag) { rr(ctx, cx - rx * 0.7, cy - ry * 0.75, rx * 1.4, ry * 1.45, 4, o.bag); rr(ctx, cx - rx * 0.45, cy + ry * 0.05, rx * 0.9, ry * 0.45, 2, 'rgba(0,0,0,0.15)', false); }
    }
  }

  /* Accessoires sur la tête (h = { x, y, r } : centre et rayon de la tête) */
  var ACC = {
    glasses: function (ctx, d, h, o) {
      if (d === 'up') return;
      var sd = side(d), ey = h.ey, gap = h.gap;
      var xs = sd ? [h.x + sd * gap * 0.6 + sd * 0.6] : [h.x - gap / 2, h.x + gap / 2];
      ctx.strokeStyle = o.glasses || '#2b2230'; ctx.lineWidth = 1.1;
      xs.forEach(function (x) { ctx.beginPath(); ctx.arc(x, ey, h.er * 2.1, 0, Math.PI * 2); ctx.stroke(); });
      if (!sd) line(ctx, [xs[0] + h.er * 2.1, ey, xs[1] - h.er * 2.1, ey], o.glasses || '#2b2230', 1);
    },
    cap: function (ctx, d, h, o) {
      var sd = side(d), col = o.cap || '#e2574c';
      ctx.beginPath(); ctx.ellipse(h.x, h.y - h.r * 0.45, h.r * 1.02, h.r * 0.72, 0, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.4; ctx.stroke();
      if (d === 'down') ell(ctx, h.x, h.y - h.r * 0.42, h.r * 0.95, 2.4, o.cap2 || col);
      else if (sd) ell(ctx, h.x + sd * h.r * 0.95, h.y - h.r * 0.42, h.r * 0.6, 1.8, o.cap2 || col);
      ell(ctx, h.x, h.y - h.r * 1.1, 1.3, 1, o.cap2 || '#fff', false);
    },
    beanie: function (ctx, d, h, o) {
      var col = o.beanie || '#f2b84b';
      ctx.beginPath(); ctx.ellipse(h.x, h.y - h.r * 0.35, h.r * 0.98, h.r * 0.85, 0, Math.PI, 0); ctx.closePath();
      ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.4; ctx.stroke();
      rr(ctx, h.x - h.r, h.y - h.r * 0.5, h.r * 2, 3.4, 1.5, o.beanie2 || '#fff');
      ell(ctx, h.x, h.y - h.r * 1.25, 2.4, 2.4, o.beanie2 || '#fff');
    },
    headphones: function (ctx, d, h, o) {
      var col = o.phones || '#3a3f55', sd = side(d);
      ctx.beginPath(); ctx.arc(h.x, h.y - 1, h.r * 1.05, Math.PI * 1.05, Math.PI * 1.95);
      ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke();
      if (!sd || d === 'up') { rr(ctx, h.x - h.r * 1.15, h.y - 3, 3.4, 6, 1.5, o.phones2 || '#7fd1c7'); rr(ctx, h.x + h.r * 1.15 - 3.4, h.y - 3, 3.4, 6, 1.5, o.phones2 || '#7fd1c7'); }
      else rr(ctx, h.x - sd * 1.5 - 2, h.y - 3, 4, 6, 1.5, o.phones2 || '#7fd1c7');
    },
    headband: function (ctx, d, h, o) {
      ctx.beginPath(); ctx.arc(h.x, h.y + 1, h.r * 0.98, Math.PI * 1.12, Math.PI * 1.88);
      ctx.strokeStyle = o.band || '#ff6b6b'; ctx.lineWidth = 2.6; ctx.stroke();
    },
    clip: function (ctx, d, h, o) {
      if (d === 'up') return;
      var x = h.x + (d === 'left' ? 3 : -h.r * 0.6), y = h.y - h.r * 0.75;
      ctx.save(); ctx.translate(x, y); ctx.fillStyle = o.clip || '#ffd166';
      ctx.beginPath(); for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 1.2 : 2.8; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 0.8; ctx.stroke(); ctx.restore();
    },
    lanyard: function (ctx, d, h, o) {
      if (d === 'up') return;
      var sd = side(d), x = h.x + sd * 1.5, y0 = h.y + h.r * 0.9;
      line(ctx, [x - 3, y0, x, y0 + 7, x + 3, y0], o.lanyard || '#3d7cc9', 1);
      rr(ctx, x - 2.2, y0 + 6.5, 4.4, 5, 1, '#fff');
    },
    whistle: function (ctx, d, h, o) {
      if (d === 'up') return;
      var x = h.x + side(d) * 1.5, y0 = h.y + h.r * 0.9;
      line(ctx, [x - 3, y0, x, y0 + 6, x + 3, y0], '#e2574c', 1);
      ell(ctx, x, y0 + 7, 2, 1.5, '#d8d8d8');
    }
  };

  /* ---------- Espèces ----------
     Chaque fonction dessine l'animal (pattes en 0,0) et renvoie la position de la tête
     { x, y, r, ey, er, gap } pour placer les accessoires. */
  var SPECIES = {
    coq: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      var tx = -sd * 9, ty = back ? -10 : -20;
      if (!back) { ell(ctx, tx - 4, ty, 4, 9, c.tail2, OUT, -0.4); ell(ctx, tx + 4, ty, 4, 9, c.tail, OUT, 0.4); }
      legs(ctx, 0, 0, 4, '#f2a33a', s.step, 2, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 10, 9, c.body);
      dress(ctx, d, s, 0, -11, 10, 9);
      if (back) { ell(ctx, -4, -14, 4, 9, c.tail2, OUT, -0.3); ell(ctx, 4, -14, 4, 9, c.tail, OUT, 0.3); if (s.outfit && s.outfit.bag) rr(ctx, -7, -18, 14, 13, 4, s.outfit.bag); }
      var hx = sd * 5;
      ell(ctx, hx, -23, 7, 7, c.body);
      for (var i = -1; i <= 1; i++) ell(ctx, hx + i * 3.2, -30.5 + Math.abs(i) * 0.8, 2.6, 3, c.comb, OUT);
      if (!back) {
        var bx = hx + sd * 7;
        var open = s.mood === 'surprised' || s.talk;
        tri(ctx, sd < 0 ? [bx - 3, -22, bx + 2, -24, bx + 2, -20] :
          sd > 0 ? [bx + 3, -22, bx - 2, -24, bx - 2, -20] : [bx - 3, -21, bx + 3, -21, bx, open ? -16 : -17], '#f6b02c');
        ell(ctx, bx - sd * 2, -16.5, 2, 3, c.comb, OUT);
        face(ctx, d, s, hx, -25, 6, 1.5, null);
      }
      return { x: hx, y: -24, r: 7, ey: -25, er: 1.5, gap: 6 };
    },

    agneau: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      legs(ctx, 0, 0, 5, '#4a4048', s.step, 3, s.outfit && s.outfit.shoes);
      var blobs = [[-7, -10], [7, -10], [0, -6], [-5, -15], [5, -15], [0, -13]];
      blobs.forEach(function (b) { ell(ctx, b[0], b[1], 7, 6, c.body); });
      ell(ctx, 0, -11, 9, 6.5, c.body, false);
      dress(ctx, d, s, 0, -10.5, 10, 8.5);
      var hx = sd * 6;
      if (back) { ell(ctx, hx, -21, 6, 5, c.body); ell(ctx, hx, -24, 6, 4, c.body); return { x: hx, y: -22, r: 6.5, ey: -20, er: 1.4, gap: 5 }; }
      ell(ctx, hx - 7, -21, 4, 2, c.face, OUT, 0.3);
      ell(ctx, hx + 7, -21, 4, 2, c.face, OUT, -0.3);
      ell(ctx, hx, -20, 5.5, 6.5, c.face);
      ell(ctx, hx, -26, 5.5, 3.2, c.body);
      ell(ctx, hx + sd, -15.8, 1.5, 1, '#2a1d18', false);
      face(ctx, d, s, hx, -20.5, 5, 1.3, -14.6, { eyeCol: '#fff', mouthCol: '#fff', mouthW: 1.8, mouthDx: sd, browCol: '#fff' });
      if (s.accessory === 'echarpe') { ctx.fillStyle = '#4f8fd8'; ctx.fillRect(hx - 6, -14, 12, 3); }
      return { x: hx, y: -22, r: 6.2, ey: -20.5, er: 1.3, gap: 5 };
    },

    renard: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      var tx = sd ? -sd * 11 : 9;
      var tilt = Math.sin(s.t * 3) * 0.15;
      ell(ctx, tx, -9, 5, 10, c.body, OUT, (sd ? -sd * 0.9 : 0.6) + tilt);
      ell(ctx, tx + (sd > 0 ? -4 : 4), -2, 3, 3, '#fff', OUT);
      legs(ctx, 0, 0, 4, c.dark, s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 8.5, 9, c.body);
      dress(ctx, d, s, 0, -11, 9, 8.5);
      var hx = sd * 5;
      tri(ctx, [hx - 8, -24, hx - 2, -26, hx - 7, -34], c.body);
      tri(ctx, [hx + 8, -24, hx + 2, -26, hx + 7, -34], c.body);
      tri(ctx, [hx - 7.5, -30, hx - 5.5, -29, hx - 7, -34], c.dark, false);
      tri(ctx, [hx + 7.5, -30, hx + 5.5, -29, hx + 7, -34], c.dark, false);
      ell(ctx, hx, -23, 8, 7, c.body);
      if (!back) {
        var mx = hx + sd * 4;
        tri(ctx, [mx - 5, -22, mx + 5, -22, mx, -15], c.chest);
        ell(ctx, mx, -16, 1.6, 1.3, '#2a1d18', false);
        face(ctx, d, s, hx, -24.5, 7, 1.4, -18.5, { mouthW: 2, brows: true, lid: c.body });
      }
      return { x: hx, y: -24, r: 8, ey: -24.5, er: 1.4, gap: 7 };
    },

    cochon: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      legs(ctx, 0, 0, 5, c.dark, s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 11, 9.5, c.body);
      dress(ctx, d, s, 0, -11, 11, 9);
      ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
      var qx = -sd * 11, qy = back ? -10 : -14;
      if (back || sd) { ctx.beginPath(); ctx.arc(qx, qy, 2.5, 0, Math.PI * 1.6); ctx.stroke(); }
      var hx = sd * 6;
      tri(ctx, [hx - 8, -25, hx - 3, -28, hx - 9, -32], c.dark);
      tri(ctx, [hx + 8, -25, hx + 3, -28, hx + 9, -32], c.dark);
      ell(ctx, hx, -23, 8.5, 7.5, c.body);
      if (!back) {
        var sx = hx + sd * 5;
        ell(ctx, sx, -21, 4.5, 3.2, c.snout);
        ell(ctx, sx - 1.5, -21, 0.9, 1.3, '#7a3346', false);
        ell(ctx, sx + 1.5, -21, 0.9, 1.3, '#7a3346', false);
        face(ctx, d, s, hx, -26, 7, 1.4, -17, { mouthW: 2.4, lid: c.body });
        if (s.mood !== 'happy' && s.mood !== 'shy') { ell(ctx, hx - 6, -22, 1.8, 1.1, 'rgba(255,90,120,0.3)', false); ell(ctx, hx + 6, -22, 1.8, 1.1, 'rgba(255,90,120,0.3)', false); }
      }
      return { x: hx, y: -24, r: 8.5, ey: -26, er: 1.4, gap: 7 };
    },

    cheval: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      var dirx = d === 'left' ? -1 : 1;
      ell(ctx, sd ? -dirx * 13 : 0, back ? -12 : -16, 3, 9, c.mane, OUT, sd ? dirx * 0.5 : 0);
      legs(ctx, -5, 0, 2.5, c.dark, s.step, 3.5, s.outfit && s.outfit.shoes);
      legs(ctx, 5, 0, 2.5, c.dark, s.step + 1.5, 3.5, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -13, sd ? 12 : 10, 10.5, c.body);
      dress(ctx, d, s, 0, -13, sd ? 11 : 10, 10);
      var hx = sd ? dirx * 6 : 0;
      ell(ctx, hx, -28, 6.5, 9, c.body);
      ell(ctx, hx - sd * 4, -31, sd ? 3 : 5, 8, c.mane, OUT);
      tri(ctx, [hx - 6, -35, hx - 2, -36, hx - 5, -42], c.body);
      tri(ctx, [hx + 6, -35, hx + 2, -36, hx + 5, -42], c.body);
      if (!back) {
        var mx = sd ? hx + dirx * 3 : hx;
        ell(ctx, mx, -22, 5, 4, c.muzzle);
        ell(ctx, mx - 1.8, -22.5, 0.8, 1, '#2a1d18', false);
        ell(ctx, mx + 1.8, -22.5, 0.8, 1, '#2a1d18', false);
        face(ctx, d, s, hx, -30, 7, 1.5, -19.6, { mouthW: 2, lid: c.body });
        if (d === 'down') ell(ctx, hx, -35, 2, 1.4, '#fff', false);
      }
      return { x: hx, y: -31, r: 7, ey: -30, er: 1.5, gap: 7 };
    },

    chien: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      var tx = -sd * 10;
      var wag = Math.sin(s.t * (s.mood === 'happy' ? 18 : 6)) * 0.5;
      if (d !== 'down') ell(ctx, tx, back ? -6 : -14, 2.5, 6, c.body, OUT, wag - sd * 0.8);
      legs(ctx, 0, 0, 4.5, c.body, s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 9.5, 9, c.body);
      dress(ctx, d, s, 0, -11, 9.5, 8.5);
      var hx = sd * 5;
      ell(ctx, hx, -23, 8, 7.5, c.body);
      if (c.spots) { ell(ctx, hx + 3, -26, 2.2, 1.8, c.spots, false); ell(ctx, hx - 4, -21, 1.6, 1.4, c.spots, false); }
      ell(ctx, hx - 8, -21, 3, 6, c.ears, OUT, 0.25);
      ell(ctx, hx + 8, -21, 3, 6, c.ears, OUT, -0.25);
      if (!back) {
        var mx = hx + sd * 4;
        ell(ctx, mx, -20, 4, 3, c.chest);
        ell(ctx, mx, -21.5, 1.8, 1.3, '#2a1d18', false);
        face(ctx, d, s, hx, -25, 7, 1.5, -18.2, { mouthW: 2, lid: c.body });
      }
      return { x: hx, y: -24, r: 8, ey: -25, er: 1.5, gap: 7 };
    },

    chouette: function (ctx, d, s) {
      var c = s.colors, back = d === 'up';
      legs(ctx, 0, 0, 3, '#e3a43a', s.step, 2);
      ell(ctx, 0, -14, 10, 13, c.body);
      dress(ctx, d, s, 0, -11, 10, 9);
      tri(ctx, [-9, -24, -4, -26, -9, -31], c.body);
      tri(ctx, [9, -24, 4, -26, 9, -31], c.body);
      ell(ctx, 0, -22, 9, 7, c.body, false);
      if (!back) {
        ell(ctx, -4, -21, 4, 4, '#fffaf0');
        ell(ctx, 4, -21, 4, 4, '#fffaf0');
        face(ctx, d, s, 0, -21, 8, 1.6, null, { brows: false });
        ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(-4, -21, 4.6, 0, Math.PI * 2); ctx.moveTo(8.6, -21); ctx.arc(4, -21, 4.6, 0, Math.PI * 2); ctx.stroke();
        tri(ctx, [-1.8, -18, 1.8, -18, 0, -14.5], '#e3a43a');
      }
      return { x: 0, y: -23, r: 9, ey: -21, er: 1.6, gap: 8 };
    },

    chat: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      var sw = Math.sin(s.t * 2.5) * 0.25;
      ctx.beginPath(); ctx.moveTo(-sd * 7 || 6, -6);
      ctx.quadraticCurveTo((-sd * 16) || 14, -10 + sw * 6, (-sd * 12) || 12, -22);
      ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
      ctx.strokeStyle = c.body; ctx.lineWidth = 3; ctx.stroke();
      legs(ctx, 0, 0, 4, c.body, s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 8.5, 9, c.body);
      dress(ctx, d, s, 0, -11, 8.5, 8.5);
      var hx = sd * 4;
      tri(ctx, [hx - 7.5, -25, hx - 2.5, -28, hx - 7, -34], c.body);
      tri(ctx, [hx + 7.5, -25, hx + 2.5, -28, hx + 7, -34], c.body);
      if (!back) { tri(ctx, [hx - 6.6, -27.5, hx - 4, -28.6, hx - 6.5, -31.6], c.ear || '#f4a7b9', false); tri(ctx, [hx + 6.6, -27.5, hx + 4, -28.6, hx + 6.5, -31.6], c.ear || '#f4a7b9', false); }
      ell(ctx, hx, -23, 8, 7, c.body);
      if (c.stripes) { line(ctx, [hx - 2, -29.5, hx - 1.5, -27], c.stripes, 1.4); line(ctx, [hx + 2, -29.5, hx + 1.5, -27], c.stripes, 1.4); line(ctx, [hx, -30, hx, -27.5], c.stripes, 1.4); }
      if (!back) {
        var mx = hx + sd * 3;
        ell(ctx, mx, -20, 3.6, 2.6, c.muzzle || '#fff', false);
        tri(ctx, [mx - 1.3, -21.6, mx + 1.3, -21.6, mx, -20.3], '#f08aa0', false);
        line(ctx, [mx - 3, -20.5, mx - 8, -21.5], 'rgba(40,30,40,0.5)', 0.7); line(ctx, [mx + 3, -20.5, mx + 8, -21.5], 'rgba(40,30,40,0.5)', 0.7);
        face(ctx, d, s, hx, -24.5, 7, 1.5, -18.1, { mouthW: 1.8, lid: c.body, eyeCol: c.eyes || '#2a1d18' });
      }
      return { x: hx, y: -24, r: 8, ey: -24.5, er: 1.5, gap: 7 };
    },

    lapin: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      if (sd || back) ell(ctx, -sd * 9, back ? -8 : -9, 3, 3, '#fff');
      legs(ctx, 0, 0, 4.5, c.body, s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 9, 9, c.body);
      dress(ctx, d, s, 0, -11, 9, 8.5);
      var hx = sd * 4;
      var droop = s.mood === 'sad' || s.mood === 'worried' || s.mood === 'shy' ? 0.5 : 0;
      ell(ctx, hx - 3.5, -35, 2.8, 8, c.body, OUT, -0.15 - droop);
      ell(ctx, hx + 3.5, -35, 2.8, 8, c.body, OUT, 0.15 + droop);
      if (!back) { ell(ctx, hx - 3.5, -35, 1.2, 5.5, c.ear || '#f4b6c2', false, -0.15 - droop); ell(ctx, hx + 3.5, -35, 1.2, 5.5, c.ear || '#f4b6c2', false, 0.15 + droop); }
      ell(ctx, hx, -23, 7.5, 7, c.body);
      if (!back) {
        var mx = hx + sd * 3;
        ell(ctx, mx, -19.5, 3.4, 2.4, c.muzzle || '#fff', false);
        ell(ctx, mx, -21, 1.3, 1, '#e07a8a', false);
        face(ctx, d, s, hx, -24.5, 6.5, 1.5, -17.6, { mouthW: 1.6, lid: c.body });
      }
      return { x: hx, y: -24, r: 7.5, ey: -24.5, er: 1.5, gap: 6.5 };
    },

    canard: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      legs(ctx, 0, 0, 4, '#f39c3d', s.step, 2, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -11, 10, 9, c.body);
      tri(ctx, [-sd * 9 - 2, -14, -sd * 14 - 1, -18, -sd * 9 + 3, -10], c.body);
      dress(ctx, d, s, 0, -11, 10, 8.5);
      var hx = sd * 4;
      ell(ctx, hx, -24, 7.5, 7.5, c.body);
      ell(ctx, hx - 1, -31, 2.4, 1.6, c.body, false);
      if (!back) {
        var bx = hx + sd * 6;
        ell(ctx, bx, -20.5, sd ? 4.5 : 4, 2.4, c.beak || '#f6a23c');
        face(ctx, d, s, hx, -25.5, 6.5, 1.5, null, { brows: true, lid: c.body });
      }
      return { x: hx, y: -25, r: 7.5, ey: -25.5, er: 1.5, gap: 6.5 };
    },

    blaireau: function (ctx, d, s) {
      var c = s.colors, back = d === 'up', sd = side(d);
      legs(ctx, 0, 0, 5, '#3b3438', s.step, 3, s.outfit && s.outfit.shoes);
      ell(ctx, 0, -12, 11, 10, c.body);
      dress(ctx, d, s, 0, -12, 11, 9.5);
      var hx = sd * 5;
      ell(ctx, hx - 6, -29, 2.6, 2.3, c.body);
      ell(ctx, hx + 6, -29, 2.6, 2.3, c.body);
      ell(ctx, hx, -24, 8.5, 7.5, '#f4f1ea');
      if (!back) {
        ell(ctx, hx - 3.6, -24, 2.3, 6.5, '#2f2a2e', false);
        ell(ctx, hx + 3.6, -24, 2.3, 6.5, '#2f2a2e', false);
        var mx = hx + sd * 4;
        ell(ctx, mx, -20, 2, 1.5, '#2a1d18', false);
        face(ctx, d, s, hx, -24.5, 7.2, 1.3, -17.6, { eyeCol: '#fff', mouthW: 2, browCol: '#f4f1ea' });
      } else ell(ctx, hx, -24, 8.5, 7.5, c.body);
      return { x: hx, y: -25, r: 8.5, ey: -24.5, er: 1.3, gap: 7.2 };
    }
  };

  function drawFigure(ctx, ch, dir, st) {
    var fn = SPECIES[ch.species] || SPECIES.coq;
    var h = fn(ctx, dir, st);
    var o = st.outfit;
    if (h && o && o.acc) C.arr(o.acc).forEach(function (a) { if (ACC[a]) ACC[a](ctx, dir, h, o); });
    return h;
  }

  function state(ch, o) {
    var t = o.t || 0;
    var phase = (ch.id ? ch.id.length * 1.7 : 0) + (o.seed || 0);
    var blink = o.blink != null ? o.blink : ((t + phase) % 4.2) < 0.13;
    return {
      colors: ch.colors || {}, t: t, step: o.moving ? t * 12 : 0, outfit: ch.outfit,
      accessory: o.accessory, happy: o.happy, mood: o.mood || (o.happy ? 'happy' : null), blink: blink, talk: o.talk
    };
  }

  C.Sprites = {
    species: SPECIES,
    acc: ACC,
    /* Dessine un personnage : (x, y) = position des pattes */
    draw: function (ctx, ch, x, y, o) {
      o = o || {};
      var t = o.t || 0;
      var bob = o.moving ? Math.abs(Math.sin(t * 12)) * 2 : Math.sin(t * 2.2) * 0.6;
      ctx.save();
      ctx.translate(Math.round(x), Math.round(y));
      ctx.fillStyle = 'rgba(20,24,40,0.22)';
      ctx.beginPath(); ctx.ellipse(0, 0, ch.species === 'cheval' ? 15 : 12, 4.5, 0, 0, Math.PI * 2); ctx.fill();
      var sc = (ch.scale || 1) * (o.scale || 1);
      ctx.scale(sc, sc);
      ctx.translate(0, -bob);
      drawFigure(ctx, ch, o.dir || 'down', state(ch, o));
      ctx.restore();
    },
    /* Portrait pour la boîte de dialogue, le carnet, le téléphone */
    portrait: function (canvas, ch, opt) {
      opt = opt || {};
      var ctx = canvas.getContext('2d');
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (opt.bg !== false) {
        var g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, (ch.colors && ch.colors.bg) || '#fbe7c6');
        g.addColorStop(1, (ch.colors && ch.colors.bg2) || '#e9b97a');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      var tall = ch.species === 'cheval' || ch.species === 'lapin';
      var big = tall ? 1.85 : 2.3;
      var s = (w / 64) * big;
      ctx.save();
      ctx.translate(w / 2, h * (tall ? 1.0 : 0.95));
      ctx.scale(s, s);
      drawFigure(ctx, ch, 'down', state(ch, { t: opt.t || 0, mood: opt.mood, blink: false, talk: opt.talk }));
      ctx.restore();
      if (opt.unknown) {
        ctx.fillStyle = 'rgba(30,30,50,0.6)'; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#fff'; ctx.font = 'bold ' + Math.round(w * 0.4) + 'px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', w / 2, h / 2);
      }
    }
  };
})(window.CDC);
