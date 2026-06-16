import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Users, FileText, Calendar, Clock, Briefcase, Shield, Trophy, BarChart2,
  Trash2, Download, Mail, Megaphone, AlertTriangle, Building2, RefreshCw,
  CheckCircle, XCircle, UserPlus, Send, Eye
} from 'lucide-react';
import ImpactDashboard from '@/components/ImpactDashboard';
import MonthlyImpactCharts from '@/components/MonthlyImpactCharts';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

function LeaderboardTab({ profiles, users }) {
  const userMap = Object.fromEntries(users.map(u => [u.id, u]));
  const ranked = profiles
    .filter(p => (p.total_hours || 0) > 0)
    .sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0))
    .slice(0, 20);
  const maxHours = ranked[0]?.total_hours || 1;

  if (ranked.length === 0) return (
    <div className="text-center py-16 bg-card rounded-2xl border border-border">
      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="font-display text-xl font-bold mb-2">No hours logged yet</h3>
    </div>
  );

  return (
    <div className="space-y-4">
      {ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-2">
          {[ranked[1], ranked[0], ranked[2]].map((p, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const u = userMap[p.user_id];
            const initials = u?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            return (
              <div key={p.id} className={`bg-card rounded-2xl border p-4 text-center ${rank === 1 ? 'border-yellow-300 bg-yellow-50/50' : 'border-border'}`}>
                <div className="text-3xl mb-2">{MEDAL[rank]}</div>
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm mb-2 ${rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}`}>{initials}</div>
                <p className="font-semibold text-sm truncate">{u?.full_name || 'Unknown'}</p>
                <p className="font-display text-xl font-bold text-primary mt-1">{p.total_hours}h</p>
              </div>
            );
          })}
        </div>
      )}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="font-display text-lg font-bold">Volunteer Leaderboard</h2>
        </div>
        <div className="divide-y divide-border">
          {ranked.map((p, idx) => {
            const rank = idx + 1;
            const u = userMap[p.user_id];
            const initials = u?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            const pct = Math.round(((p.total_hours || 0) / maxHours) * 100);
            return (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4">
                <span className="w-8 text-center font-bold text-sm text-muted-foreground">{MEDAL[rank] || `#${rank}`}</span>
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u?.full_name || 'Unknown'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
                <span className="font-display text-lg font-bold text-primary whitespace-nowrap">{p.total_hours}h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContentTab({ onRefresh }) {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const [p, e, o] = await Promise.all([
      base44.entities.Post.list('-created_date', 100),
      base44.entities.Event.list('-created_date', 100),
      base44.entities.Opportunity.list('-created_date', 100),
    ]);
    setPosts(p);
    setEvents(e);
    setOpps(o);
    setLoading(false);
  };

  const deletePost = async (id) => {
    setDeleting(id);
    await base44.entities.Post.delete(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const deleteEvent = async (id) => {
    setDeleting(id);
    await base44.entities.Event.delete(id);
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleting(null);
  };

  const deleteOpp = async (id) => {
    setDeleting(id);
    await base44.entities.Opportunity.delete(id);
    setOpps(prev => prev.filter(o => o.id !== id));
    setDeleting(null);
  };

  const closeOpp = async (id) => {
    await base44.entities.Opportunity.update(id, { status: 'closed' });
    setOpps(prev => prev.map(o => o.id === id ? { ...o, status: 'closed' } : o));
  };

  const cancelEvent = async (id) => {
    await base44.entities.Event.update(id, { status: 'cancelled' });
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'cancelled' } : e));
  };

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-card rounded-xl border border-border" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Posts */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /><h2 className="font-display text-lg font-bold">Posts ({posts.length})</h2></div>
        </div>
        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {posts.map(p => (
            <div key={p.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{p.content?.slice(0, 80)}...</p>
                <p className="text-xs text-muted-foreground">{p.author_name} · <span className={p.status === 'removed' ? 'text-red-500' : p.status === 'flagged' ? 'text-yellow-600' : 'text-green-600'}>{p.status}</span></p>
              </div>
              <button onClick={() => deletePost(p.id)} disabled={deleting === p.id} className="ml-4 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="font-display text-lg font-bold">Events ({events.length})</h2>
        </div>
        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {events.map(e => (
            <div key={e.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.location} · <span className={e.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}>{e.status}</span></p>
              </div>
              <div className="flex gap-1 ml-4">
                {e.status !== 'cancelled' && (
                  <button onClick={() => cancelEvent(e.id)} className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">Cancel</button>
                )}
                <button onClick={() => deleteEvent(e.id)} disabled={deleting === e.id} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-accent" />
          <h2 className="font-display text-lg font-bold">Opportunities ({opps.length})</h2>
        </div>
        <div className="divide-y divide-border max-h-64 overflow-y-auto">
          {opps.map(o => (
            <div key={o.id} className="flex items-center justify-between px-6 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{o.title}</p>
                <p className="text-xs text-muted-foreground">{o.organization} · <span className={o.status === 'active' ? 'text-green-600' : 'text-muted-foreground'}>{o.status}</span></p>
              </div>
              <div className="flex gap-1 ml-4">
                {o.status === 'active' && (
                  <button onClick={() => closeOpp(o.id)} className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100">Close</button>
                )}
                <button onClick={() => deleteOpp(o.id)} disabled={deleting === o.id} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SosTab() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SosRequest.list('-created_date', 100);
    setRequests(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.SosRequest.update(id, { status });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReq = async (id) => {
    await base44.entities.SosRequest.delete(id);
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const statusColor = { open: 'text-red-600 bg-red-50', claimed: 'text-yellow-700 bg-yellow-50', resolved: 'text-green-700 bg-green-50' };

  if (loading) return <div className="animate-pulse h-32 bg-card rounded-2xl border border-border" />;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <h2 className="font-display text-lg font-bold">SOS Requests ({requests.length})</h2>
      </div>
      {requests.length === 0 ? <p className="text-center text-muted-foreground py-8 text-sm">No SOS requests.</p> : (
        <div className="divide-y divide-border">
          {requests.map(r => (
            <div key={r.id} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.contact_name} · {r.cause_category}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[r.status] || 'bg-muted text-muted-foreground'}`}>{r.status}</span>
                {r.status !== 'resolved' && (
                  <button onClick={() => updateStatus(r.id, 'resolved')} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">Resolve</button>
                )}
                <button onClick={() => deleteReq(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CorporateTab() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.CorporateInquiry.list('-created_date', 100);
    setInquiries(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await base44.entities.CorporateInquiry.update(id, { status });
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const statusColor = { new: 'bg-blue-50 text-blue-700', contacted: 'bg-yellow-50 text-yellow-700', scheduled: 'bg-purple-50 text-purple-700', completed: 'bg-green-50 text-green-700' };
  const nextStatus = { new: 'contacted', contacted: 'scheduled', scheduled: 'completed' };

  if (loading) return <div className="animate-pulse h-32 bg-card rounded-2xl border border-border" />;

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Building2 className="w-5 h-5 text-accent" />
        <h2 className="font-display text-lg font-bold">Corporate Inquiries ({inquiries.length})</h2>
      </div>
      {inquiries.length === 0 ? <p className="text-center text-muted-foreground py-8 text-sm">No corporate inquiries yet.</p> : (
        <div className="divide-y divide-border">
          {inquiries.map(inq => (
            <div key={inq.id} className="px-6 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{inq.company_name}</p>
                <p className="text-xs text-muted-foreground">{inq.contact_name} · {inq.contact_email}</p>
                <p className="text-xs text-muted-foreground">{inq.employee_count} employees · {inq.preferred_date}</p>
                {inq.message && <p className="text-xs text-muted-foreground mt-1 line-clamp-1 italic">"{inq.message}"</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[inq.status] || 'bg-muted text-muted-foreground'}`}>{inq.status}</span>
                {nextStatus[inq.status] && (
                  <button onClick={() => updateStatus(inq.id, nextStatus[inq.status])} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                    → {nextStatus[inq.status]}
                  </button>
                )}
                <a href={`mailto:${inq.contact_email}`} className="p-1.5 text-accent hover:bg-accent/10 rounded-lg">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolsTab({ users }) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState('');
  const [announcementEmail, setAnnouncementEmail] = useState('');
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setInviteMsg('');
    await base44.users.inviteUser(inviteEmail, inviteRole);
    setInviteMsg(`✓ Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviting(false);
  };

  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportUsers = () => exportCSV(users.map(u => ({ id: u.id, name: u.full_name, email: u.email, role: u.role, joined: u.created_date })), 'members.csv');

  const sendAnnouncement = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendMsg('');
    // Send to manually entered email (or extend to all users)
    await base44.integrations.Core.SendEmail({ to: announcementEmail, subject: announcementSubject, body: announcementBody, from_name: 'Circles of Giving' });
    setSendMsg('✓ Announcement sent successfully');
    setAnnouncementEmail(''); setAnnouncementSubject(''); setAnnouncementBody('');
    setSending(false);
  };

  return (
    <div className="space-y-6">
      {/* Invite User */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold">Invite Member</h2>
        </div>
        <form onSubmit={handleInvite} className="flex gap-3 flex-wrap">
          <input
            required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
            placeholder="Email address" className="flex-1 min-w-48 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30"
          />
          <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="bg-muted rounded-xl px-3 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30">
            <option value="user">Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" disabled={inviting} className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            <Send className="w-4 h-4" /> {inviting ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
        {inviteMsg && <p className="mt-2 text-sm text-green-600">{inviteMsg}</p>}
      </div>

      {/* Export Data */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-accent" />
          <h2 className="font-display text-lg font-bold">Export Data</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={exportUsers} className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" /> Members CSV
          </button>
          <button
            onClick={async () => {
              const logs = await base44.entities.HourLog.list('-date', 1000);
              exportCSV(logs, 'hour_logs.csv');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Download className="w-4 h-4" /> Hour Logs CSV
          </button>
          <button
            onClick={async () => {
              const inqs = await base44.entities.CorporateInquiry.list('-created_date', 200);
              exportCSV(inqs, 'corporate_inquiries.csv');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors"
          >
            <Download className="w-4 h-4" /> Corporate Inquiries CSV
          </button>
        </div>
      </div>

      {/* Send Announcement */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-yellow-600" />
          <h2 className="font-display text-lg font-bold">Send Announcement Email</h2>
        </div>
        <form onSubmit={sendAnnouncement} className="space-y-3">
          <input required type="email" value={announcementEmail} onChange={e => setAnnouncementEmail(e.target.value)}
            placeholder="Recipient email" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30" />
          <input required value={announcementSubject} onChange={e => setAnnouncementSubject(e.target.value)}
            placeholder="Subject" className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30" />
          <textarea required rows={4} value={announcementBody} onChange={e => setAnnouncementBody(e.target.value)}
            placeholder="Message body..." className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/30 resize-none" />
          <button type="submit" disabled={sending} className="px-6 py-2.5 bg-yellow-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
            <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
        {sendMsg && <p className="mt-2 text-sm text-green-600">{sendMsg}</p>}
      </div>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: 0, posts: 0, events: 0, opportunities: 0, hours: 0, sos: 0, corporate: 0 });
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [hourLogs, setHourLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === 'admin') loadData();
    }).catch(() => {});
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [posts, evts, opps, profs, userList, logs, sos, corp] = await Promise.all([
      base44.entities.Post.list('-created_date', 200),
      base44.entities.Event.list('-created_date', 200),
      base44.entities.Opportunity.list('-created_date', 200),
      base44.entities.VolunteerProfile.list(),
      base44.entities.User.list(),
      base44.entities.HourLog.list('-date', 500),
      base44.entities.SosRequest.list('-created_date', 100),
      base44.entities.CorporateInquiry.list('-created_date', 100),
    ]);
    const totalHours = profs.reduce((sum, p) => sum + (p.total_hours || 0), 0);
    setStats({
      users: userList.length,
      posts: posts.filter(p => p.status !== 'removed').length,
      events: evts.length,
      opportunities: opps.filter(o => o.status === 'active').length,
      hours: Math.round(totalHours),
      sos: sos.filter(r => r.status === 'open').length,
      corporate: corp.filter(c => c.status === 'new').length,
    });
    setUsers(userList);
    setProfiles(profs);
    setHourLogs(logs);
    setEvents(evts);
    setOpportunities(opps);
    setLoading(false);
  };

  const updateRole = async (userId, role) => {
    await base44.entities.User.update(userId, { role });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4" style={{ color: '#C9A84C' }} />
        <h1 className="font-display text-2xl font-bold mb-2" style={{ color: '#1A2744' }}>Admin Only</h1>
        <p style={{ color: '#6b5c3e' }}>You need admin access to view this dashboard.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Members', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Posts', value: stats.posts, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Events', value: stats.events, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Opportunities', value: stats.opportunities, icon: Briefcase, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Hours Logged', value: stats.hours, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Open SOS', value: stats.sos, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'New Corporate', value: stats.corporate, icon: Building2, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'monthly', label: '📈 Monthly Impact' },
    { id: 'impact', label: '📊 Impact' },
    { id: 'users', label: 'Users' },
    { id: 'content', label: 'Content' },
    { id: 'sos', label: '🆘 SOS' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'tools', label: '🛠 Tools' },
    { id: 'leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A2744', border: '1px solid #C9A84C' }}>
            <Shield className="w-5 h-5" style={{ color: '#F5E6C0' }} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: '#1A2744' }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: '#6b5c3e' }}>Master control panel</p>
          </div>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors hover:bg-muted" style={{ color: '#6b5c3e' }}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl p-1 mb-8 flex-wrap" style={{ background: '#FAF7EE', border: '1px solid #C9A84C' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={tab === t.id ? { background: '#1A2744', color: '#F5E6C0' } : { color: '#6b5c3e' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-2xl border border-border animate-pulse h-28" />)}
        </div>
      ) : tab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-card rounded-2xl border border-border p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="font-display text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-bold mb-4">Platform Health</h2>
            <div className="space-y-4">
              {[
                { label: 'Posts', value: stats.posts, max: 50, color: 'bg-primary' },
                { label: 'Members', value: stats.users, max: 20, color: 'bg-accent' },
                { label: 'Volunteer Hours', value: stats.hours, max: 100, color: 'bg-green-500' },
                { label: 'Open SOS Requests', value: stats.sos, max: 10, color: 'bg-red-500' },
              ].map(({ label, value, max, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : tab === 'monthly' ? (
        <MonthlyImpactCharts hourLogs={hourLogs} opportunities={opportunities} events={events} />
      ) : tab === 'impact' ? (
        <ImpactDashboard hourLogs={hourLogs} profiles={profiles} events={events} posts={[]} />
      ) : tab === 'leaderboard' ? (
        <LeaderboardTab profiles={profiles} users={users} />
      ) : tab === 'content' ? (
        <ContentTab />
      ) : tab === 'sos' ? (
        <SosTab />
      ) : tab === 'corporate' ? (
        <CorporateTab />
      ) : tab === 'tools' ? (
        <ToolsTab users={users} />
      ) : (
        /* Users tab */
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-lg font-bold">All Members ({users.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                    {u.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.full_name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    u.role === 'admin' ? 'bg-primary/10 text-primary' :
                    u.role === 'moderator' ? 'bg-purple-100 text-purple-800' :
                    'bg-muted text-muted-foreground'
                  }`}>{u.role || 'user'}</span>
                  {u.id !== user.id && (
                    <select value={u.role || 'user'} onChange={e => updateRole(u.id, e.target.value)}
                      className="text-xs bg-muted rounded-lg px-2 py-1.5 outline-none border border-transparent focus:border-primary/30">
                      <option value="user">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}