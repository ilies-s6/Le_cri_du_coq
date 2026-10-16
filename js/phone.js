/* 📱 Téléphone fictif : messagerie « Piaf » (inventée pour le jeu), captures,
   messagerie du collège, aide. Tout est fictif.
   Les conversations sont décrites dans episodes/<épisode>/phone.js. */
(function (C) {
  var view = 'home', threadId = null, night = null, revealTok = 0;
  function E(t, c, h) { return C.UI.el(t, c, h); }
  function D() { return C.EP.phone; }
  function P() { return C.S.phone; }

  function threadVisible(th) { return C.check(th.if); }
  /* Messages visibles d'une conversation, jusqu'à la prochaine réponse attendue */
  function visibleMsgs(th) {
    var out = [];
    for (var i = 0; i < th.messages.length; i++) {
      var m = th.messages[i];
      if (!C.check(m.if)) continue;
      out.push(m);
      if (m.reply && P().replies[m.reply] == null) break;   // on attend ta réponse
    }
    return out;
  }
  function unseen(th) {
    return visibleMsgs(th).filter(function (m) { return !m.reply && !P().seen[m.id] && m.from !== 'coq'; }).length;
  }
  function who(id) {
    if (!id) return { name: '', ch: null };
    var ch = C.EP.charactersById[id];
    return ch ? { name: ch.short || ch.name, ch: ch } : { name: id, ch: null };
  }
  function thName(th) { return th.name || who(th.who).name; }

  /* Petite « photo » dessinée (aucune vraie image) */
  function drawPhoto(cv, ph) {
    var ctx = cv.getContext('2d'), w = cv.width, h = cv.height;
    var g = ctx.createLinearGradient(0, 0, 0, h);
    var bgs = { parc: ['#bfe3f5', '#8fcf6f'], casier: ['#e2e7ee', '#c9d1db'], cour: ['#cfe8f7', '#a3a8b0'], cantine: ['#f4e7da', '#e0d6c6'] };
    var bg = bgs[ph.bg] || bgs.parc;
    g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    if (ph.bg === 'parc') {
      ctx.fillStyle = '#7a5232'; ctx.fillRect(w * 0.72, h * 0.25, 8, h * 0.45);
      ctx.fillStyle = '#4f9e52'; ctx.beginPath(); ctx.arc(w * 0.74, h * 0.25, 30, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9aa0a8'; ctx.fillRect(w * 0.1, h * 0.72, w * 0.35, 6);
    }
    if (ph.bg === 'casier') {
      for (var i = 0; i < 6; i++) { ctx.fillStyle = i === 2 ? '#7a9a5a' : '#5b8bbd'; ctx.fillRect(10 + i * 36, 10, 32, h - 20); }
      ctx.save(); ctx.translate(98, 60); ctx.rotate(-0.15); ctx.fillStyle = '#e5483b'; ctx.font = '900 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('BÊÊÊ', 0, 0); ctx.restore();
    }
    if (ph.who) {
      var ch = C.EP.charactersById[ph.who];
      ctx.save(); ctx.translate(w * (ph.x || 0.42), h * 0.92); ctx.scale(ph.scale || 2.2, ph.scale || 2.2);
      ctx.translate(-0, 0);
      C.Sprites.draw(ctx, ch, 0, 0, { dir: 'down', mood: ph.mood || 'sad', t: 0, blink: false });
      ctx.restore();
    }
    if (ph.sticker) {
      ctx.save(); ctx.translate(w * 0.5, h * 0.18); ctx.rotate(-0.06);
      ctx.font = '800 15px Outfit, sans-serif'; ctx.textAlign = 'center';
      var tw = ctx.measureText(ph.sticker).width + 16;
      ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.fillRect(-tw / 2, -14, tw, 22);
      ctx.fillStyle = '#e5483b'; ctx.fillText(ph.sticker, 0, 3); ctx.restore();
    }
    if (ph.blur) { ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(0, 0, w, h); }
  }

  C.Phone = {
    init: function () {
      var ov = C.UI.$('phone');
      ov.addEventListener('click', function (e) { if (e.target === ov && !night) C.Phone.close(); });
    },
    isOpen: function () { return C.UI.isOpen('phone'); },
    totalUnseen: function () {
      if (!C.S || !D()) return 0;
      return D().threads.filter(threadVisible).reduce(function (a, th) { return a + unseen(th); }, 0);
    },

    open: function (v, id) {
      if (C.Time.cur().phoneOnly && !night) { this.openNight(C.Time.cur()); return; }
      view = v || 'home'; threadId = id || null;
      C.UI.open('phone');
      C.Audio.play('open');
      this.render();
      if (C.Tutorial) C.Tutorial.event('phone');
    },
    /* Le soir : le téléphone occupe tout l'écran jusqu'à « dormir » */
    openNight: function (slot) {
      night = slot;
      document.body.classList.add('night');
      view = 'thread'; threadId = slot.phoneThread || D().threads[0].id;
      C.UI.open('phone');
      this.render();
    },
    close: function () {
      if (night) return;
      C.UI.close('phone'); C.Audio.play('close');
      revealTok++;
      C.UI.updateHUD();
    },
    toggle: function () { if (this.isOpen()) this.close(); else if (!C.UI.busy()) this.open(); },
    sleep: function () {
      night = null;
      document.body.classList.remove('night');
      C.UI.close('phone');
      revealTok++;
      C.Time.go();
    },

    /* Nouveaux messages ? Notification discrète (pas pendant la nuit) */
    checkNew: function (quiet) {
      if (!C.S || !D()) return;
      var fresh = [];
      D().threads.filter(threadVisible).forEach(function (th) {
        visibleMsgs(th).forEach(function (m) {
          if (m.reply || m.from === 'coq' || P().seen[m.id] || P().notified[m.id]) return;
          P().notified[m.id] = true;
          fresh.push({ th: th, m: m });
        });
      });
      C.UI.updateHUD();
      if (!fresh.length || C.Time.cur().phoneOnly) return;
      var f = fresh[fresh.length - 1];
      var b = C.UI.$('btn-phone');
      b.classList.remove('buzz'); void b.offsetWidth; b.classList.add('buzz');
      C.Audio.play('buzz');
      if (this.isOpen()) { this.render(); return; }
      var txt = f.m.photo ? '📷 Photo' : C.fmt(C.text(f.m.text || ''));
      if (txt.length > 60) txt = txt.slice(0, 58) + '…';
      C.UI.toast('<div class="t-kicker">📱 ' + thName(f.th) + (fresh.length > 1 ? ' · ' + fresh.length + ' nouveaux messages' : '') + '</div><div class="t-sub"><b>' + (f.m.sys ? '' : who(f.m.from).name + ' : ') + '</b>' + txt + '</div>', 'phone');
    },

    render: function () {
      var scr = C.UI.$('ph-screen'), st = C.UI.$('ph-status');
      revealTok++;
      var s = C.Time.cur();
      st.innerHTML = '<span>' + (night ? (s.phoneClock || '21:14') : s.time.replace(' h ', ':')) + '</span><span class="ph-notch"></span><span>📶 🔋</span>';
      scr.innerHTML = '';
      scr.className = 'ph-screen v-' + view;
      if (view === 'home') this.renderHome(scr);
      else if (view === 'list') this.renderList(scr);
      else if (view === 'thread') this.renderThread(scr);
      else if (view === 'caps') this.renderCaps(scr);
      else if (view === 'aide') this.renderAide(scr);
      var side = C.UI.$('ph-side');
      side.innerHTML = '';
      if (night) {
        side.appendChild(E('div', 'ph-night-title', '🌙 ' + s.dayName + ' · ' + s.time));
        side.appendChild(E('p', 'ph-night-text', s.cardText || 'Chez toi, le soir. Ton téléphone vibre.'));
        var sl = E('button', 'btn', '💤 Poser le téléphone et dormir');
        sl.addEventListener('click', function () { C.Phone.sleep(); });
        side.appendChild(sl);
      } else {
        var x = E('button', 'btn btn-ghost small', '✕ Fermer le téléphone <kbd>P</kbd>');
        x.addEventListener('click', function () { C.Phone.close(); });
        side.appendChild(x);
      }
    },

    nav: function (v, id) { view = v; threadId = id || null; C.Audio.play('select'); this.render(); },

    renderHome: function (scr) {
      var self = this;
      var s = C.Time.cur();
      scr.appendChild(E('div', 'ph-clock', s.time.replace(' h ', ':')));
      scr.appendChild(E('div', 'ph-date', s.dayName));
      var grid = E('div', 'ph-apps');
      var caps = Object.keys(P().caps).length;
      [['list', '💬', 'Piaf', this.totalUnseen()], ['caps', '🖼️', 'Captures', caps ? caps : 0, true], ['aide', '🛟', 'Aide', 0]].forEach(function (a) {
        var b = E('button', 'ph-app', '<span class="ph-app-icon">' + a[1] + '</span><span>' + a[2] + '</span>' + (a[3] ? '<i class="' + (a[4] ? 'neutral' : '') + '">' + a[3] + '</i>' : ''));
        b.addEventListener('click', function () { self.nav(a[0]); });
        grid.appendChild(b);
      });
      scr.appendChild(grid);
      scr.appendChild(E('div', 'ph-note', 'Piaf est une messagerie inventée pour le jeu.'));
    },

    renderList: function (scr) {
      var self = this;
      scr.appendChild(this.head('Piaf', 'home'));
      var list = E('div', 'ph-threads');
      D().threads.filter(threadVisible).forEach(function (th) {
        var msgs = visibleMsgs(th).filter(function (m) { return !m.reply || P().replies[m.reply] != null; });
        var lastM = msgs[msgs.length - 1];
        var n = unseen(th);
        var b = E('button', 'ph-thread' + (n ? ' unread' : ''));
        b.appendChild(self.avatar(th));
        var prev = lastM ? (lastM.reply ? 'Toi : ' + self.replyText(lastM) : (lastM.sys ? lastM.text : (lastM.from === 'coq' ? 'Toi : ' : (th.group ? who(lastM.from).name + ' : ' : '')) + (lastM.photo ? '📷 Photo' : C.fmt(C.text(lastM.text || ''))))) : '';
        b.appendChild(E('div', 'ph-th-main', '<b>' + thName(th) + '</b><span>' + prev + '</span>'));
        if (n) b.appendChild(E('i', 'ph-badge', n));
        b.addEventListener('click', function () { self.nav('thread', th.id); });
        list.appendChild(b);
      });
      scr.appendChild(list);
    },

    head: function (title, back, th) {
      var self = this;
      var h = E('div', 'ph-head');
      if (back) {
        var b = E('button', 'ph-back', '‹');
        b.addEventListener('click', function () { self.nav(back); });
        h.appendChild(b);
      }
      if (th) h.appendChild(this.avatar(th));
      h.appendChild(E('div', 'ph-head-title', '<b>' + title + '</b>' + (th && th.sub ? '<span>' + th.sub + '</span>' : '')));
      return h;
    },
    avatar: function (th) {
      var a = E('div', 'ph-avatar');
      var ch = th.who && C.EP.charactersById[th.who];
      if (ch) { var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; C.Sprites.portrait(cv, ch); a.appendChild(cv); }
      else a.textContent = th.icon || '👥';
      return a;
    },
    replyText: function (m) {
      var o = m.options[P().replies[m.reply]];
      return o ? C.fmt(o.say || o.text) : '';
    },

    renderThread: function (scr) {
      var self = this, th = null;
      D().threads.forEach(function (t) { if (t.id === threadId) th = t; });
      if (!th) { view = 'list'; this.renderList(scr); return; }
      scr.appendChild(this.head(thName(th), 'list', th));
      var box = E('div', 'ph-msgs');
      scr.appendChild(box);
      var msgs = visibleMsgs(th);
      var tok = revealTok, delay = 0, firstNew = true;
      msgs.forEach(function (m) {
        var isNew = !m.reply && !P().seen[m.id] && m.from !== 'coq';
        var make = function () {
          if (tok !== revealTok) return;
          var node = self.msgNode(th, m);
          box.appendChild(node);
          P().seen[m.id] = true;
          box.scrollTop = box.scrollHeight;
          if (isNew) C.Audio.play('msg');
          C.UI.updateHUD();
        };
        if (isNew) {
          if (firstNew) { delay += 350; firstNew = false; }
          var d = delay;
          setTimeout(function () {
            if (tok !== revealTok) return;
            var typing = E('div', 'ph-typing', (m.sys ? '' : who(m.from).name + ' écrit') + '<i></i><i></i><i></i>');
            box.appendChild(typing); box.scrollTop = box.scrollHeight;
            setTimeout(function () { typing.remove(); make(); }, 650);
          }, d);
          delay += 650 + Math.min(1400, 300 + (C.text(m.text || '').length * 18));
        } else if (delay) setTimeout(make, delay + 50); else make();
      });
    },

    msgNode: function (th, m) {
      var self = this;
      if (m.sys) return E('div', 'ph-sys', C.fmt(m.text));
      if (m.reply) {
        var wrap = E('div', 'ph-reply');
        if (P().replies[m.reply] != null) {
          var o = m.options[P().replies[m.reply]];
          if (o.silent) return E('div', 'ph-sys', o.note || '…');
          return E('div', 'ph-msg me', '<div class="ph-bubble">' + C.fmt(o.say || o.text) + '</div>');
        }
        if (m.prompt) wrap.appendChild(E('div', 'ph-reply-prompt', m.prompt));
        m.options.forEach(function (o, i) {
          if (!C.check(o.if)) return;
          var b = E('button', 'ph-chip' + (o.silent ? ' silent' : ''), (o.icon ? o.icon + ' ' : '') + C.fmt(o.text));
          b.addEventListener('click', function () {
            P().replies[m.reply] = i;
            C.Audio.play(o.silent ? 'select' : 'send');
            C.apply(o.do);
            self.render();
            C.Phone.checkNew(true);
            if (C.Save) C.Save.soon();
          });
          wrap.appendChild(b);
        });
        return wrap;
      }
      var mine = m.from === 'coq';
      var w = who(m.from);
      var node = E('div', 'ph-msg' + (mine ? ' me' : ''));
      var deleted = m.deletedIf && C.check(m.deletedIf);
      if (th.group && !mine) node.appendChild(E('div', 'ph-from', w.name));
      var bub = E('div', 'ph-bubble' + (deleted ? ' deleted' : ''));
      if (deleted) bub.innerHTML = '🚫 <i>' + (m.deletedText || 'Ce message a été supprimé.') + '</i>';
      else {
        if (m.photo) { var cv = document.createElement('canvas'); cv.width = 240; cv.height = 150; cv.className = 'ph-photo'; drawPhoto(cv, m.photo); bub.appendChild(cv); }
        if (m.text) bub.appendChild(E('div', '', C.fmt(C.text(m.text))));
      }
      if (m.time) bub.appendChild(E('span', 'ph-time', m.time + (m.seenBy ? ' · vu par ' + m.seenBy : '')));
      node.appendChild(bub);
      if (m.reacts && !deleted) node.appendChild(E('div', 'ph-reacts', C.text(m.reacts)));
      // Actions possibles sur ce message
      var acts = (m.actions || []).filter(function (a) { return C.check(a.if); });
      if (acts.length && !deleted) {
        var row = E('div', 'ph-acts');
        acts.forEach(function (a) {
          var done = P().acts[m.id + ':' + a.id];
          var blocked = a.excl && a.excl.some(function (x) { return P().acts[m.id + ':' + x]; });
          var b = E('button', 'ph-act' + (done ? ' done' : ''), (done ? '✓ ' + (a.doneLabel || a.label) : a.label));
          b.disabled = !!done || !!blocked;
          b.addEventListener('click', function () {
            P().acts[m.id + ':' + a.id] = true;
            if (a.capture) P().caps[m.id] = { thread: th.id, slot: C.S.slot };
            C.Audio.play(a.capture ? 'clue' : 'select');
            C.apply(a.do);
            if (a.feedback) C.UI.toast(a.feedback);
            self.render();
            C.Phone.checkNew(true);
            if (C.Save) C.Save.soon();
          });
          row.appendChild(b);
        });
        node.appendChild(row);
      }
      return node;
    },

    renderCaps: function (scr) {
      var self = this;
      scr.appendChild(this.head('Captures', 'home'));
      var ids = Object.keys(P().caps);
      var box = E('div', 'ph-caps');
      if (!ids.length) box.appendChild(E('p', 'ph-empty', 'Aucune capture. Dans une conversation, le bouton 📸 permet de garder une trace d\'un message (sans le partager).'));
      ids.forEach(function (id) {
        var th = null, m = null;
        D().threads.forEach(function (t) { t.messages.forEach(function (x) { if (x.id === id) { th = t; m = x; } }); });
        if (!m) return;
        var c = E('div', 'ph-cap');
        c.appendChild(E('div', 'ph-cap-head', '🖼️ ' + thName(th) + ' · ' + (m.time || '')));
        var node = self.msgNode(th, Object.assign({}, m, { actions: null, deletedIf: null }));
        c.appendChild(node);
        box.appendChild(c);
      });
      scr.appendChild(box);
      if (ids.length) scr.appendChild(E('p', 'ph-note', 'Garder une trace sert à montrer la situation à un adulte. Ne repartage jamais ces captures.'));
    },

    renderAide: function (scr) {
      scr.appendChild(this.head('Aide', 'home'));
      var a = D().aide || {};
      var box = E('div', 'ph-aide', a.html || '');
      scr.appendChild(box);
    }
  };
})(window.CDC);
