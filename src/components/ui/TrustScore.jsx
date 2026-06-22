import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrustScore({ hours = 0, events = 0, completed = 0, reviews = [], className }) {
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;
  const score = Math.min(100, Math.round(hours * 0.3 + events * 5 + completed * 3 + avgRating * 10));

  const tier = score >= 80 ? 'Gold' : score >= 50 ? 'Silver' : score >= 20 ? 'Bronze' : 'New';
  const color = score >= 80
    ? 'text-amber-600'
    : score >= 50
      ? 'text-slate-500'
      : score >= 20
        ? 'text-orange-600'
        : 'text-muted-foreground';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Shield className={cn('w-4 h-4', color)} />
      <span className={cn('text-sm font-bold', color)}>{tier}</span>
      <span className="text-xs text-muted-foreground">({score})</span>
    </div>
  );
}