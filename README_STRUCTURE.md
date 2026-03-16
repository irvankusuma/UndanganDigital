# Struktur Folder Digital Undangan

Berikut adalah panduan struktur folder baru yang lebih rapi dan terorganisir:

## 📂 Folder Utama

-   **`/app`**: Berisi routing utama aplikasi (Next.js App Router).
    -   `/(auth)`: Halaman login dan daftar.
    -   `/(dashboard)`: Seluruh halaman panel manajemen user.
    -   `/undangan`: Halaman tampilan undangan untuk tamu ([slug]).

-   **`/components`**: Komponen UI yang dipisah agar file utama tidak terlalu besar (rapi).
    -   `dashboard/`: Komponen khusus dashboard (Sidebar, Header, dll).
    -   `invitation/`: Komponen khusus tampilan undangan (Hero, Gallery, RSVP, dll).
    -   `ui/`: Komponen dasar yang bisa dipakai ulang (Tombol, Input, dll).

-   **`/lib`**: Logika bisnis dan konfigurasi.
    -   `supabase/`: Client & Server Supabase.
    -   `hooks/`: Hook React kustom (seperti `useCountdown`).
    -   `utils/`: Fungsi pembantu umum (seperti `slugify`).

-   **`/scripts`**: Skrip utilitas untuk database dan pemeliharaan.
    -   `db/`: Skrip migrasi dan pengecekan kolom/storage.
    -   `seed/`: Skrip pengisian data awal (seeder).

-   **`/types`**: Definisi tipe data TypeScript.

---

## 💡 Keuntungan Struktur Ini
1.  **Mudah Dicari**: Jika ingin mengubah tampilan Undangan, cukup cari di `components/invitation`.
2.  **File Lebih Kecil**: File `page.tsx` tidak lagi berisi ribuan baris kode, sehingga loading editor lebih cepat.
3.  **Reusable**: Komponen seperti Sidebar atau MusicPlayer bisa dikelola secara terpisah tanpa mengganggu logika utama.
