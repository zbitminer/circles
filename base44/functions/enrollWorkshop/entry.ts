import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { opportunity_id } = await req.json();
    if (!opportunity_id) return Response.json({ error: 'Missing opportunity_id' }, { status: 400 });

    // Fetch the opportunity as service role to get authoritative applicant list
    const opp = await base44.asServiceRole.entities.Opportunity.get(opportunity_id);
    if (!opp) return Response.json({ error: 'Opportunity not found' }, { status: 404 });

    const applicants = opp.applicants || [];

    // Already enrolled — idempotent success
    if (applicants.includes(user.id)) {
      return Response.json({ status: 'already_enrolled', applicants });
    }

    // Capacity check — prevents over-enrollment
    if (opp.capacity && applicants.length >= opp.capacity) {
      return Response.json({ error: 'This workshop is full', status: 'full' }, { status: 409 });
    }

    // Atomically add the user via $addToSet (avoids duplicates under concurrent calls)
    await base44.asServiceRole.entities.Opportunity.update(
      opportunity_id,
      { applicants: [...applicants, user.id] }
    );

    return Response.json({ status: 'enrolled', applicants: [...applicants, user.id] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});