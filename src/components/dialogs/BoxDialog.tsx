import { useEffect, useState } from 'react';
import { useProjectStore, useCurrentPage, effectiveComponent } from '../../store/projectStore';
import { responsiveBaseWidth } from '../../model/responsive';
import { DialogShell } from './BreakpointDialogs';

/** Expand a CSS box shorthand into [top, right, bottom, left]. */
function parseBox(value: unknown): [string, string, string, string] {
  const parts = String(value ?? '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ['', '', '', ''];
  if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
  if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
  if (parts.length === 3) return [parts[0], parts[1], parts[2], parts[1]];
  return [parts[0], parts[1], parts[2], parts[3]];
}

const SIDES = ['Top', 'Right', 'Bottom', 'Left'] as const;

/** Modal with 4 side inputs backing the Margin… / Padding… ribbon + context-menu actions. */
export default function BoxDialog() {
  const dialog = useProjectStore((s) => s.boxDialog);
  const closeBoxDialog = useProjectStore((s) => s.closeBoxDialog);
  const setBoxSelection = useProjectStore((s) => s.setBoxSelection);
  const page = useCurrentPage();
  const [sides, setSides] = useState<[string, string, string, string]>(['', '', '', '']);

  useEffect(() => {
    if (!dialog) return;
    const st = useProjectStore.getState();
    const ids = st.selectedIds.length > 0 ? st.selectedIds : st.selectedId ? [st.selectedId] : [];
    const first = page.components.find((c) => c.id === ids[0]);
    const eff = first
      ? effectiveComponent(first, st.project.breakpoints, st.activeBreakpointId, responsiveBaseWidth(page))
      : null;
    setSides(parseBox(eff?.props?.[dialog.kind]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  if (!dialog) return null;
  const title = dialog.kind === 'margin' ? 'Margin' : 'Padding';

  const apply = () => {
    const value = sides.map((s) => s.trim() || '0px').join(' ');
    setBoxSelection(dialog.kind, value);
    closeBoxDialog();
  };

  return (
    <DialogShell title={`${title} (px, em, %…)`} onClose={closeBoxDialog} width={320}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply();
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SIDES.map((side, i) => (
            <label key={side} style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12 }}>
              <span>{side}</span>
              <input
                className="db-input"
                value={sides[i]}
                placeholder="0px"
                autoFocus={i === 0}
                onChange={(e) => {
                  const next = [...sides] as typeof sides;
                  next[i] = e.target.value;
                  setSides(next);
                }}
              />
            </label>
          ))}
        </div>
        <div className="db-actions" style={{ marginTop: 14 }}>
          <button type="button" className="db-btn" onClick={closeBoxDialog}>Cancel</button>
          <button type="submit" className="db-btn db-btn-primary">OK</button>
        </div>
      </form>
    </DialogShell>
  );
}
