import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Pencil, Plus } from 'lucide-react';
import DeleteButton from '@/components/DeleteButton';
import EditContentDialog from '@/components/content/EditContentDialog';
import { CONTENT_TYPES } from '@/components/content/contentConfig';

// Lists content with edit/delete. Pass userId for "my content"; omit for admin (all content).
export default function MyContentPanel({ userId }) {
  const [typeKey, setTypeKey] = useState(CONTENT_TYPES[0].key);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const type = CONTENT_TYPES.find((t) => t.key === typeKey);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const query = { ...(type.query || {}), ...(userId ? { created_by_id: userId } : {}) };
    const loadItems = async () => {
      try {
        const page = await base44.entities[type.key].filter(query, { sort: '-created_date', limit: 100 });
        let list = page.items || [];
        if (type.key === 'Opportunity') {
          const hidden = await base44.functions.invoke('listPendingOpportunities', {}).then((r) => r.data?.opportunities || []).catch(() => []);
          const ownHidden = userId ? hidden.filter((h) => h.created_by_id === userId) : hidden;
          list = [...ownHidden, ...list.filter((x) => !ownHidden.some((h) => h.id === x.id))];
        }
        if (!cancelled) setItems(list);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadItems();
    return () => { cancelled = true; };
  }, [typeKey, userId]);

  const title = (it) => (it[type.titleKey] || (type.fallbackKey && it[type.fallbackKey]) || 'Untitled').toString().slice(0, 80);

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="font-display text-lg font-bold">{userId ? 'My Content' : 'User Content'}</h2>
          {!userId && !['Comment', 'Review', 'Group'].includes(type.key) && (
            <button onClick={() => setEditing({ ...(type.query || {}) })} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {CONTENT_TYPES.map((t) => (
            <button key={t.key} onClick={() => setTypeKey(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 ${typeKey === t.key ? 'bg-brand-950 text-brand-300' : 'bg-muted text-muted-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {loading ? <div className="h-24 animate-pulse bg-muted/40" /> : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">Nothing here yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
              <p className="text-sm font-medium truncate min-w-0">{title(it)}</p>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => setEditing(it)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <DeleteButton onDelete={async () => { await base44.entities[type.key].delete(it.id); setItems((p) => p.filter((x) => x.id !== it.id)); }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <EditContentDialog type={type} item={editing} onClose={() => setEditing(null)}
          onSaved={(u) => { setItems((p) => (p.some((x) => x.id === u.id) ? p.map((x) => (x.id === u.id ? u : x)) : [u, ...p])); setEditing(null); }} />
      )}
    </div>
  );
}