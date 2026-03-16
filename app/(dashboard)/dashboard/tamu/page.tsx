'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

import { createClient } from '@/lib/supabase/client'
import { TamuStats } from '@/components/dashboard/Tamu/TamuStats'
import { TamuTable } from '@/components/dashboard/Tamu/TamuTable'
import { TamuModal } from '@/components/dashboard/Tamu/TamuModal'

const FILTERS = ['Semua', 'Keluarga', 'Teman', 'VIP']

export default function TamuPage() {
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentInvId, setCurrentInvId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [showModal, setShowModal] = useState(false)
  const [editGuest, setEditGuest] = useState<any | null>(null)
  const [form, setForm] = useState({ guest_name: '', phone: '', category: 'family', guest_count: 1 })

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: invs } = await supabase.from('invitations').select('id').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
        if (!invs || invs.length === 0) { setLoading(false); return }

        const invId = invs[0].id
        setCurrentInvId(invId)

        const { data: guestsData } = await supabase.from('guests').select('*').eq('invitation_id', invId).order('created_at', { ascending: false })
        setGuests(guestsData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchGuests()
  }, [])

  const filtered = guests.filter(g => {
    const matchSearch = g.guest_name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Semua' ||
      (filter === 'Keluarga' && g.category === 'family') ||
      (filter === 'Teman' && g.category === 'friend') ||
      (filter === 'VIP' && g.category === 'vip')
    return matchSearch && matchFilter
  })

  const totalCount = guests.reduce((acc, g) => acc + g.guest_count, 0)
  const rsvpCount = guests.filter(g => g.status === 'attending').reduce((acc, g) => acc + g.guest_count, 0)

  const openAdd = () => { setEditGuest(null); setForm({ guest_name: '', phone: '', category: 'family', guest_count: 1 }); setShowModal(true) }
  const openEdit = (g: any) => { setEditGuest(g); setForm({ guest_name: g.guest_name, phone: g.phone || '', category: g.category, guest_count: g.guest_count }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.guest_name.trim()) { toast.error('Nama tamu harus diisi'); return }
    if (!currentInvId) { toast.error('Anda belum memiliki undangan.'); return }

    try {
      const supabase = createClient()
      const payload = {
        invitation_id: currentInvId,
        guest_name: form.guest_name,
        phone: form.phone || null,
        category: form.category,
        guest_count: form.guest_count,
        status: editGuest ? editGuest.status : 'pending' 
      }

      if (editGuest) {
        const { error } = await supabase.from('guests').update(payload).eq('id', editGuest.id)
        if (error) throw error
        setGuests(prev => prev.map(g => g.id === editGuest.id ? { ...g, ...payload } : g))
        toast.success('Tamu diperbarui')
      } else {
        const { data, error } = await supabase.from('guests').insert(payload).select().single()
        if (error) throw error
        if (data) setGuests(prev => [data, ...prev])
        toast.success('Tamu ditambahkan')
      }
      setShowModal(false)
    } catch (err) {
      toast.error('Gagal menyimpan tamu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tamu ini?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from('guests').delete().eq('id', id)
      if (error) throw error
      setGuests(prev => prev.filter(g => g.id !== id))
      toast.success('Tamu dihapus')
    } catch (err) {
      toast.error('Gagal menghapus tamu')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Manajemen Tamu</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Daftar tamu dan status konfirmasi kehadiran.</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <Plus size={16} /> Tambah Tamu
        </button>
      </div>

      <TamuStats totalCount={totalCount} rsvpCount={rsvpCount} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} color="#aaa" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama tamu..." className="input-elegant" style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #E8627A, #C44A62)' : '#f5f5f5',
              color: filter === f ? 'white' : '#666',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <TamuTable 
        guests={filtered} 
        loading={loading} 
        onEdit={openEdit} 
        onDelete={handleDelete} 
        onAdd={openAdd} 
      />

      {showModal && (
        <TamuModal 
          editGuest={editGuest} 
          form={form} 
          setForm={setForm} 
          onClose={() => setShowModal(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  )
}
