using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading;

namespace Beacon
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                string exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                
                // Locate native-host.js across standard layout possibilities
                string scriptPath = Path.Combine(exeDir, "native-host.js");
                if (!File.Exists(scriptPath))
                {
                    scriptPath = Path.Combine(exeDir, "..", "main", "native-host.js");
                }
                if (!File.Exists(scriptPath))
                {
                    scriptPath = Path.GetFullPath(Path.Combine(exeDir, "..", "..", "out", "main", "native-host.js"));
                }
                if (!File.Exists(scriptPath))
                {
                    string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                    scriptPath = Path.Combine(appData, "Beacon", "bin", "native-host.js");
                }
                if (!File.Exists(scriptPath))
                {
                    string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                    scriptPath = Path.Combine(appData, "Beacon", "native-host.js");
                }
                if (!File.Exists(scriptPath))
                {
                    string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                    scriptPath = Path.Combine(appData, "Helm", "bin", "native-host.js");
                }
                if (!File.Exists(scriptPath))
                {
                    string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                    scriptPath = Path.Combine(appData, "Helm", "native-host.js");
                }

                // Locate runner executable:
                // 1. Look for installed Helm.exe (allows running without global Node.js)
                string runnerExe = null;
                bool isElectron = false;

                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
                string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);

                string[] beaconCandidates = new string[]
                {
                    Path.Combine(exeDir, "Beacon.exe"),
                    Path.Combine(exeDir, "..", "Beacon.exe"),
                    Path.Combine(exeDir, "..", "..", "Beacon.exe"),
                    Path.Combine(localAppData, "Programs", "Beacon", "Beacon.exe"),
                    Path.Combine(programFiles, "Beacon", "Beacon.exe"),
                    Path.Combine(programFilesX86, "Beacon", "Beacon.exe"),
                    Path.Combine(exeDir, "Helm.exe"),
                    Path.Combine(exeDir, "..", "Helm.exe"),
                    Path.Combine(exeDir, "..", "..", "Helm.exe"),
                    Path.Combine(localAppData, "Programs", "Helm", "Helm.exe"),
                    Path.Combine(programFiles, "Helm", "Helm.exe"),
                    Path.Combine(programFilesX86, "Helm", "Helm.exe")
                };

                foreach (string candidate in beaconCandidates)
                {
                    try
                    {
                        if (File.Exists(candidate))
                        {
                            runnerExe = candidate;
                            isElectron = true;
                            break;
                        }
                    }
                    catch {}
                }

                // 2. Fallback to node.exe in PATH (for development / local tests)
                if (string.IsNullOrEmpty(runnerExe))
                {
                    string pathEnv = Environment.GetEnvironmentVariable("PATH") ?? "";
                    foreach (string p in pathEnv.Split(';'))
                    {
                        string trimmed = p.Trim();
                        if (string.IsNullOrEmpty(trimmed)) continue;
                        string candidate = Path.Combine(trimmed, "node.exe");
                        if (File.Exists(candidate))
                        {
                            runnerExe = candidate;
                            isElectron = false;
                            break;
                        }
                    }
                }

                // 3. Fallback to dev electron.exe if present
                if (string.IsNullOrEmpty(runnerExe))
                {
                    string devElectron = Path.GetFullPath(Path.Combine(exeDir, "..", "..", "node_modules", "electron", "dist", "electron.exe"));
                    if (File.Exists(devElectron))
                    {
                        runnerExe = devElectron;
                        isElectron = true;
                    }
                }

                if (string.IsNullOrEmpty(runnerExe))
                {
                    runnerExe = "node.exe";
                }

                ProcessStartInfo psi = new ProcessStartInfo();
                psi.FileName = runnerExe;
                if (isElectron)
                {
                    psi.EnvironmentVariables["ELECTRON_RUN_AS_NODE"] = "1";
                }
                
                string argStr = "\"" + scriptPath + "\"";
                for (int i = 0; i < args.Length; i++)
                {
                    argStr += " \"" + args[i].Replace("\"", "\\\"") + "\"";
                }
                psi.Arguments = argStr;
                psi.UseShellExecute = false;
                psi.RedirectStandardInput = true;
                psi.RedirectStandardOutput = true;
                psi.RedirectStandardError = true;
                psi.CreateNoWindow = true;

                using (Process proc = Process.Start(psi))
                {
                    if (proc == null) return 1;

                    Thread inThread = new Thread(() =>
                    {
                        try
                        {
                            using (Stream stdin = Console.OpenStandardInput())
                            using (Stream dest = proc.StandardInput.BaseStream)
                            {
                                stdin.CopyTo(dest);
                                dest.Flush();
                            }
                        }
                        catch {}
                    });
                    inThread.IsBackground = true;
                    inThread.Start();

                    Thread errThread = new Thread(() =>
                    {
                        try
                        {
                            using (Stream procErr = proc.StandardError.BaseStream)
                            using (Stream err = Console.OpenStandardError())
                            {
                                procErr.CopyTo(err);
                                err.Flush();
                            }
                        }
                        catch {}
                    });
                    errThread.IsBackground = true;
                    errThread.Start();

                    using (Stream procOut = proc.StandardOutput.BaseStream)
                    using (Stream stdout = Console.OpenStandardOutput())
                    {
                        procOut.CopyTo(stdout);
                        stdout.Flush();
                    }

                    proc.WaitForExit();
                    return proc.ExitCode;
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("[BEACON Launcher Error] " + ex.Message);
                return 1;
            }
        }
    }
}
