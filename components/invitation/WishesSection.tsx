'use client'

import { motion } from 'framer-motion'
import { Send, MessageSquareHeart } from 'lucide-react'
import { Wish } from '@/types'

interface WishesSectionProps {
  wishes: Wish[]
  colorHex: string
  tFont: string
}

export function WishesSection({ wishes, colorHex, tFont }: WishesSectionProps) {
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
                      {w.guest_name.charAt(0).toUpperCase()}
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
