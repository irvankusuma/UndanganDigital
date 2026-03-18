# 🔧 Daftar Perbaikan Website EternalInvite

## File yang Perlu Diganti / Ditambahkan

### 1. `middleware.ts` ← **PALING PENTING** (pindahkan ke root project)
- **Masalah**: File `proxy.ts` ada tapi Next.js butuh `middleware.ts` dengan export `middleware` (bukan `proxy`)
- **Dampak**: Tanpa ini, semua proteksi halaman tidak berfungsi — siapa saja bisa akses `/dashboard` tanpa login
- **Solusi**: Copy isi `middleware.ts` ini ke root project (sejajar dengan `package.json`)

---

### 2. `app/(auth)/reset-password/page.tsx` ← **BARU**
- **Masalah**: Halaman ini direferensikan di `forgot-password` tapi tidak ada
- **Dampak**: Link reset password dari email akan error 404
- **Solusi**: Tambahkan file ini

---

### 3. `types/index.ts` ← **DIPERBARUI**
- **Masalah**: Interface `Invitation` tidak punya field `enable_*` dan beberapa field opsional lainnya
- **Dampak**: TypeScript error, `// @ts-ignore` comments, behaviour toggle tidak konsisten
- **Solusi**: Gunakan file types baru yang support kedua naming (`wishes_enabled` dan `enable_wishes`)

---

### 4. `app/undangan/[slug]/page.tsx` ← **DIPERBARUI**
- **Masalah**: 
  - Banyak `// @ts-ignore` karena type mismatch
  - RSVP attendance value `'declined'` tidak ada di DB constraint (harus `'not_attending'`)
  - Feature toggle tidak cek kedua nama kolom
- **Solusi**: File baru tanpa `@ts-ignore`, RSVP fix, toggle check fix

---

### 5. `app/(dashboard)/layout.tsx` ← **DIPERBARUI**
- **Masalah**: Tidak ada redirect ke login jika `user` null saat component mount
- **Solusi**: Tambahkan `router.push('/login')` jika tidak ada user

---

### 6. `components/dashboard/Sidebar.tsx` ← **DIPERBARUI**
- **Masalah**: Link Admin Panel tidak ada di sidebar padahal page-nya ada
- **Solusi**: Tambahkan link ke `/dashboard/admin/transactions`

---

### 7. `app/page.tsx` ← **DIPERBARUI**
- **Masalah**: Hanya `redirect()` server-side tanpa loading state
- **Solusi**: Client-side check + animasi loading yang lebih smooth

---

### 8. `components/invitation/RSVPSection.tsx` ← **DIPERBARUI**
- **Masalah**: Button "Berhalangan" set attendance ke `'declined'` tapi DB constraint butuh `'not_attending'`
- **Solusi**: Ganti value jadi `'not_attending'`

---

## Cara Deploy ke Vercel

Setelah semua file diganti, pastikan environment variables berikut ada di Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...  # atau NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://domain-anda.vercel.app
ADMIN_USERNAME=...
ADMIN_PASSWORD=... (bcrypt hash)
```

## Struktur File Output

```
middleware.ts                              → root project
app/
  page.tsx                                → root redirect page
  (auth)/
    reset-password/
      page.tsx                            → halaman baru
  (dashboard)/
    layout.tsx                            → fixed auth redirect
  undangan/
    [slug]/
      page.tsx                            → fixed types & RSVP
components/
  dashboard/
    Sidebar.tsx                           → added admin link
  invitation/
    RSVPSection.tsx                       → fixed attendance value
types/
  index.ts                                → added missing fields
```
