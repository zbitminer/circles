import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n';
import MemberAvatar from '@/components/members/MemberAvatar';
import MemberStats from '@/components/members/MemberStats';
import FollowButton from '@/components/members/FollowButton';

export default function MemberProfileDialog({ profile, currentUser, following, onFollow, onClose, busy, error }) {
  const { t } = useLanguage();
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl">
      <DialogHeader className="space-y-3 pe-6 text-start">
        <MemberAvatar profile={profile} large />
        <DialogTitle className="break-words text-2xl">{t(profile.display_name)}</DialogTitle>
        <DialogDescription>{t('Volunteer profile')}</DialogDescription>
      </DialogHeader>
      {profile.location && <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{profile.location}</p>}
      <MemberStats profile={profile} />
      {profile.bio && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{profile.bio}</p>}
      {profile.causes?.length > 0 && <section><h3 className="mb-2 text-sm font-semibold">{t('Passionate about')}</h3><div className="flex flex-wrap gap-2">{profile.causes.map(cause => <span key={cause} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{t(cause)}</span>)}</div></section>}
      <div className="flex flex-wrap gap-3">
        <FollowButton following={following.includes(profile.user_id)} busy={busy} onClick={() => onFollow(profile.user_id)} />
        {currentUser && <Link to={`/messages?to=${encodeURIComponent(profile.user_id)}&name=${encodeURIComponent(profile.display_name)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold"><MessageCircle className="h-4 w-4" />{t('Message')}</Link>}
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{t('Could not update follow status. Please try again.')}</p>}
    </DialogContent>
  </Dialog>;
}