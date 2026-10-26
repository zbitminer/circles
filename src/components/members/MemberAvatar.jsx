import { UserRound } from 'lucide-react';

export default function MemberAvatar({ profile, large = false }) {
  const name = profile.display_name || profile.user?.full_name;
  const initials = name?.split(' ').filter(Boolean).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary font-bold text-secondary-foreground ${large ? 'h-20 w-20 text-2xl' : 'h-14 w-14 text-lg'}`}>
    {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" loading="lazy" /> : initials || <UserRound className="h-6 w-6" />}
  </div>;
}