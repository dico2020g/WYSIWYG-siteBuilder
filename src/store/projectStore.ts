import { create } from 'zustand';
import type { ComponentItem, ComponentOverride, DatabaseState, DbConnection, DbSqlObject, DbTable, Page, Project, Breakpoint } from '../model/types';
import { createDatabaseState, createPage, createProject, sortBreakpoints, uid } from '../model/factory';
import { COMPONENT_MAP } from '../model/componentDefs';
import { resolveComponent, resolveComponentHidden, responsiveBaseWidth, snapshotOverride } from '../model/responsive';

export type CanvasTool = 'pointer' | string; // 'pointer' or a component type being placed

export type BreakpointEditorState = null | { mode: 'add' } | { mode: 'edit' | 'copy'; id: string };
export type CodeDialogState =
  | null
  | { kind: 'object-html'; componentId: string }
  | { kind: 'object-animation'; componentId: string }
  | { kind: 'object-effect'; componentId: string; tab: 'animation' | 'transition' | 'transform' }
  | { kind: 'page-html' };

export type DatabasePage = 'table' | 'view' | 'matview' | 'function' | 'query';
export type DbObjectKind = 'views' | 'matviews' | 'functions' | 'queries';

export interface ContextMenuState {
  x: number;
  y: number;
  componentId: string | null; // null = opened on empty artboard
}

export interface BreakpointInput {
  id?: string;
  maxWidth: number;
  orientation: 'none' | 'portrait' | 'landscape';
  fontSize: number | null;
}

interface ProjectState {
  project: Project;
  currentPageId: string;
  selectedId: string | null;
  activeBreakpointId: string | null; // null = Default (base)
  zoom: number; // 0.25 .. 2
  snapToGrid: boolean;
  gridSize: number;
  filePath: string | null;
  dirty: boolean;
  tool: CanvasTool;
  manageBreakpointsOpen: boolean;
  breakpointEditor: BreakpointEditorState;
  codeDialog: CodeDialogState;
  contextMenu: ContextMenuState | null;
  clipboard: ComponentItem | null;
  styleClipboard: Record<string, any> | null;

  // project / page actions
  newProject: () => void;
  loadProject: (project: Project, filePath: string | null) => void;
  markSaved: (filePath: string) => void;
  renameProject: (name: string) => void;
  addPage: () => void;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;
  clonePage: (pageId: string) => void;
  selectPage: (pageId: string) => void;
  updatePageProps: (pageId: string, patch: Partial<Page>) => void;

  // component actions
  setTool: (tool: CanvasTool) => void;
  addComponent: (type: string, x: number, y: number) => string | null;
  selectComponent: (id: string | null) => void;
  deleteComponent: (id: string) => void;
  /** patch geometry (x/y/width/height) — writes to breakpoint override when one is active */
  setGeometry: (id: string, geo: { x?: number; y?: number; width?: number; height?: number }) => void;
  /** patch props — writes to breakpoint override when one is active */
  updateProps: (id: string, patch: Record<string, any>) => void;
  updateEvents: (id: string, events: Record<string, string>) => void;
  arrange: (id: string, op: 'front' | 'back' | 'forward' | 'backward') => void;

  // clipboard / context-menu actions
  openContextMenu: (menu: ContextMenuState) => void;
  closeContextMenu: () => void;
  copyComponent: (id: string) => void;
  cutComponent: (id: string) => void;
  /** Clone clipboard onto the current page; offset +10/+10 unless inPlace. Returns new id. */
  pasteComponent: (inPlace: boolean) => string | null;
  copyStyle: (id: string) => void;
  pasteStyle: (id: string) => void;
  /** Returns false when newId is empty, malformed, or already used on the page. */
  renameComponentId: (id: string, newId: string) => boolean;
  /** Duplicate with new id at +10/+10; optionally hides the original. Returns clone id. */
  cloneComponent: (id: string, hideOriginal: boolean) => string | null;
  toggleHidden: (id: string) => void;
  /** Explicit setter variants for checkbox-style UIs (Responsive group). */
  setHidden: (id: string, hidden: boolean) => void;
  setHiddenIn: (id: string, breakpointId: string, hidden: boolean) => void;
  toggleHiddenInOtherBreakpoints: (id: string, activeBreakpointId: string | null) => void;
  toggleLocked: (id: string) => void;
  centerInPage: (id: string, axis: 'h' | 'v' | 'both', artboardWidth: number, pageHeight: number) => void;

  // database workspace — shown as closable tabs next to the page design tabs
  openDbPages: DatabasePage[]; // db tabs currently open in the tab strip
  activeDbPage: DatabasePage | null; // null = a design page is showing
  connectionsOpen: boolean; // standalone Data Connections modal
  selectedConnectionId: string | null;
  selectedTableId: string | null;
  openDatabase: (page: DatabasePage) => void;
  closeDatabase: (page?: DatabasePage) => void; // defaults to the active tab
  setDatabasePage: (page: DatabasePage) => void;
  openConnections: () => void;
  closeConnections: () => void;
  selectConnection: (id: string | null) => void;
  selectDbTable: (id: string | null) => void;
  saveConnection: (conn: DbConnection) => void;
  deleteConnection: (id: string) => void;
  saveTable: (table: DbTable) => void;
  deleteTable: (id: string) => void;
  saveDbObject: (kind: DbObjectKind, obj: DbSqlObject) => void;
  deleteDbObject: (kind: DbObjectKind, id: string) => void;
  updateApiConfig: (patch: Partial<DatabaseState['api']>) => void;

  // breakpoints
  addBreakpoint: (name: string, maxWidth: number) => void;
  removeBreakpoint: (id: string) => void;
  removeAllBreakpoints: () => void;
  moveBreakpoint: (id: string, dir: 1 | -1) => void;
  upsertBreakpoint: (bp: BreakpointInput) => void;
  setBreakpointMode: (mode: 'smaller' | 'larger') => void;
  setActiveBreakpoint: (id: string | null) => void;
  clearOverride: (componentId: string, breakpointId: string) => void;

  // breakpoint dialogs
  openManageBreakpoints: () => void;
  closeManageBreakpoints: () => void;
  openBreakpointEditor: (editor: Exclude<BreakpointEditorState, null>) => void;
  closeBreakpointEditor: () => void;
  openCodeDialog: (dialog: Exclude<CodeDialogState, null>) => void;
  closeCodeDialog: () => void;

  // view
  setZoom: (zoom: number) => void;
  toggleSnap: () => void;
}

function currentPage(state: ProjectState): Page {
  const page = state.project.pages.find((p) => p.id === state.currentPageId);
  return page ?? state.project.pages[0];
}

function withPage(state: ProjectState, fn: (page: Page) => Page): Partial<ProjectState> {
  return {
    project: {
      ...state.project,
      pages: state.project.pages.map((p) => (p.id === currentPage(state).id ? fn(p) : p)),
    },
    dirty: true,
  };
}

function snap(v: number, size: number, enabled: boolean): number {
  return enabled ? Math.round(v / size) * size : Math.round(v);
}

function snapshotAtBreakpoint(c: ComponentItem, breakpoints: Breakpoint[], breakpointId: string, baseWidth: number): ComponentOverride {
  return snapshotOverride(
    resolveComponent(c, breakpoints, breakpointId, baseWidth),
    resolveComponentHidden(c, breakpoints, breakpointId)
  );
}

const PAGE_BOTTOM_PADDING = 50;

/** Grow page.height so it covers `bottom` (+ padding). Never shrinks. */
function fitPageHeight(page: Page, bottom: number, gridSize: number, snapEnabled: boolean): Page {
  const raw = bottom + PAGE_BOTTOM_PADDING;
  const needed = snapEnabled ? Math.ceil(raw / gridSize) * gridSize : Math.round(raw);
  return needed > page.height ? { ...page, height: needed } : page;
}

export const useProjectStore = create<ProjectState>((set, get) => {
  const initial = createProject();
  return {
    project: initial,
    currentPageId: initial.pages[0].id,
    selectedId: null,
    activeBreakpointId: null,
    zoom: 1,
    snapToGrid: true,
    gridSize: 10,
    filePath: null,
    dirty: false,
    tool: 'pointer',
    manageBreakpointsOpen: false,
    breakpointEditor: null,
    codeDialog: null,
    contextMenu: null,
    clipboard: null,
    styleClipboard: null,
    openDbPages: [],
    activeDbPage: null,
    connectionsOpen: false,
    selectedConnectionId: null,
    selectedTableId: null,

    newProject: () => {
      const p = createProject();
      set({ project: p, currentPageId: p.pages[0].id, selectedId: null, activeBreakpointId: null, filePath: null, dirty: false });
    },
    loadProject: (project, filePath) =>
      set({
        // merge db defaults so projects saved before new db fields existed still load
        project: {
          ...project,
          breakpoints: sortBreakpoints(project.breakpoints ?? []),
          database: { ...createDatabaseState(), ...project.database },
        },
        currentPageId: project.pages[0]?.id ?? '',
        selectedId: null,
        activeBreakpointId: null,
        filePath,
        dirty: false,
      }),
    markSaved: (filePath) => set({ filePath, dirty: false }),
    renameProject: (name) =>
      set((s) => ({ project: { ...s.project, name }, dirty: true })),

    addPage: () =>
      set((s) => {
        let n = s.project.pages.length + 1;
        let name = `page${n}`;
        while (s.project.pages.some((p) => p.name === name)) name = `page${++n}`;
        const page = createPage(name);
        return {
          project: { ...s.project, pages: [...s.project.pages, page] },
          currentPageId: page.id,
          selectedId: null,
          dirty: true,
        };
      }),
    renamePage: (pageId, name) =>
      set((s) => ({
        project: { ...s.project, pages: s.project.pages.map((p) => (p.id === pageId ? { ...p, name } : p)) },
        dirty: true,
      })),
    deletePage: (pageId) =>
      set((s) => {
        if (s.project.pages.length <= 1) return {};
        const pages = s.project.pages.filter((p) => p.id !== pageId);
        return {
          project: { ...s.project, pages },
          currentPageId: s.currentPageId === pageId ? pages[0].id : s.currentPageId,
          selectedId: null,
          dirty: true,
        };
      }),
    clonePage: (pageId) =>
      set((s) => {
        const src = s.project.pages.find((p) => p.id === pageId);
        if (!src) return {};
        const clone: Page = JSON.parse(JSON.stringify(src));
        clone.id = uid('page');
        clone.name = src.name + '_copy';
        clone.components = clone.components.map((c) => ({ ...c, id: uid('cmp') }));
        const idx = s.project.pages.findIndex((p) => p.id === pageId);
        const pages = [...s.project.pages];
        pages.splice(idx + 1, 0, clone);
        return { project: { ...s.project, pages }, currentPageId: clone.id, selectedId: null, dirty: true };
      }),
    selectPage: (pageId) => set({ currentPageId: pageId, selectedId: null, activeDbPage: null }),
    updatePageProps: (pageId, patch) =>
      set((s) => ({
        project: { ...s.project, pages: s.project.pages.map((p) => (p.id === pageId ? { ...p, ...patch } : p)) },
        dirty: true,
      })),

    setTool: (tool) => set({ tool }),
    addComponent: (type, x, y) => {
      const def = COMPONENT_MAP[type];
      if (!def) return null;
      const s = get();
      const comp: ComponentItem = {
        id: uid('cmp'),
        type,
        x: snap(x, s.gridSize, s.snapToGrid),
        y: snap(y, s.gridSize, s.snapToGrid),
        width: def.defaultSize.width,
        height: def.defaultSize.height,
        props: { ...def.defaultProps },
        events: {},
        overrides: {},
      };
      set((st) => ({
        ...withPage(st, (p) =>
          fitPageHeight({ ...p, components: [...p.components, comp] }, comp.y + comp.height, st.gridSize, st.snapToGrid)
        ),
        selectedId: comp.id,
        tool: 'pointer',
      }));
      return comp.id;
    },
    selectComponent: (id) => set({ selectedId: id }),
    deleteComponent: (id) =>
      set((s) => ({
        ...withPage(s, (p) => ({ ...p, components: p.components.filter((c) => c.id !== id) })),
        selectedId: s.selectedId === id ? null : s.selectedId,
      })),

    setGeometry: (id, geo) =>
      set((s) =>
        withPage(s, (p) => {
          const baseWidth = responsiveBaseWidth(p);
          const components = p.components.map((c) => {
            if (c.id !== id) return c;
            const g: ComponentOverride = {};
            if (geo.x !== undefined) g.x = geo.x;
            if (geo.y !== undefined) g.y = geo.y;
            if (geo.width !== undefined) g.width = geo.width;
            if (geo.height !== undefined) g.height = geo.height;
            if (s.activeBreakpointId) {
              // First touch at this breakpoint: seed a full snapshot of the
              // cascaded state so wider layers stop propagating to this element.
              const prev =
                c.overrides[s.activeBreakpointId] ??
                snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, baseWidth);
              return { ...c, overrides: { ...c.overrides, [s.activeBreakpointId]: { ...prev, ...g } } };
            }
            return { ...c, ...g };
          });
          const changed = components.find((c) => c.id === id);
          const page = { ...p, components };
          if (!changed) return page;
          const eff = resolveComponent(changed, s.project.breakpoints, s.activeBreakpointId, baseWidth);
          return fitPageHeight(page, eff.y + eff.height, s.gridSize, s.snapToGrid);
        })
      ),

    updateProps: (id, patch) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (c.id !== id) return c;
            if (s.activeBreakpointId) {
              const prev =
                c.overrides[s.activeBreakpointId] ??
                snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(p));
              return {
                ...c,
                overrides: {
                  ...c.overrides,
                  [s.activeBreakpointId]: { ...prev, props: { ...(prev.props ?? {}), ...patch } },
                },
              };
            }
            return { ...c, props: { ...c.props, ...patch } };
          }),
        }))
      ),

    updateEvents: (id, events) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => (c.id === id ? { ...c, events } : c)),
        }))
      ),

    arrange: (id, op) =>
      set((s) =>
        withPage(s, (p) => {
          const list = [...p.components];
          const idx = list.findIndex((c) => c.id === id);
          if (idx < 0) return p;
          const [item] = list.splice(idx, 1);
          if (op === 'front') list.push(item);
          else if (op === 'back') list.unshift(item);
          else if (op === 'forward') list.splice(Math.min(idx + 1, list.length), 0, item);
          else list.splice(Math.max(idx - 1, 0), 0, item);
          return { ...p, components: list };
        })
      ),

    openContextMenu: (menu) => set({ contextMenu: menu }),
    closeContextMenu: () => set({ contextMenu: null }),

    copyComponent: (id) =>
      set((s) => {
        const c = currentPage(s).components.find((c) => c.id === id);
        return c ? { clipboard: JSON.parse(JSON.stringify(c)) as ComponentItem } : {};
      }),

    cutComponent: (id) =>
      set((s) => {
        const page = currentPage(s);
        const c = page.components.find((c) => c.id === id);
        if (!c) return {};
        // Cut removes the component from the page — that mutates the model, so mark dirty.
        return {
          clipboard: JSON.parse(JSON.stringify(c)) as ComponentItem,
          project: {
            ...s.project,
            pages: s.project.pages.map((p) =>
              p.id === page.id ? { ...p, components: p.components.filter((c2) => c2.id !== id) } : p
            ),
          },
          selectedId: s.selectedId === id ? null : s.selectedId,
          dirty: true,
        };
      }),

    pasteComponent: (inPlace) => {
      const s = get();
      if (!s.clipboard) return null;
      const comp = JSON.parse(JSON.stringify(s.clipboard)) as ComponentItem;
      comp.id = uid('cmp');
      if (!inPlace) {
        comp.x += 10;
        comp.y += 10;
      }
      set((st) => ({
        ...withPage(st, (p) =>
          fitPageHeight({ ...p, components: [...p.components, comp] }, comp.y + comp.height, st.gridSize, st.snapToGrid)
        ),
        selectedId: comp.id,
      }));
      return comp.id;
    },

    copyStyle: (id) =>
      set((s) => {
        const c = currentPage(s).components.find((c) => c.id === id);
        return c ? { styleClipboard: JSON.parse(JSON.stringify(c.props)) as Record<string, any> } : {};
      }),

    pasteStyle: (id) =>
      set((s) => {
        if (!s.styleClipboard) return {};
        const style = JSON.parse(JSON.stringify(s.styleClipboard)) as Record<string, any>;
        return withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (c.id !== id) return c;
            if (s.activeBreakpointId) {
              const prev =
                c.overrides[s.activeBreakpointId] ??
                snapshotAtBreakpoint(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(p));
              return {
                ...c,
                overrides: { ...c.overrides, [s.activeBreakpointId]: { ...prev, props: style } },
              };
            }
            return { ...c, props: style };
          }),
        }));
      }),

    renameComponentId: (id, newId) => {
      const s = get();
      const trimmed = newId.trim();
      if (!/^[A-Za-z][\w-]*$/.test(trimmed)) return false;
      if (currentPage(s).components.some((c) => c.id === trimmed && c.id !== id)) return false;
      set((st) => ({
        ...withPage(st, (p) => ({
          ...p,
          components: p.components.map((c) => (c.id === id ? { ...c, id: trimmed } : c)),
        })),
        selectedId: st.selectedId === id ? trimmed : st.selectedId,
        contextMenu:
          st.contextMenu?.componentId === id ? { ...st.contextMenu, componentId: trimmed } : st.contextMenu,
      }));
      return true;
    },

    cloneComponent: (id, hideOriginal) => {
      const s = get();
      const src = currentPage(s).components.find((c) => c.id === id);
      if (!src) return null;
      const clone = JSON.parse(JSON.stringify(src)) as ComponentItem;
      clone.id = uid('cmp');
      clone.x += 10;
      clone.y += 10;
      clone.hidden = false;
      set((st) => ({
        ...withPage(st, (p) => {
          const components = hideOriginal
            ? p.components.map((c) => (c.id === id ? { ...c, hidden: true } : c))
            : p.components;
          return fitPageHeight({ ...p, components: [...components, clone] }, clone.y + clone.height, st.gridSize, st.snapToGrid);
        }),
        selectedId: clone.id,
      }));
      return clone.id;
    },

    toggleHidden: (id) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => (c.id === id ? { ...c, hidden: !c.hidden } : c)),
        }))
      ),

    setHidden: (id, hidden) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => (c.id === id ? { ...c, hidden } : c)),
        }))
      ),

    setHiddenIn: (id, breakpointId, hidden) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (c.id !== id) return c;
            const cur = new Set(c.hiddenIn ?? []);
            if (hidden) cur.add(breakpointId);
            else cur.delete(breakpointId);
            const prev = c.overrides[breakpointId] ?? snapshotAtBreakpoint(c, s.project.breakpoints, breakpointId, responsiveBaseWidth(p));
            return {
              ...c,
              hiddenIn: [...cur],
              overrides: { ...c.overrides, [breakpointId]: { ...prev, hidden } },
            };
          }),
        }))
      ),

    toggleHiddenInOtherBreakpoints: (id, activeBreakpointId) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (c.id !== id) return c;
            const others = s.project.breakpoints
              .map((b) => b.id)
              .filter((bid) => bid !== activeBreakpointId);
            const cur = c.hiddenIn ?? [];
            const allPresent = others.length > 0 && others.every((bid) => cur.includes(bid));
            const hiddenIn = allPresent
              ? cur.filter((bid) => !others.includes(bid))
              : [...new Set([...cur, ...others])];
            return { ...c, hiddenIn };
          }),
        }))
      ),

    toggleLocked: (id) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => (c.id === id ? { ...c, locked: !c.locked } : c)),
        }))
      ),

    centerInPage: (id, axis, artboardWidth, pageHeight) => {
      const s = get();
      const page = currentPage(s);
      const c = page.components.find((c) => c.id === id);
      if (!c) return;
      const eff = effectiveComponent(c, s.project.breakpoints, s.activeBreakpointId, responsiveBaseWidth(page));
      const geo: { x?: number; y?: number } = {};
      if (axis === 'h' || axis === 'both') geo.x = Math.round((artboardWidth - eff.width) / 2);
      if (axis === 'v' || axis === 'both') geo.y = Math.round((pageHeight - eff.height) / 2);
      s.setGeometry(id, geo);
    },

    addBreakpoint: (name, maxWidth) =>
      set((s) => ({
        project: {
          ...s.project,
          breakpoints: sortBreakpoints([
            ...s.project.breakpoints,
            { id: uid('bp'), name, maxWidth, orientation: 'none', fontSize: null },
          ]),
        },
        dirty: true,
      })),
    removeBreakpoint: (id) =>
      set((s) => ({
        project: {
          ...s.project,
          breakpoints: s.project.breakpoints.filter((b) => b.id !== id),
          // drop this breakpoint's overrides/hidden flags on every component
          pages: s.project.pages.map((p) => ({
            ...p,
            components: p.components.map((c) => {
              if (!c.overrides[id] && !(c.hiddenIn ?? []).includes(id)) return c;
              const overrides = { ...c.overrides };
              delete overrides[id];
              return { ...c, overrides, hiddenIn: (c.hiddenIn ?? []).filter((b) => b !== id) };
            }),
          })),
        },
        activeBreakpointId: s.activeBreakpointId === id ? null : s.activeBreakpointId,
        dirty: true,
      })),
    removeAllBreakpoints: () =>
      set((s) => ({
        project: {
          ...s.project,
          breakpoints: [],
          pages: s.project.pages.map((p) => ({
            ...p,
            components: p.components.map((c) => ({ ...c, overrides: {}, hiddenIn: [] })),
          })),
        },
        activeBreakpointId: null,
        dirty: true,
      })),
    moveBreakpoint: (id, dir) =>
      set((s) => {
        const list = [...s.project.breakpoints];
        const idx = list.findIndex((b) => b.id === id);
        const target = idx + dir;
        if (idx < 0 || target < 0 || target >= list.length) return {};
        const [item] = list.splice(idx, 1);
        list.splice(target, 0, item);
        return { project: { ...s.project, breakpoints: list }, dirty: true };
      }),
    upsertBreakpoint: (bp) =>
      set((s) => {
        if (bp.id) {
          return {
            project: {
              ...s.project,
              breakpoints: sortBreakpoints(
                s.project.breakpoints.map((b) =>
                  b.id === bp.id
                    ? { ...b, maxWidth: bp.maxWidth, orientation: bp.orientation, fontSize: bp.fontSize }
                    : b
                )
              ),
            },
            dirty: true,
          };
        }
        const created = {
          id: uid('bp'),
          name: `${bp.maxWidth}px`,
          maxWidth: bp.maxWidth,
          orientation: bp.orientation,
          fontSize: bp.fontSize,
        };
        return {
          project: { ...s.project, breakpoints: sortBreakpoints([...s.project.breakpoints, created]) },
          dirty: true,
        };
      }),
    setBreakpointMode: (mode) =>
      set((s) => ({ project: { ...s.project, breakpointMode: mode }, dirty: true })),
    setActiveBreakpoint: (id) => set({ activeBreakpointId: id, selectedId: null }),

    openManageBreakpoints: () => set({ manageBreakpointsOpen: true }),
    closeManageBreakpoints: () => set({ manageBreakpointsOpen: false }),
    openBreakpointEditor: (editor) => set({ breakpointEditor: editor }),
    closeBreakpointEditor: () => set({ breakpointEditor: null }),
    openCodeDialog: (dialog) => set({ codeDialog: dialog }),
    closeCodeDialog: () => set({ codeDialog: null }),
    clearOverride: (componentId, breakpointId) =>
      set((s) =>
        withPage(s, (p) => ({
          ...p,
          components: p.components.map((c) => {
            if (c.id !== componentId) return c;
            const overrides = { ...c.overrides };
            delete overrides[breakpointId];
            return { ...c, overrides, hiddenIn: (c.hiddenIn ?? []).filter((id) => id !== breakpointId) };
          }),
        }))
      ),

    setZoom: (zoom) => set({ zoom: Math.min(2, Math.max(0.25, zoom)) }),
    toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),

    // ---- database workspace ----
    openDatabase: (page) =>
      set((s) => {
        const db = dbOf(s.project);
        return {
          openDbPages: s.openDbPages.includes(page) ? s.openDbPages : [...s.openDbPages, page],
          activeDbPage: page,
          selectedConnectionId: s.selectedConnectionId ?? db.connections[0]?.id ?? null,
          selectedTableId: s.selectedTableId ?? db.tables[0]?.id ?? null,
        };
      }),
    closeDatabase: (page) =>
      set((s) => {
        const target = page ?? s.activeDbPage;
        if (!target || !s.openDbPages.includes(target)) return {};
        const remaining = s.openDbPages.filter((p) => p !== target);
        return {
          openDbPages: remaining,
          activeDbPage:
            s.activeDbPage === target ? remaining[remaining.length - 1] ?? null : s.activeDbPage,
        };
      }),
    setDatabasePage: (page) =>
      set((s) => ({
        openDbPages: s.openDbPages.includes(page) ? s.openDbPages : [...s.openDbPages, page],
        activeDbPage: page,
      })),
    openConnections: () =>
      set((s) => ({
        connectionsOpen: true,
        selectedConnectionId: s.selectedConnectionId ?? dbOf(s.project).connections[0]?.id ?? null,
      })),
    closeConnections: () => set({ connectionsOpen: false }),
    selectConnection: (id) => set({ selectedConnectionId: id }),
    selectDbTable: (id) => set({ selectedTableId: id }),
    saveConnection: (conn) =>
      set((s) => {
        const db = dbOf(s.project);
        const exists = db.connections.some((c) => c.id === conn.id);
        const connections = exists
          ? db.connections.map((c) => (c.id === conn.id ? conn : c))
          : [...db.connections, conn];
        return {
          project: withDb(s.project, { ...db, connections }),
          selectedConnectionId: conn.id,
          dirty: true,
        };
      }),
    deleteConnection: (id) =>
      set((s) => {
        const db = dbOf(s.project);
        return {
          project: withDb(s.project, { ...db, connections: db.connections.filter((c) => c.id !== id) }),
          selectedConnectionId: s.selectedConnectionId === id ? null : s.selectedConnectionId,
          dirty: true,
        };
      }),
    saveTable: (table) =>
      set((s) => {
        const db = dbOf(s.project);
        const exists = db.tables.some((t) => t.id === table.id);
        const tables = exists
          ? db.tables.map((t) => (t.id === table.id ? table : t))
          : [...db.tables, table];
        return {
          project: withDb(s.project, { ...db, tables }),
          selectedTableId: table.id,
          dirty: true,
        };
      }),
    deleteTable: (id) =>
      set((s) => {
        const db = dbOf(s.project);
        return {
          project: withDb(s.project, { ...db, tables: db.tables.filter((t) => t.id !== id) }),
          selectedTableId: s.selectedTableId === id ? null : s.selectedTableId,
          dirty: true,
        };
      }),
    saveDbObject: (kind, obj) =>
      set((s) => {
        const db = dbOf(s.project);
        const list = db[kind];
        const next = list.some((o) => o.id === obj.id)
          ? list.map((o) => (o.id === obj.id ? obj : o))
          : [...list, obj];
        return { project: withDb(s.project, { ...db, [kind]: next }), dirty: true };
      }),
    deleteDbObject: (kind, id) =>
      set((s) => {
        const db = dbOf(s.project);
        return {
          project: withDb(s.project, { ...db, [kind]: db[kind].filter((o) => o.id !== id) }),
          dirty: true,
        };
      }),
    updateApiConfig: (patch) =>
      set((s) => {
        const db = dbOf(s.project);
        return { project: withDb(s.project, { ...db, api: { ...db.api, ...patch } }), dirty: true };
      }),
  };
});

// ---- derived helpers ----

/** Project.database is optional in saved .wbp files — fill in the default when absent. */
const FALLBACK_DB = createDatabaseState();

export function dbOf(project: Project): DatabaseState {
  // must return a stable reference — components select dbOf(s.project) in zustand
  return project.database ?? FALLBACK_DB;
}

function withDb(project: Project, database: DatabaseState): Project {
  return { ...project, database };
}

export function useCurrentPage(): Page {
  return useProjectStore((s) => s.project.pages.find((p) => p.id === s.currentPageId) ?? s.project.pages[0]);
}

/** Effective geometry+props of a component under the active breakpoint,
 *  with cascade: the narrowest breakpoint at/above the target that has an
 *  override for this element governs it (see model/responsive.ts). */
export function effectiveComponent(
  c: ComponentItem,
  breakpoints: Breakpoint[],
  activeBreakpointId: string | null,
  baseWidth?: number
): ComponentItem {
  return resolveComponent(c, breakpoints, activeBreakpointId, baseWidth);
}
