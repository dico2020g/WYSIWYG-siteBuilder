import { useState } from 'react';

const TABS = ['Errors', 'Search Results', 'Output', 'FTP', 'Git'] as const;

/** Bottom diagnostics panel (Errors / Search Results / Output / FTP / Git) like WebDev. */
export default function BottomPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Errors');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={'bottom-panel' + (collapsed ? ' collapsed' : '')}>
      <div className="bottom-panel-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={'bottom-panel-tab' + (tab === t ? ' active' : '')}
            onClick={() => {
              setTab(t);
              setCollapsed(false);
            }}
          >
            {t}
          </button>
        ))}
        <div className="bottom-panel-spacer" />
        <button
          className="bottom-panel-toggle"
          title={collapsed ? 'Expand' : 'Collapse'}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? '▴' : '▾'}
        </button>
      </div>
      {!collapsed && (
        <div className="bottom-panel-body">
          <div className="bottom-panel-counts">
            <span>ⓘ 0 Errors</span>
            <span>⚠ 0 Warnings</span>
            <span>ⓘ 0 Messages</span>
          </div>
          <div className="bottom-panel-table-head">
            <span className="col-desc">Description</span>
            <span className="col-file">File</span>
            <span className="col-line">Line</span>
            <span className="col-col">Column</span>
          </div>
          <div className="bottom-panel-table-body" />
        </div>
      )}
    </div>
  );
}
