import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Entity automation handler: fires when a ShabbatMeal is updated.
// When a meal transitions to "completed", prompt each guest to review the host.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const caller = await base44.auth.me();
    if (!caller) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (!['admin', 'moderator'].includes(caller.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const mealId = body.meal_id || body.data?.id;
    if (!mealId) return Response.json({ error: 'Missing meal id' }, { status: 400 });

    const meal = await base44.asServiceRole.entities.ShabbatMeal.get(mealId);
    if (!meal) return Response.json({ error: 'Meal not found' }, { status: 404 });

    // Trust the stored meal record, not caller-supplied guest or host data.
    const justCompleted = meal.status === 'completed' && body.old_data?.status !== 'completed';
    if (!justCompleted) {
      return Response.json({ ok: true, skipped: 'not a completion transition' });
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
    console.error('promptMealReviews error:', error?.message, error);
    return Response.json({ error: error?.message }, { status: 500 });
  }
});