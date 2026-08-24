const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));

  const snap = async (name, rect) => {
    const img = await win.webContents.capturePage(rect);
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('OK', name, JSON.stringify(rect));
  };

  // 1) ribbon on default (Home) tab + left panels
  const ribbon = await win.webContents.executeJavaScript(`(() => {
    const r = document.querySelector('.ribbon').getBoundingClientRect();
    return { x: 0, y: Math.floor(r.top), width: Math.ceil(r.width), height: Math.ceil(r.height) };
  })()`);
  await snap('smoke-icons-ribbon-home.png', ribbon);

  const left = await win.webContents.executeJavaScript(`(() => {
    const t = document.querySelector('.toolbox-panel').getBoundingClientRect();
    const s = document.querySelector('.site-manager-panel').getBoundingClientRect();
    const top = Math.min(t.top, s.top), bottom = Math.max(t.bottom, s.bottom);
    return { x: Math.floor(t.left), y: Math.floor(top), width: Math.ceil(t.width), height: Math.min(900, Math.ceil(bottom - top)) };
  })()`);
  await snap('smoke-icons-panels.png', left);

  // 2) switch to Insert tab and capture ribbon again
  await win.webContents.executeJavaScript(`(() => {
    const tab = [...document.querySelectorAll('.ribbon-tab')].find((b) => b.textContent === 'Insert');
    if (tab) tab.click();
    return true;
  })()`);
  await new Promise((r) => setTimeout(r, 500));
  await snap('smoke-icons-ribbon-insert.png', ribbon);

  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 30000);
