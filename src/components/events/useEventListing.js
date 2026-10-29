import { useDeferredValue, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import getOrderedContentPage from '@/components/content/getOrderedContentPage';

export default function useEventListing({ period, cause, search, accessibleOnly }) {
  const [now] = useState(() => new Date().toISOString());
  const term = useDeferredValue(search.trim());
  const periodQuery = period === 'past'
    ? { $or: [{ status: 'completed' }, { status: { $ne: 'ongoing' }, date: { $lt: now } }] }
    : { $or: [{ status: 'ongoing' }, { status: { $nin: ['completed', 'cancelled'] }, date: { $gte: now } }] };
  const conditions = [{ status: { $ne: 'cancelled' } }, periodQuery];
  if (cause !== 'All') conditions.push({ cause_category: cause });
  if (accessibleOnly) conditions.push({ 'accessibility_options.0': { $exists: true } });
  if (term) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    conditions.push({ $or: ['title', 'description', 'location'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } })) });
  }
  const query = { $and: conditions };
  const listing = useInfiniteQuery({
    queryKey: ['event-listing', query], initialPageParam: undefined,
    queryFn: ({ pageParam }) => getOrderedContentPage('Event', query, { limit: 24, cursor: pageParam }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
  });
  const count = useQuery({ queryKey: ['event-count', query], queryFn: () => base44.entities.Event.count(query) });
  return { events: listing.data?.pages.flatMap(p => p.items) || [], loading: listing.isPending, error: listing.error || count.error,
    total: count.data, refresh: () => Promise.all([listing.refetch(), count.refetch()]),
    hasMore: listing.hasNextPage, loadingMore: listing.isFetchingNextPage, loadMore: listing.fetchNextPage };
}