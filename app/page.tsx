import Link from 'next/link'
import {
  Heart, Palette, Users, MessageSquareHeart, Link2, Image as ImageIcon,
  Music, Gift, BarChart3, Check, Sparkles, CalendarHeart, ArrowRight,
} from 'lucide-react'

const FEATURES = [
  { icon: Palette, title: '5 Tema Eksklusif', desc: 'Rose Elegance, Gold Minimalist, Garden Romance, Modern Chic, dan Tropical Bloom — lengkap dengan pilihan warna & font kustom.' },
  { icon: Users, title: 'RSVP Otomatis', desc: 'Tamu konfirmasi kehadiran langsung dari undangan. Statistik kehadiran tercatat real-time di dashboard Anda.' },
  { icon: MessageSquareHeart, title: 'Buku Tamu & Moderasi', desc: 'Ucapan dan doa dari tamu masuk ke buku tamu, dengan kontrol moderasi penuh di tangan Anda.' },
  { icon: Link2, title: 'Link Personal per Tamu', desc: 'Setiap tamu mendapat sapaan namanya sendiri di halaman pembuka undangan. Kirim massal via WhatsApp.' },
  { icon: ImageIcon, title: 'Galeri Foto', desc: 'Bagikan momen prewedding dan kenangan terbaik dalam galeri foto yang cantik dengan tampilan lightbox.' },
  { icon: Music, title: 'Musik Latar', desc: 'Putar lagu kenangan otomatis saat undangan dibuka, menggunakan link YouTube pilihan Anda.' },
  { icon: Gift, title: 'Kado Digital', desc: 'Terima tanda kasih lewat rekening bank atau e-wallet dengan tombol salin satu ketukan.' },
  { icon: BarChart3, title: 'Manajemen Tamu', desc: 'Kelola daftar tamu, kategori, kuota, dan ekspor data ke CSV untuk keperluan cetak atau katering.' },
]

const THEMES = [
  { name: 'Rose Elegance', color: '#E8627A', emoji: '🌸', desc: 'Romantis & Elegan' },
  { name: 'Gold Minimalist', color: '#C9A96E', emoji: '✨', desc: 'Modern & Simpel' },
  { name: 'Garden Romance', color: '#10B981', emoji: '🌿', desc: 'Segar & Alami' },
  { name: 'Modern Chic', color: '#6366F1', emoji: '💎', desc: 'Kontemporer' },
  { name: 'Tropical Bloom', color: '#F59E0B', emoji: '🌺', desc: 'Ceria & Tropis' },
]

const STEPS = [
  { num: '1', title: 'Daftar Gratis', desc: 'Buat akun dalam 30 detik. Tanpa kartu kredit, tanpa biaya tersembunyi.' },
  { num: '2', title: 'Rancang Undangan', desc: 'Isi detail acara, unggah foto, pilih tema dan musik lewat wizard langkah demi langkah.' },
  { num: '3', title: 'Sebarkan Kebahagiaan', desc: 'Terbitkan dan kirim link personal ke setiap tamu via WhatsApp dalam sekali klik.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
              <Heart size={16} color="white" fill="white" />
            </div>
            <span className="font-serif font-bold text-lg text-gray-900">
              Eternal<span className="text-rose">Invite</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-sm font-medium text-gray-600 hover:text-rose no-underline transition-colors">Fitur</a>
            <a href="#tema" className="text-sm font-medium text-gray-600 hover:text-rose no-underline transition-colors">Tema</a>
            <a href="#harga" className="text-sm font-medium text-gray-600 hover:text-rose no-underline transition-colors">Harga</a>
            <a href="#cara-kerja" className="text-sm font-medium text-gray-600 hover:text-rose no-underline transition-colors">Cara Kerja</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-rose no-underline px-3 py-2">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-semibold text-white no-underline px-4 py-2 rounded-full bg-gradient-to-r from-rose to-rose-dark shadow-md shadow-rose/30 hover:opacity-90 transition-opacity">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF5F7 0%, #FDF8F0 60%, #FFFFFF 100%)' }}>
        <div className="absolute top-24 -left-24 w-72 h-72 rounded-full bg-rose/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-rose/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Sparkles size={14} className="text-rose" />
            <span className="text-xs font-semibold text-gray-600">Platform Undangan Pernikahan Digital #1</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Wujudkan Undangan Pernikahan
            <span className="block text-gradient-rose">yang Tak Terlupakan</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Buat undangan digital yang elegan dalam hitungan menit — lengkap dengan RSVP, buku tamu,
            galeri foto, musik latar, dan link personal untuk setiap tamu Anda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white font-bold text-sm sm:text-base no-underline shadow-lg shadow-rose/30 hover:-translate-y-0.5 transition-transform">
              Mulai Buat Undangan — Gratis <ArrowRight size={18} />
            </Link>
            <a href="#fitur" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm sm:text-base no-underline hover:border-rose hover:text-rose transition-colors">
              Lihat Fitur Lengkap
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-xs sm:text-sm text-gray-400 font-medium">
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Gratis 1 undangan</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Tanpa kartu kredit</span>
            <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Tampil sempurna di HP & desktop</span>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-rose mb-3">Fitur Lengkap</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Semua yang Anda Butuhkan dalam Satu Platform</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">Dirancang khusus untuk undangan pernikahan — elegan, mudah dipakai, dan bekerja sempurna di semua perangkat.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-11 h-11 rounded-xl bg-blush flex items-center justify-center mb-4 text-rose">
                <f.icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tema */}
      <section id="tema" className="py-20" style={{ background: 'linear-gradient(180deg, #FDF8F0 0%, #FFF5F7 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-rose mb-3">Pilihan Tema</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">5 Tema Eksklusif Siap Pakai</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base">Setiap tema dapat disesuaikan warna dan font-nya agar selaras dengan konsep pernikahan Anda.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {THEMES.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: `${t.color}15`, border: `2px solid ${t.color}40` }}>
                  {t.emoji}
                </div>
                <h3 className="font-bold text-gray-900 text-xs sm:text-sm">{t.name}</h3>
                <p className="text-[11px] mt-1" style={{ color: t.color }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cara Kerja */}
      <section id="cara-kerja" className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-rose mb-3">Cara Kerja</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">Tiga Langkah Menuju Hari Bahagia</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(s => (
            <div key={s.num} className="relative bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose to-rose-dark text-white font-bold flex items-center justify-center mx-auto mb-5 shadow-lg shadow-rose/30">
                {s.num}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Harga */}
      <section id="harga" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-rose mb-3">Harga</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Mulai Gratis, Upgrade Kapan Saja</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Gratis</h3>
              <p className="text-xs text-gray-400 mb-6">Untuk mencoba platform</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">Rp 0</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['1 undangan digital', 'RSVP & buku tamu', 'Link personal per tamu', 'Galeri foto & musik latar', 'Statistik tamu'].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center py-3 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-sm no-underline hover:border-rose hover:text-rose transition-colors">
                Daftar Gratis
              </Link>
            </div>
            {/* Premium */}
            <div className="relative bg-white rounded-3xl border-2 border-rose/40 p-8 shadow-xl shadow-rose/10 flex flex-col">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose to-rose-dark text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                Paling Populer
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Premium</h3>
              <p className="text-xs text-gray-400 mb-6">Sekali bayar, aktif 1 bulan penuh</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">Rp 30.000</span>
                <span className="text-sm text-gray-400"> / undangan</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Semua fitur paket Gratis', 'Undangan tanpa batas', 'Kado digital (rekening & e-wallet)', 'Prioritas dukungan', 'Ekspor data tamu CSV'].map(i => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="text-rose mt-0.5 flex-shrink-0" /> {i}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block text-center py-3 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white font-bold text-sm no-underline shadow-lg shadow-rose/30 hover:opacity-90 transition-opacity">
                Pilih Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20" style={{ background: 'linear-gradient(135deg, #2d1218 0%, #1a0a0e 100%)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-rose/20 blur-[120px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <CalendarHeart size={40} className="text-rose mx-auto mb-6" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-snug">
            Hari Bahagia Anda Dimulai di Sini
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Ribuan pasangan telah mempercayakan undangan mereka pada EternalInvite.
            Giliran Anda — gratis untuk dimulai.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-rose to-rose-dark text-white font-bold text-sm sm:text-base no-underline shadow-xl shadow-rose/30 hover:-translate-y-0.5 transition-transform">
            Buat Undangan Saya <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center">
              <Heart size={14} color="white" fill="white" />
            </div>
            <span className="font-serif font-bold text-gray-900">
              Eternal<span className="text-rose">Invite</span>
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="no-underline hover:text-rose transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="no-underline hover:text-rose transition-colors">Syarat & Ketentuan</Link>
            <Link href="/login" className="no-underline hover:text-rose transition-colors">Masuk</Link>
          </nav>
          <p className="text-xs text-gray-400">&copy; 2026 EternalInvite. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}
