import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import getOrderedContentPage from '@/components/content/getOrderedContentPage';

export default function useOrderedWorkshops(kind = 'all', scope = 'workshop-listings') {
  const cache = useQueryClient();
  const query = kind === 'all' ? {} : { inquiry_type: kind };
  const key = [scope, kind];
  const listing = useInfiniteQuery({
    queryKey: key, initialPageParam: undefined,
    queryFn: ({ pageParam }) => getOrderedContentPage('WorkshopInquiry', query, { limit: 24, cursor: pageParam }),
    getNextPageParam: page => page.has_more ? page.next_cursor : undefined,
  });
  const count = useQuery({ queryKey: [...key, 'count'], queryFn: () => base44.entities.WorkshopInquiry.count(query) });
  const setItems = items => cache.setQueryData(key, current => {
    if (!current) return current;
    let offset = 0;
    return { ...current, pages: current.pages.map(page => {
      const slice = items.slice(offset, offset + page.items.length);
      offset += page.items.length;
      return { ...page, items: slice };
    }) };
  });
  return { items: listing.data?.pages.flatMap(page => page.items) || [], total: count.data,
    loading: listing.isPending, error: listing.error || count.error, setItems,
    refresh: () => Promise.all([listing.refetch(), count.refetch()]),
    hasMore: listing.hasNextPage, loadingMore: listing.isFetchingNextPage, loadMore: listing.fetchNextPage };
}