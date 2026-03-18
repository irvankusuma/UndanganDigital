'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Plus, Eye, Trash2, Copy, Calendar, Heart, Edit3, Archive } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'AKTIF', color: '#10B981', bg: '#ECFDF5' },
  draft: { label: 'DRAFT', color: '#F59E0B', bg: '#FFFBEB' },
  completed: { label: 'SELESAI', color: '#6366F1', bg: '#EEF2FF' },
}

const TABS = ['Semua', 'Aktif', 'Draft', 'Selesai']

export default function UndanganPage() {
  const [activeTab, setActiveTab] = useState('Semua')
  const [invitations, setInvitations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('invitations')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        if (data) setInvitations(data)
      } catch (err) {
        console.error('Fetch error:', err)
        toast.error('Gagal mengambil data undangan')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = activeTab === 'Semua' ? invitations
    : invitations.filter(inv => {
        if (activeTab === 'Aktif') return inv.status === 'active'
        if (activeTab === 'Draft') return inv.status === 'draft'
        if (activeTab === 'Selesai') return inv.status === 'completed'
        return true
      })

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/undangan/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link disalin!')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus undangan ini? Seluruh data tamu dan pesan juga akan terhapus.')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase.from('invitations').delete().eq('id', id)
      
      if (error) throw error
      
      setInvitations(prev => prev.filter(i => i.id !== id))
      toast.success('Undangan berhasil dihapus')
    } catch (err) {
      console.error('Delete error:', err)
      toast.error('Gagal menghapus undangan')
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Daftar Undangan Aktif</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Kelola dan pantau semua proyek undangan dari satu tempat.</p>
        </div>
        <Link href="/dashboard/undangan/baru" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Plus size={16} /> Buat Undangan Baru
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Undangan', value: invitations.length, color: '#E8627A' },
          { label: 'Undangan Aktif', value: invitations.filter(i => i.status === 'active').length, color: '#10B981' },
          { label: 'Undangan Draft', value: invitations.filter(i => i.status === 'draft').length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{
            flex: '1 1 160px', background: 'white', borderRadius: 14, padding: '18px 20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0',
          }}>
            <div style={{ fontSize: 11, color: '#aaa', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f5f5f5', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            background: activeTab === tab ? 'white' : 'transparent',
            color: activeTab === tab ? '#E8627A' : '#888',
            boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((inv, i) => {
          const statusConf = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft
          return (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: 'white', borderRadius: 18, padding: 24,
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1.5px solid #f0f0f0',
              }}
            >
              {/* Status + Favorite */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100,
                  background: statusConf.bg, color: statusConf.color, letterSpacing: 1,
                }}>
                  {statusConf.label}
                </span>
                <Heart size={18} color="#E8627A" fill={inv.status === 'active' ? '#E8627A' : 'none'} style={{ cursor: 'pointer' }} />
              </div>

              {/* Event Name */}
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, fontFamily: 'Playfair Display, serif' }}>
                {inv.event_name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#aaa', fontSize: 12, marginBottom: 16 }}>
                <Calendar size={12} />
                {inv.event_date ? new Date(inv.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum diatur'}
              </div>

              {/* URL */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#FAFAFA', borderRadius: 8, padding: '8px 12px', marginBottom: 20,
              }}>
                <span style={{ fontSize: 12, color: '#888', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  eternalinvite.com/{inv.slug}
                </span>
                <button onClick={() => handleCopyLink(inv.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8627A', padding: '0 0 0 8px' }}>
                  <Copy size={14} />
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/undangan/${inv.slug}`} target="_blank" style={{
                    width: 34, height: 34, borderRadius: 8, background: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: '#666',
                  }} title="Lihat Undangan">
                    <Eye size={15} />
                  </Link>
                  <Link href={`/dashboard/undangan/${inv.id}/edit`} style={{
                    width: 34, height: 34, borderRadius: 8, background: '#f5f5f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', color: '#666',
                  }} title="Edit Undangan">
                    <Edit3 size={15} />
                  </Link>
                  <button onClick={() => handleDelete(inv.id)} style={{
                    width: 34, height: 34, borderRadius: 8, background: '#FEF2F2',
                    border: 'none', cursor: 'pointer', color: '#EF4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} title="Hapus">
                    <Trash2 size={15} />
                  </button>
                </div>

                <Link href={`/dashboard/undangan/${inv.id}/tamu`} style={{
                  textDecoration: 'none', background: inv.status === 'draft' ? '#FDF8F0' : 'linear-gradient(135deg, #E8627A, #C44A62)',
                  color: inv.status === 'draft' ? '#C9A96E' : 'white',
                  border: inv.status === 'draft' ? '1.5px solid #E8D5B0' : 'none',
                  borderRadius: 10, padding: '9px 18px',
                  fontSize: 12, fontWeight: 700,
                }}>
                  {inv.status === 'draft' ? 'Lanjutkan Edit' : inv.status === 'completed' ? 'Arsipkan' : 'Kelola Proyek'}
                </Link>
              </div>
            </motion.div>
          )
        })}

        {/* Create New Card */}
        <Link href="/dashboard/undangan/baru" style={{ textDecoration: 'none' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filtered.length * 0.06 }}
            whileHover={{ scale: 1.02 }}
            style={{
              background: 'white', borderRadius: 18, padding: 24,
              border: '2px dashed #E8D5B0', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              minHeight: 220, gap: 12,
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8627A, #C44A62)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={24} color="white" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Buat Undangan Baru</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>Mulai proyek pernikahan baru</div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Pagination */}
      {invitations.length > 6 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>Menampilkan {filtered.length} dari {invitations.length} undangan</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map(n => (
              <button key={n} style={{
                width: 34, height: 34, borderRadius: 8, border: n === 1 ? 'none' : '1px solid #f0f0f0',
                background: n === 1 ? '#E8627A' : 'white', color: n === 1 ? 'white' : '#666',
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
