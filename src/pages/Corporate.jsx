import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { Building2, Heart, CheckCircle } from 'lucide-react';
import BottomSheetSelect from '@/components/ui/BottomSheetSelect';

const CAUSES = ['Companionship', 'Food', 'Home', 'Skills Sharing', 'Technology', 'Transportation', 'Other'];

const BENEFITS = [
  { icon: '🤝', title: 'Team Building', desc: 'Meaningful shared experiences that strengthen employee bonds' },
  { icon: '🌍', title: 'Social Impact', desc: 'Make a real difference in Israeli communities together' },
  { icon: '📋', title: 'CSR Reporting', desc: 'We provide documentation for your CSR reports and annual reviews' },
  { icon: '🎯', title: 'Tailored Programs', desc: "Activities matched to your team's skills and schedule" },
];

export default function Corporate() {
  const { localize } = useLanguage();
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
    return localize(
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-10 rounded-2xl" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: '#141414' }}>Thank You!</h2>
          <p style={{ color: '#6b7280' }}>We've received your inquiry and will be in touch within 2 business days to discuss a customized volunteering program for your team.</p>
        </div>
      </div>
    );
  }

  return localize(
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Hero */}
      <div className="rounded-2xl p-8 mb-8 text-center" style={{ background: 'linear-gradient(135deg, #141414, #141414)', border: '2px solid #bd4c0f' }}>
        <Building2 className="w-12 h-12 mx-auto mb-3" style={{ color: '#bd4c0f' }} />
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: '#fbe8d4' }}>Corporate Volunteering</h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(245,230,192,0.80)' }}>Partner with Circles of Giving for impactful team volunteer days and CSR activities across Israel.</p>
      </div>

      {/* How it Works - 3 Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', emoji: '📞', title: 'Get In Touch', desc: 'Fill out our form and tell us about your team and goals.' },
          { step: '2', emoji: '🎯', title: 'Customize Program', desc: 'We design a volunteering experience tailored to your team.' },
          { step: '3', emoji: '🌍', title: 'Make Impact Together', desc: 'Execute your team volunteer day and get CSR documentation.' },
        ].map(({ step, emoji, title, desc }) => (
          <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center" style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#141414', color: '#fbe8d4' }}>{step}</div>
            <div className="text-xl">{emoji}</div>
            <h3 className="font-semibold text-xs" style={{ color: '#141414' }}>{title}</h3>
            <p className="text-xs" style={{ color: '#6b7280' }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {BENEFITS.map(b => (
          <div key={b.title} className="rounded-2xl p-4 text-center" style={{ background: '#fcfaf8', border: '1px solid #bd4c0f' }}>
            <div className="text-3xl mb-2">{b.icon}</div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#141414' }}>{b.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-2xl p-6" style={{ background: '#fcfaf8', border: '1.5px solid #bd4c0f' }}>
        <h2 className="font-display text-xl font-bold mb-1" style={{ color: '#141414' }}>Get In Touch</h2>
        <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Tell us about your company and we'll design the perfect volunteering experience.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Company Name *</label>
              <input required value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Your company" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Contact Name *</label>
              <input required value={form.contact_name} onChange={e => setForm({ ...form, contact_name: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Email *</label>
              <input required type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Phone</label>
              <input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" placeholder="+972..." />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Number of Employees</label>
              <BottomSheetSelect
                label="Number of Employees"
                value={form.employee_count}
                onChange={e => setForm({ ...form, employee_count: e.target.value })}
                options={['1-10', '11-50', '51-200', '201-500', '500+']}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Preferred Date</label>
              <input type="date" value={form.preferred_date} onChange={e => setForm({ ...form, preferred_date: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: '#6b7280' }}>Causes of Interest (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {CAUSES.map(c => (
                <button key={c} type="button" onClick={() => toggleCause(c)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={form.cause_interests.includes(c)
                    ? { background: '#141414', color: '#fbe8d4', border: '1px solid #141414' }
                    : { background: '#fbe8d4', color: '#6b7280', border: '1px solid #bd4c0f' }
                  }>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6b7280' }}>Message</label>
            <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" placeholder="Tell us about your team, goals, or any specific requirements..." />
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3.5 font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2" style={{ background: '#141414', color: '#fbe8d4', border: '1px solid #bd4c0f' }}>
            <Heart className="w-4 h-4" style={{ color: '#bd4c0f' }} />
            {submitting ? 'Sending...' : 'Submit Inquiry'}
          </button>
        </form>
      </div>
    </div>
  );
}