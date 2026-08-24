const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));
  const rect = await win.webContents.executeJavaScript(`(() => {
    const s = document.querySelector('.site-manager-panel').getBoundingClientRect();
    return { x: Math.floor(s.left), y: Math.floor(s.top), width: Math.ceil(s.width), height: Math.ceil(s.height) };
  })()`);
  const img = await win.webContents.capturePage(rect);
  fs.writeFileSync(path.join(__dirname, 'smoke-icons-tree.png'), img.toPNG());
  console.log('OK', JSON.stringify(rect));
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 30000);
