const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));
  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };

  // open Database tab → Data Connections
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();
  `);
  await new Promise((r) => setTimeout(r, 200));
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.includes('Data Connections')).click();
  `);
  await new Promise((r) => setTimeout(r, 300));

  // New Connection → edit name → Save
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-link-btn')].find(b => b.textContent.includes('New Connection')).click();
  `);
  await new Promise((r) => setTimeout(r, 200));
  await win.webContents.executeJavaScript(`(() => {
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const nameInput = document.querySelector('.db-form input');
    set.call(nameInput, 'MySQL Local');
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await new Promise((r) => setTimeout(r, 100));
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('Save Connection')).click();
  `);
  await new Promise((r) => setTimeout(r, 300));
  await shot('smoke-db2-connection-saved.png');

  // Tables page → New Table → should jump to Table Design
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-header-tab')].find(x => x.textContent.includes('DATABASE CREATION')).click();
  `);
  await new Promise((r) => setTimeout(r, 200));
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('New Table')).click();
  `);
  await new Promise((r) => setTimeout(r, 300));
  // Add a column, then Save Table
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('Add Column')).click();
  `);
  await new Promise((r) => setTimeout(r, 200));
  await shot('smoke-db2-tabledesign.png');
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent === 'Save Table').click();
  `);
  await new Promise((r) => setTimeout(r, 200));
  // back to Database Creation → table row should show
  await win.webContents.executeJavaScript(`
    [...document.querySelectorAll('.db-header-tab')].find(x => x.textContent.includes('DATABASE CREATION')).click();
  `);
  await new Promise((r) => setTimeout(r, 300));
  await shot('smoke-db2-tables-filled.png');
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
