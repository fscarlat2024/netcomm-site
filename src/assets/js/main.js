// NCS - interactiuni minimale (nav scroll, meniu mobil, reveal on scroll)
(function () {
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navlinks');

  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Modal formular consultatie ----
  var modal = document.getElementById('consultModal');
  if (modal) {
    var form = document.getElementById('consultForm');
    var lastFocus = null;
    var fbody = modal.querySelector('.form-body');
    var fsuccess = modal.querySelector('.form-success');
    var ferr = document.getElementById('formErr');
    function resetModal() {
      if (fbody) fbody.hidden = false;
      if (fsuccess) fsuccess.hidden = true;
      if (ferr) { ferr.hidden = true; ferr.textContent = ''; }
      if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) {} }
    }
    function openModal(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
      resetModal();
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      var f = form.querySelector('input,select,textarea');
      if (f) setTimeout(function () { f.focus(); }, 40);
    }
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    // deschidere programatica (ex. din checkerul NIS2), cu pre-completare
    window.ncsOpenConsult = function (message, interest) {
      openModal();
      if (message) { var m = form.querySelector('[name="message"]'); if (m) m.value = message; }
      if (interest) {
        var s = form.querySelector('[name="interest"]');
        if (s) { for (var i = 0; i < s.options.length; i++) { if (s.options[i].value === interest || s.options[i].text === interest) { s.selectedIndex = i; break; } } }
      }
    };
    // orice buton care duce spre #contact deschide formularul (mai putin CTA-ul NIS2 care e mailto)
    document.querySelectorAll('a.btn[href$="#contact"]:not(#nis2Cta), a.nav-cta').forEach(function (a) {
      a.addEventListener('click', openModal);
    });
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
    function showErr() {
      if (ferr) { ferr.textContent = form.getAttribute('data-err') || 'Error'; ferr.hidden = false; }
    }
    function sendMailto() {
      var d = new FormData(form);
      var email = form.getAttribute('data-email');
      var subject = (form.getAttribute('data-subject') || 'Consultatie') + (d.get('company') ? ' - ' + d.get('company') : '');
      var body =
        'Nume: ' + (d.get('name') || '') + '\n' +
        'Companie: ' + (d.get('company') || '-') + '\n' +
        'Email: ' + (d.get('email') || '') + '\n' +
        'Telefon: ' + (d.get('phone') || '-') + '\n' +
        'Interes: ' + (d.get('interest') || '-') + '\n\n' +
        'Mesaj:\n' + (d.get('message') || '-') + '\n';
      window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var bad = !inp.value.trim() || (inp.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value));
        inp.classList.toggle('bad', bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;

      var cap = form.querySelector('.h-captcha');
      if (cap) {
        var tok = form.querySelector('[name="h-captcha-response"]');
        if (!tok || !tok.value) {
          if (ferr) { ferr.textContent = form.getAttribute('data-captcha-msg') || 'Please complete the security check.'; ferr.hidden = false; }
          return;
        }
      }
      if (ferr) ferr.hidden = true;

      var key = form.getAttribute('data-web3key');
      if (!key) { sendMailto(); return; }

      var btn = form.querySelector('.modal-send');
      var orig = btn.textContent;
      btn.disabled = true; btn.textContent = '...';
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (r) { return r.json(); }).then(function (j) {
        btn.disabled = false; btn.textContent = orig;
        if (j && j.success) {
          form.reset();
          if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) {} }
          if (fbody) fbody.hidden = true;
          if (fsuccess) fsuccess.hidden = false;
        } else { showErr(); }
      }).catch(function () {
        btn.disabled = false; btn.textContent = orig; showErr();
      });
    });
    form.querySelectorAll('input').forEach(function (inp) {
      inp.addEventListener('input', function () { inp.classList.remove('bad'); });
    });
  }

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.07) + 's';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
