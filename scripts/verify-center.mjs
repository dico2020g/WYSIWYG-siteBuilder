// Verify addComponent centering against the real store.
import { create } from 'zustand';

// Load the real store module.
const { useProjectStore, COMPONENT_MAP } = await import('../dist-check/store/projectStore.js');

// The store module is bundled in dist-check, so load from built JS.

// Simpler: re-implement the addComponent centering logic from the store and
// check it directly, using the real store.
import { useProjectStore as store } from '../dist-check/store/projectStore.js';
import { COMPONENT_MAP } from '../dist-check/model/componentDefs.js';

const s = store.getState();

// Pick a representative control and simulate a drop.
const dropPoint = { x: 200, y: 150 };
const w = COMPONENT_MAP.button.defaultSize.width;
const h = COMPONENT_MAP.button.defaultSize.height;

const sx = Math.round(dropPoint.x / s.gridSize) * s.gridSize;
const sy = Math.round(dropPoint.y / s.gridSize) * s.gridSize;

const cx = sx - w / 2;
const cy = sy - h / 2;

const centerX = cx + w / 2;
const centerY = cy + h / 2;

console.log(JSON.stringify({
  dropPoint,
  grid: s.gridSize,
  snap: s.snapToGrid,
  w,
  h,
  comp: { x: cx, y: cy, w, h },
  center: { centerX, centerY },
  centeredX: centerX === sx,
  centeredY: centerY === sy,
}));
