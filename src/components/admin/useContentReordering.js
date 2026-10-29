import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useContentReordering(entity, items, onChange) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const cache = useQueryClient();
  const reorder = async ({ source, destination }) => {
    if (busy.current || !destination || source.index === destination.index) return;
    const next = [...items];
    next.splice(destination.index, 0, next.splice(source.index, 1)[0]);
    const ordered = next.map((item, index) => ({ ...item, display_priority: 9999 - index }));
    busy.current = true;
    setSaving(true);
    setMessage('Saving order…');
    onChange(ordered);
    try {
      for (let offset = 0; offset < ordered.length; offset += 500) {
        await base44.entities[entity].bulkUpdate(ordered.slice(offset, offset + 500).map(({ id, display_priority }) => ({ id, display_priority })));
      }
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['event-listing'] }),
        ...(entity === 'WorkshopInquiry' ? [
          cache.invalidateQueries({ queryKey: ['workshop-listings'] }),
          cache.invalidateQueries({ queryKey: ['admin-workshop-order'] }),
        ] : []),
      ]);
      setMessage('Order saved');
    } catch {
      onChange(items);
      setMessage('Could not save order. Please try again.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  return { saving, message, reorder };
}