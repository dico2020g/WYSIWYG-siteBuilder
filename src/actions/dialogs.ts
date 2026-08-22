/**
 * App-safe message dialogs. window.confirm()/alert() hang the Electron
 * renderer, so inside the desktop app these go through native message boxes;
 * in a plain browser (vite dev) they fall back to the window builtins.
 */
export async function appConfirm(message: string): Promise<boolean> {
  const api = window.sitebuilder;
  if (api?.appConfirm) return api.appConfirm(message);
  return window.confirm(message);
}

export async function appAlert(message: string): Promise<void> {
  const api = window.sitebuilder;
  if (api?.appAlert) return api.appAlert(message);
  window.alert(message);
}
