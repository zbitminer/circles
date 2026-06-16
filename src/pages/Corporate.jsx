import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, Users, Heart, CheckCircle } from 'lucide-react';

const CAUSES = ['Transportation & Escort', 'Combating Loneliness', 'Food Preparation & Delivery', 'Technological Assistance', 'Maintenance & Home Repair', 'Learning & Skills Workshops', 'Trauma & Emotional Support', 'Community Events', 'Other'];

const BENEFITS = [
  { icon: '🤝', title: 'Team Building', desc: 'Meaningful shared experiences that strengthen employee bonds' },
  { icon: '🌍', title: 'Social Impact', desc: 'Make a real difference in Israeli communities together' },
  { icon: '📋', title: 'CSR Reporting', desc: 'We provide documentation for your CSR reports and annual reviews' },
  { icon: '🎯', title: 'Tailored Programs', desc: 'Activities matched to your team\'s skills and schedule' },
];

export default function Corporate() {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', contact_email: '', contact_phone: '',
    employee_count: '11-50', preferred_date: '', cause_interests: [], message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCause = (cause) => {
    setForm(prev => ({
      ...prev,
      cause_interests: prev.cause_interests.includes(cause)
        ? prev.cause_interests.filter(c => c !== cause)
        : [...prev.cause_interests, cause]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.CorporateInquiry.create(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-card border border-border rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">We've received your inquiry and will be in touch within 2 business days to discuss a customized volunteering program for your team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-8 mb-8 text-center">
        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-80" />
        <h1 className="font-display text-3xl font-bold mb-2">Corporate Volunteering</h1>
        <p className="text-white/80 text-lg max-w-xl mx-auto">Partner with Circles of Giving for impactful team volunteer days and CSR activities across Israel.</p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {BENEFITS.map(b => (
          <div key={b.title} className="bg-card border border-border rounded-2xl p-4 text-center">
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{b.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display text-xl font-bold mb-1">Get In Touch</h2>
        <p className="text-muted-foreground text-sm mb-6">Tell us about your company and we'll design the perfect volunteering experience.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Company Name *</label>
              <input required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Your company" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Contact Name *</label>
              <input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
              <input required type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Phone</label>
              <input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="+972..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Number of Employees</label>
              <select value={form.employee_count} onChange={e => setForm({ ...form, employee_count: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30">
                {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Preferred Date</label>
              <input type="date" value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Causes of Interest (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {CAUSES.map(c => (
                <button key={c} type="button" onClick={() => toggleCause(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.cause_interests.includes(c) ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
            <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Tell us about your team, goals, or any specific requirements..." />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" />
            {submitting ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}