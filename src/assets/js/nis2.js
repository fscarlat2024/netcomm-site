// NCS - checker NIS2 (scor de conformitate, fara backend)
(function () {
  var root = document.getElementById('nis2Checker');
  if (!root) return;
  var cfg;
  try { cfg = JSON.parse(decodeURIComponent(root.getAttribute('data-cfg'))); }
  catch (e) { return; }

  var rows = [].slice.call(root.querySelectorAll('.q'));
  var answers = {};

  rows.forEach(function (row) {
    var idx = row.getAttribute('data-idx');
    row.querySelectorAll('.q-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        row.querySelectorAll('.q-opt').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        row.classList.remove('miss');
        answers[idx] = parseInt(btn.getAttribute('data-v'), 10);
      });
    });
  });

  var quiz = root.querySelector('.nis2-quiz');
  var result = document.getElementById('nis2Result');

  document.getElementById('nis2Calc').addEventListener('click', function () {
    var missing = rows.filter(function (r) { return !(r.getAttribute('data-idx') in answers); });
    if (missing.length) {
      missing.forEach(function (r) { r.classList.add('miss'); });
      missing[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var max = rows.length * 2, sum = 0, gaps = [];
    rows.forEach(function (r) {
      var idx = r.getAttribute('data-idx');
      sum += answers[idx];
      if (answers[idx] < 2) gaps.push(r.getAttribute('data-gap'));
    });
    var pct = Math.round((sum / max) * 100);

    var key = pct >= cfg.tHigh ? 'high' : (pct >= cfg.tMid ? 'mid' : 'low');
    var lvl = cfg.levels[key];

    result.classList.remove('nis2-high', 'nis2-mid', 'nis2-low');
    result.classList.add('nis2-' + key);
    document.getElementById('nis2Score').textContent = pct + '%';
    var fill = document.getElementById('nis2Fill');
    document.getElementById('nis2LevelTitle').textContent = lvl.title;
    document.getElementById('nis2LevelMsg').textContent = lvl.msg;

    var gapsBox = document.getElementById('nis2Gaps');
    if (gaps.length) {
      document.getElementById('nis2GapsTitle').textContent = cfg.gapsTitle;
      var ul = document.getElementById('nis2GapsList');
      ul.innerHTML = '';
      gaps.forEach(function (g) { var li = document.createElement('li'); li.textContent = g; ul.appendChild(li); });
      gapsBox.hidden = false;
    } else {
      gapsBox.hidden = true;
    }

    // mailto pre-completat cu scorul + goluri
    var subject = cfg.subject.replace('{score}', pct);
    var gapText = gaps.length ? gaps.map(function (g) { return '- ' + g; }).join('\n') : '-';
    var body = cfg.body
      .replace('{score}', pct)
      .replace('{level}', lvl.title)
      .replace('{gaps}', gapText);
    document.getElementById('nis2Cta').setAttribute(
      'href',
      'mailto:' + cfg.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
    );

    quiz.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
    requestAnimationFrame(function () { fill.style.width = pct + '%'; });
  });

  document.getElementById('nis2Redo').addEventListener('click', function () {
    result.hidden = true;
    quiz.hidden = false;
    document.getElementById('nis2Fill').style.width = '0%';
    quiz.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
