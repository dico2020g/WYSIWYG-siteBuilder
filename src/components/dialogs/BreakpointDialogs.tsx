import { useState, type ReactNode } from 'react';
import type { Breakpoint } from '../../model/types';
import { useProjectStore } from '../../store/projectStore';
import { appAlert, appConfirm } from '../../actions/dialogs';
import { sortBreakpoints } from '../../model/factory';

const COMMON_WIDTHS = [320, 480, 600, 768, 800, 1024, 1280];
const FONT_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

function orientationLabel(o: Breakpoint['orientation']): string {
  if (o === 'portrait') return 'Portrait';
  if (o === 'landscape') return 'Landscape';
  return 'None';
}

/* ---------- shared dialog shell (classic Windows look) ---------- */

export function DialogShell({
  title,
  onClose,
  width,
  children,
}: {
  title: string;
  onClose: () => void;
  width?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="dlg-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dlg" style={width ? { width } : undefined}>
        <div className="dlg-titlebar">
          <span className="dlg-title">{title}</span>
          <button className="dlg-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
        <div className="dlg-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- manage breakpoints ---------- */

function ManageBreakpointsDialog() {
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const breakpointMode = useProjectStore((s) => s.project.breakpointMode ?? 'smaller');
  const closeManageBreakpoints = useProjectStore((s) => s.closeManageBreakpoints);
  const openBreakpointEditor = useProjectStore((s) => s.openBreakpointEditor);
  const removeBreakpoint = useProjectStore((s) => s.removeBreakpoint);
  const removeAllBreakpoints = useProjectStore((s) => s.removeAllBreakpoints);
  const moveBreakpoint = useProjectStore((s) => s.moveBreakpoint);
  const setBreakpointMode = useProjectStore((s) => s.setBreakpointMode);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sortedBreakpoints = sortBreakpoints(breakpoints);
  const selected = sortedBreakpoints.find((b) => b.id === selectedId) ?? null;
  const selectedIndex = sortedBreakpoints.findIndex((b) => b.id === selectedId);

  const onRemove = () => {
    if (selected) removeBreakpoint(selected.id);
    setSelectedId(null);
  };

  const onRemoveAll = async () => {
    if (breakpoints.length === 0) return;
    if (await appConfirm('Remove all breakpoints?')) {
      removeAllBreakpoints();
      setSelectedId(null);
    }
  };

  return (
    <DialogShell title="Manage Breakpoints" onClose={closeManageBreakpoints} width={520}>
      <div className="dlg-bp-manage">
        <table className="dlg-bp-table">
          <thead>
            <tr>
              <th>Device width</th>
              <th>Orientation</th>
              <th>Default Font Size</th>
            </tr>
          </thead>
          <tbody>
            {sortedBreakpoints.length === 0 && (
              <tr>
                <td colSpan={3} className="dlg-bp-empty">
                  No breakpoints defined.
                </td>
              </tr>
            )}
            {sortedBreakpoints.map((bp) => (
              <tr
                key={bp.id}
                className={bp.id === selectedId ? 'selected' : ''}
                onClick={() => setSelectedId(bp.id)}
              >
                <td>{bp.maxWidth} px</td>
                <td>{orientationLabel(bp.orientation)}</td>
                <td>{bp.fontSize != null ? `${bp.fontSize} px` : 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="dlg-bp-side">
          <button onClick={() => openBreakpointEditor({ mode: 'add' })}>Add...</button>
          <button disabled={!selected} onClick={() => selected && openBreakpointEditor({ mode: 'edit', id: selected.id })}>
            Edit...
          </button>
          <button disabled={!selected} onClick={() => selected && openBreakpointEditor({ mode: 'copy', id: selected.id })}>
            Copy...
          </button>
          <button disabled={!selected} onClick={onRemove}>
            Remove
          </button>
          <button disabled={sortedBreakpoints.length === 0} onClick={onRemoveAll}>
            Remove All
          </button>
          <button
            disabled={!selected || selectedIndex <= 0}
            onClick={() => selected && moveBreakpoint(selected.id, -1)}
          >
            Move Up
          </button>
          <button
            disabled={!selected || selectedIndex < 0 || selectedIndex >= sortedBreakpoints.length - 1}
            onClick={() => selected && moveBreakpoint(selected.id, 1)}
          >
            Move Down
          </button>
        </div>
      </div>

      <div className="dlg-bp-mode">
        <label>
          <input
            type="radio"
            name="bp-mode"
            checked={breakpointMode === 'smaller'}
            onChange={() => setBreakpointMode('smaller')}
          />
          Activate breakpoints when browser window is smaller than the device width
        </label>
        <label>
          <input
            type="radio"
            name="bp-mode"
            checked={breakpointMode === 'larger'}
            onChange={() => setBreakpointMode('larger')}
          />
          Activate breakpoints when browser window is larger than the device width
        </label>
      </div>

      <div className="dlg-bp-footer">
        <span className="dlg-bp-apply">Apply these breakpoints to other pages</span>
        <div className="dlg-actions">
          <button className="dlg-btn-primary" onClick={closeManageBreakpoints}>
            OK
          </button>
          <button onClick={closeManageBreakpoints}>Cancel</button>
          <button disabled>Help</button>
        </div>
      </div>
    </DialogShell>
  );
}

/* ---------- breakpoint editor (add / edit / copy) ---------- */

function BreakpointEditorDialog() {
  const editor = useProjectStore((s) => s.breakpointEditor);
  const closeBreakpointEditor = useProjectStore((s) => s.closeBreakpointEditor);
  const upsertBreakpoint = useProjectStore((s) => s.upsertBreakpoint);

  // Component only mounts while breakpointEditor is non-null, so mount-time
  // initializers capture the prefill values for edit/copy.
  const source: Breakpoint | null =
    editor && editor.mode !== 'add'
      ? useProjectStore.getState().project.breakpoints.find((b) => b.id === editor.id) ?? null
      : null;

  const [width, setWidth] = useState<string>(source ? String(source.maxWidth) : '480');
  const [orientation, setOrientation] = useState<'none' | 'portrait' | 'landscape'>(
    source?.orientation ?? 'none'
  );
  const [fontSize, setFontSize] = useState<string>(
    source?.fontSize != null ? String(source.fontSize) : ''
  );

  if (!editor) return null;

  const title =
    editor.mode === 'add' ? 'Add Breakpoint' : editor.mode === 'edit' ? 'Edit Breakpoint' : 'Copy Breakpoint';

  const onOk = async () => {
    const maxWidth = parseInt(width, 10);
    if (!Number.isInteger(maxWidth) || maxWidth < 100 || maxWidth > 4000) {
      await appAlert('Device width must be an integer between 100 and 4000.');
      return;
    }
    let fs: number | null = null;
    if (fontSize.trim() !== '') {
      const parsed = parseInt(fontSize, 10);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        await appAlert('Default font size must be a positive integer (or empty for none).');
        return;
      }
      fs = parsed;
    }
    upsertBreakpoint({
      id: editor.mode === 'edit' ? editor.id : undefined,
      maxWidth,
      orientation,
      fontSize: fs,
    });
    closeBreakpointEditor();
  };

  return (
    <DialogShell title={title} onClose={closeBreakpointEditor} width={320}>
      <div className="dlg-field">
        <label htmlFor="bp-width">Device width:</label>
        <div className="dlg-field-row">
          <input
            id="bp-width"
            type="number"
            list="bp-widths"
            min={100}
            max={4000}
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <datalist id="bp-widths">
            {COMMON_WIDTHS.map((w) => (
              <option key={w} value={w} />
            ))}
          </datalist>
          <span className="dlg-unit">px</span>
        </div>
      </div>
      <div className="dlg-field">
        <label htmlFor="bp-orientation">Orientation:</label>
        <div className="dlg-field-row">
          <select
            id="bp-orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as 'none' | 'portrait' | 'landscape')}
          >
            <option value="none">None</option>
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>
      </div>
      <div className="dlg-field">
        <label htmlFor="bp-fontsize">Default font size:</label>
        <div className="dlg-field-row">
          <input
            id="bp-fontsize"
            type="number"
            list="bp-fontsizes"
            placeholder="None"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          />
          <datalist id="bp-fontsizes">
            {FONT_SIZES.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
          <span className="dlg-unit">px</span>
        </div>
      </div>
      <div className="dlg-actions">
        <button className="dlg-btn-primary" onClick={onOk}>
          OK
        </button>
        <button onClick={closeBreakpointEditor}>Cancel</button>
      </div>
    </DialogShell>
  );
}

export default function BreakpointDialogs() {
  const manageOpen = useProjectStore((s) => s.manageBreakpointsOpen);
  const editor = useProjectStore((s) => s.breakpointEditor);
  return (
    <>
      {manageOpen && <ManageBreakpointsDialog />}
      {editor && <BreakpointEditorDialog key={`${editor.mode}:${editor.mode === 'add' ? '' : editor.id}`} />}
    </>
  );
}
