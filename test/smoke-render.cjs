// Offscreen render smoke test: loads the built renderer, captures console
// errors and a screenshot for visual verification.
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let errors = 0;

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 950,
    show: false,
    webPreferences: { offscreen: true },
  });
  win.webContents.on('console-message', (_e, level, msg) => {
    if (level >= 3) { errors++; console.log('CONSOLE-ERROR:', msg); }
  });
  win.webContents.on('did-fail-load', (_e, code, desc) => {
    errors++; console.log('LOAD-FAIL:', code, desc);
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2500));

  const stats = await win.webContents.executeJavaScript(`(() => ({
    shell: !!document.querySelector('.app-shell'),
    ribbonButtons: document.querySelectorAll('button').length,
    toolboxItems: document.querySelectorAll('[class*="toolbox"]').length,
    bodyText: document.body.innerText.slice(0, 300),
  }))()`);
  console.log('STATS:', JSON.stringify(stats, null, 2));

  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke.png'), img.toPNG());
  console.log(errors === 0 ? 'RENDER OK' : `RENDER WITH ${errors} ERRORS`);
  app.exit(errors === 0 ? 0 : 1);
});

setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 30000);
