'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, ExternalLink, ShieldAlert, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id, amount, status, proof_url, created_at,
          profiles:user_id ( id, name, email )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error: any) {
      toast.error('Gagal mengambil data transaksi.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject', userId: string) => {
    const loadingToast = toast.loading('Memproses...')
    try {
      const supabase = createClient()
      
      const newStatus = action === 'approve' ? 'paid' : 'rejected'
      
      // Update transaction status
      const { error: txError } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', id)

      if (txError) throw txError

      // If approved, update user plan
      if (action === 'approve') {
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 Month Pro Plan

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            plan: 'pro',
            plan_expires_at: expiresAt.toISOString()
          })
          .eq('id', userId)

        if (profileError) throw profileError
      }

      toast.success(action === 'approve' ? 'Transaksi disetujui, Paket Pro aktif.' : 'Transaksi ditolak.', { id: loadingToast })
      fetchTransactions() // Reload data
      
    } catch (error: any) {
      toast.error('Gagal memproses transaksi.', { id: loadingToast })
      console.error(error)
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Memuat data...</div>

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FEF2F2', borderRadius: 100, padding: '6px 16px',
          marginBottom: 12, fontSize: 12, color: '#EF4444', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1
        }}>
          <ShieldAlert size={14} /> Admin Area
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>
          Kelola Transaksi
        </h1>
        <p style={{ fontSize: 15, color: '#64748b' }}>
          Tinjau bukti transfer pembayaran QRIS dan aktifkan paket Pro pengguna.
        </p>
      </div>

      <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {['Pengguna', 'Tanggal', 'Nominal', 'Bukti', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8', fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{tx.profiles?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{tx.profiles?.email}</div>
                </td>
                <td style={{ padding: '16px', fontSize: 13, color: '#64748b' }}>
                  {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
                  Rp 30.000
                </td>
                <td style={{ padding: '16px' }}>
                  {tx.proof_url ? (
                    <a href={tx.proof_url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '6px 12px', borderRadius: 8 }}>
                      <ExternalLink size={14} /> Buka Gambar
                    </a>
                  ) : (
                    <span style={{ fontSize: 12, color: '#cbd5e1' }}>Tanpa Bukti</span>
                  )}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase',
                    background: tx.status === 'paid' ? '#10B981' : tx.status === 'rejected' ? '#EF4444' : '#F59E0B',
                    color: 'white'
                  }}>
                    {tx.status}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  {tx.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        onClick={() => handleAction(tx.id, 'approve', tx.profiles.id)}
                        style={{ background: '#10B98115', color: '#10B981', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Setujui & Aktifkan Pro"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleAction(tx.id, 'reject', tx.profiles.id)}
                        style={{ background: '#EF444415', color: '#EF4444', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Tolak Pembayaran"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                  <CreditCard size={32} style={{ opacity: 0.2, margin: '0 auto 12px' }} />
                  <p style={{ fontSize: 14 }}>Belum ada transaksi pembayaran.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
