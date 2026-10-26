import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function FollowButton({ following, busy, onClick }) {
  const { t } = useLanguage();
  const Icon = busy ? Loader2 : following ? UserCheck : UserPlus;
  return <button type="button" onClick={onClick} disabled={busy} aria-pressed={following}
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${following ? 'border border-border bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
    <Icon className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} />{t(following ? 'Following' : 'Follow')}
  </button>;
}