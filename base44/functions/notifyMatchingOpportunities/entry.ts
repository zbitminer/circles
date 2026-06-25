import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const causes = body.data?.causes || body.causes;

    if (!causes || causes.length === 0) {
      return Response.json({ ok: true, skipped: 'no causes' });
    }

    // Find active opportunities matching any of the member's causes
    const allOpps = await base44.asServiceRole.entities.Opportunity.list();
    const matchedOpps = allOpps.filter(o =>
      o.status === 'active' && causes.includes(o.cause_category)
    );

    if (matchedOpps.length === 0) {
      return Response.json({ ok: true, sent: 0 });
    }

    // Get existing notifications for this user to avoid duplicates
    const existingNotifs = await base44.entities.Notification.filter({ user_id: user.id });
    const existingOppIds = new Set(
      existingNotifs
        .filter(n => n.type === 'new_opportunity' && n.related_id)
        .map(n => n.related_id)
    );

    let sent = 0;
    for (const opp of matchedOpps) {
      // Skip if we already notified about this opportunity
      if (existingOppIds.has(opp.id)) continue;

      const orgText = opp.organization ? ` by ${opp.organization}` : '';
      const locationText = opp.location ? ` in ${opp.location}` : '';

      await base44.entities.Notification.create({
        user_id: user.id,
        type: 'new_opportunity',
        title: `New ${opp.cause_category} opportunity`,
        message: `${opp.title}${orgText}${locationText}`,
        related_id: opp.id,
        related_user_name: opp.created_by_name || opp.organization || 'Community',
        is_read: false,
      });
      sent++;
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});