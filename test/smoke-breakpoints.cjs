// Breakpoint UX smoke test: verifies pinned bottom bar, full-width artboard,
// chips, and the Add/Manage dialogs. Captures two screenshots.
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
    const click = (el) => el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const out = { checks: {}, errors: [] };

    // 1. breakpoint bar pinned at bottom of center column
    const bar = document.querySelector('.breakpoint-bar');
    const center = document.querySelector('.center-column');
    out.checks.barExists = !!bar;
    if (bar && center) {
      const cr = center.getBoundingClientRect(), br = bar.getBoundingClientRect();
      out.checks.barAtBottom = Math.abs(br.bottom - cr.bottom) < 2;
      out.chipLabels = [...bar.querySelectorAll('.bp-chip')].map(c => c.textContent.trim());
    }

    // 2. artboard fills workspace width
    const artboard = document.querySelector('.center-column div[style*="scale"]');
    const workspace = document.querySelector('.canvas-workspace');
    if (artboard && workspace) {
      out.checks.artboardFillsWidth = Math.abs(artboard.getBoundingClientRect().width - (workspace.clientWidth - 48)) < 4;
      out.artboardWidth = artboard.getBoundingClientRect().width;
      out.workspaceWidth = workspace.clientWidth;
    } else out.errors.push('artboard/workspace not found');

    // 3. open Manage dialog via the gear icon in the bar
    const gearBtn = bar ? [...bar.querySelectorAll('button')].find(b => b.title?.toLowerCase().includes('manage') || b.textContent.includes('⚙')) : null;
    if (!gearBtn) { out.errors.push('manage button not found'); return out; }
    click(gearBtn);
    await sleep(300);
    out.checks.manageDialogOpen = !!document.querySelector('.dlg-overlay');
    out.dialogText = document.querySelector('.dlg-overlay')?.innerText.slice(0, 250);
    return out;
  })()`);
  console.log('RESULT:', JSON.stringify(result, null, 2));

  const img1 = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-bp-manage.png'), img1.toPNG());

  // 4. add a breakpoint via the editor dialog, then check the chip appears
  const result2 = await win.webContents.executeJavaScript(`(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const click = (el) => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const overlay = document.querySelector('.dlg-overlay');
    if (!overlay) return { errors: ['no overlay'] };
    // click Add... in manage dialog
    const addBtn = [...overlay.querySelectorAll('button')].find(b => b.textContent.trim() === 'Add...');
    click(addBtn);
    await sleep(300);
    // editor dialog: set width 800
    const dialogs = [...document.querySelectorAll('.dlg-overlay')];
    const editor = dialogs[dialogs.length - 1];
    const widthInput = editor.querySelector('input[type="number"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(widthInput, '800');
    widthInput.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(100);
    const okBtn = [...editor.querySelectorAll('button')].find(b => b.textContent.trim() === 'OK');
    click(okBtn);
    await sleep(200);
    // close manage dialog
    const okManage = [...document.querySelectorAll('.dlg-overlay button')].find(b => b.textContent.trim() === 'OK');
    click(okManage);
    await sleep(200);
    const chips = [...document.querySelectorAll('.breakpoint-bar .bp-chip')].map(c => c.textContent.trim());
    // click the 800px chip to switch breakpoint
    const chip = [...document.querySelectorAll('.breakpoint-bar .bp-chip')].find(c => c.textContent.trim() === '800px');
    click(chip);
    await sleep(200);
    const artboard = document.querySelector('.center-column div[style*="scale"]');
    return { chips, activeChip: document.querySelector('.breakpoint-bar .bp-chip.active, .breakpoint-bar .bp-chip[class*="active"]')?.textContent.trim(), artboardWidthAfterSwitch: artboard?.getBoundingClientRect().width };
  })()`);
  console.log('RESULT2:', JSON.stringify(result2, null, 2));

  const img2 = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-bp-chips.png'), img2.toPNG());

  const failed = errors > 0 || result.errors.length > 0 || result2.errors?.length > 0
    || !result2.chips?.includes('800px') || Math.abs((result2.artboardWidthAfterSwitch || 0) - 800) > 2;
  console.log(failed ? 'BP-TEST FAILED' : 'BP-TEST OK');
  app.exit(failed ? 1 : 0);
});

setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 40000);
