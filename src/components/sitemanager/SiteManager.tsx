import { useProjectStore } from '../../store/projectStore';

export default function SiteManager() {
  const projectName = useProjectStore((s) => s.project.name);
  const pages = useProjectStore((s) => s.project.pages);
  const currentPageId = useProjectStore((s) => s.currentPageId);
  const selectPage = useProjectStore((s) => s.selectPage);
  const addPage = useProjectStore((s) => s.addPage);
  const renamePage = useProjectStore((s) => s.renamePage);
  const clonePage = useProjectStore((s) => s.clonePage);
  const deletePage = useProjectStore((s) => s.deletePage);

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = () => {
    const name = prompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = () => {
    if (confirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
  };

  return (
    <div className="panel site-manager-panel">
      <div className="panel-header">Site Manager</div>
      <div className="site-toolbar">
        <button title="Add page" onClick={addPage}>➕</button>
        <button title="Rename page" onClick={renameCurrentPage}>✎</button>
        <button title="Clone page" onClick={() => clonePage(currentPageId)}>⧉</button>
        <button title="Delete page" disabled={pages.length <= 1} onClick={deleteCurrentPage}>🗑</button>
      </div>
      <div className="panel-body">
        <div className="site-tree">
          <div className="tree-node tree-root">
            <span className="item-icon">🏠</span>
            <span className="item-label">{projectName}</span>
          </div>
          {pages.map((p) => (
            <div
              key={p.id}
              className={`tree-node tree-page${p.id === currentPageId ? ' active' : ''}`}
              onClick={() => selectPage(p.id)}
            >
              <span className="item-icon">📄</span>
              <span className="item-label">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
