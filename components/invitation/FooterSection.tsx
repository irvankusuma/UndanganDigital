'use client'

import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'

interface FooterSectionProps {
  inv: any
  colorHex: string
  tFont: string
}

export function FooterSection({ inv, colorHex, tFont }: FooterSectionProps) {
  return (
    <footer style={{ padding: '100px 24px', background: '#ffffff', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Elegant Closing Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 80 }}
        >
          <div style={{ width: 40, height: 1, background: colorHex, margin: '0 auto 24px', opacity: 0.3 }} />
          <p style={{ 
            fontFamily: tFont, 
            fontSize: 'clamp(24px, 4vw, 32px)', 
            color: '#1a1a1a', 
            marginBottom: 16,
            fontStyle: 'italic'
          }}>
            Sampai Jumpa di Hari Bahagia Kami
          </p>
          <p style={{ color: '#666', fontSize: 14, lineHeight: 1.8, maxWidth: 460, margin: '0 auto' }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i dapat hadir dan memberikan doa restu bagi kami.
          </p>
          <div style={{ width: 40, height: 1, background: colorHex, margin: '24px auto 0', opacity: 0.3 }} />
        </motion.div>

        {/* Minimalist Single-Line Footer */}
        <div style={{ 
          paddingTop: 40, 
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8
        }}>
          <p style={{ 
            fontSize: 10, 
            color: '#aaa', 
            letterSpacing: 1, 
            textTransform: 'uppercase',
            fontWeight: 500,
            margin: 0
          }}>
            Created with Love by <span style={{ fontWeight: 800, color: '#888' }}>Eternal Invite</span> &copy; 2024 eternalinvite.com
          </p>
        </div>
      </div>
    </footer>
  )
}
