import { ShieldCheck, Clock, Award, Calendar, Star, BadgeCheck, Heart } from 'lucide-react';

/**
 * Derives trust badges from a volunteer profile's stats.
 * Purely visual — no database writes needed.
 * @param {object} profile - VolunteerProfile record (total_hours, events_attended, opportunities_completed, created_date, bio, avatar_url)
 * @param {Date} [accountDate] - optional override for account creation date
 */
export function deriveTrustBadges(profile = {}) {
  const hours = profile.total_hours || 0;
  const events = profile.events_attended || 0;
  const completed = profile.opportunities_completed || 0;
  const hasBio = !!profile.bio?.trim();
  const hasAvatar = !!profile.avatar_url;
  const createdDate = profile.created_date ? new Date(profile.created_date) : null;
  const accountAgeDays = createdDate
    ? Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const badges = [];

  // Verified Member — profile has avatar + bio (basic identity verification)
  if (hasAvatar && hasBio) {
    badges.push({
      key: 'verified',
      label: 'Verified Member',
      desc: 'Completed profile with photo and bio',
      icon: BadgeCheck,
      color: '#247D7D',
      bg: 'rgba(36,125,125,0.10)',
    });
  }

  // New Member — just joined, no significant activity yet
  if (hours === 0 && events === 0 && completed === 0) {
    badges.push({
      key: 'new',
      label: 'New Member',
      desc: 'Welcome to the community — start volunteering!',
      icon: Star,
      color: '#6b5c3e',
      bg: 'rgba(201,168,76,0.12)',
    });
  }

  // Active Volunteer — 10+ hours
  if (hours >= 10) {
    badges.push({
      key: 'active',
      label: 'Active Volunteer',
      desc: 'Logged 10+ volunteer hours',
      icon: Clock,
      color: '#D95D1A',
      bg: 'rgba(217,93,26,0.10)',
    });
  }

  // Dedicated Giver — 50+ hours
  if (hours >= 50) {
    badges.push({
      key: 'dedicated',
      label: 'Dedicated Giver',
      desc: 'Logged 50+ volunteer hours',
      icon: Heart,
      color: '#c0392b',
      bg: 'rgba(192,57,43,0.10)',
    });
  }

  // Community Pillar — 100+ hours
  if (hours >= 100) {
    badges.push({
      key: 'pillar',
      label: 'Community Pillar',
      desc: 'Logged 100+ volunteer hours — a true pillar of the community',
      icon: ShieldCheck,
      color: '#DAA520',
      bg: 'rgba(218,165,32,0.12)',
    });
  }

  // Event Regular — 5+ events attended
  if (events >= 5) {
    badges.push({
      key: 'event_regular',
      label: 'Event Regular',
      desc: 'Attended 5+ community events',
      icon: Calendar,
      color: '#7c5cbf',
      bg: 'rgba(124,92,191,0.10)',
    });
  }

  // Opportunity Completer — 3+ opportunities completed
  if (completed >= 3) {
    badges.push({
      key: 'completer',
      label: 'Opportunity Completer',
      desc: 'Completed 3+ volunteer opportunities',
      icon: Award,
      color: '#2d7a3a',
      bg: 'rgba(45,122,58,0.10)',
    });
  }

  // Trusted Member — account 30+ days old with some activity
  if (accountAgeDays >= 30 && (hours > 0 || events > 0)) {
    badges.push({
      key: 'trusted',
      label: 'Trusted Member',
      desc: 'Active for 30+ days with community contributions',
      icon: BadgeCheck,
      color: '#1A2744',
      bg: 'rgba(26,39,68,0.10)',
    });
  }

  return badges;
}

/**
 * Full badge section — shows a header + grid of earned badges.
 * Used on the Profile page.
 */
export default function TrustBadges({ profile }) {
  const badges = deriveTrustBadges(profile);

  if (badges.length === 0) return null;

  return (
    <div className="rounded-2xl p-6" style={{ background: '#FAF7EE', border: '1.5px solid #C9A84C' }}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5" style={{ color: '#1A2744' }} />
        <h2 className="font-display text-xl font-bold" style={{ color: '#1A2744' }}>Trust & Verification</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: '#6b5c3e' }}>
        Badges are earned automatically based on your volunteer hours, event attendance, and community engagement.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.map(badge => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.key}
              className="flex items-center gap-3 p-3 rounded-xl transition-transform hover:scale-[1.02]"
              style={{ background: badge.bg, border: `1px solid ${badge.color}33` }}
              title={badge.desc}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fff', border: `1px solid ${badge.color}40` }}>
                <Icon className="w-4 h-4" style={{ color: badge.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold leading-tight" style={{ color: badge.color }}>{badge.label}</p>
                <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#6b5c3e' }}>{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact badge strip — shows just icons in a row.
 * Used in Directory cards and modals where space is limited.
 */
export function TrustBadgeStrip({ profile, maxBadges = 3, className = '' }) {
  const badges = deriveTrustBadges(profile).slice(0, maxBadges);

  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {badges.map(badge => {
        const Icon = badge.icon;
        return (
          <span
            key={badge.key}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}33` }}
            title={badge.desc}
          >
            <Icon className="w-3 h-3" />
            {badge.label}
          </span>
        );
      })}
    </div>
  );
}