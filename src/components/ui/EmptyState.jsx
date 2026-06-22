import { cn } from '@/lib/utils';

export default function EmptyState({ icon: Icon, emoji, title, description, action, className }) {
  return (
    <div className={cn('text-center py-16 px-4', className)}>
      {emoji ? (
        <div className="text-5xl mb-4">{emoji}</div>
      ) : Icon ? (
        <div className="flex justify-center mb-4">
          <Icon className="w-12 h-12 text-muted-foreground/40" />
        </div>
      ) : null}
      {title && <h3 className="font-bold text-lg mb-2 text-foreground">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}