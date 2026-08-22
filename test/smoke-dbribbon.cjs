const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));

  await win.webContents.executeJavaScript(`(() => {
    const tab = [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database');
    tab.click(); return tab.textContent;
  })()`);
  await new Promise((r) => setTimeout(r, 300));

  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-dbribbon.png'), img.toPNG());
  console.log('shot smoke-dbribbon.png');
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
