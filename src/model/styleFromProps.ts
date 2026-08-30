/**
 * Maps component props to CSS declarations. Used by the canvas renderer
 * (React) and the HTML exporter so both render identically.
 * Values are plain CSS strings; keys are kebab-case CSS property names.
 *
 * Handles the COMMON property system (see componentDefs.ts): layout extras,
 * typography, background/border, effects. Hover CSS, custom CSS, custom
 * attributes and domId are export-only and handled by the exporter.
 */

/** Append 'px' to a bare number, otherwise return unchanged. */
function pxish(v: any): string {
  if (v === undefined || v === null || v === '') return '0px';
  const s = String(v).trim();
  if (s === '0') return '0px';
  return isNaN(Number(s)) ? s : `${s}px`;
}

/** Append '%' to a bare number (for filter functions). */
function pct(v: any): string {
  const s = String(v).trim();
  return s.endsWith('%') ? s : `${s}%`;
}

/** Append 'deg' to a bare number (for hue-rotate). */
function deg(v: any): string {
  const s = String(v).trim();
  return s.endsWith('deg') ? s : `${s}deg`;
}

/** Convert a #rrggbb color + alpha (0..1) to rgba() string. */
function hexToRgba(hex: string, alpha: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

export function styleFromProps(props: Record<string, any>): Record<string, string> {
  const css: Record<string, string> = {};
  const num = (v: any) => (v === undefined || v === null || v === '' ? undefined : Number(v));
  const str = (v: any) => (v === undefined || v === null || v === '' ? undefined : String(v));
  // Typography
  const fontSize = num(props.fontSize);
  if (fontSize) css['font-size'] = `${fontSize}px`;
  if (str(props.fontFamily)) css['font-family'] = String(props.fontFamily);
  if (str(props.fontWeight)) css['font-weight'] = String(props.fontWeight);
  if (str(props.textAlign)) css['text-align'] = String(props.textAlign);
  if (str(props.color)) css['color'] = String(props.color);
  if (str(props.lineHeight)) css['line-height'] = String(props.lineHeight);
  if (str(props.letterSpacing)) css['letter-spacing'] = String(props.letterSpacing);
  if (str(props.wordSpacing)) css['word-spacing'] = String(props.wordSpacing);
  if (str(props.fontStyle) && props.fontStyle !== 'normal') css['font-style'] = String(props.fontStyle);
  if (str(props.textDecoration) && props.textDecoration !== 'none') css['text-decoration'] = String(props.textDecoration);
  if (str(props.textDecorationColor)) css['text-decoration-color'] = String(props.textDecorationColor);
  if (str(props.textDecorationStyle)) css['text-decoration-style'] = String(props.textDecorationStyle);
  if (str(props.textTransform) && props.textTransform !== 'none') css['text-transform'] = String(props.textTransform);
  if (str(props.whiteSpace) && props.whiteSpace !== 'normal') css['white-space'] = String(props.whiteSpace);
  if (str(props.wordBreak)) css['word-break'] = String(props.wordBreak);
  if (str(props.overflowWrap)) css['overflow-wrap'] = String(props.overflowWrap);
  if (str(props.textOverflow)) css['text-overflow'] = String(props.textOverflow);
  if (str(props.textIndent)) css['text-indent'] = String(props.textIndent);
  if (str(props.direction)) css['direction'] = String(props.direction);

  // Background
  const bgOpacity = num(props.backgroundOpacity);
  const bgColor = str(props.backgroundColor);
  if (bgColor) {
    if (bgOpacity !== undefined && bgOpacity < 100 && bgOpacity >= 0) {
      css['background-color'] = hexToRgba(bgColor, bgOpacity / 100);
    } else {
      css['background-color'] = bgColor;
    }
  }
  if (str(props.backgroundImage)) css['background-image'] = String(props.backgroundImage);
  if (str(props.backgroundSize) && props.backgroundSize !== 'auto') css['background-size'] = String(props.backgroundSize);
  if (str(props.backgroundPosition)) css['background-position'] = String(props.backgroundPosition);
  if (str(props.backgroundRepeat)) css['background-repeat'] = String(props.backgroundRepeat);
  if (str(props.backgroundAttachment) && props.backgroundAttachment !== 'scroll') css['background-attachment'] = String(props.backgroundAttachment);

  // Border
  const bw = num(props.borderWidth);
  if (bw) {
    css['border-style'] = str(props.borderStyle) ?? 'solid';
    css['border-width'] = `${bw}px`;
    if (str(props.borderColor)) css['border-color'] = String(props.borderColor);
  }
  const br = num(props.borderRadius);
  if (br) css['border-radius'] = `${br}px`;
  // Per-side border overrides
  const side = (
    key: string,
    prop: 'border-top' | 'border-right' | 'border-bottom' | 'border-left'
  ) => {
    if (str(props[key])) css[prop + '-width'] = pxish(props[key]);
  };
  side('borderTopWidth', 'border-top');
  side('borderRightWidth', 'border-right');
  side('borderBottomWidth', 'border-bottom');
  side('borderLeftWidth', 'border-left');
  if (str(props.borderTopStyle)) css['border-top-style'] = String(props.borderTopStyle);
  if (str(props.borderRightStyle)) css['border-right-style'] = String(props.borderRightStyle);
  if (str(props.borderBottomStyle)) css['border-bottom-style'] = String(props.borderBottomStyle);
  if (str(props.borderLeftStyle)) css['border-left-style'] = String(props.borderLeftStyle);
  if (str(props.borderTopColor)) css['border-top-color'] = String(props.borderTopColor);
  if (str(props.borderRightColor)) css['border-right-color'] = String(props.borderRightColor);
  if (str(props.borderBottomColor)) css['border-bottom-color'] = String(props.borderBottomColor);
  if (str(props.borderLeftColor)) css['border-left-color'] = String(props.borderLeftColor);
  if (str(props.borderTopLeftRadius)) css['border-top-left-radius'] = pxish(props.borderTopLeftRadius);
  if (str(props.borderTopRightRadius)) css['border-top-right-radius'] = pxish(props.borderTopRightRadius);
  if (str(props.borderBottomRightRadius)) css['border-bottom-right-radius'] = pxish(props.borderBottomRightRadius);
  if (str(props.borderBottomLeftRadius)) css['border-bottom-left-radius'] = pxish(props.borderBottomLeftRadius);
  const ow = num(props.outlineWidth);
  if (ow) {
    css['outline-width'] = `${ow}px`;
    css['outline-style'] = str(props.outlineStyle) ?? 'solid';
    if (str(props.outlineColor)) css['outline-color'] = String(props.outlineColor);
  }

  // Layout extras
  if (str(props.minWidth)) css['min-width'] = String(props.minWidth);
  if (str(props.maxWidth)) css['max-width'] = String(props.maxWidth);
  if (str(props.minHeight)) css['min-height'] = String(props.minHeight);
  if (str(props.maxHeight)) css['max-height'] = String(props.maxHeight);
  if (str(props.margin)) css['margin'] = String(props.margin);
  if (str(props.padding)) css['padding'] = String(props.padding);
  if (str(props.boxSizing)) css['box-sizing'] = String(props.boxSizing);
  if (str(props.cursor) && props.cursor !== 'auto') css['cursor'] = String(props.cursor);
  if (str(props.overflow) && props.overflow !== 'visible') css['overflow'] = String(props.overflow);
  if (str(props.position) && props.position !== 'absolute') css['position'] = String(props.position);
  const z = num(props.zIndex);
  if (z !== undefined) css['z-index'] = String(z);

  // Flexbox (Flexbox toggle on the Home tab / context menu)
  if (str(props.display)) css['display'] = String(props.display);
  if (str(props.flexDirection)) css['flex-direction'] = String(props.flexDirection);
  if (str(props.flexWrap)) css['flex-wrap'] = String(props.flexWrap);
  if (str(props.gap)) css['gap'] = String(props.gap);
  if (str(props.justifyContent)) css['justify-content'] = String(props.justifyContent);
  if (str(props.alignItems)) css['align-items'] = String(props.alignItems);

  // Content vertical alignment (positions content inside the control's box).
  // Distinct from flexbox layout: only applied when the user set it.
  const cva = str(props.contentVerticalAlign);
  if (cva && cva !== 'top') {
    css['display'] = css['display'] ?? 'flex';
    css['flex-direction'] = css['flex-direction'] ?? 'column';
    css['justify-content'] = cva === 'middle' ? 'center' : cva === 'bottom' ? 'flex-end' : 'flex-start';
  }

  // Effects
  const op = num(props.opacity);
  if (op !== undefined && op < 100) css['opacity'] = String(op / 100);
  // Box shadow: manual CSS string wins; otherwise compose from parts.
  if (str(props.boxShadow)) {
    css['box-shadow'] = String(props.boxShadow);
  } else {
    const sx = str(props.boxShadowX);
    const sy = str(props.boxShadowY);
    if (sx || sy) {
      const blur = str(props.boxShadowBlur) ?? '0';
      const spread = str(props.boxShadowSpread) ?? '0';
      const col = str(props.boxShadowColor) ?? '#000000';
      const sop = num(props.boxShadowOpacity);
      const colWithA = sop !== undefined && sop < 100 ? hexToRgba(col, sop / 100) : col;
      const inset = props.boxShadowInset ? 'inset ' : '';
      css['box-shadow'] = `${inset}${pxish(sx ?? 0)} ${pxish(sy ?? 0)} ${pxish(blur)} ${pxish(spread)} ${colWithA}`;
    }
  }
  // Text shadow from parts.
  const tsx = str(props.textShadowX);
  const tsy = str(props.textShadowY);
  if (tsx || tsy) {
    const tblur = str(props.textShadowBlur) ?? '0';
    const tcol = str(props.textShadowColor) ?? '#000000';
    css['text-shadow'] = `${pxish(tsx ?? 0)} ${pxish(tsy ?? 0)} ${pxish(tblur)} ${tcol}`;
  }
  // Filters: preset string wins; otherwise compose granular filters.
  if (str(props.filter) && props.filter !== 'none') {
    css['filter'] = String(props.filter);
  } else {
    const parts: string[] = [];
    if (str(props.filterBlur)) parts.push(`blur(${pxish(props.filterBlur)})`);
    if (str(props.filterBrightness)) parts.push(`brightness(${pct(props.filterBrightness)})`);
    if (str(props.filterContrast)) parts.push(`contrast(${pct(props.filterContrast)})`);
    if (str(props.filterSaturation)) parts.push(`saturate(${pct(props.filterSaturation)})`);
    if (str(props.filterGrayscale)) parts.push(`grayscale(${pct(props.filterGrayscale)})`);
    if (str(props.filterSepia)) parts.push(`sepia(${pct(props.filterSepia)})`);
    if (str(props.filterHue)) parts.push(`hue-rotate(${deg(props.filterHue)})`);
    if (parts.length) css['filter'] = parts.join(' ');
  }
  if (str(props.mixBlendMode) && props.mixBlendMode !== 'normal') css['mix-blend-mode'] = String(props.mixBlendMode);
  if (str(props.transition)) css['transition'] = String(props.transition);
  if (str(props.animation)) css['animation'] = String(props.animation);
  if (str(props.transform)) css['transform'] = String(props.transform);
  if (str(props.transformOrigin) && props.transformOrigin !== 'center center') css['transform-origin'] = String(props.transformOrigin);

  return css;
}

/** Convert kebab-case css record to React camelCase style object. */
export function toReactStyle(css: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(css)) {
    out[k.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
}
