import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Join / leave a group. Membership role/status and Group.member_count are server-controlled.
//   { action: 'join' | 'leave', group_id }
//   { action: 'approve' | 'remove', group_id, membership_id }  -> group owner or admin
async function recount(base44, groupId) {
  const active = await base44.asServiceRole.entities.GroupMembership.filter({ group_id: groupId, status: 'active' }, '-created_date', 5000);
  await base44.asServiceRole.entities.Group.update(groupId, { member_count: active.length });
  return active.length;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, group_id, membership_id } = await req.json().catch(() => ({}));
    if (!['join', 'leave', 'approve', 'remove'].includes(action) || typeof group_id !== 'string' || !group_id) {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    let group = null;
    try { group = await base44.asServiceRole.entities.Group.get(group_id); } catch { group = null; }
    if (!group) return Response.json({ error: 'Group not found' }, { status: 404 });

    const Memberships = base44.asServiceRole.entities.GroupMembership;
    const isOwner = group.owner_id === user.id;
    const mine = (await Memberships.filter({ group_id, user_id: user.id }))[0];

    if (action === 'join') {
      if (mine) return Response.json({ ok: true, membership: mine, member_count: group.member_count });
      const status = isOwner || group.privacy !== 'private' ? 'active' : 'pending';
      const membership = await Memberships.create({
        group_id, user_id: user.id, user_name: user.full_name || '', role: isOwner ? 'owner' : 'member', status,
      });
      return Response.json({ ok: true, membership, member_count: await recount(base44, group_id) });
    }

    if (action === 'leave') {
      if (mine) await Memberships.delete(mine.id);
      return Response.json({ ok: true, member_count: await recount(base44, group_id) });
    }

    // approve / remove another member
    if (!(isOwner || user.role === 'admin')) return Response.json({ error: 'Forbidden' }, { status: 403 });
    let target = null;
    try { target = await Memberships.get(membership_id); } catch { target = null; }
    if (!target || target.group_id !== group_id) return Response.json({ error: 'Membership not found' }, { status: 404 });
    if (action === 'approve') await Memberships.update(target.id, { status: 'active' });
    else await Memberships.delete(target.id);
    return Response.json({ ok: true, member_count: await recount(base44, group_id) });
  } catch (error) {
    console.error('manageGroupMembership error:', error);
    return Response.json({ error: 'Could not update group membership.' }, { status: 500 });
  }
});
