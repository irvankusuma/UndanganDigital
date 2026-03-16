-- ──────────────────────────────────────────────────────────────
-- MIGRATION: 002_sync_schema
-- Tujuan: Sinkronisasi skema dengan kebutuhan frontend & fitur SaaS
-- ──────────────────────────────────────────────────────────────

-- 1. Rename primary_color ke color_hex (agar konsisten dengan frontend)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invitations' AND column_name = 'primary_color') THEN
    ALTER TABLE invitations RENAME COLUMN primary_color TO color_hex;
  END IF;
END $$;

-- 2. Tambahkan kolom gallery_images (TEXT ARRAY) di invitations
-- Ini memungkinkan penyimpanan galeri simpel dalam satu field jika diperlukan
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invitations' AND column_name = 'gallery_images') THEN
    ALTER TABLE invitations ADD COLUMN gallery_images TEXT[] DEFAULT '{}';
  END IF;
END $$;

-- 3. Update RLS: Pastikan publik bisa melihat undangan 'active'
-- Kita drop dulu policy yang lama jika ada (berdasarkan nama di 001_initial_schema.sql)
DROP POLICY IF EXISTS "Anyone can view active invitations" ON invitations;

CREATE POLICY "Anyone can view active invitations"
  ON invitations FOR SELECT
  USING (status = 'active' OR status = 'completed');

-- 4. Update RLS Guest: Pastikan siapa saja bisa input (RSVP/Tamu)
-- (Sudah ada di 001, tapi kita pertegas jika perlu)

-- 5. Tambahkan kolom wishes_enabled, gallery_enabled dll jika belum ada
-- (Di 001 sudah ada guestbook_enabled, gallery_enabled, dll)
-- Kita cek gallery_enabled di 001 vs wishes_enabled di seeder kita
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invitations' AND column_name = 'wishes_enabled') THEN
    ALTER TABLE invitations ADD COLUMN wishes_enabled BOOLEAN DEFAULT TRUE;
  END IF;
END $$;
