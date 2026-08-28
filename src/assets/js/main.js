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
    function openModal(e) {
      if (e) e.preventDefault();
      lastFocus = document.activeElement;
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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var reqMsg = form.getAttribute('data-req') || 'Required';
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (inp) {
        var bad = !inp.value.trim() || (inp.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value));
        inp.classList.toggle('bad', bad);
        if (bad && ok) { inp.focus(); ok = false; }
      });
      if (!ok) return;
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
      form.querySelector('.modal-send').textContent = form.querySelector('.modal-send').textContent;
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
