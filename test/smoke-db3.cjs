const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const db = require('../electron/db.cjs');

ipcMain.handle('db:test', async (_e, cfg) => db.testConnection(cfg));
ipcMain.handle('db:listObjects', async (_e, cfg) => db.listObjects(cfg));

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

  // open Database tab → Data Connections modal
  await js(`[...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();`);
  await sleep(200);
  await js(`[...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.includes('Data Connections')).click();`);
  await sleep(400);
  await shot('smoke-db3-modal.png');

  // New Connection → switch driver to SQLite → set file path
  await js(`[...document.querySelectorAll('.db-link-btn')].find(b => b.textContent.includes('New Connection')).click();`);
  await sleep(200);
  await js(`(() => {
    const sel = document.querySelector('.db-form select');
    const set = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    set.call(sel, 'sqlite');
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await sleep(200);
  await js(`(() => {
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const inputs = document.querySelectorAll('.db-form input');
    set.call(inputs[0], 'Test SQLite');
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    set.call(inputs[1], '${SQLITE_PATH}');
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(150);
  // Test Connection (real)
  await js(`[...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('Test Connection')).click();`);
  await sleep(2500);
  await shot('smoke-db3-tested.png');
  // Save
  await js(`[...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('Save Connection')).click();`);
  await sleep(200);
  await js(`document.querySelector('.db-modal .db-close').click();`);
  await sleep(200);

  // Open full-page workspace via ribbon "Manage"
  await js(`[...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.trim().endsWith('Manage')).click();`);
  await sleep(400);
  await shot('smoke-db3-fullpage.png');

  // Pick the live connection in the toolbar dropdown
  await js(`(() => {
    const sel = document.querySelector('.db-pane-right .db-toolbar select');
    const opt = [...sel.options].find(o => o.textContent.includes('Test SQLite'));
    if (!opt) return 'NO OPTION';
    const set = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    set.call(sel, opt.value);
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  })()`).then((r) => console.log('select:', r));
  await sleep(2500);
  await shot('smoke-db3-live-tables.png');

  // Views category
  await js(`[...document.querySelectorAll('.db-side-item')].find(x => x.textContent.includes('Views')).click();`);
  await sleep(400);
  await shot('smoke-db3-live-views.png');
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 90000);
