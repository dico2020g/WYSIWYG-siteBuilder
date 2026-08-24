interface DbConfigPayload {
  driver: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface DbTestResult {
  ok: boolean;
  version?: string;
  error?: string;
}

interface DbObjectsResult {
  ok: boolean;
  tables?: { name: string; engine: string; rows: number; size: number }[];
  views?: string[];
  procedures?: string[];
  functions?: string[];
  triggers?: string[];
  error?: string;
}

interface SiteBuilderApi {
  saveProjectAs(json: string, suggestedName?: string): Promise<string | null>;
  saveProject(filePath: string, json: string): Promise<string>;
  openProject(): Promise<{ filePath: string; json: string } | null>;
  pickImage(): Promise<{ name: string; dataUrl: string } | null>;
  exportSite(files: { name: string; content: string }[]): Promise<string | null>;
  previewSite(files: { name: string; content: string }[], entryName?: string): Promise<string>;
  dbTest(cfg: DbConfigPayload): Promise<DbTestResult>;
  dbListObjects(cfg: DbConfigPayload): Promise<DbObjectsResult>;
  dbListDatabases(cfg: DbConfigPayload): Promise<{ ok: boolean; databases?: string[]; error?: string }>;
  dbListColumns(cfg: DbConfigPayload, table: string): Promise<{ ok: boolean; columns?: { name: string; type: string; nullable: boolean; pk: boolean; defaultValue: string }[]; error?: string }>;
  dbFetchRows(cfg: DbConfigPayload, table: string, limit?: number): Promise<{ ok: boolean; columns?: string[]; rows?: any[][]; error?: string }>;
  dbDropTable(cfg: DbConfigPayload, table: string): Promise<{ ok: boolean; error?: string }>;
  appConfirm(message: string): Promise<boolean>;
  appAlert(message: string): Promise<void>;
}

interface Window {
  sitebuilder?: SiteBuilderApi;
}
