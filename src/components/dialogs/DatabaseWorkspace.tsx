import { useEffect, useState } from 'react';
import type { DbColumn, DbConnection, DbSqlObject, DbTable } from '../../model/types';
import { dbOf, useProjectStore, type DatabasePage, type DbObjectKind } from '../../store/projectStore';
import { uid } from '../../model/factory';
import { appConfirm } from '../../actions/dialogs';

const DATA_TYPES = ['INT', 'VARCHAR', 'TEXT', 'DATETIME', 'DATE', 'DECIMAL', 'BOOLEAN', 'BLOB'];

/** Tab metadata — also used by the page tab strip in CanvasArea. */
export const DB_TAB_META: { id: DatabasePage; icon: string; title: string }[] = [
  { id: 'table', icon: '▦', title: 'Table' },
  { id: 'view', icon: '👁', title: 'View' },
  { id: 'matview', icon: '▧', title: 'Materialized View' },
  { id: 'function', icon: 'ƒ(x)', title: 'Function' },
  { id: 'query', icon: '🔍', title: 'Query' },
];

/** Rendered inside the center column when a database tab is active. */
export default function DatabaseWorkspace() {
  const page = useProjectStore((s) => s.activeDbPage);
  if (!page) return null;
  return (
    <div className="db-tabpage">
      {page === 'table' ? <TablesPage /> : <SqlObjectsPage key={page} page={page} />}
    </div>
  );
}

/* ================= shared helpers ================= */

interface LiveObjects {
  tables: { name: string; engine: string; rows: number; size: number }[];
  views: string[];
  procedures: string[];
  functions: string[];
  triggers: string[];
}

function cfgOf(conn: DbConnection) {
  return {
    driver: conn.driver,
    host: conn.host,
    port: conn.port,
    database: conn.database,
    username: conn.username,
    password: conn.password,
  };
}

/** Fetches live objects for the chosen connection (null connection = local design mode). */
function useLiveObjects(conn: DbConnection | null) {
  const [live, setLive] = useState<LiveObjects | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    if (!conn) return;
    const api = window.sitebuilder;
    if (!api?.dbListObjects) {
      setError('Live browsing is only available inside the desktop app.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await api.dbListObjects(cfgOf(conn));
    setLoading(false);
    if (res.ok) {
      setLive({
        tables: res.tables ?? [],
        views: res.views ?? [],
        procedures: res.procedures ?? [],
        functions: res.functions ?? [],
        triggers: res.triggers ?? [],
      });
    } else {
      setLive(null);
      setError(res.error || 'Could not list database objects.');
    }
  };

  useEffect(() => {
    setLive(null);
    setError('');
    if (conn) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn?.id]);

  return { live, loading, error, refresh };
}

/** Connection picker shared by all database object tabs. */
function ConnectionPicker({ connId, onChange }: { connId: string; onChange: (id: string) => void }) {
  const connections = useProjectStore((s) => dbOf(s.project).connections);
  const openConnections = useProjectStore((s) => s.openConnections);
  return (
    <div className="db-objlist-conn">
      <select className="db-input" value={connId} onChange={(e) => onChange(e.target.value)}>
        <option value="">Local design (stored in project)</option>
        {connections.map((c) => (
          <option key={c.id} value={c.id}>🔌 {c.name}</option>
        ))}
      </select>
      <button className="db-icon-btn" title="Manage Connections" onClick={openConnections}>⚙</button>
    </div>
  );
}

/* ================= TABLE tab ================= */

function newLocalTable(existing: number): DbTable {
  return {
    id: uid('dbt'),
    name: `table_${existing + 1}`,
    engine: 'InnoDB',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    columns: [
      { id: uid('col'), name: 'id', dataType: 'INT', length: '11', allowNull: false, defaultValue: '', primaryKey: true, autoIncrement: true },
    ],
  };
}

function TablesPage() {
  const db = useProjectStore((s) => dbOf(s.project));
  const saveTable = useProjectStore((s) => s.saveTable);
  const selectedTableId = useProjectStore((s) => s.selectedTableId);
  const selectDbTable = useProjectStore((s) => s.selectDbTable);

  const [connId, setConnId] = useState('');
  const conn = db.connections.find((c) => c.id === connId) ?? null;
  const { live, loading, error, refresh } = useLiveObjects(conn);

  const [liveSel, setLiveSel] = useState<string | null>(null);
  const [liveCols, setLiveCols] = useState<{ name: string; type: string; nullable: boolean; pk: boolean; defaultValue: string }[] | null>(null);

  const selectedLocal = db.tables.find((t) => t.id === selectedTableId) ?? null;

  const changeConn = (id: string) => {
    setConnId(id);
    setLiveSel(null);
    setLiveCols(null);
  };

  const pickLocal = (id: string) => {
    selectDbTable(id);
    setLiveSel(null);
    setLiveCols(null);
  };

  const pickLive = async (name: string) => {
    if (!conn) return;
    selectDbTable(null);
    setLiveSel(name);
    setLiveCols(null);
    const api = window.sitebuilder;
    if (!api?.dbListColumns) return;
    const res = await api.dbListColumns(cfgOf(conn), name);
    if (res.ok) setLiveCols(res.columns ?? []);
  };

  const addTable = () => {
    const t = newLocalTable(db.tables.length);
    saveTable(t);
    pickLocal(t.id);
  };

  return (
    <div className="db-page">
      <div className="db-pane db-objlist">
        <ConnectionPicker connId={connId} onChange={changeConn} />
        {!conn && (
          <button className="db-btn db-btn-primary" onClick={addTable}>＋ New Table</button>
        )}
        {conn && (
          <button className="db-icon-btn" title="Refresh" style={{ alignSelf: 'flex-end' }} onClick={() => void refresh()}>🔄</button>
        )}
        <div className="db-obj-items">
          {!conn && db.tables.map((t) => (
            <div
              key={t.id}
              className={`db-obj-item${selectedTableId === t.id && !liveSel ? ' selected' : ''}`}
              onClick={() => pickLocal(t.id)}
            >
              <span className="db-list-icon">▦</span> {t.name}
              <span className="db-obj-badge">{t.columns.length} cols</span>
            </div>
          ))}
          {!conn && db.tables.length === 0 && (
            <div className="db-empty">No tables yet — click “＋ New Table”.</div>
          )}
          {conn && loading && <div className="db-muted">⏳ Loading tables…</div>}
          {conn && live?.tables.map((t) => (
            <div
              key={t.name}
              className={`db-obj-item${liveSel === t.name ? ' selected' : ''}`}
              onClick={() => void pickLive(t.name)}
            >
              <span className="db-list-icon">▦</span> {t.name}
              <span className="db-obj-badge">live</span>
            </div>
          ))}
          {conn && live && live.tables.length === 0 && <div className="db-empty">No tables found.</div>}
        </div>
        {error && <div className="db-note err">✖ {error}</div>}
      </div>

      <div className="db-pane db-editor">
        {liveSel && (
          <>
            <div className="db-pane-title">▦ {liveSel} <span className="db-obj-badge">live · read-only</span></div>
            {!liveCols && <div className="db-muted">⏳ Loading columns…</div>}
            {liveCols && (
              <table className="db-table">
                <thead>
                  <tr><th>#</th><th>Column</th><th>Type</th><th>Null</th><th>PK</th><th>Default</th></tr>
                </thead>
                <tbody>
                  {liveCols.map((c, i) => (
                    <tr key={c.name}>
                      <td>{i + 1}</td>
                      <td><b>{c.name}</b></td>
                      <td>{c.type}</td>
                      <td>{c.nullable ? '✓' : ''}</td>
                      <td>{c.pk ? '🔑' : ''}</td>
                      <td>{c.defaultValue || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {!liveSel && selectedLocal && <TableEditor table={selectedLocal} />}
        {!liveSel && !selectedLocal && (
          <div className="db-empty">Select a table on the left, or create a new one.</div>
        )}
      </div>
    </div>
  );
}

/** Column designer for a local (project-stored) table, with SQL preview and save. */
function TableEditor({ table }: { table: DbTable }) {
  const saveTable = useProjectStore((s) => s.saveTable);
  const deleteTable = useProjectStore((s) => s.deleteTable);
  const [draft, setDraft] = useState<DbTable | null>(null);
  const [tab, setTab] = useState<'columns' | 'sql'>('columns');

  const editing = draft ?? table;
  const edit = (patch: Partial<DbTable>) => setDraft({ ...editing, ...patch });

  const editColumn = (colId: string, patch: Partial<DbColumn>) => {
    edit({ columns: editing.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)) });
  };

  const addColumn = () => {
    edit({
      columns: [...editing.columns, { id: uid('col'), name: `column_${editing.columns.length + 1}`, dataType: 'VARCHAR', length: '255', allowNull: true, defaultValue: '', primaryKey: false, autoIncrement: false }],
    });
  };

  const sqlPreview = `CREATE TABLE \`${editing.name}\` (\n${editing.columns
    .map((c) => `  \`${c.name}\` ${c.dataType}${c.length ? `(${c.length})` : ''}${c.allowNull ? '' : ' NOT NULL'}${c.autoIncrement ? ' AUTO_INCREMENT' : ''}${c.primaryKey ? ' PRIMARY KEY' : ''}`)
    .join(',\n')}\n) ENGINE=${editing.engine} DEFAULT CHARSET=${editing.charset};`;

  return (
    <>
      <div className="db-row" style={{ marginTop: 0 }}>
        <label className="db-field db-grow">
          <span>Table Name</span>
          <input className="db-input" value={editing.name} onChange={(e) => edit({ name: e.target.value })} />
        </label>
        <label className="db-field">
          <span>Engine</span>
          <select className="db-input" value={editing.engine} onChange={(e) => edit({ engine: e.target.value })}>
            <option>InnoDB</option><option>MyISAM</option><option>MEMORY</option>
          </select>
        </label>
        <label className="db-field">
          <span>Charset</span>
          <select className="db-input" value={editing.charset} onChange={(e) => edit({ charset: e.target.value })}>
            <option>utf8mb4</option><option>utf8</option><option>latin1</option>
          </select>
        </label>
        <label className="db-field">
          <span>Collation</span>
          <select className="db-input" value={editing.collation} onChange={(e) => edit({ collation: e.target.value })}>
            <option>utf8mb4_unicode_ci</option><option>utf8mb4_general_ci</option><option>utf8_general_ci</option>
          </select>
        </label>
      </div>
      <div className="db-subtabs">
        <button className={`db-subtab${tab === 'columns' ? ' active' : ''}`} onClick={() => setTab('columns')}>Columns</button>
        <button className={`db-subtab${tab === 'sql' ? ' active' : ''}`} onClick={() => setTab('sql')}>SQL Preview</button>
      </div>
      {tab === 'columns' && (
        <>
          <button className="db-btn db-btn-primary" style={{ alignSelf: 'flex-start', margin: '10px 0' }} onClick={addColumn}>＋ Add Column</button>
          <table className="db-table db-cols">
            <thead>
              <tr><th>#</th><th>Column Name</th><th>Data Type</th><th>Length</th><th>Null</th><th>Default</th><th>PK</th><th>AI</th><th></th></tr>
            </thead>
            <tbody>
              {editing.columns.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td><input className="db-input db-cell" value={c.name} onChange={(e) => editColumn(c.id, { name: e.target.value })} /></td>
                  <td>
                    <select className="db-input db-cell" value={c.dataType} onChange={(e) => editColumn(c.id, { dataType: e.target.value })}>
                      {DATA_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td><input className="db-input db-cell" style={{ width: 56 }} value={c.length} onChange={(e) => editColumn(c.id, { length: e.target.value })} /></td>
                  <td><input type="checkbox" checked={c.allowNull} onChange={(e) => editColumn(c.id, { allowNull: e.target.checked })} /></td>
                  <td><input className="db-input db-cell" style={{ width: 90 }} value={c.defaultValue} onChange={(e) => editColumn(c.id, { defaultValue: e.target.value })} /></td>
                  <td><input type="checkbox" checked={c.primaryKey} onChange={(e) => editColumn(c.id, { primaryKey: e.target.checked })} /></td>
                  <td><input type="checkbox" checked={c.autoIncrement} onChange={(e) => editColumn(c.id, { autoIncrement: e.target.checked })} /></td>
                  <td>
                    <button className="db-icon-btn" title="Delete column" onClick={() => edit({ columns: editing.columns.filter((x) => x.id !== c.id) })}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {tab === 'sql' && <pre className="db-sql">{sqlPreview}</pre>}
      <div className="db-actions">
        <button className="db-btn db-btn-outline" onClick={async () => (await appConfirm(`Delete table "${table.name}"?`)) && deleteTable(table.id)}>🗑 Delete</button>
        <div style={{ flex: 1 }} />
        <button className="db-btn" onClick={() => setDraft(null)}>Cancel</button>
        <button className="db-btn db-btn-primary" disabled={!draft} onClick={() => { if (draft) { saveTable(draft); setDraft(null); } }}>Save Table</button>
      </div>
    </>
  );
}

/* ================= VIEW / MATERIALIZED VIEW / FUNCTION / QUERY tabs ================= */

const SQL_KINDS: Record<Exclude<DatabasePage, 'table'>, {
  kind: DbObjectKind;
  label: string;
  icon: string;
  liveKey?: 'views' | 'functions';
  template: (name: string) => string;
}> = {
  view: {
    kind: 'views', label: 'View', icon: '👁', liveKey: 'views',
    template: (n) => `CREATE VIEW ${n} AS\nSELECT\n  -- columns\nFROM table_name;`,
  },
  matview: {
    kind: 'matviews', label: 'Materialized View', icon: '▧',
    template: (n) => `CREATE MATERIALIZED VIEW ${n} AS\nSELECT\n  -- columns\nFROM table_name;`,
  },
  function: {
    kind: 'functions', label: 'Function', icon: 'ƒ(x)', liveKey: 'functions',
    template: (n) => `CREATE FUNCTION ${n}()\nRETURNS void AS $$\nBEGIN\n  -- body\nEND;\n$$ LANGUAGE plpgsql;`,
  },
  query: {
    kind: 'queries', label: 'Query', icon: '🔍',
    template: () => `-- Saved query\nSELECT * FROM table_name;`,
  },
};

function SqlObjectsPage({ page }: { page: Exclude<DatabasePage, 'table'> }) {
  const meta = SQL_KINDS[page];
  const db = useProjectStore((s) => dbOf(s.project));
  const saveDbObject = useProjectStore((s) => s.saveDbObject);
  const deleteDbObject = useProjectStore((s) => s.deleteDbObject);

  const [connId, setConnId] = useState('');
  const conn = db.connections.find((c) => c.id === connId) ?? null;
  const { live, loading, error, refresh } = useLiveObjects(conn);

  const objects = db[meta.kind];
  const [selId, setSelId] = useState<string | null>(null);
  const [liveSel, setLiveSel] = useState<string | null>(null);
  const [draft, setDraft] = useState<DbSqlObject | null>(null);

  const selected = objects.find((o) => o.id === selId) ?? null;
  const editing = draft ?? selected;

  const changeConn = (id: string) => {
    setConnId(id);
    setLiveSel(null);
  };

  const addObject = () => {
    const base = meta.kind === 'queries' ? 'query' : meta.kind === 'functions' ? 'func' : meta.kind === 'matviews' ? 'matview' : 'view';
    const obj: DbSqlObject = {
      id: uid('dbo'),
      name: `${base}_${objects.length + 1}`,
      sql: meta.template(`${base}_${objects.length + 1}`),
    };
    saveDbObject(meta.kind, obj);
    setSelId(obj.id);
    setLiveSel(null);
    setDraft(null);
  };

  const liveNames = meta.liveKey && live ? live[meta.liveKey] : [];

  return (
    <div className="db-page">
      <div className="db-pane db-objlist">
        <ConnectionPicker connId={connId} onChange={changeConn} />
        <button className="db-btn db-btn-primary" onClick={addObject}>＋ New {meta.label}</button>
        {conn && meta.liveKey && (
          <button className="db-icon-btn" title="Refresh" style={{ alignSelf: 'flex-end' }} onClick={() => void refresh()}>🔄</button>
        )}
        <div className="db-obj-items">
          {objects.map((o) => (
            <div
              key={o.id}
              className={`db-obj-item${selId === o.id && !liveSel ? ' selected' : ''}`}
              onClick={() => { setSelId(o.id); setLiveSel(null); setDraft(null); }}
            >
              <span className="db-list-icon">{meta.icon}</span> {o.name}
            </div>
          ))}
          {conn && loading && <div className="db-muted">⏳ Loading…</div>}
          {conn && liveNames.map((n) => (
            <div
              key={`live-${n}`}
              className={`db-obj-item${liveSel === n ? ' selected' : ''}`}
              onClick={() => { setLiveSel(n); setSelId(null); setDraft(null); }}
            >
              <span className="db-list-icon">{meta.icon}</span> {n}
              <span className="db-obj-badge">live</span>
            </div>
          ))}
          {objects.length === 0 && liveNames.length === 0 && !loading && (
            <div className="db-empty">No {meta.label.toLowerCase()}s yet — click “＋ New {meta.label}”.</div>
          )}
        </div>
        {error && <div className="db-note err">✖ {error}</div>}
      </div>

      <div className="db-pane db-editor">
        {liveSel && (
          <>
            <div className="db-pane-title">{meta.icon} {liveSel} <span className="db-obj-badge">live · read-only</span></div>
            <div className="db-muted">
              This {meta.label.toLowerCase()} lives in the connected database. Definition editing is not
              supported for live objects — create a local {meta.label.toLowerCase()} to design one here.
            </div>
          </>
        )}
        {!liveSel && editing && (
          <>
            <label className="db-field" style={{ maxWidth: 360 }}>
              <span>{meta.label} Name</span>
              <input className="db-input" value={editing.name} onChange={(e) => setDraft({ ...editing, name: e.target.value })} />
            </label>
            <div className="db-field db-grow" style={{ display: 'flex', flexDirection: 'column' }}>
              <span>SQL Definition</span>
              <textarea
                className="db-input db-sql-input"
                value={editing.sql}
                onChange={(e) => setDraft({ ...editing, sql: e.target.value })}
                spellCheck={false}
              />
            </div>
            <div className="db-actions">
              <button
                className="db-btn db-btn-outline"
                onClick={async () => {
                  if (await appConfirm(`Delete ${meta.label.toLowerCase()} "${editing.name}"?`)) {
                    deleteDbObject(meta.kind, editing.id);
                    setSelId(null);
                    setDraft(null);
                  }
                }}
              >
                🗑 Delete
              </button>
              <div style={{ flex: 1 }} />
              <button className="db-btn" onClick={() => setDraft(null)}>Cancel</button>
              <button
                className="db-btn db-btn-primary"
                disabled={!draft}
                onClick={() => { if (draft) { saveDbObject(meta.kind, draft); setDraft(null); } }}
              >
                Save {meta.label}
              </button>
            </div>
          </>
        )}
        {!liveSel && !editing && (
          <div className="db-empty">Select a {meta.label.toLowerCase()} on the left, or create a new one.</div>
        )}
      </div>
    </div>
  );
}
