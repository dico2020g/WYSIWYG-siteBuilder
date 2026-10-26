/**
 * In-browser SQLite engine for the Data Connections UI, backed by sql.js.
 *
 * The desktop app opened raw TCP connections to MySQL / PostgreSQL / SQL
 * Server from Node. A website cannot open sockets, so in the browser the
 * SQLite driver becomes fully functional: each connection's database lives as
 * a SQLite file in IndexedDB, real SQL runs offline, and the existing
 * SQLite code paths in the dialogs work unchanged. Server drivers report a
 * clear, friendly message pointing the user to SQLite.
 */

import initSqlJs from 'sql.js';
import type { Database, QueryResult } from 'sql.js';
import { idbGet, idbSet, idbAvailable } from './idb';

interface DbConfigPayload {
  driver: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

const SERVER_DRIVER_MSG =
  'In the browser, only in-browser SQLite databases work. The server drivers (MySQL / MariaDB / PostgreSQL / SQL Server) need a hosted web API — pick the SQLite driver to create and query a database that lives in this browser.';

// sql.js ships a browser build; its WASM is emitted as a Vite asset next to the bundle.
const wasmUrl = new URL('sql.js/dist/sql-wasm-browser.wasm', import.meta.url).href;

let sqlReady: Promise<any> | null = null;

function initSql(): Promise<any> {
  if (!sqlReady) sqlReady = initSqlJs({ locateFile: () => wasmUrl });
  return sqlReady;
}

/** Store key for a SQLite connection: the "Database File" field, sanitized. */
function storeKey(cfg: DbConfigPayload): string {
  const raw = String(cfg.database ?? '').trim();
  if (!raw) return 'default.sqlite';
  return raw.replace(/[\\/:*?"<>|]/g, '_');
}

interface Opened {
  db: Database;
  persist: () => Promise<void>;
}

async function openDatabase(cfg: DbConfigPayload, mutate: boolean): Promise<Opened> {
  const SQL = await initSql();
  const key = storeKey(cfg);
  let db: Database;
  if (idbAvailable()) {
    const bytes = await idbGet('dbs', key);
    db = bytes ? new SQL.Database(new Uint8Array(bytes)) : new SQL.Database();
  } else {
    db = new SQL.Database();
  }
  const persist = async () => {
    if (!idbAvailable()) return;
    await idbSet('dbs', key, db.export());
  };
  void mutate; // mutate flag kept for symmetry; persist is called by the caller when needed
  return { db, persist };
}

function quoteIdent(name: string): string {
  if (String(name).includes('"')) throw new Error(`Invalid identifier: ${name}`);
  return `"${name}"`;
}

function firstResult(res: QueryResult[]): { columns: string[]; values: any[][] } {
  if (!res.length) return { columns: [], values: [] };
  return { columns: res[0].columns, values: res[0].values };
}

/* --------------------------------------------------------------- public API */

export async function dbTest(cfg: DbConfigPayload): Promise<{ ok: boolean; version?: string; error?: string }> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  try {
    const { db, persist } = await openDatabase(cfg, true);
    const version = db.exec('SELECT sqlite_version() AS v')[0].values[0][0];
    await persist(); // materialize the file on first use
    db.close();
    return { ok: true, version: `SQLite ${version}` };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 300) };
  }
}

export async function dbListObjects(cfg: DbConfigPayload): Promise<{
  ok: boolean;
  tables?: { name: string; engine: string; rows: number; size: number }[];
  views?: string[];
  procedures?: string[];
  functions?: string[];
  triggers?: string[];
  error?: string;
}> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  try {
    const { db } = await openDatabase(cfg, false);
    const res = db.exec(
      "SELECT name, type FROM sqlite_master WHERE type IN ('table','view','trigger') AND name NOT LIKE 'sqlite_%' ORDER BY name"
    );
    const vals = res.length ? res[0].values : [];
    const pick = (t: string) => vals.filter((v) => v[1] === t).map((v) => v[0]);
    db.close();
    return {
      ok: true,
      tables: pick('table').map((n) => ({ name: n, engine: 'SQLite', rows: 0, size: 0 })),
      views: pick('view'),
      procedures: [],
      functions: [],
      triggers: pick('trigger'),
    };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 300) };
  }
}

export async function dbListDatabases(cfg: DbConfigPayload): Promise<{ ok: boolean; databases?: string[]; error?: string }> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  // A browser SQLite connection is a single file/database.
  return { ok: true, databases: [storeKey(cfg)] };
}

export async function dbListColumns(
  cfg: DbConfigPayload,
  table: string
): Promise<{ ok: boolean; columns?: { name: string; type: string; nullable: boolean; pk: boolean; defaultValue: string }[]; error?: string }> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  try {
    const { db } = await openDatabase(cfg, false);
    const res = db.exec(`PRAGMA table_info(${quoteIdent(table)})`);
    const columns = (res.length ? res[0].values : []).map((v) => ({
      name: v[1],
      type: v[2] || '',
      nullable: !v[3],
      pk: !!v[5],
      defaultValue: v[4] ?? '',
    }));
    db.close();
    return { ok: true, columns };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 300) };
  }
}

export async function dbFetchRows(
  cfg: DbConfigPayload,
  table: string,
  limit = 200
): Promise<{ ok: boolean; columns?: string[]; rows?: any[][]; error?: string }> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  const lim = Math.max(1, Math.min(500, Number(limit) || 200));
  try {
    const { db } = await openDatabase(cfg, false);
    const res = db.exec(`SELECT * FROM ${quoteIdent(table)} LIMIT ${lim}`);
    const { columns, values } = firstResult(res);
    db.close();
    return { ok: true, columns, rows: values };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 300) };
  }
}

export async function dbDropTable(cfg: DbConfigPayload, table: string): Promise<{ ok: boolean; error?: string }> {
  if (cfg.driver !== 'sqlite') return { ok: false, error: SERVER_DRIVER_MSG };
  try {
    const { db, persist } = await openDatabase(cfg, true);
    db.run(`DROP TABLE ${quoteIdent(table)}`);
    await persist();
    db.close();
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e).slice(0, 300) };
  }
}
