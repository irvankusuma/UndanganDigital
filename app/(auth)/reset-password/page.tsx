'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Heart, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

import { createClient, isSupabaseConfigured, supabaseConfigErrorMessage } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const prepareSession = async () => {
      const supabase = createClient()
      const hash = window.location.hash
      const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken || !refreshToken) {
        setReady(true)
        return
      }

      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      if (error) {
        toast.error('Link reset password tidak valid atau sudah kedaluwarsa.')
      }
      setReady(true)
    }

    prepareSession()
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password minimal 8 karakter.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setSuccess(true)
      toast.success('Password berhasil diperbarui.')
      setTimeout(() => router.push('/login'), 1500)
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Gagal memperbarui password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 440 }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 36 }}>
          <ArrowLeft size={14} /> Kembali ke login
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #E8627A, #C44A62)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>
            Eternal<span style={{ color: '#E8627A' }}>Invite</span>
          </span>
        </div>

        {!ready ? (
          <div style={{ padding: 32, background: 'white', borderRadius: 24, textAlign: 'center', border: '1px solid #f3e8ee' }}>Menyiapkan reset password...</div>
        ) : success ? (
          <div style={{ padding: 32, background: 'white', borderRadius: 24, textAlign: 'center', border: '1px solid #f3e8ee' }}>
            <CheckCircle size={60} color="#10B981" style={{ marginBottom: 20 }} />
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>Password berhasil diubah</h1>
            <p style={{ fontSize: 14, color: '#888' }}>Anda akan diarahkan kembali ke halaman login.</p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #f3e8ee' }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>Atur Password Baru</h1>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Masukkan password baru untuk akun Anda agar bisa login kembali.</p>

            {!isSupabaseConfigured && (
              <div style={{ marginBottom: 20, padding: '14px 16px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: 13, lineHeight: 1.6 }}>
                <strong>Reset password belum bisa dipakai.</strong><br />
                {supabaseConfigErrorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Password Baru</label>
              <div style={{ position: 'relative', marginBottom: 18 }}>
                <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input-elegant" placeholder="Minimal 8 karakter" style={{ paddingLeft: 42 }} />
              </div>

              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Konfirmasi Password Baru</label>
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="input-elegant" placeholder="Ulangi password baru" style={{ paddingLeft: 42 }} />
              </div>

              <button type="submit" disabled={loading || !isSupabaseConfigured} className="btn-primary" style={{ width: '100%', fontSize: 15, opacity: loading || !isSupabaseConfigured ? 0.7 : 1 }}>
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  )
}
