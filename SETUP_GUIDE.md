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
NEXT_PUBLIC_SUPABASE_URL=https://krxvirchsyuryqpffooy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_D8q3-oFyzX8i_mhHtt7Lmw_HkSr0Eym
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_D8q3-oFyzX8i_mhHtt7Lmw_HkSr0Eym
NEXTAUTH_SECRET=eternalinvite-secret-key-2024-xfg7
NEXTAUTH_URL=https://domain-anda.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LkdRRmfMJAi
```

> ⚠️ Ganti `NEXTAUTH_URL` dengan URL Vercel Anda yang sebenarnya.
> ⚠️ `ADMIN_PASSWORD` di atas adalah bcrypt hash dari password `admin123`. Ganti dengan hash baru untuk keamanan.

---

## 🗃️ Database

Jalankan file `supabase/schema.sql` di Supabase SQL Editor untuk setup database.

---

## 📱 Alur Halaman

```
/ → (cek session) → /login atau /dashboard
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
/dashboard/upgrade → upgrade ke Pro

/undangan/[slug] → halaman undangan publik
/undangan/[slug]?to=NamaTamu → undangan dengan nama tamu

/admin/login → login admin (NextAuth)
/admin/dashboard → panel admin
/dashboard/admin/transactions → kelola transaksi upgrade
```
