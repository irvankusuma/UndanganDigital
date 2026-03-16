'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Edit2, Save, Plus, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

const BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'CIMB', 'Dana', 'GoPay', 'OVO', 'ShopeePay', 'LinkAja']

export default function HadiahPage() {
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentInvId, setCurrentInvId] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [savedAccounts, setSavedAccounts] = useState<any[]>([])
  const [form, setForm] = useState({ bank_name: '', account_number: '', account_name: '', save_globally: true })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: invs } = await supabase.from('invitations').select('id, enable_gifts').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)

        if (invs && invs.length > 0) {
          const invId = invs[0].id
          setCurrentInvId(invId)
          setEnabled(invs[0].enable_gifts ?? true)

          const { data: accData } = await supabase.from('gift_accounts').select('*').eq('invitation_id', invId).order('created_at', { ascending: true })
          setAccounts(accData || [])
        }

        const { data: globalData } = await supabase.from('saved_payment_methods').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        setSavedAccounts(globalData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleToggle = async () => {
    if (!currentInvId) return
    const newStatus = !enabled
    setEnabled(newStatus)
    try {
      const supabase = createClient()
      await supabase.from('invitations').update({ enable_gifts: newStatus }).eq('id', currentInvId)
      toast.success(newStatus ? 'Hadiah diaktifkan' : 'Hadiah dinonaktifkan')
    } catch (err) {
      setEnabled(!newStatus)
      toast.error('Gagal memperbarui status')
    }
  }

  const handleSave = async () => {
    if (!form.bank_name || !form.account_number || !form.account_name) { toast.error('Lengkapi data rekening'); return }
    if (!currentInvId) { toast.error('Belum ada undangan aktif'); return }

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const payload = { invitation_id: currentInvId, bank_name: form.bank_name, account_number: form.account_number, account_name: form.account_name.toUpperCase() }

      if (editId) {
        await supabase.from('gift_accounts').update(payload).eq('id', editId)
        setAccounts(prev => prev.map(a => a.id === editId ? { ...a, ...payload } : a))
        toast.success('Rekening diperbarui')
        setEditId(null)
      } else {
        const { data, error } = await supabase.from('gift_accounts').insert(payload).select().single()
        if (error) throw error
        setAccounts(prev => [...prev, data])
        toast.success('Rekening ditambahkan ke undangan')

        if (form.save_globally) {
          await supabase.from('saved_payment_methods').insert({ user_id: user.id, bank_name: form.bank_name, account_number: form.account_number, account_name: form.account_name.toUpperCase() })
          const { data: updatedGlobal } = await supabase.from('saved_payment_methods').select('*').eq('user_id', user.id)
          setSavedAccounts(updatedGlobal || [])
        }
      }
      setForm({ bank_name: '', account_number: '', account_name: '', save_globally: true })
    } catch (err) {
      toast.error('Gagal menyimpan rekening')
    }
  }

  const handleDelete = async (id: string, isGlobal = false) => {
    try {
      const supabase = createClient()
      if (isGlobal) {
        await supabase.from('saved_payment_methods').delete().eq('id', id)
        setSavedAccounts(prev => prev.filter(a => a.id !== id))
        toast.success('Dihapus dari daftar tersimpan')
      } else {
        await supabase.from('gift_accounts').delete().eq('id', id)
        setAccounts(prev => prev.filter(a => a.id !== id))
        toast.success('Dilepas dari undangan')
      }
    } catch (err) {
      toast.error('Gagal menghapus')
    }
  }

  const handleEdit = (a: any) => {
    setEditId(a.id)
    setForm({ bank_name: a.bank_name, account_number: a.account_number, account_name: a.account_name, save_globally: false })
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Memuat data hadiah...</div>

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Hadiah Digital (E-Wallet & Bank)</h1>
        <p style={{ fontSize: 14, color: '#888' }}>Kelola daftar rekening agar memudahkan tamu memberikan kado digital.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32 }}>
        {/* Form and Active */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'white', border: '1.5px solid #f0f0f0', borderRadius: 20, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{editId ? '📝 Edit Rekening' : '➕ Tambah Rekening'}</div>
              <button onClick={handleToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? '#10B981' : '#aaa' }}>{enabled ? 'AKTIF' : 'NONAKTIF'}</span>
                {enabled ? <ToggleRight size={40} color="#10B981" /> : <ToggleLeft size={40} color="#ccc" />}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>Bank / E-Wallet</label>
                <select value={form.bank_name} onChange={e => setForm({ ...form, bank_name: e.target.value })} className="input-elegant" style={{ fontSize: 13 }}>
                  <option value="">Pilih...</option>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>Nomor Rekening</label>
                <input value={form.account_number} onChange={e => setForm({ ...form, account_number: e.target.value })} placeholder="Cth: 772012xxx" className="input-elegant" style={{ fontSize: 13 }} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 8, display: 'block' }}>Atas Nama</label>
              <input value={form.account_name} onChange={e => setForm({ ...form, account_name: e.target.value })} placeholder="Nama Pemilik Rekening" className="input-elegant" style={{ fontSize: 13 }} />
            </div>

            {!editId && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
                <input type="checkbox" checked={form.save_globally} onChange={e => setForm({ ...form, save_globally: e.target.checked })} />
                <span style={{ fontSize: 12, color: '#666', fontWeight: 600 }}>Simpan ke daftar pilihan pribadi</span>
              </label>
            )}

            <button onClick={handleSave} className="btn-primary" style={{ width: '100%', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <Save size={18} /> {editId ? 'Perbarui Data' : 'Tampilkan di Undangan'}
            </button>
          </motion.div>

          <div>
             <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>📌 Rekening Aktif di Undangan</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {accounts.map(a => (
                  <div key={a.id} style={{ background: 'white', border: '1px solid #f0f0f0', borderRadius: 16, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#E8627A', marginBottom: 2 }}>{a.bank_name}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a1a' }}>{a.account_number}</div>
                      <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{a.account_name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleEdit(a)} style={{ padding: 8, borderRadius: 10, background: '#f5f5f5', border: 'none', color: '#666', cursor: 'pointer' }}><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(a.id)} style={{ padding: 8, borderRadius: 10, background: '#FEE2E2', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Master Data */}
        <div style={{ background: '#F8FAFC', borderRadius: 24, padding: 24, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" /> Favorit Saya
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {savedAccounts.map(s => (
              <div key={s.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: '#6366f1' }}>{s.bank_name}</span>
                  <button onClick={() => handleDelete(s.id, true)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}><Trash2 size={12} /></button>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{s.account_number}</div>
                <button 
                  onClick={() => {
                     const supabase = createClient()
                     supabase.from('gift_accounts').insert({ invitation_id: currentInvId, bank_name: s.bank_name, account_number: s.account_number, account_name: s.account_name })
                      .then(() => { toast.success('Berhasil dipasang!'); window.location.reload(); })
                  }}
                  style={{ width: '100%', padding: '6px', fontSize: 11, fontWeight: 700, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, color: '#475569', cursor: 'pointer', marginTop: 12 }}
                >
                  Gunakan
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
