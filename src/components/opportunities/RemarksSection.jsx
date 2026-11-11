import { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { MessageSquare, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

export default function RemarksSection({ opportunity, user, onUpdate }) {
  const { localize, dateLocale } = useLanguage();
  const [remarks, setRemarks] = useState(opportunity.remarks || []);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const response = await base44.functions.invoke('addOpportunityRemark', { opportunity_id: opportunity.id, content: text.trim() });
      setRemarks(response.data?.remarks || remarks);
      setText('');
      onUpdate?.();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Could not post remark.');
    } finally {
      setSubmitting(false);
    }
  };

  const initials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return localize(
    <div className="mt-4 pt-4 border-t" style={{ borderColor: '#bd4c0f' }}>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4" style={{ color: '#141414' }} />
        <h4 className="font-semibold text-sm" style={{ color: '#141414' }}>Remarks ({remarks.length})</h4>
      </div>

      {remarks.length > 0 && (
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {remarks.map((r, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ background: '#141414' }}>
                {initials(r.author_name)}
              </div>
              <div className="flex-1 rounded-xl px-3 py-2" style={{ background: '#fbe8d4' }}>
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-semibold" style={{ color: '#141414' }}>{r.author_name}</p>
                  {r.date && <p className="text-[10px]" style={{ color: '#6b7280' }}>{formatDistanceToNow(new Date(r.date), { addSuffix: true, locale: dateLocale })}</p>}
                </div>
                <p className="text-xs" style={{ color: '#555' }}><span translate="no">{r.content}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {user ? (
        <form onSubmit={submit} className="space-y-1">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a remark..."
              disabled={submitting}
              className="flex-1 text-sm rounded-xl px-3 py-2 outline-none border border-transparent focus:border-primary/30 disabled:opacity-50"
              style={{ background: '#fff', border: '1px solid #bd4c0f' }}
            />
            <button type="submit" disabled={submitting || !text.trim()} className="px-3 py-2 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1" style={{ background: '#141414', color: '#fbe8d4' }}>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          {error && <p className="text-xs text-destructive px-1">{error}</p>}
        </form>
      ) : (
        <p className="text-xs" style={{ color: '#6b7280' }}>Register to leave remarks.</p>
      )}
    </div>
  );
}