'use client'

import { useState } from 'react'
import { Check, X, ExternalLink, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  amount: number
  status: string
  proof_url: string | null
  created_at: string
  profiles?: { id: string; name: string; email: string } | { id: string; name: string; email: string }[] | null
}

const STATUS_STYLE: Record<string, { bg: string; label: string }> = {
  pending: { bg: '#F59E0B', label: 'PENDING' },
  paid: { bg: '#10B981', label: 'PAID' },
  rejected: { bg: '#EF4444', label: 'REJECTED' },
}

const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function TransactionsTable({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const getProfile = (tx: Transaction) => {
    const p = tx.profiles as any
    return Array.isArray(p) ? p[0] : p
  }

  const handleAction = async (tx: Transaction, action: 'approve' | 'reject') => {
    setProcessingId(tx.id)
    try {
      const res = await fetch('/api/admin/transactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tx.id, action }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Gagal memproses transaksi')

      const newStatus = action === 'approve' ? 'paid' : 'rejected'
      setTransactions(prev => prev.map(t => (t.id === tx.id ? { ...t, status: newStatus } : t)))
      toast.success(action === 'approve' ? 'Transaksi disetujui, paket Premium aktif 90 hari.' : 'Transaksi ditolak.')
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses transaksi')
    } finally {
      setProcessingId(null)
    }
  }

  const ActionButtons = ({ tx }: { tx: Transaction }) =>
    tx.status === 'pending' ? (
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => handleAction(tx, 'approve')}
          disabled={processingId === tx.id}
          style={{ background: '#10B98115', color: '#10B981', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: processingId === tx.id ? 0.5 : 1 }}
          title="Setujui & Aktifkan Premium"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => handleAction(tx, 'reject')}
          disabled={processingId === tx.id}
          style={{ background: '#EF444415', color: '#EF4444', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: processingId === tx.id ? 0.5 : 1 }}
          title="Tolak Pembayaran"
        >
          <X size={16} />
        </button>
      </div>
    ) : (
      <span style={{ fontSize: 12, color: '#cbd5e1' }}>Sudah diproses</span>
    )

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
        <CreditCard size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
        <p className="text-sm">Belum ada transaksi pembayaran.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop: tabel */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                {['Pengguna', 'Tanggal', 'Nominal', 'Bukti', 'Status', 'Aksi'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => {
                const profile = getProfile(tx)
                const st = STATUS_STYLE[tx.status] || STATUS_STYLE.pending
                return (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{profile?.name || 'Unknown'}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{profile?.email}</div>
                    </td>
                    <td style={{ padding: 16, fontSize: 13, color: '#64748b' }}>{formatDate(tx.created_at)}</td>
                    <td style={{ padding: 16, fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{formatRupiah(tx.amount)}</td>
                    <td style={{ padding: 16 }}>
                      {tx.proof_url ? (
                        <a href={tx.proof_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '6px 12px', borderRadius: 8 }}>
                          <ExternalLink size={14} /> Buka Gambar
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: '#cbd5e1' }}>Tanpa Bukti</span>
                      )}
                    </td>
                    <td style={{ padding: 16 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: st.bg, color: 'white' }}>{st.label}</span>
                    </td>
                    <td style={{ padding: 16 }}><ActionButtons tx={tx} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: kartu */}
      <div className="md:hidden flex flex-col gap-4">
        {transactions.map(tx => {
          const profile = getProfile(tx)
          const st = STATUS_STYLE[tx.status] || STATUS_STYLE.pending
          return (
            <div key={tx.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{profile?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 12, color: '#64748b', wordBreak: 'break-all' }}>{profile?.email}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, background: st.bg, color: 'white', flexShrink: 0 }}>{st.label}</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{formatDate(tx.created_at)}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>{formatRupiah(tx.amount)}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {tx.proof_url ? (
                  <a href={tx.proof_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '8px 14px', borderRadius: 8 }}>
                    <ExternalLink size={14} /> Lihat Bukti
                  </a>
                ) : (
                  <span style={{ fontSize: 12, color: '#cbd5e1' }}>Tanpa bukti transfer</span>
                )}
                <ActionButtons tx={tx} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
