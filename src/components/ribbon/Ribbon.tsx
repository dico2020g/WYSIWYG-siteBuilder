import { useState, type ReactNode } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS, toolboxGroup } from '../../model/componentDefs';
import { useProjectStore } from '../../store/projectStore';
import { openProject, saveProject, exportProject, previewProject } from '../../actions/fileActions';
import { appConfirm } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';

type RibbonTab = 'File' | 'Home' | 'Insert' | 'Page' | 'Database' | 'View' | 'Arrange' | 'Tools' | 'Help';

const TABS: RibbonTab[] = ['File', 'Home', 'Insert', 'Page', 'Database', 'View', 'Arrange', 'Tools', 'Help'];

interface RibbonButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

function RibbonButton({ icon, label, onClick, disabled, active }: RibbonButtonProps) {
  return (
    <button
      className={`ribbon-btn${active ? ' active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={label}
    >
      <span className="ribbon-btn-icon">{icon}</span>
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

export default function Ribbon() {
  const [activeTab, setActiveTab] = useState<RibbonTab>('Home');

  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const selectedId = useProjectStore((s) => s.selectedId);
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

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = async () => {
    const name = await appPrompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = async () => {
    if (await appConfirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
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
              <RibbonButton icon="✥" label="Move" disabled />
              <RibbonButton icon="⬚" label="Size" disabled />
              <RibbonButton icon="☰" label="Align" disabled />
            </RibbonGroup>
            <RibbonGroup caption="Arrange">
              <RibbonButton icon="⏫" label="Bring to Front" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'front')} />
              <RibbonButton icon="⏬" label="Send to Back" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'back')} />
              <RibbonButton icon="⧉" label="Group" disabled />
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

        {activeTab === 'Page' && (
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

        {activeTab === 'Database' && (
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

        {activeTab === 'Arrange' && (
          <RibbonGroup caption="Arrange">
            <RibbonButton icon="⏫" label="To Front" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'front')} />
            <RibbonButton icon="🔼" label="Forward" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'forward')} />
            <RibbonButton icon="🔽" label="Backward" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'backward')} />
            <RibbonButton icon="⏬" label="To Back" disabled={!selectedId} onClick={() => selectedId && arrange(selectedId, 'back')} />
          </RibbonGroup>
        )}

        {activeTab === 'Tools' && (
          <RibbonGroup caption="Tools">
            <RibbonButton icon="🔧" label="Options" disabled />
            <RibbonButton icon="✅" label="Spell Check" disabled />
          </RibbonGroup>
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
