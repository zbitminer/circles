import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

// Fixed-window rate limiter backed by the admin-only RateLimit entity.
// Each hit is its own row (append-only), so concurrent requests can't overwrite each other's counts.
async function rateLimited(base44, key, max, windowMs) {
  const store = base44.asServiceRole.entities.RateLimit;
  const now = Date.now();
  const bucket = `${key}:${Math.floor(now / windowMs)}`;
  const hits = await store.filter({ key: bucket }, '-created_date', max + 1);
  if (hits.length >= max) return true;
  await store.create({ key: bucket, count: 1, window_start: new Date(now).toISOString() });
  // Occasional best-effort cleanup of rows older than a day.
  if (Math.random() < 0.05) {
    const cutoff = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    store.deleteMany({ window_start: { $lt: cutoff } }).catch(() => {});
  }
  return false;
}

function clientIp(req) {
  // Prefer platform-set headers; x-forwarded-for's first hop can be spoofed by the client.
  const cf = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip');
  if (cf) return cf.trim();
  const parts = (req.headers.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
  return parts[parts.length - 1] || 'unknown';
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