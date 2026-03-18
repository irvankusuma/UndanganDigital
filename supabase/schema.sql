-- ================================================================
-- EternalInvite - Consolidated Database Schema
-- Final Version: Optimized for SaaS and Digital Invitations
-- ================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- TABLE: profiles
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT,
  email           TEXT UNIQUE,
  phone           TEXT,
  avatar_url      TEXT,
  plan            TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'business')),
  plan_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: invitations
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.invitations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_name          TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  event_type          TEXT NOT NULL DEFAULT 'wedding' CHECK (event_type IN ('wedding', 'birthday', 'family', 'seminar', 'other')),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  
  -- Bride & Groom / Figures
  bride_name          TEXT,
  bride_father_name   TEXT,
  bride_mother_name   TEXT,
  groom_name          TEXT,
  groom_father_name   TEXT,
  groom_mother_name   TEXT,
  story               TEXT,
  
  -- Event Details
  event_date          DATE,
  event_time          TEXT,
  akad_date           DATE,
  akad_time           TEXT,
  akad_location       TEXT,
  reception_date      DATE,
  reception_time      TEXT,
  reception_location  TEXT,
  location_name       TEXT,
  location_address    TEXT,
  location_url        TEXT,
  location_map_url    TEXT,
  location_embed      TEXT,
  akad_location_url   TEXT,
  
  -- Design & Theme
  theme               TEXT NOT NULL DEFAULT 'elegant',
  color_hex           TEXT DEFAULT '#E8627A',
  font_title          TEXT DEFAULT 'Playfair Display',
  font_body           TEXT DEFAULT 'Poppins',
  cover_image         TEXT,
  music_url           TEXT,
  gallery_images      JSONB DEFAULT '[]'::jsonb,
  
  -- Descriptions & Greetings
  description         TEXT,
  greeting_text       TEXT,
  
  -- Feature Toggles
  enable_rsvp         BOOLEAN DEFAULT true,
  enable_wishes       BOOLEAN DEFAULT true,
  enable_gallery      BOOLEAN DEFAULT true,
  enable_gifts        BOOLEAN DEFAULT false,
  enable_music        BOOLEAN DEFAULT false,
  enable_countdown    BOOLEAN DEFAULT true,
  
  -- Legacy Toggles (if used)
  music_enabled       BOOLEAN DEFAULT false,
  gift_enabled        BOOLEAN DEFAULT false,
  wishes_enabled      BOOLEAN DEFAULT true,
  countdown_enabled   BOOLEAN DEFAULT true,

  -- Meta
  view_count          INTEGER DEFAULT 0,
  rsvp_deadline       DATE,
  max_guests          INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: guests
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.guests (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  category        TEXT NOT NULL DEFAULT 'friend' CHECK (category IN ('family', 'friend', 'coworker', 'vip', 'other')),
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('attending', 'not_attending', 'pending')),
  guest_count     INTEGER NOT NULL DEFAULT 1,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: rsvp
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rsvp (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id       UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name          TEXT NOT NULL,
  email               TEXT,
  attendance_status   TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('attending', 'not_attending', 'pending')),
  guest_count         INTEGER NOT NULL DEFAULT 1,
  message             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: wishes
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  message         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('visible', 'hidden', 'pending')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: gallery
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gallery (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  image_url       TEXT NOT NULL,
  caption         TEXT,
  order_index     INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: gift_accounts
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gift_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invitation_id   UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  bank_name       TEXT NOT NULL,
  account_number  TEXT NOT NULL,
  account_name    TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: saved_payment_methods
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.saved_payment_methods (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bank_name       TEXT NOT NULL,
    account_number  TEXT NOT NULL,
    account_name    TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- TABLE: transactions
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount      INTEGER NOT NULL,
    proof_url   TEXT,
    status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'rejected')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────
-- FUNCTIONS & TRIGGERS
-- ──────────────────────────────────────────────────────────────

-- 1. Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2. Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Invitations
CREATE POLICY "Users can manage own invitations" ON public.invitations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view active invitations" ON public.invitations FOR SELECT USING (status = 'active' OR status = 'completed');

-- 3. Guests
CREATE POLICY "Owners can manage guests" ON public.guests USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can insert guests via RSVP" ON public.guests FOR INSERT WITH CHECK (true);

-- 4. RSVP
CREATE POLICY "Public can insert rsvp" ON public.rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view rsvp" ON public.rsvp FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view rsvp by slug" ON public.rsvp FOR SELECT USING (true);

-- 5. Wishes
CREATE POLICY "Public can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view visible wishes" ON public.wishes FOR SELECT USING (status = 'visible');
CREATE POLICY "Public can view pending wishes" ON public.wishes FOR SELECT USING (status = 'pending');
CREATE POLICY "Owners can manage wishes" ON public.wishes USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);

-- 6. Gallery
CREATE POLICY "Owners can manage gallery" ON public.gallery USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);

-- 7. Gift Accounts
CREATE POLICY "Owners can manage gift accounts" ON public.gift_accounts USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view gift accounts" ON public.gift_accounts FOR SELECT USING (true);

-- 8. Transactions
-- 9. Saved Payment Methods
CREATE POLICY "Users can manage own saved payments" ON public.saved_payment_methods USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved payments" ON public.saved_payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 10. Transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ──────────────────────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id ON public.rsvp(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON public.wishes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gallery_invitation_id ON public.gallery(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gift_accounts_invitation_id ON public.gift_accounts(invitation_id);
CREATE INDEX IF NOT EXISTS idx_saved_payment_methods_user_id ON public.saved_payment_methods(user_id);
-- ──────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (Reference)
-- Run these SQL separately or via Supabase Storage UI
-- ──────────────────────────────────────────────────────────────
/*
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery', 'gallery', true),
  ('avatars', 'avatars', true),
  ('payment_proofs', 'payment_proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for 'gallery'
CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Authenticated upload gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
CREATE POLICY "Owners delete gallery" ON storage.objects FOR DELETE USING (bucket_id = 'gallery' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policies for 'payment_proofs'
CREATE POLICY "Public view payment proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment_proofs');
CREATE POLICY "Users upload own payment proofs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'payment_proofs' AND (storage.foldername(name))[1] = auth.uid()::text);
*/
