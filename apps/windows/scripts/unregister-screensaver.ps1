# BEACON Windows — Unregister Screensaver
# Unregisters BEACON as the active screensaver for the current user.

$ErrorActionPreference = "SilentlyContinue"

Write-Host "[Unregister Screensaver] Removing BEACON from HKCU:\Control Panel\Desktop..." -ForegroundColor Cyan

Remove-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "SCRNSAVE.EXE" -ErrorAction SilentlyContinue | Out-Null

Write-Host "[Unregister Screensaver] SUCCESS: BEACON has been unregistered as Windows screensaver." -ForegroundColor Green
