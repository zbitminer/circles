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

    const { target_user_id } = await req.json().catch(() => ({}));
    if (typeof target_user_id !== 'string' || !target_user_id) {
      return Response.json({ error: 'target_user_id is required' }, { status: 400 });
    }
    if (target_user_id === user.id) return Response.json({ error: 'You cannot follow yourself.' }, { status: 400 });

    const store = base44.asServiceRole.entities.VolunteerProfile;
    const myProfile = (await store.filter({ user_id: user.id }))[0];
    if (!myProfile) return Response.json({ error: 'Your profile not found' }, { status: 404 });
    const targetProfile = (await store.filter({ user_id: target_user_id }))[0];
    if (!targetProfile) return Response.json({ error: 'User not found' }, { status: 404 });

    const isFollowing = (myProfile.following || []).includes(target_user_id);
    const op = isFollowing ? '$pull' : '$addToSet';
    const following = await arrayOp(store, myProfile.id, 'following', op, target_user_id);
    const followers = await arrayOp(store, targetProfile.id, 'followers', op, user.id);

    return Response.json({ following, followers, is_following: following.includes(target_user_id) });
  } catch (error) {
    console.error('toggleFollow error:', error);
    return Response.json({ error: 'Could not update follow.' }, { status: 500 });
  }
});
