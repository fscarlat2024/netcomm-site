---
title: "Ce este FortiSIEM și de ce contează pentru vizibilitatea în securitate"
description: "Ghid practic despre FortiSIEM: ce face, cum colectează și corelează loguri, ce beneficii aduce companiilor din România și cum se leagă de NIS2."
date: 2026-09-25
category: "Rețea & Fortinet"
tags: ["fortisiem", "fortinet", "siem", "monitorizare", "nis2"]
---
Majoritatea incidentelor de securitate nu încep cu o alarmă spectaculoasă, ci cu o linie de log pe care nimeni nu o citește. Un cont care se autentifică la 3 dimineața dintr-o locație neobișnuită, un firewall care blochează repetat trafic către aceeași adresă externă, un server care începe brusc să scrie fișiere la o rată neobișnuită. Fiecare dintre aceste semnale există undeva în infrastructura dumneavoastră. Problema este că sunt împrăștiate în zeci de sisteme diferite, iar singure nu spun nimic.

FortiSIEM este soluția Fortinet care rezolvă exact această problemă: adună evenimentele din întreaga infrastructură într-un singur loc, le normalizează și le corelează pentru a transforma zgomotul în informație utilizabilă.

## Ce înseamnă, de fapt, SIEM

SIEM vine de la Security Information and Event Management. Este o categorie de soluții care combină două funcții istorice distincte:

- **Managementul informațiilor de securitate** — colectarea, stocarea pe termen lung și analiza retrospectivă a logurilor;
- **Managementul evenimentelor de securitate** — monitorizarea în timp real, corelarea și generarea de alerte.

Un SIEM modern nu este doar un depozit de loguri. Valoarea lui stă în capacitatea de a lega între ele evenimente aparent independente și de a semnala tipare care indică o activitate suspectă.

## Ce aduce specific FortiSIEM

FortiSIEM face parte din ecosistemul Fortinet Security Fabric, ceea ce îi oferă o integrare nativă cu echipamentele FortiGate, FortiSwitch, FortiAP, FortiClient sau FortiMail. Dar platforma nu este limitată la produsele Fortinet — suportă un număr mare de surse terțe: sisteme de operare Windows și Linux, hypervisoare, echipamente de rețea de la alți producători, servicii cloud, baze de date și aplicații.

Câteva elemente care diferențiază platforma:

### Descoperirea automată a activelor

FortiSIEM scanează rețeaua și construiește un inventar al dispozitivelor, aplicațiilor și serviciilor descoperite, împreună cu relațiile dintre ele (CMDB). Acest lucru este important din două motive: nu puteți proteja ce nu știți că aveți, iar contextul despre activ îmbunătățește semnificativ calitatea alertelor.

### Combinarea securității cu monitorizarea performanței

Spre deosebire de multe soluții SIEM pure, FortiSIEM include și funcții de monitorizare a disponibilității și performanței. Puteți urmări utilizarea CPU, spațiul pe disc, latența sau starea serviciilor în aceeași consolă în care urmăriți evenimentele de securitate. Pentru echipe IT mici, care nu își permit două platforme separate, această consolidare este un avantaj real.

### Corelarea în timp real

Motorul de corelare permite definirea de reguli care declanșează alerte doar atunci când se îndeplinește o combinație de condiții. De exemplu: autentificări eșuate repetate urmate de o autentificare reușită și de un acces la o resursă sensibilă. Platforma vine cu un set consistent de reguli predefinite, care pot fi adaptate la specificul organizației.

### Arhitectură scalabilă

FortiSIEM poate fi implementat de la un singur nod virtual, pentru organizații mici, până la o arhitectură distribuită cu colectoare multiple pentru companii cu mai multe locații. Colectoarele adună datele local și le trimit comprimat către nodul central — util atunci când aveți sedii legate prin conexiuni cu lățime de bandă limitată.

## Cum se leagă de conformitate

Directiva NIS2 cere entităților în scop măsuri de gestionare a riscurilor de securitate cibernetică, inclusiv capacități de detectare, tratare și raportare a incidentelor. Articolul 21 menționează explicit politici de analiză a riscurilor și proceduri de gestionare a incidentelor.

Un SIEM nu vă face automat conformi, dar acoperă câteva cerințe practice greu de îndeplinit altfel:

- **Păstrarea logurilor** pentru perioade definite, într-un loc central și protejat;
- **Detectarea incidentelor**, necesară pentru a putea respecta termenele de notificare;
- **Reconstituirea cronologiei** unui incident, esențială în analiza post-incident;
- **Rapoarte** pentru audituri interne sau externe.

Aceleași capabilități sprijină și alte cadre — ISO 27001, PCI DSS sau cerințe contractuale impuse de clienți mari.

## Ce trebuie să știți înainte de implementare

Un SIEM nu este o soluție „instalează și uită". Câteva aspecte de luat în calcul:

**Volumul de date.** Dimensionarea depinde de numărul de evenimente pe secundă și de perioada de retenție dorită. Subdimensionarea duce la pierderi de date; supradimensionarea, la costuri inutile.

**Reglarea fină.** În primele săptămâni veți primi multe alerte irelevante. Procesul de tuning — ajustarea pragurilor, excluderea comportamentelor normale, prioritizarea regulilor — este obligatoriu. Un SIEM care generează sute de alerte zilnic pe care nimeni nu le citește este mai rău decât inutil, pentru că oferă un fals sentiment de siguranță.

**Cine reacționează.** Alerta are valoare doar dacă cineva o analizează și acționează. Aceasta este, în practică, cea mai mare provocare: monitorizarea continuă cere fie o echipă internă dedicată, fie un serviciu gestionat extern.

**Sursele conectate.** Un SIEM alimentat doar cu logurile firewall-ului vede doar o parte din tablou. Endpointurile, controlerele de domeniu, serverele de mail și serviciile cloud sunt la fel de importante.

## Concluzie

FortiSIEM este un instrument puternic pentru organizațiile care au depășit stadiul în care securitatea se rezumă la un firewall și un antivirus. Oferă vizibilitate unificată, corelare inteligentă și baza tehnică necesară pentru conformitate.

În același timp, valoarea reală se obține din configurare corectă, reglare continuă și, mai ales, din existența unei echipe care interpretează alertele și reacționează la timp. Dacă evaluați o soluție SIEM pentru infrastructura dumneavoastră sau aveți deja una care generează mai mult zgomot decât informație, o discuție cu specialiști care au implementat astfel de platforme în producție vă poate scuti de luni de încercări costisitoare.
