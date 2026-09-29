---
title: "Ce tip de parolă trebuie să pun la Wi-Fi?"
description: "Ghid practic pentru companii: ce lungime și tip de parolă Wi-Fi alegeți, ce criptare folosiți (WPA2/WPA3), cum separați rețeaua de invitați și când treceți la 802.1X."
date: 2026-09-29
category: "Rețea & Fortinet"
tags: ["wifi", "parole", "wpa3", "securitate retea", "acces invitati"]
---
Este una dintre cele mai frecvente întrebări pe care le primim de la administratorii IT și de la managerii de firme mici: „ce parolă pun la Wi-Fi ca să fie sigură?”. Răspunsul scurt este că parola contează, dar nu este singurul element care ține rețeaua dumneavoastră în siguranță. Tipul de criptare, modul în care este segmentată rețeaua și cine cunoaște parola sunt la fel de importante. Mai jos găsiți recomandările noastre practice, aplicabile atât la un birou cu cinci angajați, cât și la o rețea cu mai multe puncte de acces.

## Lungimea contează mai mult decât complexitatea

Parolele Wi-Fi funcționează diferit față de parolele de cont. Într-o rețea WPA2/WPA3-Personal, cheia nu poate fi „încercată” la nesfârșit direct pe punctul de acces: un atacator captează un handshake și apoi îl sparge offline, pe propriul echipament, cu viteză mare. Asta înseamnă că singura apărare reală este ca parola să fie prea lungă pentru a fi ghicită prin forță brută sau prin dicționar.

Recomandările noastre:

- **Minimum 16 caractere** pentru rețeaua internă a companiei. Standardul WPA2 permite până la 63 de caractere — folosiți-le.
- **Preferați o frază de acces**, nu un șir criptic. Patru–cinci cuvinte fără legătură între ele, separate prin cratime sau cifre, oferă o rezistență foarte bună și sunt mult mai ușor de comunicat unui coleg: `masa-verde-7-cafea-biblioteca`.
- **Evitați cuvintele previzibile**: numele firmei, adresa sediului, anul înființării, numele produsului, „welcome”, „parola123”. Dicționarele folosite în atacurile offline includ deja combinații de acest tip, inclusiv variantele cu litere înlocuite prin cifre.
- **Nu reutilizați** parola Wi-Fi în niciun alt loc și nu o derivați din alte parole folosite în companie.

Un detaliu practic: dacă rețeaua este folosită de echipamente care se conectează prin scanare de cod QR sau prin introducere manuală pe ecrane mici (imprimante, scannere, terminale POS), alegeți o frază fără caractere ambigue (l, I, 1, O, 0) pentru a reduce erorile de tastare.

## Criptarea este mai importantă decât parola

O parolă lungă pe un protocol vechi nu vă ajută. Verificați setările punctelor de acces:

- **WPA3-Personal (SAE)** este opțiunea recomandată acolo unde echipamentele o suportă. Rezistă la atacurile offline de tip dicționar, pentru că handshake-ul nu mai permite reconstituirea cheii din trafic capturat.
- **WPA2-Personal (AES/CCMP)** rămâne acceptabil pentru echipamente mai vechi. Dacă îl folosiți, lungimea parolei devine critică.
- **Modul mixt WPA2/WPA3** este un compromis rezonabil în perioada de tranziție.
- **Dezactivați complet WEP, WPA (TKIP) și WPS.** WPS, în special, permite ocolirea parolei prin PIN-ul de opt cifre și ar trebui oprit pe toate echipamentele.

## Rețeaua de invitați: separată, întotdeauna

Nu dați parola rețelei interne vizitatorilor, colaboratorilor externi sau angajaților care își aduc telefonul personal. Configurați un SSID separat pentru invitați, cu:

- izolare client-to-client (dispozitivele conectate nu se văd între ele);
- fără acces la VLAN-ul intern, la servere, la NAS sau la imprimante;
- limitare de bandă, dacă echipamentul o permite;
- parolă proprie, schimbată periodic.

Aceeași logică se aplică și pentru dispozitivele IoT: camere, senzori, televizoare inteligente, sisteme de acces. Ele ajung frecvent nepatch-uite și devin punct de intrare. Un VLAN dedicat le izolează de stațiile de lucru.

## Când parola comună nu mai este suficientă

O parolă unică, cunoscută de toată lumea, are o problemă structurală: nu puteți revoca accesul unei singure persoane. Când pleacă un angajat, ar trebui să schimbați parola pe toate dispozitivele. În practică, nimeni nu face asta, iar parola circulă ani la rând.

De la aproximativ 20–25 de utilizatori, sau oriunde există cerințe de conformitate, soluția corectă este **WPA2/WPA3-Enterprise cu 802.1X**: fiecare utilizator se autentifică cu propriul cont, prin RADIUS, legat de Active Directory sau Entra ID. Beneficiile sunt directe:

- revocarea accesului se face dezactivând contul, nu schimbând parola tuturor;
- aveți jurnal de conectări per utilizator și per dispozitiv;
- puteți aplica politici diferite pe roluri (VLAN dinamic);
- eliminați „parola scrisă pe un post-it lângă router”.

Pe echipamente Fortinet, de exemplu, această configurație se realizează unitar din FortiGate pentru toate punctele de acces FortiAP, cu politici de firewall aplicate direct pe SSID-uri.

## Igienă operațională: lucrurile mărunte care contează

- **Schimbați parola implicită de administrare** a routerului sau a controller-ului wireless. Este distinctă de parola Wi-Fi și este mult mai periculoasă dacă rămâne cea din fabrică.
- **Actualizați firmware-ul** punctelor de acces. Vulnerabilitățile în stivele wireless apar regulat.
- **Nu ascundeți SSID-ul** crezând că vă protejează — nu este o măsură de securitate și creează probleme de roaming.
- **Documentați** unde este stocată parola. Un manager de parole al companiei, nu un fișier Excel pe desktop.
- **Stabiliți un ciclu de schimbare** legat de evenimente reale: plecări din echipă, suspiciune de compromitere, finalizarea unui proiect cu colaboratori externi.

## Pe scurt

Pentru un birou mic: WPA3 (sau WPA2-AES), frază de acces de minimum 16 caractere, WPS dezactivat, SSID separat pentru invitați și IoT. Pentru o organizație cu mai mulți angajați sau cu cerințe de conformitate, treceți la 802.1X cu conturi individuale.

Configurarea corectă a rețelei wireless este rareori o operațiune izolată — depinde de segmentarea VLAN, de politicile de firewall, de gestionarea identităților și de monitorizarea traficului. Dacă aveți nevoie de o evaluare a infrastructurii wireless actuale sau de implementarea unei soluții cu autentificare per utilizator, echipa noastră vă poate ajuta să treceți de la o parolă partajată la o arhitectură controlată și auditabilă.
