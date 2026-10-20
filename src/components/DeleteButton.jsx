import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteButton({ onDelete, label = 'Delete', confirmText = 'Delete this? This cannot be undone.', className = '' }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!window.confirm(confirmText)) return;
    setBusy(true);
    try {
      await onDelete();
    } catch {
      alert('Could not delete. Please try again.');
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={handleClick} disabled={busy} className={`inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline disabled:opacity-50 ${className}`}>
      <Trash2 className="w-3.5 h-3.5" /> {busy ? 'Deleting…' : label}
    </button>
  );
}