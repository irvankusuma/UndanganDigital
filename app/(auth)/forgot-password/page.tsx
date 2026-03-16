'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
      toast.success('Email reset password telah dikirim!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FFF5F7 0%, #FDF8F0 100%)', padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 420 }}>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 36 }}>
          <ArrowLeft size={14} /> Kembali ke login
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #E8627A, #C44A62)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700 }}>Eternal<span style={{ color: '#E8627A' }}>Invite</span></span>
        </div>

        {!sent ? (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Lupa Password?</h1>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 32 }}>Masukkan email Anda dan kami akan mengirimkan link reset password.</p>
            <form onSubmit={handleSubmit}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 8 }}>Email</label>
              <div style={{ position: 'relative', marginBottom: 24 }}>
                <Mail size={16} color="#aaa" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" required className="input-elegant" style={{ paddingLeft: 42 }} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: 15, opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <CheckCircle size={64} color="#10B981" style={{ marginBottom: 24 }} />
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Email Terkirim!</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>Cek inbox email <strong>{email}</strong> dan klik link reset password yang kami kirimkan.</p>
            <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Kembali ke Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
