const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));
  const rect = await win.webContents.executeJavaScript(`(() => {
    const r = document.querySelector('.breakpoint-bar').getBoundingClientRect();
    return { x: Math.floor(r.left), y: Math.floor(r.top), width: Math.min(500, Math.ceil(r.width)), height: Math.ceil(r.height) };
  })()`);
  const img = await win.webContents.capturePage(rect);
  // upscale 3x for readability
  const { nativeImage } = require('electron');
  const big = nativeImage.createFromBuffer(img.toPNG()).resize({ width: rect.width * 3, height: rect.height * 3, quality: 'good' });
  fs.writeFileSync(path.join(__dirname, 'smoke-bpbar.png'), big.toPNG());
  console.log('OK', JSON.stringify(rect));
  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 30000);
