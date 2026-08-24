/**
 * Helpers for the component transform system. Rotation and flipping are stored
 * in `props.transform` as CSS tokens (`rotate(Xdeg)`, `scaleX(-1)`,
 * `scaleY(-1)`); any other tokens the user entered manually are preserved.
 */

export interface TransformState {
  rotate: number; // degrees, normalized to 0..359
  flipH: boolean;
  flipV: boolean;
  other: string[]; // unrecognized tokens, preserved verbatim
}

const ROTATE_RE = /^rotate\(\s*(-?[\d.]+)deg\s*\)$/;
const FLIP_H_RE = /^scaleX\(\s*-1\s*\)$/;
const FLIP_V_RE = /^scaleY\(\s*-1\s*\)$/;

export function readTransform(transform: unknown): TransformState {
  const state: TransformState = { rotate: 0, flipH: false, flipV: false, other: [] };
  if (typeof transform !== 'string' || !transform.trim()) return state;
  for (const token of transform.trim().split(/\s+(?=[a-z])/i)) {
    const t = token.trim();
    if (!t) continue;
    const rot = ROTATE_RE.exec(t);
    if (rot) {
      state.rotate = ((Number(rot[1]) % 360) + 360) % 360;
    } else if (FLIP_H_RE.test(t)) {
      state.flipH = true;
    } else if (FLIP_V_RE.test(t)) {
      state.flipV = true;
    } else {
      state.other.push(t);
    }
  }
  return state;
}

export function buildTransform(state: TransformState): string {
  const parts: string[] = [];
  const rot = ((Math.round(state.rotate) % 360) + 360) % 360;
  if (rot !== 0) parts.push(`rotate(${rot}deg)`);
  if (state.flipH) parts.push('scaleX(-1)');
  if (state.flipV) parts.push('scaleY(-1)');
  parts.push(...state.other);
  return parts.join(' ');
}

/** Patch for updateProps(): merged transform, or `undefined` to clear the prop. */
export function transformPatch(current: unknown, mutate: (state: TransformState) => void): { transform: string } {
  const state = readTransform(current);
  mutate(state);
  return { transform: buildTransform(state) };
}
