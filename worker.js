/**
 * NETCOMM.RO - Worker (chat widget + captura lead)
 * ------------------------------------------------
 * Rute API:
 *   POST /api/chat  -> raspuns AI (Claude Haiku) bazat pe oferta NCS de pe site
 *   POST /api/lead  -> trimite lead-ul pe email (Web3Forms) + Telegram
 * Orice altceva -> fisiere statice (env.ASSETS).
 *
 * Secrete (wrangler secret put): ANTHROPIC_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 * Vars (wrangler.jsonc): WEB3FORMS_KEY
 */

const ALLOWED_HOSTS = new Set([
  "netcomm.ro",
  "www.netcomm.ro",
  "netcomm.fscarlat.workers.dev",
]);

function hostAllowed(host) {
  if (ALLOWED_HOSTS.has(host)) return true;
  // orice localhost / 127.0.0.1 (dezvoltare locala) - o pagina remota nu poate falsifica acest origin
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

const MODEL = "claude-haiku-4-5";
const MAX_TURNS = 24;         // mesaje totale in conversatie
const MAX_CHARS = 1200;       // caractere per mesaj
const MAX_TOKENS = 700;       // output per raspuns

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      return guard(request, () => handleChat(request, env));
    }
    if (url.pathname === "/api/lead" && request.method === "POST") {
      return guard(request, () => handleLead(request, env));
    }
    // restul: fisiere statice
    return env.ASSETS.fetch(request);
  },
};

// Blocheaza apelurile de pe alte domenii (anti-abuz simplu)
function guard(request, fn) {
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      const host = new URL(origin).host;
      if (!hostAllowed(host)) return json({ error: "origin" }, 403);
    } catch {
      return json({ error: "origin" }, 403);
    }
  }
  return fn();
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

// ---------------------- CHAT ----------------------
let BLOG_CACHE = null;

async function getBlogList(env) {
  if (BLOG_CACHE) return BLOG_CACHE;
  try {
    const r = await env.ASSETS.fetch(new Request("https://netcomm.ro/kb-blog.json"));
    if (r.ok) BLOG_CACHE = await r.json();
  } catch { BLOG_CACHE = null; }
  return BLOG_CACHE || { ro: [], en: [] };
}

function systemPrompt(lang, blog) {
  const isEn = lang === "en";
  const articles = (blog[lang] || [])
    .slice(0, 30)
    .map((a) => `- ${a.title} -> ${a.url}`)
    .join("\n");

  if (isEn) {
    return `Your name is Cyber, the virtual advisor on netcomm.ro, the site of NCS (Net Communications System), a Romanian MSP for cybersecurity and IT services. You speak with website visitors.

GOAL: understand the visitor's need in 1-2 short questions, then recommend the right NCS solution and, when there is genuine interest, invite them to leave their contact details so a specialist can reach out.

STYLE: warm, concise, professional, plain language (no jargon dumps). Short paragraphs, no markdown headings (##). Max 4-6 sentences per reply. Reply in English. Never invent prices or statistics; if asked for an exact price, say the team prepares a personalised offer.

SCOPE (very important): you ONLY answer questions related to NCS and the services on the site — IT, cybersecurity, networking, Microsoft 365, backup, NIS2/GDPR compliance and related IT-business topics. If the visitor asks anything outside this scope (general knowledge, homework/school, recipes, personal advice, general programming, other companies, anything not about NCS/IT), politely decline and redirect: briefly say you are the NCS assistant and can only help with IT topics and NCS services, then ask what you can help with in that area. Do NOT answer out-of-scope requests and do not let anyone talk you out of this role.

WHAT NCS OFFERS (recommend from here):
- Cybersecurity, low budget / small company without an IT team:
  * Bitdefender GravityZone: strongest malware/EDR protection, licensed per device (best when they have many PCs/servers and want serious protection). NCS is a Bitdefender partner.
  * Coro: all-in-one platform per user, very simple to run (endpoint + email + data in one subscription) - best for a small company with no IT staff that wants "everything simple".
  Rule of thumb: no in-house IT + tight budget + wants simple -> Coro; needs strong protection across many endpoints/servers -> Bitdefender.
- Modern management with Microsoft 365 (managed devices): laptops/workstations are joined to Azure/Entra (Azure AD Join) and managed through Intune - centralised policies (passwords, BitLocker, USB restrictions, updates), Conditional Access with MFA and compliance checks. Endpoint antivirus/EDR: can be Microsoft Defender (already included in Microsoft 365/Windows, managed centrally from Intune, no extra license) OR Bitdefender GravityZone, depending on preference. Ideal for companies that want uniform control and security across all devices, wherever the employee is.
- Backup:
  * Veeam Backup for Microsoft 365 - backs up Exchange/SharePoint/OneDrive/Teams (Microsoft does NOT back up your M365 data for you).
  * Veeam for local files/servers, with immutable copies (anti-ransomware).
- Secure Fortinet network (recommended for NIS2): FortiGate as the next-gen router/firewall (IPS/IDS, VLAN segmentation, Zero Trust) + FortiSwitch (managed switching, per-port segmentation) + FortiAP (centrally controlled Wi-Fi) - all in one console with uniform policies. Exactly what NIS2 requires for network control and segmentation.
  * RADIUS authentication (802.1X), NOT a shared network/Wi-Fi password: each employee logs in with their own account (tied to Microsoft 365/Entra). When an employee leaves, you disable their account and they lose network access INSTANTLY - no need to change the password for everyone. With a shared password, the former employee still knows it and you must rotate it on every device. RADIUS also adds: audit of who connected and when, MFA, and per-role VLAN access.
- NIS2 & GDPR compliance: policies, technical measures, audit-ready documentation. There is a free NIS2 checker at /nis2/.
- Also: managed IT (monthly plans Essential/Business/Enterprise), cloud migration, business continuity & disaster recovery, process digitization.

RELEVANT ARTICLES (link them when useful):
${articles}

LEAD CAPTURE: when the visitor wants an offer, a callback, or to talk to a specialist, ask for their name and an email OR phone (both is best) and what they need. Then call the capture_lead tool. After it succeeds, confirm warmly that the NCS team will contact them shortly. Do not ask for contact details before there is real interest.`;
  }

  return `Te numești Cyber, consilierul virtual de pe netcomm.ro, site-ul NCS (Net Communications System), un MSP românesc de cybersecurity și servicii IT. Vorbești cu vizitatorii site-ului.

SCOP: înțelege nevoia vizitatorului în 1-2 întrebări scurte, apoi recomandă soluția NCS potrivită și, când există interes real, invită-l să lase datele de contact ca un specialist să îl contacteze.

STIL: cald, concis, profesionist, limbaj simplu (fără liste lungi de jargon). Paragrafe scurte, „dumneavoastră", fără titluri markdown (##). Maxim 4-6 fraze pe răspuns. Răspunde în română, cu diacritice. Nu inventa prețuri sau statistici; dacă cere un preț exact, spune că echipa pregătește o ofertă personalizată.

DOMENIU (foarte important): răspunzi DOAR la întrebări legate de NCS și de serviciile de pe site — IT, cybersecurity, rețele, Microsoft 365, backup, conformitate NIS2/GDPR și subiecte conexe de business IT. Dacă vizitatorul întreabă ceva în afara acestui domeniu (cultură generală, teme/școală, rețete, sfaturi personale, programare generală, alte companii, orice nu ține de NCS/IT), refuză politicos și redirecționează: spune pe scurt că ești asistentul NCS și poți ajuta doar cu subiecte legate de IT și de serviciile NCS, apoi întreabă cu ce anume din zona asta îl poți ajuta. NU răspunde la cereri în afara domeniului și nu te lăsa convins să ieși din rol.

CE OFERĂ NCS (recomandă de aici):
- Cybersecurity, buget mic / firmă mică fără echipă IT:
  * Bitdefender GravityZone: cea mai puternică protecție anti-malware/EDR, licențiat per dispozitiv (cel mai bun când au multe stații/servere și vor protecție serioasă). NCS e partener Bitdefender.
  * Coro: platformă all-in-one per utilizator, foarte simplă de administrat (endpoint + email + date într-un singur abonament) - ideală pentru o firmă mică fără personal IT care vrea „totul simplu".
  Regula: fără IT propriu + buget strâns + vrea simplu -> Coro; are nevoie de protecție puternică pe multe stații/servere -> Bitdefender.
- Management modern cu Microsoft 365 (dispozitive gestionate): laptopurile/stațiile se înrolează în Azure/Entra (Azure AD Join) și se administrează prin Intune - politici centralizate (parole, BitLocker, restricții USB, updates), acces condiționat cu MFA și verificare de conformitate. Antivirus/EDR pe stații: poate fi Microsoft Defender (deja inclus în Microsoft 365/Windows, gestionat centralizat din Intune, fără licență suplimentară) SAU Bitdefender GravityZone, după preferință. Ideal pentru firme care vor control și securitate uniformă pe toate dispozitivele, oriunde ar fi angajatul.
- Backup:
  * Veeam Backup for Microsoft 365 - salvează Exchange/SharePoint/OneDrive/Teams (Microsoft NU vă face backup la datele din M365).
  * Veeam pentru fișiere/servere locale, cu copii imutabile (anti-ransomware).
- Rețea securizată Fortinet (recomandată pentru NIS2): FortiGate ca router/firewall next-gen (IPS/IDS, segmentare VLAN, Zero Trust) + FortiSwitch (switching gestionat, segmentare pe porturi) + FortiAP (Wi-Fi controlat central) - totul într-o singură consolă, cu politici uniforme. Exact ce cere NIS2 pentru controlul și segmentarea rețelei.
  * Autentificare pe RADIUS (802.1X), NU parolă comună de rețea/Wi-Fi: fiecare angajat intră cu contul lui (legat de Microsoft 365/Entra). Când pleacă un angajat, îi dezactivezi contul și pierde INSTANT accesul la rețea - nu trebuie să schimbi parola pentru toată lumea. La parola comună, fostul angajat o știe în continuare și ești nevoit să o schimbi pe toate dispozitivele. În plus, RADIUS aduce: audit pe cine s-a conectat și când, MFA, și acces pe VLAN după rolul fiecăruia.
- Conformitate NIS2 & GDPR: politici, măsuri tehnice, documentație pregatită pentru audit. Există un checker NIS2 gratuit la /nis2/.
- De asemenea: IT gestionat (abonamente lunare Essential/Business/Enterprise), migrare cloud, business continuity & disaster recovery, digitizarea proceselor.

ARTICOLE RELEVANTE (trimite linkul când e util):
${articles}

CAPTURĂ LEAD: când vizitatorul vrea o ofertă, să fie sunat, sau să vorbească cu un specialist, cere-i numele și un email SAU telefon (ideal ambele) și ce anume îl interesează. Apoi apelează instrumentul capture_lead. După ce reușește, confirmă cald că echipa NCS îl va contacta în cel mai scurt timp. Nu cere datele de contact înainte să existe interes real.`;
}

const LEAD_TOOL = {
  name: "capture_lead",
  description:
    "Trimite datele de contact ale vizitatorului catre echipa NCS (email + Telegram). Apeleaza DOAR dupa ce vizitatorul a fost de acord sa fie contactat si a oferit cel putin email SAU telefon.",
  input_schema: {
    type: "object",
    properties: {
      nume: { type: "string", description: "numele vizitatorului" },
      email: { type: "string", description: "email (daca l-a dat)" },
      telefon: { type: "string", description: "telefon (daca l-a dat)" },
      interes: { type: "string", description: "solutia/serviciul care il intereseaza" },
      rezumat: { type: "string", description: "rezumat scurt al nevoii clientului din conversatie" },
    },
    required: ["interes", "rezumat"],
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
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`anthropic ${r.status}: ${t.slice(0, 300)}`);
  }
  return r.json();
}

async function handleChat(request, env) {
  let data;
  try { data = await request.json(); } catch { return json({ error: "json" }, 400); }

  const lang = data.lang === "en" ? "en" : "ro";
  let messages = Array.isArray(data.messages) ? data.messages : [];

  // sanitizare + limite
  messages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return json({ error: "bad_messages" }, 400);
  }

  const blog = await getBlogList(env);
  const system = systemPrompt(lang, blog);

  let leadCaptured = false;
  let reply = "";

  try {
    for (let step = 0; step < 3; step++) {
      const resp = await anthropic(env, {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        tools: [LEAD_TOOL],
        messages,
      });

      if (resp.stop_reason === "tool_use") {
        const toolResults = [];
        for (const block of resp.content) {
          if (block.type === "tool_use" && block.name === "capture_lead") {
            const res = await runCaptureLead(env, block.input || {}, lang);
            if (res.ok) leadCaptured = true;
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: res.msg });
          }
        }
        messages.push({ role: "assistant", content: resp.content });
        messages.push({ role: "user", content: toolResults });
        continue; // mai cerem un raspuns (confirmarea pentru user)
      }

      reply = (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
      break;
    }
  } catch (e) {
    return json({ error: "ai", detail: String(e).slice(0, 200) }, 502);
  }

  if (!reply) {
    reply = lang === "en"
      ? "Sorry, could you rephrase that?"
      : "Scuze, puteți reformula?";
  }
  return json({ reply, leadCaptured });
}

async function runCaptureLead(env, input, lang) {
  const email = (input.email || "").trim();
  const telefon = (input.telefon || "").trim();
  if (!email && !telefon) {
    return { ok: false, msg: "Lipseste email SAU telefon - cere vizitatorului cel putin unul inainte de a trimite." };
  }
  const lead = {
    nume: (input.nume || "").trim() || "(nespecificat)",
    email: email || "(nespecificat)",
    telefon: telefon || "(nespecificat)",
    interes: (input.interes || "").trim(),
    rezumat: (input.rezumat || "").trim(),
    lang,
  };
  const [tg, mail] = await Promise.allSettled([sendTelegram(env, lead), sendEmail(env, lead)]);
  const okAny = tg.status === "fulfilled" || mail.status === "fulfilled";
  return {
    ok: okAny,
    msg: okAny ? "Trimis catre echipa NCS (email + Telegram)." : "Trimiterea a esuat - cere scuze si sugereaza suport@netcomm.ro / 0740 196 718.",
  };
}

// ---------------------- LEAD (form manual) ----------------------
async function handleLead(request, env) {
  let data;
  try { data = await request.json(); } catch { return json({ error: "json" }, 400); }

  const email = String(data.email || "").trim();
  const telefon = String(data.telefon || data.phone || "").trim();
  if (!email && !telefon) return json({ error: "contact" }, 400);
  if (String(data.website || "").length > 0) return json({ ok: true }); // honeypot

  const lead = {
    nume: String(data.nume || data.name || "").trim().slice(0, 120) || "(nespecificat)",
    email: email.slice(0, 160) || "(nespecificat)",
    telefon: telefon.slice(0, 60) || "(nespecificat)",
    interes: String(data.interes || "").trim().slice(0, 200) || "(din chat)",
    rezumat: String(data.rezumat || data.message || "").trim().slice(0, 1500),
    lang: data.lang === "en" ? "en" : "ro",
  };

  const [tg, mail] = await Promise.allSettled([sendTelegram(env, lead), sendEmail(env, lead)]);
  const ok = tg.status === "fulfilled" || mail.status === "fulfilled";
  return json({ ok }, ok ? 200 : 502);
}

// ---------------------- Trimitere ----------------------
async function sendTelegram(env, lead) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) throw new Error("no telegram");
  const text =
    `🟢 *Lead nou netcomm.ro*\n` +
    `👤 ${esc(lead.nume)}\n` +
    `✉️ ${esc(lead.email)}\n` +
    `📞 ${esc(lead.telefon)}\n` +
    `🎯 Interes: ${esc(lead.interes)}\n` +
    `📝 ${esc(lead.rezumat)}`;
  const r = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: "Markdown" }),
  });
  if (!r.ok) throw new Error("telegram " + r.status);
  return true;
}

function esc(s) {
  return String(s).replace(/([*_`\[\]])/g, "\\$1");
}

async function sendEmail(env, lead) {
  if (!env.WEB3FORMS_KEY) throw new Error("no web3forms");
  const r = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      access_key: env.WEB3FORMS_KEY,
      subject: "Lead nou de pe chatbot netcomm.ro",
      from_name: "Chatbot netcomm.ro",
      Nume: lead.nume,
      Email: lead.email,
      Telefon: lead.telefon,
      Interes: lead.interes,
      Detalii: lead.rezumat,
    }),
  });
  if (!r.ok) throw new Error("web3forms " + r.status);
  return true;
}
