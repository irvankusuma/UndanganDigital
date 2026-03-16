'use client'

import { motion } from 'framer-motion'
import { Edit2, Trash2, Plus } from 'lucide-react'

const CAT_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  family: { label: 'KELUARGA', color: '#6366F1', bg: '#EEF2FF' },
  friend: { label: 'TEMAN', color: '#10B981', bg: '#ECFDF5' },
  coworker: { label: 'TEMAN KANTOR', color: '#F59E0B', bg: '#FFFBEB' },
  vip: { label: 'VIP', color: '#E8627A', bg: '#FDE8ED' },
  other: { label: 'LAINNYA', color: '#6B7280', bg: '#F3F4F6' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  attending: { label: 'Hadir', color: '#10B981' },
  not_attending: { label: 'Berhalangan', color: '#EF4444' },
  pending: { label: 'Belum Konfirmasi', color: '#F59E0B' },
}

interface TamuTableProps {
  guests: any[]
  loading: boolean
  onEdit: (g: any) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function TamuTable({ guests, loading, onEdit, onDelete, onAdd }: TamuTableProps) {
  return (
    <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1.5px solid #f0f0f0', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #f5f5f5', background: '#FAFAFA' }}>
            {['NAMA TAMU', 'KATEGORI', 'JUMLAH', 'STATUS HADIR', 'AKSI'].map(h => (
              <th key={h} style={{ padding: '14px 16px', fontSize: 11, color: '#aaa', fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!loading && guests.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                <p style={{ marginBottom: 16 }}>Belum ada tamu yang ditemukan.</p>
                <button onClick={onAdd} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={14} /> Tambah Tamu
                </button>
              </td>
            </tr>
          )}
          {guests.map((guest, i) => {
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
                      width: 36, height: 36, borderRadius: '50%',
                      background: '#EEF2FF', color: '#6366F1',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {guest.guest_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{guest.guest_name}</div>
                      <div style={{ fontSize: 12, color: '#aaa' }}>{guest.phone || '-'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100, background: cat.bg, color: cat.color, letterSpacing: 1 }}>
                    {cat.label}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{guest.guest_count}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: status.color }} />
                    <span style={{ fontSize: 13, color: status.color, fontWeight: 600 }}>{status.label}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onEdit(guest)} style={{
                      width: 32, height: 32, borderRadius: 8, background: '#f5f5f5',
                      border: 'none', cursor: 'pointer', color: '#666',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => onDelete(guest.id)} style={{
                      width: 32, height: 32, borderRadius: 8, background: '#FEF2F2',
                      border: 'none', cursor: 'pointer', color: '#EF4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination Placeholder */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f5f5f5' }}>
        <span style={{ fontSize: 12, color: '#aaa' }}>Menampilkan {guests.length} tamu</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {['<', 1, 2, 3, '>'].map((n, i) => (
            <button key={i} style={{
              width: 32, height: 32, borderRadius: 8, border: n === 1 ? 'none' : '1px solid #f0f0f0',
              background: n === 1 ? '#E8627A' : 'white', color: n === 1 ? 'white' : '#666',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
