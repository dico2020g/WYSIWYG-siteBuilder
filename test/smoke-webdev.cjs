const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1600, height: 950, show: false, webPreferences: { offscreen: true } });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };

  // 1. Default Home view (new WebDev-style look)
  await shot('smoke-webdev-1-home.png');

  // 2. Insert tab
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Insert').click();
  })()`);
  await wait(300);
  await shot('smoke-webdev-2-insert.png');

  // 3. Back to Home, add a component on canvas (drag a Button via store-less click placement)
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Home').click();
  })()`);
  await wait(200);
  await win.webContents.executeJavaScript(`(() => {
    const items = [...document.querySelectorAll('.toolbox-item')];
    const btn = items.find(i => i.querySelector('.item-label')?.textContent.trim() === 'Button');
    if (btn) btn.click();
    return true;
  })()`);
  await wait(400);
  await win.webContents.executeJavaScript(`(() => {
    const art = document.querySelector('.artboard');
    const r = art.getBoundingClientRect();
    art.dispatchEvent(new MouseEvent('click', { clientX: r.left + 120, clientY: r.top + 120, bubbles: true }));
    return true;
  })()`);
  await wait(400);
  await shot('smoke-webdev-3-component.png');

  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
