import { useEffect, useState } from 'react';
import { useProjectStore, useCurrentPage, effectiveComponent } from '../../store/projectStore';
import { COMPONENT_MAP, COMMON_GROUPS, EVENT_NAMES } from '../../model/componentDefs';
import type { PropField } from '../../model/componentDefs';
import type { Project } from '../../model/types';
import CodeEditor from '../code/CodeEditor';

type Tab = 'events' | 'props';

function pageOf(s: { project: Project; currentPageId: string }) {
  return s.project.pages.find((p) => p.id === s.currentPageId) ?? s.project.pages[0];
}

export default function PropertiesPanel() {
  const [tab, setTab] = useState<Tab>('props');
  const selectedId = useProjectStore((s) => s.selectedId);
  const currentPageId = useProjectStore((s) => s.currentPageId);

  return (
    <section className="panel props-panel">
      <div className="panel-header">
        <span>Properties</span>
      </div>
      {tab === 'props' ? (
        <PropsBody key={`props-${currentPageId}-${selectedId ?? 'page'}`} />
      ) : (
        <EventsBody key={`events-${currentPageId}-${selectedId ?? 'page'}`} />
      )}
      <div className="props-tabs">
        <button
          type="button"
          className={`props-tab${tab === 'events' ? ' active' : ''}`}
          onClick={() => setTab('events')}
        >
          Events
        </button>
        <button
          type="button"
          className={`props-tab${tab === 'props' ? ' active' : ''}`}
          onClick={() => setTab('props')}
        >
          More Properties
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
  const [open, setOpen] = useState(true);
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

function NumberInput({ value, onCommit }: { value: number; onCommit: (n: number) => void }) {
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
  const bpId = useProjectStore((s) => s.activeBreakpointId);
  const bpName = useProjectStore((s) =>
    s.activeBreakpointId ? s.project.breakpoints.find((b) => b.id === s.activeBreakpointId)?.name : undefined
  );
  const updateProps = useProjectStore((s) => s.updateProps);
  const setGeometry = useProjectStore((s) => s.setGeometry);
  const clearOverride = useProjectStore((s) => s.clearOverride);
  const openCodeDialog = useProjectStore((s) => s.openCodeDialog);

  if (!comp) return null;
  const eff = effectiveComponent(comp, bpId);
  const def = COMPONENT_MAP[comp.type];

  const hasOverride = !!(bpId && comp.overrides[bpId]);

  /** Render one PropField row; geometry fields bind to setGeometry, the rest to updateProps. */
  const renderField = (f: PropField) => {
    if (!matches(filter, f.label)) return null;
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
            onCommit={(v) => updateProps(id, { [f.key]: v })}
          />
        )}
      </Row>
    );
  };

  const renderCommonGroup = (name: string) => {
    const g = COMMON_GROUPS.find((g) => g.group === name);
    if (!g) return null;
    const rows = g.fields.map(renderField).filter(Boolean);
    if (rows.length === 0) return null;
    return (
      <GroupSection key={name} name={name} filter={filter}>
        {rows}
      </GroupSection>
    );
  };

  const contentFields = def?.fields ?? [];
  const contentRows = contentFields.map(renderField).filter(Boolean);
  const defaultName = def ? `${def.label}1` : comp.id;

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
      </GroupSection>

      {/* 1. Content — type-specific fields from the component def */}
      {contentRows.length > 0 && (
        <GroupSection name="Content" filter={filter}>
          {contentRows}
        </GroupSection>
      )}

      {/* 2-6. Common groups */}
      {renderCommonGroup('Layout')}
      {renderCommonGroup('Typography')}
      {renderCommonGroup('Background')}
      {renderCommonGroup('Border')}
      {renderCommonGroup('Effects')}

      {/* 8. Advanced */}
      {renderCommonGroup('Advanced')}
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
          value={typeof value === 'number' && Number.isFinite(value) ? value : 0}
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
