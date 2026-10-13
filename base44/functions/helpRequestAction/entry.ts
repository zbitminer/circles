import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Claim / unclaim / resolve an SosRequest or HealthRequest.
// Status and claim fields are write-protected on the entities, so all changes go through here.
const ENTITIES = ['SosRequest', 'HealthRequest'];
const ACTIONS = ['claim', 'unclaim', 'resolve'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { entity, request_id, action } = await req.json().catch(() => ({}));
    if (!ENTITIES.includes(entity) || !ACTIONS.includes(action) || typeof request_id !== 'string' || !request_id) {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const store = base44.asServiceRole.entities[entity];
    let record = null;
    try { record = await store.get(request_id); } catch { record = null; }
    if (!record) return Response.json({ error: 'Request not found' }, { status: 404 });

    const isStaff = user.role === 'admin' || user.role === 'moderator';
    const isOwner = record.created_by_id === user.id;
    const isClaimer = record.claimed_by_id === user.id;
    let update;

    if (action === 'claim') {
      if (record.status !== 'open' || record.claimed_by_id) {
        return Response.json({ error: 'This request has already been claimed.' }, { status: 409 });
      }
      if (isOwner) return Response.json({ error: 'You cannot claim your own request.' }, { status: 400 });
      update = { status: 'claimed', claimed_by_id: user.id, claimed_by_name: user.full_name || 'Volunteer' };
    } else if (action === 'unclaim') {
      if (record.status !== 'claimed' || !(isClaimer || isStaff)) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
      update = { status: 'open', claimed_by_id: null, claimed_by_name: null };
    } else {
      if (record.status === 'resolved') return Response.json({ ok: true, record });
      if (!(isOwner || isClaimer || isStaff)) return Response.json({ error: 'Forbidden' }, { status: 403 });
      update = { status: 'resolved' };
    }

    // Re-check right before writing to narrow the double-claim race window.
    if (action === 'claim') {
      const fresh = await store.get(request_id);
      if (fresh.status !== 'open' || fresh.claimed_by_id) {
        return Response.json({ error: 'This request has already been claimed.' }, { status: 409 });
      }
    }
    const updated = await store.update(request_id, update);
    return Response.json({ ok: true, record: { ...record, ...update, ...(updated || {}) } });
  } catch (error) {
    console.error('helpRequestAction error:', error);
    return Response.json({ error: 'Could not update the request.' }, { status: 500 });
  }
});
