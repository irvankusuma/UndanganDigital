import Link from 'next/link'

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fffafc', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: 24, padding: 32, border: '1px solid #f3e8ee' }}>
        <Link href="/register" style={{ color: '#E8627A', textDecoration: 'none', fontWeight: 600 }}>← Kembali</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '16px 0' }}>Syarat & Ketentuan</h1>
        <p style={{ color: '#666', lineHeight: 1.8 }}>Dengan menggunakan EternalInvite, Anda setuju untuk menggunakan layanan ini secara sah, menjaga keamanan akun, dan bertanggung jawab atas konten undangan yang dipublikasikan melalui platform ini.</p>
      </div>
    </main>
  )
}
