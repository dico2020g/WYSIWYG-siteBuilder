import { useEffect, useState, useSyncExternalStore } from 'react';
import { getPromptRequest, resolvePrompt, subscribePrompt } from '../../actions/promptDialog';
import { DialogShell } from './BreakpointDialogs';

/** Modal input dialog backing appPrompt() — window.prompt() hangs the Electron renderer. */
export default function AppPrompt() {
  const req = useSyncExternalStore(subscribePrompt, getPromptRequest);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (req) setValue(req.def);
  }, [req]);

  if (!req) return null;
  const close = (v: string | null) => resolvePrompt(v);

  return (
    <DialogShell title={req.message} onClose={() => close(null)} width={380}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          close(value);
        }}
      >
        <input
          className="db-input"
          style={{ width: '100%', boxSizing: 'border-box' }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div className="db-actions" style={{ marginTop: 14 }}>
          <button type="button" className="db-btn" onClick={() => close(null)}>Cancel</button>
          <button type="submit" className="db-btn db-btn-primary">OK</button>
        </div>
      </form>
    </DialogShell>
  );
}
