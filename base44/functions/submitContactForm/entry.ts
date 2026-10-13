import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Simple fixed-window rate limiter backed by the admin-only RateLimit entity.
// Not perfectly atomic under heavy concurrency, but enough to stop casual abuse.
async function rateLimited(base44, key, max, windowMs) {
  const store = base44.asServiceRole.entities.RateLimit;
  const now = Date.now();
  const rows = await store.filter({ key });
  const row = rows[0];
  if (!row || now - new Date(row.window_start).getTime() > windowMs) {
    if (row) await store.update(row.id, { count: 1, window_start: new Date(now).toISOString() });
    else await store.create({ key, count: 1, window_start: new Date(now).toISOString() });
    return false;
  }
  if ((row.count || 0) >= max) return true;
  await store.update(row.id, { count: (row.count || 0) + 1 });
  return false;
}

function clientIp(req) {
  const fwd = req.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, subject, message } = await req.json();

    const fields = [name, email, subject, message];
    if (fields.some((value) => typeof value !== 'string' || !value.trim())) {
      return Response.json({ error: 'All contact fields are required.' }, { status: 400 });
    }
    if (name.length > 100 || email.length > 254 || subject.length > 150 || message.length > 5000) {
      return Response.json({ error: 'Contact form input is too long.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    // Throttle: 3 messages per hour per IP and per sender email.
    const windowMs = 60 * 60 * 1000;
    if (await rateLimited(base44, `contact:ip:${clientIp(req)}`, 3, windowMs) ||
        await rateLimited(base44, `contact:email:${email.trim().toLowerCase()}`, 3, windowMs)) {
      return Response.json({ error: 'Too many messages. Please try again later.' }, { status: 429 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@circlesofgiving.org',
      subject: `Contact Form: ${subject.trim()}`,
      body: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`,
      from_name: 'Circles of Giving',
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('submitContactForm error:', error);
    return Response.json({ error: 'Could not send your message.' }, { status: 500 });
  }
}