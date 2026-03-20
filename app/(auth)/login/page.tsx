'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient, isSupabaseConfigured, supabaseConfigErrorMessage } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Selamat datang kembali! 🎉')
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan'
      toast.error(message === 'Invalid login credentials' ? 'Email atau password salah' : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)',
    }}>
      {/* Left panel (desktop) */}
      <div className="hide-mobile" style={{
        flex: 1, background: 'linear-gradient(135deg, #E8627A 0%, #C44A62 60%, #A03550 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: 60, position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1, pointerEvents: 'none' }}
        >
          <div style={{ fontSize: 60, marginBottom: 24 }}>💌</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 16 }}>
            Selamat Datang Kembali
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, lineHeight: 1.8, maxWidth: 320 }}>
            Kelola undangan digital Anda dan pantau tamu yang hadir dari satu dashboard.
          </p>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '40px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          {/* Header */}
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

          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 6, marginTop: 16 }}>Masuk ke Akun</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>Masukkan email dan password Anda</p>

          {!isSupabaseConfigured && (
            <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 13, lineHeight: 1.6 }}>
              <strong>Login belum bisa dipakai.</strong><br />
              {supabaseConfigErrorMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  required
                  className="input-elegant"
                  style={{ paddingLeft: 42 }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="input-elegant"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <Link href="/forgot-password" style={{ fontSize: 13, color: '#E8627A', textDecoration: 'none', fontWeight: 500 }}>
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isSupabaseConfigured}
              className="btn-primary"
              style={{ width: '100%', fontSize: 15, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#888' }}>
            Belum punya akun?{' '}
            <Link href="/register" style={{ color: '#E8627A', fontWeight: 600, textDecoration: 'none' }}>
              Daftar gratis
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
