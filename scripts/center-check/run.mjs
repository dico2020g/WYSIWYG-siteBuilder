import { useProjectStore, COMPONENT_MAP } from './bundle2.mjs';

const grid = 10;
const drop = { x: 247, y: 163 }; // arbitrary drop point, not on grid

// Pick a control whose default size is NOT a multiple of the grid.
const type = 'button';
const def = COMPONENT_MAP[type];
const w = def.defaultSize.width;
const h = def.defaultSize.height;

const st = useProjectStore.getState();
st.addComponent(type, drop.x, drop.y);

const after = useProjectStore.getState();
const comp = (after.project.pages.find((p) => p.id === after.currentPageId) ?? after.project.pages[0])
  .components.find((c) => c.type === 'button' && c.props.buttonText === def.defaultProps.buttonText)
  ?? after.project.pages[0].components[after.project.pages[0].components.length - 1];

const sx = Math.round(drop.x / grid) * grid;
const sy = Math.round(drop.y / grid) * grid;

const centerX = comp.x + w / 2;
const centerY = comp.y + h / 2;

console.log(JSON.stringify({
  type,
  drop,
  grid,
  defaultSize: { w, h },
  compPos: { x: comp.x, y: comp.y },
  center: { x: centerX, y: centerY },
  snappedDrop: { x: sx, y: sy },
  centerMatchesSnappedDrop: Math.round(centerX) === sx && Math.round(centerY) === sy,
  componentCenterOnDrop: Math.round(centerX) === Math.round(drop.x) && Math.round(centerY) === Math.round(drop.y),
}));
