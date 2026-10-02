/* Puja Map 2026 - bootstrap: tab navigation, rendering, timers, splash, offline support */
(function (PM) {
  'use strict';
  var TABS = ['home', 'explore', 'map', 'route', 'more'];
  var NAV_ICON = { home: 'home', explore: 'search', map: 'map', route: 'route', more: 'grid' };
  var dirty = {};

  function buildNav() {
    var nav = document.getElementById('nav'), n = PM.st.sel.length;
    nav.innerHTML = TABS.map(function (tab) {
      var on = PM.st.tab === tab;
      return '<button class="nb' + (on ? ' on' : '') + '" data-act="tab" data-tab="' + tab + '" aria-label="' + PM.esc(PM.t('tab_' + tab)) + '"' + (on ? ' aria-current="page"' : '') + '>' +
        PM.ic(NAV_ICON[tab]) + '<span>' + PM.t('tab_' + tab) + '</span>' + (tab === 'route' && n ? '<i class="nbadge">' + PM.nf(n) + '</i>' : '') + '</button>';
    }).join('');
  }
  var RENDER = {
    home: function () { PM.renderHome(); },
    explore: function () { PM.renderExplore(); },
    map: function () { PM.map.renderUI(); PM.map.redraw(); },
    route: function () { PM.renderRoute(); },
    more: function () { PM.renderMore(); }
  };
  function show(tab) { dirty[tab] = false; RENDER[tab](); }

  PM.go = function (tab, fromHash) {
    if (TABS.indexOf(tab) < 0) tab = 'home';
    var was = PM.st.tab; PM.st.tab = tab;
    TABS.forEach(function (t) { document.getElementById('v-' + t).classList.toggle('active', t === tab); });
    buildNav();
    if (dirty[tab]) show(tab);
    if (tab === 'map') PM.map.onShow();
    if (!fromHash && location.hash !== '#' + tab) { try { history.pushState(null, '', '#' + tab); } catch (e) { location.hash = tab; } }
    if (was !== tab) { var v = document.getElementById('v-' + tab); if (v && tab !== 'map') v.scrollTop = 0; }
    if (PM.sheet.isOpen() && was !== tab) PM.sheet.close();
  };
  PM.acts.tab = function (el) { PM.go(el.getAttribute('data-tab')); };

  /* something about the route / visited list / filters changed: refresh what depends on it */
  PM.afterChange = function () {
    buildNav();
    PM.renderExploreList();
    if (PM.map) PM.map.markers();
    TABS.forEach(function (t) {
      if (t === 'explore' || t === 'map') return;
      if (t === PM.st.tab) show(t); else dirty[t] = true;
    });
    PM.updateSheetState();
  };
  PM.onRegionChange = function () { PM.refreshExploreChips(); PM.renderExploreList(); };

  PM.rerenderAll = function () {
    document.documentElement.classList.toggle('big', PM.st.big);
    buildNav(); PM.renderHome(); PM.renderExplore(); PM.renderRoute(); PM.renderMore(); PM.map.redraw();
    if (PM.sheet.isOpen()) PM.sheet.close();
  };

  /* weather finished loading / failed: refresh hero + every weather pill */
  PM.onWeather = function () {
    if (PM.st.tab === 'home') PM.renderHome(); else dirty.home = true;
    var pill = PM.wxPill();
    Array.prototype.forEach.call(document.querySelectorAll('.wx-pill'), function (el) { el.outerHTML = pill; });
  };

  /* keyboard: Enter / Space activate role="button" cards */
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[role="button"][data-act]') && e.target.tagName !== 'BUTTON') {
      e.preventDefault(); e.target.click();
    }
  });
  window.addEventListener('hashchange', function () { PM.go(location.hash.replace('#', ''), true); });

  /* ---------- splash ---------- */
  function hideSplash() {
    var sp = document.getElementById('splash'); if (!sp || sp.classList.contains('hide')) return;
    sp.classList.add('hide'); setTimeout(function () { sp.remove(); }, 450);
  }
  PM.acts['splash-skip'] = hideSplash;

  function init() {
    PM.setLang(PM.st.lang);
    document.documentElement.classList.toggle('big', PM.st.big);
    PM.sheet.init();
    PM.map.mount(document.getElementById('v-map'));
    var start = location.hash.replace('#', ''); if (TABS.indexOf(start) < 0) start = 'home';
    PM.st.tab = start;
    TABS.forEach(function (t) { dirty[t] = true; });
    TABS.forEach(function (t) { if (t !== 'map') show(t); });
    PM.go(start, true);
    // splash: once per browser session
    var seen = false; try { seen = sessionStorage.getItem('puja26_splash') === '1'; sessionStorage.setItem('puja26_splash', '1'); } catch (e) {}
    if (seen) { var sp = document.getElementById('splash'); if (sp) sp.remove(); } else setTimeout(hideSplash, 1500);

    // live data
    PM.loadWeather(false);
    setInterval(function () { PM.loadWeather(true); }, 10 * 60 * 1000);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && (!PM.wx.data || Date.now() - PM.wx.data.fetched > 10 * 60 * 1000)) PM.loadWeather(true);
    });
    setInterval(function () { if (PM.st.tab === 'home') PM.refreshHomeLive(); }, 1000);
    setTimeout(PM.heartbeat, 1800); setInterval(PM.heartbeat, 30000);

    window.addEventListener('online', function () { PM.toast(PM.t('back_online')); PM.loadWeather(true); });
    window.addEventListener('offline', function () { PM.toast(PM.t('offline')); });

    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(window.PM = window.PM || {});
