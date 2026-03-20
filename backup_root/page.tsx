'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Heart, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Password tidak cocok!')
      return
    }
    if (password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      toast.success('Password berhasil diperbarui!')
      setTimeout(() => router.push('/login'), 3000)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)', padding: 24,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
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

        {!done ? (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Reset Password</h1>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>Masukkan password baru Anda.</p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                  Password Baru
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="input-elegant"
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 28 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>
                  Konfirmasi Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Ulangi password baru"
                    required
                    className="input-elegant"
                    style={{ paddingLeft: 42, borderColor: confirm && confirm !== password ? '#EF4444' : undefined }}
                  />
                </div>
                {confirm && confirm !== password && (
                  <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>Password tidak cocok</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', fontSize: 15, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Memperbarui...' : 'Simpan Password Baru'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Password Diperbarui!</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
              Password Anda berhasil diperbarui. Anda akan diarahkan ke halaman login...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
