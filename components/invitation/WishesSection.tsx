'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageSquareHeart, Loader } from 'lucide-react'
import { Wish } from '@/types'

interface WishesSectionProps {
  wishes: Wish[]
  colorHex: string
  tFont: string
  onSubmitWish?: (name: string, message: string) => Promise<boolean>
}

export function WishesSection({ wishes, colorHex, tFont, onSubmitWish }: WishesSectionProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmitWish || sending) return
    setSending(true)
    const ok = await onSubmitWish(name, message)
    setSending(false)
    if (ok) {
      setName('')
      setMessage('')
      setSent(true)
      setTimeout(() => setSent(false), 5000)
    }
  }

  return (
    <section style={{ padding: '100px 24px', background: '#fefefe' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ 
            width: 50, height: 50, borderRadius: '50%', background: `${colorHex}10`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            color: colorHex
          }}>
            <MessageSquareHeart size={24} />
          </div>
          <p style={{ fontSize: 12, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Buku Tamu</p>
          <h2 style={{ fontFamily: tFont, fontSize: 'clamp(32px, 5vw, 40px)', color: '#1a1a1a', marginBottom: 16 }}>Ucapan & Doa Restu</h2>
          <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>Doa restu Anda untuk kedua mempelai di hari yang bahagia ini.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }}>
          {/* Form Ucapan */}
          {onSubmitWish && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                background: 'white', padding: 28, borderRadius: 24,
                border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                display: 'flex', flexDirection: 'column', gap: 16,
              }}
            >
              <h3 style={{ fontFamily: tFont, fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Tulis Ucapan & Doa</h3>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama Anda"
                className="input-wish"
                required
                maxLength={80}
              />
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tuliskan ucapan & doa terbaik untuk kedua mempelai..."
                className="input-wish"
                rows={4}
                style={{ resize: 'none' }}
                required
                maxLength={500}
              />
              <button
                type="submit"
                disabled={sending}
                className="btn-wish"
                style={{
                  background: `linear-gradient(135deg, ${colorHex}, ${colorHex}dd)`,
                  color: 'white', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  opacity: sending ? 0.7 : 1, cursor: sending ? 'not-allowed' : 'pointer',
                }}
              >
                {sending ? <><Loader size={18} className="animate-spin" /> Mengirim...</> : <>Kirim Ucapan <Send size={18} /></>}
              </button>
              {sent && (
                <p style={{ fontSize: 13, color: '#10B981', fontWeight: 600, margin: 0, textAlign: 'center' }}>
                  Terima kasih! Ucapan Anda terkirim dan sedang menunggu moderasi.
                </p>
              )}
              <p style={{ fontSize: 12, color: '#aaa', margin: 0, textAlign: 'center' }}>
                Ucapan akan tampil setelah disetujui oleh pemilik undangan.
              </p>
            </motion.form>
          )}

          {/* Wishes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxHeight: 600, overflowY: 'auto', paddingRight: 10 }} className="custom-scrollbar">
            {wishes.map((w, i) => (
              <motion.div 
                key={w.id || i} 
                initial={{ opacity: 0, scale: 0.95 }} 
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{ 
                  background: 'white', 
                  padding: 24, 
                  borderRadius: 24, 
                  border: '1px solid #f5f5f5', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 40, height: 40, borderRadius: '50%', background: `${colorHex}15`, 
                      color: colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 16
                    }}>
                      {w.guest_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', margin: 0 }}>{w.guest_name}</h4>
                      <span style={{ fontSize: 11, color: '#aaa', fontWeight: 500 }}>{new Date(w.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, margin: 0 }}>{w.message}</p>
              </motion.div>
            ))}
            {wishes.length === 0 && (
              <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14, padding: '60px 0' }}>
                <MessageSquareHeart size={48} style={{ opacity: 0.2, marginBottom: 16, margin: '0 auto' }} />
                <p>Belum ada ucapan. <br />Jadilah yang pertama memberikan doa restu!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-wish {
          width: 100%; padding: 16px 20px; border: 1px solid #eee; border-radius: 16px;
          font-size: 15px; outline: none; transition: all 0.2s; background: #fafafa;
        }
        .input-wish:focus { 
          border-color: ${colorHex}; 
          background: white;
          box-shadow: 0 0 0 4px ${colorHex}10;
        }
        .btn-wish {
          padding: 18px; border: none; border-radius: 16px;
          font-size: 15px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-wish:hover { 
          opacity: 0.95; 
          transform: translateY(-2px);
          box-shadow: 0 15px 30px ${colorHex}30;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ddd; }
      `}</style>
    </section>
  )
}
