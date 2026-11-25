---
title: "How to Configure a Site-to-Site IPsec VPN on FortiGate"
description: "A practical guide: how to link two offices through an encrypted IPsec tunnel on FortiGate — Phase 1, Phase 2, firewall policies, routes and verification. Plus the mistakes that keep the tunnel down."
date: 2026-11-25
category: "Network & Fortinet"
tags: ["fortigate", "fortinet", "vpn", "ipsec", "retea", "nis2"]
---
Two offices of the same company that need to use the same servers, the same ERP, the same shares. The bad solution is to publish the server straight onto the internet and pray. The right solution is a permanent encrypted tunnel between the two networks, through which traffic flows as if the sites were in the same building. On FortiGate, that is a site-to-site IPsec VPN.

This article shows how to configure it from scratch, what policies and routes it needs to work, how to check that it's up, and what mistakes keep it down. The examples are for FortiOS 7.x.

## Site-to-site vs client VPN

Don't confuse the two VPN types on FortiGate:

- **Client VPN (SSL VPN / IPsec dial-up)** — an employee connects from a laptop, from anywhere, to the company network. One person, one session.
- **Site-to-site VPN** — two *firewalls* keep a permanent tunnel between them. Every device in one office reaches the other office automatically, without installing anything.

This article is about the second. Both ends are two FortiGates (or a FortiGate and another IPsec-compatible firewall).

## What you need first

- **A public address at both ends** — a static IP, or a dynamic FQDN (FortiDDNS) if one of the sites has a dynamic IP.
- **Different LAN subnets** at the two ends. If both sites use `192.168.1.0/24`, the tunnel can't route — it's the most common pitfall. One site on `192.168.10.0/24`, the other on `192.168.20.0/24`.
- **Admin access** on both FortiGates.
- **A shared pre-shared key**, generated strongly (not "1234").

| | Site A (HQ) | Site B (branch) |
|---|---|---|
| Public IP (WAN) | 203.0.113.10 | 198.51.100.20 |
| LAN | 192.168.10.0/24 | 192.168.20.0/24 |
| WAN interface | wan1 | wan1 |

## The two IPsec steps: Phase 1 and Phase 2

An IPsec tunnel is negotiated in two phases, and both must match **identically** at the two ends, or the tunnel won't come up:

- **Phase 1 (IKE)** — establishes identity and the secure channel: the remote address, the pre-shared key, the IKE version (prefer IKEv2), the encryption/hash algorithms and the DH group.
- **Phase 2 (IPsec)** — defines *which traffic* enters the tunnel: the local subnet and the remote subnet, plus the algorithms for the actual data.

The simplest route is the GUI wizard: **VPN → IPsec Wizard → Site to Site**. You pick the template, enter the remote IP, the pre-shared key and the two subnets. The wizard automatically creates Phase 1, Phase 2, the firewall policies and the route. But it matters that you understand what it creates, because troubleshooting happens on the components.

## Firewall policies and routes

The tunnel alone does nothing. FortiGate also needs:

- **Two firewall policies** — one allowing local_LAN → tunnel → remote_LAN, and one in the reverse direction. Without the return policy, connections start but get no reply.
- **A static route** that says "for the remote subnet, exit through the tunnel interface".
- **NAT disabled** on these policies. Traffic between sites must keep its real addresses; with NAT, site B would see all traffic as coming from the firewall, not from the actual PC.

Exactly as with internal segmentation, [the golden rule stands: no NAT inside your own network](/en/blog/segmentare-fortigate-vlan-politici/), NAT only toward the internet.

## Configuration example (end A)

```
config vpn ipsec phase1-interface
  edit "vpn-site-B"
    set interface "wan1"
    set ike-version 2
    set peertype any
    set proposal aes256-sha256
    set dhgrp 14
    set remote-gw 198.51.100.20
    set psksecret <strong-pre-shared-key>
  next
end

config vpn ipsec phase2-interface
  edit "vpn-site-B-p2"
    set phase1name "vpn-site-B"
    set proposal aes256-sha256
    set src-subnet 192.168.10.0 255.255.255.0
    set dst-subnet 192.168.20.0 255.255.255.0
  next
end

config firewall policy
  edit 0
    set name "A-to-B"
    set srcintf "internal"
    set dstintf "vpn-site-B"
    set srcaddr "LAN-A"
    set dstaddr "LAN-B"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set nat disable
  next
  edit 0
    set name "B-to-A"
    set srcintf "vpn-site-B"
    set dstintf "internal"
    set srcaddr "LAN-B"
    set dstaddr "LAN-A"
    set action accept
    set schedule "always"
    set service "ALL"
    set logtraffic all
    set nat disable
  next
end

config router static
  edit 0
    set dst 192.168.20.0 255.255.255.0
    set device "vpn-site-B"
  next
end
```

At end B you configure the mirror image: `remote-gw` = 203.0.113.10, local subnet `192.168.20.0/24`, remote `192.168.10.0/24`, the same IKE version, the same algorithms, the **same** pre-shared key.

## Verification

Once the tunnel is up, a ping from a PC in site A to a server in site B should go through. On the FortiGate, you check the real state:

```
diagnose vpn tunnel list
get vpn ipsec tunnel summary
```

If the tunnel shows `up` but no traffic passes, the problem is almost always the policies or the routes, not IPsec. If it doesn't come up at all (`down`), the problem is Phase 1/Phase 2 — a mismatched algorithm or key. The live log helps:

```
diagnose debug application ike -1
diagnose debug enable
```

## Common mistakes

- **Identical LAN subnets at both ends.** If both sites are on `192.168.1.0/24`, no route can work. Renumber one end before you start.
- **Mismatched Phase 1/Phase 2.** A different IKE version, a different DH group, a different algorithm, a different pre-shared key — any one of these keeps the tunnel down. Set them identically and prefer IKEv2 + AES-256.
- **Missing return policy or route.** Tunnel `up`, but zero traffic. Always check both directions.
- **NAT left enabled** on the tunnel policies. It breaks visibility and can block applications.
- **Weak pre-shared key.** A site-to-site tunnel is a target exposed on the internet. Generate a long, random key, and keep it in a vault, not in email.

## How it maps to NIS2

The [NIS2](/en/nis2/) directive requires, under Article 21, measures for securing communications, including **encrypting** traffic where appropriate. A site-to-site IPsec VPN solves exactly that for the link between offices: data between sites no longer travels in the clear over the internet, but through an AES-256 encrypted tunnel with identity verified at both ends. In addition, logging the tunnel traffic (`logtraffic all`) covers the visibility requirement.

## Conclusion

A site-to-site IPsec VPN isn't complicated if you look at it by component: Phase 1 for the channel, Phase 2 for the traffic, plus policies and routes in both directions. Most problems aren't with the encryption, but with mundane things — overlapping subnets, a missing return policy, a mismatched algorithm.

If you have several sites to connect, or a tunnel that "comes up but passes no traffic", the NCS team configures and troubleshoots Fortinet VPNs in production. The first consultation is free.
