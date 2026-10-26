import initSqlJs from 'sql.js';

const SQL = await initSqlJs();
const db = new SQL.Database();

const version = db.exec('SELECT sqlite_version() AS v')[0].values[0][0];

// The bridge creates tables from the Table Editor's SQL preview shape and lists them via sqlite_master.
db.run('CREATE TABLE "products" (id INTEGER PRIMARY KEY, name TEXT, price REAL)');
db.run('INSERT INTO "products" (name, price) VALUES (\'widget\', 9.5), (\'gizmo\', 2.25)');

const objects = db.exec("SELECT name, type FROM sqlite_master WHERE type IN ('table','view','trigger') AND name NOT LIKE 'sqlite_%' ORDER BY name");
const columns = db.exec('PRAGMA table_info("products")')[0].values;
const rows = db.exec('SELECT * FROM "products" LIMIT 200')[0];

const bytes = db.export();
db.close();

const reopened = new SQL.Database(new Uint8Array(bytes));
const r2 = reopened.exec('SELECT * FROM "products"')[0];
reopened.run('DROP TABLE "products"');
const afterDrop = reopened.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'products'");
reopened.close();

console.log(JSON.stringify({ version, objects: objects[0].values, columns, rows: { cols: rows.columns, values: rows.values }, afterReopen: { cols: r2.columns, values: r2.values }, afterDrop: afterDrop.length }, null, 2));
