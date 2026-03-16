'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Invitation } from '@/types'

interface CoupleSectionProps {
  inv: Invitation
  colorHex: string
  tFont: string
}

export function CoupleSection({ inv, colorHex, tFont }: CoupleSectionProps) {
  return (
    <section style={{ padding: '100px 24px', background: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle decoration */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        height: '1px',
        background: `linear-gradient(to right, transparent, ${colorHex}20, transparent)`,
        zIndex: 0
      }} />

      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div style={{ 
            marginBottom: 64, 
            color: '#666', 
            fontSize: 15, 
            lineHeight: 1.8,
            fontStyle: 'italic',
            padding: '0 20px',
            maxWidth: 600,
            margin: '0 auto 64px'
          }}>
            <span style={{ fontSize: 24, color: colorHex, display: 'block', marginBottom: 16 }}>"</span>
            Maha suci Allah yang telah menciptakan mahluk-Nya berpasang-pasangan. Ya Allah, perkenankanlah kami merangkaikan kasih sayang yang Kau ciptakan di antara kami.
            <span style={{ fontSize: 24, color: colorHex, display: 'block', marginTop: 16 }}>"</span>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 60 
          }}>
            {/* Bride */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                width: 200, height: 200, borderRadius: '50%', border: `1.5px solid ${colorHex}30`,
                padding: 12, margin: '0 auto 32px',
                position: 'relative'
              }}>
                <div style={{ 
                  width: '100%', height: '100%', borderRadius: '50%', 
                  background: `linear-gradient(135deg, ${colorHex}10, ${colorHex}20)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
                  boxShadow: `0 20px 40px ${colorHex}10`
                }}>👰</div>
              </div>
              <h3 style={{ 
                fontFamily: tFont, 
                fontSize: 'clamp(32px, 6vw, 44px)', 
                fontWeight: 700, 
                color: '#1a1a1a', 
                marginBottom: 12 
              }}>
                {inv.bride_name}
              </h3>
              <p style={{ fontSize: 11, color: colorHex, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Putri tercinta dari:</p>
              <p style={{ fontSize: 16, color: '#555', fontWeight: 500 }}>
                {inv.bride_father_name && inv.bride_mother_name 
                  ? `Bapak ${inv.bride_father_name} & Ibu ${inv.bride_mother_name}`
                  : `Bapak ${inv.bride_father_name || '...'} & Ibu ${inv.bride_mother_name || '...'}`}
              </p>
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={40} color={colorHex} fill={colorHex} style={{ opacity: 0.8 }} />
            </motion.div>

            {/* Groom */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                width: 200, height: 200, borderRadius: '50%', border: `1.5px solid ${colorHex}30`,
                padding: 12, margin: '0 auto 32px'
              }}>
                <div style={{ 
                   width: '100%', height: '100%', borderRadius: '50%', 
                   background: `linear-gradient(135deg, ${colorHex}10, ${colorHex}20)`,
                   display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64,
                   boxShadow: `0 20px 40px ${colorHex}10`
                }}>🤵</div>
              </div>
              <h3 style={{ 
                fontFamily: tFont, 
                fontSize: 'clamp(32px, 6vw, 44px)', 
                fontWeight: 700, 
                color: '#1a1a1a', 
                marginBottom: 12 
              }}>
                {inv.groom_name}
              </h3>
              <p style={{ fontSize: 11, color: colorHex, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>Putra tercinta dari:</p>
              <p style={{ fontSize: 16, color: '#555', fontWeight: 500 }}>
                {inv.groom_father_name && inv.groom_mother_name 
                  ? `Bapak ${inv.groom_father_name} & Ibu ${inv.groom_mother_name}`
                  : `Bapak ${inv.groom_father_name || '...'} & Ibu ${inv.groom_mother_name || '...'}`}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
