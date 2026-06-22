// Domain type definitions for Circles of Giving platform

export const CAUSE_CATEGORIES = [
  'Companionship',
  'Food',
  'Home',
  'Skill Sharing',
  'Technology',
  'Transportation',
  'Other',
];

export const HEALTH_CATEGORIES = ['medical', 'mental_health', 'wellness'];

export const URGENCY_LEVELS = ['low', 'medium', 'high'];

export const REQUEST_STATUS = ['open', 'claimed', 'resolved'];

export const EVENT_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export const OPPORTUNITY_STATUS = ['active', 'closed', 'draft'];

export const OPPORTUNITY_TYPES = ['In-person', 'Remote', 'Hybrid'];

export const SHABBAT_MEAL_STATUS = ['open', 'full', 'cancelled'];

export const BADGE_TYPES = [
  'first_volunteer',
  'fifty_hours',
  'hundred_hours',
  'five_events',
  'ten_events',
  'helpful_volunteer',
  'community_champion',
  'trusted_host',
];

export const NOTIFICATION_TYPES = [
  'opportunity_rsvp',
  'event_comment',
  'sos_claimed',
  'new_message',
  'review_received',
  'badge_earned',
];

export const CORPORATE_INQUIRY_STATUS = ['new', 'contacted', 'scheduled', 'completed'];