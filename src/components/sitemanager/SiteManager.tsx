import { useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { appConfirm } from '../../actions/dialogs';
import { appPrompt } from '../../actions/promptDialog';
import { AppIcon } from '../icons/AppIcon';

const STATIC_FOLDERS: { name: string; files: { icon: string; name: string }[] }[] = [
  {
    name: 'Styles',
    files: [
      { icon: 'css', name: 'main.css' },
      { icon: 'css', name: 'theme.css' },
    ],
  },
  { name: 'Scripts', files: [{ icon: 'code', name: 'main.js' }] },
  {
    name: 'Images',
    files: [
      { icon: 'image', name: 'logo.png' },
      { icon: 'image', name: 'banner.jpg' },
    ],
  },
  { name: 'Data', files: [] },
];

function TreeCaret({ collapsed }: { collapsed: boolean }) {
  return <span className={`tree-caret${collapsed ? ' collapsed' : ''}`} aria-hidden="true" />;
}

function TreeIcon({ kind }: { kind: string }) {
  return (
    <span className={`tree-icon tree-icon-${kind}`} aria-hidden="true">
      <AppIcon name={kind} size={14} />
    </span>
  );
}

export default function SiteManager({ embedded = false }: { embedded?: boolean }) {
  const projectName = useProjectStore((s) => s.project.name);
  const pages = useProjectStore((s) => s.project.pages);
  const currentPageId = useProjectStore((s) => s.currentPageId);
  const selectPage = useProjectStore((s) => s.selectPage);
  const renamePage = useProjectStore((s) => s.renamePage);
  const clonePage = useProjectStore((s) => s.clonePage);
  const deletePage = useProjectStore((s) => s.deletePage);
  const templates = useProjectStore((s) => s.project.templates ?? []);
  const activeTemplateId = useProjectStore((s) => s.activeTemplateId);
  const addTemplate = useProjectStore((s) => s.addTemplate);
  const openTemplate = useProjectStore((s) => s.openTemplate);
  const renameTemplate = useProjectStore((s) => s.renameTemplate);
  const deleteTemplate = useProjectStore((s) => s.deleteTemplate);
  const openNewPageDialog = useProjectStore((s) => s.openNewPageDialog);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => ({
    Pages: true,
    ...Object.fromEntries(STATIC_FOLDERS.map((folder) => [folder.name, true])),
  }));
  const toggle = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const currentPage = pages.find((p) => p.id === currentPageId) ?? pages[0];

  const renameCurrentPage = async () => {
    const name = await appPrompt('New page name:', currentPage?.name ?? '');
    if (name && name.trim()) renamePage(currentPageId, name.trim());
  };

  const deleteCurrentPage = async () => {
    if (await appConfirm(`Delete page "${currentPage?.name ?? ''}"?`)) deletePage(currentPageId);
  };

  const createTemplate = async () => {
    const name = await appPrompt('New template name:', 'Template.wdt');
    if (name?.trim()) addTemplate(name.trim());
  };

  const editTemplateName = async (id: string, currentName: string) => {
    const name = await appPrompt('Template name:', currentName);
    if (name?.trim()) renameTemplate(id, name.trim());
  };

  const removeTemplate = async (id: string, name: string) => {
    if (await appConfirm(`Delete template "${name}"? Associated pages will not use it.`)) deleteTemplate(id);
  };

  return (
    <div className={`panel site-manager-panel${embedded ? ' embedded-panel' : ''}`}>
      {!embedded && <div className="panel-header">Project Explorer</div>}
      <div className="site-toolbar">
        <button title="Add page" onClick={openNewPageDialog}><AppIcon name="add" size={15} /></button>
        <button title="Rename page" onClick={renameCurrentPage}><AppIcon name="edit" size={15} /></button>
        <button title="Clone page" onClick={() => clonePage(currentPageId)}><AppIcon name="clone" size={15} /></button>
        <button title="Delete page" disabled={pages.length <= 1} onClick={deleteCurrentPage}><AppIcon name="delete" size={15} /></button>
      </div>
      <div className="panel-body">
        <div className="site-tree">
          <div className="tree-node tree-root" onClick={() => toggle('__root')}>
            <TreeCaret collapsed={!!collapsed.__root} />
            <TreeIcon kind="folder" />
            <span className="item-label">{projectName}</span>
          </div>
          {!collapsed.__root && (
            <>
              <div className="tree-node tree-folder" onClick={() => toggle('Pages')}>
                <TreeCaret collapsed={!!collapsed.Pages} />
                <TreeIcon kind="folder" />
                <span className="item-label">Pages</span>
              </div>
              {!collapsed.Pages &&
                pages.map((p) => (
                  <div
                    key={p.id}
                    className={`tree-node tree-page tree-leaf2${p.id === currentPageId && !activeTemplateId ? ' active' : ''}`}
                    onClick={() => selectPage(p.id)}
                  >
                    <TreeIcon kind="doc" />
                    <span className="item-label">{p.name}</span>
                  </div>
                ))}
              <div className="tree-node tree-folder tree-templates" onClick={() => toggle('Templates')}>
                <TreeCaret collapsed={!!collapsed.Templates} />
                <TreeIcon kind="folder" />
                <span className="item-label">Templates</span>
                <button
                  className="tree-add"
                  title="Add template"
                  onClick={(e) => {
                    e.stopPropagation();
                    void createTemplate();
                  }}
                >
                  <AppIcon name="add" size={13} />
                </button>
              </div>
              {!collapsed.Templates &&
                templates.map((template) => (
                  <div
                    key={template.id}
                    className={`tree-node tree-leaf2 tree-template${template.id === activeTemplateId ? ' active' : ''}`}
                    title="Double-click to edit template"
                    onClick={() => openTemplate(template.id)}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      openTemplate(template.id);
                    }}
                  >
                    <TreeIcon kind="doc" />
                    <span className="item-label">{template.name}</span>
                    <span className="tree-leaf-actions" onClick={(e) => e.stopPropagation()}>
                      <button title="Rename template" onClick={() => void editTemplateName(template.id, template.name)}>
                        <AppIcon name="edit" size={12} />
                      </button>
                      <button title="Delete template" onClick={() => void removeTemplate(template.id, template.name)}>
                        <AppIcon name="delete" size={12} />
                      </button>
                    </span>
                  </div>
                ))}
              {!collapsed.Templates && templates.length === 0 && (
                <div className="tree-node tree-leaf2 tree-static">
                  <span className="item-label tree-empty">No templates</span>
                </div>
              )}
              {STATIC_FOLDERS.map((f) => (
                <div key={f.name}>
                  <div className="tree-node tree-folder" onClick={() => toggle(f.name)}>
                    <TreeCaret collapsed={!!collapsed[f.name]} />
                    <TreeIcon kind="folder" />
                    <span className="item-label">{f.name}</span>
                  </div>
                  {!collapsed[f.name] &&
                    f.files.map((file) => (
                      <div key={file.name} className="tree-node tree-leaf2 tree-static">
                        <TreeIcon kind={file.icon} />
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
