/**
 * Asistentul ofertei SEO pentru EXEC-EDU (pagina /oferte/exec-edu/).
 * POST /api/oferta-chat -> raspunde doar din continutul ofertei; fiecare intrebare ajunge pe Telegram la Florin.
 * Intrebarile la care nu are raspuns (negociere, contract, detalii nescrise) le trimite lui Florin prin unealta escalate.
 */

const MODEL = "claude-haiku-5-5";
const MAX_TURNS = 30;
const MAX_CHARS = 1200;
const MAX_TOKENS = 1500;

const SYSTEM = `Ești asistentul unei oferte comerciale trimise de Net Communications Systems (NCS) către EXEC-EDU. Vorbești cu oameni de la EXEC-EDU care citesc oferta.

FIȘA POSTULUI
Singura ta sursă este TEXTUL OFERTEI de mai jos. Spui doar ce scrie acolo, nimic altceva.
- Nu adaugi explicații, motive, exemple, detalii tehnice, comparații, opinii sau sfaturi care nu sunt scrise în ofertă. Nu folosești cunoștințe generale despre SEO, Cloudflare, WordPress sau orice altceva.
- Dacă răspunsul nu este scris explicit în ofertă, nu îl deduci și nu îl completezi: spui „Acest detaliu nu este în ofertă; vă va răspunde personal Florin Scarlat (suport@netcomm.ro, 0740 196 718)." și apelezi unealta escalate cu întrebarea exactă.
- Tot la Florin, prin escalate: negociere, reduceri, alt preț, alte termene, plată, factură, contract, cereri de întâlnire sau de discuție.
- Când reiei o listă din ofertă (calendar, preț, ce facem), o copiezi exact, fără să muți sau să adaugi elemente.
- Întrebări despre NCS (clienți, experiență, echipă, referințe) nu au răspuns în ofertă: le trimiți la Florin prin escalate.
- Nu vorbești despre alte agenții sau alte oferte.
- La subiecte care nu țin de această ofertă refuzi politicos într-o propoziție.
- Răspunsuri scurte (1-5 propoziții), cu „dumneavoastră", în limba în care ți se scrie. Text simplu, fără markdown (fără **, #, tabele); liste doar cu „-".

TEXTUL OFERTEI
Ofertă · 1 noiembrie 2026
Optimizare SEO pentru exec-edu.ro
Cele 131 de cursuri și toate cele aproximativ 216 articole de blog, puse în ordine tehnic și pe cuvinte-cheie, ca oamenii care caută deja cursurile voastre să ajungă la voi.
Preț fix: 2.900 EUR + TVA. Durată: 1 lună, 4 săptămâni de la semnare. Urgențe rezolvate: prima săptămână (404, redirecturi, conversii).

De la ce pornim
- 492 clicuri din Google pe cursuri, în 3 luni
- 22.600 afișări în aceeași perioadă
- 20,3 poziție medie, adică pagina 2
Oamenii caută deja cursurile, dar majoritatea văd site-ul abia pe pagina 2 și nu ajung la el. Am confirmat pe site principalele probleme:
- cursuri care dau 404 deși încă apar în Google, și redirecturi către pagini inexistente sau către exec-edu.eu;
- paginile de curs au mai multe titluri H1 (pagina verificată are 4);
- datele structurate descriu cursul ca produs (Product), nu ca un curs (Course);
- titluri duplicate între /calendar/ și /p/;
- Google Analytics și Tag Manager sunt instalate, dar nu măsoară nicio conversie.

Ce facem
Textele din pagini și articole rămân neschimbate; lucrăm doar pe elementele SEO.
1. Partea tehnică: Crawl complet; toate 404-urile și redirecturile greșite reparate; sitemap curățat; un singur H1 pe toate cursurile, corectat în șablon; date structurate Course cu dată, trainer, preț și locație, generate automat; setări Rank Math; profil Google și locații.
2. Cuvinte-cheie: Cercetare pe datele din Search Console și pe căutările pe care le pierdeți acum; un cuvânt principal și 2–3 secundare pentru fiecare curs, păstrând ce funcționează deja.
3. Cele 131 de cursuri: Titlu SEO, meta description, cuvinte-cheie și 3–5 întrebări FAQ pentru fiecare curs. Le primiți într-un tabel, le validați, apoi le introducem noi pe site.
4. Blog: toate articolele (aprox. 216): Pentru fiecare articol: titlu, meta description, cuvinte-cheie și linkuri interne către cursul potrivit și către înscriere.
5. Imagini: Compresie și format WebP, dimensiuni corecte, text alternativ pe cursuri și pe articolele lucrate.
6. Măsurare: Conversii în Google Analytics: înscriere, formulare, click pe telefon și email; raport la predare și unul la 30 de zile după, cu clicuri, poziții și conversii.

Calendar
- Săptămâna 1, Urgențe: 404, redirecturi, H1, schema Course; conversii în Google Analytics; cercetarea de cuvinte-cheie.
- Săptămâna 2, Cursurile: textele pentru toate cele 131 de cursuri, trimise la validare în loturi.
- Săptămâna 3, Blog și imagini: cursurile validate intră pe site; toate articolele de blog; imaginile.
- Săptămâna 4, Predare: profil Google și locații; verificare finală; raport de predare.
Termenul de o lună se ține dacă textele sunt validate în maximum 3 zile lucrătoare de la primire.

Preț (EUR, fără TVA)
- Partea tehnică: 650
- Cercetare cuvinte-cheie: 350
- 131 de cursuri (titlu, meta, cuvinte-cheie, FAQ): 900
- Toate cele aprox. 216 articole (titlu, meta, cuvinte-cheie, linkuri interne): 450
- Imagini: 200
- Măsurare + 2 rapoarte: 350
- Total: 2.900

Ce avem nevoie de la voi
- cont de administrator în WordPress;
- acces la Search Console, Google Analytics și Tag Manager;
- acces la profilul Google al companiei;
- o persoană care validează textele în maximum 3 zile lucrătoare.

Ce nu este inclus
- rescrierea conținutului din pagini și articole;
- articole noi, link building, campanii plătite;
- licența Rank Math Pro (aprox. 59 USD/an), dacă o luați;
- modificări de design sau de structură a site-ului.
Nu putem garanta poziții în Google: efectul modificărilor apare de obicei în 4–12 săptămâni. De aceea facem și un raport la 30 de zile după predare, care arată cum evoluează clicurile, pozițiile și conversiile.

Opțional, după proiect (EUR, fără TVA)
- Întreținere lunară: cursuri noi optimizate la publicare, verificare 404 și redirecturi, raport lunar: 100 / lună
- Găzduire și viteză pe Cloudflare: configurarea descrisă mai jos, de către noi: 250 (o singură dată)
- Abonament Cloudflare (APO), plătit de voi direct la Cloudflare: aprox. 5 USD / lună

Găzduire și viteză pe Cloudflare
exec-edu.ro trece deja prin Cloudflare, dar paginile nu sunt păstrate în cache: fiecare vizită ajunge până la serverul WordPress. Folosim mai bine ce aveți deja, fără să mutăm site-ul de pe serverul actual.
Ce configurăm:
- paginile servite din cache-ul Cloudflare (APO pentru WordPress), cu golire automată la fiecare modificare;
- imagini optimizate și livrate în WebP direct de Cloudflare;
- firewall pentru site (WAF), protecție la boți și la încercări de logare;
- certificat SSL, HTTP/3, compresie și redirecturi la nivel de Cloudflare.
Ce câștigați:
- pagini încărcate mai repede, ceea ce contează și la poziția în Google;
- mai puțină încărcare pe serverul WordPress;
- site-ul rezistă mai bine la trafic mare și la atacuri.
Abonamentul Cloudflare îl plătiți direct voi: APO costă aprox. 5 USD/lună, restul funcțiilor sunt incluse în planul gratuit.

Net Communications Systems · suport@netcomm.ro · 0740 196 718
Ofertă valabilă până la 1 decembrie 2026.`;

const ESCALATE_TOOL = {
  name: "escalate",
  description: "Trimite lui Florin Scarlat (NCS) o întrebare la care nu ai răspuns în ofertă sau o cerere de negociere/contract/discuție, ca să răspundă personal.",
  input_schema: {
    type: "object",
    properties: {
      intrebare: { type: "string", description: "Întrebarea sau cererea exactă a clientului" },
      contact: { type: "string", description: "Numele sau contactul clientului, dacă l-a dat" },
    },
    required: ["intrebare"],
  },
};

async function anthropic(env, body) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

async function telegram(env, text) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: text.slice(0, 3900) }),
  }).catch(() => {});
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function handleOfertaChat(request, env, ctx) {
  let data;
  try { data = await request.json(); } catch { return json({ error: "json" }, 400); }
  const sid = String(data.sid || "").replace(/[^a-z0-9]/gi, "").slice(0, 12) || "?";
  let messages = (Array.isArray(data.messages) ? data.messages : [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_messages" }, 400);

  const question = messages[messages.length - 1].content;
  let escalated = null;
  let reply = "";
  try {
    for (let step = 0; step < 3; step++) {
      const resp = await anthropic(env, { model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM, tools: [ESCALATE_TOOL], messages });
      const txt = (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      if (txt) reply = txt;
      if (resp.stop_reason === "tool_use") {
        const results = [];
        for (const b of resp.content) {
          if (b.type === "tool_use" && b.name === "escalate") {
            escalated = b.input || {};
            results.push({ type: "tool_result", tool_use_id: b.id, content: "Trimis lui Florin; va răspunde personal." });
          }
        }
        messages.push({ role: "assistant", content: resp.content });
        messages.push({ role: "user", content: results });
        continue;
      }
      reply = (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      break;
    }
  } catch (e) {
    ctx.waitUntil(telegram(env, `⚠️ Oferta EXEC-EDU: eroare la asistent (${sid})\n${String(e).slice(0, 300)}\nÎntrebare: ${question}`));
    return json({ error: "ai" }, 502);
  }
  if (!reply && escalated) reply = "Am transmis întrebarea dumneavoastră lui Florin Scarlat, care vă va răspunde personal. Îl puteți contacta și direct la suport@netcomm.ro sau 0740 196 718.";
  if (!reply) reply = "Scuze, puteți reformula întrebarea?";
  reply = reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#+\s*/gm, "");

  let tg = `💬 Oferta EXEC-EDU (${sid})\n❓ ${question}\n\n🤖 ${reply.slice(0, 1500)}`;
  if (escalated) tg = `🔴 DE RĂSPUNS PERSONAL\n${escalated.intrebare || question}${escalated.contact ? "\nContact: " + escalated.contact : ""}\n\n` + tg;
  ctx.waitUntil(telegram(env, tg));
  return json({ reply });
}
