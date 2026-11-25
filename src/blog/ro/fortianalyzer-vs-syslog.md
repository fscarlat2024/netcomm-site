---
title: "FortiAnalyzer vs syslog: unde trimiți logurile de pe FortiGate"
description: "Logurile din memoria firewall-ului se pierd la reboot. Comparăm cele două destinații externe — un server syslog simplu și FortiAnalyzer — cu avantaje, costuri și legătura cu NIS2."
date: 2026-11-25
category: "Rețea & Fortinet"
tags: ["fortigate", "fortinet", "fortianalyzer", "syslog", "logging", "nis2"]
---
Un FortiGate generează loguri valoroase: cine s-a conectat, ce a blocat firewall-ul, ce a detectat IPS-ul, când a picat un tunel. Problema e că, implicit, multe dintre ele stau în memoria aparatului sau pe un disc local mic, cu rotație rapidă. La un reboot sau după câteva zile, logurile vechi dispar. Iar când ai nevoie de ele — după un incident — exact atunci nu mai sunt.

De aceea logurile trebuie trimise **în afara** firewall-ului, într-un loc cu retenție. Pe FortiGate ai două drumuri principale: un server **syslog** generic, sau **FortiAnalyzer**, platforma dedicată de la Fortinet. Articolul compară cele două și te ajută să alegi.

## Ce e syslog

Syslog e un standard vechi și universal: firewall-ul împinge fiecare eveniment, ca linie de text, către un server care îl stochează. Serverul poate fi orice — un Linux cu `rsyslog`, un colector dintr-un SIEM (Wazuh, Graylog, ELK), sau un serviciu cloud.

Avantajul e simplitatea și costul: un server syslog e ieftin sau gratuit și acceptă loguri de la *orice* produce syslog, nu doar de la Fortinet. Dezavantajul e că primești text brut. Nu ai rapoarte gata făcute, nu ai dashboard-uri, nu ai corelare — doar fluxul de evenimente, pe care trebuie să-l procesezi tu cu alt instrument.

## Ce e FortiAnalyzer

FortiAnalyzer e un appliance (fizic sau virtual) făcut special pentru logurile Fortinet. Primește evenimentele structurat, nu ca text simplu, și le înțelege: știe ce e o sesiune, ce e o detecție IPS, ce e un eveniment de web filter.

Peste asta oferă:

- **Rapoarte native** — trafic, amenințări, utilizare, conformitate — gata de generat sau programat pe email.
- **FortiView** — dashboard-uri interactive: top aplicații, top surse, top amenințări.
- **Corelare și indicatori** — leagă evenimente între echipamente din Security Fabric.
- **Retenție pe termen lung** cu arhivare, util pentru forensics și audit.

Prețul acestei puteri e că e un produs Fortinet, cu licență și dimensionare proprie, și e orientat spre ecosistemul Fortinet.

## Comparație directă

| | Syslog | FortiAnalyzer |
|---|---|---|
| Cost | Mic sau zero | Licență + appliance/VM |
| Format loguri | Text brut | Structurat, înțeles nativ |
| Rapoarte | Le construiești tu | Zeci, native și programabile |
| Dashboard-uri | Prin alt tool | FortiView inclus |
| Corelare între echipamente | Nu (fără SIEM) | Da, în Security Fabric |
| Surse acceptate | Orice produs | Mai ales Fortinet |
| Retenție / arhivare | Depinde de serverul tău | Gestionată, pe termen lung |
| Forensics post-incident | Manual, în text | Căutare structurată, rapidă |

## Când alegi fiecare

**Alege syslog dacă:**

- Ai buget mic și deja un sistem de analiză — un SIEM open-source, un ELK, un Graylog — care primește loguri și de la alte surse.
- Vrei un singur loc central pentru logurile *tuturor* echipamentelor, nu doar Fortinet.
- Ai nevoie doar să păstrezi evenimentele cu retenție, nu neapărat să le analizezi în consola producătorului.

**Alege FortiAnalyzer dacă:**

- Ai o flotă Fortinet (mai multe FortiGate-uri, FortiSwitch, FortiAP) și vrei o consolă unică care le înțelege.
- Vrei rapoarte și forensics native, fără să construiești tu totul.
- Ai nevoie de dovezi structurate și ușor de căutat pentru audituri.

Cele două nu se exclud. Multe firme trimit logurile pe FortiAnalyzer *și* fac forward către un SIEM, ca să aibă și rapoartele native, și corelarea centralizată cu restul infrastructurii.

## Cum trimiți logurile (CLI)

Către un server syslog:

```
config log syslogd setting
  set status enable
  set server "10.10.40.15"
  set port 514
  set mode udp
  set facility local7
end
config log syslogd filter
  set severity information
end
```

Către FortiAnalyzer:

```
config log fortianalyzer setting
  set status enable
  set server "10.10.40.20"
  set upload-option realtime
end
```

Indiferent de destinație, asigură-te că logarea e activă și pe politicile de firewall (`set logtraffic all`) și pe implicit deny, altfel trimiți doar o parte din tablou.

## Legătura cu SIEM

Dacă rulezi deja un [SIEM precum FortiSIEM](/blog/ce-este-fortisiem/) sau un colector Wazuh, syslog-ul e calea naturală: FortiGate-ul împinge evenimentele către colector, unde sunt normalizate și corelate cu logurile de pe servere, endpointuri și M365. FortiAnalyzer poate juca și el rolul de sursă pentru un SIEM, nu doar de consolă finală.

## Cum se leagă de NIS2

Directiva [NIS2](/nis2/) cere la Art. 21 capacități de **logare, detectare și analiză post-incident**. În practică, asta înseamnă două lucruri pe care memoria firewall-ului nu le poate oferi: **retenție** (logurile trebuie să existe săptămâni sau luni mai târziu, când investighezi un incident) și **căutare** (trebuie să poți reconstitui cronologia). Atât syslog cu retenție, cât și FortiAnalyzer rezolvă cerința; diferă doar cât de mult lucru manual rămâne pentru tine.

## Concluzie

Regula care nu se schimbă: **logurile nu stau în firewall**. Trimite-le afară, într-un loc cu retenție. Dacă vrei simplu, ieftin și integrat cu un SIEM existent — syslog. Dacă ai flotă Fortinet și vrei rapoarte, dashboard-uri și forensics native — FortiAnalyzer. Cele mai mature infrastructuri le folosesc pe amândouă.

Dacă nu sunteți siguri că logurile voastre ajung undeva cu retenție — sau vreți să le corelați într-un SIEM — echipa NCS proiectează și implementează astfel de arhitecturi. Prima consultație este gratuită.
