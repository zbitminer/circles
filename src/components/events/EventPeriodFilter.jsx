export default function EventPeriodFilter({ period, onChange }) {
  return <div className="mb-6">
    <div role="group" aria-label="Event timeframe" className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
      {[['upcoming', 'Upcoming Events'], ['past', 'Past Events']].map(([key, label]) => <button key={key} type="button" aria-pressed={period === key} onClick={() => onChange(key)} className={`min-h-11 rounded-lg px-2 py-3 text-sm font-semibold ${period === key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>{label}</button>)}
    </div>
    <p className="mt-3 text-sm text-muted-foreground">{period === 'past' ? 'Completed events and events whose start time has passed. RSVPs are closed.' : 'Events still to come, plus events marked as ongoing. Join an event to take part.'}</p>
  </div>;
}