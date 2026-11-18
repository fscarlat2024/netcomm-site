---
title: "Infrastructură NIS2 completă: de la firewall la triajul AI al incidentelor"
description: "Cum arată o infrastructură NIS2 reală — segmentare Fortinet, SIEM pe Linux, honeypot pentru detecție timpurie și triaj AI care transformă alertele în tichete interpretate. Mapare pe Articolul 21."
date: 2026-11-18
category: "Conformitate NIS2"
tags: ["nis2", "fortinet", "siem", "wazuh", "honeypot", "securitate"]
---
Majoritatea firmelor care intră sub incidența NIS2 au deja un firewall și un antivirus. Problema este că directiva nu cere doar să te aperi — cere să **detectezi**, să **tratezi** și să **raportezi** incidentele, în termene stricte. Iar aici se oprește cea mai mare parte a infrastructurilor: alertele există undeva, dar nimeni nu le vede, nimeni nu le interpretează și nimeni nu știe care dintre ele chiar contează.

O infrastructură NIS2 serioasă nu este un singur produs. Este un lanț de straturi care lucrează împreună: perimetrul care segmentează și blochează, platforma care vede și corelează tot, capcana care prinde atacatorul devreme și, la final, stratul care transformă zgomotul în decizii. Mai jos descriem exact această arhitectură, așa cum o implementăm în producție, și cum se mapează fiecare componentă pe cerințele Articolului 21.

## Stratul 1 — Perimetru și segmentare: Fortinet Security Fabric

Baza rămâne rețeaua. Un **FortiGate** ca firewall next-gen, **FortiSwitch**-uri gestionate și puncte de acces **FortiAP** nu înseamnă doar „internet filtrat". Înseamnă o rețea **segmentată**: contabilitatea nu vede serverele, dispozitivele invitaților nu ating rețeaua internă, iar o stație compromisă nu se poate mișca lateral către tot ce e important.

Pentru că toate rulează în același Security Fabric, echipamentele își împart informația între ele: un semnal detectat pe un endpoint poate declanșa o acțiune pe firewall. Această segmentare și control al accesului acoperă direct cerințele de **securitate a rețelelor** din NIS2 Art. 21(2)(d) și (e).

## Stratul 2 — Vizibilitate și detecție: SIEM pe Linux (Wazuh)

Un firewall vede traficul care trece prin el. Nu vede ce se întâmplă *în interiorul* serverelor și stațiilor. Pentru asta e nevoie de un **SIEM** — o platformă care colectează logurile din întreaga infrastructură, le normalizează și le corelează.

Rulăm un SIEM open-source matur (**Wazuh**) pe un server Linux dedicat, cu stocare proprie pentru retenția logurilor. Agenți instalați pe stații și servere trimit continuu evenimente: autentificări, modificări de fișiere critice, procese suspecte, schimbări de configurație. SIEM-ul leagă între ele evenimente aparent independente și semnalează tiparele care indică un atac.

Acesta este fundamentul pentru **logging, detecție și analiză post-incident** — exact capabilitățile cerute de Art. 21(2)(f) și (g), fără de care nu poți respecta termenele de notificare.

## Stratul 3 — Detecție timpurie a breșelor: honeypot

Problema oricărui SIEM este zgomotul. Mii de evenimente legitime pe zi, din care trebuie extrase cele câteva care contează. Un **honeypot** rezolvă elegant o parte din această problemă.

Instalăm momeli (**OpenCanary**) în rețea — servicii false care arată ca ținte reale: un server de fișiere, o bază de date, un panou de administrare. Niciun utilizator legitim nu are motiv să le atingă vreodată. De aceea, **orice** interacțiune cu o astfel de momeală este un semnal de mare încredere: cineva explorează rețeaua. Nu e o alertă printre mii — e dovada aproape sigură a unei breșe în desfășurare, adesea cu mult înainte ca atacatorul să ajungă la ceva real.

Detecția timpurie a incidentelor este inima Art. 21(2)(g) și condiția practică pentru a respecta termenul de notificare de 72 de ore.

## Stratul 4 — Triajul AI al alertelor: diferențiatorul

Aici se termină infrastructura tradițională și începe partea pe care puține firme din România o au. O alertă brută dintr-un SIEM este criptică: coduri, IP-uri, nume de reguli. Cineva trebuie să o citească, să înțeleagă dacă e reală, cât de gravă e și ce trebuie făcut. Noaptea, în weekend, în concediu — acolo cad majoritatea echipelor.

Am construit un **strat de triaj cu inteligență artificială** peste SIEM. Fiecare alertă semnificativă este trecută mai întâi printr-un **model lingvistic local** (Ollama, rulat pe infrastructură proprie, astfel încât logurile sensibile nu părăsesc mediul controlat) și, pentru interpretare aprofundată, prin **Claude**. Rezultatul nu mai este o linie de log, ci un **tichet lizibil**:

- ce s-a întâmplat, explicat în limbaj clar;
- severitatea estimată și dacă necesită acțiune imediată;
- pașii de remediere recomandați.

Tichetul ajunge automat în **aplicația NCS de ticketing**, unde echipa îl preia, îl urmărește și îl închide. Alerta nu se mai pierde într-un dashboard pe care nu-l citește nimeni — devine o sarcină cu context, prioritate și istoric. Această capacitate de **tratare a incidentelor** este cerută explicit de Art. 21(2)(b).

## Cum se leagă totul de NIS2

Pe scurt, maparea pe [NIS2](/nis2/) Articolul 21 arată așa:

- **Segmentare și control acces (Fortinet)** → securitatea rețelelor, 21(2)(d, e);
- **SIEM pe Linux (Wazuh)** → logging, detecție, analiză post-incident, 21(2)(f, g);
- **Honeypot (OpenCanary)** → detecție timpurie a breșelor, 21(2)(g);
- **Triaj AI → tichet** → tratarea și gestionarea incidentelor, 21(2)(b).

Niciuna dintre aceste piese nu te face singură conformă. Împreună, însă, acoperă exact lanțul pe care directiva îl cere: **să vezi, să înțelegi, să reacționezi și să poți dovedi** că ai făcut-o.

## Ce trebuie să știți înainte

O astfel de infrastructură nu este „instalează și uită". Trei lucruri contează mai mult decât produsele:

**Cineva trebuie să reacționeze.** Chiar și cu triaj AI, un tichet are valoare doar dacă există o echipă care îl preia. Monitorizarea continuă cere fie personal intern dedicat, fie un serviciu gestionat extern.

**Reglarea fină ia timp.** În primele săptămâni, orice SIEM generează alerte irelevante. Stratul AI reduce mult acest zgomot, dar tuningul rămâne un proces, nu un moment.

**Confidențialitatea datelor contează.** De aceea folosim un model local pentru prima filtrare a logurilor sensibile — datele brute rămân în mediul controlat, iar în exterior pleacă doar ce e necesar pentru interpretare.

## Concluzie

NIS2 nu cere cel mai scump echipament, ci o **capacitate reală**: să detectezi un incident, să-l înțelegi și să reacționezi la timp. Arhitectura descrisă aici — perimetru Fortinet, SIEM pe Linux, honeypot pentru detecție timpurie și triaj AI care transformă alertele în tichete — este modul în care facem această capacitate accesibilă și companiilor care nu își permit un centru de operațiuni de securitate propriu.

Dacă vă pregătiți pentru NIS2 sau vreți să știți cât de departe sunteți, începeți cu [checker-ul nostru gratuit de conformitate](/nis2/) sau programați o discuție cu echipa NCS. Prima consultație este gratuită.
