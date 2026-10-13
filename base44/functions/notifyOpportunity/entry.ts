import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Callers: staff (manual / admin approval), the opportunity creator (create-triggered
    // automation runs as them), or the automation runtime itself (no user session).
    // Arbitrary callers can't cause harm: we act only on stored data, only for ACTIVE
    // opportunities, and only once per opportunity (dedupe below).
    let caller = null;
    try { caller = await base44.auth.me(); } catch { caller = null; }
    const body = await req.json().catch(() => ({}));
    const opportunityId = body.opportunity_id || body.data?.id;
    if (!opportunityId) return Response.json({ error: 'Missing opportunity id' }, { status: 400 });

    const opportunity = await base44.asServiceRole.entities.Opportunity.get(opportunityId);
    if (!opportunity) return Response.json({ error: 'Opportunity not found' }, { status: 404 });

    if (opportunity.status !== 'active') {
      return Response.json({ ok: true, skipped: 'opportunity is not active' });
    }
    const isStaff = caller && ['admin', 'moderator'].includes(caller.role);
    if (caller && !isStaff && caller.id !== opportunity.created_by_id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
    const already = await base44.asServiceRole.entities.Notification.filter(
      { related_id: opportunity.id, type: 'new_opportunity' }, '-created_date', 1);
    if (already.length > 0) {
      return Response.json({ ok: true, skipped: 'already notified' });
    }

    const causeCategory = opportunity.cause_category;

    // Get all volunteer profiles that have this cause in their causes array
    const allProfiles = await base44.asServiceRole.entities.VolunteerProfile.list();
    const matchedProfiles = allProfiles.filter(p =>
      p.causes && p.causes.includes(causeCategory)
    );

    if (matchedProfiles.length === 0) {
      return Response.json({ ok: true, sent: 0 });
    }

    // Get all users to map user_id -> email/full_name
    const allUsers = await base44.asServiceRole.entities.User.list();
    const userMap = {};
    for (const u of allUsers) {
      userMap[u.id] = u;
    }

    const orgText = opportunity.organization ? ` by ${opportunity.organization}` : '';
    const locationText = opportunity.location ? ` in ${opportunity.location}` : '';
    const notifTitle = `New ${causeCategory} opportunity`;
    const notifMessage = `${opportunity.title}${orgText}${locationText}`;

    let sent = 0;
    for (const profile of matchedProfiles) {
      const user = userMap[profile.user_id];
      if (!user) continue;

      // Create in-app notification (service role bypasses RLS)
      await base44.asServiceRole.entities.Notification.create({
        user_id: user.id,
        type: 'new_opportunity',
        title: notifTitle,
        message: notifMessage,
        related_id: opportunity.id,
        related_user_name: opportunity.created_by_name || opportunity.organization || 'Community',
        is_read: false,
      });

      // Also send email if the user has one
      if (user.email) {
        const typeText = opportunity.type ? ` (${opportunity.type})` : '';
        const deadlineText = opportunity.deadline ? `\n\nApplication Deadline: ${opportunity.deadline}` : '';

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: `New ${causeCategory} opportunity: ${opportunity.title}`,
          body: `Hi ${user.full_name || 'Volunteer'},

A new volunteer opportunity matching your interest in "${causeCategory}" has just been posted on Circles of Giving (COG)!

${opportunity.title}${orgText}${locationText}${typeText}

${opportunity.description}${deadlineText}

Log in to Circles of Giving to learn more and express your interest.

Thank you for volunteering!
The Circles of Giving Team`,
        });
      }
      sent++;
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    console.error('notifyOpportunity error:', error);
    return Response.json({ error: 'Internal error.' }, { status: 500 });
  }
});