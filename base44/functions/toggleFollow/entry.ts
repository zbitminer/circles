import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Atomic array add/remove using MongoDB-style operators via updateMany.
// Falls back to read-modify-write if the operator form is not supported.
async function arrayOp(store, id, field, op, value) {
  try {
    await store.updateMany({ id }, { [op]: { [field]: value } });
  } catch (err) {
    console.warn(`updateMany ${op} failed, falling back:`, err?.message);
    const rec = await store.get(id);
    const arr = Array.isArray(rec?.[field]) ? rec[field] : [];
    const next = op === '$addToSet' ? (arr.includes(value) ? arr : [...arr, value]) : arr.filter((v) => v !== value);
    await store.update(id, { [field]: next });
  }
  const fresh = await store.get(id);
  return Array.isArray(fresh?.[field]) ? fresh[field] : [];
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
