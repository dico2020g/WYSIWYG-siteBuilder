import { useMemo, useState } from 'react';
import { useProjectStore, useCurrentPage } from '../../store/projectStore';
import { COMPONENT_MAP } from '../../model/componentDefs';
import { styleFromProps } from '../../model/styleFromProps';
import type { ComponentItem } from '../../model/types';

type Tab = 'generated' | 'before' | 'inside' | 'after' | 'css';
type PageTab = 'head' | 'bodyStart' | 'bodyEnd' | 'css' | 'js';
type EffectTab = 'animation' | 'transition' | 'transform';

const ANIMATION_PRESETS = [
  'animate-background', 'animate-border', 'animate-border-fade', 'animate-box-shadow',
  'animate-classic-movie-text', 'animate-fade-in', 'animate-fade-in-down', 'animate-fade-in-left',
  'animate-fade-in-right', 'animate-fade-in-up', 'animate-fade-out', 'animate-fire-text-shadow',
  'animate-flash', 'animate-font-size', 'animate-neon-text-shadow', 'animate-opacity',
  'animate-rotate-in-left', 'animate-rotate-in-right', 'animate-rotate-out-left',
  'animate-rotate-out-right', 'animate-scroll-x', 'animate-scroll-y', 'background-position',
  'background-position-bottom-left', 'background-position-top-left', 'bomb-left-out',
  'bomb-right-out', 'bouncing-ball', 'bouncing-ball-move', 'clip-path-box-wipe-enter',
  'clip-path-box-wipe-leave', 'clip-path-chevron-enter', 'clip-path-chevron-leave',
  'clip-path-circle', 'clip-path-down-enter', 'clip-path-down-leave', 'clip-path-ellipse',
  'clip-path-melt-enter', 'clip-path-melt-leave', 'clip-path-polygon', 'clip-path-rotate',
  'clip-path-shutters', 'clip-path-spotlight', 'clip-path-star', 'fall', 'filter-blur-in',
  'filter-blur-out', 'filter-brightness', 'filter-contrast', 'filter-grayscale',
  'filter-hue-rotate', 'filter-invert', 'filter-saturate', 'filter-sepia', 'flip', 'flip-in',
  'flip-out', 'focus-in', 'focus-out', 'fold', 'funny-in', 'funny-out', 'heartbeat-1',
  'heartbeat-2', 'hole-in', 'hole-out', 'jello-horizontal', 'jello-vertical',
  'kenburns-bottom-left', 'kenburns-top-right', 'magic-in', 'magic-out', 'newspaper',
  'open-down-left', 'open-down-right', 'perspective-down', 'perspective-left',
  'perspective-right', 'perspective-up', 'pop', 'puff-in', 'puff-out', 'push',
  'rainbow-background', 'rainbow-dimmer', 'rainbow-text', 'rotate-down', 'rotate-left',
  'rotate-right', 'rotate-up', 'scale-in-horizontal-center', 'scale-in-vertical-center',
  'shadow-left-right', 'shadow-scale', 'shadow-top-bottom', 'slide-fall', 'slide-down-in',
  'slide-in-blurred-bottom', 'slide-in-blurred-top', 'slide-in-elliptic-bottom',
  'slide-in-elliptic-top', 'slide-left-in', 'slide-out-blurred-bottom',
  'slide-out-blurred-top', 'slide-out-elliptic-bottom', 'slide-out-elliptic-top',
  'slide-right-in', 'slide-up-in', 'super-scaled-in', 'super-scaled-out', 'swap',
  'swash-in', 'swash-out', 'swoop-in', 'swoop-out', 'text-letterspacing-blur-out',
  'text-letterspacing-bottom', 'text-letterspacing-contract', 'text-letterspacing-expand',
  'text-letterspacing-focus-in', 'transform-rotate-in', 'transform-rotate-out',
  'transform-scale', 'transform-scale-in', 'transform-scale-out', 'transform-shake',
  'transform-shiver', 'transform-skew', 'transform-spring', 'transform-swing',
  'transform-tada', 'transform-wiggle', 'transform-wobble', 'transform-wobble-bottom',
  'transform-wobble-center', 'transform-wobble-top', 'transform-zoom-in-down',
  'transform-zoom-in-left', 'transform-zoom-in-right', 'transform-zoom-in-up',
  'turbine', 'turbine-in', 'turbine-out', 'twister-down-in', 'twister-down-out',
  'twister-up-in', 'twister-up-out', 'unfold', 'vanish-in', 'vanish-out',
];

const TRANSITION_PROPS = [
  'all', 'background-color', 'border-color', 'border-radius', 'box-shadow', 'color',
  'filter', 'height', 'left', 'letter-spacing', 'opacity', 'top', 'transform', 'width',
];

const TRANSITION_TRIGGERS = [
  '(default)', 'active', 'checked', 'clicked', 'disabled', 'enabled', 'focus',
  'focus-within', 'hover', 'indeterminate', 'target', 'visited', 'scroll',
  'mouseenter', 'mouseleave', 'dblclick', 'keydown', 'keyup', 'load', 'submit',
  'input', 'change',
];

const CSS_PROPERTIES = [
  'background-color', 'border-color', 'border-radius', 'box-shadow', 'clip-path',
  'color', 'filter', 'font-size', 'height', 'letter-spacing', 'opacity',
  'text-shadow', 'transform', 'width',
];

interface AnimationKeyframe {
  position: number;
  property: string;
  value: string;
}

interface AnimationDefinition {
  name: string;
  alias: string;
  keyframes: AnimationKeyframe[];
}

type AnimationView = 'main' | 'manager' | 'editor' | 'keyframe';

function parseAnimationDefinitions(raw: unknown): AnimationDefinition[] {
  try {
    const list = JSON.parse(String(raw || '[]'));
    if (!Array.isArray(list)) return [];
    return list
      .map((item) => ({
        name: String(item?.name || '').trim(),
        alias: String(item?.alias || '').trim(),
        keyframes: Array.isArray(item?.keyframes)
          ? item.keyframes.map((kf: any) => ({
              position: Math.max(0, Math.min(100, Number(kf?.position) || 0)),
              property: String(kf?.property || 'opacity'),
              value: String(kf?.value || ''),
            }))
          : [],
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
}

function customKeyframesCss(def: AnimationDefinition): string {
  const name = def.name || 'custom-animation';
  const frames = [...def.keyframes]
    .sort((a, b) => a.position - b.position)
    .map((kf) => `${kf.position}% { ${kf.property}: ${kf.value || 'initial'}; }`)
    .join(' ');
  return `@keyframes ${name} { ${frames || '0% { opacity: 0; } 100% { opacity: 1; }'} }`;
}

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function previewKeyframesFor(name: string): string {
  if (/rotate|spin|turbine|twister/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: rotate(-180deg) scale(.85); } to { opacity: 1; transform: rotate(0) scale(1); } }`;
  }
  if (/scale|zoom|puff|pop|heartbeat|pulse/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: scale(.45); } 60% { opacity: 1; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }`;
  }
  if (/left/i.test(name)) return `@keyframes ${name} { from { opacity: 0; transform: translateX(-80px); } to { opacity: 1; transform: translateX(0); } }`;
  if (/right/i.test(name)) return `@keyframes ${name} { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }`;
  if (/down|bottom|fall/i.test(name)) return `@keyframes ${name} { from { opacity: 0; transform: translateY(-80px); } to { opacity: 1; transform: translateY(0); } }`;
  if (/up|top/i.test(name)) return `@keyframes ${name} { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }`;
  if (/blur/i.test(name)) return `@keyframes ${name} { from { opacity: 0; filter: blur(12px); } to { opacity: 1; filter: blur(0); } }`;
  if (/background|rainbow/i.test(name)) return `@keyframes ${name} { from { background-color: #8f8f8f; } to { background-color: #0d99ff; } }`;
  return `@keyframes ${name} { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`;
}

function DialogShell({
  title,
  onClose,
  width = 760,
  children,
}: {
  title: string;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="dlg-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dlg code-dlg" style={{ width }}>
        <div className="dlg-titlebar">
          <span className="dlg-title">{title}</span>
          <button className="dlg-close" onClick={onClose} title="Close">
            x
          </button>
        </div>
        <div className="dlg-body">{children}</div>
      </div>
    </div>
  );
}

function cssDecls(css: Record<string, string>) {
  return Object.entries(css)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
}

function generatedObjectHtml(cmp: ComponentItem) {
  const def = COMPONENT_MAP[cmp.type];
  const id = String(cmp.props.domId || cmp.id);
  const cls = ['sb-cmp', cmp.props.cssClass].filter(Boolean).join(' ');
  const style = cssDecls({
    position: 'absolute',
    left: `${cmp.x}px`,
    top: `${cmp.y}px`,
    width: `${cmp.width}px`,
    height: `${cmp.height}px`,
    ...styleFromProps(cmp.props),
  });
  const attrs = String(cmp.props.customAttributes || '').trim();
  return `<div id="${id}" class="${cls}" style="${style}"${attrs ? ` ${attrs}` : ''}>
  <!-- ${def?.label ?? cmp.type} generated content -->
</div>`;
}

function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="code-tabs">
      {tabs.map((t) => (
        <button key={t.id} className={value === t.id ? 'active' : ''} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function CodeArea({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  return (
    <textarea
      className="code-dlg-editor"
      value={value}
      readOnly={readOnly}
      spellCheck={false}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}

function ObjectHtmlDialog({ componentId }: { componentId: string }) {
  const page = useCurrentPage();
  const close = useProjectStore((s) => s.closeCodeDialog);
  const updateProps = useProjectStore((s) => s.updateProps);
  const cmp = page.components.find((c) => c.id === componentId);
  const [tab, setTab] = useState<Tab>('generated');
  const [before, setBefore] = useState(() => String(cmp?.props.objectBeforeHtml ?? ''));
  const [inside, setInside] = useState(() => String(cmp?.props.customAttributes ?? ''));
  const [after, setAfter] = useState(() => String(cmp?.props.objectAfterHtml ?? ''));
  const [css, setCss] = useState(() => String(cmp?.props.customCss ?? ''));

  if (!cmp) return null;

  const save = () => {
    updateProps(componentId, {
      objectBeforeHtml: before,
      customAttributes: inside,
      objectAfterHtml: after,
      customCss: css,
    });
    close();
  };

  return (
    <DialogShell title="Object HTML" onClose={close} width={920}>
      <label className="code-dlg-label">Generated HTML:</label>
      <CodeArea value={generatedObjectHtml(cmp)} readOnly />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'generated', label: 'Generated' },
          { id: 'before', label: 'Before Tag' },
          { id: 'inside', label: 'Inside Tag' },
          { id: 'after', label: 'After Tag' },
          { id: 'css', label: 'Custom CSS' },
        ]}
      />
      {tab === 'generated' && <CodeArea value={generatedObjectHtml(cmp)} readOnly />}
      {tab === 'before' && <CodeArea value={before} onChange={setBefore} />}
      {tab === 'inside' && <CodeArea value={inside} onChange={setInside} />}
      {tab === 'after' && <CodeArea value={after} onChange={setAfter} />}
      {tab === 'css' && <CodeArea value={css} onChange={setCss} />}
      <div className="dlg-actions">
        <button className="dlg-btn-primary" onClick={save}>
          OK
        </button>
        <button onClick={close}>Cancel</button>
      </div>
    </DialogShell>
  );
}

function PageHtmlDialog() {
  const page = useCurrentPage();
  const close = useProjectStore((s) => s.closeCodeDialog);
  const updatePageProps = useProjectStore((s) => s.updatePageProps);
  const [tab, setTab] = useState<PageTab>('head');
  const [head, setHead] = useState(page.headCode ?? '');
  const [bodyStart, setBodyStart] = useState(page.bodyStartCode ?? '');
  const [bodyEnd, setBodyEnd] = useState(page.bodyEndCode ?? '');
  const [css, setCss] = useState(page.cssCode ?? '');
  const [js, setJs] = useState(page.pageCode ?? '');

  const save = () => {
    updatePageProps(page.id, {
      headCode: head,
      bodyStartCode: bodyStart,
      bodyEndCode: bodyEnd,
      cssCode: css,
      pageCode: js,
    });
    close();
  };

  return (
    <DialogShell title="Page HTML / Code" onClose={close} width={920}>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'head', label: 'Head' },
          { id: 'bodyStart', label: 'Body Start' },
          { id: 'bodyEnd', label: 'Body End' },
          { id: 'css', label: 'Page CSS' },
          { id: 'js', label: 'Page JavaScript' },
        ]}
      />
      {tab === 'head' && <CodeArea value={head} onChange={setHead} />}
      {tab === 'bodyStart' && <CodeArea value={bodyStart} onChange={setBodyStart} />}
      {tab === 'bodyEnd' && <CodeArea value={bodyEnd} onChange={setBodyEnd} />}
      {tab === 'css' && <CodeArea value={css} onChange={setCss} />}
      {tab === 'js' && <CodeArea value={js} onChange={setJs} />}
      <div className="dlg-actions">
        <button className="dlg-btn-primary" onClick={save}>
          OK
        </button>
        <button onClick={close}>Cancel</button>
      </div>
    </DialogShell>
  );
}

function EffectManagerDialog({ componentId, initialTab = 'animation' }: { componentId: string; initialTab?: EffectTab }) {
  const page = useCurrentPage();
  const close = useProjectStore((s) => s.closeCodeDialog);
  const updateProps = useProjectStore((s) => s.updateProps);
  const cmp = page.components.find((c) => c.id === componentId);
  const [tab, setTab] = useState<EffectTab>(initialTab);
  const [view, setView] = useState<AnimationView>('main');
  const [preset, setPreset] = useState(() => String(cmp?.props.animationPreset || 'animate-background'));
  const [duration, setDuration] = useState(() => Number(cmp?.props.animationDuration ?? 1000));
  const [delay, setDelay] = useState(() => Number(cmp?.props.animationDelay ?? 0));
  const [count, setCount] = useState(() => String(cmp?.props.animationIterationCount ?? '-1'));
  const [direction, setDirection] = useState(() => String(cmp?.props.animationDirection ?? 'normal'));
  const [easing, setEasing] = useState(() => String(cmp?.props.animationTimingFunction ?? 'linear'));
  const [fill, setFill] = useState(() => String(cmp?.props.animationFillMode ?? 'both'));
  const [play, setPlay] = useState(() => String(cmp?.props.animationPlayState ?? 'running'));
  const [definitions, setDefinitions] = useState<AnimationDefinition[]>(() => parseAnimationDefinitions(cmp?.props.animationDefinitions));
  const [showAliases, setShowAliases] = useState(() => Boolean(cmp?.props.animationUseAliases));
  const [search, setSearch] = useState('');
  const [selectedDef, setSelectedDef] = useState(() => String(cmp?.props.animationPreset || 'animate-background'));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftDef, setDraftDef] = useState<AnimationDefinition>({ name: 'custom-animation', alias: 'Custom Animation', keyframes: [{ position: 0, property: 'opacity', value: '0' }, { position: 100, property: 'opacity', value: '1' }] });
  const [editingKeyframeIndex, setEditingKeyframeIndex] = useState<number | null>(null);
  const [draftKeyframe, setDraftKeyframe] = useState<AnimationKeyframe>({ position: 0, property: 'opacity', value: '1' });
  const [transitionTrigger, setTransitionTrigger] = useState(() => String(cmp?.props.transitionTrigger ?? 'hover'));
  const [transitionProp, setTransitionProp] = useState(() => String(cmp?.props.transitionProperty ?? 'background-color'));
  const [transitionValue, setTransitionValue] = useState(() => String(cmp?.props.transitionValue ?? ''));
  const [transitionDuration, setTransitionDuration] = useState(() => Number(cmp?.props.transitionDuration ?? 500));
  const [transitionDelay, setTransitionDelay] = useState(() => Number(cmp?.props.transitionDelay ?? 0));
  const [transitionEasing, setTransitionEasing] = useState(() => String(cmp?.props.transitionTimingFunction ?? 'linear'));
  const [translateX, setTranslateX] = useState(() => Number(cmp?.props.transformTranslateX ?? 0));
  const [translateY, setTranslateY] = useState(() => Number(cmp?.props.transformTranslateY ?? 0));
  const [scale, setScale] = useState(() => Number(cmp?.props.transformScale ?? 1));
  const [rotate, setRotate] = useState(() => Number(cmp?.props.transformRotate ?? 0));
  const [skewX, setSkewX] = useState(() => Number(cmp?.props.transformSkewX ?? 0));
  const [skewY, setSkewY] = useState(() => Number(cmp?.props.transformSkewY ?? 0));

  const animationCss = useMemo(() => `${preset} ${duration}ms ${easing} ${delay}ms ${count === '-1' ? 'infinite' : count} ${direction} ${fill}`, [preset, duration, easing, delay, count, direction, fill]);
  const transitionCss = useMemo(() => `${transitionProp} ${transitionDuration}ms ${transitionEasing} ${transitionDelay}ms`, [transitionProp, transitionDuration, transitionEasing, transitionDelay]);
  const transformCss = useMemo(() => `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg)`, [translateX, translateY, scale, rotate, skewX, skewY]);
  const animationOptions = useMemo(() => dedupeStrings([...ANIMATION_PRESETS, ...definitions.map((d) => d.name)]), [definitions]);
  const managerRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const custom = definitions.map((d) => ({ name: d.name, alias: d.alias, custom: true }));
    const built = ANIMATION_PRESETS.map((name) => ({ name, alias: name.replace(/^animate-/, '').replace(/-/g, ' '), custom: false }));
    return [...custom, ...built].filter((r) => !q || r.name.toLowerCase().includes(q) || r.alias.toLowerCase().includes(q));
  }, [definitions, search]);

  if (!cmp) return null;

  const selectedCustomIndex = definitions.findIndex((d) => d.name === selectedDef);
  const selectedPresetDef = definitions.find((d) => d.name === preset);
  const previewCss = selectedPresetDef ? customKeyframesCss(selectedPresetDef) : previewKeyframesFor(preset);

  const openEditor = (index: number | null, source?: AnimationDefinition) => {
    setEditingIndex(index);
    setDraftDef(source ? { name: source.name, alias: source.alias, keyframes: source.keyframes.map((kf) => ({ ...kf })) } : { name: 'custom-animation', alias: 'Custom Animation', keyframes: [{ position: 0, property: 'opacity', value: '0' }, { position: 100, property: 'opacity', value: '1' }] });
    setView('editor');
  };

  const saveEditor = () => {
    const clean = { ...draftDef, name: (draftDef.name || 'custom-animation').trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'custom-animation', keyframes: draftDef.keyframes.length ? draftDef.keyframes : [{ position: 100, property: 'opacity', value: '1' }] };
    setDefinitions((items) => editingIndex === null ? [...items, clean] : items.map((item, index) => index === editingIndex ? clean : item));
    setPreset(clean.name);
    setSelectedDef(clean.name);
    setView('manager');
  };

  const openKeyframe = (index: number | null) => {
    setEditingKeyframeIndex(index);
    setDraftKeyframe(index === null ? { position: 0, property: 'opacity', value: '1' } : { ...draftDef.keyframes[index] });
    setView('keyframe');
  };

  const saveKeyframe = () => {
    const clean = { position: Math.max(0, Math.min(100, Number(draftKeyframe.position) || 0)), property: draftKeyframe.property || 'opacity', value: draftKeyframe.value };
    setDraftDef((def) => ({ ...def, keyframes: (editingKeyframeIndex === null ? [...def.keyframes, clean] : def.keyframes.map((kf, index) => index === editingKeyframeIndex ? clean : kf)).sort((a, b) => a.position - b.position) }));
    setView('editor');
  };

  const save = () => {
    const patch: Record<string, unknown> = {};
    if (tab === 'animation') Object.assign(patch, { animationPreset: preset, animationDuration: duration, animationDelay: delay, animationIterationCount: count, animationDirection: direction, animationTimingFunction: easing, animationFillMode: fill, animationPlayState: play, animation: animationCss, animationDefinitions: JSON.stringify(definitions), animationUseAliases: showAliases });
    if (tab === 'transition') Object.assign(patch, { transitionTrigger, transitionProperty: transitionProp, transitionValue, transitionDuration, transitionDelay, transitionTimingFunction: transitionEasing, transition: transitionCss });
    if (tab === 'transform') Object.assign(patch, { transformTranslateX: translateX, transformTranslateY: translateY, transformScale: scale, transformRotate: rotate, transformSkewX: skewX, transformSkewY: skewY, transform: transformCss });
    updateProps(componentId, patch);
    close();
  };

  const title = view === 'manager' ? 'Animation Manager' : view === 'editor' || view === 'keyframe' ? 'Animation' : tab[0].toUpperCase() + tab.slice(1);

  return (
    <DialogShell title={title} onClose={close} width={view === 'manager' ? 820 : 760}>
      <style>{view === 'editor' ? customKeyframesCss(draftDef) : previewCss}</style>
      {view === 'main' && (
        <Tabs value={tab} onChange={setTab} tabs={[{ id: 'animation', label: 'Animation' }, { id: 'transition', label: 'Transition' }, { id: 'transform', label: 'Transform' }]} />
      )}

      {tab === 'animation' && view === 'main' && (
        <>
          <fieldset className="dlg-fieldset"><legend>Object</legend><div className="anim-grid anim-grid-compact"><label>ID:</label><input readOnly value={String(cmp.props.domId || cmp.id)} /></div></fieldset>
          <fieldset className="dlg-fieldset">
            <legend>Animation</legend>
            <div className="anim-form-two">
              <label>Animation:</label>
              <select value={preset} onChange={(e) => setPreset(e.target.value)}>{animationOptions.map((name) => { const def = definitions.find((d) => d.name === name); return <option key={name} value={name}>{showAliases && def?.alias ? def.alias : name}</option>; })}</select>
              <button type="button" onClick={() => setView('manager')}>Animation Manager...</button>
              <label>Duration:</label><input type="number" min={0} value={duration} onChange={(e) => setDuration(Number(e.target.value) || 0)} />
              <label>Delay:</label><input type="number" min={0} value={delay} onChange={(e) => setDelay(Number(e.target.value) || 0)} />
              <label>Iteration count:</label><input value={count} onChange={(e) => setCount(e.target.value)} />
              <label>Direction:</label><select value={direction} onChange={(e) => setDirection(e.target.value)}>{['normal', 'reverse', 'alternate', 'alternate-reverse'].map((v) => <option key={v}>{v}</option>)}</select>
              <label>Fill mode:</label><select value={fill} onChange={(e) => setFill(e.target.value)}>{['none', 'forwards', 'backwards', 'both'].map((v) => <option key={v}>{v}</option>)}</select>
              <label>Easing:</label><select value={easing} onChange={(e) => setEasing(e.target.value)}>{['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'steps(4, end)', 'cubic-bezier(.4, 0, .2, 1)'].map((v) => <option key={v}>{v}</option>)}</select>
              <label>Play state:</label><select value={play} onChange={(e) => setPlay(e.target.value)}>{['running', 'paused'].map((v) => <option key={v}>{v}</option>)}</select>
            </div>
          </fieldset>
        </>
      )}

      {tab === 'animation' && view === 'manager' && (
        <>
          <div className="anim-manager-header"><label>Search:</label><input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <div className="anim-manager-panel">
            <div className="anim-table-scroll">
              <table className="anim-manager-table"><thead><tr><th>Name</th><th>Alias</th></tr></thead><tbody>{managerRows.map((row) => <tr key={`${row.custom}-${row.name}`} className={selectedDef === row.name ? 'selected' : ''} onClick={() => setSelectedDef(row.name)} onDoubleClick={() => { const index = definitions.findIndex((d) => d.name === row.name); if (index >= 0) openEditor(index, definitions[index]); }}><td>{row.name}</td><td>{row.alias}</td></tr>)}</tbody></table>
            </div>
            <div className="anim-manager-side">
              <button type="button" onClick={() => openEditor(null)}>Add...</button>
              <button type="button" disabled={selectedCustomIndex < 0} onClick={() => openEditor(selectedCustomIndex, definitions[selectedCustomIndex])}>Edit...</button>
              <button type="button" onClick={() => { const base = definitions[selectedCustomIndex] || { name: selectedDef, alias: selectedDef.replace(/-/g, ' '), keyframes: [{ position: 0, property: 'opacity', value: '0' }, { position: 100, property: 'opacity', value: '1' }] }; openEditor(null, { name: `${base.name}-copy`, alias: `${base.alias || base.name} Copy`, keyframes: base.keyframes.map((kf) => ({ ...kf })) }); }}>Copy...</button>
              <button type="button" disabled={selectedCustomIndex < 0} onClick={() => setDefinitions((items) => items.filter((_, index) => index !== selectedCustomIndex))}>Remove</button>
              <button type="button" disabled>Merge</button>
              <span />
              <button type="button" disabled={selectedCustomIndex <= 0} onClick={() => setDefinitions((items) => { const next = [...items]; [next[selectedCustomIndex - 1], next[selectedCustomIndex]] = [next[selectedCustomIndex], next[selectedCustomIndex - 1]]; return next; })}>Move Up</button>
              <button type="button" disabled={selectedCustomIndex < 0 || selectedCustomIndex >= definitions.length - 1} onClick={() => setDefinitions((items) => { const next = [...items]; [next[selectedCustomIndex], next[selectedCustomIndex + 1]] = [next[selectedCustomIndex + 1], next[selectedCustomIndex]]; return next; })}>Move Down</button>
              <button type="button" onClick={() => setDefinitions((items) => [...items].sort((a, b) => a.name.localeCompare(b.name)))}>Sort</button>
            </div>
          </div>
          <div className="anim-manager-footer"><label><input type="checkbox" checked={showAliases} onChange={(e) => setShowAliases(e.target.checked)} /> Display aliases in user interface</label><div className="dlg-actions"><button className="dlg-btn-primary" type="button" onClick={() => { setPreset(selectedDef); setView('main'); }}>OK</button><button type="button" onClick={() => setView('main')}>Cancel</button><button type="button">Help</button></div></div>
        </>
      )}

      {tab === 'animation' && view === 'editor' && (
        <>
          <fieldset className="dlg-fieldset"><legend>General</legend><div className="anim-grid anim-grid-compact"><label>Name:</label><input value={draftDef.name} onChange={(e) => setDraftDef((d) => ({ ...d, name: e.target.value }))} /><label>Alias:</label><input value={draftDef.alias} onChange={(e) => setDraftDef((d) => ({ ...d, alias: e.target.value }))} /></div></fieldset>
          <fieldset className="dlg-fieldset"><legend>Key Frames</legend><div className="anim-manager-panel anim-keyframe-panel"><div className="anim-table-scroll"><table className="anim-manager-table"><thead><tr><th>Position</th><th>Property</th><th>Value</th></tr></thead><tbody>{draftDef.keyframes.map((kf, index) => <tr key={`${kf.position}-${kf.property}-${index}`} onDoubleClick={() => openKeyframe(index)}><td>{kf.position}</td><td>{kf.property}</td><td>{kf.value}</td></tr>)}</tbody></table></div><div className="anim-manager-side"><button type="button" onClick={() => openKeyframe(null)}>Add...</button><button type="button" disabled={!draftDef.keyframes.length} onClick={() => openKeyframe(0)}>Edit...</button><button type="button" disabled={!draftDef.keyframes.length} onClick={() => setDraftDef((d) => ({ ...d, keyframes: d.keyframes.slice(0, -1) }))}>Remove</button><button type="button" disabled={!draftDef.keyframes.length} onClick={() => setDraftDef((d) => ({ ...d, keyframes: [] }))}>Remove All</button></div></div></fieldset>
          <div className="anim-preview"><div style={{ animation: `${draftDef.name} 1000ms linear 0ms infinite normal both` }} /></div>
          <div className="dlg-actions"><button className="dlg-btn-primary" type="button" onClick={saveEditor}>OK</button><button type="button" onClick={() => setView('manager')}>Cancel</button></div>
        </>
      )}

      {tab === 'animation' && view === 'keyframe' && (
        <>
          <div className="anim-grid anim-grid-compact keyframe-dialog-grid">
            <label>Key Frame:</label><div className="dlg-field-row"><input type="number" min={0} max={100} value={draftKeyframe.position} onChange={(e) => setDraftKeyframe((kf) => ({ ...kf, position: Number(e.target.value) || 0 }))} /><span className="dlg-unit">(0 - 100%)</span></div>
            <label>Property:</label><select value={draftKeyframe.property} onChange={(e) => setDraftKeyframe((kf) => ({ ...kf, property: e.target.value }))}>{CSS_PROPERTIES.map((v) => <option key={v}>{v}</option>)}</select>
            <label>Value:</label><input value={draftKeyframe.value} onChange={(e) => setDraftKeyframe((kf) => ({ ...kf, value: e.target.value }))} />
          </div>
          <div className="dlg-actions"><button className="dlg-btn-primary" type="button" onClick={saveKeyframe}>OK</button><button type="button" onClick={() => setView('editor')}>Cancel</button></div>
        </>
      )}

      {tab === 'transition' && view === 'main' && (
        <div className="anim-grid">
          <label>Trigger:</label><select value={transitionTrigger} onChange={(e) => setTransitionTrigger(e.target.value)}>{TRANSITION_TRIGGERS.map((v) => <option key={v}>{v}</option>)}</select><span /><span />
          <label>Duration:</label><input type="number" min={0} value={transitionDuration} onChange={(e) => setTransitionDuration(Number(e.target.value) || 0)} />
          <label>Delay:</label><input type="number" min={0} value={transitionDelay} onChange={(e) => setTransitionDelay(Number(e.target.value) || 0)} />
          <label>Timing:</label><select value={transitionEasing} onChange={(e) => setTransitionEasing(e.target.value)}>{['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'steps(4, end)', 'cubic-bezier(.4, 0, .2, 1)'].map((v) => <option key={v}>{v}</option>)}</select><span /><span />
          <label>Property:</label><select value={transitionProp} onChange={(e) => setTransitionProp(e.target.value)}>{TRANSITION_PROPS.map((v) => <option key={v}>{v}</option>)}</select>
          <label>Value:</label><input value={transitionValue} onChange={(e) => setTransitionValue(e.target.value)} />
        </div>
      )}

      {tab === 'transform' && view === 'main' && (
        <div className="anim-grid">
          <label>Translate X</label><input type="number" value={translateX} onChange={(e) => setTranslateX(Number(e.target.value) || 0)} />
          <label>Translate Y</label><input type="number" value={translateY} onChange={(e) => setTranslateY(Number(e.target.value) || 0)} />
          <label>Scale</label><input type="number" step={0.1} value={scale} onChange={(e) => setScale(Number(e.target.value) || 0)} />
          <label>Rotate</label><input type="number" value={rotate} onChange={(e) => setRotate(Number(e.target.value) || 0)} />
          <label>Skew X</label><input type="number" value={skewX} onChange={(e) => setSkewX(Number(e.target.value) || 0)} />
          <label>Skew Y</label><input type="number" value={skewY} onChange={(e) => setSkewY(Number(e.target.value) || 0)} />
        </div>
      )}

      {view === 'main' && (
        <>
          <div className="anim-preview"><div style={{ animation: tab === 'animation' ? animationCss : undefined, animationPlayState: play, transition: transitionCss, transform: transformCss }} /></div>
          <input className="effect-output" readOnly value={tab === 'animation' ? animationCss : tab === 'transition' ? transitionCss : transformCss} />
          <div className="dlg-actions"><button className="dlg-btn-primary" onClick={save}>OK</button><button onClick={close}>Cancel</button></div>
        </>
      )}
    </DialogShell>
  );
}

export default function CodeDialogs() {
  const dialog = useProjectStore((s) => s.codeDialog);
  if (!dialog) return null;
  if (dialog.kind === 'page-html') return <PageHtmlDialog />;
  if (dialog.kind === 'object-animation') return <EffectManagerDialog componentId={dialog.componentId} initialTab="animation" />;
  if (dialog.kind === 'object-effect') return <EffectManagerDialog componentId={dialog.componentId} initialTab={dialog.tab} />;
  return <ObjectHtmlDialog componentId={dialog.componentId} />;
}
