# BEACON Windows Native Messaging Host Registration Script
# Registers the host with Chrome, Edge, and Brave for both BEACON and legacy Helm extensions

$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$AppDataBeacon = Join-Path $env:APPDATA "Beacon"
$BinDir = Join-Path $AppDataBeacon "bin"

if (-not (Test-Path $AppDataBeacon)) {
    New-Item -ItemType Directory -Path $AppDataBeacon -Force | Out-Null
}
if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Path $BinDir -Force | Out-Null
}

# Determine host executable: prefer compiled .exe, fallback to .bat
$SrcOutMain = Join-Path $ProjectRoot "out\main"
$SrcExe = Join-Path $SrcOutMain "beacon-native-host.exe"
if (-not (Test-Path $SrcExe)) {
    $SrcExe = Join-Path $SrcOutMain "helm-native-host.exe"
}
$SrcBat = Join-Path $SrcOutMain "beacon-native-host.bat"
if (-not (Test-Path $SrcBat)) {
    $SrcBat = Join-Path $SrcOutMain "helm-native-host.bat"
}
$SrcJs = Join-Path $SrcOutMain "native-host.js"
$SrcChunks = Join-Path $SrcOutMain "chunks"

# Copy latest host files to %APPDATA%\Beacon\bin for permanent availability
if (Test-Path $SrcExe) {
    Copy-Item $SrcExe -Destination (Join-Path $BinDir "beacon-native-host.exe") -Force
    Copy-Item $SrcExe -Destination (Join-Path $BinDir "helm-native-host.exe") -Force
}
if (Test-Path $SrcBat) {
    Copy-Item $SrcBat -Destination (Join-Path $BinDir "beacon-native-host.bat") -Force
    Copy-Item $SrcBat -Destination (Join-Path $BinDir "helm-native-host.bat") -Force
}
if (Test-Path $SrcJs) {
    Copy-Item $SrcJs -Destination $BinDir -Force
}
if (Test-Path $SrcChunks) {
    Copy-Item -Path $SrcChunks -Destination $BinDir -Recurse -Force
}

$HostExePath = Join-Path $BinDir "beacon-native-host.exe"
if (-not (Test-Path $HostExePath)) {
    $HostExePath = Join-Path $BinDir "beacon-native-host.bat"
}

if (-not (Test-Path $HostExePath)) {
    Write-Error "Host binary not found. Please run 'npm run build' first."
    exit 1
}

$ExtensionId = "popaljneofbfhillkaogepicefmnmdll"

$Hosts = @(
    @{
        Name = "com.jonathanvineet.beacon"
        Desc = "BEACON: shows watched pages on the board"
    },
    @{
        Name = "com.jonathanvineet.helm"
        Desc = "Helm: shows watched pages on the board"
    }
)

foreach ($h in $Hosts) {
    $ManifestPath = Join-Path $AppDataBeacon "$($h.Name).json"
    $ManifestContent = @{
        name = $h.Name
        description = $h.Desc
        path = $HostExePath
        type = "stdio"
        allowed_origins = @("chrome-extension://$ExtensionId/")
    } | ConvertTo-Json -Depth 5

    Set-Content -Path $ManifestPath -Value $ManifestContent -Encoding UTF8
    Write-Host "Created Native Messaging Manifest: $ManifestPath" -ForegroundColor Cyan

    $BrowserRegKeys = @(
        "HKCU:\Software\Google\Chrome\NativeMessagingHosts\$($h.Name)",
        "HKCU:\Software\Microsoft\Edge\NativeMessagingHosts\$($h.Name)",
        "HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\$($h.Name)"
    )

    foreach ($key in $BrowserRegKeys) {
        try {
            if (-not (Test-Path $key)) {
                New-Item -Path $key -Force | Out-Null
            }
            Set-ItemProperty -Path $key -Name "(Default)" -Value $ManifestPath -Force
            Write-Host "Registered in: $key" -ForegroundColor Green
        } catch {
            Write-Warning "Could not register key $key : $_"
        }
    }
}

Write-Host "`nBEACON Native Messaging Host successfully registered with dual compatibility!" -ForegroundColor Green
Write-Host "Target Host: $HostExePath"
