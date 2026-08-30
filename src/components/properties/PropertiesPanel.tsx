import { useEffect, useState } from 'react';
import { useProjectStore, useCurrentPage, effectiveComponent } from '../../store/projectStore';
import { COMPONENT_MAP, COMMON_GROUPS, EVENT_NAMES, propertyGroupsForComponent } from '../../model/componentDefs';
import { responsiveBaseWidth } from '../../model/responsive';
import type { PropField } from '../../model/componentDefs';
import type { Project } from '../../model/types';
import { readTransform, buildTransform, transformPatch } from '../../model/transform';
import CodeEditor from '../code/CodeEditor';
import DataSourceTree from '../dialogs/DataSourceBrowser';
import SiteManager from '../sitemanager/SiteManager';

type Tab = 'project' | 'props' | 'events' | 'datasource';

const HEADING_FONT_SIZES: Record<string, number> = { h1: 32, h2: 24, h3: 20, h4: 18, h5: 16, h6: 14 };

function pageOf(s: { project: Project; currentPageId: string }) {
  return s.project.pages.find((p) => p.id === s.currentPageId) ?? s.project.pages[0];
}

export default function PropertiesPanel() {
  const [tab, setTab] = useState<Tab>('project');
  const selectedId = useProjectStore((s) => s.selectedId);
  const currentPageId = useProjectStore((s) => s.currentPageId);

  useEffect(() => {
    const focusProperties = () => setTab('props');
    window.addEventListener('sitebuilder:focus-properties', focusProperties);
    return () => window.removeEventListener('sitebuilder:focus-properties', focusProperties);
  }, []);

  return (
    <section className="panel props-panel">
      <div className="panel-header">
        <span>{tab === 'project' ? 'Project Explorer' : tab === 'props' ? 'Properties' : tab === 'events' ? 'Events' : 'Data Source'}</span>
      </div>
      <div className="project-tab-wrap" style={{ display: tab === 'project' ? 'flex' : 'none' }}>
        <SiteManager embedded />
      </div>
      {tab === 'props' && <PropsBody key={`props-${currentPageId}-${selectedId ?? 'page'}`} />}
      {tab === 'events' && <EventsBody key={`events-${currentPageId}-${selectedId ?? 'page'}`} />}
      {/* Data Source tree stays mounted (hidden) so expansion state survives tab switches */}
      <div className="ds-tab-wrap" style={{ display: tab === 'datasource' ? 'flex' : 'none' }}>
        <DataSourceTree />
      </div>
      <div className="props-tabs">
        <button
          type="button"
          className={`props-tab${tab === 'project' ? ' active' : ''}`}
          onClick={() => setTab('project')}
        >
          Project
        </button>
        <button
          type="button"
          className={`props-tab${tab === 'props' ? ' active' : ''}`}
          onClick={() => setTab('props')}
        >
          More Properties
        </button>
        <button
          type="button"
          className={`props-tab${tab === 'events' ? ' active' : ''}`}
          onClick={() => setTab('events')}
        >
          Events
        </button>
        <button
          type="button"
          className={`props-tab${tab === 'datasource' ? ' active' : ''}`}
          onClick={() => setTab('datasource')}
        >
          Data Source
        </button>
      </div>
    </section>
  );
}

/* ---------- selector line ---------- */

function SelectorLine() {
  const comp = useProjectStore((s) =>
    s.selectedId ? pageOf(s).components.find((c) => c.id === s.selectedId) : undefined
  );
  const def = comp ? COMPONENT_MAP[comp.type] : undefined;
  return (
    <div className="props-selector">
      {comp ? (
        <>
          <span className="props-selector-name">{String(comp.props.componentName || (def ? def.label : comp.type))}</span>
          <span className="props-selector-id">#{comp.id.slice(-4)}</span>
        </>
      ) : (
        <span className="props-selector-name">(Page)</span>
      )}
    </div>
  );
}

/* ---------- default tab: properties ---------- */

function PropsBody() {
  const selectedId = useProjectStore((s) => s.selectedId);
  const [filter, setFilter] = useState('');

  return (
    <div className="panel-body props-body">
      <div className="props-top">
        <SelectorLine />
        <input
          type="text"
          className="props-search"
          placeholder="Filter properties..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {selectedId ? <ComponentProps id={selectedId} filter={filter} /> : <PageProps filter={filter} />}
    </div>
  );
}

function matches(filter: string, label: string): boolean {
  return filter.trim() === '' || label.toLowerCase().includes(filter.trim().toLowerCase());
}

function GroupSection({ name, filter, children }: { name: string; filter: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const filtering = filter.trim() !== '';
  const expanded = open || filtering;
  return (
    <div className="props-group">
      <button type="button" className="props-group-header" onClick={() => setOpen((o) => !o)}>
        <span className="props-group-arrow">{expanded ? '▾' : '▸'}</span>
        <span>{name}</span>
      </button>
      {expanded && <div className="props-group-body">{children}</div>}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="props-row">
      <label className="props-label">{label}</label>
      <div className="props-control">{children}</div>
    </div>
  );
}

/* ---------- inputs ---------- */

function NumberInput({ value, onCommit }: { value: number | string; onCommit: (n: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);

  return (
    <input
      type="number"
      value={draft}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const v = e.target.value;
        setDraft(v);
        if (v.trim() !== '') {
          const n = Number(v);
          if (Number.isFinite(n)) onCommit(n);
        }
      }}
    />
  );
}

function ColorInput({ value, onCommit }: { value: string; onCommit: (v: string) => void }) {
  const swatch = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff';
  return (
    <div className="props-color">
      <input
        type="color"
        className="props-color-swatch"
        value={swatch}
        onChange={(e) => onCommit(e.target.value)}
      />
      <input
        type="text"
        className="props-color-hex"
        value={value}
        placeholder="#rrggbb"
        onChange={(e) => onCommit(e.target.value)}
      />
    </div>
  );
}

/* ---------- component properties ---------- */

function ComponentProps({ id, filter }: { id: string; filter: string }) {
  const comp = useProjectStore((s) => pageOf(s).components.find((c) => c.id === id));
  const page = useCurrentPage();
  const bpId = useProjectStore((s) => s.activeBreakpointId);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const bpName = useProjectStore((s) =>
    s.activeBreakpointId ? s.project.breakpoints.find((b) => b.id === s.activeBreakpointId)?.name : undefined
  );
  const updateProps = useProjectStore((s) => s.updateProps);
  const setGeometry = useProjectStore((s) => s.setGeometry);
  const clearOverride = useProjectStore((s) => s.clearOverride);
  const openCodeDialog = useProjectStore((s) => s.openCodeDialog);
  const arrangeSelection = useProjectStore((s) => s.arrangeSelection);

  if (!comp) return null;
  const eff = effectiveComponent(comp, breakpoints, bpId, responsiveBaseWidth(page));
  const def = COMPONENT_MAP[comp.type];

  const hasOverride = !!(bpId && comp.overrides[bpId]);

  /** Render one PropField row; geometry fields bind to setGeometry, the rest to updateProps. */
  const renderField = (f: PropField) => {
    if (!matches(filter, f.label)) return null;
    const commitField = (v: unknown) => {
      if (comp.type === 'heading' && f.key === 'level') {
        updateProps(id, { level: v, fontSize: HEADING_FONT_SIZES[String(v)] ?? 32 });
        return;
      }
      updateProps(id, { [f.key]: v });
    };
    if (f.bind === 'geometry') {
      const key = f.key as 'x' | 'y' | 'width' | 'height';
      return (
        <Row key={f.key} label={f.label}>
          <NumberInput value={eff[key]} onCommit={(n) => setGeometry(id, { [key]: n })} />
        </Row>
      );
    }
    return (
      <Row key={f.key} label={f.label}>
        {f.key === 'animation' || f.key === 'transition' || f.key === 'transform' ? (
          <EffectFieldControl
            fieldKey={f.key as 'animation' | 'transition' | 'transform'}
            value={eff.props[f.key]}
            animationPreset={String(eff.props.animationPreset || '')}
            animationDefinitions={String(eff.props.animationDefinitions || '')}
            onCommit={(v) => updateProps(id, { [f.key]: v })}
            onAnimationSelect={(preset) => {
              const duration = Number(eff.props.animationDuration || 1000);
              const easing = String(eff.props.animationTimingFunction || 'linear');
              const delay = Number(eff.props.animationDelay || 0);
              const count = String(eff.props.animationIterationCount || '1');
              const direction = String(eff.props.animationDirection || 'normal');
              const fill = String(eff.props.animationFillMode || 'both');
              updateProps(id, {
                animationPreset: preset,
                animation: `${preset} ${duration}ms ${easing} ${delay}ms ${count === '-1' ? 'infinite' : count} ${direction} ${fill}`,
              });
            }}
            onOpen={() => openCodeDialog({ kind: 'object-effect', componentId: id, tab: f.key as 'animation' | 'transition' | 'transform' })}
          />
        ) : (
          <FieldControl
            field={f}
            value={eff.props[f.key]}
            onCommit={commitField}
          />
        )}
      </Row>
    );
  };

  const componentGroups = def ? propertyGroupsForComponent(def) : [];
  const advancedFields = COMMON_GROUPS.find((group) => group.group === 'Advanced')?.fields ?? [];
  const advancedRows = advancedFields.map(renderField).filter(Boolean);
  const defaultName = def ? `${def.label}1` : comp.id;

  const transformState = readTransform(eff.props.transform);
  const currentRotation = transformState.rotate || 0;

  /** Set a transform extra token (scale/skew) or clear it when empty. */
  const setTransformToken = (key: string, value: string) => {
    updateProps(id, transformPatch(eff.props.transform, (t) => {
      t.other = t.other.filter((tok) => !tok.startsWith(`${key}(`));
      if (value.trim() !== '') t.other.push(`${key}(${value.trim()})`);
    }));
  };
  // Read back current scale/skew values for the inputs.
  const tokenVal = (name: string): string => {
    const tok = transformState.other.find((t2) => t2.startsWith(`${name}(`));
    if (!tok) return '';
    const m = tok.match(new RegExp(`^${name}\\((.*)\\)$`));
    return m ? m[1] : '';
  };
  const transformOrigin = String(eff.props.transformOrigin ?? 'center center');

  return (
    <div>
      {hasOverride && bpId && (
        <div className="props-override-notice">
          <span>Overrides active for {bpName ?? bpId}</span>
          <button type="button" onClick={() => clearOverride(comp.id, bpId)}>
            Clear
          </button>
        </div>
      )}

      <GroupSection name="General" filter={filter}>
        {matches(filter, `${def?.label ?? comp.type} Name`) && (
          <Row label={`${def?.label ?? comp.type} Name`}>
            <input
              type="text"
              value={String(eff.props.componentName || defaultName)}
              onChange={(e) => updateProps(id, { componentName: e.target.value })}
            />
          </Row>
        )}
        {advancedRows}
      </GroupSection>

      {/* Transform */}
      <GroupSection name="Transform" filter={filter}>
        {matches(filter, 'Rotation') && (
          <Row label="Rotation">
            <div className="props-rotation" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                value={currentRotation}
                onChange={(e) => {
                  const degN = Number(e.target.value) || 0;
                  updateProps(id, transformPatch(eff.props.transform, (t) => { t.rotate = degN; }));
                }}
                style={{ width: 70, padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13 }}
              />
              <span style={{ fontSize: 13, color: '#6b7280' }}>°</span>
              <button
                type="button"
                onClick={() => updateProps(id, transformPatch(eff.props.transform, (t) => { t.rotate = 0; }))}
                title="Reset rotation"
                style={{ padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#ffffff', cursor: 'pointer', fontSize: 13 }}
              >
                Reset
              </button>
            </div>
          </Row>
        )}
        {matches(filter, 'Scale X') && (
          <Row label="Scale X">
            <input type="text" value={tokenVal('scaleX')} placeholder="1"
              onChange={(e) => setTransformToken('scaleX', e.target.value)} />
          </Row>
        )}
        {matches(filter, 'Scale Y') && (
          <Row label="Scale Y">
            <input type="text" value={tokenVal('scaleY')} placeholder="1"
              onChange={(e) => setTransformToken('scaleY', e.target.value)} />
          </Row>
        )}
        {matches(filter, 'Skew X') && (
          <Row label="Skew X">
            <input type="text" value={tokenVal('skewX')} placeholder="0deg"
              onChange={(e) => setTransformToken('skewX', e.target.value)} />
          </Row>
        )}
        {matches(filter, 'Skew Y') && (
          <Row label="Skew Y">
            <input type="text" value={tokenVal('skewY')} placeholder="0deg"
              onChange={(e) => setTransformToken('skewY', e.target.value)} />
          </Row>
        )}
        {matches(filter, 'Flip Horizontal') && (
          <Row label="Flip Horizontal">
            <input type="checkbox" className="props-checkbox" checked={transformState.flipH}
              onChange={(e) => updateProps(id, transformPatch(eff.props.transform, (t) => { t.flipH = e.target.checked; }))} />
          </Row>
        )}
        {matches(filter, 'Flip Vertical') && (
          <Row label="Flip Vertical">
            <input type="checkbox" className="props-checkbox" checked={transformState.flipV}
              onChange={(e) => updateProps(id, transformPatch(eff.props.transform, (t) => { t.flipV = e.target.checked; }))} />
          </Row>
        )}
        {matches(filter, 'Transform Origin') && (
          <Row label="Transform Origin">
            <select value={transformOrigin}
              onChange={(e) => updateProps(id, { transformOrigin: e.target.value })}>
              {['center center', 'left top', 'center top', 'right top', 'left center', 'right center', 'left bottom', 'center bottom', 'right bottom'].map((o2) => (
                <option key={o2} value={o2}>{o2}</option>
              ))}
            </select>
          </Row>
        )}
        {matches(filter, 'Reset Transform') && (
          <Row label="Reset Transform">
            <button type="button"
              onClick={() => updateProps(id, { transform: '', transformOrigin: '' })}
              style={{ padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: 4, background: '#ffffff', cursor: 'pointer', fontSize: 13 }}>
              Reset All
            </button>
          </Row>
        )}
      </GroupSection>

      {componentGroups.map(({ group, fields }) => {
        const rows = fields.map(renderField).filter(Boolean);
        return rows.length > 0 ? (
          <GroupSection key={group} name={group} filter={filter}>
            {rows}
          </GroupSection>
        ) : null;
      })}

      {/* Content alignment (positions content inside the control; does NOT move the control) */}
      <GroupSection name="Content Alignment" filter={filter}>
        {(() => {
          // Content alignment lives in two props: horizontal (text-align) and
          // vertical (a flex justify on the content box). Never touches X/Y/W/H.
          const horiz = String(eff.props.textAlign ?? 'left');
          const vert = String(eff.props.contentVerticalAlign ?? 'top');
          const setHoriz = (v: string) => updateProps(id, { textAlign: v });
          const setVert = (v: string) => updateProps(id, { contentVerticalAlign: v });
          const cell = (h: string, v: string, glyph: string, title: string) => {
            const active = horiz === h && vert === v;
            return (
              <button key={title} type="button" title={title}
                onClick={() => { setHoriz(h); setVert(v); }}
                style={{
                  width: 34, height: 30, border: active ? '2px solid #1d6ff2' : '1px solid #d1d5db',
                  borderRadius: 4, background: active ? '#eaf2ff' : '#ffffff', cursor: 'pointer', fontSize: 14,
                }}>
                {glyph}
              </button>
            );
          };
          const glyphFor = (h: string, v: string) => {
            const vg = v === 'top' ? '⤒' : v === 'middle' ? '↔' : '⤓';
            const hg = h === 'left' ? '⇤' : h === 'center' ? '⬌' : '⇥';
            return `${vg}${hg}`;
          };
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {matches(filter, 'Content Alignment') && (
                <Row label="Position">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 34px)', gap: 4 }}>
                    {(['top', 'middle', 'bottom'] as const).map((v) =>
                      (['left', 'center', 'right'] as const).map((h) =>
                        cell(h, v, glyphFor(h, v), `${v} ${h}`)
                      )
                    )}
                  </div>
                </Row>
              )}
              {matches(filter, 'Justify') && (
                <Row label="Justify Text">
                  <input type="checkbox" className="props-checkbox"
                    checked={horiz === 'justify'}
                    onChange={(e) => setHoriz(e.target.checked ? 'justify' : 'left')} />
                </Row>
              )}
              <div style={{ fontSize: 11, color: '#6b7280' }}>
                Positions the content inside the control's box. The control stays at X={eff.x}, Y={eff.y} — only its content moves.
              </div>
            </div>
          );
        })()}
      </GroupSection>

      {/* Layer order */}
      <GroupSection name="Layer" filter={filter}>
        {matches(filter, 'Layer Order') && (
          <Row label="Order">
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {([
                ['⇤ Front', () => arrangeSelection('front'), 'Bring to Front'],
                ['↑ Forward', () => arrangeSelection('forward'), 'Bring Forward'],
                ['↓ Backward', () => arrangeSelection('backward'), 'Send Backward'],
                ['⇥ Back', () => arrangeSelection('back'), 'Send to Back'],
              ] as [string, () => void, string][]).map(([label, fn, title]) => (
                <button key={label} type="button" title={title} onClick={fn}
                  style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: 4, background: '#ffffff', cursor: 'pointer', fontSize: 12 }}>
                  {label}
                </button>
              ))}
            </div>
          </Row>
        )}
      </GroupSection>

    </div>
  );
}

function EffectFieldControl({
  fieldKey,
  value,
  animationPreset,
  animationDefinitions,
  onCommit,
  onAnimationSelect,
  onOpen,
}: {
  fieldKey: 'animation' | 'transition' | 'transform';
  value: unknown;
  animationPreset: string;
  animationDefinitions: string;
  onCommit: (v: string) => void;
  onAnimationSelect: (v: string) => void;
  onOpen: () => void;
}) {
  const customNames = parseAnimationNames(animationDefinitions);
  const animationOptions = [
    '',
    'animate-background',
    'animate-border',
    'animate-box-shadow',
    'animate-fade-in',
    'animate-fade-out',
    'animate-opacity',
    'animate-rotate-in-left',
    'animate-scroll-x',
    'bounce',
    'flip',
    'focus-in',
    'magic-in',
    'perspective-left',
    'scale-in-horizontal-center',
    'slide-right-in',
    'transform-scale',
    'transform-wiggle',
    ...customNames,
  ];
  return (
    <div className="props-effect-picker">
      {fieldKey === 'animation' ? (
        <select value={animationPreset} onChange={(e) => onAnimationSelect(e.target.value)}>
          {animationOptions.map((option) => (
            <option key={option} value={option}>
              {option || '(none)'}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onChange={(e) => onCommit(e.target.value)}
        />
      )}
      <button type="button" title={`Edit ${fieldKey}`} onClick={onOpen}>
        ...
      </button>
    </div>
  );
}

function parseAnimationNames(raw: string): string[] {
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list.map((item) => String(item?.name || '')).filter(Boolean);
  } catch {
    return [];
  }
}

function FieldControl({
  field,
  value,
  onCommit,
}: {
  field: PropField;
  value: unknown;
  onCommit: (v: unknown) => void;
}) {
  switch (field.type) {
    case 'textarea':
      return (
        <textarea
          rows={3}
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onChange={(e) => onCommit(e.target.value)}
        />
      );
    case 'number':
      return (
        <NumberInput
          value={typeof value === 'number' && Number.isFinite(value) ? value : typeof value === 'string' ? value : ''}
          onCommit={(n) => onCommit(n)}
        />
      );
    case 'color':
      return (
        <ColorInput
          value={typeof value === 'string' ? value : ''}
          onCommit={(v) => onCommit(v)}
        />
      );
    case 'select': {
      const options = field.options ?? [];
      const current = typeof value === 'string' ? value : options[0] ?? '';
      return (
        <select value={current} onChange={(e) => onCommit(e.target.value)}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    case 'checkbox':
      return (
        <input
          type="checkbox"
          className="props-checkbox"
          checked={Boolean(value)}
          onChange={(e) => onCommit(e.target.checked)}
        />
      );
    case 'text':
    default:
      return (
        <input
          type="text"
          value={typeof value === 'string' ? value : value == null ? '' : String(value)}
          onChange={(e) => onCommit(e.target.value)}
        />
      );
  }
}

/* ---------- page properties (nothing selected) ---------- */

function PageProps({ filter }: { filter: string }) {
  const page = useCurrentPage();
  const updatePageProps = useProjectStore((s) => s.updatePageProps);

  return (
    <div>
      <GroupSection name="General" filter={filter}>
        {matches(filter, 'Document Type') && (
          <Row label="Document Type">
            <input type="text" value="HTML 5" disabled />
          </Row>
        )}
        {matches(filter, 'File Extension') && (
          <Row label="File Extension">
            <input type="text" value="html" disabled />
          </Row>
        )}
        {matches(filter, 'Title') && (
          <Row label="Title">
            <input
              type="text"
              value={page.title}
              onChange={(e) => updatePageProps(page.id, { title: e.target.value })}
            />
          </Row>
        )}
        {matches(filter, 'Menu Name') && (
          <Row label="Menu Name">
            <input
              type="text"
              value={page.name}
              onChange={(e) => updatePageProps(page.id, { name: e.target.value })}
            />
          </Row>
        )}
        {matches(filter, 'Width') && (
          <Row label="Width">
            <NumberInput value={page.width} onCommit={(n) => updatePageProps(page.id, { width: n })} />
          </Row>
        )}
        {matches(filter, 'Height') && (
          <Row label="Height">
            <NumberInput value={page.height} onCommit={(n) => updatePageProps(page.id, { height: n })} />
          </Row>
        )}
      </GroupSection>

      <GroupSection name="Background" filter={filter}>
        {matches(filter, 'Background Color') && (
          <Row label="Background Color">
            <ColorInput
              value={page.backgroundColor}
              onCommit={(v) => updatePageProps(page.id, { backgroundColor: v })}
            />
          </Row>
        )}
      </GroupSection>
    </div>
  );
}

/* ---------- events tab ---------- */

const EVENT_ACTIONS = [
  'animate (css3)', 'animate (javascript)', 'animation pause (css3)', 'animation resume (css3)',
  'clipboard copy text', 'clipboard paste text', 'disable', 'ecommerce', 'enable',
  'form reset', 'form submit', 'hide', 'hide with effect', 'javascript', 'link',
  'media pause', 'media play', 'media stop', 'move', 'print document', 'print element',
  'rotate', 'set class', 'set image', 'set value', 'show', 'show with effect',
  'slideshow next', 'slideshow previous', 'timer start', 'timer stop', 'toggle',
  'toggle class', 'toggle dark color scheme',
];

type EventDraft = {
  event: string;
  action: string;
  target: string;
  value: string;
};

function quoteJs(value: string) {
  return JSON.stringify(value ?? '');
}

function eventNameToDom(name: string) {
  return name.replace(/^on/i, '').toLowerCase();
}

function targetExpression(target: string) {
  return target === 'this' ? 'this' : `document.getElementById(${quoteJs(target)})`;
}

function generateActionCode(draft: EventDraft) {
  const target = targetExpression(draft.target);
  const value = quoteJs(draft.value);
  const eventType = quoteJs(eventNameToDom(draft.event));
  switch (draft.action) {
    case 'animate (css3)':
      return `var t=${target};if(t){t.style.animation=${value};}`;
    case 'animate (javascript)':
      return `var t=${target};if(t&&t.animate){t.animate(${draft.value || '[{opacity:0},{opacity:1}]'}, {duration: 500, fill: 'both'});}`;
    case 'animation pause (css3)':
      return `var t=${target};if(t){t.style.animationPlayState='paused';}`;
    case 'animation resume (css3)':
      return `var t=${target};if(t){t.style.animationPlayState='running';}`;
    case 'clipboard copy text':
      return `var t=${target};var v=${value}||((t&&(t.value||t.textContent))||'');if(navigator.clipboard){navigator.clipboard.writeText(v);}`;
    case 'clipboard paste text':
      return `var t=${target};if(t&&navigator.clipboard){navigator.clipboard.readText().then(function(v){if('value' in t)t.value=v;else t.textContent=v;});}`;
    case 'disable':
      return `var t=${target};if(t){t.disabled=true;t.setAttribute('aria-disabled','true');}`;
    case 'enable':
      return `var t=${target};if(t){t.disabled=false;t.removeAttribute('aria-disabled');}`;
    case 'form reset':
      return `var t=${target};if(t&&t.reset)t.reset();`;
    case 'form submit':
      return `var t=${target};if(t){if(t.requestSubmit)t.requestSubmit();else if(t.submit)t.submit();}`;
    case 'hide':
      return `var t=${target};if(t){t.style.display='none';}`;
    case 'hide with effect':
      return `var t=${target};if(t){t.style.transition='opacity .3s ease';t.style.opacity='0';setTimeout(function(){t.style.display='none';},300);}`;
    case 'javascript':
      return draft.value;
    case 'link':
      return `location.href=${value};`;
    case 'media pause':
      return `var t=${target};if(t&&t.pause)t.pause();`;
    case 'media play':
      return `var t=${target};if(t&&t.play)t.play();`;
    case 'media stop':
      return `var t=${target};if(t){if(t.pause)t.pause();try{t.currentTime=0;}catch(e){}}`;
    case 'move':
      return `var t=${target};if(t){t.style.transform=(t.style.transform||'')+' translate(${draft.value || '10px, 0'} )';}`;
    case 'print document':
      return 'window.print();';
    case 'print element':
      return `var t=${target};if(t){var w=open('','_blank');w.document.write(t.outerHTML);w.document.close();w.print();}`;
    case 'rotate':
      return `var t=${target};if(t){t.style.transform=(t.style.transform||'')+' rotate(${draft.value || '15deg'})';}`;
    case 'set class':
      return `var t=${target};if(t){t.className=${value};}`;
    case 'set image':
      return `var t=${target};if(t){t.setAttribute('src',${value});}`;
    case 'set value':
      return `var t=${target};if(t){if('value' in t)t.value=${value};else t.textContent=${value};}`;
    case 'show':
      return `var t=${target};if(t){t.style.display='';t.style.opacity='';}`;
    case 'show with effect':
      return `var t=${target};if(t){t.style.display='';t.style.transition='opacity .3s ease';t.style.opacity='0';requestAnimationFrame(function(){t.style.opacity='1';});}`;
    case 'slideshow next':
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent('sb:slideshow-next'));}`;
    case 'slideshow previous':
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent('sb:slideshow-previous'));}`;
    case 'timer start':
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent('sb:timer-start'));}`;
    case 'timer stop':
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent('sb:timer-stop'));}`;
    case 'toggle':
      return `var t=${target};if(t){t.style.display=(getComputedStyle(t).display==='none')?'':'none';}`;
    case 'toggle class':
      return `var t=${target};if(t){t.classList.toggle(${value}||'active');}`;
    case 'toggle dark color scheme':
      return "document.documentElement.classList.toggle('dark');";
    case 'ecommerce':
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent('sb:ecommerce',{detail:{value:${value},source:this,type:${eventType}}}));}`;
    default:
      return `var t=${target};if(t){t.dispatchEvent(new CustomEvent(${quoteJs(draft.action)},{detail:{value:${value},source:this,type:${eventType}}}));}`;
  }
}

function EventsBody() {
  const selectedId = useProjectStore((s) => s.selectedId);
  const comp = useProjectStore((s) =>
    s.selectedId ? pageOf(s).components.find((c) => c.id === s.selectedId) : undefined
  );
  const page = useCurrentPage();
  const updateEvents = useProjectStore((s) => s.updateEvents);
  const updatePageProps = useProjectStore((s) => s.updatePageProps);

  const [editing, setEditing] = useState<{ name: string; draft: string } | null>(null);
  const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);

  const openEditor = (name: string) => {
    if (!comp) return;
    setEditing({ name, draft: comp.events[name] ?? '' });
  };

  const saveEditor = () => {
    if (!editing || !comp) return;
    const next: Record<string, string> = { ...comp.events };
    if (editing.draft.trim() === '') delete next[editing.name];
    else next[editing.name] = editing.draft;
    updateEvents(comp.id, next);
    setEditing(null);
  };

  const openEventDialog = (event?: string) => {
    setEventDraft({
      event: event || 'onclick',
      action: 'set value',
      target: 'this',
      value: '',
    });
  };

  const saveEventDialog = () => {
    if (!eventDraft || !comp) return;
    const code = generateActionCode(eventDraft).trim();
    const next: Record<string, string> = { ...comp.events };
    next[eventDraft.event] = next[eventDraft.event]?.trim()
      ? `${next[eventDraft.event].trim()}\n${code}`
      : code;
    updateEvents(comp.id, next);
    setEventDraft(null);
  };

  const removeEvent = (name: string) => {
    if (!comp) return;
    const next: Record<string, string> = { ...comp.events };
    delete next[name];
    updateEvents(comp.id, next);
  };

  const configuredEvents = comp
    ? Object.entries(comp.events).filter(([, code]) => String(code || '').trim())
    : [];
  const targetOptions = comp
    ? [
        { id: 'this', label: 'This Object' },
        ...page.components.map((item) => ({
          id: String(item.props.domId || item.id),
          label: `${String(item.props.componentName || COMPONENT_MAP[item.type]?.label || item.type)} (#${String(item.props.domId || item.id)})`,
        })),
      ]
    : [];

  return (
    <div className="panel-body props-body">
      <div className="props-top">
        <SelectorLine />
      </div>

      {comp && (
        <GroupSection name="Events" filter="">
          <div className="props-event-toolbar">
            <button type="button" className="props-icon-btn" title="Add event" onClick={() => openEventDialog()}>
              +
            </button>
            <span>{configuredEvents.length ? `${configuredEvents.length} configured` : 'No events configured'}</span>
          </div>
          <div className="props-event-list">
            {configuredEvents.length === 0 && <div className="props-event-empty">Click + to add an event action.</div>}
            {configuredEvents.map(([name, code]) => (
              <div key={name} className="props-event-item">
                <button type="button" className="props-event-name" onClick={() => openEditor(name)} title="Edit JavaScript">
                  {name}
                </button>
                <span className="props-event-summary">{code.split(/\r\n|\r|\n/)[0]}</span>
                <button type="button" className="props-event-mini" title="Add action to this event" onClick={() => openEventDialog(name)}>
                  +
                </button>
                <button type="button" className="props-event-mini" title="Edit code" onClick={() => openEditor(name)}>
                  ...
                </button>
                <button type="button" className="props-event-mini" title="Remove event" onClick={() => removeEvent(name)}>
                  x
                </button>
              </div>
            ))}
          </div>
        </GroupSection>
      )}
      {selectedId && !comp && (
        <div className="props-note">Selected component no longer exists.</div>
      )}

      <GroupSection name="Page Script" filter="">
        <div className="props-code-block">
          <div className="props-code-label">Page JavaScript (runs on load)</div>
          <CodeEditor
            value={page.pageCode}
            language="javascript"
            height="140px"
            onChange={(v) => updatePageProps(page.id, { pageCode: v })}
          />
        </div>
        <div className="props-code-block">
          <div className="props-code-label">Page &lt;head&gt; HTML (framework script tags etc.)</div>
          <CodeEditor
            value={page.headCode}
            language="html"
            height="140px"
            onChange={(v) => updatePageProps(page.id, { headCode: v })}
          />
        </div>
      </GroupSection>

      {editing && comp && (
        <div className="props-modal-overlay" onClick={() => setEditing(null)}>
          <div className="props-modal" onClick={(e) => e.stopPropagation()}>
            <div className="props-modal-title">Edit {editing.name} handler</div>
            <CodeEditor
              value={editing.draft}
              language="javascript"
              height="320px"
              onChange={(v) => setEditing((cur) => (cur ? { ...cur, draft: v } : cur))}
            />
            <div className="props-modal-actions">
              <button type="button" className="props-btn-primary" onClick={saveEditor}>
                Save
              </button>
              <button type="button" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {eventDraft && comp && (
        <div className="props-modal-overlay" onClick={() => setEventDraft(null)}>
          <div className="props-modal props-event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="props-modal-title">Event</div>
            <div className="props-event-form">
              <label>Event:</label>
              <select value={eventDraft.event} onChange={(e) => setEventDraft((d) => (d ? { ...d, event: e.target.value } : d))}>
                {EVENT_NAMES.map((name) => <option key={name}>{name}</option>)}
              </select>
              <label>Action:</label>
              <select value={eventDraft.action} onChange={(e) => setEventDraft((d) => (d ? { ...d, action: e.target.value } : d))}>
                {EVENT_ACTIONS.map((name) => <option key={name}>{name}</option>)}
              </select>
              <label>Target:</label>
              <select value={eventDraft.target} onChange={(e) => setEventDraft((d) => (d ? { ...d, target: e.target.value } : d))}>
                {targetOptions.map((target) => <option key={target.id} value={target.id}>{target.label}</option>)}
              </select>
              <label>Value:</label>
              <input value={eventDraft.value} onChange={(e) => setEventDraft((d) => (d ? { ...d, value: e.target.value } : d))} />
            </div>
            <div className="props-event-preview">
              <div>Generated JavaScript</div>
              <textarea readOnly value={generateActionCode(eventDraft)} />
            </div>
            <div className="props-modal-actions">
              <button type="button" className="props-btn-primary" onClick={saveEventDialog}>
                OK
              </button>
              <button type="button" onClick={() => setEventDraft(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
