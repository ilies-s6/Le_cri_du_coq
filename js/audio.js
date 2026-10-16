/* Petits sons synthétisés (aucun fichier audio nécessaire). M = couper le son. */
(function (C) {
  var ctx = null;
  var muted = C.store.get('muted', false);

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, vol) {
    var c = ensure(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    var t = c.currentTime + start;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol || 0.08, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }

  var sounds = {
    clue: function () { tone(660, 0, 0.18, 'triangle'); tone(880, 0.09, 0.22, 'triangle'); tone(1320, 0.18, 0.3, 'triangle', 0.05); },
    talk: function () { tone(420 + Math.random() * 80, 0, 0.05, 'square', 0.025); },
    open: function () { tone(520, 0, 0.08, 'sine', 0.06); tone(780, 0.05, 0.1, 'sine', 0.05); },
    close: function () { tone(600, 0, 0.08, 'sine', 0.05); tone(400, 0.05, 0.1, 'sine', 0.04); },
    select: function () { tone(700, 0, 0.06, 'triangle', 0.05); },
    wrong: function () { tone(330, 0, 0.18, 'sine', 0.06); tone(262, 0.12, 0.25, 'sine', 0.05); },
    reveal: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.14, 0.5, 'triangle', 0.06); }); },
    bell: function () { [988, 784, 988, 784].forEach(function (f, i) { tone(f, i * 0.16, 0.22, 'triangle', 0.04); }); },
    buzz: function () { tone(180, 0, 0.12, 'square', 0.025); tone(180, 0.18, 0.12, 'square', 0.025); },
    msg: function () { tone(880, 0, 0.07, 'sine', 0.05); tone(1175, 0.07, 0.1, 'sine', 0.045); },
    send: function () { tone(660, 0, 0.06, 'sine', 0.04); tone(990, 0.04, 0.08, 'sine', 0.04); },
    rooster: function () { tone(700, 0, 0.12, 'sawtooth', 0.03); tone(900, 0.12, 0.12, 'sawtooth', 0.03); tone(1100, 0.24, 0.35, 'sawtooth', 0.03); }
  };

  C.Audio = {
    play: function (name) { if (!muted && sounds[name]) try { sounds[name](); } catch (e) {} },
    unlock: ensure,
    toggle: function () { muted = !muted; C.store.set('muted', muted); return muted; },
    isMuted: function () { return muted; }
  };
})(window.CDC);
