---
title: "Regulile ASR în Microsoft Defender: ce sunt și cum le activezi"
description: "Regulile Attack Surface Reduction blochează gratuit cele mai comune căi de atac — macro-uri Office, scripturi, furt de credențiale. Ce fac, cum le activezi în Audit apoi Block, și legătura cu NIS2."
date: 2026-11-25
category: "Cybersecurity"
tags: ["defender", "asr", "microsoft", "endpoint", "ransomware", "nis2"]
---
Cele mai multe atacuri pe un calculator de birou nu folosesc exploituri exotice. Folosesc lucruri banale pe care Windows le permite implicit: un document Word care pornește PowerShell, un script care descarcă un executabil, un macro care apelează funcții de sistem. Sunt tehnici vechi, cunoscute, și totuși funcționează, pentru că sistemul le lasă să ruleze.

Regulile **ASR (Attack Surface Reduction)** din Microsoft Defender închid exact aceste căi. Sunt gratuite, incluse în Defender Antivirus, și blochează comportamente pe care niciun document sau script legitim nu are motiv să le facă. Articolul explică ce fac, cum le activezi în siguranță și de ce „direct pe Block" e o greșeală.

## Ce sunt, de fapt, regulile ASR

ASR face parte din Microsoft Defender Antivirus — nu e un produs separat și, pentru funcționarea de bază, nu cere licența E5 sau Defender for Endpoint. Sunt un set de reguli, fiecare cu un identificator (GUID), care blochează un comportament specific: nu un fișier anume, ci o *acțiune*.

Exemplu: regula „blochează aplicațiile Office să creeze procese-copil" nu se uită la ce document deschizi. Se uită la ce încearcă să facă: dacă Word încearcă să lanseze `cmd.exe` sau `powershell.exe`, acțiunea e blocată. Un document normal nu face niciodată asta; un document malițios, da.

## Cele mai utile reguli

Nu trebuie să le activezi pe toate deodată. Acestea sunt cele cu cel mai bun raport protecție/risc pentru o firmă obișnuită:

| Regulă | GUID | Ce blochează |
|---|---|---|
| Office → procese-copil | D4F940AB-401B-4EFC-AADC-AD5F3C50688A | Word/Excel care lansează cmd, PowerShell etc. |
| Office → conținut executabil | 3B576869-A4EC-4529-8536-B80A7769E899 | Office care scrie fișiere executabile pe disc |
| Conținut executabil din email | BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550 | Executabile lansate din clientul de mail/webmail |
| Scripturi ofuscate | 5BEB7EFE-FD9A-4556-801D-275E5FFC04CC | Scripturi JS/VBS mascate intenționat |
| JS/VBS → executabil descărcat | D3E037E1-3EB8-44C8-A917-57927947596D | Script care lansează un executabil descărcat |
| Apeluri API din macro Office | 92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B | Macro-uri care apelează funcții Win32 |
| Furt de credențiale din LSASS | 9E6C4E1F-7D60-472F-BA1A-A39EF669E4B2 | Citirea parolelor din memoria LSASS |
| Persistență prin WMI | E6DB77E5-3DF2-4CF1-B95A-636979351E5B | Persistență prin subscripții de evenimente WMI |
| Protecție avansată ransomware | C1DB55AB-C21A-4637-BB3F-A12568109D35 | Blochează fișiere după prevalență/vârstă/încredere |
| Drivere semnate vulnerabile | 56A863A9-875E-4185-98A7-B882C64B5CE5 | Abuzul de drivere semnate dar vulnerabile |

## Cele trei moduri: Audit, Block, Warn

Fiecare regulă poate rula în trei moduri, și aici se greșește cel mai des:

- **Audit** — regula *nu* blochează nimic, doar scrie în log ce *ar fi* blocat. Zero risc de a rupe o aplicație.
- **Block** — regula blochează efectiv acțiunea.
- **Warn** — blochează, dar lasă utilizatorul să treacă peste, dacă insistă.

Regula de aur: **pornește întotdeauna în Audit**, una-două săptămâni. Verifici ce a fost marcat. Dacă vezi doar comportamente suspecte — treci pe Block. Dacă vezi o aplicație internă legitimă care declanșează o regulă (se întâmplă cu aplicații vechi de contabilitate sau ERP care chiar lansează procese), fie o excluzi, fie lași acea regulă pe Audit. Așa nu oprești firma din greșeală.

## Cum le activezi

**Prin Intune (recomandat pentru o flotă):** Endpoint security → Attack surface reduction → creezi o politică, alegi regulile și modul. Se aplică centralizat și apare în rapoarte.

**Prin PowerShell (local sau prin script):**

```powershell
# Pune o regula in mod Audit (GUID-ul regulii + stare 2 = Audit)
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A `
  -AttackSurfaceReductionRules_Actions AuditMode

# Dupa validare, treci pe Block (stare 1 = Enabled/Block)
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A `
  -AttackSurfaceReductionRules_Actions Enabled

# Verifici ce reguli sunt active si in ce mod
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Ids
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Actions
```

**Prin GPO:** Computer Configuration → Administrative Templates → Windows Components → Microsoft Defender Antivirus → Microsoft Defender Exploit Guard → Attack Surface Reduction.

## Greșeli frecvente

- **Direct pe Block, fără Audit.** Cea mai comună. O regulă ca „Office → procese-copil" poate rupe o aplicație internă care chiar are nevoie de acel comportament. Audit întâi, mereu.
- **Defender e în mod pasiv.** Dacă pe stație rulează un antivirus terț (Bitdefender, ESET etc.), Defender e pasiv și regulile ASR *nu* se aplică de la el. Verifici cu `Get-MpComputerStatus` starea reală.
- **Reguli activate, dar fără raportare centralizată.** Fără Intune sau un colector de loguri, nu vezi ce blochează regulile pe flotă. Activează și colectarea evenimentelor.
- **Excluderi prea largi.** Când o regulă prinde o aplicație legitimă, exclude *fișierul* exact, nu dezactiva regula pe tot parcul.

## Cum se leagă de NIS2

Directiva [NIS2](/nis2/) cere la Art. 21 măsuri de protecție împotriva programelor malițioase. Regulile ASR sunt una dintre cele mai eficiente măsuri de endpoint pe care le poți lua *fără* costuri suplimentare: blochează exact vectorii pe care îi folosesc ransomware-ul și loaderele moderne — macro-uri, scripturi, furt de credențiale. Pentru un auditor, o politică ASR aplicată și documentată e o dovadă concretă de hardening al stațiilor.

## Concluzie

Regulile ASR sunt cea mai bună protecție gratuită de endpoint pe care majoritatea firmelor o au deja și nu o folosesc. Nu cer licențe scumpe, nu cer un produs nou — doar Defender Antivirus activ și câteva reguli puse corect. Secretul e procesul: Audit întâi, verifici, apoi Block, cu excluderi chirurgicale acolo unde o aplicație legitimă o cere.

Dacă vreți regulile ASR aplicate corect pe toată flota, prin Intune, cu fază de audit și raportare — echipa NCS a făcut exact asta în producție. Prima consultație este gratuită.
