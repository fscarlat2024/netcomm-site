// Lista cererilor notate de asistentii de oferta. Cheia vine din linkul primit (#k=...) si ramane salvata in browser.
(function () {
  var KEY = "ncs-oferte-key";
  var k = "";
  var m = location.hash.match(/k=([A-Za-z0-9]+)/);
  if (m) { k = m[1]; try { localStorage.setItem(KEY, k); } catch (e) {} history.replaceState(null, "", location.pathname); }
  if (!k) { try { k = localStorage.getItem(KEY) || ""; } catch (e) {} }
  var list = document.getElementById("list");
  var OFERTE = { "aplicatie-execedu": "Aplicația EXEC-EDU" };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function when(d) { try { return new Date(d).toLocaleString("ro-RO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return d; } }

  function load() {
    if (!k) { list.innerHTML = '<div class="err">Deschide pagina din linkul primit de la Claude (conține cheia de acces).</div>'; return; }
    list.innerHTML = '<div class="empty">Se încarcă…</div>';
    fetch("/api/oferte-cereri", { headers: { "x-key": k }, cache: "no-store" })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (!res.ok) { list.innerHTML = '<div class="err">Cheia nu e valabilă. Cere un link nou.</div>'; return; }
        if (!res.j.length) { list.innerHTML = '<div class="empty">Încă nu sunt cereri.</div>'; return; }
        list.innerHTML = res.j.map(function (c) {
          return '<article class="card"><div class="meta"><span class="chip">' + esc(c.tip || "cerere") + "</span><span>" + esc(OFERTE[c.oferta] || c.oferta) + "</span><span>" + esc(when(c.created_at)) + "</span>" +
            (c.contact ? "<span>· " + esc(c.contact) + "</span>" : "") + "</div>" +
            "<h2>" + esc(c.rezumat) + "</h2>" + (c.detalii ? "<p>" + esc(c.detalii) + "</p>" : "") +
            '<details><summary>Conversația</summary><p><b>Client:</b> ' + esc(c.intrebare) + "</p><p><b>Asistent:</b> " + esc(c.raspuns) + "</p></details></article>";
        }).join("");
      })
      .catch(function () { list.innerHTML = '<div class="err">Nu s-a putut încărca. Încearcă din nou.</div>'; });
  }
  document.getElementById("reload").onclick = load;
  load();
})();
