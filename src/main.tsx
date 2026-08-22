import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/app.css';
import './styles/ribbon.css';
import './styles/panels.css';
import './styles/canvas.css';
import './styles/properties.css';
import './styles/dialogs.css';
import './styles/database.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
