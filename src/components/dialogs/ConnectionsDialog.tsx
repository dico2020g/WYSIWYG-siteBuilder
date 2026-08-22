import { useEffect, useState } from 'react';
import type { DbConnection } from '../../model/types';
import { dbOf, useProjectStore } from '../../store/projectStore';
import { uid } from '../../model/factory';
import { appConfirm } from '../../actions/dialogs';

export const DB_DRIVERS: { id: DbConnection['driver']; label: string; port: string; icon: string }[] = [
  { id: 'mysql', label: 'MySQL', port: '3306', icon: '🐬' },
  { id: 'mariadb', label: 'MariaDB', port: '3306', icon: '🦭' },
  { id: 'postgresql', label: 'PostgreSQL', port: '5432', icon: '🐘' },
  { id: 'sqlserver', label: 'SQL Server', port: '1433', icon: '🟥' },
  { id: 'sqlite', label: 'SQLite', port: '', icon: '📄' },
];

type TestState =
  | { kind: 'idle' }
  | { kind: 'testing' }
  | { kind: 'ok'; version: string; counts?: string }
  | { kind: 'fail'; error: string };

function connToCfg(c: DbConnection) {
  return {
    driver: c.driver,
    host: c.host,
    port: c.port,
    database: c.database,
    username: c.username,
    password: c.password,
  };
}

/** Standalone Data Connections modal — no tab pages, just connection management. */
export default function ConnectionsDialog() {
  const open = useProjectStore((s) => s.connectionsOpen);
  const close = useProjectStore((s) => s.closeConnections);
  const connections = useProjectStore((s) => dbOf(s.project).connections);
  const selectedId = useProjectStore((s) => s.selectedConnectionId);
  const selectConnection = useProjectStore((s) => s.selectConnection);
  const saveConnection = useProjectStore((s) => s.saveConnection);
  const deleteConnection = useProjectStore((s) => s.deleteConnection);

  const selected = connections.find((c) => c.id === selectedId) ?? null;
  const [draft, setDraft] = useState<DbConnection | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [test, setTest] = useState<TestState>({ kind: 'idle' });
  const [search, setSearch] = useState('');

  // The dialog component stays mounted while closed — drop any unsaved draft
  // whenever it opens so the form always reflects the saved configuration.
  useEffect(() => {
    if (open) {
      setDraft(null);
      setTest({ kind: 'idle' });
    }
  }, [open]);

  if (!open) return null;

  const editing = draft ?? selected;
  const edit = (patch: Partial<DbConnection>) => {
    if (!editing) return;
    setDraft({ ...(draft ?? selected!), ...patch });
    setTest({ kind: 'idle' });
  };

  const newConnection = () => {
    const conn: DbConnection = {
      id: uid('dbc'),
      name: 'New Connection',
      driver: 'mysql',
      host: 'localhost',
      port: '3306',
      database: '',
      username: 'root',
      password: '',
    };
    saveConnection(conn);
    setDraft(conn);
    setTest({ kind: 'idle' });
  };

  const runTest = async () => {
    if (!editing) return;
    const api = window.sitebuilder;
    if (!api?.dbTest) {
      setTest({ kind: 'fail', error: 'Database testing is only available inside the desktop app.' });
      return;
    }
    setTest({ kind: 'testing' });
    const res = await api.dbTest(connToCfg(editing));
    if (!res.ok) {
      setTest({ kind: 'fail', error: res.error || 'Connection failed.' });
      return;
    }
    // Connected — also list objects so the user sees what the database holds.
    let counts: string | undefined;
    const objs = await api.dbListObjects(connToCfg(editing));
    if (objs.ok) {
      counts = `${objs.tables?.length ?? 0} tables · ${objs.views?.length ?? 0} views · ${objs.procedures?.length ?? 0} procedures · ${objs.functions?.length ?? 0} functions · ${objs.triggers?.length ?? 0} triggers`;
    }
    setTest({ kind: 'ok', version: res.version || 'Connected', counts });
  };

  const filtered = connections.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const sqlite = editing?.driver === 'sqlite';

  return (
    <div className="dlg-overlay db-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="db-modal">
        <div className="db-header">
          <div className="db-header-title">🗄 Data Connections</div>
          <div style={{ flex: 1 }} />
          <button className="db-close" onClick={close} title="Close">✕</button>
        </div>
        <div className="db-body">
          <div className="db-page db-split">
            <div className="db-pane db-pane-left">
              <div className="db-pane-title">Connections</div>
              <div className="db-toolbar">
                <input className="db-input" placeholder="Search connections…" value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="db-icon-btn" title="New Connection" onClick={newConnection}>＋</button>
              </div>
              <div className="db-list">
                {filtered.map((c) => {
                  const d = DB_DRIVERS.find((x) => x.id === c.driver);
                  return (
                    <div
                      key={c.id}
                      className={`db-list-item${c.id === selectedId ? ' selected' : ''}`}
                      onClick={() => { setDraft(null); setTest({ kind: 'idle' }); selectConnection(c.id); }}
                    >
                      <span className="db-list-icon">{d?.icon ?? '🗄'}</span>
                      <div>
                        <div className="db-list-name">{c.name}</div>
                        <div className="db-list-sub">{c.driver === 'sqlite' ? c.database : `${c.host}:${c.port}`}</div>
                      </div>
                      <button
                        className="db-item-menu"
                        title="Delete"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (await appConfirm(`Delete connection "${c.name}"?`)) {
                            deleteConnection(c.id);
                            if (draft?.id === c.id) setDraft(null);
                            setTest({ kind: 'idle' });
                          }
                        }}
                      >⋮</button>
                    </div>
                  );
                })}
                {filtered.length === 0 && <div className="db-empty">No connections yet.</div>}
              </div>
              <button className="db-link-btn" onClick={newConnection}>＋ New Connection</button>
            </div>

            <div className="db-pane db-pane-right">
              <div className="db-pane-title-row">
                <div className="db-pane-title">Connection Details</div>
                <button className="db-btn db-btn-outline" disabled={!editing || test.kind === 'testing'} onClick={() => void runTest()}>
                  {test.kind === 'testing' ? '⏳ Testing…' : '⚡ Test Connection'}
                </button>
              </div>
              {!editing && <div className="db-empty">Select a connection on the left, or create a new one.</div>}
              {editing && (
                <div className="db-form">
                  <div className="db-row">
                    <label className="db-field">
                      <span>Connection Name</span>
                      <input className="db-input" value={editing.name} onChange={(e) => edit({ name: e.target.value })} />
                    </label>
                    <label className="db-field">
                      <span>Driver</span>
                      <select className="db-input" value={editing.driver} onChange={(e) => {
                        const d = DB_DRIVERS.find((x) => x.id === e.target.value);
                        edit({ driver: e.target.value as DbConnection['driver'], port: d?.port ?? '' });
                      }}>
                        {DB_DRIVERS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="db-row">
                    <label className="db-field db-grow">
                      <span>{sqlite ? 'Database File' : 'Host'}</span>
                      {sqlite ? (
                        <input className="db-input" value={editing.database} placeholder="C:\\data\\mydb.sqlite" onChange={(e) => edit({ database: e.target.value })} />
                      ) : (
                        <input className="db-input" value={editing.host} onChange={(e) => edit({ host: e.target.value })} />
                      )}
                    </label>
                    {!sqlite && (
                      <label className="db-field" style={{ maxWidth: 120 }}>
                        <span>Port</span>
                        <input className="db-input" value={editing.port} onChange={(e) => edit({ port: e.target.value })} />
                      </label>
                    )}
                  </div>
                  {!sqlite && (
                    <label className="db-field">
                      <span>Database</span>
                      <input className="db-input" value={editing.database} placeholder="my_website_db" onChange={(e) => edit({ database: e.target.value })} />
                    </label>
                  )}
                  {!sqlite && (
                    <div className="db-row">
                      <label className="db-field">
                        <span>Username</span>
                        <input className="db-input" value={editing.username} onChange={(e) => edit({ username: e.target.value })} />
                      </label>
                      <label className="db-field">
                        <span>Password</span>
                        <span className="db-pw">
                          <input className="db-input" type={showPw ? 'text' : 'password'} value={editing.password} onChange={(e) => edit({ password: e.target.value })} />
                          <button className="db-icon-btn" onClick={() => setShowPw(!showPw)}>{showPw ? '🙈' : '👁'}</button>
                        </span>
                      </label>
                    </div>
                  )}
                  {test.kind === 'ok' && (
                    <div className="db-note ok">
                      ✔ Connected successfully — {test.version}
                      {test.counts && <div style={{ marginTop: 4 }}>{test.counts}</div>}
                    </div>
                  )}
                  {test.kind === 'fail' && <div className="db-note err">✖ {test.error}</div>}
                  <div className="db-actions">
                    <button className="db-btn" onClick={() => { setDraft(null); setTest({ kind: 'idle' }); close(); }}>Cancel</button>
                    <button className="db-btn db-btn-primary" onClick={() => { if (draft) { saveConnection(draft); setDraft(null); } close(); }}>Save Connection</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
