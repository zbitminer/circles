import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import getOrderedContentPage from '@/components/content/getOrderedContentPage';

export default function useAdminContent() {
  const [lists, setLists] = useState({ Post: [], Event: [], Opportunity: [] });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const change = (entity, items) => setLists(prev => ({ ...prev, [entity]: items }));
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [posts, events, response] = await Promise.all([
        getOrderedContentPage('Post', {}, { limit: 100 }),
        getOrderedContentPage('Event', {}, { limit: 100 }),
        base44.functions.invoke('listPendingOpportunities', { ordered: true }),
      ]);
      setLists({ Post: posts.items, Event: events.items, Opportunity: response.data.opportunities });
    } catch {
      setError('Could not load content. Please try again.');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const remove = async (entity, id) => {
    setDeleting(id);
    await base44.entities[entity].delete(id);
    setLists(prev => ({ ...prev, [entity]: prev[entity].filter(item => item.id !== id) }));
    setDeleting(null);
  };
  const status = async (entity, id, value) => {
    await base44.entities[entity].update(id, { status: value });
    setLists(prev => ({ ...prev, [entity]: prev[entity].map(item => item.id === id ? { ...item, status: value } : item) }));
    if (entity === 'Opportunity' && value === 'active') base44.functions.invoke('notifyOpportunity', { opportunity_id: id }).catch(() => {});
  };
  return { lists, loading, deleting, error, change, load, remove, status };
}