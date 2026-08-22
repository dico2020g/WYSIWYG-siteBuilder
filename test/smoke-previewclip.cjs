const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Project reproducing the user's case: pill-shaped heading (blue bg, big radius),
// fixed height 60 — UA h1 margins used to push the text out and clip it in preview.
const project = {
  name: 'ClipTest',
  breakpoints: [],
  pages: [
    {
      id: 'p1', name: 'index', width: 970, height: 400, backgroundColor: '#ffffff',
      components: [
        {
          id: 'c1', type: 'heading', x: 20, y: 20, width: 700, height: 60,
          props: {
            text: 'Heading', level: 'h1', fontSize: 32, fontWeight: 'bold',
            color: '#ffffff', backgroundColor: '#0b5ed7', borderRadius: 9999,
            textAlign: 'center',
          },
        },
      ],
    },
  ],
};

let captured = null;

app.whenReady().then(async () => {
  ipcMain.handle('project:open', () => ({ json: JSON.stringify(project), filePath: 'cliptest.sbp' }));
  ipcMain.handle('preview:site', (_e, files) => { captured = files; return null; });
  ipcMain.handle('app:confirm', () => true);
  ipcMain.handle('app:alert', () => undefined);

  const win = new BrowserWindow({
    width: 1200, height: 800, show: false,
    webPreferences: { offscreen: true, preload: path.join(__dirname, '..', 'electron', 'preload.cjs') },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };
  const clickRibbonTab = (label) => win.webContents.executeJavaScript(`(() => {
    const t = [...document.querySelectorAll('.ribbon-tab')].find(x => x.textContent.trim() === ${JSON.stringify(label)});
    if (t) t.click(); return !!t;
  })()`);
  const clickRibbonBtn = (label) => win.webContents.executeJavaScript(`(() => {
    const b = [...document.querySelectorAll('.ribbon-btn')].find(x => x.textContent.includes(${JSON.stringify(label)}));
    if (b) b.click(); return !!b;
  })()`);

  // open the test project
  await clickRibbonTab('File');
  await wait(300);
  console.log('open:', await clickRibbonBtn('Open'));
  await wait(600);
  await shot('smoke-previewclip-1-design.png');

  // preview -> capture exported files
  await clickRibbonTab('Home');
  await wait(300);
  console.log('preview:', await clickRibbonBtn('Preview'));
  await wait(600);
  if (!captured) { console.error('preview files not captured'); app.exit(2); }

  const outDir = path.join(__dirname, 'preview-out');
  fs.rmSync(outDir, { recursive: true, force: true });
  for (const f of captured) {
    const p = path.join(outDir, f.name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content);
  }
  console.log('captured files:', captured.map((f) => f.name).join(', '));

  await win.loadFile(path.join(outDir, 'index.html'));
  await wait(800);
  await shot('smoke-previewclip-2-preview.png');

  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
