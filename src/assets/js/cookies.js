// NCS - consimtamant cookie-uri. Analytics se incarca DOAR dupa Accept.
(function () {
  var KEY = 'ncs_consent';
  var banner = document.getElementById('cookieBanner');
  if (!banner) return;
  var gaId = banner.getAttribute('data-ga') || '';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (!gaId || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true });
  }

  function hideBanner() { banner.hidden = true; }
  function accept() { set('accepted'); hideBanner(); loadGA(); }
  function reject() { set('rejected'); hideBanner(); }

  banner.querySelectorAll('[data-accept]').forEach(function (b) { b.addEventListener('click', accept); });
  banner.querySelectorAll('[data-reject]').forEach(function (b) { b.addEventListener('click', reject); });

  // Modal politica de cookies
  var pol = document.getElementById('cookieModal');
  function openPolicy(e) { if (e) e.preventDefault(); if (pol) { pol.hidden = false; document.body.style.overflow = 'hidden'; } }
  function closePolicy() { if (pol) { pol.hidden = true; document.body.style.overflow = ''; } }
  document.querySelectorAll('[data-cookie-policy]').forEach(function (a) { a.addEventListener('click', openPolicy); });
  if (pol) {
    pol.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', closePolicy); });
    pol.querySelectorAll('[data-accept]').forEach(function (b) { b.addEventListener('click', function () { accept(); closePolicy(); }); });
    pol.querySelectorAll('[data-reject]').forEach(function (b) { b.addEventListener('click', function () { reject(); closePolicy(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pol.hidden) closePolicy(); });
  }

  // Initializare
  var c = get();
  if (c === 'accepted') { loadGA(); }
  else if (c !== 'rejected') {
    banner.hidden = false;
    requestAnimationFrame(function () { banner.classList.add('show'); });
  }
})();
