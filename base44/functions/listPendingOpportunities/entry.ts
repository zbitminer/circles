import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Opportunity reads are public only for active/closed records (so anonymous visitors can browse).
// Pending/draft/rejected ones are served here: staff see all, creators see their own.
const HIDDEN = ['pending', 'draft', 'rejected'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const isStaff = user.role === 'admin' || user.role === 'moderator';

    const query = isStaff
      ? { status: { $in: HIDDEN } }
      : { status: { $in: HIDDEN }, created_by_id: user.id };
    const opportunities = await base44.asServiceRole.entities.Opportunity.filter(query, '-created_date', 200);
    return Response.json({ opportunities });
  } catch (error) {
    console.error('listPendingOpportunities error:', error);
    return Response.json({ error: 'Could not load opportunities.' }, { status: 500 });
  }
});
