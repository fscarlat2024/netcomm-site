---
title: "De ce aveți nevoie de un firewall Fortinet segmentat, nu doar de un router"
description: "Routerul asigură conectivitate, firewall-ul asigură control. Aflați de ce segmentarea rețelei cu un FortiGate reduce riscul de ransomware și susține conformitatea NIS2."
date: 2026-09-25
category: "Rețea & Fortinet"
tags: ["fortinet", "firewall", "segmentare", "vlan", "securitate retea"]
---
Multe companii din România funcționează astăzi cu o rețea „plată”: un router primit de la furnizorul de internet, un switch sau două și toate echipamentele — calculatoare, servere, imprimante, camere de supraveghere, telefoane IP, dispozitive personale ale angajaților — conectate în același spațiu de adrese. Funcționează. Până în ziua în care nu mai funcționează.

Diferența dintre un router și un firewall next-generation nu este una de marcă sau de buget. Este o diferență de filozofie: routerul are rolul de a livra pachete cât mai repede, firewall-ul are rolul de a decide care pachete merită livrate. Iar segmentarea este mecanismul prin care această decizie devine cu adevărat eficientă.

## Ce face, de fapt, routerul de la furnizor

Un router obișnuit realizează trei lucruri: rutează traficul către internet, aplică NAT și, eventual, filtrează câteva porturi. Multe dintre ele oferă și un „firewall” de bază, care în practică înseamnă o listă de reguli pe adrese IP și porturi.

Problema este că atacurile moderne nu mai arată ca în urmă cu zece ani. Traficul malițios vine criptat prin HTTPS, pe portul 443 — exact același port pe care îl folosește toată lumea pentru muncă. Un link de phishing deschis de un angajat, o macrocomandă într-un document, un dispozitiv IoT cu firmware neactualizat: niciunul dintre aceste vectori nu este oprit de o regulă pe porturi.

Mai grav, routerul nu vede absolut nimic din traficul intern. Odată ce un atacator a compromis o stație de lucru din contabilitate, el se poate mișca liber către serverul de fișiere, către NAS-ul de backup, către controlerul de domeniu. Se numește *lateral movement* și este pasul care transformă un incident minor într-o criză de business.

## Segmentarea: de la o rețea la mai multe zone controlate

Segmentarea înseamnă împărțirea rețelei în zone logice, separate prin VLAN-uri, fiecare cu propriul set de reguli de acces. Un firewall Fortinet (FortiGate) devine punctul prin care trece traficul între aceste zone, aplicând politici explicite.

O structură tipică pentru un IMM arată astfel:

- **Zona utilizatori** — stațiile de lucru ale angajaților;
- **Zona servere** — aplicații de business, ERP, fișiere, Active Directory;
- **Zona backup** — infrastructura de copii de siguranță, izolată strict;
- **Zona OT / IoT** — camere video, control acces, senzori, echipamente de producție;
- **Zona guest** — Wi-Fi pentru vizitatori, cu acces exclusiv la internet;
- **Zona VPN** — accesul de la distanță al angajaților și al furnizorilor.

Regula de bază este simplă: implicit se blochează totul, iar apoi se deschid explicit doar fluxurile necesare. Stațiile de lucru au nevoie de acces la serverul de fișiere pe porturile SMB — deci se permite acel flux, nimic mai mult. Camerele video nu au niciun motiv să comunice cu serverul de contabilitate — deci nu comunică.

## Ce câștigați concret

### Limitarea impactului unui incident

Dacă un ransomware ajunge pe o stație de lucru, într-o rețea plată are acces la tot ce este partajat. Într-o rețea segmentată, raza de acțiune este limitată la zona respectivă. Backup-urile rămân intacte — iar backup-ul intact este diferența dintre o zi de recuperare și o săptămână de negociere cu atacatorii.

### Inspecție reală a traficului

Un FortiGate poate aplica inspecție SSL, filtrare web, control de aplicații, IPS și antivirus la nivel de gateway. Practic, poate vedea *ce* se întâmplă în trafic, nu doar *către unde* merge. Feed-urile de amenințări actualizate permit blocarea domeniilor de command-and-control înainte ca un malware să primească instrucțiuni.

### Vizibilitate și dovezi

Logurile detaliate — cine, când, către ce resursă — sunt esențiale atât pentru investigarea unui incident, cât și pentru audit. Un router nu vă poate spune ce a accesat un utilizator acum trei săptămâni. Un firewall corect configurat, cu retenție de loguri, da.

### Acces de la distanță controlat

VPN-ul cu autentificare multi-factor și acces limitat pe zone înlocuiește practica riscantă a porturilor RDP expuse direct în internet — una dintre cele mai frecvente căi de compromitere.

## Legătura cu NIS2

Pentru organizațiile care intră sub incidența Directivei NIS2, Articolul 21 cere măsuri tehnice proporționale cu riscul: politici de securitate a rețelelor, controlul accesului, gestionarea incidentelor, continuitatea activității. Segmentarea nu este doar o bună practică tehnică — este un argument concret în fața unui auditor că accesul este controlat și că riscul este limitat prin design.

Chiar dacă organizația dumneavoastră nu este direct vizată, foarte probabil sunteți furnizor pentru cineva care este. Cerințele se propagă pe lanțul de aprovizionare.

## De unde începeți

Nu este nevoie de o reconstrucție peste noapte. Un parcurs realist arată astfel:

1. **Inventar** — ce dispozitive există în rețea și ce comunică cu ce;
2. **Design de zone** — gruparea logică pe funcții și nivel de risc;
3. **Implementare graduală** — începeți cu zonele cu risc ridicat: guest, IoT, backup;
4. **Politici restrictive** — deny by default, apoi permisiuni explicite;
5. **Monitorizare** — loguri centralizate, alerte, revizuire periodică a regulilor.

Pasul cel mai des ratat este ultimul. O regulă temporară „doar pentru test” are tendința să rămână activă ani de zile și să devină exact breșa prin care intră cineva.

## Concluzie

Un router vă conectează la internet. Un firewall segmentat vă permite să decideți ce se întâmplă în interiorul rețelei dumneavoastră — și să limitați pagubele atunci când ceva merge prost, pentru că mai devreme sau mai târziu ceva va merge prost.

Proiectarea corectă a zonelor, configurarea politicilor și întreținerea lor în timp cer însă experiență și disciplină operațională. Dacă vă întrebați cum arată rețeaua dumneavoastră în acest moment și ce ar însemna o segmentare aplicată realist pe infrastructura existentă, o evaluare tehnică inițială este cel mai bun punct de plecare.
