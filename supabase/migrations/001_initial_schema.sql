-- ================================================================
-- EternalInvite - Supabase PostgreSQL Schema
-- Database untuk platform undangan digital SaaS
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- TABLE: profiles
-- Extended user profile (linked to Supabase Auth)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  plan        TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'business')),
  plan_expires_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: invitations
-- Undangan digital per user
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invitations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_name          TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  event_type          TEXT NOT NULL DEFAULT 'wedding' CHECK (event_type IN ('wedding', 'birthday', 'family', 'seminar', 'other')),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  -- Pasangan / tokoh
  bride_name          TEXT,
  groom_name          TEXT,
  story               TEXT,
  -- Tanggal & lokasi
  event_date          DATE,
  akad_date           DATE,
  akad_time           TIME,
  akad_location       TEXT,
  reception_date      DATE,
  reception_time      TIME,
  reception_location  TEXT,
  location_url        TEXT,
  -- Tema & desain
  theme               TEXT NOT NULL DEFAULT 'elegant',
  primary_color       TEXT DEFAULT '#E8627A',
  font_title          TEXT DEFAULT 'Playfair Display',
  font_body           TEXT DEFAULT 'Poppins',
  -- Konten tambahan
  description         TEXT,
  greeting_text       TEXT,
  -- Fitur toggle
  music_enabled       BOOLEAN DEFAULT FALSE,
  music_url           TEXT,
  gift_enabled        BOOLEAN DEFAULT FALSE,
  rsvp_enabled        BOOLEAN DEFAULT TRUE,
  guestbook_enabled   BOOLEAN DEFAULT TRUE,
  gallery_enabled     BOOLEAN DEFAULT TRUE,
  countdown_enabled   BOOLEAN DEFAULT TRUE,
  -- Meta
  view_count          INTEGER DEFAULT 0,
  rsvp_deadline       DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: guests
-- Daftar tamu per undangan
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  category        TEXT DEFAULT 'other' CHECK (category IN ('family', 'friend', 'coworker', 'vip', 'other')),
  guest_count     INTEGER DEFAULT 1,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('attending', 'not_attending', 'pending')),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: rsvp_responses
-- Respon konfirmasi kehadiran dari tamu
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvp_responses (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id       UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id            UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name          TEXT NOT NULL,
  attendance_status   TEXT NOT NULL CHECK (attendance_status IN ('attending', 'not_attending')),
  guest_count         INTEGER DEFAULT 1,
  message             TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: wishes
-- Ucapan / buku tamu dari tamu
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          TEXT DEFAULT 'visible' CHECK (status IN ('visible', 'pending', 'hidden')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: gallery_photos
-- Foto galeri per undangan
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  storage_path    TEXT,
  caption         TEXT,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: gift_accounts
-- Rekening / e-wallet untuk hadiah digital
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gift_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  bank_name       TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  account_name    TEXT NOT NULL,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- FUNCTIONS: Auto-update updated_at
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ──────────────────────────────────────────────────────────────
-- FUNCTION: Auto-create profile on signup
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ──────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_accounts ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only see/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- INVITATIONS: Users manage their own, public can read active ones by slug
CREATE POLICY "Users can manage own invitations"
  ON invitations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active invitations"
  ON invitations FOR SELECT
  USING (status = 'active' OR status = 'completed');

-- GUESTS: Only invitation owners can manage guests
CREATE POLICY "Invitation owners can manage guests"
  ON guests FOR ALL
  USING (invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  ));

-- RSVP: Anyone can insert (guests), owners can read
CREATE POLICY "Anyone can submit RSVP"
  ON rsvp_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Invitation owners can view RSVPs"
  ON rsvp_responses FOR SELECT
  USING (invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  ));

-- WISHES: Anyone can insert visible wishes, owners manage all
CREATE POLICY "Anyone can submit wishes"
  ON wishes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view visible wishes"
  ON wishes FOR SELECT USING (status = 'visible');

CREATE POLICY "Invitation owners can manage wishes"
  ON wishes FOR ALL
  USING (invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  ));

-- GALLERY: Anyone can view photos of active invitations
CREATE POLICY "Anyone can view gallery"
  ON gallery_photos FOR SELECT USING (
    invitation_id IN (SELECT id FROM invitations WHERE status IN ('active', 'completed'))
  );

CREATE POLICY "Owners can manage gallery"
  ON gallery_photos FOR ALL
  USING (invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  ));

-- GIFT ACCOUNTS: Public read for active invitations
CREATE POLICY "Anyone can view gift accounts"
  ON gift_accounts FOR SELECT USING (
    invitation_id IN (SELECT id FROM invitations WHERE status IN ('active', 'completed'))
  );

CREATE POLICY "Owners can manage gift accounts"
  ON gift_accounts FOR ALL
  USING (invitation_id IN (
    SELECT id FROM invitations WHERE user_id = auth.uid()
  ));

-- ──────────────────────────────────────────────────────────────
-- INDEXES: Performance optimization
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id ON rsvp_responses(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gallery_invitation_id ON gallery_photos(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gift_invitation_id ON gift_accounts(invitation_id);

-- ──────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (run these in Supabase Dashboard > Storage)
-- ──────────────────────────────────────────────────────────────
-- Run these SQL separately or via Supabase Storage UI:
/*
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery', 'gallery', true),
  ('avatars', 'avatars', true);

CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users upload gallery"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

CREATE POLICY "Owners delete gallery"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
*/
