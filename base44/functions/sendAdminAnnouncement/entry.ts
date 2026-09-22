import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { to, subject, message } = await req.json();
    if (![to, subject, message].every((value) => typeof value === 'string' && value.trim())) {
      return Response.json({ error: 'Recipient, subject, and message are required.' }, { status: 400 });
    }
    if (to.length > 254 || subject.length > 150 || message.length > 5000) {
      return Response.json({ error: 'Announcement input is too long.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      return Response.json({ error: 'Enter a valid recipient email.' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: to.trim(),
      subject: subject.trim(),
      body: message.trim(),
      from_name: 'Circles of Giving',
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('sendAdminAnnouncement error:', error);
    return Response.json({ error: 'Could not send announcement.' }, { status: 500 });
  }
}