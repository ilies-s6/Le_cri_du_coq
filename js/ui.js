/* Interface générale : HUD, notifications, fondus, menus, écrans superposés. */
(function (C) {
  function $(id) { return document.getElementById(id); }
  var overlays = [];   // écrans ouverts (carnet, déduction, téléphone...)
  var toastQ = [], toastBusy = false;

  C.UI = {
    $: $,
    el: function (tag, cls, html) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (html != null) e.innerHTML = html;
      return e;
    },
    busy: function () { return C.Dialogue.isOpen() || overlays.length > 0; },

    open: function (id) {
      var o = $(id);
      if (overlays.indexOf(id) < 0) overlays.push(id);
      o.classList.remove('hidden');
      C.Input.clearPressed();
    },
    close: function (id) {
      var i = overlays.indexOf(id);
      if (i >= 0) overlays.splice(i, 1);
      $(id).classList.add('hidden');
      C.Input.clearPressed();
    },
    top: function () { return overlays[overlays.length - 1]; },
    isOpen: function (id) { return overlays.indexOf(id) >= 0; },

    openPanel: function (name) {
      if (name === 'notebook') C.Notebook.open();
      else if (name === 'event') C.Event.open();
      else if (name === 'deduction') C.Deduction.open();
      else if (name === 'phone') C.Phone.open();
      else if (name.indexOf('phone:') === 0) C.Phone.open('thread', name.slice(6));
    },
    /* Action déclenchée par un objet du décor (ex. l'horloge) */
    action: function (name) {
      if (name === 'time') C.Time.request();
      else this.openPanel(name);
    },

    updateHUD: function () {
      var S = C.S, ep = C.EP;
      if (!S) return;
      var s = C.Time.cur();
      $('hud-day').textContent = s.dayName;
      $('hud-clock').textContent = s.time;
      $('hud-moment').textContent = s.title;
      $('hud-clues').textContent = S.vars.clues_found;
      var obj = '';
      var list = ep.config.objectives || [];
      for (var i = 0; i < list.length; i++) if (C.check(list[i].if)) { obj = C.text(list[i].text); break; }
      $('hud-objective').textContent = obj;
      var canSolve = S.phase === 'enquete' && S.vars.clues_found >= ep.config.minCluesToSolve && C.check(ep.config.solveIf);
      $('btn-notebook').classList.toggle('pulse', canSolve && !S.flags._solve_seen);
      var n = C.Phone ? C.Phone.totalUnseen() : 0;
      var b = $('ph-badge');
      b.textContent = n; b.classList.toggle('hidden', !n);
      $('btn-time').classList.toggle('off', !!C.Time.blocker());
      $('btn-time').classList.toggle('ready', !C.Time.blocker() && S.slotTime > 60 && C.check(s.keyIf));
    },
    zoneBanner: function (zone) {
      var b = $('zone-banner');
      b.textContent = zone.name;
      b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
      $('hud-zone').textContent = zone.name;
    },
    setHint: function (txt) {
      var h = $('hint');
      if (!txt) { h.classList.add('hidden'); return; }
      h.textContent = txt; h.classList.remove('hidden');
    },

    toast: function (html, cls) {
      toastQ.push({ html: html, cls: cls || '' });
      if (!toastBusy) this.nextToast();
    },
    nextToast: function () {
      var self = this;
      var t = toastQ.shift();
      if (!t) { toastBusy = false; return; }
      toastBusy = true;
      var box = $('toasts');
      var d = this.el('div', 'toast ' + t.cls, t.html);
      box.appendChild(d);
      setTimeout(function () { d.classList.add('show'); }, 20);
      setTimeout(function () { d.classList.remove('show'); setTimeout(function () { d.remove(); }, 400); }, t.cls === 'clue' ? 3600 : 3400);
      setTimeout(function () { self.nextToast(); }, 700);
    },
    clueToast: function (clue) {
      this.toast('<div class="t-kicker">🔍 Nouvel indice</div><div class="t-title">' + clue.title + '</div><div class="t-sub">' + clue.place + ' · noté dans le carnet</div>', 'clue');
      var hc = $('hud-clue-box');
      hc.classList.remove('bump'); void hc.offsetWidth; hc.classList.add('bump');
    },

    fade: function (mode) {
      var f = $('fade');
      if (mode === 'out') f.classList.add('on');
      else if (mode === 'in') f.classList.remove('on');
      else { f.classList.add('on'); setTimeout(function () { f.classList.remove('on'); }, 500); }
    },

    modal: function (opts) {
      var m = $('modal');
      m.innerHTML = '';
      var card = this.el('div', 'modal-card ' + (opts.cls || ''));
      if (opts.icon) card.appendChild(this.el('div', 'modal-icon', opts.icon));
      if (opts.title) card.appendChild(this.el('h2', '', opts.title));
      if (opts.html) card.appendChild(this.el('div', 'modal-body', opts.html));
      var row = this.el('div', 'modal-buttons');
      (opts.buttons || [{ text: 'OK' }]).forEach(function (b) {
        var btn = C.UI.el('button', 'btn ' + (b.cls || ''), b.text);
        btn.addEventListener('click', function () { C.UI.close('modal'); if (b.action) b.action(); });
        row.appendChild(btn);
      });
      card.appendChild(row);
      m.appendChild(card);
      this.open('modal');
      setTimeout(function () { var f = row.querySelector('button:last-child'); if (f) f.focus(); }, 30);
    },

    controlsHtml: function () {
      return '<div class="keys">' +
        '<div><kbd>Z</kbd><kbd>Q</kbd><kbd>S</kbd><kbd>D</kbd> / <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd><span>Se déplacer</span></div>' +
        '<div><kbd>E</kbd> / <kbd>Entrée</kbd><span>Parler, examiner, continuer</span></div>' +
        '<div><kbd>1</kbd> … <kbd>5</kbd> / clic<span>Choisir une réponse</span></div>' +
        '<div><kbd>C</kbd> / <kbd>Tab</kbd><span>Carnet d\'enquête</span></div>' +
        '<div><kbd>P</kbd><span>Téléphone</span></div>' +
        '<div><kbd>T</kbd><span>Passer au moment suivant</span></div>' +
        '<div><kbd>Échap</kbd><span>Fermer / pause</span></div>' +
        '<div><kbd>M</kbd><span>Couper le son</span></div></div>' +
        '<p class="muted">Sur tablette : joystick en bas à gauche, bouton <b>E</b> pour interagir, et les boutons en haut de l\'écran.</p>';
    },

    pause: function () {
      if (this.busy()) return;
      C.Save.save();
      C.UI.modal({
        icon: '⏸', title: 'Pause',
        html: '<p class="muted center">Ta partie est sauvegardée automatiquement.</p>',
        cls: 'pause',
        buttons: [
          { text: '🎮 Commandes', cls: 'btn-ghost', action: function () { C.UI.modal({ icon: '🎮', title: 'Commandes', html: C.UI.controlsHtml(), buttons: [{ text: 'Retour au jeu' }] }); } },
          { text: '🏠 Menu principal', cls: 'btn-ghost', action: function () { C.Save.save(); try { location.hash = ''; } catch (e) {} location.reload(); } },
          { text: '▶ Reprendre' }
        ]
      });
    }
  };
})(window.CDC);
