import type { Breakpoint, Page, Project } from './types';

let counter = 1;
export function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;
}

export function createPage(name: string, title?: string): Page {
  return {
    id: uid('page'),
    name,
    title: title ?? name,
    width: 970,
    height: 1000,
    backgroundColor: '#ffffff',
    components: [],
    pageCode: '',
    headCode: '',
    bodyStartCode: '',
    bodyEndCode: '',
    cssCode: '',
  };
}

export function createProject(name = 'Untitled1'): Project {
  return {
    id: uid('proj'),
    name,
    pages: [createPage('index', 'Untitled Page')],
    breakpoints: [
      { id: 'bp_tablet', name: 'Tablet', maxWidth: 768, orientation: 'none', fontSize: null },
      { id: 'bp_mobile', name: 'Mobile', maxWidth: 480, orientation: 'none', fontSize: null },
    ],
    breakpointMode: 'smaller',
  };
}

export function sortBreakpoints(bps: Breakpoint[]): Breakpoint[] {
  return [...bps].sort((a, b) => b.maxWidth - a.maxWidth);
}
