/**
 * Component registry: every control the toolbox offers, plus the COMMON
 * property system shared by all controls (Layout / Typography / Background /
 * Border / Effects / Responsive / Advanced). Type-specific props live in
 * `fields` (the "Content" group); common props are identical for all controls
 * and are described by COMMON_GROUPS below.
 */

export type PropFieldType = 'text' | 'textarea' | 'number' | 'color' | 'select' | 'checkbox';

export interface PropField {
  key: string;
  label: string;
  type: PropFieldType;
  group: string;
  options?: string[];
  /** 'geometry' keys (x/y/width/height) bind via setGeometry; everything else via updateProps */
  bind?: 'geometry' | 'props';
}

export interface ComponentDef {
  type: string;
  label: string;
  icon: string;
  group: string;
  defaultSize: { width: number; height: number };
  /** default content props (common props are merged in from commonDefaults()) */
  defaultProps: Record<string, any>;
  /** type-specific fields, shown in the "Content" group */
  fields: PropField[];
}

/* ------------------------------------------------------------ common props */

/** Common props every control carries. Geometry (x/y/width/height) stays a
 *  top-level field on ComponentItem; these live in `props`. */
export function commonDefaults(): Record<string, any> {
  return {
    componentName: '',
    // Layout extras
    minWidth: '', maxWidth: '', margin: '', padding: '',
    position: 'absolute', zIndex: '', overflow: 'visible',
    // Background / Border
    backgroundColor: '', borderWidth: 0, borderStyle: 'solid', borderColor: '#000000',
    borderRadius: 0, boxShadow: '',
    // Typography
    fontFamily: 'Arial', fontSize: 14, fontWeight: 'normal', color: '#000000',
    textAlign: 'left', lineHeight: '', letterSpacing: '',
    // Effects
    opacity: 100, hoverCss: '', transition: '', animation: '', transform: '',
    // Advanced
    domId: '', cssClass: '', customAttributes: '', ariaLabel: '', customCss: '',
    objectBeforeHtml: '', objectAfterHtml: '',
    animationPreset: '', animationDuration: 1000, animationDelay: 0,
    animationIterationCount: '1', animationDirection: 'normal',
    animationTimingFunction: 'linear', animationFillMode: 'both',
    animationPlayState: 'running',
    animationDefinitions: '', animationUseAliases: false,
    transitionTrigger: 'hover', transitionProperty: 'background-color',
    transitionValue: '', transitionDuration: 500, transitionDelay: 0,
    transitionTimingFunction: 'linear',
  };
}

/** The shared property groups rendered by the Properties panel for every
 *  control. bind defaults to 'props'. */
export const COMMON_GROUPS: { group: string; fields: PropField[] }[] = [
  {
    group: 'Layout',
    fields: [
      { key: 'x', label: 'X', type: 'number', group: 'Layout', bind: 'geometry' },
      { key: 'y', label: 'Y', type: 'number', group: 'Layout', bind: 'geometry' },
      { key: 'width', label: 'Width', type: 'number', group: 'Layout', bind: 'geometry' },
      { key: 'height', label: 'Height', type: 'number', group: 'Layout', bind: 'geometry' },
      { key: 'minWidth', label: 'Min Width', type: 'text', group: 'Layout' },
      { key: 'maxWidth', label: 'Max Width', type: 'text', group: 'Layout' },
      { key: 'margin', label: 'Margin', type: 'text', group: 'Layout' },
      { key: 'padding', label: 'Padding', type: 'text', group: 'Layout' },
      { key: 'position', label: 'Position', type: 'select', group: 'Layout', options: ['absolute', 'fixed', 'sticky'] },
      { key: 'zIndex', label: 'Z-Index', type: 'number', group: 'Layout' },
      { key: 'overflow', label: 'Overflow', type: 'select', group: 'Layout', options: ['visible', 'hidden', 'auto', 'scroll'] },
    ],
  },
  {
    group: 'Typography',
    fields: [
      { key: 'fontFamily', label: 'Font Family', type: 'select', group: 'Typography',
        options: ['Arial', 'Helvetica', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Tahoma', 'Trebuchet MS', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'] },
      { key: 'fontSize', label: 'Font Size', type: 'number', group: 'Typography' },
      { key: 'fontWeight', label: 'Font Weight', type: 'select', group: 'Typography', options: ['normal', 'bold', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'] },
      { key: 'color', label: 'Text Color', type: 'color', group: 'Typography' },
      { key: 'textAlign', label: 'Alignment', type: 'select', group: 'Typography', options: ['left', 'center', 'right', 'justify'] },
      { key: 'lineHeight', label: 'Line Height', type: 'text', group: 'Typography' },
      { key: 'letterSpacing', label: 'Letter Spacing', type: 'text', group: 'Typography' },
    ],
  },
  {
    group: 'Background',
    fields: [{ key: 'backgroundColor', label: 'Color', type: 'color', group: 'Background' }],
  },
  {
    group: 'Border',
    fields: [
      { key: 'borderWidth', label: 'Width', type: 'number', group: 'Border' },
      { key: 'borderStyle', label: 'Style', type: 'select', group: 'Border', options: ['solid', 'dashed', 'dotted', 'double', 'none'] },
      { key: 'borderColor', label: 'Color', type: 'color', group: 'Border' },
      { key: 'borderRadius', label: 'Radius', type: 'number', group: 'Border' },
    ],
  },
  {
    group: 'Effects',
    fields: [
      { key: 'opacity', label: 'Opacity (0-100)', type: 'number', group: 'Effects' },
      { key: 'boxShadow', label: 'Box Shadow', type: 'text', group: 'Effects' },
      { key: 'hoverCss', label: 'Hover (CSS declarations)', type: 'textarea', group: 'Effects' },
      { key: 'transition', label: 'Transition', type: 'text', group: 'Effects' },
      { key: 'animation', label: 'Animation', type: 'text', group: 'Effects' },
      { key: 'transform', label: 'Transform', type: 'text', group: 'Effects' },
    ],
  },
  {
    group: 'Advanced',
    fields: [
      { key: 'domId', label: 'ID', type: 'text', group: 'Advanced' },
      { key: 'cssClass', label: 'Class', type: 'text', group: 'Advanced' },
      { key: 'customAttributes', label: 'Custom Attributes', type: 'textarea', group: 'Advanced' },
      { key: 'ariaLabel', label: 'ARIA Label', type: 'text', group: 'Advanced' },
      { key: 'customCss', label: 'Custom CSS (declarations)', type: 'textarea', group: 'Advanced' },
    ],
  },
];

/** The "Responsive" group is generated by the Properties panel from the
 *  project's breakpoints (Desktop ↔ hidden flag, each breakpoint ↔ hiddenIn),
 *  so it is not listed in COMMON_GROUPS. */

/* ------------------------------------------------------------ helpers */

function content(key: string, label: string, type: PropFieldType = 'text', options?: string[]): PropField {
  return { key, label, type, group: 'Content', options };
}

interface DefOpts {
  icon: string;
  group: string;
  w: number;
  h: number;
  props?: Record<string, any>;
  fields?: PropField[];
}

function def(type: string, label: string, o: DefOpts): ComponentDef {
  return {
    type,
    label,
    icon: o.icon,
    group: o.group,
    defaultSize: { width: o.w, height: o.h },
    defaultProps: { ...commonDefaults(), ...(o.props ?? {}) },
    fields: o.fields ?? [],
  };
}

/* ------------------------------------------------------------ registry */

export const COMPONENT_DEFS: ComponentDef[] = [
  /* ---- Layout ---- */
  def('section', 'Section', { icon: '▭', group: 'Layout', w: 940, h: 300, props: { backgroundColor: '#f8f9fa' } }),
  def('container', 'Container', { icon: '▢', group: 'Layout', w: 300, h: 200, props: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6' } }),
  def('row', 'Row', { icon: '☰', group: 'Layout', w: 600, h: 120, props: { gap: 10, backgroundColor: '' }, fields: [content('gap', 'Gap (px)', 'number')] }),
  def('column', 'Column', { icon: '▯', group: 'Layout', w: 200, h: 300, props: { gap: 10 }, fields: [content('gap', 'Gap (px)', 'number')] }),
  def('flex', 'Flexbox', { icon: '⬌', group: 'Layout', w: 400, h: 120,
    props: { direction: 'row', gap: 10, justify: 'flex-start', alignItems: 'center', backgroundColor: '' },
    fields: [
      content('direction', 'Direction', 'select', ['row', 'row-reverse', 'column', 'column-reverse']),
      content('gap', 'Gap (px)', 'number'),
      content('justify', 'Justify Content', 'select', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly']),
      content('alignItems', 'Align Items', 'select', ['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
    ] }),
  def('grid', 'Grid', { icon: '⊞', group: 'Layout', w: 400, h: 200,
    props: { columns: 3, gap: 10, backgroundColor: '' },
    fields: [content('columns', 'Columns', 'number'), content('gap', 'Gap (px)', 'number')] }),
  def('card', 'Card', { icon: '🃏', group: 'Layout', w: 280, h: 320,
    props: { title: 'Card title', text: 'Card body text', imageSrc: '', backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', boxShadow: '0 2px 8px rgba(0,0,0,.08)', padding: '16px' },
    fields: [content('title', 'Title'), content('text', 'Text', 'textarea'), content('imageSrc', 'Image URL')] }),
  def('panel', 'Panel', { icon: '▤', group: 'Layout', w: 320, h: 200,
    props: { title: 'Panel', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4 },
    fields: [content('title', 'Title')] }),
  def('group', 'Group', { icon: '⧉', group: 'Layout', w: 300, h: 200, props: { borderWidth: 1, borderColor: '#adb5bd', borderStyle: 'dashed' } }),
  def('spacer', 'Spacer', { icon: '↕', group: 'Layout', w: 80, h: 40 }),

  /* ---- Basic ---- */
  def('text', 'Text', { icon: 'T', group: 'Basic', w: 250, h: 60, props: { text: 'Double-click to edit text' }, fields: [content('text', 'Text', 'textarea')] }),
  def('heading', 'Heading', { icon: 'H1', group: 'Basic', w: 300, h: 50,
    props: { text: 'Heading', level: 'h1', fontSize: 32, fontWeight: 'bold' },
    fields: [content('text', 'Text'), content('level', 'Level', 'select', ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])] }),
  def('paragraph', 'Paragraph', { icon: '¶', group: 'Basic', w: 400, h: 120, props: { text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', lineHeight: '1.6' }, fields: [content('text', 'Text', 'textarea')] }),
  def('image', 'Image', { icon: '🖼', group: 'Basic', w: 200, h: 150,
    props: { src: '', alt: 'image', objectFit: 'cover', backgroundColor: '#e9ecef' },
    fields: [content('src', 'Image URL'), content('alt', 'Alt Text'), content('objectFit', 'Fit', 'select', ['cover', 'contain', 'fill', 'none'])] }),
  def('button', 'Button', { icon: 'Btn', group: 'Basic', w: 120, h: 36,
    props: { text: 'Button', href: '', target: '_self', color: '#ffffff', backgroundColor: '#0d6efd', borderRadius: 4, textAlign: 'center', fontWeight: '600' },
    fields: [content('text', 'Text'), content('href', 'Link URL'), content('target', 'Target', 'select', ['_self', '_blank'])] }),
  def('link', 'Link', { icon: '🔗', group: 'Basic', w: 150, h: 24,
    props: { text: 'Link', href: 'https://', target: '_self', color: '#0d6efd' },
    fields: [content('text', 'Text'), content('href', 'URL'), content('target', 'Target', 'select', ['_self', '_blank'])] }),
  def('icon', 'Icon', { icon: '★', group: 'Basic', w: 48, h: 48,
    props: { glyph: '★', fontSize: 32, textAlign: 'center' },
    fields: [content('glyph', 'Glyph (emoji/char)')] }),
  def('divider', 'Divider', { icon: '―', group: 'Basic', w: 400, h: 10, props: { lineThickness: 1 }, fields: [content('lineThickness', 'Thickness', 'number')] }),
  def('htmlEmbed', 'HTML', { icon: '</>', group: 'Advanced', w: 300, h: 200, props: { html: '<div>Custom HTML</div>' }, fields: [content('html', 'HTML Code', 'textarea')] }),

  /* ---- Forms ---- */
  def('form', 'Form', { icon: '📝', group: 'Forms', w: 360, h: 300,
    props: { action: '', method: 'post', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', padding: '16px' },
    fields: [content('action', 'Action URL'), content('method', 'Method', 'select', ['post', 'get'])] }),
  def('textInput', 'Text Input', { icon: '✎', group: 'Forms', w: 220, h: 34, props: { name: 'text1', placeholder: 'Type here...', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder')] }),
  def('password', 'Password', { icon: '🔒', group: 'Forms', w: 220, h: 34, props: { name: 'password1', placeholder: 'Password', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder')] }),
  def('email', 'Email', { icon: '✉', group: 'Forms', w: 220, h: 34, props: { name: 'email1', placeholder: 'email@example.com', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder')] }),
  def('number', 'Number', { icon: '#', group: 'Forms', w: 140, h: 34, props: { name: 'number1', placeholder: '0', min: '', max: '', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder'), content('min', 'Min', 'number'), content('max', 'Max', 'number')] }),
  def('tel', 'Telephone', { icon: '☎', group: 'Forms', w: 220, h: 34, props: { name: 'tel1', placeholder: '+1 555 000 0000', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder')] }),
  def('textarea', 'Text Area', { icon: '▤', group: 'Forms', w: 260, h: 100, props: { name: 'textarea1', placeholder: '', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('placeholder', 'Placeholder')] }),
  def('checkbox', 'Checkbox', { icon: '☑', group: 'Forms', w: 160, h: 26, props: { label: 'Checkbox', name: 'check1', checked: false }, fields: [content('label', 'Label'), content('name', 'Name'), content('checked', 'Checked', 'checkbox')] }),
  def('radio', 'Radio', { icon: '◉', group: 'Forms', w: 160, h: 26, props: { label: 'Radio', name: 'radio1', checked: false }, fields: [content('label', 'Label'), content('name', 'Group Name'), content('checked', 'Checked', 'checkbox')] }),
  def('select', 'Select', { icon: '▾', group: 'Forms', w: 220, h: 34, props: { name: 'select1', options: 'Option 1\nOption 2\nOption 3', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name'), content('options', 'Options (one per line)', 'textarea')] }),
  def('date', 'Date Picker', { icon: '📅', group: 'Forms', w: 180, h: 34, props: { name: 'date1', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name')] }),
  def('time', 'Time Picker', { icon: '🕐', group: 'Forms', w: 150, h: 34, props: { name: 'time1', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('name', 'Name')] }),
  def('file', 'File Upload', { icon: '📎', group: 'Forms', w: 260, h: 34, props: { name: 'file1', accept: '', backgroundColor: '#ffffff' }, fields: [content('name', 'Name'), content('accept', 'Accept (e.g. image/*)')] }),
  def('range', 'Range Slider', { icon: '🎚', group: 'Forms', w: 220, h: 30, props: { name: 'range1', min: 0, max: 100, value: 50 }, fields: [content('name', 'Name'), content('min', 'Min', 'number'), content('max', 'Max', 'number'), content('value', 'Value', 'number')] }),
  def('submit', 'Submit Button', { icon: '➤', group: 'Forms', w: 120, h: 36, props: { text: 'Submit', color: '#ffffff', backgroundColor: '#198754', borderRadius: 4, textAlign: 'center', fontWeight: '600' }, fields: [content('text', 'Text')] }),
  def('reset', 'Reset Button', { icon: '↺', group: 'Forms', w: 120, h: 36, props: { text: 'Reset', backgroundColor: '#e9ecef', borderRadius: 4, textAlign: 'center' }, fields: [content('text', 'Text')] }),
  def('hiddenField', 'Hidden Field', { icon: '🫥', group: 'Forms', w: 120, h: 26, props: { name: 'hidden1', value: '' }, fields: [content('name', 'Name'), content('value', 'Value')] }),

  /* ---- Navigation ---- */
  def('navbar', 'Navbar', { icon: '🧭', group: 'Navigation', w: 940, h: 56,
    props: { brand: 'Brand', links: 'Home|/\nAbout|/about\nContact|/contact', backgroundColor: '#212529', color: '#ffffff', padding: '0 20px' },
    fields: [content('brand', 'Brand'), content('links', 'Links (Label|URL per line)', 'textarea')] }),
  def('menubar', 'Menu Bar', { icon: '☰', group: 'Navigation', w: 500, h: 40,
    props: { items: 'File\nEdit\nView\nHelp', backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#dee2e6' },
    fields: [content('items', 'Items (one per line)', 'textarea')] }),
  def('hamburger', 'Hamburger Menu', { icon: '≡', group: 'Navigation', w: 48, h: 44,
    props: { links: 'Home|/\nAbout|/about', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4, fontSize: 20, textAlign: 'center' },
    fields: [content('links', 'Links (Label|URL per line)', 'textarea')] }),
  def('dropdown', 'Dropdown Menu', { icon: '⏷', group: 'Navigation', w: 180, h: 38,
    props: { label: 'Menu', items: 'Action|#\nAnother action|#\nSomething else|#', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 },
    fields: [content('label', 'Label'), content('items', 'Items (Label|URL per line)', 'textarea')] }),
  def('sidebar', 'Sidebar Menu', { icon: '▌', group: 'Navigation', w: 240, h: 500,
    props: { title: 'Menu', links: 'Dashboard|#\nReports|#\nSettings|#', backgroundColor: '#343a40', color: '#ffffff', padding: '16px' },
    fields: [content('title', 'Title'), content('links', 'Links (Label|URL per line)', 'textarea')] }),
  def('breadcrumb', 'Breadcrumb', { icon: '›', group: 'Navigation', w: 300, h: 30,
    props: { items: 'Home|/\nProducts|/products\nCurrent', separator: '/' },
    fields: [content('items', 'Items (Label|URL per line, last = current)', 'textarea'), content('separator', 'Separator')] }),
  def('pagination', 'Pagination', { icon: '❮❯', group: 'Navigation', w: 260, h: 38,
    props: { pages: 5, current: 1 },
    fields: [content('pages', 'Page Count', 'number'), content('current', 'Current Page', 'number')] }),
  def('tabs', 'Tabs', { icon: '⧉', group: 'Navigation', w: 420, h: 44,
    props: { tabs: 'Tab 1\nTab 2\nTab 3', active: 0, backgroundColor: '#f8f9fa', borderColor: '#dee2e6' },
    fields: [content('tabs', 'Tabs (one per line)', 'textarea'), content('active', 'Active Index', 'number')] }),

  /* ---- Media ---- */
  def('video', 'Video', { icon: '▶', group: 'Media', w: 320, h: 180, props: { src: '', controls: true, autoplay: false, backgroundColor: '#000000' }, fields: [content('src', 'Video URL'), content('controls', 'Show Controls', 'checkbox'), content('autoplay', 'Autoplay', 'checkbox')] }),
  def('audio', 'Audio', { icon: '♫', group: 'Media', w: 300, h: 54, props: { src: '', controls: true, backgroundColor: '#f1f3f5' }, fields: [content('src', 'Audio URL'), content('controls', 'Show Controls', 'checkbox')] }),
  def('youtube', 'YouTube', { icon: '▶', group: 'Media', w: 320, h: 180, props: { videoId: 'dQw4w9WgXcQ', backgroundColor: '#000000' }, fields: [content('videoId', 'Video ID')] }),
  def('gallery', 'Image Gallery', { icon: '🏞', group: 'Media', w: 420, h: 260, props: { images: '', columns: 3, gap: 8, backgroundColor: '#f8f9fa' }, fields: [content('images', 'Image URLs (one per line)', 'textarea'), content('columns', 'Columns', 'number'), content('gap', 'Gap (px)', 'number')] }),
  def('slideshow', 'Slideshow', { icon: '🎞', group: 'Media', w: 400, h: 240, props: { images: '', interval: 3000, backgroundColor: '#000000' }, fields: [content('images', 'Image URLs (one per line)', 'textarea'), content('interval', 'Interval (ms)', 'number')] }),
  def('carousel', 'Carousel', { icon: '🎠', group: 'Media', w: 500, h: 200, props: { images: '', visible: 3, gap: 10, backgroundColor: '#f8f9fa' }, fields: [content('images', 'Image URLs (one per line)', 'textarea'), content('visible', 'Visible Slides', 'number'), content('gap', 'Gap (px)', 'number')] }),
  def('lightbox', 'Lightbox', { icon: '🔍', group: 'Media', w: 200, h: 150, props: { src: '', caption: '', backgroundColor: '#e9ecef' }, fields: [content('src', 'Image URL'), content('caption', 'Caption')] }),

  /* ---- Advanced ---- */
  def('accordion', 'Accordion', { icon: '🪗', group: 'Advanced', w: 400, h: 220,
    props: { items: 'Section 1|Content for section 1\nSection 2|Content for section 2\nSection 3|Content for section 3', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4 },
    fields: [content('items', 'Items (Title|Content per line)', 'textarea')] }),
  def('modal', 'Modal / Popup', { icon: '🗔', group: 'Advanced', w: 400, h: 220,
    props: { title: 'Modal title', text: 'Modal content', open: true, backgroundColor: '#ffffff', borderRadius: 8, boxShadow: '0 8px 30px rgba(0,0,0,.2)' },
    fields: [content('title', 'Title'), content('text', 'Content', 'textarea'), content('open', 'Open by default', 'checkbox')] }),
  def('tooltip', 'Tooltip', { icon: '💬', group: 'Advanced', w: 180, h: 28, props: { text: 'Hover me', tip: 'Tooltip text' }, fields: [content('text', 'Text'), content('tip', 'Tooltip Text')] }),
  def('progress', 'Progress Bar', { icon: '▰', group: 'Advanced', w: 300, h: 22, props: { value: 60, max: 100, barColor: '#0d6efd', backgroundColor: '#e9ecef', borderRadius: 4 }, fields: [content('value', 'Value', 'number'), content('max', 'Max', 'number'), { ...content('barColor', 'Bar Color', 'color') }] }),
  def('counter', 'Counter', { icon: '🔢', group: 'Advanced', w: 140, h: 60, props: { from: 0, to: 100, duration: 2000, fontSize: 32, fontWeight: 'bold', textAlign: 'center' }, fields: [content('from', 'From', 'number'), content('to', 'To', 'number'), content('duration', 'Duration (ms)', 'number')] }),
  def('rating', 'Rating', { icon: '★', group: 'Advanced', w: 160, h: 32, props: { value: 4, max: 5, starColor: '#ffc107', fontSize: 22 }, fields: [content('value', 'Value', 'number'), content('max', 'Stars', 'number'), { ...content('starColor', 'Star Color', 'color') }] }),
  def('badge', 'Badge', { icon: '🏷', group: 'Advanced', w: 80, h: 26, props: { text: 'New', color: '#ffffff', backgroundColor: '#dc3545', borderRadius: 12, fontSize: 12, textAlign: 'center' }, fields: [content('text', 'Text')] }),
  def('alert', 'Alert', { icon: '⚠', group: 'Advanced', w: 400, h: 50,
    props: { text: 'This is an alert message.', kind: 'info', padding: '12px 16px', borderRadius: 4 },
    fields: [content('text', 'Text', 'textarea'), content('kind', 'Kind', 'select', ['info', 'success', 'warning', 'error'])] }),
  def('timeline', 'Timeline', { icon: '🕓', group: 'Advanced', w: 320, h: 300, props: { items: '2021|Founded\n2022|Launched v1\n2023|10k users', }, fields: [content('items', 'Items (Date|Text per line)', 'textarea')] }),

  /* ---- Data ---- */
  def('table', 'Table', { icon: '⊞', group: 'Data', w: 360, h: 160, props: { rows: 3, columns: 3, headerRow: true, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('rows', 'Rows', 'number'), content('columns', 'Columns', 'number'), content('headerRow', 'Header Row', 'checkbox')] }),
  def('datagrid', 'Data Grid', { icon: '▦', group: 'Data', w: 480, h: 240, props: { apiUrl: '', columns: 'ID\nName\nEmail', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('apiUrl', 'Data API URL (JSON array)'), content('columns', 'Columns (one per line)', 'textarea')] }),
  def('repeater', 'Repeater / List', { icon: '🔁', group: 'Data', w: 320, h: 200, props: { apiUrl: '', itemTemplate: '<div>{{name}}</div>', gap: 8 }, fields: [content('apiUrl', 'Data API URL (JSON array)'), content('itemTemplate', 'Item Template ({{field}})', 'textarea'), content('gap', 'Gap (px)', 'number')] }),
  def('treeview', 'Tree View', { icon: '🌲', group: 'Data', w: 240, h: 220, props: { items: 'Root\n  Child A\n  Child B\n    Grandchild' }, fields: [content('items', 'Items (indent with 2 spaces)', 'textarea')] }),
  def('searchbox', 'Search Box', { icon: '🔎', group: 'Data', w: 280, h: 38, props: { placeholder: 'Search...', action: '', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('placeholder', 'Placeholder'), content('action', 'Search URL (action)')] }),

  /* ---- Social ---- */
  def('socialicons', 'Social Icons', { icon: '🌐', group: 'Social', w: 220, h: 44, props: { networks: 'facebook\nx\ninstagram\nlinkedin', size: 36, gap: 8 }, fields: [content('networks', 'Networks (one per line)', 'textarea'), content('size', 'Icon Size (px)', 'number'), content('gap', 'Gap (px)', 'number')] }),
  def('sharebuttons', 'Share Buttons', { icon: '↗', group: 'Social', w: 300, h: 38, props: { networks: 'facebook\nx\nwhatsapp\nlinkedin', gap: 8 }, fields: [content('networks', 'Networks (one per line)', 'textarea'), content('gap', 'Gap (px)', 'number')] }),
  def('whatsapp', 'WhatsApp Button', { icon: '💬', group: 'Social', w: 200, h: 44, props: { phone: '', message: 'Hello!', color: '#ffffff', backgroundColor: '#25d366', borderRadius: 6, textAlign: 'center', fontWeight: '600' }, fields: [content('phone', 'Phone (international)'), content('message', 'Prefilled Message')] }),
  def('facebook', 'Facebook Embed', { icon: 'f', group: 'Social', w: 340, h: 400, props: { pageUrl: '', backgroundColor: '#e9ecef' }, fields: [content('pageUrl', 'Page URL')] }),
  def('xembed', 'X / Twitter Embed', { icon: '𝕏', group: 'Social', w: 340, h: 400, props: { tweetUrl: '', backgroundColor: '#e9ecef' }, fields: [content('tweetUrl', 'Post URL')] }),

  /* ---- Maps ---- */
  def('map', 'Map', { icon: '🗺', group: 'Maps', w: 400, h: 300, props: { address: 'London', zoom: 12, provider: 'osm', backgroundColor: '#e9ecef' }, fields: [content('address', 'Address / Query'), content('zoom', 'Zoom', 'number'), content('provider', 'Provider', 'select', ['osm', 'google'])] }),
  def('marker', 'Location Marker', { icon: '📍', group: 'Maps', w: 40, h: 50, props: { label: '', markerColor: '#dc3545' }, fields: [content('label', 'Label'), { ...content('markerColor', 'Color', 'color') }] }),

  /* ---- Code ---- */
  def('html', 'HTML', { icon: '</>', group: 'Code', w: 300, h: 200, props: { html: '<div>Custom HTML</div>' }, fields: [content('html', 'HTML Code', 'textarea')] }),
  def('css', 'CSS', { icon: '🎨', group: 'Code', w: 200, h: 60, props: { code: '/* custom css */' }, fields: [content('code', 'CSS Code', 'textarea')] }),
  def('javascript', 'JavaScript', { icon: 'JS', group: 'Code', w: 200, h: 60, props: { code: '// custom js' }, fields: [content('code', 'JavaScript Code', 'textarea')] }),
  def('iframe', 'iFrame', { icon: '🪟', group: 'Code', w: 400, h: 300, props: { src: 'https://example.com', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('src', 'URL')] }),

  /* ---- Special ---- */
  def('qrcode', 'QR Code', { icon: '▦', group: 'Special', w: 128, h: 128, props: { data: 'https://example.com', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('data', 'Data / URL')] }),
  def('countdown', 'Countdown Timer', { icon: '⏳', group: 'Special', w: 320, h: 70, props: { targetDate: '2027-01-01T00:00', format: 'dd : hh : mm : ss', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }, fields: [content('targetDate', 'Target Date/Time (ISO)'), content('format', 'Format')] }),
  def('calendar', 'Calendar', { icon: '📆', group: 'Special', w: 280, h: 280, props: { month: 0, year: 0, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('month', 'Month (1-12, 0 = current)', 'number'), content('year', 'Year (0 = current)', 'number')] }),
  def('captcha', 'CAPTCHA', { icon: '🤖', group: 'Special', w: 300, h: 70, props: { provider: 'recaptcha', siteKey: '', backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#d3d3d3' }, fields: [content('provider', 'Provider', 'select', ['recaptcha', 'hcaptcha']), content('siteKey', 'Site Key')] }),
  def('cookieconsent', 'Cookie Consent', { icon: '🍪', group: 'Special', w: 940, h: 60, props: { message: 'This website uses cookies to ensure you get the best experience.', buttonText: 'Accept', backgroundColor: '#212529', color: '#ffffff', padding: '12px 20px' }, fields: [content('message', 'Message'), content('buttonText', 'Button Text')] }),

  /* ---- User (Database) ---- */
  def('login', 'Login', { icon: '🔑', group: 'User', w: 300, h: 260, props: { apiUrl: '/api/login', redirect: '/', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: '24px' }, fields: [content('apiUrl', 'Login API URL'), content('redirect', 'Redirect after login')] }),
  def('register', 'Register', { icon: '📋', group: 'User', w: 300, h: 320, props: { apiUrl: '/api/register', redirect: '/login.html', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: '24px' }, fields: [content('apiUrl', 'Register API URL'), content('redirect', 'Redirect after register')] }),
  def('logout', 'Logout', { icon: '🚪', group: 'User', w: 120, h: 36, props: { text: 'Logout', apiUrl: '/api/logout', redirect: '/', color: '#ffffff', backgroundColor: '#6c757d', borderRadius: 4, textAlign: 'center' }, fields: [content('text', 'Text'), content('apiUrl', 'Logout API URL'), content('redirect', 'Redirect after logout')] }),
  def('profile', 'User Profile', { icon: '👤', group: 'User', w: 280, h: 90, props: { name: 'User Name', email: 'user@example.com', avatarUrl: '', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: '12px' }, fields: [content('name', 'Name'), content('email', 'Email'), content('avatarUrl', 'Avatar URL')] }),
  def('dbform', 'Database Form', { icon: '🗂', group: 'User', w: 340, h: 320, props: { apiUrl: '/api/submit', method: 'POST', fields: 'name|text|Name\nemail|email|Email\nmessage|textarea|Message', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', padding: '16px' }, fields: [content('apiUrl', 'Submit API URL'), content('method', 'Method', 'select', ['POST', 'PUT', 'PATCH']), content('fields', 'Fields (name|type|label per line)', 'textarea')] }),
  def('dbtable', 'Database Table', { icon: '🗃', group: 'User', w: 480, h: 240, props: { apiUrl: '/api/items', columns: 'id\nname\nemail', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6' }, fields: [content('apiUrl', 'Data API URL (JSON array)'), content('columns', 'Columns (field names, one per line)', 'textarea')] }),
  def('searchresults', 'Search Results', { icon: '🔍', group: 'User', w: 400, h: 300, props: { apiUrl: '/api/search', param: 'q', backgroundColor: '#ffffff' }, fields: [content('apiUrl', 'Search API URL'), content('param', 'Query Param Name')] }),

  /* ---- E-Commerce ---- */
  def('productcard', 'Product Card', { icon: '🛍', group: 'E-Commerce', w: 260, h: 360, props: { title: 'Product Name', price: '49.99', currency: '$', imageSrc: '', buttonText: 'Add to Cart', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,.08)' }, fields: [content('title', 'Title'), content('price', 'Price'), content('currency', 'Currency'), content('imageSrc', 'Image URL'), content('buttonText', 'Button Text')] }),
  def('productgrid', 'Product Grid', { icon: '🏬', group: 'E-Commerce', w: 640, h: 400, props: { apiUrl: '', columns: 3, gap: 16, backgroundColor: '' }, fields: [content('apiUrl', 'Products API URL (JSON array)'), content('columns', 'Columns', 'number'), content('gap', 'Gap (px)', 'number')] }),
  def('price', 'Price', { icon: '💲', group: 'E-Commerce', w: 120, h: 40, props: { amount: '49.99', currency: '$', fontSize: 24, fontWeight: 'bold' }, fields: [content('amount', 'Amount'), content('currency', 'Currency')] }),
  def('quantity', 'Quantity Selector', { icon: '±', group: 'E-Commerce', w: 130, h: 36, props: { min: 1, max: 99, value: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#ced4da', borderRadius: 4 }, fields: [content('min', 'Min', 'number'), content('max', 'Max', 'number'), content('value', 'Default', 'number')] }),
  def('addtocart', 'Add to Cart', { icon: '🛒', group: 'E-Commerce', w: 150, h: 40, props: { text: 'Add to Cart', productId: '', color: '#ffffff', backgroundColor: '#0d6efd', borderRadius: 4, textAlign: 'center', fontWeight: '600' }, fields: [content('text', 'Text'), content('productId', 'Product ID')] }),
  def('cart', 'Shopping Cart', { icon: '🛒', group: 'E-Commerce', w: 200, h: 44, props: { text: 'Cart', checkoutUrl: '/checkout.html', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 4, textAlign: 'center' }, fields: [content('text', 'Text'), content('checkoutUrl', 'Checkout URL')] }),
  def('checkout', 'Checkout Button', { icon: '💳', group: 'E-Commerce', w: 180, h: 44, props: { text: 'Checkout', url: '/checkout.html', color: '#ffffff', backgroundColor: '#198754', borderRadius: 4, textAlign: 'center', fontWeight: '600' }, fields: [content('text', 'Text'), content('url', 'Checkout URL')] }),
];

export const COMPONENT_MAP: Record<string, ComponentDef> = Object.fromEntries(
  COMPONENT_DEFS.map((d) => [d.type, d])
);

export const TOOLBOX_GROUPS = [
  'Layout', 'Basic', 'Forms', 'Navigation', 'Media', 'Advanced', 'Data',
  'User', 'E-Commerce',
];

export const EVENT_NAMES = ['onclick', 'ondblclick', 'onmouseenter', 'onmouseleave', 'onload'];
