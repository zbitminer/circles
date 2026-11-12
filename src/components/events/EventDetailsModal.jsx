import { createPortal } from 'react-dom';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { useLanguage } from '@/lib/i18n';
import EventChat from '@/components/EventChat';

export default function EventDetailsModal({
  event,
  user,
  isMod,
  fallbackImages,
  defaultImage,
  onClose,
  onRSVP,
}) {
  const { localize, t, dateLocale } = useLanguage();
  if (!event) return null;

  const attendeeCount = event.attendees?.length || 0;
  const hasCapacity = Boolean(event.capacity);
  const remainingSpots = hasCapacity ? Math.max(0, event.capacity - attendeeCount) : null;
  const full = hasCapacity && attendeeCount >= event.capacity;
  const attending = Boolean(user && event.attendees?.includes(user.id));
  const past = event.status === 'completed' || (event.status !== 'ongoing' && event.date && isPast(new Date(event.date)));

  return createPortal(
    localize(
      <div className="event-details-overlay fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={event.title}
          className="event-details-panel max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl bg-card border-[1.5px] border-primary rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={event.image_url || fallbackImages[event.cause_category] || defaultImage}
            alt={event.title}
            className="w-full aspect-video object-cover"
          />
          <div className="px-6 py-5 bg-brand-950 border-b border-primary">
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{event.cause_category}</span>
              <button aria-label="Close event details" onClick={onClose} className="event-details-close p-1 rounded-lg hover:bg-white/10">
                <X className="w-4 h-4 text-brand-50" />
              </button>
            </div>
            <h2 className="font-display text-2xl font-bold mt-2 text-brand-50">
              <span translate="no">{event.title}</span>
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-3 mb-4">
              {event.date && (
                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(event.date), 'EEEE, MMMM d, yyyy · h:mm a', { locale: dateLocale })}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <MapPin className="w-4 h-4 text-primary" />
                {event.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Users className="w-4 h-4 text-primary" />
                {attendeeCount} attending
                {hasCapacity ? (
                  <> · {event.capacity} {t('max capacity')} · {remainingSpots} {t('spots left')}</>
                ) : (
                  <> · {t('No capacity limit')}</>
                )}
              </div>
            </div>

            {event.accessibility_options?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {event.accessibility_options.map((acc) => (
                  <span key={acc} className="text-xs px-2.5 py-1 rounded-full font-medium bg-secondary text-foreground border border-primary">
                    ♿ {acc}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
              <span translate="no">{event.description}</span>
            </p>

            {isMod && (
              <div className="rounded-xl p-4 mb-4 bg-secondary border border-primary/40 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">RSVP Monitor</p>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-foreground">
                  <span>Attendee Count: {attendeeCount}</span>
                  <span>
                    {hasCapacity
                      ? `Remaining Capacity: ${remainingSpots} of ${event.capacity} ${t('spots left')}`
                      : t('No capacity limit')}
                  </span>
                </div>
              </div>
            )}

            {past ? (
              <p className="rounded-xl bg-muted p-4 text-center text-sm font-semibold text-muted-foreground">Past event · RSVPs are closed</p>
            ) : user ? (
              <button
                type="button"
                onClick={() => onRSVP(event)}
                disabled={full && !attending}
                className={`w-full py-3 font-semibold rounded-xl transition-all ${
                  attending
                    ? 'bg-secondary text-foreground border border-primary'
                    : full
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-brand-950 text-brand-50 border border-primary'
                }`}
              >
                {attending ? '✓ Cancel RSVP' : full ? 'Event is Full' : "RSVP — I'll Be There!"}
              </button>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Sign in to RSVP</p>
            )}

            <EventChat eventId={event.id} currentUser={user} />
          </div>
        </div>
      </div>
    ),
    document.body
  );
}