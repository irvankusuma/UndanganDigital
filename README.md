# EternalInvite — Platform Undangan Pernikahan Digital

Platform SaaS untuk membuat dan mengelola undangan pernikahan digital: halaman undangan publik yang indah (5 tema), RSVP, buku tamu dengan moderasi, galeri, musik, kado digital, dan dashboard manajemen tamu.

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS 4**
- **Supabase** — Auth, Postgres (RLS), Storage
- **NextAuth v4** (Credentials) — khusus panel admin
- **framer-motion**, **lucide-react**, **react-hot-toast**

## Menjalankan Lokal

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build produksi
npm start        # jalankan hasil build
```

## Variabel Environment (`.env.local`)

| Variabel | Kegunaan |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key untuk operasi admin (jangan pernah diekspos ke client) |
| `NEXTAUTH_SECRET` | Secret JWT NextAuth |
| `NEXTAUTH_URL` | Base URL aplikasi, mis. `http://localhost:3000` |
| `ADMIN_USERNAME` | Username login panel admin |
| `ADMIN_PASSWORD` | Password login panel admin |

> Jika `NEXT_PUBLIC_SUPABASE_URL` tidak valid, halaman register/login menampilkan peringatan dan tombol dinonaktifkan.

## Setup Database

1. Buat proyek di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan isi `supabase/schema.sql` (membuat tabel, RLS, trigger `handle_new_user` & `prevent_plan_self_upgrade`, serta bucket Storage).
3. Jika database sudah ada dari versi sebelumnya, jalankan `supabase/migration_v3.sql` (idempoten) untuk menambah kolom baru, memperketat RLS ucapan/RSVP, dan membuat bucket `payment_proofs` privat.

### Bucket Storage
- `gallery` — publik (baca), upload oleh user terautentikasi
- `payment_proofs` — **privat**; admin melihat bukti transfer lewat signed URL

## Struktur Route Penting

| Route | Keterangan |
|---|---|
| `/` | Landing page produk |
| `/register`, `/login` | Autentikasi user |
| `/dashboard` | Ikhtisar user |
| `/dashboard/undangan` | Daftar undangan (per-user, pagination) |
| `/dashboard/tamu`, `/pesan`, `/hadiah`, `/kustomisasi` | Manajemen (mendukung multi-undangan) |
| `/dashboard/pengaturan` | Profil, kata sandi, preferensi notifikasi |
| `/undangan/[slug]` | Halaman undangan publik |
| `/admin/login` | Login admin (NextAuth) |
| `/admin/dashboard`, `/admin/transactions` | Panel admin (proteksi middleware) |
| `/api/admin/transactions` | Approve/reject pembayaran (server-side, service-role) |
| `/privacy`, `/terms` | Dokumen legal |

## Keamanan

- RLS membatasi anon hanya melihat undangan `active/completed` dan ucapan berstatus `visible`.
- Upgrade plan tidak bisa dilakukan client-side: trigger `prevent_plan_self_upgrade` menolak perubahan plan kecuali lewat `service_role`.
- Approve transaksi hanya lewat `/api/admin/transactions` dengan sesi admin + service-role key.
- Middleware (`proxy.ts`) melindungi route `/admin/*` dan `/dashboard/*`.

## Catatan

- `proxy.ts` adalah middleware aktif Next.js 16 — **jangan dihapus**.
- Harga paket Premium: **Rp 30.000 / 90 hari** (per akun, undangan tanpa batas). Tidak ada paket gratis.
