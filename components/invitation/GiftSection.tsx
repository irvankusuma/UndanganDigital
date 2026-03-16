'use client'

import { motion } from 'framer-motion'
import { Gift, Check } from 'lucide-react'

interface GiftSectionProps {
  giftAccounts: any[]
  copiedGift: string | null
  onCopy: (acc: string) => void
  colorHex: string
  tFont: string
}

export function GiftSection({ giftAccounts, copiedGift, onCopy, colorHex, tFont }: GiftSectionProps) {
  if (!giftAccounts || giftAccounts.length === 0) return null

  return (
    <section style={{ padding: '80px 24px', background: `${colorHex}05`, textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div style={{ 
          width: 56, height: 56, borderRadius: '50%', background: `${colorHex}15`, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: colorHex 
        }}>
          <Gift size={24} />
        </div>
        <p style={{ fontSize: 11, letterSpacing: 4, color: colorHex, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Kado Digital</p>
        <h2 style={{ fontFamily: tFont, fontSize: 32, color: '#1a1a1a', marginBottom: 20 }}>Tanda Kasih</h2>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Doa restu Anda merupakan karunia terindah. Namun jika ingin memberikan tanda kasih, Anda dapat melalui:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400, margin: '0 auto' }}>
          {giftAccounts.map((acc, i) => (
            <div key={i} style={{ 
              background: 'white', borderRadius: 20, padding: 24, 
              border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: colorHex, marginBottom: 8, letterSpacing: 2 }}>{acc.bank_name}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{acc.account_number}</div>
              <div style={{ fontSize: 13, color: '#888', fontWeight: 600, marginBottom: 20 }}>A.N. {acc.account_name}</div>
              <button 
                onClick={() => onCopy(acc.account_number)}
                style={{ 
                  width: '100%', padding: '12px', borderRadius: 12, background: copiedGift === acc.account_number ? '#10B981' : '#f5f5f5',
                  border: 'none', color: copiedGift === acc.account_number ? 'white' : '#444', 
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 
                }}
              >
                {copiedGift === acc.account_number ? <><Check size={16} /> Berhasil Disalin</> : 'Salin Nomor Rekening'}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
