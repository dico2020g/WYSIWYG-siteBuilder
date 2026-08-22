const { app, BrowserWindow } = require('electron');
const path = require('path');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  win.webContents.on('console-message', (e, level, message) => {
    if (level >= 2) console.log('CONSOLE:', message.slice(0, 2000));
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();
  })()`);
  await wait(300);
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.ribbon-btn')].find(x => x.textContent.includes('Table')).click();
  })()`);
  await wait(1500);
  app.exit(0);
});
setTimeout(() => { app.exit(2); }, 30000);
