import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { useProjectStore, useCurrentPage, effectiveComponent } from '../../store/projectStore';
import { resolveComponentHidden, responsiveBaseWidth } from '../../model/responsive';
import { styleFromProps, toReactStyle } from '../../model/styleFromProps';
import { COMPONENT_MAP } from '../../model/componentDefs';
import type { ComponentItem } from '../../model/types';

const HANDLES = [
  { dir: 'nw', cursor: 'nwse-resize' },
  { dir: 'n', cursor: 'ns-resize' },
  { dir: 'ne', cursor: 'nesw-resize' },
  { dir: 'e', cursor: 'ew-resize' },
  { dir: 'se', cursor: 'nwse-resize' },
  { dir: 's', cursor: 'ns-resize' },
  { dir: 'sw', cursor: 'nesw-resize' },
  { dir: 'w', cursor: 'ew-resize' },
] as const;

type HandleDir = (typeof HANDLES)[number]['dir'];

/** Types whose inner form control receives the prop styles directly (avoid double borders). */
const FORM_CONTROL_TYPES = [
  'textInput', 'password', 'email', 'number', 'tel', 'date', 'time', 'textarea', 'select', 'file', 'range',
];

/* ============================================================ small helpers */

/** Non-empty lines of a multi-line prop (leading whitespace preserved for treeview). */
function rawLines(v: any): string[] {
  return String(v ?? '').split('\n').filter((l) => l.trim() !== '');
}

/** Parse "Label|URL" lines; a line without '|' is a label with no URL. */
function pairs(v: any): { label: string; url: string }[] {
  return rawLines(v).map((l) => {
    const i = l.indexOf('|');
    return i === -1
      ? { label: l.trim(), url: '' }
      : { label: l.slice(0, i).trim(), url: l.slice(i + 1).trim() };
  });
}

function num(v: any, fallback: number): number {
  const n = Number(v);
  return Number.isFinite(n) && v !== '' && v !== undefined && v !== null ? n : fallback;
}

function fileName(u: string): string {
  const clean = u.split('?')[0];
  return clean.split('/').filter(Boolean).pop() || u;
}

const justifyFor = (align: any): CSSProperties['justifyContent'] =>
  align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

const NO_PTR: CSSProperties = { pointerEvents: 'none' };

/** Style for a real <input>/<select>/<textarea> used as the preview. */
function controlStyle(style: CSSProperties, extra?: CSSProperties): CSSProperties {
  return { ...style, width: '100%', height: '100%', boxSizing: 'border-box', ...NO_PTR, ...extra };
}

/** Centered flex content filling the component (button-styled types). */
function fillFlex(extra?: CSSProperties): CSSProperties {
  return { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', ...extra };
}

/** Dashed design-time placeholder box with an icon and a one-line label. */
function Placeholder({ icon, label, sub, style }: { icon?: string; label: string; sub?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        width: '100%', height: '100%', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
        border: '1px dashed #adb5bd', color: '#868e96', fontSize: 11, overflow: 'hidden', padding: 4,
        ...style,
      }}
    >
      {icon && <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>}
      <span style={{ maxWidth: '92%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {sub && <span style={{ maxWidth: '92%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.75 }}>{sub}</span>}
    </div>
  );
}

/** Button-styled div honoring textAlign; background/color come from the wrapper propStyle. */
function buttonLike(props: Record<string, any>, textOverride?: string): ReactNode {
  return (
    <div style={fillFlex({ justifyContent: justifyFor(props.textAlign) })}>
      {textOverride ?? String(props.text ?? '')}
    </div>
  );
}

/** Fake text-input look used inside composite mocks (login, searchbox, dbform...). */
function mockInput(placeholder: string, style?: CSSProperties): ReactNode {
  return (
    <div
      style={{
        boxSizing: 'border-box', border: '1px solid #ced4da', borderRadius: 4,
        background: '#ffffff', color: '#868e96', fontSize: 12,
        padding: '5px 8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        ...style,
      }}
    >
      {placeholder}
    </div>
  );
}

/** Fake primary button used inside composite mocks. */
function mockButton(text: string, style?: CSSProperties): ReactNode {
  return (
    <div
      style={{
        background: '#0d6efd', color: '#ffffff', borderRadius: 4, fontSize: 12, fontWeight: 600,
        padding: '6px 10px', textAlign: 'center', ...style,
      }}
    >
      {text}
    </div>
  );
}

/** Table-like grid: shaded header row from column names + empty sample rows + optional API footer. */
function dataGridPreview(columns: string[], apiUrl: string, borderColor: string): ReactNode {
  const cols = columns.length > 0 ? columns : ['Column'];
  const border = `1px solid ${borderColor}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, background: '#f0f0f0', fontWeight: 600, flexShrink: 0 }}>
        {cols.map((c, i) => (
          <div key={i} style={{ border, padding: '4px 6px', fontSize: 12, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{c}</div>
        ))}
      </div>
      {[0, 1, 2].map((r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, flex: 1, minHeight: 0 }}>
          {cols.map((_, c) => (
            <div key={c} style={{ border }} />
          ))}
        </div>
      ))}
      {apiUrl && (
        <div style={{ flexShrink: 0, fontSize: 10, color: '#868e96', borderTop: border, padding: '2px 6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          ⚡ {apiUrl}
        </div>
      )}
    </div>
  );
}

/* ================================================================== Layout */

function renderLayout(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'section':
    case 'container':
    case 'group':
      return null; // styled box — props do the talking

    case 'panel':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          <div style={{ flexShrink: 0, padding: '6px 10px', fontWeight: 600, background: 'rgba(0,0,0,.05)', borderBottom: '1px solid rgba(0,0,0,.12)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {String(props.title ?? '')}
          </div>
          <div style={{ flex: 1 }} />
        </div>
      );

    case 'row':
    case 'column': {
      // subtle design-time flex outline; background only if the user set one (wrapper propStyle)
      return (
        <div
          style={{
            width: '100%', height: '100%', boxSizing: 'border-box',
            border: '1px dashed #ced4da',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#adb5bd', fontSize: 12,
          }}
        >
          {type === 'row' ? '→' : '↓'}
        </div>
      );
    }

    case 'flex':
      return (
        <div
          style={{
            width: '100%', height: '100%', boxSizing: 'border-box',
            border: '1px dashed #ced4da',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#adb5bd', fontSize: 10,
          }}
        >
          flex · {String(props.direction ?? 'row')} · gap {num(props.gap, 0)}
        </div>
      );

    case 'grid': {
      const cols = Math.max(1, num(props.columns, 3));
      const cells = Array.from({ length: cols * 3 });
      return (
        <div
          style={{
            display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: num(props.gap, 0), width: '100%', height: '100%', boxSizing: 'border-box',
          }}
        >
          {cells.map((_, i) => (
            <div key={i} style={{ border: '1px dashed #ced4da', minHeight: 0, minWidth: 0 }} />
          ))}
        </div>
      );
    }

    case 'card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          {props.imageSrc ? (
            <img src={String(props.imageSrc)} alt="" draggable={false} style={{ width: '100%', height: '45%', objectFit: 'cover', display: 'block', flexShrink: 0, ...NO_PTR }} />
          ) : (
            <div style={{ width: '100%', height: '45%', flexShrink: 0, background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: '#adb5bd' }}>🖼</div>
          )}
          <div style={{ padding: '10px 12px', overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{String(props.title ?? '')}</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{String(props.text ?? '')}</div>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', border: '1px dashed #ced4da', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
          ↕
        </div>
      );

    default:
      return null;
  }
}

/* ================================================================== Basic */

function renderBasic(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'text':
    case 'paragraph':
      return <div className="cv-fill" style={{ whiteSpace: 'pre-wrap' }}>{String(props.text ?? '')}</div>;

    case 'heading': {
      const lvl = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(String(props.level)) ? String(props.level) : 'h1';
      const Tag = lvl as 'h1';
      return <Tag className="cv-heading">{String(props.text ?? '')}</Tag>;
    }

    case 'image':
      return props.src ? (
        <img
          src={String(props.src)}
          alt={String(props.alt ?? '')}
          draggable={false}
          style={{
            width: '100%', height: '100%', display: 'block', ...NO_PTR,
            objectFit: String(props.objectFit || 'cover') as CSSProperties['objectFit'],
          }}
        />
      ) : (
        <div className="cv-image-placeholder">🖼</div>
      );

    case 'button':
      return buttonLike(props);

    case 'link':
      return <span className="cv-link">{String(props.text ?? '')}</span>;

    case 'icon':
      return (
        <div style={fillFlex({ justifyContent: justifyFor(props.textAlign), lineHeight: 1 })}>
          {String(props.glyph ?? '★')}
        </div>
      );

    case 'divider':
      return (
        <div className="cv-fill cv-hr">
          <div style={{ width: '100%', height: Math.max(1, num(props.lineThickness, 1)), background: String(props.color || '#000000') }} />
        </div>
      );

    case 'htmlEmbed':
      return <div className="cv-fill" dangerouslySetInnerHTML={{ __html: String(props.html ?? '') }} />;

    case 'rectangle':
    case 'roundedRectangle':
    case 'ellipse':
      // pure shape — the wrapper box carries background/border/radius styles
      return <div className="cv-fill" />;

    case 'list':
      return (
        <ul className="cv-fill" style={{ margin: 0, paddingLeft: 20, lineHeight: String(props.lineHeight || '1.8') }}>
          {String(props.items ?? '').split('\n').filter((s) => s.trim()).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}

/* ================================================================== Forms */

function renderForms(type: string, props: Record<string, any>, style: CSSProperties): ReactNode {
  switch (type) {
    case 'form':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'rgba(0,0,0,.10)', pointerEvents: 'none' }}>
            <span style={{ fontSize: 28, fontWeight: 700 }}>Form</span>
            {props.action ? <span style={{ fontSize: 11, color: 'rgba(0,0,0,.30)' }}>{String(props.method ?? 'post').toUpperCase()} {String(props.action)}</span> : null}
          </div>
        </div>
      );

    case 'textInput':
    case 'password':
    case 'email':
    case 'number':
    case 'tel':
    case 'date':
    case 'time': {
      const inputType =
        type === 'textInput' ? 'text' : type;
      return (
        <input
          disabled
          type={inputType}
          name={String(props.name ?? '')}
          placeholder={String(props.placeholder ?? '')}
          style={controlStyle(style)}
        />
      );
    }

    case 'textarea':
      return (
        <textarea
          disabled
          name={String(props.name ?? '')}
          placeholder={String(props.placeholder ?? '')}
          style={controlStyle(style, { resize: 'none' })}
        />
      );

    case 'select':
      return (
        <select disabled name={String(props.name ?? '')} style={controlStyle(style)}>
          {rawLines(props.options).map((o, i) => (
            <option key={i}>{o.trim()}</option>
          ))}
        </select>
      );

    case 'checkbox':
    case 'radio':
      return (
        <label className="cv-check" style={NO_PTR}>
          <input type={type} disabled checked={!!props.checked} readOnly />
          <span>{String(props.label ?? '')}</span>
        </label>
      );

    case 'file':
      return <input disabled type="file" name={String(props.name ?? '')} accept={String(props.accept ?? '')} style={controlStyle(style)} />;

    case 'range':
      return (
        <input
          disabled
          type="range"
          name={String(props.name ?? '')}
          min={num(props.min, 0)}
          max={num(props.max, 100)}
          value={num(props.value, 50)}
          readOnly
          style={controlStyle(style)}
        />
      );

    case 'submit':
    case 'reset':
      return buttonLike(props);

    case 'hiddenField':
      return <Placeholder label={`Hidden: ${String(props.name ?? '')}`} />;

    default:
      return null;
  }
}

/* ============================================================= Navigation */

function renderNavigation(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'navbar': {
      const links = pairs(props.links);
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%', overflow: 'hidden' }}>
          <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{String(props.brand ?? '')}</span>
          <span style={{ display: 'flex', gap: 16, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {links.map((l, i) => (
              <span key={i}>{l.label}</span>
            ))}
          </span>
        </div>
      );
    }

    case 'menubar':
      return (
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', height: '100%', overflow: 'hidden' }}>
          {rawLines(props.items).map((it, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', padding: '0 12px', whiteSpace: 'nowrap' }}>{it.trim()}</span>
          ))}
        </div>
      );

    case 'hamburger':
      return <div style={fillFlex({ lineHeight: 1 })}>☰</div>;

    case 'dropdown':
      return buttonLike(props, `${String(props.label ?? '')} ▾`);

    case 'sidebar': {
      const links = pairs(props.links);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{String(props.title ?? '')}</div>
          {links.map((l, i) => (
            <div key={i} style={{ padding: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.label}</div>
          ))}
        </div>
      );
    }

    case 'breadcrumb': {
      const items = pairs(props.items);
      const sep = String(props.separator ?? '/');
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', height: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {items.map((it, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {i > 0 && <span style={{ color: '#868e96' }}>{sep}</span>}
              <span style={i < items.length - 1 ? { color: '#0d6efd' } : undefined}>{it.label}</span>
            </span>
          ))}
        </div>
      );
    }

    case 'pagination': {
      const pages = Math.max(1, num(props.pages, 5));
      const current = Math.min(pages, Math.max(1, num(props.current, 1)));
      const cell = (label: ReactNode, active: boolean, key: string): ReactNode => (
        <span
          key={key}
          style={{
            minWidth: 24, height: 24, boxSizing: 'border-box', padding: '0 6px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #dee2e6', fontSize: 12,
            background: active ? '#0d6efd' : '#ffffff', color: active ? '#ffffff' : '#0d6efd',
          }}
        >
          {label}
        </span>
      );
      const cells: ReactNode[] = [cell('❮', false, 'prev')];
      for (let p = 1; p <= pages; p++) cells.push(cell(p, p === current, `p${p}`));
      cells.push(cell('❯', false, 'next'));
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', height: '100%', overflow: 'hidden' }}>
          {cells}
        </div>
      );
    }

    case 'tabs': {
      const tabs = rawLines(props.tabs);
      const active = Math.min(tabs.length - 1, Math.max(0, num(props.active, 0)));
      return (
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', height: '100%', overflow: 'hidden', borderBottom: '1px solid #dee2e6', boxSizing: 'border-box' }}>
          {tabs.map((t, i) => (
            <span
              key={i}
              style={{
                display: 'flex', alignItems: 'center', padding: '0 14px', whiteSpace: 'nowrap',
                borderBottom: i === active ? '2px solid #0d6efd' : '2px solid transparent',
                fontWeight: i === active ? 600 : undefined,
                background: i === active ? '#ffffff' : undefined,
                boxSizing: 'border-box',
              }}
            >
              {t.trim()}
            </span>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

/* ================================================================== Media */

function renderMedia(type: string, props: Record<string, any>): ReactNode {
  const images = rawLines(props.images);

  switch (type) {
    case 'video':
      return (
        <div className="cv-media-placeholder">
          <span className="play">▶</span>
          <span className="media-label">{props.src ? fileName(String(props.src)) : 'video'}</span>
        </div>
      );

    case 'audio':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: '100%', padding: '0 10px', boxSizing: 'border-box', overflow: 'hidden' }}>
          <span style={{ fontSize: 18 }}>♫</span>
          <span style={{ fontSize: 11, color: '#868e96', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {props.src ? fileName(String(props.src)) : 'audio'}
          </span>
        </div>
      );

    case 'youtube':
      return (
        <div className="cv-media-placeholder">
          <span className="play">▶</span>
          <span className="media-label">YouTube: {String(props.videoId ?? '')}</span>
        </div>
      );

    case 'gallery': {
      const cols = Math.max(1, num(props.columns, 3));
      const gap = num(props.gap, 0);
      const thumbs = images.length > 0 ? images : Array.from({ length: cols * 2 }, () => '');
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap, width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          {thumbs.map((u, i) =>
            u ? (
              <img key={i} src={u} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 0, ...NO_PTR }} />
            ) : (
              <div key={i} style={{ background: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', minHeight: 0 }}>🖼</div>
            )
          )}
        </div>
      );
    }

    case 'slideshow': {
      const total = images.length || 3;
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000000', overflow: 'hidden' }}>
          {images[0] ? (
            <img src={images[0]} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...NO_PTR }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbbbbb', fontSize: 28 }}>🎞</div>
          )}
          <span style={{ position: 'absolute', right: 8, bottom: 6, fontSize: 11, color: '#ffffff', background: 'rgba(0,0,0,.5)', borderRadius: 8, padding: '1px 8px' }}>
            1/{total}
          </span>
        </div>
      );
    }

    case 'carousel': {
      const visible = Math.max(1, num(props.visible, 3));
      const gap = num(props.gap, 0);
      const thumbs = images.length > 0 ? images : Array.from({ length: visible }, () => '');
      return (
        <div style={{ display: 'flex', gap, width: '100%', height: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
          {thumbs.slice(0, Math.max(visible, thumbs.length)).map((u, i) =>
            u ? (
              <img key={i} src={u} alt="" draggable={false} style={{ flex: 1, minWidth: 0, height: '100%', objectFit: 'cover', display: 'block', ...NO_PTR }} />
            ) : (
              <div key={i} style={{ flex: 1, minWidth: 0, background: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>🖼</div>
            )
          )}
        </div>
      );
    }

    case 'lightbox':
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
          {props.src ? (
            <img src={String(props.src)} alt="" draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...NO_PTR }} />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#dee2e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd', fontSize: 24 }}>🖼</div>
          )}
          <span style={{ position: 'absolute', right: 6, top: 6, fontSize: 14, background: 'rgba(255,255,255,.85)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</span>
          {props.caption ? (
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, fontSize: 10, color: '#ffffff', background: 'rgba(0,0,0,.45)', padding: '2px 6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {String(props.caption)}
            </span>
          ) : null}
        </div>
      );

    default:
      return null;
  }
}

/* =============================================================== Advanced */

const ALERT_KINDS: Record<string, { bg: string; fg: string; icon: string }> = {
  info: { bg: '#cff4fc', fg: '#055160', icon: 'ℹ' },
  success: { bg: '#d1e7dd', fg: '#0f5132', icon: '✓' },
  warning: { bg: '#fff3cd', fg: '#664d03', icon: '⚠' },
  error: { bg: '#f8d7da', fg: '#842029', icon: '✕' },
};

function renderAdvanced(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'htmlEmbed':
      return <div className="cv-fill" dangerouslySetInnerHTML={{ __html: String(props.html ?? '') }} />;

    case 'accordion': {
      const items = pairs(props.items);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          {items.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid #dee2e6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', fontWeight: 600 }}>
                <span style={{ fontSize: 10 }}>{i === 0 ? '▾' : '▸'}</span>
                <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{it.label}</span>
              </div>
              {i === 0 && it.url && (
                <div style={{ padding: '0 10px 10px', whiteSpace: 'pre-wrap', overflow: 'hidden' }}>{it.url}</div>
              )}
            </div>
          ))}
        </div>
      );
    }

    case 'modal':
      // always rendered open in the designer
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #dee2e6', flexShrink: 0 }}>
            <span style={{ fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{String(props.title ?? '')}</span>
            <span style={{ color: '#868e96' }}>✕</span>
          </div>
          <div style={{ padding: 12, whiteSpace: 'pre-wrap', overflow: 'hidden' }}>{String(props.text ?? '')}</div>
        </div>
      );

    case 'tooltip':
      return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden' }}>
          <span style={{ borderBottom: '1px dotted currentColor' }}>{String(props.text ?? '')}</span>
        </div>
      );

    case 'progress': {
      const max = Math.max(1, num(props.max, 100));
      const pct = Math.min(100, Math.max(0, (num(props.value, 0) / max) * 100));
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: String(props.barColor || '#0d6efd') }} />
        </div>
      );
    }

    case 'counter':
      return (
        <div style={fillFlex({ justifyContent: justifyFor(props.textAlign) })}>
          {num(props.to, 100).toLocaleString()}
        </div>
      );

    case 'rating': {
      const max = Math.max(1, num(props.max, 5));
      const value = Math.min(max, Math.max(0, num(props.value, 0)));
      return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', color: String(props.starColor || '#ffc107'), overflow: 'hidden', whiteSpace: 'nowrap', letterSpacing: 2 }}>
          {'★'.repeat(value)}{'☆'.repeat(max - value)}
        </div>
      );
    }

    case 'badge':
      return buttonLike(props);

    case 'alert': {
      const kind = ALERT_KINDS[String(props.kind)] ?? ALERT_KINDS.info;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height: '100%', background: kind.bg, color: kind.fg, overflow: 'hidden', boxSizing: 'border-box' }}>
          <span style={{ flexShrink: 0 }}>{kind.icon}</span>
          <span style={{ whiteSpace: 'pre-wrap', overflow: 'hidden' }}>{String(props.text ?? '')}</span>
        </div>
      );
    }

    case 'timeline': {
      const items = pairs(props.items);
      return (
        <div style={{ position: 'relative', width: '100%', height: '100%', paddingLeft: 20, paddingTop: 4, boxSizing: 'border-box', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 7, top: 8, bottom: 4, width: 2, background: '#dee2e6' }} />
          {items.map((it, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: 10 }}>
              <span style={{ position: 'absolute', left: -17, top: 4, width: 8, height: 8, borderRadius: '50%', background: '#0d6efd' }} />
              <div style={{ fontWeight: 700, fontSize: 12 }}>{it.label}</div>
              <div style={{ fontSize: 12, overflow: 'hidden' }}>{it.url}</div>
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

/* ================================================================== Data */

function renderData(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'table': {
      const rows = Math.max(1, num(props.rows, 1));
      const cols = Math.max(1, num(props.columns, 1));
      const bw = Math.max(0, num(props.borderWidth, 0));
      const bc = String(props.borderColor || '#dee2e6');
      const cells: ReactNode[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const header = !!props.headerRow && r === 0;
          cells.push(
            <div
              key={`${r}-${c}`}
              className={'cv-table-cell' + (header ? ' header' : '')}
              style={{ border: `${bw}px solid ${bc}` }}
            />
          );
        }
      }
      return (
        <div
          className="cv-table"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
        >
          {cells}
        </div>
      );
    }

    case 'datagrid':
      return dataGridPreview(rawLines(props.columns).map((c) => c.trim()), String(props.apiUrl ?? ''), String(props.borderColor || '#dee2e6'));

    case 'repeater': {
      const gap = num(props.gap, 8);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap, width: '100%', height: '100%', overflow: 'hidden' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1, minHeight: 0, boxSizing: 'border-box', border: '1px dashed #adb5bd',
                fontSize: 10, color: '#868e96', fontFamily: 'Courier New', padding: 4,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              }}
            >
              {String(props.itemTemplate ?? '')}
            </div>
          ))}
        </div>
      );
    }

    case 'treeview': {
      const items = String(props.items ?? '').split('\n').filter((l) => l.trim() !== '');
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', paddingTop: 2 }}>
          {items.map((l, i) => {
            const depth = Math.floor((l.match(/^ */)?.[0].length ?? 0) / 2);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: depth * 14, height: 20, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <span style={{ fontSize: 9, color: '#868e96' }}>▸</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.trim()}</span>
              </div>
            );
          })}
        </div>
      );
    }

    case 'searchbox':
      return (
        <div style={{ display: 'flex', width: '100%', height: '100%', boxSizing: 'border-box' }}>
          {mockInput(String(props.placeholder ?? ''), { flex: 1, minWidth: 0, height: '100%', borderRadius: '4px 0 0 4px', borderRight: 'none', display: 'flex', alignItems: 'center', padding: '0 8px' })}
          <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, background: '#e9ecef', border: '1px solid #ced4da', borderRadius: '0 4px 4px 0' }}>🔍</span>
        </div>
      );

    default:
      return null;
  }
}

/* ================================================================= Social */

const NETWORKS: Record<string, { glyph: string; color: string }> = {
  facebook: { glyph: 'f', color: '#1877f2' },
  x: { glyph: '𝕏', color: '#000000' },
  twitter: { glyph: '𝕏', color: '#000000' },
  instagram: { glyph: '◎', color: '#e1306c' },
  linkedin: { glyph: 'in', color: '#0a66c2' },
  youtube: { glyph: '▶', color: '#ff0000' },
  whatsapp: { glyph: '✆', color: '#25d366' },
};

function networkInfo(name: string): { glyph: string; color: string } {
  const key = name.trim().toLowerCase();
  return NETWORKS[key] ?? { glyph: (key[0] ?? '?').toUpperCase(), color: '#6c757d' };
}

function renderSocial(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'socialicons': {
      const size = Math.max(12, num(props.size, 36));
      const gap = num(props.gap, 8);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap, width: '100%', height: '100%', overflow: 'hidden' }}>
          {rawLines(props.networks).map((n, i) => {
            const info = networkInfo(n);
            return (
              <span
                key={i}
                style={{
                  width: size, height: size, flexShrink: 0, borderRadius: '50%',
                  background: info.color, color: '#ffffff',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: size * 0.45, fontWeight: 700, lineHeight: 1,
                }}
              >
                {info.glyph}
              </span>
            );
          })}
        </div>
      );
    }

    case 'sharebuttons': {
      const gap = num(props.gap, 8);
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap, width: '100%', height: '100%', overflow: 'hidden' }}>
          {rawLines(props.networks).map((n, i) => {
            const info = networkInfo(n);
            const name = n.trim();
            return (
              <span
                key={i}
                style={{
                  flexShrink: 0, background: info.color, color: '#ffffff', borderRadius: 4,
                  padding: '5px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
                }}
              >
                {name ? name[0].toUpperCase() + name.slice(1) : 'Share'}
              </span>
            );
          })}
        </div>
      );
    }

    case 'whatsapp':
      return buttonLike(props, 'WhatsApp');

    case 'facebook':
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', color: '#495057' }}>
          <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#1877f2', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, lineHeight: 1 }}>f</span>
          <span style={{ fontSize: 11, color: '#868e96', maxWidth: '92%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {String(props.pageUrl ?? '') || 'Facebook page URL'}
          </span>
        </div>
      );

    case 'xembed':
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden', color: '#495057' }}>
          <span style={{ fontSize: 32, lineHeight: 1 }}>𝕏</span>
          <span style={{ fontSize: 11, color: '#868e96', maxWidth: '92%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {String(props.tweetUrl ?? '') || 'X post URL'}
          </span>
        </div>
      );

    default:
      return null;
  }
}

/* ================================================================== Maps */

function renderMaps(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'map':
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, overflow: 'hidden', color: '#495057' }}>
          <span style={{ fontSize: 30, lineHeight: 1 }}>🗺</span>
          <span style={{ fontSize: 12, maxWidth: '92%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {String(props.address ?? '')}
          </span>
          <span style={{ fontSize: 10, color: '#868e96' }}>
            {String(props.provider ?? 'osm')}{props.zoom ? ` · z${num(props.zoom, 12)}` : ''}
          </span>
        </div>
      );

    case 'marker': {
      const color = String(props.markerColor || '#dc3545');
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, overflow: 'hidden' }}>
          <span
            style={{
              width: 18, height: 18, flexShrink: 0, background: color,
              borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
              border: '2px solid #ffffff', boxSizing: 'border-box',
              boxShadow: '0 1px 3px rgba(0,0,0,.35)',
            }}
          />
          {props.label ? <span style={{ fontSize: 10, color: '#495057', whiteSpace: 'nowrap' }}>{String(props.label)}</span> : null}
        </div>
      );
    }

    default:
      return null;
  }
}

/* ================================================================== Code */

function renderCode(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'html':
      return <div className="cv-fill" dangerouslySetInnerHTML={{ __html: String(props.html ?? '') }} />;

    case 'css':
      return <Placeholder label="CSS" sub={rawLines(props.code)[0]?.trim()} />;

    case 'javascript':
      return <Placeholder label="JS" sub={rawLines(props.code)[0]?.trim()} />;

    case 'iframe':
      // light placeholder instead of a live iframe: keeps the designer fast and
      // avoids loading arbitrary pages while editing
      return <Placeholder icon="🪟" label={String(props.src ?? '')} style={{ border: 'none', background: 'transparent', color: '#868e96' }} />;

    default:
      return null;
  }
}

/* =============================================================== Special */

function renderSpecial(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'qrcode':
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', padding: 6, overflow: 'hidden' }}>
          <div
            style={{
              flex: 1, minHeight: 0,
              backgroundImage: 'repeating-conic-gradient(#212529 0% 25%, #ffffff 0% 50%)',
              backgroundSize: '12px 12px',
              border: '3px solid #212529',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ flexShrink: 0, fontSize: 9, color: '#868e96', textAlign: 'center', marginTop: 3, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {String(props.data ?? '')}
          </div>
        </div>
      );

    case 'countdown': {
      const sample = String(props.format ?? 'dd : hh : mm : ss')
        .replace(/dd/g, '12')
        .replace(/hh/g, '05')
        .replace(/mm/g, '33')
        .replace(/ss/g, '09');
      return (
        <div style={fillFlex({ justifyContent: justifyFor(props.textAlign), whiteSpace: 'nowrap', overflow: 'hidden' })}>
          {sample}
        </div>
      );
    }

    case 'calendar': {
      const now = new Date();
      const month = num(props.month, 0) > 0 ? Math.min(12, num(props.month, 0)) - 1 : now.getMonth();
      const year = num(props.year, 0) > 0 ? num(props.year, 0) : now.getFullYear();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const startDay = new Date(year, month, 1).getDay();
      const isCurrent = month === now.getMonth() && year === now.getFullYear();
      const title = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
      const cells: ReactNode[] = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
        <div key={`h${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#868e96', fontSize: 10 }}>{d}</div>
      ));
      for (let i = 0; i < startDay; i++) cells.push(<div key={`b${i}`} />);
      for (let d = 1; d <= daysInMonth; d++) {
        const today = isCurrent && d === now.getDate();
        cells.push(
          <div
            key={d}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
              borderRadius: '50%',
              background: today ? '#0d6efd' : undefined,
              color: today ? '#ffffff' : undefined,
              fontWeight: today ? 700 : undefined,
            }}
          >
            {d}
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', padding: 4, boxSizing: 'border-box' }}>
          <div style={{ flexShrink: 0, textAlign: 'center', fontWeight: 700, fontSize: 12, padding: '2px 0' }}>{title}</div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', minHeight: 0 }}>
            {cells}
          </div>
        </div>
      );
    }

    case 'captcha':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', height: '100%', padding: '0 12px', boxSizing: 'border-box', overflow: 'hidden' }}>
          <span style={{ width: 22, height: 22, flexShrink: 0, border: '2px solid #6c757d', borderRadius: 3, boxSizing: 'border-box', background: '#ffffff' }} />
          <span style={{ fontSize: 13 }}>I'm not a robot</span>
        </div>
      );

    case 'cookieconsent':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: '100%', overflow: 'hidden' }}>
          <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{String(props.message ?? '')}</span>
          <span style={{ flexShrink: 0, background: '#ffffff', color: '#212529', borderRadius: 4, padding: '5px 14px', fontSize: 12, fontWeight: 600 }}>
            {String(props.buttonText ?? 'Accept')}
          </span>
        </div>
      );

    default:
      return null;
  }
}

/* ================================================================== User */

function authFormMock(props: Record<string, any>, fields: string[], buttonText: string): ReactNode {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', height: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
      {fields.map((f) => (
        <div key={f}>
          <div style={{ fontSize: 11, marginBottom: 3 }}>{f}</div>
          {mockInput(f)}
        </div>
      ))}
      {mockButton(buttonText)}
      {props.apiUrl ? <div style={{ fontSize: 9, color: '#adb5bd', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>⚡ {String(props.apiUrl)}</div> : null}
    </div>
  );
}

function renderUser(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'login':
      return authFormMock(props, ['Username', 'Password'], 'Sign In');

    case 'register':
      return authFormMock(props, ['Username', 'Password', 'Confirm Password'], 'Register');

    case 'logout':
      return buttonLike(props);

    case 'profile':
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', height: '100%', overflow: 'hidden' }}>
          {props.avatarUrl ? (
            <img src={String(props.avatarUrl)} alt="" draggable={false} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, ...NO_PTR }} />
          ) : (
            <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: '50%', background: '#dee2e6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#adb5bd' }}>👤</span>
          )}
          <span style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{String(props.name ?? '')}</div>
            <div style={{ fontSize: 11, color: '#868e96', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{String(props.email ?? '')}</div>
          </span>
        </div>
      );

    case 'dbform': {
      const fields = rawLines(props.fields).map((l) => {
        const [name, ftype, label] = l.split('|').map((s) => s.trim());
        return { name: name ?? '', ftype: ftype ?? 'text', label: label ?? name ?? '' };
      });
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', height: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {fields.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 11, marginBottom: 2 }}>{f.label}</div>
              {f.ftype === 'textarea'
                ? mockInput('', { height: 44 })
                : mockInput(f.ftype !== 'text' ? f.ftype : f.name)}
            </div>
          ))}
          {mockButton('Submit')}
        </div>
      );
    }

    case 'dbtable':
      return dataGridPreview(rawLines(props.columns).map((c) => c.trim()), String(props.apiUrl ?? ''), String(props.borderColor || '#dee2e6'));

    case 'searchresults':
      return (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden', padding: 10, boxSizing: 'border-box' }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>Search results</div>
          <div style={{ fontSize: 10, color: '#868e96', marginBottom: 8, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            ⚡ {String(props.apiUrl ?? '')}?{String(props.param ?? 'q')}=…
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ marginBottom: 8 }}>
              <div style={{ color: '#0d6efd', fontSize: 13 }}>Sample result {n}</div>
              <div style={{ fontSize: 11, color: '#868e96' }}>Short excerpt of the result text…</div>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}

/* ============================================================ E-Commerce */

function renderCommerce(type: string, props: Record<string, any>): ReactNode {
  switch (type) {
    case 'productcard':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          {props.imageSrc ? (
            <img src={String(props.imageSrc)} alt="" draggable={false} style={{ width: '100%', flex: 1, minHeight: 0, objectFit: 'cover', display: 'block', ...NO_PTR }} />
          ) : (
            <div style={{ width: '100%', flex: 1, minHeight: 0, background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: '#adb5bd' }}>🛍</div>
          )}
          <div style={{ flexShrink: 0, padding: 10 }}>
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{String(props.title ?? '')}</div>
            <div style={{ fontWeight: 700, margin: '4px 0' }}>{String(props.currency ?? '')}{String(props.price ?? '')}</div>
            {mockButton(String(props.buttonText ?? 'Add to Cart'))}
          </div>
        </div>
      );

    case 'productgrid': {
      const cols = Math.max(1, num(props.columns, 3));
      const gap = num(props.gap, 16);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden' }}>
          <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ border: '1px solid #dee2e6', borderRadius: 6, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <div style={{ flex: 1, minHeight: 0, background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>🛍</div>
                <div style={{ flexShrink: 0, padding: 6 }}>
                  <div style={{ height: 8, background: '#dee2e6', borderRadius: 3, marginBottom: 4 }} />
                  <div style={{ height: 8, width: '50%', background: '#dee2e6', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
          {props.apiUrl ? (
            <div style={{ flexShrink: 0, fontSize: 10, color: '#868e96', paddingTop: 4, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>⚡ {String(props.apiUrl)}</div>
          ) : null}
        </div>
      );
    }

    case 'price':
      return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '100%', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {String(props.currency ?? '')}{String(props.amount ?? '')}
        </div>
      );

    case 'quantity': {
      const btn: CSSProperties = {
        width: 30, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#e9ecef', borderRight: '1px solid #ced4da', fontWeight: 700, height: '100%',
      };
      return (
        <div style={{ display: 'flex', alignItems: 'stretch', width: '100%', height: '100%', overflow: 'hidden' }}>
          <span style={btn}>−</span>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{num(props.value, 1)}</span>
          <span style={{ ...btn, borderRight: 'none', borderLeft: '1px solid #ced4da' }}>＋</span>
        </div>
      );
    }

    case 'addtocart':
    case 'checkout':
      return buttonLike(props);

    case 'cart':
      return (
        <div style={fillFlex({ justifyContent: justifyFor(props.textAlign), gap: 6 })}>
          <span>🛒</span>
          <span>{String(props.text ?? '')}</span>
        </div>
      );

    default:
      return null;
  }
}

/* =========================================================== dispatch */

const GROUP_RENDERERS: Record<string, (type: string, props: Record<string, any>, style: CSSProperties) => ReactNode> = {
  Layout: renderLayout,
  Basic: renderBasic,
  Forms: renderForms,
  Navigation: renderNavigation,
  Media: renderMedia,
  Advanced: renderAdvanced,
  Data: renderData,
  Social: renderSocial,
  Maps: renderMaps,
  Code: renderCode,
  Special: renderSpecial,
  User: renderUser,
  'E-Commerce': renderCommerce,
};

function renderInner(type: string, props: Record<string, any>, style: CSSProperties): ReactNode {
  const group = COMPONENT_MAP[type]?.group;
  const renderer = group ? GROUP_RENDERERS[group] : undefined;
  const node = renderer?.(type, props, style);
  if (node !== null && node !== undefined) return node;
  if (renderer) return null; // known type whose preview is intentionally empty (section/container/group)
  return <Placeholder label={type} />; // unknown type: don't crash
}
export default function ComponentView({ component }: { component: ComponentItem }) {
  const selectedId = useProjectStore((s) => s.selectedId);
  const activeBreakpointId = useProjectStore((s) => s.activeBreakpointId);
  const breakpoints = useProjectStore((s) => s.project.breakpoints);
  const zoom = useProjectStore((s) => s.zoom);
  const snapToGrid = useProjectStore((s) => s.snapToGrid);
  const gridSize = useProjectStore((s) => s.gridSize);
  const selectComponent = useProjectStore((s) => s.selectComponent);
  const setGeometry = useProjectStore((s) => s.setGeometry);
  const openContextMenu = useProjectStore((s) => s.openContextMenu);
  const page = useCurrentPage();

  const eff = effectiveComponent(component, breakpoints, activeBreakpointId, responsiveBaseWidth(page));
  const props = eff.props;
  const selected = selectedId === component.id;
  const locked = !!component.locked;
  const hiddenNow = resolveComponentHidden(component, breakpoints, activeBreakpointId);

  const snapVal = (v: number): number =>
    snapToGrid ? Math.round(v / gridSize) * gridSize : Math.round(v);

  const propStyle = toReactStyle(styleFromProps(props)) as CSSProperties;
  const isFormControl = FORM_CONTROL_TYPES.includes(component.type);

  const startDrag = (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    selectComponent(component.id);
    if (locked) return; // locked: selectable but not movable
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const origX = eff.x;
    const origY = eff.y;
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startClientX) / zoom;
      const dy = (ev.clientY - startClientY) / zoom;
      setGeometry(component.id, { x: snapVal(origX + dx), y: snapVal(origY + dy) });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const startResize = (dir: HandleDir) => (e: ReactPointerEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    if (locked) return; // locked: not resizable
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const g = { x: eff.x, y: eff.y, width: eff.width, height: eff.height };
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startClientX) / zoom;
      const dy = (ev.clientY - startClientY) / zoom;
      let width = g.width;
      let height = g.height;
      if (dir.includes('e')) width = g.width + dx;
      if (dir.includes('w')) width = g.width - dx;
      if (dir.includes('s')) height = g.height + dy;
      if (dir.includes('n')) height = g.height - dy;
      width = Math.max(10, snapVal(width));
      height = Math.max(10, snapVal(height));
      const patch: { x?: number; y?: number; width?: number; height?: number } = { width, height };
      if (dir.includes('w')) patch.x = snapVal(g.x + (g.width - width));
      if (dir.includes('n')) patch.y = snapVal(g.y + (g.height - height));
      setGeometry(component.id, patch);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onClick = (e: ReactMouseEvent) => e.stopPropagation();

  const onContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    selectComponent(component.id);
    openContextMenu({ x: e.clientX, y: e.clientY, componentId: component.id });
  };

  return (
    <div
      className={
        'canvas-component' + (selected ? ' selected' : '') + (hiddenNow ? ' hidden-comp' : '')
      }
      style={{
        left: eff.x,
        top: eff.y,
        width: eff.width,
        height: eff.height,
        zIndex: props.zIndex !== undefined && props.zIndex !== '' ? Number(props.zIndex) : undefined,
      }}
      onPointerDown={startDrag}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="cv-content" style={isFormControl ? undefined : propStyle}>
        {renderInner(component.type, props, propStyle)}
      </div>
      {selected && locked && <div className="cv-lock">🔒</div>}
      {selected &&
        !locked &&
        HANDLES.map((h) => (
          <div
            key={h.dir}
            className={`resize-handle rh-${h.dir}`}
            style={{ cursor: h.cursor }}
            onPointerDown={startResize(h.dir)}
          />
        ))}
    </div>
  );
}
