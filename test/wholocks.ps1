param([string]$Path)
$src = @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class RM {
  [StructLayout(LayoutKind.Sequential)] struct RM_UNIQUE_PROCESS { public int dwProcessId; public System.Runtime.InteropServices.ComTypes.FILETIME ProcessStartTime; }
  [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] struct RM_PROCESS_INFO {
    public RM_UNIQUE_PROCESS Process;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)] public string strAppName;
    [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)] public string strServiceShortName;
    public int ApplicationType; public uint AppStatus; public uint TSSessionId; [MarshalAs(UnmanagedType.Bool)] public bool bRestartable;
  }
  [DllImport("rstrtmgr.dll", CharSet = CharSet.Unicode)] static extern int RmStartSession(out uint pSessionHandle, int dwSessionFlags, string strSessionKey);
  [DllImport("rstrtmgr.dll")] static extern int RmEndSession(uint pSessionHandle);
  [DllImport("rstrtmgr.dll", CharSet = CharSet.Unicode)] static extern int RmRegisterResources(uint pSessionHandle, uint nFiles, string[] rgsFilenames, uint nApplications, IntPtr rgApplications, uint nServices, string[] rgsServiceNames);
  [DllImport("rstrtmgr.dll")] static extern int RmGetList(uint dwSessionHandle, out uint pnProcInfoNeeded, ref uint pnProcInfo, [In, Out] RM_PROCESS_INFO[] rgAffectedApps, ref uint lpdwRebootReasons);
  public static void WhoLocks(string path) {
    uint session; string key = Guid.NewGuid().ToString();
    int res = RmStartSession(out session, 0, key);
    if (res != 0) { Console.WriteLine("RmStartSession failed: " + res); return; }
    try {
      string[] files = { path };
      res = RmRegisterResources(session, 1, files, 0, IntPtr.Zero, 0, null);
      if (res != 0) { Console.WriteLine("RmRegisterResources failed: " + res); return; }
      uint needed = 0, count = 0, reasons = 0;
      res = RmGetList(session, out needed, ref count, null, ref reasons);
      if (needed == 0) { Console.WriteLine("NO_LOCKERS"); return; }
      var infos = new RM_PROCESS_INFO[needed];
      count = needed;
      res = RmGetList(session, out needed, ref count, infos, ref reasons);
      if (res == 0) foreach (var i in infos) Console.WriteLine(i.Process.dwProcessId + " " + i.strAppName);
      else Console.WriteLine("RmGetList failed: " + res);
    } finally { RmEndSession(session); }
  }
}
"@
Add-Type -TypeDefinition $src -Language CSharp
[RM]::WhoLocks($Path)
