'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

import { createClient } from '@/lib/supabase/client'
import { InvitationSwitcher } from '@/components/dashboard/InvitationSwitcher'
import { useSelectedInvitation } from '@/components/dashboard/useSelectedInvitation'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  visible: { label: 'Ditampilkan', color: '#10B981', bg: '#ECFDF5' },
  pending: { label: 'Menunggu', color: '#F59E0B', bg: '#FFFBEB' },
  hidden: { label: 'Disembunyikan', color: '#6B7280', bg: '#F3F4F6' },
}

const TABS = ['Semua Pesan', 'Menunggu Moderasi', 'Disembunyikan']
const PAGE_SIZE = 10

export default function PesanPage() {
  const [wishes, setWishes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Semua Pesan')
  const [page, setPage] = useState(1)
  const { invitations, selectedInvId, selectInvitation, loading: invLoading } = useSelectedInvitation()

  useEffect(() => {
    if (!selectedInvId) { if (!invLoading) { setWishes([]); setLoading(false) } return }
    const fetchWishes = async () => {
      setLoading(true)
      try {
        const supabase = createClient()
        const { data: wishesData } = await supabase.from('wishes')
          .select('*')
          .eq('invitation_id', selectedInvId)
          .order('created_at', { ascending: false })
        setWishes(wishesData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchWishes()
  }, [selectedInvId, invLoading])

  const filtered = activeTab === 'Semua Pesan' ? wishes
    : activeTab === 'Menunggu Moderasi' ? wishes.filter(w => w.status === 'pending')
    : wishes.filter(w => w.status === 'hidden')

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [activeTab, selectedInvId])

  const handleExport = () => {
    if (filtered.length === 0) { toast.error('Tidak ada data untuk diekspor'); return }
    const header = ['Nama Tamu', 'Pesan', 'Status', 'Waktu']
    const rows = filtered.map(w => [
      w.guest_name,
      w.message,
      STATUS_CONFIG[w.status]?.label || w.status,
      new Date(w.created_at).toLocaleString('id-ID'),
    ])
    const csv = [header, ...rows]
      .map(cols => cols.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pesan-undangan-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diekspor')
  }

  const toggleStatus = async (id: string) => {
    const wish = wishes.find(w => w.id === id)
    if (!wish) return

    const newStatus = wish.status === 'visible' ? 'hidden' : 'visible'
    
    // Update local state first for immediate UI feedback
    setWishes(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w))

    try {
      const supabase = createClient()
      const { error } = await supabase.from('wishes').update({ status: newStatus }).eq('id', id)
      
      if (error) {
        // Revert on error
        setWishes(prev => prev.map(w => w.id === id ? { ...w, status: wish.status } : w))
        throw error
      }
      toast.success(newStatus === 'visible' ? 'Pesan ditampilkan' : 'Pesan disembunyikan')
    } catch (err) {
      console.error(err)
      toast.error('Gagal memperbarui status')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Pesan & Buku Tamu</h1>
          <p style={{ fontSize: 14, color: '#888' }}>Moderasi dan kelola ucapan dari para tamu undangan Anda.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleExport} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            border: '1.5px solid #f0f0f0', borderRadius: 100, padding: '10px 20px',
            fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer', background: 'white',
          }}>
            <Download size={15} /> Ekspor Data
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <InvitationSwitcher invitations={invitations} selectedInvId={selectedInvId} onChange={selectInvitation} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #f5f5f5' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '12px 24px', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, background: 'transparent',
            color: activeTab === tab ? '#E8627A' : '#888',
            borderBottom: activeTab === tab ? '2px solid #E8627A' : '2px solid transparent',
            marginBottom: -2, transition: 'all 0.2s',
          }}>
            {tab}
            {tab === 'Menunggu Moderasi' && wishes.filter(w => w.status === 'pending').length > 0 && (
              <span style={{
                marginLeft: 8, background: '#F59E0B', color: 'white',
                borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {wishes.filter(w => w.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', overflow: 'hidden', marginTop: 24 }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr style={{ background: '#FAFAFA', borderBottom: '1.5px solid #f5f5f5' }}>
              {['TAMU', 'PESAN', 'WAKTU', 'STATUS', 'AKSI'].map(h => (
                <th key={h} style={{ padding: '14px 16px', fontSize: 11, color: '#aaa', fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                  <p style={{ marginBottom: 16 }}>Belum ada pesan yang diterima.</p>
                </td>
              </tr>
            )}
            {paged.map((wish, i) => {
              const statusConf = STATUS_CONFIG[wish.status] || STATUS_CONFIG.pending
              return (
                <motion.tr key={wish.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid #fafafa' }}
                >
                  <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: '#EEF2FF', color: '#6366F1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, flexShrink: 0,
                      }}>
                        {wish.guest_name.substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', whiteSpace: 'nowrap' }}>{wish.guest_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: 300 }}>
                    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {wish.message}
                    </p>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>{new Date(wish.created_at).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100,
                      background: statusConf.bg, color: statusConf.color,
                    }}>
                      {statusConf.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => toggleStatus(wish.id)}
                      style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        color: wish.status === 'hidden' ? '#E8627A' : '#C44A62',
                        fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {wish.status === 'visible' ? <><EyeOff size={13} /> Sembunyikan</> : <><Eye size={13} /> Tampilkan</>}
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        </div>

        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>
            Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} pesan
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #f0f0f0', background: 'white', fontWeight: 600, fontSize: 12, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#ccc' : '#666' }}>Sebelumnya</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 16px', borderRadius: 8, background: currentPage === totalPages ? '#f0f0f0' : '#E8627A', border: 'none', color: currentPage === totalPages ? '#aaa' : 'white', fontWeight: 600, fontSize: 12, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  )
}
