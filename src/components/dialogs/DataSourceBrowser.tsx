import { useState } from 'react';
import type { DbConnection } from '../../model/types';
import { dbOf, useProjectStore } from '../../store/projectStore';
import { uid } from '../../model/factory';
import { DB_DRIVERS } from './ConnectionsDialog';
import { appAlert, appConfirm } from '../../actions/dialogs';

interface LiveObjects {
  tables: { name: string; engine: string; rows: number; size: number }[];
  views: string[];
  procedures: string[];
  functions: string[];
  triggers: string[];
}
interface ColInfo { name: string; type: string; nullable: boolean; pk: boolean; defaultValue: string }

const CATEGORIES: { id: keyof LiveObjects; label: string; icon: string }[] = [
  { id: 'tables', label: 'Tables', icon: '▦' },
  { id: 'views', label: 'Views', icon: '👁' },
  { id: 'procedures', label: 'Stored Procedures', icon: 'ƒx' },
  { id: 'functions', label: 'Functions', icon: '𝑓' },
  { id: 'triggers', label: 'Triggers', icon: '⚡' },
];

function cfgFor(conn: DbConnection, dbName?: string) {
  return {
    driver: conn.driver,
    host: conn.host,
    port: conn.port,
    // SQLite's "database" is the file path — keep it; other drivers switch DBs by name.
    database: conn.driver === 'sqlite' ? conn.database : dbName ?? conn.database,
    username: conn.username,
    password: conn.password,
  };
}

type Viewer = null | { kind: 'open'; title: string; columns: string[]; rows: any[][] } | { kind: 'design'; title: string; columns: ColInfo[] };

/**
 * Navicat-style connections tree, embedded in the Properties panel as the
 * "Data Source" tab. Open/Design Table show their result in a modal so the
 * narrow panel stays a pure navigator.
 */
export default function DataSourceTree() {
  const openConnections = useProjectStore((s) => s.openConnections);
  const openDatabase = useProjectStore((s) => s.openDatabase);
  const connections = useProjectStore((s) => dbOf(s.project).connections);
  const saveTable = useProjectStore((s) => s.saveTable);

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dbs, setDbs] = useState<Record<string, string[] | 'loading' | string>>({});
  const [objects, setObjects] = useState<Record<string, LiveObjects | 'loading' | string>>({});
  const [fields, setFields] = useState<Record<string, ColInfo[] | 'loading'>>({});
  const [search, setSearch] = useState('');
  const [viewer, setViewer] = useState<Viewer>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number; connId: string; db: string; table: string } | null>(null);

  const connOf = (id: string) => connections.find((c) => c.id === id);
  const searching = search.trim() !== '';
  const isOpen = (key: string) => searching || expanded.has(key);
  const toggle = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const match = (name: string) => !searching || name.toLowerCase().includes(search.trim().toLowerCase());

  const loadDatabases = async (conn: DbConnection) => {
    if (!window.sitebuilder?.dbListDatabases) return;
    setDbs((d) => ({ ...d, [conn.id]: 'loading' }));
    const res = await window.sitebuilder.dbListDatabases(cfgFor(conn));
    setDbs((d) => ({ ...d, [conn.id]: res.ok ? res.databases ?? [] : `✖ ${res.error}` }));
  };

  const loadObjects = async (conn: DbConnection, dbName: string) => {
    const key = `${conn.id}/${dbName}`;
    if (!window.sitebuilder?.dbListObjects) return;
    setObjects((o) => ({ ...o, [key]: 'loading' }));
    const res = await window.sitebuilder.dbListObjects(cfgFor(conn, dbName));
    setObjects((o) => ({
      ...o,
      [key]: res.ok
        ? { tables: res.tables ?? [], views: res.views ?? [], procedures: res.procedures ?? [], functions: res.functions ?? [], triggers: res.triggers ?? [] }
        : `✖ ${res.error}`,
    }));
  };

  const loadFields = async (conn: DbConnection, dbName: string, table: string) => {
    // Must match the tree node key: `${connId}/${dbName}/tables/${table}`
    const key = `${conn.id}/${dbName}/tables/${table}`;
    if (!window.sitebuilder?.dbListColumns) return;
    setFields((f) => ({ ...f, [key]: 'loading' }));
    const res = await window.sitebuilder.dbListColumns(cfgFor(conn, dbName), table);
    setFields((f) => ({ ...f, [key]: res.ok ? res.columns ?? [] : [] }));
  };

  const openTable = async (connId: string, dbName: string, table: string) => {
    const conn = connOf(connId);
    if (!conn || !window.sitebuilder?.dbFetchRows) return;
    setViewer({ kind: 'open', title: table, columns: [], rows: [] });
    const res = await window.sitebuilder.dbFetchRows(cfgFor(conn, dbName), table, 200);
    if (res.ok) setViewer({ kind: 'open', title: table, columns: res.columns ?? [], rows: res.rows ?? [] });
    else setViewer(null);
    if (!res.ok) await appAlert(res.error || 'Could not read rows.');
  };

  const designTable = async (connId: string, dbName: string, table: string) => {
    const conn = connOf(connId);
    if (!conn || !window.sitebuilder?.dbListColumns) return;
    const res = await window.sitebuilder.dbListColumns(cfgFor(conn, dbName), table);
    if (res.ok) setViewer({ kind: 'design', title: table, columns: res.columns ?? [] });
    else await appAlert(res.error || 'Could not read columns.');
  };

  const dropTable = async (connId: string, dbName: string, table: string) => {
    const conn = connOf(connId);
    if (!conn || !window.sitebuilder?.dbDropTable) return;
    if (!(await appConfirm(`Drop table "${table}" from ${dbName}? This cannot be undone.`))) return;
    const res = await window.sitebuilder.dbDropTable(cfgFor(conn, dbName), table);
    if (!res.ok) await appAlert(res.error || 'Drop failed.');
    else await loadObjects(conn, dbName);
  };

  const newTable = () => {
    saveTable({
      id: uid('dbt'),
      name: 'new_table',
      engine: 'InnoDB',
      charset: 'utf8mb4',
      collation: 'utf8mb4_unicode_ci',
      columns: [{ id: uid('col'), name: 'id', dataType: 'INT', length: '11', allowNull: false, defaultValue: '', primaryKey: true, autoIncrement: true }],
    });
    openDatabase('table');
  };

  return (
    <div className="ds-tab" onMouseDown={() => ctx && setCtx(null)}>
      <div className="ds-tab-title">
        🌐 My Connections
        <button className="db-icon-btn" title="Manage Connections" onClick={openConnections}>⚙</button>
      </div>
      <div className="ds-tab-tree">
        {connections.length === 0 && (
          <div className="db-empty" style={{ padding: '8px 12px' }}>
            No connections yet.{' '}
            <button className="db-link-btn" onClick={openConnections}>Create one</button>
          </div>
        )}
        {connections.map((conn) => {
          const cKey = conn.id;
          const cOpen = isOpen(cKey);
          const dbState = dbs[conn.id];
          const icon = DB_DRIVERS.find((d) => d.id === conn.driver)?.icon ?? '🗄';
          if (searching && typeof dbState !== 'undefined' && Array.isArray(dbState) === false && dbState !== 'loading') return null;
          return (
            <div key={conn.id}>
              <div
                className="ds-node"
                onClick={() => {
                  toggle(cKey);
                  if (!cOpen && dbState === undefined) void loadDatabases(conn);
                }}
              >
                <span className="ds-tw">{cOpen ? '▾' : '▸'}</span> {icon} {conn.name}
              </div>
              {cOpen && (
                <div className="ds-kids">
                  {dbState === 'loading' && <div className="ds-node ds-dim">⏳ loading…</div>}
                  {typeof dbState === 'string' && dbState !== 'loading' && <div className="ds-node ds-err">{dbState}</div>}
                  {Array.isArray(dbState) && dbState.map((dbName) => {
                    const dKey = `${conn.id}/${dbName}`;
                    const dOpen = isOpen(dKey);
                    const objState = objects[dKey];
                    return (
                      <div key={dKey}>
                        <div
                          className="ds-node"
                          onClick={() => {
                            toggle(dKey);
                            if (!dOpen && objState === undefined) void loadObjects(conn, dbName);
                          }}
                        >
                          <span className="ds-tw">{dOpen ? '▾' : '▸'}</span> 🛢 {dbName}
                        </div>
                        {dOpen && (
                          <div className="ds-kids">
                            {objState === 'loading' && <div className="ds-node ds-dim">⏳ loading…</div>}
                            {typeof objState === 'string' && objState !== 'loading' && <div className="ds-node ds-err">{objState}</div>}
                            {objState && objState !== 'loading' && typeof objState !== 'string' && CATEGORIES.map((cat) => {
                              const catKey = `${dKey}/${cat.id}`;
                              const catOpen = isOpen(catKey);
                              const all: string[] = cat.id === 'tables' ? objState.tables.map((t) => t.name) : objState[cat.id];
                              const items = all.filter(match);
                              if (searching && items.length === 0) return null;
                              return (
                                <div key={cat.id}>
                                  <div className="ds-node" onClick={() => toggle(catKey)}>
                                    <span className="ds-tw">{catOpen ? '▾' : '▸'}</span> {cat.icon} {cat.label} <span className="ds-count">{items.length}</span>
                                  </div>
                                  {catOpen && (
                                    <div className="ds-kids">
                                      {items.map((name) => {
                                        const tKey = `${catKey}/${name}`;
                                        const tOpen = isOpen(tKey);
                                        const isTable = cat.id === 'tables';
                                        return (
                                          <div key={name}>
                                            <div
                                              className="ds-node"
                                              onClick={() => {
                                                if (isTable) { toggle(tKey); if (!tOpen && fields[tKey] === undefined) void loadFields(conn, dbName, name); }
                                              }}
                                              onDoubleClick={() => isTable && void openTable(conn.id, dbName, name)}
                                              onContextMenu={(e) => {
                                                if (!isTable) return;
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setCtx({ x: e.clientX, y: e.clientY, connId: conn.id, db: dbName, table: name });
                                              }}
                                              title={isTable ? 'Double-click to open · right-click for actions' : undefined}
                                            >
                                              {isTable && <span className="ds-tw">{tOpen ? '▾' : '▸'}</span>} ▦ {name}
                                            </div>
                                            {isTable && tOpen && (
                                              <div className="ds-kids">
                                                {(() => {
                                                  const f = fields[tKey];
                                                  if (f === 'loading' || f === undefined) return <div className="ds-node ds-dim">⏳ …</div>;
                                                  return (
                                                    <>
                                                      <div className="ds-node ds-dim">Fields</div>
                                                      {f.map((c) => (
                                                        <div key={c.name} className="ds-node ds-field">
                                                          {c.pk ? '🔑' : '▫️'} {c.name} <span className="ds-dim">{c.type}</span>
                                                        </div>
                                                      ))}
                                                    </>
                                                  );
                                                })()}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                      {items.length === 0 && <div className="ds-node ds-dim">(empty)</div>}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="ds-search">
        <input className="db-input" placeholder="🔍 Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* context menu */}
      {ctx && (
        <div className="ds-ctx" style={{ left: Math.min(ctx.x, window.innerWidth - 200), top: ctx.y }} onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => { const c = ctx; setCtx(null); void openTable(c.connId, c.db, c.table); }}>📂 Open Table</button>
          <button onClick={() => { const c = ctx; setCtx(null); void designTable(c.connId, c.db, c.table); }}>✎ Design Table</button>
          <div className="ds-ctx-sep" />
          <button onClick={() => { setCtx(null); newTable(); }}>＋ New Table</button>
          <button className="danger" onClick={() => { const c = ctx; setCtx(null); void dropTable(c.connId, c.db, c.table); }}>🗑 Delete Table</button>
          <div className="ds-ctx-sep" />
          <button onClick={() => { const c = ctx; setCtx(null); const conn = connOf(c.connId); if (conn) void loadObjects(conn, c.db); }}>🔄 Refresh</button>
        </div>
      )}

      {/* open/design result modal */}
      {viewer && (
        <div className="dlg-overlay" onMouseDown={(e) => e.target === e.currentTarget && setViewer(null)}>
          <div className="db-modal ds-viewer">
            <div className="db-header">
              <div className="db-header-title">{viewer.kind === 'open' ? '📂' : '✎'} {viewer.title}</div>
              <div style={{ flex: 1 }} />
              <button className="db-close" onClick={() => setViewer(null)}>✕</button>
            </div>
            <div className="ds-viewer-body">
              {viewer.kind === 'open' && (
                <table className="db-table ds-grid">
                  <thead><tr>{viewer.columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
                  <tbody>
                    {viewer.rows.map((r, i) => (
                      <tr key={i}>{r.map((v, j) => <td key={j}>{v === null ? <span className="ds-dim">NULL</span> : String(v)}</td>)}</tr>
                    ))}
                    {viewer.rows.length === 0 && <tr><td colSpan={viewer.columns.length || 1} className="db-empty">{viewer.columns.length === 0 ? '⏳ Loading…' : 'Table is empty.'}</td></tr>}
                  </tbody>
                </table>
              )}
              {viewer.kind === 'design' && (
                <table className="db-table">
                  <thead><tr><th></th><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr></thead>
                  <tbody>
                    {viewer.columns.map((c, i) => (
                      <tr key={c.name}>
                        <td>{i + 1}</td>
                        <td>{c.pk ? '🔑 ' : ''}<b>{c.name}</b></td>
                        <td>{c.type}</td>
                        <td>{c.nullable ? '✓' : ''}</td>
                        <td>{c.pk ? 'PRI' : ''}</td>
                        <td>{c.defaultValue || <span className="ds-dim">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
