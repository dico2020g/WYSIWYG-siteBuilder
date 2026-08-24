import { useProjectStore } from '../../store/projectStore';
import { AppIcon } from '../icons/AppIcon';

const BLOCKS = [
  { icon: 'paragraph', name: 'Article' },
  { icon: 'star', name: 'Hero' },
  { icon: 'divider', name: 'Footer' },
];

/** Blocks palette: static placeholders plus the project's saved custom blocks. */
export default function BlocksPanel({ embedded = false }: { embedded?: boolean }) {
  const customBlocks = useProjectStore((s) => s.project.customBlocks) ?? [];
  const insertBlock = useProjectStore((s) => s.insertBlock);
  const deleteBlock = useProjectStore((s) => s.deleteBlock);

  return (
    <div className={`panel blocks-panel${embedded ? ' embedded-panel' : ''}`}>
      {!embedded && <div className="panel-header">Blocks</div>}
      <div className="panel-body">
        {BLOCKS.map((b) => (
          <div className="block-card" key={b.name}>
            <span className="item-icon"><AppIcon name={b.icon} size={16} /></span>
            <span className="item-label">{b.name}</span>
          </div>
        ))}
        {customBlocks.length > 0 && <div className="blocks-subheader">My Blocks</div>}
        {customBlocks.map((b) => (
          <div
            className="block-card block-card-custom"
            key={b.id}
            title={`Insert "${b.name}" (${b.items.length} object${b.items.length === 1 ? '' : 's'})`}
            onClick={() => insertBlock(b.id)}
          >
            <span className="item-icon"><AppIcon name="saveBlock" size={16} /></span>
            <span className="item-label">{b.name}</span>
            <button
              className="block-delete"
              title="Delete block"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(b.id);
              }}
            >
              <AppIcon name="delete" size={12} />
            </button>
          </div>
        ))}
        {customBlocks.length === 0 && (
          <div className="blocks-note">Select objects and use Home → Save as Block to add reusable blocks.</div>
        )}
      </div>
    </div>
  );
}
