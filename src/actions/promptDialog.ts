/**
 * In-app replacement for window.prompt(), which hangs the Electron renderer.
 * In a plain browser (vite dev) it falls back to window.prompt.
 */

interface PromptRequest {
  message: string;
  def: string;
  resolve: (value: string | null) => void;
}

let current: PromptRequest | null = null;
const listeners = new Set<() => void>();

export function subscribePrompt(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getPromptRequest(): PromptRequest | null {
  return current;
}

export function appPrompt(message: string, def = ''): Promise<string | null> {
  if (!window.sitebuilder) return Promise.resolve(window.prompt(message, def));
  return new Promise((resolve) => {
    current = { message, def, resolve };
    listeners.forEach((f) => f());
  });
}

export function resolvePrompt(value: string | null): void {
  const req = current;
  current = null;
  listeners.forEach((f) => f());
  req?.resolve(value);
}
