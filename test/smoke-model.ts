// Smoke test for model/store/exporter. Bundled with esbuild, run with node.
import { useProjectStore, effectiveComponent } from '../src/store/projectStore';
import { exportSite } from '../src/export/exportHtml';

let failures = 0;
function assert(cond: boolean, msg: string) {
  if (cond) console.log('ok  -', msg);
  else { failures++; console.error('FAIL-', msg); }
}

const s = useProjectStore.getState();

// pages
s.addPage();
let st = useProjectStore.getState();
assert(st.project.pages.length === 2, 'addPage adds a page');
const pageId = st.currentPageId;
s.renamePage(pageId, 'about');
assert(useProjectStore.getState().project.pages[1].name === 'about', 'renamePage works');
s.selectPage(st.project.pages[0].id);

// components
const id = s.addComponent('button', 100, 50)!;
st = useProjectStore.getState();
assert(st.project.pages[0].components.length === 1, 'addComponent adds component');
assert(st.selectedId === id, 'new component is selected');
assert(st.tool === 'pointer', 'tool reset to pointer after placement');

// two-way binding: geometry
s.setGeometry(id, { x: 200, y: 80 });
let comp = useProjectStore.getState().project.pages[0].components[0];
assert(comp.x === 200 && comp.y === 80, 'setGeometry moves component');

// props
s.updateProps(id, { text: 'Click me', backgroundColor: '#ff0000' });
comp = useProjectStore.getState().project.pages[0].components[0];
assert(comp.props.text === 'Click me', 'updateProps sets text');

// breakpoint overrides
s.addBreakpoint('Small', 360);
st = useProjectStore.getState();
const bpId = st.project.breakpoints.find((b) => b.name === 'Small')!.id;
const pageWidth = st.project.pages[0].width;
s.setActiveBreakpoint(bpId);
s.setGeometry(id, { x: 10, width: 100 });
s.updateProps(id, { fontSize: 20 });
comp = useProjectStore.getState().project.pages[0].components[0];
assert(comp.x === 200, 'base geometry untouched by breakpoint override');
assert(comp.overrides[bpId]?.x === 10 && comp.overrides[bpId]?.width === 100, 'override stores geometry');
const eff = effectiveComponent(comp, useProjectStore.getState().project.breakpoints, bpId, pageWidth);
assert(eff.x === 10 && eff.width === 100 && eff.props.fontSize === 20 && eff.props.text === 'Click me', 'effectiveComponent merges override');

// responsive cascade: wider breakpoint edits flow down until a narrower override exists
const tabletBpId = useProjectStore.getState().project.breakpoints.find((b) => b.maxWidth === 768)!.id;
const mobileBpId = useProjectStore.getState().project.breakpoints.find((b) => b.maxWidth === 480)!.id;
s.setActiveBreakpoint(null);
const scaleId = s.addComponent('heading', 20, 20)!;
s.setGeometry(scaleId, { x: 30, y: 40, width: 900, height: 100 });
const scaleComp = useProjectStore.getState().project.pages[0].components.find((c) => c.id === scaleId)!;
const scaledMobile = effectiveComponent(scaleComp, useProjectStore.getState().project.breakpoints, mobileBpId, pageWidth);
assert(scaledMobile.width === Math.round(900 * (480 / pageWidth)), 'desktop-only width scales into untouched mobile breakpoint');
assert(scaledMobile.height === Math.round(100 * (480 / pageWidth)), 'desktop-only height scales proportionally into untouched mobile breakpoint');
s.setActiveBreakpoint(tabletBpId);
s.setGeometry(id, { x: 40 });
comp = useProjectStore.getState().project.pages[0].components[0];
const beforeMobileOverride = effectiveComponent(comp, useProjectStore.getState().project.breakpoints, mobileBpId, pageWidth);
assert(beforeMobileOverride.x === Math.round(40 * (480 / 768)), 'wider breakpoint override scales into narrower breakpoint');
s.setActiveBreakpoint(mobileBpId);
s.setGeometry(id, { x: 30 });
comp = useProjectStore.getState().project.pages[0].components[0];
s.setActiveBreakpoint(tabletBpId);
s.setGeometry(id, { x: 60 });
comp = useProjectStore.getState().project.pages[0].components[0];
const tabletAfter = effectiveComponent(comp, useProjectStore.getState().project.breakpoints, tabletBpId, pageWidth);
const mobileAfter = effectiveComponent(comp, useProjectStore.getState().project.breakpoints, mobileBpId, pageWidth);
assert(tabletAfter.x === 60, 'edited breakpoint updates its own resolved layout');
assert(mobileAfter.x === 30, 'narrower breakpoint with its own override ignores later wider changes');
s.setActiveBreakpoint(null);

// events
s.updateEvents(id, { onclick: 'alert("hi")' });
comp = useProjectStore.getState().project.pages[0].components[0];
assert(comp.events.onclick === 'alert("hi")', 'updateEvents stores handler');

// arrange
const id2 = s.addComponent('text', 0, 0)!;
s.arrange(id2, 'back');
st = useProjectStore.getState();
assert(st.project.pages[0].components[0].id === id2, 'arrange back moves to front of array (bottom z)');

// export
const files = exportSite(useProjectStore.getState().project);
const names = files.map((f) => f.name);
assert(names.includes('css/site.css'), 'export emits site.css');
assert(names.includes('index.html') && names.includes('about.html'), 'export emits one html per page');
const css = files.find((f) => f.name === 'css/site.css')!.content;
assert(css.includes('@media (max-width: 360px)'), 'css has custom breakpoint media query');
assert(css.includes('@media (max-width: 768px)'), 'css has default tablet breakpoint');
assert(css.includes(`#${id}`), 'css contains component rule');
const html = files.find((f) => f.name === 'index.html')!.content;
assert(html.includes('onclick="alert(&quot;hi&quot;)"'), 'event handler exported escaped');
assert(html.includes('<button'), 'button exported');
assert(html.includes('css/site.css'), 'html links stylesheet');

// auto-grow: dragging beyond canvas bottom stretches page height
const hBefore = useProjectStore.getState().project.pages[0].height;
s.setGeometry(id, { y: 1400 });
st = useProjectStore.getState();
assert(st.project.pages[0].height > 1400 && st.project.pages[0].height > hBefore, 'page height grows to cover dragged component');
assert(st.project.pages[0].height >= 1400 + comp.height, 'grown height covers full component');
const hAfterGrow = st.project.pages[0].height;
s.setGeometry(id, { y: 100 });
assert(useProjectStore.getState().project.pages[0].height === hAfterGrow, 'page height never auto-shrinks');

// export min-height covers content
s.setGeometry(id, { y: 1600 });
const files2 = exportSite(useProjectStore.getState().project);
const css2 = files2.find((f) => f.name === 'css/site.css')!.content;
const grownH = useProjectStore.getState().project.pages[0].height;
assert(css2.includes(`min-height: ${grownH}px`), 'exported min-height covers content');

// manual page height is authoritative
s.updatePageProps(useProjectStore.getState().currentPageId, { height: 800 });
assert(useProjectStore.getState().project.pages[0].height === 800, 'manual page height is stored as-is');
const css3 = exportSite(useProjectStore.getState().project).find((f) => f.name === 'css/site.css')!.content;
assert(css3.includes('min-height: 800px'), 'exported min-height respects manual page height');

// ---- context menu / clipboard actions ----
const findC = (cid: string) =>
  useProjectStore.getState().project.pages[0].components.find((c) => c.id === cid);

// copy / paste (+10 offset, new id, selected)
s.copyComponent(id2);
assert(useProjectStore.getState().clipboard?.id === id2, 'copyComponent stores deep clone in clipboard');
const dirtyBeforeCopy = useProjectStore.getState().dirty;
s.copyComponent(id2);
assert(useProjectStore.getState().dirty === dirtyBeforeCopy, 'copy does not mark dirty');
const pasteId = s.pasteComponent(false)!;
st = useProjectStore.getState();
const orig2 = findC(id2)!;
const pasted = findC(pasteId)!;
assert(pasteId !== id2, 'paste assigns a new id');
assert(pasted.x === orig2.x + 10 && pasted.y === orig2.y + 10, 'paste offsets +10/+10');
assert(st.selectedId === pasteId, 'paste selects the pasted component');

// paste in place
const pipId = s.pasteComponent(true)!;
const pip = findC(pipId)!;
assert(pip.x === orig2.x && pip.y === orig2.y, 'paste in place keeps exact x/y');

// cut
const countBeforeCut = useProjectStore.getState().project.pages[0].components.length;
s.cutComponent(pipId);
st = useProjectStore.getState();
assert(st.project.pages[0].components.length === countBeforeCut - 1 && !findC(pipId), 'cut removes the original');
assert(st.clipboard?.id === pipId, 'cut puts the component in the clipboard');

// copy/paste style
s.copyStyle(id);
assert(useProjectStore.getState().styleClipboard?.text === 'Click me', 'copyStyle stores props');
s.pasteStyle(pasteId);
assert(findC(pasteId)!.props.text === 'Click me' && findC(pasteId)!.props.backgroundColor === '#ff0000', 'pasteStyle applies stored props');

// rename id
s.selectComponent(pasteId);
assert(s.renameComponentId(pasteId, 'MyText1') === true, 'renameComponentId accepts a valid unique id');
st = useProjectStore.getState();
assert(!!findC('MyText1') && !findC(pasteId), 'rename updates the component id');
assert(st.selectedId === 'MyText1', 'rename updates selectedId');
assert(s.renameComponentId('MyText1', id) === false, 'rename rejects a duplicate id');
assert(s.renameComponentId('MyText1', '1bad id') === false, 'rename rejects a malformed id');

// clone and hide
const cloneId = s.cloneComponent(id, true)!;
assert(findC(id)!.hidden === true, 'clone-and-hide hides the original');
assert(!findC(cloneId)!.hidden, 'clone itself is not hidden');
assert(findC(cloneId)!.x === findC(id)!.x + 10 && findC(cloneId)!.y === findC(id)!.y + 10, 'clone offsets +10/+10');

// toggleHidden / toggleLocked
s.toggleHidden(id2);
assert(findC(id2)!.hidden === true, 'toggleHidden hides');
s.toggleHidden(id2);
assert(!findC(id2)!.hidden, 'toggleHidden unhides');
s.toggleLocked(id2);
assert(findC(id2)!.locked === true, 'toggleLocked locks');
s.toggleLocked(id2);
assert(!findC(id2)!.locked, 'toggleLocked unlocks');

// hide in other breakpoints (toggle)
st = useProjectStore.getState();
const otherBps = st.project.breakpoints.map((b) => b.id).filter((b) => b !== bpId);
s.toggleHiddenInOtherBreakpoints(id2, bpId);
const hin = findC(id2)!.hiddenIn ?? [];
assert(otherBps.length > 0 && otherBps.every((b) => hin.includes(b)) && !hin.includes(bpId), 'hide in other breakpoints adds all other bp ids');
s.toggleHiddenInOtherBreakpoints(id2, bpId);
assert((findC(id2)!.hiddenIn ?? []).length === 0, 'toggling again removes them');

// centerInPage (page.width=970, page.height=800, text defaultSize 250x60)
s.centerInPage(id2, 'both', 970, 800);
assert(findC(id2)!.x === 360 && findC(id2)!.y === 370, 'centerInPage centers both axes');
s.setGeometry(id2, { x: 0, y: 0 });
s.centerInPage(id2, 'h', 970, 800);
assert(findC(id2)!.x === 360 && findC(id2)!.y === 0, 'centerInPage h keeps y');
s.centerInPage(id2, 'v', 970, 800);
assert(findC(id2)!.y === 370 && findC(id2)!.x === 360, 'centerInPage v keeps x');

// exporter skips hidden component entirely
s.toggleHidden(id2);
const filesH = exportSite(useProjectStore.getState().project);
const cssH = filesH.find((f) => f.name === 'css/site.css')!.content;
const htmlH = filesH.find((f) => f.name === 'index.html')!.content;
assert(!cssH.includes(`#${id2}`), 'exporter omits css for hidden component');
assert(!htmlH.includes(`id="${id2}"`), 'exporter omits html for hidden component');
s.toggleHidden(id2);

// hiddenIn emits display:none inside each matching media query
s.toggleHiddenInOtherBreakpoints(id2, null); // active = Default → all breakpoints
const cssHI = exportSite(useProjectStore.getState().project).find((f) => f.name === 'css/site.css')!.content;
assert(cssHI.includes(`#${id2} { display: none }`), 'hiddenIn emits display:none in media queries');
assert(cssHI.includes(`#${id2} { position: absolute`), 'base rule kept for breakpoint-hidden component');
s.toggleHiddenInOtherBreakpoints(id2, null); // restore

// delete page
s.deletePage(pageId);
assert(useProjectStore.getState().project.pages.length === 1, 'deletePage removes page');

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
