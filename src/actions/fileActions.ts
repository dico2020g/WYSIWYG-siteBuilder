import { useProjectStore } from '../store/projectStore';
import { exportSite } from '../export/exportHtml';
import { appAlert } from './dialogs';

async function api() {
  const a = window.sitebuilder;
  if (!a) {
    await appAlert('File actions are only available in the desktop app.');
    throw new Error('no bridge');
  }
  return a;
}

export async function saveProject(saveAs = false) {
  const s = useProjectStore.getState();
  const json = JSON.stringify(s.project, null, 2);
  const bridge = await api();
  if (!saveAs && s.filePath) {
    await bridge.saveProject(s.filePath, json);
    s.markSaved(s.filePath);
    return;
  }
  const path = await bridge.saveProjectAs(json, s.project.name);
  if (path) s.markSaved(path);
}

export async function openProject() {
  const bridge = await api();
  const res = await bridge.openProject();
  if (!res) return;
  try {
    const project = JSON.parse(res.json);
    useProjectStore.getState().loadProject(project, res.filePath);
  } catch {
    await appAlert('Could not read project file.');
  }
}

export async function exportProject() {
  const s = useProjectStore.getState();
  const files = exportSite(s.project);
  const bridge = await api();
  const dir = await bridge.exportSite(files);
  if (dir) await appAlert(`Site exported to:\n${dir}`);
}

export async function previewProject() {
  const s = useProjectStore.getState();
  const files = exportSite(s.project);
  const bridge = await api();
  const first = s.project.pages[0]?.name ?? 'index';
  await bridge.previewSite(files, `${first}.html`);
}
