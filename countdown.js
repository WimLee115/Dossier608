// Dossier608 — countdown naar 6 juni 2026 06:06 Europe/Amsterdam
// Pure JavaScript. Geen externe libraries. Geen tracking. Geen storage.
// Strict mode + IIFE — geen leaks naar window.

(function () {
  'use strict';

  // 06-06-2026 06:06:00 in Europe/Amsterdam = CEST = UTC+2 in juni
  // => 06-06-2026 04:06:00 UTC
  var TARGET = Date.UTC(2026, 5, 6, 4, 6, 0); // maand 5 = juni (0-indexed)

  var elD = document.getElementById('cd-d');
  var elH = document.getElementById('cd-h');
  var elM = document.getElementById('cd-m');
  var elS = document.getElementById('cd-s');
  if (!elD || !elH || !elM || !elS) return;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
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

  tick();
  var iv = setInterval(function () { if (!tick()) clearInterval(iv); }, 1000);

  // Mailadres-onthulling — base64 obfuscation tegen naive scrapers.
  // Niet een echte beveiliging maar wel een drempel.
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
      el.textContent = 'dossier608 [at] protonmail [punt] com';
    }
  }
  showEmail();
})();
