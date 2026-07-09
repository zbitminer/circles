-- VolunteerHub — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Maps all Base44 entities to PostgreSQL tables.

-- ========== GROUPS ==========
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  category TEXT CHECK (category IN ('Companionship','Food','Home','Skill Sharing','Technology','Transportation','Wellness','Other')),
  privacy TEXT DEFAULT 'public' CHECK (privacy IN ('public','private')),
  owner_id TEXT NOT NULL,
  owner_name TEXT,
  member_count INTEGER DEFAULT 1
);

-- ========== GROUP MEMBERSHIPS ==========
CREATE TABLE IF NOT EXISTS group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  group_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner','admin','member')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending','active'))
);

-- ========== NOTIFICATIONS ==========
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  user_id TEXT NOT NULL,
  type TEXT CHECK (type IN ('opportunity_rsvp','event_comment','sos_claimed','new_message','review_received','badge_earned','new_opportunity','review_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id TEXT,
  related_user_name TEXT,
  is_read BOOLEAN DEFAULT false
);

-- ========== EVENTS ==========
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  cause_category TEXT NOT NULL CHECK (cause_category IN ('Arts & Crafts','Personal Development','Languages','Health & Wellness','Music','Cooking','Support Groups','Other')),
  capacity INTEGER,
  image_url TEXT,
  attendees TEXT[],
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
  created_by_name TEXT
);

-- ========== OPPORTUNITIES ==========
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  organization TEXT NOT NULL,
  location TEXT,
  cause_category TEXT NOT NULL CHECK (cause_category IN ('Companionship','Food','Home','Skill Sharing','Technology','Transportation','Creative Workshops')),
  type TEXT CHECK (type IN ('In-person','Remote','Hybrid')),
  image_url TEXT,
  deadline DATE,
  capacity INTEGER,
  applicants TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active','closed','draft')),
  created_by_name TEXT,
  remarks JSONB
);

-- ========== SHABBAT MEALS ==========
CREATE TABLE IF NOT EXISTS shabbat_meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  host_name TEXT NOT NULL,
  host_id TEXT,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  seats_available INTEGER NOT NULL,
  dietary_options TEXT,
  description TEXT,
  is_holiday BOOLEAN DEFAULT false,
  holiday_name TEXT,
  guests TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open','full','cancelled'))
);

-- ========== SOS REQUESTS ==========
CREATE TABLE IF NOT EXISTS sos_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  location TEXT,
  cause_category TEXT CHECK (cause_category IN ('Companionship','Food','Home','Skill Sharing','Technology','Transportation','Other')),
  urgency_hours INTEGER CHECK (urgency_hours IN (24,48)) DEFAULT 24,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','claimed','resolved')),
  claimed_by_id TEXT,
  claimed_by_name TEXT
);

-- ========== HEALTH REQUESTS ==========
CREATE TABLE IF NOT EXISTS health_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  location TEXT,
  health_category TEXT NOT NULL CHECK (health_category IN ('medical','mental_health','wellness')),
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low','medium','high')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open','claimed','resolved')),
  claimed_by_id TEXT,
  claimed_by_name TEXT
);

-- ========== CORPORATE INQUIRIES ==========
CREATE TABLE IF NOT EXISTS corporate_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  employee_count TEXT CHECK (employee_count IN ('1-10','11-50','51-200','201-500','500+')),
  preferred_date DATE,
  cause_interests TEXT[],
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','scheduled','completed'))
);

-- ========== WORKSHOP INQUIRIES ==========
CREATE TABLE IF NOT EXISTS workshop_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  inquiry_type TEXT DEFAULT 'participate' CHECK (inquiry_type IN ('participate','lead')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('female','male')),
  location TEXT,
  language TEXT,
  other_language TEXT,
  format TEXT CHECK (format IN ('In-person','Zoom','Both')),
  zoom_link TEXT,
  workshop_categories TEXT[],
  has_studio BOOLEAN,
  studio_address TEXT,
  workshop_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','scheduled','completed'))
);

-- ========== HOUR LOGS ==========
CREATE TABLE IF NOT EXISTS hour_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  user_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  hours NUMERIC NOT NULL,
  date DATE NOT NULL,
  cause_category TEXT CHECK (cause_category IN ('Companionship','Food','Home','Skill Sharing','Technology','Transportation')),
  notes TEXT
);

-- ========== VOLUNTEER PROFILES ==========
CREATE TABLE IF NOT EXISTS volunteer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  user_id TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  causes TEXT[],
  total_hours NUMERIC DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  opportunities_completed INTEGER DEFAULT 0,
  followers TEXT[],
  following TEXT[],
  phone_visibility TEXT DEFAULT 'private' CHECK (phone_visibility IN ('public','private')),
  location_visibility TEXT DEFAULT 'public' CHECK (location_visibility IN ('public','private')),
  bio_visibility TEXT DEFAULT 'public' CHECK (bio_visibility IN ('public','private'))
);

-- ========== BADGES ==========
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  user_id TEXT NOT NULL,
  badge_name TEXT NOT NULL CHECK (badge_name IN ('first_volunteer','fifty_hours','hundred_hours','five_events','ten_events','helpful_volunteer','community_champion','trusted_host')),
  label TEXT NOT NULL,
  description TEXT,
  icon_emoji TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ
);

-- ========== REVIEWS ==========
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  reviewer_id TEXT NOT NULL,
  reviewer_name TEXT,
  reviewee_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  review_type TEXT NOT NULL CHECK (review_type IN ('shabbat_host','opportunity','volunteer')),
  related_id TEXT
);

-- ========== EVENT MESSAGES ==========
CREATE TABLE IF NOT EXISTS event_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  event_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author_name TEXT,
  content TEXT NOT NULL
);

-- ========== MESSAGES ==========
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  from_user_id TEXT NOT NULL,
  from_user_name TEXT,
  to_user_id TEXT NOT NULL,
  to_user_name TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  conversation_id TEXT NOT NULL
);

-- ========== POSTS ==========
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  author_id TEXT,
  author_name TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  likes TEXT[],
  comment_count INTEGER DEFAULT 0,
  cause_tags TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active','removed','flagged')),
  reported_by TEXT[]
);

-- ========== COMMENTS ==========
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_date TIMESTAMPTZ DEFAULT now(),
  created_by_id UUID,
  post_id TEXT NOT NULL,
  author_id TEXT,
  author_name TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','removed'))
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_group_memberships_group ON group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user ON group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON opportunities(cause_category);
CREATE INDEX IF NOT EXISTS idx_sos_status ON sos_requests(status);
CREATE INDEX IF NOT EXISTS idx_health_status ON health_requests(status);
CREATE INDEX IF NOT EXISTS idx_hour_logs_user ON hour_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_user ON volunteer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_event_messages_event ON event_messages(event_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_to_user ON messages(to_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

-- ========== UPDATED_AT TRIGGER ==========
CREATE OR REPLACE FUNCTION update_updated_date()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_date = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('
      CREATE TRIGGER set_updated_date BEFORE UPDATE ON %I
      FOR EACH ROW EXECUTE FUNCTION update_updated_date();
    ', t);
  END LOOP;
END $$;