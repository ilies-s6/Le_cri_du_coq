/* 💾 Sauvegarde automatique (dans le navigateur) pour pouvoir reprendre une partie. */
(function (C) {
  var KEY = 'save_';
  var timer = 0, pending = false;

  C.Save = {
    has: function (epId) { var d = C.store.get(KEY + epId, null); return !!(d && d.v === 2 && d.S); },
    info: function (epId) {
      var d = C.store.get(KEY + epId, null);
      if (!d || d.v !== 2) return null;
      var ep = C.ep(epId), s = ep.config.timeline[d.S.slot] || ep.config.timeline[0];
      return { when: s.dayName + ' · ' + s.time + ' · ' + s.title, clues: d.S.clueOrder.length, phase: d.S.phase, date: d.date };
    },
    load: function (epId) { return C.store.get(KEY + epId, null); },
    clear: function (epId) { try { localStorage.removeItem('cdc_' + KEY + epId); } catch (e) {} },

    save: function () {
      var S = C.S;
      if (!S || S.phase === 'evenement' || C.Cutscene.active || (C.Time && C.Time.isGoing())) return false;
      var P = C.Player;
      C.store.set(KEY + S.epId, {
        v: 2, date: Date.now(), S: S,
        player: { x: P.x, y: P.y, dir: P.dir }
      });
      pending = false;
      return true;
    },
    /* Sauvegarde un peu plus tard (après un dialogue, un indice...) */
    soon: function () { pending = true; timer = Math.min(timer, 1.5); },

    update: function (dt) {
      timer -= dt;
      if (timer > 0) return;
      timer = 20;
      if (!C.UI.busy() || pending) this.save();
    }
  };

  window.addEventListener('pagehide', function () { if (C.S) C.Save.save(); });
})(window.CDC);
