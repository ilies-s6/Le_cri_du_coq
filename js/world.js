/* Monde : lecture de la carte ASCII, objets (décors), collisions, zones. */
(function (C) {
  var T = C.TILE;

  C.World = {
    build: function (map) {
      var W = this;
      W.map = map;
      W.rows = map.ascii.map(function (r) { return r; });
      W.h = W.rows.length;
      W.w = W.rows[0].length;
      W.pw = W.w * T;
      W.ph = W.h * T;
      W.legend = map.legend;
      W.props = [];
      W.refreshProps();
    },

    /* Les objets peuvent apparaître selon une condition (variante, phase...) */
    refreshProps: function () {
      var W = this;
      W.props = [];
      W.map.props.forEach(function (p) {
        if (p.if && !C.check(p.if)) return;
        var def = C.PropTypes[p.type] || C.PropTypes._default;
        var w = p.w || def.w || 1, h = p.h || def.h || 1;
        var prop = Object.assign({}, p, {
          px: p.x * T, py: p.y * T, pw: w * T, ph: h * T,
          solid: p.solid != null ? p.solid : def.solid !== false,
          def: def
        });
        if (p.kindFrom) prop.kind = C.S.variant[p.kindFrom];   // l'apparence dépend de la variante tirée
        // Boîte de collision : par défaut la base de l'objet
        var hb = p.hit || def.hit || [0, 0.4, 1, 0.6];
        prop.hx = prop.px + hb[0] * prop.pw;
        prop.hy = prop.py + hb[1] * prop.ph;
        prop.hw = hb[2] * prop.pw;
        prop.hh = hb[3] * prop.ph;
        prop.sortY = prop.py + prop.ph;
        if (def.sortOffset != null) prop.sortY = prop.py + def.sortOffset * prop.ph;
        W.props.push(prop);
      });
    },

    tileAt: function (tx, ty) {
      if (ty < 0 || ty >= this.h || tx < 0 || tx >= this.w) return '#';
      return this.rows[ty][tx];
    },
    tileDef: function (ch) { return this.legend[ch] || this.legend['.']; },
    solidTile: function (tx, ty) { return !!this.tileDef(this.tileAt(tx, ty)).solid; },

    /* Est-ce qu'un rectangle (en pixels) touche un obstacle ? */
    blocked: function (x, y, w, h, ignore) {
      var x0 = Math.floor(x / T), x1 = Math.floor((x + w - 0.01) / T);
      var y0 = Math.floor(y / T), y1 = Math.floor((y + h - 0.01) / T);
      for (var ty = y0; ty <= y1; ty++)
        for (var tx = x0; tx <= x1; tx++)
          if (this.solidTile(tx, ty)) return true;
      for (var i = 0; i < this.props.length; i++) {
        var p = this.props[i];
        if (!p.solid) continue;
        if (x < p.hx + p.hw && x + w > p.hx && y < p.hy + p.hh && y + h > p.hy) return true;
      }
      if (C.NPC) {
        for (var j = 0; j < C.NPC.list.length; j++) {
          var n = C.NPC.list[j];
          if (n === ignore || n.hidden) continue;
          var nx = n.x - 9, ny = n.y - 6;
          if (x < nx + 18 && x + w > nx && y < ny + 10 && y + h > ny) return true;
        }
      }
      return false;
    },

    zoneAt: function (px, py) {
      var tx = px / T, ty = py / T;
      var zs = this.map.zones;
      for (var i = 0; i < zs.length; i++) {
        var r = zs[i].rect;
        if (tx >= r[0] && tx < r[2] + 1 && ty >= r[1] && ty < r[3] + 1) return zs[i];
      }
      return null;
    },
    zoneById: function (id) {
      return this.map.zones.filter(function (z) { return z.id === id; })[0];
    }
  };
})(window.CDC);
