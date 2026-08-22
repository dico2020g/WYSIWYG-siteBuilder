import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { sortBreakpoints } from '../../model/factory';

interface CursorPos {
  x: number;
  y: number;
}

export default function StatusBar() {
  const zoom = useProjectStore((s) => s.zoom);
  const setZoom = useProjectStore((s) => s.setZoom);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const activeBreakpointId = useProjectStore((s) => s.activeBreakpointId);
  const setActiveBreakpoint = useProjectStore((s) => s.setActiveBreakpoint);
  const [cursor, setCursor] = useState<CursorPos>({ x: 0, y: 0 });

  useEffect(() => {
    const onCursor = (e: Event) => {
      const detail = (e as CustomEvent<CursorPos>).detail;
      if (detail) setCursor({ x: Math.round(detail.x), y: Math.round(detail.y) });
    };
    window.addEventListener('sitebuilder:cursor', onCursor);
    return () => window.removeEventListener('sitebuilder:cursor', onCursor);
  }, []);

  return (
    <div className="status-bar">
      <div className="status-left">Ready</div>
      <div className="status-devices">
        <span className="status-device-icon" title="Desktop">🖥</span>
        <span className="status-device-icon" title="Tablet">💻</span>
        <span className="status-device-icon" title="Mobile">📱</span>
      </div>
      <div className="status-breakpoint">
        <select
          className="status-bp-select"
          value={activeBreakpointId ?? ''}
          onChange={(e) => setActiveBreakpoint(e.target.value || null)}
        >
          <option value="">Desktop</option>
          {sortBreakpoints(breakpoints).map((bp) => (
            <option key={bp.id} value={bp.id}>
              {bp.maxWidth} px
            </option>
          ))}
        </select>
      </div>
      <div className="status-center">
        x: {cursor.x}, y: {cursor.y}
      </div>
      <div className="status-right">
        <span className="zoom-btn" onClick={() => setZoom(zoom - 0.05)}>－</span>
        <input
          type="range"
          min={25}
          max={200}
          step={5}
          value={Math.round(zoom * 100)}
          onChange={(e) => setZoom(Number(e.target.value) / 100)}
        />
        <span className="zoom-btn" onClick={() => setZoom(zoom + 0.05)}>＋</span>
        <span className="zoom-label">{Math.round(zoom * 100)} %</span>
        <span className="status-grid">Grid ▾</span>
      </div>
    </div>
  );
}
