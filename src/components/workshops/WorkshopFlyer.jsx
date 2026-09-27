import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import WorkshopMap from '@/components/workshops/WorkshopMap';
import printWorkshopFlyer from '@/components/workshops/printWorkshopFlyer';

export default function WorkshopFlyer({ workshop, preview = false }) {
  const ref = useRef(null);
  const [printing, setPrinting] = useState(false);
  const [error, setError] = useState('');
  const picture = /^https?:\/\//i.test(workshop.image_url || '') ? workshop.image_url : 'https://images.unsplash.com/photo-1522202176986-ec32a4399979?w=800&h=400&fit=crop';
  const date = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString('en-IL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date to be confirmed';
  const print = async () => {
    setPrinting(true); setError('');
    try { await printWorkshopFlyer(ref.current); }
    catch { setError('Unable to prepare the flyer. Please try again.'); }
    finally { setPrinting(false); }
  };
  return <div className="space-y-3 min-w-0">
    <article ref={ref} className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground">
      <img src={picture} alt={workshop.title || 'Community learning workshop'} className="h-48 w-full object-cover" />
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Circles of Giving · {preview ? 'Flyer preview' : 'Workshop'}</p>
        <h3 className="text-2xl break-words">{workshop.title || 'Your workshop title'}</h3>
        <p className="text-sm text-muted-foreground">Led by {workshop.first_name} {workshop.last_name}</p>
        <p className="whitespace-pre-wrap break-words text-sm">{workshop.description || 'Your workshop description will appear here.'}</p>
        <dl className="space-y-2 text-sm">
          <div><dt className="font-semibold">When</dt><dd>{date(workshop.workshop_date)}{workshop.start_time && ` at ${workshop.start_time}`}{workshop.end_date && workshop.end_date !== workshop.workshop_date ? ` – ${date(workshop.end_date)}` : ''}{workshop.end_time && ` – ${workshop.end_time}`} (Israel time)</dd></div>
          <div><dt className="font-semibold">Where</dt><dd>{workshop.format === 'Zoom' ? 'Online via Zoom' : [workshop.has_studio ? workshop.studio_address || workshop.location : workshop.location, workshop.city].filter(Boolean).join(', ') || 'Location to be confirmed'} · {workshop.format}</dd></div>
          <div><dt className="font-semibold">Language</dt><dd>{workshop.language === 'Other' ? workshop.other_language : workshop.language}</dd></div>
          {workshop.supplies && <div><dt className="font-semibold">Supplies</dt><dd className="whitespace-pre-wrap break-words">{workshop.supplies}</dd></div>}
        </dl>
        {workshop.notes && <p className="text-sm whitespace-pre-wrap break-words">{workshop.notes}</p>}
        {workshop.format !== 'In-person' && /^https?:\/\//i.test(workshop.zoom_link || '') && <a href={workshop.zoom_link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">Join on Zoom</a>}
      </div>
    </article>
    {!preview && <><WorkshopMap workshop={workshop} /><Button type="button" variant="outline" disabled={printing} onClick={print}>{printing ? 'Preparing flyer…' : 'Print flyer / Save PDF'}</Button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</>}
  </div>;
}