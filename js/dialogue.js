/* Système de dialogue : boîte en bas de l'écran, texte progressif, choix.
   Le contenu est dans episodes/<épisode>/dialogues.js et objects.js */
(function (C) {
  var el = {};
  var cur = null;   // { owner, conv, node, nodeId, full, shown, choices, sel, ctx }

  function $(id) { return document.getElementById(id); }

  function convsOf(id) { return (C.EP.dialogues && C.EP.dialogues[id]) || []; }

  function available(conv) {
    if (conv.idle) return false;
    if (C.S.seen[conv.id] && !conv.repeat) return false;
    return C.check(conv.if);
  }

  C.Dialogue = {
    init: function () {
      el.box = $('dialogue'); el.name = $('dlg-name'); el.text = $('dlg-text');
      el.choices = $('dlg-choices'); el.portrait = $('dlg-portrait'); el.next = $('dlg-next');
      el.box.addEventListener('click', function (e) {
        if (e.target.closest('.choice')) return;
        C.Dialogue.advance();
      });
    },
    isOpen: function () { return !!cur; },

    /* Y a-t-il une conversation (ou un examen) encore jamais vu(e) ? */
    hasNew: function (id) {
      var list = convsOf(id);
      for (var i = 0; i < list.length; i++) if (available(list[i]) && !list[i].quiet) return true;
      return false;
    },

    start: function (id, ctx) {
      var list = convsOf(id), conv = null, i;
      for (i = 0; i < list.length; i++) if (available(list[i])) { conv = list[i]; break; }
      if (!conv) {
        var idles = list.filter(function (c) { return c.idle && C.check(c.if); });
        if (!idles.length) {
          if (ctx && ctx.prop) conv = { id: '_auto', nodes: { a: { who: 'narr', text: ctx.prop.desc || 'Rien de particulier.' } }, start: 'a' };
          else return;
        } else {
          var idle = idles[0];
          var line = C.text(idle.lines);
          if (typeof line === 'function') line = line(C.S);
          var who = idle.who || (ctx && ctx.npc ? id : 'narr');
          if (Array.isArray(line)) { who = line[0]; line = line[1]; }
          conv = { id: '_idle', nodes: { a: { who: who, text: line } }, start: 'a', idleOf: idle };
        }
      }
      cur = { owner: id, conv: conv, ctx: ctx || {} };
      if (ctx && ctx.npc) { ctx.npc.talking = true; }
      C.apply(conv.before);
      el.box.classList.remove('hidden');
      C.Audio.play('open');
      this.show(conv.start || Object.keys(conv.nodes)[0]);
    },

    show: function (nodeId) {
      var conv = cur.conv;
      var node = conv.nodes[nodeId];
      if (!node) { this.end(); return; }
      // Aiguillage conditionnel : branch:[{if:..., next:'x'}, {next:'y'}]
      if (node.branch) {
        for (var i = 0; i < node.branch.length; i++) {
          if (C.check(node.branch[i].if)) { this.show(node.branch[i].next); return; }
        }
        this.end(); return;
      }
      if (node.if && !C.check(node.if)) { this.show(node.next); return; }
      cur.node = node; cur.nodeId = nodeId;
      C.apply(node.do);
      var who = node.who || cur.owner;
      var ch = C.EP.charactersById[who];
      var isNarr = who === 'narr';
      el.box.classList.toggle('narr', isNarr);
      el.name.textContent = isNarr ? 'Pensée du Coq' : (ch ? (ch.emoji + ' ' + ch.name) : '');
      var pch = isNarr ? C.EP.charactersById[C.EP.config.player] : ch;
      if (pch) { C.Sprites.portrait(el.portrait, pch); el.portrait.style.visibility = 'visible'; }
      else el.portrait.style.visibility = 'hidden';
      if (ch && !isNarr && who !== C.EP.config.player) C.S.met[who] = true;
      cur.full = C.fmt(C.text(node.text));
      cur.shown = 0; cur.typing = true;
      el.text.textContent = '';
      el.choices.innerHTML = '';
      el.next.style.visibility = 'hidden';
      cur.choices = (node.choices || []).filter(function (c) { return C.check(c.if); });
      cur.sel = 0;
    },

    update: function (dt) {
      if (!cur) return;
      var I = C.Input;
      if (cur.typing) {
        var before = Math.floor(cur.shown);
        cur.shown += dt * 55;
        var n = Math.min(cur.full.length, Math.floor(cur.shown));
        if (n !== before) {
          el.text.textContent = cur.full.slice(0, n);
          if (n % 3 === 0) C.Audio.play('talk');
        }
        if (n >= cur.full.length) this.finishTyping();
        if (I.consume('interact')) this.finishTyping();
        return;
      }
      if (cur.choices.length) {
        if (I.consume('up')) { cur.sel = (cur.sel + cur.choices.length - 1) % cur.choices.length; this.renderChoices(); }
        if (I.consume('down')) { cur.sel = (cur.sel + 1) % cur.choices.length; this.renderChoices(); }
        for (var k = 1; k <= 4; k++) if (I.consume('choice' + k) && cur.choices[k - 1]) { this.choose(k - 1); return; }
        if (I.consume('interact')) this.choose(cur.sel);
      } else if (I.consume('interact')) this.advance();
      if (I.consume('back') && !cur.choices.length) this.advance();
    },

    finishTyping: function () {
      cur.typing = false;
      el.text.textContent = cur.full;
      if (cur.choices.length) this.renderChoices();
      else el.next.style.visibility = 'visible';
    },

    renderChoices: function () {
      var self = this;
      el.choices.innerHTML = '';
      cur.choices.forEach(function (c, i) {
        var b = document.createElement('button');
        b.className = 'choice' + (i === cur.sel ? ' sel' : '');
        b.innerHTML = '<span class="key">' + String.fromCharCode(65 + i) + '</span>';
        b.appendChild(document.createTextNode('« ' + C.fmt(C.text(c.text)) + ' »'));
        b.addEventListener('click', function (e) { e.stopPropagation(); self.choose(i); });
        b.addEventListener('mouseenter', function () { cur.sel = i; el.choices.querySelectorAll('.choice').forEach(function (x, j) { x.classList.toggle('sel', j === i); }); });
        el.choices.appendChild(b);
      });
    },

    choose: function (i) {
      var c = cur.choices[i];
      if (!c) return;
      C.Audio.play('select');
      C.apply(c.do);
      if (c.next) this.show(c.next); else this.end();
    },

    advance: function () {
      if (!cur) return;
      if (cur.typing) { this.finishTyping(); return; }
      if (cur.choices.length) return;
      if (cur.node.end || !cur.node.next) this.end();
      else this.show(cur.node.next);
    },

    end: function () {
      if (!cur) return;
      var conv = cur.conv;
      if (conv.id && conv.id.charAt(0) !== '_') C.S.seen[conv.id] = true;
      if (cur.ctx.npc) cur.ctx.npc.talking = false;
      el.box.classList.add('hidden');
      C.Input.clearPressed();
      var after = conv.after;
      cur = null;
      C.apply(after);
      C.Audio.play('close');
      if (C.onStateChange) C.onStateChange();
    }
  };
})(window.CDC);
