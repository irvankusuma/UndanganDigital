'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient, isSupabaseConfigured, supabaseConfigErrorMessage } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const strength = form.password.length >= 8 ? (form.password.match(/[A-Z]/) && form.password.match(/[0-9]/) ? 3 : 2) : (form.password.length > 0 ? 1 : 0)
  const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat'][strength]
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981'][strength]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Password tidak cocok!')
      return
    }
    if (form.password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.')
      router.push('/login')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      toast.error(message.includes('already registered') ? 'Email sudah terdaftar' : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)',
    }}>
      {/* Right panel decoration (desktop) */}
      <div className="hide-mobile" style={{
        flex: 1, background: 'linear-gradient(135deg, #C9A96E 0%, #A07842 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
        order: 2,
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <div style={{ fontSize: 60, marginBottom: 24 }}>🎊</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 16 }}>
            Mulai Perjalanan Anda
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8, maxWidth: 320 }}>
            Buat undangan digital yang indah dan kelola tamu Anda dengan mudah.
          </p>

          <div style={{ marginTop: 40 }}>
            {[
              'Gratis untuk 1 undangan',
              'RSVP dan Buku Tamu',
              'Statistik tamu real-time',
              'Link personal per tamu',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, color: 'rgba(255,255,255,0.9)' }}>
                <CheckCircle size={16} color="rgba(255,255,255,0.9)" />
                <span style={{ fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Left: Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '40px 24px',
        order: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 36 }}>
            <ArrowLeft size={14} /> Kembali ke beranda
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8627A, #C44A62)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>
              Eternal<span style={{ color: '#E8627A' }}>Invite</span>
            </span>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 6, marginTop: 16 }}>Buat Akun Baru</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>Bergabung dan buat undangan pertama Anda</p>

          {!isSupabaseConfigured && (
            <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 13, lineHeight: 1.6 }}>
              <strong>Pendaftaran belum bisa dipakai.</strong><br />
              {supabaseConfigErrorMessage}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Nama Lengkap</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama lengkap Anda" required
                  className="input-elegant" style={{ paddingLeft: 42 }} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="nama@email.com" required
                  className="input-elegant" style={{ paddingLeft: 42 }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 8 karakter" required
                  className="input-elegant" style={{ paddingLeft: 42, paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : '#eee', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: strengthColor, marginTop: 4 }}>Kekuatan: {strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Konfirmasi Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Ulangi password" required
                  className="input-elegant" style={{ paddingLeft: 42, borderColor: form.confirm && form.confirm !== form.password ? '#EF4444' : undefined }} />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Password tidak cocok</p>
              )}
            </div>

            <button type="submit" disabled={loading || !isSupabaseConfigured} className="btn-primary" style={{ width: '100%', fontSize: 15, opacity: loading || !isSupabaseConfigured ? 0.7 : 1 }}>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#888' }}>
            Sudah punya akun?{' '}
            <Link href="/login" style={{ color: '#E8627A', fontWeight: 600, textDecoration: 'none' }}>Masuk</Link>
          </div>

          <p style={{ fontSize: 11, color: '#aaa', textAlign: 'center', marginTop: 20 }}>
            Dengan mendaftar, Anda menyetujui{' '}
            <Link href="/terms" style={{ color: '#C9A96E', textDecoration: 'none' }}>Syarat & Ketentuan</Link>{' '}
            dan{' '}
            <Link href="/privacy" style={{ color: '#C9A96E', textDecoration: 'none' }}>Kebijakan Privasi</Link> kami.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
