import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

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