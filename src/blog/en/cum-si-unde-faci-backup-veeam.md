---
title: "How and Where Should You Back Up? Is Veeam the Right Solution?"
description: "A practical guide on how and where to back up: the 3-2-1 rule, immutable copies, regular restore testing and where Veeam fits in your strategy."
date: 2026-10-13
category: "Backup & Continuity"
tags: ["backup", "veeam", "3-2-1", "disaster recovery", "ransomware"]
---
In management meetings, the question “do we have backups?” almost always gets a quick “yes”. The better question is different: “when did we last restore, how long did it take, and how much data did we lose?” The gap between those two answers is usually the gap between a company that resumes operations within hours and one that loses days of production, invoicing and customer trust.

This article walks through the logic of a backup strategy that actually works: what to protect, where to keep the copies, how to defend them against ransomware, and where Veeam — one of the most widely deployed data protection platforms — fits in.

## Start with business questions, not with technology

Before choosing a product, define two values for every critical system:

- **RPO (Recovery Point Objective)** — how much data you can afford to lose, measured in time. If you run a single nightly backup, your real RPO is up to 24 hours.
- **RTO (Recovery Time Objective)** — how quickly the system must be operational again. An ERP driving production has a completely different RTO than an archive server.

These two numbers drive architecture, budget and technology choices. Without them, any discussion about “which backup solution to buy” is premature.

## What belongs in the backup scope

A common mistake is protecting only file servers while other essential components remain exposed. Inventory the following:

- virtual machines (VMware, Hyper-V, Proxmox) and physical servers;
- databases — SQL Server, PostgreSQL, MySQL — with application-consistent backups, not just disk-level copies;
- Microsoft 365 data: Exchange Online, SharePoint, OneDrive, Teams. Microsoft guarantees platform availability, but under the shared responsibility model your data remains your responsibility;
- network device and firewall configurations;
- user workstations that store working documents locally;
- business-critical SaaS applications.

## Where to keep the copies: the 3-2-1 rule and its evolution

The classic 3-2-1 rule remains the baseline: **3 copies** of your data, on **2 different media types**, with **1 kept off-site**. In the ransomware era, it is commonly extended to **3-2-1-1-0**: one additional **immutable or offline** copy, plus **zero errors** during restore verification.

In practice, a balanced architecture for a mid-sized company looks like this:

1. **A primary local copy**, on dedicated backup storage (a NAS or a physical server separate from production), enabling fast restores.
2. **A secondary copy** in a different location — another office, a datacenter or a cloud provider — covering fire, flood, theft or full compromise of the main site.
3. **An immutable copy** that cannot be deleted or altered before its retention period expires, not even by an administrator with stolen credentials.

One critical detail: the **backup repository should not be a member of the same Active Directory domain** as your production environment, and it should not be reachable with the same accounts. Attackers go after backups first, precisely to eliminate any alternative to paying the ransom.

## Where Veeam fits in

Veeam became a de facto standard for protecting virtualized environments and today covers a far broader scope. The differentiators that matter most for a mid-sized organization:

- **Broad coverage**: VMware vSphere, Hyper-V, Windows and Linux physical servers, Microsoft 365, databases and cloud workloads, all from a single console.
- **Granular recovery**: restore a single file, a mailbox or an Active Directory object without rebuilding an entire virtual machine.
- **Instant Recovery**: boot a VM directly from the backup repository, dramatically reducing RTO during major incidents.
- **Automated restore verification**: Veeam can periodically spin up backups in an isolated environment and confirm they are usable — exactly the “zero errors” part of 3-2-1-1-0.
- **Immutability support**: on hardened Linux repositories or S3-compatible object storage with Object Lock.

Is Veeam “the best” solution? The honest answer is that it is a very mature platform, well suited to most mixed environments — but the real value comes from **how it is designed and operated**. A misconfigured Veeam license, with no off-site copy and no testing, offers the same protection as having none at all: an illusion.

## Mistakes that cancel out any backup investment

- **Never testing restores.** A job reporting “Success” does not prove the data is usable. Schedule documented quarterly restore tests.
- **Keeping every copy on the same network.** An attack that encrypts production will also encrypt a NAS reachable over SMB with the same credentials.
- **Insufficient retention.** Some breaches are discovered weeks later. With only 7 days of retention, you will restore already-compromised data.
- **No monitoring.** Jobs failing silently for months is far more common than it should be.
- **Leaving Microsoft 365 unprotected**, based on the false assumption that “it is in the cloud, so it is backed up”.
- **No written recovery plan**, with steps, owners and a priority order for systems.

## Backup as a compliance requirement

For organizations in scope of the [NIS2](/en/nis2/) Directive, business continuity and crisis management are explicit requirements within the risk management measures (Art. 21). That means documented backup policies, recovery procedures, testing, and evidence that the mechanisms actually work. An untested backup is not only an operational risk — it is a compliance gap any audit will flag immediately.

## Conclusion

Good backup is not a product, it is a process: clearly defined scope, multiple copies in separate locations, at least one immutable, continuous monitoring and regular restore testing. Veeam is an excellent tool to support that process, but the outcome depends on architecture and operational discipline.

If you cannot say with confidence how long it would take to bring your critical systems back online today, or if your last tested restore is a vague memory, it is worth reviewing your setup with a team that designs and operates such architectures daily. A backup strategy audit costs far less than a single day of downtime.
