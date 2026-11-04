const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const outDir = path.join(projectRoot, 'out', 'main')
const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe'
const srcFile = path.join(projectRoot, 'resources', 'launcher', 'Program.cs')

const targetExe = path.join(outDir, 'beacon-native-host.exe')
const targetBat = path.join(outDir, 'beacon-native-host.bat')
const legacyExe = path.join(outDir, 'helm-native-host.exe')
const legacyBat = path.join(outDir, 'helm-native-host.bat')
const iconIco = path.join(projectRoot, 'resources', 'icon.ico')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

// 1. Write the .bat launcher (primary beacon + legacy helm)
const batContent = `@echo off\r\nnode "%~dp0native-host.js" %*\r\n`
fs.writeFileSync(targetBat, batContent, 'utf-8')
fs.writeFileSync(legacyBat, batContent, 'utf-8')
console.log('[Build Launcher] Created beacon-native-host.bat and helm-native-host.bat')

// 2. Compile C# launcher executable if csc.exe is available
if (fs.existsSync(cscPath) && fs.existsSync(srcFile)) {
  try {
    const hostArgs = [
      '/nologo',
      '/target:exe',
      `/out:${targetExe}`
    ]
    if (fs.existsSync(iconIco)) {
      hostArgs.push(`/win32icon:${iconIco}`)
    }
    hostArgs.push(srcFile)

    execFileSync(cscPath, hostArgs)
    fs.copyFileSync(targetExe, legacyExe)
    console.log('[Build Launcher] Successfully compiled beacon-native-host.exe and copied helm-native-host.exe (with Quiet Path icon)')
  } catch (err) {
    console.warn('[Build Launcher] Warning: csc compilation failed:', err.message)
  }
} else {
  console.log('[Build Launcher] csc.exe not found, using .bat launcher')
}

// 3. Compile Native Windows Screensaver (.scr) Launcher
const scrSrcFile = path.join(projectRoot, 'resources', 'screensaver', 'ScreensaverLauncher.cs')
const targetScr = path.join(outDir, 'Beacon.scr')
const legacyScr = path.join(outDir, 'Helm.scr')
const resBeaconScr = path.join(projectRoot, 'resources', 'Beacon.scr')
const resHelmScr = path.join(projectRoot, 'resources', 'Helm.scr')

if (fs.existsSync(cscPath) && fs.existsSync(scrSrcFile)) {
  try {
    const cscArgs = [
      '/nologo',
      '/target:winexe',
      '/r:System.dll',
      '/r:System.Drawing.dll',
      '/r:System.Windows.Forms.dll',
      `/out:${targetScr}`
    ]
    if (fs.existsSync(iconIco)) {
      cscArgs.push(`/win32icon:${iconIco}`)
    }
    cscArgs.push(scrSrcFile)

    execFileSync(cscPath, cscArgs)
    fs.copyFileSync(targetScr, legacyScr)
    fs.copyFileSync(targetScr, resBeaconScr)
    fs.copyFileSync(targetScr, resHelmScr)
    console.log('[Build Launcher] Successfully compiled Beacon.scr and created Helm.scr compatibility copy')
  } catch (err) {
    console.warn('[Build Launcher] Warning: screensaver csc compilation failed:', err.message)
  }
}
