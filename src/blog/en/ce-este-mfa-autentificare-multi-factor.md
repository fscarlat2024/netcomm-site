---
title: "What Is Multi-Factor Authentication (MFA) and Why It Stops Most Attacks"
description: "A practical guide to MFA: how it works, which methods exist, what attacks it blocks and how to roll it out correctly across your company."
date: 2026-09-25
category: "Cybersecurity"
tags: ["mfa", "autentificare", "phishing", "microsoft 365", "identitate"]
---
For decades, the password was the only barrier between your company's data and the internet. Today it is the weakest link in the chain: passwords get reused across accounts, end up in publicly leaked databases, are guessed through automated attacks, or are simply handed to an attacker by an employee who clicked a convincing phishing email. Multi-factor authentication (MFA) addresses exactly this problem by adding a second verification element that cannot be stolen as easily as a string of characters.

## What multi-factor authentication actually means

MFA requires you to prove your identity using at least two elements from different categories:

- **Something you know** — a password or PIN.
- **Something you have** — a phone with an authenticator app, a hardware security key, a token.
- **Something you are** — a fingerprint, facial recognition or another biometric factor.

The key point is the combination of **different categories**. A password plus a security question is not MFA, because both belong to the same category and both can be discovered through the same methods.

The underlying logic is straightforward: a remote attacker can obtain your password without ever touching your physical device. To get past the second factor, they would also need your phone or your security key — and that changes the economics of the attack entirely.

## Why MFA stops the majority of account attacks

Most security incidents involving business accounts do not rely on exploiting a complex technical vulnerability. They rely on a perfectly valid login, using correct credentials obtained through unremarkable means.

### Phishing and fake login pages

An employee receives an email that mimics a Microsoft 365 notification, opens a page visually identical to the real one, and enters their credentials. Without MFA, the attacker logs in immediately. With MFA enabled, credentials alone are not enough.

### Credential stuffing

Attackers take huge lists of email–password pairs from public breaches and test them automatically across dozens of services. If an employee reused a password from a compromised personal account, the business account becomes accessible. MFA neutralises this attack almost entirely, because leaked passwords do not include the second factor.

### Brute force and password spraying

Automated attempts to guess weak passwords are constant against publicly exposed services. A second factor makes a successful guess irrelevant.

### Account takeover for financial fraud

A compromised mailbox is the starting point for Business Email Compromise: the attacker monitors correspondence, then steps into an invoice discussion and changes the bank details. MFA significantly reduces the chance that the mailbox is compromised in the first place.

## Not all MFA methods are equal

MFA is not a single, uniform solution. The available methods differ considerably in strength:

- **SMS codes** — better than nothing, but vulnerable to SIM swapping and interception. Use only as a temporary or fallback option.
- **Authenticator apps (TOTP)** — 30-second rotating codes in Microsoft Authenticator, Google Authenticator or similar. A solid baseline for most organisations.
- **Push notifications with number matching** — the user must type a number shown on the login screen into the app. This eliminates reflexive approvals and "MFA fatigue" attacks, where an attacker floods the user with requests until someone taps Approve.
- **FIDO2 hardware keys and passkeys** — the strongest option, because authentication is cryptographically bound to the legitimate domain. A phishing page gains nothing usable. Recommended for administrators, management and anyone with access to sensitive data.

## Where to enable MFA first

If you are starting from scratch, prioritise in this order:

1. **Global administrator accounts** — Microsoft 365, Google Workspace, antivirus console, firewall, hosting panel. A compromised administrator means a compromised organisation.
2. **VPN and remote access** — every external entry point into the internal network.
3. **Email for all staff** — the primary attack vector and the usual starting point for fraud.
4. **Applications holding critical data** — ERP, CRM, finance systems, HR platforms.
5. **Service and shared accounts** — frequently forgotten, frequently protected by old passwords with no clear owner.

## Common implementation mistakes

Partially deployed MFA creates a false sense of security. Watch out for:

- **Permanent exceptions.** Exempting an executive because they find it inconvenient removes protection exactly where it matters most.
- **Legacy authentication protocols.** If older methods that bypass MFA remain enabled in your tenant, attackers will find them.
- **No backup methods.** A lost phone should not lock an employee out for a full day. Define a clear recovery procedure in advance — and verify identity before resetting, because this process itself can be abused through social engineering.
- **No user training.** Staff need to understand that an unexpected MFA prompt means someone already knows their password and must be reported immediately.

## MFA and NIS2 compliance

For entities in scope of the NIS2 Directive, multi-factor authentication is no longer an optional good practice. Article 21 lists the use of multi-factor or continuous authentication solutions among the required risk-management measures, alongside access control policies and basic cyber hygiene. If your organisation falls within scope, the absence of MFA will be visible during any assessment.

## An unbeatable cost-benefit ratio

Few security controls offer such a favourable balance between implementation effort and risk removed. MFA is available natively in Microsoft 365 and most business platforms, requires no hardware investment for a baseline deployment, and can be rolled out in stages without disrupting operations.

The real challenge is not the technology but achieving complete, consistent coverage: identifying every access point, choosing the right method for each user group, closing the bypass routes and handling exceptions without weakening protection. If you are not confident that MFA is active everywhere it should be, an assessment of your identity configuration followed by a rollout plan tailored to how your teams actually work is the fastest way to close one of the widest gaps in company security.
