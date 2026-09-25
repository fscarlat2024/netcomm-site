---
title: "Why You Need a Segmented Fortinet Firewall, Not Just a Router"
description: "A router gives you connectivity; a firewall gives you control. Learn why network segmentation with FortiGate cuts ransomware risk and supports NIS2 compliance."
date: 2026-09-25
category: "Network & Fortinet"
tags: ["fortinet", "firewall", "segmentare", "vlan", "securitate retea"]
---
Many Romanian companies still run on a flat network: an ISP-provided router, a switch or two, and every device — workstations, servers, printers, security cameras, IP phones, employee smartphones — sharing the same address space. It works. Right up until the day it doesn't.

The difference between a router and a next-generation firewall isn't about brand or budget. It's a difference in purpose: a router exists to move packets as fast as possible, while a firewall exists to decide which packets deserve to move at all. Segmentation is what makes that decision genuinely effective.

## What your ISP router actually does

A typical router handles three jobs: routing traffic to the internet, applying NAT, and maybe filtering a few ports. Many advertise a built-in "firewall", which in practice means a basic list of rules based on IP addresses and ports.

The problem is that modern attacks no longer look like they did ten years ago. Malicious traffic arrives encrypted over HTTPS, on port 443 — the same port everyone uses to do their job. A phishing link clicked by an employee, a macro embedded in a document, an IoT device running outdated firmware: none of these vectors are stopped by a port-based rule.

Worse, the router sees nothing at all of internal traffic. Once an attacker compromises a single workstation in the finance department, they can move freely toward the file server, the backup NAS, the domain controller. This is called lateral movement, and it's the step that turns a minor incident into a business crisis.

## Segmentation: from one network to several controlled zones

Segmentation means dividing the network into logical zones, separated by VLANs, each governed by its own access rules. A Fortinet firewall (FortiGate) becomes the enforcement point through which inter-zone traffic must pass, applying explicit policy.

A typical SMB layout looks like this:

- **User zone** — employee workstations;
- **Server zone** — business applications, ERP, file shares, Active Directory;
- **Backup zone** — backup infrastructure, strictly isolated;
- **OT / IoT zone** — cameras, access control, sensors, production equipment;
- **Guest zone** — visitor Wi-Fi with internet-only access;
- **VPN zone** — remote access for staff and third-party vendors.

The guiding principle is simple: deny everything by default, then explicitly allow only the flows the business actually needs. Workstations need file server access over SMB — so that flow is permitted, and nothing more. Security cameras have no business talking to the accounting server — so they don't.

## What you gain in practical terms

### Containment when something goes wrong

If ransomware lands on a workstation in a flat network, it reaches everything that's shared. In a segmented network, the blast radius is confined to that zone. Backups stay intact — and an intact backup is the difference between a day of recovery and a week of negotiating with attackers.

### Real traffic inspection

A FortiGate can apply SSL inspection, web filtering, application control, IPS and gateway antivirus. In other words, it can see *what* is happening in the traffic, not just *where* it's headed. Continuously updated threat feeds allow command-and-control domains to be blocked before malware ever receives instructions.

### Visibility and evidence

Detailed logs — who, when, which resource — are essential both for incident investigation and for audit. A router can't tell you what a user accessed three weeks ago. A properly configured firewall with log retention can.

### Controlled remote access

VPN with multi-factor authentication and zone-scoped permissions replaces the risky habit of exposing RDP directly to the internet — still one of the most common paths to compromise.

## The NIS2 connection

For organisations in scope of the NIS2 Directive, Article 21 requires technical measures proportionate to risk: network security policies, access control, incident handling, business continuity. Segmentation isn't just good engineering practice — it's concrete evidence for an auditor that access is controlled and risk is limited by design.

Even if your organisation isn't directly in scope, you are very likely a supplier to someone who is. Requirements propagate along the supply chain.

## Where to start

You don't need an overnight rebuild. A realistic path looks like this:

1. **Inventory** — what devices exist on the network and what talks to what;
2. **Zone design** — logical grouping by function and risk level;
3. **Gradual rollout** — start with high-risk zones: guest, IoT, backup;
4. **Restrictive policy** — deny by default, then grant explicitly;
5. **Monitoring** — centralised logs, alerting, periodic rule review.

The most commonly skipped step is the last one. A temporary rule added "just for testing" tends to survive for years and eventually becomes the exact opening someone walks through.

## Conclusion

A router connects you to the internet. A segmented firewall lets you decide what happens inside your own network — and limits the damage when something goes wrong, because sooner or later something will.

Designing zones correctly, configuring policy and maintaining it over time takes experience and operational discipline. If you're wondering what your network actually looks like today, and what realistic segmentation would mean for your existing infrastructure, an initial technical assessment is the right place to begin.
