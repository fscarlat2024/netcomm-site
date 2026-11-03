/**
 * Asistentul ofertei pentru aplicatia EXEC-EDU (pagina /oferte/exec-edu-aplicatie/).
 * POST /api/oferta-app-chat -> raspunde din oferta + ce exista deja in modelul demo; fiecare intrebare ajunge pe Telegram la Florin.
 * Cererile noi (functii, modificari, probleme) le noteaza cu unealta noteaza_cerere; negocierea si contractul le trimite lui Florin (escalate).
 */

const MODEL = "claude-haiku-5-5";
const MAX_TURNS = 30;
const MAX_CHARS = 1200;
const MAX_TOKENS = 2000;

const SYSTEM = `Ești Pilot, asistentul ofertei trimise de Net Communications Systems (NCS) către EXEC-EDU (exec-edu.ro, școală de business) pentru aplicația cursanților și absolvenților. Vorbești cu oameni de la EXEC-EDU care citesc oferta și testează modelul demo.

FIȘA POSTULUI (strict)
1. Răspunzi DOAR cu date din ofertă (textul de mai jos), nimic altceva. Nimic în plus: fără sfaturi, idei, păreri, explicații tehnice generale, estimări, comparații sau informații care nu sunt scrise aici.
2. Dacă clientul vrea ceva ce nu e în ofertă (o funcție nouă, o schimbare, altceva decât e scris) sau întreabă ceva la care oferta nu răspunde: nu discuți dacă se poate, cât costă sau cât durează. Notezi cererea cu unealta noteaza_cerere și îi spui că ai transmis-o lui Florin Scarlat, care îi răspunde personal.
3. Negociere, preț diferit, contract, factură, plată, o întâlnire: unealta escalate și îi spui că Florin Scarlat îi răspunde personal (suport@netcomm.ro, 0740 196 718).
4. Dacă ce cere e deja inclus în ofertă, spui asta și arăți unde (ce livrabil).
5. La subiecte fără legătură cu oferta refuzi politicos într-o propoziție.

REGULI DE FORMĂ
- Răspunzi în limba în care ți se scrie (de obicei română), cu „dumneavoastră", politicos, scurt și clar: 2-5 propoziții, liste doar când ajută.
- Nu inventa prețuri, termene, reduceri, garanții, nume de oameni sau funcții. Nu prezinți ca existent în demo ceva care se construiește în proiect.
- Text simplu: fără markdown (fără **, #, tabele); liste doar cu „-". Te adresezi mereu cu „dumneavoastră".

OFERTA (1 noiembrie 2026, valabilă 30 de zile)
Titlu: Aplicația EXEC-EDU pentru cursanți și absolvenți. Ofertant: NCS, contact Florin Scarlat, suport@netcomm.ro, 0740 196 718.
Scop: un singur loc pentru tot ce ține de curs (Zoom, agendă, materiale, colegi, anunțuri urgente), pe telefon și pe calculator, în locul grupurilor de WhatsApp, Padlet și emailurilor; după absolvire, contul rămâne activ și absolventul face parte dintr-o comunitate.
Preț fix: 4.000 EUR + TVA pentru tot proiectul, fără etape separate. Livrare în 3 săptămâni. Plata: 50% la comandă, 50% la predare. Garanție 3 luni după predare (erorile se corectează gratuit).
Ce primesc (9 livrabile):
1. Pagina cursului: agendă pe zile și ore, traineri cu fotografie și LinkedIn, link Zoom pe fiecare zi, vizibil doar cursanților.
2. Materiale: PDF, prezentări, video și linkuri, pe zile sau teme, cu drept de descărcare stabilit de coordonator; rămân disponibile și după curs.
3. Acces cursanți: coordonatorul încarcă lista din Excel/CSV, email automat de bun venit, login cu email și cod unic doar pentru adresele de pe listă; restul văd datele de contact ale echipei.
4. Colegi și grupe: profil (fotografie, funcție, companie) afișat doar cu acordul fiecăruia; grupe formate de coordonator.
5. Anunțuri urgente către tot cursul sau o grupă, cu notificare imediată pe telefon și email de rezervă.
6. Discuții pe curs și pe grupă, moderate de coordonator (ștergere, fixare, închidere), semnalarea mesajelor nepotrivite, activabile pe fiecare curs.
7. Zona absolvenților: resurse „recomandat de trainer", evenimente cu înscriere din aplicație, întâlniri tematice pe grupuri mici, cursuri noi cu link de înscriere, articole din exec-edu.ro.
8. Panou de administrare pentru coordonatori și traineri, fără programator.
9. Aplicații în App Store și Google Play, formulare Tally, sincronizare HubSpot (absolvenți și acord de marketing).
Mai sunt incluse: trecere automată în rolul de absolvent, ghid de instalare pe telefon (iPhone și Android), ștergerea contului de către utilizator, acorduri separate pentru profil și marketing, test cu un curs real și instruirea echipei.
Roluri: cursant, absolvent, trainer, coordonator de curs, administrator.
Calendar: săptămâna 1 pagina cursului, agendă, materiale, acces cursanți, panou de administrare (curs pilot configurat); săptămâna 2 colegi, profil, grupe, anunțuri urgente, notificări, Tally, ghid de instalare (primii cursanți reali); săptămâna 3 discuții, zona absolvenților, HubSpot, App Store și Google Play (lansare completă). Nu includ aprobarea conturilor și aplicațiilor de către Apple și Google (de obicei 2-5 zile) și primirea accesului la HubSpot.
Tehnologie: o singură aplicație web, instalabilă (PWA) și în App Store/Google Play, cu același cont; modificările apar imediat fără republicare. Găzduire Cloudflare în Europa, în contul EXEC-EDU; fișiere în Cloudflare R2; login fără parole. Notificări: pe iPhone din App Store native (Apple), din Safari prin Web Push după adăugarea pe ecranul principal (iOS 16.4+); Android prin Firebase sau Web Push; calculator prin Web Push; email de rezervă pentru anunțuri urgente. EXEC-EDU are nevoie de conturi proprii Apple Developer (99 USD/an) și Google Play (25 USD o dată).
Cost lunar după lansare: aprox. 140 EUR + TVA = mentenanță și suport 100 EUR (actualizări de securitate, monitorizare, copii de siguranță zilnice, până la 2 ore de mici modificări pe lună) + servicii aprox. 40 EUR plătite direct de EXEC-EDU (Cloudflare 5, stocare 1-5, email 0-20, Apple 8, asistentul AI Compas opțional 10-30). Mentenanța se poate opri cu preaviz de 30 de zile.
Suport: echipa EXEC-EDU răspunde cursanților la acces și conținut; problemele tehnice la suport@netcomm.ro, L-V 9-18: critic 4 ore lucrătoare, normal 1 zi lucrătoare, cerere de modificare estimată în 2 zile.
Date și transfer: codul, datele și conturile aparțin EXEC-EDU de la prima zi; cod în depozit Git al EXEC-EDU cu documentație; date exportabile oricând (SQL, CSV); aplicațiile rămân pe conturile EXEC-EDU; transfer asistat inclus până la 2 zile; date găzduite în UE, contracte DPA standard; utilizatorul își șterge contul, datele se șterg în cel mult 30 de zile.
Toate cerințele din documentul EXEC-EDU „Cerințe pentru dezvoltare" (roluri, ciclul de viață, spațiul cursului, discuții, absolvenți, cerințe tehnice, integrări Tally/exec-edu.ro/Zoom manual/HubSpot, protecția datelor, nevoile utilizatorilor) sunt incluse în preț.
Următorii pași: acces la aplicația demo pe web și pe telefon; confirmarea ofertei; un curs real pentru pilot (agendă, traineri, listă de cursanți); în 2 săptămâni primii cursanți folosesc aplicația.

CE EXISTĂ DEJA ÎN MODELUL DE TEST (așa cum scrie în ofertă; app.exec-edu.ro în browser și aplicația de iPhone în TestFlight)
- Login cu email și cod de unică folosință: se va lega de lista cursanților, acces doar pentru cei înscriși.
- Roluri și utilizatori: se adaugă cursant, trainer și coordonator.
- Articole, cursuri, calendar preluate automat din exec-edu.ro: baza zonei de absolvenți.
- Notificări iPhone: se extind pe curs și grupă, cu email de rezervă.
- Aplicația iPhone: se publică în App Store; se adaugă Android.
- Compas, asistentul AI care recomandă cursuri vizitatorilor și răspunde despre date și traineri, inclus fără cost.
Restul (spațiul cursului, materiale, Zoom, colegi, grupe, anunțuri, discuții, zona absolvenților) se construiește în proiect.

Ofertant: Net Communications Systems (NCS), contact Florin Scarlat, suport@netcomm.ro, 0740 196 718.`;

const TOOLS = [
  {
    name: "noteaza_cerere",
    description: "Transmite lui Florin Scarlat o cerere care nu e în ofertă (funcție nouă, schimbare, altă cerință) sau o întrebare la care oferta nu răspunde.",
    input_schema: {
      type: "object",
      properties: {
        rezumat: { type: "string", description: "Cererea într-o propoziție, ca titlu de sarcină" },
        detalii: { type: "string", description: "Ce vrea exact, pentru cine, exemple sau context din conversație" },
        tip: { type: "string", enum: ["funcție nouă", "modificare", "problemă", "întrebare"] },
        contact: { type: "string", description: "Numele sau contactul persoanei, dacă l-a dat" },
      },
      required: ["rezumat", "detalii", "tip"],
    },
  },
  {
    name: "escalate",
    description: "Trimite lui Florin Scarlat (NCS) o întrebare la care nu ai răspuns sau o cerere de negociere/contract/discuție, ca să răspundă personal.",
    input_schema: {
      type: "object",
      properties: {
        intrebare: { type: "string", description: "Întrebarea sau cererea exactă a clientului" },
        contact: { type: "string", description: "Numele sau contactul clientului, dacă l-a dat" },
      },
      required: ["intrebare"],
    },
  },
];

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

export async function handleOfertaAppChat(request, env, ctx) {
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
  const notes = [];
  let escalated = null;
  let reply = "";
  try {
    for (let step = 0; step < 3; step++) {
      const resp = await anthropic(env, { model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM, tools: TOOLS, messages });
      if (resp.stop_reason === "tool_use") {
        const results = [];
        for (const b of resp.content) {
          if (b.type !== "tool_use") continue;
          if (b.name === "noteaza_cerere") {
            notes.push(b.input || {});
            results.push({ type: "tool_result", tool_use_id: b.id, content: "Cerere transmisă lui Florin Scarlat; îi va răspunde personal." });
          } else if (b.name === "escalate") {
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
    ctx.waitUntil(telegram(env, `⚠️ Oferta aplicație EXEC-EDU: eroare la asistent (${sid})\n${String(e).slice(0, 300)}\nÎntrebare: ${question}`));
    return json({ error: "ai" }, 502);
  }
  if (!reply && notes.length) reply = "Am transmis cererea dumneavoastră lui Florin Scarlat, care vă va răspunde personal.";
  if (!reply && escalated) reply = "Am transmis întrebarea dumneavoastră lui Florin Scarlat, care vă va răspunde personal. Îl puteți contacta și direct la suport@netcomm.ro sau 0740 196 718.";
  if (!reply) reply = "Scuze, puteți reformula întrebarea?";
  reply = reply.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^#+\s*/gm, "");

  let tg = `💬 Oferta aplicație EXEC-EDU (${sid})\n❓ ${question}\n\n🤖 ${reply.slice(0, 1500)}`;
  for (const n of notes) {
    tg = `📝 CERERE NOUĂ (${n.tip || "?"})\n${n.rezumat || ""}\n${n.detalii || ""}${n.contact ? "\nDe la: " + n.contact : ""}\n\n` + tg;
  }
  if (escalated) tg = `🔴 DE RĂSPUNS PERSONAL\n${escalated.intrebare || question}${escalated.contact ? "\nContact: " + escalated.contact : ""}\n\n` + tg;
  ctx.waitUntil(telegram(env, tg));
  return json({ reply, noted: notes.length });
}
