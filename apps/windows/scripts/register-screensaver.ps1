# BEACON Windows — Register Screensaver
# Registers Beacon.scr as the active screensaver for the current user in HKCU without requiring admin privileges.

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$localAppData = [Environment]::GetFolderPath([Environment+SpecialFolder]::LocalApplicationData)

$candidates = @(
    (Join-Path $localAppData "Programs\Beacon\Beacon.scr"),
    (Join-Path $projectRoot "out\main\Beacon.scr"),
    (Join-Path $projectRoot "resources\Beacon.scr"),
    (Join-Path $localAppData "Programs\Helm\Helm.scr"),
    (Join-Path $projectRoot "out\main\Helm.scr"),
    (Join-Path $projectRoot "resources\Helm.scr")
)

$scrPath = $null
foreach ($c in $candidates) {
    if (Test-Path $c) {
        $scrPath = (Resolve-Path $c).Path
        break
    }
}

if (-not $scrPath) {
    Write-Host "[Register Screensaver] Beacon.scr not found. Building launcher first..." -ForegroundColor Yellow
    node (Join-Path $projectRoot "scripts\build-launcher.cjs")
    $builtScr = Join-Path $projectRoot "out\main\Beacon.scr"
    if (Test-Path $builtScr) {
        $scrPath = (Resolve-Path $builtScr).Path
    } else {
        Write-Error "Failed to locate or build Beacon.scr"
        exit 1
    }
}

Write-Host "[Register Screensaver] Registering Beacon.scr at: $scrPath" -ForegroundColor Cyan

# Set per-user registry values
New-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "SCRNSAVE.EXE" -Value $scrPath -PropertyType String -Force | Out-Null
New-ItemProperty -Path "HKCU:\Control Panel\Desktop" -Name "ScreenSaveActive" -Value "1" -PropertyType String -Force | Out-Null

Write-Host "[Register Screensaver] SUCCESS: BEACON is now configured as your Windows screensaver!" -ForegroundColor Green
Write-Host "[Register Screensaver] To configure timeout, open Windows Screen Saver Settings: control desk.cpl,,@screensaver" -ForegroundColor Gray
