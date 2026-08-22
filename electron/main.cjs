const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 950,
    minWidth: 1100,
    minHeight: 700,
    title: 'WYSIWYG SiteBuilder',
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.setMenuBarVisibility(false);
  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  }
}

// ---- IPC: project save/open ----
ipcMain.handle('project:saveAs', async (_e, json, suggestedName) => {
  const res = await dialog.showSaveDialog({
    title: 'Save Project',
    defaultPath: (suggestedName || 'project') + '.wbp',
    filters: [{ name: 'SiteBuilder Project', extensions: ['wbp'] }],
  });
  if (res.canceled || !res.filePath) return null;
  fs.writeFileSync(res.filePath, json, 'utf8');
  return res.filePath;
});

ipcMain.handle('project:save', async (_e, filePath, json) => {
  fs.writeFileSync(filePath, json, 'utf8');
  return filePath;
});

ipcMain.handle('project:open', async () => {
  const res = await dialog.showOpenDialog({
    title: 'Open Project',
    filters: [{ name: 'SiteBuilder Project', extensions: ['wbp'] }],
    properties: ['openFile'],
  });
  if (res.canceled || res.filePaths.length === 0) return null;
  const filePath = res.filePaths[0];
  const json = fs.readFileSync(filePath, 'utf8');
  return { filePath, json };
});

// ---- IPC: export ----
ipcMain.handle('export:site', async (_e, files) => {
  const res = await dialog.showOpenDialog({
    title: 'Choose export folder',
    properties: ['openDirectory', 'createDirectory'],
  });
  if (res.canceled || res.filePaths.length === 0) return null;
  const dir = res.filePaths[0];
  for (const f of files) {
    const target = path.join(dir, f.name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, f.content, 'utf8');
  }
  return dir;
});

// ---- IPC: preview in browser ----
ipcMain.handle('preview:site', async (_e, files, entryName) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitebuilder-preview-'));
  for (const f of files) {
    const target = path.join(dir, f.name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, f.content, 'utf8');
  }
  const entry = path.join(dir, entryName || 'index.html');
  await shell.openPath(entry);
  return dir;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
