import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent as ReactDragEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useProjectStore, useCurrentPage } from '../../store/projectStore';
import ComponentView from './ComponentView';
import ContextMenu from './ContextMenu';
import BottomPanel from './BottomPanel';
import DatabaseWorkspace, { DB_TAB_META } from '../dialogs/DatabaseWorkspace';
import { previewProject, exportProject } from '../../actions/fileActions';
import { sortBreakpoints } from '../../model/factory';

/** Monitor-with-badge icon matching the breakpoint bar in WYSIWYG Web Builder. */
function BreakpointBarIcon({ badge }: { badge: 'plus' | 'gear' }) {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" aria-hidden="true">
      {/* monitor */}
      <rect x="1" y="1" width="13" height="9" rx="1" fill="#ffffff" stroke="#5a5a5a" strokeWidth="1.1" />
      <line x1="6.5" y1="10" x2="6.5" y2="12.5" stroke="#5a5a5a" strokeWidth="1.1" />
      <line x1="4" y1="13" x2="11" y2="13" stroke="#5a5a5a" strokeWidth="1.1" />
      {badge === 'plus' ? (
        <g>
          <circle cx="14.5" cy="12.5" r="4.6" fill="#4caf50" stroke="#ffffff" strokeWidth="1" />
          <line x1="14.5" y1="9.8" x2="14.5" y2="15.2" stroke="#ffffff" strokeWidth="1.4" />
          <line x1="11.8" y1="12.5" x2="17.2" y2="12.5" stroke="#ffffff" strokeWidth="1.4" />
        </g>
      ) : (
        <g transform="translate(14.5 12.5)">
          <circle r="4.6" fill="#f5f5f5" stroke="#8a8a8a" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="0" y1="-2.2" x2="0" y2="-3.6"
              stroke="#777777" strokeWidth="1.1"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="2.2" fill="none" stroke="#777777" strokeWidth="1.1" />
          <circle r="0.7" fill="#777777" />
        </g>
      )}
    </svg>
  );
}

export default function CanvasArea() {
  const page = useCurrentPage();
  const pages = useProjectStore((s) => s.project.pages);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const currentPageId = useProjectStore((s) => s.currentPageId);
  const tool = useProjectStore((s) => s.tool);
  const zoom = useProjectStore((s) => s.zoom);
  const activeBreakpointId = useProjectStore((s) => s.activeBreakpointId);
  const addComponent = useProjectStore((s) => s.addComponent);
  const selectComponent = useProjectStore((s) => s.selectComponent);
  const selectPage = useProjectStore((s) => s.selectPage);
  const addPage = useProjectStore((s) => s.addPage);
  const setActiveBreakpoint = useProjectStore((s) => s.setActiveBreakpoint);
  const openBreakpointEditor = useProjectStore((s) => s.openBreakpointEditor);
  const openManageBreakpoints = useProjectStore((s) => s.openManageBreakpoints);
  const openContextMenu = useProjectStore((s) => s.openContextMenu);
  const openDbPages = useProjectStore((s) => s.openDbPages);
  const activeDbPage = useProjectStore((s) => s.activeDbPage);
  const setDatabasePage = useProjectStore((s) => s.setDatabasePage);
  const closeDatabase = useProjectStore((s) => s.closeDatabase);
  const sortedBreakpoints = sortBreakpoints(breakpoints);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const hRulerRef = useRef<HTMLCanvasElement>(null);
  const vRulerRef = useRef<HTMLCanvasElement>(null);

  // Viewport width of the scrollable workspace — lets the artboard fill it.
  const [workspaceWidth, setWorkspaceWidth] = useState(0);

  const activeBp = sortedBreakpoints.find((b) => b.id === activeBreakpointId) ?? null;
  // No breakpoint active: extend the page to the workspace's right edge at any zoom
  // (48px ≈ margins + scrollbar). page.width stays the exported page width.
  const fillWidth =
    workspaceWidth > 0 ? Math.max(page.width, Math.floor((workspaceWidth - 48) / zoom)) : page.width;
  const artboardWidth = activeBp ? activeBp.maxWidth : fillWidth;
  // page.height is authoritative: the store auto-grows it when a component is
  // dragged past the bottom, and manual edits in Properties are respected as-is.
  const artboardHeight = page.height;

  useEffect(() => {
    const ws = workspaceRef.current;
    if (!ws) return;
    const measure = () => setWorkspaceWidth(ws.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(ws);
    return () => ro.disconnect();
  }, []);

  const drawRulers = useCallback(() => {
    const ws = workspaceRef.current;
    const spacer = spacerRef.current;
    const hRuler = hRulerRef.current;
    const vRuler = vRulerRef.current;
    if (!ws || !spacer || !hRuler || !vRuler) return;

    // artboard origin in workspace-viewport pixels (accounts for scroll + centering)
    const wsRect = ws.getBoundingClientRect();
    const spRect = spacer.getBoundingClientRect();
    const originX = spRect.left - wsRect.left;
    const originY = spRect.top - wsRect.top;
    const dpr = window.devicePixelRatio || 1;

    const draw = (canvas: HTMLCanvasElement, horizontal: boolean, origin: number, artboardLen: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#9a9a9a';
      ctx.fillStyle = '#666666';
      ctx.font = '9px "Segoe UI", Tahoma, sans-serif';
      ctx.beginPath();
      const limit = horizontal ? w : h;
      for (let p = 0; p <= artboardLen; p += 10) {
        const pos = origin + p * zoom;
        if (pos < -1 || pos > limit + 1) continue;
        const major = p % 100 === 0;
        const tick = major ? 8 : 4;
        const px = Math.round(pos) + 0.5;
        if (horizontal) {
          ctx.moveTo(px, 20);
          ctx.lineTo(px, 20 - tick);
          if (major) ctx.fillText(String(p), pos + 3, 9);
        } else {
          ctx.moveTo(20, px);
          ctx.lineTo(20 - tick, px);
          if (major) ctx.fillText(String(p), 3, pos - 3);
        }
      }
      ctx.stroke();
    };

    draw(hRuler, true, originX, artboardWidth);
    draw(vRuler, false, originY, artboardHeight);
  }, [zoom, artboardWidth, artboardHeight]);

  useEffect(() => {
    drawRulers();
    const ws = workspaceRef.current;
    if (!ws) return;
    const ro = new ResizeObserver(drawRulers);
    ro.observe(ws);
    return () => ro.disconnect();
  }, [drawRulers]);

  /** Convert client (screen) coords to artboard coords, accounting for scroll, offset and zoom. */
  const toArtboard = (clientX: number, clientY: number): { x: number; y: number } => {
    const el = artboardRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: (clientX - r.left) / zoom, y: (clientY - r.top) / zoom };
  };

  const onArtboardClick = (e: ReactMouseEvent) => {
    const { x, y } = toArtboard(e.clientX, e.clientY);
    if (tool !== 'pointer') {
      addComponent(tool, x, y); // store snaps to grid and resets tool to pointer
    } else {
      selectComponent(null);
    }
  };

  const onDrop = (e: ReactDragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/x-component-type');
    if (!type) return;
    const { x, y } = toArtboard(e.clientX, e.clientY);
    addComponent(type, x, y);
  };

  const onArtboardPointerMove = (e: ReactPointerEvent) => {
    const { x, y } = toArtboard(e.clientX, e.clientY);
    window.dispatchEvent(
      new CustomEvent('sitebuilder:cursor', { detail: { x: Math.round(x), y: Math.round(y) } })
    );
  };

  return (
    <div className="canvas-root">
      {/* a) page tabs — design pages first, then open database tabs (closable) */}
      <div className="page-tabs">
        {pages.map((p) => (
          <div
            key={p.id}
            className={'page-tab' + (p.id === currentPageId && !activeDbPage ? ' active' : '')}
            onClick={() => selectPage(p.id)}
          >
            {p.name}
          </div>
        ))}
        {openDbPages.map((p) => {
          const meta = DB_TAB_META.find((m) => m.id === p);
          return (
            <div
              key={p}
              className={'page-tab page-tab-db' + (activeDbPage === p ? ' active' : '')}
              onClick={() => setDatabasePage(p)}
            >
              {meta?.icon} {meta?.title ?? p}
              <span
                className="page-tab-close"
                title="Close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeDatabase(p);
                }}
              >
                ×
              </span>
            </div>
          );
        })}
        <div className="page-tab page-tab-add" onClick={addPage} title="Add page">
          +
        </div>
      </div>

      {activeDbPage ? (
        <DatabaseWorkspace />
      ) : (
        <>
      {/* a2) dark device-switcher bar (WebDev look) */}
      <div className="device-bar">
        <div className="device-bar-group">
          <button
            className={'device-bar-btn' + (activeBreakpointId === null ? ' active' : '')}
            onClick={() => setActiveBreakpoint(null)}
          >
            🖥 Desktop
          </button>
          <button
            className={
              'device-bar-btn' +
              (activeBp && activeBp.maxWidth > 480 ? ' active' : '')
            }
            onClick={() => {
              const bp =
                sortedBreakpoints.find((b) => b.maxWidth <= 768 && b.maxWidth > 480) ??
                sortedBreakpoints.find((b) => b.maxWidth <= 768) ??
                sortedBreakpoints[0];
              if (bp) setActiveBreakpoint(bp.id);
            }}
          >
            💻 Tablet
          </button>
          <button
            className={
              'device-bar-btn' + (activeBp && activeBp.maxWidth <= 480 ? ' active' : '')
            }
            onClick={() => {
              const bp =
                sortedBreakpoints.find((b) => b.maxWidth <= 480) ?? sortedBreakpoints[sortedBreakpoints.length - 1];
              if (bp) setActiveBreakpoint(bp.id);
            }}
          >
            📱 Mobile
          </button>
        </div>
        <div className="device-bar-spacer" />
        <button className="device-bar-icon" title="Preview" onClick={() => void previewProject()}>
          🔍
        </button>
        <button className="device-bar-icon" title="Publish" onClick={() => void exportProject()}>
          🌐
        </button>
      </div>

      {/* b) rulers */}
      <div className="ruler-top">
        <div className="ruler-corner" />
        <canvas className="ruler-h" ref={hRulerRef} />
      </div>
      <div className="canvas-middle">
        <canvas className="ruler-v" ref={vRulerRef} />

        {/* c) scrollable workspace + artboard */}
        <div className="canvas-workspace" ref={workspaceRef} onScroll={drawRulers}>
          <div
            className="artboard-spacer"
            ref={spacerRef}
            style={{ width: artboardWidth * zoom, height: artboardHeight * zoom }}
          >
            <div
              className="artboard"
              ref={artboardRef}
              style={{
                width: artboardWidth,
                height: artboardHeight,
                backgroundColor: page.backgroundColor || '#ffffff',
                transform: `scale(${zoom})`,
              }}
              onClick={onArtboardClick}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              onPointerMove={onArtboardPointerMove}
              onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu({ x: e.clientX, y: e.clientY, componentId: null });
              }}
            >
              {page.components.map((c) => (
                <ComponentView key={c.id} component={c} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContextMenu />

      {/* d) diagnostics panel (Errors / Output / ...) */}
      <BottomPanel />

      {/* e) breakpoint bar — pinned to the bottom, always visible */}
      <div className="breakpoint-bar">
        <button
          className="bp-bar-btn"
          title="Add Breakpoint"
          onClick={() => openBreakpointEditor({ mode: 'add' })}
        >
          <BreakpointBarIcon badge="plus" />
        </button>
        <button className="bp-bar-btn" title="Manage Breakpoints" onClick={openManageBreakpoints}>
          <BreakpointBarIcon badge="gear" />
        </button>
        <button
          className={'bp-chip' + (activeBreakpointId === null ? ' active' : '')}
          onClick={() => setActiveBreakpoint(null)}
        >
          Default
        </button>
        {sortedBreakpoints.map((bp) => (
          <button
            key={bp.id}
            className={'bp-chip' + (activeBreakpointId === bp.id ? ' active' : '')}
            onClick={() => setActiveBreakpoint(bp.id)}
          >
            {bp.maxWidth}px
          </button>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
