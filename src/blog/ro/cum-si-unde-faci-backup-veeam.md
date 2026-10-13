---
title: "Cum și unde faceți backup? Este Veeam o soluție performantă?"
description: "Ghid practic despre cum și unde faceți backup corect: regula 3-2-1, copii imutabile, testare periodică și rolul Veeam într-o strategie solidă."
date: 2026-10-13
category: "Backup & Continuitate"
tags: ["backup", "veeam", "3-2-1", "disaster recovery", "ransomware"]
---
Întrebarea „avem backup?” primește aproape întotdeauna un „da” rapid în ședințele de management. Întrebarea corectă este însă alta: „când am restaurat ultima dată, cât a durat și ce am pierdut?”. Diferența dintre cele două răspunsuri este, de regulă, diferența dintre o companie care își reia activitatea în câteva ore și una care pierde zile întregi de producție, facturare și încredere din partea clienților.

În acest articol parcurgem logica unei strategii de backup funcționale: ce trebuie protejat, unde trebuie păstrate copiile, cum le apărați de ransomware și unde se încadrează Veeam, una dintre cele mai folosite platforme de protecție a datelor din piață.

## Începeți cu întrebările de business, nu cu tehnologia

Înainte de a alege un produs, stabiliți două valori pentru fiecare sistem critic:

- **RPO (Recovery Point Objective)** — câte date vă permiteți să pierdeți, exprimate în timp. Dacă faceți un singur backup pe noapte, RPO-ul dumneavoastră real este de până la 24 de ore.
- **RTO (Recovery Time Objective)** — în cât timp trebuie să fie din nou funcțional sistemul. Un ERP care susține producția are un RTO complet diferit față de un server de arhivă.

Aceste două numere dictează arhitectura, bugetul și tehnologia. Fără ele, orice discuție despre „ce soluție de backup luăm” este prematură.

## Ce trebuie inclus în perimetrul de backup

O greșeală frecventă este protejarea doar a serverelor de fișiere, în timp ce alte componente esențiale rămân descoperite. Inventariați:

- mașinile virtuale (VMware, Hyper-V, Proxmox) și serverele fizice;
- bazele de date — SQL Server, PostgreSQL, MySQL — cu backup consistent la nivel de aplicație, nu doar al discului;
- datele din Microsoft 365: Exchange Online, SharePoint, OneDrive, Teams. Microsoft asigură disponibilitatea infrastructurii, dar responsabilitatea pentru datele dumneavoastră vă revine (modelul de responsabilitate partajată);
- configurațiile echipamentelor de rețea și firewall;
- stațiile de lucru ale utilizatorilor care păstrează local documente de lucru;
- aplicațiile SaaS critice pentru business.

## Unde păstrați copiile: regula 3-2-1 și evoluția ei

Regula clasică 3-2-1 rămâne reperul de bază: **3 copii** ale datelor, pe **2 tipuri diferite de suport**, dintre care **1 în altă locație**. În era ransomware-ului, ea a fost extinsă frecvent la **3-2-1-1-0**: o copie suplimentară **imutabilă sau offline**, plus **zero erori** la verificarea restaurărilor.

În practică, o arhitectură echilibrată pentru o companie medie arată astfel:

1. **Copia primară locală**, pe un storage dedicat de backup (NAS sau server fizic separat de producție), pentru restaurări rapide.
2. **Copia secundară**, într-o locație diferită — un alt sediu, un datacenter sau un furnizor cloud — pentru a acoperi incendiu, inundație, furt sau compromitere completă a locației principale.
3. **Copia imutabilă**, care nu poate fi ștearsă sau modificată până la expirarea perioadei de retenție, nici măcar de un administrator cu credențiale furate.

Detaliul critic: **repository-ul de backup nu trebuie să fie membru al aceluiași domeniu Active Directory** ca mediul de producție și nu trebuie să fie accesibil cu aceleași conturi. Atacatorii caută întâi backup-urile, tocmai pentru a elimina alternativa la plata răscumpărării.

## Unde se potrivește Veeam

Veeam s-a impus ca standard de facto în zona de protecție a datelor pentru medii virtualizate, iar astăzi acoperă un spectru mult mai larg. Punctele în care se diferențiază, relevante pentru o companie din România:

- **Acoperire largă**: VMware vSphere, Hyper-V, servere fizice Windows și Linux, Microsoft 365, baze de date și workload-uri în cloud, dintr-o consolă unitară.
- **Restaurare granulară**: puteți recupera un singur fișier, un mailbox sau un obiect Active Directory, fără să restaurați întreaga mașină virtuală.
- **Instant Recovery**: pornirea unei mașini virtuale direct din repository-ul de backup, ceea ce reduce dramatic RTO-ul în incidente majore.
- **Verificarea automată a restaurărilor**: Veeam poate porni periodic, într-un mediu izolat, copiile de siguranță și confirma că sunt funcționale — exact „zero erori” din regula 3-2-1-1-0.
- **Suport pentru imutabilitate**: pe repository-uri Linux hardened sau pe object storage compatibil S3 cu Object Lock.

Este Veeam „cea mai bună” soluție? Răspunsul onest este că este o soluție foarte matură și potrivită pentru majoritatea mediilor mixte, dar valoarea reală vine din **modul în care este proiectată și operată**. O licență Veeam configurată greșit, fără copie externă și fără testare, oferă aceeași protecție ca absența ei — adică una iluzorie.

## Greșelile care anulează orice investiție în backup

- **Nu se testează restaurarea.** Un job care afișează „Success” nu garantează că datele sunt utilizabile. Programați teste de restaurare trimestriale, documentate.
- **Toate copiile sunt în aceeași rețea.** Un atac care criptează producția va cripta și NAS-ul accesibil prin SMB cu aceleași credențiale.
- **Retenție insuficientă.** Unele compromiteri sunt descoperite după săptămâni. Dacă păstrați doar 7 zile, veți restaura date deja infectate.
- **Lipsa monitorizării.** Joburile eșuate tăcut timp de luni de zile sunt un scenariu mult mai frecvent decât ar trebui.
- **Microsoft 365 lăsat neprotejat**, pe baza presupunerii eronate că „e în cloud, deci e salvat”.
- **Absența unui plan de recuperare scris**, cu pași, responsabili și ordine de prioritate a sistemelor.

## Backup-ul ca cerință de conformitate

Pentru organizațiile care intră sub incidența Directivei [NIS2](/nis2/), continuitatea activității și gestionarea crizelor sunt cerințe explicite în cadrul măsurilor de management al riscului (Art. 21). Asta înseamnă politici documentate de backup, proceduri de recuperare, testare și dovezi că mecanismele funcționează. Un backup netestat nu este doar un risc operațional, ci și o lipsă de conformitate pe care un audit o va identifica imediat.

## Concluzie

Un backup bun nu este un produs, ci un proces: perimetru clar definit, copii multiple în locații diferite, cel puțin una imutabilă, monitorizare permanentă și testare periodică a restaurărilor. Veeam este un instrument excelent pentru a susține acest proces, dar rezultatul depinde de arhitectură și de disciplina operațională.

Dacă nu știți cu certitudine cât ar dura astăzi repunerea în funcțiune a sistemelor dumneavoastră critice sau dacă ultima restaurare testată este o amintire vagă, merită să evaluați situația împreună cu o echipă care proiectează și administrează zilnic astfel de arhitecturi. Un audit al strategiei de backup costă semnificativ mai puțin decât o zi de activitate oprită.
