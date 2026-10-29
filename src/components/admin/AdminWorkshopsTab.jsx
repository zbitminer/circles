import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { GraduationCap, Plus } from 'lucide-react';
import EditContentDialog from '@/components/content/EditContentDialog';
import { WORKSHOP_TYPE } from '@/components/admin/adminFormTypes';
import ContentReorderList from '@/components/admin/ContentReorderList';
import AdminWorkshopRow from '@/components/admin/AdminWorkshopRow';
import useOrderedWorkshops from '@/components/workshops/useOrderedWorkshops';

export default function AdminWorkshopsTab() {
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const { items, total, loading, error, setItems, refresh, hasMore, loadingMore, loadMore } = useOrderedWorkshops(filter, 'admin-workshop-order');
  const setStatus = async (id, status) => { await base44.entities.WorkshopInquiry.update(id, { status }); await refresh(); };
  const remove = async id => {
    if (!window.confirm('Delete this workshop entry?')) return;
    await base44.entities.WorkshopInquiry.delete(id);
    await refresh();
  };
  return <div className="overflow-hidden rounded-2xl border border-border bg-card">
    <div className="space-y-3 border-b border-border px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-bold">Workshops ({total ?? '…'})</h2></div>
        <button onClick={() => setEditing({ inquiry_type: 'lead' })} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground"><Plus className="h-4 w-4" />New workshop</button>
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {[['all', 'All'], ['lead', 'Led by members'], ['participate', 'Sign-ups']].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-11 whitespace-nowrap rounded-full px-3 text-xs font-medium ${filter === value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{label}</button>)}
      </div>
      <p className="text-xs text-muted-foreground">Reorder workshops below to update their display order in Browse Workshops.</p>
    </div>
    {loading ? <div className="h-32 animate-pulse bg-muted" /> : error ? <p role="alert" className="p-4 text-sm text-destructive">Could not load workshops. <button onClick={refresh} className="min-h-11 px-2 underline">Try again</button></p> : <>
      <ContentReorderList key={filter} entity="WorkshopInquiry" items={items} onChange={setItems}>
        {item => <AdminWorkshopRow item={item} onEdit={() => setEditing(item)} onRemove={() => remove(item.id)} onStatus={value => setStatus(item.id, value)} />}
      </ContentReorderList>
      {hasMore && <button onClick={() => loadMore()} disabled={loadingMore} className="m-4 min-h-11 rounded-xl border border-border px-4 text-sm disabled:opacity-50">{loadingMore ? 'Loading…' : 'Load more workshops'}</button>}
    </>}
    {editing && <EditContentDialog type={WORKSHOP_TYPE} item={editing} title={editing.id ? 'Edit workshop' : 'New workshop'} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
  </div>;
}