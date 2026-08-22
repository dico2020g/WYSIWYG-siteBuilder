const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Two buttons; breakpoints 768 / 480. Verifies the responsive cascade:
//  - default propagates down to untouched breakpoints
//  - edit at 768 propagates to 480
//  - once touched at 480, later 768 edits no longer propagate
const project = {
  name: 'CascadeTest',
  breakpointMode: 'smaller',
  breakpoints: [
    { id: 'bp768', name: 'Tablet', maxWidth: 768, orientation: 'none', fontSize: null },
    { id: 'bp480', name: 'Mobile', maxWidth: 480, orientation: 'none', fontSize: null },
  ],
  pages: [
    {
      id: 'p1', name: 'index', width: 970, height: 600, backgroundColor: '#ffffff',
      pageCode: '', headCode: '',
      components: [
        { id: 'c1', type: 'button', x: 100, y: 100, width: 120, height: 36, props: { text: 'One' }, events: {}, overrides: {} },
        { id: 'c2', type: 'button', x: 50, y: 200, width: 120, height: 36, props: { text: 'Two' }, events: {}, overrides: {} },
      ],
    },
  ],
};

let captured = null;
let failed = false;
const check = (name, actual, expected) => {
  const ok = String(actual) === String(expected);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: got ${actual}, want ${expected}`);
  if (!ok) failed = true;
};

app.whenReady().then(async () => {
  ipcMain.handle('project:open', () => ({ json: JSON.stringify(project), filePath: 'cascade.sbp' }));
  ipcMain.handle('preview:site', (_e, files) => { captured = files; return null; });
  ipcMain.handle('app:confirm', () => true);
  ipcMain.handle('app:alert', () => undefined);

  const win = new BrowserWindow({
    width: 1400, height: 900, show: false,
    webPreferences: { offscreen: true, preload: path.join(__dirname, '..', 'electron', 'preload.cjs') },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  const js = (code) => win.webContents.executeJavaScript(code);
  const clickRibbonTab = (label) => js(`(() => {
    const t = [...document.querySelectorAll('.ribbon-tab')].find(x => x.textContent.trim() === ${JSON.stringify(label)});
    if (t) t.click(); return !!t;
  })()`);
  const clickRibbonBtn = (label) => js(`(() => {
    const b = [...document.querySelectorAll('.ribbon-btn')].find(x => x.textContent.includes(${JSON.stringify(label)}));
    if (b) b.click(); return !!b;
  })()`);
  const clickChip = (label) => js(`(() => {
    const b = [...document.querySelectorAll('.breakpoint-bar .bp-chip')].find(x => x.textContent.trim() === ${JSON.stringify(label)});
    if (b) b.click(); return !!b;
  })()`);
  const selectComponent = (idx) => js(`(() => {
    const el = document.querySelectorAll('.canvas-component')[${idx}];
    if (!el) return false;
    el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
    return true;
  })()`);
  const getX = () => js(`(() => {
    const row = [...document.querySelectorAll('.props-row')].find(r => r.querySelector('.props-label')?.textContent.trim() === 'X');
    return row ? row.querySelector('input')?.value : null;
  })()`);
  const setX = (v) => js(`(() => {
    const row = [...document.querySelectorAll('.props-row')].find(r => r.querySelector('.props-label')?.textContent.trim() === 'X');
    const input = row?.querySelector('input');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(String(v))});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  })()`);

  // load project
  await clickRibbonTab('File');
  await wait(200);
  await clickRibbonBtn('Open');
  await wait(500);

  // --- c2: default edit propagates down to untouched breakpoints ---
  await selectComponent(1);
  await wait(200);
  await setX(200);
  await wait(200);
  await clickChip('768px');
  await wait(300);
  check('c2 @768 inherits default x=200', await getX(), 200);
  await clickChip('Default');
  await wait(300);

  // --- c1: edit at 768 propagates to 480 ---
  await selectComponent(0);
  await wait(200);
  check('c1 default x=100', await getX(), 100);
  await clickChip('768px');
  await wait(300);
  await setX(300);
  await wait(200);
  await clickChip('480px');
  await wait(300);
  check('c1 @480 inherits 768 x=300', await getX(), 300);

  // --- touch c1 at 480, then 768 changes must NOT propagate ---
  await setX(500);
  await wait(200);
  await clickChip('768px');
  await wait(300);
  check('c1 @768 still x=300', await getX(), 300);
  await setX(350);
  await wait(200);
  await clickChip('480px');
  await wait(300);
  check('c1 @480 keeps own x=500', await getX(), 500);
  await clickChip('Default');
  await wait(300);
  check('c1 default still x=100', await getX(), 100);

  // --- exported CSS: media queries carry the resolved arrangements ---
  await clickRibbonTab('Home');
  await wait(200);
  await clickRibbonBtn('Preview');
  await wait(500);
  if (!captured) { console.log('FAIL preview files not captured'); failed = true; }
  else {
    const css = captured.find((f) => f.name === 'css/site.css')?.content ?? '';
    fs.writeFileSync(path.join(__dirname, 'cascade-site.css'), css);
    const m768 = css.match(/@media \(max-width: 768px\)[\s\S]*?\n\}/);
    const m480 = css.match(/@media \(max-width: 480px\)[\s\S]*?\n\}/);
    check('css 768 has c1 left:350px', m768 && m768[0].includes('left: 350px') ? 'yes' : 'no', 'yes');
    check('css 480 has c1 left:500px', m480 && m480[0].includes('left: 500px') ? 'yes' : 'no', 'yes');
    check('css 768 has c2 left:200px', m768 && m768[0].includes('left: 200px') ? 'yes' : 'no', 'yes');
  }

  console.log(failed ? 'RESULT: FAIL' : 'RESULT: PASS');
  app.exit(failed ? 1 : 0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 90000);
