/**
 * Maps component props to CSS declarations. Used by the canvas renderer
 * (React) and the HTML exporter so both render identically.
 * Values are plain CSS strings; keys are kebab-case CSS property names.
 *
 * Handles the COMMON property system (see componentDefs.ts): layout extras,
 * typography, background/border, effects. Hover CSS, custom CSS, custom
 * attributes and domId are export-only and handled by the exporter.
 */
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
  if (str(props.textTransform) && props.textTransform !== 'none') css['text-transform'] = String(props.textTransform);
  if (str(props.whiteSpace) && props.whiteSpace !== 'normal') css['white-space'] = String(props.whiteSpace);

  // Background
  if (str(props.backgroundColor)) css['background-color'] = String(props.backgroundColor);
  if (str(props.backgroundImage)) css['background-image'] = String(props.backgroundImage);
  if (str(props.backgroundSize) && props.backgroundSize !== 'auto') css['background-size'] = String(props.backgroundSize);
  if (str(props.backgroundPosition)) css['background-position'] = String(props.backgroundPosition);
  if (str(props.backgroundRepeat)) css['background-repeat'] = String(props.backgroundRepeat);

  // Border
  const bw = num(props.borderWidth);
  if (bw) {
    css['border-style'] = str(props.borderStyle) ?? 'solid';
    css['border-width'] = `${bw}px`;
    if (str(props.borderColor)) css['border-color'] = String(props.borderColor);
  }
  const br = num(props.borderRadius);
  if (br) css['border-radius'] = `${br}px`;
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

  // Effects
  const op = num(props.opacity);
  if (op !== undefined && op < 100) css['opacity'] = String(op / 100);
  if (str(props.boxShadow)) css['box-shadow'] = String(props.boxShadow);
  if (str(props.filter) && props.filter !== 'none') css['filter'] = String(props.filter);
  if (str(props.mixBlendMode) && props.mixBlendMode !== 'normal') css['mix-blend-mode'] = String(props.mixBlendMode);
  if (str(props.transition)) css['transition'] = String(props.transition);
  if (str(props.animation)) css['animation'] = String(props.animation);
  if (str(props.transform)) css['transform'] = String(props.transform);

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
