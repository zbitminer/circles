import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, GraduationCap, Users, MessageSquare, Check, X, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import VerificationBadge from '@/components/VerificationBadge';

const SKILL_AREAS = ['Technology', 'Career Guidance', 'Life Skills', 'Business', 'Creative Arts', 'Language Learning', 'Health & Wellness', 'Education', 'Other'];

export default function Mentorship() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('browse'); // 'browse' | 'mine'
  const [skillFilter, setSkillFilter] = useState('All');
  const [requestModal, setRequestModal] = useState(null);
  const [requestMsg, setRequestMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [u, allProfiles, allUsers] = await Promise.all([
      base44.auth.me().catch(() => null),
      base44.entities.VolunteerProfile.list('-total_hours', 50),
      base44.entities.User.list(),
    ]);
    setUser(u);
    setUsers(allUsers);
    setProfiles(allProfiles);
    if (u) {
      const mine = allProfiles.find(p => p.user_id === u.id);
      setProfile(mine);
      const myMatches = await base44.entities.MentorshipMatch.filter({}).catch(() => []);
      setMatches(myMatches);
    }
    setLoading(false);
  };

  const userMap = Object.fromEntries(users.map(u => [u.id, u]));

  // Potential mentors = profiles with 10+ hours or verified
  const potentialMentors = profiles
    .filter(p => p.user_id !== user?.id)
    .filter(p => (p.total_hours >= 10 || p.opportunities_completed >= 5))
    .filter(p => skillFilter === 'All' || p.causes?.some(c => c.toLowerCase().includes(skillFilter.toLowerCase())) || p.bio?.toLowerCase().includes(skillFilter.toLowerCase()))
    .slice(0, 12);

  const myMatchesFiltered = matches.filter(m => m.mentor_id === user?.id || m.mentee_id === user?.id);

  const sendRequest = async () => {
    if (!requestModal || !user) return;
    setSubmitting(true);
    try {
      const mentorUser = userMap[requestModal.user_id];
      await base44.entities.MentorshipMatch.create({
        mentor_id: requestModal.user_id,
        mentor_name: mentorUser?.full_name || 'Mentor',
        mentee_id: user.id,
        mentee_name: user.full_name,
        skill_area: skillFilter === 'All' ? 'General' : skillFilter,
        message: requestMsg,
        status: 'requested',
      });
      toast({ title: 'Request sent!', description: 'Your mentorship request has been sent.' });
      setRequestModal(null);
      setRequestMsg('');
      loadData();
    } catch (err) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const updateMatchStatus = async (matchId, status) => {
    await base44.entities.MentorshipMatch.update(matchId, { status });
    loadData();
    toast({ title: 'Updated', description: `Mentorship ${status}.` });
  };

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="w-4 h-4" /> Home
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Mentorship Program</h1>
          <p className="text-sm text-muted-foreground">Connect with experienced community members for guidance & growth</p>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 mb-8">
        {[
          { step: '1', emoji: '🔍', title: 'Find a Mentor', desc: 'Browse experienced volunteers by skill area.' },
          { step: '2', emoji: '✉️', title: 'Send a Request', desc: 'Share your goals and what you hope to learn.' },
          { step: '3', emoji: '🤝', title: 'Start Learning', desc: 'Connect and grow together on your journey.' },
        ].map(({ step, emoji, title, desc }) => (
          <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-card border border-border">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-primary text-primary-foreground">{step}</div>
            <div className="text-xl">{emoji}</div>
            <h3 className="font-semibold text-xs text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab('browse')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'browse' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          Find Mentors
        </button>
        <button onClick={() => setTab('mine')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'mine' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
          My Mentorships ({myMatchesFiltered.length})
        </button>
      </div>

      {tab === 'browse' ? (
        <>
          {/* Skill filter */}
          <div className="flex gap-1.5 flex-wrap mb-6">
            {['All', ...SKILL_AREAS].map(s => (
              <button key={s} onClick={() => setSkillFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${skillFilter === s ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border hover:border-primary/40'}`}>
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-2xl border border-border p-5 h-52 animate-pulse" />)}
            </div>
          ) : potentialMentors.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <h3 className="font-bold text-foreground mb-1">No mentors available</h3>
              <p className="text-sm text-muted-foreground">Try a different skill area or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {potentialMentors.map(p => {
                const mentorUser = userMap[p.user_id] || {};
                return (
                  <div key={p.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-primary px-5 pt-5 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                          {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full object-cover" /> : initials(mentorUser.full_name)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <h3 className="font-semibold text-sm text-white leading-tight truncate">{mentorUser.full_name || 'Mentor'}</h3>
                            <VerificationBadge profile={p} user={mentorUser} />
                          </div>
                          {p.location && <p className="text-xs text-primary-foreground/70">📍 {p.location}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="px-5 pt-4 pb-5">
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="text-center bg-muted rounded-xl py-2">
                          <p className="font-bold text-sm">{p.total_hours || 0}</p>
                          <p className="text-xs text-muted-foreground">hrs</p>
                        </div>
                        <div className="text-center bg-muted rounded-xl py-2">
                          <p className="font-bold text-sm">{p.opportunities_completed || 0}</p>
                          <p className="text-xs text-muted-foreground">completed</p>
                        </div>
                      </div>
                      {p.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.bio}</p>}
                      {p.causes?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {p.causes.slice(0, 3).map(c => (
                            <span key={c} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">{c}</span>
                          ))}
                        </div>
                      )}
                      {user ? (
                        <button
                          onClick={() => setRequestModal(p)}
                          className="w-full text-xs py-2 rounded-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Request Mentorship
                        </button>
                      ) : (
                        <Link to="/register" className="w-full text-xs py-2 rounded-lg font-semibold bg-accent text-white text-center block hover:opacity-90">
                          Register to Connect
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* My Mentorships */
        <div className="space-y-3">
          {myMatchesFiltered.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <h3 className="font-bold text-foreground mb-1">No mentorship matches yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse mentors and send your first request!</p>
              <button onClick={() => setTab('browse')} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Find Mentors <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            myMatchesFiltered.map(m => {
              const isMentor = m.mentor_id === user?.id;
              const otherName = isMentor ? m.mentee_name : m.mentor_name;
              const statusColors = {
                requested: 'bg-amber-100 text-amber-800',
                accepted: 'bg-blue-100 text-blue-800',
                active: 'bg-green-100 text-green-800',
                completed: 'bg-gray-100 text-gray-800',
                declined: 'bg-red-100 text-red-800',
              };
              return (
                <div key={m.id} className="flex items-start justify-between p-5 rounded-2xl bg-card border border-border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-foreground">{otherName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[m.status]}`}>{m.status}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{m.skill_area}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {isMentor ? 'They requested you as a mentor' : 'You requested them as a mentor'}
                    </p>
                    {m.message && <p className="text-xs text-muted-foreground italic">"{m.message}"</p>}
                    {m.goals && <p className="text-xs text-muted-foreground mt-1">Goals: {m.goals}</p>}
                  </div>
                  {isMentor && m.status === 'requested' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateMatchStatus(m.id, 'accepted')} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100" title="Accept">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => updateMatchStatus(m.id, 'declined')} className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Decline">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {!isMentor && m.status === 'active' && (
                    <button onClick={() => updateMatchStatus(m.id, 'completed')} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-muted text-muted-foreground hover:bg-muted/70">
                      Mark Complete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Request Modal */}
      {requestModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRequestModal(null)}>
          <div className="bg-card rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-primary px-6 py-5">
              <h2 className="font-bold text-lg text-primary-foreground">Request Mentorship</h2>
              <p className="text-sm text-primary-foreground/80">with {userMap[requestModal.user_id]?.full_name || 'this mentor'}</p>
            </div>
            <div className="p-6">
              <label className="block text-xs font-medium text-muted-foreground mb-2">Tell them what you'd like to learn:</label>
              <textarea
                value={requestMsg}
                onChange={e => setRequestMsg(e.target.value)}
                rows={4}
                placeholder="Hi! I'm interested in learning about... My goals are..."
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none border border-transparent focus:border-primary/30 resize-none"
              />
              <div className="flex gap-2 justify-end mt-4">
                <button onClick={() => setRequestModal(null)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                <button onClick={sendRequest} disabled={submitting || !requestMsg.trim()} className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
                  {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</> : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}