import { useState } from 'react';
import { FileText, Calendar, Briefcase, Plus } from 'lucide-react';
import { CONTENT_TYPES } from '@/components/content/contentConfig';
import { EVENT_TYPE } from '@/components/admin/adminFormTypes';
import EditContentDialog from '@/components/content/EditContentDialog';
import ContentReorderList from '@/components/admin/ContentReorderList';
import AdminContentRow from '@/components/admin/AdminContentRow';
import useAdminContent from '@/components/admin/useAdminContent';

const SECTIONS = [
  { entity: 'Post', label: 'Posts', singular: 'post', icon: FileText },
  { entity: 'Event', label: 'Events', singular: 'event', icon: Calendar },
  { entity: 'Opportunity', label: 'Opportunities', singular: 'offer', icon: Briefcase },
];
export default function AdminContentTab() {
  const { lists, loading, deleting, error, change, load, remove, status } = useAdminContent();
  const [editing, setEditing] = useState(null);
  const typeFor = entity => entity === 'Event' ? EVENT_TYPE : CONTENT_TYPES.find(type => type.key === entity);
  if (loading) return <div className="animate-pulse space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl border border-border bg-card" />)}</div>;
  return <div className="space-y-6">
    <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Drag posts, events, and offers into the order they should appear on their public pages. Changes save automatically when dropped.</p>
    {error && <p role="alert" className="text-sm text-destructive">{error} <button onClick={load} className="min-h-11 px-2 underline">Try again</button></p>}
    {SECTIONS.map(({ entity, label, singular, icon: Icon }) => <section key={entity} className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /><h2 className="font-display text-lg font-bold">{label}</h2></div>
        <button onClick={() => setEditing({ type: typeFor(entity), item: entity === 'Event' ? {} : { status: 'active' } })} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground"><Plus className="h-4 w-4" />New {singular}</button>
      </div>
      <ContentReorderList entity={entity} items={lists[entity]} onChange={items => change(entity, items)} className="max-h-80 overflow-y-auto">
        {item => <AdminContentRow entity={entity} item={item} deleting={deleting === item.id} onEdit={() => setEditing({ type: typeFor(entity), item })} onDelete={() => remove(entity, item.id)} onStatus={value => status(entity, item.id, value)} />}
      </ContentReorderList>
    </section>)}
    {editing && <EditContentDialog type={editing.type} item={editing.item} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
  </div>;
}