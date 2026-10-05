/* Clavier : ZQSD / WASD / flèches pour bouger, E pour interagir, C ou Tab pour le carnet. */
(function (C) {
  var down = {};
  var pressed = {};

  var MAP = {
    up: ['KeyW', 'ArrowUp'],            // KeyW = touche Z sur un clavier AZERTY
    down: ['KeyS', 'ArrowDown'],
    left: ['KeyA', 'ArrowLeft'],        // KeyA = touche Q sur un clavier AZERTY
    right: ['KeyD', 'ArrowRight'],
    interact: ['KeyE', 'Enter', 'Space'],
    notebook: ['KeyC', 'Tab'],
    back: ['Escape'],
    mute: ['KeyM']
  };
  // Les lettres tapées (e.key) servent de secours si le navigateur ne fournit pas e.code
  var KEYS = { z: 'up', w: 'up', s: 'down', q: 'left', a: 'left', d: 'right', e: 'interact', c: 'notebook', m: 'mute' };

  function actionOf(e) {
    for (var a in MAP) if (MAP[a].indexOf(e.code) >= 0) return a;
    var k = (e.key || '').toLowerCase();
    return KEYS[k] || null;
  }

  window.addEventListener('keydown', function (e) {
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    var a = actionOf(e);
    if (!a) {
      if (/^Digit[1-4]$/.test(e.code)) { pressed['choice' + e.code.slice(5)] = true; }
      return;
    }
    if (a !== 'back') e.preventDefault();
    if (!down[a]) pressed[a] = true;
    down[a] = true;
    C.Audio.unlock();
  });
  window.addEventListener('keyup', function (e) {
    var a = actionOf(e);
    if (a) down[a] = false;
  });
  window.addEventListener('blur', function () { down = {}; });

  var virt = { x: 0, y: 0 };   // joystick tactile (voir js/touch.js)

  C.Input = {
    /* Utilisé par les commandes tactiles */
    setVirtualAxis: function (x, y) { virt.x = x; virt.y = y; },
    press: function (a) { pressed[a] = true; C.Audio.unlock(); },
    isDown: function (a) { return !!down[a]; },
    /* Vrai une seule fois par appui */
    consume: function (a) { if (pressed[a]) { pressed[a] = false; return true; } return false; },
    clearPressed: function () { pressed = {}; },
    axis: function () {
      var x = (down.right ? 1 : 0) - (down.left ? 1 : 0);
      var y = (down.down ? 1 : 0) - (down.up ? 1 : 0);
      if (x && y) { x *= 0.7071; y *= 0.7071; }
      if (!x && !y && (virt.x || virt.y)) return { x: virt.x, y: virt.y };
      return { x: x, y: y };
    }
  };
})(window.CDC);
