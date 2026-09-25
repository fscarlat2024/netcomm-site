---
title: "Backup imutabil: de ce e singura copie care supraviețuiește unui atac ransomware"
description: "Un backup obișnuit poate fi șters de atacatori odată cu datele. Explicăm ce înseamnă imutabilitatea, regula 3-2-1-1-0 și cum se leagă de conformitatea NIS2."
date: 2026-09-25
category: "Backup & Continuitate"
tags: ["ransomware", "backup", "NIS2", "business continuity"]
---

Cele mai multe companii cred că sunt protejate pentru că „au backup". Problema e că un backup obișnuit, conectat permanent la rețea, este exact prima țintă a unui atac ransomware modern. Atacatorii nu criptează doar fișierele de producție — caută activ și distrug copiile de siguranță, ca să nu aveți din ce să reveniți.

Aici intervine **backup-ul imutabil**: o copie care, odată scrisă, nu mai poate fi modificată sau ștearsă de nimeni — nici de un administrator compromis, nici de malware — pentru o perioadă stabilită.

## De ce nu e suficient un backup „normal"

Un backup clasic pe un NAS din rețea sau pe un share accesibil are trei vulnerabilități:

- **Este accesibil.** Dacă un cont de administrator este compromis, atacatorul are acces și la backup.
- **Poate fi modificat.** Ransomware-ul poate cripta sau șterge fișierele de backup exact ca pe cele de producție.
- **Nu are dovadă de integritate.** Nu știți dacă ultima copie „bună" chiar mai este bună.

Rezultatul: multe organizații descoperă, în plină criză, că singura copie disponibilă a fost și ea criptată.

## Ce înseamnă imutabilitate

Un repository imutabil folosește tehnologia **WORM** (Write Once, Read Many): datele se scriu o singură dată și rămân blocate pentru o perioadă de retenție configurată — de exemplu 14 sau 30 de zile. În acest interval, copia **nu poate fi ștearsă sau suprascrisă**, indiferent de ce privilegii are contul care încearcă.

Chiar dacă atacatorul obține control complet asupra infrastructurii, copia imutabilă rămâne intactă și disponibilă pentru restaurare.

## Regula 3-2-1-1-0

Standardul modern de backup nu mai este simplul „3-2-1", ci **3-2-1-1-0**:

- **3** copii ale datelor;
- pe **2** tipuri diferite de suport;
- cu **1** copie în afara locației (offsite);
- din care **1** este imutabilă sau offline (air-gapped);
- și **0** erori la verificarea restaurării.

Acel „0" final este esențial și cel mai des ignorat: un backup care nu a fost testat nu este un backup, ci o presupunere.

## Legătura cu NIS2

Directiva **NIS2** cere explicit măsuri de continuitate a activității și gestionarea copiilor de siguranță (Art. 21). Pentru entitățile din domeniul de aplicare, un plan de backup care include imutabilitate și testarea periodică a restaurării nu mai este o bună practică opțională, ci parte din obligațiile de conformitate. Documentarea acestor măsuri contează la fel de mult ca implementarea lor.

## Ce puteți face concret

1. Adăugați cel puțin o copie imutabilă la strategia de backup (repository WORM local sau în cloud).
2. Stabiliți o perioadă de retenție care acoperă timpul mediu până la detectarea unui atac (adesea săptămâni).
3. **Testați restaurarea** periodic, nu doar backup-ul.
4. Documentați totul pentru auditul NIS2.

Imutabilitatea nu previne atacul — dar garantează că aveți din ce să reveniți atunci când se întâmplă. Este diferența dintre o zi proastă și o afacere oprită.
