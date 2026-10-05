/* Commandes tactiles pour téléphone et tablette :
   joystick à gauche, boutons E (interagir) et Carnet à droite.
   Elles apparaissent automatiquement dès que l'écran est touché. */
(function (C) {
  var joy, knob, active = null, cx = 0, cy = 0, R = 46;

  function isTouch() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  }
  C.isTouch = isTouch;

  function enable() {
    if (document.body.classList.contains('touch')) return;
    document.body.classList.add('touch');
  }

  function setKnob(dx, dy) {
    knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
  }

  function move(t) {
    var dx = t.clientX - cx, dy = t.clientY - cy;
    var d = Math.hypot(dx, dy);
    if (d > R) { dx = dx / d * R; dy = dy / d * R; d = R; }
    setKnob(dx, dy);
    var k = d < 10 ? 0 : 1;   // petite zone morte au centre
    C.Input.setVirtualAxis(k * dx / R, k * dy / R);
  }
  function end() {
    active = null;
    setKnob(0, 0);
    C.Input.setVirtualAxis(0, 0);
  }

  window.addEventListener('load', function () {
    if (isTouch()) enable();
    window.addEventListener('touchstart', enable, { passive: true });

    joy = document.getElementById('joystick');
    knob = joy.querySelector('.joy-knob');
    joy.addEventListener('touchstart', function (e) {
      e.preventDefault();
      var t = e.changedTouches[0];
      active = t.identifier;
      var r = joy.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      move(t);
    }, { passive: false });
    joy.addEventListener('touchmove', function (e) {
      e.preventDefault();
      for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === active) move(e.changedTouches[i]);
    }, { passive: false });
    ['touchend', 'touchcancel'].forEach(function (ev) {
      joy.addEventListener(ev, function (e) {
        for (var i = 0; i < e.changedTouches.length; i++) if (e.changedTouches[i].identifier === active) end();
      });
    });

    function tapButton(id, action) {
      var b = document.getElementById(id);
      b.addEventListener('touchstart', function (e) { e.preventDefault(); b.classList.add('down'); action(); }, { passive: false });
      b.addEventListener('touchend', function () { b.classList.remove('down'); });
      b.addEventListener('click', action);   // souris / tests
    }
    tapButton('touch-e', function () { C.Input.press('interact'); });
    tapButton('touch-nb', function () { C.Input.press('notebook'); });
  });
})(window.CDC);
