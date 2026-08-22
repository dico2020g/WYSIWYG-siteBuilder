// Auto-stretch smoke test: place a component, drag it (via store-driven
// pointer events) below the canvas bottom, verify the artboard grows.
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
    const out = { errors: [] };
    const artboard = document.querySelector('.artboard');
    if (!artboard) { out.errors.push('no artboard'); return out; }
    out.heightBefore = artboard.getBoundingClientRect().height;

    // place a Combobox via toolbox click + artboard click
    const label = [...document.querySelectorAll('.toolbox-item .item-label')].find(el => el.textContent.trim() === 'Combobox');
    label.closest('.toolbox-item').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(100);
    const r = artboard.getBoundingClientRect();
    artboard.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + 100, clientY: r.top + 100 }));
    await sleep(150);

    // drag it far below the page bottom with pointer events
    const cmp = artboard.lastElementChild;
    if (!cmp) { out.errors.push('component not placed'); return out; }
    const cr = cmp.getBoundingClientRect();
    const startX = cr.left + cr.width / 2, startY = cr.top + cr.height / 2;
    cmp.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: startX, clientY: startY, button: 0 }));
    window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: startX, clientY: startY + 1200 }));
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: startX, clientY: startY + 1200 }));
    await sleep(200);

    out.heightAfter = artboard.getBoundingClientRect().height;
    const cmpRect = cmp.getBoundingClientRect();
    out.componentBottom = cmpRect.bottom - r.top;
    out.covered = cmpRect.bottom <= artboard.getBoundingClientRect().bottom + 1;
    // page Height property should reflect the grown height (nothing selected → deselect first)
    artboard.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }));
    await sleep(100);
    const rows = [...document.querySelectorAll('.right-column *')].map(e => e.textContent);
    return out;
  })()`);
  console.log('RESULT:', JSON.stringify(result, null, 2));

  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-stretch.png'), img.toPNG());

  const ok = errors === 0 && result.errors.length === 0 && result.heightAfter > result.heightBefore && result.covered;
  console.log(ok ? 'STRETCH OK' : 'STRETCH FAILED');
  app.exit(ok ? 0 : 1);
});

setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 40000);
