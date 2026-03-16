-- ==========================================
-- EternalInvite - Supabase Database Schema
-- ==========================================
-- Jalankan SQL ini di Supabase SQL Editor
-- Dashboard → SQL Editor → New Query

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE: profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'business')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: invitations
-- ==========================================
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL DEFAULT 'wedding' CHECK (event_type IN ('wedding', 'birthday', 'family', 'seminar', 'other')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'completed')),
  event_date DATE,
  akad_date DATE,
  akad_time TEXT,
  akad_location TEXT,
  reception_date DATE,
  reception_time TEXT,
  reception_location TEXT,
  bride_name TEXT,
  groom_name TEXT,
  description TEXT,
  story TEXT,
  cover_image TEXT,
  theme TEXT NOT NULL DEFAULT 'elegant' CHECK (theme IN ('elegant', 'minimalist', 'romantic', 'modern', 'garden')),
  music_url TEXT,
  music_enabled BOOLEAN NOT NULL DEFAULT false,
  gift_enabled BOOLEAN NOT NULL DEFAULT false,
  rsvp_deadline DATE,
  max_guests INTEGER,
  location_url TEXT,
  location_embed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: guests
-- ==========================================
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL DEFAULT 'friend' CHECK (category IN ('family', 'friend', 'coworker', 'vip', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('attending', 'not_attending', 'pending')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: rsvp
-- ==========================================
CREATE TABLE IF NOT EXISTS public.rsvp (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  email TEXT,
  attendance_status TEXT NOT NULL DEFAULT 'pending' CHECK (attendance_status IN ('attending', 'not_attending', 'pending')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: wishes
-- ==========================================
CREATE TABLE IF NOT EXISTS public.wishes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('visible', 'hidden', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: gallery
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: gift_accounts
-- ==========================================
CREATE TABLE IF NOT EXISTS public.gift_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE CASCADE NOT NULL,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TRIGGERS: Auto-update updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- TRIGGER: Auto-create profile on signup
-- ==========================================
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

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_accounts ENABLE ROW LEVEL SECURITY;

-- Profiles: User hanya bisa baca/edit profil sendiri
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Invitations: User hanya bisa CRUD undangan miliknya
CREATE POLICY "Users can view own invitations" ON public.invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own invitations" ON public.invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own invitations" ON public.invitations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own invitations" ON public.invitations FOR DELETE USING (auth.uid() = user_id);
-- Public dapat membaca undangan yang aktif (untuk halaman tamu)
CREATE POLICY "Public can view active invitations" ON public.invitations FOR SELECT USING (status = 'active');

-- Guests: Hanya pemilik undangan
CREATE POLICY "Owners can manage guests" ON public.guests USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);

-- RSVP: Siapa saja bisa submit, pemilik undangan bisa baca
CREATE POLICY "Public can insert rsvp" ON public.rsvp FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view rsvp" ON public.rsvp FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view rsvp by slug" ON public.rsvp FOR SELECT USING (true);

-- Wishes: Siapa saja bisa submit; pemilik bisa baca & moderasi; publik bisa baca yang visible
CREATE POLICY "Public can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view visible wishes" ON public.wishes FOR SELECT USING (status = 'visible');
CREATE POLICY "Owners can manage wishes" ON public.wishes USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);

-- Gallery: Pemilik kelola; publik bisa baca
CREATE POLICY "Owners can manage gallery" ON public.gallery USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);

-- Gift accounts: Pemilik kelola; publik bisa baca
CREATE POLICY "Owners can manage gift accounts" ON public.gift_accounts USING (
  EXISTS (SELECT 1 FROM public.invitations WHERE id = invitation_id AND user_id = auth.uid())
);
CREATE POLICY "Public can view gift accounts" ON public.gift_accounts FOR SELECT USING (true);

-- ==========================================
-- INDEXES: Performa query
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id ON public.rsvp(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON public.wishes(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gallery_invitation_id ON public.gallery(invitation_id);
CREATE INDEX IF NOT EXISTS idx_gift_accounts_invitation_id ON public.gift_accounts(invitation_id);
