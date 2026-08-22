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

  // 1. Click the Database ribbon tab
  await win.webContents.executeJavaScript(`(() => {
    const tab = [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database');
    tab.click(); return tab.textContent;
  })()`);
  await new Promise((r) => setTimeout(r, 300));
  await shot('smoke-db-ribbon.png');

  // 2. Open Data Connections (page 1)
  await win.webContents.executeJavaScript(`(() => {
    const btn = [...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.includes('Data Connections'));
    btn.click();
    // seed a demo connection for the screenshot
    const { useProjectStore } = window.__stores || {};
  })()`);
  await new Promise((r) => setTimeout(r, 400));
  await shot('smoke-db-connections.png');

  // 3. Switch header tabs: tables, tableDesign, apiGenerator
  const pages = ['DATABASE CREATION', 'TABLE DESIGN', 'API GENERATION'];
  const names = ['smoke-db-tables.png', 'smoke-db-tabledesign.png', 'smoke-db-api.png'];
  for (let i = 0; i < pages.length; i++) {
    await win.webContents.executeJavaScript(`(() => {
      const t = [...document.querySelectorAll('.db-header-tab')].find(x => x.textContent.includes(${JSON.stringify(pages[i])}));
      t.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));
    await shot(names[i]);
  }
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
