---
title: "De ce merită autentificarea cu server RADIUS în rețeaua companiei"
description: "Ce este un server RADIUS, cum funcționează 802.1X și de ce autentificarea centralizată crește securitatea rețelei și Wi-Fi-ului din companie."
date: 2026-09-29
category: "Rețea & Fortinet"
tags: ["radius", "802.1x", "wifi", "nac", "autentificare"]
---
În multe companii, accesul la rețeaua Wi-Fi sau la echipamentele de rețea se face încă printr-o singură parolă comună, cunoscută de toată lumea: angajați, colaboratori, foști angajați, vizitatori. Este soluția cea mai simplă de implementat și, în același timp, una dintre cele mai fragile din punct de vedere al securității. Autentificarea cu un server RADIUS rezolvă exact această problemă, mutând controlul accesului de la "o parolă pe echipament" la "o identitate per utilizator".

## Ce este, de fapt, un server RADIUS

RADIUS (Remote Authentication Dial-In User Service) este un protocol standardizat prin care echipamentele de rețea — access point-uri, switch-uri, firewall-uri, concentratoare VPN — delegă unui server central deciziile legate de acces. Serverul RADIUS răspunde la trei întrebări fundamentale, cunoscute sub numele de AAA:

- **Authentication** — cine este utilizatorul care încearcă să se conecteze?
- **Authorization** — la ce are dreptul de acces, în ce VLAN sau cu ce politici?
- **Accounting** — când s-a conectat, cât timp a stat, de pe ce dispozitiv?

În practică, serverul RADIUS nu deține el însuși parolele utilizatorilor. De cele mai multe ori este integrat cu Active Directory sau cu un alt director de identități, astfel încât fiecare angajat folosește exact aceleași credențiale ca pentru calculatorul de serviciu.

## Cum se leagă RADIUS de 802.1X

Standardul IEEE 802.1X este mecanismul prin care un switch sau un access point blochează portul, respectiv conexiunea wireless, până când utilizatorul sau dispozitivul își dovedește identitatea. Dialogul are trei participanți:

1. **Supplicant** — clientul (laptopul, telefonul, imprimanta).
2. **Authenticator** — switch-ul sau access point-ul care ține poarta închisă.
3. **Authentication server** — serverul RADIUS care validează credențialele.

Abia după ce RADIUS confirmă identitatea, echipamentul de rețea deschide accesul și poate aplica politici suplimentare: plasare automată într-un VLAN, aplicarea unui ACL, limitare de bandă. Pentru Wi-Fi, această configurație se numește WPA2-Enterprise sau WPA3-Enterprise, spre deosebire de varianta Personal, bazată pe o parolă comună.

## Beneficiile concrete pentru o companie

### Credențiale individuale, nu o parolă comună

Cel mai important câștig este trasabilitatea. Fiecare conexiune este legată de un cont de utilizator, nu de o parolă anonimă. Când un angajat pleacă din companie, dezactivarea contului din Active Directory îi taie automat accesul la Wi-Fi, la VPN și la echipamentele de rețea. Nu mai este nevoie să schimbați parola Wi-Fi și să o redistribuiți la toți ceilalți colegi — o operațiune care, în realitate, se amână la nesfârșit.

### Segmentare automată a rețelei

Serverul RADIUS poate returna atribute care spun switch-ului sau access point-ului în ce VLAN să plaseze clientul. Astfel, în aceeași infrastructură fizică puteți separa curat:

- rețeaua angajaților;
- rețeaua de guest, izolată de resursele interne;
- dispozitivele IoT, camerele video și imprimantele;
- stațiile din zonele sensibile, cu politici mai stricte.

Segmentarea reduce semnificativ suprafața de atac: un dispozitiv compromis din rețeaua de vizitatori nu ajunge la serverul de fișiere sau la ERP.

### Autentificare pe bază de certificat

Metodele moderne, precum EAP-TLS, elimină complet parola din ecuație. Dispozitivul se autentifică cu un certificat emis de o autoritate de certificare internă. Este cea mai robustă variantă împotriva phishing-ului și a atacurilor de tip credential stuffing, pentru că nu există un secret pe care utilizatorul să îl poată divulga din greșeală.

### Punct unic de administrare

Politicile de acces se scriu o singură dată, pe server, și se aplică în toate locațiile și pe toate echipamentele. Pentru companiile cu mai multe sedii sau cu echipamente de la producători diferiți, RADIUS este numitorul comun: fiind un protocol standardizat, este suportat practic de orice echipament profesional de rețea, inclusiv de firewall-urile și access point-urile Fortinet.

### Log-uri utile pentru audit și conformitate

Componenta de accounting produce exact tipul de evidențe pe care le cere un audit: cine s-a conectat, de pe ce dispozitiv, la ce oră, cât timp. Pentru organizațiile care intră sub incidența [NIS2](/nis2/), măsurile de control al accesului și de gestionare a identităților sunt parte din cerințele articolului 21, iar o autentificare centralizată, cu evidențe verificabile, este un argument mult mai solid decât o parolă Wi-Fi comună.

## Ce trebuie avut în vedere la implementare

RADIUS nu este o soluție pe care o activați și o uitați. Câteva aspecte merită planificate din start:

- **Redundanță.** Dacă serverul RADIUS cade, autentificările eșuează. Se recomandă minimum două servere și politici clare de fallback pe echipamentele de rețea.
- **Protocolul de transport.** RADIUS clasic folosește UDP și un shared secret. Pentru trafic între locații, luați în calcul RadSec (RADIUS over TLS) sau un tunel dedicat.
- **Dispozitivele care nu suportă 802.1X.** Imprimante, camere, senzori — pentru acestea se folosește MAC Authentication Bypass, cu conștientizarea faptului că adresa MAC poate fi falsificată; de aceea aceste dispozitive merg într-un VLAN restrâns.
- **Inventarul de dispozitive.** Înainte de a activa 802.1X pe switch-uri, trebuie știut exact ce este conectat în rețea, altfel riscați întreruperi în producție.
- **Etapizarea.** Cel mai sigur este să începeți cu Wi-Fi-ul corporate, apoi VPN-ul, apoi porturile de acces cablate, cu o perioadă de monitorizare în modul permisiv.

## Concluzie

Autentificarea cu server RADIUS transformă rețeaua dintr-un spațiu deschis oricui cunoaște o parolă într-o infrastructură în care fiecare acces este identificat, autorizat și înregistrat. Este o măsură matură de securitate, compatibilă cu echipamentele pe care probabil le aveți deja, și o bază solidă pentru segmentare, Zero Trust și conformitate.

Proiectarea și integrarea unui astfel de sistem cere însă atenție la detalii: integrarea cu Active Directory, gestiunea certificatelor, politicile pe VLAN-uri și tratarea dispozitivelor legacy. Dacă vă gândiți să treceți de la o parolă Wi-Fi comună la autentificare per utilizator, o evaluare a infrastructurii actuale și un plan de migrare etapizat, realizate împreună cu o echipă cu experiență în rețelistică și securitate, vă scutesc de întreruperi și de surprize neplăcute în producție.
