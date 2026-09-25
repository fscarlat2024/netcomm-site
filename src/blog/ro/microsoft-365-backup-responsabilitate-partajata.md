---
title: "Microsoft 365 fără backup: greșeala care poate costa toate datele"
description: "De ce Microsoft nu vă face backup la datele din Microsoft 365, ce riscuri apar și cum construiți o strategie corectă de protecție a e-mailului și fișierelor."
date: 2026-09-25
category: "Backup & Continuitate"
tags: ["microsoft 365", "backup", "responsabilitate partajata", "retentie", "continuitate"]
---
Microsoft 365 a devenit coloana vertebrală a activității pentru majoritatea companiilor din România: e-mail, documente, colaborare în Teams, procese interne în SharePoint. Tocmai pentru că funcționează bine și rareori „cade", se instalează o presupunere periculoasă — că datele sunt automat protejate și recuperabile în orice situație. În realitate, Microsoft garantează disponibilitatea serviciului, nu integritatea conținutului dumneavoastră.

Diferența dintre aceste două lucruri devine dureros de clară abia în ziua în care un utilizator șterge din greșeală o bibliotecă SharePoint, un cont compromis golește căsuțe de e-mail sau un angajat pleacă din companie și licența îi este dezactivată. Atunci se pune întrebarea: de unde recuperăm?

## Modelul responsabilității partajate

Microsoft operează pe un model de responsabilitate partajată, documentat public. Simplificat, împărțirea arată astfel:

**Microsoft răspunde de:**
- infrastructura fizică a centrelor de date;
- disponibilitatea și redundanța platformei;
- securitatea la nivel de serviciu și actualizările software;
- replicarea datelor între centre de date, pentru a rezista unei defecțiuni hardware.

**Dumneavoastră răspundeți de:**
- datele propriu-zise și cine are acces la ele;
- configurarea corectă a politicilor de securitate și retenție;
- gestionarea identităților și a permisiunilor;
- recuperarea datelor pierdute din cauze care nu țin de platformă.

Replicarea nu este backup. Dacă un fișier este șters sau criptat de un atacator, versiunea replicată în alt centru de date este, la rândul ei, ștearsă sau criptată. Replicarea protejează împotriva defectării hardware-ului, nu împotriva greșelilor umane sau a acțiunilor rău intenționate.

## Ce nu acoperă mecanismele native

Microsoft 365 include instrumente utile — coșul de reciclare, Recoverable Items, versionarea în SharePoint și OneDrive, politicile de retenție din Purview. Sunt valoroase, dar au limite pe care trebuie să le cunoașteți înainte de un incident, nu după.

### Retenție limitată în timp

Elementele șterse rămân disponibile o perioadă determinată, după care sunt eliminate definitiv. Multe pierderi de date nu sunt observate imediat: un director de proiect arhivat greșit poate fi descoperit lipsă după luni de zile, când fereastra de recuperare s-a închis deja.

### Ștergerea unei cutii poștale la dezactivarea licenței

Când o licență este eliminată, cutia poștală asociată intră într-un interval limitat de păstrare, apoi dispare. Pentru companiile care trebuie să păstreze corespondența foștilor angajați din motive legale sau contractuale, acest comportament implicit este o problemă reală.

### Recuperare granulară dificilă

Instrumentele native nu sunt gândite pentru restaurări de volum: recuperarea a mii de e-mailuri într-o structură de foldere identică, revenirea unui site SharePoint la starea de acum trei săptămâni sau restaurarea selectivă a conversațiilor și fișierelor dintr-un canal Teams sunt operațiuni laborioase, uneori imposibile.

### Retenția nu este imuabilă prin sine

Un administrator cu privilegii compromise poate modifica politici, dezactiva protecții și șterge conținut. Fără o copie independentă, aflată în afara controlului tenantului, nu aveți la ce reveni.

## Scenariile care produc cel mai des pierderi

- **Ștergere accidentală.** Cea mai banală și cea mai frecventă cauză. Un utilizator mută sau șterge conținut fără să realizeze consecințele.
- **Ransomware sincronizat.** Fișierele criptate local prin OneDrive sau clientul de sincronizare SharePoint se propagă în cloud ca modificări legitime.
- **Compromiterea unui cont.** Atacatorii care obțin acces creează reguli de redirecționare, șterg dovezi și golesc foldere pentru a-și acoperi urmele.
- **Plecarea unui angajat.** Fie prin acțiune deliberată, fie prin dezactivarea licenței, datele asociate contului pot dispărea.
- **Erori de migrare sau configurare.** Modificări de politici aplicate la scară largă pot elimina conținut în masă.
- **Cerințe de audit.** Nu este pierdere de date, dar necesitatea de a prezenta corespondență veche de ani de zile pune aceleași probleme.

## Cum arată o strategie corectă

Principiul 3-2-1 rămâne valabil și pentru cloud: trei copii ale datelor, pe două tipuri diferite de suport, dintre care una în altă locație. Aplicat la Microsoft 365, înseamnă că datele din tenant au nevoie de cel puțin o copie independentă, stocată separat.

În practică, o soluție matură ar trebui să acopere:

1. **Acoperire completă a serviciilor** — Exchange Online, OneDrive, SharePoint Online și Teams, inclusiv metadate, permisiuni și structura folderelor.
2. **Backup automat, la interval scurt** — de mai multe ori pe zi, fără intervenție manuală.
3. **Retenție configurabilă pe termen lung** — aliniată cu obligațiile legale și contractuale ale companiei.
4. **Imuabilitate** — copii care nu pot fi șterse sau modificate în perioada de retenție, nici de un administrator compromis.
5. **Restaurare granulară** — de la un singur e-mail până la un site întreg, cu posibilitatea restaurării în locația originală sau într-o locație alternativă.
6. **Monitorizare și raportare** — alerte pentru joburi eșuate și evidență clară a stării backupurilor.
7. **Testare periodică** — un backup netestat este doar o presupunere. Restaurările de verificare trebuie programate, nu improvizate.

## Dimensiunea de conformitate

Pentru organizațiile care intră sub incidența NIS2, articolul 21 cere măsuri privind continuitatea activității, inclusiv gestionarea copiilor de rezervă și recuperarea în caz de dezastru. Un tenant Microsoft 365 fără backup independent este greu de justificat într-un audit. Aceeași logică se aplică și pentru cerințele GDPR privind disponibilitatea și integritatea datelor cu caracter personal.

Dincolo de conformitate, argumentul de business este simplu: costul unei soluții de backup pentru Microsoft 365 este marginal comparativ cu costul reconstruirii — sau al imposibilității de a reconstrui — corespondența, contractele și documentația de proiect a unei companii.

## Primul pas: o evaluare onestă

Înainte de a alege o soluție, răspundeți la câteva întrebări: Cât timp puteți funcționa fără acces la e-mail? Ce volum de muncă sunteți dispuși să pierdeți, exprimat în ore? Cine testează recuperarea și cât de des? Aveți o listă cu datele critice și unde se află fiecare?

Dacă răspunsurile sunt vagi, riscul există deja — doar că nu a fost încă declanșat de un incident. Evaluarea configurației actuale, definirea obiectivelor de recuperare și implementarea unei soluții de backup dedicate pentru Microsoft 365 sunt pași pe care este mult mai ieftin să îi faceți în avans. O echipă care cunoaște atât platforma, cât și cerințele de conformitate aplicabile în România vă poate ajuta să treceți de la presupuneri la certitudini verificabile.
