import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';

interface CursorPos {
  x: number;
  y: number;
}

export default function StatusBar() {
  const zoom = useProjectStore((s) => s.zoom);
  const setZoom = useProjectStore((s) => s.setZoom);
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
      <div className="status-left">WYSIWYG SiteBuilder</div>
      <div className="status-center">
        x: {cursor.x}, y: {cursor.y}
      </div>
      <div className="status-right">
        <input
          type="range"
          min={25}
          max={200}
          step={5}
          value={Math.round(zoom * 100)}
          onChange={(e) => setZoom(Number(e.target.value) / 100)}
        />
        <span className="zoom-label">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
