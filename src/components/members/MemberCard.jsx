import { MapPin, Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import MemberAvatar from '@/components/members/MemberAvatar';
import MemberStats from '@/components/members/MemberStats';
import FollowButton from '@/components/members/FollowButton';

export default function MemberCard({ profile, following, busy, myCauses, onFollow, onView }) {
  const { t } = useLanguage();
  const shared = myCauses.filter(cause => profile.causes?.includes(cause));
  return <article className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground">
    <button type="button" onClick={onView} aria-label={`${t('View profile')}: ${profile.display_name}`} className="flex min-w-0 items-center gap-3 rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <MemberAvatar profile={profile} />
      <div className="min-w-0"><h3 className="break-words text-lg font-bold">{t(profile.display_name)}</h3>
        {profile.location && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="break-words">{profile.location}</span></p>}
      </div>
    </button>
    {profile.bio && <p className="line-clamp-2 break-words text-sm leading-relaxed text-muted-foreground">{profile.bio}</p>}
    <MemberStats profile={profile} />
    <div className="flex flex-wrap gap-1.5">
      {shared.length > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><Heart className="h-3 w-3" />{shared.length} {t('shared causes')}</span>}
      {profile.causes?.slice(0, 3).map(cause => <span key={cause} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{t(cause)}</span>)}
    </div>
    <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
      <button type="button" onClick={onView} className="min-h-11 rounded-lg px-2 text-sm font-semibold text-primary focus-visible:ring-2 focus-visible:ring-ring">{t('View profile')}</button>
      <FollowButton following={following} busy={busy} onClick={onFollow} />
    </div>
  </article>;
}