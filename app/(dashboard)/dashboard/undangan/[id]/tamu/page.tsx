'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Search, Edit2, Trash2,
  Download, Copy, Check, Send, Users, Loader
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

const CAT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  family: { label: 'Keluarga', color: '#6366F1', bg: '#EEF2FF' },
  friend: { label: 'Teman', color: '#10B981', bg: '#ECFDF5' },
  coworker: { label: 'Teman Kantor', color: '#F59E0B', bg: '#FFFBEB' },
  vip: { label: 'VIP', color: '#E8627A', bg: '#FDE8ED' },
  other: { label: 'Lainnya', color: '#6B7280', bg: '#F3F4F6' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  attending: { label: 'Hadir', color: '#10B981', bg: '#ECFDF5' },
  not_attending: { label: 'Berhalangan', color: '#EF4444', bg: '#FEF2F2' },
  pending: { label: 'Belum Respon', color: '#F59E0B', bg: '#FFFBEB' },
}

const FILTERS = ['Semua', 'Keluarga', 'Teman', 'VIP']

export default function InvitationGuestPage() {
  const params = useParams()
  const invId = params?.id as string

  const [invitation, setInvitation] = useState<any>(null)
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [showModal, setShowModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editGuest, setEditGuest] = useState<any>(null)
  const [form, setForm] = useState({ guest_name: '', phone: '', category: 'family', guest_count: 1 })

  // Fetch invitation + guests from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!invId) return
      try {
        const supabase = createClient()

        // Fetch invitation
        const { data: inv, error: invErr } = await supabase
          .from('invitations')
          .select('id, event_name, slug, event_date, max_guests')
          .eq('id', invId)
          .single()

        if (invErr) throw invErr
        setInvitation(inv)

        // Fetch guests
        const { data: guestsData, error: guestsErr } = await supabase
          .from('guests')
          .select('*')
          .eq('invitation_id', invId)
          .order('created_at', { ascending: false })

        if (guestsErr) throw guestsErr
        setGuests(guestsData || [])
      } catch (err: any) {
        console.error(err)
        toast.error('Gagal memuat data tamu')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [invId])

  const filtered = guests.filter(g => {
    const matchSearch = g.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone || '').includes(search)
    const matchFilter = filter === 'Semua' ||
      (filter === 'Keluarga' && g.category === 'family') ||
      (filter === 'Teman' && g.category === 'friend') ||
      (filter === 'VIP' && g.category === 'vip')
    return matchSearch && matchFilter
  })

  const totalCount = guests.reduce((acc, g) => acc + (g.guest_count || 1), 0)
  const rsvpCount = guests.filter(g => g.status === 'attending').reduce((acc, g) => acc + (g.guest_count || 1), 0)
  const pendingCount = guests.filter(g => g.status === 'pending').length

  const openAdd = () => {
    setEditGuest(null)
    setForm({ guest_name: '', phone: '', category: 'family', guest_count: 1 })
    setShowModal(true)
  }
  const openEdit = (g: any) => {
    setEditGuest(g)
    setForm({ guest_name: g.guest_name, phone: g.phone || '', category: g.category, guest_count: g.guest_count })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.guest_name.trim()) { toast.error('Nama tamu harus diisi'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      if (editGuest) {
        // Update existing guest
        const { error } = await supabase
          .from('guests')
          .update({
            guest_name: form.guest_name,
            phone: form.phone || null,
            category: form.category,
            guest_count: form.guest_count,
          })
          .eq('id', editGuest.id)

        if (error) throw error
        setGuests(prev => prev.map(g => g.id === editGuest.id ? { ...g, ...form } : g))
        toast.success('Tamu diperbarui')
      } else {
        // Insert new guest
        const { data, error } = await supabase
          .from('guests')
          .insert({
            invitation_id: invId,
            guest_name: form.guest_name,
            phone: form.phone || null,
            category: form.category,
            guest_count: form.guest_count,
            status: 'pending',
          })
          .select()
          .single()

        if (error) throw error
        setGuests(prev => [data, ...prev])
        toast.success('Tamu ditambahkan')
      }
      setShowModal(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Gagal menyimpan tamu')
    } finally {
      setSaving(false)
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
    } catch (err: any) {
      toast.error('Gagal menghapus tamu')
    }
  }

  const getPersonalLink = (guestName: string) => {
    const base = typeof window !== 'undefined' ? window.location.origin : ''
    return `${base}/undangan/${invitation?.slug || ''}?to=${encodeURIComponent(guestName)}`
  }

  const handleCopyLink = (guest: any) => {
    const link = getPersonalLink(guest.guest_name)
    navigator.clipboard.writeText(link)
    setCopiedId(guest.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success(`Link personal untuk ${guest.guest_name} disalin!`)
  }

  const handleWhatsApp = (guest: any) => {
    const link = getPersonalLink(guest.guest_name)
    const eventName = invitation?.event_name || 'acara kami'
    const eventDate = invitation?.event_date
      ? new Date(invitation.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : ''
    const msg = `Yth. ${guest.guest_name},\n\nKami mengundang Bapak/Ibu/Saudara/i untuk hadir di ${eventName}.\n${eventDate ? `\n${eventDate}\n` : ''}\nBuka undangan digital Anda di sini:\n${link}\n\nKonfirmasi kehadiran melalui link di atas.\n\nTerima kasih 💕`
    const phone = (guest.phone || '').replace(/\D/g, '').replace(/^0/, '62')
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
    } else {
      navigator.clipboard.writeText(msg)
      toast.success('Pesan disalin (tamu tidak memiliki nomor WA)')
    }
  }

  const handleExport = () => {
    const csv = ['Nama,Telepon,Kategori,Jumlah,Status,Link Personal',
      ...guests.map(g => `${g.guest_name},${g.phone || '-'},${CAT_LABELS[g.category]?.label || g.category},${g.guest_count},${STATUS_CONFIG[g.status]?.label || g.status},${getPersonalLink(g.guest_name)}`)
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tamu-${invitation?.slug || 'undangan'}.csv`
    a.click()
    toast.success('Data tamu berhasil diekspor!')
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Loader className="animate-spin" color="#E8627A" size={36} />
    </div>
  )

  if (!invitation) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>😕</div>
      <p style={{ color: '#888' }}>Undangan tidak ditemukan</p>
      <Link href="/dashboard/undangan" style={{ color: '#E8627A', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
        ← Kembali ke Daftar Undangan
      </Link>
    </div>
  )

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#aaa' }}>
        <Link href="/dashboard/undangan" style={{ textDecoration: 'none', color: '#aaa', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
          <ArrowLeft size={14} /> Undangan
        </Link>
        <span>/</span>
        <span style={{ color: '#E8627A', fontWeight: 600 }}>{invitation.event_name}</span>
        <span>/</span>
        <span>Manajemen Tamu</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Daftar Tamu</h1>
          <p style={{ fontSize: 14, color: '#888' }}>
            Kelola tamu untuk undangan <strong style={{ color: '#1a1a1a' }}>{invitation.event_name}</strong> dan kirim link personal via WhatsApp.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleExport} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1.5px solid #f0f0f0', borderRadius: 100, padding: '9px 18px',
            fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer', background: 'white',
          }}>
            <Download size={14} /> Ekspor CSV
          </button>
          <button onClick={openAdd} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <Plus size={15} /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'TOTAL UNDANGAN', value: guests.length, sub: 'Tamu', color: '#1a1a1a', icon: <Users size={18} /> },
          { label: 'SUDAH RSVP', value: rsvpCount, sub: `Orang (${totalCount > 0 ? Math.round(rsvpCount / totalCount * 100) : 0}%)`, color: '#10B981', icon: <Check size={18} /> },
          { label: 'MENUNGGU RESPON', value: pendingCount, sub: 'Tamu', color: '#F59E0B', icon: <Send size={18} /> },
          { label: 'KAPASITAS MAKS', value: invitation.max_guests || '∞', sub: 'Orang', color: '#888', icon: <Users size={18} /> },
        ].map(s => (
          <div key={s.label} style={{ flex: '1 1 180px', background: 'white', borderRadius: 14, padding: '20px 22px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 10, color: '#aaa', fontWeight: 700, letterSpacing: 1.5 }}>{s.label}</div>
              <div style={{ color: s.color, opacity: 0.6 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>
              {s.value} <span style={{ fontSize: 13, fontWeight: 400, color: '#aaa' }}>{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} color="#aaa" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau nomor tamu..." className="input-elegant" style={{ paddingLeft: 38 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '9px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
              background: filter === f ? 'linear-gradient(135deg, #E8627A, #C44A62)' : 'white',
              color: filter === f ? 'white' : '#666',
              boxShadow: filter === f ? '0 4px 14px rgba(232,98,122,0.3)' : '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1.5px solid #f5f5f5', background: '#FAFAFA' }}>
              {['NAMA TAMU', 'KATEGORI', 'JUMLAH', 'STATUS RSVP', 'LINK PERSONAL', 'AKSI'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: 10, color: '#aaa', fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 1.2 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((guest, i) => {
              const cat = CAT_LABELS[guest.category] || CAT_LABELS.other
              const status = STATUS_CONFIG[guest.status] || STATUS_CONFIG.pending
              return (
                <motion.tr key={guest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #fafafa' }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `hsl(${i * 50}, 65%, 70%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>
                        {guest.guest_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{guest.guest_name}</div>
                        <div style={{ fontSize: 11, color: '#aaa' }}>{guest.phone || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: cat.bg, color: cat.color, letterSpacing: 1 }}>
                      {cat.label.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                    {guest.guest_count} orang
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, background: status.bg, color: status.color }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        onClick={() => handleCopyLink(guest)}
                        title="Salin link personal"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          border: 'none',
                          background: copiedId === guest.id ? '#ECFDF5' : '#f5f5f5',
                          color: copiedId === guest.id ? '#10B981' : '#666',
                          transition: 'all 0.2s',
                        }}
                      >
                        {copiedId === guest.id ? <><Check size={11} /> Disalin</> : <><Copy size={11} /> Salin</>}
                      </button>
                      <button
                        onClick={() => handleWhatsApp(guest)}
                        title="Kirim via WhatsApp"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          border: 'none', background: '#ECFDF5', color: '#10B981',
                        }}
                      >
                        <Send size={11} /> WA
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(guest)} style={{ width: 32, height: 32, borderRadius: 8, background: '#f5f5f5', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(guest.id)} style={{ width: 32, height: 32, borderRadius: 8, background: '#FEF2F2', border: 'none', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#aaa', marginBottom: 4 }}>
              {guests.length === 0 ? 'Belum ada tamu' : 'Tidak ada tamu ditemukan'}
            </div>
            <div style={{ fontSize: 13, color: '#ccc' }}>
              {guests.length === 0 ? 'Mulai tambahkan tamu undangan Anda.' : 'Coba ubah filter atau kata kunci pencarian.'}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5' }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>Menampilkan {filtered.length} dari {guests.length} tamu</span>
        </div>
      </div>

      {/* Modal Tambah/Edit Tamu */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>
                {editGuest ? '✏️ Edit Tamu' : '➕ Tambah Tamu Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nama Tamu <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={form.guest_name} onChange={e => setForm({ ...form, guest_name: e.target.value })}
                  placeholder="Nama lengkap tamu" className="input-elegant" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Nomor WA</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx" className="input-elegant" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Kategori</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-elegant">
                    <option value="family">Keluarga</option>
                    <option value="friend">Teman</option>
                    <option value="coworker">Teman Kantor</option>
                    <option value="vip">VIP</option>
                    <option value="other">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 8 }}>Jumlah Tamu</label>
                  <input type="number" min={1} max={20} value={form.guest_count}
                    onChange={e => setForm({ ...form, guest_count: parseInt(e.target.value) || 1 })}
                    className="input-elegant" />
                </div>
              </div>

              {/* Link preview */}
              {form.guest_name && (
                <div style={{ background: '#F0FFF4', borderRadius: 10, padding: '12px 14px', border: '1px solid #B6F5CD' }}>
                  <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 4 }}>🔗 Link Personal yang Akan Dibuat:</div>
                  <div style={{ fontSize: 11, color: '#555', wordBreak: 'break-all' }}>
                    /undangan/{invitation.slug}?to={encodeURIComponent(form.guest_name)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '12px', borderRadius: 10, border: '1.5px solid #f0f0f0',
                background: 'white', cursor: 'pointer', fontWeight: 600, color: '#666', fontSize: 14,
              }}>Batal</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, fontSize: 14 }}>
                {saving ? 'Menyimpan...' : editGuest ? 'Simpan Perubahan' : 'Tambah Tamu'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
