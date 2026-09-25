---
title: "Ce este autentificarea multi-factor (MFA) și de ce blochează majoritatea atacurilor"
description: "Ghid practic despre MFA: cum funcționează, ce tipuri există, ce atacuri blochează și cum îl implementați corect în compania dumneavoastră."
date: 2026-09-25
category: "Cybersecurity"
tags: ["mfa", "autentificare", "phishing", "microsoft 365", "identitate"]
---
Parola a fost, timp de decenii, singura barieră dintre datele companiei dumneavoastră și internet. Astăzi, acea barieră este cea mai fragilă componentă a securității: parolele sunt refolosite între conturi, ajung în baze de date scurse public, sunt ghicite prin atacuri automate sau pur și simplu sunt oferite atacatorului de către un angajat care a dat click pe un email de phishing bine construit. Autentificarea multi-factor (MFA) rezolvă exact această problemă, adăugând un al doilea element de verificare care nu poate fi furat la fel de ușor ca un șir de caractere.

## Ce înseamnă, concret, autentificarea multi-factor

MFA este un mecanism prin care, pentru a vă autentifica, trebuie să dovediți identitatea folosind cel puțin două elemente din categorii diferite:

- **Ceva ce știți** — parola sau un cod PIN.
- **Ceva ce aveți** — telefonul cu o aplicație de autentificare, o cheie hardware de securitate, un token.
- **Ceva ce sunteți** — amprenta, recunoașterea facială sau alt element biometric.

Esențială este combinația din **categorii diferite**. O parolă plus o întrebare de securitate nu reprezintă MFA, pentru că ambele fac parte din aceeași categorie („ceva ce știți”) și ambele pot fi aflate prin aceleași metode.

Logica de bază este simplă: un atacator aflat la distanță poate obține parola dumneavoastră fără să atingă vreodată echipamentul fizic. Dar pentru a trece de al doilea factor, ar trebui să aibă acces și la telefonul sau cheia dumneavoastră de securitate — ceea ce schimbă radical economia atacului.

## De ce blochează MFA majoritatea atacurilor asupra conturilor

Marea majoritate a incidentelor de securitate asupra conturilor din mediul de business nu implică exploatarea unei vulnerabilități tehnice complexe. Implică o autentificare validă, cu credențiale corecte, obținute prin metode banale:

### Phishing și pagini false de login

Angajatul primește un email care imită o notificare Microsoft 365, deschide o pagină identică vizual cu cea reală și își introduce credențialele. Fără MFA, atacatorul se conectează imediat. Cu MFA activ, credențialele singure nu îi sunt suficiente.

### Credential stuffing

Atacatorii folosesc liste uriașe de perechi email–parolă rezultate din breșe publice și le testează automat pe zeci de servicii. Dacă un angajat a refolosit parola de la un cont personal compromis, contul de business devine accesibil. MFA oprește acest tip de atac aproape complet, pentru că parolele scurse nu includ și al doilea factor.

### Atacuri prin forță brută și password spraying

Încercările automate de a ghici parole slabe („Parola2024!”, „Firma123”) sunt extrem de frecvente pe serviciile expuse public. Al doilea factor face ca succesul ghicirii să fie irelevant.

### Preluarea conturilor pentru fraudă financiară

Un cont de email compromis este punctul de plecare pentru atacurile de tip Business Email Compromise: atacatorul monitorizează corespondența, apoi intervine într-o discuție despre o factură și modifică IBAN-ul. MFA reduce semnificativ probabilitatea ca acel cont să fie compromis în primul rând.

## Nu toate metodele MFA sunt egale

Este important să înțelegeți că MFA nu este o soluție monolitică. Metodele diferă semnificativ ca rezistență:

- **Cod prin SMS** — mai bun decât nimic, dar vulnerabil la SIM swapping și la interceptare. Recomandat doar ca soluție temporară sau de rezervă.
- **Aplicație de autentificare (TOTP)** — coduri generate la 30 de secunde în Microsoft Authenticator, Google Authenticator sau similar. Un nivel solid pentru majoritatea organizațiilor.
- **Notificare push cu number matching** — utilizatorul trebuie să introducă în aplicație un număr afișat pe ecranul de login. Elimină aprobarea reflexă a notificărilor și atacurile de tip „MFA fatigue”, în care atacatorul trimite zeci de cereri până când cineva apasă „Approve”.
- **Chei hardware FIDO2 / passkeys** — cel mai rezistent nivel, pentru că autentificarea este legată criptografic de domeniul real. O pagină de phishing nu poate obține nimic util. Recomandate pentru administratori, conducere și conturi cu acces la date sensibile.

## Unde trebuie activat MFA în primul rând

Dacă porniți de la zero, prioritizați în această ordine:

1. **Conturile de administrator global** — Microsoft 365, Google Workspace, consola de antivirus, firewall, panoul de hosting. Un administrator compromis înseamnă compromiterea întregii organizații.
2. **Accesul VPN și accesul de la distanță** — orice punct de intrare din exterior în rețeaua internă.
3. **Emailul tuturor angajaților** — este vectorul principal de atac și cel mai frecvent punct de plecare al fraudelor.
4. **Aplicațiile cu date critice** — ERP, CRM, sisteme financiare, platforme de HR.
5. **Conturile de serviciu și cele partajate** — adesea uitate, adesea cu parole vechi și fără proprietar clar.

## Greșeli frecvente în implementare

MFA activat parțial oferă o falsă senzație de siguranță. Atenție la:

- **Excepțiile permanente.** „Îl scutim pe directorul comercial pentru că se plânge” anulează protecția exact acolo unde contează cel mai mult.
- **Protocoalele de autentificare vechi.** Dacă în tenant rămân active metode legacy care ocolesc MFA, atacatorul le va găsi.
- **Lipsa metodelor de rezervă.** Un telefon pierdut nu trebuie să blocheze un angajat o zi întreagă. Definiți din start o procedură clară de recuperare — și verificați identitatea persoanei înainte de resetare, pentru că și acest proces poate fi exploatat prin inginerie socială.
- **Absența instruirii.** Angajații trebuie să știe că o notificare MFA neașteptată înseamnă că cineva le cunoaște parola și că trebuie raportată imediat.

## MFA și conformitatea NIS2

Pentru entitățile aflate sub incidența Directivei NIS2, autentificarea multi-factor nu mai este o bună practică opțională. Articolul 21 include, între măsurile de gestionare a riscurilor, utilizarea soluțiilor de autentificare multi-factor sau de autentificare continuă, alături de politici de control al accesului și de igienă cibernetică de bază. Dacă organizația dumneavoastră intră în domeniul de aplicare, absența MFA va fi vizibilă la orice evaluare.

## Un raport cost-beneficiu greu de egalat

Puține măsuri de securitate oferă un raport atât de bun între efortul de implementare și riscul eliminat. MFA este disponibil nativ în Microsoft 365 și în majoritatea platformelor de business, nu presupune investiții hardware pentru configurația de bază și poate fi implementat etapizat, fără a bloca activitatea.

Provocarea reală nu este tehnologia, ci acoperirea completă și coerentă: identificarea tuturor punctelor de acces, alegerea metodei potrivite pentru fiecare categorie de utilizatori, eliminarea căilor de ocolire și gestionarea situațiilor de excepție fără a slăbi protecția. Dacă nu aveți certitudinea că MFA este activ peste tot unde ar trebui să fie, o evaluare a configurației de identitate, urmată de un plan de implementare adaptat modului dumneavoastră de lucru, este cel mai rapid mod de a închide una dintre cele mai mari breșe din securitatea unei companii.
