<#
  set-telegram-secrets.ps1
  Seteaza cele 2 secrete Telegram pe Worker-ul "netcomm" ca lead-urile din chatbot
  sa vina si pe Telegram (pe langa email). Se aplica LIVE, fara redeploy.

  Rulare:
    powershell -ExecutionPolicy Bypass -File set-telegram-secrets.ps1

  Iti va cere pe rand:
    1) TELEGRAM_BOT_TOKEN  - tokenul botului (de la @BotFather, cel de la Lengo Alerte)
    2) TELEGRAM_CHAT_ID    - ID-ul chat-ului unde vrei alertele
  Lipesti valoarea, apesi Enter. (Valorile NU raman scrise nicaieri.)
#>

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

$wrangler = Get-ChildItem "$env:LOCALAPPDATA\npm-cache\_npx" -Recurse -Filter "wrangler.js" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\wrangler\bin\wrangler.js" } |
    Select-Object -First 1 -ExpandProperty FullName

if (-not $wrangler) { Write-Host "wrangler.js negasit. Ruleaza intai un deploy." -ForegroundColor Red; exit 1 }

Write-Host "== 1/2: TELEGRAM_BOT_TOKEN ==" -ForegroundColor Cyan
node "$wrangler" secret put TELEGRAM_BOT_TOKEN

Write-Host "`n== 2/2: TELEGRAM_CHAT_ID ==" -ForegroundColor Cyan
node "$wrangler" secret put TELEGRAM_CHAT_ID

Write-Host "`nGata. Lead-urile din chatbot vor veni acum si pe Telegram." -ForegroundColor Green
