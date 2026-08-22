const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.whenReady().then(async () => {
  // stub the native dialog IPC so the preload bridge works
  ipcMain.handle('app:confirm', async () => true);
  ipcMain.handle('app:alert', async () => {});

  const win = new BrowserWindow({
    width: 1400, height: 900, show: false,
    webPreferences: { preload: path.join(__dirname, '..', 'electron', 'preload.cjs') },
  });
  win.webContents.on('console-message', (e, level, message) => {
    if (level >= 2) console.log('CONSOLE:', message.slice(0, 400));
  });
  await win.loadFile(path.join(__dirname, '..', 'dist-renderer', 'index.html'));
  await wait(2000);

  const shot = async (name) => {
    const img = await win.webContents.capturePage();
    fs.writeFileSync(path.join(__dirname, name), img.toPNG());
    console.log('shot', name);
  };
  const openModal = async () => {
    await win.webContents.executeJavaScript(`(() => {
      [...document.querySelectorAll('.ribbon-tab')].find(t => t.textContent.trim() === 'Database').click();
    })()`);
    await wait(200);
    await win.webContents.executeJavaScript(`(() => {
      [...document.querySelectorAll('.ribbon-btn')].find(b => b.textContent.includes('Connection')).click();
    })()`);
    await wait(400);
  };
  const setInput = (idx, v) => win.webContents.executeJavaScript(`(() => {
    const el = [...document.querySelectorAll('.db-form input.db-input')][${idx}];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, ${JSON.stringify(v)});
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  const modalOpen = () => win.webContents.executeJavaScript(`!!document.querySelector('.db-modal')`);
  const listNames = () => win.webContents.executeJavaScript(
    `[...document.querySelectorAll('.db-list-name')].map(e => e.textContent)`);
  const formVals = () => win.webContents.executeJavaScript(
    `[...document.querySelectorAll('.db-form input.db-input')].slice(0,2).map(i => i.value)`);

  // 1. create + edit + save
  await openModal();
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-link-btn')].find(b => b.textContent.includes('New Connection')).click();
  })()`);
  await wait(300);
  await setInput(0, 'TestConn');
  await setInput(1, 'myhost.example');
  await wait(200);
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.trim() === 'Save Connection').click();
  })()`);
  await wait(400);
  console.log('after save, modal open?', await modalOpen(), 'list:', JSON.stringify(await listNames()));

  // 2. reopen — saved values must show
  await openModal();
  console.log('after reopen, name/host =', JSON.stringify(await formVals()));

  // 3. edit again, Cancel -> modal must close and changes discarded
  await setInput(1, 'changed-host');
  await wait(200);
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-btn')].find(b => b.textContent.trim() === 'Cancel').click();
  })()`);
  await wait(300);
  console.log('after cancel, modal open?', await modalOpen());
  await openModal();
  console.log('after cancel+reopen, name/host =', JSON.stringify(await formVals()));

  // 4. delete the connection, then create a new one (greyed-out bug)
  await win.webContents.executeJavaScript(`(() => {
    document.querySelector('.db-list-item .db-item-menu').click();
  })()`);
  await wait(400);
  console.log('after delete, list:', JSON.stringify(await listNames()));
  await win.webContents.executeJavaScript(`(() => {
    [...document.querySelectorAll('.db-link-btn')].find(b => b.textContent.includes('New Connection')).click();
  })()`);
  await wait(400);
  console.log('after new, list:', JSON.stringify(await listNames()), 'form:', JSON.stringify(await formVals()));
  await shot('smoke-conn-fixed.png');

  app.exit(0);
});
setTimeout(() => { console.error('TIMEOUT'); app.exit(2); }, 60000);
