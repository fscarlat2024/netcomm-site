---
title: "What Kind of Password Should You Use for Your Wi-Fi?"
description: "A practical guide for businesses: Wi-Fi password length and type, WPA2 vs WPA3 encryption, guest network separation, and when to move to 802.1X authentication."
date: 2026-09-29
category: "Network & Fortinet"
tags: ["wifi", "parole", "wpa3", "securitate retea", "acces invitati"]
---
It is one of the most common questions we get from IT administrators and small business owners: "what password should I set on the Wi-Fi so it's actually secure?" The short answer is that the password matters, but it is not the only thing keeping your network safe. The encryption protocol, how the network is segmented, and who knows the password are equally important. Below are our practical recommendations, applicable whether you run a five-person office or a multi-access-point network.

## Length matters more than complexity

Wi-Fi passwords behave differently from account passwords. On a WPA2/WPA3-Personal network, an attacker cannot brute-force the key directly against the access point indefinitely. Instead, they capture a handshake and crack it offline, on their own hardware, at high speed. That means the only real defence is a password too long to be guessed by brute force or dictionary attack.

Our recommendations:

- **Minimum 16 characters** for the internal company network. The WPA2 standard allows up to 63 characters — use them.
- **Prefer a passphrase** over a cryptic string. Four or five unrelated words separated by hyphens or digits offer excellent resistance and are far easier to pass on to a colleague: `green-table-7-coffee-library`.
- **Avoid predictable words**: company name, office address, founding year, product names, "welcome", "password123". The dictionaries used in offline attacks already contain these, including the variants with letters swapped for digits.
- **Never reuse** the Wi-Fi password anywhere else, and don't derive it from other passwords used in the company.

One practical detail: if devices join the network by scanning a QR code or by typing on small screens (printers, scanners, POS terminals), choose a passphrase without ambiguous characters (l, I, 1, O, 0) to cut down on typing errors.

## Encryption matters more than the password

A long password on an outdated protocol does not help you. Check your access point settings:

- **WPA3-Personal (SAE)** is the recommended option wherever your hardware supports it. It resists offline dictionary attacks because the handshake no longer allows the key to be reconstructed from captured traffic.
- **WPA2-Personal (AES/CCMP)** remains acceptable for older devices. If you use it, password length becomes critical.
- **Mixed WPA2/WPA3 mode** is a reasonable compromise during a transition period.
- **Disable WEP, WPA (TKIP) and WPS entirely.** WPS in particular allows the password to be bypassed via an eight-digit PIN and should be turned off on every device.

## The guest network: always separate

Do not hand the internal network password to visitors, external contractors, or employees bringing personal phones. Set up a dedicated guest SSID with:

- client isolation (connected devices cannot see each other);
- no access to the internal VLAN, servers, NAS or printers;
- bandwidth limits, where the hardware allows;
- its own password, rotated regularly.

The same logic applies to IoT devices: cameras, sensors, smart TVs, access control systems. These frequently go unpatched and become entry points. A dedicated VLAN isolates them from workstations.

## When a shared password is no longer enough

A single password known by everyone has a structural flaw: you cannot revoke access for one person. When an employee leaves, you should in theory change the password on every device. In practice nobody does, and the password circulates for years.

Beyond roughly 20–25 users, or wherever compliance requirements exist, the right answer is **WPA2/WPA3-Enterprise with 802.1X**: each user authenticates with their own credentials via RADIUS, tied to Active Directory or Entra ID. The benefits are immediate:

- access is revoked by disabling an account, not by changing everyone's password;
- you get connection logs per user and per device;
- you can apply role-based policies through dynamic VLAN assignment;
- you eliminate the "password on a sticky note next to the router" problem.

On Fortinet hardware, for example, this is configured centrally from the FortiGate across all FortiAP access points, with firewall policies applied directly to each SSID.

## Operational hygiene: the small things that count

- **Change the default admin password** on the router or wireless controller. It is separate from the Wi-Fi password and far more dangerous if left at factory defaults.
- **Keep access point firmware updated.** Vulnerabilities in wireless stacks appear regularly.
- **Don't hide the SSID** thinking it protects you — it is not a security control and it causes roaming problems.
- **Document where the password is stored.** Use a company password manager, not a spreadsheet on someone's desktop.
- **Tie rotation to real events**: staff departures, suspected compromise, the end of a project involving external contractors.

## In short

For a small office: WPA3 (or WPA2-AES), a passphrase of at least 16 characters, WPS disabled, separate SSIDs for guests and IoT. For a larger organisation or one with compliance obligations, move to 802.1X with individual accounts.

Configuring wireless properly is rarely a standalone task — it depends on VLAN segmentation, firewall policy, identity management and traffic monitoring. If you need an assessment of your current wireless infrastructure or help implementing per-user authentication, our team can help you move from a shared password to a controlled, auditable architecture.
