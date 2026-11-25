---
title: "Cum configurezi un VPN IPsec site-to-site pe FortiGate"
description: "Ghid practic: cum legi două sedii printr-un tunel IPsec criptat pe FortiGate — Phase 1, Phase 2, politici de firewall, rute și verificare. Plus greșelile care rup tunelul."
date: 2026-11-25
category: "Rețea & Fortinet"
tags: ["fortigate", "fortinet", "vpn", "ipsec", "retea", "nis2"]
---
Două sedii ale aceleiași firme care trebuie să folosească aceleași servere, același ERP, aceleași share-uri. Soluția proastă e să publici serverul direct pe internet și să te rogi. Soluția corectă e un tunel criptat permanent între cele două rețele, prin care traficul circulă ca și cum ar fi în aceeași clădire. Pe FortiGate, acela e un VPN IPsec site-to-site.

Articolul arată cum îl configurezi de la zero, ce politici și rute îi trebuie ca să funcționeze, cum verifici că e ridicat și ce greșeli îl țin jos. Exemplele sunt pentru FortiOS 7.x.

## Site-to-site vs VPN de client

Nu confunda cele două tipuri de VPN de pe FortiGate:

- **VPN de client (SSL VPN / IPsec dial-up)** — un angajat se conectează de pe laptop, de oriunde, la rețeaua firmei. Un om, o sesiune.
- **VPN site-to-site** — două *firewall-uri* țin un tunel permanent între ele. Toate dispozitivele dintr-un sediu ajung la celălalt sediu automat, fără să instaleze nimic.

Acest articol e despre al doilea. Cele două capete sunt două FortiGate-uri (sau un FortiGate și alt firewall compatibil IPsec).

## Ce îți trebuie înainte

- **Adresă publică la ambele capete** — IP fix, sau FQDN dinamic (FortiDDNS) dacă unul dintre sedii are IP dinamic.
- **Subrețele LAN diferite** la cele două capete. Dacă ambele sedii folosesc `192.168.1.0/24`, tunelul nu poate ruta — e cea mai frecventă capcană. Un sediu pe `192.168.10.0/24`, celălalt pe `192.168.20.0/24`.
- **Acces admin** pe ambele FortiGate-uri.
- **Un pre-shared key** comun, generat puternic (nu „1234").

| | Sediu A (HQ) | Sediu B (filială) |
|---|---|---|
| IP public (WAN) | 203.0.113.10 | 198.51.100.20 |
| LAN | 192.168.10.0/24 | 192.168.20.0/24 |
| Interfață WAN | wan1 | wan1 |

## Cei doi pași IPsec: Phase 1 și Phase 2

Un tunel IPsec se negociază în două faze, și ambele trebuie să se potrivească **identic** la cele două capete, altfel tunelul nu urcă:

- **Phase 1 (IKE)** — stabilește identitatea și canalul securizat: adresa remote, pre-shared key, versiunea IKE (preferă IKEv2), algoritmii de criptare/hash și grupul DH.
- **Phase 2 (IPsec)** — definește *ce trafic* intră în tunel: subrețeaua locală și subrețeaua remote, plus algoritmii pentru datele efective.

Cea mai simplă cale e wizardul din GUI: **VPN → IPsec Wizard → Site to Site**. Alegi șablonul, pui IP-ul remote, pre-shared key-ul și cele două subrețele. Wizardul creează automat Phase 1, Phase 2, politicile de firewall și ruta. Dar e important să înțelegi ce creează, pentru că depanarea se face pe componente.

## Politici de firewall și rute

Tunelul singur nu face nimic. FortiGate are nevoie, în plus, de:

- **Două politici de firewall** — una care permite traficul LAN_local → tunel → LAN_remote, și una în sens invers. Fără politica de retur, conexiunile pornesc dar nu primesc răspuns.
- **O rută statică** care spune „pentru subrețeaua remote, ieși pe interfața tunelului".
- **NAT dezactivat** pe aceste politici. Traficul între sedii trebuie să-și păstreze adresele reale; cu NAT, sediul B ar vedea tot traficul ca venind de la firewall, nu de la PC-ul real.

Exact ca la segmentarea internă, [regula de aur rămâne: fără NAT în interiorul rețelei tale](/blog/segmentare-fortigate-vlan-politici/), NAT doar spre internet.

## Exemplu de configurare (capătul A)

```
config vpn ipsec phase1-interface
  edit "vpn-sediu-B"
    set interface "wan1"
    set ike-version 2
    set peertype any
    set proposal aes256-sha256
    set dhgrp 14
    set remote-gw 198.51.100.20
    set psksecret <pre-shared-key-puternic>
  next
end

config vpn ipsec phase2-interface
  edit "vpn-sediu-B-p2"
    set phase1name "vpn-sediu-B"
    set proposal aes256-sha256
    set src-subnet 192.168.10.0 255.255.255.0
    set dst-subnet 192.168.20.0 255.255.255.0
  next
end

config firewall policy
  edit 0
    set name "A-to-B"
    set srcintf "internal"
    set dstintf "vpn-sediu-B"
    set srcaddr "LAN-A"
    set dstaddr "LAN-B"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set nat disable
  next
  edit 0
    set name "B-to-A"
    set srcintf "vpn-sediu-B"
    set dstintf "internal"
    set srcaddr "LAN-B"
    set dstaddr "LAN-A"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set nat disable
  next
end

config router static
  edit 0
    set dst 192.168.20.0 255.255.255.0
    set device "vpn-sediu-B"
  next
end
```

La capătul B configurezi oglinda: `remote-gw` = 203.0.113.10, subrețeaua locală `192.168.20.0/24`, remote `192.168.10.0/24`, aceeași versiune IKE, aceiași algoritmi, **același** pre-shared key.

## Verificare

După ce ridici tunelul, un ping de pe un PC din sediul A către un server din sediul B ar trebui să treacă. Pe FortiGate, verifici starea reală:

```
diagnose vpn tunnel list
get vpn ipsec tunnel summary
```

Dacă tunelul apare `up` dar nu trece trafic, problema e aproape mereu la politici sau la rute, nu la IPsec. Dacă nu urcă deloc (`down`), problema e la Phase 1/Phase 2 — un algoritm sau un key care nu se potrivesc. Logul live ajută:

```
diagnose debug application ike -1
diagnose debug enable
```

## Greșeli frecvente

- **Subrețele LAN identice la ambele capete.** Dacă ambele sedii sunt pe `192.168.1.0/24`, nicio rută nu poate funcționa. Renumerotează un capăt înainte să începi.
- **Phase 1/Phase 2 nepotrivite.** Versiune IKE diferită, alt grup DH, alt algoritm, alt pre-shared key — oricare dintre ele ține tunelul jos. Setează-le identic și preferă IKEv2 + AES-256.
- **Lipsește politica de retur sau ruta.** Tunel `up`, dar trafic zero. Verifică întotdeauna ambele sensuri.
- **NAT lăsat activ** pe politicile de tunel. Rupe vizibilitatea și poate bloca aplicațiile.
- **Pre-shared key slab.** Un tunel între sedii e o țintă expusă pe internet. Generează un key lung, aleatoriu, și păstrează-l în seif, nu în email.

## Cum se leagă de NIS2

Directiva [NIS2](/nis2/) cere la Art. 21 măsuri de securitate a comunicațiilor, inclusiv **criptarea** traficului acolo unde e cazul. Un VPN IPsec site-to-site rezolvă exact asta pentru legătura dintre sedii: datele dintre birouri nu mai circulă în clar pe internet, ci printr-un tunel criptat AES-256, cu identitate verificată la ambele capete. În plus, logarea traficului pe tunel (`logtraffic all`) acoperă cerința de vizibilitate.

## Concluzie

Un VPN IPsec site-to-site nu e complicat dacă îl privești pe componente: Phase 1 pentru canal, Phase 2 pentru trafic, plus politici și rute în ambele sensuri. Cele mai multe probleme nu sunt la criptare, ci la lucruri banale — subrețele suprapuse, o politică de retur lipsă, un algoritm nepotrivit.

Dacă aveți mai multe sedii de legat sau un tunel care „urcă dar nu trece trafic", echipa NCS configurează și depanează VPN-uri Fortinet în producție. Prima consultație este gratuită.
