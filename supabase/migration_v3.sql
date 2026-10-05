-- ================================================================
-- EternalInvite - Migration V3
-- Aman dijalankan berulang (idempotent). Jalankan di Supabase SQL Editor.
-- Isi: kolom baru invitations/profiles, perbaikan RLS, trigger anti
-- self-upgrade plan, dan bucket payment_proofs jadi PRIVATE.
-- ================================================================

-- 1. Kolom baru di invitations (dipakai form buat/edit undangan)
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_child_order TEXT;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_child_order TEXT;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_father_is_deceased BOOLEAN DEFAULT false;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_mother_is_deceased BOOLEAN DEFAULT false;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_father_is_deceased BOOLEAN DEFAULT false;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_mother_is_deceased BOOLEAN DEFAULT false;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS bride_photo TEXT;
ALTER TABLE public.invitations ADD COLUMN IF NOT EXISTS groom_photo TEXT;

-- 2. Kolom preferensi notifikasi di profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notification_prefs JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 3. Perbaiki RLS yang bocor
-- Ucapan berstatus pending TIDAK boleh terlihat publik (harus dimoderasi owner dulu)
DROP POLICY IF EXISTS "Public can view pending wishes" ON public.wishes;
-- Data RSVP tidak boleh terlihat publik
DROP POLICY IF EXISTS "Public can view rsvp by slug" ON public.rsvp;

-- 4. Cegah user meng-upgrade plan-nya sendiri lewat client
-- (hanya service role / admin API yang boleh mengubah plan)
CREATE OR REPLACE FUNCTION public.prevent_plan_self_upgrade()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.plan IS DISTINCT FROM OLD.plan OR NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at)
     AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'Tidak diizinkan mengubah plan sendiri';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS profiles_prevent_plan_self_upgrade ON public.profiles;
CREATE TRIGGER profiles_prevent_plan_self_upgrade
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.prevent_plan_self_upgrade();

-- 5. Bucket bukti pembayaran harus PRIVATE
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment_proofs', 'payment_proofs', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "Public view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users view own payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Users upload own payment proofs" ON storage.objects;

CREATE POLICY "Users view own payment proofs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'payment_proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users upload own payment proofs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'payment_proofs' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 6. Pastikan bucket gallery ada (dipakai upload foto undangan)
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated upload gallery" ON storage.objects;
CREATE POLICY "Authenticated upload gallery" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');
