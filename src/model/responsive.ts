import type { Breakpoint, ComponentItem, ComponentOverride } from './types';

/**
 * Responsive cascade — WYSIWYG Web Builder semantics:
 *
 * - The Default (base) design covers every screen from the top down to the
 *   widest breakpoint.
 * - A breakpoint's arrangement covers all screens equal to or smaller than its
 *   maxWidth, down to the next narrower breakpoint.
 * - A change made at one breakpoint propagates to all narrower breakpoints,
 *   EXCEPT elements that have their own override there: once an element is
 *   touched at a breakpoint it becomes independent of the layers above
 *   (element-level stickiness). To get that stickiness, the store seeds a full
 *   snapshot of the resolved state on first edit — see snapshotOverride().
 */

/** Id of the breakpoint whose override governs the component at `targetId`:
 *  the narrowest breakpoint with maxWidth >= target.maxWidth that has an
 *  override for this component. Null when no layer above touches it. */
export function governingBreakpointId(
  c: ComponentItem,
  breakpoints: Breakpoint[],
  targetId: string
): string | null {
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return null;
  let best: Breakpoint | null = null;
  for (const b of breakpoints) {
    if (b.maxWidth < target.maxWidth) continue; // narrower layers never propagate up
    if (!c.overrides[b.id]) continue;
    if (!best || b.maxWidth < best.maxWidth) best = b;
  }
  return best ? best.id : null;
}

/** Effective geometry+props of a component at a breakpoint (null = Default/base). */
export function resolveComponent(
  c: ComponentItem,
  breakpoints: Breakpoint[],
  targetId: string | null,
  baseWidth?: number
): ComponentItem {
  if (!targetId) return c;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return c;
  const gid = governingBreakpointId(c, breakpoints, targetId);
  const sourceWidth = gid
    ? breakpoints.find((b) => b.id === gid)?.maxWidth ?? target.maxWidth
    : baseWidth || target.maxWidth;
  const scale = sourceWidth > 0 ? target.maxWidth / sourceWidth : 1;
  if (!gid) {
    return {
      ...c,
      x: Math.round(c.x * scale),
      y: Math.round(c.y * scale),
      width: Math.round(c.width * scale),
      height: Math.round(c.height * scale),
    };
  }
  const ov = c.overrides[gid];
  const x = ov.x ?? c.x;
  const y = ov.y ?? c.y;
  const width = ov.width ?? c.width;
  const height = ov.height ?? c.height;
  return {
    ...c,
    x: Math.round(x * scale),
    y: Math.round(y * scale),
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    props: { ...c.props, ...(ov.props ?? {}) },
  };
}

/** Effective visibility at a breakpoint. Any component override at a narrower
 *  breakpoint stops wider visibility from propagating, matching the same
 *  element-level stickiness used for geometry and props. */
export function resolveComponentHidden(
  c: ComponentItem,
  breakpoints: Breakpoint[],
  targetId: string | null
): boolean {
  if (c.hidden) return true;
  if (!targetId) return false;
  const target = breakpoints.find((b) => b.id === targetId);
  if (!target) return false;
  let best: Breakpoint | null = null;
  for (const b of breakpoints) {
    if (b.maxWidth < target.maxWidth) continue;
    if (!c.overrides[b.id] && !(c.hiddenIn ?? []).includes(b.id)) continue;
    if (!best || b.maxWidth < best.maxWidth) best = b;
  }
  if (!best) return false;
  const ov = c.overrides[best.id];
  if (ov && typeof ov.hidden === 'boolean') return ov.hidden;
  return (c.hiddenIn ?? []).includes(best.id);
}

/** Full snapshot of a resolved state, seeded into overrides[bpId] on the first
 *  edit at that breakpoint so later changes above stop propagating to it. */
export function snapshotOverride(r: ComponentItem, hidden = false): ComponentOverride {
  return { x: r.x, y: r.y, width: r.width, height: r.height, hidden, props: { ...r.props } };
}
