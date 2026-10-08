# 🚀 Panduan Setup EternalInvite

## ✅ Perbaikan yang Telah Dilakukan

1. **`middleware.ts`** - Dibuat ulang di root project (KRITIS: proteksi halaman)
2. **`types/index.ts`** - Ditambah semua field `enable_*` + fungsi `isFeatureEnabled()`
3. **`app/undangan/[slug]/page.tsx`** - Hapus semua `@ts-ignore`, fix RSVP value
4. **`components/invitation/RSVPSection.tsx`** - Fix `declined` → `not_attending`
5. **`app/page.tsx`** - Smooth loading + redirect berdasarkan session
6. **`app/(dashboard)/layout.tsx`** - Auth check + loading state
7. **`app/(auth)/layout.tsx`** - Tambahkan Toaster
8. **`app/admin/layout.tsx`** - SessionProvider untuk NextAuth
9. **`lib/supabase/server.ts`** - Kompatibel Next.js terbaru
10. **`app/(dashboard)/dashboard/page.tsx`** - Fix status `declined` → `not_attending`
11. **`.env.local`** - Sudah diisi dengan API keys

---

## 📦 Cara Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka browser
# http://localhost:3000
```

---

## 🌐 Cara Deploy ke Vercel

1. Push project ke GitHub
2. Import di vercel.com
3. Tambahkan Environment Variables berikut di Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF_ANDA.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon_key_anda
SUPABASE_SERVICE_ROLE_KEY=service_role_key_anda
NEXTAUTH_SECRET=ganti_dengan_string_acak_panjang
NEXTAUTH_URL=https://domain-anda.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=bcrypt_hash_password_admin
```

> ⚠️ Ganti `NEXT_PUBLIC_SUPABASE_URL` dengan URL proyek Supabase Anda yang **aktif** (cek di Supabase → Settings → API). URL lama yang sudah dihapus akan menyebabkan error `ERR_NAME_NOT_RESOLVED` saat daftar/login.
> ⚠️ Ganti `NEXTAUTH_URL` dengan URL Vercel Anda yang sebenarnya.
> ⚠️ `ADMIN_PASSWORD` wajib berupa bcrypt hash, bukan password polos. Buat hash baru; jangan pakai contoh di repositori.
> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai server (approve transaksi). Jangan pernah dipakai di kode client.

---

## 🗃️ Database

1. Jalankan file `supabase/schema.sql` di Supabase SQL Editor untuk setup database awal (tabel, RLS, trigger, bucket Storage).
2. Jika database sudah ada dari versi sebelumnya, jalankan `supabase/migration_v3.sql` (idempoten) untuk menambah kolom baru, memperketat RLS ucapan/RSVP, dan membuat bucket `payment_proofs` privat.

---

## 📱 Alur Halaman

```
/ → landing page publik (produk)
/login → masukkan email & password Supabase
/register → daftar akun baru
/forgot-password → kirim email reset
/reset-password → atur password baru

/dashboard → overview statistik
/dashboard/undangan → kelola daftar undangan
/dashboard/undangan/baru → buat undangan baru (wizard 7 langkah)
/dashboard/undangan/[id]/edit → edit undangan
/dashboard/undangan/[id]/tamu → kelola tamu per undangan
/dashboard/tamu → semua tamu
/dashboard/kustomisasi → tema, warna, galeri, musik
/dashboard/pesan → buku tamu & moderasi
/dashboard/hadiah → rekening hadiah digital
/dashboard/pengaturan → profil & password
/dashboard/upgrade → upgrade ke Premium (Rp 30.000 / 90 hari)

/undangan/[slug] → halaman undangan publik
/undangan/[slug]?to=NamaTamu → undangan dengan nama tamu

/admin/login → login admin (NextAuth)
/admin/dashboard → panel admin
/admin/transactions → kelola transaksi upgrade (approve/reject)
```
