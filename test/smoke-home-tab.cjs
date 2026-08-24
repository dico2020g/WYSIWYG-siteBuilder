// Smoke test: Home tab ribbon features + context menu.
// Run: env -u ELECTRON_RUN_AS_NODE node_modules/.bin/electron test/smoke-home-tab.cjs
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const failures = [];
let win;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snap(name, rect) {
  const img = await win.webContents.capturePage(rect);
  fs.writeFileSync(path.join(__dirname, name), img.toPNG());
  console.log('OK shot', name);
}

async function js(code, step) {
  try {
    return await win.webContents.executeJavaScript(`(async () => { ${code} })()`);
  } catch (e) {
    failures.push('js:' + (step || code.slice(0, 60)));
    console.error('JS ERROR at', step || '?', '-', e.message);
    return undefined;
  }
}

function check(name, cond) {
  if (cond) console.log('ok  -', name);
  else {
    failures.push(name);
    console.error('FAIL -', name);
  }
}

app.whenReady().then(async () => {
  win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  const errors = [];
  win.webContents.on('console-message', (_e, _l, msg) => {
    if (/error/i.test(msg) && !/Download the React DevTools/.test(msg)) errors.push(msg);
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await sleep(2000);
  // No preload in the offscreen window — stub the bridge so appPrompt uses the in-app modal.
  await js('window.sitebuilder = window.sitebuilder || {}; return true;', 'stub bridge');

  const helpers = `
    const clickByLabel = (label) => {
      const btn = [...document.querySelectorAll('.ribbon-btn')].find((b) => b.textContent.trim().startsWith(label));
      if (!btn) throw new Error('ribbon button not found: ' + label);
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    const clickGrid = (title) => {
      const btn = document.querySelector('.ribbon-grid-btn[title="' + title + '"]');
      if (!btn) throw new Error('grid button not found: ' + title);
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    const clickMenuItem = (label) => {
      const item = [...document.querySelectorAll('.ribbon-menu .cm-item, .context-menu .cm-item, .context-submenu .cm-item')]
        .find((el) => el.textContent.trim().startsWith(label));
      if (!item) throw new Error('menu item not found: ' + label);
      item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    const hoverMenuItem = (label) => {
      const item = [...document.querySelectorAll('.ribbon-menu .cm-item, .context-menu .cm-item')]
        .find((el) => el.textContent.trim().startsWith(label));
      if (!item) throw new Error('menu item not found: ' + label);
      item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    };
    const insertAt = async (label, dx, dy) => {
      const item = [...document.querySelectorAll('.toolbox-item .item-label')].find((el) => el.textContent.trim() === label);
      item.closest('.toolbox-item').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 150));
      const artboard = document.querySelector('.artboard');
      const r = artboard.getBoundingClientRect();
      artboard.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + dx, clientY: r.top + dy }));
      await new Promise((r) => setTimeout(r, 150));
    };
    const lefts = () => [...document.querySelectorAll('.canvas-component')].map((el) => parseFloat(el.style.left));
    const count = () => document.querySelectorAll('.canvas-component').length;
  `;

  // ---- insert 3 text components ----
  await js(`${helpers}
    await insertAt('Text', 100, 100);
    await insertAt('Text', 420, 260);
    await insertAt('Text', 700, 140);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    await new Promise((r) => setTimeout(r, 200));
  `);
  await sleep(300);
  let n = await js('return document.querySelectorAll(".canvas-component").length;');
  check('3 components inserted', n === 3);
  let sel = await js('return document.querySelectorAll(".canvas-component.selected").length;');
  check('Ctrl+A selects all', sel === 3);

  // Home tab ribbon screenshot
  const ribbonRect = await js(`const r = document.querySelector('.ribbon').getBoundingClientRect();
    return { x: 0, y: Math.floor(r.top), width: Math.ceil(r.width), height: Math.ceil(r.height) };`);
  await snap('smoke-home-ribbon.png', ribbonRect);

  // ---- Distribute menu (screenshot) then Horizontally ----
  await js(`${helpers} clickByLabel('Distribute');`);
  await sleep(300);
  await js(`${helpers} hoverMenuItem('Center in Page');`);
  await sleep(300);
  await snap('smoke-home-distribute-menu.png', { x: 0, y: 0, width: 900, height: 500 });
  const beforeDist = await js(`${helpers} return lefts().sort((a,b)=>a-b);`);
  await js(`${helpers} clickMenuItem('Horizontally');`);
  await sleep(300);
  const afterDist = await js(`${helpers} return lefts().sort((a,b)=>a-b);`);
  const gaps = afterDist.map((v, i) => (i === 0 ? 0 : v - afterDist[i - 1])).slice(1);
  check('distribute ran (positions changed)', JSON.stringify(beforeDist) !== JSON.stringify(afterDist));
  check('distribute equalizes gaps', Math.abs(gaps[0] - gaps[1]) < 1);
  console.log('   gaps:', JSON.stringify(gaps));

  // ---- Align Left ----
  await js(`${helpers} clickGrid('Left');`);
  await sleep(300);
  let lefts = await js(`${helpers} return lefts();`);
  check('align left equalizes x', new Set(lefts).size === 1);

  // ---- Rotate Right 90° ----
  await js(`${helpers} clickGrid('Rotate Right 90°');`);
  await sleep(300);
  const transforms = await js(`return [...document.querySelectorAll('.canvas-component')].map((el) => el.style.transform);`);
  check('rotate applied to wrappers', transforms.every((t) => t.includes('rotate(90deg)')));

  // ---- Group dropdown (screenshot) then Group ----
  await js(`${helpers} clickByLabel('Group');`);
  await sleep(300);
  await snap('smoke-home-group-menu.png', { x: 0, y: 0, width: 900, height: 500 });
  await js(`${helpers} clickMenuItem('Group');`);
  await sleep(300);
  // click one member without modifiers -> whole group stays selected
  const groupSel = await js(`${helpers}
    const cmp = document.querySelector('.canvas-component');
    const r = cmp.getBoundingClientRect();
    cmp.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, clientX: r.left + 5, clientY: r.top + 5 }));
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    await new Promise((r2) => setTimeout(r2, 200));
    return document.querySelectorAll('.canvas-component.selected').length;
  `);
  check('group click selects all members', groupSel === 3);

  // ---- Lock ----
  await js(`${helpers} clickByLabel('Lock');`);
  await sleep(200);
  const locks = await js(`return document.querySelectorAll('.cv-lock').length;`);
  check('lock badges shown', locks === 3);
  await js(`${helpers} clickByLabel('Unlock All');`);
  await sleep(200);

  // ---- Protected ----
  await js(`${helpers} clickByLabel('Protected Content');`);
  await sleep(200);
  const prot = await js(`return document.querySelectorAll('.cv-protected').length;`);
  check('protected badges shown', prot === 3);
  await js(`${helpers} clickByLabel('Protected Content');`);
  await sleep(200);

  // ---- Margin dialog ----
  await js(`${helpers} clickByLabel('Margin');`);
  await sleep(300);
  const dlgOpen = await js(`return !!document.querySelector('.dlg');`);
  check('margin dialog opens', dlgOpen);
  await snap('smoke-home-margin-dialog.png', { x: 500, y: 250, width: 500, height: 400 });
  await js(`${helpers}
    document.querySelectorAll('.dlg .db-input').forEach((inp) => {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inp, '12px');
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    });
    [...document.querySelectorAll('.dlg .db-btn')].find((b) => b.textContent === 'OK').click();
  `);
  await sleep(300);
  const margins = await js(`return [...document.querySelectorAll('.canvas-component .cv-content')].map((el) => el.style.margin);`);
  check('margin applied to selection', margins.every((m) => m === '12px'));

  // ---- Merge / Split via ribbon ----
  await js(`${helpers} clickByLabel('Group');`);
  await sleep(250);
  await js(`${helpers} clickMenuItem('Merge');`);
  await sleep(300);
  n = await js('return document.querySelectorAll(".canvas-component").length;');
  check('merge combines 3 into 1', n === 1);
  await js(`${helpers} clickByLabel('Group');`);
  await sleep(250);
  await js(`${helpers} clickMenuItem('Split');`);
  await sleep(300);
  n = await js('return document.querySelectorAll(".canvas-component").length;');
  check('split restores 3', n === 3);

  // ---- Save as Block ----
  await js(`${helpers} window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));`, 'ctrl+a before block');
  await sleep(200);
  await js(`${helpers} clickByLabel('Save as Block');`, 'save-as-block click');
  await sleep(400);
  const dlgState = await js(`return { dlg: !!document.querySelector('.dlg'), inputs: document.querySelectorAll('.dlg .db-input').length };`, 'block dlg state');
  console.log('   block dialog state:', JSON.stringify(dlgState));
  await js(`${helpers}
    const inp = document.querySelector('.dlg .db-input');
    if (!inp) throw new Error('no prompt input');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(inp, 'Test Block');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    [...document.querySelectorAll('.dlg .db-btn')].find((b) => b.textContent === 'OK').click();
  `, 'save-as-block fill');
  await sleep(300);
  const hasBlock = await js(`return [...document.querySelectorAll('.block-card-custom .item-label')].some((el) => el.textContent === 'Test Block');`);
  check('block saved to Blocks panel', hasBlock);
  await js(`${helpers} [...document.querySelectorAll('.block-card-custom')].find((el) => el.textContent.includes('Test Block')).click();`);
  await sleep(300);
  n = await js('return document.querySelectorAll(".canvas-component").length;');
  check('block insert adds 3 components', n === 6);

  // ---- Context menu on selection ----
  await js(`${helpers}
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    await new Promise((r) => setTimeout(r, 200));
    const cmp = document.querySelector('.canvas-component');
    const r = cmp.getBoundingClientRect();
    cmp.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: r.left + 8, clientY: r.top + 8 }));
    await new Promise((r2) => setTimeout(r2, 300));
  `);
  await sleep(300);
  const menuInfo = await js(`return {
    open: !!document.querySelector('.context-menu'),
    items: document.querySelectorAll('.context-menu > .cm-item').length,
    disabled: [...document.querySelectorAll('.context-menu > .cm-item.disabled')].map((el) => el.textContent.trim()),
    selected: document.querySelectorAll('.canvas-component.selected').length,
  };`);
  check('context menu opens', menuInfo.open);
  check('multi-selection kept on right-click', menuInfo.selected === 6);
  console.log('   disabled items:', JSON.stringify(menuInfo.disabled));
  await snap('smoke-home-context.png', { x: 0, y: 0, width: 800, height: 950 });
  await js(`${helpers} hoverMenuItem('Center in Page');`);
  await sleep(300);
  await snap('smoke-home-context-flyout.png', { x: 0, y: 0, width: 900, height: 950 });
  const flyout = await js(`return !!document.querySelector('.context-submenu');`);
  check('center flyout opens', flyout);
  // use the flyout: center horizontally
  await js(`${helpers} clickMenuItem('Make width same as page width');`);
  await sleep(300);
  const widths = await js(`return [...document.querySelectorAll('.canvas-component')].map((el) => parseFloat(el.style.width));`);
  const artW = await js(`return document.querySelector('.artboard').getBoundingClientRect().width;`);
  check('page width applied (within zoom tolerance)', widths.every((w) => Math.abs(w - artW) < artW * 0.05 + 20));

  check('no renderer console errors', errors.length === 0);
  if (errors.length) console.error(errors.slice(0, 5).join('\n'));

  console.log(failures.length === 0 ? 'ALL PASS' : 'FAILURES: ' + failures.join(' | '));
  app.exit(failures.length === 0 ? 0 : 1);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
