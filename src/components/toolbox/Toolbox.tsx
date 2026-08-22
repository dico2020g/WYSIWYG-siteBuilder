import { useState, type DragEvent } from 'react';
import { COMPONENT_DEFS, TOOLBOX_GROUPS, type ComponentDef } from '../../model/componentDefs';
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
    const icon = String(def.icon ?? '').trim();
    if (
      icon &&
      !icon.includes('â') &&
      !icon.includes('ð') &&
      !icon.includes('Ã¢') &&
      !icon.includes('Ã°')
    ) {
      return icon;
    }
    return def.label
      .split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 3)
      .toUpperCase();
  };

  return (
    <div className="panel toolbox-panel">
      <div className="panel-header">Toolbox</div>
      <div className="toolbox-search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="panel-body">
        {TOOLBOX_GROUPS.map((group) => {
          const defs = COMPONENT_DEFS.filter((d) => d.group === group && matches(d.label));
          const showPointer = group === 'Layout' && matches('Pointer');
          if (defs.length === 0 && !showPointer) return null;
          const isCollapsed = !!collapsed[group];
          return (
            <div className="toolbox-group" key={group}>
              <button className="toolbox-group-header" onClick={() => toggleGroup(group)}>
                <span className={`collapse-arrow${isCollapsed ? ' collapsed' : ''}`}>v</span>
                {group}
              </button>
              {!isCollapsed && (
                <div className="toolbox-items">
                  {showPointer && (
                    <div
                      className={`toolbox-item${tool === 'pointer' ? ' selected' : ''}`}
                      onClick={() => setTool('pointer')}
                    >
                      <span className="item-icon">PTR</span>
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
