import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { GraduationCap, Trash2, Mail, Phone, MapPin, Plus, Pencil } from 'lucide-react';
import EditContentDialog from '@/components/content/EditContentDialog';
import { WORKSHOP_TYPE } from '@/components/admin/adminFormTypes';

const STATUSES = ['new', 'contacted', 'scheduled', 'completed'];

export default function AdminWorkshopsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);

  const onSaved = (w) => {
    setItems((prev) => (prev.some((i) => i.id === w.id) ? prev.map((i) => (i.id === w.id ? w : i)) : [w, ...prev]));
    setEditing(null);
  };

  useEffect(() => {
    base44.entities.WorkshopInquiry.list('-created_date', 200).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const setStatus = async (id, status) => {
    await base44.entities.WorkshopInquiry.update(id, { status });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this workshop entry?')) return;
    await base44.entities.WorkshopInquiry.delete(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const shown = items.filter((i) => filter === 'all' || i.inquiry_type === filter);

  if (loading) return <div className="animate-pulse h-32 bg-card rounded-2xl border border-border" />;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold">Workshops ({shown.length})</h2>
          </div>
          <button onClick={() => setEditing({ inquiry_type: 'lead' })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
            <Plus className="w-4 h-4" /> New workshop
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[['all', 'All'], ['lead', 'Led by members'], ['participate', 'Sign-ups']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap font-medium ${filter === val ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 ? (
        <p className="text-center text-muted-foreground py-8 text-sm">No workshops yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {shown.map((i) => (
            <div key={i.id} className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold break-words">{i.title || (i.inquiry_type === 'lead' ? 'Workshop proposal' : 'Workshop sign-up')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{i.first_name} {i.last_name} · {i.inquiry_type === 'lead' ? 'Leader' : 'Participant'}</p>
                <p className="text-xs text-muted-foreground">{i.workshop_date || ''} {i.start_time || ''}</p>
                {(i.city || i.location) && (
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{i.city || i.location}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select value={i.status || 'new'} onChange={(e) => setStatus(i.id, e.target.value)}
                  className="text-xs bg-muted rounded-full px-3 py-2 font-medium outline-none capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <a href={`mailto:${i.email}`} aria-label="Email" className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Mail className="w-4 h-4" /></a>
                <a href={`tel:${i.phone}`} aria-label="Call" className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Phone className="w-4 h-4" /></a>
                <button onClick={() => setEditing(i)} aria-label="Edit" className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => remove(i.id)} aria-label="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <EditContentDialog type={WORKSHOP_TYPE} item={editing} title={editing.id ? 'Edit workshop' : 'New workshop'} onClose={() => setEditing(null)} onSaved={onSaved} />
      )}
    </div>
  );
}