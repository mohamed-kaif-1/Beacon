# BEACON Windows Native Messaging Host Unregistration Script

$ErrorActionPreference = "SilentlyContinue"

$AppDataBeacon = Join-Path $env:APPDATA "Beacon"
$AppDataHelm = Join-Path $env:APPDATA "Helm"

$Hosts = @("com.jonathanvineet.beacon", "com.jonathanvineet.helm")

foreach ($h in $Hosts) {
    $BrowserRegKeys = @(
        "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$h",
        "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$h",
        "HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\$h"
    )

    foreach ($key in $BrowserRegKeys) {
        Remove-Item -Path $key -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
    }

    $mBeacon = Join-Path $AppDataBeacon "$h.json"
    $mHelm = Join-Path $AppDataHelm "$h.json"
    if (Test-Path $mBeacon) { Remove-Item $mBeacon -Force -ErrorAction SilentlyContinue }
    if (Test-Path $mHelm) { Remove-Item $mHelm -Force -ErrorAction SilentlyContinue }
}

Write-Host "BEACON Native Messaging Host unregistered from Chrome, Edge, and Brave." -ForegroundColor Green
