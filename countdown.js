// Dossier608 — countdown naar 6 juni 2026 06:06 Europe/Amsterdam + frontend hardening.
// Pure JavaScript. Geen externe libraries. Geen tracking. Geen storage.
// Strict mode + IIFE — geen leaks naar window.
// Hardening is bewust een drempel, geen onomzeilbare bescherming.

(function () {
  'use strict';

  // ============== COUNTDOWN ==============
  // 06-06-2026 06:06:00 Europe/Amsterdam = CEST = UTC+2 in juni
  // => 06-06-2026 04:06:00 UTC
  var TARGET = Date.UTC(2026, 5, 6, 4, 6, 0); // maand 5 = juni (0-indexed)

  var elD = document.getElementById('cd-d');
  var elH = document.getElementById('cd-h');
  var elM = document.getElementById('cd-m');
  var elS = document.getElementById('cd-s');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    if (!elD || !elH || !elM || !elS) return false;
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      elD.textContent = '00';
      elH.textContent = '00';
      elM.textContent = '00';
      elS.textContent = '00';
      var rl = document.querySelector('.release-line');
      if (rl) {
        rl.textContent = 'Release — nu publiek';
        rl.style.color = '#d4a14a';
      }
      return false;
    }

    var dagen = Math.floor(diff / 86400000);
    var uren  = Math.floor((diff / 3600000) % 24);
    var min   = Math.floor((diff / 60000) % 60);
    var sec   = Math.floor((diff / 1000) % 60);

    elD.textContent = pad(dagen);
    elH.textContent = pad(uren);
    elM.textContent = pad(min);
    elS.textContent = pad(sec);
    return true;
  }

  if (elD && elH && elM && elS) {
    tick();
    var iv = setInterval(function () { if (!tick()) clearInterval(iv); }, 1000);
  }

  // ============== EMAIL-ONTHULLING ==============
  // Base64 obfuscation tegen naive scrapers. Beperkte bescherming.
  function showEmail() {
    var el = document.getElementById('contact-email');
    if (!el) return;
    try {
      var u = atob(el.getAttribute('data-u') || '');
      var d = atob(el.getAttribute('data-d') || '');
      if (!u || !d) return;
      var addr = u + '@' + d;
      var a = document.createElement('a');
      a.textContent = addr;
      a.href = 'mai' + 'lto:' + addr;
      a.rel = 'noopener noreferrer';
      el.textContent = '';
      el.appendChild(a);
    } catch (e) {
      el.textContent = 'almass-only [at] protonmail [punt] com';
    }
  }
  showEmail();

  // ============== HARDENING — DREMPELS TEGEN CASUAL INSPECTIE ==============
  // De volgende blokkades verhogen de drempel maar zijn niet onomzeilbaar.
  // Elke browser heeft de mogelijkheid om JavaScript te disablen, view-source
  // direct via URL (view-source:https://...) op te roepen, of de pagina via
  // een proxy/curl op te halen. Dit blokkeert alleen casual rechter-klik en
  // toetsenbordshortcuts in standaardgebruik.

  // 1) Rechter-klik volledig blokkeren
  function blockContextMenu(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    return false;
  }
  document.addEventListener('contextmenu', blockContextMenu, { capture: true });
  document.addEventListener('auxclick', function (e) {
    // middle-click + andere niet-primaire muisklikken
    if (e && e.button !== 0 && e.preventDefault) e.preventDefault();
  }, { capture: true });

  // 2) Tekst-selectie standaard blokkeren (CSS doet de hoofdwerk).
  //    Selectstart-event ook voor de zekerheid afvangen.
  document.addEventListener('selectstart', function (e) {
    var t = e && e.target;
    // Sta selectie wel toe op elementen waar pers/onderzoekers de hash of
    // het mailadres moeten kunnen kopiëren.
    if (t && t.closest && (
      t.closest('.hash') ||
      t.closest('.email') ||
      t.closest('code') ||
      t.closest('time') ||
      t.closest('.selectable')
    )) {
      return true;
    }
    if (e && e.preventDefault) e.preventDefault();
    return false;
  }, { capture: true });

  // 3) Drag-start blokkeren (drag-saving van afbeeldingen/elementen)
  document.addEventListener('dragstart', function (e) {
    if (e && e.preventDefault) e.preventDefault();
    return false;
  }, { capture: true });

  // 4) Toetsenbord-shortcuts voor ontwikkelaarstools en bron-weergave afvangen
  document.addEventListener('keydown', function (e) {
    if (!e) return true;
    var key = e.key || '';
    var lk = key.toLowerCase();
    var ctrl = e.ctrlKey || e.metaKey; // metaKey = Cmd op macOS

    // F12 = ontwikkelaarstools openen
    if (key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Opt+U = view source
    if (ctrl && lk === 'u') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S = pagina opslaan
    if (ctrl && lk === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Opt+I = ontwikkelaarstools
    if (ctrl && e.shiftKey && lk === 'i') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J / Cmd+Opt+J = console direct
    if (ctrl && e.shiftKey && lk === 'j') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C / Cmd+Opt+C = element-inspector direct
    if (ctrl && e.shiftKey && lk === 'c') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+K / Cmd+Opt+K = Firefox webconsole
    if (ctrl && e.shiftKey && lk === 'k') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+P = afdrukken (optioneel — laat staan voor pers, dus toegestaan)
    return true;
  }, { capture: true });

  // 5) Optioneel: console-banner als afschrikwekkend bericht in dev tools
  //    Doet niets technisch maar maakt gebruikersbedoelingen expliciet.
  try {
    if (typeof console !== 'undefined' && console.log) {
      var banner =
        '%cDossier608\n' +
        '%cDeze pagina is een aankondiging. ' +
        'Voor verzoeken om vroege toegang: zie het mailadres op de pagina. ' +
        'Voor onderzoek-/aansprakelijkheidsvragen: contact via almass-only@protonmail.com.';
      console.log(banner, 'color:#d4a14a;font-size:18px;font-weight:600',
        'color:#aab1bb;font-size:13px;line-height:1.5');
    }
  } catch (e) { /* ignore */ }
})();
