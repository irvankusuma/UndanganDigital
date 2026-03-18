import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#fffafc', padding: '48px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'white', borderRadius: 24, padding: 32, border: '1px solid #f3e8ee' }}>
        <Link href="/register" style={{ color: '#E8627A', textDecoration: 'none', fontWeight: 600 }}>← Kembali</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '16px 0' }}>Kebijakan Privasi</h1>
        <p style={{ color: '#666', lineHeight: 1.8 }}>Kami menyimpan data akun, undangan, serta daftar tamu hanya untuk menjalankan fitur EternalInvite. Data tidak dibagikan ke pihak ketiga tanpa izin, kecuali bila diwajibkan oleh hukum.</p>
      </div>
    </main>
  )
}
