/**
 * Static-site exporter. Pure functions: takes the in-memory Project model and
 * produces ExportFile entries (one stylesheet + one self-contained HTML
 * document per page). No DOM or Electron APIs — safe to run in the renderer,
 * tests, or Node.
 *
 * Covers every type in src/model/componentDefs.ts (~80 controls) sharing the
 * common property system (styleFromProps handles the CSS side; domId /
 * cssClass / customAttributes / ariaLabel / customCss / hoverCss are
 * export-only and handled here).
 *
 * External services referenced by some widgets (documented at each site):
 *   - qrcode:    api.qrserver.com image API
 *   - youtube:   youtube.com embed player
 *   - facebook:  facebook.com page plugin
 *   - xembed:    platform.twitter.com widgets.js
 *   - map:       openstreetmap.org / maps.google.com embed iframes
 *   - captcha:   google.com/recaptcha or js.hcaptcha.com
 */
import type { ComponentItem, ExportFile, Page, Project } from '../model/types';
import { sortBreakpoints } from '../model/factory';
import { styleFromProps } from '../model/styleFromProps';

/* ---------------------------------------------------------------- helpers */

/** Turn an arbitrary string into a CSS/HTML-safe identifier. */
export function sanitizeIdent(s: string): string {
  let out = String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!out) out = 'page';
  if (/^[0-9]/.test(out)) out = `p-${out}`;
  return out;
}

/** Escape a string for use as HTML text content. */
export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escape a string for use inside a double-quoted HTML attribute. */
function escapeAttr(s: string): string {
  return escapeHtml(s);
}

/** Escape text content and convert newlines to <br>. */
function textToHtml(s: string): string {
  return escapeHtml(s).replace(/\r\n|\r|\n/g, '<br>');
}

function px(n: number | undefined): string {
  return `${Math.round(n ?? 0)}px`;
}

/** The element id used for the HTML id attribute and CSS rule keys. */
function elementId(cmp: ComponentItem): string {
  const domId = String(cmp.props?.domId ?? '').trim();
  return domId ? sanitizeIdent(domId) : cmp.id;
}

/** Non-empty lines of a textarea prop. */
function linesOf(s: unknown): string[] {
  return String(s ?? '')
    .split(/\r\n|\r|\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/** Parse "Label|URL" lines (URL optional). */
function linkLines(s: unknown): { label: string; url: string }[] {
  return linesOf(s).map((l) => {
    const i = l.indexOf('|');
    return i >= 0
      ? { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() }
      : { label: l, url: '' };
  });
}

/** Quote a value as a JS string literal safe to embed inside <script>. */
function jsStr(v: unknown): string {
  return JSON.stringify(String(v ?? '')).replace(/</g, '\\u003c');
}

/* --------------------------------------------------------------- CSS side */

/** Serialize a kebab-case CSS record into `key: value;` declarations. */
function cssDeclarations(css: Record<string, string>): string {
  return Object.entries(css)
    .map(([k, v]) => `${k}: ${v};`)
    .join(' ');
}

const TABLE_TYPES = new Set(['table', 'datagrid', 'dbtable']);

const ALERT_PALETTES: Record<string, { bg: string; fg: string; border: string }> = {
  info: { bg: '#cff4fc', fg: '#055160', border: '#b6effb' },
  success: { bg: '#d1e7dd', fg: '#0f5132', border: '#badbcc' },
  warning: { bg: '#fff3cd', fg: '#664d03', border: '#ffecb5' },
  error: { bg: '#f8d7da', fg: '#842029', border: '#f5c2c7' },
};

const ANIMATION_KEYFRAMES: Record<string, string> = {
  'fade-in': '@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }',
  'fade-out': '@keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }',
  'slide-in-left': '@keyframes slide-in-left { from { transform: translateX(-80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
  'slide-in-right': '@keyframes slide-in-right { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
  'slide-in-up': '@keyframes slide-in-up { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
  'slide-in-down': '@keyframes slide-in-down { from { transform: translateY(-80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }',
  'zoom-in': '@keyframes zoom-in { from { transform: scale(.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
  'zoom-out': '@keyframes zoom-out { from { transform: scale(1.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }',
  'rotate-in': '@keyframes rotate-in { from { transform: rotate(-180deg); opacity: 0; } to { transform: rotate(0); opacity: 1; } }',
  bounce: '@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-30px); } 60% { transform: translateY(-15px); } }',
  pulse: '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }',
  shake: '@keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); } }',
  'flip-in': '@keyframes flip-in { from { transform: perspective(400px) rotateY(90deg); opacity: 0; } to { transform: perspective(400px) rotateY(0); opacity: 1; } }',
  background: '@keyframes background { from { background-color: #8f8f8f; } to { background-color: #0d99ff; } }',
};

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

function parseAnimationDefinitions(raw: unknown): AnimationDefinition[] {
  try {
    const list = JSON.parse(String(raw || '[]'));
    if (!Array.isArray(list)) return [];
    return list
      .map((item) => ({
        name: sanitizeIdent(String(item?.name || '')),
        alias: String(item?.alias || ''),
        keyframes: Array.isArray(item?.keyframes)
          ? item.keyframes.map((kf: any) => ({
              position: Math.max(0, Math.min(100, Number(kf?.position) || 0)),
              property: String(kf?.property || 'opacity').trim(),
              value: String(kf?.value || '').trim(),
            }))
          : [],
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
}

function animationDefinitionCss(def: AnimationDefinition): string {
  const frames = [...def.keyframes]
    .sort((a, b) => a.position - b.position)
    .map((kf) => `${kf.position}% { ${sanitizeIdent(kf.property)}: ${kf.value || 'initial'}; }`)
    .join(' ');
  return `@keyframes ${def.name} { ${frames || '0% { opacity: 0; } 100% { opacity: 1; }'} }`;
}

function animationKeyframesFor(name: string): string {
  if (ANIMATION_KEYFRAMES[name]) return ANIMATION_KEYFRAMES[name];
  if (/rotate|spin|turbine|twister/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: rotate(-180deg) scale(.85); } to { opacity: 1; transform: rotate(0) scale(1); } }`;
  }
  if (/scale|zoom|puff|pop|heartbeat|pulse/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: scale(.45); } 60% { opacity: 1; transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }`;
  }
  if (/left/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: translateX(-80px); } to { opacity: 1; transform: translateX(0); } }`;
  }
  if (/right/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: translateX(80px); } to { opacity: 1; transform: translateX(0); } }`;
  }
  if (/down|bottom|fall/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: translateY(-80px); } to { opacity: 1; transform: translateY(0); } }`;
  }
  if (/up|top/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: translateY(0); } }`;
  }
  if (/blur/i.test(name)) {
    return `@keyframes ${name} { from { opacity: 0; filter: blur(12px); } to { opacity: 1; filter: blur(0); } }`;
  }
  if (/background|rainbow/i.test(name)) {
    return `@keyframes ${name} { from { background-color: #8f8f8f; } to { background-color: #0d99ff; } }`;
  }
  return `@keyframes ${name} { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`;
}

function transitionTriggerSelector(trigger: unknown, sel: string): string {
  switch (String(trigger || 'hover')) {
    case '(default)':
      return sel;
    case 'clicked':
      return `${sel}:active`;
    case 'mouseenter':
      return `${sel}:hover`;
    case 'mouseleave':
      return `${sel}:not(:hover)`;
    case 'active':
    case 'checked':
    case 'disabled':
    case 'enabled':
    case 'focus':
    case 'focus-within':
    case 'hover':
    case 'indeterminate':
    case 'target':
    case 'visited':
      return `${sel}:${String(trigger)}`;
    default:
      return `${sel}.sb-event-${sanitizeIdent(String(trigger))}`;
  }
}

function transitionStateRule(cmp: ComponentItem, elId: string): string | null {
  const prop = String(cmp.props?.transitionProperty || '').trim();
  const value = String(cmp.props?.transitionValue || '').trim();
  if (!prop || !value || prop === 'all') return null;
  const sel = transitionTriggerSelector(cmp.props?.transitionTrigger, `#${elId}`);
  return `${sel} { ${prop}: ${value}; }`;
}

/**
 * Extra per-type declarations merged into the component's base CSS rule, on
 * top of styleFromProps(props). Flex/grid layout types get their display
 * model here so geometry stays on the outer element.
 */
function typeExtraCss(cmp: ComponentItem, props: Record<string, any>): Record<string, string> {
  const css: Record<string, string> = {};
  const gap = Number(props.gap) || 0;
  switch (cmp.type) {
    /* ---- layout ---- */
    case 'row':
      css['display'] = 'flex';
      css['flex-direction'] = 'row';
      if (gap) css['gap'] = `${gap}px`;
      break;
    case 'column':
      css['display'] = 'flex';
      css['flex-direction'] = 'column';
      if (gap) css['gap'] = `${gap}px`;
      break;
    case 'flex': {
      css['display'] = 'flex';
      css['flex-direction'] = String(props.direction || 'row');
      if (gap) css['gap'] = `${gap}px`;
      if (props.justify) css['justify-content'] = String(props.justify);
      if (props.alignItems) css['align-items'] = String(props.alignItems);
      break;
    }
    case 'grid':
    case 'productgrid': {
      css['display'] = 'grid';
      const cols = Math.max(1, Math.floor(Number(props.columns) || 1));
      css['grid-template-columns'] = `repeat(${cols}, 1fr)`;
      if (gap) css['gap'] = `${gap}px`;
      break;
    }
    case 'gallery': {
      css['display'] = 'grid';
      const cols = Math.max(1, Math.floor(Number(props.columns) || 1));
      css['grid-template-columns'] = `repeat(${cols}, 1fr)`;
      if (gap) css['gap'] = `${gap}px`;
      break;
    }
    case 'carousel':
      css['display'] = 'flex';
      css['align-items'] = 'center';
      if (gap) css['gap'] = `${gap}px`;
      break;
    case 'navbar':
      css['display'] = 'flex';
      css['align-items'] = 'center';
      css['justify-content'] = 'space-between';
      break;
    case 'tabs':
    case 'quantity':
      css['display'] = 'flex';
      break;
    case 'searchbox':
      css['display'] = 'flex';
      break;
    case 'socialicons':
      css['display'] = 'flex';
      css['align-items'] = 'center';
      if (gap) css['gap'] = `${gap}px`;
      break;
    case 'sharebuttons':
      css['display'] = 'flex';
      css['align-items'] = 'center';
      if (gap) css['gap'] = `${gap}px`;
      break;
    case 'repeater':
      css['display'] = 'flex';
      css['flex-direction'] = 'column';
      if (gap) css['gap'] = `${gap}px`;
      break;
    /* ---- basic ---- */
    case 'divider':
      css['background-color'] = String(props.color || '#000000');
      css['height'] = `${Number(props.lineThickness) || 1}px`;
      break;
    case 'button':
    case 'submit':
    case 'reset':
    case 'addtocart':
      css['cursor'] = 'pointer';
      break;
    case 'image':
      if (props.objectFit) css['object-fit'] = String(props.objectFit);
      break;
    case 'icon':
    case 'marker':
      css['line-height'] = '1';
      break;
    /* ---- data ---- */
    case 'table':
    case 'datagrid':
    case 'dbtable':
      css['border-collapse'] = 'collapse';
      break;
    /* ---- media ---- */
    case 'video':
      css['object-fit'] = 'contain';
      break;
    /* ---- advanced ---- */
    case 'alert': {
      const pal = ALERT_PALETTES[String(props.kind)] ?? ALERT_PALETTES.info;
      if (!props.backgroundColor) css['background-color'] = pal.bg;
      css['color'] = pal.fg;
      css['border'] = `1px solid ${pal.border}`;
      break;
    }
    /* ---- special ---- */
    case 'cookieconsent':
      // Rendered as a fixed bottom bar regardless of canvas position.
      css['position'] = 'fixed';
      css['left'] = '0';
      css['right'] = '0';
      css['bottom'] = '0';
      css['top'] = 'auto';
      css['width'] = 'auto';
      break;
  }
  if (props.animationPlayState) css['animation-play-state'] = String(props.animationPlayState);
  return css;
}

/**
 * Extra rules keyed off the component id (descendant selectors, state
 * classes). Returned as full `selector { ... }` strings.
 */
function typeExtraRules(cmp: ComponentItem, props: Record<string, any>, elId: string): string[] {
  const rules: string[] = [];
  const sel = `#${elId}`;
  switch (cmp.type) {
    case 'table':
    case 'datagrid':
    case 'dbtable': {
      const bw = Number(props.borderWidth) || 0;
      const bc = String(props.borderColor || '#000000');
      if (bw > 0) rules.push(`${sel} th, ${sel} td { border: ${bw}px solid ${bc}; padding: 4px; }`);
      break;
    }
    case 'navbar':
    case 'sidebar':
      rules.push(`${sel} ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 16px; }`);
      rules.push(`${sel} a { color: inherit; text-decoration: none; }`);
      if (cmp.type === 'sidebar') rules.push(`${sel} ul { flex-direction: column; gap: 8px; }`);
      break;
    case 'menubar':
      rules.push(`${sel} ul { list-style: none; margin: 0; padding: 0; display: flex; gap: 16px; }`);
      break;
    case 'hamburger':
    case 'dropdown':
      rules.push(`${sel} ul { display: none; list-style: none; margin: 4px 0 0; padding: 4px 0; position: absolute; background: #ffffff; border: 1px solid #ced4da; border-radius: 4px; min-width: 140px; z-index: 1000; }`);
      rules.push(`${sel} ul.open { display: block; }`);
      rules.push(`${sel} li a { display: block; padding: 6px 12px; color: #212529; text-decoration: none; }`);
      rules.push(`${sel} li a:hover { background: #f1f3f5; }`);
      break;
    case 'breadcrumb':
      rules.push(`${sel} .sep { margin: 0 6px; opacity: .6; }`);
      rules.push(`${sel} a { color: inherit; }`);
      break;
    case 'pagination':
      rules.push(`${sel} a { padding: 4px 8px; color: inherit; text-decoration: none; }`);
      rules.push(`${sel} a.active { font-weight: bold; text-decoration: underline; }`);
      break;
    case 'tabs':
      rules.push(`${sel} button { padding: 6px 14px; cursor: pointer; border: 1px solid ${String(props.borderColor || '#dee2e6')}; background: transparent; }`);
      rules.push(`${sel} button.active { font-weight: bold; background: #ffffff; }`);
      break;
    case 'gallery':
    case 'slideshow':
      rules.push(`${sel} img { width: 100%; height: 100%; object-fit: cover; display: block; }`);
      break;
    case 'carousel':
      rules.push(`${sel} img { height: 100%; width: auto; object-fit: cover; }`);
      break;
    case 'accordion':
      rules.push(`${sel} .sb-acc-h { display: block; width: 100%; text-align: left; padding: 8px 10px; cursor: pointer; background: #f1f3f5; border: 0; border-bottom: 1px solid #dee2e6; font: inherit; }`);
      rules.push(`${sel} .sb-acc-b { padding: 8px 10px; }`);
      break;
    case 'modal':
      rules.push(`${sel} .sb-modal-head { display: flex; justify-content: space-between; align-items: center; font-weight: bold; padding: 10px 14px; border-bottom: 1px solid #dee2e6; }`);
      rules.push(`${sel} .sb-modal-close { border: 0; background: none; cursor: pointer; font-size: 16px; }`);
      rules.push(`${sel} .sb-modal-body { padding: 14px; }`);
      break;
    case 'timeline':
      rules.push(`${sel} ul { list-style: none; margin: 0; padding: 0; }`);
      rules.push(`${sel} li { margin-bottom: 8px; }`);
      break;
    case 'treeview':
      rules.push(`${sel} ul { list-style: none; margin: 0; padding-left: 16px; }`);
      break;
    case 'socialicons':
      rules.push(`${sel} a { display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #ffffff; text-decoration: none; font-weight: bold; }`);
      break;
    case 'sharebuttons':
      rules.push(`${sel} a { padding: 6px 12px; border-radius: 4px; color: #ffffff; text-decoration: none; font-size: 13px; }`);
      break;
    case 'card':
    case 'productcard':
      rules.push(`${sel} img { width: 100%; display: block; }`);
      break;
    case 'productgrid':
      rules.push(`${sel} .sb-product { border: 1px solid #dee2e6; border-radius: 8px; padding: 10px; background: #ffffff; }`);
      rules.push(`${sel} .sb-product img { width: 100%; display: block; }`);
      break;
    case 'quantity':
      rules.push(`${sel} button { width: 30px; cursor: pointer; border: 0; background: #e9ecef; font-size: 16px; }`);
      rules.push(`${sel} input { flex: 1; text-align: center; border: 0; min-width: 0; }`);
      break;
    case 'login':
    case 'register':
    case 'dbform':
      rules.push(`${sel} label { display: block; margin: 0 0 4px; font-size: 12px; }`);
      rules.push(`${sel} input, ${sel} textarea { display: block; width: 100%; margin: 0 0 10px; padding: 6px 8px; border: 1px solid #ced4da; border-radius: 4px; box-sizing: border-box; font: inherit; }`);
      rules.push(`${sel} button { padding: 8px 16px; cursor: pointer; }`);
      break;
    case 'profile':
      rules.push(`${sel} { display: flex; align-items: center; gap: 10px; }`);
      rules.push(`${sel} img, ${sel} .sb-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background: #adb5bd; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 20px; }`);
      break;
    case 'calendar':
      rules.push(`${sel} table { width: 100%; height: 100%; border-collapse: collapse; }`);
      rules.push(`${sel} td, ${sel} th { text-align: center; padding: 2px; font-size: 12px; }`);
      break;
    case 'cookieconsent':
      rules.push(`${sel} { display: flex; align-items: center; justify-content: space-between; }`);
      rules.push(`${sel} button { margin-left: 12px; cursor: pointer; padding: 6px 14px; }`);
      break;
    case 'progress':
      rules.push(`${sel} { overflow: hidden; }`);
      break;
  }
  return rules;
}

/** Full CSS record for a component at a given geometry/props set. */
function componentCss(
  cmp: ComponentItem,
  geom: { x: number; y: number; width: number; height: number },
  props: Record<string, any>
): Record<string, string> {
  return {
    // styleFromProps only emits position when it is not 'absolute', so a
    // 'fixed'/'sticky' prop overrides the default below via the spread.
    position: 'absolute',
    left: px(geom.x),
    top: px(geom.y),
    width: px(geom.width),
    height: px(geom.height),
    ...styleFromProps(props),
    ...typeExtraCss(cmp, props),
  };
}

function pageClassName(page: Page): string {
  return `sb-page-${sanitizeIdent(page.name)}`;
}

function buildStylesheet(project: Project): string {
  const lines: string[] = [];

  // Reset-ish base shared by every page.
  lines.push('/* Generated by SiteBuilder — shared stylesheet */');
  lines.push('body { margin: 0; font-family: Arial, sans-serif; }');
  lines.push('.sb-page { position: relative; margin: 0 auto; }');
  lines.push('.sb-cmp { box-sizing: border-box; }');

  // Tooltip widget styling (pure CSS, driven by the data-tip attribute).
  const hasTooltip = project.pages.some((pg) =>
    pg.components.some((c) => c.type === 'tooltip' && !c.hidden)
  );
  if (hasTooltip) {
    lines.push('.sb-tooltip:hover::after { content: attr(data-tip); position: absolute; left: 0; top: 100%; background: #212529; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 12px; white-space: nowrap; z-index: 9999; }');
  }
  const usedAnimations = new Set<string>();
  const customAnimations = new Map<string, AnimationDefinition>();
  for (const page of project.pages) {
    for (const cmp of page.components) {
      const preset = String(cmp.props?.animationPreset ?? '').trim();
      if (preset) usedAnimations.add(sanitizeIdent(preset));
      for (const def of parseAnimationDefinitions(cmp.props?.animationDefinitions)) {
        customAnimations.set(def.name, def);
      }
    }
  }
  for (const preset of usedAnimations) {
    lines.push(customAnimations.has(preset) ? animationDefinitionCss(customAnimations.get(preset)!) : animationKeyframesFor(preset));
  }
  lines.push('');

  // Per-page wrapper rules.
  for (const page of project.pages) {
    lines.push(
      `.${pageClassName(page)} { width: ${px(page.width)}; min-height: ${px(page.height)}; background: ${page.backgroundColor || '#ffffff'}; }`
    );
  }
  lines.push('');

  // Per-component rules (base geometry + style props).
  for (const page of project.pages) {
    if (page.components.length === 0) continue;
    lines.push(`/* --- ${page.name} --- */`);
    for (const cmp of page.components) {
      if (cmp.hidden) continue; // hidden components are excluded entirely
      const elId = elementId(cmp);
      const css = componentCss(cmp, { x: cmp.x, y: cmp.y, width: cmp.width, height: cmp.height }, cmp.props);
      let decls = cssDeclarations(css);
      // Custom CSS: user declarations appended verbatim inside the base rule.
      const customCss = String(cmp.props.customCss ?? '').trim();
      if (customCss) decls += ` ${customCss}`;
      lines.push(`#${elId} { ${decls} }`);
      // Hover CSS: user declarations verbatim in a :hover rule.
      const hoverCss = String(cmp.props.hoverCss ?? '').trim();
      if (hoverCss) lines.push(`#${elId}:hover { ${hoverCss} }`);
      const transitionRule = transitionStateRule(cmp, elId);
      if (transitionRule) lines.push(transitionRule);
      lines.push(...typeExtraRules(cmp, cmp.props, elId));
    }
    lines.push('');
  }

  // Responsive breakpoints, widest first so narrower rules win by cascade.
  const mode = project.breakpointMode ?? 'smaller'; // old files lack the field
  const bps = sortBreakpoints(project.breakpoints);
  for (const bp of bps) {
    const inner: string[] = [];
    if (typeof bp.fontSize === 'number') {
      inner.push(`  html { font-size: ${bp.fontSize}px }`);
    }
    for (const page of project.pages) {
      inner.push(
        `  .${pageClassName(page)} { width: 100%; max-width: ${px(bp.maxWidth)}; min-height: ${px(page.height)}; }`
      );
      for (const cmp of page.components) {
        if (cmp.hidden) continue; // base-hidden components are excluded entirely
        const elId = elementId(cmp);
        if (cmp.hiddenIn?.includes(bp.id)) {
          inner.push(`  #${elId} { display: none }`);
          continue;
        }
        const ov = cmp.overrides?.[bp.id];
        if (!ov) continue;
        const geom = {
          x: ov.x ?? cmp.x,
          y: ov.y ?? cmp.y,
          width: ov.width ?? cmp.width,
          height: ov.height ?? cmp.height,
        };
        const mergedProps = { ...cmp.props, ...(ov.props ?? {}) };
        const css = componentCss(cmp, geom, mergedProps);
        // position: absolute is already set in the base rule — keep media rules lean.
        delete (css as Record<string, string>).position;
        inner.push(`  #${elId} { ${cssDeclarations(css)} }`);
        if (TABLE_TYPES.has(cmp.type)) {
          const bw = Number(mergedProps.borderWidth) || 0;
          const bc = String(mergedProps.borderColor || '#000000');
          if (bw > 0) {
            inner.push(`  #${elId} th, #${elId} td { border: ${bw}px solid ${bc}; }`);
          }
        }
      }
    }
    const feature =
      mode === 'larger' ? `min-width: ${bp.maxWidth}px` : `max-width: ${bp.maxWidth}px`;
    const orientation =
      bp.orientation && bp.orientation !== 'none' ? ` and (orientation: ${bp.orientation})` : '';
    lines.push(`@media (${feature})${orientation} {`);
    lines.push(...inner);
    lines.push('}');
    lines.push('');
  }

  for (const page of project.pages) {
    const cssCode = String(page.cssCode ?? '').trim();
    if (cssCode) {
      lines.push(`/* --- custom CSS: ${page.name} --- */`);
      lines.push(cssCode);
      lines.push('');
    }
  }

  return lines.join('\n');
}

/* ------------------------------------------------------ script generators */
/*
 * Widgets that need behaviour get a compact vanilla-JS snippet, one per
 * component instance, aggregated into a single <script> per page so pages
 * stay self-contained (no external js files, no dependencies).
 */

function toggleScript(elId: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var b=r.querySelector("button"),u=r.querySelector("ul");if(!b||!u)return;b.addEventListener("click",function(){u.classList.toggle("open");});})();`;
}

function slideshowScript(elId: string, interval: number): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var im=r.querySelectorAll("img");if(im.length<2)return;var i=0;setInterval(function(){im[i].style.display="none";i=(i+1)%im.length;im[i].style.display="block";},${Math.max(500, interval)}));})();`;
}

function lightboxScript(elId: string): string {
  return `(function(){var img=document.getElementById(${jsStr(elId)});if(!img)return;img.style.cursor="zoom-in";img.addEventListener("click",function(){var ov=document.createElement("div");ov.style.cssText="position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:99999;cursor:zoom-out";var im=document.createElement("img");im.src=img.src;im.style.cssText="max-width:90%;max-height:90%";ov.appendChild(im);ov.addEventListener("click",function(){ov.remove();});document.body.appendChild(ov);});})();`;
}

function accordionScript(elId: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var hs=r.querySelectorAll(".sb-acc-h");for(var i=0;i<hs.length;i++)(function(h){h.addEventListener("click",function(){var b=h.nextElementSibling;if(!b)return;b.style.display=b.style.display==="none"?"block":"none";});})(hs[i]);})();`;
}

function modalScript(elId: string): string {
  return `(function(){var m=document.getElementById(${jsStr(elId)});if(!m)return;var x=m.querySelector(".sb-modal-close");if(x)x.addEventListener("click",function(){m.style.display="none";});})();`;
}

function counterScript(elId: string, from: number, to: number, duration: number): string {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;var from=${from},to=${to},dur=${Math.max(100, duration)},t0=0;function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur);el.textContent=String(Math.round(from+(to-from)*p));if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);})();`;
}

/** Shared fetch-JSON-array helper inlined into the data widgets. */
function fetchRows(url: string): string {
  return `fetch(${jsStr(url)}).then(function(r){return r.json();}).then(function(rows){if(!Array.isArray(rows))return;`;
}

function dataTableScript(elId: string, apiUrl: string, columns: string[]): string {
  return `(function(){var t=document.getElementById(${jsStr(elId)});if(!t)return;var tb=t.querySelector("tbody");if(!tb)return;var cols=${JSON.stringify(columns)};var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};try{${fetchRows(apiUrl)}tb.innerHTML=rows.map(function(row){return "<tr>"+cols.map(function(c){return "<td>"+esc(row[c])+"</td>";}).join("")+"</tr>";}).join("");}).catch(function(){})}catch(e){}})();`;
}

function repeaterScript(elId: string, apiUrl: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var tpl=r.querySelector("template");if(!tpl)return;var html=tpl.innerHTML;try{${fetchRows(apiUrl)}r.innerHTML=rows.map(function(row){return html.replace(/\\{\\{(\\w+)\\}\\}/g,function(m,k){var v=row[k];return v==null?"":String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;");});}).join("");}).catch(function(){})}catch(e){}})();`;
}

function countdownScript(elId: string, targetDate: string, format: string): string {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;var target=new Date(${jsStr(targetDate)}).getTime(),fmt=${jsStr(format)};function pad(n){return (n<10?"0":"")+n;}function tick(){var d=Math.max(0,target-Date.now());var dd=Math.floor(d/864e5),hh=Math.floor(d/36e5)%24,mm=Math.floor(d/6e4)%60,ss=Math.floor(d/1e3)%60;el.textContent=fmt.replace(/dd/g,pad(dd)).replace(/hh/g,pad(hh)).replace(/mm/g,pad(mm)).replace(/ss/g,pad(ss));}tick();setInterval(tick,1000);})();`;
}

function calendarScript(elId: string, month: number, year: number): string {
  return `(function(){var t=document.getElementById(${jsStr(elId)});if(!t)return;var now=new Date(),mm=${month}||now.getMonth()+1,yy=${year}||now.getFullYear();var start=new Date(yy,mm-1,1).getDay(),days=new Date(yy,mm,0).getDate();var h="<tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr><tr>";for(var i=0;i<start;i++)h+="<td></td>";for(var d=1;d<=days;d++){h+="<td>"+d+"</td>";if((start+d)%7===0&&d<days)h+="</tr><tr>";}h+="</tr>";t.innerHTML=h;})();`;
}

function cookieConsentScript(elId: string): string {
  return `(function(){var el=document.getElementById(${jsStr(elId)});if(!el)return;try{if(localStorage.getItem("sb-cookie-ok")){el.style.display="none";return;}}catch(e){}var b=el.querySelector("button");if(b)b.addEventListener("click",function(){el.style.display="none";try{localStorage.setItem("sb-cookie-ok","1");}catch(e){}});})();`;
}

function submitFormScript(elId: string, apiUrl: string, method: string, redirect: string): string {
  return `(function(){var f=document.getElementById(${jsStr(elId)});if(!f)return;f.addEventListener("submit",function(ev){ev.preventDefault();var data={};new FormData(f).forEach(function(v,k){data[k]=v;});fetch(${jsStr(apiUrl)},{method:${jsStr(method)},headers:{"Content-Type":"application/json"},body:JSON.stringify(data)}).then(function(r){if(r.ok&&${jsStr(redirect)})location.href=${jsStr(redirect)};}).catch(function(){});});})();`;
}

function logoutScript(elId: string, apiUrl: string, redirect: string): string {
  return `(function(){var b=document.getElementById(${jsStr(elId)});if(!b)return;b.addEventListener("click",function(){fetch(${jsStr(apiUrl)},{method:"POST"}).catch(function(){}).finally(function(){if(${jsStr(redirect)})location.href=${jsStr(redirect)};});});})();`;
}

function searchResultsScript(elId: string, apiUrl: string, param: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var q=new URLSearchParams(location.search).get(${jsStr(param)})||"";if(!q){r.textContent="Enter a search query.";return;}var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};fetch(${jsStr(apiUrl)}+(${jsStr(apiUrl)}.indexOf("?")>=0?"&":"?")+encodeURIComponent(${jsStr(param)})+"="+encodeURIComponent(q)).then(function(res){return res.json();}).then(function(rows){if(!Array.isArray(rows))return;r.innerHTML="<ul>"+rows.map(function(it){return "<li>"+esc(typeof it==="object"?JSON.stringify(it):it)+"</li>";}).join("")+"</ul>";}).catch(function(){});})();`;
}

function productGridScript(elId: string, apiUrl: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var esc=function(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;");};try{${fetchRows(apiUrl)}r.innerHTML=rows.map(function(p){return '<div class="sb-product">'+(p.image?'<img src="'+esc(p.image)+'" alt="">':'')+"<h4>"+esc(p.name)+"</h4>"+'<div class="sb-price">'+esc(p.price)+"</div></div>";}).join("");}).catch(function(){})}catch(e){}})();`;
}

function quantityScript(elId: string, min: number, max: number): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var inp=r.querySelector("input"),btns=r.querySelectorAll("button");if(!inp||btns.length<2)return;function clamp(){var v=parseInt(inp.value,10)||${min};inp.value=Math.max(${min},Math.min(${max},v));}btns[0].addEventListener("click",function(){inp.value=(parseInt(inp.value,10)||${min})-1;clamp();});btns[1].addEventListener("click",function(){inp.value=(parseInt(inp.value,10)||${min})+1;clamp();});})();`;
}

function shareButtonsScript(elId: string): string {
  return `(function(){var r=document.getElementById(${jsStr(elId)});if(!r)return;var as=r.querySelectorAll("a[data-share]");for(var i=0;i<as.length;i++)(function(a){a.addEventListener("click",function(){a.href=a.getAttribute("data-share")+encodeURIComponent(location.href);});})(as[i]);})();`;
}

/* -------------------------------------------------------------- HTML side */

const HEADING_LEVELS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const INPUT_TYPE_MAP: Record<string, string> = {
  textInput: 'text',
  password: 'password',
  email: 'email',
  number: 'number',
  tel: 'tel',
  date: 'date',
  time: 'time',
};

// Brand colors and letter glyphs for the social icon circles.
const SOCIAL_NETWORKS: Record<string, { glyph: string; color: string }> = {
  facebook: { glyph: 'f', color: '#1877f2' },
  x: { glyph: '𝕏', color: '#000000' },
  twitter: { glyph: '𝕏', color: '#000000' },
  instagram: { glyph: '◉', color: '#e1306c' },
  linkedin: { glyph: 'in', color: '#0a66c2' },
  youtube: { glyph: '▶', color: '#ff0000' },
  whatsapp: { glyph: '✆', color: '#25d366' },
};

const SHARE_ENDPOINTS: Record<string, string> = {
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  x: 'https://twitter.com/intent/tweet?url=',
  twitter: 'https://twitter.com/intent/tweet?url=',
  whatsapp: 'https://wa.me/?text=',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=',
};

function eventAttrs(cmp: ComponentItem): string {
  let out = '';
  for (const [name, code] of Object.entries(cmp.events ?? {})) {
    if (!code) continue;
    const attr = /^on[a-z]+$/i.test(name) ? name.toLowerCase() : `on${sanitizeIdent(name)}`;
    out += ` ${attr}="${escapeAttr(code)}"`;
  }
  return out;
}

/**
 * Parse the customAttributes prop (`key="value"` / `key=value` pairs separated
 * by spaces or newlines). Malformed fragments are ignored; id/class are
 * skipped so they cannot clobber the identity attributes.
 */
function customAttributeAttrs(cmp: ComponentItem): string {
  const raw = String(cmp.props.customAttributes ?? '');
  if (!raw.trim()) return '';
  let out = '';
  const re = /([A-Za-z_:][\w:.-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const key = m[1];
    if (/^(id|class)$/i.test(key)) continue;
    let val = m[2];
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out += ` ${key}="${escapeAttr(val)}"`;
  }
  return out;
}

/** Attributes every exported element shares. */
function commonAttrs(cmp: ComponentItem, extraClass = ''): string {
  const cssClass = String(cmp.props.cssClass ?? '').trim();
  let cls = `sb-cmp sb-${cmp.type}`;
  if (extraClass) cls += ` ${extraClass}`;
  if (cssClass) cls += ` ${cssClass}`;
  let out = `id="${escapeAttr(elementId(cmp))}" class="${escapeAttr(cls)}"`;
  const aria = String(cmp.props.ariaLabel ?? '').trim();
  if (aria) out += ` aria-label="${escapeAttr(aria)}"`;
  out += customAttributeAttrs(cmp);
  return out;
}

function openTag(cmp: ComponentItem, tag: string, extra = '', extraClass = ''): string {
  return `<${tag} ${commonAttrs(cmp, extraClass)}${extra ? ' ' + extra : ''}${eventAttrs(cmp)}>`;
}

function selfClosingTag(cmp: ComponentItem, tag: string, extra = ''): string {
  return `<${tag} ${commonAttrs(cmp)}${extra ? ' ' + extra : ''}${eventAttrs(cmp)}>`;
}

function linkListItems(cmp: ComponentItem, links: { label: string; url: string }[]): string {
  return links
    .map((l) => `<li><a href="${escapeAttr(l.url || '#')}">${escapeHtml(l.label)}</a></li>`)
    .join('');
}

/** Tree view markup from 2-space-indented lines. */
function treeviewMarkup(itemsRaw: unknown): string {
  const items = String(itemsRaw ?? '')
    .split(/\r\n|\r|\n/)
    .filter((l) => l.trim().length > 0)
    .map((l) => ({ depth: Math.floor((l.match(/^ */)?.[0].length ?? 0) / 2), text: l.trim() }));
  let html = '<ul>';
  let cur = 1;
  for (const it of items) {
    const lvl = Math.min(it.depth + 1, cur + 1);
    while (lvl > cur) { html += '<ul>'; cur++; }
    while (lvl < cur) { html += '</ul>'; cur--; }
    html += `<li>${escapeHtml(it.text)}</li>`;
  }
  while (cur > 0) { html += '</ul>'; cur--; }
  return html;
}

/**
 * Inner markup for one component (the element itself carries id/class and is
 * positioned via CSS). `scripts` collects the widget JS for the page.
 */
function componentHtmlRaw(cmp: ComponentItem, scripts: string[]): string {
  const p = cmp.props ?? {};
  const elId = elementId(cmp);
  switch (cmp.type) {
    /* ---------------------------------------------------------- Layout */
    case 'section':
    case 'container':
    case 'group':
    case 'row':
    case 'column':
    case 'flex':
    case 'grid':
    case 'spacer':
      // Pure layout boxes: display model comes from the component's CSS rule.
      return `${openTag(cmp, 'div')}</div>`;

    case 'card': {
      const img = String(p.imageSrc ?? '').trim()
        ? `<img src="${escapeAttr(String(p.imageSrc))}" alt="">`
        : '';
      const title = String(p.title ?? '').trim() ? `<h3>${escapeHtml(String(p.title))}</h3>` : '';
      const text = String(p.text ?? '').trim() ? `<p>${textToHtml(String(p.text))}</p>` : '';
      return `${openTag(cmp, 'div')}${img}${title}${text}</div>`;
    }

    case 'panel':
      return `${openTag(cmp, 'div')}<div class="sb-panel-title">${escapeHtml(String(p.title ?? ''))}</div></div>`;

    /* ----------------------------------------------------------- Basic */
    case 'text':
      return `${openTag(cmp, 'div')}${textToHtml(String(p.text ?? ''))}</div>`;

    case 'paragraph':
      return `${openTag(cmp, 'p')}${textToHtml(String(p.text ?? ''))}</p>`;

    case 'heading': {
      const level = HEADING_LEVELS.has(String(p.level)) ? String(p.level) : 'h1';
      return `${openTag(cmp, level)}${escapeHtml(String(p.text ?? ''))}</${level}>`;
    }

    case 'image': {
      const src = String(p.src ?? '').trim();
      if (!src) return `${openTag(cmp, 'div')}<!-- image: no src set --></div>`;
      return selfClosingTag(cmp, 'img', `src="${escapeAttr(src)}" alt="${escapeAttr(String(p.alt ?? ''))}"`);
    }

    case 'button': {
      const btn = `${openTag(cmp, 'button', 'type="button"')}${escapeHtml(String(p.text ?? ''))}</button>`;
      const href = String(p.href ?? '').trim();
      if (!href) return btn;
      const target = String(p.target ?? '_self');
      return `<a href="${escapeAttr(href)}" target="${escapeAttr(target)}">${btn}</a>`;
    }

    case 'link': {
      const href = String(p.href ?? '#');
      const target = String(p.target ?? '_self');
      return `${openTag(cmp, 'a', `href="${escapeAttr(href)}" target="${escapeAttr(target)}"`)}${escapeHtml(String(p.text ?? ''))}</a>`;
    }

    case 'icon':
      return `${openTag(cmp, 'span')}${escapeHtml(String(p.glyph ?? ''))}</span>`;

    case 'divider':
      // Line rendered entirely via CSS (background-color + lineThickness).
      return `${openTag(cmp, 'div')}</div>`;

    case 'html':
    case 'htmlEmbed':
      // User-supplied markup is inserted verbatim by design.
      return `${openTag(cmp, 'div')}${String(p.html ?? '')}</div>`;

    /* ----------------------------------------------------------- Forms */
    case 'form':
      return `${openTag(cmp, 'form', `action="${escapeAttr(String(p.action ?? ''))}" method="${escapeAttr(String(p.method ?? 'post'))}"`)}<!-- form body: field components are positioned inside this box --></form>`;

    case 'textInput':
    case 'password':
    case 'email':
    case 'number':
    case 'tel':
    case 'date':
    case 'time': {
      const attrs = [`type="${INPUT_TYPE_MAP[cmp.type]}"`, `name="${escapeAttr(String(p.name ?? ''))}"`];
      const ph = String(p.placeholder ?? '');
      if (ph) attrs.push(`placeholder="${escapeAttr(ph)}"`);
      if (cmp.type === 'number') {
        if (p.min !== '' && p.min !== undefined) attrs.push(`min="${escapeAttr(String(p.min))}"`);
        if (p.max !== '' && p.max !== undefined) attrs.push(`max="${escapeAttr(String(p.max))}"`);
      }
      return selfClosingTag(cmp, 'input', attrs.join(' '));
    }

    case 'file': {
      const accept = String(p.accept ?? '').trim();
      return selfClosingTag(
        cmp,
        'input',
        `type="file" name="${escapeAttr(String(p.name ?? ''))}"${accept ? ` accept="${escapeAttr(accept)}"` : ''}`
      );
    }

    case 'textarea':
      return `${openTag(cmp, 'textarea', `name="${escapeAttr(String(p.name ?? ''))}" placeholder="${escapeAttr(String(p.placeholder ?? ''))}"`)}</textarea>`;

    case 'checkbox':
    case 'radio': {
      const checked = p.checked ? ' checked' : '';
      return `${openTag(cmp, 'label')}<input type="${cmp.type}" name="${escapeAttr(String(p.name ?? ''))}"${checked}> ${escapeHtml(String(p.label ?? ''))}</label>`;
    }

    case 'select': {
      const options = linesOf(p.options)
        .map((o) => `<option value="${escapeAttr(o)}">${escapeHtml(o)}</option>`)
        .join('');
      return `${openTag(cmp, 'select', `name="${escapeAttr(String(p.name ?? ''))}"`)}${options}</select>`;
    }

    case 'range':
      return selfClosingTag(
        cmp,
        'input',
        `type="range" name="${escapeAttr(String(p.name ?? ''))}" min="${Number(p.min) || 0}" max="${Number(p.max) || 100}" value="${Number(p.value) || 0}"`
      );

    case 'submit':
      return `${openTag(cmp, 'button', 'type="submit"')}${escapeHtml(String(p.text ?? 'Submit'))}</button>`;

    case 'reset':
      return `${openTag(cmp, 'button', 'type="reset"')}${escapeHtml(String(p.text ?? 'Reset'))}</button>`;

    case 'hiddenField':
      // No visible box: type=hidden inputs never render.
      return selfClosingTag(
        cmp,
        'input',
        `type="hidden" name="${escapeAttr(String(p.name ?? ''))}" value="${escapeAttr(String(p.value ?? ''))}"`
      );

    /* ------------------------------------------------------ Navigation */
    case 'navbar': {
      const links = linkListItems(cmp, linkLines(p.links));
      const brand = String(p.brand ?? '').trim();
      return `${openTag(cmp, 'nav')}${brand ? `<span class="sb-brand">${escapeHtml(brand)}</span>` : ''}<ul>${links}</ul></nav>`;
    }

    case 'menubar': {
      const items = linesOf(p.items).map((i) => `<li>${escapeHtml(i)}</li>`).join('');
      return `${openTag(cmp, 'nav')}<ul>${items}</ul></nav>`;
    }

    case 'hamburger': {
      scripts.push(toggleScript(elId));
      const links = linkListItems(cmp, linkLines(p.links));
      return `${openTag(cmp, 'div')}<button type="button" class="sb-burger" aria-label="Menu">☰</button><ul>${links}</ul></div>`;
    }

    case 'dropdown': {
      scripts.push(toggleScript(elId));
      const links = linkListItems(cmp, linkLines(p.items));
      return `${openTag(cmp, 'div', '', 'sb-dropdown')}<button type="button">${escapeHtml(String(p.label ?? 'Menu'))} ▾</button><ul>${links}</ul></div>`;
    }

    case 'sidebar': {
      const links = linkListItems(cmp, linkLines(p.links));
      const title = String(p.title ?? '').trim();
      return `${openTag(cmp, 'nav')}${title ? `<div class="sb-side-title">${escapeHtml(title)}</div>` : ''}<ul>${links}</ul></nav>`;
    }

    case 'breadcrumb': {
      const items = linkLines(p.items);
      const sep = `<span class="sep">${escapeHtml(String(p.separator ?? '/'))}</span>`;
      const parts = items.map((it, i) =>
        i === items.length - 1 || !it.url
          ? `<span>${escapeHtml(it.label)}</span>`
          : `<a href="${escapeAttr(it.url)}">${escapeHtml(it.label)}</a>`
      );
      return `${openTag(cmp, 'nav', 'aria-label="breadcrumb"')}${parts.join(sep)}</nav>`;
    }

    case 'pagination': {
      const pages = Math.max(1, Math.floor(Number(p.pages) || 1));
      const current = Math.min(pages, Math.max(1, Math.floor(Number(p.current) || 1)));
      const parts: string[] = ['<a href="?page=' + Math.max(1, current - 1) + '">❮</a>'];
      for (let i = 1; i <= pages; i++) {
        parts.push(`<a href="?page=${i}"${i === current ? ' class="active"' : ''}>${i}</a>`);
      }
      parts.push('<a href="?page=' + Math.min(pages, current + 1) + '">❯</a>');
      return `${openTag(cmp, 'nav', 'aria-label="pagination"')}${parts.join('')}</nav>`;
    }

    case 'tabs': {
      const tabs = linesOf(p.tabs);
      const active = Math.floor(Number(p.active) || 0);
      const btns = tabs
        .map((t, i) => `<button type="button"${i === active ? ' class="active"' : ''}>${escapeHtml(t)}</button>`)
        .join('');
      return `${openTag(cmp, 'div', 'role="tablist"')}${btns}</div>`;
    }

    /* ----------------------------------------------------------- Media */
    case 'video': {
      const src = String(p.src ?? '').trim();
      const attrs: string[] = [];
      if (src) attrs.push(`src="${escapeAttr(src)}"`);
      if (p.controls) attrs.push('controls');
      if (p.autoplay) attrs.push('autoplay muted');
      return `${openTag(cmp, 'video', attrs.join(' '))}</video>`;
    }

    case 'audio': {
      const src = String(p.src ?? '').trim();
      const attrs: string[] = [];
      if (src) attrs.push(`src="${escapeAttr(src)}"`);
      if (p.controls) attrs.push('controls');
      return `${openTag(cmp, 'audio', attrs.join(' '))}</audio>`;
    }

    case 'youtube': {
      // External dependency: YouTube embed player.
      const vid = escapeAttr(String(p.videoId ?? '').trim());
      return selfClosingTag(cmp, 'iframe', `src="https://www.youtube.com/embed/${vid}" frameborder="0" allowfullscreen`);
    }

    case 'gallery': {
      const imgs = linesOf(p.images)
        .map((u) => `<img src="${escapeAttr(u)}" alt="">`)
        .join('');
      if (!imgs) return `${openTag(cmp, 'div')}<!-- gallery: no images set --></div>`;
      return `${openTag(cmp, 'div')}${imgs}</div>`;
    }

    case 'slideshow': {
      const urls = linesOf(p.images);
      if (urls.length === 0) return `${openTag(cmp, 'div')}<!-- slideshow: no images set --></div>`;
      scripts.push(slideshowScript(elId, Number(p.interval) || 3000));
      const imgs = urls
        .map((u, i) => `<img src="${escapeAttr(u)}" alt=""${i > 0 ? ' style="display:none"' : ''}>`)
        .join('');
      return `${openTag(cmp, 'div')}${imgs}</div>`;
    }

    case 'carousel': {
      const imgs = linesOf(p.images)
        .map((u) => `<img src="${escapeAttr(u)}" alt="">`)
        .join('');
      if (!imgs) return `${openTag(cmp, 'div')}<!-- carousel: no images set --></div>`;
      return `${openTag(cmp, 'div')}${imgs}</div>`;
    }

    case 'lightbox': {
      const src = String(p.src ?? '').trim();
      if (!src) return `${openTag(cmp, 'div')}<!-- lightbox: no src set --></div>`;
      scripts.push(lightboxScript(elId));
      const caption = escapeAttr(String(p.caption ?? ''));
      return selfClosingTag(cmp, 'img', `src="${escapeAttr(src)}" alt="${caption}"`);
    }

    /* -------------------------------------------------------- Advanced */
    case 'accordion': {
      scripts.push(accordionScript(elId));
      const items = linkLines(p.items)
        .map(
          (it, i) =>
            `<button type="button" class="sb-acc-h">${escapeHtml(it.label)}</button><div class="sb-acc-b"${i > 0 ? ' style="display:none"' : ''}>${textToHtml(it.url)}</div>`
        )
        .join('');
      return `${openTag(cmp, 'div')}${items}</div>`;
    }

    case 'modal': {
      scripts.push(modalScript(elId));
      const hidden = p.open ? '' : ' style="display:none"';
      return `${openTag(cmp, 'div', hidden ? hidden.trimStart().replace(/^style=/, 'style=') && `style="display:none"` : '')}<div class="sb-modal-head"><span>${escapeHtml(String(p.title ?? ''))}</span><button type="button" class="sb-modal-close" aria-label="Close">✕</button></div><div class="sb-modal-body">${textToHtml(String(p.text ?? ''))}</div></div>`;
    }

    case 'tooltip':
      return `${openTag(cmp, 'span', `data-tip="${escapeAttr(String(p.tip ?? ''))}"`, 'sb-tooltip')}${escapeHtml(String(p.text ?? ''))}</span>`;

    case 'progress': {
      const max = Number(p.max) || 100;
      const value = Math.min(max, Math.max(0, Number(p.value) || 0));
      const pct = Math.round((value / max) * 100);
      const barColor = escapeAttr(String(p.barColor || '#0d6efd'));
      return `${openTag(cmp, 'div')}<div class="sb-progress-fill" style="width: ${pct}%; height: 100%; background: ${barColor};"></div></div>`;
    }

    case 'counter': {
      const from = Number(p.from) || 0;
      const to = Number(p.to) || 0;
      const duration = Number(p.duration) || 2000;
      scripts.push(counterScript(elId, from, to, duration));
      return `${openTag(cmp, 'span', `data-to="${to}" data-duration="${duration}"`)}${from}</span>`;
    }

    case 'rating': {
      const max = Math.max(1, Math.floor(Number(p.max) || 5));
      const value = Math.min(max, Math.max(0, Math.floor(Number(p.value) || 0)));
      const color = escapeAttr(String(p.starColor || '#ffc107'));
      let stars = '';
      for (let i = 0; i < max; i++) {
        stars += i < value ? `<span style="color: ${color};">★</span>` : '<span>☆</span>';
      }
      return `${openTag(cmp, 'span')}${stars}</span>`;
    }

    case 'badge':
      return `${openTag(cmp, 'span')}${escapeHtml(String(p.text ?? ''))}</span>`;

    case 'alert':
      return `${openTag(cmp, 'div', 'role="alert"')}${textToHtml(String(p.text ?? ''))}</div>`;

    case 'timeline': {
      const items = linkLines(p.items)
        .map((it) => `<li><strong>${escapeHtml(it.label)}</strong> ${escapeHtml(it.url)}</li>`)
        .join('');
      return `${openTag(cmp, 'div')}<ul>${items}</ul></div>`;
    }

    /* ------------------------------------------------------------ Data */
    case 'table': {
      const rows = Math.max(1, Math.floor(Number(p.rows) || 1));
      const cols = Math.max(1, Math.floor(Number(p.columns) || 1));
      const headerRow = !!p.headerRow;
      const body: string[] = [];
      for (let r = 0; r < rows; r++) {
        const cell = headerRow && r === 0 ? 'th' : 'td';
        body.push(`<tr>${`<${cell}></${cell}>`.repeat(cols)}</tr>`);
      }
      return `${openTag(cmp, 'table')}${body.join('')}</table>`;
    }

    case 'datagrid':
    case 'dbtable': {
      const columns = linesOf(p.columns);
      const apiUrl = String(p.apiUrl ?? '').trim();
      if (apiUrl) scripts.push(dataTableScript(elId, apiUrl, columns));
      const head = columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('');
      return `${openTag(cmp, 'table', `data-api="${escapeAttr(apiUrl)}"`)}<thead><tr>${head}</tr></thead><tbody></tbody></table>`;
    }

    case 'repeater': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      if (apiUrl) scripts.push(repeaterScript(elId, apiUrl));
      // The item template is user-supplied markup — verbatim by design.
      return `${openTag(cmp, 'div', `data-api="${escapeAttr(apiUrl)}"`)}<template>${String(p.itemTemplate ?? '')}</template></div>`;
    }

    case 'treeview':
      return `${openTag(cmp, 'div')}${treeviewMarkup(p.items)}</div>`;

    case 'searchbox':
      return `${openTag(cmp, 'form', `action="${escapeAttr(String(p.action ?? ''))}" method="get" role="search"`)}<input type="search" name="q" placeholder="${escapeAttr(String(p.placeholder ?? ''))}"><button type="submit">🔍</button></form>`;

    /* ---------------------------------------------------------- Social */
    case 'socialicons': {
      const size = Math.max(8, Number(p.size) || 36);
      const icons = linesOf(p.networks)
        .map((n) => {
          const net = SOCIAL_NETWORKS[n.toLowerCase()] ?? { glyph: n.charAt(0), color: '#6c757d' };
          return `<a href="#" title="${escapeAttr(n)}" style="width: ${size}px; height: ${size}px; background: ${net.color}; font-size: ${Math.round(size / 2)}px;">${escapeHtml(net.glyph)}</a>`;
        })
        .join('');
      return `${openTag(cmp, 'div')}${icons}</div>`;
    }

    case 'sharebuttons': {
      scripts.push(shareButtonsScript(elId));
      const buttons = linesOf(p.networks)
        .map((n) => {
          const key = n.toLowerCase();
          const endpoint = SHARE_ENDPOINTS[key];
          if (!endpoint) return '';
          const color = SOCIAL_NETWORKS[key]?.color ?? '#6c757d';
          const label = key === 'x' || key === 'twitter' ? 'X' : n.charAt(0).toUpperCase() + n.slice(1);
          return `<a href="${escapeAttr(endpoint)}" data-share="${escapeAttr(endpoint)}" target="_blank" rel="noopener" style="background: ${color};">${escapeHtml(label)}</a>`;
        })
        .filter(Boolean)
        .join('');
      return `${openTag(cmp, 'div')}${buttons}</div>`;
    }

    case 'whatsapp': {
      const phone = String(p.phone ?? '').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(String(p.message ?? ''));
      const href = `https://wa.me/${phone}${msg ? `?text=${msg}` : ''}`;
      return `${openTag(cmp, 'a', `href="${escapeAttr(href)}" target="_blank" rel="noopener"`)}💬 WhatsApp</a>`;
    }

    case 'facebook': {
      // External dependency: Facebook page plugin iframe.
      const pageUrl = String(p.pageUrl ?? '').trim();
      if (!pageUrl) return `${openTag(cmp, 'div')}<!-- facebook: no page URL set --></div>`;
      const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(pageUrl)}&tabs=timeline`;
      return selfClosingTag(cmp, 'iframe', `src="${escapeAttr(src)}" frameborder="0" allowfullscreen`);
    }

    case 'xembed': {
      // External dependency: platform.twitter.com widgets.js.
      const tweetUrl = String(p.tweetUrl ?? '').trim();
      if (!tweetUrl) return `${openTag(cmp, 'div')}<!-- x embed: no post URL set --></div>`;
      return `${openTag(cmp, 'div')}<blockquote class="twitter-tweet"><a href="${escapeAttr(tweetUrl)}">${escapeHtml(tweetUrl)}</a></blockquote><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></div>`;
    }

    /* ------------------------------------------------------------ Maps */
    case 'map': {
      const provider = String(p.provider ?? 'osm');
      const zoom = Math.max(1, Math.min(20, Number(p.zoom) || 12));
      let src: string;
      if (provider === 'google') {
        // External dependency: Google Maps embed (no API key needed).
        src = `https://maps.google.com/maps?q=${encodeURIComponent(String(p.address ?? ''))}&z=${zoom}&output=embed`;
      } else {
        // External dependency: OpenStreetMap embed. OSM's embed endpoint takes
        // a bbox rather than an address, so a default London viewport is used;
        // geocoding the address would require a runtime Nominatim lookup.
        src = 'https://www.openstreetmap.org/export/embed.html?bbox=-0.13,51.49,-0.09,51.52&layer=mapnik&marker=51.505,-0.11';
      }
      return selfClosingTag(cmp, 'iframe', `src="${escapeAttr(src)}" frameborder="0"`);
    }

    case 'marker': {
      const color = escapeAttr(String(p.markerColor || '#dc3545'));
      const label = String(p.label ?? '').trim();
      return `${openTag(cmp, 'span')}<span style="color: ${color}; font-size: 28px;">📍</span>${label ? ` ${escapeHtml(label)}` : ''}</span>`;
    }

    /* ------------------------------------------------------------ Code */
    case 'css':
      // User CSS inserted verbatim by design; the element itself is inert.
      return `${openTag(cmp, 'div')}<!-- css component: styles emitted inline below --></div><style>${String(p.code ?? '')}</style>`;

    case 'javascript':
      // User JS inserted verbatim by design; the element itself is inert.
      return `${openTag(cmp, 'div')}<!-- javascript component: code emitted inline below --></div><script>${String(p.code ?? '')}</script>`;

    case 'iframe':
      return selfClosingTag(cmp, 'iframe', `src="${escapeAttr(String(p.src ?? ''))}" frameborder="0"`);

    /* ---------------------------------------------------------- Special */
    case 'qrcode': {
      // External dependency: qrserver.com QR image API (goqr.me).
      const data = encodeURIComponent(String(p.data ?? ''));
      const src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data}`;
      return selfClosingTag(cmp, 'img', `src="${escapeAttr(src)}" alt="QR code"`);
    }

    case 'countdown': {
      scripts.push(countdownScript(elId, String(p.targetDate ?? ''), String(p.format ?? 'dd : hh : mm : ss')));
      return `${openTag(cmp, 'span')}${escapeHtml(String(p.format ?? ''))}</span>`;
    }

    case 'calendar': {
      scripts.push(calendarScript(elId, Math.floor(Number(p.month) || 0), Math.floor(Number(p.year) || 0)));
      return `${openTag(cmp, 'div')}<table></table></div>`;
    }

    case 'captcha': {
      const siteKey = String(p.siteKey ?? '').trim();
      if (!siteKey) return `${openTag(cmp, 'div')}<!-- captcha: no site key set --></div>`;
      // External dependency: captcha provider script.
      const hcaptcha = String(p.provider) === 'hcaptcha';
      const cls = hcaptcha ? 'h-captcha' : 'g-recaptcha';
      const src = hcaptcha ? 'https://js.hcaptcha.com/1/api.js' : 'https://www.google.com/recaptcha/api.js';
      return `${openTag(cmp, 'div')}<div class="${cls}" data-sitekey="${escapeAttr(siteKey)}"></div><script src="${src}" async defer></script></div>`;
    }

    case 'cookieconsent': {
      scripts.push(cookieConsentScript(elId));
      return `${openTag(cmp, 'div', 'role="dialog"')}<span>${escapeHtml(String(p.message ?? ''))}</span><button type="button">${escapeHtml(String(p.buttonText ?? 'Accept'))}</button></div>`;
    }

    /* ------------------------------------------------------------ User */
    case 'login':
    case 'register': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      const redirect = String(p.redirect ?? '').trim();
      if (apiUrl) scripts.push(submitFormScript(elId, apiUrl, 'POST', redirect));
      const emailField =
        cmp.type === 'register'
          ? '<label>Email</label><input type="email" name="email" required>'
          : '';
      const btnLabel = cmp.type === 'register' ? 'Register' : 'Login';
      return `${openTag(cmp, 'form')}<label>Username</label><input type="text" name="username" required>${emailField}<label>Password</label><input type="password" name="password" required><button type="submit">${btnLabel}</button></form>`;
    }

    case 'logout': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      const redirect = String(p.redirect ?? '').trim();
      if (apiUrl) scripts.push(logoutScript(elId, apiUrl, redirect));
      return `${openTag(cmp, 'button', 'type="button"')}${escapeHtml(String(p.text ?? 'Logout'))}</button>`;
    }

    case 'profile': {
      const avatarUrl = String(p.avatarUrl ?? '').trim();
      const name = String(p.name ?? '');
      const avatar = avatarUrl
        ? `<img src="${escapeAttr(avatarUrl)}" alt="">`
        : `<span class="sb-avatar">${escapeHtml(name.charAt(0).toUpperCase() || '?')}</span>`;
      return `${openTag(cmp, 'div')}${avatar}<div><div>${escapeHtml(name)}</div><div>${escapeHtml(String(p.email ?? ''))}</div></div></div>`;
    }

    case 'dbform': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      const method = String(p.method ?? 'POST').toUpperCase();
      if (apiUrl) scripts.push(submitFormScript(elId, apiUrl, method, ''));
      const fields = String(p.fields ?? '')
        .split(/\r\n|\r|\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [name = '', type = 'text', label = ''] = l.split('|').map((s) => s.trim());
          const safeName = escapeAttr(name);
          const safeLabel = escapeHtml(label || name);
          const input =
            type === 'textarea'
              ? `<textarea name="${safeName}"></textarea>`
              : `<input type="${escapeAttr(type || 'text')}" name="${safeName}">`;
          return `<label>${safeLabel}</label>${input}`;
        })
        .join('');
      return `${openTag(cmp, 'form')}${fields}<button type="submit">Submit</button></form>`;
    }

    case 'searchresults': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      const param = String(p.param ?? 'q').trim() || 'q';
      if (apiUrl) scripts.push(searchResultsScript(elId, apiUrl, param));
      return `${openTag(cmp, 'div', `data-api="${escapeAttr(apiUrl)}"`)}</div>`;
    }

    /* ------------------------------------------------------- E-Commerce */
    case 'productcard': {
      const img = String(p.imageSrc ?? '').trim()
        ? `<img src="${escapeAttr(String(p.imageSrc))}" alt="">`
        : '';
      const pid = String(p.productId ?? '').trim();
      return `${openTag(cmp, 'div')}${img}<h3>${escapeHtml(String(p.title ?? ''))}</h3><div class="sb-price">${escapeHtml(String(p.currency ?? ''))}${escapeHtml(String(p.price ?? ''))}</div><button type="button"${pid ? ` data-product-id="${escapeAttr(pid)}"` : ''}>${escapeHtml(String(p.buttonText ?? 'Add to Cart'))}</button></div>`;
    }

    case 'productgrid': {
      const apiUrl = String(p.apiUrl ?? '').trim();
      if (apiUrl) scripts.push(productGridScript(elId, apiUrl));
      return `${openTag(cmp, 'div', `data-api="${escapeAttr(apiUrl)}"`)}</div>`;
    }

    case 'price':
      return `${openTag(cmp, 'span')}${escapeHtml(String(p.currency ?? ''))}${escapeHtml(String(p.amount ?? ''))}</span>`;

    case 'quantity': {
      const min = Math.floor(Number(p.min) || 0);
      const max = Math.max(min, Math.floor(Number(p.max) || 99));
      const value = Math.min(max, Math.max(min, Math.floor(Number(p.value) || min)));
      scripts.push(quantityScript(elId, min, max));
      return `${openTag(cmp, 'div')}<button type="button">−</button><input type="text" inputmode="numeric" value="${value}"><button type="button">＋</button></div>`;
    }

    case 'addtocart': {
      const pid = String(p.productId ?? '').trim();
      return `${openTag(cmp, 'button', `type="button"${pid ? ` data-product-id="${escapeAttr(pid)}"` : ''}`)}${escapeHtml(String(p.text ?? 'Add to Cart'))}</button>`;
    }

    case 'cart': {
      const url = String(p.checkoutUrl ?? '#').trim() || '#';
      return `${openTag(cmp, 'a', `href="${escapeAttr(url)}"`)}🛒 ${escapeHtml(String(p.text ?? 'Cart'))}</a>`;
    }

    case 'checkout': {
      const url = String(p.url ?? '#').trim() || '#';
      return `${openTag(cmp, 'a', `href="${escapeAttr(url)}"`)}${escapeHtml(String(p.text ?? 'Checkout'))}</a>`;
    }

    default:
      // Unknown type: render an empty positioned box so layout stays intact.
      return `${openTag(cmp, 'div')}<!-- unknown component type: ${escapeHtml(cmp.type)} --></div>`;
  }
}

function componentHtml(cmp: ComponentItem, scripts: string[]): string {
  const before = String(cmp.props?.objectBeforeHtml ?? '');
  const after = String(cmp.props?.objectAfterHtml ?? '');
  return `${before}${componentHtmlRaw(cmp, scripts)}${after}`;
}

function buildPageHtml(page: Page): string {
  const name = sanitizeIdent(page.name);
  const lines: string[] = [];
  const scripts: string[] = [];

  lines.push('<!doctype html>');
  lines.push('<html>');
  lines.push('<head>');
  lines.push('<meta charset="utf-8">');
  lines.push('<meta name="viewport" content="width=device-width, initial-scale=1">');
  lines.push(`<title>${escapeHtml(page.title || page.name)}</title>`);
  lines.push('<link rel="stylesheet" href="css/site.css">');
  if (page.headCode) lines.push(page.headCode); // verbatim by design
  lines.push('</head>');
  lines.push('<body>');
  if (page.bodyStartCode) lines.push(page.bodyStartCode); // verbatim by design
  lines.push(`<div class="sb-page ${pageClassName(page)}" id="page-${name}">`);

  // Array order = stacking order: later components sit on top.
  for (const cmp of page.components) {
    if (cmp.hidden) continue; // hidden components are excluded entirely
    lines.push(componentHtml(cmp, scripts));
  }

  lines.push('</div>');
  // Widget behaviour scripts, aggregated once per page.
  if (scripts.length > 0) {
    lines.push('<script>');
    lines.push(scripts.join('\n'));
    lines.push('</script>');
  }
  if (page.pageCode) {
    lines.push('<script>');
    lines.push(page.pageCode); // verbatim by design
    lines.push('</script>');
  }
  if (page.bodyEndCode) lines.push(page.bodyEndCode); // verbatim by design
  lines.push('</body>');
  lines.push('</html>');

  return lines.join('\n');
}

/* -------------------------------------------------------------- public API */

/**
 * Export the whole project as a static site:
 * [css/site.css, <page1>.html, <page2>.html, ...]
 */
export function exportSite(project: Project): ExportFile[] {
  const files: ExportFile[] = [{ name: 'css/site.css', content: buildStylesheet(project) }];
  for (const page of project.pages) {
    files.push({ name: `${sanitizeIdent(page.name)}.html`, content: buildPageHtml(page) });
  }
  return files;
}
