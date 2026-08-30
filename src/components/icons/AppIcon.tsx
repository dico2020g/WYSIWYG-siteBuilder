import type { ReactElement } from 'react';

/**
 * Central app icon registry: modern flat, filled, colorful icons
 * (Office / WYSIWYG Web Builder ribbon style). All icons live on a
 * 24x24 grid, use rounded joins/caps and a shared palette:
 *   blue   #2563eb / #60a5fa / #dbeafe
 *   teal   #0d9488 / #2dd4bf / #ccfbf1
 *   orange #f59e0b / #fb923c / #fdba74
 *   purple #8b5cf6 / #a78bfa / #ede9fe
 *   red    #ef4444
 *   green  #22c55e / #25d366
 *   slate  #475569 / #94a3b8 / #cbd5e1 / #e2e8f0
 */

const ARIAL = 'Arial, Helvetica, sans-serif';
const MONO = 'Consolas, Menlo, monospace';

const ICONS: Record<string, ReactElement> = {
  /* ------------------------------------------------ generic / actions */
  generic: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="3" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="2.4" fill="#475569" />
    </>
  ),
  pointer: (
    <path d="M6 3.5 18.5 12l-5.6 1.2 2.6 5.4-2.5 1.2-2.6-5.3L6 17.5z" fill="#2563eb" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.8" />
      <path d="M15 15l4.5 4.5" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  add: (
    <>
      <circle cx="12" cy="12" r="9" fill="#2563eb" />
      <path d="M12 8v8M8 12h8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  edit: (
    <>
      <circle cx="12" cy="12" r="9" fill="#f59e0b" />
      <path d="M8 16l.8-3L15 6.8a1.6 1.6 0 0 1 2.2 2.2L11 15.2z" fill="#ffffff" />
    </>
  ),
  rotate: (
    <>
      <path d="M12 5a7 7 0 0 1 7 7h1.5l-3.5 4-3.5-4H19a5 5 0 0 0-5-5V5z" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.5" />
      <path d="M12 19a7 7 0 0 1-7-7H3.5l3.5-4 3.5 4H5a5 5 0 0 0 5 5v2z" fill="#60a5fa" stroke="#3b82f6" strokeWidth="0.5" />
      <circle cx="12" cy="12" r="2" fill="#ffffff" stroke="#1d4ed8" strokeWidth="0.5" />
    </>
  ),

  /* ------------------------------------------------ file operations */
  new: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 11h6M8 14h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="17" r="5" fill="#2563eb" />
      <path d="M17 14.5v5M14.5 17h5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  newPage: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 11h6M8 14h6" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="17" r="5" fill="#22c55e" />
      <path d="M17 14.5v5M14.5 17h5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  open: (
    <>
      <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2h9A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" fill="#f59e0b" />
      <path d="M3 10h18v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z" fill="#fbbf24" />
    </>
  ),
  save: (
    <>
      <path d="M5 3h11l4 4v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#2563eb" />
      <path d="M8 3v5h7V3z" fill="#dbeafe" />
      <rect x="7" y="12" width="10" height="9" rx="1" fill="#ffffff" />
      <path d="M9 15h6M9 18h4" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  saveAll: (
    <>
      <path d="M9.5 3H18l3 3v11a1.5 1.5 0 0 1-1.5 1.5h-10z" fill="#93c5fd" />
      <path d="M5 6.5h9L17.5 10v9.5A1.5 1.5 0 0 1 16 21H5a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 5 6.5z" fill="#2563eb" />
      <path d="M7.5 6.5V11h6V6.5z" fill="#dbeafe" />
      <rect x="7" y="14" width="7.5" height="6" rx="1" fill="#ffffff" />
    </>
  ),
  close: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 11h6M8 14h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="17" r="5" fill="#ef4444" />
      <path d="M15.2 15.2l3.6 3.6M18.8 15.2l-3.6 3.6" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ clipboard / edit */
  cut: (
    <>
      <path d="M8.5 15.5 18.5 5.5" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 15.5 5.5 5.5" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="11" r="1" fill="#f59e0b" />
      <circle cx="6" cy="17" r="2.6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
      <circle cx="17" cy="17" r="2.6" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" />
    </>
  ),
  copy: (
    <>
      <rect x="4" y="3" width="12" height="13" rx="1.5" fill="#94a3b8" />
      <rect x="8" y="8" width="12" height="13" rx="1.5" fill="#2563eb" />
      <path d="M11.5 13h5M11.5 16.5h5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  clone: (
    <>
      <path d="M8 2.5h6L17.5 6v11a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 17V4A1.5 1.5 0 0 1 8 2.5z" fill="#cbd5e1" />
      <path d="M7 5.5h6L16.5 9v11.5A1.5 1.5 0 0 1 15 22H7a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 7 5.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.4" />
      <path d="M13 5.5V9h3.5z" fill="#e2e8f0" />
      <path d="M8.5 12.5h5M8.5 15.5h5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  paste: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <rect x="9" y="2.5" width="6" height="4" rx="1.2" fill="#f59e0b" />
      <path d="M8.5 10.5h7M8.5 13.5h7M8.5 16.5h4" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  undo: (
    <>
      <path d="M10 5 4 10l6 5z" fill="#2563eb" />
      <path d="M8.5 10H14a5 5 0 0 1 0 10h-4" stroke="#2563eb" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  redo: (
    <>
      <path d="M14 5l6 5-6 5z" fill="#0d9488" />
      <path d="M15.5 10H10a5 5 0 0 0 0 10h4" stroke="#0d9488" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  rename: (
    <>
      <path d="M14.5 4.5 19.5 9.5 9 20H4v-5z" fill="#f59e0b" />
      <path d="M13 6l5 5" stroke="#ffffff" strokeWidth="1.4" />
      <path d="M3 21.5h18" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  delete: (
    <>
      <path d="M5 7h14" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 7V5A1.5 1.5 0 0 1 11 3.5h2A1.5 1.5 0 0 1 14.5 5v2" fill="none" stroke="#ef4444" strokeWidth="1.6" />
      <path d="M6.5 7l1 12.5A1.8 1.8 0 0 0 9.3 21h5.4a1.8 1.8 0 0 0 1.8-1.5L17.5 7z" fill="#94a3b8" />
      <path d="M10 10.5v6M14 10.5v6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ tools / arrange */
  move: (
    <>
      <path d="M12 3v18M3 12h18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 3 9.5 6M12 3l2.5 3M12 21l-2.5-3M12 21l2.5-3M3 12l3-2.5M3 12l3 2.5M21 12l-3-2.5M21 12l-3 2.5" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="12" r="2" fill="#f59e0b" />
    </>
  ),
  size: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="3 2.4" />
      <path d="M9 15 15 9" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 9h-3.4M15 9v3.4M9 15h3.4M9 15v-3.4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" />
    </>
  ),
  align: (
    <>
      <path d="M4 4v16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="5" width="13" height="3.4" rx="1.2" fill="#2563eb" />
      <rect x="7" y="10.3" width="9" height="3.4" rx="1.2" fill="#0d9488" />
      <rect x="7" y="15.6" width="11" height="3.4" rx="1.2" fill="#475569" />
    </>
  ),
  bringFront: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="1.5" fill="#cbd5e1" />
      <rect x="4" y="4" width="11" height="11" rx="1.5" fill="#2563eb" />
      <path d="M7.5 9.5h4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  sendBack: (
    <>
      <rect x="4" y="4" width="11" height="11" rx="1.5" fill="#2563eb" />
      <rect x="9" y="9" width="11" height="11" rx="1.5" fill="#94a3b8" />
    </>
  ),
  bringForward: (
    <>
      <rect x="3.5" y="6" width="9" height="9" rx="1.2" fill="#cbd5e1" />
      <rect x="6" y="10" width="9" height="9" rx="1.2" fill="#2563eb" />
      <path d="M18.5 13V4M18.5 4 16 6.5M18.5 4 21 6.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  sendBackward: (
    <>
      <rect x="3.5" y="6" width="9" height="9" rx="1.2" fill="#2563eb" />
      <rect x="6" y="10" width="9" height="9" rx="1.2" fill="#94a3b8" />
      <path d="M18.5 4v9M18.5 13 16 10.5M18.5 13l2.5-2.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  group: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2.2" />
      <rect x="6.5" y="6.5" width="4.6" height="4.6" rx="1" fill="#2563eb" />
      <rect x="12.9" y="6.5" width="4.6" height="4.6" rx="1" fill="#0d9488" />
      <rect x="6.5" y="12.9" width="4.6" height="4.6" rx="1" fill="#f59e0b" />
      <rect x="12.9" y="12.9" width="4.6" height="4.6" rx="1" fill="#8b5cf6" />
    </>
  ),

  /* ------------------------------------------------ publish / view */
  preview: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" fill="#ffffff" stroke="#475569" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" fill="#2563eb" />
      <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
    </>
  ),
  publish: (
    <>
      <circle cx="11" cy="13" r="7.5" fill="#60a5fa" />
      <path d="M3.5 13h15M11 5.5c2.2 2 2.2 13 0 15M11 5.5c-2.2 2-2.2 13 0 15" stroke="#dbeafe" strokeWidth="1.3" fill="none" />
      <circle cx="18" cy="7" r="4.5" fill="#f59e0b" />
      <path d="M18 9.5V5M18 5l-1.8 1.8M18 5l1.8 1.8" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  snapGrid: (
    <>
      <circle cx="5" cy="5" r="1.7" fill="#94a3b8" />
      <circle cx="12" cy="5" r="1.7" fill="#94a3b8" />
      <circle cx="19" cy="5" r="1.7" fill="#94a3b8" />
      <circle cx="5" cy="12" r="1.7" fill="#94a3b8" />
      <circle cx="19" cy="12" r="1.7" fill="#94a3b8" />
      <circle cx="5" cy="19" r="1.7" fill="#94a3b8" />
      <circle cx="12" cy="19" r="1.7" fill="#94a3b8" />
      <circle cx="19" cy="19" r="1.7" fill="#94a3b8" />
      <circle cx="12" cy="12" r="3" fill="#f59e0b" />
      <circle cx="12" cy="12" r="1.1" fill="#ffffff" />
    </>
  ),
  zoomIn: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10.5 8v5M8 10.5h5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  zoomOut: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
      <path d="M15.5 15.5 21 21" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 10.5h5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  zoomReset: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="3" fill="#475569" />
      <text x="12" y="15.4" fontSize="8.5" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={ARIAL}>1:1</text>
    </>
  ),

  /* ------------------------------------------------ breakpoints */
  addBreakpoint: (
    <>
      <rect x="2.5" y="5.5" width="13" height="9.5" rx="1.5" fill="#475569" />
      <rect x="4" y="7" width="10" height="6.5" rx=".6" fill="#93c5fd" />
      <path d="M6.5 20h6M9.5 15v5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="15" y="10" width="5" height="9" rx="1.2" fill="#2563eb" />
      <circle cx="17.5" cy="17.2" r=".7" fill="#ffffff" />
      <circle cx="19" cy="5.5" r="4" fill="#22c55e" />
      <path d="M19 3.7v3.6M17.2 5.5h3.6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  manageBreakpoints: (
    <>
      <rect x="2.5" y="5.5" width="13" height="9.5" rx="1.5" fill="#475569" />
      <rect x="4" y="7" width="10" height="6.5" rx=".6" fill="#93c5fd" />
      <path d="M6.5 20h6M9.5 15v5" stroke="#475569" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="15" y="10" width="5" height="9" rx="1.2" fill="#2563eb" />
      <circle cx="19" cy="5.5" r="4" fill="#f59e0b" />
      <circle cx="19" cy="5.5" r="1.5" fill="#ffffff" />
    </>
  ),

  /* ------------------------------------------------ design */
  themes: (
    <>
      <circle cx="9" cy="9.5" r="5" fill="#2563eb" />
      <circle cx="15" cy="9.5" r="5" fill="#f59e0b" fillOpacity=".85" />
      <circle cx="12" cy="14.5" r="5" fill="#0d9488" fillOpacity=".85" />
    </>
  ),
  colorScheme: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.4-2-.6-1.1.1-2.5 1.6-2.5h2a4 4 0 0 0 4-4c0-5.5-4-9.5-9-9.5z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.4" />
      <circle cx="7.5" cy="10" r="1.6" fill="#2563eb" />
      <circle cx="12" cy="7.5" r="1.6" fill="#ef4444" />
      <circle cx="16.5" cy="10" r="1.6" fill="#f59e0b" />
      <circle cx="9" cy="15" r="1.6" fill="#0d9488" />
    </>
  ),
  fonts: (
    <>
      <text x="7" y="17" fontSize="15" fontWeight="700" fill="#2563eb" fontFamily={ARIAL}>A</text>
      <text x="14.5" y="17.5" fontSize="10" fontWeight="700" fill="#f59e0b" fontFamily={ARIAL}>a</text>
      <path d="M4 20.5h16" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  pageProperties: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 10.5h6" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12.5" cy="16" r="3.4" fill="none" stroke="#2563eb" strokeWidth="2.6" strokeDasharray="1.9 1.8" />
      <circle cx="12.5" cy="16" r="1.2" fill="#2563eb" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M4.5 4h15A1.5 1.5 0 0 1 21 5.5V8H3V5.5A1.5 1.5 0 0 1 4.5 4z" fill="#2563eb" />
      <path d="M9.5 8v12" stroke="#475569" strokeWidth="1.5" />
      <rect x="4.5" y="9.5" width="3.6" height="9" rx=".6" fill="#2dd4bf" />
    </>
  ),

  /* ------------------------------------------------ database tools */
  connection: (
    <>
      <path d="M9 7V3.5M15 7V3.5" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 7h10v4a5 5 0 0 1-10 0z" fill="#2563eb" />
      <path d="M12 16v3a3 3 0 0 0 3 3h2" stroke="#0d9488" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  newQuery: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 10.5h6M8 13.5h4" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16.5" cy="16.5" r="4.5" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.7" />
      <path d="M16.5 14.7v3.6M14.7 16.5h3.6" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  table: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M4.5 5h15A1.5 1.5 0 0 1 21 6.5V9H3V6.5A1.5 1.5 0 0 1 4.5 5z" fill="#2563eb" />
      <path d="M3 13.5h18M9.7 9v10M15.3 9v10" stroke="#cbd5e1" strokeWidth="1.2" />
    </>
  ),
  dbView: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" fill="#ffffff" stroke="#475569" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3.2" fill="#0d9488" />
      <circle cx="12" cy="12" r="1.2" fill="#ffffff" />
    </>
  ),
  matView: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="#c4b5fd" />
      <path d="M4.5 5h15A1.5 1.5 0 0 1 21 6.5V9H3V6.5A1.5 1.5 0 0 1 4.5 5z" fill="#8b5cf6" />
      <path d="M3 13.5h18M9.7 9v10M15.3 9v10" stroke="#ffffff" strokeWidth="1.2" />
    </>
  ),
  function: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#8b5cf6" />
      <text x="12" y="17" fontSize="13" fontStyle="italic" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily="Georgia, serif">f</text>
    </>
  ),
  query: (
    <>
      <path d="M6 2.5h7.5L18 7v13.5A1.5 1.5 0 0 1 16.5 22h-10A1.5 1.5 0 0 1 5 20.5v-16A1.5 1.5 0 0 1 6 2.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 2.5V7H18z" fill="#cbd5e1" />
      <path d="M8 10.5h5M8 13.5h3" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="16" r="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
      <path d="M19 19l2.6 2.6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  model: (
    <>
      <path d="M12 3l8 4.5-8 4.5-8-4.5z" fill="#60a5fa" />
      <path d="M4 7.5l8 4.5v9l-8-4.5z" fill="#2563eb" />
      <path d="M20 7.5l-8 4.5v9l8-4.5z" fill="#1e40af" />
    </>
  ),

  /* ------------------------------------------------ window / panels */
  toolbox: (
    <>
      <rect x="3" y="8" width="18" height="11" rx="2" fill="#f59e0b" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="#475569" strokeWidth="1.8" />
      <path d="M3 12h18" stroke="#d97706" strokeWidth="1.4" />
      <rect x="10" y="11" width="4" height="3" rx=".8" fill="#ffffff" />
    </>
  ),
  projectExplorer: (
    <>
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h4l1.8 2h8.2A1.5 1.5 0 0 1 21 7.5V11H3z" fill="#f59e0b" />
      <path d="M3 11h18v7.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" fill="#fbbf24" />
      <rect x="6" y="13" width="3.4" height="4.2" rx=".5" fill="#ffffff" />
      <rect x="11" y="13" width="3.4" height="4.2" rx=".5" fill="#ffffff" />
      <rect x="16" y="13" width="3.4" height="4.2" rx=".5" fill="#ffffff" />
    </>
  ),
  properties: (
    <>
      <path d="M6 4v16M12 4v16M18 4v16" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="9" r="2.2" fill="#2563eb" />
      <circle cx="12" cy="14" r="2.2" fill="#0d9488" />
      <circle cx="18" cy="7.5" r="2.2" fill="#f59e0b" />
    </>
  ),
  output: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" fill="#1e293b" />
      <path d="M6.5 9l3 3-3 3" stroke="#2dd4bf" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15h5" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  cascade: (
    <>
      <rect x="3" y="4" width="11" height="9" rx="1.2" fill="#93c5fd" />
      <rect x="6.5" y="8" width="11" height="9" rx="1.2" fill="#60a5fa" />
      <rect x="10" y="12" width="11" height="9" rx="1.2" fill="#2563eb" />
    </>
  ),
  tileH: (
    <>
      <rect x="3" y="5" width="8.2" height="14" rx="1.2" fill="#2563eb" />
      <rect x="12.8" y="5" width="8.2" height="14" rx="1.2" fill="#0d9488" />
    </>
  ),
  tileV: (
    <>
      <rect x="4" y="4" width="16" height="7.2" rx="1.2" fill="#2563eb" />
      <rect x="4" y="12.8" width="16" height="7.2" rx="1.2" fill="#f59e0b" />
    </>
  ),
  resetLayout: (
    <>
      <rect x="4" y="5" width="16" height="13" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M4 8.5h16" stroke="#475569" strokeWidth="1.5" />
      <path d="M16.5 12.6a3.8 3.8 0 1 1-1.2 3" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M15.1 13.2l.1 2.6 2.4-1.1z" fill="#f59e0b" />
    </>
  ),
  options: (
    <>
      <circle cx="12" cy="12" r="7" fill="none" stroke="#475569" strokeWidth="4.4" strokeDasharray="3.2 2.5" />
      <circle cx="12" cy="12" r="3.2" fill="#2563eb" />
    </>
  ),
  spellCheck: (
    <>
      <rect x="3" y="4" width="13" height="16" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.4" />
      <path d="M6 8.5h7M6 11.5h7M6 14.5h4" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16.5" cy="16.5" r="5" fill="#22c55e" />
      <path d="M14.2 16.5l1.7 1.7 3-3" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" fill="#2563eb" />
      <text x="12" y="16.5" fontSize="13" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={ARIAL}>?</text>
    </>
  ),
  about: (
    <>
      <circle cx="12" cy="12" r="9" fill="#0d9488" />
      <rect x="10.9" y="10" width="2.2" height="6.2" rx="1.1" fill="#ffffff" />
      <circle cx="12" cy="7.2" r="1.4" fill="#ffffff" />
    </>
  ),

  /* ------------------------------------------------ tree (SiteManager) */
  folder: (
    <>
      <path d="M3 6A1.5 1.5 0 0 1 4.5 4.5h4l2 2.2h9A1.5 1.5 0 0 1 21 8.2V9.5H3z" fill="#f59e0b" />
      <path d="M3 9.5h18V18a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18z" fill="#fbbf24" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h6.5L18 7.5V20a1.5 1.5 0 0 1-1.5 1.5h-9.5A1.5 1.5 0 0 1 5.5 20V4.5A1.5 1.5 0 0 1 7 3z" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M13.5 3v4.5H18z" fill="#cbd5e1" />
      <path d="M8.5 11h7M8.5 14h7M8.5 17h4" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
      <circle cx="8.5" cy="9.5" r="1.6" fill="#f59e0b" />
      <path d="M5 17.5 9.5 12l3 3.5 3-4 4 6z" fill="#0d9488" />
    </>
  ),
  css: (
    <>
      <path d="M9.5 6.5c-1.5.4-2.5 1.3-2.5 3 0 1-.4 1.6-1.5 1.9v1.2c1.1.3 1.5.9 1.5 1.9 0 1.7 1 2.6 2.5 3" stroke="#8b5cf6" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M14.5 6.5c1.5.4 2.5 1.3 2.5 3 0 1 .4 1.6 1.5 1.9v1.2c-1.1.3-1.5.9-1.5 1.9 0 1.7-1 2.6-2.5 3" stroke="#8b5cf6" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    </>
  ),
  code: (
    <>
      <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5" stroke="#0d9488" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2 5.5 10.8 18.5" stroke="#475569" strokeWidth="2.1" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ layout controls */
  section: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
      <path d="M3 9.5h18" stroke="#64748b" strokeWidth="1.3" />
    </>
  ),
  container: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="3 2" />
      <rect x="8" y="9" width="8" height="6" rx="1" fill="#cbd5e1" />
    </>
  ),
  row: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <path d="M9 8v8M15 8v8" stroke="#2563eb" strokeWidth="1.3" />
    </>
  ),
  column: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="1.2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
      <path d="M8 9h8M8 15h8" stroke="#2563eb" strokeWidth="1.3" />
    </>
  ),
  flexbox: (
    <>
      <rect x="2.5" y="8.5" width="5.5" height="7" rx="1" fill="#2563eb" />
      <rect x="9.2" y="8.5" width="5.5" height="7" rx="1" fill="#0d9488" />
      <rect x="16" y="8.5" width="5.5" height="7" rx="1" fill="#f59e0b" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" fill="#2563eb" />
      <rect x="13" y="4" width="7" height="7" rx="1" fill="#60a5fa" />
      <rect x="4" y="13" width="7" height="7" rx="1" fill="#60a5fa" />
      <rect x="13" y="13" width="7" height="7" rx="1" fill="#2563eb" />
    </>
  ),
  card: (
    <>
      <rect x="4" y="3.5" width="16" height="17" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="6.5" y="6" width="11" height="5.5" rx="1" fill="#2dd4bf" />
      <path d="M6.5 14h11M6.5 17h7" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  panel: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v2.5h-17V6A1.5 1.5 0 0 1 5 4.5z" fill="#2563eb" />
    </>
  ),
  groupBox: (
    <>
      <rect x="4" y="6" width="16" height="13" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="3.2 2.2" />
      <rect x="7" y="3.5" width="6" height="4" rx="1" fill="#2563eb" />
    </>
  ),
  spacer: (
    <>
      <rect x="4" y="4" width="16" height="3.4" rx="1" fill="#cbd5e1" />
      <rect x="4" y="16.6" width="16" height="3.4" rx="1" fill="#cbd5e1" />
      <path d="M12 8.6v6.8M12 8.6 9.8 10.8M12 8.6l2.2 2.2M12 15.4l-2.2-2.2M12 15.4l2.2-2.2" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  /* ------------------------------------------------ basic controls */
  text: (
    <>
      <text x="12" y="18" fontSize="17" fontWeight="700" fill="#2563eb" textAnchor="middle" fontFamily={ARIAL}>T</text>
      <path d="M6 21.5h12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  heading: (
    <>
      <text x="5" y="17" fontSize="15" fontWeight="700" fill="#2563eb" fontFamily={ARIAL}>H</text>
      <text x="13" y="18" fontSize="9" fontWeight="700" fill="#f59e0b" fontFamily={ARIAL}>1</text>
      <path d="M4 21h16" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  paragraph: (
    <>
      <text x="12" y="18.5" fontSize="17" fontWeight="700" fill="#8b5cf6" textAnchor="middle" fontFamily={ARIAL}>¶</text>
      <path d="M6 21.5h12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  button: (
    <>
      <rect x="3" y="8" width="18" height="8.5" rx="4" fill="#2563eb" />
      <path d="M8 12.2h8" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  link: (
    <>
      <path d="M10 14a3.5 3.5 0 0 0 5 .5l2.5-2.5a3.5 3.5 0 0 0-5-5L11.1 8.4" stroke="#2563eb" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M14 10a3.5 3.5 0 0 0-5-.5L6.5 12a3.5 3.5 0 0 0 5 5l1.4-1.4" stroke="#0d9488" strokeWidth="1.9" fill="none" strokeLinecap="round" />
    </>
  ),
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.7l-5.2 2.9 1-5.8L3.5 9.7l5.9-.9z" fill="#f59e0b" />
  ),
  divider: (
    <>
      <path d="M3 12h18" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      <rect x="10" y="10" width="4" height="4" rx="1" fill="#2563eb" />
    </>
  ),
  rect: (
    <rect x="4" y="6" width="16" height="12" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.6" />
  ),
  roundedRect: (
    <rect x="4" y="6" width="16" height="12" rx="5" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.6" />
  ),
  ellipse: (
    <circle cx="12" cy="12" r="8" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.6" />
  ),
  list: (
    <>
      <circle cx="5.5" cy="6.5" r="1.7" fill="#2563eb" />
      <circle cx="5.5" cy="12" r="1.7" fill="#0d9488" />
      <circle cx="5.5" cy="17.5" r="1.7" fill="#f59e0b" />
      <path d="M9.5 6.5h9M9.5 12h9M9.5 17.5h9" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  htmlEmbed: (
    <>
      <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5" stroke="#f59e0b" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2 5.5 10.8 18.5" stroke="#475569" strokeWidth="2.1" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ form controls */
  form: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M6.5 3h11A1.5 1.5 0 0 1 19 4.5V7H5V4.5A1.5 1.5 0 0 1 6.5 3z" fill="#8b5cf6" />
      <rect x="7.5" y="9.5" width="9" height="3" rx=".8" fill="#e2e8f0" />
      <rect x="7.5" y="14" width="9" height="3" rx=".8" fill="#e2e8f0" />
    </>
  ),
  textInput: (
    <>
      <rect x="3" y="7.5" width="18" height="9" rx="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1.6" />
      <path d="M7 10v4" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 12h7" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  password: (
    <>
      <rect x="5.5" y="10" width="13" height="10" rx="2" fill="#f59e0b" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" fill="none" stroke="#475569" strokeWidth="2" />
      <circle cx="12" cy="14" r="1.6" fill="#ffffff" />
      <path d="M12 15v2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  email: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M4 7l8 6 8-6" stroke="#2563eb" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  number: (
    <>
      <rect x="4" y="7.5" width="16" height="9" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.6" />
      <text x="12" y="14.6" fontSize="9" fontWeight="700" fill="#2563eb" textAnchor="middle" fontFamily={MONO}>#</text>
    </>
  ),
  tel: (
    <path d="M7 3.5c.8 0 1.6.5 2 1.3l1 2a2 2 0 0 1-.5 2.3L8.4 10a12 12 0 0 0 5.6 5.6l.9-1.1a2 2 0 0 1 2.3-.5l2 1a2.2 2.2 0 0 1 1.3 2c0 2-1.6 3.6-3.5 3.5C10.5 20 4 13.5 3.5 7 3.4 5.1 5 3.5 7 3.5z" fill="#0d9488" />
  ),
  textarea: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" fill="#ffffff" stroke="#2563eb" strokeWidth="1.6" />
      <path d="M6.5 9.5h11M6.5 12.5h11M6.5 15.5h6" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  checkbox: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#2563eb" />
      <path d="M8 12.2l2.8 2.8L16.5 9" stroke="#ffffff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  radio: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="#2563eb" />
    </>
  ),
  selectInput: (
    <>
      <rect x="3" y="6.5" width="18" height="11" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <path d="M6.5 12h6" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15.5 10.5 18 13l2.5-2.5" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  datePicker: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M5.5 5h13a2 2 0 0 1 2 2v2.5h-17V7a2 2 0 0 1 2-2z" fill="#ef4444" />
      <path d="M8 3v3M16 3v3" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="13" r="1.2" fill="#94a3b8" />
      <circle cx="12" cy="13" r="1.2" fill="#2563eb" />
      <circle cx="16" cy="13" r="1.2" fill="#94a3b8" />
      <circle cx="8" cy="16.8" r="1.2" fill="#94a3b8" />
      <circle cx="12" cy="16.8" r="1.2" fill="#94a3b8" />
      <circle cx="16" cy="16.8" r="1.2" fill="#94a3b8" />
    </>
  ),
  timePicker: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
      <path d="M12 7.5V12l3.2 2" stroke="#475569" strokeWidth="1.9" strokeLinecap="round" fill="none" />
    </>
  ),
  fileUpload: (
    <>
      <path d="M7 3.5h6.5L18 8v11.5A1.5 1.5 0 0 1 16.5 21h-9.5A1.5 1.5 0 0 1 5.5 19.5V5A1.5 1.5 0 0 1 7 3.5z" fill="#ffffff" stroke="#475569" strokeWidth="1.4" />
      <path d="M13.5 3.5V8H18z" fill="#e2e8f0" />
      <path d="M11.8 17v-5M11.8 12 9.6 14.2M11.8 12l2.2 2.2" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  range: (
    <>
      <path d="M3.5 12h17" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
      <path d="M3.5 12h9" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      <circle cx="13.5" cy="12" r="3.4" fill="#2563eb" stroke="#ffffff" strokeWidth="1.6" />
    </>
  ),
  submitButton: (
    <>
      <rect x="3" y="8" width="18" height="8.5" rx="4" fill="#22c55e" />
      <path d="M8 12.4l2.6 2.6 5.4-5.4" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  resetButton: (
    <>
      <rect x="3" y="8" width="18" height="8.5" rx="4" fill="#e2e8f0" />
      <path d="M15.5 10.4a3.2 3.2 0 1 1-.9 2.6" stroke="#f59e0b" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M15.9 9.6l.4 1.9-1.9-.3z" fill="#f59e0b" />
    </>
  ),
  hiddenField: (
    <>
      <rect x="4" y="7" width="16" height="10" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="8.5" cy="12" r="1.1" fill="#64748b" />
      <circle cx="12" cy="12" r="1.1" fill="#64748b" />
      <circle cx="15.5" cy="12" r="1.1" fill="#64748b" />
    </>
  ),

  /* ------------------------------------------------ navigation */
  navbar: (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="1.5" fill="#334155" />
      <circle cx="6" cy="12" r="1.6" fill="#60a5fa" />
      <path d="M10 12h2.8M14.4 12h2.8M18.8 12h1.4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  menubar: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.4" />
      <rect x="5" y="10" width="3.4" height="4" rx=".8" fill="#2563eb" />
      <rect x="9.8" y="10" width="3.4" height="4" rx=".8" fill="#cbd5e1" />
      <rect x="14.6" y="10" width="3.4" height="4" rx=".8" fill="#cbd5e1" />
    </>
  ),
  hamburgerMenu: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#2563eb" />
      <path d="M8 9h8M8 12h8M8 15h8" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  dropdownMenu: (
    <>
      <rect x="4" y="4.5" width="16" height="7" rx="1.5" fill="#2563eb" />
      <path d="M15.8 6.9l1.7 1.7 1.7-1.7" stroke="#ffffff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="13" width="16" height="8" rx="1.2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.3" />
      <path d="M7 15.8h10M7 18.2h6" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  sidebarMenu: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.4" />
      <path d="M4.5 4H9v16H4.5A1.5 1.5 0 0 1 3 18.5v-13A1.5 1.5 0 0 1 4.5 4z" fill="#334155" />
      <path d="M4 8h4M4 11h4M4 14h4" stroke="#64748b" strokeWidth="1.2" />
    </>
  ),
  breadcrumb: (
    <>
      <rect x="3" y="9.5" width="6" height="5" rx="1" fill="#2563eb" />
      <path d="M10.5 10.5l2 1.5-2 1.5" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="9.5" width="7" height="5" rx="1" fill="#cbd5e1" />
    </>
  ),
  pagination: (
    <>
      <path d="M6.5 9 4 12l2.5 3" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="7.5" width="6" height="9" rx="1.5" fill="#2563eb" />
      <text x="12" y="14.2" fontSize="7.5" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={ARIAL}>1</text>
      <path d="M17.5 9 20 12l-2.5 3" stroke="#64748b" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  tabs: (
    <>
      <rect x="3" y="15" width="18" height="4.5" rx="1" fill="#e2e8f0" />
      <path d="M5 15V7.5A1.5 1.5 0 0 1 6.5 6H11l1.2 2v7z" fill="#94a3b8" />
      <path d="M11.5 15V9.5A1.5 1.5 0 0 1 13 8h5.5A1.5 1.5 0 0 1 20 9.5V15z" fill="#2563eb" />
    </>
  ),

  /* ------------------------------------------------ media */
  video: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.5" fill="#0d9488" />
      <path d="M10 9.2v5.6l5-2.8z" fill="#ffffff" />
    </>
  ),
  audio: (
    <>
      <path d="M9 17.5V7l9-2.5V15" stroke="#8b5cf6" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="2.6" fill="#8b5cf6" />
      <circle cx="16" cy="15" r="2.6" fill="#a78bfa" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" fill="#ef4444" />
      <path d="M10 9v6l5.5-3z" fill="#ffffff" />
    </>
  ),
  gallery: (
    <>
      <rect x="3" y="4" width="8.4" height="8.4" rx="1.2" fill="#2dd4bf" />
      <rect x="12.6" y="4" width="8.4" height="8.4" rx="1.2" fill="#0d9488" />
      <rect x="3" y="13.6" width="8.4" height="8.4" rx="1.2" fill="#0d9488" />
      <rect x="12.6" y="13.6" width="8.4" height="8.4" rx="1.2" fill="#2dd4bf" />
      <path d="M4.5 10.5 7 8l2 2.5 1.4-1.7 1 1.7z" fill="#0f766e" />
    </>
  ),
  slideshow: (
    <>
      <rect x="5.5" y="5" width="13" height="14" rx="1.5" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
      <path d="M7.5 16.5 10.5 12.5l2.5 3 2-2.5 2.5 3.5z" fill="#0d9488" />
      <circle cx="10" cy="8.5" r="1.2" fill="#f59e0b" />
      <path d="M4 9.5 2 12l2 2.5M20 9.5l2 2.5-2 2.5" stroke="#94a3b8" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  carousel: (
    <>
      <rect x="2.5" y="8" width="5" height="9" rx="1" fill="#99f6e4" />
      <rect x="18.5" y="8" width="5" height="9" rx="1" fill="#99f6e4" />
      <rect x="8" y="5.5" width="8" height="13" rx="1.2" fill="#0d9488" />
    </>
  ),
  lightbox: (
    <>
      <rect x="3" y="4.5" width="14" height="11" rx="1.5" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.4" />
      <path d="M4.5 13.5 8 10l2.2 2.4 1.8-2 3 3.1z" fill="#0d9488" />
      <circle cx="16.5" cy="16.5" r="4.2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.7" />
      <path d="M19.6 19.6 22 22" stroke="#2563eb" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ advanced */
  accordion: (
    <>
      <rect x="3.5" y="3.5" width="17" height="4.6" rx="1.2" fill="#8b5cf6" />
      <rect x="3.5" y="9.6" width="17" height="6" rx="1.2" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1.2" />
      <rect x="3.5" y="17" width="17" height="4" rx="1.2" fill="#c4b5fd" />
    </>
  ),
  modal: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.6" />
      <path d="M6 5h12a2 2 0 0 1 2 2v2H4V7a2 2 0 0 1 2-2z" fill="#8b5cf6" />
      <path d="M16.8 6.4l1.2 1.2M18 6.4l-1.2 1.2" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M7 12h10M7 15h6" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
    </>
  ),
  tooltip: (
    <>
      <path d="M5 4.5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-6.5l-3 3.6v-3.6H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z" fill="#8b5cf6" />
      <circle cx="8" cy="10" r="1.1" fill="#ffffff" />
      <circle cx="12" cy="10" r="1.1" fill="#ffffff" />
      <circle cx="16" cy="10" r="1.1" fill="#ffffff" />
    </>
  ),
  progressBar: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="3" fill="#e2e8f0" />
      <path d="M6 9h8v6H6a3 3 0 0 1-3-3 3 3 0 0 1 3-3z" fill="#2563eb" />
    </>
  ),
  counter: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="#8b5cf6" />
      <text x="12" y="15.8" fontSize="9.5" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={MONO}>99</text>
    </>
  ),
  rating: (
    <>
      <path d="M7 6.5l1.7 3.5 3.9.6-2.8 2.7.7 3.9L7 15.4l-3.5 1.8.7-3.9-2.8-2.7 3.9-.6z" fill="#f59e0b" />
      <path d="M17 6.5l1.7 3.5 3.9.6-2.8 2.7.7 3.9-3.5-1.8-3.5 1.8.7-3.9-2.8-2.7 3.9-.6z" fill="#e2e8f0" />
    </>
  ),
  badge: (
    <>
      <path d="M9 15.5 8 21l4-2 4 2-1-5.5z" fill="#b91c1c" />
      <circle cx="12" cy="10.5" r="6.5" fill="#ef4444" />
      <path d="M9.6 10.5l1.8 1.8 3.2-3.2" stroke="#ffffff" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 22 20H2z" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9v5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.3" fill="#ffffff" />
    </>
  ),
  timeline: (
    <>
      <path d="M6 3v18" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="6" cy="6" r="2" fill="#2563eb" />
      <circle cx="6" cy="12" r="2" fill="#0d9488" />
      <circle cx="6" cy="18" r="2" fill="#f59e0b" />
      <path d="M10.5 6h9M10.5 12h7M10.5 18h9" stroke="#cbd5e1" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ data */
  dataGrid: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.4" />
      <path d="M4.5 4.5h15A1.5 1.5 0 0 1 21 6v2H3V6a1.5 1.5 0 0 1 1.5-1.5z" fill="#0d9488" />
      <path d="M3 11.8h18M3 15.4h18M9 8v11.5M15 8v11.5" stroke="#cbd5e1" strokeWidth="1.1" />
    </>
  ),
  repeater: (
    <>
      <rect x="3.5" y="5" width="11" height="6.5" rx="1.2" fill="#2563eb" />
      <rect x="9.5" y="12.5" width="11" height="6.5" rx="1.2" fill="#93c5fd" />
      <path d="M18.5 3.6a4 4 0 0 1 1.8 5.6" stroke="#f59e0b" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <path d="M20.5 6.8l.6 2.4-2.4-.7z" fill="#f59e0b" />
    </>
  ),
  treeView: (
    <>
      <rect x="3" y="3.5" width="6" height="4.5" rx="1" fill="#2563eb" />
      <path d="M6 8v4.5h3.5M6 8v9h3.5" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
      <rect x="11" y="10.3" width="6" height="4.5" rx="1" fill="#0d9488" />
      <rect x="11" y="16.3" width="6" height="4.5" rx="1" fill="#f59e0b" />
    </>
  ),
  searchBox: (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="5" fill="#ffffff" stroke="#2563eb" strokeWidth="1.6" />
      <circle cx="8" cy="12" r="2.6" fill="none" stroke="#2563eb" strokeWidth="1.6" />
      <path d="M10.2 14.2 12 16" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14.5 12h5" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ social */
  socialIcons: (
    <>
      <path d="M9 8.6 15 15.4M15 8.6 9 15.4" stroke="#cbd5e1" strokeWidth="1.4" />
      <circle cx="6.5" cy="7" r="2.8" fill="#1877f2" />
      <circle cx="17.5" cy="7" r="2.8" fill="#25d366" />
      <circle cx="12" cy="17" r="2.8" fill="#ef4444" />
    </>
  ),
  shareButtons: (
    <>
      <path d="M9.2 10.6 13.8 7M9.2 13.4l4.6 3.6" stroke="#94a3b8" strokeWidth="1.6" />
      <circle cx="6.5" cy="12" r="3" fill="#f59e0b" />
      <circle cx="16.5" cy="5.5" r="3" fill="#2563eb" />
      <circle cx="16.5" cy="18.5" r="3" fill="#0d9488" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M12 3a8.5 8.5 0 0 0-7.3 12.7L3.5 20.5l4.9-1.3A8.5 8.5 0 1 0 12 3z" fill="#25d366" />
      <path d="M9.3 8c.4 0 .8.2 1 .6l.6 1.1c.1.3 0 .6-.2.8l-.5.5a5.6 5.6 0 0 0 2.5 2.5l.5-.5c.2-.2.5-.3.8-.2l1.1.6c.4.2.6.6.6 1 0 1.1-.9 2-1.9 1.9-3.4-.3-7.2-4.1-7.5-7.5-.1-1 .8-1.9 1.9-1.9z" fill="#ffffff" />
    </>
  ),
  facebook: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="#1877f2" />
      <text x="12" y="17.5" fontSize="13" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={ARIAL}>f</text>
    </>
  ),
  xEmbed: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="#0f172a" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ maps */
  map: (
    <>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="#0d9488" strokeWidth="1.2" />
      <circle cx="12" cy="10.5" r="1.8" fill="#ef4444" />
    </>
  ),
  locationMarker: (
    <>
      <path d="M12 2.8A6.2 6.2 0 0 1 18.2 9c0 4.6-6.2 12.2-6.2 12.2S5.8 13.6 5.8 9A6.2 6.2 0 0 1 12 2.8z" fill="#ef4444" />
      <circle cx="12" cy="9" r="2.4" fill="#ffffff" />
    </>
  ),

  /* ------------------------------------------------ code */
  html: (
    <>
      <path d="M8.5 7 4 12l4.5 5M15.5 7 20 12l-4.5 5" stroke="#2563eb" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2 5.5 10.8 18.5" stroke="#f59e0b" strokeWidth="2.1" strokeLinecap="round" />
    </>
  ),
  javascript: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" fill="#f7df1e" />
      <text x="12" y="17" fontSize="10.5" fontWeight="700" fill="#1e293b" textAnchor="middle" fontFamily={ARIAL}>JS</text>
    </>
  ),
  iframe: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M5 4.5h14a2 2 0 0 1 2 2V8H3V6.5a2 2 0 0 1 2-2z" fill="#475569" />
      <rect x="6" y="10.5" width="12" height="6.5" rx="1" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.3" />
    </>
  ),

  /* ------------------------------------------------ special */
  qrCode: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" fill="#2563eb" />
      <rect x="5.5" y="5.5" width="2.5" height="2.5" fill="#ffffff" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1" fill="#2563eb" />
      <rect x="16" y="5.5" width="2.5" height="2.5" fill="#ffffff" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1" fill="#2563eb" />
      <rect x="5.5" y="16" width="2.5" height="2.5" fill="#ffffff" />
      <rect x="14" y="14" width="3" height="3" fill="#475569" />
      <rect x="17.5" y="14" width="3" height="3" fill="#94a3b8" />
      <rect x="14" y="17.5" width="3" height="3" fill="#94a3b8" />
      <rect x="17.5" y="17.5" width="3" height="3" fill="#475569" />
    </>
  ),
  countdown: (
    <>
      <path d="M6 4h12M6 20h12" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.5 4 12 11 16.5 4M7.5 20 12 11l4.5 9" stroke="#94a3b8" strokeWidth="1.4" fill="none" />
      <path d="M7 4h10l-5 7z" fill="#fbbf24" />
      <path d="M12 11l5 9H7z" fill="#f59e0b" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" fill="#ffffff" stroke="#475569" strokeWidth="1.5" />
      <path d="M5.5 5h13a2 2 0 0 1 2 2v2.5h-17V7a2 2 0 0 1 2-2z" fill="#0d9488" />
      <path d="M8 3v3M16 3v3" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="13" r="1.2" fill="#94a3b8" />
      <circle cx="12" cy="13" r="1.2" fill="#f59e0b" />
      <circle cx="16" cy="13" r="1.2" fill="#94a3b8" />
      <circle cx="8" cy="16.8" r="1.2" fill="#94a3b8" />
      <circle cx="12" cy="16.8" r="1.2" fill="#94a3b8" />
      <circle cx="16" cy="16.8" r="1.2" fill="#94a3b8" />
    </>
  ),
  captcha: (
    <>
      <path d="M12 2.8 19.5 6v5.5c0 4.6-3.2 8-7.5 9.7-4.3-1.7-7.5-5.1-7.5-9.7V6z" fill="#2563eb" />
      <path d="M8.5 12l2.4 2.4 4.6-4.6" stroke="#ffffff" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  cookieConsent: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="#d97706" />
      <circle cx="9" cy="9.5" r="1.4" fill="#78350f" />
      <circle cx="14.5" cy="10.5" r="1.4" fill="#78350f" />
      <circle cx="10.5" cy="14.5" r="1.4" fill="#78350f" />
      <circle cx="15" cy="15" r="1.2" fill="#78350f" />
    </>
  ),

  /* ------------------------------------------------ user / database */
  login: (
    <>
      <circle cx="9" cy="8" r="3.4" fill="#2563eb" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0z" fill="#2563eb" />
      <path d="M15.5 12h6M21.5 12l-2.2-2.2M21.5 12l-2.2 2.2" stroke="#22c55e" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  register: (
    <>
      <circle cx="10" cy="7.5" r="3.2" fill="#0d9488" />
      <path d="M4.5 19.5a5.5 5.5 0 0 1 11 0z" fill="#0d9488" />
      <circle cx="17.5" cy="16.5" r="4.5" fill="#f59e0b" />
      <path d="M17.5 14.2v4.6M15.2 16.5h4.6" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  logout: (
    <>
      <path d="M13 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H13" stroke="#64748b" strokeWidth="1.9" fill="none" strokeLinecap="round" />
      <path d="M10 12h11M21 12l-2.6-2.6M21 12l-2.6 2.6" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  userProfile: (
    <>
      <circle cx="12" cy="7.5" r="3.6" fill="#2563eb" />
      <path d="M5 20a7 7 0 0 1 14 0z" fill="#60a5fa" />
    </>
  ),
  dbForm: (
    <>
      <ellipse cx="8" cy="6" rx="4.5" ry="2" fill="#0d9488" />
      <path d="M3.5 6v4.5c0 1.1 2 2 4.5 2s4.5-.9 4.5-2V6z" fill="#2dd4bf" />
      <path d="M12 9h5l3 3v7.5a1.5 1.5 0 0 1-1.5 1.5H12a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 12 9z" fill="#ffffff" stroke="#475569" strokeWidth="1.3" />
      <path d="M17 9v3h3z" fill="#e2e8f0" />
      <path d="M13 14h5M13 16.5h5" stroke="#60a5fa" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  dbTable: (
    <>
      <ellipse cx="12" cy="5.5" rx="7" ry="2.6" fill="#0d9488" />
      <path d="M5 5.5v12c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-12z" fill="#2dd4bf" />
      <path d="M5 11.5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6M5 8.5c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6" stroke="#0d9488" strokeWidth="1.2" fill="none" />
    </>
  ),
  searchResults: (
    <>
      <rect x="4" y="3.5" width="12" height="17" rx="1.5" fill="#ffffff" stroke="#475569" strokeWidth="1.4" />
      <path d="M6.5 7h7M6.5 10h7M6.5 13h7M6.5 16h4" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16.5" cy="15.5" r="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
      <path d="M19.4 18.4 22 21" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  /* ------------------------------------------------ e-commerce */
  productCard: (
    <>
      <rect x="4.5" y="3.5" width="15" height="17" rx="2" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.4" />
      <rect x="7" y="6" width="10" height="6" rx="1" fill="#fdba74" />
      <path d="M7 14.5h10M7 17.5h6" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="17.5" cy="6.5" r="3.2" fill="#ef4444" />
      <text x="17.5" y="8.8" fontSize="6" fontWeight="700" fill="#ffffff" textAnchor="middle" fontFamily={ARIAL}>$</text>
    </>
  ),
  productGrid: (
    <>
      <rect x="3.5" y="3.5" width="7.6" height="7.6" rx="1.2" fill="#fb923c" />
      <rect x="12.9" y="3.5" width="7.6" height="7.6" rx="1.2" fill="#fdba74" />
      <rect x="3.5" y="12.9" width="7.6" height="7.6" rx="1.2" fill="#fdba74" />
      <rect x="12.9" y="12.9" width="7.6" height="7.6" rx="1.2" fill="#fb923c" />
    </>
  ),
  price: (
    <>
      <path d="M12.5 3.5H20a1 1 0 0 1 1 1V12l-9.5 9.5a1.4 1.4 0 0 1-2 0L3 15a1.4 1.4 0 0 1 0-2z" fill="#f59e0b" />
      <circle cx="16.5" cy="8" r="1.7" fill="#ffffff" />
    </>
  ),
  quantity: (
    <>
      <rect x="3" y="8" width="18" height="8.5" rx="2" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
      <path d="M5.5 12.2h3.6" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.6 12.2h3.6M17.4 10.4v3.6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.6 12.2h2.8" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  addToCart: (
    <>
      <path d="M3 5.5h2.4l2.2 9a1.5 1.5 0 0 0 1.5 1.2h7.8a1.5 1.5 0 0 0 1.5-1.2l2-6H7" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19.5" r="1.7" fill="#475569" />
      <circle cx="17" cy="19.5" r="1.7" fill="#475569" />
      <circle cx="18.5" cy="5" r="3.8" fill="#22c55e" />
      <path d="M18.5 3.2v3.6M16.7 5h3.6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  cart: (
    <>
      <path d="M3 5.5h2.4l2.2 9a1.5 1.5 0 0 0 1.5 1.2h7.8a1.5 1.5 0 0 0 1.5-1.2l2-6H7" stroke="#f59e0b" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="19.5" r="1.7" fill="#475569" />
      <circle cx="17" cy="19.5" r="1.7" fill="#475569" />
    </>
  ),
  checkout: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2" fill="#2563eb" />
      <path d="M2.5 9h19" stroke="#1e40af" strokeWidth="2.6" />
      <rect x="5" y="13" width="5.5" height="2.4" rx=".8" fill="#fbbf24" />
    </>
  ),

  /* ------------------------------------------------ Home tab: align */
  alignLeft: (
    <>
      <path d="M4 3v18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="6.5" y="5" width="13" height="4" rx="1.2" fill="#2563eb" />
      <rect x="6.5" y="11" width="9" height="4" rx="1.2" fill="#0d9488" />
      <rect x="6.5" y="17" width="11" height="4" rx="1.2" fill="#94a3b8" />
    </>
  ),
  alignCenter: (
    <>
      <path d="M12 3v18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="5" width="14" height="4" rx="1.2" fill="#2563eb" />
      <rect x="7.5" y="11" width="9" height="4" rx="1.2" fill="#0d9488" />
      <rect x="6.5" y="17" width="11" height="4" rx="1.2" fill="#94a3b8" />
    </>
  ),
  alignRight: (
    <>
      <path d="M20 3v18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="4.5" y="5" width="13" height="4" rx="1.2" fill="#2563eb" />
      <rect x="8.5" y="11" width="9" height="4" rx="1.2" fill="#0d9488" />
      <rect x="6.5" y="17" width="11" height="4" rx="1.2" fill="#94a3b8" />
    </>
  ),
  alignTop: (
    <>
      <path d="M3 4h18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="6.5" width="4" height="13" rx="1.2" fill="#2563eb" />
      <rect x="11" y="6.5" width="4" height="9" rx="1.2" fill="#0d9488" />
      <rect x="17" y="6.5" width="4" height="11" rx="1.2" fill="#94a3b8" />
    </>
  ),
  alignMiddle: (
    <>
      <path d="M3 12h18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="5" width="4" height="14" rx="1.2" fill="#2563eb" />
      <rect x="11" y="7.5" width="4" height="9" rx="1.2" fill="#0d9488" />
      <rect x="17" y="6.5" width="4" height="11" rx="1.2" fill="#94a3b8" />
    </>
  ),
  alignBottom: (
    <>
      <path d="M3 20h18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="4.5" width="4" height="13" rx="1.2" fill="#2563eb" />
      <rect x="11" y="8.5" width="4" height="9" rx="1.2" fill="#0d9488" />
      <rect x="17" y="6.5" width="4" height="11" rx="1.2" fill="#94a3b8" />
    </>
  ),
  matchWidth: (
    <>
      <rect x="4" y="6" width="16" height="5" rx="1.2" fill="#2563eb" />
      <rect x="7" y="13.5" width="10" height="5" rx="1.2" fill="#94a3b8" />
      <path d="M4 16h3M20 16h-3M4 13.5v5M20 13.5v5" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  matchHeight: (
    <>
      <rect x="6" y="4" width="5" height="16" rx="1.2" fill="#2563eb" />
      <rect x="13.5" y="7" width="5" height="10" rx="1.2" fill="#94a3b8" />
      <path d="M16 4v3M16 20v-3M13.5 4h5M13.5 20h5" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  matchSize: (
    <>
      <rect x="4" y="4" width="12" height="12" rx="1.5" fill="#2563eb" />
      <rect x="10" y="10" width="10" height="10" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 2.2" />
    </>
  ),
  scale: (
    <>
      <rect x="4" y="8" width="9" height="9" rx="1.2" fill="#94a3b8" />
      <rect x="8" y="4" width="14" height="14" rx="1.5" fill="none" stroke="#2563eb" strokeWidth="1.8" />
      <path d="M15 15l4 4M19 15v4h-4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  distributeH: (
    <>
      <path d="M4 4v16M20 4v16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="7" width="4" height="10" rx="1" fill="#2563eb" />
      <rect x="13.5" y="7" width="4" height="10" rx="1" fill="#0d9488" />
    </>
  ),
  distributeV: (
    <>
      <path d="M4 4h16M4 20h16" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="6.5" width="10" height="4" rx="1" fill="#2563eb" />
      <rect x="7" y="13" width="10" height="4" rx="1" fill="#0d9488" />
    </>
  ),
  centerPage: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="8.5" y="9" width="7" height="6" rx="1" fill="#2563eb" />
      <path d="M12 4v3M12 17v3M3 12h3.5M17.5 12H21" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  pageWidth: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
      <rect x="3" y="9" width="18" height="6" fill="#2563eb" />
      <path d="M6 21.5h12M6 21.5l2-1.6M6 21.5l2 1.6M18 21.5l-2-1.6M18 21.5l-2 1.6" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  /* ------------------------------------------------ Home tab: rotate */
  rotateIcon: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M20 3v4h-4" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="12" cy="12" r="2.2" fill="#f59e0b" />
    </>
  ),
  rotateLeft: (
    <>
      <path d="M5 12a8 8 0 1 0 2.3-5.6" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M5 3v4h4" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="12" y="15.5" fontSize="7" fontWeight="700" textAnchor="middle" fill="#475569">90°</text>
    </>
  ),
  rotateRight: (
    <>
      <path d="M19 12a8 8 0 1 1-2.3-5.6" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M19 3v4h-4" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="12" y="15.5" fontSize="7" fontWeight="700" textAnchor="middle" fill="#475569">90°</text>
    </>
  ),
  flipH: (
    <>
      <path d="M12 3v18" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.6 2" />
      <path d="M9.5 6 4 12l5.5 6z" fill="#2563eb" />
      <path d="M14.5 6 20 12l-5.5 6z" fill="#94a3b8" />
    </>
  ),
  flipV: (
    <>
      <path d="M3 12h18" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="2.6 2" />
      <path d="M6 9.5 12 4l6 5.5z" fill="#2563eb" />
      <path d="M6 14.5 12 20l6-5.5z" fill="#94a3b8" />
    </>
  ),

  /* ------------------------------------------- Home tab: group / lock */
  ungroup: (
    <>
      <rect x="6.5" y="6.5" width="4.6" height="4.6" rx="1" fill="#2563eb" />
      <rect x="12.9" y="6.5" width="4.6" height="4.6" rx="1" fill="#0d9488" />
      <rect x="6.5" y="12.9" width="4.6" height="4.6" rx="1" fill="#f59e0b" />
      <rect x="12.9" y="12.9" width="4.6" height="4.6" rx="1" fill="#8b5cf6" />
      <path d="M4 4l2.5 2.5M20 4l-2.5 2.5M4 20l2.5-2.5M20 20l-2.5-2.5" stroke="#475569" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  merge: (
    <>
      <rect x="3.5" y="4.5" width="8" height="8" rx="1.2" fill="#2563eb" />
      <rect x="12.5" y="4.5" width="8" height="8" rx="1.2" fill="#0d9488" />
      <path d="M5 19.5v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 14.5v-3M12 11.5l-2 2M12 11.5l2 2" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  split: (
    <>
      <rect x="7.5" y="11" width="9" height="8.5" rx="1.2" fill="#f59e0b" />
      <path d="M9 8.5V5.5M9 5.5 7 7.5M9 5.5l2 2M15 8.5V5.5M15 5.5l-2 2M15 5.5l2 2" stroke="#2563eb" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  saveBlock: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 2.2" />
      <rect x="7" y="7" width="10" height="10" rx="1.4" fill="#f59e0b" />
      <path d="M9.5 8.8h5v5.4a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1z" fill="#ffffff" />
      <path d="M11 8.8v1.8h2V8.8" fill="#f59e0b" />
    </>
  ),
  lock: (
    <>
      <rect x="5.5" y="10.5" width="13" height="10" rx="2" fill="#2563eb" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.6" fill="#ffffff" />
      <path d="M12 15.8v1.7" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  lockAll: (
    <>
      <rect x="3" y="11" width="10" height="8.5" rx="1.8" fill="#2563eb" />
      <path d="M5.5 11V8.8a2.7 2.7 0 0 1 5.4 0V11" stroke="#475569" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <rect x="11" y="11" width="10" height="8.5" rx="1.8" fill="#60a5fa" />
      <path d="M13.5 11V8.8a2.7 2.7 0 0 1 5.4 0V11" stroke="#475569" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </>
  ),
  unlockAll: (
    <>
      <rect x="3" y="11" width="10" height="8.5" rx="1.8" fill="#94a3b8" />
      <path d="M5.5 11V8.8a2.7 2.7 0 0 1 5.2-1.1" stroke="#475569" strokeWidth="1.7" fill="none" strokeLinecap="round" />
      <rect x="11" y="11" width="10" height="8.5" rx="1.8" fill="#22c55e" />
      <path d="M13.5 11V8.8a2.7 2.7 0 0 1 5.2-1.1" stroke="#475569" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </>
  ),

  /* --------------------------------------- Home tab: visibility / box */
  hide: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="#94a3b8" />
      <path d="M4 4l16 16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  protected: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" fill="#ffffff" stroke="#475569" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="#2563eb" />
      <rect x="14.5" y="14.5" width="8" height="6.5" rx="1.4" fill="#f59e0b" />
      <path d="M16.3 14.5v-1.6a2.2 2.2 0 0 1 4.4 0v1.6" stroke="#b45309" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </>
  ),
  margin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1.5" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3.2 2.4" />
      <rect x="8" y="8" width="8" height="8" rx="1.2" fill="#2563eb" />
    </>
  ),
  padding: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="1.5" fill="#2563eb" />
      <rect x="8" y="8" width="8" height="8" rx="1.2" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeDasharray="2.8 2" />
    </>
  ),

  /* ------------------------------------------------- context menu extras */
  pasteInPlace: (
    <>
      <rect x="5" y="4" width="11" height="3.6" rx="1.2" fill="#94a3b8" />
      <path d="M8 7.6v11A1.6 1.6 0 0 0 9.6 20h8.8a1.6 1.6 0 0 0 1.6-1.4V7.6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.6" />
      <path d="M12.5 11v5M12.5 16l-2-2M12.5 16l2-2" stroke="#f59e0b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  copyStyle: (
    <>
      <path d="M4 20l1.2-4.2L16.5 4.5a2 2 0 0 1 2.8 0l.2.2a2 2 0 0 1 0 2.8L8.2 18.8z" fill="#8b5cf6" />
      <path d="M4 20l1.2-4.2 2.9 2.9z" fill="#f59e0b" />
    </>
  ),
  pasteStyle: (
    <>
      <path d="M6 16l1-3.4L15.6 4a1.8 1.8 0 0 1 2.6 0l.8.8a1.8 1.8 0 0 1 0 2.6L10.4 16z" fill="#8b5cf6" />
      <rect x="3" y="17.5" width="18" height="3.5" rx="1.4" fill="#2563eb" />
    </>
  ),
  selectAll: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="none" stroke="#2563eb" strokeWidth="1.7" strokeDasharray="3.4 2.4" />
      <path d="M8 12.4l2.6 2.6L16.5 9" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  invertSelection: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" fill="#dbeafe" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.4" fill="#2563eb" />
      <path d="M9 12.2l2.1 2.1L15.2 10" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  restoreSize: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeDasharray="3 2.4" />
      <path d="M15.5 12a3.5 3.5 0 1 1-1-2.5" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M15.5 6.5v3h-3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),
  animations: (
    <>
      <path d="M13.5 2.5 5.5 13.5h5l-1.5 8 8.5-11h-5z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
    </>
  ),
  easyBreakpoint: (
    <>
      <rect x="3" y="5" width="13" height="10" rx="1.5" fill="#2563eb" />
      <rect x="6" y="8" width="13" height="11" rx="1.5" fill="#ffffff" stroke="#0d9488" strokeWidth="1.7" />
      <path d="M12.5 11.5v4M12.5 11.5l-1.8 1.8M12.5 11.5l1.8 1.8" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </>
  ),

  /* ------------------------------------------------------ device bar */
  deviceDesktop: (
    <>
      <rect x="2.5" y="4" width="19" height="12.5" rx="1.8" fill="#2563eb" />
      <rect x="4.5" y="6" width="15" height="8.5" rx=".8" fill="#dbeafe" />
      <path d="M9.5 19.5h5M12 16.5v3" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  deviceTablet: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="2" fill="#0d9488" />
      <rect x="6.5" y="5" width="11" height="12.5" rx=".8" fill="#ccfbf1" />
      <circle cx="12" cy="19.2" r="1" fill="#ccfbf1" />
    </>
  ),
  deviceMobile: (
    <>
      <rect x="7.5" y="2.5" width="9" height="19" rx="2" fill="#8b5cf6" />
      <rect x="9.3" y="4.5" width="5.4" height="13.5" rx=".7" fill="#ede9fe" />
      <circle cx="12" cy="19.8" r=".9" fill="#ede9fe" />
    </>
  ),
};

export interface AppIconProps {
  name: string;
  size?: number;
}

export function AppIcon({ name, size = 24 }: AppIconProps) {
  const body = ICONS[name] ?? ICONS.generic;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true">
      {body}
    </svg>
  );
}

export default AppIcon;

/* ------------------------------------------------------------ mappings */

/** Toolbox control type (componentDefs `def.type`) → icon name. */
const TYPE_ICON: Record<string, string> = {
  // Layout
  section: 'section', container: 'container', row: 'row', column: 'column',
  flex: 'flexbox', grid: 'grid', card: 'card', panel: 'panel',
  group: 'groupBox', spacer: 'spacer',
  // Basic
  text: 'text', heading: 'heading', paragraph: 'paragraph', image: 'image',
  button: 'button', link: 'link', icon: 'star', divider: 'divider',
  rectangle: 'rect', roundedRectangle: 'roundedRect', ellipse: 'ellipse',
  list: 'list', htmlEmbed: 'htmlEmbed',
  // Forms
  form: 'form', textInput: 'textInput', password: 'password', email: 'email',
  number: 'number', tel: 'tel', textarea: 'textarea', checkbox: 'checkbox',
  radio: 'radio', select: 'selectInput', date: 'datePicker', time: 'timePicker',
  file: 'fileUpload', range: 'range', submit: 'submitButton', reset: 'resetButton',
  hiddenField: 'hiddenField',
  // Navigation
  navbar: 'navbar', menubar: 'menubar', hamburger: 'hamburgerMenu',
  dropdown: 'dropdownMenu', sidebar: 'sidebarMenu', breadcrumb: 'breadcrumb',
  pagination: 'pagination', tabs: 'tabs',
  // Media
  video: 'video', audio: 'audio', youtube: 'youtube', gallery: 'gallery',
  slideshow: 'slideshow', carousel: 'carousel', lightbox: 'lightbox',
  // Advanced
  accordion: 'accordion', modal: 'modal', tooltip: 'tooltip',
  progress: 'progressBar', counter: 'counter', rating: 'rating', badge: 'badge',
  alert: 'alert', timeline: 'timeline',
  // Data
  table: 'table', datagrid: 'dataGrid', repeater: 'repeater',
  treeview: 'treeView', searchbox: 'searchBox',
  // Social
  socialicons: 'socialIcons', sharebuttons: 'shareButtons', whatsapp: 'whatsapp',
  facebook: 'facebook', xembed: 'xEmbed',
  // Maps
  map: 'map', marker: 'locationMarker',
  // Code
  html: 'html', css: 'css', javascript: 'javascript', iframe: 'iframe',
  // Special
  qrcode: 'qrCode', countdown: 'countdown', calendar: 'calendar',
  captcha: 'captcha', cookieconsent: 'cookieConsent',
  // User (Database)
  login: 'login', register: 'register', logout: 'logout', profile: 'userProfile',
  dbform: 'dbForm', dbtable: 'dbTable', searchresults: 'searchResults',
  // E-Commerce
  productcard: 'productCard', productgrid: 'productGrid', price: 'price',
  quantity: 'quantity', addtocart: 'addToCart', cart: 'cart', checkout: 'checkout',
};

/** Label-based fallback (lowercased labels) when no type match exists. */
const LABEL_ICON: Record<string, string> = {
  pointer: 'pointer', text: 'text', heading: 'heading', paragraph: 'paragraph',
  image: 'image', button: 'button', link: 'link', hyperlink: 'link', icon: 'star',
  divider: 'divider', 'horizontal line': 'divider', rectangle: 'rect',
  'rounded rectangle': 'roundedRect', ellipse: 'ellipse', list: 'list',
  'bullet list': 'list', html: 'html', form: 'form', 'text input': 'textInput',
  'text box': 'textInput', password: 'password', email: 'email', number: 'number',
  telephone: 'tel', 'text area': 'textarea', checkbox: 'checkbox', radio: 'radio',
  'radio button': 'radio', 'combo box': 'selectInput', 'date picker': 'datePicker',
  'time picker': 'timePicker', 'file upload': 'fileUpload', 'range slider': 'range',
  'submit button': 'submitButton', 'reset button': 'resetButton',
  'hidden field': 'hiddenField', navbar: 'navbar', 'menu bar': 'menubar',
  'hamburger menu': 'hamburgerMenu', 'dropdown menu': 'dropdownMenu',
  'sidebar menu': 'sidebarMenu', breadcrumb: 'breadcrumb', pagination: 'pagination',
  tabs: 'tabs', video: 'video', audio: 'audio', youtube: 'youtube',
  'image gallery': 'gallery', gallery: 'gallery', slideshow: 'slideshow',
  carousel: 'carousel', lightbox: 'lightbox', accordion: 'accordion',
  'modal / popup': 'modal', modal: 'modal', tooltip: 'tooltip',
  'progress bar': 'progressBar', counter: 'counter', rating: 'rating',
  badge: 'badge', alert: 'alert', timeline: 'timeline', table: 'table',
  'data grid': 'dataGrid', 'repeater / list': 'repeater', repeater: 'repeater',
  'tree view': 'treeView', 'search box': 'searchBox', 'social icons': 'socialIcons',
  'share buttons': 'shareButtons', 'whatsapp button': 'whatsapp',
  'facebook embed': 'facebook', 'x / twitter embed': 'xEmbed', map: 'map',
  'location marker': 'locationMarker', css: 'css', javascript: 'javascript',
  iframe: 'iframe', 'qr code': 'qrCode', 'countdown timer': 'countdown',
  calendar: 'calendar', captcha: 'captcha', 'cookie consent': 'cookieConsent',
  login: 'login', register: 'register', logout: 'logout',
  'user profile': 'userProfile', 'database form': 'dbForm',
  'database table': 'dbTable', 'search results': 'searchResults',
  'product card': 'productCard', 'product grid': 'productGrid', price: 'price',
  'quantity selector': 'quantity', 'add to cart': 'addToCart',
  'shopping cart': 'cart', 'checkout button': 'checkout',
};

/** Icon for a toolbox control, keyed on the unique def.type with a label fallback. */
export function toolboxIconName(type: string, label: string): string {
  return TYPE_ICON[type] ?? LABEL_ICON[label.trim().toLowerCase()] ?? 'generic';
}

/** Icon for a ribbon button, mapped from its (lowercased) label. */
export function ribbonIconName(label: string): string {
  const key = label.trim().toLowerCase();
  switch (key) {
    case 'new': return 'new';
    case 'open': return 'open';
    case 'save all': return 'saveAll';
    case 'save': return 'save';
    case 'close': return 'close';
    case 'cut': return 'cut';
    case 'copy': return 'copy';
    case 'paste': return 'paste';
    case 'undo': return 'undo';
    case 'redo': return 'redo';
    case 'select':
    case 'pointer':
    case 'select all': return 'pointer';
    case 'move': return 'move';
    case 'size': return 'size';
    case 'align': return 'align';
    case 'bring to front':
    case 'to front': return 'bringFront';
    case 'send to back':
    case 'to back': return 'sendBack';
    case 'bring forward':
    case 'forward': return 'bringForward';
    case 'send backward':
    case 'backward': return 'sendBackward';
    case 'group': return 'group';
    case 'preview': return 'preview';
    case 'publish': return 'publish';
    case 'snap to grid': return 'snapGrid';
    case 'new page': return 'newPage';
    case 'rename': return 'rename';
    case 'clone': return 'clone';
    case 'delete': return 'delete';
    case 'add breakpoint':
    case 'add': return 'addBreakpoint';
    case 'manage breakpoints':
    case 'manage': return 'manageBreakpoints';
    case 'themes': return 'themes';
    case 'color scheme': return 'colorScheme';
    case 'fonts': return 'fonts';
    case 'page properties': return 'pageProperties';
    case 'layout': return 'layout';
    case 'connection': return 'connection';
    case 'new query': return 'newQuery';
    case 'table': return 'table';
    case 'view': return 'dbView';
    case 'materialized view': return 'matView';
    case 'function': return 'function';
    case 'query': return 'query';
    case 'model': return 'model';
    case 'zoom in': return 'zoomIn';
    case 'zoom out': return 'zoomOut';
    case '100%': return 'zoomReset';
    case 'toolbox': return 'toolbox';
    case 'project explorer': return 'projectExplorer';
    case 'properties': return 'properties';
    case 'output': return 'output';
    case 'cascade': return 'cascade';
    case 'tile horizontal': return 'tileH';
    case 'tile vertical': return 'tileV';
    case 'reset layout': return 'resetLayout';
    case 'options': return 'options';
    case 'spell check': return 'spellCheck';
    case 'help': return 'help';
    case 'about': return 'about';
    case 'move to front': return 'bringFront';
    case 'move to back': return 'sendBack';
    case 'move forward': return 'bringForward';
    case 'move back':
    case 'move backward': return 'sendBackward';
    case 'left': return 'alignLeft';
    case 'center': return 'alignCenter';
    case 'right': return 'alignRight';
    case 'top': return 'alignTop';
    case 'middle': return 'alignMiddle';
    case 'bottom': return 'alignBottom';
    case 'width': return 'matchWidth';
    case 'height': return 'matchHeight';
    case 'match size': return 'matchSize';
    case 'scale': return 'scale';
    case 'distribute': return 'distributeH';
    case 'horizontally': return 'distributeH';
    case 'vertically': return 'distributeV';
    case 'center in page': return 'centerPage';
    case 'center in page (horizontally)': return 'centerPage';
    case 'center in page (vertically)': return 'centerPage';
    case 'both': return 'centerPage';
    case 'make width same as page width': return 'pageWidth';
    case 'rotate': return 'rotate';
    case 'rotate left 90°': return 'rotateLeft';
    case 'rotate right 90°': return 'rotateRight';
    case 'flip horizontal': return 'flipH';
    case 'flip vertical': return 'flipV';
    case 'ungroup': return 'ungroup';
    case 'merge': return 'merge';
    case 'split': return 'split';
    case 'save as block': return 'saveBlock';
    case 'lock': return 'lock';
    case 'lock all': return 'lockAll';
    case 'unlock all': return 'unlockAll';
    case 'hide': return 'hide';
    case 'protected content': return 'protected';
    case 'flexbox': return 'flexbox';
    case 'margin': return 'margin';
    case 'padding': return 'padding';
    default: break;
  }
  if (key.includes('breakpoint')) return 'addBreakpoint';
  if (key.includes('front')) return 'bringFront';
  if (key.includes('back')) return 'sendBack';
  if (key.includes('color')) return 'colorScheme';
  if (key.includes('grid') || key.includes('snap')) return 'snapGrid';
  return toolboxIconName('', label);
}
