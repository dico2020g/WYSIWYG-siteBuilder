import { useEffect, useState } from 'react';
import { DialogShell } from './BreakpointDialogs';
import { useProjectStore } from '../../store/projectStore';

export default function NewPageDialog() {
  const open = useProjectStore((s) => s.newPageDialogOpen);
  const close = useProjectStore((s) => s.closeNewPageDialog);
  const addPage = useProjectStore((s) => s.addPage);
  const templates = useProjectStore((s) => s.project.templates ?? []);
  const [templateId, setTemplateId] = useState('');

  useEffect(() => {
    if (open) setTemplateId('');
  }, [open]);

  if (!open) return null;

  const create = () => {
    addPage(templateId || null);
    setTemplateId('');
    close();
  };

  return (
    <DialogShell title="New Page" onClose={close} width={360}>
      <div className="dlg-field">
        <label htmlFor="new-page-template">Page template:</label>
        <div className="dlg-field-row">
          <select
            id="new-page-template"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            autoFocus
          >
            <option value="">None</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="dlg-actions">
        <button className="dlg-btn-primary" onClick={create}>OK</button>
        <button onClick={close}>Cancel</button>
      </div>
    </DialogShell>
  );
}
