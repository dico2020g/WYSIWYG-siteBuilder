import { useState, type ReactNode } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS } from '../../model/componentDefs';
import { useProjectStore } from '../../store/projectStore';
import { openProject, saveProject, exportProject, previewProject } from '../../actions/fileActions';

type RibbonTab = 'File' | 'Home' | 'Insert' | 'Page' | 'View' | 'Arrange' | 'Tools' | 'Help';

const TABS: RibbonTab[] = ['File', 'Home', 'Insert', 'Page', 'View', 'Arrange', 'Tools', 'Help'];

const noop = () => {};

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

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = () => {
    const name = prompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = () => {
    if (confirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
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
            <RibbonButton icon="💾" label="Save As" onClick={() => void saveProject(true)} />
            <RibbonButton icon="👁" label="Preview" onClick={() => void previewProject()} />
            <RibbonButton icon="🌐" label="Publish" onClick={() => void exportProject()} />
          </RibbonGroup>
        )}

        {activeTab === 'Home' && (
          <>
            <RibbonGroup caption="Clipboard">
              <RibbonButton icon="↶" label="Undo" disabled />
              <RibbonButton icon="↷" label="Redo" disabled />
              <RibbonButton icon="✂" label="Cut" disabled={!selectedId} onClick={() => selectedId && cutComponent(selectedId)} />
              <RibbonButton icon="⧉" label="Copy" disabled={!selectedId} onClick={() => selectedId && copyComponent(selectedId)} />
              <RibbonButton icon="📋" label="Paste" disabled={!clipboard} onClick={() => pasteComponent(false)} />
            </RibbonGroup>
            <RibbonGroup caption="Edit">
              <RibbonButton icon="⚙" label="Properties" onClick={noop} />
              <RibbonButton icon="</>" label="HTML" onClick={noop} />
            </RibbonGroup>
            <RibbonGroup caption="Publish">
              <RibbonButton icon="👁" label="Preview" onClick={() => void previewProject()} />
              <RibbonButton icon="🌐" label="Publish" onClick={() => void exportProject()} />
            </RibbonGroup>
          </>
        )}

        {activeTab === 'Insert' && (
          <>
            <RibbonGroup caption="Tools">
              <RibbonButton icon="➤" label="Select" active={tool === 'pointer'} onClick={() => setTool('pointer')} />
            </RibbonGroup>
            {TOOLBOX_GROUPS.map((group) => {
              const defs = COMPONENT_DEFS.filter((d) => d.group === group);
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
