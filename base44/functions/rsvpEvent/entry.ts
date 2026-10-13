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

// Toggle the caller's RSVP on an event (attendees are server-controlled).
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { event_id } = await req.json().catch(() => ({}));
    if (typeof event_id !== 'string' || !event_id) return Response.json({ error: 'event_id is required' }, { status: 400 });

    const store = base44.asServiceRole.entities.Event;
    let evt = null;
    try { evt = await store.get(event_id); } catch { evt = null; }
    if (!evt) return Response.json({ error: 'Event not found' }, { status: 404 });

    const current = evt.attendees || [];
    if (current.includes(user.id)) {
      const attendees = await arrayOp(store, event_id, 'attendees', '$pull', user.id);
      return Response.json({ attending: false, attendees });
    }
    if (evt.status && evt.status !== 'upcoming' && evt.status !== 'ongoing') {
      return Response.json({ error: 'This event is not open for RSVPs.' }, { status: 409 });
    }
    const capacity = Number(evt.capacity) || 0;
    if (capacity && current.length >= capacity) return Response.json({ error: 'This event is full.' }, { status: 409 });

    let attendees = await arrayOp(store, event_id, 'attendees', '$addToSet', user.id);
    if (capacity && attendees.length > capacity && attendees.indexOf(user.id) >= capacity) {
      attendees = await arrayOp(store, event_id, 'attendees', '$pull', user.id);
      return Response.json({ error: 'This event is full.' }, { status: 409 });
    }
    return Response.json({ attending: true, attendees });
  } catch (error) {
    console.error('rsvpEvent error:', error);
    return Response.json({ error: 'Could not update RSVP.' }, { status: 500 });
  }
});
