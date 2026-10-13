import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Lets a group owner approve or reject pending join requests for their (private) groups.
export default function PendingJoinRequests({ groups, onChanged }) {
  const [requests, setRequests] = useState([]);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const groupIds = groups.map((g) => g.id).join(',');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!groupIds) { setRequests([]); return; }
      const lists = await Promise.all(
        groupIds.split(',').map((id) => base44.entities.GroupMembership.filter({ group_id: id, status: 'pending' }).catch(() => []))
      );
      if (!cancelled) setRequests(lists.flat());
    };
    load();
    return () => { cancelled = true; };
  }, [groupIds]);

  if (requests.length === 0) return null;
  const groupName = (id) => groups.find((g) => g.id === id)?.name || 'your group';

  const decide = async (req, action) => {
    setBusy(req.id); setError('');
    try {
      await base44.functions.invoke('manageGroupMembership', { action, group_id: req.group_id, membership_id: req.id });
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      onChanged?.();
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not update this request.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="mb-6 rounded-2xl p-4" style={{ background: '#fff', border: '1.5px solid #C99738' }}>
      <h2 className="font-display text-lg font-bold mb-3" style={{ color: '#1A1A1A' }}>Pending join requests ({requests.length})</h2>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      <div className="divide-y divide-border">
        {requests.map((req) => (
          <div key={req.id} className="flex items-center justify-between gap-3 py-2">
            <p className="text-sm min-w-0 truncate"><strong>{req.user_name || 'A member'}</strong> wants to join <strong>{groupName(req.group_id)}</strong></p>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => decide(req, 'approve')} disabled={busy === req.id} className="text-xs px-3 py-1 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50">Approve</button>
              <button onClick={() => decide(req, 'remove')} disabled={busy === req.id} className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
