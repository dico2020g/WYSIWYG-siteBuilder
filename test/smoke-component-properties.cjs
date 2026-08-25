const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const check = (name, value) => {
  if (!value) throw new Error(`FAIL: ${name}`);
  console.log(`ok  - ${name}`);
};

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1600,
    height: 950,
    show: false,
    webPreferences: { offscreen: true },
  });
  const rendererRoot = process.env.SB_RENDERER || path.join(__dirname, '..', 'dist-renderer');
  await win.loadFile(path.join(rendererRoot, 'index.html'));
  await wait(900);

  await win.webContents.executeJavaScript(`(() => {
    const standard = [...document.querySelectorAll('.toolbox-group-header')]
      .find((node) => node.textContent.includes('Standard'));
    standard?.click();
  })()`);

  const insert = async (label, offset) => {
    const selectedTool = await win.webContents.executeJavaScript(`(() => {
      const item = [...document.querySelectorAll('.toolbox-item')]
        .find((node) => node.querySelector('.item-label')?.textContent.trim() === ${JSON.stringify(label)});
      if (!item) return false;
      item.click();
      return true;
    })()`);
    check(`${label} tool selected`, selectedTool);
    await wait(100);
    const inserted = await win.webContents.executeJavaScript(`(() => {
      const artboard = document.querySelector('.artboard');
      if (!artboard) return false;
      const rect = artboard.getBoundingClientRect();
      artboard.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        clientX: rect.left + ${100 + offset},
        clientY: rect.top + ${100 + offset},
      }));
      return true;
    })()`);
    check(`${label} inserted`, inserted);
    await wait(120);
  };

  const propertyGroups = async () => {
    await win.webContents.executeJavaScript(`(() => {
    const tab = [...document.querySelectorAll('.props-tab')]
      .find((node) => node.textContent.trim() === 'More Properties');
    tab?.click();
    return !!tab;
  })()`);
    await wait(100);
    return win.webContents.executeJavaScript(`(() => {
    return [...document.querySelectorAll('.props-group-header')]
      .map((node) => node.textContent.replace(/[\\u25b8\\u25be]/g, '').trim());
  })()`);
  };

  await insert('Image', 0);
  let groups = await propertyGroups();
  check('image has Media properties', groups.includes('Media'));
  check('image omits Typography properties', !groups.includes('Typography'));
  check('image retains Effects properties', groups.includes('Effects'));

  await insert('Text', 80);
  groups = await propertyGroups();
  check('text has Content properties', groups.includes('Content'));
  check('text has Typography properties', groups.includes('Typography'));
  check('text omits Media properties', !groups.includes('Media'));

  await insert('Hidden Field', 160);
  groups = await propertyGroups();
  check('hidden field has Form & Validation properties', groups.includes('Form & Validation'));
  check('hidden field omits visual Layout properties', !groups.includes('Layout'));
  check('hidden field retains Effects properties', groups.includes('Effects'));

  const image = await win.webContents.capturePage();
  fs.writeFileSync(path.join(__dirname, 'smoke-component-properties.png'), image.toPNG());
  app.exit(0);
});

setTimeout(() => {
  console.error('TIMEOUT');
  app.exit(2);
}, 30000);
