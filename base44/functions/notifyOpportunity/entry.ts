import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const opportunity = body.data;
    if (!opportunity) return Response.json({ ok: true, skipped: 'no data' });

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

A new volunteer opportunity matching your interest in "${causeCategory}" has just been posted on VolunteerHub!

${opportunity.title}${orgText}${locationText}${typeText}

${opportunity.description}${deadlineText}

Log in to VolunteerHub to learn more and express your interest.

Thank you for volunteering!
The VolunteerHub Team`,
        });
      }
      sent++;
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});