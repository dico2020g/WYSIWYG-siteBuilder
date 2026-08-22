import { useEffect, useRef, useState } from 'react';
import { useProjectStore, useCurrentPage } from '../../store/projectStore';
import { COMPONENT_MAP } from '../../model/componentDefs';
import { appAlert } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';

const MENU_WIDTH = 230;
const SUBMENU_WIDTH = 150;

interface MenuItem {
  icon?: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  arrow?: boolean; // show ▸ (submenu indicator)
  submenu?: 'center';
  onClick?: () => void;
}

type MenuEntry = MenuItem | 'sep';

/** Right-click context menu for the canvas (component + empty artboard variants). */
export default function ContextMenu() {
  const menu = useProjectStore((s) => s.contextMenu);
  const clipboard = useProjectStore((s) => s.clipboard);
  const styleClipboard = useProjectStore((s) => s.styleClipboard);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const activeBreakpointId = useProjectStore((s) => s.activeBreakpointId);
  const page = useCurrentPage();

  const rootRef = useRef<HTMLDivElement>(null);
  const [centerSubOpen, setCenterSubOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Clamp to window edges once mounted (we know the rendered height then).
  useEffect(() => {
    if (!menu) {
      setPos(null);
      setCenterSubOpen(false);
      return;
    }
    const el = rootRef.current;
    const h = el ? el.offsetHeight : 400;
    const w = MENU_WIDTH;
    setPos({
      x: Math.max(0, Math.min(menu.x, window.innerWidth - w - 4)),
      y: Math.max(0, Math.min(menu.y, window.innerHeight - h - 4)),
    });
  }, [menu]);

  // Close on click elsewhere / Esc.
  useEffect(() => {
    if (!menu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        useProjectStore.getState().closeContextMenu();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') useProjectStore.getState().closeContextMenu();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [menu]);

  if (!menu) return null;

  const st = useProjectStore.getState;
  const id = menu.componentId;
  const comp = id ? page.components.find((c) => c.id === id) : null;

  const run = (fn: () => void) => () => {
    fn();
    st().closeContextMenu();
  };

  const activeBp = breakpoints.find((b) => b.id === activeBreakpointId) ?? null;
  const artboardWidth = activeBp ? activeBp.maxWidth : page.width;

  const doCenter = (axis: 'h' | 'v' | 'both') =>
    run(() => id && st().centerInPage(id, axis, artboardWidth, page.height));

  const doRename = run(() => {
    if (!id || !comp) return;
    void (async () => {
      const input = await appPrompt('New ID:', comp.id);
      if (input === null) return;
      if (!st().renameComponentId(id, input)) {
        await appAlert('Invalid ID. Must be unique on the page and match [A-Za-z][\\w-]*.');
      }
    })();
  });

  const doProperties = run(() => {
    if (!id) return;
    st().selectComponent(id);
    window.dispatchEvent(new CustomEvent('sitebuilder:focus-properties'));
  });

  const doObjectHtml = run(() => {
    if (!id) return;
    st().selectComponent(id);
    st().openCodeDialog({ kind: 'object-html', componentId: id });
  });

  const doObjectAnimation = run(() => {
    if (!id) return;
    st().selectComponent(id);
    st().openCodeDialog({ kind: 'object-animation', componentId: id });
  });

  const doPageHtml = run(() => {
    st().openCodeDialog({ kind: 'page-html' });
  });

  const doRestoreSize = run(() => {
    if (!id || !comp) return;
    const def = COMPONENT_MAP[comp.type];
    if (def) st().setGeometry(id, { width: def.defaultSize.width, height: def.defaultSize.height });
  });

  let entries: MenuEntry[];
  if (!comp) {
    // Empty artboard: clipboard actions only.
    entries = [
      { icon: '📋', label: 'Paste', shortcut: 'Ctrl+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(false)) },
      { icon: '📌', label: 'Paste in Place', shortcut: 'Ctrl+Shift+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(true)) },
      'sep',
      { icon: '</>', label: 'Page HTML / Code...', onClick: doPageHtml },
      'sep',
      { icon: '⬚', label: 'Select All', shortcut: 'Ctrl+A', disabled: true },
    ];
  } else {
    entries = [
      { icon: '✂', label: 'Cut', shortcut: 'Ctrl+X', onClick: run(() => st().cutComponent(id!)) },
      { icon: '⧉', label: 'Copy', shortcut: 'Ctrl+C', onClick: run(() => st().copyComponent(id!)) },
      { icon: '📋', label: 'Paste', shortcut: 'Ctrl+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(false)) },
      { icon: '📌', label: 'Paste in Place', shortcut: 'Ctrl+Shift+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(true)) },
      'sep',
      { icon: '🎨', label: 'Copy Style', onClick: run(() => st().copyStyle(id!)) },
      { icon: '🖌', label: 'Paste Style', disabled: !styleClipboard, onClick: run(() => st().pasteStyle(id!)) },
      'sep',
      { icon: '📱', label: 'Easy Breakpoint…', disabled: true },
      { icon: '⬚', label: 'Select', arrow: true, disabled: true },
      { icon: '⬚', label: 'Select All', shortcut: 'Ctrl+A', disabled: true },
      'sep',
      { icon: '✎', label: 'Rename ID…', onClick: doRename },
      { icon: '👯', label: 'Clone and Hide', shortcut: 'Ctrl+Shift+C', onClick: run(() => st().cloneComponent(id!, true)) },
      { icon: comp.hidden ? '👁' : '🚫', label: comp.hidden ? 'Unhide' : 'Hide', shortcut: 'Ctrl+D', onClick: run(() => st().toggleHidden(id!)) },
      {
        icon: '📱',
        label: 'Hide in other Breakpoints',
        disabled: breakpoints.length === 0,
        onClick: run(() => st().toggleHiddenInOtherBreakpoints(id!, activeBreakpointId)),
      },
      { icon: comp.locked ? '🔓' : '🔒', label: comp.locked ? 'Unlock' : 'Lock', shortcut: 'Ctrl+L', onClick: run(() => st().toggleLocked(id!)) },
      'sep',
      { icon: '🔗', label: 'Merge Objects', disabled: true },
      { icon: '▦', label: 'Flexbox…', disabled: true },
      { icon: '↔', label: 'Margin…', disabled: true },
      { icon: '↕', label: 'Padding…', disabled: true },
      'sep',
      { icon: '⏫', label: 'Move to Front', shortcut: 'Ctrl+Num +', onClick: run(() => st().arrange(id!, 'front')) },
      { icon: '🔼', label: 'Move Forward', onClick: run(() => st().arrange(id!, 'forward')) },
      { icon: '🔽', label: 'Move Back', onClick: run(() => st().arrange(id!, 'backward')) },
      { icon: '⏬', label: 'Move to Back', onClick: run(() => st().arrange(id!, 'back')) },
      { icon: '🎯', label: 'Center in Page', submenu: 'center', arrow: true },
      { icon: '↺', label: 'Restore Original Size', onClick: doRestoreSize },
      'sep',
      { icon: '</>', label: 'Object HTML...', shortcut: 'Ctrl+H', onClick: doObjectHtml },
      { icon: 'FX', label: 'Object Animations...', onClick: doObjectAnimation },
      { icon: '</>', label: 'Page HTML / Code...', onClick: doPageHtml },
      'sep',
      { icon: '🧱', label: 'Save As Block…', disabled: true },
      { icon: '🌙', label: 'Dark Color Scheme', arrow: true, disabled: true },
      { icon: '🎭', label: 'Use Theme', disabled: true },
      'sep',
      { icon: '🗑', label: 'Delete', shortcut: 'Delete', onClick: run(() => st().deleteComponent(id!)) },
      'sep',
      { icon: '⚙', label: 'Advanced', arrow: true, disabled: true },
      { icon: '🔧', label: 'Object Properties…', shortcut: 'Alt+Enter', onClick: doProperties },
    ];
  }

  const subFlip = pos ? pos.x + MENU_WIDTH + SUBMENU_WIDTH > window.innerWidth - 4 : false;

  return (
    <div
      ref={rootRef}
      className="context-menu"
      style={{ left: pos?.x ?? menu.x, top: pos?.y ?? menu.y, visibility: pos ? 'visible' : 'hidden' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {entries.map((entry, i) => {
        if (entry === 'sep') return <div key={i} className="cm-sep" />;
        const cls = 'cm-item' + (entry.disabled ? ' disabled' : '');
        const isCenter = entry.submenu === 'center';
        return (
          <div
            key={i}
            className={cls + (isCenter && centerSubOpen ? ' hover' : '')}
            onClick={entry.disabled || isCenter ? undefined : entry.onClick}
            onMouseEnter={() => setCenterSubOpen(isCenter)}
          >
            <span className="cm-icon">{entry.icon ?? ''}</span>
            <span className="cm-label">{entry.label}</span>
            {entry.shortcut && <span className="cm-shortcut">{entry.shortcut}</span>}
            {entry.arrow && <span className="cm-arrow">▸</span>}
            {isCenter && centerSubOpen && (
              <div className="context-submenu" style={subFlip ? { right: MENU_WIDTH } : { left: MENU_WIDTH }}>
                <div className="cm-item" onClick={doCenter('h')}>
                  <span className="cm-icon">↔</span>
                  <span className="cm-label">Horizontally</span>
                </div>
                <div className="cm-item" onClick={doCenter('v')}>
                  <span className="cm-icon">↕</span>
                  <span className="cm-label">Vertically</span>
                </div>
                <div className="cm-item" onClick={doCenter('both')}>
                  <span className="cm-icon">✛</span>
                  <span className="cm-label">Both</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
