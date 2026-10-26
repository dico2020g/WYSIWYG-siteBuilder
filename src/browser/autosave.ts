/**
 * Autosave to localStorage. The desktop app saved to a real file; in a website
 * we keep a private working copy in localStorage so a reload never loses work,
 * independent of the explicit File System Access "Save" that writes a .wbp.
 */

import { useProjectStore } from '../store/projectStore';

const KEY = 'sitebuilder.autosave';

export function startAutosave(): void {
  // Restore the last session first, so the app opens to the work in progress.
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const project = JSON.parse(raw);
      if (project && Array.isArray(project.pages) && project.pages.length > 0) {
        useProjectStore.getState().loadProject(project, null);
      }
    }
  } catch {
    /* ignore a corrupt autosave */
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  useProjectStore.subscribe((state) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state.project));
      } catch {
        /* storage quota / private mode — best-effort */
      }
    }, 400);
  });
}
