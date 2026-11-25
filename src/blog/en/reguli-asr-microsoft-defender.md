---
title: "ASR Rules in Microsoft Defender: What They Are and How to Enable Them"
description: "Attack Surface Reduction rules block the most common attack paths for free — Office macros, scripts, credential theft. What they do, how to enable them in Audit then Block, and the link to NIS2."
date: 2026-11-25
category: "Cybersecurity"
tags: ["defender", "asr", "microsoft", "endpoint", "ransomware", "nis2"]
---
Most attacks on an office computer don't use exotic exploits. They use mundane things Windows allows by default: a Word document that launches PowerShell, a script that downloads an executable, a macro that calls system functions. These are old, well-known techniques, and yet they work, because the system lets them run.

The **ASR (Attack Surface Reduction)** rules in Microsoft Defender close exactly these paths. They're free, included in Defender Antivirus, and block behaviours no legitimate document or script has any reason to perform. This article explains what they do, how to enable them safely, and why "straight to Block" is a mistake.

## What ASR rules actually are

ASR is part of Microsoft Defender Antivirus — it isn't a separate product, and for basic operation it doesn't require the E5 licence or Defender for Endpoint. They're a set of rules, each with an identifier (GUID), that block a specific behaviour: not a particular file, but an *action*.

Example: the rule "block Office applications from creating child processes" doesn't look at which document you open. It looks at what it tries to do: if Word tries to launch `cmd.exe` or `powershell.exe`, the action is blocked. A normal document never does that; a malicious one does.

## The most useful rules

You don't have to enable them all at once. These have the best protection-to-risk ratio for an ordinary company:

| Rule | GUID | What it blocks |
|---|---|---|
| Office → child processes | D4F940AB-401B-4EFC-AADC-AD5F3C50688A | Word/Excel launching cmd, PowerShell, etc. |
| Office → executable content | 3B576869-A4EC-4529-8536-B80A7769E899 | Office writing executable files to disk |
| Executable content from email | BE9BA2D9-53EA-4CDC-84E5-9B1EEEE46550 | Executables launched from the mail/webmail client |
| Obfuscated scripts | 5BEB7EFE-FD9A-4556-801D-275E5FFC04CC | Deliberately masked JS/VBS scripts |
| JS/VBS → downloaded executable | D3E037E1-3EB8-44C8-A917-57927947596D | A script launching a downloaded executable |
| API calls from Office macros | 92E97FA1-2EDF-4476-BDD6-9DD0B4DDDC7B | Macros calling Win32 functions |
| Credential theft from LSASS | 9E6C4E1F-7D60-472F-BA1A-A39EF669E4B2 | Reading passwords from LSASS memory |
| Persistence through WMI | E6DB77E5-3DF2-4CF1-B95A-636979351E5B | Persistence via WMI event subscriptions |
| Advanced ransomware protection | C1DB55AB-C21A-4637-BB3F-A12568109D35 | Blocks files by prevalence/age/trust |
| Vulnerable signed drivers | 56A863A9-875E-4185-98A7-B882C64B5CE5 | Abuse of signed but vulnerable drivers |

## The three modes: Audit, Block, Warn

Each rule can run in three modes, and this is where people get it wrong most often:

- **Audit** — the rule blocks *nothing*, it only logs what it *would* have blocked. Zero risk of breaking an application.
- **Block** — the rule actually blocks the action.
- **Warn** — it blocks, but lets the user override if they insist.

The golden rule: **always start in Audit**, for one or two weeks. You review what got flagged. If you only see suspicious behaviour — switch to Block. If you see a legitimate internal application triggering a rule (it happens with old accounting or ERP apps that really do launch processes), either exclude it or leave that rule on Audit. That way you don't shut the company down by mistake.

## How to enable them

**Through Intune (recommended for a fleet):** Endpoint security → Attack surface reduction → create a policy, pick the rules and the mode. It's applied centrally and shows up in reports.

**Through PowerShell (locally or via a script):**

```powershell
# Put a rule in Audit mode (the rule's GUID + AuditMode)
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A `
  -AttackSurfaceReductionRules_Actions AuditMode

# After validation, switch to Block (Enabled)
Add-MpPreference -AttackSurfaceReductionRules_Ids D4F940AB-401B-4EFC-AADC-AD5F3C50688A `
  -AttackSurfaceReductionRules_Actions Enabled

# Check which rules are active and in what mode
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Ids
Get-MpPreference | Select-Object -ExpandProperty AttackSurfaceReductionRules_Actions
```

**Through GPO:** Computer Configuration → Administrative Templates → Windows Components → Microsoft Defender Antivirus → Microsoft Defender Exploit Guard → Attack Surface Reduction.

## Common mistakes

- **Straight to Block, without Audit.** The most common one. A rule like "Office → child processes" can break an internal application that genuinely needs that behaviour. Audit first, always.
- **Defender is in passive mode.** If a third-party antivirus (Bitdefender, ESET, etc.) runs on the workstation, Defender is passive and the ASR rules *don't* apply from it. Check the real state with `Get-MpComputerStatus`.
- **Rules enabled, but no central reporting.** Without Intune or a log collector, you can't see what the rules block across the fleet. Enable event collection too.
- **Exclusions too broad.** When a rule catches a legitimate application, exclude the exact *file*, don't disable the rule across the whole estate.

## How it maps to NIS2

The [NIS2](/en/nis2/) directive requires, under Article 21, measures to protect against malware. ASR rules are one of the most effective endpoint measures you can take *at no additional cost*: they block exactly the vectors modern ransomware and loaders use — macros, scripts, credential theft. For an auditor, an applied and documented ASR policy is concrete evidence of workstation hardening.

## Conclusion

ASR rules are the best free endpoint protection most companies already have and don't use. They don't require expensive licences, they don't require a new product — just active Defender Antivirus and a few rules set correctly. The secret is the process: Audit first, review, then Block, with surgical exclusions where a legitimate application needs them.

If you want ASR rules applied correctly across the whole fleet, via Intune, with an audit phase and reporting — the NCS team has done exactly that in production. The first consultation is free.
