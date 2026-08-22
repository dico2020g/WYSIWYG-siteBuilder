const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };
  const clickRibbon = (label) => win.webContents.executeJavaScript(`(() => {
    const b = [...document.querySelectorAll('.ribbon-btn')].find(x => x.textContent.includes(${JSON.stringify(label)}));
    if (b) b.click(); return !!b;
  })()`);

  // Database ribbon tab
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();
  })()`);
  await wait(300);

  // 1. Open Table tab -> toolbox should be hidden, empty list shown
  console.log('table:', await clickRibbon('Table'));
  await wait(500);
  await shot('smoke-dbtab-1-table-empty.png');

  // 2. New Table -> appears in list and opens editor
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('New Table')).click();
  })()`);
  await wait(400);
  await shot('smoke-dbtab-2-table-editor.png');

  // 3. Query tab -> New Query -> SQL editor
  await clickRibbon('New Query');
  await wait(400);
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.includes('New Query')).click();
  })()`);
  await wait(400);
  await shot('smoke-dbtab-3-query-editor.png');

  // 4. back to design page -> toolbox visible again
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.page-tab')].find(t => t.textContent.trim() === 'index').click();
  })()`);
  await wait(400);
  await shot('smoke-dbtab-4-back.png');

  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
