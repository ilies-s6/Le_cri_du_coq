/* =========================================================
   LE CRI DU COQ — Noyau du moteur
   Espace de noms global, hasard, état du jeu, conditions, effets.
   ========================================================= */
window.CDC = window.CDC || {};

(function (C) {
  C.TILE = 32;
  C.data = { episodes: {} };

  /* Un épisode = un dossier dans /episodes, dont chaque fichier
     complète l'objet renvoyé par CDC.ep('id'). */
  C.ep = function (id) {
    if (!C.data.episodes[id]) C.data.episodes[id] = { id: id };
    return C.data.episodes[id];
  };

  /* ---------- Hasard reproductible (une graine par partie) ---------- */
  C.makeRng = function (seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  C.rng = Math.random;
  C.pick = function (arr) { return arr[Math.floor(C.rng() * arr.length)]; };
  /* Un texte peut être une chaîne ou un tableau de variantes. */
  C.text = function (t) {
    if (typeof t === 'function') t = t(C.S);
    return Array.isArray(t) ? C.pick(t) : t;
  };
  /* Remplace {mot} par le texte de la variante tirée pour cette partie (voir config.words) */
  C.fmt = function (s) {
    var words = (C.EP && C.EP.config.words) || {};
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      var w = words[k]; if (!w) return m;
      var key = C.S.variant[w.from || k];
      return w[key] != null ? w[key] : m;
    });
  };
  C.arr = function (v) { return v == null ? [] : (Array.isArray(v) ? v : [v]); };
  C.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------- Stockage local (facultatif, jamais bloquant) ---------- */
  C.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem('cdc_' + k); return v == null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem('cdc_' + k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- État de la partie ---------- */
  C.newState = function (ep, seed) {
    C.rng = C.makeRng(seed);
    var S = {
      seed: seed,
      epId: ep.id,
      phase: 'enquete',
      vars: JSON.parse(JSON.stringify(ep.config.vars)),
      flags: {},
      clues: {},          // id -> ordre de découverte
      clueOrder: [],
      met: {},            // personnages rencontrés
      seen: {},           // conversations déjà vues
      hyp: {},            // hypothèses du carnet
      variant: {},
      time: 0,
      slot: 0,            // moment de la journée (index dans config.timeline)
      slotTime: 0,        // temps passé dans ce moment
      clueSlot: {},       // indice -> moment où il a été trouvé
      rel: {},            // relations entre personnages ('a|b' -> valeur)
      testi: [],          // témoignages notés
      phone: { seen: {}, acts: {}, replies: {}, caps: {}, notified: {} },
      deduction: null,
      event: null
    };
    // Relations de départ entre les personnages
    (ep.config.relations || []).forEach(function (r) { S.rel[C.relKey(r.a, r.b)] = r.v || 0; });
    // Personnages déjà connus (même classe)
    C.arr(ep.config.knownAtStart).forEach(function (id) { S.met[id] = true; });
    // Tirage des variantes de cette partie (rejouabilité)
    var vs = ep.config.variants || {};
    Object.keys(vs).forEach(function (k) {
      var opts = vs[k];
      var total = 0, i;
      for (i = 0; i < opts.length; i++) total += (opts[i].weight || 1);
      var r = C.rng() * total;
      for (i = 0; i < opts.length; i++) {
        r -= (opts[i].weight || 1);
        if (r <= 0) break;
      }
      S.variant[k] = opts[Math.min(i, opts.length - 1)].value;
    });
    return S;
  };

  /* ---------- Conditions ----------
     Exemple : { phase:'enquete', clues:['c_banc'], min:{trust_agneau:2}, notFlag:'x' } */
  C.check = function (c) {
    if (!c) return true;
    var S = C.S;
    if (Array.isArray(c)) return c.every(C.check);
    for (var k in c) {
      var v = c[k], list, i;
      switch (k) {
        case 'phase':
          if (C.arr(v).indexOf(S.phase) < 0) return false; break;
        case 'flag': case 'flags':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (!S.flags[list[i]]) return false; break;
        case 'notFlag': case 'notFlags':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (S.flags[list[i]]) return false; break;
        case 'anyFlag':
          if (!C.arr(v).some(function (f) { return S.flags[f]; })) return false; break;
        case 'clue': case 'clues':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (!S.clues[list[i]]) return false; break;
        case 'anyClue':
          if (!C.arr(v).some(function (id) { return S.clues[id]; })) return false; break;
        case 'notClue':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (S.clues[list[i]]) return false; break;
        case 'minClues':
          if (S.vars.clues_found < v) return false; break;
        case 'min':
          for (var a in v) if ((S.vars[a] || 0) < v[a]) return false; break;
        case 'max':
          for (var b in v) if ((S.vars[b] || 0) > v[b]) return false; break;
        case 'variant':
          for (var vk in v) if (C.arr(v[vk]).indexOf(S.variant[vk]) < 0) return false; break;
        case 'met':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (!S.met[list[i]]) return false; break;
        case 'seen':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (!S.seen[list[i]]) return false; break;
        case 'notSeen':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (S.seen[list[i]]) return false; break;
        case 'any':
          if (!v.some(C.check)) return false; break;
        case 'not':
          if (C.check(v)) return false; break;
        case 'time':
          if (S.time < v) return false; break;
        case 'slotTime':
          if (S.slotTime < v) return false; break;
        case 'day':
          if (C.arr(v).indexOf(C.Time.cur().day) < 0) return false; break;
        case 'moment':
          if (C.arr(v).indexOf(C.Time.cur().moment) < 0) return false; break;
        case 'slot':
          if (C.arr(v).indexOf(C.Time.cur().id) < 0) return false; break;
        case 'minSlot':
          if (S.slot < C.Time.index(v)) return false; break;
        case 'maxSlot':
          if (S.slot > C.Time.index(v)) return false; break;
        case 'minRel':
          for (var r1 in v) if ((S.rel[C.relKey.apply(null, r1.split('|'))] || 0) < v[r1]) return false; break;
        case 'maxRel':
          for (var r2 in v) if ((S.rel[C.relKey.apply(null, r2.split('|'))] || 0) > v[r2]) return false; break;
        case 'reply':      // réponse choisie dans le téléphone : { r_id: index }
          for (var rp in v) if (C.arr(v[rp]).indexOf(S.phone.replies[rp]) < 0) return false; break;
        case 'act':        // action faite sur un message : 'msg:action'
          list = C.arr(v); for (i = 0; i < list.length; i++) if (!S.phone.acts[list[i]]) return false; break;
        case 'notAct':
          list = C.arr(v); for (i = 0; i < list.length; i++) if (S.phone.acts[list[i]]) return false; break;
      }
    }
    return true;
  };

  /* ---------- Effets ----------
     Exemple : { add:{trust_agneau:1}, flag:'x', clue:'c_banc', set:{victim_identified:true} } */
  C.apply = function (e) {
    if (!e) return;
    var S = C.S;
    if (Array.isArray(e)) { e.forEach(C.apply); return; }
    if (e.add) for (var a in e.add) S.vars[a] = (S.vars[a] || 0) + e.add[a];
    if (e.set) for (var b in e.set) S.vars[b] = e.set[b];
    C.arr(e.flag).concat(C.arr(e.flags)).forEach(function (f) { S.flags[f] = true; });
    C.arr(e.unflag).forEach(function (f) { delete S.flags[f]; });
    C.arr(e.met).forEach(function (m) { S.met[m] = true; });
    C.arr(e.clue).concat(C.arr(e.clues)).forEach(function (id) { C.giveClue(id); });
    if (e.rel) for (var rk in e.rel) {
      var key = C.relKey.apply(null, rk.split('|'));
      S.rel[key] = C.clamp((S.rel[key] || 0) + e.rel[rk], -3, 3);
    }
    if (e.testi) C.arr(e.testi).forEach(function (t) {
      if (S.testi.some(function (x) { return x.id === t.id; })) return;
      S.testi.push({ id: t.id, who: t.who, text: t.text, slot: S.slot });
    });
    if (e.mood && C.NPC) for (var mid in e.mood) C.NPC.setMood(mid, e.mood[mid], e.moodFor || 10);
    if (e.walk && C.NPC) for (var wid in e.walk) C.NPC.walkTo(wid, e.walk[wid], e.walkSpeed);
    if (e.say && C.NPC) C.arr(e.say).forEach(function (l, i) {
      setTimeout(function () { if (l[0] === 'coq') C.Player.say(l[1], 2.6); else C.NPC.say(l[0], l[1], 2.8, l[2]); }, i * 1100);
    });
    if (e.toast) C.UI.toast(e.toast);
    if (e.phase) C.setPhase(e.phase);
    if (e.open) C.pendingOpen = e.open;   // ouvre un écran (carnet, activité...) à la fin du dialogue
    if (C.onStateChange) C.onStateChange();
  };

  C.giveClue = function (id) {
    var S = C.S, ep = C.EP;
    if (S.clues[id]) return false;
    var clue = ep.cluesById[id];
    if (!clue) { console.warn('Indice inconnu : ' + id); return false; }
    S.clueOrder.push(id);
    S.clueSlot[id] = S.slot;
    S.clues[id] = S.clueOrder.length;
    S.vars.clues_found = S.clueOrder.length;
    if (clue.onFound) C.apply(clue.onFound);
    // Chaque indice qui pointe vers le harceleur augmente la suspicion
    (clue.points || []).forEach(function (p) {
      if (p === 'harceleur:' + ep.config.solution.harceleur) S.vars.suspicion_renard += 1;
    });
    C.Audio.play('clue');
    C.UI.clueToast(clue);
    if (C.onClueFound) C.onClueFound(clue);
    return true;
  };

  C.relKey = function (a, b) { return a < b ? a + '|' + b : b + '|' + a; };
  C.rel = function (a, b) { return C.S.rel[C.relKey(a, b)] || 0; };

  C.charName = function (id) {
    if (id === 'narr') return '';
    var ch = C.EP.charactersById[id];
    return ch ? ch.name : id;
  };
})(window.CDC);
