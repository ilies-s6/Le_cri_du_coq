/* Rendu : sols, décors, personnages, bulles, indicateurs.
   Pour ajouter un type de décor, ajoute une entrée dans C.PropTypes. */
(function (C) {
  var T = C.TILE;
  var OUT = '#3a2a22';

  function hash(x, y, s) {
    var h = (x * 374761393 + y * 668265263 + (s || 0) * 2147483647) | 0;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function rr(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke === true ? OUT : stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }
  function circ(ctx, x, y, r, fill, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke === true ? OUT : stroke; ctx.lineWidth = 2; ctx.stroke(); }
  }
  C.Draw = { rr: rr, circ: circ, hash: hash };

  /* ---------------- Sols ---------------- */
  var GROUND = {
    grass: function (ctx, x, y, tx, ty, t) {
      var v = hash(tx, ty);
      ctx.fillStyle = v < 0.5 ? '#8fcf5f' : '#88c85a';
      ctx.fillRect(x, y, T, T);
      if (v > 0.7) {
        ctx.strokeStyle = '#6fae45'; ctx.lineWidth = 1.5;
        var gx = x + 6 + hash(tx, ty, 2) * 18, gy = y + 10 + hash(tx, ty, 3) * 14;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx - 2, gy - 5); ctx.moveTo(gx + 3, gy); ctx.lineTo(gx + 4, gy - 6); ctx.stroke();
      }
    },
    flowers: function (ctx, x, y, tx, ty, t) {
      GROUND.grass(ctx, x, y, tx, ty, t);
      ctx.fillStyle = 'rgba(160,220,120,0.35)'; ctx.fillRect(x, y, T, T);
      if (hash(tx, ty, 5) > 0.55) {
        var cols = ['#fff3a8', '#ffb3c7', '#ffffff', '#c8b6ff'];
        var c = cols[Math.floor(hash(tx, ty, 6) * cols.length)];
        for (var i = 0; i < 3; i++) {
          var fx = x + 5 + hash(tx, ty, 10 + i) * 22, fy = y + 5 + hash(tx, ty, 20 + i) * 22;
          circ(ctx, fx, fy, 2.4, c); circ(ctx, fx, fy, 1, '#f2a33a');
        }
      }
    },
    field: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = (tx + ty) % 2 ? '#d9c46a' : '#d3bd62';
      ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(150,120,40,0.35)'; ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) {
        var sx = x + 4 + i * 10 + hash(tx, ty, i) * 4;
        ctx.beginPath(); ctx.moveTo(sx, y + 26); ctx.lineTo(sx + 1, y + 16); ctx.stroke();
      }
    },
    path: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#d8b07a'; ctx.fillRect(x, y, T, T);
      if (hash(tx, ty, 7) > 0.6) circ(ctx, x + 8 + hash(tx, ty, 8) * 16, y + 8 + hash(tx, ty, 9) * 16, 2, '#c49a64');
    },
    stone: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#e3d6bf'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = '#cdbd9f'; ctx.lineWidth = 1.5;
      var o = (ty % 2) * 8;
      ctx.beginPath();
      ctx.moveTo(x, y + 16); ctx.lineTo(x + T, y + 16);
      ctx.moveTo(x + o + 4, y); ctx.lineTo(x + o + 4, y + 16);
      ctx.moveTo(x + o + 20, y + 16); ctx.lineTo(x + o + 20, y + 32);
      ctx.stroke();
    },
    sand: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = (hash(tx, ty) > 0.5) ? '#f0d9a4' : '#eed49c'; ctx.fillRect(x, y, T, T);
      if (hash(tx, ty, 4) > 0.8) circ(ctx, x + 16, y + 16, 1.5, '#d8bb80');
    },
    soil: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#a9744a'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#9a6740';
      ctx.fillRect(x, y + 10, T, 3); ctx.fillRect(x, y + 24, T, 3);
    },
    crops: function (ctx, x, y, tx, ty, t) {
      GROUND.soil(ctx, x, y, tx, ty);
      var kind = (ty + Math.floor(tx / 7)) % 3;
      var sway = Math.sin(t * 2 + tx) * 1;
      if (kind === 0) { // carottes
        for (var i = 0; i < 2; i++) {
          var cx = x + 9 + i * 14;
          ctx.fillStyle = '#f08a2c'; ctx.beginPath(); ctx.moveTo(cx - 3, y + 20); ctx.lineTo(cx + 3, y + 20); ctx.lineTo(cx, y + 27); ctx.fill();
          ctx.strokeStyle = '#3e9a3a'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx, y + 20); ctx.lineTo(cx - 4 + sway, y + 10); ctx.moveTo(cx, y + 20); ctx.lineTo(cx + 4 + sway, y + 10); ctx.moveTo(cx, y + 20); ctx.lineTo(cx + sway, y + 8); ctx.stroke();
        }
      } else if (kind === 1) { // salades
        circ(ctx, x + 16, y + 17, 9, '#7fcf55', OUT); circ(ctx, x + 16, y + 17, 5, '#a8e27a');
      } else { // tomates
        ctx.strokeStyle = '#3e8a3a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + 16, y + 28); ctx.lineTo(x + 16 + sway, y + 6); ctx.stroke();
        circ(ctx, x + 12, y + 14, 3.5, '#e5483b', OUT); circ(ctx, x + 20, y + 20, 3.5, '#e5483b', OUT);
        circ(ctx, x + 20, y + 10, 3, '#f0c040', OUT);
      }
    },
    water: function (ctx, x, y, tx, ty, t) {
      ctx.fillStyle = '#5fb7e5'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      var o = Math.sin(t * 1.5 + tx * 0.9 + ty * 1.3) * 3;
      ctx.beginPath(); ctx.moveTo(x + 6 + o, y + 12); ctx.quadraticCurveTo(x + 11 + o, y + 9, x + 16 + o, y + 12); ctx.stroke();
      if (hash(tx, ty, 3) > 0.6) {
        ctx.beginPath(); ctx.moveTo(x + 14 - o, y + 24); ctx.quadraticCurveTo(x + 19 - o, y + 21, x + 24 - o, y + 24); ctx.stroke();
      }
      if (hash(tx, ty, 12) > 0.82) { circ(ctx, x + 16, y + 18, 6, '#5fbf6a', '#3a8a45'); }
    },
    floor: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#c9965f'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = '#b07f4c'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + 0.5); ctx.lineTo(x + T, y + 0.5);
      ctx.moveTo(x + ((ty % 2) ? 10 : 24), y); ctx.lineTo(x + ((ty % 2) ? 10 : 24), y + T); ctx.stroke();
      if (hash(tx, ty, 2) > 0.75) { ctx.strokeStyle = '#e8cf6a'; ctx.beginPath(); ctx.moveTo(x + 8, y + 20); ctx.lineTo(x + 18, y + 17); ctx.stroke(); }
    },
    wall: function (ctx, x, y, tx, ty, t, W) {
      ctx.fillStyle = '#8a5432'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#a7683f'; ctx.fillRect(x + 2, y + 2, T - 4, T - 10);
      ctx.strokeStyle = '#6e3f22'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 2, y + 12); ctx.lineTo(x + T - 2, y + 12); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(x, y + T - 8, T, 8);
    },
    hedge: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#4f9a3c'; ctx.fillRect(x, y, T, T);
      for (var i = 0; i < 3; i++) {
        circ(ctx, x + 6 + hash(tx, ty, i) * 20, y + 6 + hash(tx, ty, i + 4) * 20, 8 + hash(tx, ty, i + 8) * 3, i % 2 ? '#5cad46' : '#469034');
      }
      circ(ctx, x + 12, y + 10, 3, 'rgba(255,255,255,0.12)');
    },
    fence: function (ctx, x, y, tx, ty, t, W) {
      var under = W.tileDef(W.tileAt(tx, ty + 1)).ground || 'grass';
      if (under === 'fence') under = W.tileDef(W.tileAt(tx + 1, ty)).ground || 'grass';
      if (under === 'fence' || under === 'hedge') under = 'grass';
      (GROUND[under] || GROUND.grass)(ctx, x, y, tx, ty, t, W);
      var L = W.tileAt(tx - 1, ty) === 'f', R = W.tileAt(tx + 1, ty) === 'f';
      var U = W.tileAt(tx, ty - 1) === 'f', D = W.tileAt(tx, ty + 1) === 'f';
      ctx.fillStyle = '#b9824e'; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
      if (L || R || (!U && !D)) {
        ctx.fillRect(L ? x : x + 12, y + 10, (L ? 16 : 4) + (R ? 16 : 4), 4);
        ctx.fillRect(L ? x : x + 12, y + 18, (L ? 16 : 4) + (R ? 16 : 4), 4);
      }
      if (U || D) {
        ctx.fillRect(x + 11, U ? y : y + 12, 4, (U ? 16 : 4) + (D ? 16 : 4));
        ctx.fillRect(x + 18, U ? y : y + 12, 4, (U ? 16 : 4) + (D ? 16 : 4));
      }
      rr(ctx, x + 12, y + 6, 8, 18, 2, '#9c6a3c', true);
    }
  };

  /* ---------------- Décors ---------------- */
  function tree(ctx, p, t, big) {
    var cx = p.px + p.pw / 2, by = p.py + p.ph;
    var r = big ? 46 : 26;
    ctx.fillStyle = 'rgba(30,40,20,0.22)';
    ctx.beginPath(); ctx.ellipse(cx, by - 4, r * 0.8, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    rr(ctx, cx - 5, by - 22, 10, 20, 3, '#8a5a34', true);
    var sway = Math.sin(t * 1.3 + p.px) * 1.5;
    var col = p.color || (big ? '#5fae5a' : '#4fa14a');
    if (big) {
      // saule pleureur
      for (var i = -3; i <= 3; i++) {
        ctx.strokeStyle = '#4a9a48'; ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(cx + i * 11, by - 70); ctx.quadraticCurveTo(cx + i * 14 + sway, by - 40, cx + i * 13 + sway * 1.5, by - 14); ctx.stroke();
      }
      circ(ctx, cx + sway, by - 72, 34, col, true);
      circ(ctx, cx - 20 + sway, by - 62, 20, col, true);
      circ(ctx, cx + 22 + sway, by - 62, 20, col, true);
      circ(ctx, cx - 8 + sway, by - 80, 12, '#7cc471');
    } else {
      circ(ctx, cx + sway, by - 40, r, col, true);
      circ(ctx, cx - 13 + sway, by - 32, 14, col, true);
      circ(ctx, cx + 13 + sway, by - 32, 14, col, true);
      circ(ctx, cx - 6 + sway, by - 48, 8, 'rgba(255,255,255,0.18)');
      if (p.fruit) { circ(ctx, cx - 8 + sway, by - 36, 3, '#e5483b', true); circ(ctx, cx + 9 + sway, by - 44, 3, '#e5483b', true); circ(ctx, cx + 3 + sway, by - 28, 3, '#e5483b', true); }
    }
  }

  C.PropTypes = {
    _default: { w: 1, h: 1, draw: function (ctx, p) { rr(ctx, p.px + 4, p.py + 4, p.pw - 8, p.ph - 8, 4, '#bbb', true); } },
    tree: { w: 1, h: 1, hit: [0.25, 0.3, 0.5, 0.7], draw: function (ctx, p, t) { tree(ctx, p, t, false); } },
    bigtree: { w: 2, h: 2, hit: [0.3, 0.55, 0.4, 0.45], draw: function (ctx, p, t) { tree(ctx, p, t, true); } },
    bush: { w: 1, h: 1, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      var cx = p.px + 16, cy = p.py + 20;
      circ(ctx, cx - 7, cy, 9, '#4f9a3c', true); circ(ctx, cx + 7, cy, 9, '#4f9a3c', true); circ(ctx, cx, cy - 6, 10, '#5cad46', true);
      if (p.flowers) { circ(ctx, cx - 4, cy - 6, 2, '#ffb3c7'); circ(ctx, cx + 6, cy - 2, 2, '#fff3a8'); }
    } },
    bench: { w: 2, h: 1, hit: [0.05, 0.35, 0.9, 0.55], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 6, y + 18, 4, 12, 1, '#7a4a2a', true); rr(ctx, x + p.pw - 10, y + 18, 4, 12, 1, '#7a4a2a', true);
      rr(ctx, x + 2, y + 4, p.pw - 4, 7, 3, '#c98a4f', true);
      rr(ctx, x + 2, y + 13, p.pw - 4, 9, 3, '#d99a5c', true);
      if (p.scratched) { ctx.strokeStyle = '#6e3f22'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 40, y + 16); ctx.lineTo(x + 50, y + 19); ctx.moveTo(x + 40, y + 19); ctx.lineTo(x + 50, y + 16); ctx.stroke(); }
    } },
    fountain: { w: 3, h: 3, hit: [0.05, 0.15, 0.9, 0.8], draw: function (ctx, p, t) {
      var cx = p.px + p.pw / 2, cy = p.py + p.ph / 2 + 6;
      ctx.fillStyle = 'rgba(30,40,20,0.18)'; ctx.beginPath(); ctx.ellipse(cx, cy + 8, 48, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx, cy, 46, 30, 0, 0, Math.PI * 2); ctx.fillStyle = '#b8b2a6'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy - 2, 38, 23, 0, 0, Math.PI * 2); ctx.fillStyle = '#69bfe8'; ctx.fill();
      for (var i = 0; i < 3; i++) {
        var rp = ((t * 0.6 + i / 3) % 1);
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.6 - rp * 0.6) + ')'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(cx, cy - 2, 8 + rp * 28, 5 + rp * 16, 0, 0, Math.PI * 2); ctx.stroke();
      }
      rr(ctx, cx - 7, cy - 34, 14, 32, 4, '#cfc8bb', true);
      circ(ctx, cx, cy - 36, 10, '#cfc8bb', true);
      ctx.fillStyle = '#9ad7f2';
      for (var j = 0; j < 6; j++) {
        var a = j / 6 * Math.PI * 2 + t * 2, rr2 = 6 + ((t * 30 + j * 7) % 14);
        circ(ctx, cx + Math.cos(a) * rr2, cy - 40 + rr2 * 0.9, 2, '#bfe7f7');
      }
    } },
    table: { w: 4, h: 2, hit: [0.03, 0.2, 0.94, 0.7], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      ctx.fillStyle = 'rgba(30,40,20,0.2)'; ctx.fillRect(x + 6, y + p.ph - 10, p.pw - 12, 8);
      rr(ctx, x + 4, y + 8, p.pw - 8, p.ph - 18, 6, '#c98a4f', true);
      ctx.strokeStyle = '#a86e3a'; ctx.lineWidth = 1;
      for (var i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + 4, y + 8 + i * (p.ph - 18) / 4); ctx.lineTo(x + p.pw - 4, y + 8 + i * (p.ph - 18) / 4); ctx.stroke(); }
      if (p.bowls) {
        var n = 5;
        for (var b = 0; b < n; b++) circ(ctx, x + 24 + b * 18, y + 22, 5, '#f4f0e6', true);
        circ(ctx, x + p.pw - 12, y + p.ph - 18, 5, '#f4f0e6', true); // le bol à l'écart
      }
    } },
    picnic: { w: 3, h: 2, hit: [0.03, 0.2, 0.94, 0.7], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 2, y + 4, p.pw - 4, 8, 3, '#b07a44', true);
      rr(ctx, x + 2, y + 16, p.pw - 4, p.ph - 32, 5, '#d99a5c', true);
      rr(ctx, x + 2, y + p.ph - 14, p.pw - 4, 8, 3, '#b07a44', true);
      if (p.paint) { circ(ctx, x + 20, y + 26, 4, '#e5483b'); circ(ctx, x + 32, y + 26, 4, '#4f8fd8'); circ(ctx, x + 44, y + 26, 4, '#f2c94c'); }
    } },
    board: { w: 2, h: 1, hit: [0.1, 0.5, 0.8, 0.5], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 8, y + 10, 5, 22, 1, '#7a4a2a', true); rr(ctx, x + p.pw - 13, y + 10, 5, 22, 1, '#7a4a2a', true);
      rr(ctx, x + 2, y - 14, p.pw - 4, 30, 3, '#a7683f', true);
      rr(ctx, x + 6, y - 10, p.pw - 12, 22, 2, '#e9d3a8');
      var papers = p.papers || ['#fff', '#fff59d', '#bbdefb'];
      papers.forEach(function (c, i) {
        ctx.fillStyle = c; ctx.fillRect(x + 10 + i * 16, y - 7 + (i % 2) * 3, 12, 14);
        circ(ctx, x + 16 + i * 16, y - 7 + (i % 2) * 3, 1.5, '#e5483b');
      });
      if (p.torn) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 44, y - 8); ctx.lineTo(x + 56, y - 8); ctx.lineTo(x + 52, y); ctx.lineTo(x + 47, y - 3); ctx.closePath(); ctx.fill(); circ(ctx, x + 50, y - 8, 1.5, '#e5483b'); }
    } },
    bin: { w: 1, h: 1, hit: [0.2, 0.4, 0.6, 0.6], draw: function (ctx, p) {
      rr(ctx, p.px + 7, p.py + 6, 18, 22, 3, '#5f8f6a', true);
      rr(ctx, p.px + 5, p.py + 3, 22, 6, 2, '#4d7a57', true);
    } },
    haybale: { w: 1, h: 1, hit: [0.05, 0.3, 0.9, 0.7], draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py + 4, 28, 26, 6, '#e8c860', true);
      ctx.strokeStyle = '#c9a43c'; ctx.lineWidth = 1.5;
      for (var i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(p.px + 6, p.py + 10 + i * 5); ctx.lineTo(p.px + 26, p.py + 10 + i * 5); ctx.stroke(); }
      ctx.strokeStyle = '#a0522d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.px + 11, p.py + 4); ctx.lineTo(p.px + 11, p.py + 30); ctx.moveTo(p.px + 21, p.py + 4); ctx.lineTo(p.px + 21, p.py + 30); ctx.stroke();
    } },
    haypile: { w: 1, h: 1, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.fillStyle = '#e8c860'; ctx.beginPath(); ctx.ellipse(p.px + 16, p.py + 18, 15, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#c9a43c'; ctx.lineWidth = 1;
      for (var i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(p.px + 6 + i * 4, p.py + 14 + (i % 2) * 6); ctx.lineTo(p.px + 10 + i * 4, p.py + 20); ctx.stroke(); }
    } },
    cart: { w: 2, h: 1, hit: [0.05, 0.2, 0.9, 0.8], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 4, y + 2, p.pw - 14, 20, 3, '#a7683f', true);
      rr(ctx, x + p.pw - 12, y + 9, 12, 4, 1, '#7a4a2a', true);
      circ(ctx, x + 14, y + 24, 7, '#7a4a2a', true); circ(ctx, x + 40, y + 24, 7, '#7a4a2a', true);
      circ(ctx, x + 14, y + 24, 2, '#c9a43c'); circ(ctx, x + 40, y + 24, 2, '#c9a43c');
      ctx.fillStyle = '#e8c860'; ctx.fillRect(x + 8, y + 2, 20, 6);
    } },
    scarecrow: { w: 1, h: 1, hit: [0.35, 0.6, 0.3, 0.4], draw: function (ctx, p, t) {
      var cx = p.px + 16, by = p.py + 30, s = Math.sin(t) * 1;
      rr(ctx, cx - 2, by - 34, 4, 34, 1, '#7a4a2a', true);
      rr(ctx, cx - 16, by - 30 + s, 32, 4, 1, '#7a4a2a', true);
      rr(ctx, cx - 9, by - 30, 18, 18, 4, '#5a7fc0', true);
      circ(ctx, cx, by - 38, 7, '#f2d8a0', true);
      ctx.fillStyle = '#c9a43c'; ctx.beginPath(); ctx.moveTo(cx - 11, by - 41); ctx.lineTo(cx + 11, by - 41); ctx.lineTo(cx, by - 52); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.stroke();
    } },
    post: { w: 1, h: 1, hit: [0.35, 0.6, 0.3, 0.4], draw: function (ctx, p) {
      rr(ctx, p.px + 13, p.py + 2, 6, 28, 1, '#9c6a3c', true);
      if (p.paper) { ctx.save(); ctx.translate(p.px + 16, p.py + 10); ctx.rotate(-0.1); ctx.fillStyle = '#ffe6f0'; ctx.fillRect(-7, -6, 14, 12); ctx.strokeStyle = '#e57399'; ctx.lineWidth = 1; ctx.strokeRect(-7, -6, 14, 12); ctx.restore(); }
    } },
    rack: { w: 1, h: 2, hit: [0.1, 0.5, 0.8, 0.5], draw: function (ctx, p) {
      rr(ctx, p.px + 3, p.py + 2, 26, p.ph - 6, 2, '#8a5432', true);
      ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p.px + 9, p.py + 8); ctx.lineTo(p.px + 9, p.py + 40); ctx.moveTo(p.px + 16, p.py + 8); ctx.lineTo(p.px + 16, p.py + 30); ctx.stroke();
      rr(ctx, p.px + 19, p.py + 12, 8, 10, 2, '#3a3a3a', true);
      circ(ctx, p.px + 23, p.py + 36, 5, '#c9503c', true);
    } },
    box: { w: 1, h: 1, hit: [0.1, 0.35, 0.8, 0.65], draw: function (ctx, p) {
      rr(ctx, p.px + 3, p.py + 8, 26, 21, 2, '#c98a4f', true);
      rr(ctx, p.px + 1, p.py + 5, 30, 6, 2, '#b07a44', true);
      ctx.strokeStyle = '#8a5432'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.px + 16, p.py + 11); ctx.lineTo(p.px + 16, p.py + 29); ctx.stroke();
    } },
    crate: { w: 1, h: 1, hit: [0.1, 0.35, 0.8, 0.65], draw: function (ctx, p) {
      rr(ctx, p.px + 3, p.py + 10, 26, 18, 2, '#d9a066', true);
      ctx.strokeStyle = '#a86e3a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.px + 3, p.py + 19); ctx.lineTo(p.px + 29, p.py + 19); ctx.stroke();
      circ(ctx, p.px + 10, p.py + 9, 4, '#f08a2c', true); circ(ctx, p.px + 18, p.py + 8, 4, '#7fcf55', true); circ(ctx, p.px + 24, p.py + 10, 4, '#e5483b', true);
    } },
    compost: { w: 2, h: 1, hit: [0.05, 0.3, 0.9, 0.7], draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py + 6, p.pw - 4, 24, 3, '#7a5236', true);
      ctx.fillStyle = '#5a3a22'; ctx.fillRect(p.px + 6, p.py + 9, p.pw - 12, 6);
      ctx.strokeStyle = '#9c6a3c'; ctx.lineWidth = 1;
      for (var i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(p.px + i * 12, p.py + 15); ctx.lineTo(p.px + i * 12, p.py + 30); ctx.stroke(); }
    } },
    trough: { w: 2, h: 1, hit: [0.05, 0.3, 0.9, 0.7], draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py + 8, p.pw - 4, 20, 4, '#8a8f96', true);
      rr(ctx, p.px + 6, p.py + 11, p.pw - 12, 10, 3, '#69bfe8');
    } },
    wateringcan: { w: 1, h: 1, solid: false, draw: function (ctx, p) {
      rr(ctx, p.px + 8, p.py + 14, 14, 12, 3, '#4f8f9a', true);
      ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.px + 22, p.py + 18); ctx.lineTo(p.px + 28, p.py + 12); ctx.stroke();
    } },
    panel: { w: 2, h: 1, hit: [0.05, 0.5, 0.9, 0.5], draw: function (ctx, p, t) {
      var x = p.px, y = p.py;
      rr(ctx, x + 6, y + 6, 5, 26, 1, '#7a4a2a', true); rr(ctx, x + p.pw - 11, y + 6, 5, 26, 1, '#7a4a2a', true);
      rr(ctx, x, y - 20, p.pw, 34, 4, '#f2c94c', true);
      ctx.fillStyle = '#3a2a22'; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('ACTIVITÉS', x + p.pw / 2, y - 8);
      ctx.fillStyle = '#fff'; ctx.fillRect(x + 8, y - 4, p.pw - 16, 12);
      ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + 11, y - 1 + i * 3.5); ctx.lineTo(x + p.pw - 11, y - 1 + i * 3.5); ctx.stroke(); }
    } },
    hopscotch: { w: 2, h: 3, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2;
      var x = p.px + 16, y = p.py + 4;
      for (var i = 0; i < 4; i++) ctx.strokeRect(x, y + i * 22, 22, 22);
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
      for (var j = 0; j < 4; j++) ctx.fillText(String(4 - j), x + 11, y + j * 22 + 15);
    } },
    ball: { w: 1, h: 1, solid: false, draw: function (ctx, p, t) {
      var b = Math.abs(Math.sin(t * 3)) * 3;
      ctx.fillStyle = 'rgba(30,40,20,0.2)'; ctx.beginPath(); ctx.ellipse(p.px + 16, p.py + 26, 7, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      circ(ctx, p.px + 16, p.py + 18 - b, 7, '#fff', true);
      circ(ctx, p.px + 16, p.py + 18 - b, 2.5, '#3a2a22');
    } },
    cones: { w: 2, h: 1, solid: false, draw: function (ctx, p) {
      for (var i = 0; i < 3; i++) {
        var cx = p.px + 8 + i * 22, by = p.py + 26;
        ctx.fillStyle = '#f08a2c'; ctx.beginPath(); ctx.moveTo(cx - 6, by); ctx.lineTo(cx + 6, by); ctx.lineTo(cx, by - 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(cx - 3, by - 8, 6, 2);
      }
    } },
    goal: { w: 1, h: 3, hit: [0.6, 0.1, 0.3, 0.85], draw: function (ctx, p) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(p.px + 4, p.py + 6); ctx.lineTo(p.px + 26, p.py + 6); ctx.lineTo(p.px + 26, p.py + p.ph - 6); ctx.lineTo(p.px + 4, p.py + p.ph - 6); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
      for (var i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(p.px + 8, p.py + 6 + i * 14); ctx.lineTo(p.px + 26, p.py + 6 + i * 14); ctx.stroke(); }
    } },
    rock: { w: 1, h: 1, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      ctx.beginPath(); ctx.ellipse(p.px + 16, p.py + 20, 14, 10, 0, 0, Math.PI * 2); ctx.fillStyle = '#a8a39a'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke();
      circ(ctx, p.px + 11, p.py + 16, 3, 'rgba(255,255,255,0.3)');
      if (p.moss) circ(ctx, p.px + 20, p.py + 13, 4, '#7cb85a');
    } },
    item: { w: 1, h: 1, solid: false, draw: function (ctx, p) {
      var x = p.px + 16, y = p.py + 20;
      var k = p.kind || 'paper';
      if (k === 'echarpe') {
        ctx.strokeStyle = '#4f8fd8'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x, y - 8, x + 10, y + 2); ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 6, y - 3); ctx.lineTo(x - 5, y + 1); ctx.stroke();
      } else if (k === 'carnet') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.3); rr(ctx, -8, -6, 16, 12, 2, '#7cb85a', true); ctx.fillStyle = '#fff'; ctx.fillRect(-6, -4, 1.5, 8); ctx.restore();
      } else if (k === 'trousse') {
        rr(ctx, x - 10, y - 5, 20, 10, 4, '#c8b6ff', true); ctx.fillStyle = '#f2c94c'; ctx.fillRect(x - 8, y - 1, 16, 1.5);
      } else if (k === 'pen') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.6); rr(ctx, -8, -2, 16, 4, 1.5, '#e5483b', true); ctx.restore();
      } else if (k === 'notebook') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.2); rr(ctx, -7, -5, 14, 10, 2, '#f2d8a0', true); ctx.strokeStyle = '#c9a43c'; ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(4, -2); ctx.moveTo(-4, 1); ctx.lineTo(3, 1); ctx.stroke(); ctx.restore();
      } else {
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.4); ctx.fillStyle = '#fffdf5'; ctx.fillRect(-7, -5, 14, 10); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; ctx.strokeRect(-7, -5, 14, 10); ctx.restore();
      }
    } },
    tracks: { w: 2, h: 1, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.fillStyle = p.color || 'rgba(90,55,30,0.45)';
      for (var i = 0; i < 5; i++) {
        var x = p.px + 6 + i * 11, y = p.py + 12 + (i % 2) * 8;
        circ(ctx, x, y, 2.6); circ(ctx, x - 3, y - 4, 1.2); circ(ctx, x, y - 5, 1.2); circ(ctx, x + 3, y - 4, 1.2);
      }
    } },
    hoofprints: { w: 2, h: 2, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.fillStyle = 'rgba(90,70,50,0.35)';
      for (var i = 0; i < 9; i++) {
        var a = i / 9 * Math.PI * 2;
        var x = p.px + 32 + Math.cos(a) * 20, y = p.py + 32 + Math.sin(a) * 14;
        ctx.beginPath(); ctx.ellipse(x - 2, y, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.ellipse(x + 2, y, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      }
    } },
    well: { w: 2, h: 2, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      var cx = p.px + 32, cy = p.py + 40;
      ctx.beginPath(); ctx.ellipse(cx, cy, 24, 14, 0, 0, Math.PI * 2); ctx.fillStyle = '#a8a39a'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy - 2, 16, 8, 0, 0, Math.PI * 2); ctx.fillStyle = '#2f4f6a'; ctx.fill();
      rr(ctx, cx - 22, cy - 42, 4, 38, 1, '#7a4a2a', true); rr(ctx, cx + 18, cy - 42, 4, 38, 1, '#7a4a2a', true);
      ctx.fillStyle = '#c0503c'; ctx.beginPath(); ctx.moveTo(cx - 30, cy - 38); ctx.lineTo(cx, cy - 56); ctx.lineTo(cx + 30, cy - 38); ctx.closePath(); ctx.fill(); ctx.stroke();
    } },
    flowerpot: { w: 1, h: 1, hit: [0.2, 0.5, 0.6, 0.5], draw: function (ctx, p) {
      rr(ctx, p.px + 8, p.py + 16, 16, 12, 3, '#c0603c', true);
      circ(ctx, p.px + 12, p.py + 12, 4, '#ffb3c7', true); circ(ctx, p.px + 20, p.py + 11, 4, '#fff3a8', true); circ(ctx, p.px + 16, p.py + 7, 4, '#c8b6ff', true);
    } },
    lantern: { w: 1, h: 1, hit: [0.35, 0.7, 0.3, 0.3], draw: function (ctx, p) {
      rr(ctx, p.px + 14, p.py - 12, 4, 42, 1, '#4a4a4a', true);
      rr(ctx, p.px + 9, p.py - 22, 14, 14, 3, '#fff3a8', true);
    } },
    bunting: { w: 6, h: 1, solid: false, sortOffset: 2, draw: function (ctx, p, t) {
      var cols = ['#e5483b', '#f2c94c', '#4f8fd8', '#7cb85a', '#c8b6ff'];
      var x0 = p.px, x1 = p.px + p.pw, y = p.py - 30;
      ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo((x0 + x1) / 2, y + 16, x1, y); ctx.stroke();
      for (var i = 1; i < 12; i++) {
        var u = i / 12, x = x0 + (x1 - x0) * u, yy = y + (1 - Math.pow(2 * u - 1, 2)) * 8;
        ctx.fillStyle = cols[i % cols.length];
        ctx.beginPath(); ctx.moveTo(x - 5, yy); ctx.lineTo(x + 5, yy); ctx.lineTo(x, yy + 10 + Math.sin(t * 3 + i) * 1.5); ctx.closePath(); ctx.fill();
      }
    } }
  };

  /* ---------------- Rendu principal ---------------- */
  C.Render = {
    cam: { x: 0, y: 0 },
    zoom: 1.6,
    resize: function (canvas) {
      var dpr = window.devicePixelRatio || 1;
      var w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      this.dpr = dpr;
      // On veut voir environ 24 cases en largeur
      this.zoom = C.clamp(Math.min(w / (24 * T), h / (14 * T)), 0.8, 2.6);
      this.vw = w / this.zoom; this.vh = h / this.zoom;
    },
    follow: function (x, y, dt, instant) {
      var W = C.World;
      var tx = C.clamp(x - this.vw / 2, 0, Math.max(0, W.pw - this.vw));
      var ty = C.clamp(y - this.vh / 2, 0, Math.max(0, W.ph - this.vh));
      if (this.vw > W.pw) tx = (W.pw - this.vw) / 2;
      if (this.vh > W.ph) ty = (W.ph - this.vh) / 2;
      if (instant) { this.cam.x = tx; this.cam.y = ty; return; }
      var k = 1 - Math.pow(0.0015, dt);
      this.cam.x += (tx - this.cam.x) * k;
      this.cam.y += (ty - this.cam.y) * k;
    },
    onScreen: function (x, y, margin) {
      margin = margin == null ? 64 : margin;
      return x > this.cam.x - margin && x < this.cam.x + this.vw + margin && y > this.cam.y - margin && y < this.cam.y + this.vh + margin;
    },

    draw: function (ctx, t) {
      var W = C.World, R = this;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#4f9a3c'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      var z = R.zoom * R.dpr;
      ctx.setTransform(z, 0, 0, z, -Math.round(R.cam.x * z), -Math.round(R.cam.y * z));

      // Sols
      var x0 = Math.max(0, Math.floor(R.cam.x / T)), y0 = Math.max(0, Math.floor(R.cam.y / T));
      var x1 = Math.min(W.w - 1, Math.ceil((R.cam.x + R.vw) / T)), y1 = Math.min(W.h - 1, Math.ceil((R.cam.y + R.vh) / T));
      for (var ty = y0; ty <= y1; ty++) {
        for (var tx = x0; tx <= x1; tx++) {
          var def = W.tileDef(W.tileAt(tx, ty));
          var fn = GROUND[def.ground] || GROUND.grass;
          fn(ctx, tx * T, ty * T, tx, ty, t, W);
        }
      }

      // Décors + personnages triés par profondeur
      var items = [];
      W.props.forEach(function (p) {
        if (R.onScreen(p.px + p.pw / 2, p.py + p.ph / 2, 120)) items.push({ y: p.sortY, prop: p });
      });
      C.NPC.list.forEach(function (n) { if (!n.hidden && R.onScreen(n.x, n.y)) items.push({ y: n.y, npc: n }); });
      var P = C.Player;
      items.push({ y: P.y, player: true });
      items.sort(function (a, b) { return a.y - b.y; });
      items.forEach(function (it) {
        if (it.prop) it.prop.def.draw(ctx, it.prop, t);
        else if (it.npc) C.NPC.drawOne(ctx, it.npc, t);
        else C.Player.draw(ctx, t);
      });

      // Indices visuels : objets à examiner, personnages qui ont du nouveau
      W.props.forEach(function (p) {
        if (!p.examine) return;
        var cx = p.px + p.pw / 2, cy = p.py - (p.def.markY != null ? p.def.markY : 6);
        var d = Math.hypot(cx - P.x, p.py + p.ph / 2 - P.y);
        if (d > T * 6) return;
        if (C.Dialogue.hasNew(p.examine)) R.sparkle(ctx, cx, cy, t);
      });
      C.NPC.list.forEach(function (n) {
        if (n.hidden || n.bubble || n.inScene) return;
        if (!R.onScreen(n.x, n.y)) return;
        if (C.Dialogue.hasNew(n.id)) R.talkMark(ctx, n.x, n.y - (n.def.markY || 46), t);
      });

      // Bulles de dialogue dans le monde
      C.NPC.list.forEach(function (n) { if (n.bubble && !n.hidden) R.bubble(ctx, n.x, n.y - (n.def.markY || 46) + 4, n.bubble.text, n.bubble.style); });
      if (P.bubble) R.bubble(ctx, P.x, P.y - 44, P.bubble.text, P.bubble.style);

      // Invite d'interaction
      var target = C.Interact.target;
      if (target && !C.UI.busy()) {
        var lx = target.x, ly = target.y;
        R.keyHint(ctx, lx, ly, target.label, t);
      }
    },

    sparkle: function (ctx, x, y, t) {
      var a = 0.55 + Math.sin(t * 4) * 0.35;
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(x, y - 4 + Math.sin(t * 3) * 2);
      ctx.fillStyle = '#fff6b0';
      ctx.strokeStyle = '#c9a43c'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < 8; i++) {
        var r = i % 2 ? 2 : 6, an = i / 8 * Math.PI * 2 + t;
        ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r);
      }
      ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.restore();
    },
    talkMark: function (ctx, x, y, t) {
      var b = Math.sin(t * 4) * 2;
      ctx.save(); ctx.translate(x, y + b);
      rr(ctx, -10, -9, 20, 15, 6, '#fff', true);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-3, 5); ctx.lineTo(3, 5); ctx.lineTo(-2, 10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e5483b';
      for (var i = -1; i <= 1; i++) circ(ctx, i * 5, -1.5, 1.8, '#e5483b');
      ctx.restore();
    },
    bubble: function (ctx, x, y, text, style) {
      ctx.save();
      ctx.font = (style === 'thought' ? 'italic ' : '') + '600 10px Fredoka, "Trebuchet MS", sans-serif';
      var maxW = 150, words = String(text).split(' '), lines = [], line = '';
      words.forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
      });
      if (line) lines.push(line);
      var w = 0; lines.forEach(function (l) { w = Math.max(w, ctx.measureText(l).width); });
      w += 14; var h = lines.length * 13 + 9;
      var bx = Math.round(x - w / 2), by = Math.round(y - h - 8);
      var fill = style === 'thought' ? '#f3ecff' : style === 'warn' ? '#fff1e0' : '#ffffff';
      rr(ctx, bx, by, w, h, 7, fill, true);
      ctx.fillStyle = fill; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x - 5, by + h - 1); ctx.lineTo(x, by + h + 7); ctx.lineTo(x + 5, by + h - 1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 5, by + h); ctx.lineTo(x, by + h + 7); ctx.lineTo(x + 5, by + h); ctx.stroke();
      ctx.fillStyle = '#2a1d18'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lines.forEach(function (l, i) { ctx.fillText(l, x, by + 5 + i * 13); });
      ctx.restore();
    },
    keyHint: function (ctx, x, y, label, t) {
      ctx.save();
      ctx.font = '700 10px Fredoka, "Trebuchet MS", sans-serif';
      var txt = label || 'Interagir';
      var w = ctx.measureText(txt).width + 30;
      var bx = Math.round(x - w / 2), by = Math.round(y + Math.sin(t * 5) * 1.5);
      rr(ctx, bx, by, w, 18, 9, 'rgba(42,29,24,0.88)');
      rr(ctx, bx + 3, by + 3, 14, 12, 3, '#f2c94c');
      ctx.fillStyle = '#2a1d18'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('E', bx + 10, by + 9.5);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
      ctx.fillText(txt, bx + 21, by + 9.5);
      ctx.restore();
    }
  };
})(window.CDC);
