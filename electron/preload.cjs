const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sitebuilder', {
  saveProjectAs: (json, suggestedName) => ipcRenderer.invoke('project:saveAs', json, suggestedName),
  saveProject: (filePath, json) => ipcRenderer.invoke('project:save', filePath, json),
  openProject: () => ipcRenderer.invoke('project:open'),
  exportSite: (files) => ipcRenderer.invoke('export:site', files),
  previewSite: (files, entryName) => ipcRenderer.invoke('preview:site', files, entryName),
});
