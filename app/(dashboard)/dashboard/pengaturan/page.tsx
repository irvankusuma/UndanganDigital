'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Bell, Save, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function PengaturanPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [notif, setNotif] = useState({ email: true, whatsapp: false, rsvp: true, wishes: true })

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        setUser(authUser)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()
        
        if (profile) {
          setForm({
            name: profile.name || '',
            email: authUser.email || '',
            phone: profile.phone || ''
          })
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ name: form.name, phone: form.phone })
        .eq('id', user.id)
      
      if (error) throw error
      toast.success('Profil berhasil diperbarui!')
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async () => {
    if (pwForm.new !== pwForm.confirm) {
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: pwForm.new })
      if (error) throw error
      toast.success('Kata sandi berhasil diperbarui!')
      setPwForm({ current: '', new: '', confirm: '' })
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui kata sandi')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Memuat...</div>

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Pengaturan Akun</h1>
        <p style={{ fontSize: 14, color: '#888' }}>Kelola informasi akun dan preferensi keamanan Anda.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
            <User size={18} /> Profil Pengguna
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Lengkap</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-elegant" placeholder="Nama Lengkap Anda" />
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Email</label>
                <input disabled type="email" value={form.email} className="input-elegant" style={{ background: '#f5f5f5', cursor: 'not-allowed' }} />
                <p style={{ fontSize: 10, color: '#aaa', marginTop: 4 }}>Email tidak dapat diubah di sini.</p>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nomor WhatsApp</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-elegant" placeholder="08xxxxxxxxxx" />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={handleSaveProfile} disabled={saving} className="btn-primary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Save size={14} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
            <Shield size={18} /> Keamanan & Akun
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Kata Sandi Baru</label>
              <input type="password" value={pwForm.new} onChange={e => setPwForm({ ...pwForm, new: e.target.value })} className="input-elegant" placeholder="Minimal 6 karakter" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Konfirmasi Kata Sandi</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} className="input-elegant" placeholder="Ulangi kata sandi baru" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={handleUpdatePassword} disabled={saving} className="btn-primary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a1a' }}>
                <Lock size={14} /> {saving ? 'Memproses...' : 'Ubah Kata Sandi'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'white', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: '#E8627A', fontWeight: 700, fontSize: 15 }}>
            <Bell size={18} /> Notifikasi
          </div>
          {[
            { key: 'email', label: 'Notifikasi Email', desc: 'Terima notifikasi melalui email' },
            { key: 'whatsapp', label: 'Notifikasi WhatsApp', desc: 'Terima notifikasi melalui WhatsApp' },
            { key: 'rsvp', label: 'Konfirmasi Tamu Baru', desc: 'Notifikasi ketika ada tamu baru' },
            { key: 'wishes', label: 'Ucapan & Doa Baru', desc: 'Notifikasi ketika ada ucapan baru' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #f5f5f5', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{item.desc}</div>
              </div>
              <button
                onClick={() => setNotif(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                style={{
                  width: 44, height: 24, borderRadius: 100, border: 'none', cursor: 'pointer',
                  background: notif[item.key as keyof typeof notif] ? '#E8627A' : '#ddd',
                  position: 'relative', transition: 'background 0.3s',
                }}
              >
                <div style={{
                  width: 18, height: 18, borderRadius: '50%', background: 'white',
                  position: 'absolute', top: 3, transition: 'left 0.3s',
                  left: notif[item.key as keyof typeof notif] ? 23 : 3,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Plan - Info only */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: 'linear-gradient(135deg, #FDE8ED, #FFF0F3)', borderRadius: 16, padding: 28, border: '1.5px solid rgba(232,98,122,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Informasi Akun</h3>
              <p style={{ fontSize: 13, color: '#888' }}>Anda saat ini menggunakan akses dashboard untuk mengelola undangan digital Anda.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

