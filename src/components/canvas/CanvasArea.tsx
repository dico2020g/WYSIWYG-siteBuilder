import { useCallback, useEffect, useRef, useState } from 'react';
import type { DragEvent as ReactDragEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useProjectStore, useCurrentPage, effectiveComponent } from '../../store/projectStore';
import { responsiveBaseWidth } from '../../model/responsive';
import ComponentView from './ComponentView';
import ContextMenu from './ContextMenu';
import BottomPanel from './BottomPanel';
import DatabaseWorkspace, { DB_TAB_META } from '../dialogs/DatabaseWorkspace';
import { previewProject, exportProject } from '../../actions/fileActions';
import { sortBreakpoints } from '../../model/factory';
import { AppIcon } from '../icons/AppIcon';
import type { GuideItem } from '../../model/types';

type GuideOrientation = 'horizontal' | 'vertical';
type MarqueeRect = { startX: number; startY: number; x: number; y: number; width: number; height: number };

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function normalizedRect(startX: number, startY: number, endX: number, endY: number): MarqueeRect {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  return { startX, startY, x, y, width: Math.abs(endX - startX), height: Math.abs(endY - startY) };
}

function rectsIntersect(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function guideGoverningBreakpointId(
  guide: GuideItem,
  breakpoints: ReturnType<typeof sortBreakpoints>,
  targetId: string
): string | null {
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return null;
  let best: (typeof breakpoints)[number] | null = null;
  for (const b of breakpoints) {
    if (b.maxWidth < target.maxWidth) continue;
    if (!guide.overrides?.[b.id]) continue;
    if (!best || b.maxWidth < best.maxWidth) best = b;
  }
  return best?.id ?? null;
}

function resolveGuide(
  guide: GuideItem,
  breakpoints: ReturnType<typeof sortBreakpoints>,
  targetId: string | null,
  baseWidth: number
): GuideItem {
  if (!targetId) return guide;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return guide;
  const gid = guideGoverningBreakpointId(guide, breakpoints, targetId);
  const sourceWidth = gid ? breakpoints.find((b) => b.id === gid)?.maxWidth ?? target.maxWidth : baseWidth;
  const scale = sourceWidth > 0 ? target.maxWidth / sourceWidth : 1;
  const ov = gid ? guide.overrides?.[gid] : undefined;
  return {
    ...guide,
    position: Math.round((ov?.position ?? guide.position) * scale),
    start: Math.round((ov?.start ?? guide.start) * scale),
    length: Math.round((ov?.length ?? guide.length) * scale),
  };
}

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
  const selectComponents = useProjectStore((s) => s.selectComponents);
  const selectedGuideId = useProjectStore((s) => s.selectedGuideId);
  const selectGuide = useProjectStore((s) => s.selectGuide);
  const addGuide = useProjectStore((s) => s.addGuide);
  const updateGuide = useProjectStore((s) => s.updateGuide);
  const deleteGuide = useProjectStore((s) => s.deleteGuide);
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
  const [guideDrag, setGuideDrag] = useState<{ orientation: GuideOrientation; value: number } | null>(null);
  const [marquee, setMarquee] = useState<MarqueeRect | null>(null);
  const suppressNextClickRef = useRef(false);

  const activeBp = sortedBreakpoints.find((b) => b.id === activeBreakpointId) ?? null;
  // No breakpoint active: extend the page to the workspace's right edge at any zoom
  // (48px ≈ margins + scrollbar). page.width stays the exported page width.
  const fillWidth =
    workspaceWidth > 0 ? Math.max(page.width, Math.floor((workspaceWidth - 48) / zoom)) : page.width;
  const artboardWidth = activeBp ? activeBp.maxWidth : fillWidth;
  // page.height is authoritative: the store auto-grows it when a component is
  // dragged past the bottom, and manual edits in Properties are respected as-is.
  const artboardHeight = page.height;
  const baseWidth = responsiveBaseWidth(page);
  const resolvedGuides = (page.guides ?? []).map((guide) =>
    resolveGuide(guide, sortedBreakpoints, activeBreakpointId, baseWidth)
  );

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
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }
    const { x, y } = toArtboard(e.clientX, e.clientY);
    if (tool !== 'pointer') {
      addComponent(tool, x, y); // store snaps to grid and resets tool to pointer
    } else {
      selectComponent(null);
    }
  };

  const onDrop = (e: ReactDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const type = e.dataTransfer.getData('application/x-component-type') || e.dataTransfer.getData('text/plain');
    if (!type) return;
    const { x, y } = toArtboard(e.clientX, e.clientY);
    addComponent(type, x, y);
  };

  const onArtboardDragOver = (e: ReactDragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onArtboardPointerMove = (e: ReactPointerEvent) => {
    const { x, y } = toArtboard(e.clientX, e.clientY);
    window.dispatchEvent(
      new CustomEvent('sitebuilder:cursor', { detail: { x: Math.round(x), y: Math.round(y) } })
    );
  };

  const startGuideDrag = (orientation: GuideOrientation) => (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const point = toArtboard(e.clientX, e.clientY);
    const initial =
      orientation === 'vertical' ? clamp(point.x, 0, artboardWidth) : clamp(point.y, 0, artboardHeight);
    setGuideDrag({ orientation, value: Math.round(initial) });

    const onMove = (ev: PointerEvent) => {
      const next = toArtboard(ev.clientX, ev.clientY);
      const value =
        orientation === 'vertical' ? clamp(next.x, 0, artboardWidth) : clamp(next.y, 0, artboardHeight);
      setGuideDrag({ orientation, value: Math.round(value) });
    };
    const onUp = (ev: PointerEvent) => {
      const next = toArtboard(ev.clientX, ev.clientY);
      const value = orientation === 'vertical' ? next.x : next.y;
      if (value >= 0 && value <= (orientation === 'vertical' ? artboardWidth : artboardHeight)) {
        const id = addGuide({
          orientation,
          position: Math.round(value),
          start: 0,
          length: orientation === 'vertical' ? artboardHeight : artboardWidth,
        });
        if (activeBreakpointId) {
          updateGuide(id, {
            position: Math.round(value),
            start: 0,
            length: orientation === 'vertical' ? artboardHeight : artboardWidth,
          });
        }
      }
      setGuideDrag(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onArtboardPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (tool !== 'pointer' || e.button !== 0 || e.target !== e.currentTarget) return;
    e.preventDefault();
    suppressNextClickRef.current = true;
    const start = toArtboard(e.clientX, e.clientY);
    const startX = clamp(start.x, 0, artboardWidth);
    const startY = clamp(start.y, 0, artboardHeight);
    setMarquee(normalizedRect(startX, startY, startX, startY));

    const onMove = (ev: PointerEvent) => {
      const point = toArtboard(ev.clientX, ev.clientY);
      setMarquee(
        normalizedRect(startX, startY, clamp(point.x, 0, artboardWidth), clamp(point.y, 0, artboardHeight))
      );
    };
    const onUp = (ev: PointerEvent) => {
      const point = toArtboard(ev.clientX, ev.clientY);
      const rect = normalizedRect(
        startX,
        startY,
        clamp(point.x, 0, artboardWidth),
        clamp(point.y, 0, artboardHeight)
      );
      if (rect.width < 3 && rect.height < 3) {
        selectComponent(null);
      } else {
        const baseWidth = responsiveBaseWidth(page);
        const selected = page.components
          .filter((component) => {
            const eff = effectiveComponent(component, breakpoints, activeBreakpointId, baseWidth);
            return rectsIntersect(rect, { x: eff.x, y: eff.y, width: eff.width, height: eff.height });
          })
          .map((component) => component.id);
        selectComponents(selected);
      }
      setMarquee(null);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startGuideMove = (guide: GuideItem) => (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    suppressNextClickRef.current = true;
    selectGuide(guide.id);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startPosition = guide.position;
    const onMove = (ev: PointerEvent) => {
      const delta = guide.orientation === 'vertical'
        ? (ev.clientX - startClientX) / zoom
        : (ev.clientY - startClientY) / zoom;
      const max = guide.orientation === 'vertical' ? artboardWidth : artboardHeight;
      updateGuide(guide.id, { position: Math.round(clamp(startPosition + delta, 0, max)) });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startGuideResize = (guide: GuideItem, edge: 'start' | 'end') => (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    suppressNextClickRef.current = true;
    selectGuide(guide.id);
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const originalStart = guide.start;
    const originalLength = guide.length;
    const maxLength = guide.orientation === 'vertical' ? artboardHeight : artboardWidth;
    const onMove = (ev: PointerEvent) => {
      const delta = guide.orientation === 'vertical'
        ? (ev.clientY - startClientY) / zoom
        : (ev.clientX - startClientX) / zoom;
      if (edge === 'start') {
        const nextStart = clamp(originalStart + delta, 0, originalStart + originalLength - 10);
        updateGuide(guide.id, {
          start: Math.round(nextStart),
          length: Math.round(originalLength + (originalStart - nextStart)),
        });
      } else {
        const nextEnd = clamp(originalStart + originalLength + delta, originalStart + 10, maxLength);
        updateGuide(guide.id, { length: Math.round(nextEnd - originalStart) });
      }
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
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
      {/* a2) device-switcher bar */}
      <div className="device-bar">
        <div className="device-bar-group">
          <button
            className={'device-bar-btn icon-only' + (activeBreakpointId === null ? ' active' : '')}
            title="Desktop"
            onClick={() => setActiveBreakpoint(null)}
          >
            <AppIcon name="deviceDesktop" size={17} />
          </button>
          <button
            className={
              'device-bar-btn icon-only' +
              (activeBp && activeBp.maxWidth > 480 ? ' active' : '')
            }
            title="Tablet"
            onClick={() => {
              const bp =
                sortedBreakpoints.find((b) => b.maxWidth <= 768 && b.maxWidth > 480) ??
                sortedBreakpoints.find((b) => b.maxWidth <= 768) ??
                sortedBreakpoints[0];
              if (bp) setActiveBreakpoint(bp.id);
            }}
          >
            <AppIcon name="deviceTablet" size={17} />
          </button>
          <button
            className={
              'device-bar-btn icon-only' + (activeBp && activeBp.maxWidth <= 480 ? ' active' : '')
            }
            title="Mobile"
            onClick={() => {
              const bp =
                sortedBreakpoints.find((b) => b.maxWidth <= 480) ?? sortedBreakpoints[sortedBreakpoints.length - 1];
              if (bp) setActiveBreakpoint(bp.id);
            }}
          >
            <AppIcon name="deviceMobile" size={17} />
          </button>
        </div>
        <div className="device-bar-spacer" />
        <button className="device-bar-icon" title="Preview" onClick={() => void previewProject()}>
          <AppIcon name="preview" size={15} />
        </button>
        <button className="device-bar-icon" title="Publish" onClick={() => void exportProject()}>
          <AppIcon name="publish" size={15} />
        </button>
      </div>

      {/* b) rulers */}
      <div className="ruler-top">
        <div className="ruler-corner" />
        <canvas className="ruler-h" ref={hRulerRef} onPointerDown={startGuideDrag('horizontal')} />
      </div>
      <div className="canvas-middle">
        <canvas className="ruler-v" ref={vRulerRef} onPointerDown={startGuideDrag('vertical')} />

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
              onDragOver={onArtboardDragOver}
              onDrop={onDrop}
              onPointerDown={onArtboardPointerDown}
              onPointerMove={onArtboardPointerMove}
              onContextMenu={(e) => {
                e.preventDefault();
                openContextMenu({ x: e.clientX, y: e.clientY, componentId: null });
              }}
            >
              {resolvedGuides.map((guide) => {
                const selected = selectedGuideId === guide.id;
                const style =
                  guide.orientation === 'vertical'
                    ? { left: guide.position, top: guide.start, height: guide.length }
                    : { top: guide.position, left: guide.start, width: guide.length };
                return (
                  <div
                    key={guide.id}
                    className={
                      'canvas-guide' +
                      (guide.orientation === 'vertical' ? ' canvas-guide-v' : ' canvas-guide-h') +
                      (selected ? ' selected' : '')
                    }
                    style={style}
                    onPointerDown={startGuideMove(guide)}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectGuide(guide.id);
                    }}
                    title="Drag to reposition. Drag handles to resize. Press Delete to remove."
                  >
                    {selected && (
                      <>
                        <button
                          className="canvas-guide-handle canvas-guide-handle-start"
                          onPointerDown={startGuideResize(guide, 'start')}
                          aria-label="Resize guide start"
                        />
                        <button
                          className="canvas-guide-handle canvas-guide-handle-end"
                          onPointerDown={startGuideResize(guide, 'end')}
                          aria-label="Resize guide end"
                        />
                        <button
                          className="canvas-guide-remove"
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGuide(guide.id);
                          }}
                          aria-label="Remove guide"
                        >
                          x
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
              {guideDrag?.orientation === 'vertical' && (
                <div className="canvas-guide canvas-guide-v canvas-guide-preview" style={{ left: guideDrag.value, top: 0, height: artboardHeight }} />
              )}
              {guideDrag?.orientation === 'horizontal' && (
                <div className="canvas-guide canvas-guide-h canvas-guide-preview" style={{ top: guideDrag.value, left: 0, width: artboardWidth }} />
              )}
              {marquee && (
                <div
                  className="canvas-selection-rect"
                  style={{ left: marquee.x, top: marquee.y, width: marquee.width, height: marquee.height }}
                />
              )}
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
