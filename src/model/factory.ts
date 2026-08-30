import type { Breakpoint, DatabaseState, Page, Project } from './types';

export function createDatabaseState(): DatabaseState {
  return {
    connections: [],
    tables: [],
    views: [],
    matviews: [],
    functions: [],
    queries: [],
    api: {
      connectionId: '',
      tableIds: [],
      baseUrl: 'https://yourdomain.com/api',
      auth: 'JWT Authentication',
      format: 'JSON',
      version: 'v1',
      pagination: true,
      filtering: true,
      relatedData: false,
    },
  };
}

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
      { id: 'bp_tablet', name: 'Tablet', maxWidth: 768, direction: 'max', orientation: 'none', fontSize: null },
      { id: 'bp_mobile', name: 'Mobile', maxWidth: 480, direction: 'max', orientation: 'none', fontSize: null },
    ],
    breakpointMode: 'smaller',
    database: createDatabaseState(),
  };
}

export function sortBreakpoints(bps: Breakpoint[]): Breakpoint[] {
  return [...bps].sort((a, b) => {
    const ad = a.direction ?? 'max';
    const bd = b.direction ?? 'max';
    if (ad !== bd) return ad === 'max' ? -1 : 1;
    return ad === 'max' ? b.maxWidth - a.maxWidth : a.maxWidth - b.maxWidth;
  });
}

export function breakpointDirection(bp: Breakpoint): 'max' | 'min' {
  return bp.direction ?? 'max';
}

export function breakpointLabel(bp: Breakpoint): string {
  return `${breakpointDirection(bp) === 'min' ? '≥' : '≤'} ${bp.maxWidth}px`;
}
