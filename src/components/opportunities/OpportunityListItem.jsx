import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OpportunityListItem({ opportunity: item, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const topics = item.offer_topics?.map(topic => topic.subcategory || topic.category) || [];
  return <article className="border-b border-border py-5 first:pt-0 last:border-0 min-w-0">
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
      <span>{item.type}</span><span>·</span><span>{(item.cause_categories?.length ? item.cause_categories : [item.cause_category]).join(' · ')}</span>
    </div>
    <h3 className="text-xl text-foreground break-words">{item.title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{item.organization}{item.location ? ` · ${item.location}` : ''}</p>
    <button type="button" className="min-h-11 text-sm font-semibold text-primary underline" aria-expanded={expanded} aria-controls={`opportunity-${item.id}`} onClick={() => setExpanded(!expanded)}>{expanded ? 'Read less' : 'Read more'}</button>
    {expanded && <div id={`opportunity-${item.id}`} className="space-y-3 text-sm">
      <p className="whitespace-pre-wrap break-words">{item.description}</p>
      {topics.length > 0 && <p><strong>Topics:</strong> {topics.join(', ')}</p>}
      {item.help_details && <p className="whitespace-pre-wrap break-words"><strong>How I can help:</strong> {item.help_details}</p>}
      {item.deadline && <p>Deadline: {new Date(`${item.deadline.slice(0, 10)}T12:00:00`).toLocaleDateString()}</p>}
      <p>{item.applicants?.length || 0} interested{item.capacity ? ` · ${Math.max(0, item.capacity - (item.applicants?.length || 0))} spots left` : ''}</p>
      <Button variant="outline" onClick={() => onSelect(item)}>View responses / Express interest</Button>
    </div>}
  </article>;
}