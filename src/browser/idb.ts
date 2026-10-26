/**
 * Minimal IndexedDB key/value store shared by the browser bridge.
 * - `handles`  : persist FileSystemFileHandle objects so "Save" can write back
 *              to the same file across reloads (handles are structured-cloneable).
 * - `dbs`      : persist the bytes of in-browser SQLite (.sqlite) databases,
 *              keyed by the connection's "database" field.
 */

const DB_NAME = 'sitebuilder';
const HANDLES_STORE = 'handles';
const DBS_STORE = 'dbs';

function openDB(store: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(HANDLES_STORE)) db.createObjectStore(HANDLES_STORE);
      if (!db.objectStoreNames.contains(DBS_STORE)) db.createObjectStore(DBS_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    void store; // both stores are created together; the argument is only for symmetry
  });
}

function txResult(req: IDBRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Returns true if IndexedDB is available in this environment. */
export function idbAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

export async function idbGet(store: 'handles' | 'dbs', key: string): Promise<any> {
  const db = await openDB(store);
  const tx = db.transaction(store, 'readonly');
  const value = await txResult(tx.objectStore(store).get(key));
  db.close();
  return value;
}

export async function idbSet(store: 'handles' | 'dbs', key: string, value: any): Promise<void> {
  const db = await openDB(store);
  const tx = db.transaction(store, 'readwrite');
  await txResult(tx.objectStore(store).put(value, key));
  db.close();
}

export async function idbDelete(store: 'handles' | 'dbs', key: string): Promise<void> {
  const db = await openDB(store);
  const tx = db.transaction(store, 'readwrite');
  await txResult(tx.objectStore(store).delete(key));
  db.close();
}

export async function idbKeys(store: 'handles' | 'dbs'): Promise<string[]> {
  const db = await openDB(store);
  const tx = db.transaction(store, 'readonly');
  const keys = await txResult(tx.objectStore(store).getAllKeys());
  db.close();
  return keys as string[];
}
