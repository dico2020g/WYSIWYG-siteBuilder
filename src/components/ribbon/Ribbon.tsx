import { useEffect, useRef, useState, type ReactNode } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS, toolboxGroup } from '../../model/componentDefs';
import { useProjectStore } from '../../store/projectStore';
import { responsiveBaseWidth } from '../../model/responsive';
import { openProject, saveProject, exportProject, previewProject } from '../../actions/fileActions';
import { appConfirm } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';
import { AppIcon, ribbonIconName, toolboxIconName } from '../icons/AppIcon';

type RibbonTab = 'File' | 'Home' | 'Project' | 'Design' | 'Insert' | 'View' | 'Tools' | 'Window' | 'Help';

const TABS: RibbonTab[] = ['File', 'Home', 'Project', 'Design', 'Insert', 'View', 'Tools', 'Window', 'Help'];

interface RibbonButtonProps {
  icon: string;
  /** explicit icon name; when omitted it is derived from the label */
  iconName?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

function RibbonButton({ iconName, label, onClick, disabled, active }: RibbonButtonProps) {
  return (
    <button
      className={`ribbon-btn${active ? ' active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      <span className="ribbon-btn-icon">
        <AppIcon name={iconName ?? ribbonIconName(label)} size={36} />
      </span>
      <span className="ribbon-btn-label">{label}</span>
    </button>
  );
}

function RibbonGroup({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="ribbon-group">
      <div className="ribbon-group-buttons">{children}</div>
      <div className="ribbon-group-caption">{caption}</div>
    </div>
  );
}

/** Small icon-only buttons packed 3 per row (Align / Rotate groups). */
interface RibbonGridItem {
  iconName?: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

function RibbonGrid({ items }: { items: RibbonGridItem[] }) {
  return (
    <div className="ribbon-grid">
      {items.map((it) => (
        <button
          key={it.label}
          className={`ribbon-grid-btn${it.active ? ' active' : ''}`}
          title={it.label}
          disabled={it.disabled}
          onClick={it.onClick}
        >
          <AppIcon name={it.iconName ?? ribbonIconName(it.label)} size={20} />
        </button>
      ))}
    </div>
  );
}

/** Ribbon button with a dropdown menu (one-level flyout supported). */
export interface RibbonMenuItem {
  iconName?: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: RibbonMenuItem[];
}

function RibbonDropdown({ iconName, label, items, disabled }: {
  iconName?: string;
  label: string;
  items: RibbonMenuItem[];
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [flyout, setFlyout] = useState<number | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  // .ribbon-content clips overflow, so the menu is position:fixed at the button.
  const toggle = () => {
    if (!open && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      setMenuPos({ x: rect.left, y: rect.bottom + 2 });
    }
    setFlyout(null);
    setOpen(!open);
  };

  return (
    <div className="ribbon-dropdown" ref={rootRef}>
      <button
        className={`ribbon-btn${open ? ' active' : ''}`}
        onClick={toggle}
        disabled={disabled}
        title={label}
      >
        <span className="ribbon-btn-icon">
          <AppIcon name={iconName ?? ribbonIconName(label)} size={36} />
        </span>
        <span className="ribbon-btn-label">
          {label} <span className="ribbon-caret">▾</span>
        </span>
      </button>
      {open && !disabled && menuPos && (
        <div className="ribbon-menu" style={{ left: menuPos.x, top: menuPos.y }}>
          {items.map((item, i) => (
            <div
              key={i}
              className={`cm-item${item.disabled ? ' disabled' : ''}`}
              onMouseEnter={() => setFlyout(item.children ? i : null)}
              onClick={
                item.disabled || item.children
                  ? undefined
                  : () => {
                      setOpen(false);
                      item.onClick?.();
                    }
              }
            >
              <span className="cm-icon">{item.iconName ? <AppIcon name={item.iconName} size={14} /> : ''}</span>
              <span className="cm-label">{item.label}</span>
              {item.children && <span className="cm-arrow">▸</span>}
              {item.children && flyout === i && (
                <div className="context-submenu ribbon-submenu">
                  {item.children.map((sub, j) => (
                    <div
                      key={j}
                      className={`cm-item${sub.disabled ? ' disabled' : ''}`}
                      onClick={
                        sub.disabled
                          ? undefined
                          : () => {
                              setOpen(false);
                              sub.onClick?.();
                            }
                      }
                    >
                      <span className="cm-icon">{sub.iconName ? <AppIcon name={sub.iconName} size={14} /> : ''}</span>
                      <span className="cm-label">{sub.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Ribbon() {
  const [activeTab, setActiveTab] = useState<RibbonTab>('Home');

  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const selectedId = useProjectStore((s) => s.selectedId);
  const selectedIds = useProjectStore((s) => s.selectedIds);
  const zoom = useProjectStore((s) => s.zoom);
  const setZoom = useProjectStore((s) => s.setZoom);
  const snapToGrid = useProjectStore((s) => s.snapToGrid);
  const toggleSnap = useProjectStore((s) => s.toggleSnap);
  const currentPageId = useProjectStore((s) => s.currentPageId);
  const pages = useProjectStore((s) => s.project.pages);
  const newProject = useProjectStore((s) => s.newProject);
  const addPage = useProjectStore((s) => s.addPage);
  const renamePage = useProjectStore((s) => s.renamePage);
  const clonePage = useProjectStore((s) => s.clonePage);
  const deletePage = useProjectStore((s) => s.deletePage);
  const openManageBreakpoints = useProjectStore((s) => s.openManageBreakpoints);
  const openBreakpointEditor = useProjectStore((s) => s.openBreakpointEditor);
  const arrange = useProjectStore((s) => s.arrange);
  const clipboard = useProjectStore((s) => s.clipboard);
  const cutComponent = useProjectStore((s) => s.cutComponent);
  const copyComponent = useProjectStore((s) => s.copyComponent);
  const pasteComponent = useProjectStore((s) => s.pasteComponent);
  const openDatabase = useProjectStore((s) => s.openDatabase);
  const openConnections = useProjectStore((s) => s.openConnections);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const activeBreakpointId = useProjectStore((s) => s.activeBreakpointId);
  const setActiveBreakpoint = useProjectStore((s) => s.setActiveBreakpoint);
  const arrangeSelection = useProjectStore((s) => s.arrangeSelection);
  const alignSelection = useProjectStore((s) => s.alignSelection);
  const matchSizeSelection = useProjectStore((s) => s.matchSizeSelection);
  const distributeSelection = useProjectStore((s) => s.distributeSelection);
  const scaleSelection = useProjectStore((s) => s.scaleSelection);
  const rotateSelection = useProjectStore((s) => s.rotateSelection);
  const flipSelection = useProjectStore((s) => s.flipSelection);
  const matchPageWidthSelection = useProjectStore((s) => s.matchPageWidthSelection);
  const groupSelection = useProjectStore((s) => s.groupSelection);
  const ungroupSelection = useProjectStore((s) => s.ungroupSelection);
  const mergeSelection = useProjectStore((s) => s.mergeSelection);
  const splitSelection = useProjectStore((s) => s.splitSelection);
  const saveSelectionAsBlock = useProjectStore((s) => s.saveSelectionAsBlock);
  const lockSelection = useProjectStore((s) => s.lockSelection);
  const lockAll = useProjectStore((s) => s.lockAll);
  const unlockAll = useProjectStore((s) => s.unlockAll);
  const toggleProtectedSelection = useProjectStore((s) => s.toggleProtectedSelection);
  const toggleFlexboxSelection = useProjectStore((s) => s.toggleFlexboxSelection);
  const openBoxDialog = useProjectStore((s) => s.openBoxDialog);
  const centerInPage = useProjectStore((s) => s.centerInPage);

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = async () => {
    const name = await appPrompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = async () => {
    if (await appConfirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
  };

  // ---- selection-derived state for the Home tab ----
  const selIds = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
  const selCount = selIds.length;
  const selComponents = currentPage.components.filter((c) => selIds.includes(c.id));
  const hasSel = selCount > 0;
  const canDistribute = selCount >= 3;
  const canGroup = selCount >= 2;
  const canUngroup = selComponents.some((c) => c.props?.groupId);
  const canSplit = selComponents.some((c) => Array.isArray(c.props?.mergedItems));
  const allProtected = hasSel && selComponents.every((c) => c.props?.protected);
  const allFlex = hasSel && selComponents.every((c) => c.props?.display === 'flex');
  const allHidden = hasSel && selComponents.every((c) => c.hidden);

  const activeBp = breakpoints.find((b) => b.id === activeBreakpointId) ?? null;
  const artboardWidth = activeBp ? activeBp.maxWidth : responsiveBaseWidth(currentPage);
  const centerSel = (axis: 'h' | 'v' | 'both') =>
    selIds.forEach((id) => centerInPage(id, axis, artboardWidth, currentPage.height));

  const doScale = () => {
    void (async () => {
      const input = await appPrompt('Scale selection (%):', '100');
      if (input === null) return;
      const pct = Number(input);
      if (Number.isFinite(pct) && pct > 0) scaleSelection(pct);
    })();
  };

  const doRotate = () => {
    void (async () => {
      const input = await appPrompt('Rotate by (degrees):', '90');
      if (input === null) return;
      const deg = Number(input);
      if (Number.isFinite(deg) && deg !== 0) rotateSelection(deg);
    })();
  };

  const doSaveBlock = () => {
    void (async () => {
      const name = await appPrompt('Block name:', 'My Block');
      if (name !== null) saveSelectionAsBlock(name);
    })();
  };

  return (
    <div className="ribbon">
      <div className="ribbon-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`ribbon-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="ribbon-content">
        {activeTab === 'File' && (
          <RibbonGroup caption="File">
            <RibbonButton icon="📄" label="New" onClick={newProject} />
            <RibbonButton icon="📂" label="Open" onClick={() => void openProject()} />
            <RibbonButton icon="💾" label="Save" onClick={() => void saveProject(false)} />
            <RibbonButton icon="💾" label="Save All" onClick={() => void saveProject(false)} />
            <RibbonButton icon="❌" label="Close" onClick={newProject} />
          </RibbonGroup>
        )}

        {activeTab === 'Home' && (
          <>
            <RibbonGroup caption="File">
              <RibbonButton icon="📄" label="New" onClick={newProject} />
              <RibbonButton icon="📂" label="Open" onClick={() => void openProject()} />
              <RibbonButton icon="💾" label="Save" onClick={() => void saveProject(false)} />
              <RibbonButton icon="💾" label="Save All" onClick={() => void saveProject(false)} />
              <RibbonButton icon="❌" label="Close" onClick={newProject} />
            </RibbonGroup>
            <RibbonGroup caption="Clipboard">
              <RibbonButton icon="✂" label="Cut" disabled={!selectedId} onClick={() => selectedId && cutComponent(selectedId)} />
              <RibbonButton icon="⧉" label="Copy" disabled={!selectedId} onClick={() => selectedId && copyComponent(selectedId)} />
              <RibbonButton icon="📋" label="Paste" disabled={!clipboard} onClick={() => pasteComponent(false)} />
            </RibbonGroup>
            <RibbonGroup caption="Edit">
              <RibbonButton icon="↶" label="Undo" disabled />
              <RibbonButton icon="↷" label="Redo" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Tools">
              <RibbonButton icon="➤" label="Select" active={tool === 'pointer'} onClick={() => setTool('pointer')} />
            </RibbonGroup>
            <RibbonGroup caption="Arrange">
              <RibbonButton icon="⏫" label="Move to Front" disabled={!hasSel} onClick={() => arrangeSelection('front')} />
              <RibbonButton icon="⏬" label="Move to Back" disabled={!hasSel} onClick={() => arrangeSelection('back')} />
              <RibbonButton icon="🔼" label="Move Forward" disabled={!hasSel} onClick={() => arrangeSelection('forward')} />
              <RibbonButton icon="🔽" label="Move Back" disabled={!hasSel} onClick={() => arrangeSelection('backward')} />
            </RibbonGroup>
            <RibbonGroup caption="Align">
              <RibbonGrid
                items={[
                  { label: 'Left', disabled: !hasSel, onClick: () => alignSelection('left', artboardWidth, currentPage.height) },
                  { label: 'Center', disabled: !hasSel, onClick: () => alignSelection('centerH', artboardWidth, currentPage.height) },
                  { label: 'Right', disabled: !hasSel, onClick: () => alignSelection('right', artboardWidth, currentPage.height) },
                  { label: 'Top', disabled: !hasSel, onClick: () => alignSelection('top', artboardWidth, currentPage.height) },
                  { label: 'Middle', disabled: !hasSel, onClick: () => alignSelection('middleV', artboardWidth, currentPage.height) },
                  { label: 'Bottom', disabled: !hasSel, onClick: () => alignSelection('bottom', artboardWidth, currentPage.height) },
                  { label: 'Width', disabled: selCount < 2, onClick: () => matchSizeSelection('width') },
                  { label: 'Height', disabled: selCount < 2, onClick: () => matchSizeSelection('height') },
                  { label: 'Match Size', disabled: selCount < 2, onClick: () => matchSizeSelection('both') },
                ]}
              />
              <RibbonButton icon="⤢" label="Scale" disabled={!hasSel} onClick={doScale} />
              <RibbonDropdown
                iconName="distributeH"
                label="Distribute"
                disabled={!hasSel}
                items={[
                  { iconName: 'distributeH', label: 'Horizontally', disabled: !canDistribute, onClick: () => distributeSelection('h') },
                  { iconName: 'distributeV', label: 'Vertically', disabled: !canDistribute, onClick: () => distributeSelection('v') },
                  {
                    iconName: 'centerPage',
                    label: 'Center in Page',
                    children: [
                      { iconName: 'centerPage', label: 'Center in Page (Horizontally)', onClick: () => centerSel('h') },
                      { iconName: 'centerPage', label: 'Center in Page (Vertically)', onClick: () => centerSel('v') },
                      { iconName: 'centerPage', label: 'Both', onClick: () => centerSel('both') },
                      { iconName: 'pageWidth', label: 'Make width same as page width', onClick: () => matchPageWidthSelection(artboardWidth) },
                    ],
                  },
                ]}
              />
            </RibbonGroup>
            <RibbonGroup caption="Rotate">
              <RibbonGrid
                items={[
                  { label: 'Rotate…', iconName: 'rotate', disabled: !hasSel, onClick: doRotate },
                  { label: 'Rotate Left 90°', disabled: !hasSel, onClick: () => rotateSelection(-90) },
                  { label: 'Rotate Right 90°', disabled: !hasSel, onClick: () => rotateSelection(90) },
                  { label: 'Flip Horizontal', disabled: !hasSel, onClick: () => flipSelection('h') },
                  { label: 'Flip Vertical', disabled: !hasSel, onClick: () => flipSelection('v') },
                ]}
              />
            </RibbonGroup>
            <RibbonGroup caption="Group/Merge">
              <RibbonDropdown
                iconName="group"
                label="Group"
                disabled={!hasSel}
                items={[
                  { iconName: 'group', label: 'Group', disabled: !canGroup, onClick: groupSelection },
                  { iconName: 'ungroup', label: 'Ungroup', disabled: !canUngroup, onClick: ungroupSelection },
                  { iconName: 'merge', label: 'Merge', disabled: !canGroup, onClick: mergeSelection },
                  { iconName: 'split', label: 'Split', disabled: !canSplit, onClick: splitSelection },
                ]}
              />
              <RibbonButton icon="🧱" label="Save as Block" disabled={!hasSel} onClick={doSaveBlock} />
            </RibbonGroup>
            <RibbonGroup caption="Lock">
              <RibbonButton icon="🔒" label="Lock" disabled={!hasSel} onClick={lockSelection} />
              <RibbonButton icon="🔒" label="Lock All" disabled={currentPage.components.length === 0} onClick={lockAll} />
              <RibbonButton icon="🔓" label="Unlock All" disabled={currentPage.components.length === 0} onClick={unlockAll} />
            </RibbonGroup>
            <RibbonGroup caption="Visibility">
              <RibbonButton icon="🚫" label="Hide" active={allHidden} disabled={!hasSel} onClick={() => selIds.forEach((id) => useProjectStore.getState().setHidden(id, !allHidden))} />
              <RibbonButton icon="🛡" label="Protected Content" active={allProtected} disabled={!hasSel} onClick={toggleProtectedSelection} />
            </RibbonGroup>
            <RibbonGroup caption="Box">
              <RibbonButton icon="▦" label="Flexbox" active={allFlex} disabled={!hasSel} onClick={toggleFlexboxSelection} />
              <RibbonButton icon="↔" label="Margin" disabled={!hasSel} onClick={() => openBoxDialog('margin')} />
              <RibbonButton icon="↕" label="Padding" disabled={!hasSel} onClick={() => openBoxDialog('padding')} />
            </RibbonGroup>
            <RibbonGroup caption="Publish">
              <RibbonButton icon="🔍" label="Preview" onClick={() => void previewProject()} />
              <RibbonButton icon="🌐" label="Publish" onClick={() => void exportProject()} />
            </RibbonGroup>
            <RibbonGroup caption="Responsive">
              <label className="ribbon-field">
                <span className="ribbon-field-label">Responsive ▾</span>
                <select
                  className="ribbon-select"
                  value={activeBreakpointId ?? ''}
                  onChange={(e) => setActiveBreakpoint(e.target.value || null)}
                >
                  <option value="">Desktop</option>
                  {breakpoints.map((b) => (
                    <option key={b.id} value={b.id}>{b.maxWidth}px</option>
                  ))}
                </select>
              </label>
            </RibbonGroup>
            <RibbonGroup caption="Grid">
              <RibbonButton
                icon={snapToGrid ? '☑' : '☐'}
                label="Snap to Grid"
                active={snapToGrid}
                onClick={toggleSnap}
              />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Insert' && (
          <>
            <RibbonGroup caption="Tools">
              <RibbonButton icon="➤" label="Select" active={tool === 'pointer'} onClick={() => setTool('pointer')} />
            </RibbonGroup>
            {TOOLBOX_GROUPS.map((group) => {
              const defs = COMPONENT_DEFS.filter((d) => toolboxGroup(d) === group);
              if (defs.length === 0) return null;
              return (
                <RibbonGroup key={group} caption={group}>
                  {defs.map((def) => (
                    <RibbonButton
                      key={def.type}
                      icon={def.icon}
                      iconName={toolboxIconName(def.type, def.label)}
                      label={def.label}
                      active={tool === def.type}
                      onClick={() => setTool(def.type)}
                    />
                  ))}
                </RibbonGroup>
              );
            })}
          </>
        )}

        {activeTab === 'Project' && (
          <>
            <RibbonGroup caption="Page">
              <RibbonButton icon="📄" label="New Page" onClick={addPage} />
              <RibbonButton icon="✎" label="Rename" onClick={renameCurrentPage} />
              <RibbonButton icon="⧉" label="Clone" onClick={() => clonePage(currentPageId)} />
              <RibbonButton icon="🗑" label="Delete" onClick={deleteCurrentPage} />
            </RibbonGroup>
            <RibbonGroup caption="Breakpoints">
              <RibbonButton icon="➕" label="Add" onClick={() => openBreakpointEditor({ mode: 'add' })} />
              <RibbonButton icon="⚙" label="Manage" onClick={openManageBreakpoints} />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Design' && (
          <>
            <RibbonGroup caption="Appearance">
              <RibbonButton icon="◫" label="Themes" disabled />
              <RibbonButton icon="◌" label="Color Scheme" disabled />
              <RibbonButton icon="A" label="Fonts" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Page">
              <RibbonButton icon="▣" label="Page Properties" disabled />
              <RibbonButton icon="▦" label="Layout" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Responsive">
              <RibbonButton icon="+" label="Add Breakpoint" onClick={() => openBreakpointEditor({ mode: 'add' })} />
              <RibbonButton icon="⚙" label="Manage Breakpoints" onClick={openManageBreakpoints} />
            </RibbonGroup>
            <RibbonGroup caption="Arrange">
              <RibbonButton icon="⏫" label="To Front" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'front')} />
              <RibbonButton icon="▲" label="Forward" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'forward')} />
              <RibbonButton icon="▼" label="Backward" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'backward')} />
              <RibbonButton icon="⏬" label="To Back" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'back')} />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Tools' && (
          <>
            <RibbonGroup caption="Connection">
              <RibbonButton icon="🔌" label="Connection" onClick={openConnections} />
              <RibbonButton icon="📄+" label="New Query" onClick={() => openDatabase('query')} />
            </RibbonGroup>
            <RibbonGroup caption="Objects">
              <RibbonButton icon="▦" label="Table" onClick={() => openDatabase('table')} />
              <RibbonButton icon="👁" label="View" onClick={() => openDatabase('view')} />
              <RibbonButton icon="▧" label="Materialized View" onClick={() => openDatabase('matview')} />
              <RibbonButton icon="ƒ(x)" label="Function" onClick={() => openDatabase('function')} />
            </RibbonGroup>
            <RibbonGroup caption="Tools">
              <RibbonButton icon="🔍" label="Query" onClick={() => openDatabase('query')} />
              <RibbonButton icon="🧩" label="Model" onClick={() => openDatabase('table')} />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'View' && (
          <>
            <RibbonGroup caption="Grid">
              <RibbonButton
                icon={snapToGrid ? '☑' : '☐'}
                label="Snap to Grid"
                active={snapToGrid}
                onClick={toggleSnap}
              />
            </RibbonGroup>
            <RibbonGroup caption="Zoom">
              <RibbonButton icon="🔍+" label="Zoom In" onClick={() => setZoom(zoom + 0.25)} disabled={zoom >= 2} />
              <RibbonButton icon="🔍−" label="Zoom Out" onClick={() => setZoom(zoom - 0.25)} disabled={zoom <= 0.25} />
              <RibbonButton icon="1:1" label="100%" onClick={() => setZoom(1)} active={zoom === 1} />
              <span className="ribbon-zoom-label">{Math.round(zoom * 100)}%</span>
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Window' && (
          <>
            <RibbonGroup caption="Panels">
              <RibbonButton icon="☑" label="Toolbox" disabled />
              <RibbonButton icon="☑" label="Project Explorer" disabled />
              <RibbonButton icon="☑" label="Properties" disabled />
              <RibbonButton icon="☐" label="Output" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Windows">
              <RibbonButton icon="▤" label="Cascade" disabled />
              <RibbonButton icon="▥" label="Tile Horizontal" disabled />
              <RibbonButton icon="▧" label="Tile Vertical" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Arrange">
              <RibbonButton icon="↻" label="Reset Layout" disabled />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Help' && (
          <RibbonGroup caption="Help">
            <RibbonButton icon="❓" label="Help" disabled />
            <RibbonButton icon="ℹ" label="About" disabled />
          </RibbonGroup>
        )}
      </div>
    </div>
  );
}
