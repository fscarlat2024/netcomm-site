/* Chat widget netcomm.ro - vorbeste cu vizitatorul, recomanda solutii, capteaza lead.
   Fara dependinte. CSP-safe (fisier extern). */
(function () {
  "use strict";
  var lang = (document.documentElement.lang || "ro").slice(0, 2) === "en" ? "en" : "ro";

  var T = {
    ro: {
      title: "Cyber",
      sub: "Asistentul NCS · răspunde în câteva secunde",
      greet: "Bună, sunt Cyber, asistentul virtual, și vă voi răspunde în câteva secunde.",
      ph: "Scrieți un mesaj…",
      send: "Trimite",
      open: "Deschide chat",
      close: "Închide",
      err: "A apărut o eroare. Încercați din nou sau scrieți-ne la suport@netcomm.ro.",
    },
    en: {
      title: "Cyber",
      sub: "NCS assistant · replies in seconds",
      greet: "Hi, I'm Cyber, the virtual assistant, and I'll get back to you in a few seconds.",
      ph: "Type a message…",
      send: "Send",
      open: "Open chat",
      close: "Close",
      err: "Something went wrong. Please try again or email us at suport@netcomm.ro.",
    },
  }[lang];

  var KEY = "ncsChat";
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch (e) {} }

  // ---- DOM ----
  var root = document.createElement("div");
  root.className = "ncs-chat";
  root.innerHTML =
    '<button class="ncs-bubble" type="button" aria-label="' + T.open + '">' +
      '<svg class="ncs-ic-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/></svg>' +
      '<svg class="ncs-ic-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button>' +
    '<div class="ncs-panel" role="dialog" aria-label="' + T.title + '" hidden>' +
      '<div class="ncs-head"><div><b>' + T.title + '</b><span>' + T.sub + '</span></div>' +
        '<button class="ncs-close" type="button" aria-label="' + T.close + '">&times;</button></div>' +
      '<div class="ncs-msgs" aria-live="polite"></div>' +
      '<form class="ncs-form"><input class="ncs-in" type="text" autocomplete="off" placeholder="' + T.ph + '" aria-label="' + T.ph + '">' +
        '<button class="ncs-send" type="submit" aria-label="' + T.send + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(root);

  var bubble = root.querySelector(".ncs-bubble");
  var panel = root.querySelector(".ncs-panel");
  var msgs = root.querySelector(".ncs-msgs");
  var form = root.querySelector(".ncs-form");
  var input = root.querySelector(".ncs-in");
  var busy = false;

  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }
  function render(text) {
    var lines = String(text).split(/\n/).map(function (line) {
      var h = esc(line);
      h = h.replace(/^\s*#{1,4}\s*(.+)$/, "<strong>$1</strong>"); // titluri markdown -> bold
      h = h.replace(/^\s*[-*]\s+(.+)$/, "&bull; $1");              // liste -> bullet
      h = h.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");     // **bold**
      h = h.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
      h = h.replace(/(^|[\s(])(\/(?:nis2|blog|en)\/[^\s<)]*)/g, '$1<a href="$2">$2</a>');
      return h;
    });
    return lines.join("<br>");
  }

  function add(role, text) {
    var el = document.createElement("div");
    el.className = "ncs-msg ncs-" + role;
    el.innerHTML = render(text);
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  function typing(on) {
    var t = msgs.querySelector(".ncs-typing");
    if (on && !t) {
      t = document.createElement("div");
      t.className = "ncs-msg ncs-assistant ncs-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      msgs.appendChild(t);
      msgs.scrollTop = msgs.scrollHeight;
    } else if (!on && t) { t.remove(); }
  }

  var opened = false;
  function paint() {
    msgs.innerHTML = "";
    add("assistant", T.greet);
    history.forEach(function (m) { add(m.role, m.content); });
  }

  function toggle() {
    opened = !opened;
    root.classList.toggle("open", opened);
    panel.hidden = !opened;
    bubble.setAttribute("aria-label", opened ? T.close : T.open);
    if (opened) {
      if (!msgs.childElementCount) paint();
      setTimeout(function () { input.focus(); }, 60);
    }
  }
  bubble.addEventListener("click", toggle);
  root.querySelector(".ncs-close").addEventListener("click", toggle);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    input.value = "";
    add("user", text);
    history.push({ role: "user", content: text });
    save();
    busy = true;
    typing(true);

    fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lang: lang, messages: history }),
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (d) {
        typing(false);
        var reply = (d && d.reply) || T.err;
        add("assistant", reply);
        history.push({ role: "assistant", content: reply });
        save();
      })
      .catch(function () {
        typing(false);
        add("assistant", T.err);
      })
      .finally(function () { busy = false; input.focus(); });
  });
})();
