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
    donation_type: 'one_time',
    recurring_frequency: 'monthly',
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

  const inputClass = "w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border border-gray-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20 transition-all";
  const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 md:pb-12 bg-white">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-tr from-brand-orange to-rose-400 text-white shadow-lg shadow-brand-orange/20">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="font-display text-4xl font-bold mb-3 text-gray-900">Want to Donate?</h1>
        <p className="text-base leading-relaxed max-w-xl mx-auto text-gray-500">
          Circles of Giving operates under <strong className="text-gray-800">New Seed</strong>, a registered non-profit in Israel and the United States.
          Your donation helps us provide services to everyone in need, expand our efforts, and bring welfare and assistance to more people.
        </p>
      </div>

      {/* Donation Form */}
      <div className="rounded-3xl p-6 md:p-10 mb-10 bg-white border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
        {/* Colorful accent line at top */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-teal via-brand-gold to-brand-orange" />
        
        <h2 className="font-display text-2xl font-bold mb-1 text-gray-900">Donation Form</h2>
        <p className="text-sm mb-6 text-gray-500">So we can send you a receipt, please fill in your details below. <span className="text-brand-orange font-bold">*</span> indicates required fields.</p>

        {submitted ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 bg-green-50 text-green-600">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-gray-900">Thank You!</h3>
            <p className="text-sm mb-8 text-gray-500 max-w-sm mx-auto">
              Your donation details have been recorded. Please complete your payment using one of the methods below.
            </p>
            <button onClick={() => setSubmitted(false)} className="text-sm font-semibold px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors">
              Submit Another Donation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>First Name <span className="text-brand-orange">*</span></label>
                <input required value={form.first_name} onChange={e => set('first_name', e.target.value)} className={inputClass} placeholder="First name" />
              </div>
              <div>
                <label className={labelClass}>Last Name <span className="text-brand-orange">*</span></label>
                <input required value={form.last_name} onChange={e => set('last_name', e.target.value)} className={inputClass} placeholder="Last name" />
              </div>
            </div>

            {/* Receipt name */}
            <div>
              <label className={labelClass}>Name to appear on the receipt <span className="text-brand-orange">*</span></label>
              <input required value={form.receipt_name} onChange={e => set('receipt_name', e.target.value)} className={inputClass} placeholder="Name on receipt" />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Phone <span className="text-brand-orange">*</span></label>
                <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputClass} placeholder="Phone number" />
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-brand-orange">*</span></label>
                <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputClass} placeholder="Email address" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} className={inputClass} placeholder="Street, city" />
            </div>

            {/* Donation Type */}
            <div>
              <label className={labelClass}>Donation Type <span className="text-brand-orange">*</span></label>
              <div className="flex gap-3">
                {[
                  { val: 'one_time', label: 'One-Time' },
                  { val: 'recurring', label: 'Recurring' },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set('donation_type', val)}
                    className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                      form.donation_type === val
                        ? 'bg-brand-teal text-white border-brand-teal shadow-md shadow-brand-teal/20'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-teal/30 hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {form.donation_type === 'recurring' && (
                <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <label className={labelClass}>Frequency <span className="text-brand-orange">*</span></label>
                  <div className="flex gap-3">
                    {[
                      { val: 'monthly', label: 'Monthly' },
                      { val: 'yearly', label: 'Yearly' },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => set('recurring_frequency', val)}
                        className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
                          form.recurring_frequency === val
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>I choose to donate (amount) <span className="text-brand-orange">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {form.currency === 'ILS' ? '₪' : '$'}
                  </span>
                  <input required type="number" min="1" value={form.amount} onChange={e => set('amount', e.target.value)} className={`${inputClass} pl-8`} placeholder="e.g. 100" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Currency <span className="text-brand-orange">*</span></label>
                <div className="flex gap-2">
                  {[
                    { val: 'ILS', label: 'ILS' },
                    { val: 'USD', label: 'USD' },
                  ].map(({ val, label }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('currency', val)}
                      className={`flex-1 px-2 py-3 rounded-xl text-sm font-semibold transition-all border ${
                        form.currency === val
                          ? 'bg-brand-gold text-white border-brand-gold shadow-md shadow-brand-gold/20'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-gold/30 hover:bg-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Memorial Donation */}
            <div className="rounded-2xl p-5 border border-rose-100 bg-rose-50/30">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={form.is_memorial}
                  onChange={e => set('is_memorial', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-sm font-bold text-gray-800">Donation in memory of someone</span>
              </label>
              {form.is_memorial && (
                <div className="space-y-4 pt-2">
                  <p className="text-xs text-gray-500">In addition to the donor's name, a dedication line will appear on the receipt:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>In memory of</label>
                      <input value={form.memorial_name} onChange={e => set('memorial_name', e.target.value)} className={inputClass} placeholder="Name" />
                    </div>
                    <div>
                      <label className={labelClass}>Of blessed memory (ז"ל)</label>
                      <input value={form.memorial_deceased} onChange={e => set('memorial_deceased', e.target.value)} className={inputClass} placeholder="e.g. 20/01/1945" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Dedication</label>
                    <input value={form.dedication} onChange={e => set('dedication', e.target.value)} className={inputClass} placeholder="Dedication message" />
                  </div>
                </div>
              )}
            </div>

            {/* Consents */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent_mailing}
                  onChange={e => set('consent_mailing', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal mt-0.5"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I consent to receive mailings and messages from Circles of Giving.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.consent_terms}
                  onChange={e => set('consent_terms', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-brand-teal focus:ring-brand-teal mt-0.5"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I confirm that I have read the Terms of Use and Privacy Policy. <span className="text-brand-orange">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 font-bold text-base px-6 py-4 rounded-xl text-white shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] mt-4"
              style={{ background: 'linear-gradient(to right, #D95D1A, #E87130)' }}
            >
              <Heart className="w-5 h-5" /> Submit Donation Details
            </button>
          </form>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-2 text-center text-gray-900">Choose a Payment Method</h2>
        <p className="text-sm text-center mb-8 text-gray-500">Click one of the options below to complete your donation</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PAYMENT_METHODS.map(({ label, icon: Icon, desc }) => (
            <a
              key={label}
              href="https://circlesofgiving.org/donations/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center transition-all bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-brand-teal group"
            >
              <div className="p-3 rounded-full bg-brand-teal/10 text-brand-teal group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-500 leading-tight group-hover:text-gray-900 transition-colors">{desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Tax Deductible */}
      <div className="rounded-2xl p-6 mb-8 flex items-start gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-blue-900">
        <div className="p-2 rounded-full bg-blue-100 text-blue-600 mt-0.5">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1 text-blue-900">Tax-Deductible</h3>
        </div>
      </div>

      {/* Memorial Dedication */}
      <div className="text-center pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="text-lg mr-2">🕊️</span>
          This site is dedicated to the memory of <strong className="text-gray-800">Goodwin & Geraldine Steinberg</strong> and <strong className="text-gray-800">Herman P. & Sophia Taubman</strong>.
        </p>
      </div>
    </div>
  );
}