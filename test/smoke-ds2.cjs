const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const db = require('../electron/db.cjs');

ipcMain.handle('db:test', async (_e, cfg) => db.testConnection(cfg));
ipcMain.handle('db:listObjects', async (_e, cfg) => db.listObjects(cfg));
ipcMain.handle('db:listDatabases', async (_e, cfg) => db.listDatabases(cfg));
ipcMain.handle('db:listColumns', async (_e, cfg, t) => db.listColumns(cfg, t));
ipcMain.handle('db:fetchRows', async (_e, cfg, t, l) => db.fetchRows(cfg, t, l));
ipcMain.handle('db:dropTable', async (_e, cfg, t) => db.dropTable(cfg, t));

const SQLITE_PATH = path.join(__dirname, 'test.sqlite').replace(/\\/g, '\\\\');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1600, height: 950, show: false,
    webPreferences: { offscreen: true, preload: path.join(__dirname, '..', 'electron', 'preload.cjs') },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));
  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };
  const js = (code) => win.webContents.executeJavaScript(code);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // seed a connection via the modal
  await js(`[...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();`);
  await sleep(200);
  await js(`[...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.includes('Data Connections')).click();`);
  await sleep(300);
  await js(`[...document.querySelectorAll('.db-link-btn')].find(b => b.textContent.includes('New Connection')).click();`);
  await sleep(200);
  await js(`(() => {
    const sel = document.querySelector('.db-form select');
    const set = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    set.call(sel, 'sqlite');
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await sleep(150);
  await js(`(() => {
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const inputs = document.querySelectorAll('.db-form input');
    set.call(inputs[0], 'Demo SQLite'); inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    set.call(inputs[1], '${SQLITE_PATH}'); inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(150);
  await js(`[...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('Save Connection')).click();`);
  await sleep(300);

  // Data Source tab in the properties panel
  await js(`[...document.querySelectorAll('.props-tab')].find(b => b.textContent.trim() === 'Data Source').click();`);
  await sleep(400);
  await shot('smoke-ds2-1-tab.png');

  // expand connection → database → tables → users fields
  await js(`[...document.querySelectorAll('.ds-node')].find(n => n.textContent.includes('Demo SQLite')).click();`);
  await sleep(1000);
  await js(`[...document.querySelectorAll('.ds-node')].find(n => n.textContent.includes('test.sqlite')).click();`);
  await sleep(1500);
  await js(`[...document.querySelectorAll('.ds-node')].find(n => n.textContent.includes('Tables')).click();`);
  await sleep(200);
  await js(`[...document.querySelectorAll('.ds-node')].find(n => n.textContent.includes('users')).click();`);
  await sleep(1000);
  await shot('smoke-ds2-2-tree.png');

  // right-click posts → context menu
  await js(`(() => {
    const n = [...document.querySelectorAll('.ds-node')].find(n => n.textContent.includes('posts'));
    const r = n.getBoundingClientRect();
    n.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 10, clientY: r.top + 5 }));
  })()`);
  await sleep(300);
  await shot('smoke-ds2-3-ctx.png');

  // Open Table from context menu → modal grid
  await js(`[...document.querySelectorAll('.ds-ctx button')].find(b => b.textContent.includes('Open Table')).click();`);
  await sleep(1000);
  await shot('smoke-ds2-4-open.png');
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 90000);
