// Context menu + resizable panels smoke test.
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

    // place a Text component
    const label = [...document.querySelectorAll('.toolbox-item .item-label')].find(el => el.textContent.trim() === 'Text');
    label.closest('.toolbox-item').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await sleep(100);
    const artboard = document.querySelector('.artboard');
    const r = artboard.getBoundingClientRect();
    artboard.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + 300, clientY: r.top + 200 }));
    await sleep(150);

    // right-click the component
    const cmp = artboard.lastElementChild;
    const cr = cmp.getBoundingClientRect();
    cmp.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: cr.left + 20, clientY: cr.top + 10 }));
    await sleep(200);
    const menu = document.querySelector('.context-menu') || document.querySelector('[class*="context"]');
    out.menuOpen = !!menu;
    out.menuText = menu ? menu.innerText.split('\\n').filter(Boolean).slice(0, 12).join(' | ') : null;

    // pick "Copy" then "Paste" via menu
    const pick = async (txt) => {
      const item = [...document.querySelectorAll('[class*="context"] *')].find(e => e.children.length === 0 ? e.textContent.trim() === txt : false)
        || [...document.querySelectorAll('[class*="context"] div, [class*="context"] button')].find(e => e.textContent.trim().startsWith(txt));
      if (item) item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await sleep(150);
    };
    await pick('Copy');
    await sleep(100);
    // reopen menu and Paste
    cmp.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: cr.left + 20, clientY: cr.top + 10 }));
    await sleep(200);
    await pick('Paste');
    out.componentCount = artboard.children.length;

    // resizer: drag left panel handle 60px right
    const resizers = document.querySelectorAll('.panel-resizer');
    out.resizerCount = resizers.length;
    const leftCol = document.querySelector('.left-column');
    out.leftWidthBefore = leftCol.getBoundingClientRect().width;
    const rz = resizers[0].getBoundingClientRect();
    resizers[0].dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: rz.left + 2, clientY: rz.top + 100 }));
    window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: rz.left + 62, clientY: rz.top + 100 }));
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: rz.left + 62, clientY: rz.top + 100 }));
    await sleep(150);
    out.leftWidthAfter = leftCol.getBoundingClientRect().width;
    out.localStorageWidth = localStorage.getItem('sb.leftWidth');
    return out;
  })()`);
  console.log('RESULT:', JSON.stringify(result, null, 2));

  // reopen the menu for a screenshot
  await win.webContents.executeJavaScript(`(async () => {
    const artboard = document.querySelector('.artboard');
    const cmp = artboard.lastElementChild;
    const cr = cmp.getBoundingClientRect();
    cmp.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: cr.left + 20, clientY: cr.top + 10 }));
  })()`);
  await new Promise((r) => setTimeout(r, 300));
  const img = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-context.png'), img.toPNG());

  const ok = errors === 0 && result.errors.length === 0 && result.menuOpen && result.componentCount === 2
    && result.resizerCount === 2 && result.leftWidthAfter > result.leftWidthBefore + 30;
  console.log(ok ? 'CONTEXT OK' : 'CONTEXT FAILED');
  app.exit(ok ? 0 : 1);
});

setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 40000);
