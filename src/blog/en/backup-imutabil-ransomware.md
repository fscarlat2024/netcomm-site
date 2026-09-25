---
title: "Immutable backup: the only copy that survives a ransomware attack"
description: "A regular backup can be wiped by attackers along with your data. Here's what immutability means, the 3-2-1-1-0 rule, and how it ties into NIS2 compliance."
date: 2026-09-25
category: "Backup & Continuity"
tags: ["ransomware", "backup", "NIS2", "business continuity"]
---

Most companies believe they are protected because they "have backups". The problem is that an ordinary backup, permanently connected to the network, is exactly the first target of a modern ransomware attack. Attackers don't just encrypt production files — they actively hunt down and destroy backup copies, so you have nothing to restore from.

This is where **immutable backup** comes in: a copy that, once written, cannot be modified or deleted by anyone — not by a compromised administrator, not by malware — for a defined period.

## Why a "normal" backup isn't enough

A classic backup on a network NAS or an accessible share has three weaknesses:

- **It's accessible.** If an administrator account is compromised, the attacker reaches the backup too.
- **It can be altered.** Ransomware can encrypt or delete backup files just like production files.
- **It has no integrity proof.** You don't know whether the last "good" copy is still good.

The result: many organisations discover, mid-crisis, that the only available copy was encrypted as well.

## What immutability means

An immutable repository uses **WORM** technology (Write Once, Read Many): data is written once and locked for a configured retention period — for example 14 or 30 days. During that window the copy **cannot be deleted or overwritten**, regardless of the privileges of the account attempting it.

Even if the attacker gains full control of the infrastructure, the immutable copy stays intact and available for restore.

## The 3-2-1-1-0 rule

The modern backup standard is no longer plain "3-2-1" but **3-2-1-1-0**:

- **3** copies of your data;
- on **2** different media types;
- with **1** copy offsite;
- of which **1** is immutable or offline (air-gapped);
- and **0** errors on restore verification.

That final "0" is essential and most often ignored: a backup that has never been tested isn't a backup — it's an assumption.

## The NIS2 connection

The **NIS2** directive explicitly requires business continuity measures and backup management (Art. 21). For in-scope entities, a backup plan that includes immutability and regular restore testing is no longer an optional best practice — it's part of the compliance obligations. Documenting these measures matters as much as implementing them.

## What you can do right now

1. Add at least one immutable copy to your backup strategy (a local or cloud WORM repository).
2. Set a retention period that covers the average time to detect an attack (often weeks).
3. **Test the restore** regularly, not just the backup.
4. Document everything for the NIS2 audit.

Immutability doesn't prevent the attack — but it guarantees you have something to come back to when it happens. That's the difference between a bad day and a business that stops.
