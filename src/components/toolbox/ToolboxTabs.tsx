import { useState } from 'react';
import Toolbox from './Toolbox';
import BlocksPanel from './BlocksPanel';

type ToolboxTab = 'toolbox' | 'blocks';

export default function ToolboxTabs() {
  const [tab, setTab] = useState<ToolboxTab>('toolbox');

  return (
    <section className="panel sidebar-tabs-panel">
      <div className="sidebar-tab-strip" role="tablist" aria-label="Object library">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'toolbox'}
          className={`sidebar-tab${tab === 'toolbox' ? ' active' : ''}`}
          onClick={() => setTab('toolbox')}
        >
          Toolbox
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'blocks'}
          className={`sidebar-tab${tab === 'blocks' ? ' active' : ''}`}
          onClick={() => setTab('blocks')}
        >
          Blocks
        </button>
      </div>
      <div className="sidebar-tab-content">
        <div className={`sidebar-tab-page${tab === 'toolbox' ? ' active' : ''}`}>
          <Toolbox embedded />
        </div>
        <div className={`sidebar-tab-page${tab === 'blocks' ? ' active' : ''}`}>
          <BlocksPanel embedded />
        </div>
      </div>
    </section>
  );
}
