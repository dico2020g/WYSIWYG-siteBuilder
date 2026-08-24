import { useState, type DragEvent } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS, toolboxGroup, type ComponentDef } from '../../model/componentDefs';
import { useProjectStore } from '../../store/projectStore';
import { AppIcon, toolboxIconName } from '../icons/AppIcon';

export default function Toolbox({ embedded = false }: { embedded?: boolean }) {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOOLBOX_GROUPS.map((group) => [group, true]))
  );

  const q = query.trim().toLowerCase();
  const matches = (label: string) => q === '' || label.toLowerCase().includes(q);

  const toggleGroup = (group: string) =>
    setCollapsed((c) => ({ ...c, [group]: !c[group] }));

  const onDragStart = (e: DragEvent<HTMLDivElement>, def: ComponentDef) => {
    e.dataTransfer.setData('application/x-component-type', def.type);
    e.dataTransfer.setData('text/plain', def.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={`panel toolbox-panel${embedded ? ' embedded-panel' : ''}`}>
      {!embedded && <div className="panel-header">Toolbox</div>}
      <div className="toolbox-search">
        <input
          type="text"
          placeholder="Search controls..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="toolbox-search-icon"><AppIcon name="search" size={13} /></span>
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
                <span className="props-group-arrow" aria-hidden="true">
                  {isCollapsed ? '▸' : '▾'}
                </span>
                {group}
              </button>
              {!isCollapsed && (
                <div className="toolbox-items">
                  {showPointer && (
                    <div
                      className={`toolbox-item${tool === 'pointer' ? ' selected' : ''}`}
                      onClick={() => setTool('pointer')}
                    >
                      <span className="item-icon"><AppIcon name="pointer" size={18} /></span>
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
                      <span className="item-icon"><AppIcon name={toolboxIconName(def.type, def.label)} size={18} /></span>
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
