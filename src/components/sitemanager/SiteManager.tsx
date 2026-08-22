import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { appConfirm } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';

const STATIC_FOLDERS: { name: string; files: { icon: string; name: string }[] }[] = [
  {
    name: 'Templates',
    files: [
      { icon: '📄', name: 'Main.wdt' },
      { icon: '📄', name: 'Header.wdt' },
      { icon: '📄', name: 'Footer.wdt' },
    ],
  },
  {
    name: 'Styles',
    files: [
      { icon: '🎨', name: 'main.css' },
      { icon: '🎨', name: 'theme.css' },
    ],
  },
  { name: 'Scripts', files: [{ icon: '📜', name: 'main.js' }] },
  {
    name: 'Images',
    files: [
      { icon: '🖼', name: 'logo.png' },
      { icon: '🖼', name: 'banner.jpg' },
    ],
  },
  { name: 'Data', files: [] },
];

export default function SiteManager() {
  const projectName = useProjectStore((s) => s.project.name);
  const pages = useProjectStore((s) => s.project.pages);
  const currentPageId = useProjectStore((s) => s.currentPageId);
  const selectPage = useProjectStore((s) => s.selectPage);
  const addPage = useProjectStore((s) => s.addPage);
  const renamePage = useProjectStore((s) => s.renamePage);
  const clonePage = useProjectStore((s) => s.clonePage);
  const deletePage = useProjectStore((s) => s.deletePage);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = async () => {
    const name = await appPrompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = async () => {
    if (await appConfirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
  };

  return (
    <div className="panel site-manager-panel">
      <div className="panel-header">Project Explorer</div>
      <div className="site-toolbar">
        <button title="Add page" onClick={addPage}>➕</button>
        <button title="Rename page" onClick={renameCurrentPage}>✎</button>
        <button title="Clone page" onClick={() => clonePage(currentPageId)}>⧉</button>
        <button title="Delete page" disabled={pages.length <= 1} onClick={deleteCurrentPage}>🗑</button>
      </div>
      <div className="panel-body">
        <div className="site-tree">
          <div className="tree-node tree-root" onClick={() => toggle('__root')}>
            <span className={`collapse-arrow${collapsed.__root ? ' collapsed' : ''}`}>⌄</span>
            <span className="item-icon">📁</span>
            <span className="item-label">{projectName}</span>
          </div>
          {!collapsed.__root && (
            <>
              {/* Pages — real pages */}
              <div className="tree-node tree-folder" onClick={() => toggle('Pages')}>
                <span className={`collapse-arrow${collapsed.Pages ? ' collapsed' : ''}`}>⌄</span>
                <span className="item-icon">📁</span>
                <span className="item-label">Pages</span>
              </div>
              {!collapsed.Pages &&
                pages.map((p) => (
                  <div
                    key={p.id}
                    className={`tree-node tree-page tree-leaf2${p.id === currentPageId ? ' active' : ''}`}
                    onClick={() => selectPage(p.id)}
                  >
                    <span className="item-icon">📄</span>
                    <span className="item-label">{p.name}</span>
                  </div>
                ))}
              {/* static asset folders (placeholders) */}
              {STATIC_FOLDERS.map((f) => (
                <div key={f.name}>
                  <div className="tree-node tree-folder" onClick={() => toggle(f.name)}>
                    <span className={`collapse-arrow${collapsed[f.name] ? ' collapsed' : ''}`}>⌄</span>
                    <span className="item-icon">📁</span>
                    <span className="item-label">{f.name}</span>
                  </div>
                  {!collapsed[f.name] &&
                    f.files.map((file) => (
                      <div key={file.name} className="tree-node tree-leaf2 tree-static">
                        <span className="item-icon">{file.icon}</span>
                        <span className="item-label">{file.name}</span>
                      </div>
                    ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
