import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: 'info@circlesofgiving.org',
        subject: `Contact Form: ${form.subject}`,
        body: `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
        from_name: 'Circles of Giving'
      });
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending email:', error);
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-10 rounded-2xl" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#1A2744' }}>Thank You!</h2>
          <p style={{ color: '#6b5c3e' }}>We've received your message and will get back to you within 2 business days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="rounded-2xl p-8 mb-8 text-center" style={{ background: 'linear-gradient(135deg, #1A2744, #2d4070)', border: '2px solid #C9A84C' }}>
        <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: '#C9A84C' }} />
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: '#F5E6C0' }}>Get In Touch</h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(245,230,192,0.80)' }}>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { icon: Mail, label: 'Email', value: 'info@circlesofgiving.org', href: 'mailto:info@circlesofgiving.org' },
          { icon: Phone, label: 'Phone', value: '+972 (0) 123-456-789', href: 'tel:+972123456789' },
          { icon: MapPin, label: 'Location', value: 'Israel', href: '#' },
        ].map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href} className="rounded-2xl p-6 text-center hover:shadow-md transition-all group" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
            <Icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ color: '#C9A84C' }} />
            <h3 className="font-semibold mb-1" style={{ color: '#1A2744' }}>{label}</h3>
            <p className="text-sm" style={{ color: '#6b5c3e' }}>{value}</p>
          </a>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#1A2744' }}>Send us a Message</h2>
        <p className="text-sm mb-6" style={{ color: '#6b5c3e' }}>Fill out the form below and we'll respond as soon as possible.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Subject *</label>
            <input
              required
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30"
              placeholder="How can we help?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6b5c3e' }}>Message *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
            style={{ background: '#1A2744', color: '#F5E6C0', border: '1px solid #C9A84C' }}
          >
            <Send className="w-4 h-4" style={{ color: '#C9A84C' }} />
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold mb-6" style={{ color: '#1A2744' }}>Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'How do I get started as a volunteer?', a: 'Sign up on our platform, complete your profile, and browse volunteer opportunities. You can start contributing right away!' },
            { q: 'How do I host a Shabbat meal?', a: 'Navigate to Shabbat & Holiday Meals, click "Host a Meal," and fill in your details. Community members will see your listing and can RSVP.' },
            { q: 'Can my company participate in volunteering?', a: 'Yes! Visit our Corporate Volunteering page and submit an inquiry. We\'ll work with you to create a customized program.' },
            { q: 'How are volunteer hours tracked?', a: 'Log your hours in your Profile under Activity. You can track your total impact and generate certificates anytime.' },
          ].map(({ q, a }, idx) => (
            <div key={idx} className="rounded-2xl p-5" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#1A2744' }}>{q}</h3>
              <p className="text-sm" style={{ color: '#6b5c3e' }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}