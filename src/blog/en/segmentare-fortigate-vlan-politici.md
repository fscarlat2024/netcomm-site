---
title: "Network Segmentation on FortiGate: VLANs and Policies From Scratch"
description: "How to split your network into separate zones on a FortiGate: the seven VLANs, the access matrix between them, the correct policy order, and how to migrate without downtime. Configuration examples for FortiOS 7.x."
date: 2026-11-23
category: "Network & Fortinet"
tags: ["fortigate", "fortinet", "vlan", "segmentare", "firewall", "nis2"]
---
A network where PCs, printers, cameras, servers and backup all sit in the same VLAN is a network where a single compromised device can reach every one of them. In practice, most of the ransomware incidents we see at small and mid-sized companies don't start on the server. They start on an IP camera with old firmware, on a printer with the factory password, or on an employee's laptop.

From there, the attacker meets no further obstacle on the way to the accounting server and, worse, to the backup. When the backup is encrypted along with the data, the company has nothing left to recover from.

This article shows how to split your network into separate zones on a FortiGate firewall, what rules to put between them, in what order to place them, and how to make the transition without stopping work. The principles apply the same way to any business-grade firewall; the configuration examples are for FortiOS 7.x.

## Why segment: the bank model

Think of a bank branch. Customers wait in the lobby. Staff work in back offices that customers only reach through a teller window. The vault is closed to everyone, and the vault clerk is the one who steps out to collect cash from the tellers. Nobody walks into the vault with a request.

Network segmentation applies exactly this logic:

- **The lobby** = the user network and the guest network.
- **The offices** = the servers, reachable only through the application "teller windows" (the ports that are actually needed).
- **The vault** = the backup. Nobody reaches it; the backup server pulls the data from the servers itself.
- **The lobby guard** = the firewall, which decides who moves from one room to another.

One important limit: the firewall only sees traffic that crosses *between* VLANs. Two devices in the same VLAN talk directly through the switch, never passing the guard. That is why splitting into VLANs is the baseline condition: any firewall rule only acts at the boundary between zones.

## The seven zones

For a typical company of 10–100 employees, seven zones cover almost any situation. The IDs and addresses below are only an example; what matters is that each zone has its own VLAN and subnet.

| Zone | VLAN | Subnet (example) | What it holds |
|---|---|---|---|
| MANAGEMENT | 10 | 10.10.10.0/24 | Management interfaces of switches, APs, UPSs; the administrator's PC |
| USERS | 20 | 10.10.20.0/24 | Employee PCs and laptops |
| SERVERS | 30 | 10.10.30.0/24 | Application server (ERP, accounting), file server, domain controller |
| BACKUP | 40 | 10.10.40.0/24 | Backup server (e.g. Veeam), the NAS or the backup repository |
| PRINTERS | 50 | 10.10.50.0/24 | Printers and multifunction devices |
| IOT | 60 | 10.10.60.0/24 | IP cameras, NVR, access control, sensors, TVs, smart systems |
| GUEST | 70 | 10.10.70.0/24 | Wi-Fi for visitors and personal devices |

The management zone is the one most often forgotten. Without it, the web interface of a switch or a printer sits in the same network as the users and can be attacked directly from any compromised laptop.

## The access matrix: who talks to whom

The base rule: anything not explicitly allowed is denied. Each zone gets access only on the ports it needs to function. Read the table by rows: from the zone on the left, toward the zone in the column header.

| From ↓ / To → | SERVERS | BACKUP | PRINTERS | IOT | INTERNET |
|---|---|---|---|---|---|
| **MANAGEMENT** | Administration (RDP, HTTPS, SSH) | Administration | HTTPS | HTTPS | Yes |
| **USERS** | Only application ports (ERP, RDP, SMB on shares) | No | Printing only (9100, 631, 515) | NVR viewing only | Yes, with full inspection |
| **VPN** | Like users, but more restricted | No | No | No | — |
| **SERVERS** | — | Backup data transfer only | No | No | Updates only (HTTPS, DNS, NTP) |
| **BACKUP** | Backup agent ports | — | No | No | Updates and offsite copy only |
| **PRINTERS** | SMB only to the scan share | No | — | No | HTTP/S, DNS, SMTP for scan-to-email |
| **IOT** | No | No | No | — | Manufacturer cloud only, or none at all |
| **GUEST** | No | No | No | No | Yes, with web filtering |

Three principles emerge from the table:

- **The backup accepts connections from no one** except the administrator. It initiates the connections to the servers (the "pull" model).
- **IoT, printers and guest initiate nothing** toward the internal zones. They are the devices with the weakest security, so they are treated as "dirty zones".
- **Scanning goes to a share on the server**, not to the users' PCs. One rule instead of one per PC.

## Policies, top to bottom

FortiGate reads policies top to bottom and applies the first one that matches. The order is not a detail: a broad rule placed too high cancels every strict rule below it. The correct order runs from specific to general, in four blocks: blocks, inter-zone access, explicit denies, and the exit to the internet.

### Block A — global blocks

| # | Name | From | To | Services | Action |
|---|---|---|---|---|---|
| 1 | BLOCK-Quarantine | Quarantined devices | Anywhere | ALL | Deny |
| 2 | BLOCK-Geo-Inbound | Internet, unwanted countries | Any published service | ALL | Deny |

### Block B — allowed inter-zone access

| # | Name | From | To | Services | Action |
|---|---|---|---|---|---|
| 3 | MGMT-to-ALL | MANAGEMENT | All internal zones | RDP, HTTPS, SSH | Accept |
| 4 | BACKUP-to-SERVERS | BACKUP | SERVERS | Backup agent ports | Accept |
| 5 | SERVERS-to-BACKUP | SERVERS | BACKUP | Data transfer ports only | Accept |
| 6 | USERS-to-SERVERS | USERS | SERVERS | Application ports, SMB on the file server | Accept |
| 7 | VPN-to-SERVERS | VPN tunnel (user group) | SERVERS | RDP + application ports | Accept |
| 8 | USERS-to-PRINTERS | USERS | PRINTERS | TCP 9100, 631, 515 | Accept |
| 9 | PRINTERS-to-SCAN | PRINTERS | The scan share on the server | SMB (445) | Accept |
| 10 | USERS-to-NVR | USERS (or a restricted group) | NVR in IOT | Viewing application ports | Accept |

### Block C — explicit denies, with logging

| # | Name | From | To | Services | Action |
|---|---|---|---|---|---|
| 11 | DENY-to-BACKUP | All zones | BACKUP | ALL | Deny |
| 12 | DENY-IOT-to-INTERNAL | IOT | All internal zones | ALL | Deny |
| 13 | DENY-PRINTERS-to-INTERNAL | PRINTERS | All internal zones | ALL | Deny |
| 14 | DENY-GUEST-to-INTERNAL | GUEST | All internal zones | ALL | Deny |

These rules look redundant, because FortiGate blocks everything that isn't allowed at the end anyway. Their point is different: they have a name and their own log. When a camera tries to reach a server, you see in the log exactly the rule "DENY-IOT-to-INTERNAL", not an anonymous "implicit deny". That is the difference between spotting an attack and missing it.

### Block D — exit to the internet, one policy per zone

| # | Name | From | To | Services | Action |
|---|---|---|---|---|---|
| 15 | USERS-to-WAN | USERS | Internet | ALL | Accept + AV, IPS, web filter, DNS filter, NAT |
| 16 | SERVERS-to-WAN | SERVERS | Internet | HTTPS, DNS, NTP | Accept + AV, IPS, NAT |
| 17 | BACKUP-to-WAN | BACKUP | Internet (offsite destination) | HTTPS + offsite copy port | Accept + NAT |
| 18 | PRINTERS-to-WAN | PRINTERS | Internet | HTTP, HTTPS, DNS, SMTP | Accept + NAT |
| 19 | IOT-to-WAN | IOT | Manufacturer cloud only | HTTPS | Accept + NAT (or missing entirely) |
| 20 | GUEST-to-WAN | GUEST | Internet | HTTP, HTTPS, DNS | Accept + web filter, NAT |
| — | Implicit deny | Any | Any | ALL | Deny, with logging enabled |

## Rules that apply to every policy

- **No NAT between VLANs.** NAT only toward the internet. Otherwise the server sees every connection as coming from the firewall, and during an incident you no longer know which PC it started from.
- **Log everything** (`logtraffic all`), including on the implicit deny (`fwpolicy-implicit-log enable`).
- **Inspection (AV + IPS) on everything entering SERVERS and BACKUP**, not just on what goes out to the internet.
- **Never service ALL between internal zones**, except management.

## Configuration example

One access policy (rule 8) and one explicit deny (rule 12):

```
config firewall service custom
  edit "PRINT"
    set tcp-portrange 9100 631 515
  next
end

config firewall policy
  edit 8
    set name "USERS-to-PRINTERS"
    set srcintf "VLAN20-USERS"
    set dstintf "VLAN50-PRINTERS"
    set srcaddr "VLAN20-USERS address"
    set dstaddr "VLAN50-PRINTERS address"
    set action accept
    set schedule "always"
    set service "PRINT"
    set logtraffic all
    set nat disable
  next
  edit 12
    set name "DENY-IOT-to-INTERNAL"
    set srcintf "VLAN60-IOT"
    set dstintf "VLAN10-MGMT" "VLAN20-USERS" "VLAN30-SERVERS" "VLAN40-BACKUP" "VLAN50-PRINTERS"
    set srcaddr "all"
    set dstaddr "all"
    set action deny
    set schedule "always"
    set service "ALL"
    set logtraffic all
  next
end
```

Policies created from the CLI with `edit <ID>` don't automatically fall into ID order. Check the position in the GUI (Policy & Objects → Firewall Policy) and adjust it with `move <ID> before <ID>`.

## Rolling it out without downtime

Segmenting a network that already works is like renovating with the shop open. The order of the steps matters more than the rules themselves.

1. **Prepare the ground.** Save the FortiGate configuration, set a maintenance window, and make sure you have serial console access in case you lock yourself out.
2. **Inventory the flows.** Which applications the users use, on what ports, where the printers scan, what the backup does. Anything not in the inventory will be blocked.
3. **Create the VLANs** on the FortiGate and on the switch (trunk toward the firewall, access ports for the devices), with DHCP on each. You don't move anything yet.
4. **Create the objects:** addresses, address groups, custom services (the accounting application, backup, print).
5. **Create the access policies before moving anything.** When a device lands in the new VLAN, the rules are already waiting for it.
6. **Move devices from lowest risk to highest:**
   1. **IoT** — if something breaks, business doesn't stop.
   2. **Printers** — rebuild the print ports on PCs (manually, via GPO or a script).
   3. **Backup** — run a test job right after moving.
   4. **Servers** — during the maintenance window.
   5. **Users** — last, department by department.
7. **Monitor for a week.** In Log & Report → Forward Traffic, filter by `action = deny`. Any legitimate flow that shows up there becomes a rule.
8. **Tighten the screw.** Add the explicit denies from block C, delete the old broad policies (all → all, service ALL), and disable NAT between VLANs.
9. **Test like an attacker.** From a device in IOT and one in GUEST, try to reach the servers, the backup and the firewall's management interface. Everything must be blocked and show up in the log.

## Common mistakes

- A "temporary" **all → all** policy for troubleshooting, left above the others. It cancels the entire segmentation. If you need one, give it a schedule with an expiry date.
- The backup in the same VLAN as the servers or, worse, as the users. Ransomware encrypts everything it sees, including the backup.
- Cameras left in the server network because "there was room there".
- The firewall's management interface reachable from every VLAN. It should be allowed only from MANAGEMENT, and the admin account should have `trusthost` and 2FA.
- MAC-based addresses in policies. A MAC is spoofed in seconds; use DHCP reservations and port security on the switch.

## Final checklist

- ☐ Each zone has its own VLAN and subnet
- ☐ The MANAGEMENT zone exists and is the only place from which equipment is administered
- ☐ The backup accepts connections only from management
- ☐ IoT, printers and guest initiate nothing toward the internal zones
- ☐ No policy between internal zones uses service ALL (exception: management)
- ☐ NAT disabled between VLANs
- ☐ Explicit denies with names and logging, above the exit to the internet
- ☐ Logging enabled on all policies and on the implicit deny
- ☐ Logs are sent somewhere with retention (FortiAnalyzer, syslog), not just the firewall's memory
- ☐ Internal penetration test from IOT and GUEST, with a "blocked" result

## Conclusion

Segmentation doesn't stop an attack from starting. It stops it from spreading. A compromised camera in a segmented network stays a compromised camera; in a flat network it becomes an incident that shuts the company down. For companies that fall under [NIS2](/en/nis2/), segmentation and access control between zones are also a requirement auditors check explicitly.

If you have a flat network and want to segment it without stopping work, the NCS team has made this transition in production, on Fortinet infrastructure, many times over. The first consultation is free.
