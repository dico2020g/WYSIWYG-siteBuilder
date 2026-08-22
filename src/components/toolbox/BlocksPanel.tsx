const BLOCKS = [
  { icon: '📰', name: 'Article' },
  { icon: '🎯', name: 'Hero' },
  { icon: '▔', name: 'Footer' },
];

export default function BlocksPanel() {
  return (
    <div className="panel blocks-panel">
      <div className="panel-header">Blocks</div>
      <div className="panel-body">
        {BLOCKS.map((b) => (
          <div className="block-card" key={b.name}>
            <span className="item-icon">{b.icon}</span>
            <span className="item-label">{b.name}</span>
          </div>
        ))}
        <div className="blocks-note">Blocks are coming soon.</div>
      </div>
    </div>
  );
}
