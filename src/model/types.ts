export interface Breakpoint {
  id: string;
  name: string;
  maxWidth: number; // px — applied via @media (max-width: Npx)
  orientation?: 'none' | 'portrait' | 'landscape';
  fontSize?: number | null; // default font size in px, null = none
}

export interface ComponentOverride {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  props?: Record<string, unknown>;
}

export interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props: Record<string, any>;
  events: Record<string, string>; // e.g. { onclick: "alert('hi')" }
  overrides: Record<string, ComponentOverride>; // keyed by breakpoint id
  hidden?: boolean;              // hidden in all breakpoints (excluded from export)
  locked?: boolean;              // cannot be moved/resized on canvas
  hiddenIn?: string[];           // breakpoint ids where the component is hidden
}

export interface Page {
  id: string;
  name: string;      // file/menu name, e.g. "index"
  title: string;     // <title>
  width: number;     // artboard width at default breakpoint
  height: number;
  backgroundColor: string;
  components: ComponentItem[];
  pageCode: string;  // custom JS appended to page
  headCode: string;  // custom HTML for <head> (framework script tags etc.)
  bodyStartCode?: string; // custom HTML immediately after <body>
  bodyEndCode?: string;   // custom HTML immediately before </body>
  cssCode?: string;       // custom CSS appended to css/site.css
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
  breakpoints: Breakpoint[];
  /** 'smaller' → @media (max-width: N), 'larger' → @media (min-width: N) */
  breakpointMode: 'smaller' | 'larger';
}

export interface ExportFile {
  name: string;   // relative path, e.g. "index.html" or "css/site.css"
  content: string;
}
