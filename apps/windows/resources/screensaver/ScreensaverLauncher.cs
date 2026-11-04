using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.IO.Pipes;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading;
using System.Windows.Forms;

namespace Beacon.Screensaver
{
    static class Program
    {
        [DllImport("user32.dll")]
        static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);

        [DllImport("user32.dll")]
        static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        static extern bool GetClientRect(IntPtr hWnd, out RECT lpRect);

        [DllImport("user32.dll")]
        static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        static extern short GetAsyncKeyState(int vKey);

        [StructLayout(LayoutKind.Sequential)]
        public struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
            public int Width { get { return Right - Left; } }
            public int Height { get { return Bottom - Top; } }
        }

        const int GWL_STYLE = -16;
        const int WS_CHILD = 0x40000000;
        const uint SWP_NOZORDER = 0x0004;
        const uint SWP_NOACTIVATE = 0x0010;

        static void Log(string message)
        {
            try
            {
                string timestamp = DateTime.UtcNow.ToString("o");
                string line = string.Format("[{0}] [Launcher] {1}\r\n", timestamp, message);

                // 1. %APPDATA%\Beacon\logs\screensaver.log
                string appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                string logDir = Path.Combine(appData, "Beacon", "logs");
                if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                File.AppendAllText(Path.Combine(logDir, "screensaver.log"), line);

                // 2. %TEMP%\BeaconScreensaver.log
                string tempLog = Path.Combine(Path.GetTempPath(), "BeaconScreensaver.log");
                File.AppendAllText(tempLog, line);
            }
            catch {}
        }

        [STAThread]
        static int Main(string[] args)
        {
            try
            {
                string rawArgs = (args != null && args.Length > 0) ? string.Join(" ", args) : "(none)";
                Log("Launcher started. Raw args: " + rawArgs);

                bool isScreensaver = false;
                bool isConfig = false;
                bool isPreview = false;
                IntPtr previewHwnd = IntPtr.Zero;

                if (args != null && args.Length > 0)
                {
                    for (int i = 0; i < args.Length; i++)
                    {
                        string arg = args[i].Trim().ToLowerInvariant();
                        if (arg.StartsWith("/p") || arg.StartsWith("-p"))
                        {
                            isPreview = true;
                            string hwndStr = "";
                            if (arg.Contains(":")) hwndStr = arg.Substring(arg.IndexOf(':') + 1);
                            else if (i + 1 < args.Length) hwndStr = args[++i];
                            long h;
                            if (long.TryParse(hwndStr, out h)) previewHwnd = new IntPtr(h);
                        }
                        else if (arg.StartsWith("/s") || arg.StartsWith("-s"))
                        {
                            isScreensaver = true;
                        }
                        else if (arg.StartsWith("/c") || arg.StartsWith("-c"))
                        {
                            isConfig = true;
                        }
                    }
                }

                Log(string.Format("Arguments parsed: isScreensaver={0}, isPreview={1}, isConfig={2}, previewHwnd=0x{3:X}",
                    isScreensaver, isPreview, isConfig, previewHwnd.ToInt64()));

                // Case 1: Preview Mode (/p <hwnd> or /p:<hwnd>)
                if (isPreview && previewHwnd != IntPtr.Zero)
                {
                    Log("Running preview mode for HWND 0x" + previewHwnd.ToInt64().ToString("X"));
                    RunPreview(previewHwnd);
                    Log("Preview mode finished successfully");
                    return 0;
                }

                // Case 2: Start Screensaver (/s or -s)
                if (isScreensaver)
                {
                    Log("Starting screensaver execution (/s)");
                    int code = RunScreensaver();
                    Log("Screensaver execution finished with code " + code);
                    return code;
                }

                // Case 3: Configuration Mode (/c or fallback)
                Log("Starting configuration mode (/c)");
                RunConfig();
                Log("Configuration mode finished");
                return 0;
            }
            catch (Exception ex)
            {
                Log("FATAL Launcher exception: " + ex.Message + "\n" + ex.StackTrace);
                return 1;
            }
            finally
            {
                Log("Launcher process terminated");
            }
        }

        static string FindBeaconExecutable()
        {
            string exeDir = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);

            string[] candidates = new string[]
            {
                Path.Combine(exeDir, "Beacon.exe"),
                Path.Combine(exeDir, "..", "Beacon.exe"),
                Path.Combine(localAppData, "Programs", "Beacon", "Beacon.exe"),
                Path.Combine(programFiles, "Beacon", "Beacon.exe"),
                Path.Combine(programFilesX86, "Beacon", "Beacon.exe"),
                Path.GetFullPath(Path.Combine(exeDir, "..", "..", "dist", "win-unpacked", "Beacon.exe")),
                Path.Combine(exeDir, "Helm.exe"),
                Path.Combine(exeDir, "..", "Helm.exe"),
                Path.Combine(localAppData, "Programs", "Helm", "Helm.exe"),
                Path.Combine(programFiles, "Helm", "Helm.exe"),
                Path.Combine(programFilesX86, "Helm", "Helm.exe"),
                Path.GetFullPath(Path.Combine(exeDir, "..", "..", "dist", "win-unpacked", "Helm.exe"))
            };

            foreach (string candidate in candidates)
            {
                try
                {
                    if (File.Exists(candidate))
                    {
                        return candidate;
                    }
                }
                catch {}
            }
            return null;
        }

        static bool TryActivateViaPipe(string pipeName)
        {
            try
            {
                // Use PipeDirection.Out — we only need to send ACTIVATE; we don't block on reading
                // an acknowledgment. If the connection succeeds, the main app IS running and will
                // process the command. This avoids timing races where the response isn't ready
                // before ReadLine() returns null, causing a false-negative.
                using (NamedPipeClientStream client = new NamedPipeClientStream(".", pipeName, PipeDirection.Out))
                {
                    client.Connect(300); // 300ms fast connect attempt
                    using (StreamWriter writer = new StreamWriter(client) { AutoFlush = true })
                    {
                        writer.WriteLine("ACTIVATE");
                    }
                    Log("Sent ACTIVATE command to control pipe: " + pipeName);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Log("TryActivateViaPipe note (expected if app not yet active): " + ex.Message);
                return false;
            }
        }

        static void SignalDeactivateViaPipe(string pipeName)
        {
            try
            {
                using (NamedPipeClientStream client = new NamedPipeClientStream(".", pipeName, PipeDirection.Out))
                {
                    client.Connect(150);
                    using (StreamWriter writer = new StreamWriter(client))
                    {
                        writer.AutoFlush = true;
                        writer.WriteLine("DEACTIVATE");
                    }
                }
            }
            catch {}
        }

        static bool IsAnyUserKeyPressed()
        {
            // Primary dismissal keys:
            // Mouse buttons: VK_LBUTTON(0x01), VK_RBUTTON(0x02), VK_MBUTTON(0x04)
            // Keyboard: Backspace(0x08), Tab(0x09), Return(0x0D), Escape(0x1B), Space(0x20)
            // Arrows: Left(0x25), Up(0x26), Right(0x27), Down(0x28)
            // Function: F1-F12(0x70-0x7B)
            int[] specialKeys = new int[]
            {
                0x01, 0x02, 0x04,
                0x08, 0x09, 0x0D, 0x1B, 0x20,
                0x25, 0x26, 0x27, 0x28
            };

            foreach (int vk in specialKeys)
            {
                if ((GetAsyncKeyState(vk) & 0x8000) != 0)
                {
                    return true;
                }
            }

            // Alphanumeric keys: 0-9 (0x30-0x39), A-Z (0x41-0x5A)
            for (int vk = 0x30; vk <= 0x5A; vk++)
            {
                if ((GetAsyncKeyState(vk) & 0x8000) != 0)
                {
                    return true;
                }
            }

            return false;
        }

        static int RunScreensaver()
        {
            // Enforce single active screensaver launcher to avoid overlapping runs
            bool createdNew;
            string mutexName = "Local\\BeaconScreensaverLauncherMutex_" + Environment.UserName;
            using (Mutex mutex = new Mutex(true, mutexName, out createdNew))
            {
                if (!createdNew)
                {
                    Log("Mutex acquisition notice: " + mutexName + " is already active. Exiting duplicate launcher instance.");
                    return 0;
                }
                Log("Mutex acquired: " + mutexName);

                string ctrlPipeName = "beacon-screensaver-ctrl-" + Environment.UserName;
                string fallbackCtrlPipeName = "helm-screensaver-ctrl-" + Environment.UserName;
                string exitPipeName = "beacon-screensaver-exit-" + Environment.UserName;

                // Step 1: Attempt direct activation via control pipe (fast path if Helm is running)
                bool activatedViaPipe = TryActivateViaPipe(ctrlPipeName) || TryActivateViaPipe(fallbackCtrlPipeName);
                Process spawnedProc = null;

                if (activatedViaPipe)
                {
                    Log("Successfully activated existing BEACON instance via control pipe. Zero launch overhead.");
                }
                else
                {
                    Log("Control pipe not reachable. Searching BEACON executable to launch...");
                    string beaconExe = FindBeaconExecutable();
                    if (string.IsNullOrEmpty(beaconExe))
                    {
                        Log("ERROR: BEACON executable not found in any candidate path");
                        MessageBox.Show("BEACON executable not found. Please ensure BEACON is installed.",
                            "BEACON Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                        return 1;
                    }
                    Log("BEACON executable resolved: " + beaconExe);

                    ProcessStartInfo psi = new ProcessStartInfo(beaconExe, "--screensaver");
                    psi.UseShellExecute = false;
                    psi.CreateNoWindow = true;

                    // Ensure ELECTRON_RUN_AS_NODE is never inherited into GUI process
                    if (psi.EnvironmentVariables.ContainsKey("ELECTRON_RUN_AS_NODE"))
                    {
                        psi.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE");
                    }

                    spawnedProc = Process.Start(psi);
                    Log("Beacon.exe process started. Initial PID=" + (spawnedProc != null ? spawnedProc.Id.ToString() : "unknown"));
                }

                // Step 2: Create exit pipe server for graceful dismissal coordination
                using (NamedPipeServerStream exitPipeServer = new NamedPipeServerStream(
                    exitPipeName,
                    PipeDirection.In,
                    NamedPipeServerStream.MaxAllowedServerInstances,
                    PipeTransmissionMode.Byte,
                    PipeOptions.Asynchronous))
                {
                    IAsyncResult asyncResult = exitPipeServer.BeginWaitForConnection(null, null);
                    Point initialPos = Cursor.Position;
                    DateTime startTime = DateTime.UtcNow;
                    const int GRACE_PERIOD_MS = 800;
                    const int MOVE_THRESHOLD = 15;

                    Log("Entering fail-safe screensaver wait loop (monitoring exit pipe, hardware mouse & key events)...");

                    while (true)
                    {
                        // Check A: Exit signal received from BEACON via exit named pipe
                        if (asyncResult.IsCompleted)
                        {
                            try
                            {
                                exitPipeServer.EndWaitForConnection(asyncResult);
                                Log("Exit signal received on named pipe from BEACON. Screensaver dismissing.");
                            }
                            catch (Exception ex)
                            {
                                Log("Pipe EndWaitForConnection note: " + ex.Message);
                            }
                            break;
                        }

                        // Check B: Hardware Fail-Safe Input Detection (Mouse & Keyboard)
                        double elapsedMs = (DateTime.UtcNow - startTime).TotalMilliseconds;
                        if (elapsedMs > GRACE_PERIOD_MS)
                        {
                            // Mouse movement check
                            Point currentPos = Cursor.Position;
                            int dx = Math.Abs(currentPos.X - initialPos.X);
                            int dy = Math.Abs(currentPos.Y - initialPos.Y);
                            if (dx >= MOVE_THRESHOLD || dy >= MOVE_THRESHOLD)
                            {
                                Log(string.Format("Native Launcher: Fail-safe mouse movement detected (dx={0}, dy={1}). Dismissing screensaver immediately.", dx, dy));
                                SignalDeactivateViaPipe(ctrlPipeName); SignalDeactivateViaPipe(fallbackCtrlPipeName);
                                break;
                            }

                            // Keyboard or mouse click check
                            if (IsAnyUserKeyPressed())
                            {
                                Log("Native Launcher: Fail-safe keyboard or button press detected. Dismissing screensaver immediately.");
                                SignalDeactivateViaPipe(ctrlPipeName);
                                break;
                            }
                        }

                        // Check C: If we spawned a dedicated Helm process and it exited
                        // Guard with !activatedViaPipe so that if we activated via pipe but
                        // also accidentally spawned a second instance (edge case), we don't
                        // exit the monitoring loop prematurely when that second instance dies.
                        if (!activatedViaPipe && spawnedProc != null && spawnedProc.HasExited)
                        {
                            Log(string.Format("Spawned BEACON process PID={0} has exited with code {1}. Concluding screensaver session.",
                                spawnedProc.Id, spawnedProc.ExitCode));
                            break;
                        }

                        Thread.Sleep(50);
                    }
                }
            }
            return 0;
        }

        static void RunConfig()
        {
            string[] ctrlPipes = new string[]
            {
                "beacon-screensaver-ctrl-" + Environment.UserName,
                "helm-screensaver-ctrl-" + Environment.UserName
            };

            foreach (string pipe in ctrlPipes)
            {
                try
                {
                    using (NamedPipeClientStream client = new NamedPipeClientStream(".", pipe, PipeDirection.Out))
                    {
                        client.Connect(200);
                        using (StreamWriter writer = new StreamWriter(client))
                        {
                            writer.AutoFlush = true;
                            writer.WriteLine("CONFIG");
                            Log("Dispatched CONFIG command to running BEACON via control pipe: " + pipe);
                            return;
                        }
                    }
                }
                catch {}
            }

            string beaconExe = FindBeaconExecutable();
            if (string.IsNullOrEmpty(beaconExe))
            {
                Log("ERROR: Cannot run config; BEACON executable not found");
                MessageBox.Show("BEACON executable not found. Please reinstall BEACON to configure screensaver.",
                    "BEACON Screensaver", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            Log("Launching BEACON with --screensaver-config");
            ProcessStartInfo psi = new ProcessStartInfo(beaconExe, "--screensaver-config");
            psi.UseShellExecute = false;
            psi.CreateNoWindow = true;

            if (psi.EnvironmentVariables.ContainsKey("ELECTRON_RUN_AS_NODE"))
            {
                psi.EnvironmentVariables.Remove("ELECTRON_RUN_AS_NODE");
            }

            Process.Start(psi);
        }

        static void RunPreview(IntPtr parentHwnd)
        {
            Application.EnableVisualStyles();
            using (PreviewForm form = new PreviewForm(parentHwnd))
            {
                Application.Run(form);
            }
        }
    }

    class PreviewForm : Form
    {
        [DllImport("user32.dll")]
        static extern IntPtr SetParent(IntPtr hWndChild, IntPtr hWndNewParent);

        [DllImport("user32.dll")]
        static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        static extern bool GetClientRect(IntPtr hWnd, out Program.RECT lpRect);

        const int GWL_STYLE = -16;
        const int WS_CHILD = 0x40000000;

        private System.Windows.Forms.Timer animTimer;
        private int tickCount = 0;

        public PreviewForm(IntPtr parentHwnd)
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.ShowInTaskbar = false;
            this.DoubleBuffered = true;

            // Embed into Windows Screen Saver Settings dialog preview control
            SetParent(this.Handle, parentHwnd);
            int style = GetWindowLong(this.Handle, GWL_STYLE);
            SetWindowLong(this.Handle, GWL_STYLE, style | WS_CHILD);

            Program.RECT parentRect;
            GetClientRect(parentHwnd, out parentRect);
            this.Size = new Size(parentRect.Width, parentRect.Height);
            this.Location = new Point(0, 0);

            animTimer = new System.Windows.Forms.Timer();
            animTimer.Interval = 1000;
            animTimer.Tick += (s, e) => {
                tickCount++;
                this.Invalidate();
            };
            animTimer.Start();
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            // 1. Draw atmospheric background gradient
            using (LinearGradientBrush brush = new LinearGradientBrush(
                this.ClientRectangle,
                Color.FromArgb(11, 15, 25),
                Color.FromArgb(20, 30, 48),
                LinearGradientMode.Vertical))
            {
                g.FillRectangle(brush, this.ClientRectangle);
            }

            // 2. Draw subtle star / ambient particles
            using (SolidBrush starBrush = new SolidBrush(Color.FromArgb(120, 255, 255, 255)))
            {
                int w = this.Width;
                int h = this.Height;
                g.FillEllipse(starBrush, (int)(w * 0.2), (int)(h * 0.25), 1.5f, 1.5f);
                g.FillEllipse(starBrush, (int)(w * 0.75), (int)(h * 0.18), 2.0f, 2.0f);
                g.FillEllipse(starBrush, (int)(w * 0.85), (int)(h * 0.45), 1.5f, 1.5f);
                g.FillEllipse(starBrush, (int)(w * 0.4), (int)(h * 0.15), 1.0f, 1.0f);
            }

            // 3. Draw "BEACON AMBIENT" branding pill
            using (SolidBrush emeraldBrush = new SolidBrush(Color.FromArgb(16, 185, 129)))
            using (Font pillFont = new Font("Segoe UI", 6f, FontStyle.Bold))
            {
                g.FillEllipse(emeraldBrush, 6, 7, 4, 4);
                g.DrawString("BEACON AMBIENT", pillFont, emeraldBrush, 13, 4);
            }

            // 4. Draw large typography Clock
            DateTime now = DateTime.Now;
            string timeStr = now.ToString("HH:mm");
            using (SolidBrush clockBrush = new SolidBrush(Color.White))
            using (Font clockFont = new Font("Segoe UI", 16f, FontStyle.Regular))
            {
                SizeF clockSize = g.MeasureString(timeStr, clockFont);
                float x = (this.Width - clockSize.Width) / 2f;
                float y = (this.Height - clockSize.Height) / 2f - 4;
                g.DrawString(timeStr, clockFont, clockBrush, x, y);
            }

            // 5. Draw live/sample Weather pill
            using (SolidBrush badgeBg = new SolidBrush(Color.FromArgb(80, 0, 0, 0)))
            using (Pen badgeBorder = new Pen(Color.FromArgb(60, 255, 255, 255)))
            using (SolidBrush textBrush = new SolidBrush(Color.FromArgb(220, 255, 255, 255)))
            using (Font badgeFont = new Font("Segoe UI", 6f, FontStyle.Regular))
            {
                string weatherText = "31°C • Light drizzle";
                SizeF textSize = g.MeasureString(weatherText, badgeFont);
                float bw = textSize.Width + 12;
                float bh = 14;
                float bx = (this.Width - bw) / 2f;
                float by = (this.Height / 2f) + 12;

                g.FillRectangle(badgeBg, bx, by, bw, bh);
                g.DrawRectangle(badgeBorder, bx, by, bw, bh);
                g.DrawString(weatherText, badgeFont, textBrush, bx + 6, by + 1.5f);
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && animTimer != null)
            {
                animTimer.Stop();
                animTimer.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
