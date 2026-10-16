/* 🎓 Petit tutoriel au début de la première partie : une bulle discrète
   qui avance quand le joueur a fait l'action demandée. */
(function (C) {
  var step = -1, steps = null, el = null, moved = 0;

  function keysOrTouch(k, tch) { return document.body.classList.contains('touch') ? tch : k; }

  C.Tutorial = {
    start: function () {
      steps = [
        { id: 'move', html: function () { return keysOrTouch('Déplace-toi avec <kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> ou les flèches.', 'Déplace-toi avec le <b>joystick</b> en bas à gauche.'); } },
        { id: 'talk', html: function () { return keysOrTouch('Approche-toi de quelqu\'un ou d\'un objet qui brille <span class="spark">✦</span> et appuie sur <kbd>E</kbd>.', 'Approche-toi de quelqu\'un ou d\'un objet qui brille <span class="spark">✦</span> et touche <b>E</b>.'); } },
        { id: 'notebook', html: function () { return keysOrTouch('Ton <b>carnet d\'enquête</b> garde tout ce que tu découvres : <kbd>C</kbd>.', 'Ton <b>carnet d\'enquête</b> garde tout ce que tu découvres : touche 📖.'); } },
        { id: 'phone', html: function () { return keysOrTouch('Ton <b>téléphone</b> : <kbd>P</kbd>. Ce qui se passe en ligne compte aussi.', 'Ton <b>téléphone</b> : touche 📱. Ce qui se passe en ligne compte aussi.'); } },
        { id: 'time', html: function () { return keysOrTouch('Quand tu as fini d\'observer, passe au moment suivant avec <kbd>T</kbd> ou ⏰. Prends ton temps : rien ne presse.', 'Quand tu as fini d\'observer, passe au moment suivant avec ⏰. Prends ton temps : rien ne presse.'); }, auto: 9 }
      ];
      el = C.UI.$('coach');
      step = 0; moved = 0;
      this.show();
    },
    active: function () { return step >= 0 && steps && step < steps.length; },
    show: function () {
      if (!this.active()) { el && el.classList.add('hidden'); return; }
      var s = steps[step];
      el.innerHTML = '<div class="coach-step">' + (step + 1) + ' / ' + steps.length + '</div><div class="coach-text">' + s.html() + '</div>' +
        '<button class="coach-skip" title="Passer le tutoriel">Passer</button>';
      el.querySelector('.coach-skip').addEventListener('click', function () { C.Tutorial.finish(); });
      el.classList.remove('hidden');
      el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
      this.timer = s.auto || 0;
    },
    event: function (id) {
      if (!this.active()) return;
      if (steps[step].id === id) this.next();
    },
    next: function () { step++; C.Audio.play('select'); if (!this.active()) this.finish(); else this.show(); },
    finish: function () {
      step = -1;
      C.store.set('tuto_done', true);
      if (el) el.classList.add('hidden');
    },
    update: function (dt) {
      if (!this.active()) return;
      var s = steps[step];
      if (s.id === 'move' && C.Player.moving) { moved += dt; if (moved > 1.2) this.next(); }
      if (s.auto) { this.timer -= dt; if (this.timer <= 0) this.next(); }
      el.classList.toggle('dim', C.UI.busy());
    }
  };
})(window.CDC);
