import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Entity automation handler: fires when a ShabbatMeal is updated.
// When a meal transitions to "completed", prompt each guest to review the host.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Callers: staff, the meal host (the update automation runs as them), or the automation
    // runtime (no user session). We only act on the stored meal, only when it is completed,
    // and only once per meal (dedupe below), so arbitrary calls can't spam guests.
    let caller = null;
    try { caller = await base44.auth.me(); } catch { caller = null; }
    const body = await req.json().catch(() => ({}));
    const mealId = body.meal_id || body.data?.id;
    if (!mealId) return Response.json({ error: 'Missing meal id' }, { status: 400 });

    const meal = await base44.asServiceRole.entities.ShabbatMeal.get(mealId);
    if (!meal) return Response.json({ error: 'Meal not found' }, { status: 404 });

    const isStaff = caller && ['admin', 'moderator'].includes(caller.role);
    if (caller && !isStaff && caller.id !== meal.host_id && caller.id !== meal.created_by_id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Trust the stored meal record, not caller-supplied guest or host data.
    if (meal.status !== 'completed') {
      return Response.json({ ok: true, skipped: 'meal is not completed' });
    }
    const already = await base44.asServiceRole.entities.Notification.filter(
      { related_id: meal.id, type: 'review_reminder' }, '-created_date', 1);
    if (already.length > 0) {
      return Response.json({ ok: true, skipped: 'already prompted' });
    }

    const guests = Array.isArray(meal.guests) ? meal.guests : [];
    if (guests.length === 0) {
      return Response.json({ ok: true, sent: 0, note: 'no guests' });
    }

    const hostName = meal.host_name || 'your host';
    const notifTitle = 'How was your Shabbat meal?';
    const notifMessage = `Share your experience — leave a review for ${hostName}.`;

    let sent = 0;
    for (const guestId of guests) {
      if (!guestId || guestId === meal.host_id) continue;

      await base44.asServiceRole.entities.Notification.create({
        user_id: guestId,
        type: 'review_reminder',
        title: notifTitle,
        message: notifMessage,
        related_id: meal.id,
        related_user_name: hostName,
        is_read: false,
      });
      sent++;
    }

    return Response.json({ ok: true, sent });
  } catch (error) {
    console.error('promptMealReviews error:', error);
    return Response.json({ error: 'Internal error.' }, { status: 500 });
  }
});