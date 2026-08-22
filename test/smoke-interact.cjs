// Interaction smoke test: places components on the canvas via simulated
// toolbox click + artboard click, then screenshots the result.
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let errors = 0;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  win.webContents.on('console-message', (_e, level, msg) => {
    if (level >= 3) { errors++; console.log('CONSOLE-ERROR:', msg); }
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await new Promise((r) => setTimeout(r, 2000));

  const result = await win.webContents.executeJavaScript(`(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const clickAt = (el, x, y) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + (x ?? r.width / 2), cy = r.top + (y ?? r.height / 2);
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: cx, clientY: cy }));
    };
    const out = { placed: [], errors: [] };

    // artboard = the scaled white page div (position:relative child of workspace spacer)
    const artboard = document.querySelector('.center-column div[style*="scale"]');
    if (!artboard) { out.errors.push('no artboard'); return out; }

    const placeTypes = ['Heading', 'Button', 'Editbox', 'Image'];
    for (const label of placeTypes) {
      // find toolbox item row by its label span
      const labels = [...document.querySelectorAll('.toolbox-item .item-label')];
      const labelEl = labels.find(el => el.textContent.trim() === label);
      const item = labelEl ? labelEl.closest('.toolbox-item') : null;
      if (!item) { out.errors.push('toolbox item not found: ' + label); continue; }
      clickAt(item);
      await sleep(100);
      clickAt(artboard, 120 + placeTypes.indexOf(label) * 60, 120 + placeTypes.indexOf(label) * 90);
      await sleep(100);
      out.placed.push(label);
    }
    out.artboardChildren = artboard.children.length;
    out.propertiesHeader = document.querySelector('.right-column')?.innerText.slice(0, 200);
    return out;
  })()`);
  console.log('RESULT:', JSON.stringify(result, null, 2));

  await new Promise((r) => setTimeout(r, 500));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-interact.png'), img.toPNG());
  console.log(errors === 0 && result.errors.length === 0 ? 'INTERACT OK' : 'INTERACT FAILED');
  app.exit(errors === 0 && result.errors.length === 0 ? 0 : 1);
});

setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 30000);
