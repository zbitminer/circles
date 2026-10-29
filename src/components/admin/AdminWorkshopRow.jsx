import { Trash2, Mail, Phone, MapPin, Pencil } from 'lucide-react';

const STATUSES = ['new', 'contacted', 'scheduled', 'completed'];
export default function AdminWorkshopRow({ item, onEdit, onRemove, onStatus }) {
  return <div className="flex flex-col justify-between gap-3 px-2 py-4 sm:flex-row sm:items-start sm:px-4">
    <div className="min-w-0">
      <p className="break-words text-sm font-semibold">{item.title || (item.inquiry_type === 'lead' ? 'Workshop proposal' : 'Workshop sign-up')}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{item.first_name} {item.last_name} · {item.inquiry_type === 'lead' ? 'Leader' : 'Participant'}</p>
      <p className="text-xs text-muted-foreground">{item.workshop_date || ''} {item.start_time || ''}</p>
      {(item.city || item.location) && <p className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{item.city || item.location}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-1">
      <select aria-label={`Status for ${item.title || 'workshop'}`} value={item.status || 'new'} onChange={e => onStatus(e.target.value)} className="min-h-11 rounded-full bg-muted px-3 text-xs font-medium capitalize outline-none focus-visible:ring-2 focus-visible:ring-ring">{STATUSES.map(status => <option key={status} value={status}>{status}</option>)}</select>
      <a href={`mailto:${item.email}`} aria-label="Email" className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10"><Mail className="h-4 w-4" /></a>
      <a href={`tel:${item.phone}`} aria-label="Call" className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10"><Phone className="h-4 w-4" /></a>
      <button onClick={onEdit} aria-label="Edit workshop" className="flex h-11 w-11 items-center justify-center rounded-lg text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button>
      <button onClick={onRemove} aria-label="Delete workshop" className="flex h-11 w-11 items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
    </div>
  </div>;
}