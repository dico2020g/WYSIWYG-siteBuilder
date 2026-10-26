/**
 * Ambient typings for sql.js (the package ships no .d.ts). Only the members the
 * browser bridge uses are declared.
 */

declare module 'sql.js' {
  export interface QueryResult {
    columns: string[];
    values: any[][];
  }
  export class Database {
    constructor(data?: Uint8Array | null);
    exec(sql: string): QueryResult[];
    run(sql: string, params?: any): void;
    getRows(): any[];
    export(): Uint8Array;
    close(): void;
  }
  export interface SqlJsStatic {
    Database: typeof Database;
  }
  export interface InitSqlJsConfig {
    locateFile?: (filename: string) => string;
  }
  export default function initSqlJs(config?: InitSqlJsConfig): Promise<SqlJsStatic>;
}
