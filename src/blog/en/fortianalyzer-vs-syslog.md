---
title: "FortiAnalyzer vs syslog: Where to Send Your FortiGate Logs"
description: "Logs in the firewall's memory are lost on reboot. We compare the two external destinations — a plain syslog server and FortiAnalyzer — with their benefits, costs and the link to NIS2."
date: 2026-11-25
category: "Network & Fortinet"
tags: ["fortigate", "fortinet", "fortianalyzer", "syslog", "logging", "nis2"]
---
A FortiGate generates valuable logs: who connected, what the firewall blocked, what the IPS detected, when a tunnel dropped. The problem is that, by default, many of them sit in the appliance's memory or on a small local disk with fast rotation. On a reboot, or after a few days, the old logs disappear. And when you need them — after an incident — that's exactly when they're gone.

That's why logs have to be sent **outside** the firewall, to a place with retention. On FortiGate you have two main routes: a generic **syslog** server, or **FortiAnalyzer**, Fortinet's dedicated platform. This article compares the two and helps you choose.

## What syslog is

Syslog is an old, universal standard: the firewall pushes each event, as a line of text, to a server that stores it. The server can be anything — a Linux box with `rsyslog`, a collector from a SIEM (Wazuh, Graylog, ELK), or a cloud service.

The advantage is simplicity and cost: a syslog server is cheap or free and accepts logs from *anything* that produces syslog, not just Fortinet. The downside is that you get raw text. No ready-made reports, no dashboards, no correlation — just the event stream, which you have to process yourself with another tool.

## What FortiAnalyzer is

FortiAnalyzer is an appliance (physical or virtual) built specifically for Fortinet logs. It receives events in a structured form, not as plain text, and understands them: it knows what a session is, what an IPS detection is, what a web filter event is.

On top of that it offers:

- **Native reports** — traffic, threats, usage, compliance — ready to generate or schedule by email.
- **FortiView** — interactive dashboards: top applications, top sources, top threats.
- **Correlation and indicators** — ties events together across devices in the Security Fabric.
- **Long-term retention** with archiving, useful for forensics and audit.

The price of that power is that it's a Fortinet product, with its own licence and sizing, and it's oriented toward the Fortinet ecosystem.

## Head-to-head comparison

| | Syslog | FortiAnalyzer |
|---|---|---|
| Cost | Low or zero | Licence + appliance/VM |
| Log format | Raw text | Structured, natively understood |
| Reports | You build them | Dozens, native and schedulable |
| Dashboards | Via another tool | FortiView included |
| Cross-device correlation | No (without a SIEM) | Yes, in the Security Fabric |
| Supported sources | Any product | Mostly Fortinet |
| Retention / archiving | Depends on your server | Managed, long-term |
| Post-incident forensics | Manual, in text | Structured, fast search |

## When to choose each

**Choose syslog if:**

- You have a small budget and already run an analysis system — an open-source SIEM, an ELK, a Graylog — that receives logs from other sources too.
- You want a single central place for the logs of *all* your devices, not just Fortinet.
- You only need to keep events with retention, not necessarily to analyse them in the vendor's console.

**Choose FortiAnalyzer if:**

- You have a Fortinet fleet (several FortiGates, FortiSwitch, FortiAP) and want a single console that understands them.
- You want native reports and forensics without building everything yourself.
- You need structured, easily searchable evidence for audits.

The two aren't mutually exclusive. Many companies send logs to FortiAnalyzer *and* forward them to a SIEM, so they get both the native reports and centralized correlation with the rest of the infrastructure.

## How to send the logs (CLI)

To a syslog server:

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

To FortiAnalyzer:

```
config log fortianalyzer setting
  set status enable
  set server "10.10.40.20"
  set upload-option realtime
end
```

Whatever the destination, make sure logging is also enabled on the firewall policies (`set logtraffic all`) and on the implicit deny, otherwise you send only part of the picture.

## The link to SIEM

If you already run a [SIEM such as FortiSIEM](/en/blog/ce-este-fortisiem/) or a Wazuh collector, syslog is the natural path: the FortiGate pushes events to the collector, where they are normalized and correlated with logs from servers, endpoints and M365. FortiAnalyzer can also act as a source for a SIEM, not just as a final console.

## How it maps to NIS2

The [NIS2](/en/nis2/) directive requires, under Article 21, capabilities for **logging, detection and post-incident analysis**. In practice, that means two things the firewall's memory can't provide: **retention** (logs must still exist weeks or months later, when you investigate an incident) and **search** (you must be able to reconstruct the timeline). Both syslog with retention and FortiAnalyzer meet the requirement; they differ only in how much manual work is left for you.

## Conclusion

The rule that doesn't change: **logs don't stay in the firewall**. Send them out, to a place with retention. If you want simple, cheap and integrated with an existing SIEM — syslog. If you have a Fortinet fleet and want native reports, dashboards and forensics — FortiAnalyzer. The most mature infrastructures use both.

If you aren't sure your logs land somewhere with retention — or you want to correlate them in a SIEM — the NCS team designs and implements exactly these architectures. The first consultation is free.
