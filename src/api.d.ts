interface SiteBuilderApi {
  saveProjectAs(json: string, suggestedName?: string): Promise<string | null>;
  saveProject(filePath: string, json: string): Promise<string>;
  openProject(): Promise<{ filePath: string; json: string } | null>;
  exportSite(files: { name: string; content: string }[]): Promise<string | null>;
  previewSite(files: { name: string; content: string }[], entryName?: string): Promise<string>;
}

interface Window {
  sitebuilder?: SiteBuilderApi;
}
