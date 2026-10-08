import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Syarat & Ketentuan' }

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fffafc', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: 24, padding: '40px 32px', border: '1px solid #f3e8ee' }}>
        <Link href="/" style={{ color: '#E8627A', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>← Kembali ke Beranda</Link>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 800, margin: '16px 0 8px' }}>Syarat & Ketentuan</h1>
        <p style={{ fontSize: 13, color: '#aaa', marginBottom: 32 }}>Terakhir diperbarui: 2 Oktober 2026</p>

        <div style={{ color: '#555', fontSize: 14, lineHeight: 1.9 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>1. Layanan</h2>
          <p>EternalInvite adalah platform pembuatan dan pengelolaan undangan pernikahan digital. Dengan mendaftar, Anda menyetujui syarat dan ketentuan ini.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>2. Akun Pengguna</h2>
          <p>Anda bertanggung jawab menjaga kerahasiaan kata sandi akun dan seluruh aktivitas yang terjadi di dalamnya. Satu akun bebas dapat memiliki undangan sesuai ketentuan paket yang berlaku.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>3. Paket & Pembayaran</h2>
          <p>EternalInvite tersedia dalam satu paket berbayar: Premium seharga Rp 30.000, berlaku selama 90 hari sejak pembayaran diverifikasi oleh administrator. Akun baru dapat mendaftar dan merancang undangan, namun paket aktif setelah pembayaran disetujui. Bukti transfer yang tidak valid dapat ditolak.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>4. Konten Pengguna</h2>
          <p>Seluruh konten yang Anda unggah (teks, foto, musik, data tamu) adalah tanggung jawab Anda. Dilarang mengunggah konten yang melanggar hukum, hak cipta pihak lain, atau norma yang berlaku di Indonesia. Kami berhak menurunkan konten yang melanggar ketentuan ini.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>5. Lisensi</h2>
          <p>Anda memberikan kami lisensi terbatas untuk menampilkan konten Anda semata-mata demi keperluan menampilkan undangan Anda kepada tamu. Kami tidak mengklaim kepemilikan atas konten Anda.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>6. Ketersediaan Layanan</h2>
          <p>Kami berupaya menjaga layanan tersedia 24/7, namun tidak menjamin bebas gangguan sepenuhnya (pemeliharaan, masalah infrastruktur pihak ketiga). Untuk acara yang sangat sensitif terhadap waktu, siapkan cadangan undangan cetak atau digital lainnya.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>7. Penghentian</h2>
          <p>Anda dapat berhenti menggunakan layanan dan menghapus akun kapan saja. Kami dapat menangguhkan akun yang menyalahgunakan layanan atau melanggar ketentuan ini.</p>

          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '28px 0 8px' }}>8. Perubahan Ketentuan</h2>
          <p>Ketentuan ini dapat diperbarui sewaktu-waktu. Perubahan penting akan diumumkan melalui situs atau email terdaftar.</p>
        </div>
      </div>
    </main>
  )
}
