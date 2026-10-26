import { useLanguage } from '@/lib/i18n';

export default function MemberStats({ profile }) {
  const { t } = useLanguage();
  return <dl className="grid grid-cols-3 gap-2">
    {[[profile.total_hours || 0, 'Hours'], [profile.events_attended || 0, 'Events'], [profile.followers?.length || 0, 'Followers']].map(([value, label]) =>
      <div key={label} className="rounded-xl bg-muted p-3 text-center"><dd className="font-bold text-foreground">{value}</dd><dt className="text-xs text-muted-foreground">{t(label)}</dt></div>)}
  </dl>;
}