/* Rendu : sols, murs, décors, personnages, bulles, indicateurs.
   Pour ajouter un type de décor, ajoute une entrée dans C.PropTypes. */
(function (C) {
  var T = C.TILE;
  var OUT = '#2b2230';

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
    if (stroke) { ctx.strokeStyle = stroke === true ? OUT : stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  }
  function circ(ctx, x, y, r, fill, stroke) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke === true ? OUT : stroke; ctx.lineWidth = 1.6; ctx.stroke(); }
  }
  function shadow(ctx, x, y, w, h) {
    ctx.fillStyle = 'rgba(20,24,40,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill();
  }
  C.Draw = { rr: rr, circ: circ, hash: hash };

  /* ---------------- Sols ---------------- */
  var OUTDOOR = { grass: 1, flowers: 1, asphalt: 1, concrete: 1, synth: 1, track: 1, path: 1, water: 1, hedge: 1, fence: 1 };
  var WALLFACE = { floor: '#f2e8d4', lino: '#e2e7ee', carpet: '#e4eff0', office: '#efe7f4', tiles: '#f4e7da', door: '#e2e7ee' };

  var GROUND = {
    grass: function (ctx, x, y, tx, ty) {
      var v = hash(tx, ty);
      ctx.fillStyle = v < 0.5 ? '#86c46a' : '#80be64';
      ctx.fillRect(x, y, T, T);
      if (v > 0.72) {
        ctx.strokeStyle = '#6aa652'; ctx.lineWidth = 1.3;
        var gx = x + 6 + hash(tx, ty, 2) * 18, gy = y + 10 + hash(tx, ty, 3) * 14;
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(gx - 2, gy - 5); ctx.moveTo(gx + 3, gy); ctx.lineTo(gx + 4, gy - 6); ctx.stroke();
      }
    },
    flowers: function (ctx, x, y, tx, ty, t) {
      GROUND.grass(ctx, x, y, tx, ty, t);
      if (hash(tx, ty, 5) > 0.5) {
        var cols = ['#fff3a8', '#ffb3c7', '#ffffff', '#c8b6ff', '#ffcf8a'];
        var c = cols[Math.floor(hash(tx, ty, 6) * cols.length)];
        for (var i = 0; i < 3; i++) {
          var fx = x + 5 + hash(tx, ty, 10 + i) * 22, fy = y + 5 + hash(tx, ty, 20 + i) * 22;
          circ(ctx, fx, fy, 2.3, c); circ(ctx, fx, fy, 0.9, '#f2a33a');
        }
      }
    },
    asphalt: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = hash(tx, ty) > 0.5 ? '#a3a8b0' : '#9fa4ac'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = 'rgba(255,255,255,0.13)';
      for (var i = 0; i < 4; i++) ctx.fillRect(x + hash(tx, ty, i) * 30, y + hash(tx, ty, i + 9) * 30, 1.5, 1.5);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (var j = 0; j < 3; j++) ctx.fillRect(x + hash(tx, ty, j + 20) * 30, y + hash(tx, ty, j + 30) * 30, 2, 2);
    },
    concrete: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#cfc9be'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(90,80,70,0.18)'; ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x, y, T, 2);   // ombre du toit du préau
    },
    floor: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#e8d3ad'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(150,110,60,0.28)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < 4; i++) { ctx.moveTo(x, y + i * 8 + 0.5); ctx.lineTo(x + T, y + i * 8 + 0.5); }
      var o = ((tx + ty) % 3) * 9;
      ctx.moveTo(x + o + 4, y); ctx.lineTo(x + o + 4, y + 8);
      ctx.moveTo(x + (o + 18) % 32, y + 8); ctx.lineTo(x + (o + 18) % 32, y + 16);
      ctx.moveTo(x + (o + 9) % 32, y + 16); ctx.lineTo(x + (o + 9) % 32, y + 24);
      ctx.moveTo(x + (o + 26) % 32, y + 24); ctx.lineTo(x + (o + 26) % 32, y + 32);
      ctx.stroke();
    },
    lino: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#d9dfe7'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = (tx + ty) % 2 ? '#d2d9e2' : '#dde3ea';
      ctx.fillRect(x + 1, y + 1, T - 2, T - 2);
      if (hash(tx, ty, 3) > 0.85) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(x + 6, y + 6, 8, 2); }
    },
    carpet: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#7fb3b8'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = 'rgba(255,255,255,0.07)';
      if ((tx + ty) % 2) ctx.fillRect(x, y, T, T);
      ctx.fillStyle = 'rgba(0,40,50,0.08)';
      for (var i = 0; i < 3; i++) ctx.fillRect(x + hash(tx, ty, i) * 28, y + hash(tx, ty, i + 5) * 28, 3, 3);
    },
    office: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#c99a6b'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(90,50,20,0.25)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < 4; i++) { var yy = y + i * 8; ctx.moveTo(x, yy + 0.5); ctx.lineTo(x + T, yy + 0.5); ctx.moveTo(x + ((i + tx) % 2) * 16 + 0.5, yy); ctx.lineTo(x + ((i + tx) % 2) * 16 + 0.5, yy + 8); }
      ctx.stroke();
    },
    tiles: function (ctx, x, y, tx, ty) {
      for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
        ctx.fillStyle = (i + j + tx + ty) % 2 ? '#efe9de' : '#e0d6c6';
        ctx.fillRect(x + i * 16, y + j * 16, 16, 16);
      }
    },
    synth: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = Math.floor(tx / 2) % 2 ? '#58ac63' : '#4fa25b'; ctx.fillRect(x, y, T, T);
    },
    track: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#c8644c'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.lineTo(x + T, y + 16); ctx.moveTo(x + 16, y); ctx.lineTo(x + 16, y + T); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(x + hash(tx, ty) * 28, y + hash(tx, ty, 1) * 28, 3, 3);
    },
    path: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#d9cbaf'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(120,100,70,0.3)'; ctx.lineWidth = 1;
      var o = (ty % 2) * 8;
      ctx.beginPath(); ctx.moveTo(x, y + 16.5); ctx.lineTo(x + T, y + 16.5);
      ctx.moveTo(x + o + 8.5, y); ctx.lineTo(x + o + 8.5, y + 16); ctx.moveTo(x + (o + 24) % 32 + 0.5, y + 16); ctx.lineTo(x + (o + 24) % 32 + 0.5, y + 32); ctx.stroke();
    },
    water: function (ctx, x, y, tx, ty, t) {
      ctx.fillStyle = '#6bbde0'; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
      var o = Math.sin(t * 1.5 + tx * 0.9 + ty * 1.3) * 3;
      ctx.beginPath(); ctx.moveTo(x + 6 + o, y + 12); ctx.quadraticCurveTo(x + 11 + o, y + 9, x + 16 + o, y + 12); ctx.stroke();
      if (hash(tx, ty, 12) > 0.75) circ(ctx, x + 16, y + 18, 5, '#5fbf6a', '#3a8a45');
    },
    hedge: function (ctx, x, y, tx, ty) {
      ctx.fillStyle = '#3f8a46'; ctx.fillRect(x, y, T, T);
      for (var i = 0; i < 3; i++) circ(ctx, x + 6 + hash(tx, ty, i) * 20, y + 6 + hash(tx, ty, i + 4) * 20, 8 + hash(tx, ty, i + 8) * 3, i % 2 ? '#4f9e52' : '#418c45');
      circ(ctx, x + 12, y + 10, 3, 'rgba(255,255,255,0.12)');
    },
    fence: function (ctx, x, y, tx, ty, t, W) {
      GROUND.grass(ctx, x, y, tx, ty);
      ctx.fillStyle = '#4b5263';
      var vert = W.tileAt(tx, ty - 1) === 'f' || W.tileAt(tx, ty + 1) === 'f';
      if (vert && W.tileAt(tx - 1, ty) !== 'f' && W.tileAt(tx + 1, ty) !== 'f') {
        ctx.fillRect(x + 14, y, 4, T);
        for (var j = 0; j < 4; j++) ctx.fillRect(x + 10, y + j * 8 + 2, 12, 2);
      } else {
        ctx.fillRect(x, y + 6, T, 3); ctx.fillRect(x, y + 24, T, 3);
        for (var i = 0; i < 4; i++) ctx.fillRect(x + i * 8 + 3, y + 2, 2.5, 28);
      }
    },
    wall: function (ctx, x, y, tx, ty, t, W) {
      var below = W.tileAt(tx, ty + 1);
      var bdef = W.tileDef(below);
      var front = ty + 1 < W.h && below !== '#' && !bdef.solid;
      ctx.fillStyle = '#4a5068'; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = '#565d78'; ctx.fillRect(x + 1, y + 1, T - 2, front ? 9 : T - 2);
      if (!front) return;
      var g = bdef.ground;
      var outside = OUTDOOR[g];
      var faceCol = outside ? '#e9dcc3' : (WALLFACE[g] || '#e8e2d6');
      ctx.fillStyle = faceCol; ctx.fillRect(x, y + 10, T, T - 10);
      ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(x, y + 10, T, 2);
      ctx.fillStyle = outside ? '#b9a98b' : 'rgba(80,70,90,0.25)'; ctx.fillRect(x, y + T - 4, T, 4);
      var h = hash(tx, ty, 4);
      if (outside) {
        if (tx % 2 === 0) {
          rr(ctx, x + 6, y + 13, 20, 12, 2, '#9fd0ea', '#5b6478');
          ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(x + 9, y + 15, 5, 2);
          ctx.strokeStyle = '#5b6478'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 16, y + 13); ctx.lineTo(x + 16, y + 25); ctx.stroke();
        }
      } else if (g === 'lino' && h > 0.82) {
        rr(ctx, x + 9, y + 12, 14, 12, 1, ['#ffd166', '#8ecae6', '#f4a3b5', '#b8e0a8'][Math.floor(h * 40) % 4], '#5b6478');
      } else if ((g === 'floor' || g === 'carpet') && tx % 3 === 1) {
        rr(ctx, x + 7, y + 12, 18, 11, 2, '#bfe3f5', '#5b6478');
      }
    },
    door: function (ctx, x, y, tx, ty, t, W) {
      var below = W.tileDef(W.tileAt(tx, ty + 1)).ground;
      var above = W.tileDef(W.tileAt(tx, ty - 1)).ground;
      var g = (below && below !== 'wall' && below !== 'door') ? below : (above && above !== 'wall' && above !== 'door' ? above : 'lino');
      (GROUND[g] || GROUND.lino)(ctx, x, y, tx, ty, t, W);
      var vertical = W.tileAt(tx, ty - 1) !== '#' && W.tileAt(tx, ty + 1) !== '#';
      ctx.fillStyle = 'rgba(60,50,70,0.28)';
      if (vertical) ctx.fillRect(x, y + 13, T, 6); else ctx.fillRect(x + 13, y, 6, T);
      ctx.fillStyle = '#8b6b4a';
      if (W.tileAt(tx - 1, ty) === '#') ctx.fillRect(x, y, 4, T);
      if (W.tileAt(tx + 1, ty) === '#') ctx.fillRect(x + T - 4, y, 4, T);
    }
  };

  /* ---------------- Décors ---------------- */
  function tree(ctx, p, t, big) {
    var cx = p.px + p.pw / 2, by = p.py + p.ph;
    var r = big ? 40 : 24;
    shadow(ctx, cx, by - 4, r * 0.85, r * 0.3);
    rr(ctx, cx - 5, by - 22, 10, 20, 3, '#8a5a34', true);
    var sway = Math.sin(t * 1.3 + p.px) * 1.5;
    var col = p.color || (big ? '#4f9e52' : '#5aa85a');
    var col2 = p.color2 || (big ? '#64b465' : '#6fbd68');
    if (big) {
      circ(ctx, cx + sway, by - 64, 34, col, true);
      circ(ctx, cx - 24 + sway, by - 50, 22, col, true);
      circ(ctx, cx + 24 + sway, by - 50, 22, col, true);
      circ(ctx, cx - 6 + sway, by - 76, 16, col2);
      circ(ctx, cx + 14 + sway, by - 60, 10, col2);
    } else {
      circ(ctx, cx + sway, by - 38, r, col, true);
      circ(ctx, cx - 12 + sway, by - 30, 13, col, true);
      circ(ctx, cx + 12 + sway, by - 30, 13, col, true);
      circ(ctx, cx - 6 + sway, by - 46, 9, col2);
      if (p.fruit) { circ(ctx, cx - 8 + sway, by - 34, 3, '#e5483b', true); circ(ctx, cx + 9 + sway, by - 42, 3, '#e5483b', true); }
    }
  }
  function chairs(ctx, x, y, w, n, col) {
    for (var i = 0; i < n; i++) rr(ctx, x + (i + 0.5) * w / n - 6, y, 12, 9, 2, col || '#4f6d9a', true);
  }

  C.PropTypes = {
    _default: { w: 1, h: 1, draw: function (ctx, p) { rr(ctx, p.px + 4, p.py + 4, p.pw - 8, p.ph - 8, 4, '#bbb', true); } },
    tree: { w: 1, h: 1, hit: [0.25, 0.3, 0.5, 0.7], draw: function (ctx, p, t) { tree(ctx, p, t, false); } },
    bigtree: { w: 2, h: 2, hit: [0.3, 0.55, 0.4, 0.45], draw: function (ctx, p, t) { tree(ctx, p, t, true); } },
    bush: { w: 1, h: 1, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      var cx = p.px + 16, cy = p.py + 20;
      circ(ctx, cx - 7, cy, 9, '#4f9a4c', true); circ(ctx, cx + 7, cy, 9, '#4f9a4c', true); circ(ctx, cx, cy - 6, 10, '#5cad56', true);
      if (p.flowers) { circ(ctx, cx - 4, cy - 6, 2, '#ffb3c7'); circ(ctx, cx + 6, cy - 2, 2, '#fff3a8'); }
    } },
    rock: { w: 1, h: 1, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      ctx.beginPath(); ctx.ellipse(p.px + 16, p.py + 20, 14, 10, 0, 0, Math.PI * 2); ctx.fillStyle = '#a8a39a'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.stroke();
      circ(ctx, p.px + 11, p.py + 16, 3, 'rgba(255,255,255,0.3)');
      if (p.moss) circ(ctx, p.px + 20, p.py + 13, 4, '#7cb85a');
    } },
    bench: { w: 2, h: 1, hit: [0.05, 0.35, 0.9, 0.55], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + 28, p.pw / 2 - 4, 4);
      rr(ctx, x + 6, y + 16, 3, 13, 1, '#4b5263', true); rr(ctx, x + p.pw - 9, y + 16, 3, 13, 1, '#4b5263', true);
      rr(ctx, x + 2, y + 4, p.pw - 4, 6, 2, '#c98a4f', true);
      rr(ctx, x + 2, y + 13, p.pw - 4, 8, 2, '#d99a5c', true);
      if (p.scratched) { ctx.fillStyle = '#fff'; ctx.font = '600 5px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('M  N  H  I  J', x + 8, y + 19); ctx.strokeStyle = '#e5483b'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + 7, y + 16); ctx.lineTo(x + 14, y + 19); ctx.stroke(); }
    } },
    bin: { w: 1, h: 1, hit: [0.2, 0.4, 0.6, 0.6], draw: function (ctx, p) {
      shadow(ctx, p.px + 16, p.py + 28, 10, 3);
      rr(ctx, p.px + 8, p.py + 8, 16, 20, 3, p.color || '#3f8f7a', true);
      rr(ctx, p.px + 6, p.py + 5, 20, 5, 2, p.color2 || '#2f6f5f', true);
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(p.px + 13, p.py + 15, 6, 6);
    } },
    box: { w: 1, h: 1, hit: [0.1, 0.35, 0.8, 0.65], draw: function (ctx, p) {
      rr(ctx, p.px + 3, p.py + 8, 26, 21, 2, '#b98a5a', true);
      rr(ctx, p.px + 1, p.py + 5, 30, 6, 2, '#a07448', true);
      ctx.strokeStyle = '#7a5532'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.px + 16, p.py + 11); ctx.lineTo(p.px + 16, p.py + 29); ctx.stroke();
      ctx.fillStyle = '#fff'; ctx.font = '700 5px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('VIEUX', p.px + 10, p.py + 21);
    } },
    item: { w: 1, h: 1, solid: false, draw: function (ctx, p) {
      var x = p.px + 16, y = p.py + 20;
      var k = p.kind || 'paper';
      if (k === 'echarpe') {
        ctx.strokeStyle = '#4f8fd8'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.quadraticCurveTo(x, y - 8, x + 10, y + 2); ctx.stroke();
      } else if (k === 'carnet') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.3); rr(ctx, -8, -6, 16, 12, 2, '#7cb85a', true); ctx.fillStyle = '#fff'; ctx.fillRect(-6, -4, 1.5, 8); ctx.restore();
      } else if (k === 'trousse') {
        rr(ctx, x - 10, y - 5, 20, 10, 4, '#c8b6ff', true); ctx.fillStyle = '#f2c94c'; ctx.fillRect(x - 8, y - 1, 16, 1.5);
      } else if (k === 'pen') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.6); rr(ctx, -8, -2, 16, 4, 1.5, '#e5483b', true); ctx.restore();
      } else if (k === 'notebook') {
        ctx.save(); ctx.translate(x, y); ctx.rotate(-0.2); rr(ctx, -7, -5, 14, 10, 2, '#f2d8a0', true); ctx.strokeStyle = '#c9a43c'; ctx.beginPath(); ctx.moveTo(-4, -2); ctx.lineTo(4, -2); ctx.moveTo(-4, 1); ctx.lineTo(3, 1); ctx.stroke(); ctx.restore();
      } else if (k === 'keyring') {
        ctx.strokeStyle = '#9aa0a8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x - 4, y - 2, 3.5, 0, Math.PI * 2); ctx.stroke();
        tri3(ctx, x + 1, y + 2, '#f07a2a');
      } else if (k === 'gift') {
        rr(ctx, x - 8, y - 7, 16, 12, 2, '#8ecae6', true); ctx.fillStyle = '#e5483b'; ctx.fillRect(x - 1.5, y - 7, 3, 12); ctx.fillRect(x - 8, y - 2.5, 16, 3);
      } else {
        ctx.save(); ctx.translate(x, y); ctx.rotate(0.4); ctx.fillStyle = '#fffdf5'; ctx.fillRect(-7, -5, 14, 10); ctx.strokeStyle = '#bbb'; ctx.lineWidth = 1; ctx.strokeRect(-7, -5, 14, 10); ctx.restore();
      }
    } },

    // ---------- Intérieurs ----------
    whiteboard: { w: 4, h: 1, solid: false, sortOffset: 0, draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py + 11, p.pw - 4, 17, 2, '#f8fafc', '#5b6478');
      ctx.strokeStyle = p.ink || '#3d7cc9'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.px + 8, p.py + 16); ctx.lineTo(p.px + 8 + (p.pw - 20) * 0.6, p.py + 16);
      ctx.moveTo(p.px + 8, p.py + 20); ctx.lineTo(p.px + 8 + (p.pw - 20) * 0.8, p.py + 20); ctx.moveTo(p.px + 8, p.py + 24); ctx.lineTo(p.px + 8 + (p.pw - 20) * 0.4, p.py + 24); ctx.stroke();
      ctx.fillStyle = '#9aa0a8'; ctx.fillRect(p.px + 4, p.py + 27, p.pw - 8, 2);
    } },
    desk: { w: 2, h: 1, hit: [0.04, 0.3, 0.92, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      chairs(ctx, x, y + 21, p.pw, 2, p.chair);
      shadow(ctx, x + p.pw / 2, y + 22, p.pw / 2 - 2, 4);
      rr(ctx, x + 2, y + 4, p.pw - 4, 16, 2, '#e3c79a', true);
      ctx.fillStyle = '#8c949e'; ctx.fillRect(x + 4, y + 20, 3, 4); ctx.fillRect(x + p.pw - 7, y + 20, 3, 4);
      if (p.item === 'jokebook') { rr(ctx, x + 36, y + 7, 12, 9, 1, '#f2c94c', true); ctx.fillStyle = '#2b2230'; ctx.font = '700 5px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('LOL', x + 42, y + 13.5); }
      else if (p.item === 'tag') { ctx.fillStyle = '#e5483b'; ctx.font = '700 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BÊÊ', x + 18, y + 14); }
      else if (hash(p.x, p.y) > 0.5) { ctx.fillStyle = '#fff'; ctx.fillRect(x + 10, y + 8, 9, 7); }
    } },
    teacherdesk: { w: 2, h: 1, hit: [0.04, 0.3, 0.92, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + 26, p.pw / 2, 4);
      rr(ctx, x + 1, y + 2, p.pw - 2, 22, 3, '#b07f50', true);
      ctx.fillStyle = '#9c6c40'; ctx.fillRect(x + 4, y + 15, p.pw - 8, 8);
      rr(ctx, x + 8, y + 5, 12, 8, 1, '#3a3f55', true); ctx.fillStyle = '#9fd0ea'; ctx.fillRect(x + 9.5, y + 6.5, 9, 5);
      ctx.fillStyle = '#fff'; ctx.fillRect(x + 30, y + 6, 10, 7); ctx.fillStyle = '#f2c94c'; ctx.fillRect(x + 44, y + 5, 6, 8);
    } },
    arttable: { w: 3, h: 1, hit: [0.03, 0.3, 0.94, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + 24, p.pw / 2, 4);
      rr(ctx, x + 2, y + 3, p.pw - 4, 19, 2, '#f1efe9', true);
      [['#e5483b', 14], ['#4f8fd8', 26], ['#f2c94c', 38], ['#7cb85a', 66]].forEach(function (c) { circ(ctx, x + c[1], y + 12, 3.5, c[0]); });
      ctx.fillStyle = '#fff'; ctx.fillRect(x + 48, y + 6, 12, 12); ctx.strokeStyle = '#ccc'; ctx.strokeRect(x + 48, y + 6, 12, 12);
    } },
    easel: { w: 1, h: 1, hit: [0.25, 0.6, 0.5, 0.4], draw: function (ctx, p) {
      var cx = p.px + 16, by = p.py + 30;
      ctx.strokeStyle = '#8a5a34'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx - 8, by); ctx.lineTo(cx, by - 30); ctx.lineTo(cx + 8, by); ctx.moveTo(cx, by - 30); ctx.lineTo(cx, by); ctx.stroke();
      rr(ctx, cx - 10, by - 28, 20, 16, 1, '#fffdf6', true);
      circ(ctx, cx - 3, by - 21, 4, p.c1 || '#8ecae6'); circ(ctx, cx + 4, by - 18, 3, p.c2 || '#ffb703');
    } },
    shelf: { w: 3, h: 1, hit: [0.02, 0.2, 0.96, 0.8], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 1, y - 10, p.pw - 2, 38, 2, '#9a6a44', true);
      var cols = ['#e5483b', '#4f8fd8', '#f2c94c', '#7cb85a', '#9b6bd1', '#f08a2c', '#3f8f7a'];
      for (var r = 0; r < 3; r++) {
        ctx.fillStyle = '#7a5232'; ctx.fillRect(x + 4, y - 7 + r * 12 + 9, p.pw - 8, 2);
        for (var i = 0; i < Math.floor((p.pw - 8) / 5); i++) {
          var hh = 7 + hash(p.x + i, r) * 2;
          ctx.fillStyle = cols[Math.floor(hash(p.x * 3 + i, r + p.y) * cols.length)];
          ctx.fillRect(x + 4 + i * 5, y - 7 + r * 12 + 9 - hh, 4, hh);
        }
      }
    } },
    cditable: { w: 3, h: 1, hit: [0.03, 0.3, 0.94, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      chairs(ctx, x, y - 4, p.pw, 3, '#e07a5f'); chairs(ctx, x, y + 21, p.pw, 3, '#e07a5f');
      shadow(ctx, x + p.pw / 2, y + 22, p.pw / 2, 4);
      rr(ctx, x + 2, y + 3, p.pw - 4, 18, 4, '#f2e2c4', true);
      ctx.fillStyle = '#4f8fd8'; ctx.fillRect(x + 14, y + 7, 9, 11); ctx.fillStyle = '#fff'; ctx.fillRect(x + 50, y + 8, 12, 8);
      if (p.item === 'gift') { rr(ctx, x + 68, y + 6, 12, 10, 2, '#8ecae6', true); ctx.fillStyle = '#e5483b'; ctx.fillRect(x + 73, y + 6, 2, 10); }
    } },
    computer: { w: 2, h: 1, hit: [0.04, 0.3, 0.92, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      chairs(ctx, x, y + 21, p.pw, 2, '#4f6d9a');
      rr(ctx, x + 2, y + 6, p.pw - 4, 15, 2, '#d7dbe2', true);
      for (var i = 0; i < 2; i++) { rr(ctx, x + 6 + i * 30, y - 4, 20, 13, 2, '#2f3447', true); ctx.fillStyle = i ? '#a8e0c8' : '#9fd0ea'; ctx.fillRect(x + 8 + i * 30, y - 2, 16, 9); }
    } },
    beanbag: { w: 1, h: 1, hit: [0.15, 0.45, 0.7, 0.5], draw: function (ctx, p) {
      shadow(ctx, p.px + 16, p.py + 27, 12, 3);
      ctx.beginPath(); ctx.ellipse(p.px + 16, p.py + 20, 13, 10, 0, 0, Math.PI * 2); ctx.fillStyle = p.color || '#f4a261'; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.stroke();
      circ(ctx, p.px + 16, p.py + 16, 5, 'rgba(0,0,0,0.12)');
    } },
    lockers: { w: 4, h: 1, hit: [0, 0.1, 1, 0.9], sortOffset: 0.8, draw: function (ctx, p) {
      var n = Math.round(p.pw / 16);
      for (var i = 0; i < n; i++) {
        var x = p.px + i * 16, col = p.color || ['#4f7cac', '#5b8bbd'][i % 2];
        rr(ctx, x + 0.5, p.py - 12, 15, 40, 1, col, OUT);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        for (var k = 0; k < 3; k++) ctx.fillRect(x + 4, p.py - 8 + k * 3, 8, 1.2);
        ctx.fillStyle = '#dfe4ea'; ctx.fillRect(x + 11, p.py + 6, 2, 6);
      }
    } },
    locker: { w: 1, h: 1, hit: [0, 0.1, 1, 0.9], sortOffset: 0.8, draw: function (ctx, p) {
      var col = '#7a9a5a';
      for (var i = 0; i < 2; i++) {
        var x = p.px + i * 16;
        rr(ctx, x + 0.5, p.py - 12, 15, 40, 1, i === 0 ? col : '#5b8bbd', OUT);
        ctx.fillStyle = 'rgba(255,255,255,0.25)'; for (var k = 0; k < 3; k++) ctx.fillRect(x + 4, p.py - 8 + k * 3, 8, 1.2);
        ctx.fillStyle = '#dfe4ea'; ctx.fillRect(x + 11, p.py + 6, 2, 6);
      }
      if (p.tag) { ctx.save(); ctx.translate(p.px + 8, p.py + 10); ctx.rotate(-0.2); ctx.fillStyle = '#e5483b'; ctx.font = '800 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BÊÊÊ', 0, 0); ctx.restore(); }
      ctx.fillStyle = '#fff'; ctx.fillRect(p.px + 3, p.py - 2, 9, 4);
    } },
    clock: { w: 1, h: 1, solid: false, sortOffset: 0, draw: function (ctx, p, t) {
      var cx = p.px + 16, cy = p.py + 19;
      circ(ctx, cx, cy, 8, '#fff', '#3a3f55');
      var tt = C.Time ? C.Time.clockAngle() : 0;
      ctx.strokeStyle = '#2b2230'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(tt.h) * 4, cy + Math.sin(tt.h) * 4);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(tt.m) * 6, cy + Math.sin(tt.m) * 6); ctx.stroke();
    } },
    board: { w: 2, h: 1, hit: [0.1, 0.5, 0.8, 0.5], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 6, y + 10, 4, 20, 1, '#4b5263', true); rr(ctx, x + p.pw - 10, y + 10, 4, 20, 1, '#4b5263', true);
      rr(ctx, x + 1, y - 14, p.pw - 2, 30, 3, p.frame || '#3a3f55', true);
      rr(ctx, x + 4, y - 11, p.pw - 8, 24, 2, '#d7b98a');
      var papers = p.papers || ['#fff', '#fff59d', '#bbdefb'];
      papers.forEach(function (c, i) {
        ctx.fillStyle = c; ctx.fillRect(x + 8 + i * (p.pw - 16) / papers.length, y - 8 + (i % 2) * 3, (p.pw - 16) / papers.length - 3, 14);
        circ(ctx, x + 12 + i * (p.pw - 16) / papers.length, y - 8 + (i % 2) * 3, 1.3, '#e5483b');
      });
      if (p.torn) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x + 40, y - 8); ctx.lineTo(x + 54, y - 8); ctx.lineTo(x + 50, y + 1); ctx.lineTo(x + 44, y - 3); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#e5483b'; ctx.fillRect(x + 43, y - 6, 8, 1); }
      if (p.title) { ctx.fillStyle = '#fff'; ctx.font = '700 6px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(p.title, x + p.pw / 2, y - 15.5); }
    } },
    vitrine: { w: 2, h: 1, hit: [0.04, 0.2, 0.92, 0.8], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 2, y - 12, p.pw - 4, 40, 2, '#8a6a4a', true);
      ctx.fillStyle = 'rgba(190,225,240,0.85)'; ctx.fillRect(x + 5, y - 9, p.pw - 10, 30);
      ctx.fillStyle = '#7a5a3a'; ctx.fillRect(x + 5, y + 5, p.pw - 10, 2);
      [12, 26, 44].forEach(function (dx, i) { ctx.fillStyle = i === 1 ? '#c0c6cc' : '#f2c94c'; ctx.fillRect(x + dx, y - 3, 6, 8); ctx.fillRect(x + dx - 1, y + 3, 8, 2); });
    } },
    plant: { w: 1, h: 1, hit: [0.25, 0.5, 0.5, 0.5], draw: function (ctx, p) {
      rr(ctx, p.px + 9, p.py + 16, 14, 12, 3, '#e07a5f', true);
      circ(ctx, p.px + 11, p.py + 11, 6, '#4f9e52', true); circ(ctx, p.px + 21, p.py + 10, 6, '#5aa85a', true); circ(ctx, p.px + 16, p.py + 4, 6, '#64b465', true);
    } },
    watercooler: { w: 1, h: 1, hit: [0.2, 0.5, 0.6, 0.5], draw: function (ctx, p) {
      rr(ctx, p.px + 9, p.py + 6, 14, 22, 2, '#dfe4ea', true);
      rr(ctx, p.px + 10, p.py - 8, 12, 14, 4, 'rgba(120,190,230,0.8)', true);
      ctx.fillStyle = '#4f8fd8'; ctx.fillRect(p.px + 14, p.py + 12, 4, 3);
    } },
    counter: { w: 6, h: 1, hit: [0, 0.15, 1, 0.85], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x, y + 2, p.pw, 26, 2, '#c7ccd4', true);
      ctx.fillStyle = 'rgba(190,225,240,0.6)'; ctx.fillRect(x + 4, y - 6, p.pw - 8, 8);
      for (var i = 0; i < p.pw / 32; i++) {
        rr(ctx, x + 6 + i * 32, y + 6, 20, 10, 2, '#9aa3ad', true);
        circ(ctx, x + 12 + i * 32, y + 11, 3, ['#f2c94c', '#7cb85a', '#e5483b', '#f08a2c'][i % 4]);
        circ(ctx, x + 20 + i * 32, y + 11, 3, ['#e5483b', '#f2c94c', '#7cb85a', '#c8b6ff'][i % 4]);
      }
    } },
    ctable: { w: 4, h: 2, hit: [0.03, 0.25, 0.94, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + p.ph - 8, p.pw / 2 - 2, 6);
      chairs(ctx, x + 6, y + 2, p.pw - 12, 4, '#f08a2c');
      chairs(ctx, x + 6, y + p.ph - 14, p.pw - 12, 4, '#f08a2c');
      rr(ctx, x + 3, y + 10, p.pw - 6, p.ph - 24, 4, '#f4f1ea', true);
      var n = p.trays || 0;
      for (var b = 0; b < n; b++) { rr(ctx, x + 12 + b * 20, y + 14, 14, 10, 2, '#c3d6e0', true); circ(ctx, x + 19 + b * 20, y + 19, 2.5, '#f08a2c'); }
      if (p.far) { rr(ctx, x + p.pw - 20, y + p.ph - 30, 14, 10, 2, '#c3d6e0', true); circ(ctx, x + p.pw - 13, y + p.ph - 25, 2.5, '#7cb85a'); }
      if (p.bag) rr(ctx, x + 12 + n * 20, y + 1, 12, 11, 3, '#e2574c', true);
    } },
    cabinet: { w: 1, h: 1, hit: [0.05, 0.2, 0.9, 0.8], draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py - 12, 28, 40, 2, '#9aa3ad', true);
      for (var i = 0; i < 3; i++) { ctx.fillStyle = '#b7bec7'; ctx.fillRect(p.px + 5, p.py - 9 + i * 12, 22, 10); ctx.fillStyle = '#4b5263'; ctx.fillRect(p.px + 13, p.py - 5 + i * 12, 6, 2); }
    } },
    poster: { w: 2, h: 1, solid: false, sortOffset: 0, draw: function (ctx, p) {
      rr(ctx, p.px + 6, p.py + 11, p.pw - 12, 18, 2, p.bg || '#ffd166', '#5b6478');
      ctx.fillStyle = '#2b2230'; ctx.font = '800 5.5px sans-serif'; ctx.textAlign = 'center';
      var lines = C.arr(p.text || ['AFFICHE']);
      lines.forEach(function (l, i) { ctx.fillText(l, p.px + p.pw / 2, p.py + 18 + i * 6); });
    } },
    pillar: { w: 1, h: 1, hit: [0.3, 0.6, 0.4, 0.4], draw: function (ctx, p) {
      shadow(ctx, p.px + 16, p.py + 28, 8, 3);
      rr(ctx, p.px + 11, p.py - 30, 10, 58, 2, '#d7d1c6', true);
      ctx.fillStyle = 'rgba(0,0,0,0.1)'; ctx.fillRect(p.px + 17, p.py - 30, 4, 58);
    } },
    pingpong: { w: 3, h: 2, hit: [0.05, 0.2, 0.9, 0.65], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + p.ph - 10, p.pw / 2, 6);
      rr(ctx, x + 6, y + 8, p.pw - 12, p.ph - 22, 2, '#2f6f9f', true);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.2; ctx.strokeRect(x + 9, y + 11, p.pw - 18, p.ph - 28);
      ctx.beginPath(); ctx.moveTo(x + 9, y + 8 + (p.ph - 22) / 2); ctx.lineTo(x + p.pw - 9, y + 8 + (p.ph - 22) / 2); ctx.stroke();
      ctx.fillStyle = '#2b2230'; ctx.fillRect(x + p.pw / 2 - 1, y + 4, 2, p.ph - 14);
    } },
    sportshelf: { w: 2, h: 1, hit: [0.03, 0.2, 0.94, 0.8], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 1, y - 10, p.pw - 2, 38, 2, '#8c949e', true);
      ctx.fillStyle = '#6b737e'; ctx.fillRect(x + 3, y + 3, p.pw - 6, 2); ctx.fillRect(x + 3, y + 15, p.pw - 6, 2);
      circ(ctx, x + 12, y - 1, 5, '#f08a2c', true); circ(ctx, x + 26, y - 1, 5, '#fff', true); circ(ctx, x + 44, y - 1, 5, '#f2c94c', true);
      ctx.fillStyle = '#e5483b'; ctx.fillRect(x + 8, y + 7, 14, 8); ctx.fillStyle = '#4f8fd8'; ctx.fillRect(x + 30, y + 7, 18, 8);
      ctx.fillStyle = '#7cb85a'; ctx.fillRect(x + 6, y + 19, 50, 6);
    } },
    ballbin: { w: 1, h: 1, hit: [0.1, 0.4, 0.8, 0.6], draw: function (ctx, p) {
      rr(ctx, p.px + 3, p.py + 10, 26, 18, 3, '#3a3f55', true);
      circ(ctx, p.px + 10, p.py + 10, 5, '#f08a2c', true); circ(ctx, p.px + 20, p.py + 9, 5, '#fff', true); circ(ctx, p.px + 15, p.py + 5, 5, '#e5483b', true);
    } },
    hoop: { w: 1, h: 1, hit: [0.35, 0.6, 0.3, 0.4], sortOffset: 1, draw: function (ctx, p) {
      var cx = p.px + 16;
      shadow(ctx, cx, p.py + 29, 6, 2);
      rr(ctx, cx - 2, p.py - 30, 4, 60, 1, '#4b5263', true);
      rr(ctx, cx - 14, p.py - 44, 28, 18, 2, '#fff', true);
      ctx.strokeStyle = '#e5483b'; ctx.lineWidth = 1; ctx.strokeRect(cx - 6, p.py - 38, 12, 8);
      ctx.beginPath(); ctx.ellipse(cx, p.py - 24, 7, 2.5, 0, 0, Math.PI * 2); ctx.strokeStyle = '#f08a2c'; ctx.lineWidth = 1.8; ctx.stroke();
    } },
    courtlines: { w: 12, h: 8, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2;
      ctx.strokeRect(p.px + 4, p.py + 4, p.pw - 8, p.ph - 8);
      ctx.beginPath(); ctx.arc(p.px + p.pw / 2, p.py + 4, 64, 0, Math.PI); ctx.stroke();
      ctx.strokeRect(p.px + p.pw / 2 - 28, p.py + 4, 56, 70);
      ctx.beginPath(); ctx.arc(p.px + p.pw / 2, p.py + 74, 28, 0, Math.PI); ctx.stroke();
      ctx.strokeStyle = 'rgba(242,201,76,0.7)'; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(p.px + 4, p.py + p.ph - 4); ctx.lineTo(p.px + p.pw - 4, p.py + p.ph - 4); ctx.stroke(); ctx.setLineDash([]);
    } },
    pitchlines: { w: 28, h: 9, solid: false, sortOffset: 0, draw: function (ctx, p) {
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2;
      ctx.strokeRect(p.px + 2, p.py + 2, p.pw - 4, p.ph - 4);
      ctx.beginPath(); ctx.moveTo(p.px + p.pw / 2, p.py + 2); ctx.lineTo(p.px + p.pw / 2, p.py + p.ph - 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(p.px + p.pw / 2, p.py + p.ph / 2, 40, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeRect(p.px + 2, p.py + p.ph / 2 - 60, 60, 120); ctx.strokeRect(p.px + p.pw - 62, p.py + p.ph / 2 - 60, 60, 120);
    } },
    goal: { w: 1, h: 3, hit: [0.3, 0.1, 0.4, 0.85], draw: function (ctx, p) {
      var flip = p.flip ? -1 : 1, x0 = p.flip ? p.px + 26 : p.px + 6;
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1;
      for (var i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(x0, p.py + 6 + i * 14); ctx.lineTo(x0 + 18 * flip, p.py + 6 + i * 14); ctx.stroke(); }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(x0 + 20 * flip, p.py + 6); ctx.lineTo(x0, p.py + 6); ctx.lineTo(x0, p.py + p.ph - 6); ctx.lineTo(x0 + 20 * flip, p.py + p.ph - 6); ctx.stroke();
    } },
    cones: { w: 2, h: 1, solid: false, draw: function (ctx, p) {
      for (var i = 0; i < 3; i++) {
        var cx = p.px + 8 + i * 22, by = p.py + 26;
        ctx.fillStyle = '#f08a2c'; ctx.beginPath(); ctx.moveTo(cx - 6, by); ctx.lineTo(cx + 6, by); ctx.lineTo(cx, by - 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.4; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(cx - 3, by - 8, 6, 2);
      }
    } },
    bleachers: { w: 6, h: 1, hit: [0, 0.1, 1, 0.9], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + 30, p.pw / 2, 4);
      for (var r = 0; r < 3; r++) rr(ctx, x + 2, y - 12 + r * 12, p.pw - 4, 10, 2, ['#4f7cac', '#5b8bbd', '#6a9ad0'][r], true);
    } },
    bikerack: { w: 5, h: 1, hit: [0, 0.3, 1, 0.6], draw: function (ctx, p) {
      var x = p.px, y = p.py, cols = ['#e5483b', '#4f8fd8', '#7cb85a', '#f2c94c', '#9b6bd1'];
      ctx.fillStyle = '#7a808a'; ctx.fillRect(x + 2, y + 18, p.pw - 4, 3);
      for (var i = 0; i < Math.floor(p.pw / 32); i++) {
        if (hash(p.x + i, p.y) < 0.3) continue;
        var bx = x + 8 + i * 32;
        ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(bx, y + 22, 6, 0, Math.PI * 2); ctx.moveTo(bx + 22, y + 22); ctx.arc(bx + 16, y + 22, 6, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = cols[i % cols.length]; ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(bx, y + 22); ctx.lineTo(bx + 7, y + 13); ctx.lineTo(bx + 16, y + 22); ctx.moveTo(bx + 7, y + 13); ctx.lineTo(bx + 13, y + 12); ctx.stroke();
      }
    } },
    greenhouse: { w: 3, h: 2, hit: [0.03, 0.3, 0.94, 0.7], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      shadow(ctx, x + p.pw / 2, y + p.ph - 4, p.pw / 2, 6);
      rr(ctx, x + 2, y + 8, p.pw - 4, p.ph - 10, 2, 'rgba(200,235,240,0.75)', true);
      ctx.fillStyle = 'rgba(160,210,220,0.9)'; ctx.beginPath(); ctx.moveTo(x + 2, y + 8); ctx.lineTo(x + p.pw / 2, y - 8); ctx.lineTo(x + p.pw - 2, y + 8); ctx.closePath(); ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1;
      for (var i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x + i * p.pw / 4, y + 8); ctx.lineTo(x + i * p.pw / 4, y + p.ph - 2); ctx.stroke(); }
      circ(ctx, x + 20, y + 40, 6, '#5aa85a'); circ(ctx, x + 48, y + 42, 7, '#4f9e52'); circ(ctx, x + 74, y + 40, 6, '#5aa85a');
    } },
    planter: { w: 2, h: 1, hit: [0.03, 0.3, 0.94, 0.7], draw: function (ctx, p) {
      rr(ctx, p.px + 2, p.py + 8, p.pw - 4, 20, 2, '#a7683f', true);
      ctx.fillStyle = '#6b4a2a'; ctx.fillRect(p.px + 5, p.py + 11, p.pw - 10, 8);
      for (var i = 0; i < 4; i++) circ(ctx, p.px + 10 + i * 14, p.py + 10, 4, i % 2 ? '#7cb85a' : '#5aa85a', true);
    } },
    flowerpot: { w: 1, h: 1, hit: [0.2, 0.5, 0.6, 0.5], draw: function (ctx, p) {
      rr(ctx, p.px + 8, p.py + 16, 16, 12, 3, '#c0603c', true);
      circ(ctx, p.px + 12, p.py + 12, 4, '#ffb3c7', true); circ(ctx, p.px + 20, p.py + 11, 4, '#fff3a8', true); circ(ctx, p.px + 16, p.py + 7, 4, '#c8b6ff', true);
    } },
    panel: { w: 2, h: 1, hit: [0.05, 0.5, 0.9, 0.5], draw: function (ctx, p) {
      var x = p.px, y = p.py;
      rr(ctx, x + 6, y + 6, 4, 24, 1, '#4b5263', true); rr(ctx, x + p.pw - 10, y + 6, 4, 24, 1, '#4b5263', true);
      rr(ctx, x, y - 20, p.pw, 32, 4, '#2bb39a', true);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 7px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(p.title || 'CLUBS', x + p.pw / 2, y - 10);
      ctx.fillStyle = '#fff'; ctx.fillRect(x + 8, y - 6, p.pw - 16, 14);
      ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
      for (var i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + 11, y - 3 + i * 4); ctx.lineTo(x + p.pw - 11, y - 3 + i * 4); ctx.stroke(); }
      ctx.strokeStyle = '#e5483b'; ctx.beginPath(); ctx.moveTo(x + 12, y + 1); ctx.lineTo(x + 30, y + 1); ctx.stroke();
    } }
  };
  function tri3(ctx, x, y, col) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x - 4, y - 3); ctx.lineTo(x + 4, y - 3); ctx.lineTo(x, y + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 1; ctx.stroke();
  }

  /* ---------------- Rendu principal ---------------- */
  C.Render = {
    cam: { x: 0, y: 0 },
    zoom: 1.6,
    resize: function (canvas) {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = window.innerWidth, h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      this.dpr = dpr;
      this.zoom = C.clamp(Math.min(w / (24 * T), h / (14 * T)), 0.8, 2.6);
      if (Math.min(w, h) < 520) this.zoom = C.clamp(Math.min(w / (20 * T), h / (12 * T)), 0.9, 2);
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
      ctx.fillStyle = '#80be64'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      var z = R.zoom * R.dpr;
      ctx.setTransform(z, 0, 0, z, -Math.round(R.cam.x * z), -Math.round(R.cam.y * z));

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
        if (R.onScreen(p.px + p.pw / 2, p.py + p.ph / 2, 140 + Math.max(p.pw, p.ph) / 2)) items.push({ y: p.sortY, prop: p });
      });
      C.NPC.list.forEach(function (n) { if (!n.hidden && R.onScreen(n.x, n.y)) items.push({ y: n.y, npc: n }); });
      if (C.Ambient) C.Ambient.drawables().forEach(function (d) { items.push(d); });
      var P = C.Player;
      items.push({ y: P.y, player: true });
      items.sort(function (a, b) { return a.y - b.y; });
      items.forEach(function (it) {
        if (it.prop) it.prop.def.draw(ctx, it.prop, t);
        else if (it.npc) C.NPC.drawOne(ctx, it.npc, t);
        else if (it.draw) it.draw(ctx, t);
        else C.Player.draw(ctx, t);
      });

      // Indicateurs : objets à examiner, personnages qui ont du nouveau
      W.props.forEach(function (p) {
        if (!p.examine) return;
        var cx = p.px + p.pw / 2, cy = p.py - (p.def.markY != null ? p.def.markY : (p.markY != null ? p.markY : 6));
        var d = Math.hypot(cx - P.x, p.py + p.ph / 2 - P.y);
        if (d > T * 6) return;
        if (C.Dialogue.hasNew(p.examine)) R.sparkle(ctx, cx, cy, t);
      });
      C.NPC.list.forEach(function (n) {
        if (n.hidden || n.bubble || n.inScene) return;
        if (!R.onScreen(n.x, n.y)) return;
        if (C.Dialogue.hasNew(n.id)) R.talkMark(ctx, n.x, n.y - (n.def.markY || 46), t);
      });

      C.NPC.list.forEach(function (n) { if (n.bubble && !n.hidden && R.onScreen(n.x, n.y, 200)) R.bubble(ctx, n.x, n.y - (n.def.markY || 46) + 4, n.bubble.text, n.bubble.style, n.def); });
      if (P.bubble) R.bubble(ctx, P.x, P.y - 44, P.bubble.text, P.bubble.style, P.def);

      var target = C.Interact.target;
      if (target && !C.UI.busy()) R.keyHint(ctx, target.x, target.y, target.label, t);
    },

    sparkle: function (ctx, x, y, t) {
      var a = 0.6 + Math.sin(t * 4) * 0.3;
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
      rr(ctx, -10, -9, 20, 15, 7, '#ffffff', '#2b2230');
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-3, 5); ctx.lineTo(3, 5); ctx.lineTo(-2, 10); ctx.closePath(); ctx.fill();
      for (var i = -1; i <= 1; i++) circ(ctx, i * 5, -1.5, 1.8, '#ff7a45');
      ctx.restore();
    },
    bubble: function (ctx, x, y, text, style, def) {
      ctx.save();
      ctx.font = (style === 'thought' ? 'italic ' : '') + '600 10px Outfit, "Segoe UI", sans-serif';
      var maxW = 150, words = String(text).split(' '), lines = [], line = '';
      words.forEach(function (w) {
        var test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
      });
      if (line) lines.push(line);
      var w = 0; lines.forEach(function (l) { w = Math.max(w, ctx.measureText(l).width); });
      w += 14; var h = lines.length * 13 + 9;
      var bx = Math.round(x - w / 2), by = Math.round(y - h - 8);
      var fill = style === 'thought' ? '#f1ecff' : style === 'warn' ? '#fff1e0' : style === 'whisper' ? '#eef2f6' : '#ffffff';
      rr(ctx, bx, by, w, h, 7, fill, '#2b2230');
      ctx.fillStyle = fill; ctx.strokeStyle = '#2b2230'; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x - 5, by + h - 1); ctx.lineTo(x, by + h + 7); ctx.lineTo(x + 5, by + h - 1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x - 5, by + h); ctx.lineTo(x, by + h + 7); ctx.lineTo(x + 5, by + h); ctx.stroke();
      if (def && def.colors && def.colors.bg2 && style !== 'thought') { ctx.fillStyle = def.colors.bg2; ctx.fillRect(bx + 4, by + 2, w - 8, 2); }
      ctx.fillStyle = style === 'whisper' ? '#5a5f6e' : '#2a1d18'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      lines.forEach(function (l, i) { ctx.fillText(l, x, by + 5 + i * 13); });
      ctx.restore();
    },
    keyHint: function (ctx, x, y, label, t) {
      ctx.save();
      ctx.font = '600 10px Outfit, "Segoe UI", sans-serif';
      var txt = label || 'Interagir';
      var w = ctx.measureText(txt).width + 30;
      var bx = Math.round(x - w / 2), by = Math.round(y + Math.sin(t * 5) * 1.5);
      rr(ctx, bx, by, w, 18, 9, 'rgba(24,28,44,0.9)');
      rr(ctx, bx + 3, by + 3, 14, 12, 3, '#ff9f5a');
      ctx.fillStyle = '#1d2033'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('E', bx + 10, by + 9.5);
      ctx.fillStyle = '#fff'; ctx.textAlign = 'left';
      ctx.fillText(txt, bx + 21, by + 9.5);
      ctx.restore();
    }
  };
})(window.CDC);
