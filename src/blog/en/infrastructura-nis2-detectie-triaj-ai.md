---
title: "A Complete NIS2 Infrastructure: From Firewall to AI Incident Triage"
description: "What a real NIS2 infrastructure looks like — Fortinet segmentation, a Linux-based SIEM, a honeypot for early detection, and AI triage that turns alerts into readable tickets. Mapped to Article 21."
date: 2026-11-18
category: "NIS2 Compliance"
tags: ["nis2", "fortinet", "siem", "wazuh", "honeypot", "securitate"]
---
Most organisations that fall under NIS2 already have a firewall and an antivirus. The problem is that the directive doesn't only ask you to defend yourself — it asks you to **detect**, **handle** and **report** incidents, within strict deadlines. This is where most infrastructures stop short: the alerts exist somewhere, but nobody sees them, nobody interprets them, and nobody knows which ones actually matter.

A serious NIS2 infrastructure is not a single product. It is a chain of layers working together: the perimeter that segments and blocks, the platform that sees and correlates everything, the trap that catches the attacker early, and finally the layer that turns noise into decisions. Below we describe exactly this architecture, the way we run it in production, and how each component maps to the requirements of Article 21.

## Layer 1 — Perimeter and segmentation: Fortinet Security Fabric

The network remains the foundation. A **FortiGate** as a next-gen firewall, managed **FortiSwitches** and **FortiAP** access points don't just mean "filtered internet." They mean a **segmented** network: accounting can't reach the servers, guest devices never touch the internal network, and a compromised workstation can't move laterally toward everything that matters.

Because they all run inside the same Security Fabric, the devices share information with one another: a signal detected on an endpoint can trigger an action on the firewall. This segmentation and access control directly covers the **network security** requirements of NIS2 Art. 21(2)(d) and (e).

## Layer 2 — Visibility and detection: a Linux-based SIEM (Wazuh)

A firewall sees the traffic that passes through it. It doesn't see what happens *inside* the servers and workstations. For that you need a **SIEM** — a platform that collects logs from across the infrastructure, normalises them and correlates them.

We run a mature open-source SIEM (**Wazuh**) on a dedicated Linux server, with its own storage for log retention. Agents installed on workstations and servers continuously send events: logins, changes to critical files, suspicious processes, configuration changes. The SIEM links together seemingly unrelated events and flags the patterns that indicate an attack.

This is the foundation for **logging, detection and post-incident analysis** — exactly the capabilities required by Art. 21(2)(f) and (g), without which you cannot meet notification deadlines.

## Layer 3 — Early breach detection: a honeypot

The problem with any SIEM is noise. Thousands of legitimate events a day, from which you must extract the few that matter. A **honeypot** elegantly solves part of this problem.

We place decoys (**OpenCanary**) inside the network — fake services that look like real targets: a file server, a database, an admin panel. No legitimate user ever has a reason to touch them. That is why **any** interaction with such a decoy is a high-confidence signal: someone is probing the network. It isn't one alert among thousands — it is near-certain proof of a breach in progress, often long before the attacker reaches anything real.

Early incident detection is the heart of Art. 21(2)(g) and the practical condition for meeting the 72-hour notification deadline.

## Layer 4 — AI triage of alerts: the differentiator

This is where traditional infrastructure ends and the part few companies actually have begins. A raw SIEM alert is cryptic: codes, IP addresses, rule names. Someone has to read it, work out whether it's real, how serious it is and what to do. At night, on weekends, during holidays — that's where most teams fall down.

We built an **AI triage layer** on top of the SIEM. Every significant alert first passes through a **local language model** (Ollama, run on our own infrastructure so that sensitive logs never leave the controlled environment) and, for deeper interpretation, through **Claude**. The output is no longer a log line, but a **readable ticket**:

- what happened, explained in plain language;
- the estimated severity and whether it needs immediate action;
- the recommended remediation steps.

The ticket lands automatically in the **NCS ticketing app**, where the team picks it up, tracks it and closes it. The alert no longer gets lost in a dashboard nobody reads — it becomes a task with context, priority and history. This **incident handling** capability is explicitly required by Art. 21(2)(b).

## How it all maps to NIS2

In short, the mapping to [NIS2](/en/nis2/) Article 21 looks like this:

- **Segmentation and access control (Fortinet)** → network security, 21(2)(d, e);
- **Linux-based SIEM (Wazuh)** → logging, detection, post-incident analysis, 21(2)(f, g);
- **Honeypot (OpenCanary)** → early breach detection, 21(2)(g);
- **AI triage → ticket** → incident handling and management, 21(2)(b).

None of these pieces makes you compliant on its own. Together, though, they cover exactly the chain the directive asks for: **to see, to understand, to react, and to be able to prove** that you did.

## What you should know first

Infrastructure like this is not "install and forget." Three things matter more than the products:

**Someone has to react.** Even with AI triage, a ticket only has value if there is a team to pick it up. Continuous monitoring requires either dedicated in-house staff or an external managed service.

**Tuning takes time.** In the first weeks, any SIEM generates irrelevant alerts. The AI layer sharply reduces this noise, but tuning remains a process, not a moment.

**Data confidentiality matters.** That is why we use a local model for the first pass over sensitive logs — the raw data stays in the controlled environment, and only what's necessary for interpretation leaves it.

## Conclusion

NIS2 doesn't ask for the most expensive equipment — it asks for a **real capability**: to detect an incident, understand it and react in time. The architecture described here — a Fortinet perimeter, a Linux SIEM, a honeypot for early detection and AI triage that turns alerts into tickets — is how we make that capability accessible even to companies that can't afford a security operations centre of their own.

If you're preparing for NIS2 or want to know how far along you are, start with our [free compliance checker](/en/nis2/) or book a conversation with the NCS team. The first consultation is free.
