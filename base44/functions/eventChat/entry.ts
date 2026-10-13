import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Event chat limited to event participants (attendees), the event creator, and staff.
//   { action: 'list', event_id }            -> last 100 messages
//   { action: 'send', event_id, content }   -> post a message as the caller
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, event_id, content } = await req.json().catch(() => ({}));
    if (!['list', 'send'].includes(action) || typeof event_id !== 'string' || !event_id) {
      return Response.json({ error: 'Invalid request.' }, { status: 400 });
    }

    let event = null;
    try { event = await base44.asServiceRole.entities.Event.get(event_id); } catch { event = null; }
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 });

    const isStaff = user.role === 'admin' || user.role === 'moderator';
    const isParticipant = (event.attendees || []).includes(user.id) || event.created_by_id === user.id;
    if (!isStaff && !isParticipant) {
      return Response.json({ error: 'Join this event to see and post in the chat.', not_participant: true }, { status: 403 });
    }

    const Messages = base44.asServiceRole.entities.EventMessage;
    if (action === 'list') {
      const messages = await Messages.filter({ event_id }, '-created_date', 100);
      return Response.json({ messages: messages.reverse() });
    }

    const text = typeof content === 'string' ? content.trim() : '';
    if (!text || text.length > 2000) return Response.json({ error: 'Message must be 1–2000 characters.' }, { status: 400 });
    const message = await Messages.create({
      event_id, author_id: user.id, author_name: user.full_name || 'Anonymous', content: text,
    });
    return Response.json({ message });
  } catch (error) {
    console.error('eventChat error:', error);
    return Response.json({ error: 'Chat is unavailable right now.' }, { status: 500 });
  }
});
