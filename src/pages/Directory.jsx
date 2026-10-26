import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import useMemberDiscovery from '@/components/members/useMemberDiscovery';
import MemberCard from '@/components/members/MemberCard';
import MemberProfileDialog from '@/components/members/MemberProfileDialog';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, Users, Clock, Calendar, UserPlus, UserCheck, MapPin, X, Heart, Activity, Map, ArrowRight, MessageCircle } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import LocationMap from '@/components/LocationMap';
import CategoryFilterDropdown from '@/components/CategoryFilterDropdown';

const CAUSES = ['Companionship', 'Food', 'Home', 'Skill Sharing', 'Technology', 'Transportation'];

const CAUSE_COLORS = {
  'Food': 'bg-yellow-100 text-yellow-800',
  'Companionship': 'bg-orange-100 text-orange-800',
  'Home': 'bg-gray-100 text-gray-800',
  'Skill Sharing': 'bg-pink-100 text-pink-800',
  'Technology': 'bg-indigo-100 text-indigo-800',
  'Transportation': 'bg-blue-100 text-blue-800',
};

const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

function ActivityFeed({ hourLogs, userMap, profiles }) {
  const profileMap = useMemo(() => Object.fromEntries(profiles.map(p => [p.user_id, p])), [profiles]);

  const items = useMemo(() =>
    [...hourLogs]
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 20)
      .map(log => ({
        ...log,
        user: userMap[log.user_id],
        profile: profileMap[log.user_id],
      }))
      .filter(item => item.user),
    [hourLogs, userMap, profileMap]
  );

  if (items.length === 0) return (
    <div className="text-center py-10 bg-card rounded-2xl border border-border">
      <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">No recent activity yet.</p>
    </div>
  );

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center gap-2">
        <Activity className="w-4 h-4 text-accent" />
        <h2 className="font-display text-lg font-bold">Recent Community Activity</h2>
      </div>
      <div className="divide-y divide-border">
        {items.map(item => {
          const avi = item.profile?.avatar_url;
          const name = item.user?.full_name || 'Volunteer';
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-4">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                {avi ? <img src={avi} alt="" className="w-full h-full object-cover" /> : initials(name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{name}</span>
                  {' '}logged <span className="font-semibold text-accent">{item.hours}h</span> for{' '}
                  <span className="font-medium">{item.activity_name}</span>
                </p>
                {item.cause_category && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${CAUSE_COLORS[item.cause_category] || 'bg-muted text-muted-foreground'}`}>
                    {item.cause_category}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                {item.created_date ? formatDistanceToNow(parseISO(item.created_date), { addSuffix: true }) : item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Directory() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [causeFilter, setCauseFilter] = useState('All');
  const [dropdownFilter, setDropdownFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mainTab, setMainTab] = useState('browse');
  const [viewMode, setViewMode] = useState('grid');
  const { currentUser, currentProfile, following, profiles, suggested, hourLogs, loading, error, total, hasMore, loadingMore, loadMore, retry, handleFollow, followBusy, followError } = useMemberDiscovery({ search, cause: dropdownFilter?.category || causeFilter, followingOnly: mainTab === 'following' });
  const myCauses = currentProfile?.causes || [];
  const filtered = profiles;
  const userMap = useMemo(() => Object.fromEntries(profiles.map(p => [p.user_id, p.user])), [profiles]);
  const selectedProfile = selected && ([...profiles, ...suggested].find(p => p.id === selected.id) || selected);
  const tabs = [
    { id: 'browse', label: t('Browse All') },
    { id: 'following', label: `${t('Following')} (${following.length})` },
    { id: 'activity', label: t('Activity Feed') },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">{t('Member Discovery')}</h1>
        <p className="text-muted-foreground text-sm">{t('Browse volunteers, see shared causes, and connect with your community')}</p>
      </div>
      {!loading && !currentUser && <p className="mb-5 rounded-xl border border-border bg-card p-4 text-sm"><Link to="/login?returnTo=%2Fdirectory" className="font-semibold text-primary underline">{t('Sign in to follow members')}</Link></p>}
      {error && <div role="alert" className="mb-5 rounded-xl border border-destructive/30 p-4 text-sm text-destructive">{t('Could not load members.')} <button type="button" onClick={retry} className="min-h-11 px-3 font-semibold underline">{t('Try again')}</button></div>}
      {followError && <p role="alert" className="mb-4 text-sm text-destructive">{t('Could not update follow status. Please try again.')}</p>}

      {/* How it Works - 3 Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { step: '1', emoji: '🔍', title: 'Explore Members', desc: 'Search by name, location, or cause to find like-minded volunteers.' },
          { step: '2', emoji: '👤', title: 'View Profiles', desc: 'Learn about their background, impact, and shared causes with you.' },
          { step: '3', emoji: '💫', title: 'Follow & Network', desc: 'Follow members and build your community of collaborators.' },
        ].map(({ step, emoji, title, desc }) => (
          <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-xl text-center bg-card border border-border">
            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs bg-primary text-primary-foreground">{step}</div>
            <div className="text-xl">{emoji}</div>
            <h3 className="font-semibold text-xs text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Main Tabs & View Toggle */}
      <div className="flex gap-3 mb-6 items-center flex-wrap">
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mainTab === t.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
            </button>
          ))}
        </div>
        {mainTab !== 'activity' && (
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Grid view"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              title="Map view"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Activity Feed Tab */}
      {mainTab === 'activity' ? (
        loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="bg-card rounded-2xl border border-border h-16 animate-pulse" />)}</div>
        ) : (
          <ActivityFeed hourLogs={hourLogs} userMap={userMap} profiles={profiles} />
        )
      ) : viewMode === 'map' ? (
        <div className="h-96"><LocationMap items={filtered} onSelectItem={setSelected} labelKey="display_name" locationKey="location" /></div>
      ) : (
        <>
          {/* Suggested — only on browse tab */}
          {mainTab === 'browse' && suggested.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" /> {t('Members with shared causes')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {suggested.map(profile => <MemberCard key={profile.id} profile={profile} myCauses={myCauses} following={following.includes(profile.user_id)} busy={followBusy} onFollow={() => handleFollow(profile.user_id)} onView={() => setSelected(profile)} />)}
              </div>
            </div>
          )}

          {/* Search + cause filters */}
          <div className="mb-6">
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label={t('Search members')}
                placeholder={t('Search by name, cause, or location...')}
                className="w-full bg-card border border-border rounded-2xl ps-11 pe-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <FilterBar activeCount={(causeFilter !== 'All' ? 1 : 0) + (dropdownFilter ? 1 : 0)}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="sm:w-64">
                  <CategoryFilterDropdown
                    selected={dropdownFilter}
                    onSelect={(sel) => { setDropdownFilter(sel); if (sel) setCauseFilter('All'); }}
                  />
                </div>
                <div className="flex gap-1 bg-card border border-border rounded-xl p-1 flex-wrap">
                  {['All', ...CAUSES].map(c => (
                    <button key={c} onClick={() => { setCauseFilter(c); setDropdownFilter(null); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${causeFilter === c && !dropdownFilter ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                      {t(c)}
                    </button>
                  ))}
                </div>
              </div>
            </FilterBar>
          </div>

          <div className="flex items-center gap-2 mb-5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span aria-live="polite">{total ?? '…'} {t('volunteers')}</span>
            {causeFilter !== 'All' && <span>in <strong>{causeFilter}</strong></span>}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="bg-card rounded-2xl border border-border p-5 animate-pulse h-52" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <div className="text-5xl mb-4">{mainTab === 'following' ? '👥' : '🔍'}</div>
              <h3 className="font-display text-xl font-bold mb-2">{t(mainTab === 'following' ? 'Not following anyone yet' : 'No members found')}</h3>
              <p className="text-muted-foreground text-sm">{t(mainTab === 'following' ? 'Browse all members and follow people you connect with.' : 'Try adjusting your search or filter.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(profile => <MemberCard key={profile.id} profile={profile} myCauses={myCauses} following={following.includes(profile.user_id)} busy={followBusy} onFollow={() => handleFollow(profile.user_id)} onView={() => setSelected(profile)} />)}
            </div>
          )}
        </>
      )}

      {hasMore && mainTab !== 'activity' && <div className="mt-6 text-center"><button type="button" onClick={() => loadMore()} disabled={loadingMore} className="min-h-11 rounded-xl border border-border bg-card px-6 text-sm font-semibold disabled:opacity-60">{t(loadingMore ? 'Loading members...' : 'Load more members')}</button></div>}
      {selectedProfile && <MemberProfileDialog profile={selectedProfile} currentUser={currentUser} following={following} onFollow={handleFollow} onClose={() => setSelected(null)} busy={followBusy} error={followError} />}

      {/* Volunteer Pathways */}
      <section className="mt-12 -mx-4 px-4 py-14" style={{ background: '#F9F9F9', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] mb-3 block" style={{ color: '#CC6633' }}>Volunteer Pathways</span>
            <h2 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#1A1A1A' }}>Find Your Place in the Circle</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { level: 'Beginner', title: 'Community Helper', time: '2–4 hours/month', skills: 'Basic conversation, empathy', tasks: ['Help neighbors with errands', 'Provide companionship', 'Join local cleanup events', 'Share simple skills'], accentColor: '#008080', badgeColor: '#008080', badgeBg: 'rgba(0,128,128,0.1)' },
              { level: 'Intermediate', title: 'Skill Sharer', time: '6–10 hours/month', skills: 'A teachable skill or profession', tasks: ['Run a workshop or class', 'Mentor someone in your field', 'Offer rides or tech support', 'Coordinate a community event'], accentColor: '#CC6633', badgeColor: '#CC6633', badgeBg: 'rgba(204,102,51,0.1)' },
              { level: 'Advanced', title: 'Circle Leader', time: '10+ hours/month', skills: 'Leadership & organization', tasks: ['Lead a volunteer team', 'Launch a giving initiative', 'Partner with organizations', 'Represent the community'], accentColor: '#DAA520', badgeColor: '#DAA520', badgeBg: 'rgba(218,165,32,0.1)' },
            ].map(({ level, title, time, skills, tasks, accentColor, badgeColor, badgeBg }) => (
              <div key={title} className="relative p-6 rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #e0e0e0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ background: accentColor }} />
                <div className="pl-3">
                  <span className="text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: badgeBg, color: badgeColor }}>{level}</span>
                  <h3 className="text-xl font-extrabold mt-3 mb-3" style={{ color: '#1A1A1A' }}>{title}</h3>
                  <div className="text-xs space-y-1 mb-4 border-l-2 pl-3" style={{ borderColor: accentColor, color: '#555' }}>
                    <p><span className="font-bold" style={{ color: '#1A1A1A' }}>Time:</span> {time}</p>
                    <p><span className="font-bold" style={{ color: '#1A1A1A' }}>Skills:</span> {skills}</p>
                  </div>
                  <p className="text-xs font-bold mb-2" style={{ color: '#1A1A1A' }}>What You'll Do:</p>
                  <ul className="space-y-1.5">
                    {tasks.map(t => (
                      <li key={t} className="text-xs flex gap-2" style={{ color: '#555' }}>
                        <span style={{ color: accentColor }} className="flex-shrink-0">◆</span>{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/opportunities" className="inline-flex items-center gap-2 font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md" style={{ background: '#E67E22', color: '#fff' }}>
              Start Here <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="-mx-4" style={{ background: '#1A1A1A', borderTop: '3px solid #E67E22' }}>
        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: '#fff' }}>Your Time is Valuable</h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            In a world that measures worth in currency, we measure it in connection. Join hundreds of volunteers redefining community, one hour at a time.
          </p>
          {currentUser ? (
            <Link to="/profile" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#E67E22', color: '#fff' }}>
              Create Your Profile <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg" style={{ background: '#E67E22', color: '#fff' }}>
              Join Now <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}