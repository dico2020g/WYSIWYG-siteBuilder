import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installSitebuilderApi } from './browser/sitebuilderApi';
import { startAutosave } from './browser/autosave';
import './styles/app.css';
import './styles/ribbon.css';
import './styles/panels.css';
import './styles/canvas.css';
import './styles/properties.css';
import './styles/dialogs.css';
import './styles/database.css';
import './styles/ui-polish.css';

// Install the browser bridge, then restore the autosaved session, before the
// React app mounts so components that read `window.sitebuilder` find it.
installSitebuilderApi();
startAutosave();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
