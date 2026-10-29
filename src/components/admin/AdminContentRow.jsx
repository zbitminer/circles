import { Pencil, Trash2 } from 'lucide-react';

export default function AdminContentRow({ entity, item, deleting, onEdit, onDelete, onStatus }) {
  const isOffer = entity === 'Opportunity';
  const isEvent = entity === 'Event';
  const context = entity === 'Post' ? item.author_name || 'Member' : isEvent ? item.location : item.organization;
  return <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-3 sm:px-4">
    <div className="w-full min-w-0 sm:w-auto sm:flex-1">
      <p className="truncate text-sm font-medium">{item.title || item.content?.slice(0, 80)}</p>
      <p className="text-xs text-muted-foreground">{context} · {item.status}</p>
    </div>
    <div className="flex flex-wrap items-center gap-1">
      {isEvent && item.status !== 'cancelled' && <button onClick={() => onStatus('cancelled')} className="min-h-11 rounded-lg bg-muted px-2 text-xs text-muted-foreground">Cancel</button>}
      {isOffer && item.status === 'pending' && <>
        <button onClick={() => onStatus('active')} className="min-h-11 rounded-lg bg-primary/10 px-2 text-xs text-primary">Approve</button>
        <button onClick={() => onStatus('rejected')} className="min-h-11 rounded-lg bg-destructive/10 px-2 text-xs text-destructive">Reject</button>
      </>}
      {isOffer && item.status === 'active' && <button onClick={() => onStatus('closed')} className="min-h-11 rounded-lg bg-muted px-2 text-xs text-muted-foreground">Close</button>}
      <button onClick={onEdit} aria-label={`Edit ${entity.toLowerCase()}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button>
      <button onClick={onDelete} disabled={deleting} aria-label={`Delete ${entity.toLowerCase()}`} className="flex h-11 w-11 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
    </div>
  </div>;
}