/**
 * Database connectivity for the designer. Runs in the Electron main process
 * (Node) so real TCP connections to MySQL/MariaDB/PostgreSQL/SQL Server and
 * local SQLite files are possible. Drivers are lazy-required so the app still
 * starts when a package is missing.
 *
 * Each handler returns a plain object (IPC-serializable):
 *   test:        { ok, version?, latencyMs?, error? }
 *   listObjects: { ok, tables?, views?, procedures?, functions?, triggers?, error? }
 */
const fs = require('fs');

const CONNECT_TIMEOUT_MS = 6000;

function err(e) {
  const msg = (e && (e.message || String(e))) || 'Unknown error';
  return msg.replace(/\s+/g, ' ').slice(0, 300);
}

/* ------------------------------------------------------------- mysql/mariadb */
async function withMysql(cfg, fn) {
  const mysql = require('mysql2/promise');
  const conn = await mysql.createConnection({
    host: cfg.host || 'localhost',
    port: Number(cfg.port) || 3306,
    user: cfg.username,
    password: cfg.password,
    database: cfg.database || undefined,
    connectTimeout: CONNECT_TIMEOUT_MS,
  });
  try {
    return await fn(conn);
  } finally {
    await conn.end().catch(() => {});
  }
}

async function mysqlObjects(conn, cfg) {
  const db = cfg.database;
  const [tables] = await conn.query(
    `SELECT TABLE_NAME AS name, ENGINE AS engine, TABLE_ROWS AS \`rows\`, DATA_LENGTH AS size
     FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME`,
    [db]
  );
  const [views] = await conn.query(
    `SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'VIEW' ORDER BY TABLE_NAME`,
    [db]
  );
  const [routines] = await conn.query(
    `SELECT ROUTINE_NAME AS name, ROUTINE_TYPE AS kind FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = ? ORDER BY ROUTINE_NAME`,
    [db]
  );
  const [triggers] = await conn.query(
    `SELECT TRIGGER_NAME AS name FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = ? ORDER BY TRIGGER_NAME`,
    [db]
  );
  return {
    tables: tables.map((t) => ({ name: t.name, engine: t.engine || '', rows: t.rows ?? 0, size: t.size ?? 0 })),
    views: views.map((v) => v.name),
    procedures: routines.filter((r) => r.kind === 'PROCEDURE').map((r) => r.name),
    functions: routines.filter((r) => r.kind === 'FUNCTION').map((r) => r.name),
    triggers: triggers.map((t) => t.name),
  };
}

/* --------------------------------------------------------------- postgresql */
async function withPg(cfg, fn) {
  const { Client } = require('pg');
  const client = new Client({
    host: cfg.host || 'localhost',
    port: Number(cfg.port) || 5432,
    user: cfg.username,
    password: cfg.password,
    database: cfg.database || 'postgres',
    connectionTimeoutMillis: CONNECT_TIMEOUT_MS,
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end().catch(() => {});
  }
}

async function pgObjects(client) {
  const tables = await client.query(
    `SELECT table_name AS name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`
  );
  const views = await client.query(
    `SELECT table_name AS name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'VIEW' ORDER BY table_name`
  );
  const procs = await client.query(
    `SELECT p.proname AS name, p.prokind AS kind FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace WHERE n.nspname = 'public' AND p.prokind IN ('f','p') ORDER BY p.proname`
  );
  const triggers = await client.query(
    `SELECT tgname AS name FROM pg_trigger WHERE NOT tgisinternal ORDER BY tgname`
  );
  return {
    tables: tables.rows.map((t) => ({ name: t.name, engine: '', rows: 0, size: 0 })),
    views: views.rows.map((v) => v.name),
    procedures: procs.rows.filter((r) => r.kind === 'p').map((r) => r.name),
    functions: procs.rows.filter((r) => r.kind === 'f').map((r) => r.name),
    triggers: triggers.rows.map((t) => t.name),
  };
}

/* --------------------------------------------------------------- sql server */
async function withMssql(cfg, fn) {
  const mssql = require('mssql');
  const server = String(cfg.host || 'localhost').replace(/\\\\/g, '\\');
  const pool = new mssql.ConnectionPool({
    server,
    port: Number(cfg.port) || undefined, // named instances resolve by name
    user: cfg.username,
    password: cfg.password,
    database: cfg.database || undefined,
    options: { trustServerCertificate: true, encrypt: false },
    connectionTimeout: CONNECT_TIMEOUT_MS,
    requestTimeout: CONNECT_TIMEOUT_MS,
  });
  await pool.connect();
  try {
    return await fn(pool);
  } finally {
    await pool.close().catch(() => {});
  }
}

async function mssqlObjects(pool) {
  const r = await pool.query(`
    SELECT o.name AS name, o.type AS type
    FROM sys.objects o
    WHERE o.type IN ('U','V','P','FN','IF','TF','TR') AND o.is_ms_shipped = 0
    ORDER BY o.name`);
  const rows = r.recordset || [];
  const names = (types) => rows.filter((x) => types.includes(x.type)).map((x) => x.name);
  return {
    tables: names(['U']).map((n) => ({ name: n, engine: '', rows: 0, size: 0 })),
    views: names(['V']),
    procedures: names(['P']),
    functions: names(['FN', 'IF', 'TF']),
    triggers: names(['TR']),
  };
}

/* -------------------------------------------------------------------- sqlite */
function withSqlite(cfg, fn) {
  const initSqlJs = require('sql.js');
  const file = cfg.database;
  if (!file) throw new Error('Set the Database field to the .sqlite file path.');
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
  return initSqlJs().then((SQL) => {
    const db = new SQL.Database(fs.readFileSync(file));
    try {
      return fn(db);
    } finally {
      db.close();
    }
  });
}

function sqliteObjects(db) {
  const rows = db.exec(
    `SELECT name, type FROM sqlite_master WHERE type IN ('table','view','trigger') AND name NOT LIKE 'sqlite_%' ORDER BY name`
  );
  const vals = rows.length ? rows[0].values : [];
  const pick = (t) => vals.filter((v) => v[1] === t).map((v) => v[0]);
  return {
    tables: pick('table').map((n) => ({ name: n, engine: 'SQLite', rows: 0, size: 0 })),
    views: pick('view'),
    procedures: [],
    functions: [],
    triggers: pick('trigger'),
  };
}

/* --------------------------------------------------------------- public API */

async function dispatch(cfg, testFn, objectsFn) {
  const t0 = Date.now();
  switch (cfg.driver) {
    case 'mysql':
    case 'mariadb':
      return withMysql(cfg, async (conn) => {
        const version = testFn ? (await conn.query('SELECT VERSION() AS v'))[0][0].v : undefined;
        const objects = objectsFn ? await mysqlObjects(conn, cfg) : undefined;
        return { version, objects };
      });
    case 'postgresql':
      return withPg(cfg, async (client) => {
        const version = testFn ? (await client.query('SELECT version() AS v')).rows[0].v : undefined;
        const objects = objectsFn ? await pgObjects(client) : undefined;
        return { version, objects };
      });
    case 'sqlserver':
      return withMssql(cfg, async (pool) => {
        const version = testFn ? (await pool.query('SELECT @@VERSION AS v')).recordset[0].v : undefined;
        const objects = objectsFn ? await mssqlObjects(pool) : undefined;
        return { version, objects };
      });
    case 'sqlite':
      return withSqlite(cfg, (db) => {
        const version = testFn ? `SQLite ${db.exec('SELECT sqlite_version() AS v')[0].values[0][0]}` : undefined;
        const objects = objectsFn ? sqliteObjects(db) : undefined;
        return { version, objects };
      });
    default:
      throw new Error(`Unknown driver: ${cfg.driver}`);
  }
}

async function testConnection(cfg) {
  try {
    const { version } = await dispatch(cfg, true, false);
    return { ok: true, version: String(version || '').split('\n')[0].slice(0, 120) };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

async function listObjects(cfg) {
  try {
    const { objects } = await dispatch(cfg, false, true);
    return { ok: true, ...objects };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

function friendlyError(e, cfg) {
  const msg = err(e);
  if (/npm|Cannot find module/i.test(msg)) {
    return `Driver for ${cfg.driver} is not installed. Run: npm install ${cfg.driver === 'sqlserver' ? 'mssql' : cfg.driver === 'postgresql' ? 'pg' : cfg.driver === 'sqlite' ? 'sql.js' : 'mysql2'}`;
  }
  if (/ECONNREFUSED/.test(msg)) return `Connection refused — is the server running at ${cfg.host}:${cfg.port}?`;
  if (/ETIMEDOUT|timed? ?out/i.test(msg)) return 'Connection timed out. Check host/port and firewall.';
  if (/Access denied|password|authentication|login failed/i.test(msg)) return 'Authentication failed — check username and password.';
  if (/Unknown database|does not exist/i.test(msg)) return `Database "${cfg.database}" does not exist on the server.`;
  return msg;
}

/* ---------------------------------------------------- browsing (Data Source) */

/** Quote an identifier per driver; rejects names containing the quote char. */
function quoteIdent(driver, name) {
  const q = driver === 'mysql' || driver === 'mariadb' ? '`' : '"';
  if (String(name).includes(q)) throw new Error(`Invalid identifier: ${name}`);
  return q + name + q;
}

async function listDatabases(cfg) {
  try {
    let names = [];
    if (cfg.driver === 'mysql' || cfg.driver === 'mariadb') {
      await withMysql({ ...cfg, database: '' }, async (conn) => {
        const [rows] = await conn.query('SHOW DATABASES');
        names = rows.map((r) => Object.values(r)[0]).filter((n) => !['information_schema', 'mysql', 'performance_schema', 'sys'].includes(n));
      });
    } else if (cfg.driver === 'postgresql') {
      await withPg(cfg, async (client) => {
        const r = await client.query('SELECT datname FROM pg_database WHERE NOT datistemplate ORDER BY datname');
        names = r.rows.map((x) => x.datname);
      });
    } else if (cfg.driver === 'sqlserver') {
      await withMssql(cfg, async (pool) => {
        const r = await pool.query('SELECT name FROM sys.databases WHERE database_id > 4 ORDER BY name');
        names = r.recordset.map((x) => x.name);
      });
    } else if (cfg.driver === 'sqlite') {
      names = [require('path').basename(cfg.database || 'database')];
    }
    return { ok: true, databases: names };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

/** Column metadata for one table: [{ name, type, nullable, pk, defaultValue }] */
async function listColumns(cfg, table) {
  try {
    let columns = [];
    if (cfg.driver === 'mysql' || cfg.driver === 'mariadb') {
      await withMysql(cfg, async (conn) => {
        const [rows] = await conn.query(
          `SELECT COLUMN_NAME AS name, COLUMN_TYPE AS type, IS_NULLABLE AS nullable, COLUMN_KEY AS keyy, COLUMN_DEFAULT AS dflt
           FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION`,
          [cfg.database, table]
        );
        columns = rows.map((r) => ({ name: r.name, type: r.type, nullable: r.nullable === 'YES', pk: r.keyy === 'PRI', defaultValue: r.dflt ?? '' }));
      });
    } else if (cfg.driver === 'postgresql') {
      await withPg(cfg, async (client) => {
        const r = await client.query(
          `SELECT c.column_name AS name, c.data_type AS type, c.is_nullable AS nullable, c.column_default AS dflt,
                  EXISTS (SELECT 1 FROM information_schema.table_constraints tc
                          JOIN information_schema.key_column_usage k ON k.constraint_name = tc.constraint_name AND k.table_schema = tc.table_schema
                          WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_name = c.table_name AND k.column_name = c.column_name AND tc.table_schema = c.table_schema) AS pk
           FROM information_schema.columns c WHERE c.table_schema = 'public' AND c.table_name = $1 ORDER BY c.ordinal_position`,
          [table]
        );
        columns = r.rows.map((x) => ({ name: x.name, type: x.type, nullable: x.nullable === 'YES', pk: !!x.pk, defaultValue: x.dflt ?? '' }));
      });
    } else if (cfg.driver === 'sqlserver') {
      await withMssql(cfg, async (pool) => {
        const r = await pool.query(
          `SELECT c.name AS name, t.name AS type, c.is_nullable AS nullable,
                  CASE WHEN pk.column_id IS NULL THEN 0 ELSE 1 END AS pk, OBJECT_DEFINITION(c.default_object_id) AS dflt
           FROM sys.columns c
           JOIN sys.types t ON t.user_type_id = c.user_type_id
           LEFT JOIN (SELECT ic.object_id, ic.column_id FROM sys.indexes i
                      JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
                      WHERE i.is_primary_key = 1) pk ON pk.object_id = c.object_id AND pk.column_id = c.column_id
           WHERE c.object_id = OBJECT_ID(${sqlStr(table)}) ORDER BY c.column_id`
        );
        columns = r.recordset.map((x) => ({ name: x.name, type: x.type, nullable: !!x.nullable, pk: !!x.pk, defaultValue: x.dflt ?? '' }));
      });
    } else if (cfg.driver === 'sqlite') {
      await withSqlite(cfg, (db) => {
        const res = db.exec(`PRAGMA table_info(${quoteIdent('sqlite', table)})`);
        columns = (res.length ? res[0].values : []).map((v) => ({
          name: v[1], type: v[2] || '', nullable: !v[3], pk: !!v[5], defaultValue: v[4] ?? '',
        }));
      });
    }
    return { ok: true, columns };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

/** First N rows of a table: { columns: string[], rows: any[][] } */
async function fetchRows(cfg, table, limit = 200) {
  const lim = Math.max(1, Math.min(500, Number(limit) || 200));
  try {
    let out = { columns: [], rows: [] };
    if (cfg.driver === 'mysql' || cfg.driver === 'mariadb') {
      await withMysql(cfg, async (conn) => {
        const [rows, fields] = await conn.query(`SELECT * FROM ${quoteIdent(cfg.driver, table)} LIMIT ${lim}`);
        out = { columns: fields.map((f) => f.name), rows: rows.map((r) => fields.map((f) => r[f.name])) };
      });
    } else if (cfg.driver === 'postgresql') {
      await withPg(cfg, async (client) => {
        const r = await client.query(`SELECT * FROM ${quoteIdent('postgresql', table)} LIMIT ${lim}`);
        out = { columns: r.fields.map((f) => f.name), rows: r.rows.map((row) => r.fields.map((f) => row[f.name])) };
      });
    } else if (cfg.driver === 'sqlserver') {
      await withMssql(cfg, async (pool) => {
        const r = await pool.query(`SELECT TOP ${lim} * FROM ${quoteIdent('sqlserver', table)}`);
        const cols = r.recordset.columns ? Object.keys(r.recordset.columns) : (r.recordset[0] ? Object.keys(r.recordset[0]) : []);
        out = { columns: cols, rows: r.recordset.map((row) => cols.map((c) => row[c])) };
      });
    } else if (cfg.driver === 'sqlite') {
      await withSqlite(cfg, (db) => {
        const res = db.exec(`SELECT * FROM ${quoteIdent('sqlite', table)} LIMIT ${lim}`);
        if (res.length) out = { columns: res[0].columns, rows: res[0].values };
      });
    }
    return { ok: true, ...out };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

async function dropTable(cfg, table) {
  try {
    const sql = `DROP TABLE ${quoteIdent(cfg.driver, table)}`;
    if (cfg.driver === 'mysql' || cfg.driver === 'mariadb') await withMysql(cfg, (c) => c.query(sql));
    else if (cfg.driver === 'postgresql') await withPg(cfg, (c) => c.query(sql));
    else if (cfg.driver === 'sqlserver') await withMssql(cfg, (p) => p.query(sql));
    else if (cfg.driver === 'sqlite') await withSqlite(cfg, (db) => db.run(sql));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError(e, cfg) };
  }
}

module.exports = { testConnection, listObjects, listDatabases, listColumns, fetchRows, dropTable };
