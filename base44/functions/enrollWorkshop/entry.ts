import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Atomic array add/remove using MongoDB-style operators via updateMany.
// If the operator form isn't supported, fall back to read-modify-write and verify the
// result, retrying a few times so concurrent writers don't silently drop changes.
function applyOp(arr, op, value) {
  if (op === '$push') return [...arr, value];
  if (op === '$addToSet') return arr.includes(value) ? arr : [...arr, value];
  return arr.filter((v) => v !== value);
}

function opApplied(arr, op, value) {
  if (op === '$pull') return !arr.includes(value);
  if (op === '$push') return arr.some((v) => JSON.stringify(v) === JSON.stringify(value));
  return arr.includes(value);
}

async function arrayOp(store, id, field, op, value) {
  try {
    await store.updateMany({ id }, { [op]: { [field]: value } });
    const fresh = await store.get(id);
    const arr = Array.isArray(fresh?.[field]) ? fresh[field] : [];
    if (opApplied(arr, op, value)) return arr;
  } catch (err) {
    console.warn(`updateMany ${op} unsupported, using verified fallback:`, err?.message);
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const rec = await store.get(id);
    const arr = Array.isArray(rec?.[field]) ? rec[field] : [];
    if (op !== '$push' && opApplied(arr, op, value)) return arr;
    await store.update(id, { [field]: applyOp(arr, op, value) });
    const check = await store.get(id);
    const after = Array.isArray(check?.[field]) ? check[field] : [];
    if (opApplied(after, op, value)) return after;
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
  }
  throw new Error(`Could not apply ${op} on ${field}`);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { opportunity_id } = await req.json().catch(() => ({}));
    if (typeof opportunity_id !== 'string' || !opportunity_id) {
      return Response.json({ error: 'Missing opportunity_id' }, { status: 400 });
    }

    const store = base44.asServiceRole.entities.Opportunity;
    let opp = null;
    try { opp = await store.get(opportunity_id); } catch { opp = null; }
    if (!opp) return Response.json({ error: 'Opportunity not found' }, { status: 404 });

    if (opp.status !== 'active') {
      return Response.json({ error: 'This opportunity is not open for enrollment.' }, { status: 409 });
    }
    if (opp.deadline) {
      const deadline = new Date(opp.deadline);
      deadline.setHours(23, 59, 59, 999);
      if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) {
        return Response.json({ error: 'The enrollment deadline has passed.' }, { status: 409 });
      }
    }

    const current = opp.applicants || [];
    if (current.includes(user.id)) {
      return Response.json({ status: 'already_enrolled', applicants: current });
    }
    const capacity = Number(opp.capacity) || 0;
    if (capacity && current.length >= capacity) {
      return Response.json({ error: 'This workshop is full', status: 'full' }, { status: 409 });
    }

    // Add atomically, then verify capacity; roll back if a concurrent enrollment overfilled it.
    let applicants = await arrayOp(store, opportunity_id, 'applicants', '$addToSet', user.id);
    if (capacity && applicants.length > capacity && applicants.indexOf(user.id) >= capacity) {
      applicants = await arrayOp(store, opportunity_id, 'applicants', '$pull', user.id);
      return Response.json({ error: 'This workshop is full', status: 'full' }, { status: 409 });
    }

    return Response.json({ status: 'enrolled', applicants });
  } catch (error) {
    console.error('enrollWorkshop error:', error);
    return Response.json({ error: 'Could not complete enrollment.' }, { status: 500 });
  }
});
