/* Puja Map 2026 - More tab, emergency + support sheets, quick actions, Mahalaya audio */
(function (PM) {
  'use strict';
  var T = function (k, v) { return PM.t(k, v); };
  var installEvt = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; if (PM.st.tab === 'more') PM.renderMore(); });
  window.addEventListener('appinstalled', function () { installEvt = null; PM.toast(T('installed')); if (PM.st.tab === 'more') PM.renderMore(); });

  var NUMS = [['112', 'sos_all'], ['100', 'sos_police'], ['102', 'sos_amb'], ['101', 'sos_fire'], ['1091', 'sos_women']];
  function sosList() {
    return '<ul class="sos-list">' + NUMS.map(function (n) {
      return '<li><a href="tel:' + n[0] + '">' + PM.ic('phone') + '<span>' + T(n[1]) + '</span><b>' + PM.nf(n[0]) + '</b></a></li>';
    }).join('') + '</ul>';
  }
  function guide(title, keys) {
    return '<details class="acc"><summary>' + title + PM.ic('chev') + '</summary><ul>' + keys.map(function (k) { return '<li>' + T(k) + '</li>'; }).join('') + '</ul></details>';
  }

  PM.renderMore = function () {
    var el = document.getElementById('v-more'); if (!el) return;
    var sc = el.scrollTop, standalone = window.matchMedia && matchMedia('(display-mode: standalone)').matches;
    var ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    el.innerHTML = PM.vhead(T('tab_more')) + '</header><div class="pad">' +
      '<section class="block card"><div class="block-h"><h2>' + PM.ic('globe') + T('language') + '</h2></div>' + PM.langSwitch().replace('seg lang', 'seg lang big') + '<p class="fine">' + T('lang_note') + '</p></section>' +
      '<section class="block card sos"><div class="block-h"><h2>' + PM.ic('alert') + T('emergency') + '</h2></div>' + sosList() + '</section>' +
      '<section class="block"><div class="block-h"><h2>' + T('guides') + '</h2></div>' +
      guide(T('g_metro'), ['g_metro_1', 'g_metro_2', 'g_metro_3', 'g_metro_4', 'g_metro_5']) +
      guide(T('g_crowd'), ['g_crowd_1', 'g_crowd_2', 'g_crowd_3']) +
      guide(T('g_tips'), ['g_tips_1', 'g_tips_2', 'g_tips_3', 'g_tips_4']) + '</section>' +
      '<section class="block card"><div class="block-h"><h2>' + T('app_settings') + '</h2></div>' +
      '<div class="setrow"><span>' + T('text_size') + '</span><div class="seg"><button class="' + (PM.st.big ? '' : 'on') + '" data-act="text-size" data-b="0">' + T('normal') + '</button><button class="' + (PM.st.big ? 'on' : '') + '" data-act="text-size" data-b="1">' + T('large') + '</button></div></div>' +
      (standalone ? '' : installEvt ? '<button class="btn wide" data-act="install">' + PM.ic('download') + T('install_app') + '</button>' : '<p class="fine">' + PM.ic('info') + ' ' + T(ios ? 'install_ios' : 'install_hint') + '</p>') +
      '<button class="btn wide ghost" data-act="share-app">' + PM.ic('share') + T('share_app') + '</button></section>' +
      '<section class="support lg"><div class="sp-ic">' + PM.ic('heart') + '</div><div><b>' + T('support_t') + '</b><span>' + T('support_d') + '</span></div><button class="btn primary sm" data-act="support">' + T('support_btn') + '</button></section>' +
      '<section class="block card"><div class="block-h"><h2>' + PM.ic('lock') + T('privacy') + '</h2></div><p class="fine lg">' + T('privacy_d') + '</p>' +
      '<div class="vcode"><span>' + T('your_code') + '</span><code>PUJA26-' + PM.visitorCode() + '</code></div>' +
      (PM.store.get('puja26_lat', '') ? '<button class="btn ghost wide" data-act="clear-loc">' + PM.ic('x') + T('clear_loc') + '</button>' : '') + '</section>' +
      '<p class="fine note">' + T('map_note') + '</p><p class="fine note">' + T('last_checked') + '</p>' +
      '<p class="fine foot">' + T('crafted') + ' <b>Sudipta Chatterjee</b></p></div>';
    el.scrollTop = sc;
  };

  /* ---------- sheets ---------- */
  PM.acts.sos = function () { PM.sheet.open('<div class="sh-pad"><h2>' + PM.ic('alert') + T('emergency') + '</h2>' + sosList() + '<p class="fine">' + T('sos_note') + '</p></div>'); };
  PM.acts.support = function () {
    var id = PM.CFG.UPI_ID, uri = id ? 'upi://pay?pa=' + encodeURIComponent(id) + '&pn=' + encodeURIComponent(PM.CFG.UPI_NAME || '') + '&cu=INR&tn=' + encodeURIComponent(PM.CFG.UPI_NOTE || '') : '';
    PM.sheet.open('<div class="sh-pad center"><h2>' + PM.ic('heart') + T('support_t') + '</h2><p class="muted">' + T('support_long') + '</p>' +
      (uri ? '<div id="qrBox" class="qr"></div><a class="btn primary wide" href="' + uri + '">' + PM.ic('phone') + T('pay_upi') + '</a><p class="fine">' + T('upi_note') + '</p>' : '<p class="fine">' + T('upi_missing') + '</p>') +
      '<p class="quote">“' + T('support_quote') + '”</p></div>');
    if (!uri) return;
    var draw = function () { var b = document.getElementById('qrBox'); if (!b || !window.QRCode) return; b.innerHTML = ''; try { new QRCode(b, { text: uri, width: 200, height: 200, colorDark: '#120E2B', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); } catch (e) {} };
    if (window.QRCode) draw(); else { var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'; s.onload = draw; document.head.appendChild(s); }
  };

  /* ---------- quick actions ---------- */
  PM.acts['near-me'] = function () {
    if (!navigator.geolocation) { PM.toast(T('loc_na')); return; }
    PM.toast(T('locating'));
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude.toFixed(6), lon = pos.coords.longitude.toFixed(6);
      PM.store.set('puja26_lat', lat); PM.store.set('puja26_lon', lon); PM.heartbeat();
      var u = PM.G + 'search/?api=1&query=' + encodeURIComponent('Durga Puja pandal near ' + lat + ',' + lon);
      PM.sheet.open('<div class="sh-pad center"><h2>' + PM.ic('locate') + T('loc_found') + '</h2><p class="muted">' + T('loc_found_d') + '</p><a class="btn primary wide" target="_blank" rel="noopener" href="' + u + '">' + PM.ic('nav') + T('open_gmaps_near') + '</a>' +
        '<a class="btn wide" target="_blank" rel="noopener" href="' + PM.G + 'search/?api=1&query=' + encodeURIComponent('public toilet near ' + lat + ',' + lon) + '">' + PM.ic('wc') + T('toilets_near') + '</a></div>');
    }, function () { PM.toast(T('loc_denied')); }, { timeout: 12000, maximumAge: 60000 });
  };
  PM.acts.traffic = function () { window.open(PM.G + '@' + PM.RG[PM.st.rg][1] + ',14z/data=!5m1!1e1', '_blank', 'noopener'); };
  PM.acts.toilets = function () { window.open(PM.G + 'search/?api=1&query=' + encodeURIComponent('public toilet near Kolkata Durga Puja pandal'), '_blank', 'noopener'); };
  PM.acts['share-app'] = function () {
    var text = T('share_msg'), url = PM.site();
    if (navigator.share) navigator.share({ title: T('app_title'), text: text, url: url }).catch(function () {});
    else window.open(PM.wa(text + '\n' + url), '_blank', 'noopener');
  };
  PM.acts['clear-loc'] = function () { PM.store.set('puja26_lat', ''); PM.store.set('puja26_lon', ''); PM.toast(T('loc_cleared')); PM.renderMore(); };
  PM.acts.install = function () { if (installEvt) { installEvt.prompt(); installEvt = null; } };
  PM.acts['text-size'] = function (el) { PM.st.big = el.getAttribute('data-b') === '1'; PM.store.set('puja26_big', PM.st.big ? '1' : '0'); document.documentElement.classList.toggle('big', PM.st.big); PM.renderMore(); };
  PM.acts.lang = function (el) { var l = el.getAttribute('data-l'); if (l !== PM.st.lang) { PM.setLang(l); PM.rerenderAll(); } };
  PM.acts.goto = function (el) {
    var tab = el.getAttribute('data-tab');
    if (el.getAttribute('data-star')) { PM.st.star = true; PM.st.zf = 'all'; PM.st.q = ''; PM.renderExplore(); }
    PM.go(tab);
  };
  PM.acts['goto-map'] = function () { PM.go('map'); };

  /* ---------- Mahalaya audio + calendar reminder ---------- */
  PM.audio = new Audio(); PM.audio.preload = 'none';
  if (PM.CFG.MAHALAYA_STREAM_URL) PM.audio.src = PM.CFG.MAHALAYA_STREAM_URL;
  ['play', 'pause', 'ended'].forEach(function (ev) {
    PM.audio.addEventListener(ev, function () {
      if ('mediaSession' in navigator) {
        if (ev === 'play') { try { navigator.mediaSession.metadata = new MediaMetadata({ title: T('mh_title'), artist: T('app_title'), album: T('app_name') }); } catch (e) {} navigator.mediaSession.playbackState = 'playing'; }
        else navigator.mediaSession.playbackState = 'paused';
      }
      if (PM.st.tab === 'home') PM.renderHome();
    });
  });
  PM.audio.addEventListener('error', function () { PM.toast(T('mh_err')); });
  if ('mediaSession' in navigator) {
    try { navigator.mediaSession.setActionHandler('play', function () { PM.audio.play(); }); navigator.mediaSession.setActionHandler('pause', function () { PM.audio.pause(); }); } catch (e) {}
  }
  PM.acts['mh-play'] = function () {
    var s = PM.mahalayaState();
    if (s === 'soon') { PM.toast(T('mh_not_yet')); return; }
    if (!PM.CFG.MAHALAYA_STREAM_URL) { PM.toast(T('mh_nostream_toast')); return; }
    if (PM.audio.paused) PM.audio.play().catch(function () { PM.toast(T('mh_tap_again')); }); else PM.audio.pause();
  };
  PM.acts['mh-cal'] = function () {
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PujaMap26//EN', 'BEGIN:VEVENT', 'UID:mahalaya-2026@pujamap26', 'DTSTAMP:20261001T000000Z',
      'DTSTART:20261009T223000Z', 'DTEND:20261010T003000Z', 'SUMMARY:Mahalaya 2026 (Mahishasuramardini)', 'DESCRIPTION:Mahalaya live audio from 4:00 AM IST. ' + PM.site(),
      'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:Mahalaya starts soon', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'mahalaya-2026.ics';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); PM.toast(T('cal_added'));
  };
})(window.PM = window.PM || {});
