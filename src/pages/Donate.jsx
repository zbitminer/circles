import { useState } from 'react';
import { Heart, Shield, Check, CreditCard, Landmark, FileText, Wallet } from 'lucide-react';

const PAYMENT_METHODS = [
  { label: 'PayPal', icon: Wallet, desc: 'Pay securely with PayPal' },
  { label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, and more' },
  { label: 'Bank Transfer', icon: Landmark, desc: 'Direct wire transfer details' },
  { label: 'Check', icon: FileText, desc: 'Mail a check to our office' },
  { label: 'PayBox', icon: Wallet, desc: 'Quick payment via PayBox app' },
];

export default function Donate() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    receipt_name: '',
    phone: '',
    address: '',
    email: '',
    amount: '',
    currency: 'ILS',
    is_memorial: false,
    memorial_name: '',
    memorial_deceased: '',
    dedication: '',
    consent_mailing: false,
    consent_terms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border focus:border-primary/30 transition-colors";
  const labelClass = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: '#6b5c3e' };
  const borderStyle = { borderColor: '#C9A84C' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12">

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: 'rgba(217,93,26,0.08)' }}>
          <Heart className="w-8 h-8" style={{ color: '#D95D1A' }} />
        </div>
        <h1 className="font-display text-4xl font-bold mb-3" style={{ color: '#1A2744' }}>Want to Donate?</h1>
        <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#6b5c3e' }}>
          Circles of Giving operates under <strong style={{ color: '#1A2744' }}>New Seed</strong>, a registered non-profit in Israel and the United States.
          Your donation helps us provide services to everyone in need, expand our efforts, and bring welfare and assistance to more people.
        </p>
      </div>

      {/* Donation Form */}
      <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
        <h2 className="font-display text-2xl font-bold mb-1" style={{ color: '#1A2744' }}>Donation Form</h2>
        <p className="text-sm mb-6" style={{ color: '#6b5c3e' }}>So we can send you a receipt, please fill in your details below. <span style={{ color: '#D95D1A' }}>*</span> indicates required fields.</p>

        {submitted ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: '#1A2744' }}>
              <Check className="w-7 h-7" style={{ color: '#C9A84C' }} />
            </div>
            <h3 className="font-display text-xl font-bold mb-2" style={{ color: '#1A2744' }}>Thank You!</h3>
            <p className="text-sm mb-6" style={{ color: '#6b5c3e' }}>
              Your donation details have been recorded. Please complete your payment using one of the methods below.
            </p>
            <button onClick={() => setSubmitted(false)} className="text-sm font-semibold px-5 py-2.5 rounded-xl" style={{ background: '#1A2744', color: '#F5E6C0' }}>
              Submit Another Donation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>First Name <span style={{ color: '#D95D1A' }}>*</span></label>
                <input required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} style={borderStyle} placeholder="First name" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Last Name <span style={{ color: '#D95D1A' }}>*</span></label>
                <input required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} style={borderStyle} placeholder="Last name" />
              </div>
            </div>

            {/* Receipt name */}
            <div>
              <label className={labelClass} style={labelStyle}>Name to appear on the receipt <span style={{ color: '#D95D1A' }}>*</span></label>
              <input required value={form.receipt_name} onChange={e => set('receipt_name', e.target.value)} className={inputClass} style={borderStyle} placeholder="Name on receipt" />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Phone <span style={{ color: '#D95D1A' }}>*</span></label>
                <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} style={borderStyle} placeholder="Phone number" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Email <span style={{ color: '#D95D1A' }}>*</span></label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} style={borderStyle} placeholder="Email address" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass} style={labelStyle}>Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} className={inputClass} style={borderStyle} placeholder="Street, city" />
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass} style={labelStyle}>I choose to donate (amount) <span style={{ color: '#D95D1A' }}>*</span></label>
                <input required type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} className={inputClass} style={borderStyle} placeholder="e.g. 100" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Currency <span style={{ color: '#D95D1A' }}>*</span></label>
                <div className="flex gap-2">
                  {[
                    { val: 'ILS', label: '₪ Shekels' },
                    { val: 'USD', label: '$ Dollars' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('currency', val)}
                      className="flex-1 px-3 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={form.currency === val
                        ? { background: '#1A2744', color: '#F5E6C0', border: '1px solid #1A2744' }
                        : { background: '#fff', color: '#6b5c3e', border: '1px solid #C9A84C' }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Memorial Donation */}
            <div className="rounded-xl p-4" style={{ background: '#fff', border: '1px solid #C9A84C' }}>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={form.is_memorial}
                  onChange={e => set('is_memorial', e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#1A2744' }}
                />
                <span className="text-sm font-semibold" style={{ color: '#1A2744' }}>Donation in memory of someone</span>
              </label>
              {form.is_memorial && (
                <div className="space-y-3 pl-6">
                  <p className="text-xs" style={{ color: '#6b5c3e' }}>In addition to the donor's name, a dedication line will appear on the receipt:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>In memory of</label>
                      <input value={form.memorial_name} onChange={e => set('memorial_name', e.target.value)} className={inputClass} style={borderStyle} placeholder="Name" />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Of blessed memory (ז"ל)</label>
                      <input value={form.memorial_deceased} onChange={e => set('memorial_deceased', e.target.value)} className={inputClass} style={borderStyle} placeholder="e.g. 20/01/1945" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} style={labelStyle}>Dedication</label>
                    <input value={form.dedication} onChange={e => set('dedication', e.target.value)} className={inputClass} style={borderStyle} placeholder="Dedication message" />
                  </div>
                </div>
              )}
            </div>

            {/* Consents */}
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent_mailing}
                  onChange={e => set('consent_mailing', e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                  style={{ accentColor: '#1A2744' }}
                />
                <span className="text-xs leading-relaxed" style={{ color: '#6b5c3e' }}>
                  I consent to receive mailings and messages from Circles of Giving.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.consent_terms}
                  onChange={e => set('consent_terms', e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 flex-shrink-0"
                  style={{ accentColor: '#1A2744' }}
                />
                <span className="text-xs leading-relaxed" style={{ color: '#6b5c3e' }}>
                  I confirm that I have read the Terms of Use and Privacy Policy. <span style={{ color: '#D95D1A' }}>*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 font-bold text-base px-6 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: '#D95D1A', color: '#fff' }}
            >
              <Heart className="w-5 h-5" /> Submit Donation Details
            </button>
          </form>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold mb-2 text-center" style={{ color: '#1A2744' }}>Choose a Payment Method</h2>
        <p className="text-sm text-center mb-6" style={{ color: '#6b5c3e' }}>Click one of the options below to complete your donation</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map(({ label, icon: Icon, desc }) => (
            <a
              key={label}
              href="https://circlesofgiving.org/donations/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-5 rounded-xl text-center transition-all hover:shadow-md"
              style={{ background: '#fff', border: '1.5px solid #C9A84C' }}
            >
              <Icon className="w-7 h-7" style={{ color: '#1A2744' }} />
              <span className="text-[10px] leading-tight" style={{ color: '#999' }}>{desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Tax Deductible */}
      <div className="rounded-2xl p-6 mb-6 flex items-start gap-3" style={{ background: '#1A2744' }}>
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
        <div>
          <h3 className="font-semibold text-sm mb-1" style={{ color: '#F5E6C0' }}>Tax-Deductible</h3>
        </div>
      </div>

      {/* Memorial Dedication */}
      <div className="text-center pt-4 border-t" style={{ borderColor: '#e0d5b8' }}>
        <p className="text-sm leading-relaxed" style={{ color: '#6b5c3e' }}>
          <span className="text-lg mr-1">✡️</span>
          This site is dedicated to the memory of <strong style={{ color: '#1A2744' }}>Goodwin & Geraldine Steinberg</strong> and <strong style={{ color: '#1A2744' }}>Herman P. & Sophia Taubman</strong>.
        </p>
      </div>
    </div>
  );
}