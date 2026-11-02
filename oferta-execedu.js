/**
 * Asistentul ofertei SEO pentru EXEC-EDU (pagina /oferte/exec-edu/).
 * POST /api/oferta-chat -> raspunde doar din continutul ofertei; fiecare intrebare ajunge pe Telegram la Florin.
 * Intrebarile la care nu are raspuns (negociere, contract, detalii nescrise) le trimite lui Florin prin unealta escalate.
 */

const MODEL = "claude-haiku-4-5";
const MAX_TURNS = 30;
const MAX_CHARS = 1200;
const MAX_TOKENS = 600;

const SYSTEM = `Ești asistentul unei oferte comerciale trimise de Net Communications Systems (NCS) către EXEC-EDU (exec-edu.ro, școală de business). Vorbești cu oameni de la EXEC-EDU care citesc oferta.

REGULI
- Răspunzi în limba în care ți se scrie (de obicei română), cu „dumneavoastră", politicos, scurt și clar: 2-6 propoziții, liste doar când ajută.
- Răspunzi DOAR din informațiile de mai jos. Nu inventa prețuri, termene, reduceri, garanții, nume de oameni sau detalii tehnice care nu sunt aici.
- Nu promiți reduceri, alte prețuri, alte termene, condiții de plată sau clauze contractuale. Pentru negociere, contract, factură, plată, o întrebare la care nu ai răspuns sau o cerere de discuție: spui că Florin Scarlat le va răspunde personal, dai contactul (suport@netcomm.ro, 0740 196 718) și apelezi unealta escalate cu întrebarea exactă.
- Nu vorbești despre alte agenții și nu le critici propunerile. Dacă ești întrebat de comparații, explici doar ce face oferta NCS.
- Nu garantezi poziții în Google.
- Nu ieși din subiectul ofertei și al serviciilor NCS pentru EXEC-EDU; la altceva refuzi politicos și revii la ofertă.
- Text simplu: fără markdown (fără **, #, tabele); liste doar cu „-". Te adresezi mereu cu „dumneavoastră", niciodată „voi".

OFERTA (data: 1 noiembrie 2026, valabilă până la 1 decembrie 2026)
Titlu: Optimizare SEO pentru exec-edu.ro. Ofertant: Net Communications Systems (NCS), contact Florin Scarlat, suport@netcomm.ro, 0740 196 718.
Preț fix: 2.900 EUR + TVA. Durată: 1 lună (4 săptămâni de la semnare). Urgențele (404, redirecturi, conversii) se rezolvă în prima săptămână.

De la ce pornim (date din auditul EXEC-EDU, ultimele 3 luni): paginile de curs au adus 492 de clicuri din 22.600 de afișări în Google, poziție medie 20,3 (pagina 2). Probleme confirmate de NCS pe site: cursuri care dau 404 deși încă apar în Google și redirecturi către pagini inexistente sau către exec-edu.eu; paginile de curs au mai multe titluri H1 (pagina verificată are 4); datele structurate descriu cursul ca produs (Product), nu ca un curs (Course); titluri duplicate între /calendar/ și /p/; Google Analytics și Tag Manager sunt instalate, dar nu măsoară nicio conversie. Site-ul are 131 de cursuri și aproximativ 216 articole de blog.

Ce facem (textele din pagini și articole rămân neschimbate; lucrăm doar pe elementele SEO):
1. Partea tehnică: crawl complet; toate 404-urile și redirecturile greșite reparate; sitemap curățat; un singur H1 pe toate cursurile, corectat în șablon (o singură modificare pentru toate); date structurate Course cu dată, trainer, preț și locație, generate automat din WooCommerce și calendar; setări Rank Math; profil Google și locații.
2. Cuvinte-cheie: cercetare pe datele din Search Console și pe căutările pierdute acum; un cuvânt principal și 2-3 secundare pentru fiecare curs, păstrând ce funcționează deja.
3. Cele 131 de cursuri: titlu SEO, meta description, cuvinte-cheie și 3-5 întrebări FAQ pentru fiecare. EXEC-EDU le primește într-un tabel, le validează, apoi NCS le introduce pe site.
4. Blog: toate articolele (aprox. 216): titlu, meta description, cuvinte-cheie și linkuri interne către cursul potrivit și către înscriere (fără FAQ).
5. Imagini: compresie și format WebP, dimensiuni corecte, text alternativ pe cursuri și articole.
6. Măsurare: conversii în Google Analytics (înscriere, formulare, click pe telefon și email); un raport la predare și unul la 30 de zile după, cu clicuri, poziții și conversii.

Calendar: Săptămâna 1 urgențe (404, redirecturi, H1, schema Course, conversii GA4) + cercetarea de cuvinte-cheie. Săptămâna 2 textele pentru toate cele 131 de cursuri, trimise la validare în loturi. Săptămâna 3 cursurile validate intră pe site, articolele de blog, imaginile. Săptămâna 4 profil Google și locații, verificare finală, raport de predare. Termenul de o lună se ține dacă textele sunt validate în maximum 3 zile lucrătoare de la primire.
De ce se poate în o lună: o parte mare din muncă se face automat și o singură dată pentru toate paginile (H1 în șablon, schema Course generată din datele WooCommerce, crawl automat), iar textele pentru cursuri și articole se pregătesc în loturi.

Preț pe componente (EUR fără TVA): partea tehnică 650; cercetare cuvinte-cheie 350; 131 de cursuri 900; toate cele aprox. 216 articole 450; imagini 200; măsurare + 2 rapoarte 350. Total 2.900 EUR + TVA, preț fix. Condițiile de plată nu sunt în ofertă: le stabilește Florin.

Ce e nevoie de la EXEC-EDU: cont de administrator în WordPress; acces la Search Console, Google Analytics și Tag Manager; acces la profilul Google al companiei; o persoană care validează textele în maximum 3 zile lucrătoare.
Ce nu este inclus: rescrierea conținutului din pagini și articole; articole noi, link building, campanii plătite (Google Ads, Meta); licența Rank Math Pro (aprox. 59 USD/an, dacă o iau, o cumpără ei); modificări de design sau de structură a site-ului.
Rezultate: nu se pot garanta poziții în Google; efectul modificărilor apare de obicei în 4-12 săptămâni. De aceea există și raportul la 30 de zile după predare.

Opțional, după proiect (EUR fără TVA): întreținere lunară 100 EUR/lună (cursuri noi optimizate la publicare, verificare 404 și redirecturi, raport lunar). Configurare găzduire și viteză pe Cloudflare: 250 EUR o singură dată, făcută de NCS. Abonamentul Cloudflare (APO) aprox. 5 USD/lună, plătit de EXEC-EDU direct la Cloudflare.

Cloudflare: exec-edu.ro trece deja prin Cloudflare, dar paginile nu sunt păstrate în cache, așa că fiecare vizită ajunge la serverul WordPress. Site-ul rămâne pe serverul actual (WordPress nu rulează direct pe Cloudflare). NCS configurează: pagini servite din cache-ul Cloudflare (APO pentru WordPress) cu golire automată la fiecare modificare; imagini optimizate livrate în WebP; firewall (WAF), protecție la boți și la încercări de logare; SSL, HTTP/3, compresie, redirecturi la nivel de Cloudflare. Câștig: pagini mai rapide (contează și în Google), mai puțină încărcare pe server, rezistență la trafic mare și atacuri.

Despre NCS: firmă IT din București (Str. Samuil Vulcan nr. 12), servicii IT, securitate cibernetică, NIS2, Microsoft 365, rețele, site-uri și aplicații; site netcomm.ro.`;

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
