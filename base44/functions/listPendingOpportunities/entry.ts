import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Opportunity reads are public only for active/closed records (so anonymous visitors can browse).
// Pending/draft/rejected ones are served here: staff see all, creators see their own.
const HIDDEN = ['pending', 'draft', 'rejected'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => e.status === 401 ? null : Promise.reject(e));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const isStaff = user.role === 'admin' || user.role === 'moderator';
    const { ordered } = await req.json().catch(() => ({}));
    if (ordered === true) {
      if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
      const api = base44.asServiceRole.entities.Opportunity;
      const priority = await api.filter({ display_priority: { $gt: 0 } }, { sort: '-display_priority', limit: 100 });
      let opportunities = priority.items;
      if (opportunities.length < 100) {
        const regular = await api.filter({ $or: [
          { display_priority: { $exists: false } }, { display_priority: null }, { display_priority: { $lte: 0 } },
        ] }, { sort: '-created_date', limit: 100 - opportunities.length });
        opportunities = [...opportunities, ...regular.items];
      }
      return Response.json({ opportunities });
    }

    const query = isStaff
      ? { status: { $in: HIDDEN } }
      : { status: { $in: HIDDEN }, created_by_id: user.id };
    const opportunities = await base44.asServiceRole.entities.Opportunity.filter(query, '-created_date', 200);
    return Response.json({ opportunities });
  } catch (error) {
    console.error('listPendingOpportunities error:', error);
    return Response.json({ error: 'Could not load opportunities.' }, { status: 500 });
  }
}