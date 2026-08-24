const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sitebuilder', {
  saveProjectAs: (json, suggestedName) => ipcRenderer.invoke('project:saveAs', json, suggestedName),
  saveProject: (filePath, json) => ipcRenderer.invoke('project:save', filePath, json),
  openProject: () => ipcRenderer.invoke('project:open'),
  pickImage: () => ipcRenderer.invoke('asset:pickImage'),
  exportSite: (files) => ipcRenderer.invoke('export:site', files),
  previewSite: (files, entryName) => ipcRenderer.invoke('preview:site', files, entryName),
  dbTest: (cfg) => ipcRenderer.invoke('db:test', cfg),
  dbListObjects: (cfg) => ipcRenderer.invoke('db:listObjects', cfg),
  dbListDatabases: (cfg) => ipcRenderer.invoke('db:listDatabases', cfg),
  dbListColumns: (cfg, table) => ipcRenderer.invoke('db:listColumns', cfg, table),
  dbFetchRows: (cfg, table, limit) => ipcRenderer.invoke('db:fetchRows', cfg, table, limit),
  dbDropTable: (cfg, table) => ipcRenderer.invoke('db:dropTable', cfg, table),
  appConfirm: (message) => ipcRenderer.invoke('app:confirm', message),
  appAlert: (message) => ipcRenderer.invoke('app:alert', message),
});
