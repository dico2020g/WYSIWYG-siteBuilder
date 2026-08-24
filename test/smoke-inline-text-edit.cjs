const { app, BrowserWindow } = require('electron');
const path = require('path');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const check = (name, value) => {
  if (!value) throw new Error(`FAIL: ${name}`);
  console.log(`ok  - ${name}`);
};

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: { offscreen: true },
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await sleep(800);

  const inserted = await win.webContents.executeJavaScript(`(async () => {
    const standard = [...document.querySelectorAll('.toolbox-group-header')]
      .find((node) => node.textContent.includes('Standard'));
    if (!standard) return false;
    standard.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const textLabel = [...document.querySelectorAll('.toolbox-item .item-label')]
      .find((node) => node.textContent.trim() === 'Text');
    const text = textLabel?.closest('.toolbox-item');
    const artboard = document.querySelector('.artboard');
    if (!text || !artboard) return false;
    text.click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    const rect = artboard.getBoundingClientRect();
    artboard.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      clientX: rect.left + 120,
      clientY: rect.top + 120,
    }));
    return true;
  })()`);
  check('text control inserted', inserted);
  await sleep(150);

  const point = await win.webContents.executeJavaScript(`(() => {
    const rect = document.querySelector('.canvas-component').getBoundingClientRect();
    return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
  })()`);
  for (let i = 0; i < 2; i += 1) {
    win.webContents.sendInputEvent({ type: 'mouseDown', x: point.x, y: point.y, button: 'left', clickCount: 2 });
    win.webContents.sendInputEvent({ type: 'mouseUp', x: point.x, y: point.y, button: 'left', clickCount: 2 });
  }
  await sleep(150);
  check('double-click opens inline editor', await win.webContents.executeJavaScript(`!!document.querySelector('.canvas-inline-editor')`));

  await win.webContents.executeJavaScript(`(() => {
    const editor = document.querySelector('.canvas-inline-editor');
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
    setter.call(editor, 'Edited on canvas');
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(80);

  const outside = await win.webContents.executeJavaScript(`(() => {
    const rect = document.querySelector('.artboard').getBoundingClientRect();
    return { x: Math.round(rect.right - 20), y: Math.round(rect.bottom - 20) };
  })()`);
  win.webContents.sendInputEvent({ type: 'mouseDown', x: outside.x, y: outside.y, button: 'left', clickCount: 1 });
  win.webContents.sendInputEvent({ type: 'mouseUp', x: outside.x, y: outside.y, button: 'left', clickCount: 1 });
  await sleep(180);

  check('outside click closes editor', await win.webContents.executeJavaScript(`!document.querySelector('.canvas-inline-editor')`));
  check('outside click accepts text', await win.webContents.executeJavaScript(`document.querySelector('.cv-content').textContent.includes('Edited on canvas')`));
  app.exit(0);
}).catch((error) => {
  console.error(error);
  app.exit(1);
});

setTimeout(() => {
  console.error('TIMEOUT');
  app.exit(2);
}, 20000);
