import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Kebijakan Privasi' }

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fffafc', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: 24, padding: '40px 32px', border: '1px solid #f3e8ee' }}>
        <Link href="/" style={{ color: '#E8627A', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>← Kembali ke Beranda</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, margin: '16px 0 8px' }}>Kebijakan Privasi</h1>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>Terakhir diperbarui: 2 Oktober 2026</p>

        <div style={{ color: '#555', fontSize: 14, lineHeight: 1.9 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>1. Data yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan data yang Anda berikan secara langsung: nama, alamat email, dan kata sandi (dalam bentuk terenkripsi) untuk pembuatan akun; detail acara pernikahan (nama pasangan, tanggal, lokasi); daftar tamu yang Anda unggah (nama, nomor WhatsApp, kategori); serta foto yang Anda unggah ke galeri undangan.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>2. Penggunaan Data</h2>
          <p>Data digunakan semata-mata untuk menjalankan fitur EternalInvite: menampilkan undangan digital Anda, mengelola RSVP dan buku tamu, mengirimkan statistik ke dashboard Anda, dan memproses upgrade paket. Kami tidak menjual data Anda kepada pihak ketiga.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>3. Data Tamu Undangan</h2>
          <p>Nama dan nomor WhatsApp tamu yang Anda masukkan adalah tanggung jawab Anda sebagai pemilik undangan. Tamu yang membuka undangan dan mengisi RSVP melakukannya secara sukarela. Ucapan pada buku tamu dapat Anda moderasi (tampilkan/sembunyikan) kapan saja.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>4. Keamanan</h2>
          <p>Data disimpan pada infrastruktur Supabase dengan Row Level Security (RLS) sehingga setiap pengguna hanya dapat mengakses datanya sendiri. Bukti pembayaran disimpan secara privat dan hanya dapat diakses oleh pengguna terkait serta administrator.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>5. Penyimpanan & Penghapusan</h2>
          <p>Data disimpan selama akun Anda aktif. Anda dapat menghapus undangan, tamu, atau akun kapan saja melalui dashboard atau dengan menghubungi kami. Setelah penghapusan akun, data terkait akan dihapus dari sistem kami.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>6. Cookie</h2>
          <p>Kami menggunakan cookie sesi yang diperlukan untuk menjaga status login Anda. Kami tidak menggunakan cookie pelacak iklan pihak ketiga.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>7. Kontak</h2>
          <p>Pertanyaan mengenai privasi dapat disampaikan melalui email dukungan yang tertera pada dashboard akun Anda.</p>
        </div>
      </div>
    </main>
  )
}
