import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Minimal admin review queue for volunteer hour logs.
export default function AdminHoursTab({ users = [] }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.HourLog.list('-date', 500);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const nameFor = (id) => users.find((u) => u.id === id)?.full_name || 'Unknown';

  const review = async (log, action) => {
    setBusy(log.id);
    try {
      const res = await base44.functions.invoke('manageHourLog', { action, log_id: log.id });
      const status = res.data?.status || (action === 'approve' ? 'approved' : 'rejected');
      setLogs((prev) => prev.map((l) => (l.id === log.id ? { ...l, status } : l)));
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Could not update log.');
    } finally {
      setBusy(null);
    }
  };

  const backfill = async () => {
    if (!window.confirm('Mark all existing logs without a status as approved and recompute totals?')) return;
    setBusy('backfill');
    try {
      const res = await base44.functions.invoke('manageHourLog', { action: 'backfill' });
      setMessage(`Marked ${res.data?.updated ?? 0} legacy logs as approved.`);
      await load();
    } catch (err) {
      setMessage(err?.response?.data?.error || 'Backfill failed.');
    } finally {
      setBusy(null);
    }
  };

  const pending = logs.filter((l) => (l.status || 'legacy') === 'pending');
  const legacy = logs.filter((l) => !l.status).length;

  if (loading) return <div className="animate-pulse h-32 bg-card rounded-xl border border-border" />;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-2 flex-wrap">
        <h2 className="font-display text-lg font-bold">Hour logs awaiting approval ({pending.length})</h2>
        {legacy > 0 && (
          <button onClick={backfill} disabled={busy === 'backfill'} className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">
            Approve {legacy} legacy logs
          </button>
        )}
      </div>
      {message && <p className="px-6 pt-3 text-sm text-muted-foreground">{message}</p>}
      {pending.length === 0 ? (
        <p className="px-6 py-8 text-center text-sm text-muted-foreground">No pending hour logs.</p>
      ) : (
        <div className="divide-y divide-border">
          {pending.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-6 py-3 gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{nameFor(log.user_id)} · {log.hours}h · {log.activity_name}</p>
                <p className="text-xs text-muted-foreground truncate">{log.date} {log.cause_category ? `· ${log.cause_category}` : ''} {log.notes ? `· ${log.notes}` : ''}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => review(log, 'approve')} disabled={busy === log.id} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50">Approve</button>
                <button onClick={() => review(log, 'reject')} disabled={busy === log.id} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
