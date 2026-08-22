import { useEffect, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Ribbon from './components/ribbon/Ribbon';
import Toolbox from './components/toolbox/Toolbox';
import BlocksPanel from './components/toolbox/BlocksPanel';
import CanvasArea from './components/canvas/CanvasArea';
import SiteManager from './components/sitemanager/SiteManager';
import PropertiesPanel from './components/properties/PropertiesPanel';
import StatusBar from './components/statusbar/StatusBar';
import BreakpointDialogs from './components/dialogs/BreakpointDialogs';
import CodeDialogs from './components/dialogs/CodeDialogs';
import ConnectionsDialog from './components/dialogs/ConnectionsDialog';
import AppPrompt from './components/dialogs/AppPrompt';
import { useProjectStore, useCurrentPage } from './store/projectStore';

const LEFT_MIN = 160;
const RIGHT_MIN = 220;
const PANEL_MAX = 480;

function clampPanel(v: number, min: number): number {
  return Math.min(PANEL_MAX, Math.max(min, Math.round(v)));
}

function readStoredWidth(key: string, fallback: number, min: number): number {
  const raw = Number(localStorage.getItem(key));
  return Number.isFinite(raw) && raw > 0 ? clampPanel(raw, min) : fallback;
}

export default function App() {
  const page = useCurrentPage();
  const projectName = useProjectStore((s) => s.project.name);
  const dirty = useProjectStore((s) => s.dirty);
  const activeDbPage = useProjectStore((s) => s.activeDbPage);

  const [leftWidth, setLeftWidth] = useState(() => readStoredWidth('sb.leftWidth', 220, LEFT_MIN));
  const [rightWidth, setRightWidth] = useState(() => readStoredWidth('sb.rightWidth', 300, RIGHT_MIN));

  useEffect(() => {
    document.title = `WYSIWYG SiteBuilder - [${projectName}]${dirty ? ' *' : ''}`;
  }, [projectName, dirty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const st = useProjectStore.getState();
      const sel = st.selectedId;

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'x' && sel) {
          e.preventDefault();
          st.cutComponent(sel);
        } else if (key === 'c' && sel) {
          e.preventDefault();
          if (e.shiftKey) st.cloneComponent(sel, true);
          else st.copyComponent(sel);
        } else if (key === 'v' && st.clipboard) {
          e.preventDefault();
          st.pasteComponent(e.shiftKey); // Ctrl+Shift+V = paste in place
        } else if (key === 'd' && sel) {
          e.preventDefault();
          st.toggleHidden(sel);
        } else if (key === 'l' && sel) {
          e.preventDefault();
          st.toggleLocked(sel);
        } else if (key === 'h' && sel) {
          e.preventDefault();
          st.openCodeDialog({ kind: 'object-html', componentId: sel });
        } else if (key === 'a') {
          e.preventDefault();
          const comps =
            st.project.pages.find((p) => p.id === st.currentPageId)?.components ?? [];
          // single-selection model: select the top-most (last in stacking order)
          if (comps.length > 0) st.selectComponent(comps[comps.length - 1].id);
        }
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && sel) {
        st.deleteComponent(sel);
      } else if (e.key === 'Escape') {
        if (st.contextMenu) {
          st.closeContextMenu();
          return;
        }
        st.selectComponent(null);
        st.setTool('pointer');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const startPanelDrag = (side: 'left' | 'right') => (e: ReactPointerEvent) => {
    e.preventDefault();
    let last = side === 'left' ? leftWidth : rightWidth;
    const onMove = (ev: PointerEvent) => {
      if (side === 'left') {
        last = clampPanel(ev.clientX, LEFT_MIN);
        setLeftWidth(last);
      } else {
        last = clampPanel(window.innerWidth - ev.clientX, RIGHT_MIN);
        setRightWidth(last);
      }
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      localStorage.setItem(side === 'left' ? 'sb.leftWidth' : 'sb.rightWidth', String(last));
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="app-shell">
      <div className="app-titlebar">
        <span className="app-titlebar-icon">▣</span>
        <span className="app-titlebar-text">
          WYSIWYG SiteBuilder - {projectName} - {page.name}{dirty ? '*' : ''}
        </span>
      </div>
      <Ribbon />
      <div className="app-body">
        {!activeDbPage && (
          <>
            <aside className="left-column" style={{ width: leftWidth, minWidth: leftWidth }}>
              <Toolbox />
              <BlocksPanel />
            </aside>
            <div className="panel-resizer" onPointerDown={startPanelDrag('left')} />
          </>
        )}
        <main className="center-column">
          <CanvasArea key={page.id} />
        </main>
        <div className="panel-resizer" onPointerDown={startPanelDrag('right')} />
        <aside className="right-column" style={{ width: rightWidth, minWidth: rightWidth }}>
          <SiteManager />
          <PropertiesPanel />
        </aside>
      </div>
      <StatusBar />
      <BreakpointDialogs />
      <CodeDialogs />
      <ConnectionsDialog />
      <AppPrompt />
    </div>
  );
}
