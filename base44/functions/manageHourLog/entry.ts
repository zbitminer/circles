import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Admin review of volunteer hour logs. VolunteerProfile.total_hours is write-protected and
// is recomputed here from approved logs only.
//   { action: 'approve' | 'reject', log_id }        -> admin only
//   { action: 'backfill' }                           -> admin only: mark legacy logs (no status) approved
//   { action: 'recompute', user_id? }                -> recompute own total (or any user's, if admin)
async function recomputeTotal(base44, userId) {
  const logs = await base44.asServiceRole.entities.HourLog.filter({ user_id: userId, status: 'approved' }, '-date', 5000);
  const total = Math.round(logs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0) * 100) / 100;
  const profiles = await base44.asServiceRole.entities.VolunteerProfile.filter({ user_id: userId });
  if (profiles[0]) await base44.asServiceRole.entities.VolunteerProfile.update(profiles[0].id, { total_hours: total });
  return total;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const isAdmin = user.role === 'admin';

    const { action, log_id, user_id } = await req.json().catch(() => ({}));

    if (action === 'recompute') {
      const target = isAdmin && typeof user_id === 'string' && user_id ? user_id : user.id;
      return Response.json({ ok: true, total_hours: await recomputeTotal(base44, target) });
    }

    if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

    if (action === 'backfill') {
      const logs = await base44.asServiceRole.entities.HourLog.list('-date', 5000);
      const users = new Set();
      let updated = 0;
      for (const log of logs) {
        if (!log.status) {
          await base44.asServiceRole.entities.HourLog.update(log.id, { status: 'approved' });
          updated++;
        }
        if (log.user_id) users.add(log.user_id);
      }
      for (const uid of users) await recomputeTotal(base44, uid);
      return Response.json({ ok: true, updated, users: users.size });
    }

    if (action !== 'approve' && action !== 'reject') {
      return Response.json({ error: 'Invalid action.' }, { status: 400 });
    }
    if (typeof log_id !== 'string' || !log_id) return Response.json({ error: 'Invalid request.' }, { status: 400 });

    let log = null;
    try { log = await base44.asServiceRole.entities.HourLog.get(log_id); } catch { log = null; }
    if (!log) return Response.json({ error: 'Log not found' }, { status: 404 });

    const status = action === 'approve' ? 'approved' : 'rejected';
    await base44.asServiceRole.entities.HourLog.update(log_id, { status });
    const total = log.user_id ? await recomputeTotal(base44, log.user_id) : null;
    return Response.json({ ok: true, status, total_hours: total });
  } catch (error) {
    console.error('manageHourLog error:', error);
    return Response.json({ error: 'Could not update hour log.' }, { status: 500 });
  }
});
