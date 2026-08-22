import { useState, type DragEvent } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS, toolboxGroup, type ComponentDef } from '../../model/componentDefs';
import { useProjectStore } from '../../store/projectStore';

export default function Toolbox() {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const q = query.trim().toLowerCase();
  const matches = (label: string) => q === '' || label.toLowerCase().includes(q);

  const toggleGroup = (group: string) =>
    setCollapsed((c) => ({ ...c, [group]: !c[group] }));

  const onDragStart = (e: DragEvent<HTMLDivElement>, def: ComponentDef) => {
    e.dataTransfer.setData('application/x-component-type', def.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const iconFor = (def: ComponentDef) => {
    const type = def.type.toLowerCase();
    if (['section', 'container', 'panel', 'group'].includes(type)) return '▯';
    if (['row', 'column', 'flex', 'grid'].includes(type)) return '▦';
    if (type === 'card') return '▤';
    if (type === 'spacer') return '↕';
    if (type === 'heading') return 'H';
    if (type === 'paragraph' || type === 'text') return 'T';
    if (type === 'image' || type === 'gallery' || type === 'lightbox') return '▧';
    if (type === 'button' || type === 'submit' || type === 'reset') return '▭';
    if (type === 'link') return '⌁';
    if (type === 'icon') return '☆';
    if (type === 'divider') return '─';
    if (type.includes('input') || type === 'password' || type === 'email' || type === 'tel' || type === 'number') return '▱';
    if (type === 'textarea') return '▤';
    if (type === 'checkbox') return '☑';
    if (type === 'radio') return '◎';
    if (type === 'select') return '▾';
    if (type === 'date' || type === 'time' || type === 'calendar') return '□';
    if (type === 'file') return '▯';
    if (type === 'navbar' || type === 'menu' || type === 'tabs') return '☰';
    if (type === 'video' || type === 'audio') return '▷';
    if (type === 'table' || type === 'datagrid' || type === 'dbtable') return '▦';
    if (type === 'htmlembed' || type === 'iframe') return '</>';
    return def.label
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="panel toolbox-panel">
      <div className="panel-header">Toolbox</div>
      <div className="toolbox-search">
        <input
          type="text"
          placeholder="Search controls..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="toolbox-search-icon">🔍</span>
      </div>
      <div className="panel-body">
        {TOOLBOX_GROUPS.map((group) => {
          const defs = COMPONENT_DEFS.filter((d) => toolboxGroup(d) === group && matches(d.label));
          const showPointer = group === 'Standard' && matches('Pointer');
          if (defs.length === 0 && !showPointer) return null;
          const isCollapsed = !!collapsed[group];
          return (
            <div className="toolbox-group" key={group}>
              <button className="toolbox-group-header" onClick={() => toggleGroup(group)}>
                <span className={`collapse-arrow${isCollapsed ? ' collapsed' : ''}`}>⌄</span>
                {group}
              </button>
              {!isCollapsed && (
                <div className="toolbox-items">
                  {showPointer && (
                    <div
                      className={`toolbox-item${tool === 'pointer' ? ' selected' : ''}`}
                      onClick={() => setTool('pointer')}
                    >
                      <span className="item-icon">➤</span>
                      <span className="item-label">Pointer</span>
                    </div>
                  )}
                  {defs.map((def) => (
                    <div
                      key={def.type}
                      className={`toolbox-item${tool === def.type ? ' selected' : ''}`}
                      draggable
                      onDragStart={(e) => onDragStart(e, def)}
                      onClick={() => setTool(def.type)}
                    >
                      <span className="item-icon">{iconFor(def)}</span>
                      <span className="item-label">{def.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
