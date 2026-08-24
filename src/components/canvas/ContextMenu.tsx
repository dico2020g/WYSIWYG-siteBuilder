import { useEffect, useRef, useState } from 'react';
import { useProjectStore, useCurrentPage } from '../../store/projectStore';
import { COMPONENT_MAP } from '../../model/componentDefs';
import { resolveComponentHidden, responsiveBaseWidth } from '../../model/responsive';
import { appAlert } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';
import { AppIcon } from '../icons/AppIcon';

const MENU_WIDTH = 230;
const SUBMENU_WIDTH = 210;

interface MenuItem {
  /** AppIcon name */
  icon?: string;
  label: string;
  shortcut?: string;
  disabled?: boolean;
  /** key into the submenus map — renders ▸ and a flyout on hover */
  submenu?: string;
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
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Clamp to window edges once mounted (we know the rendered height then).
  useEffect(() => {
    if (!menu) {
      setPos(null);
      setOpenSub(null);
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

  // The full active selection when the clicked component is part of it.
  const selIds: string[] = id && st().selectedIds.includes(id) ? st().selectedIds : id ? [id] : [];
  const selComps = page.components.filter((c) => selIds.includes(c.id));
  const multi = selIds.length > 1;

  const run = (fn: () => void) => () => {
    fn();
    st().closeContextMenu();
  };

  const activeBp = breakpoints.find((b) => b.id === activeBreakpointId) ?? null;
  const artboardWidth = activeBp ? activeBp.maxWidth : responsiveBaseWidth(page);

  const centerSel = (axis: 'h' | 'v' | 'both') =>
    run(() => selIds.forEach((cid) => st().centerInPage(cid, axis, artboardWidth, page.height)));

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

  const doSaveBlock = run(() => {
    void (async () => {
      const name = await appPrompt('Block name:', 'My Block');
      if (name !== null) st().saveSelectionAsBlock(name);
    })();
  });

  const doEasyBreakpoint = run(() => st().openBreakpointEditor({ mode: 'add' }));

  const allHidden = selComps.length > 0 && selComps.every((c) => c.hidden);
  const allHiddenInActiveBreakpoint =
    !!activeBreakpointId &&
    selComps.length > 0 &&
    selComps.every((c) => resolveComponentHidden(c, breakpoints, activeBreakpointId));
  const allLocked = selComps.length > 0 && selComps.every((c) => c.locked);
  const allProtected = selComps.length > 0 && selComps.every((c) => c.props?.protected);
  const allFlex = selComps.length > 0 && selComps.every((c) => c.props?.display === 'flex');
  const canUngroup = selComps.some((c) => c.props?.groupId);
  const canSplit = selComps.some((c) => Array.isArray(c.props?.mergedItems));

  const submenus: Record<string, MenuItem[]> = {
    select: [
      {
        icon: 'selectAll',
        label: 'Select All',
        shortcut: 'Ctrl+A',
        disabled: page.components.length === 0,
        onClick: run(() => st().selectComponents(page.components.map((c) => c.id))),
      },
      { icon: 'generic', label: 'Select None', onClick: run(() => st().selectComponent(null)) },
      {
        icon: 'invertSelection',
        label: 'Invert Selection',
        disabled: page.components.length === 0,
        onClick: run(() =>
          st().selectComponents(page.components.filter((c) => !selIds.includes(c.id)).map((c) => c.id))
        ),
      },
    ],
    center: [
      { icon: 'centerPage', label: 'Horizontally', onClick: centerSel('h') },
      { icon: 'centerPage', label: 'Vertically', onClick: centerSel('v') },
      { icon: 'centerPage', label: 'Both', onClick: centerSel('both') },
      {
        icon: 'pageWidth',
        label: 'Make width same as page width',
        onClick: run(() => st().matchPageWidthSelection(artboardWidth)),
      },
    ],
  };

  let entries: MenuEntry[];
  if (!comp) {
    // Empty artboard: clipboard + page actions.
    entries = [
      { icon: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(false)) },
      { icon: 'pasteInPlace', label: 'Paste in Place', shortcut: 'Ctrl+Shift+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(true)) },
      'sep',
      { icon: 'code', label: 'Page HTML / Code...', onClick: doPageHtml },
      'sep',
      {
        icon: 'selectAll',
        label: 'Select All',
        shortcut: 'Ctrl+A',
        disabled: page.components.length === 0,
        onClick: run(() => st().selectComponents(page.components.map((c) => c.id))),
      },
    ];
  } else {
    entries = [
      { icon: 'cut', label: 'Cut', shortcut: 'Ctrl+X', onClick: run(() => st().cutComponent(id!)) },
      { icon: 'copy', label: 'Copy', shortcut: 'Ctrl+C', onClick: run(() => st().copyComponent(id!)) },
      { icon: 'paste', label: 'Paste', shortcut: 'Ctrl+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(false)) },
      { icon: 'pasteInPlace', label: 'Paste in Place', shortcut: 'Ctrl+Shift+V', disabled: !clipboard, onClick: run(() => st().pasteComponent(true)) },
      'sep',
      { icon: 'copyStyle', label: 'Copy Style', onClick: run(() => st().copyStyle(id!)) },
      { icon: 'pasteStyle', label: 'Paste Style', disabled: !styleClipboard, onClick: run(() => st().pasteStyle(id!)) },
      'sep',
      { icon: 'selectAll', label: 'Select', submenu: 'select' },
      { icon: 'easyBreakpoint', label: 'Easy Breakpoint…', onClick: doEasyBreakpoint },
      'sep',
      { icon: 'edit', label: 'Rename ID…', onClick: doRename },
      { icon: 'clone', label: 'Clone and Hide', shortcut: 'Ctrl+Shift+C', onClick: run(() => st().cloneComponent(id!, true)) },
      {
        icon: allHidden ? 'preview' : 'hide',
        label: allHidden ? 'Unhide' : 'Hide',
        shortcut: 'Ctrl+D',
        onClick: run(() => selIds.forEach((cid) => st().setHidden(cid, !allHidden))),
      },
      {
        icon: allHiddenInActiveBreakpoint ? 'preview' : 'easyBreakpoint',
        label: allHiddenInActiveBreakpoint ? 'Show in this Breakpoint' : 'Hide in this Breakpoint',
        disabled: !activeBreakpointId,
        onClick: run(() => {
          if (!activeBreakpointId) return;
          selIds.forEach((cid) => st().setHiddenIn(cid, activeBreakpointId, !allHiddenInActiveBreakpoint));
        }),
      },
      {
        icon: allLocked ? 'unlockAll' : 'lock',
        label: allLocked ? 'Unlock' : 'Lock',
        shortcut: 'Ctrl+L',
        onClick: run(() => st().lockSelection()),
      },
      {
        icon: 'protected',
        label: allProtected ? 'Unprotect Content' : 'Protect Content',
        onClick: run(() => st().toggleProtectedSelection()),
      },
      'sep',
      { icon: 'group', label: 'Group', disabled: selIds.length < 2, onClick: run(() => st().groupSelection()) },
      { icon: 'ungroup', label: 'Ungroup', disabled: !canUngroup, onClick: run(() => st().ungroupSelection()) },
      { icon: 'merge', label: 'Merge Objects', disabled: selIds.length < 2, onClick: run(() => st().mergeSelection()) },
      { icon: 'split', label: 'Split Merged Object', disabled: !canSplit, onClick: run(() => st().splitSelection()) },
      'sep',
      { icon: 'flexbox', label: allFlex ? 'Remove Flexbox' : 'Flexbox', onClick: run(() => st().toggleFlexboxSelection()) },
      { icon: 'margin', label: 'Margin…', onClick: run(() => st().openBoxDialog('margin')) },
      { icon: 'padding', label: 'Padding…', onClick: run(() => st().openBoxDialog('padding')) },
      'sep',
      { icon: 'bringFront', label: 'Move to Front', onClick: run(() => st().arrangeSelection('front')) },
      { icon: 'bringForward', label: 'Move Forward', onClick: run(() => st().arrangeSelection('forward')) },
      { icon: 'sendBackward', label: 'Move Back', onClick: run(() => st().arrangeSelection('backward')) },
      { icon: 'sendBack', label: 'Move to Back', onClick: run(() => st().arrangeSelection('back')) },
      { icon: 'centerPage', label: 'Center in Page', submenu: 'center' },
      { icon: 'restoreSize', label: 'Restore Original Size', disabled: multi, onClick: doRestoreSize },
      'sep',
      { icon: 'code', label: 'Object HTML...', shortcut: 'Ctrl+H', onClick: doObjectHtml },
      { icon: 'animations', label: 'Object Animations...', onClick: doObjectAnimation },
      { icon: 'code', label: 'Page HTML / Code...', onClick: doPageHtml },
      'sep',
      { icon: 'saveBlock', label: 'Save As Block…', onClick: doSaveBlock },
      'sep',
      { icon: 'delete', label: multi ? `Delete ${selIds.length} Objects` : 'Delete', shortcut: 'Delete', onClick: run(() => st().deleteSelection()) },
      'sep',
      { icon: 'options', label: 'Object Properties…', shortcut: 'Alt+Enter', onClick: doProperties },
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
        const sub = entry.submenu ? submenus[entry.submenu] : null;
        const subOpen = sub != null && openSub === entry.submenu;
        return (
          <div
            key={i}
            className={cls + (subOpen ? ' hover' : '')}
            onClick={entry.disabled || sub ? undefined : entry.onClick}
            onMouseEnter={() => setOpenSub(entry.submenu ?? null)}
          >
            <span className="cm-icon">{entry.icon ? <AppIcon name={entry.icon} size={13} /> : ''}</span>
            <span className="cm-label">{entry.label}</span>
            {entry.shortcut && <span className="cm-shortcut">{entry.shortcut}</span>}
            {sub && <span className="cm-arrow">▸</span>}
            {sub && subOpen && (
              <div
                className="context-submenu"
                style={{ width: SUBMENU_WIDTH, ...(subFlip ? { right: MENU_WIDTH } : { left: MENU_WIDTH }) }}
              >
                {sub.map((item, j) => (
                  <div
                    key={j}
                    className={'cm-item' + (item.disabled ? ' disabled' : '')}
                    onClick={item.disabled ? undefined : item.onClick}
                  >
                    <span className="cm-icon">{item.icon ? <AppIcon name={item.icon} size={13} /> : ''}</span>
                    <span className="cm-label">{item.label}</span>
                    {item.shortcut && <span className="cm-shortcut">{item.shortcut}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
