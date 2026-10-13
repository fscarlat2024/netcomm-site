---
title: "Sunt o companie medie — am nevoie de NIS2?"
description: "Cum verificați dacă firma dumneavoastră intră sub incidența NIS2: criterii de sector și mărime, obligații concrete și primii pași practici de conformitate."
date: 2026-10-13
category: "Conformitate NIS2"
tags: ["nis2", "conformitate", "dnsc", "risc", "guvernanta"]
---
Este una dintre cele mai frecvente întrebări pe care le primim de la administratori și directori IT din companii cu 50–250 de angajați: „[NIS2](/nis2/) e pentru infrastructuri critice, pentru energie și telecom — pe noi chiar ne privește?”. Răspunsul scurt este: depinde de sectorul în care activați și de mărimea companiei. Răspunsul util este că verificarea se poate face în câteva ore, iar costul de a nu o face este disproporționat față de efortul inițial.

În acest articol parcurgem logica de aplicabilitate a Directivei NIS2, obligațiile concrete care decurg din ea și pașii realiști pentru o companie medie care pornește de la zero.

## Cum se stabilește aplicabilitatea: sector + mărime

Spre deosebire de prima directivă NIS, unde autoritățile naționale desemnau individual operatorii vizați, NIS2 introduce o regulă generală de aplicabilitate. Practic, o entitate intră sub incidența directivei dacă îndeplinește simultan două condiții.

**1. Activează într-un sector listat în anexele directivei.** Anexa I cuprinde sectoarele de înaltă criticitate: energie, transport, bancar, infrastructuri ale pieței financiare, sănătate, apă potabilă, ape uzate, infrastructură digitală, administrarea serviciilor TIC (B2B), administrație publică și spațiu. Anexa II adaugă alte sectoare critice: servicii poștale și de curierat, gestionarea deșeurilor, fabricarea și distribuția de substanțe chimice, producția și procesarea alimentelor, fabricarea de produse (dispozitive medicale, echipamente electronice, mașini, autovehicule etc.), furnizorii digitali și organizațiile de cercetare.

Observați că lista este mult mai largă decât imaginea populară despre „infrastructură critică”. O fabrică de componente auto, un procesator de alimente, o firmă de curierat regional, un furnizor de servicii IT gestionate sau un distribuitor de produse chimice sunt, toate, candidați direcți.

**2. Depășește pragul de mărime.** Regula generală vizează entitățile medii și mari, conform definiției europene a IMM-urilor: companii cu cel puțin 50 de angajați sau cu o cifră de afaceri anuală și un bilanț anual care depășesc 10 milioane de euro. Entitățile mari — peste 250 de angajați sau peste 50 de milioane de euro cifră de afaceri — sunt tratate cu un nivel de supraveghere mai strict.

Din combinația acestor criterii rezultă două categorii: **entități esențiale** și **entități importante**. Diferența nu stă în măsurile de securitate cerute — acestea sunt în esență aceleași — ci în regimul de supraveghere: entitățile esențiale sunt supuse unui control proactiv, în timp ce entitățile importante sunt verificate în general reactiv, după un incident sau o sesizare.

### Excepțiile care prind și companiile mici

Există situații în care pragul de mărime nu contează. Indiferent de numărul de angajați, pot intra sub incidența NIS2 furnizorii de rețele publice de comunicații electronice, furnizorii de servicii de încredere, registrele de nume de domenii TLD, precum și entitățile care sunt unicul furnizor al unui serviciu esențial într-un stat membru sau a căror perturbare ar avea un impact semnificativ asupra siguranței publice. Dacă vă aflați într-una dintre aceste categorii, discuția despre „suntem prea mici” nu este relevantă.

## Efectul indirect: lanțul de aprovizionare

Chiar dacă analiza de mai sus indică faptul că nu intrați direct sub incidența directivei, NIS2 vă poate afecta ca furnizor. Articolul 21 obligă entitățile vizate să gestioneze riscurile din lanțul de aprovizionare și relațiile cu furnizorii direcți. În practică, acest lucru se traduce prin chestionare de securitate, clauze contractuale noi, cerințe de notificare a incidentelor în termene scurte și, uneori, dovezi de certificare.

Multe companii medii descoperă NIS2 nu prin autoritatea de reglementare, ci printr-un e-mail de la un client mare care cere completarea unui audit de securitate în două săptămâni. A fi pregătit în avans transformă această cerere dintr-o criză într-un avantaj comercial.

## Ce înseamnă concret conformitatea

Articolul 21 din NIS2 enumeră un set minim de măsuri tehnice, operaționale și organizatorice, proporționale cu riscul:

- politici de analiză a riscurilor și de securitate a sistemelor informatice;
- gestionarea incidentelor — detecție, răspuns, documentare;
- continuitatea activității: backup, gestionarea situațiilor de criză, recuperare în caz de dezastru;
- securitatea lanțului de aprovizionare;
- securitate în achiziția, dezvoltarea și întreținerea sistemelor, inclusiv gestionarea vulnerabilităților;
- evaluarea eficacității măsurilor adoptate;
- igienă cibernetică de bază și formarea personalului;
- politici de criptografie și, acolo unde este cazul, de criptare;
- securitatea resurselor umane, controlul accesului și gestionarea activelor;
- autentificare multifactor, comunicații securizate de voce, video și text, sisteme securizate de comunicații de urgență.

La acestea se adaugă obligațiile de raportare din Articolul 23: o alertă timpurie în maximum 24 de ore de la constatarea unui incident semnificativ, o notificare mai detaliată în 72 de ore și un raport final în termen de o lună. În România, autoritatea competentă este Directoratul Național de Securitate Cibernetică (DNSC), iar transpunerea națională s-a realizat prin OUG nr. 155/2024, care include și obligația de înregistrare a entităților vizate.

Un element adesea subestimat: NIS2 stabilește răspunderea organelor de conducere. Managementul trebuie să aprobe măsurile de securitate, să supravegheze implementarea lor și să urmeze instruiri de specialitate. Nu mai este o temă pe care o puteți delega integral departamentului IT.

## Primii pași, în ordinea corectă

1. **Determinați aplicabilitatea în scris.** Codul CAEN, sectorul din anexe, numărul de angajați, cifra de afaceri — documentați concluzia, indiferent care este. Dacă vine o solicitare, veți avea un răspuns argumentat.
2. **Înregistrați-vă la autoritate**, dacă intrați sub incidența directivei.
3. **Faceți un inventar al activelor.** Nu puteți proteja ce nu știți că aveți: servere, stații, aplicații SaaS, conturi privilegiate, furnizori cu acces la rețea.
4. **Realizați o analiză de gap** față de cele zece categorii de măsuri din Articolul 21.
5. **Prioritizați după risc, nu după listă.** MFA pe toate conturile, backup testat după regula 3-2-1, segmentare de rețea și un plan de răspuns la incidente acoperă cea mai mare parte a expunerii reale.
6. **Formalizați.** Politici scrise, responsabilități nominale, instruire periodică, jurnale păstrate. Conformitatea se demonstrează cu documente, nu cu intenții.

## Concluzie

Dacă sunteți o companie medie dintr-un sector listat în anexele directivei, probabilitatea de a intra sub incidența NIS2 este ridicată. Dacă nu intrați direct, veți resimți cerințele prin clienții și partenerii dumneavoastră. În ambele cazuri, măsurile cerute nu sunt exotice — sunt practici de igienă cibernetică pe care o companie modernă ar trebui oricum să le aibă.

Dificultatea reală nu este conceptuală, ci de resurse: puține companii medii au intern timpul și specializarea pentru a parcurge o analiză de aplicabilitate, un gap assessment, implementarea tehnică și documentarea aferentă, în paralel cu operațiunile zilnice. Aici intervine un partener care a trecut deja prin acest proces cu organizații similare și care poate transforma un text legislativ într-un plan de lucru cu etape, responsabili și termene realiste.
