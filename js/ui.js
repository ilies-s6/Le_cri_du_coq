/* Interface générale : HUD, notifications, fondus, gestion des écrans superposés. */
(function (C) {
  function $(id) { return document.getElementById(id); }
  var overlays = [];   // écrans ouverts (carnet, déduction...)
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

    /* Écrans superposés */
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

    /* Ouvre un panneau demandé par un effet { open:'...' } */
    openPanel: function (name) {
      if (name === 'notebook') C.Notebook.open();
      else if (name === 'event') C.Event.open();
      else if (name === 'deduction') C.Deduction.open();
    },

    /* HUD */
    updateHUD: function () {
      var S = C.S, ep = C.EP;
      $('hud-clues').textContent = S.vars.clues_found + ' / ' + ep.clues.length;
      var obj = '';
      var list = ep.config.objectives || [];
      for (var i = 0; i < list.length; i++) if (C.check(list[i].if)) { obj = C.text(list[i].text); break; }
      $('hud-objective').textContent = obj;
      var canSolve = S.phase === 'enquete' && S.vars.clues_found >= ep.config.minCluesToSolve;
      $('btn-notebook').classList.toggle('pulse', canSolve && !S.flags._solve_seen);
      $('btn-mute').textContent = C.Audio.isMuted() ? '🔇' : '🔊';
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

    /* Notifications */
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
      setTimeout(function () { d.classList.remove('show'); setTimeout(function () { d.remove(); }, 400); }, t.cls === 'clue' ? 3600 : 3000);
      setTimeout(function () { self.nextToast(); }, 700);
    },
    clueToast: function (clue) {
      this.toast('<div class="t-kicker">🔍 Nouvel indice</div><div class="t-title">' + clue.title + '</div><div class="t-sub">' + clue.place + ' · Ajouté au carnet [C]</div>', 'clue');
      var hc = $('hud-clue-box');
      hc.classList.remove('bump'); void hc.offsetWidth; hc.classList.add('bump');
    },

    fade: function (mode) {
      var f = $('fade');
      if (mode === 'out') f.classList.add('on');
      else if (mode === 'in') f.classList.remove('on');
      else { f.classList.add('on'); setTimeout(function () { f.classList.remove('on'); }, 500); }
    },

    /* Petite fenêtre modale générique */
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
      setTimeout(function () { var f = row.querySelector('button'); if (f) f.focus(); }, 30);
    }
  };
})(window.CDC);
