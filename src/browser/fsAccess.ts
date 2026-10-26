/**
 * File System Access API wrappers with graceful fallbacks.
 *
 * Chrome/Edge: save .wbp to a real file (persist the handle in IndexedDB so
 * later "Save" writes back to the same file), pick an export directory, and
 * open a project. Firefox/Safari: save/export download a file, open uses a
 * hidden <input type=file>. Preview always opens the built site in a new tab
 * via blob URLs.
 */

import { makeZip } from './zip';
import { idbGet, idbSet, idbAvailable } from './idb';

/* --- narrow typing for the optional File System Access API --- */

interface FSHandle {
  name: string;
  isFileSystem?: boolean;
  createWritable?(): Promise<{ write(d: string): Promise<void>; close(): Promise<void> }>;
  getFile?(): Promise<File>;
  getDirectoryHandle?(name: string, opts: { create: boolean }): Promise<FSHandle>;
  getFileHandle?(name: string, opts: { create: boolean }): Promise<FSHandle>;
}

function pickerWindow(): any {
  return typeof window !== 'undefined' ? window : {};
}

export function fsSupported(): boolean {
  const w = pickerWindow();
  return typeof w.showSaveFilePicker === 'function' && typeof w.showOpenFilePicker === 'function';
}

export function dirSupported(): boolean {
  return typeof pickerWindow().showDirectoryPicker === 'function';
}

/** Trigger a browser download of `content` as `name`. */
export function download(name: string, content: string, mime = 'text/plain'): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function downloadBytes(name: string, bytes: Uint8Array, mime: string): void {
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Read a text file via a hidden file input (fallback for browsers without FSA). */
function pickTextFile(accept = '.wbp'): Promise<{ name: string; text: string } | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) { input.remove(); resolve(null); return; }
      const reader = new FileReader();
      reader.addEventListener('load', () => { input.remove(); resolve({ name: file.name, text: String(reader.result ?? '') }); });
      reader.addEventListener('error', () => { input.remove(); resolve(null); });
      reader.readAsText(file);
    });
    input.addEventListener('cancel', () => { input.remove(); resolve(null); });
    document.body.appendChild(input);
    input.click();
  });
}

function suggestedName(name: string, ext: string): string {
  const clean = String(name ?? 'project').replace(/[\\/:*?"<>|]/g, '_').trim() || 'project';
  return clean.endsWith(ext) ? clean : `${clean}${ext}`;
}

async function writeText(handle: FSHandle, text: string): Promise<void> {
  const w = await handle.createWritable!();
  await w.write(text);
  await w.close();
}

/* ------------------------------------------------------------------ save */

export async function saveProjectAs(json: string, suggested = 'project'): Promise<string | null> {
  const w = pickerWindow();
  if (fsSupported() && w.showSaveFilePicker) {
    try {
      const handle: FSHandle = await w.showSaveFilePicker({
        suggestedName: suggestedName(suggested, '.wbp'),
        types: [{ description: 'SiteBuilder Project', accept: { 'application/json': ['.wbp'] } }],
      });
      await writeText(handle, json);
      if (idbAvailable()) await idbSet('handles', handle.name, handle);
      return handle.name;
    } catch (e: any) {
      if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) return null;
      throw e;
    }
  }
  // Fallback: download the file; nothing persisted, so report no path.
  download(suggestedName(suggested, '.wbp'), json, 'application/json');
  return null;
}

export async function saveProject(filePath: string, json: string): Promise<string> {
  if (idbAvailable()) {
    const handle = await idbGet('handles', filePath);
    if (handle && typeof handle.createWritable === 'function') {
      await writeText(handle, json);
      return filePath;
    }
  }
  // No persisted handle (first save after an input-file open, or unsupported browser):
  // download so the user always gets their work.
  download(filePath || 'project.wbp', json, 'application/json');
  return filePath;
}

/* ------------------------------------------------------------------ open */

export async function openProject(): Promise<{ filePath: string; json: string } | null> {
  const w = pickerWindow();
  if (fsSupported() && w.showOpenFilePicker) {
    try {
      const handles: FSHandle[] = await w.showOpenFilePicker({
        types: [{ description: 'SiteBuilder Project', accept: { 'application/json': ['.wbp'] } }],
        multiple: false,
      });
      const handle = handles[0];
      const file = await handle.getFile!();
      const json = await file.text();
      if (idbAvailable()) await idbSet('handles', handle.name, handle);
      return { filePath: handle.name, json };
    } catch (e: any) {
      if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) return null;
      throw e;
    }
  }
  const picked = await pickTextFile('.wbp');
  if (!picked) return null;
  return { filePath: picked.name, json: picked.text };
}

/* ---------------------------------------------------------------- export */

/** Write `files` (relative path → content) into a picked directory, else a .zip download. */
export async function exportSite(files: { name: string; content: string }[], zipBase = 'site'): Promise<string | null> {
  const w = pickerWindow();
  if (dirSupported() && w.showDirectoryPicker) {
    try {
      const root: FSHandle = await w.showDirectoryPicker();
      for (const f of files) {
        const parts = f.name.split('/').filter(Boolean);
        let dir = root;
        for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle!(parts[i], { create: true });
        const fh = await dir.getFileHandle!(parts[parts.length - 1], { create: true });
        await writeText(fh, f.content);
      }
      return root.name;
    } catch (e: any) {
      if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) return null;
      throw e;
    }
  }
  // Fallback: bundle as a single .zip download.
  downloadBytes(`${zipBase}.zip`, makeZip(files), 'application/zip');
  return `A downloadable .zip (${zipBase}.zip) — open it and place the files on your web server.`;
}

/* ---------------------------------------------------------------- preview */

/**
 * Build the site as blob URLs, rewrite the shared stylesheet link in the entry
 * page to its blob, and open it in a new tab. Returns the entry URL.
 */
export async function previewSite(files: { name: string; content: string }[], entryName?: string): Promise<string> {
  const byName = new Map<string, string>();
  for (const f of files) byName.set(f.name, f.content);

  const cssBlob = byName.get('css/site.css') ?? '';
  const cssUrl = URL.createObjectURL(new Blob([cssBlob], { type: 'text/css' }));

  const entryKey = entryName && byName.has(entryName) ? entryName : [...byName.keys()].find((n) => n.endsWith('.html'));
  if (!entryKey) return '';
  const html = byName.get(entryKey)!
    .replace(/<link rel="stylesheet" href="css\/site\.css">/, `<link rel="stylesheet" href="${cssUrl}">`);
  const entryUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.open(entryUrl, '_blank');
  return entryUrl;
}
