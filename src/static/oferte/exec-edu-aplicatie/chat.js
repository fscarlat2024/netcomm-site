// Pilot, asistentul ofertei pentru aplicatia EXEC-EDU (POST /api/oferta-app-chat): raspunde si noteaza cererile noi.
(function () {
  // butonul apare doar cand asistentul e pornit (OFERTA_APP_CHAT=on in wrangler.jsonc)
  fetch("/api/oferta-app-chat", { cache: "no-store" }).then(function (r) { return r.json(); })
    .then(function (s) { if (s && s.on) start(); }).catch(function () {});
  function start() {
  var KEY = "oa-execedu-app-v1";
  var GREET = "Bună ziua! Sunt Pilot, asistentul acestei oferte. Vă răspund la întrebări despre această ofertă. Dacă vă doriți ceva în plus sau altfel, spuneți-mi și transmit cererea lui Florin Scarlat.";
  var SUGG = [
    "Ce include prețul de 4.000 EUR?",
    "Ce pot vedea deja în demo?",
    "Cum funcționează notificările pe iPhone?",
    "Aș vrea o funcție în plus"
  ];
  var msgs = [];
  try { msgs = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) { msgs = []; }
  var sid = "";
  try { sid = sessionStorage.getItem(KEY + "-sid") || ""; } catch (e) {}
  if (!sid) { sid = Math.random().toString(36).slice(2, 10); try { sessionStorage.setItem(KEY + "-sid", sid); } catch (e) {} }

  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30))); } catch (e) {} }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  var btn = el("button", "oa-btn");
  btn.type = "button";
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg><span>Întrebări sau cereri? Vorbiți cu Pilot</span>';

  var panel = el("div", "oa-panel");
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Asistentul ofertei");
  var head = el("div", "oa-head");
  var ht = el("div");
  ht.appendChild(el("b", null, "Pilot · asistentul ofertei"));
  ht.appendChild(el("span", null, "Răspunde în câteva secunde"));
  var close = el("button", "oa-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Închide");
  head.appendChild(ht); head.appendChild(close);
  var log = el("div", "oa-log");
  log.setAttribute("aria-live", "polite");
  var form = el("form", "oa-form");
  var ta = el("textarea");
  ta.id = "oa-input";
  ta.placeholder = "Scrieți întrebarea…";
  ta.maxLength = 1200;
  ta.setAttribute("aria-label", "Întrebarea dumneavoastră");
  var send = el("button", null, "Trimite");
  send.type = "submit";
  form.appendChild(ta); form.appendChild(send);
  var note = el("div", "oa-note", "Asistent AI · răspunde doar despre ofertă; restul îl transmite lui Florin Scarlat");
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(form); panel.appendChild(note);
  document.body.appendChild(btn); document.body.appendChild(panel);

  function bubble(role, text) { var m = el("div", "oa-msg " + (role === "user" ? "me" : "bot"), text); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; }
  function render() {
    log.innerHTML = "";
    bubble("assistant", GREET);
    msgs.forEach(function (m) { bubble(m.role, m.content); });
    if (!msgs.length) {
      var s = el("div", "oa-sugg");
      SUGG.forEach(function (q) { var b = el("button", null, q); b.type = "button"; b.onclick = function () { ask(q); }; s.appendChild(b); });
      log.appendChild(s);
    }
  }

  var busy = false;
  function ask(text) {
    text = String(text || "").trim();
    if (!text || busy) return;
    busy = true; send.disabled = true;
    msgs.push({ role: "user", content: text }); save(); render();
    var wait = bubble("assistant", "Scriu răspunsul…"); wait.classList.add("wait");
    fetch("/api/oferta-app-chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: msgs, sid: sid })
    }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        var reply = res.ok && res.j.reply ? res.j.reply : "Nu am putut răspunde acum. Ne puteți scrie la suport@netcomm.ro sau suna la 0740 196 718.";
        msgs.push({ role: "assistant", content: reply + (res.ok && res.j.noted ? "\n\n✓ Cerere transmisă lui Florin Scarlat" : "") }); save();
      })
      .catch(function () { msgs.push({ role: "assistant", content: "Conexiunea a căzut. Încercați din nou sau scrieți-ne la suport@netcomm.ro." }); save(); })
      .then(function () { busy = false; send.disabled = false; render(); ta.focus(); });
  }

  btn.onclick = function () { panel.hidden = false; btn.hidden = true; render(); ta.focus(); };
  close.onclick = function () { panel.hidden = true; btn.hidden = false; };
  form.onsubmit = function (e) { e.preventDefault(); var t = ta.value; ta.value = ""; ask(t); };
  ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.onsubmit(e); } });
  }
})();
