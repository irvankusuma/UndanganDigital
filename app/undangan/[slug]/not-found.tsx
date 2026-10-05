import Link from 'next/link'

export default function InvitationNotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>💌</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
        Undangan Tidak Ditemukan
      </h1>
      <p style={{ color: '#888', fontSize: 15, maxWidth: 420, lineHeight: 1.7, marginBottom: 32 }}>
        Link undangan mungkin salah, atau undangan belum dipublikasikan oleh pemiliknya.
      </p>
      <Link href="/" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 100, background: 'linear-gradient(135deg, #E8627A, #C44A62)', color: 'white', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
        Ke Beranda
      </Link>
    </div>
  )
}
