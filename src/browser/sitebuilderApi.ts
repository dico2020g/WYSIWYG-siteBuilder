/**
 * Browser-native implementation of the `window.sitebuilder` bridge the React UI
 * was built against. It installs the exact API surface the desktop Electron
 * preload exposed, computed entirely with browser APIs:
 *   - File System Access API (+ download fallback) for save / open / export
 *   - blob-URL preview in a new tab
 *   - in-browser SQLite via sql.js for the database features
 *   - native window.confirm / alert for the message dialogs
 *
 * Installing it is what makes the desktop app a website: every component that
 * reads `window.sitebuilder` now gets a working browser implementation.
 */

import type { SiteBuilderApi } from '../api';
import {
  saveProject,
  saveProjectAs,
  openProject,
  exportSite,
  previewSite,
} from './fsAccess';
import {
  dbTest,
  dbListObjects,
  dbListDatabases,
  dbListColumns,
  dbFetchRows,
  dbDropTable,
} from './dbSqlite';

function pickImage(): Promise<{ name: string; dataUrl: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) { input.remove(); resolve(null); return; }
      const reader = new FileReader();
      reader.addEventListener('load', () => { input.remove(); resolve({ name: file.name, dataUrl: String(reader.result ?? '') }); });
      reader.addEventListener('error', () => { input.remove(); resolve(null); });
      reader.readAsDataURL(file);
    });
    input.addEventListener('cancel', () => { input.remove(); resolve(null); });
    document.body.appendChild(input);
    input.click();
  });
}

export const sitebuilderApi: SiteBuilderApi = {
  saveProjectAs,
  saveProject,
  openProject,
  pickImage,
  exportSite,
  previewSite,
  dbTest,
  dbListObjects,
  dbListDatabases,
  dbListColumns,
  dbFetchRows,
  dbDropTable,
  appConfirm: (message: string) => Promise.resolve(window.confirm(message)),
  appAlert: (message: string) => { window.alert(message); return Promise.resolve(); },
};

/** Install the bridge on `window` before the React app mounts. */
export function installSitebuilderApi(): void {
  (window as any).sitebuilder = sitebuilderApi;
}
