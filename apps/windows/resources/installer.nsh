; BEACON Windows NSIS Custom Script
; Provides installation, finish page, and uninstallation hooks for BEACON

!macro customInstall
  DetailPrint "Ensuring background screensaver and app instances are closed..."
  nsExec::Exec 'taskkill /F /IM Beacon.scr /T'
  nsExec::Exec 'taskkill /F /IM Helm.scr /T'
  
  DetailPrint "Configuring BEACON Storage & Native Messaging Registry Keys..."
  CreateDirectory "$APPDATA\Beacon"

  ; Seamless Migration: copy existing Helm data if upgrading from Helm
  IfFileExists "$APPDATA\Helm\helm.db" 0 +3
    IfFileExists "$APPDATA\Beacon\beacon.db" +2 0
      CopyFiles /SILENT "$APPDATA\Helm\helm.db" "$APPDATA\Beacon\beacon.db"

  IfFileExists "$APPDATA\Helm\settings.json" 0 +3
    IfFileExists "$APPDATA\Beacon\settings.json" +2 0
      CopyFiles /SILENT "$APPDATA\Helm\settings.json" "$APPDATA\Beacon\settings.json"

  IfFileExists "$APPDATA\Helm\watches.json" 0 +3
    IfFileExists "$APPDATA\Beacon\watches.json" +2 0
      CopyFiles /SILENT "$APPDATA\Helm\watches.json" "$APPDATA\Beacon\watches.json"
  
  ; Register Native Messaging Host in HKCU for Google Chrome (Primary BEACON + Fallback Helm)
  WriteRegStr HKCU "Software\Google\Chrome\NativeMessagingHosts\com.jonathanvineet.beacon" "" "$APPDATA\Beacon\com.jonathanvineet.beacon.json"
  WriteRegStr HKCU "Software\Google\Chrome\NativeMessagingHosts\com.jonathanvineet.helm" "" "$APPDATA\Beacon\com.jonathanvineet.helm.json"
  
  ; Register Native Messaging Host in HKCU for Microsoft Edge (Primary BEACON + Fallback Helm)
  WriteRegStr HKCU "Software\Microsoft\Edge\NativeMessagingHosts\com.jonathanvineet.beacon" "" "$APPDATA\Beacon\com.jonathanvineet.beacon.json"
  WriteRegStr HKCU "Software\Microsoft\Edge\NativeMessagingHosts\com.jonathanvineet.helm" "" "$APPDATA\Beacon\com.jonathanvineet.helm.json"
  
  ; Register Native Messaging Host in HKCU for Brave Browser (Primary BEACON + Fallback Helm)
  WriteRegStr HKCU "Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.jonathanvineet.beacon" "" "$APPDATA\Beacon\com.jonathanvineet.beacon.json"
  WriteRegStr HKCU "Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.jonathanvineet.helm" "" "$APPDATA\Beacon\com.jonathanvineet.helm.json"
!macroend

!macro customFinishPage
  !ifndef HIDE_RUN_AFTER_FINISH
    Function BeaconStartApp
      ${if} ${isUpdated}
        StrCpy $1 "--updated"
      ${else}
        StrCpy $1 "--from-installer"
      ${endif}
      SetOutPath "$INSTDIR"
      ExecShell "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}" "$1"
    FunctionEnd

    !define MUI_FINISHPAGE_RUN
    !define MUI_FINISHPAGE_RUN_FUNCTION "BeaconStartApp"
  !endif
  !insertmacro MUI_PAGE_FINISH
!macroend

!macro customUnInstall
  DetailPrint "Terminating any running BEACON or screensaver instances..."
  nsExec::Exec 'taskkill /F /IM Beacon.scr /T'
  nsExec::Exec 'taskkill /F /IM Helm.scr /T'
  nsExec::Exec 'taskkill /F /IM Beacon.exe /T'
  nsExec::Exec 'taskkill /F /IM Helm.exe /T'

  DetailPrint "Cleaning up BEACON Native Messaging & Startup Registry Keys..."
  DeleteRegKey HKCU "Software\Google\Chrome\NativeMessagingHosts\com.jonathanvineet.beacon"
  DeleteRegKey HKCU "Software\Microsoft\Edge\NativeMessagingHosts\com.jonathanvineet.beacon"
  DeleteRegKey HKCU "Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.jonathanvineet.beacon"
  DeleteRegKey HKCU "Software\Google\Chrome\NativeMessagingHosts\com.jonathanvineet.helm"
  DeleteRegKey HKCU "Software\Microsoft\Edge\NativeMessagingHosts\com.jonathanvineet.helm"
  DeleteRegKey HKCU "Software\BraveSoftware\Brave-Browser\NativeMessagingHosts\com.jonathanvineet.helm"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Beacon"
  DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Helm"
  Delete "$APPDATA\Beacon\com.jonathanvineet.beacon.json"
  Delete "$APPDATA\Beacon\com.jonathanvineet.helm.json"
  ; User data in $APPDATA\Beacon and $APPDATA\Helm (beacon.db, helm.db, settings.json, watches.json, logs) is explicitly preserved
!macroend
