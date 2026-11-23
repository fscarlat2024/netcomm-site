---
title: "Segmentarea rețelei pe FortiGate: VLAN-uri și politici de la zero"
description: "Cum împarți rețeaua în zone separate pe un FortiGate: cele șapte VLAN-uri, matricea de acces dintre ele, ordinea corectă a politicilor și migrarea fără întreruperi. Exemple de configurare pentru FortiOS 7.x."
date: 2026-11-23
category: "Rețea & Fortinet"
tags: ["fortigate", "fortinet", "vlan", "segmentare", "firewall", "nis2"]
---
O rețea în care PC-urile, imprimantele, camerele, serverele și backupul stau în același VLAN este o rețea în care un singur dispozitiv compromis le poate atinge pe toate. În practică, cele mai multe incidente de tip ransomware pe care le vedem la firmele mici și mijlocii nu încep pe server. Încep pe o cameră IP cu firmware vechi, pe o imprimantă cu parola din fabrică sau pe laptopul unui angajat.

De acolo, atacatorul nu mai întâlnește niciun obstacol până la serverul de contabilitate și, mai grav, până la backup. Când backupul e criptat odată cu datele, firma nu mai are din ce să se refacă.

Articolul de față arată cum împarți rețeaua în zone separate pe un firewall FortiGate, ce reguli pui între ele, în ce ordine le așezi și cum faci trecerea fără să oprești activitatea. Principiile se aplică la fel pe orice firewall de nivel business; exemplele de configurare sunt pentru FortiOS 7.x.

## De ce segmentare: modelul băncii

Gândește-te la o sucursală bancară. Clienții stau în hol. Funcționarii lucrează în birouri, la care clienții ajung doar prin ghișeu. Tezaurul e închis pentru toată lumea, iar casierul de tezaur iese el să colecteze numerarul de la ghișee. Nimeni nu intră în tezaur cu o cerere.

Segmentarea rețelei aplică exact această logică:

- **Holul** = rețeaua utilizatorilor și rețeaua de oaspeți.
- **Birourile** = serverele, accesibile doar pe „ghișeele" aplicațiilor (porturile de care e nevoie).
- **Tezaurul** = backupul. Nimeni nu ajunge la el; serverul de backup trage el datele de la servere.
- **Paznicul de pe hol** = firewall-ul, care decide cine trece dintr-o încăpere în alta.

O limită importantă: firewall-ul vede doar traficul care trece dintre VLAN-uri. Două dispozitive din același VLAN comunică direct prin switch, fără să treacă pe la paznic. De aceea împărțirea în VLAN-uri e condiția de bază: orice regulă de pe firewall acționează doar la granița dintre zone.

## Cele șapte zone

Pentru o firmă tipică de 10–100 de angajați, șapte zone acoperă aproape orice situație. ID-urile și adresele de mai jos sunt doar un exemplu; important e ca fiecare zonă să aibă VLAN-ul și subrețeaua ei.

| Zonă | VLAN | Subrețea (exemplu) | Ce conține |
|---|---|---|---|
| MANAGEMENT | 10 | 10.10.10.0/24 | Interfețele de administrare ale switch-urilor, AP-urilor, UPS-urilor; PC-ul administratorului |
| UTILIZATORI | 20 | 10.10.20.0/24 | PC-uri și laptopuri ale angajaților |
| SERVERE | 30 | 10.10.30.0/24 | Server de aplicații (ERP, contabilitate), file server, controller de domeniu |
| BACKUP | 40 | 10.10.40.0/24 | Serverul de backup (de ex. Veeam), NAS-ul sau repository-ul de backup |
| PRINTERE | 50 | 10.10.50.0/24 | Imprimante și multifuncționale |
| IOT | 60 | 10.10.60.0/24 | Camere IP, NVR, control acces, senzori, TV-uri, sisteme smart |
| GUEST | 70 | 10.10.70.0/24 | Wi-Fi pentru vizitatori și dispozitive personale |

Zona de management e cea mai des uitată. Fără ea, interfața web a switch-ului sau a imprimantei stă în aceeași rețea cu utilizatorii și poate fi atacată direct de pe orice laptop compromis.

## Matricea de acces: cine vorbește cu cine

Regula de bază: tot ce nu e permis explicit este interzis. Fiecare zonă primește acces doar pe porturile de care are nevoie pentru a funcționa. Tabelul se citește pe rânduri: de la zona din stânga, către zona din cap de coloană.

| De la ↓ / Către → | SERVERE | BACKUP | PRINTERE | IOT | INTERNET |
|---|---|---|---|---|---|
| **MANAGEMENT** | Administrare (RDP, HTTPS, SSH) | Administrare | HTTPS | HTTPS | Da |
| **UTILIZATORI** | Doar porturile aplicațiilor (ERP, RDP, SMB pe share-uri) | Nu | Doar print (9100, 631, 515) | Doar vizualizare NVR | Da, cu inspecție completă |
| **VPN** | Ca utilizatorii, dar mai restrâns | Nu | Nu | Nu | — |
| **SERVERE** | — | Doar transfer de date backup | Nu | Nu | Doar update-uri (HTTPS, DNS, NTP) |
| **BACKUP** | Porturile agentului de backup | — | Nu | Nu | Doar update-uri și copie offsite |
| **PRINTERE** | SMB doar spre share-ul de scanare | Nu | — | Nu | HTTP/S, DNS, SMTP pentru scan-to-email |
| **IOT** | Nu | Nu | Nu | — | Doar cloud-ul producătorului, sau deloc |
| **GUEST** | Nu | Nu | Nu | Nu | Da, cu filtrare web |

Trei principii reies din tabel:

- **Backupul nu primește conexiuni de la nimeni**, în afară de administrator. El inițiază conexiunile spre servere (modelul „pull").
- **IoT, printerele și guest-ul nu inițiază nimic** spre zonele interne. Sunt dispozitivele cu cel mai slab nivel de securitate, deci sunt tratate ca „zone murdare".
- **Scanarea merge pe un share de pe server**, nu pe PC-urile utilizatorilor. O singură regulă în loc de câte una pentru fiecare PC.

## Politicile, de sus în jos

FortiGate citește politicile de sus în jos și aplică prima care se potrivește. Ordinea nu e un detaliu: o regulă largă pusă prea sus anulează toate regulile stricte de sub ea. Ordinea corectă merge de la specific la general, în patru blocuri: blocaje, acces între zone, interdicții explicite și ieșirea la internet.

### Blocul A — blocaje globale

| # | Nume | De la | Către | Servicii | Acțiune |
|---|---|---|---|---|---|
| 1 | BLOCK-Carantina | Dispozitive în carantină | Oriunde | ALL | Deny |
| 2 | BLOCK-Geo-Inbound | Internet, țări nedorite | Orice serviciu publicat | ALL | Deny |

### Blocul B — acces permis între zone

| # | Nume | De la | Către | Servicii | Acțiune |
|---|---|---|---|---|---|
| 3 | MGMT-to-ALL | MANAGEMENT | Toate zonele interne | RDP, HTTPS, SSH | Accept |
| 4 | BACKUP-to-SERVERE | BACKUP | SERVERE | Porturile agentului de backup | Accept |
| 5 | SERVERE-to-BACKUP | SERVERE | BACKUP | Doar porturile de transfer date | Accept |
| 6 | USERI-to-SERVERE | UTILIZATORI | SERVERE | Porturile aplicațiilor, SMB pe file server | Accept |
| 7 | VPN-to-SERVERE | Tunel VPN (grup de utilizatori) | SERVERE | RDP + porturile aplicației | Accept |
| 8 | USERI-to-PRINTERE | UTILIZATORI | PRINTERE | TCP 9100, 631, 515 | Accept |
| 9 | PRINTERE-to-SCAN | PRINTERE | Share-ul de scanare de pe server | SMB (445) | Accept |
| 10 | USERI-to-NVR | UTILIZATORI (sau grup restrâns) | NVR din IOT | Porturile aplicației de vizualizare | Accept |

### Blocul C — interdicții explicite, cu logare

| # | Nume | De la | Către | Servicii | Acțiune |
|---|---|---|---|---|---|
| 11 | DENY-to-BACKUP | Toate zonele | BACKUP | ALL | Deny |
| 12 | DENY-IOT-to-INTERN | IOT | Toate zonele interne | ALL | Deny |
| 13 | DENY-PRINTERE-to-INTERN | PRINTERE | Toate zonele interne | ALL | Deny |
| 14 | DENY-GUEST-to-INTERN | GUEST | Toate zonele interne | ALL | Deny |

Aceste reguli par redundante, pentru că FortiGate blochează oricum la final tot ce nu e permis. Rostul lor e altul: au nume și log propriu. Când o cameră încearcă să ajungă la un server, vezi în log exact regula „DENY-IOT-to-INTERN", nu un anonim „implicit deny". Asta e diferența dintre a observa un atac și a-l rata.

### Blocul D — ieșirea la internet, câte o politică pe zonă

| # | Nume | De la | Către | Servicii | Acțiune |
|---|---|---|---|---|---|
| 15 | USERI-to-WAN | UTILIZATORI | Internet | ALL | Accept + AV, IPS, web filter, DNS filter, NAT |
| 16 | SERVERE-to-WAN | SERVERE | Internet | HTTPS, DNS, NTP | Accept + AV, IPS, NAT |
| 17 | BACKUP-to-WAN | BACKUP | Internet (destinația offsite) | HTTPS + portul copiei offsite | Accept + NAT |
| 18 | PRINTERE-to-WAN | PRINTERE | Internet | HTTP, HTTPS, DNS, SMTP | Accept + NAT |
| 19 | IOT-to-WAN | IOT | Doar cloud-ul producătorului | HTTPS | Accept + NAT (sau lipsește complet) |
| 20 | GUEST-to-WAN | GUEST | Internet | HTTP, HTTPS, DNS | Accept + web filter, NAT |
| — | Implicit deny | Orice | Orice | ALL | Deny, cu logare activată |

## Reguli valabile pentru toate politicile

- **Fără NAT între VLAN-uri.** NAT doar spre internet. Altfel, serverul vede toate conexiunile ca venind de la firewall și nu mai știi, la un incident, de pe ce PC a pornit.
- **Log pe tot** (`logtraffic all`), inclusiv pe implicit deny (`fwpolicy-implicit-log enable`).
- **Inspecție (AV + IPS) pe tot ce intră în SERVERE și BACKUP**, nu doar pe ce iese la internet.
- **Niciodată service ALL între zone interne**, în afară de management.

## Exemplu de configurare

O politică de acces (regula 8) și o interdicție explicită (regula 12):

```
config firewall service custom
  edit "PRINT"
    set tcp-portrange 9100 631 515
  next
end

config firewall policy
  edit 8
    set name "USERI-to-PRINTERE"
    set srcintf "VLAN20-USERI"
    set dstintf "VLAN50-PRINTERE"
    set srcaddr "VLAN20-USERI address"
    set dstaddr "VLAN50-PRINTERE address"
    set action accept
    set schedule "always"
    set service "PRINT"
    set logtraffic all
    set nat disable
  next
  edit 12
    set name "DENY-IOT-to-INTERN"
    set srcintf "VLAN60-IOT"
    set dstintf "VLAN10-MGMT" "VLAN20-USERI" "VLAN30-SERVERE" "VLAN40-BACKUP" "VLAN50-PRINTERE"
    set srcaddr "all"
    set dstaddr "all"
    set action deny
    set schedule "always"
    set service "ALL"
    set logtraffic all
  next
end
```

Politicile create din CLI cu `edit <ID>` nu se așază automat în ordinea ID-urilor. Poziția se verifică în GUI (Policy & Objects → Firewall Policy) și se ajustează cu `move <ID> before <ID>`.

## Implementarea fără întreruperi

Segmentarea unei rețele care funcționează deja e ca o renovare cu magazinul deschis. Ordinea pașilor contează mai mult decât regulile în sine.

1. **Pregătește terenul.** Salvezi configurația FortiGate, stabilești o fereastră de mentenanță și te asiguri că ai acces pe consola serială, pentru cazul în care te blochezi.
2. **Inventariază fluxurile.** Ce aplicații folosesc utilizatorii, pe ce porturi, unde scanează imprimantele, ce face backupul. Ce nu e în inventar va fi blocat.
3. **Creează VLAN-urile** pe FortiGate și pe switch (trunk spre firewall, porturi de acces pentru dispozitive), cu DHCP pe fiecare. Încă nu muți nimic.
4. **Creează obiectele:** adrese, grupuri de adrese, servicii custom (aplicația de contabilitate, backup, print).
5. **Creează politicile de acces înainte de mutare.** Când un dispozitiv ajunge în VLAN-ul nou, regulile îl așteaptă deja.
6. **Mută dispozitivele de la riscul cel mai mic la cel mai mare:**
   1. **IoT** — dacă ceva nu merge, activitatea nu se oprește.
   2. **Printere** — refaci porturile de print pe PC-uri (manual, prin GPO sau script).
   3. **Backup** — rulezi un job de test imediat după mutare.
   4. **Servere** — în fereastra de mentenanță.
   5. **Utilizatori** — ultimii, pe departamente.
7. **Monitorizează o săptămână.** În Log & Report → Forward Traffic filtrezi după `action = deny`. Orice flux legitim care apare acolo devine o regulă.
8. **Strânge șurubul.** Adaugi interdicțiile explicite din blocul C, ștergi vechile politici largi (all → all, service ALL) și dezactivezi NAT-ul între VLAN-uri.
9. **Testează ca un atacator.** De pe un dispozitiv din IOT și de pe unul din GUEST încerci să ajungi la servere, la backup și la interfața de administrare a firewall-ului. Totul trebuie să fie blocat și să apară în log.

## Greșeli frecvente

- O politică „temporară" **all → all** pentru depanare, uitată deasupra celorlalte. Anulează toată segmentarea. Dacă ai nevoie de una, pune-i un schedule cu dată de expirare.
- Backupul în același VLAN cu serverele sau, mai rău, cu utilizatorii. Ransomware-ul criptează tot ce vede, inclusiv backupul.
- Camerele lăsate în rețeaua serverelor pentru că „acolo era loc".
- Interfața de administrare a firewall-ului accesibilă din toate VLAN-urile. Ar trebui permisă doar din MANAGEMENT, iar contul de admin să aibă `trusthost` și 2FA.
- Adrese bazate pe MAC în politici. Un MAC se falsifică în câteva secunde; folosește rezervări DHCP și port security pe switch.

## Checklist final

- ☐ Fiecare zonă are VLAN și subrețea proprie
- ☐ Zona MANAGEMENT există și e singura de unde se administrează echipamentele
- ☐ Backupul nu primește conexiuni decât de la management
- ☐ IoT, printerele și guest-ul nu inițiază nimic spre zonele interne
- ☐ Nicio politică între zone interne nu are service ALL (excepție: management)
- ☐ NAT dezactivat între VLAN-uri
- ☐ Interdicții explicite cu nume și log, deasupra ieșirii la internet
- ☐ Log activat pe toate politicile și pe implicit deny
- ☐ Logurile se trimit într-un loc cu retenție (FortiAnalyzer, syslog), nu doar în memoria firewall-ului
- ☐ Test de penetrare internă din IOT și GUEST, cu rezultat „blocat"

## Concluzie

Segmentarea nu oprește un atac să înceapă. Îl oprește să se extindă. O cameră compromisă într-o rețea segmentată rămâne o cameră compromisă; într-o rețea plată devine un incident care oprește firma. Pentru companiile care intră sub incidența [NIS2](/nis2/), segmentarea și controlul accesului între zone sunt și o cerință pe care auditorii o verifică explicit.

Dacă aveți o rețea plată și vreți să o segmentați fără să opriți activitatea, echipa NCS a făcut această tranziție în producție, pe infrastructuri Fortinet, de multe ori. Prima consultație este gratuită.
