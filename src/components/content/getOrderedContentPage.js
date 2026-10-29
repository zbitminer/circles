import { base44 } from '@/api/base44Client';

// Server-sorted priority items first, then the normal newest-first stream.
export default async function getOrderedContentPage(entity, query = {}, { limit = 24, cursor } = {}) {
  const api = base44.entities[entity];
  let items = [];
  if (cursor?.phase !== 'regular') {
    const page = await api.filter({ $and: [query, { display_priority: { $gt: 0 } }] }, {
      sort: '-display_priority', limit, cursor: cursor?.value,
    });
    items = page.items;
    if (page.has_more) return { items, has_more: true, next_cursor: { phase: 'priority', value: page.next_cursor } };
    if (items.length === limit) return { items, has_more: true, next_cursor: { phase: 'regular' } };
  }
  const page = await api.filter({ $and: [query, { $or: [
    { display_priority: { $exists: false } }, { display_priority: null }, { display_priority: { $lte: 0 } },
  ] }] }, { sort: '-created_date', limit: limit - items.length, cursor: cursor?.phase === 'regular' ? cursor.value : undefined });
  return { items: [...items, ...page.items], has_more: page.has_more,
    next_cursor: page.has_more ? { phase: 'regular', value: page.next_cursor } : undefined };
}